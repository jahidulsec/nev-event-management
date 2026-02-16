"use server";

import { db } from "@/config/db";
import { handleError } from "@/lib/error";
import { response } from "@/lib/response";
import { revalidatePath } from "next/cache";
import { EventStatusSchemaType, EventType } from "./schema";
import fs from "fs/promises";
import fs2 from "fs";

export const createEvent = async (data: EventType) => {
  const files: any[] = [];
  try {
    const { eventAttachment, eventConsultant, eventBudget, ...rest } = data;

    // check event budgets
    if (!eventBudget) throw new Error("Add event budget");

    // get file path
    if (eventAttachment?.length) {
      await fs.mkdir("storage/events", { recursive: true });

      for (const attachment of eventAttachment) {
        if (!attachment?.file) continue;

        const extension = attachment.file.name.split(".").pop();

        const safeTitle = attachment.document_title
          ?.replace(/[^a-zA-Z0-9]/g, "_")
          .toLowerCase();

        const filePath = `storage/events/${safeTitle}-${rest.user_id}-${Date.now()}.${extension}`;

        await fs.writeFile(
          filePath,
          Buffer.from(await attachment.file.arrayBuffer()),
        );

        files.push({
          document_title: attachment.document_title,
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
    const { eventAttachment, eventConsultant, eventBudget, ...eventData } =
      data;

    const etype = await db.event.update({
      where: { id },
      data: eventData,
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
    const type = await db.event.delete({
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

export const createEventStatus = async (data: EventStatusSchemaType) => {
  try {
    const { status, remarks, eventUserType, ...rest } = data;
    const res = await db.event_approver.upsert({
      where: {
        event_id_user_id: {
          event_id: data.event_id,
          user_id: data.user_id,
        },
      },
      create: {
        ...rest,
        event_status_history: {
          create: {
            status,
            remarks,
          },
        },
      },
      update: {
        event_status_history: {
          create: {
            status,
            remarks,
          },
        },
      },
    });

    // if event rejected, update event current status
    if (status === "rejected") {
      await db.event.update({
        where: {
          id: data.event_id,
        },
        data: {
          current_status: "rejected",
        },
      });
    }

    // if approved by last approver, set event current status approver
    if (eventUserType === "budget" && status === "approved") {
      await db.event.update({
        where: {
          id: data.event_id,
        },
        data: {
          current_status: "approved",
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");

    return response({
      success: true,
      message: "Event status is submitted successfully",
      data: res,
    });
  } catch (error) {
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};
