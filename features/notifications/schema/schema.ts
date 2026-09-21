import { yesNoEnum } from "@/schemas/common";
import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const notificationStatusEnum = z.enum(["action", "read_only"]);

export const createNotificationDTOSchema = z.object({
  employee_id: z
    .string("Enter employee id")
    .min(3, "At least 3 characters")
    .max(10, "not more than 10 character"),

  event_id: z.string("Enter event id").max(21, "not more than 21 character"),

  message: z
    .string("Enter notification message")
    .min(1, "Enter notification message")
    .max(200, "not more than 200 character"),

  is_marked: yesNoEnum.optional(),

  status: notificationStatusEnum.optional(),
});

export const updateNotificationDTOSchema = createNotificationDTOSchema
  .pick({ message: true, is_marked: true, status: true })
  .partial();

export const notificationQuerySchema = QuerySchema.extend({
  employee_id: z.string().optional(),
  is_marked: yesNoEnum.optional(),
  status: notificationStatusEnum.optional(),
});

export const notificationStatsQuerySchema = z.object({
  employee_id: z.string().optional(),
});

export type CreateNotificationDTOType = z.infer<
  typeof createNotificationDTOSchema
>;
export type UpdateNotificationDTOType = z.infer<
  typeof updateNotificationDTOSchema
>;
export type NotificationQueryType = z.infer<typeof notificationQuerySchema>;
export type NotificationStatsQueryType = z.infer<
  typeof notificationStatsQuerySchema
>;
