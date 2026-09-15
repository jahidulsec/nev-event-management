import { db } from "@/config/db";
import { cachedRead, cacheTags } from "@/lib/server-cache";
import { policy } from "@/lib/generated/prisma/client";

/**
 * All enabled policy rows, used by the evaluator. Distinct from
 * features/policy/libs/policy.ts's `getPolicies`, which is the paginated
 * admin-UI read.
 */
export const getActivePolicies = async (): Promise<policy[]> =>
  (await cachedRead(
    () =>
      db.policy.findMany({
        where: { enabled: true },
        orderBy: { priority: "desc" },
      }),
    cacheTags.permissions,
    ["active"],
  )) ?? [];
