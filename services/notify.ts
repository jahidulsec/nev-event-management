import { createNotification } from "@/notifications/actions/notifications";
import { CreateNotificationDTOType } from "@/notifications/schema/schema";
import { sendEmail } from "./email";

export type NotifyInput = {
  recipient: {
    employee_id?: string | null;
    email?: string | null;
  };
  event_id: string;
  message: string;
  status?: CreateNotificationDTOType["status"];
  is_marked?: CreateNotificationDTOType["is_marked"];
  // omit to skip the email channel
  email?: {
    subject: string;
    html: string;
  };
};


export const notify = async ({
  recipient,
  event_id,
  message,
  status = "read_only",
  is_marked = "no",
  email,
}: NotifyInput) => {
  const devEmail = process.env.EMAIL_DEV_ADDRESS;

  if (email && (devEmail || recipient.email)) {
    sendEmail({
      to: [devEmail || (recipient.email as string).toLowerCase()],
      subject: email.subject,
      html: email.html,
    }).catch((err) => console.error(err));
  }

  if (!recipient.employee_id) return null;

  return createNotification({
    employee_id: recipient.employee_id,
    event_id,
    message,
    status,
    is_marked,
  });
};

/** Deliver several notifications; one failing does not stop the others. */
export const notifyMany = async (inputs: NotifyInput[]) => {
  return Promise.allSettled(inputs.map((input) => notify(input)));
};
