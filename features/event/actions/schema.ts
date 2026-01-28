import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const EventTypeSchema = z.object({
  title: z
    .string("Enter event title name")
    .min(2, "Title must be at least 2 characters."),
  lower_limit: z.number("Enter lower limit").optional(),
  upper_limit: z.number("Enter upper limit").optional(),
});

export const EventTypeQuerySchema = QuerySchema.extend({
  // participant_id: z.string().optional(),
});

export type EventTypeType = z.infer<typeof EventTypeSchema>;
export type EventTypeQueryType = z.infer<typeof EventTypeQuerySchema>;
