"use server";

import { saveFileToStorage } from "@/lib/file";
import { apiResponse } from "@/lib/response";
import { cacheTags } from "@/lib/server-cache";
import { deleteFile } from "@/utils/file";
import { generateTrackingID } from "@/utils/tracking-id";
import {
  createEventPayloadSchema,
  CreateEventPayloadType,
  updateEventPayloadSchema,
  UpdateEventPayloadType,
  updateEventTrackingPayloadSchema,
  UpdateEventTrackingPayloadType,
} from "@/features/events/schemas/events";
import { eventService } from "@/services/events";
import { eventBudgetService } from "@/services/event-budgets";
import { eventConsultantService } from "@/services/event-consultants";
import { eventAttachmentService } from "@/services/event-attachments";
import { updateTag } from "next/cache";
import { notify } from "@/services/notify";
import { notifyNextApprover } from "@/lib/approver";
import RequestorInitMail from "@/features/email/template/ao-init-mail";
import { formatDateTime } from "@/utils/formatter";
import { assertPermission } from "@/lib/permission-guard";

const deleteFiles = (filePaths: string[]) =>
  Promise.allSettled(filePaths.map((filePath) => deleteFile(filePath)));

export const createEvent = async (data: CreateEventPayloadType) => {
  // files saved but not yet referenced by a database row
  let unsavedFilePaths: string[] = [];

  try {
    const { eventBudget, eventConsultant, eventAttachment, ...rest } =
      createEventPayloadSchema.parse(data);

    // check budget
    if (!eventBudget.length) throw new Error("Add event budget");

    // save files and get path
    const attachmentsData = await Promise.all(
      eventAttachment.map(async ({ file, event_id, ...attachment }) => {
        if (!file)
          return { ...attachment, file_path: attachment.file_path as string };

        const { filePath } = await saveFileToStorage("events", file);
        unsavedFilePaths.push(filePath);
        return { ...attachment, file_path: filePath };
      }),
    );

    const {
      product_id,
      sap_area_code,
      employee_id,
      event_type_id,
      ...eventFields
    } = rest;

    // create event with nested budgets, consultants, attachments
    const event = await eventService.createEvent({
      data: {
        ...eventFields,
        product: { connect: { id: product_id } },
        area: { connect: { sap_area_code } },
        ...(employee_id && { users: { connect: { employee_id } } }),
        ...(event_type_id && {
          event_type: { connect: { id: event_type_id } },
        }),
        event_budgets: {
          createMany: { data: eventBudget },
        },
        ...(eventConsultant.length && {
          event_consultants: {
            createMany: { data: eventConsultant },
          },
        }),
        ...(attachmentsData.length && {
          event_attachments: {
            createMany: { data: attachmentsData },
          },
        }),
      },
      options: {
        include: {
          event_type: { select: { title: true } },
          users: { select: { email: true, full_name: true } },
        },
      },
    });

    if (!event) throw new Error("Failed to create event");

    // files are now referenced by the event, keep them from here on
    unsavedFilePaths = [];

    // generate tracking ID
    const totalEventCount = await eventService.getEventCount({
      cacheOption: {
        cache: false,
      },
    });
    const trackingId = generateTrackingID(
      event.event_type?.title ?? "",
      event.product_id,
      totalEventCount,
      event.event_date,
    );

    // update event tracking id
    // revalidate attachements, budgets, consultants tags
    const updateEvent = await eventService.updateEvent({
      filter: { id: event.id },
      data: { track_no: trackingId },
      revalidateTags: [
        cacheTags.eventBudgets,
        cacheTags.eventAttachments,
        cacheTags.eventConsultants,
      ],
    });

    // create notificaion for creator
    await notify({
      recipient: {
        email: event.users?.email ?? "",
        employee_id: data.employee_id,
      },
      event_id: event.id,
      message: "You created a new event proposal",
      is_marked: "no",
      status: "read_only",
      email: {
        subject: "You created a new event proposal",
        html: RequestorInitMail({
          eventTitle: event.title,
          eventDate: formatDateTime(event.event_date),
          typeTitle: event.event_type?.title ?? "",
          status: event.current_status || "pending",
          product: event.product_id.toUpperCase(),
        }),
      },
    });

    // notify first approver, resolved from the role of the event type's first approver
    await notifyNextApprover(event, 0);

    return apiResponse.single({
      data: updateEvent,
      message: "New event is created successfully",
    });
  } catch (error) {
    await deleteFiles(unsavedFilePaths);
    return apiResponse.error({ error });
  }
};

