import type { ClientOptions } from "./client-options.js";
import { buildCoreClientOptions } from "./core/client-options.js";
import { RawClient } from "./core/raw-client.js";
import * as host from "./core/runtime-environment.js";
import * as s from "./core/validation/index.js";
import { AttackLab } from "./resources/attack-lab.js";
import { BookApi } from "./resources/book-api.js";
import { Policies } from "./resources/policies.js";
import { Quotes } from "./resources/quotes.js";
import { buildServers, type Servers } from "./servers.js";

/**
 * Insurance for AI agents that spend your money, settled on PayPal.
 *
 * An agent framework calls `GET /api/quote` to price cover on one payment before it spends. A buyer
 * then pays the premium through PayPal Checkout (`POST /api/policy/order`, approve in PayPal, `POST
 * /api/policy/capture`). Bonded runs the insured agent, reads the agent's PayPal payout back from
 * PayPal, and pays a claim through PayPal Payouts if the receiver differs from the insured payee.
 *
 * All PayPal calls run in the PayPal sandbox.
 */
export class BondedApiClient {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  #quotes?: Quotes;
  #policies?: Policies;
  #bookApi?: BookApi;
  #attackLab?: AttackLab;

  constructor(options: ClientOptions = {}) {
    this.#rawClient = new RawClient({
      ...buildCoreClientOptions(options, "BONDED_API_CLIENT_LOG"),
      defaultHeaders: [
        { name: "User-Agent", value: "BondedApiClient/1.0.0 TypeScript", schema: s.string() },
        { name: "X-APIMatic-Lang", value: "TypeScript", schema: s.string() },
        { name: "X-APIMatic-Package-Version", value: "1.0.0", schema: s.string() },
        { name: "X-APIMatic-Gen-Version", value: "4.0.0", schema: s.string() },
        { name: "X-APIMatic-OS", value: host.operatingSystem(), schema: s.optional(s.string()) },
        { name: "X-APIMatic-Runtime", value: host.runtimeDescription(), schema: s.optional(s.string()) },
      ],
      defaultQuery: [],
      defaultPathParams: [],
    });

    this.#servers = buildServers(options);
  }

  /**
   * Price cover before an agent spends.
   */
  get quotes(): Quotes {
    return (this.#quotes ??= new Quotes(this.#rawClient, this.#servers));
  }

  /**
   * Buy cover through PayPal Checkout and run the insured job.
   */
  get policies(): Policies {
    return (this.#policies ??= new Policies(this.#rawClient, this.#servers));
  }

  /**
   * Read the underwriting book and its live event stream.
   */
  get bookApi(): BookApi {
    return (this.#bookApi ??= new BookApi(this.#rawClient, this.#servers));
  }

  /**
   * Change the attacker-controlled text in the vendor listing.
   */
  get attackLab(): AttackLab {
    return (this.#attackLab ??= new AttackLab(this.#rawClient, this.#servers));
  }
}
