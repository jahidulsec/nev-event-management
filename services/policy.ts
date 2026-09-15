import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getPolicyUniq = async <T extends Prisma.policyDefaultArgs>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.policyWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.policyDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.policyGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.policy.findUnique({
        where: filter,
        ...(options as Prisma.policyDefaultArgs),
      }) as Promise<Prisma.policyGetPayload<T> | null>,
    cacheTags.permissions,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getPolicies = async <T extends Prisma.policyDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.policyWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.policyDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.policyOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
} = {}): Promise<Prisma.policyGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.policy.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.policyDefaultArgs),
      }) as Promise<Prisma.policyGetPayload<T>[] | null>,
    cacheTags.permissions,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getPolicyCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.policyWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.policy.count({ where: filter }),
    cacheTags.permissionsCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createPolicy = async <T extends Prisma.policyDefaultArgs>({
  data,
  options,
}: {
  data: Prisma.policyCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.policyDefaultArgs>;
}): Promise<Prisma.policyGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.policy.create({
        data,
        ...(options as Prisma.policyDefaultArgs),
      })) as Prisma.policyGetPayload<T> | null,
    [cacheTags.permissions, cacheTags.permissionsCount],
  );

const updatePolicy = async <T extends Prisma.policyDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.policyWhereUniqueInput;
  data: Prisma.policyUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.policyDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.policyGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.policy.update({
        where: filter,
        data,
        ...(options as Prisma.policyDefaultArgs),
      })) as Prisma.policyGetPayload<T> | null,
    [
      cacheTags.permissions,
      cacheTags.permissionsCount,
      ...(revalidateTags ?? []),
    ],
  );

const deletePolicy = async <T extends Prisma.policyDefaultArgs>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.policyWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.policyDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.policyGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.policy.delete({
        where: filter,
        ...(options as Prisma.policyDefaultArgs),
      })) as Prisma.policyGetPayload<T> | null,
    [
      cacheTags.permissions,
      cacheTags.permissionsCount,
      ...(revalidateTags ?? []),
    ],
  );

export const policyService = {
  getPolicyUniq,
  getPolicyCount,
  getPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
};
