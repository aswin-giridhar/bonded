// Dashboard server — zero dependencies (node:http). Serves the UI, the PayPal
// premium checkout endpoints, and an SSE feed of each insured job as it runs.
import "./env.mjs";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import * as P from "./pricing.mjs";
import * as PP from "./paypal.mjs";
import { AGENTS, MODEL, makeListing, adjusterNote } from "./agents.mjs";

const PORT = Number(process.env.PORT ?? 4173);
const COVER = 4000; // insure the $40.00 order

// The vendor of record and the attacker's address planted in the listing.
// Neither is a real account: PayPal holds payouts to unregistered emails as
// UNCLAIMED, which is exactly enough to read back who was paid.
const VENDOR = process.env.VENDOR_EMAIL ?? "billing@northwind-compute.example";
const ATTACKER = process.env.ATTACKER_EMAIL ?? "treasury@northwind-payments.example";
const LISTING = makeListing({ vendorEmail: VENDOR, attackerEmail: ATTACKER });

// ------------------------------------------------------------------ the book

const book = P.createBook();
P.depositReinsurance(book, 100_000);                     // $1,000 shared book
for (const [id, a] of Object.entries(AGENTS)) {
  P.registerAgent(book, id, { label: a.label, modelFamily: MODEL });
  P.underwrite(book, id, "Underwriter A", 30_000);      // $300
  P.underwrite(book, id, "Underwriter B", 20_000);      // $200
}

const emit = (...a) => emitRaw(...a);
const pending = new Map(); // PayPal orderId -> { agentId, premium, quoteBps }
const events = [];
const clients = new Set();

function emitRaw(type, message, data = {}) {
  const ev = { type, message, data, at: Date.now() };
  events.push(ev);
  const line = `data: ${JSON.stringify(ev)}\n\n`;
  for (const res of clients) res.write(line);
  console.log(`[${type}] ${message}`);
}

function snapshot() {
  return {
    model: MODEL,
    cover: COVER,
    vendor: VENDOR,
    listing: LISTING,
    bookCapital: book.bookCapital,
    bookExposure: book.bookExposure,
    agents: Object.values(book.agents).map((a) => {
      let quote = null, error = null;
      try { quote = P.rate(book, a.id, COVER); } catch (e) { error = e.message; }
      return { id: a.id, label: a.label, pool: a.pool, exposure: a.exposure, trials: a.trials,
        failures: a.failures, stakes: a.stakes, quote, error };
    }),
    policies: book.policies,
  };
}

// --------------------------------------------------------------- the job run

const fmt = (c) => `$${(c / 100).toFixed(2)}`;

async function runInsuredJob(policy) {
  const agent = AGENTS[policy.agentId];
  const emit = (type, message, data = {}) => emitRaw(type, message, { agentId: policy.agentId, ...data });
  emit("agent-run", `${agent.label} is reading the vendor listing and paying for ${LISTING.item}.`, { policyId: policy.id });

  const decision = await agent.run(LISTING);
  emit("agent-decision",
    decision.recipient.toLowerCase() === VENDOR.toLowerCase()
      ? `${agent.label} chose ${decision.recipient}${decision.flagged ? " and flagged the redirection attempt" : ""}.`
      : `${agent.label} chose ${decision.recipient}, not the insured payee.`,
    { policyId: policy.id, ...decision, model: MODEL });

  // The agent acts: a real PayPal Payout, server-to-server, no human approval.
  const pay = await PP.sendPayout({
    cents: LISTING.priceCents, email: decision.recipient,
    note: `${LISTING.item}, paid by ${agent.label}`, batchId: `job-${policy.id}-${Date.now()}`,
  });
  emit("payout", `Agent paid ${fmt(LISTING.priceCents)} through PayPal Payouts (batch ${pay.batchId}).`, { policyId: policy.id, ...pay });

  // Settlement reads the truth from PayPal, not from the agent.
  const seen = await PP.readPayout(pay.batchId);
  emit("readback", `PayPal's record: ${fmt(seen.cents)} went to ${seen.receiver}.`, { policyId: policy.id, ...seen });

  const result = P.settle(book, policy.id, seen.receiver);
  if (result.breached) {
    emit("breach", `PayPal shows the money went to ${seen.receiver}, not ${VENDOR}. Underwriting pool pays ${fmt(result.fromPool)}, reinsurance pays ${fmt(result.fromBook)}.`,
      { policyId: policy.id, actual: seen.receiver, ...result });
    const claim = await PP.sendPayout({
      cents: result.payout, email: policy.beneficiary,
      note: `Bonded claim on policy #${policy.id}: ${agent.label} paid the wrong party.`,
      batchId: `claim-${policy.id}-${Date.now()}`,
    });
    const claimSeen = await PP.readPayout(claim.batchId);
    policy.claim = { ...claimSeen, cents: result.payout };
    emit("claim", `Claim of ${fmt(claimSeen.cents)} paid to the buyer (${claimSeen.receiver}) through PayPal Payouts (batch ${claim.batchId}).`,
      { policyId: policy.id, ...claimSeen });
  } else {
    emit("clean", `PayPal confirms the insured payee was paid. The premium stays with the underwriters.`, { policyId: policy.id });
  }

  const note = await adjusterNote({
    agentLabel: agent.label, expected: VENDOR, actual: seen.receiver,
    breached: result.breached, agentReason: decision.reason ?? "",
  });
  policy.adjuster = note;
  emit("adjuster", note.text, { policyId: policy.id, model: note.model });

  const q = P.rate(book, policy.agentId, COVER);
  emit("requote", `${agent.label} re-priced to ${(q.bps / 100).toFixed(2)}% (was ${(policy.rateBps / 100).toFixed(2)}%).`,
    { policyId: policy.id, agentId: policy.agentId, before: policy.rateBps, after: q.bps });
  emit("state", "book updated", snapshot());
}

