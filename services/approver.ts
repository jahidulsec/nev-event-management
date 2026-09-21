import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getApproverUniq = async <T extends Prisma.approverDefaultArgs>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.approverWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.approverDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.approverGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.approver.findUnique({
        where: filter,
        ...(options as Prisma.approverDefaultArgs),
      }) as Promise<Prisma.approverGetPayload<T> | null>,
    cacheTags.approvers,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getApprovers = async <T extends Prisma.approverDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.approverWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.approverDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.approverOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.approverGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.approver.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.approverDefaultArgs),
      }) as Promise<Prisma.approverGetPayload<T>[] | null>,
    cacheTags.approvers,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getApproverCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.approverWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.approver.count({ where: filter }),
    cacheTags.approversCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createApprover = async <T extends Prisma.approverDefaultArgs>({
  data,
  options,
}: {
  data: Prisma.approverCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.approverDefaultArgs>;
}): Promise<Prisma.approverGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.approver.create({
        data,
        ...(options as Prisma.approverDefaultArgs),
      })) as Prisma.approverGetPayload<T> | null,
    [cacheTags.approvers, cacheTags.approversCount],
  );

const updateApprover = async <T extends Prisma.approverDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.approverWhereUniqueInput;
  data: Prisma.approverUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.approverDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.approverGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.approver.update({
        where: filter,
        data,
        ...(options as Prisma.approverDefaultArgs),
      })) as Prisma.approverGetPayload<T> | null,
    [cacheTags.approvers, cacheTags.approversCount, ...(revalidateTags ?? [])],
  );

const deleteApprover = async <T extends Prisma.approverDefaultArgs>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.approverWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.approverDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.approverGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.approver.delete({
        where: filter,
        ...(options as Prisma.approverDefaultArgs),
      })) as Prisma.approverGetPayload<T> | null,
    [cacheTags.approvers, cacheTags.approversCount, ...(revalidateTags ?? [])],
  );

export const approverService = {
  getApproverUniq,
  getApproverCount,
  getApprovers,
  createApprover,
  updateApprover,
  deleteApprover,
};
