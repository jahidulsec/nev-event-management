import { yesNoEnum } from "@/schemas/common";
import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const createEventConsultantDTOSchema = z.object({
  event_id: z.string("Select an event").optional(),

  doctor_id: z.string("Select a doctor"),

  role: z
    .string("Enter consultant role")
    .min(2, "At least 2 characters")
    .max(100, "not more than 100 character"),

  duration_h: z
    .number("Enter session duration in hours")
    .min(0, "Number must be positive value"),

  honorarium: z
    .number("Enter honorarium amount")
    .min(0, "Number must be positive value")
    .optional()
    .default(0),

  in_different_district: yesNoEnum.optional().default("yes"),

  night_stay: yesNoEnum.optional().default("no"),

  tier_id: z.string("Select a tier").optional(),
});

export const updateEventConsultantDTOSchema =
  createEventConsultantDTOSchema.partial();

export const eventConsultantQuerySchema = QuerySchema.extend({
  event_id: z.string().optional(),
  doctor_id: z.string().optional(),
});

export type CreateEventConsultantDTOType = z.infer<
  typeof createEventConsultantDTOSchema
>;
export type UpdateEventConsultantDTOType = z.infer<
  typeof updateEventConsultantDTOSchema
>;
export type EventConsultantQueryType = z.infer<
  typeof eventConsultantQuerySchema
>;
