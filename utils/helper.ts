import { navlist } from "@/lib/data";
import { event_type } from "@/lib/generated/prisma";
import { AuthUserRole } from "@/types/auth-user";
import { formatNumber } from "./formatter";

export function getPageData(title: string, role: AuthUserRole) {
  return navlist[role as "superadmin"].find(
    (i) => i.title.toLowerCase() === title.toLowerCase(),
  );
}

export const getSerializeData = (data: any[]) => {
  return data.map((r) =>
    Object.fromEntries(
      Object.entries(r).map(([k, v]) => [
        k,
        ["string", "boolean", "undefine"].includes(typeof v) ||
        v instanceof Date
          ? v
          : Number(v),
      ]),
    ),
  );
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
