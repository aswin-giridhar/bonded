import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

/** Rate components in basis points. */
export type RateComponents = {
  base?: number;
  /** Observed loss record, credibility weighted */
  experience?: number;
  /** Loading for missing track record */
  unproven?: number;
  utilisation?: number;
  /** Surcharge for exposure concentrated on one model */
  concentration?: number;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const rateComponentsSchema: Schema<RateComponents> = s.object<RateComponents>(
  {
    base: s.optional(s.int()),
    experience: s.optional(s.int()),
    unproven: s.optional(s.int()),
    utilisation: s.optional(s.int()),
    concentration: s.optional(s.int()),
  },
  { additionalProperties: s.json() },
);
