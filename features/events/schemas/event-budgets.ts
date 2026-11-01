import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const createEventBudgetDTOSchema = z.object({
  event_id: z.string("Select an event").optional(),

  item: z
    .string("Enter budget item name")
    .min(2, "At least 2 characters")
    .max(100, "not more than 100 character"),

  unit: z.number("Enter unit quantity").min(1, "At least 1 unit"),

  unit_cost: z
    .number("Enter per unit cost")
    .min(0, "Number must be positive value"),
});

export const updateEventBudgetDTOSchema = createEventBudgetDTOSchema.partial();

export const eventBudgetQuerySchema = QuerySchema.extend({
  event_id: z.string().optional(),
});

export type CreateEventBudgetDTOType = z.infer<
  typeof createEventBudgetDTOSchema
>;
export type UpdateEventBudgetDTOType = z.infer<
  typeof updateEventBudgetDTOSchema
>;
export type EventBudgetQueryType = z.infer<typeof eventBudgetQuerySchema>;
