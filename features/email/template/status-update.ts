export default function ApproverStatusUpdateMail({
  product,
  eventTitle,
  typeTitle,
  status,
  eventDate,
  approverName,
  remarks,
}: {
  product: string;
  eventTitle: string;
  typeTitle: string;
  status: string;
  eventDate: string;
  approverName?: string;
  remarks?: string;
}) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "#16a34a"; // green
      case "rejected":
        return "#dc2626"; // red
      case "pending":
        return "#f59e0b"; // yellow
      default:
        return "#4f46e5"; // default
    }
  };

  return `
    <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border: 1px dashed #4f46e5; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">

        <!-- Header -->
        <div style="background:#f9f9fa; color:#09090b; padding:16px 24px;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo/nevian.png" alt="nevian logo" width="100">
          <div>
            <h2 style="margin:0; font-size:20px;">Event Status Updated</h2>
            <p style="margin:5px 0 0; color:#666; font-size:14px;">
              Event Management System
            </p>
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
            The status of your event proposal has been updated by 
            <strong>${approverName || "Approver"}</strong>.
          </p>

          <!-- Status Badge -->
          <div style="margin-top:16px;">
            <span style="
              display:inline-block;
              padding:6px 12px;
              border-radius:999px;
              font-size:12px;
              font-weight:bold;
              color:white;
              background:${getStatusColor(status)};
            ">
              ${status}
            </span>
          </div>

          <!-- Details -->
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
            <tr>
              <td style="padding:8px 0; font-weight:bold;">Updated Status:</td>
              <td style="color:${getStatusColor(status)}; font-weight:bold;">
                ${status}
              </td>
            </tr>

            ${
              remarks
                ? `
            <tr>
              <td style="padding:8px 0; font-weight:bold;">Remarks:</td>
              <td>${remarks}</td>
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