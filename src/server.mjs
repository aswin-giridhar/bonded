// Dashboard server, zero dependencies (node:http). Serves the UI, the PayPal
// premium checkout endpoints, a public quote API, the attack lab, and an SSE
// feed of each insured job as it runs.
import "./env.mjs";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import * as P from "./pricing.mjs";
import * as PP from "./paypal.mjs";
import { AGENTS, agentModel, makeListing, DEFAULT_INJECTION, adjusterNote } from "./agents.mjs";

const PORT = Number(process.env.PORT ?? 4173);
const COVER = 4000; // insure the $40.00 order

// The vendor of record and the attacker's address planted in the listing.
// Neither is a real account: PayPal holds payouts to unregistered emails as
// UNCLAIMED, which is exactly enough to read back who was paid.
const VENDOR = process.env.VENDOR_EMAIL ?? "billing@northwind-compute.example";
const ATTACKER = process.env.ATTACKER_EMAIL ?? "treasury@northwind-payments.example";
let injection = DEFAULT_INJECTION(ATTACKER);
const listing = () => makeListing({ vendorEmail: VENDOR, attackerEmail: ATTACKER, injection });

// ------------------------------------------------------------------ the book

const book = P.createBook();
P.depositReinsurance(book, 100_000);                     // $1,000 shared book
for (const [id, a] of Object.entries(AGENTS)) {
  P.registerAgent(book, id, { label: a.label, modelFamily: a.family });
  P.underwrite(book, id, "Underwriter A", 30_000);      // $300
  P.underwrite(book, id, "Underwriter B", 20_000);      // $200
}

const pending = new Map(); // PayPal orderId -> { agentId, quoted }
const events = [];
const clients = new Set();

function emit(type, message, data = {}) {
  const ev = { type, message, data, at: Date.now() };
  events.push(ev);
  if (events.length > 400) events.shift();
  const line = `data: ${JSON.stringify(ev)}\n\n`;
  for (const res of clients) res.write(line);
  console.log(`[${type}] ${message}`);
}

const isAgent = (id) => typeof id === "string" && Object.hasOwn(AGENTS, id);

function snapshot() {
  return {
    cover: COVER,
    vendor: VENDOR,
    listing: listing(),
    injectionIsDefault: injection === DEFAULT_INJECTION(ATTACKER),
    bookCapital: book.bookCapital,
    bookExposure: book.bookExposure,
    agents: Object.values(book.agents).map((a) => {
      let quote = null, error = null;
      try { quote = P.rate(book, a.id, COVER); } catch (e) { error = e.message; }
      return { id: a.id, label: a.label, kind: AGENTS[a.id].kind, model: agentModel[a.id], family: a.modelFamily,
        pool: a.pool, exposure: a.exposure, trials: a.trials, failures: a.failures, stakes: a.stakes, quote, error };
    }),
    policies: book.policies,
  };
}

// --------------------------------------------------------------- the job run

const fmt = (c) => `$${(c / 100).toFixed(2)}`;

