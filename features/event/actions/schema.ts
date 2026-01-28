import { eventApproverTypeEnum, userRoleSchema } from "@/schemas/common";
import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const EventTypeSchema = z.object({
  title: z
    .string("Enter event title name")
    .min(2, "Title must be at least 2 characters."),
  type: z.string("Select a type"),
  lower_limit: z.number().default(0).optional(),
  upper_limit: z.number().default(0).optional(),
});

export const EventTypeQuerySchema = QuerySchema.extend({
  // participant_id: z.string().optional(),
});

export type EventTypeType = z.infer<typeof EventTypeSchema>;
export type EventTypeQueryType = z.infer<typeof EventTypeQuerySchema>;

export const EventTypeApproverSchema = z.object({
  event_type_id: z.string("Select a event type"),
  user_type: userRoleSchema,
  type: eventApproverTypeEnum,
});

export const EventTypeApproverQuerySchema = QuerySchema.extend({
  // participant_id: z.string().optional(),
});

export type EventTypeApproverType = z.infer<typeof EventTypeApproverSchema>;
export type EventTypeApproverQueryType = z.infer<
  typeof EventTypeApproverQuerySchema
>;
