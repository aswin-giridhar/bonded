import { ApiError, type Declared, type Undeclared } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import { noneAuth } from "../core/auth/schemes.js";
import type { RawClient } from "../core/raw-client.js";
import type { ErrorDecoders } from "../core/response-decoder.js";
import * as s from "../core/validation/index.js";
import type { Schema } from "../core/validation/schema.js";
import { agentIdSchema, type AgentId } from "../models/agent-id.js";
import { errorSchema, type Error } from "../models/error.js";
import { quoteSchema, type Quote } from "../models/quote.js";
import type { Servers } from "../servers.js";

/**
 * Price cover before an agent spends.
 */
export class Quotes {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;

  constructor(rawClient: RawClient, servers: Servers) {
    this.#rawClient = rawClient;
    this.#servers = servers;
  }

  /**
   * Quote cover for one agent payment
   *
   * @remarks
   * Returns the rate and premium for insuring a payment of `cover` cents made by the given agent,
   * with every component of the rate.
   *
   * @returns Quote
   *
   * @throws {@link Quotes.GetQuoteError} when the API answers with an error status — narrow on
   * `err.payload.kind`
   *
   * @throws {@link BondedApiError} when no usable response was produced: a connection failure, a
   * timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getQuote(
    request: Quotes.GetQuoteRequest,
    options?: RequestOptions,
  ): ApiPromise<Quote, Quotes.GetQuoteError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/quote"),
        auth: noneAuth,
        pathParams: [],
        query: [
          { name: "agentId", value: request.agentId, schema: agentIdSchema },
          { name: "cover", value: request.cover, schema: s.defaulted(s.int(), 4000) },
        ],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: quoteSchema },
        errorFactory: Quotes.GetQuoteError,
      },
      options,
    );
  }
}

export namespace Quotes {
  export type GetQuoteRequest = {
    agentId: AgentId;
    /** Amount to insure, in USD cents. @default 4000 */
    cover?: number;
  };

  export const getQuoteRequestSchema: Schema<GetQuoteRequest> = s.lazySchema(() =>
    s.object<GetQuoteRequest>({
      agentId: agentIdSchema,
      cover: s.defaulted(s.int().check(s.gte(100), s.lte(20000)), 4000),
    }),
  );

  export class GetQuoteError extends ApiError {
    declare readonly payload: Declared<"error", Error> | Declared<"error2", Error> | Undeclared;

    static readonly errors: ErrorDecoders<GetQuoteError> = [
      { on: 400, kind: "error", decode: { kind: "json", schema: errorSchema } },
      { on: 409, kind: "error2", decode: { kind: "json", schema: errorSchema } },
    ];
  }
}
