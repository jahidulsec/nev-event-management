"use server";

import { apiResponse } from "@/lib/response";
import { cacheTags } from "@/lib/server-cache";
import { eventService } from "@/services/events";
import { eventApproverService } from "@/services/event-approvers";
import { eventStatusHistoryService } from "@/services/event-status-histories";
import { notify } from "@/services/notify";
import { notifyNextApprover } from "@/lib/approver";
import EventCompletionMail from "@/features/email/template/completion-mail";
import { formatDateTime } from "@/utils/formatter";
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
          event_type: {
            select: {
              title: true,
              approver: { orderBy: { created_at: "asc" } },
            },
          },
          users: { select: { employee_id: true, email: true, full_name: true } },
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

    if (isFinalApproval) {
      // final approver approved, let the creator know the event is approved
      await notify({
        recipient: {
          email: event.users?.email,
          employee_id: event.users?.employee_id,
        },
        event_id,
        message: "Your event proposal has been approved",
        is_marked: "no",
        status: "read_only",
        email: {
          subject: "Event status update",
          html: EventCompletionMail({
            eventTitle: event.title,
            eventDate: formatDateTime(event.event_date),
            typeTitle: event.event_type?.title ?? "",
            status: "approved",
            product: event.product_id.toUpperCase(),
          }),
        },
      });
    } else if (status === "approved") {
      // approvers before the next one have already approved, so the number of
      // approvals so far is the index of the next approver in the chain
      await notifyNextApprover(event, event.event_approvers.length);
    }

    return apiResponse.single({
      data: statusHistory,
      message: "Event status is submitted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
