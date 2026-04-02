import { sendEmail } from "@/services/email";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const info = await sendEmail({
      from:  `Event Management System <${process.env.EMAIL_USER}>`,
      to: ["jahidul.app@gmail.com"],
      subject: "Test mail from nevian event management mail",
      html: '<div style="background:#f9f9fa; color:#09090b; padding:16px 24px;">Hello Jahidul</div>',
    });

    console.log("heelo");

    return Response.json(info);
  } catch (error) {
    console.error("error", error);
    return Response.json(error);
  }
}
