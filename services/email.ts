import { EmailService } from "@/lib/email";
import z from "zod";

const EmailSendSchema = z.object({
  from: z.string().optional(),
  to: z.array(
    z.string("enter recipients emails").email("Invalid email address"),
  ),
  subject: z.string("Enter email subject"),
  text: z.string("Enter email message").optional(),
  html: z.string("Enter html message template").optional(),
});

type EmailSendSchemaType = z.infer<typeof EmailSendSchema>;

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const emailService = new EmailService()
  .setAuth(getEnv("EMAIL_USER"), getEnv("EMAIL_PASSWORD"))
  .setHost(getEnv("EMAIL_HOST"))
  .setPort(Number(getEnv("EMAIL_PORT")))
  .setSecureMethod(process.env.EMAIL_SECURE === "1") // more standard than "1"
  .build();

const sendEmail = async (data: EmailSendSchemaType) => {
  const { to, ...rest } = data;
  const info = await emailService.sendMail({
    from: data.from ?? `SWIFT - Event Management System <${process.env.EMAIL_USER}>`,
    to: to.join(', '),
    ...rest,
  });

  return info;
};

export { sendEmail };
