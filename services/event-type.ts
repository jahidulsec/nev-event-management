import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getEventTypeUniq = async <T extends Prisma.event_typeDefaultArgs>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.event_typeWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.event_typeDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.event_typeGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.event_type.findUnique({
        where: filter,
        ...(options as Prisma.event_typeDefaultArgs),
      }) as Promise<Prisma.event_typeGetPayload<T> | null>,
    cacheTags.eventTypes,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getEventTypes = async <T extends Prisma.event_typeDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.event_typeWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.event_typeDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.event_typeOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.event_typeGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.event_type.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.event_typeDefaultArgs),
      }) as Promise<Prisma.event_typeGetPayload<T>[] | null>,
    cacheTags.eventTypes,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getEventTypeCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.event_typeWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.event_type.count({ where: filter }),
    cacheTags.eventTypesCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createEventType = async <T extends Prisma.event_typeDefaultArgs>({
  data,
  options,
}: {
  data: Prisma.event_typeCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_typeDefaultArgs>;
}): Promise<Prisma.event_typeGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_type.create({
        data,
        ...(options as Prisma.event_typeDefaultArgs),
      })) as Prisma.event_typeGetPayload<T> | null,
    [cacheTags.eventTypes, cacheTags.eventTypesCount],
  );

const updateEventType = async <T extends Prisma.event_typeDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_typeWhereUniqueInput;
  data: Prisma.event_typeUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_typeDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_typeGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_type.update({
        where: filter,
        data,
        ...(options as Prisma.event_typeDefaultArgs),
      })) as Prisma.event_typeGetPayload<T> | null,
    [cacheTags.eventTypes, cacheTags.eventTypesCount, ...(revalidateTags ?? [])],
  );

const deleteEventType = async <T extends Prisma.event_typeDefaultArgs>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_typeWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.event_typeDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_typeGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_type.delete({
        where: filter,
        ...(options as Prisma.event_typeDefaultArgs),
      })) as Prisma.event_typeGetPayload<T> | null,
    [cacheTags.eventTypes, cacheTags.eventTypesCount, ...(revalidateTags ?? [])],
  );

export const eventTypeService = {
  getEventTypeUniq,
  getEventTypeCount,
  getEventTypes,
  createEventType,
  updateEventType,
  deleteEventType,
};
