// Proves the PayPal rails this app depends on, against the real sandbox:
// OAuth → a $1.00 Payout → read the payout back and print who PayPal paid.
// Run this first; if Payouts is not enabled on your sandbox app, it says so here.
import "../src/env.mjs";
import { sendPayout, readPayout } from "../src/paypal.mjs";

const to = process.argv[2] ?? "vendor-check@northwind-compute.example";
try {
  const { batchId, status } = await sendPayout({ cents: 100, email: to, note: "Bonded rail check", batchId: `check-${Date.now()}` });
  console.log(`payout created: ${batchId} (${status})`);
  const r = await readPayout(batchId);
  console.log(`PayPal read-back → receiver ${r.receiver}, $${(r.cents / 100).toFixed(2)}, item ${r.transactionStatus}`);
  console.log(r.receiver.toLowerCase() === to.toLowerCase() ? "OK — rails work" : "MISMATCH — investigate");
} catch (e) {
  console.error(e.message);
  if (/AUTHORIZATION|PERMISSION|NOT_AUTHORIZED/i.test(e.message))
    console.error("→ Enable the Payouts feature on your sandbox app (developer.paypal.com > Apps & Credentials > your app).");
  process.exit(1);
}
