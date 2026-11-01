import { EventSingleProps } from "../libs/events";
import { CreateEventPayloadType } from "../schemas/events";

/** Map a stored event to the values `EventForm` edits (Decimals -> numbers, null -> undefined). */
export const getEventFormValues = (
  event: EventSingleProps,
): Partial<CreateEventPayloadType & { id: string }> => ({
  id: event.id,
  title: event.title,
  event_date: event.event_date,
  employee_id: event.employee_id ?? undefined,
  product_id: event.product_id,
  venue: event.venue,
  food_supplier: event.food_supplier,
  institute: event.institute,
  institute_unit: event.institute_unit ?? undefined,
  institute_dept: event.institute_dept,
  objective: event.objective,
  type: event.type,
  internal_participants: event.internal_participants,
  external_participants: event.external_participants,
  other_participants: event.other_participants ?? undefined,
  details_participants: event.details_participants ?? undefined,
  approved_material: event.approved_material,
  material_code: event.material_code ?? undefined,
  venue_appropriateness: event.venue_appropriateness,
  event_type_id: event.event_type_id ?? undefined,
  sap_area_code: event.sap_area_code,

  // `id` is kept on the nested rows so the update action upserts instead of recreating
  eventBudget: event.event_budgets.map(({ id, item, unit, unit_cost }) => ({
    id,
    item,
    unit,
    unit_cost: Number(unit_cost),
  })),
  eventConsultant: event.event_consultants.map((consultant) => ({
    id: consultant.id,
    doctor_id: consultant.doctor_id,
    role: consultant.role,
    duration_h: Number(consultant.duration_h),
    honorarium: Number(consultant.honorarium ?? 0),
    in_different_district: consultant.in_different_district ?? "no",
    night_stay: consultant.night_stay ?? "no",
    tier_id: consultant.tier_id ?? undefined,
  })),
  eventAttachment: event.event_attachments.map(
    ({ id, document_title, file_path }) => ({ id, document_title, file_path }),
  ),
});
