"use server";

import { db } from "@/config/db";
import { handleError } from "@/lib/error";
import { response } from "@/lib/response";
import { revalidatePath } from "next/cache";
import { EventType } from "./schema";
import fs from "fs/promises";
import fs2 from "fs";

export const createEvent = async (data: EventType) => {
  const files: any[] = [];
  try {
    const { eventAttachment, eventConsultant, eventBudget, ...rest } = data;

    // check event budgets
    if (!eventBudget) throw new Error("Add event budget");

    // get file path
    if (eventAttachment.length > 0) {
      for (let i = 0; i < eventAttachment.length; i++) {
        const filePath = `/storage/events/${eventAttachment[i].document_title.replaceAll(" ", "_")}-${rest.user_id}-${crypto.randomUUID()}`;

        // storage document
        fs.mkdir("storage", { recursive: true });
        await fs.writeFile(
          filePath,
          Buffer.from(await eventAttachment[0].file.arrayBuffer()),
        );

        // add to files variable
        files.push({
          document_title: eventAttachment[i].document_title,
          file_path: filePath,
        });
      }
    }

    const etype = await db.event.create({
      data: {
        ...rest,
        ...(eventBudget && {
          event_budget: {
            createMany: { data: eventBudget },
          },
        }),
        ...(eventConsultant && {
          event_consultant: {
            createMany: { data: eventConsultant },
          },
        }),
        ...(files && {
          event_attachment: {
            createMany: {
              data: files,
            },
          },
        }),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");

    return response({
      success: true,
      message: "New event is created successfully",
      data: etype,
    });
  } catch (error) {
    console.error(error);

    // delete file
    if (files.length > 0) {
      // delete file
      for (let i = 0; i < files.length; i++) {
        if (files[i].file_path && fs2.existsSync(files[i].file_path)) {
          await fs.unlink(files[i].file_path);
        }
      }
    }

    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};

export const updateEvent = async (id: string, data: EventType) => {
  try {
    const etype = await db.event.update({
      where: { id },
      data: data,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");

    return response({
      success: true,
      message: "Event is updated successfully",
      data: etype,
    });
  } catch (error) {
    console.error(error);
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const type = await db.approver.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");

    return response({
      success: true,
      message: "Event is deleted successfully",
      data: type,
    });
  } catch (error) {
    console.error(error);
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};
