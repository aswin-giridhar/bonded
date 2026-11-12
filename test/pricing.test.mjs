// Pricing invariants. Pure functions: no PayPal or model keys needed.
// Run with `npm test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as P from "../src/pricing.mjs";

const COVER = 4000;
function freshBook() {
  const b = P.createBook();
  P.depositReinsurance(b, 100_000);
  for (const id of ["v1", "v2", "v3"]) {
    P.registerAgent(b, id, { label: id, modelFamily: id === "v1" ? "gemini" : "claude" });
    P.underwrite(b, id, "Underwriter A", 30_000);
    P.underwrite(b, id, "Underwriter B", 20_000);
  }
  return b;
}
const bindAt = (b, id, recipient = "vendor@x.example") => {
  const q = P.rate(b, id, COVER);
  return P.bind(b, id, { cover: COVER, expectedRecipient: recipient, premiumPaid: q.premium, quoted: { bps: q.bps, premium: q.premium }, beneficiary: { email: "buyer@x.example" } });
};

test("an agent with no history pays the full unproven loading", () => {
  const q = P.rate(freshBook(), "v1", COVER);
  assert.equal(q.bps, 1068);
  assert.equal(q.premium, 427);
  assert.equal(q.parts.unproven, 900);
  assert.equal(q.credibilityPct, 0);
});

test("a breach pays the full claim from pool and reinsurance, and re-prices up", () => {
  const b = freshBook();
  const p = bindAt(b, "v1");
  const r = P.settle(b, p.id, "attacker@y.example");
  assert.equal(r.breached, true);
  assert.equal(r.payout, COVER);
  assert.equal(r.fromPool, 2800); // 70% retained
  assert.equal(r.fromBook, 1200); // 30% quota share
  assert.equal(P.rate(b, "v1", COVER).bps, 1328);
});

test("a clean settlement re-prices down", () => {
  const b = freshBook();
  const p = bindAt(b, "v2");
  assert.equal(P.settle(b, p.id, "VENDOR@x.example").breached, false); // receiver compare is case-insensitive
  assert.equal(P.rate(b, "v2", COVER).bps, 1022);
});

test("underwriters are slashed pro rata to their stake", () => {
  const b = freshBook();
  P.settle(b, bindAt(b, "v1").id, "attacker@y.example");
  const { stakes } = b.agents.v1;
  assert.ok(stakes["Underwriter A"] < 30_000 && stakes["Underwriter B"] < 20_000);
  assert.ok(Math.abs(stakes["Underwriter A"] / stakes["Underwriter B"] - 1.5) < 0.01);
});

test("binding is refused if the premium paid differs from the approved quote", () => {
  const b = freshBook();
  const q = P.rate(b, "v1", COVER);
  assert.throws(() => P.bind(b, "v1", { cover: COVER, expectedRecipient: "v@x", premiumPaid: q.premium - 1, quoted: { bps: q.bps, premium: q.premium }, beneficiary: {} }), /Premium mismatch/);
});

test("a policy binds at the approved price even if the rate moved before capture", () => {
  const b = freshBook();
  const approved = P.rate(b, "v2", COVER);           // buyer approves this
  bindAt(b, "v3");                                    // same model family: concentration moves v2's rate
  assert.notEqual(P.rate(b, "v2", COVER).premium, approved.premium);
  const p = P.bind(b, "v2", { cover: COVER, expectedRecipient: "v@x", premiumPaid: approved.premium, quoted: { bps: approved.bps, premium: approved.premium }, beneficiary: {} });
  assert.equal(p.premium, approved.premium);
});

test("a policy cannot be settled twice", () => {
  const b = freshBook();
  const p = bindAt(b, "v1");
  P.settle(b, p.id, "vendor@x.example");
  assert.throws(() => P.settle(b, p.id, "vendor@x.example"), /already resolved/);
});
