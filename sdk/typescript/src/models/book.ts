import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { agentSchema, type Agent } from "./agent.js";
import { policySchema, type Policy } from "./policy.js";

export type Book = {
  cover?: number;
  vendor?: string;
  bookCapital?: number;
  bookExposure?: number;
  agents?: Agent[];
  policies?: Policy[];
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const bookSchema: Schema<Book> = s.object<Book>(
  {
    cover: s.optional(s.int()),
    vendor: s.optional(s.string()),
    bookCapital: s.optional(s.int()),
    bookExposure: s.optional(s.int()),
    agents: s.optional(s.array(s.lazy(() => agentSchema))),
    policies: s.optional(s.array(s.lazy(() => policySchema))),
  },
  { additionalProperties: s.json() },
);
