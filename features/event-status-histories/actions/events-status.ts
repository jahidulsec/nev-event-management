"use server";

import { apiResponse } from "@/lib/response";
import { cacheTags } from "@/lib/server-cache";
import { eventService } from "@/services/events";
import { eventApproverService } from "@/services/event-approvers";
import { eventStatusHistoryService } from "@/services/event-status-histories";
import { updateTag } from "next/cache";
import {
  createEventStatusPayloadSchema,
  CreateEventStatusPayloadType,
} from "../schema/schema";

export const createEventStatus = async (data: CreateEventStatusPayloadType) => {
  try {
    const { event_id, employee_id, sap_area_code, user_role, status, remarks } =
      createEventStatusPayloadSchema.parse(data);

    // find existing approver record for this event and user
    const approver = await eventApproverService.getEventApproverUniq({
      filter: { event_id_employee_id: { event_id, employee_id } },
      cacheOption: { cache: false },
    });

    // record status history, create approver record on first submission
    const statusHistory = approver
      ? await eventStatusHistoryService.createEventStatusHistory({
          data: {
            status,
            remarks,
            event_approvers: { connect: { id: approver.id } },
          },
        })
      : await eventApproverService
          .createEventApprover({
            data: {
              user_role,
              sap_area_code,
              events: { connect: { id: event_id } },
              users: { connect: { employee_id } },
              event_status_histories: { create: { status, remarks } },
            },
            options: { include: { event_status_histories: true } },
          })
          .then((res) => res?.event_status_histories[0] ?? null);

    if (!statusHistory) throw new Error("Failed to submit event status");

    // get event approval progress
    const event = await eventService.getEventUniq({
      filter: { id: event_id },
      options: {
        include: {
          event_approvers: true,
          event_type: { select: { approver: true } },
        },
      },
      cacheOption: { cache: false },
    });

    if (!event) throw new Error("Event not found");

    const isFinalApproval =
      status === "approved" &&
      event.event_approvers.length === (event.event_type?.approver.length ?? 0);

    // rejected, rework or last approver approval changes the event status
    if (status !== "approved" || isFinalApproval) {
      await eventService.updateEvent({
        filter: { id: event_id },
        data: { current_status: status },
      });
    }

    updateTag(cacheTags.events);
    updateTag(cacheTags.eventStatusHistories);
    updateTag(cacheTags.eventStatusHistoriesCount);

    return apiResponse.single({
      data: statusHistory,
      message: "Event status is submitted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
