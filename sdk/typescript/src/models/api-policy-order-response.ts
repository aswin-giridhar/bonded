import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type ApiPolicyOrderResponse = {
  /** PayPal order ID to approve in Checkout */
  id: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const apiPolicyOrderResponseSchema: Schema<ApiPolicyOrderResponse> = s.object<ApiPolicyOrderResponse>(
  {
    id: s.string(),
  },
  { additionalProperties: s.json() },
);
