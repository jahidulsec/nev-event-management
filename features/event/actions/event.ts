"use server";

import { db } from "@/config/db";
import { handleError } from "@/lib/error";
import { apiResponse, response } from "@/lib/response";
import { revalidatePath } from "next/cache";
import { EventStatusSchemaType, EventTrackingType, EventType } from "./schema";
import fs from "fs/promises";
import fs2 from "fs";
import { deleteFile } from "@/utils/file";
import { createNotification } from "@/features/notifications/actions/notification";
import { getApproverDetails } from "@/lib/helper";
import { sendEmail } from "@/services/email";
import RequestorInitMail from "@/features/email/template/ao-init-mail";
import ApproverRequestMail from "@/features/email/template/approver-mail";
import { formatDateTime, getTitleCase } from "@/utils/formatter";
import EventCompletionMail from "@/features/email/template/completion-mail";
import { generateTrackingID } from "@/utils/tracking-id";
import ApproverStatusUpdateMail from "@/features/email/template/status-update";

export const createEvent = async (data: EventType) => {
  const devEmail = process.env.EMAIL_DEV_ADDRESS;
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

    // create event
    const etype = await db.event.create({
      include: {
        event_type: {
          select: {
            title: true,
            approver: {
              orderBy: {
                created_at: "asc",
              },
            },
          },
        },
        user: {
          select: {
            ao: true,
          },
        },
        product: {
          select: {
            product_user: {
              include: {
                user: {
                  select: {
                    user_role: true,
                  },
                },
              },
            },
          },
        },
      },
      data: {
        ...rest,
        ...(eventBudget && {
          event_budget: {
            createMany: { data: eventBudget },
          },
        }),
        ...(eventConsultant && {
          event_consultant: {
            createMany: {
              data: eventConsultant,
            },
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

    // generate tracking ID
    const totalEventCount = await db.event.count();
    const trackingId = generateTrackingID(
      etype.event_type?.title ?? "",
      etype.product_id,
      totalEventCount,
    );

    //  update tracking id
    await db.event.update({
      where: {
        id: etype.id,
      },
      data: {
        track_no: trackingId,
      },
    });

    // revalidate cache
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");

    // create notificaion for creator
    await createNotification({
      work_area_code: data.user_id,
      is_marked: "yes",
      event_id: etype.id,
      status: "read_only",
      message: "You created a new event proposal",
    });

    // push email to creator mail if email exist
    if (etype.user.ao?.email) {
      sendEmail({
        to: [devEmail || etype.user.ao.email],
        subject: "New event creation request",
        html: RequestorInitMail({
          eventTitle: etype.title,
          eventDate: formatDateTime(etype.event_date),
          typeTitle: etype.event_type?.title ?? "",
          status: etype.current_status || "pending",
          product: etype.product_id.toUpperCase(),
        }),
      })
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    }

    // create notifications for first approver
    const firstApprover = await getApproverDetails(etype as any, 0);

    // push email to creator mail if email exist
    if (firstApprover.email) {
      sendEmail({
        to: [devEmail || firstApprover.email], //
        subject: "New event creation request",
        html: ApproverRequestMail({
          approverName: firstApprover.full_name,
          eventId: etype.id,
          eventTitle: etype.title,
          eventDate: formatDateTime(etype.event_date),
          requestorName: etype.user.ao?.full_name ?? "",
          product: etype.product_id.toUpperCase(),
          typeTitle: etype.event_type?.title ?? "",
        }),
      })
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    }

    if (firstApprover.work_area_code) {
      await createNotification({
        work_area_code: firstApprover.work_area_code ?? "",
        is_marked: "no",
        event_id: etype.id,
        status: "action",
        message: "You have a new event proposal approval request",
      });
    }

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
      include: {
        event_attachment: true,
        event_consultant: true,
        event_budget: true,
      },
    });

    // update budget
    if (eventBudget.length > 0) {
      for (const item of eventBudget) {
        const { id: budgetId, event_id, ...rest } = item;

        await db.event_budget.upsert({
          where: { id: budgetId ?? "" },
          create: {
            event_id: event_id ?? id,
            ...rest,
          },
          update: rest,
        });
      }
    }

    // delete budget
    const existingBudgetIds = etype.event_budget.map((item) => item.id);
    const incomingBudgetIds = eventBudget
      .filter((item) => item.id)
      .map((item) => item.id);

    // Find IDs that exist in DB but not in request
    const idsToDelete = existingBudgetIds.filter(
      (id) => !incomingBudgetIds.includes(id),
    );

    if (idsToDelete.length > 0) {
      await db.event_budget.deleteMany({
        where: {
          id: { in: idsToDelete },
        },
      });
    }

    // update consultant
    if (eventConsultant.length > 0) {
      for (const item of eventConsultant) {
        const { id: cId, event_id, ...rest } = item;

        await db.event_consultant.upsert({
          where: { id: cId ?? "" },
          create: {
            event_id: event_id ?? id,
            ...rest,
          },
          update: rest,
        });
      }
    }

    // delete Consultant
    const existingConsultantIds = etype.event_consultant.map((item) => item.id);
    const incomingConsultantIds = eventConsultant
      .filter((item) => item.id)
      .map((item) => item.id);

    // Find IDs that exist in DB but not in request
    const cIdsToDelete = existingConsultantIds.filter(
      (id) => !incomingConsultantIds.includes(id),
    );

    if (cIdsToDelete.length > 0) {
      await db.event_consultant.deleteMany({
        where: {
          id: { in: cIdsToDelete },
        },
      });
    }

    // update attachment
    if (eventAttachment.length > 0) {
      await fs.mkdir("storage/events", { recursive: true });

      for (const item of eventAttachment) {
        const { id: aId, event_id, file, file_path: prevPath, ...rest } = item;

        if (!item?.file) continue;

        const extension = item.file.name.split(".").pop();

        const safeTitle = item.document_title
          ?.replace(/[^a-zA-Z0-9]/g, "_")
          .toLowerCase();

        const filePath = `storage/events/${safeTitle}-${etype.user_id}-${Date.now()}.${extension}`;

        await fs.writeFile(
          filePath,
          Buffer.from(await item.file.arrayBuffer()),
        );

        await db.event_attachment.upsert({
          where: { id: aId ?? "" },
          create: {
            event_id: event_id ?? id,
            file_path: filePath,
            ...rest,
          },
          update: { file_path: filePath, ...rest },
        });

        // delete previous file
        if (item.file_path && item.file) {
          await deleteFile(item.file_path);
        }
      }
    }

    // delete attachment
    const existingAttchementIds = etype.event_attachment.map((item) => item.id);
    const incomingAttchementIds = eventAttachment
      .filter((item) => item.id)
      .map((item) => item.id);

    // Find IDs that exist in DB but not in request
    const aIdsToDelete = existingAttchementIds.filter(
      (id) => !incomingAttchementIds.includes(id),
    );

    if (aIdsToDelete.length > 0) {
      for (const i in aIdsToDelete) {
        const data = await db.event_attachment.delete({
          where: {
            id: aIdsToDelete[i],
          },
        });

        await deleteFile(data.file_path);
      }
    }

    // revalidate cache
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");

    return response({
      success: true,
      message: "Event is updated successfully",
      data: etype,
    });
  } catch (error) {
    console.error(JSON.stringify(error, null, 4));
    const err = handleError(error);
    return response({
      success: false,
      message: err.message ?? "Something went wrong",
    });
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const event = await db.event.delete({
      where: { id },
      include: {
        event_attachment: true,
      },
    });

    // delete files
    const files = event.event_attachment;
    if (files.length > 0) {
      for (const i of files) {
        if (fs2.existsSync(i.file_path)) {
          await fs.unlink(i.file_path);
        }
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/events");

    return response({
      success: true,
      message: "Event is deleted successfully",
      data: event,
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
  const devEmail = process.env.EMAIL_DEV_ADDRESS;
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

    // update event status
    const event = await db.event.findUnique({
      where: {
        id: data.event_id,
      },
      include: {
        event_approver: true,
        event_type: {
          select: {
            title: true,
            approver: {
              orderBy: {
                created_at: "asc",
              },
            },
          },
        },
        user: {
          select: {
            ao: true,
          },
        },
        product: {
          select: {
            product_user: {
              include: {
                user: {
                  select: {
                    user_role: true,
                  },
                },
              },
            },
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

      // create notification for requestor
      await createNotification({
        work_area_code: event?.user_id ?? "",
        is_marked: "no",
        event_id: event?.id ?? "",
        status: "read_only",
        message: "Rejected",
      });

      // Push email to requestor
      if (event?.user.ao?.email) {
        sendEmail({
          to: [devEmail || event.user.ao.email],
          subject: "Event status update",
          html: EventCompletionMail({
            eventTitle: event.title,
            eventDate: formatDateTime(event.event_date),
            typeTitle: event.event_type?.title ?? "",
            status: "rejected",
            product: event.product_id.toUpperCase(),
          }),
        }).catch((err) => console.error(err));
      }
    }

    // get post approval information
    const approvedApproverCount = event?.event_approver.length ?? 0;
    const eventApproverCount = event?.event_type?.approver.length ?? 0;

    const postApproverIndex =
      approvedApproverCount < eventApproverCount
        ? approvedApproverCount
        : undefined;

    // create notificaiton for post approver
    if (postApproverIndex && event) {
      const postApprover = await getApproverDetails(
        event as any,
        postApproverIndex,
      );

      // push email
      if (postApprover.email) {
        // send mail to post approver
        sendEmail({
          to: [devEmail || postApprover.email],
          subject: "Event approval request",
          html: ApproverRequestMail({
            approverName: postApprover?.full_name ?? '',
            eventId: event?.id,
            eventTitle: event.title,
            eventDate: formatDateTime(event.event_date),
            requestorName: event.user.ao?.full_name ?? "",
            product: event.product_id.toUpperCase(),
            typeTitle: event.event_type?.title ?? "",
          }),
        }).catch((err) => console.error(err));

        // send status update to ao
        await createNotification({
          work_area_code: event?.user_id ?? "",
          is_marked: "no",
          event_id: event?.id ?? "",
          status: "read_only",
          message: `Status Update: ${postApprover.full_name} (${data.user_id}) (${data.user_role}) has ${status} the event`,
        });

        // send status update mail to ao
        if (event.user.ao?.email) {
          sendEmail({
            to: [devEmail || event.user.ao?.email],
            subject: "Event approval status update",
            html: ApproverStatusUpdateMail({
              product: getTitleCase(event.product_id),
              eventTitle: event.title,
              typeTitle: event.event_type?.title ?? "",
              status,
              eventDate: formatDateTime(event.event_date),
              approverName: `${postApprover.full_name} (${data.user_id})`,
              remarks,
            }),
          }).catch((err) => console.error(err));
        }
      }

      await createNotification({
        work_area_code: postApprover?.work_area_code ?? "",
        is_marked: "no",
        event_id: data.event_id,
        status: "action",
        message: "You have a new event proposal approval request",
      });
    }

    // if approved by last approver, set event current status approver
    if (
      event?.event_approver.length === event?.event_type?.approver.length &&
      status === "approved"
    ) {
      const eventData = await db.event.update({
        where: {
          id: data.event_id,
        },
        data: {
          current_status: "approved",
        },
      });

      // get suserpadmin
      const admins = await db.user.findMany({
        where: {
          user_role: {
            some: {
              role: "superadmin",
            },
          },
        },
      });

      // create notification for requestor
      await createNotification({
        work_area_code: eventData.user_id ?? "",
        is_marked: "no",
        event_id: eventData.id,
        status: "read_only",
        message: "Approved",
      });

      if (event?.user.ao?.email) {
        sendEmail({
          to: [devEmail || event.user.ao.email],
          subject: "Event status update",
          html: EventCompletionMail({
            eventTitle: event.title,
            eventDate: formatDateTime(event.event_date),
            typeTitle: event.event_type?.title ?? "",
            status: "approved",
            product: event.product_id.toUpperCase(),
          }),
        }).catch((err) => console.error(err));
      }

      for (const i of admins) {
        await createNotification({
          work_area_code: i.work_area_code ?? "",
          is_marked: "no",
          event_id: eventData.id,
          status: "read_only",
          message: "Event proposal has been approved",
        });
      }
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

export const updateEventTrackingNumber = async (data: EventTrackingType) => {
  try {
    const res = await db.event.update({
      where: { id: data.event_id },
      data: {
        track_no: data.track_no,
      },
    });

    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard/events/" + data.event_id + "/preview");

    return apiResponse.single({
      message: "Add tracking number successfully",
      data: res,
    });
  } catch (error) {
    console.error(error);
    return apiResponse.error({ error });
  }
};
