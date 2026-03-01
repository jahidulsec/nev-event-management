import { yesNoEnum } from "@/schemas/common";
import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const NotificationSchema = z.object({
  event_id: z.string("enter event id"),
  work_area_code: z.string("Enter work area code").min(3),
  message: z.string("enter notification message"),
  is_marked: yesNoEnum.optional(),
  status: z.enum(["action", "read_only"]).optional(),
});

export const NotificaitonQuerySchema = QuerySchema.extend({
  work_area_code: z.string().optional(),
});

export const NotificaitonStatsQuery = z.object({
  work_area_code: z.string().optional(),
});

export type NotificationType = z.infer<typeof NotificationSchema>;
export type NotificaitonQueryType = z.infer<typeof NotificaitonQuerySchema>;
export type NotificaitonStatsQueryType = z.infer<typeof NotificaitonStatsQuery>;
