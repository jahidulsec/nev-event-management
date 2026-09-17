"use server";

import { db } from "@/config/db";
import { saveFilesToStorage } from "@/lib/file";
import { apiResponse } from "@/lib/response";
import { cacheTags } from "@/lib/server-cache";
import { generateTrackingID } from "@/utils/tracking-id";
import {
  createEventPayloadSchema,
  CreateEventPayloadType,
} from "@/features/events/schemas/events";
import { eventService } from "@/services/events";

export const createEvent = async (data: CreateEventPayloadType) => {
  try {
    const { eventBudget, eventConsultant, eventAttachment, ...rest } =
      createEventPayloadSchema.parse(data);

    // check budget
    if (!eventBudget.length) throw new Error("Add event budget");

    // save files and get path
    const newFiles = eventAttachment
      .filter((attachment) => attachment.file)
      .map((attachment) => attachment.file as File);

    const savedFiles = (await saveFilesToStorage("events", newFiles)) ?? [];

    let fileIndex = 0;
    const attachmentsData = eventAttachment.map(
      ({ file, event_id, ...attachment }) => ({
        ...attachment,
        file_path: file
          ? savedFiles[fileIndex++].filePath
          : (attachment.file_path as string),
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
        },
      },
    });

    if (!event) throw new Error("Failed to create event");

    // generate tracking ID
    const totalEventCount = await eventService.getEventCount({
      cacheOption: {
        revalidate: "off",
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

    return apiResponse.single({
      data: updateEvent,
      message: "New event is created successfully",
    });
  } catch (error) {
    return apiResponse.error({ error });
  }
};
