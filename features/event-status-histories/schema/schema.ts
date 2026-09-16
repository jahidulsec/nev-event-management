import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const eventStatusHistoryQuerySchema = QuerySchema.extend({
  event_id: z.string().optional(),
});

export type EventStatusHistoryQueryType = z.infer<
  typeof eventStatusHistoryQuerySchema
>;
