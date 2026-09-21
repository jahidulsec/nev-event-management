"use server";

import { apiResponse } from "@/lib/response";
import { approverService } from "@/services/approver";
import {
  approverPayloadSchema,
  ApproverPayloadType,
} from "../schema/schema";

export const createApprover = async (payload: ApproverPayloadType) => {
  try {
    const { event_type_id, user_type, type } =
      approverPayloadSchema.parse(payload);

    const res = await approverService.createApprover({
      data: {
        user_type,
        type,
        event_type: { connect: { id: event_type_id } },
      },
    });

    if (!res) throw new Error("Failed to create event type approver");

    return apiResponse.single({
      data: res,
      message: "New event type approver is created successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const updateApprover = async (
  id: string,
  payload: ApproverPayloadType,
) => {
  try {
    const { event_type_id, user_type, type } =
      approverPayloadSchema.parse(payload);

    const res = await approverService.updateApprover({
      filter: { id },
      data: {
        user_type,
        type,
        event_type: { connect: { id: event_type_id } },
      },
    });

    if (!res) throw new Error("Failed to update event type approver");

    return apiResponse.single({
      data: res,
      message: "Event type approver is updated successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const deleteApprover = async (id: string) => {
  try {
    const res = await approverService.deleteApprover({ filter: { id } });

    if (!res) throw new Error("Failed to delete event type approver");

    return apiResponse.single({
      data: res,
      message: "Event type approver is deleted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
