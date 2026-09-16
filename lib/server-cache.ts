import { toArray } from "@/utils/formatter";
import { unstable_cache, updateTag } from "next/cache";

export const cacheTags = {
  users: "users",
  userCount: "users-count",
  areas: "areas",
  areasCount: "areas-count",
  permissions: "permissions",
  roles: "roles",
  rolesCount: "roles-count",
  userProducts: "user-products",
  userProductsCount: "user-products-count",
  userAreas: "user-areas",
  userAreasCount: "user-areas-count",
  events: "events",
  eventsCount: "events-count",
  eventApprovers: "event-approvers",
  eventApproversCount: "event-approvers-count",
  eventConsultantApprovals: "event-consultant-approvals",
  eventConsultantApprovalsCount: "event-consultant-approvals-count",
  eventStatusHistories: "event-status-histories",
  eventStatusHistoriesCount: "event-status-histories-count",
} as const;

export type CacheTag = (typeof cacheTags)[keyof typeof cacheTags];

/**
 * Revalidation presets (in seconds) for cached server functions.
 *
 * - `realtime` – near live data, refreshed every 10s
 * - `short`    – default, good for list/detail queries
 * - `medium`   – data that changes a few times an hour
 * - `long`     – mostly static data (config, lookups)
 * - `day`      – rarely changing reference data
 * - `off`      – cache forever until a tag is revalidated
 */
export const cachePresets = {
  realtime: 10,
  short: 60,
  medium: 60 * 5,
  long: 60 * 60,
  day: 60 * 60 * 24,
  off: false,
} as const;

export type CachePreset = keyof typeof cachePresets;

type KeyPart = string | number | boolean | null | undefined;

export type ServerCacheOptions = {
  /**
   * Values that make the cache entry unique. The first part MUST be the cache
   * tag from `cacheTags` so entries are namespaced per resource; follow it with
   * ids, filters, pagination, etc.
   */
  key?: KeyPart | KeyPart[];
  /** Cache tags used with `revalidateTag` / `updateTag` to bust this entry. */
  tags?: string | string[];
  /** A named preset or a raw seconds value / `false`. Defaults to `"short"`. */
  revalidate?: CachePreset | number | false;
};

export function serverCache<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  options: ServerCacheOptions,
): (...args: Args) => Promise<Result> {
  const { key, tags, revalidate = "short" } = options;

  const keyParts = toArray(key).map((part) => String(part));

  const resolvedRevalidate =
    typeof revalidate === "string" ? cachePresets[revalidate] : revalidate;

  return unstable_cache(fn, keyParts, {
    tags: toArray(tags),
    revalidate: resolvedRevalidate,
  });
}

/**
 * Shared plumbing for the `services/*` layer so each model service only has to
 * declare its Prisma types, not repeat the cache-key / tag / revalidate wiring.
 */

/**
 * Merge a service's own cache key/tags with the optional per-call `cacheOption`.
 *
 * The result always starts with `baseTag` so entries stay namespaced per model,
 * followed by the call-specific `keyParts` (filters, pagination, …) and then
 * anything the caller passed through `cacheOption`.
 */
export const buildCacheOptions = (
  baseTag: string,
  keyParts: KeyPart[],
  cacheOption?: ServerCacheOptions,
): ServerCacheOptions => ({
  key: [baseTag, ...keyParts, ...toArray(cacheOption?.key)],
  tags: [baseTag, ...toArray(cacheOption?.tags)],
  ...(cacheOption?.revalidate !== undefined && {
    revalidate: cacheOption.revalidate,
  }),
});

/**
 * Wrap a read in `serverCache` with the standard key/tag shape and run it.
 *
 * @example
 * const user = await cachedRead(
 *   () => mariadb.spd_user.findUnique({ where: filter }) as Promise<User | null>,
 *   cacheTags.users,
 *   [JSON.stringify(filter)],
 *   cacheOption,
 * );
 */
export const cachedRead = <Result>(
  fn: () => Promise<Result>,
  baseTag: string,
  keyParts: KeyPart[],
  cacheOption?: ServerCacheOptions,
): Promise<Result> =>
  serverCache(fn, buildCacheOptions(baseTag, keyParts, cacheOption))();

/**
 * Run a write, then bust every provided tag (falsy entries are skipped so
 * callers can spread an optional `revalidateTags` list straight in).
 *
 * @example
 * return mutate(
 *   () => mariadb.spd_user.update({ where: filter, data }),
 *   [cacheTags.users, cacheTags.userCount, ...(revalidateTags ?? [])],
 * );
 */
export const mutate = async <Result>(
  fn: () => Promise<Result>,
  tags: (string | null | undefined)[],
): Promise<Result> => {
  const res = await fn();
  tags.forEach((tag) => tag && updateTag(tag));
  return res;
};