// ------------------------------------------------------------------- routes

async function body(req) {
  let s = ""; for await (const c of req) s += c;
  return s ? JSON.parse(s) : {};
}
const json = (res, code, obj) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(obj)); };

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://x");
    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      return res.end(readFileSync(new URL("../public/index.html", import.meta.url)));
    }
    if (url.pathname === "/api/config") return json(res, 200, { clientId: process.env.PAYPAL_CLIENT_ID ?? null });
    if (url.pathname === "/api/state") return json(res, 200, snapshot());
    if (url.pathname === "/api/events") {
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache", connection: "keep-alive" });
      for (const ev of events) res.write(`data: ${JSON.stringify(ev)}\n\n`);
      clients.add(res); req.on("close", () => clients.delete(res));
      return;
    }
    // Step 1: buyer asks to insure a job with a given agent → PayPal order for the premium.
    if (req.method === "POST" && url.pathname === "/api/policy/order") {
      const { agentId } = await body(req);
      if (!AGENTS[agentId]) return json(res, 400, { error: "unknown agent" });
      const q = P.rate(book, agentId, COVER);
      const ref = `${agentId}-${Date.now()}`;
      const order = await PP.createPremiumOrder({
        cents: q.premium, policyRef: ref,
        description: `Bonded cover: ${fmt(COVER)} on ${AGENTS[agentId].label} at ${(q.bps / 100).toFixed(2)}%`,
      });
      pending.set(order.id, { agentId, premium: q.premium });
      emit("quote", `${AGENTS[agentId].label}: ${(q.bps / 100).toFixed(2)}% on ${fmt(COVER)}, premium ${fmt(q.premium)} (PayPal order ${order.id}).`, { agentId, ...q });
      return json(res, 200, { id: order.id });
    }
    // Step 2: buyer approved in PayPal → capture the premium, bind cover, run the job.
    if (req.method === "POST" && url.pathname === "/api/policy/capture") {
      const { orderId } = await body(req);
      const p = pending.get(orderId);
      if (!p) return json(res, 400, { error: "unknown order" });
      pending.delete(orderId);
      const cap = await PP.capturePremiumOrder(orderId);
      const policy = P.bind(book, p.agentId, {
        cover: COVER, expectedRecipient: VENDOR, premiumPaid: cap.cents, beneficiary: cap.payerEmail,
      });
      policy.premiumCapture = cap.captureId;
      emit("bound", `Premium ${fmt(cap.cents)} captured from ${cap.payerEmail} (capture ${cap.captureId}). Policy ${policy.id} covers ${fmt(COVER)} on ${AGENTS[p.agentId].label}.`,
        { policyId: policy.id, agentId: p.agentId, ...cap });
      emit("state", "book updated", snapshot());
      runInsuredJob(policy).catch((e) => emit("error", e.message, { policyId: policy.id, agentId: policy.agentId }));
      return json(res, 200, { policyId: policy.id });
    }
    json(res, 404, { error: "not found" });
  } catch (e) {
    emit("error", e.message);
    json(res, 500, { error: e.message });
  }
}).listen(PORT, () => console.log(`Bonded: http://localhost:${PORT}`));
