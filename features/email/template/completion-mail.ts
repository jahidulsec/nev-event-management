export default function EventApprovedMail({
  product,
  typeTitle,
  eventDate,
  eventTitle,
  status,
}: {
  product: string;
  eventDate: string;
  typeTitle: string;
  eventTitle: string;
  status: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
        <div
            style="max-width:600px; margin:auto; background:#ffffff; border: 1px dashed #206bb9; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">

            <!-- Header -->
            <div style="background:#f9f9fa; color:#09090b; padding:16px 24px;">
                 <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo/nevian.png" alt="nevian logo" width="100">
                <div style="display: flex; flex-direction: column; gap: 0px;">
                    <h2 style="margin:0;">Event Approval Status</h2>
                    <p style="margin:0; color: #666; font-size: 11px;">Event Management System</p>
                </div>
            </div>

            <!-- Body -->
            <div style="padding:24px; color:#333;">

                <p style="font-size:14px;">
                    Hello,
                </p>

                <p style="margin-top:12px;">
                    Your event proposal has been <strong style="color:#206bb9;">${status}</strong>.
                </p>

                <!-- Summary -->
                <p style="margin-top:16px; font-size:14px;">
                    <strong>${product}</strong> /
                    ${typeTitle || "Event"} /
                    <strong>${eventTitle}</strong>
                </p>

                <!-- Event Details -->
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

                </table>



                <!-- Extra Message -->
                <p style="margin-top:20px; font-size:13px; color:#555;">
                    You can now proceed with execution and coordination for this event.
                </p>

            </div>

            <!-- Footer -->
            <div style="background:#f1f1f1; padding:16px; font-size:12px; text-align:center; color:#666;">
                This is an automated message. Please do not reply.
            </div>

        </div>
    </div>
  `;
}
