import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getEventStatusHistoryUniq = async <
  T extends Prisma.event_status_historiesDefaultArgs,
>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.event_status_historiesWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.event_status_historiesDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.event_status_historiesGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.event_status_histories.findUnique({
        where: filter,
        ...(options as Prisma.event_status_historiesDefaultArgs),
      }) as Promise<Prisma.event_status_historiesGetPayload<T> | null>,
    cacheTags.eventStatusHistories,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getEventStatusHistories = async <
  T extends Prisma.event_status_historiesDefaultArgs,
>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.event_status_historiesWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.event_status_historiesDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.event_status_historiesOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.event_status_historiesGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.event_status_histories.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.event_status_historiesDefaultArgs),
      }) as Promise<Prisma.event_status_historiesGetPayload<T>[] | null>,
    cacheTags.eventStatusHistories,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getEventStatusHistoryCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.event_status_historiesWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.event_status_histories.count({ where: filter }),
    cacheTags.eventStatusHistoriesCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createEventStatusHistory = async <
  T extends Prisma.event_status_historiesDefaultArgs,
>({
  data,
  options,
}: {
  data: Prisma.event_status_historiesCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_status_historiesDefaultArgs>;
}): Promise<Prisma.event_status_historiesGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_status_histories.create({
        data,
        ...(options as Prisma.event_status_historiesDefaultArgs),
      })) as Prisma.event_status_historiesGetPayload<T> | null,
    [cacheTags.eventStatusHistories, cacheTags.eventStatusHistoriesCount],
  );

const updateEventStatusHistory = async <
  T extends Prisma.event_status_historiesDefaultArgs,
>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_status_historiesWhereUniqueInput;
  data: Prisma.event_status_historiesUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_status_historiesDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_status_historiesGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_status_histories.update({
        where: filter,
        data,
        ...(options as Prisma.event_status_historiesDefaultArgs),
      })) as Prisma.event_status_historiesGetPayload<T> | null,
    [
      cacheTags.eventStatusHistories,
      cacheTags.eventStatusHistoriesCount,
      ...(revalidateTags ?? []),
    ],
  );

const deleteEventStatusHistory = async <
  T extends Prisma.event_status_historiesDefaultArgs,
>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_status_historiesWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.event_status_historiesDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_status_historiesGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_status_histories.delete({
        where: filter,
        ...(options as Prisma.event_status_historiesDefaultArgs),
      })) as Prisma.event_status_historiesGetPayload<T> | null,
    [
      cacheTags.eventStatusHistories,
      cacheTags.eventStatusHistoriesCount,
      ...(revalidateTags ?? []),
    ],
  );

export const eventStatusHistoryService = {
  getEventStatusHistoryUniq,
  getEventStatusHistoryCount,
  getEventStatusHistories,
  createEventStatusHistory,
  updateEventStatusHistory,
  deleteEventStatusHistory,
};
