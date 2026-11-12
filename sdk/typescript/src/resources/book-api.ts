import { ApiError } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import { noneAuth } from "../core/auth/schemes.js";
import type { EventStream } from "../core/event-stream.js";
import type { RawClient } from "../core/raw-client.js";
import * as s from "../core/validation/index.js";
import { bookSchema, type Book } from "../models/book.js";
import type { Servers } from "../servers.js";

/**
 * Read the underwriting book and its live event stream.
 */
export class BookApi {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;

  constructor(rawClient: RawClient, servers: Servers) {
    this.#rawClient = rawClient;
    this.#servers = servers;
  }

  /**
   * Read the underwriting book
   *
   * @returns Current agents, quotes and policies
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link BondedApiError} when no usable response was produced: a connection failure, a
   * timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getBook(options?: RequestOptions): ApiPromise<Book, ApiError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/state"),
        auth: noneAuth,
        pathParams: [],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: bookSchema },
        errorFactory: ApiError,
      },
      options,
    );
  }

  /**
   * Live event stream (server-sent events)
   *
   * @remarks
   * Every PayPal call and model decision, as `text/event-stream`. Each `data:` line is an Event.
   *
   * @returns Event stream
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link BondedApiError} when no usable response was produced: a connection failure, a
   * timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  streamEvents(options?: RequestOptions): ApiPromise<EventStream<string>, ApiError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/events"),
        auth: noneAuth,
        pathParams: [],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "eventStreamText", dataSchema: s.string() },
        errorFactory: ApiError,
      },
      options,
    );
  }
}
