import { sendEmail } from "@/services/email";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const info = await sendEmail({
      to: ["2ejahid@gmail.com"],
      subject: "Test mail from nevian event management mail",
      text: "Hello Jahidul",
    });

    return Response.json(info);
  } catch (error) {
    return Response.json(error);
  }
}
