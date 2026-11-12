// Actuarial pricing for agent payment cover. Amounts are integer USD cents; rates are basis points.
//
// The rate is the trust signal: an agent's premium moves with its loss record,
// and that record is only ever written by settle(), after PayPal has told us
// who was actually paid.

export const BPS = 10_000;
export const BASE_RATE_BPS = 50;          // floor: cost of capital
export const UNPROVEN_LOAD_BPS = 900;     // loading for an agent with no history
export const CREDIBILITY_TRIALS = 20;     // trials before history is fully trusted
export const FAILURE_LOAD_BPS = 6_000;    // weight on observed failure rate
export const UTILISATION_LOAD_BPS = 2_000;
export const CONCENTRATION_LOAD_BPS = 4_000;
export const CESSION_BPS = 3_000;         // 30% quota share to the reinsurance book

export function createBook() {
  return { bookCapital: 0, bookExposure: 0, familyExposure: {}, agents: {}, policies: [] };
}

export function registerAgent(book, id, { label, modelFamily }) {
  book.agents[id] = { id, label, modelFamily, pool: 0, exposure: 0, trials: 0, failures: 0, stakes: {} };
}

export function underwrite(book, id, who, cents) {
  const a = book.agents[id];
  a.pool += cents;
  a.stakes[who] = (a.stakes[who] ?? 0) + cents;
}

export function depositReinsurance(book, cents) { book.bookCapital += cents; }

function concentrationLoad(book, family, cover) {
  if (book.bookCapital === 0) return CONCENTRATION_LOAD_BPS;
  let share = Math.floor(((book.familyExposure[family] ?? 0) + cover) * BPS / book.bookCapital);
  if (share > BPS) share = BPS;
  return Math.floor(share * share * CONCENTRATION_LOAD_BPS / (BPS * BPS));
}

/// Returns the rate and every component of it, so the UI can show *why*.
export function rate(book, id, cover) {
  const a = book.agents[id];
  const ceded = Math.floor(cover * CESSION_BPS / BPS);
  const retained = cover - ceded;
  if (a.pool === 0 || a.pool < a.exposure + retained) throw new Error(`${a.label}: insufficient pool capacity`);
  if (book.bookCapital < book.bookExposure + ceded) throw new Error("Reinsurance book: insufficient capacity");

  const t = a.trials;
  const observedBps = t === 0 ? 0 : Math.floor(a.failures * BPS / t);
  const credibility = t >= CREDIBILITY_TRIALS ? BPS : Math.floor(t * BPS / CREDIBILITY_TRIALS);
  const experience = Math.floor(observedBps * FAILURE_LOAD_BPS * credibility / (BPS * BPS));
  const unproven = Math.floor(UNPROVEN_LOAD_BPS * (BPS - credibility) / BPS);
  const utilisation = Math.floor(Math.floor((a.exposure + retained) * BPS / a.pool) * UTILISATION_LOAD_BPS / BPS);
  const concentration = concentrationLoad(book, a.modelFamily, cover);
  const bps = BASE_RATE_BPS + experience + unproven + utilisation + concentration;
  return {
    bps, premium: Math.max(1, Math.floor(cover * bps / BPS)), cover,
    parts: { base: BASE_RATE_BPS, experience, unproven, utilisation, concentration },
    credibilityPct: credibility / 100, trials: t, failures: a.failures,
  };
}

/// Bind at the price the buyer approved. Re-pricing at capture time would let a
/// concurrent settlement move the rate after PayPal has already taken the money.
export function bind(book, id, { cover, expectedRecipient, premiumPaid, quoted, beneficiary }) {
  const a = book.agents[id];
  rate(book, id, cover); // capacity check only; throws if the pool cannot take it
  const q = quoted;
  if (premiumPaid !== q.premium) throw new Error(`Premium mismatch: quoted ${q.premium}¢, paid ${premiumPaid}¢`);
  const ceded = Math.floor(cover * CESSION_BPS / BPS);
  const cededPremium = Math.floor(premiumPaid * CESSION_BPS / BPS);
  a.pool += premiumPaid - cededPremium;
  book.bookCapital += cededPremium;
  a.exposure += cover - ceded;
  book.bookExposure += ceded;
  book.familyExposure[a.modelFamily] = (book.familyExposure[a.modelFamily] ?? 0) + cover;
  const policy = {
    id: book.policies.length + 1, agentId: id, cover, ceded, premium: premiumPaid, rateBps: q.bps,
    expectedRecipient, beneficiary, resolved: false, boundAt: Date.now(),
  };
  book.policies.push(policy);
  return policy;
}

/// Settle against what PayPal says happened. Breach ⇔ the receiver PayPal
/// recorded differs from the vendor of record the buyer insured.
export function settle(book, policyId, actualRecipient) {
  const p = book.policies[policyId - 1];
  if (!p || p.resolved) throw new Error(`Policy ${policyId} unknown or already resolved`);
  const a = book.agents[p.agentId];
  const retained = p.cover - p.ceded;
  p.resolved = true;
  a.exposure -= retained;
  book.bookExposure -= p.ceded;
  book.familyExposure[a.modelFamily] -= p.cover;
  a.trials += 1;
  p.actualRecipient = actualRecipient;
  p.breached = actualRecipient.toLowerCase() !== p.expectedRecipient.toLowerCase();
  if (!p.breached) return { breached: false, payout: 0 };

  a.failures += 1;
  const fromPool = Math.min(retained, a.pool);
  const fromBook = Math.min(p.ceded, book.bookCapital);
  // Share-based slashing: every underwriter loses pro-rata to their stake.
  const before = a.pool;
  a.pool -= fromPool;
  for (const who of Object.keys(a.stakes)) a.stakes[who] = Math.round(a.stakes[who] * a.pool / before);
  book.bookCapital -= fromBook;
  return { breached: true, payout: fromPool + fromBook, fromPool, fromBook };
}
