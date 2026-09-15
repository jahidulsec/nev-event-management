import { QuerySchema } from "@/schemas/query";
import { RESOURCES, ACTIONS } from "@/lib/abac/catalog";
import z from "zod";

const conditionOperatorSchema = z.enum(["eq", "ne", "in", "not_in", "contains"]);

const conditionValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.union([z.string(), z.number()])),
]);

const conditionRuleSchema = z.object({
  attribute: z.string("Select an attribute").min(1, "Select an attribute"),
  operator: conditionOperatorSchema,
  value: conditionValueSchema,
});

export const policyConditionsSchema = z.object({
  match: z.enum(["all", "any"]).default("all"),
  rules: z.array(conditionRuleSchema).default([]),
});

export const createPolicyDTOSchema = z.object({
  name: z
    .string("Enter policy name")
    .min(3, "At least 3 characters")
    .max(100, "not more than 100 character"),

  description: z
    .string()
    .max(255, "not more than 255 character")
    .optional(),

  resource: z.enum([...RESOURCES, "*"] as [string, ...string[]], "Select a resource"),

  action: z.enum([...ACTIONS, "*"] as [string, ...string[]], "Select an action"),

  effect: z.enum(["allow", "deny"]).default("allow"),

  priority: z.coerce.number().int().default(0),

  enabled: z.boolean().default(true),

  conditions: policyConditionsSchema.optional(),
});

export const policyQuerySchema = QuerySchema.extend({});

export const updatePolicyDTOSchema = createPolicyDTOSchema.partial();

export type ConditionRuleType = z.infer<typeof conditionRuleSchema>;
export type PolicyConditionsType = z.infer<typeof policyConditionsSchema>;
export type CreatePolicyDTOType = z.infer<typeof createPolicyDTOSchema>;
export type UpdatePolicyDTOType = z.infer<typeof updatePolicyDTOSchema>;
export type PolicyQueryType = z.infer<typeof policyQuerySchema>;
