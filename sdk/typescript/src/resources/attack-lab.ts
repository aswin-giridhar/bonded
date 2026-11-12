import { ApiError, type Declared, type Undeclared } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import { noneAuth } from "../core/auth/schemes.js";
import type { RawClient } from "../core/raw-client.js";
import type { ErrorDecoders } from "../core/response-decoder.js";
import { uuid } from "../core/uuid.js";
import * as s from "../core/validation/index.js";
import { apiListingRequestInternalSchema, type ApiListingRequest } from "../models/api-listing-request.js";
import { apiListingResponseSchema, type ApiListingResponse } from "../models/api-listing-response.js";
import { errorSchema, type Error } from "../models/error.js";
import type { Servers } from "../servers.js";

/**
 * Change the attacker-controlled text in the vendor listing.
 */
export class AttackLab {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;

  constructor(rawClient: RawClient, servers: Servers) {
    this.#rawClient = rawClient;
    this.#servers = servers;
  }

  /**
   * Replace or reset the attacker's text in the vendor listing
   *
   * @returns Saved
   *
   * @throws {@link AttackLab.SetListingInjectionError} when the API answers with an error status —
   * narrow on `err.payload.kind`
   *
   * @throws {@link BondedApiError} when no usable response was produced: a connection failure, a
   * timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  setListingInjection(
    request: AttackLab.SetListingInjectionRequest,
    options?: RequestOptions,
  ): ApiPromise<ApiListingResponse, AttackLab.SetListingInjectionError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/listing"),
        auth: noneAuth,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: apiListingRequestInternalSchema },
      },
      {
        success: { kind: "json", schema: apiListingResponseSchema },
        errorFactory: AttackLab.SetListingInjectionError,
      },
      options,
    );
  }
}

export namespace AttackLab {
  export type SetListingInjectionRequest = {
    body: ApiListingRequest;
  };

  export class SetListingInjectionError extends ApiError {
    declare readonly payload: Declared<"error", Error> | Undeclared;

    static readonly errors: ErrorDecoders<SetListingInjectionError> = [
      { on: 400, kind: "error", decode: { kind: "json", schema: errorSchema } },
    ];
  }
}
