import { yesNoEnum } from "@/schemas/common";
import { QuerySchema } from "@/schemas/query";
import z from "zod";
import { createEventAttachmentDTOSchema } from "./event-attachments";
import { createEventBudgetDTOSchema } from "./event-budgets";
import { createEventConsultantDTOSchema } from "./event-consultants";

export const eventApprovedMaterialEnum = z.enum(
  ["promotional", "non_branded"],
  "Select a option",
);

export const eventCurrentStatusEnum = z.enum(
  ["approved", "rejected", "processing", "rework"],
  "Select a status",
);

export const createEventDTOSchema = z.object({
  title: z
    .string("Enter event title")
    .min(3, "At least 3 characters")
    .max(250, "not more than 250 character"),

  event_date: z.coerce.date("Select event date"),

  employee_id: z
    .string("Enter employee id")
    .max(10, "not more than 10 character")
    .optional(),

  product_id: z.string("Select a product"),

  venue: z
    .string("Enter event venue")
    .min(3, "At least 3 characters")
    .max(255, "not more than 255 character"),

  food_supplier: z
    .string("Enter food supplier")
    .min(3, "At least 3 characters")
    .max(200, "not more than 200 character"),

  institute: z
    .string("Enter institute name")
    .min(3, "At least 3 characters")
    .max(250, "not more than 250 character"),

  institute_unit: z
    .string("Enter institute unit")
    .max(150, "not more than 150 character")
    .optional(),

  institute_dept: z
    .string("Enter institute department")
    .min(2, "At least 2 characters")
    .max(150, "not more than 150 character"),

  objective: z
    .string("Enter event objective")
    .min(2, "At least 2 characters")
    .max(150, "not more than 150 character"),

  type: z.string("Enter event type").max(100, "not more than 100 character"),

  internal_participants: z
    .number("Enter internal participants number")
    .min(0, "Number must be positive value"),

  external_participants: z
    .number("Enter external participants number")
    .min(0, "Number must be positive value"),

  details_participants: z.string("Enter participant details").optional(),

  approved_material: eventApprovedMaterialEnum,

  material_code: z
    .string("Enter material code")
    .max(200, "not more than 200 character")
    .optional(),

  current_status: eventCurrentStatusEnum.optional().default("processing"),

  other_participants: z
    .number("Enter other participants number")
    .min(0, "Number must be positive value")
    .optional()
    .default(0),

  venue_appropriateness: yesNoEnum,

  track_no: z
    .string("Enter tracking number")
    .max(50, "not more than 50 character")
    .optional(),

  event_type_id: z.string("Select a event type").optional(),

  is_archived: yesNoEnum.optional().default("no"),

  sap_area_code: z
    .string("Select an area")
    .max(6, "not more than 6 character"),
});

export const updateEventDTOSchema = createEventDTOSchema.partial();

export const createEventPayloadSchema = createEventDTOSchema.extend({
  eventBudget: z.array(createEventBudgetDTOSchema),
  eventConsultant: z.array(createEventConsultantDTOSchema).optional().default([]),
  eventAttachment: z.array(createEventAttachmentDTOSchema).optional().default([]),
});

export const eventQuerySchema = QuerySchema.extend({
  employee_id: z.string().optional(),
  sap_area_code: z.string().optional(),
  event_type_id: z.string().optional(),
  status: eventCurrentStatusEnum.optional(),
  is_archived: yesNoEnum.optional().default("no"),
  start: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
    .optional(),
  end: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
    .optional(),
});

export const eventExportQuerySchema = eventQuerySchema.omit({
  page: true,
  size: true,
  sort: true,
  search: true,
});

export type CreateEventDTOType = z.infer<typeof createEventDTOSchema>;
export type UpdateEventDTOType = z.infer<typeof updateEventDTOSchema>;
export type CreateEventPayloadType = z.infer<typeof createEventPayloadSchema>;
export type EventQueryType = z.infer<typeof eventQuerySchema>;
export type EventExportQueryType = z.infer<typeof eventExportQuerySchema>;
