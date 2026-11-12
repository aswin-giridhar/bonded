import * as s from "../core/validation/index.js";
import type { EnumSchema } from "../core/validation/schema.js";

export const AgentId = {
  ProcureV1: "procure-v1",
  ProcureV2: "procure-v2",
  ProcureV3: "procure-v3",
} as const;
export type AgentId = (typeof AgentId)[keyof typeof AgentId] | (string & {});

export const agentIdSchema: EnumSchema<AgentId> = s.enumOf<AgentId>(AgentId);
