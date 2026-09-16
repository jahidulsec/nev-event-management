import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getEventUniq = async <T extends Prisma.eventsDefaultArgs>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.eventsWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.eventsDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.eventsGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.events.findUnique({
        where: filter,
        ...(options as Prisma.eventsDefaultArgs),
      }) as Promise<Prisma.eventsGetPayload<T> | null>,
    cacheTags.events,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getEvents = async <T extends Prisma.eventsDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.eventsWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.eventsDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.eventsOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.eventsGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.events.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.eventsDefaultArgs),
      }) as Promise<Prisma.eventsGetPayload<T>[] | null>,
    cacheTags.events,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getEventCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.eventsWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.events.count({ where: filter }),
    cacheTags.eventsCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createEvent = async <T extends Prisma.eventsDefaultArgs>({
  data,
  options,
}: {
  data: Prisma.eventsCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.eventsDefaultArgs>;
}): Promise<Prisma.eventsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.events.create({
        data,
        ...(options as Prisma.eventsDefaultArgs),
      })) as Prisma.eventsGetPayload<T> | null,
    [cacheTags.events, cacheTags.eventsCount],
  );

const updateEvent = async <T extends Prisma.eventsDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.eventsWhereUniqueInput;
  data: Prisma.eventsUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.eventsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.eventsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.events.update({
        where: filter,
        data,
        ...(options as Prisma.eventsDefaultArgs),
      })) as Prisma.eventsGetPayload<T> | null,
    [cacheTags.events, cacheTags.eventsCount, ...(revalidateTags ?? [])],
  );

const deleteEvent = async <T extends Prisma.eventsDefaultArgs>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.eventsWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.eventsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.eventsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.events.delete({
        where: filter,
        ...(options as Prisma.eventsDefaultArgs),
      })) as Prisma.eventsGetPayload<T> | null,
    [cacheTags.events, cacheTags.eventsCount, ...(revalidateTags ?? [])],
  );

export const eventService = {
  getEventUniq,
  getEventCount,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
