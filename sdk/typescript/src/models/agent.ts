import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { agentIdSchema, type AgentId } from "./agent-id.js";
import { quoteSchema, type Quote } from "./quote.js";

export type Agent = {
  id?: AgentId;
  label?: string;
  kind?: string;
  model?: string;
  pool?: number;
  exposure?: number;
  trials?: number;
  failures?: number;
  quote?: Quote;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const agentSchema: Schema<Agent> = s.object<Agent>(
  {
    id: s.optional(s.lazy(() => agentIdSchema)),
    label: s.optional(s.string()),
    kind: s.optional(s.string()),
    model: s.optional(s.string()),
    pool: s.optional(s.int()),
    exposure: s.optional(s.int()),
    trials: s.optional(s.int()),
    failures: s.optional(s.int()),
    quote: s.optional(s.lazy(() => quoteSchema)),
  },
  { additionalProperties: s.json() },
);