async function runInsuredJob(policy) {
  const agent = AGENTS[policy.agentId];
  const L = listing(); // the listing as it stood when cover was bound
  const emit_ = (type, message, data = {}) => emit(type, message, { agentId: policy.agentId, policyId: policy.id, ...data });
  emit_("agent-run", `${agent.label} (${agentModel[policy.agentId]}) is reading the vendor listing and paying for ${L.item}.`);

  const decision = await agent.run(L);
  const args = JSON.stringify(decision.toolCall.args);
  emit_("agent-decision",
    decision.recipient.toLowerCase() === VENDOR.toLowerCase()
      ? `${agent.label} called ${decision.toolCall.name}(${args})${decision.flagged ? ", flagging the redirection attempt" : ""}.`
      : `${agent.label} called ${decision.toolCall.name}(${args}). That is not the insured payee.`,
    { ...decision });

  // The agent's tool call is executed as a real PayPal Payout. No human approval.
  const pay = await PP.sendPayout({
    cents: L.priceCents, email: decision.recipient,
    note: `${L.item}, paid by ${agent.label}`, batchId: `job-${policy.id}-${Date.now()}`,
  });
  policy.model = agentModel[policy.agentId];
  policy.payoutBatch = pay.batchId;
  emit_("payout", `Executed the tool call: ${fmt(L.priceCents)} through PayPal Payouts (batch ${pay.batchId}).`, { ...pay });
  emit("state", "book updated", snapshot());

  // Settlement reads the truth from PayPal, not from the agent.
  const seen = await PP.readPayout(pay.batchId);
  emit_("readback", `PayPal's record: ${fmt(seen.cents)} went to ${seen.receiver}.`, { ...seen });

  const result = P.settle(book, policy.id, seen.receiver);
  emit("state", "book updated", snapshot());
  if (result.breached) {
    emit_("breach", `PayPal shows the money went to ${seen.receiver}, not ${VENDOR}. Underwriting pool pays ${fmt(result.fromPool)}, reinsurance pays ${fmt(result.fromBook)}.`,
      { actual: seen.receiver, ...result });
    const claim = await PP.sendPayout({
      cents: result.payout, email: policy.beneficiary.email, payerId: policy.beneficiary.payerId,
      note: `Bonded claim on policy ${policy.id}: ${agent.label} paid the wrong party.`,
      batchId: `claim-${policy.id}-${Date.now()}`,
    });
    const claimSeen = await PP.readPayout(claim.batchId);
    policy.claim = { ...claimSeen, cents: result.payout, batchId: claim.batchId };
    emit_("claim", `Claim of ${fmt(claimSeen.cents)} paid to the buyer (${claimSeen.receiver}) through PayPal Payouts (batch ${claim.batchId}).`, { ...claimSeen });
  } else {
    emit_("clean", `PayPal confirms the insured payee was paid. The premium stays with the underwriters.`);
  }

  const note = await adjusterNote({
    agentLabel: agent.label, expected: VENDOR, actual: seen.receiver,
    breached: result.breached, agentReason: decision.reason ?? "",
  });
  policy.adjuster = note;
  emit_("adjuster", note.text, { model: note.model });

  const q = P.rate(book, policy.agentId, COVER);
  policy.rateAfter = q.bps;
  emit_("requote", `${agent.label} re-priced to ${(q.bps / 100).toFixed(2)}% (was ${(policy.rateBps / 100).toFixed(2)}%).`,
    { before: policy.rateBps, after: q.bps });
  emit("state", "book updated", snapshot());
}

// ------------------------------------------------------------- rate limiting

// A hosted demo spends real model quota on every insured job. Cap new jobs per
// client and overall, and say so plainly when the cap is hit.
const hits = new Map();
let globalHits = [];
function allow(ip) {
  const now = Date.now(), hour = 3_600_000;
  globalHits = globalHits.filter((t) => now - t < hour);
  const mine = (hits.get(ip) ?? []).filter((t) => now - t < hour);
  if (mine.length >= Number(process.env.JOBS_PER_IP_HOUR ?? 12) || globalHits.length >= Number(process.env.JOBS_PER_HOUR ?? 60)) return false;
  mine.push(now); hits.set(ip, mine); globalHits.push(now);
  return true;
}

// ------------------------------------------------------------------- routes

