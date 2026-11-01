"use server";

import { apiResponse } from "@/lib/response";
import { cacheTags } from "@/lib/server-cache";
import { eventTypeService } from "@/services/event-type";
import { getSerializeData } from "@/utils/helper";
import {
  eventTypePayloadSchema,
  EventTypePayloadType,
} from "../schema/schema";

export const createEventType = async (payload: EventTypePayloadType) => {
  try {
    const data = eventTypePayloadSchema.parse(payload);

    const res = await eventTypeService.createEventType({ data });

    if (!res) throw new Error("Failed to create event type");

    return apiResponse.single({
      data: getSerializeData(res) as typeof res,
      message: "New event type is created successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const updateEventType = async (
  id: string,
  payload: EventTypePayloadType,
) => {
  try {
    const data = eventTypePayloadSchema.parse(payload);

    // approver and event reads embed the event type (title, limits)
    const res = await eventTypeService.updateEventType({
      filter: { id },
      data,
      revalidateTags: [cacheTags.approvers, cacheTags.events],
    });

    if (!res) throw new Error("Failed to update event type");

    return apiResponse.single({
      data: getSerializeData(res) as typeof res,
      message: "Event type is updated successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const deleteEventType = async (id: string) => {
  try {
    const res = await eventTypeService.deleteEventType({ filter: { id } });

    if (!res) throw new Error("Failed to delete event type");

    return apiResponse.single({
      data: getSerializeData(res) as typeof res,
      message: "Event type is deleted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
