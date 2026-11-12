// PayPal REST client (sandbox). Three rails are used, each for a different job:
//
//   Orders v2   — the buyer pays the insurance premium (human-approved checkout)
//   Payouts v1  — the AI agent pays the vendor, and the underwriting pool pays claims
//                 (server-to-server: no human in the loop, which is the point)
//   Payouts GET — read back who PayPal ACTUALLY paid. This is the breach oracle:
//                 the agent's own account of what it did is never trusted.
import { requireEnv } from "./env.mjs";

export const API = "https://api-m.sandbox.paypal.com";
let cached = { token: null, exp: 0 };

async function token() {
  if (cached.token && Date.now() < cached.exp) return cached.token;
  const id = requireEnv("PAYPAL_CLIENT_ID"), secret = requireEnv("PAYPAL_CLIENT_SECRET");
  const res = await fetch(`${API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
      "content-type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.access_token) throw new Error(`PayPal OAuth ${res.status}: ${JSON.stringify(j).slice(0, 300)}`);
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in - 60) * 1000 };
  return cached.token;
}

async function call(method, path, body, extraHeaders = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${await token()}`,
      "content-type": "application/json",
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let j; try { j = text ? JSON.parse(text) : {}; } catch { j = { raw: text }; }
  if (!res.ok) {
    // Fail loudly with PayPal's own error name — "PayPal is broken" and
    // "nothing happened" must never look the same in the dashboard.
    const err = new Error(`PayPal ${method} ${path} → ${res.status} ${j.name ?? ""}: ${j.message ?? text.slice(0, 200)}`);
    err.paypal = j; err.status = res.status;
    throw err;
  }
  return j;
}

const money = (cents) => ({ currency_code: "USD", value: (cents / 100).toFixed(2) });

// ---------------------------------------------------------------- Orders v2

export function createPremiumOrder({ cents, policyRef, description }) {
  return call("POST", "/v2/checkout/orders", {
    intent: "CAPTURE",
    purchase_units: [{
      reference_id: policyRef,
      description: description.slice(0, 127),
      amount: money(cents),
    }],
  }, { "PayPal-Request-Id": `premium-${policyRef}` });
}

export async function capturePremiumOrder(orderId) {
  const j = await call("POST", `/v2/checkout/orders/${orderId}/capture`, {});
  const cap = j.purchase_units?.[0]?.payments?.captures?.[0];
  if (j.status !== "COMPLETED" || !cap) throw new Error(`Premium capture not completed: status ${j.status}`);
  return {
    orderId: j.id,
    captureId: cap.id,
    cents: Math.round(Number(cap.amount.value) * 100),
    payerEmail: j.payer?.email_address,
    payerId: j.payer?.payer_id,
    payerName: [j.payer?.name?.given_name, j.payer?.name?.surname].filter(Boolean).join(" "),
  };
}

// ---------------------------------------------------------------- Payouts v1

export async function sendPayout({ cents, email, payerId, note, batchId }) {
  const j = await call("POST", "/v1/payments/payouts", {
    sender_batch_header: {
      sender_batch_id: batchId,
      email_subject: "You have a payment",
      email_message: note.slice(0, 255),
    },
    items: [{
      recipient_type: email ? "EMAIL" : "PAYPAL_ID",
      amount: { currency: "USD", value: (cents / 100).toFixed(2) },
      receiver: email ?? payerId,
      note: note.slice(0, 4000),
      sender_item_id: `${batchId}-1`,
    }],
  });
  return { batchId: j.batch_header?.payout_batch_id, status: j.batch_header?.batch_status };
}

/// Ask PayPal who actually received the money. Polls briefly because a new
/// batch can report no items for a moment. Returns the receiver as PayPal
/// recorded it — this, not the agent's self-report, decides breach.
export async function readPayout(batchId, { tries = 8 } = {}) {
  let last;
  for (let i = 0; i < tries; i++) {
    last = await call("GET", `/v1/payments/payouts/${batchId}`);
    const item = last.items?.[0];
    if (item?.payout_item?.receiver) {
      return {
        batchId,
        batchStatus: last.batch_header?.batch_status,
        receiver: item.payout_item.receiver,
        cents: Math.round(Number(item.payout_item.amount.value) * 100),
        transactionStatus: item.transaction_status,
        itemId: item.payout_item_id,
      };
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error(`Payout ${batchId} has no readable receiver after ${tries} reads (status ${last?.batch_header?.batch_status})`);
}
