import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getEventApproverUniq = async <
  T extends Prisma.event_approversDefaultArgs,
>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.event_approversWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.event_approversDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.event_approversGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.event_approvers.findUnique({
        where: filter,
        ...(options as Prisma.event_approversDefaultArgs),
      }) as Promise<Prisma.event_approversGetPayload<T> | null>,
    cacheTags.eventApprovers,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getEventApprovers = async <T extends Prisma.event_approversDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.event_approversWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.event_approversDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.event_approversOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.event_approversGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.event_approvers.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.event_approversDefaultArgs),
      }) as Promise<Prisma.event_approversGetPayload<T>[] | null>,
    cacheTags.eventApprovers,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getEventApproverCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.event_approversWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.event_approvers.count({ where: filter }),
    cacheTags.eventApproversCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createEventApprover = async <
  T extends Prisma.event_approversDefaultArgs,
>({
  data,
  options,
}: {
  data: Prisma.event_approversCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_approversDefaultArgs>;
}): Promise<Prisma.event_approversGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_approvers.create({
        data,
        ...(options as Prisma.event_approversDefaultArgs),
      })) as Prisma.event_approversGetPayload<T> | null,
    [cacheTags.eventApprovers, cacheTags.eventApproversCount],
  );

const updateEventApprover = async <
  T extends Prisma.event_approversDefaultArgs,
>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_approversWhereUniqueInput;
  data: Prisma.event_approversUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_approversDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_approversGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_approvers.update({
        where: filter,
        data,
        ...(options as Prisma.event_approversDefaultArgs),
      })) as Prisma.event_approversGetPayload<T> | null,
    [
      cacheTags.eventApprovers,
      cacheTags.eventApproversCount,
      ...(revalidateTags ?? []),
    ],
  );

const deleteEventApprover = async <
  T extends Prisma.event_approversDefaultArgs,
>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_approversWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.event_approversDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_approversGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_approvers.delete({
        where: filter,
        ...(options as Prisma.event_approversDefaultArgs),
      })) as Prisma.event_approversGetPayload<T> | null,
    [
      cacheTags.eventApprovers,
      cacheTags.eventApproversCount,
      ...(revalidateTags ?? []),
    ],
  );

export const eventApproverService = {
  getEventApproverUniq,
  getEventApproverCount,
  getEventApprovers,
  createEventApprover,
  updateEventApprover,
  deleteEventApprover,
};
