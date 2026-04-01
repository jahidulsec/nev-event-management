import { sendEmail } from "@/services/email";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const info = await sendEmail({
      from:  `Event Management System <${process.env.EMAIL_USER}>`,
      to: ["jahidul.app@gmail.com"],
      subject: "Test mail from nevian event management mail",
      text: "Hello Jahidul",
    });

    console.log("heelo");

    return Response.json(info);
  } catch (error) {
    console.error("error", error);
    return Response.json(error);
  }
}
