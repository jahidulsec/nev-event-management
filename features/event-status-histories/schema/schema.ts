import { eventApproverStatusEnum, userRoleSchema } from "@/schemas/common";
import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const createEventStatusPayloadSchema = z.object({
  event_id: z.string(),
  employee_id: z.string(),
  sap_area_code: z.string(),
  user_role: userRoleSchema,
  status: eventApproverStatusEnum,
  remarks: z.string("Enter remarks").min(2, "At least two characters"),
});

export type CreateEventStatusPayloadType = z.infer<
  typeof createEventStatusPayloadSchema
>;

export const eventStatusHistoryQuerySchema = QuerySchema.extend({
  event_id: z.string().optional(),
});

export type EventStatusHistoryQueryType = z.infer<
  typeof eventStatusHistoryQuerySchema
>;
