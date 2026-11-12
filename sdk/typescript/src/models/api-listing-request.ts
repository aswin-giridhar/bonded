import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type ApiListingRequest = {
  injection?: string;
  reset?: boolean;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

const apiListingRequestProperties: s.Shape<ApiListingRequest> = {
  injection: s.optional(s.string()),
  reset: s.optional(s.boolean()),
};

export const apiListingRequestInternalSchema: Schema<ApiListingRequest> = s.object<ApiListingRequest>(
  apiListingRequestProperties,
  { additionalProperties: s.json() },
);

export const apiListingRequestSchema: Schema<ApiListingRequest> = s.lazySchema(() =>
  s.object<ApiListingRequest>(
    {
      ...apiListingRequestProperties,
      injection: s.optional(s.string().check(s.maxLength(800))),
    },
    { additionalProperties: s.json() },
  ),
);
