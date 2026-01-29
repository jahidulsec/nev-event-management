import { navlist } from "@/lib/data";
import { event_type, Prisma } from "@/lib/generated/prisma";
import { AuthUserRole } from "@/types/auth-user";
import { formatNumber } from "./formatter";

export function getPageData(title: string, role: AuthUserRole) {
  return navlist[role as "superadmin"].find(
    (i) => i.title.toLowerCase() === title.toLowerCase(),
  );
}

export const getSerializeData = (data: any): any => {
  if (data === null || data === undefined) return data;

  // Handle Decimal
  if (Object.prototype.toString.call(data).slice(8, -1) === "Decimal") {
    return Number(data); // safest
  }

  // Handle Date
  if (data instanceof Date) {
    return data;
  }

  // Handle Array
  if (Array.isArray(data)) {
    return data.map(getSerializeData);
  }

  // Handle Object
  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        getSerializeData(value),
      ]),
    );
  }

  // string, number, boolean
  return data;
};

export const getCostLimitText = (value: event_type) => {
  const upperLimit = Number(value.upper_limit);
  const lowerLimit = Number(value.lower_limit);

  let limit = "All";

  if (upperLimit > 0 && lowerLimit > 0)
    limit = `${formatNumber(lowerLimit)} <= Cost <= ${formatNumber(upperLimit)}`;
  else if (upperLimit) limit = `Cost <= ${formatNumber(upperLimit)}`;
  else if (lowerLimit) limit = `${formatNumber(lowerLimit)} <= Cost`;

  return limit;
};
