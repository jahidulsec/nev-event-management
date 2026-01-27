import { navlist } from "@/lib/data";
import { AuthUserRole } from "@/types/auth-user";

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
