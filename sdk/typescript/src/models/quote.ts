import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { agentIdSchema, type AgentId } from "./agent-id.js";
import { rateComponentsSchema, type RateComponents } from "./rate-components.js";

export type Quote = {
  agentId: AgentId;
  model?: string;
  /** USD cents */
  cover: number;
  currency?: string;
  rateBps: number;
  /** USD cents */
  premium: number;
  /** Rate components in basis points. */
  components?: RateComponents;
  trials?: number;
  failures?: number;
  credibilityPct?: number;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const quoteSchema: Schema<Quote> = s.object<Quote>(
  {
    agentId: agentIdSchema,
    model: s.optional(s.string()),
    cover: s.int(),
    currency: s.optional(s.string()),
    rateBps: s.int(),
    premium: s.int(),
    components: s.optional(s.lazy(() => rateComponentsSchema)),
    trials: s.optional(s.int()),
    failures: s.optional(s.int()),
    credibilityPct: s.optional(s.float64()),
  },
  { additionalProperties: s.json() },
);
