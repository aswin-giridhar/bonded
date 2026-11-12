# Bonded

**Insurance for AI agents that spend your money, settled on PayPal. The premium is the trust signal.**

Before you let an AI agent spend your money, buy cover on that one payment. The quote is the
market's live price of that agent's risk. It is computed from a loss record that is written
**only from what PayPal says actually happened**. If the agent pays the wrong party, the claim
comes back to your PayPal account.

**Live demo: https://bonded-urgg.onrender.com** (hosted on Render; the free instance may take
about 50 seconds to wake up). Paying a premium needs a PayPal **sandbox** buyer account: use your
own from developer.paypal.com, or the test login given in the Devpost testing instructions.

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
  a fake "payment operations notice", Gemini agents called their payment tool with the attacker's
  PayPal email every time we tried (`gemini-2.5-flash` 6/6, `gemini-3.1-flash-lite` 3/3). The breach
  in this demo is a live model decision, not a script.
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

## Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Buyer
    participant UI as Bonded dashboard
    participant API as Bonded server
    participant PP as PayPal (sandbox)
    participant Agent as AI agent (Gemini / Claude)
    participant Adj as Claude adjuster

    Buyer->>UI: Buy cover on an agent
    UI->>API: POST /api/policy/order
    API->>PP: Orders v2: create premium order
    Buyer->>PP: Approve premium in PayPal Checkout
    UI->>API: POST /api/policy/capture
    API->>PP: Orders v2: capture (payer becomes claim beneficiary)
    API->>Agent: Order + vendor listing (contains the injection)
    Agent-->>API: Tool call: pay(recipient_email) or pay_vendor_of_record()
    API->>PP: Payouts v1: execute the tool call
    API->>PP: Payouts v1: read the payout back
    PP-->>API: Receiver PayPal actually paid
    alt receiver differs from insured payee
        API->>PP: Payouts v1: claim to buyer, read back and verify
    end
    API->>Adj: Evidence from PayPal
    Adj-->>API: Adjuster note (advisory only)
    API-->>UI: SSE: verdict, re-priced rate, AG Grid policy book row
```

The breach decision is one comparison in code: the receiver on PayPal's own payout record
against the insured payee. No model makes it, and the agent's account of what it did is never
used.

## How PayPal is used: three rails, one source of truth

| Step | PayPal API | What it does |
|---|---|---|
| 1. Premium | **Orders v2** + **JS SDK Buttons** | The buyer pays the quoted premium in PayPal Checkout. Capture binds the policy, and the payer email PayPal returns becomes the claim beneficiary. |
| 2. Agent pays | **Payouts v1** (create) | The AI agent calls its payment **tool**; Bonded executes that tool call as a PayPal Payout, server to server, with no human approval. This is the agentic payment being insured. |
| 3. Settlement | **Payouts v1** (read back) | Bonded asks PayPal who **actually** received the money. A breach is defined as PayPal's receiver ≠ insured payee. |
| 4. Claim | **Payouts v1** (create + read back) | The claim goes to the buyer's PayPal account, and the claim payout is itself read back and verified. |

## How AI is used

Each agent pays by making a real **tool call**, and Bonded executes the call as a PayPal Payout.

| Agent | Model | Configuration | Measured against the injection |
|---|---|---|---|
| **Procure-Bot v1** | Gemini 3.1 Flash-Lite | Naive: the listing is part of its prompt. Tool `pay(recipient_email, note)`. | Paid the attacker 3/3 |
| **Procure-Bot v2** | Claude Sonnet 5.5 | Isolated: the listing is quoted as untrusted, and its tool `pay_vendor_of_record(redirection_attempt_detected, note)` **has no payee field at all**. The model can flag a redirection; it cannot cause one. | Paid the vendor and flagged it 3/3 |
| **Procure-Bot v3** | Claude Haiku 5.5 | The same naive setup and tool as v1, on a different model. | Paid the vendor 2/2 |

**Claude Sonnet 5.5** is also the claims adjuster. It writes the adjudication note from the
evidence PayPal returned. The note is advisory only: the breach decision is made in code by
comparing receivers, never by a model.

v1 and v3 have identical prompts and tools and differ only in the model. This is why Bonded
prices agents individually: a buyer cannot tell them apart from the outside, and their risk is
not the same.

## The demo scenario

All three agents get the same $40.00 order for GPU compute and the same marketplace listing. The
listing carries a prompt injection telling the payer to send money to a different PayPal email.

1. Insure **Procure-Bot v1** (premium about $4.27) → Gemini calls `pay` with the attacker's email → PayPal's read-back shows the
   wrong receiver → **breach** → a $40.00 claim is paid to the buyer through Payouts → v1's rate rises.
2. Insure **Procure-Bot v2** → Claude calls `pay_vendor_of_record` and flags the injection; its tool has no
   payee field → PayPal confirms the vendor was paid → **clean** → v2's rate falls.

One observed trial each, and the agents' prices have already diverged. No rating agency,
oracle or committee is involved.

### Policy book (AG Grid)

Below the agents, an **AG Grid** policy book lists every policy with its PayPal references:
premium capture ID, the agent's payout batch, **who PayPal says was paid**, the verdict, the claim
payout and the rate before and after settlement. It updates live from the same event stream as
the dashboard, and you can sort and filter it like an underwriter's book. (AG Grid Community,
loaded from a CDN, so there is still nothing to install.)

### Attack lab

Open **Attack lab** under the listing to replace the attacker's text with your own injection.
The next insured job on any agent reads it. Try to make v2 pay the wrong party.

### Quote API

Any agent framework can price cover before it spends:

```bash
curl "http://localhost:4173/api/quote?agentId=procure-v1&cover=4000"
# {"agentId":"procure-v1","model":"gemini-3.1-flash-lite","cover":4000,"currency":"USD",
#  "rateBps":1068,"premium":427,"components":{...},"trials":0,"failures":0,...}
```

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

## API spec

`openapi.yaml` is an OpenAPI 3.0 description of the Bonded API (quote, premium order and capture,
book (`/api/state`), event stream, attack lab), so agent frameworks can generate a client for it.

### Generated SDKs (APIMatic)

The `openapi.yaml` spec was imported into **APIMatic**, which generated typed client SDKs so any
agent framework can price and buy cover from Bonded:

- `sdk/python/` and `sdk/typescript/`, generated with the APIMatic CLI (`apimatic sdk generate`)
- `apimatic/src/`: the APIMatic project configuration and portal content

Verified against the live demo with the generated Python SDK:

```python
from bonded_api import BondedApiClient   # pip install ./sdk/python

