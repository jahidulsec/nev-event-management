import { format } from "date-fns";

export const generateTrackingID = (
  eventType: string,
  product: string,
  totalEventCount: number,
) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = format(new Date(), "LLL");

  const trackingID = `${currentYear}/${currentMonth.toUpperCase()}/${product.slice(0, 3).toUpperCase()}/${toAbbreviation(eventType)}/${totalEventCount.toString().padStart(4, "0")}`;

  return trackingID;
};

export function toAbbreviation(text: string): string {
  return text
    .split(/[\s-]+/) // split by space OR hyphen
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
}
