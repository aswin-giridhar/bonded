import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type ApiListingResponse = {
  ok?: boolean;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const apiListingResponseSchema: Schema<ApiListingResponse> = s.object<ApiListingResponse>(
  {
    ok: s.optional(s.boolean()),
  },
  { additionalProperties: s.json() },
);