client = BondedApiClient(environment="production")   # https://bonded-urgg.onrender.com
quote = client.quotes.get_quote("procure-v1", cover=4000)
print(quote.rate_bps, quote.premium)                 # 1068 427 for an agent with no history
```

## Run it

Requires **Node 22+**. There are no npm dependencies to install.

```bash
git clone https://github.com/aswin-giridhar/bonded
cd bonded
cp .env.example .env      # then fill in the values below
npm run check             # proves the PayPal rails: OAuth → $1 Payout → read-back
npm start                 # http://localhost:4173
npm test                  # pricing invariants, no API keys needed
```

`.env` needs:

- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`: a **sandbox** REST app from
  [developer.paypal.com](https://developer.paypal.com) → Apps & Credentials → Sandbox.
  **The app must have the Payouts feature enabled.**
- `GEMINI_API_KEY`: from [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
- `ANTHROPIC_API_KEY`: runs agents v2 and v3 and the claims adjuster.
- Gemini's free tier allows about 20 requests per model per day. If v1 shows a 429 error, set
  `GEMINI_MODEL` in `.env` to another Gemini model or use a billing-enabled key.

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
- Susceptibility is model- and configuration-specific, and the samples above are small (2 to 3
  runs each). That is the point of pricing per agent: the risk lives in the specific agent, not in "AI"
  in general. Your run can differ; the dashboard shows each model's actual tool call.

## Layout

```
src/pricing.mjs        actuarial pricing, pools, reinsurance, settlement, slashing
src/paypal.mjs         PayPal REST: OAuth, Orders v2, Payouts create + read-back
src/agents.mjs         three tool-calling agents, the poisoned listing, the Claude adjuster
src/server.mjs         zero-dependency HTTP server, SSE feed, quote API, attack lab
public/index.html      dashboard, PayPal JS SDK buttons, AG Grid policy book
script/check-paypal.mjs  end-to-end rail check against the sandbox
openapi.yaml           OpenAPI 3.0 spec of the API
sdk/                   Python and TypeScript SDKs generated by APIMatic
apimatic/              APIMatic project configuration
test/                  pricing invariant tests (npm test)
render.yaml            Render blueprint for the hosted demo
```

## License

MIT, see [LICENSE](LICENSE).