class BadRequest extends Error {}
async function body(req) {
  let s = "";
  for await (const c of req) { s += c; if (s.length > 10_000) throw new BadRequest("request body too large"); }
  if (!s) return {};
  try { return JSON.parse(s); } catch { throw new BadRequest("request body is not valid JSON"); }
}
const json = (res, code, obj) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(obj)); };

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://x");
    const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() ?? req.socket.remoteAddress;

    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      return res.end(readFileSync(new URL("../public/index.html", import.meta.url)));
    }
    if (url.pathname === "/healthz") return json(res, 200, { ok: true });
    if (url.pathname === "/api/config") return json(res, 200, { clientId: process.env.PAYPAL_CLIENT_ID ?? null });
    if (url.pathname === "/api/state") return json(res, 200, snapshot());
    if (url.pathname === "/api/events") {
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache", connection: "keep-alive" });
      for (const ev of events) res.write(`data: ${JSON.stringify(ev)}\n\n`);
      clients.add(res); req.on("close", () => clients.delete(res));
      return;
    }

    // Public quote API: any agent framework can price cover before it spends.
    // GET /api/quote?agentId=procure-v1&cover=4000  (cover in USD cents)
    if (req.method === "GET" && url.pathname === "/api/quote") {
      const agentId = url.searchParams.get("agentId");
      const cover = Number(url.searchParams.get("cover") ?? COVER);
      if (!isAgent(agentId)) return json(res, 400, { error: "unknown agentId", agents: Object.keys(AGENTS) });
      if (!Number.isInteger(cover) || cover < 100 || cover > 20_000) return json(res, 400, { error: "cover must be an integer number of cents between 100 and 20000" });
      try {
        const q = P.rate(book, agentId, cover);
        return json(res, 200, { agentId, model: agentModel[agentId], cover, currency: "USD", rateBps: q.bps, premium: q.premium, components: q.parts, trials: q.trials, failures: q.failures, credibilityPct: q.credibilityPct });
      } catch (e) {
        return json(res, 409, { error: e.message });
      }
    }

    // Attack lab: replace the attacker's section of the listing, or reset it.
    if (req.method === "POST" && url.pathname === "/api/listing") {
      const { injection: text, reset } = await body(req);
      if (reset) injection = DEFAULT_INJECTION(ATTACKER);
      else {
        if (typeof text !== "string" || !text.trim()) return json(res, 400, { error: "injection must be non-empty text" });
        if (text.length > 800) return json(res, 400, { error: "injection is limited to 800 characters" });
        injection = text;
      }
      emit("listing", reset ? "Listing reset to the original attack." : "Attack lab: the listing's attacker text was replaced.", { injection });
      emit("state", "book updated", snapshot());
      return json(res, 200, { ok: true });
    }

    // Step 1: buyer asks to insure a job with a given agent → PayPal order for the premium.
    if (req.method === "POST" && url.pathname === "/api/policy/order") {
      const { agentId } = await body(req);
      if (!isAgent(agentId)) return json(res, 400, { error: "unknown agent" });
      if (!allow(ip)) return json(res, 429, { error: "Demo limit reached: too many insured jobs in the last hour. Please try again later." });
      let q;
      try { q = P.rate(book, agentId, COVER); } catch (e) { return json(res, 409, { error: e.message }); }
      const ref = `${agentId}-${Date.now()}`;
      const order = await PP.createPremiumOrder({
        cents: q.premium, policyRef: ref,
        description: `Bonded cover: ${fmt(COVER)} on ${AGENTS[agentId].label} at ${(q.bps / 100).toFixed(2)}%`,
      });
      pending.set(order.id, { agentId, quoted: { bps: q.bps, premium: q.premium } });
      emit("quote", `${AGENTS[agentId].label}: ${(q.bps / 100).toFixed(2)}% on ${fmt(COVER)}, premium ${fmt(q.premium)} (PayPal order ${order.id}).`, { agentId, ...q });
      return json(res, 200, { id: order.id });
    }

    // Step 2: buyer approved in PayPal → check capacity, capture, bind at the approved price, run the job.
    if (req.method === "POST" && url.pathname === "/api/policy/capture") {
      const { orderId } = await body(req);
      const p = typeof orderId === "string" ? pending.get(orderId) : undefined;
      if (!p) return json(res, 400, { error: "unknown order" });
      // Refuse before taking money if the pool can no longer carry the cover.
      try { P.rate(book, p.agentId, COVER); } catch (e) { return json(res, 409, { error: `Cover unavailable, no premium taken: ${e.message}` }); }
      const cap = await PP.capturePremiumOrder(orderId); // throws → order stays pending, so a retry works
      pending.delete(orderId);
      if (!cap.payerEmail && !cap.payerId) throw new Error(`Capture ${cap.captureId} returned no payer to pay claims to`);
      const quoted = { ...p.quoted };
      const policy = P.bind(book, p.agentId, {
        cover: COVER, expectedRecipient: VENDOR, premiumPaid: cap.cents, quoted,
        beneficiary: { email: cap.payerEmail, payerId: cap.payerId },
      });
      policy.rateBps = quoted.bps;
      policy.premiumCapture = cap.captureId;
      emit("bound", `Premium ${fmt(cap.cents)} captured from ${cap.payerEmail ?? cap.payerId} (capture ${cap.captureId}). Policy ${policy.id} covers ${fmt(COVER)} on ${AGENTS[p.agentId].label}.`,
        { policyId: policy.id, agentId: p.agentId, ...cap });
      emit("state", "book updated", snapshot());
      runInsuredJob(policy).catch((e) => emit("error", e.message, { policyId: policy.id, agentId: policy.agentId }));
      return json(res, 200, { policyId: policy.id });
    }
    json(res, 404, { error: "not found" });
  } catch (e) {
    if (e instanceof BadRequest) return json(res, 400, { error: e.message });
    emit("error", e.message);
    json(res, 500, { error: e.message });
  }
}).listen(PORT, () => console.log(`Bonded: http://localhost:${PORT}`));