export const updateEvent = async (id: string, data: UpdateEventPayloadType) => {
  // files saved but not yet referenced by a database row
  const unsavedFilePaths = new Set<string>();

  try {
    await assertPermission("event:update");

    const { eventBudget, eventConsultant, eventAttachment, ...rest } =
      updateEventPayloadSchema.parse(data);

    const {
      product_id,
      sap_area_code,
      employee_id,
      event_type_id,
      ...eventFields
    } = rest;

    // update event fields
    const event = await eventService.updateEvent({
      filter: { id },
      data: {
        ...eventFields,
        ...(product_id && { product: { connect: { id: product_id } } }),
        ...(sap_area_code && { area: { connect: { sap_area_code } } }),
        ...(employee_id && { users: { connect: { employee_id } } }),
        ...(event_type_id && {
          event_type: { connect: { id: event_type_id } },
        }),
      },
      options: {
        include: {
          event_budgets: true,
          event_consultants: true,
          event_attachments: true,
        },
      },
    });

    if (!event) throw new Error("Failed to update event");

    // upsert budgets
    for (const {
      id: budgetId,
      event_id: _budgetEventId,
      ...budgetData
    } of eventBudget) {
      await eventBudgetService.upsertEventBudget({
        filter: { id: budgetId ?? "" },
        data: { ...budgetData, event_id: id },
      });
    }

    // delete removed budgets
    const incomingBudgetIds = eventBudget.map((item) => item.id);
    const budgetIdsToDelete = event.event_budgets
      .map((item) => item.id)
      .filter((budgetId) => !incomingBudgetIds.includes(budgetId));

    if (budgetIdsToDelete.length) {
      await eventBudgetService.deleteEventBudgets({
        filter: { id: { in: budgetIdsToDelete } },
      });
    }

    // upsert consultants
    for (const {
      id: consultantId,
      event_id: _consultantEventId,
      ...consultantData
    } of eventConsultant) {
      await eventConsultantService.upsertEventConsultant({
        filter: { id: consultantId ?? "" },
        data: { ...consultantData, event_id: id },
      });
    }

    // delete removed consultants
    const incomingConsultantIds = eventConsultant.map((item) => item.id);
    const consultantIdsToDelete = event.event_consultants
      .map((item) => item.id)
      .filter((consultantId) => !incomingConsultantIds.includes(consultantId));

    if (consultantIdsToDelete.length) {
      await eventConsultantService.deleteEventConsultants({
        filter: { id: { in: consultantIdsToDelete } },
      });
    }

    // upsert attachments
    for (const {
      id: attachmentId,
      event_id: _attachmentEventId,
      file,
      file_path,
      ...attachmentData
    } of eventAttachment) {
      const previous = event.event_attachments.find(
        (item) => item.id === attachmentId,
      );

      let newFilePath = file_path as string;
      if (file) {
        newFilePath = (await saveFileToStorage("events", file)).filePath;
        unsavedFilePaths.add(newFilePath);
      }

      await eventAttachmentService.upsertEventAttachment({
        filter: { id: attachmentId ?? "" },
        data: { ...attachmentData, event_id: id, file_path: newFilePath },
      });
      unsavedFilePaths.delete(newFilePath);

      // delete previous file when it is replaced by a new upload
      if (file && previous?.file_path) {
        await deleteFile(previous.file_path);
      }
    }

    // delete removed attachments and their files
    const incomingAttachmentIds = eventAttachment.map((item) => item.id);
    const attachmentsToDelete = event.event_attachments.filter(
      (item) => !incomingAttachmentIds.includes(item.id),
    );

    if (attachmentsToDelete.length) {
      await eventAttachmentService.deleteEventAttachments({
        filter: { id: { in: attachmentsToDelete.map((item) => item.id) } },
      });

      for (const attachment of attachmentsToDelete) {
        await deleteFile(attachment.file_path);
      }
    }

    // revalidate nested resource tags
    updateTag(cacheTags.eventBudgets);
    updateTag(cacheTags.eventAttachments);
    updateTag(cacheTags.eventConsultants);

    return apiResponse.single({
      data: event,
      message: "Event is updated successfully",
    });
  } catch (error) {
    console.log(error);
    await deleteFiles([...unsavedFilePaths]);
    return apiResponse.error({ error });
  }
};

export const updateEventTrackingNumber = async (
  data: UpdateEventTrackingPayloadType,
) => {
  try {
    const { event_id, track_no } = updateEventTrackingPayloadSchema.parse(data);

    const event = await eventService.updateEvent({
      filter: { id: event_id },
      data: { track_no },
    });

    if (!event) throw new Error("Failed to update tracking number");

    return apiResponse.single({
      data: event,
      message: "Add tracking number successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};

export const deleteEvent = async (id: string) => {
  try {
    await assertPermission("event:delete");

    const event = await eventService.deleteEvent({
      filter: { id },
      options: {
        include: { event_attachments: true },
      },
    });

    if (!event) throw new Error("Failed to delete event");

    // clean up attachment files, nested rows are removed via cascade delete
    for (const attachment of event.event_attachments) {
      await deleteFile(attachment.file_path);
    }

    return apiResponse.single({
      data: event,
      message: "Event is deleted successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
