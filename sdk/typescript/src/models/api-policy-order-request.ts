import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { agentIdSchema, type AgentId } from "./agent-id.js";

export type ApiPolicyOrderRequest = {
  agentId: AgentId;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const apiPolicyOrderRequestSchema: Schema<ApiPolicyOrderRequest> = s.object<ApiPolicyOrderRequest>(
  {
    agentId: agentIdSchema,
  },
  { additionalProperties: s.json() },
);
