import { cacheLife, cacheTag } from "next/cache";

export type CacheLifeProfile = {
  stale?: number;
  revalidate?: number;
  expire?: number;
};

export const CACHE_PRESETS = {
  // Frequently changing data
  realtime: {
    stale: 0, // 0 minutes
    revalidate: 5, // 0.08 minutes (5 seconds)
    expire: 30, // 0.5 minutes (30 seconds)
  },

  // Short-lived data
  short: {
    stale: 10, // 0.17 minutes (10 seconds)
    revalidate: 60, // 1 minute
    expire: 300, // 5 minutes
  },

  // General application data
  default: {
    stale: 60, // 1 minute
    revalidate: 300, // 5 minutes
    expire: 3600, // 60 minutes
  },

  // Relatively stable data
  medium: {
    stale: 300, // 5 minutes
    revalidate: 1800, // 30 minutes
    expire: 86400, // 1,440 minutes (24 hours)
  },

  // Rarely changing data
  long: {
    stale: 3600, // 60 minutes
    revalidate: 86400, // 1,440 minutes (24 hours)
    expire: 604800, // 10,080 minutes (7 days)
  },

  // Static configuration
  static: {
    stale: 86400, // 1,440 minutes (24 hours)
    revalidate: 604800, // 10,080 minutes (7 days)
    expire: 2592000, // 43,200 minutes (30 days)
  },
} satisfies Record<string, CacheLifeProfile>;

export type CachePreset = keyof typeof CACHE_PRESETS;

type CacheOptions<TArgs extends unknown[]> = {
  tags: (...args: TArgs) => string[];
  profile?: CachePreset | CacheLifeProfile;
};

export function withCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: CacheOptions<TArgs>,
) {
  return async (...args: TArgs): Promise<TResult> => {
    "use cache";

    const profile = options.profile ?? "default";

    cacheLife(typeof profile === "string" ? CACHE_PRESETS[profile] : profile);

    cacheTag(...options.tags(...args));

    return fn(...args);
  };
}
