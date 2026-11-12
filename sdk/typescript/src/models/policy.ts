import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { agentIdSchema, type AgentId } from "./agent-id.js";

export type Policy = {
  id?: number;
  agentId?: AgentId;
  model?: string;
  cover?: number;
  premium?: number;
  rateBps?: number;
  rateAfter?: number;
  expectedRecipient?: string;
  /** Receiver as recorded by PayPal */
  actualRecipient?: string;
  breached?: boolean;
  resolved?: boolean;
  /** PayPal capture ID */
  premiumCapture?: string;
  /** PayPal payout batch of the agent's payment */
  payoutBatch?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const policySchema: Schema<Policy> = s.object<Policy>(
  {
    id: s.optional(s.int()),
    agentId: s.optional(s.lazy(() => agentIdSchema)),
    model: s.optional(s.string()),
    cover: s.optional(s.int()),
    premium: s.optional(s.int()),
    rateBps: s.optional(s.int()),
    rateAfter: s.optional(s.int()),
    expectedRecipient: s.optional(s.string()),
    actualRecipient: s.optional(s.string()),
    breached: s.optional(s.boolean()),
    resolved: s.optional(s.boolean()),
    premiumCapture: s.optional(s.string()),
    payoutBatch: s.optional(s.string()),
  },
  { additionalProperties: s.json() },
);
