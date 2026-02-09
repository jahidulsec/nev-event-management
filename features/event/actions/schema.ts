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

export const EventTypeApproverQuerySchema = QuerySchema.extend({});

export type EventTypeApproverType = z.infer<typeof EventTypeApproverSchema>;
export type EventTypeApproverQueryType = z.infer<
  typeof EventTypeApproverQuerySchema
>;

export const EventBudgetSchema = z.object({
  event_id: z.string().min(1),
  item: z.string("Enter budget field name").min(2, "At least 2 characters"),
  unit: z.number("Enter unit quantity").min(1),
  unit_cost: z.number("Enter per unit cose").min(1),
});

export const EventConsultantSchema = z.object({
  event_id: z.string("Please select a event").min(1),
  doctor_id: z.string("Please select a doctor").min(1),
  role: z
    .string("Enter doctor role for the event")
    .min(2, "At least 2 characters"),
  honorarium: z.number("enter doctor honorarium").default(0).optional(),
  duration_h: z.number("enter consultant session duration in hours"),
});

export const EventSchema = z.object({
  track_no: z.string().optional(),
  title: z
    .string("Enter event title")
    .min(3, "Title must be more than 2 characters"),
  event_date: z.date(),
  user_id: z.string("Select a user"),
  product_id: z.string("Select a product"),
  venue_name: z
    .string("Enter event venue name")
    .min(3, "Venue name must be more than 2 characters"),
  venue_address: z
    .string("Enter event venue address")
    .min(3, "Venue address must be more than 2 characters"),
  venue_appropriateness: z.enum(["yes", "no"], "Please fill this field"),
  institute: z
    .string("Enter event institute name")
    .min(3, "Institute name must be more than 2 characters"),
  institute_code: z
    .string("Enter institute code")
    .min(3, "Institute code must be more than 2 characters"),
  institute_area: z
    .string("Enter institute area")
    .min(3, "Institute area must be more than 2 characters"),
  institute_unit: z
    .string("Enter institute unit")
    .min(3, "Institute unit must be more than 2 characters"),
  institute_dept: z
    .string("Enter institute dept")
    .min(3, "Institute dept must be more than 2 characters"),
  objective: z
    .string("Enter event objective")
    .min(3, "Objective must be more than 2 characters"),
  event_type: z.string("Enter event type"),
  internal_participants: z
    .number("Enter internal participants number")
    .positive("Number must be positive value"),
  external_participants: z
    .number("Enter external participants number")
    .positive("Number must be positive value"),
  other_participants: z
    .number("Enter other participants number")
    .positive("Number must be positive value")
    .default(0)
    .optional(),
  approved_material: z.enum(["promotional", "non_branded"], "Select a option"),
  material_code: z.string("Please enter material code").optional(),
  details_participants: z.string("Please enter details").optional(),
  eventBudget: z.array(EventBudgetSchema.omit({ event_id: true })),
  eventConsultant: z.array(EventConsultantSchema.omit({ event_id: true })),
});

export const EventQuerySchema = QuerySchema.extend({});

export type EventType = z.infer<typeof EventSchema>;
export type EventQueryType = z.infer<typeof EventQuerySchema>;
