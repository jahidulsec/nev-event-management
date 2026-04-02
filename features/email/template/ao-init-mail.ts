export default function RequestorInitMail({
  product,
  eventTitle,
  typeTitle,
  status,
  eventDate,
}: {
  product: string;
  eventTitle: string;
  typeTitle: string;
  status: string;
  eventDate: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
        <div
            style="max-width:600px; margin:auto; background:#ffffff; border: 1px dashed #4f46e5; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">

            <!-- Header -->
             <div style="background:#f9f9fa; color:#09090b; padding:16px 24px;">
           <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo/nevian.png" alt="nevian logo" width="100">
                <div>
                  <h2 style="margin:0; font-size: 20px;">New Event Proposal Created</h2>
                  <p style="margin:0; margin-top: 5px; color: #666; font-size: 14px;">Event Management System</p>
                </div>
            </div>

            <!-- Body -->
            <div style="padding:24px; color:#333;">
                <p style="font-size:14px;">
                    <strong>${product}</strong> /
                    ${typeTitle || "Event"} /
                    <strong>${eventTitle}</strong>
                </p>

                <p style="margin-top:16px;">
                    You have successfully created a new event proposal. Below are the details:
                </p>

                <table style="width:100%; margin-top:16px; border-collapse:collapse;">
                    <tr>
                        <td style="padding:8px 0; font-weight:bold;">Event Title:</td>
                        <td>${eventTitle}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0; font-weight:bold;">Event Type:</td>
                        <td>${typeTitle || "-"}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0; font-weight:bold;">Product:</td>
                        <td>${product}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0; font-weight:bold;">Event Date:</td>
                        <td>${eventDate}</td>
                    </tr>
                    ${
                      status
                        ? `
                    <tr>
                        <td style="padding:8px 0; font-weight:bold;">Status:</td>
                        <td>${status}</td>
                    </tr>`
                        : ""
                    }
                </table>


            </div>

            <!-- Footer -->
            <div style="background:#f1f1f1; padding:16px; font-size:12px; text-align:center; color:#666;">
                This is an automated message. Please do not reply.
            </div>

        </div>
    </div>
  `;
}
