export default function ApproverRequestMail({
  approverName,
  product,
  eventTitle,
  eventId,
  typeTitle,
  eventDate,
  requestorName,
}: {
  product: string;
  typeTitle: string;
  eventTitle: string;
  eventId: string;
  approverName?: string;
  eventDate?: string;
  requestorName?: string;
}) {
  return `
 <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
        <div
            style="max-width:600px; margin:auto; border: 1px dashed #2563eb; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">

            <!-- Header -->
            <div style="background:#f9f9fa; color:#09090b; padding:16px 24px;">
                <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo/nevian.png" alt="nevian logo" width="100">
                <div>
                  <h2 style="margin:0;">Approval Required</h2>
                  <p style="margin:0; margin-top: 5px; color: #666; font-size: 11px;">Event Management System</p>
                </div>
            </div>

            <!-- Body -->
            <div style="padding:24px; color:#333;">
                <p style="font-size:14px;">
                    Hello ${approverName || "Approver"},
                </p>

                <p style="margin-top:12px;">
                    You have a new <strong>event proposal</strong> that requires your approval.
                </p>

                <p style="margin-top:16px; font-size:14px;">
                    <strong>${product?.toUpperCase()}</strong> /
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
                    ${
                      requestorName
                        ? `
                    <tr>
                        <td style="padding:8px 0; font-weight:bold;">Requested By:</td>
                        <td>${requestorName}</td>
                    </tr>`
                        : ""
                    }
                </table>

                <!-- CTA Buttons -->
                <div style="margin-top:24px; text-align:center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events/${eventId}/preview"
                        style="display:inline-block; margin-right:10px; padding:10px 20px; background:#2563eb; color:#fff; text-decoration:none; border-radius:4px;">
                        Review Event
                    </a>
                </div>

                <p style="margin-top:20px; font-size:13px; color:#555;">
                    Please review this request at your earliest convenience.
                </p>
            </div>

            <!-- Footer -->
            <div style="background:#f1f1f1; padding:16px; font-size:12px; text-align:center; color:#666;">
                This is an automated notification. Please do not reply.
            </div>

        </div>
    </div>
  `;
}
