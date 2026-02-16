import { format } from "date-fns";

export function formatDate(date: Date) {
  return format(date, "LLL dd, yyyy");
}

export function formatDateTime(date: Date) {
  return format(date, "LLL dd, yyyy - h:mm aaa");
}

export const formatNumber = (number: number) => {
  if (typeof number !== "number") return 0;

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(number);
};

export function getCleanData(data: object) {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([_, v]) => v !== undefined && v !== null && !Number.isNaN(v),
    ),
  );
}
