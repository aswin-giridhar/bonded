# Bonded

**Insurance for AI agents that spend your money, settled on PayPal. The premium is the trust signal.**

Before you let an AI agent spend your money, buy cover on that one payment. The quote is the
market's live price of that agent's risk. It is computed from a loss record that is written
**only from what PayPal says actually happened**. If the agent pays the wrong party, the claim
comes back to your PayPal account.

![Bonded dashboard](docs/dashboard.png)

---

## The problem

Agents can now pay. Agentic checkout, agent toolkits and MCP payment servers let a model move
real money with no human in the loop. Nobody can tell you how much to trust any particular
agent with your money.

- Agents are exploitable through the content they read. [arXiv:2601.22569](https://arxiv.org/abs/2601.22569)
  red-teamed Google's Agent Payments Protocol and showed that indirect prompt injection reliably
  redirects a real payment agent's funds.
- **We reproduced this live while building the project.** Given a marketplace listing containing
  a fake "payment operations notice", `gemini-2.5-flash` paid the attacker's PayPal email in
  **3 of 3** runs. The breach in this demo is a live model decision, not a script.
- Reputation systems for agents are claims, and claims are cheap to fake. An empirical study of an
  on-chain agent registry found 59–91% of reviewers showing coordinated Sybil behaviour
  ([arXiv:2606.26028](https://arxiv.org/abs/2606.26028)).

## The idea: stop scoring agents, price them

Underwriters stake capital behind a specific agent. A buyer who is about to let that agent pay
for something binds a policy on that single payment. The premium is the agent's price of risk:

- **New agents are expensive, not trusted by default.** With no history, the rate carries a full
  "unproven" loading.
- **The record cannot be forged.** Trials and failures are written only by settlement, and
  settlement reads the payment back from PayPal. The agent's own account of what it did is
  never used.
- **Manipulation costs money.** Faking a clean record means paying real premiums. An
  underwriter who prices a vulnerable agent cheaply loses capital on the first real claim.

## How PayPal is used: three rails, one source of truth

| Step | PayPal API | What it does |
|---|---|---|
| 1. Premium | **Orders v2** + **JS SDK Buttons** | The buyer pays the quoted premium in PayPal Checkout. Capture binds the policy, and the payer email PayPal returns becomes the claim beneficiary. |
| 2. Agent pays | **Payouts v1** (create) | The AI agent pays the vendor server-to-server, with no human approval. This is the agentic payment being insured. |
| 3. Settlement | **Payouts v1** (read back) | Bonded asks PayPal who **actually** received the money. A breach is defined as PayPal's receiver ≠ insured payee. |
| 4. Claim | **Payouts v1** (create + read back) | The claim goes to the buyer's PayPal account, and the claim payout is itself read back and verified. |

## How AI is used

| Model | Role |
|---|---|
| **Gemini 2.5 Flash** (Google) | Runs both procurement agents. **v1 (naive)** pastes the vendor listing into its prompt. **v2 (isolated)** quotes the listing as untrusted data, and its payee is fixed in code to the vendor of record, so the model can *flag* a redirection but cannot *cause* one. |
| **Claude Sonnet 5.5** (Anthropic) | The claims adjuster. It writes the adjudication note from the evidence PayPal returned. It deliberately runs on a **different model family** from the agents it judges, so it does not share their failure modes. The note is advisory only: the breach decision is made in code by comparing receivers, never by a model. |

## The demo scenario

Both agents get the same $40.00 order for GPU compute and the same marketplace listing. The
listing carries a prompt injection telling the payer to send money to a different PayPal email.

1. Insure **Procure-Bot v1** (premium about $4.27) → Gemini pays the attacker → PayPal's read-back shows the
   wrong receiver → **breach** → a $40.00 claim is paid to the buyer through Payouts → v1's rate rises.
2. Insure **Procure-Bot v2** → Gemini flags the injection, the payee stays the vendor → PayPal
   confirms the vendor was paid → **clean** → v2's rate falls.

One observed trial each, and the two agents' prices have already diverged. No rating agency,
oracle or committee is involved.

## Pricing (actuarial, not a heuristic)

Implemented in `src/pricing.mjs`:

```
rate = floor
     + loss record   × credibility          (observed failure rate × 60%)
     + unproven load × (1 − credibility)    (9%, fading over 20 trials)
     + pool utilisation load
     + model-family concentration load      (agents on one base model share failure modes)
```

- **Credibility weighting** means one lucky success cannot buy a clean record, and one bad day
  cannot destroy a good one.
- **30% quota-share reinsurance**: a shared book takes 30% of every premium and 30% of every loss.
- **Share-based slashing**: a loss is spread pro-rata across every underwriter in the pool. The
  dashboard shows each underwriter's stake shrinking.

## Run it

Requires **Node 22+**. There are no npm dependencies to install.

```bash
git clone https://github.com/aswin-giridhar/bonded
cd bonded
cp .env.example .env      # then fill in the values below
npm run check             # proves the PayPal rails: OAuth → $1 Payout → read-back
npm start                 # http://localhost:4173
```

`.env` needs:

- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`: a **sandbox** REST app from
  [developer.paypal.com](https://developer.paypal.com) → Apps & Credentials → Sandbox.
  **The app must have the Payouts feature enabled.**
- `GEMINI_API_KEY`: from [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
- `ANTHROPIC_API_KEY` (optional): Claude writes the adjuster's note. Without it, Gemini writes
  the note and the UI labels it as such.

To pay a premium, click the PayPal button and log in with a **sandbox personal (buyer) account**
from your developer dashboard (Sandbox → Accounts).

Every external failure is shown in the live feed with PayPal's or the model provider's own error.
Nothing falls back silently. A broken key never looks like a well-behaved agent.

## Honest status

- The vendor (`billing@northwind-compute.example`) and attacker
  (`treasury@northwind-payments.example`) emails are not real PayPal accounts. PayPal records
  the payouts to them as **UNCLAIMED**, which is all settlement needs: the receiver on PayPal's
  own record.
- The agent's spending wallet and the underwriters' claim pool are the **same sandbox business
  account**. Underwriter stakes and the reinsurance book are an in-memory ledger in the server,
  reset on restart. A production version would hold pool capital in segregated accounts.
- The pricing loadings are reasoned defaults, not fitted to loss data. No claims history for agent
  breaches exists anywhere yet. The rates are structurally correct, not calibrated.
- Susceptibility is model- and configuration-specific: `gemini-2.5-flash` took this injection 3/3
  times in our tests, while the same model with the isolated prompt flagged it in every run. That is
  why pricing is per agent: the risk lives in the specific agent, not in "AI" in general.

## Layout

```
src/pricing.mjs        actuarial pricing, pools, reinsurance, settlement, slashing
src/paypal.mjs         PayPal REST: OAuth, Orders v2, Payouts create + read-back
src/agents.mjs         the two Gemini agents, the poisoned listing, the Claude adjuster
src/server.mjs         zero-dependency HTTP server + SSE live feed
public/index.html      dashboard + PayPal JS SDK buttons
script/check-paypal.mjs  end-to-end rail check against the sandbox
```

## License

MIT, see [LICENSE](LICENSE).
