import { ApiError, type Declared, type Undeclared } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import { noneAuth } from "../core/auth/schemes.js";
import type { RawClient } from "../core/raw-client.js";
import type { ErrorDecoders } from "../core/response-decoder.js";
import { uuid } from "../core/uuid.js";
import * as s from "../core/validation/index.js";
import {
  apiPolicyCaptureRequestSchema,
  type ApiPolicyCaptureRequest,
} from "../models/api-policy-capture-request.js";
import {
  apiPolicyCaptureResponseSchema,
  type ApiPolicyCaptureResponse,
} from "../models/api-policy-capture-response.js";
import {
  apiPolicyOrderRequestSchema,
  type ApiPolicyOrderRequest,
} from "../models/api-policy-order-request.js";
import {
  apiPolicyOrderResponseSchema,
  type ApiPolicyOrderResponse,
} from "../models/api-policy-order-response.js";
import { errorSchema, type Error } from "../models/error.js";
import type { Servers } from "../servers.js";

/**
 * Buy cover through PayPal Checkout and run the insured job.
 */
export class Policies {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;

  constructor(rawClient: RawClient, servers: Servers) {
    this.#rawClient = rawClient;
    this.#servers = servers;
  }

  /**
   * Capture the approved premium and bind cover
   *
   * @remarks
   * Captures the approved PayPal order, binds the policy at the approved price, and starts the
   * insured job. Progress arrives on `/api/events`.
   *
   * @returns Policy bound
   *
   * @throws {@link Policies.CapturePremiumError} when the API answers with an error status — narrow
   * on `err.payload.kind`
   *
   * @throws {@link BondedApiError} when no usable response was produced: a connection failure, a
   * timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  capturePremium(
    request: Policies.CapturePremiumRequest,
    options?: RequestOptions,
  ): ApiPromise<ApiPolicyCaptureResponse, Policies.CapturePremiumError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/policy/capture"),
        auth: noneAuth,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: apiPolicyCaptureRequestSchema },
      },
      {
        success: { kind: "json", schema: apiPolicyCaptureResponseSchema },
        errorFactory: Policies.CapturePremiumError,
      },
      options,
    );
  }

  /**
   * Create a PayPal order for the premium
   *
   * @remarks
   * Prices cover on the agent's next $40.00 job and creates a PayPal Orders v2 order for the
   * premium. The buyer approves it in PayPal Checkout.
   *
   * @returns PayPal order created
   *
   * @throws {@link Policies.CreatePremiumOrderError} when the API answers with an error status —
   * narrow on `err.payload.kind`
   *
   * @throws {@link BondedApiError} when no usable response was produced: a connection failure, a
   * timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  createPremiumOrder(
    request: Policies.CreatePremiumOrderRequest,
    options?: RequestOptions,
  ): ApiPromise<ApiPolicyOrderResponse, Policies.CreatePremiumOrderError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/policy/order"),
        auth: noneAuth,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: apiPolicyOrderRequestSchema },
      },
      {
        success: { kind: "json", schema: apiPolicyOrderResponseSchema },
        errorFactory: Policies.CreatePremiumOrderError,
      },
      options,
    );
  }
}

export namespace Policies {
  export type CapturePremiumRequest = {
    body: ApiPolicyCaptureRequest;
  };

  export class CapturePremiumError extends ApiError {
    declare readonly payload: Declared<"error", Error> | Declared<"error2", Error> | Undeclared;

    static readonly errors: ErrorDecoders<CapturePremiumError> = [
      { on: 400, kind: "error", decode: { kind: "json", schema: errorSchema } },
      { on: 409, kind: "error2", decode: { kind: "json", schema: errorSchema } },
    ];
  }

  export type CreatePremiumOrderRequest = {
    body: ApiPolicyOrderRequest;
  };

  export class CreatePremiumOrderError extends ApiError {
    declare readonly payload:
      | Declared<"error", Error>
      | Declared<"error2", Error>
      | Declared<"error3", Error>
      | Undeclared;

    static readonly errors: ErrorDecoders<CreatePremiumOrderError> = [
      { on: 400, kind: "error", decode: { kind: "json", schema: errorSchema } },
      { on: 409, kind: "error2", decode: { kind: "json", schema: errorSchema } },
      { on: 429, kind: "error3", decode: { kind: "json", schema: errorSchema } },
    ];
  }
}
