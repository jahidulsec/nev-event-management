import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const eventTypePayloadSchema = z.object({
  title: z
    .string("Enter event title name")
    .min(2, "Title must be at least 2 characters."),
  lower_limit: z.number().min(0, "Enter a positive number").optional(),
  upper_limit: z.number().min(0, "Enter a positive number").optional(),
});

export const eventTypeQuerySchema = QuerySchema.extend({});

export type EventTypePayloadType = z.infer<typeof eventTypePayloadSchema>;
export type EventTypeQueryType = z.infer<typeof eventTypeQuerySchema>;
