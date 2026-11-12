import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type ApiPolicyCaptureResponse = {
  policyId: number;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const apiPolicyCaptureResponseSchema: Schema<ApiPolicyCaptureResponse> =
  s.object<ApiPolicyCaptureResponse>(
    {
      policyId: s.int(),
    },
    { additionalProperties: s.json() },
  );
