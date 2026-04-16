import {
  eventApproverStatusEnum,
  eventApproverTypeEnum,
  userRoleSchema,
  yesNoEnum,
} from "@/schemas/common";
import { QuerySchema } from "@/schemas/query";
import z, { TypeOf } from "zod";

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
  type_id: z.string().optional(),
});

export type EventTypeApproverType = z.infer<typeof EventTypeApproverSchema>;
export type EventTypeApproverQueryType = z.infer<
  typeof EventTypeApproverQuerySchema
>;

export const EventBudgetSchema = z.object({
  id: z.string().optional(),
  event_id: z.string().min(1).optional(),
  item: z.string("Enter budget field name").min(2, "At least 2 characters"),
  unit: z.number("Enter unit quantity").min(1),
  unit_cost: z.number("Enter per unit cose").min(1),
});

export const EventConsultantSchema = z.object({
  id: z.string().optional(),
  event_id: z.string("Please select a event").min(1).optional(),
  doctor_id: z.string("Please select a doctor").min(1),
  role: z
    .string("Enter doctor role for the event")
    .min(2, "At least 2 characters"),
  honorarium: z.number("enter doctor honorarium").default(0).optional(),
  duration_h: z.number("enter consultant session duration in hours"),
  in_different_district: z.enum(["yes", "no"]),
  night_stay: z.enum(["yes", "no"]),
  tier_id: z.string("Select a tier"),
});

export const EventAttachemntSchema = z
  .object({
    id: z.string().optional(),
    event_id: z.string("Please select a event").min(1).optional(),
    document_title: z
      .string("Enter document title")
      .min(3, "At least 2 characters"),
    file: z
      .instanceof(File, { message: "Upload a valid file" })
      .refine(
        (file) =>
          [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ].includes(file.type),
        "Upload pdf, image only",
      )
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "File size must be under 5MB",
      })
      .optional(),
    file_path: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If no existing file_path, file is required
    if (!data.file_path && !data.file) {
      ctx.addIssue({
        path: ["file"],
        message: "File is required",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type EventAttachmentType = z.infer<typeof EventAttachemntSchema>;

export const EventSchema = z.object({
  track_no: z.string().optional(),
  title: z
    .string("Enter event title")
    .min(3, "Title must be more than 2 characters"),
  event_date: z.date("Enter a proposed date"),
  user_id: z.string("Select a user"),
  product_id: z.string("Select a product"),
  venue: z
    .string("Enter event venue name and address")
    .min(3, "Venue name and address must be more than 2 characters"),
  food_supplier: z
    .string("Enter event venue address")
    .min(3, "Venue address must be more than 2 characters"),
  venue_appropriateness: z.enum(["yes", "no"], "Please fill this field"),
  institute: z
    .string("Enter event institute name")
    .min(3, "Institute name must be more than 2 characters"),
  institute_unit: z.string("Enter institute unit").optional(),
  institute_dept: z
    .string("Enter institute dept")
    .min(3, "Institute dept must be more than 2 characters"),
  objective: z
    .string("Enter event objective")
    .min(3, "Objective must be more than 2 characters"),
  type: z.string("Enter event type"),
  internal_participants: z
    .number("Enter internal participants number")
    .min(0, "Number must be positive value"),
  external_participants: z
    .number("Enter external participants number")
    .min(0, "Number must be positive value"),
  other_participants: z
    .number("Enter other participants number")
    .min(0, "Number must be positive value")
    .default(0)
    .optional(),
  approved_material: z.enum(["promotional", "non_branded"], "Select a option"),
  event_type_id: z.string().optional(),
  material_code: z.string("Please enter material code").optional(),
  details_participants: z.string("Please enter details").optional(),
  eventBudget: z.array(EventBudgetSchema),
  eventConsultant: z.array(EventConsultantSchema),
  eventAttachment: z.array(EventAttachemntSchema),
});

export const EventQuerySchema = QuerySchema.extend({
  work_area_code: z.string().optional(),
  role: userRoleSchema.optional(),
  status: z.enum(["approved", "rejected", "processing"]).optional(),
});

export const EventStatusSchema = z.object({
  event_id: z.string(),
  user_id: z.string(),
  user_role: userRoleSchema,
  status: eventApproverStatusEnum,
  remarks: z.string("enter remarks").min(2, "At least two characters"),
  eventUserType: z.string().optional(),
});

export type EventType = z.infer<typeof EventSchema>;
export type EventQueryType = z.infer<typeof EventQuerySchema>;
export type EventStatusSchemaType = z.infer<typeof EventStatusSchema>;

export const EventStatusHistoryQuerySchema = QuerySchema.omit({}).extend({
  event_id: z.string().optional(),
});

export type EventStatusHistoryQueryType = z.infer<
  typeof EventStatusHistoryQuerySchema
>;

export const EventFirstApprovalSchema = z.object({
  consultant_id: z.string(),
  topic_expert: yesNoEnum,
  is_suitable: yesNoEnum,
  first_approver_id: z.string(),
});

export const EventECApprovalSchema = z.object({
  consultant_id: z.string(),
  hororarium_check: yesNoEnum,
  consultant_form_attached: yesNoEnum,
  nth_engagement: z.number("Enter a positive number").positive(),
  ec_id: z.string(),
});

export type EventFirstApprovalType = z.infer<typeof EventFirstApprovalSchema>;

export type EventECApprovalType = z.infer<typeof EventECApprovalSchema>;

export const EventTrackingSchema = z.object({
  event_id: z.string("enter event id"),
  track_no: z.string("Add a tracking no").min(2, "At least 2 characters"),
});

export type EventTrackingType = z.infer<typeof EventTrackingSchema>;
