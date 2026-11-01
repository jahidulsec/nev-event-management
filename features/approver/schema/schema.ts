import { eventApproverTypeEnum, userRoleSchema } from "@/schemas/common";
import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const approverPayloadSchema = z.object({
  event_type_id: z.string("Select a event type"),
  user_type: userRoleSchema,
  type: eventApproverTypeEnum,
});

export const approverQuerySchema = QuerySchema.extend({
  type_id: z.string().optional(),
});

export type ApproverPayloadType = z.infer<typeof approverPayloadSchema>;
export type ApproverQueryType = z.infer<typeof approverQuerySchema>;
