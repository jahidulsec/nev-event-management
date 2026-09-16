import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getEventConsultantUniq = async <
  T extends Prisma.event_consultantsDefaultArgs,
>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.event_consultantsWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.event_consultantsDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.event_consultantsGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.event_consultants.findUnique({
        where: filter,
        ...(options as Prisma.event_consultantsDefaultArgs),
      }) as Promise<Prisma.event_consultantsGetPayload<T> | null>,
    cacheTags.eventConsultants,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getEventConsultants = async <
  T extends Prisma.event_consultantsDefaultArgs,
>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.event_consultantsWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.event_consultantsDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.event_consultantsOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.event_consultantsGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.event_consultants.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.event_consultantsDefaultArgs),
      }) as Promise<Prisma.event_consultantsGetPayload<T>[] | null>,
    cacheTags.eventConsultants,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getEventConsultantCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.event_consultantsWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.event_consultants.count({ where: filter }),
    cacheTags.eventConsultantsCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createEventConsultant = async <
  T extends Prisma.event_consultantsDefaultArgs,
>({
  data,
  options,
}: {
  data: Prisma.event_consultantsCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_consultantsDefaultArgs>;
}): Promise<Prisma.event_consultantsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_consultants.create({
        data,
        ...(options as Prisma.event_consultantsDefaultArgs),
      })) as Prisma.event_consultantsGetPayload<T> | null,
    [cacheTags.eventConsultants, cacheTags.eventConsultantsCount],
  );

const updateEventConsultant = async <
  T extends Prisma.event_consultantsDefaultArgs,
>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_consultantsWhereUniqueInput;
  data: Prisma.event_consultantsUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_consultantsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_consultantsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_consultants.update({
        where: filter,
        data,
        ...(options as Prisma.event_consultantsDefaultArgs),
      })) as Prisma.event_consultantsGetPayload<T> | null,
    [
      cacheTags.eventConsultants,
      cacheTags.eventConsultantsCount,
      ...(revalidateTags ?? []),
    ],
  );

const deleteEventConsultant = async <
  T extends Prisma.event_consultantsDefaultArgs,
>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_consultantsWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.event_consultantsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_consultantsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_consultants.delete({
        where: filter,
        ...(options as Prisma.event_consultantsDefaultArgs),
      })) as Prisma.event_consultantsGetPayload<T> | null,
    [
      cacheTags.eventConsultants,
      cacheTags.eventConsultantsCount,
      ...(revalidateTags ?? []),
    ],
  );

export const eventConsultantService = {
  getEventConsultantUniq,
  getEventConsultantCount,
  getEventConsultants,
  createEventConsultant,
  updateEventConsultant,
  deleteEventConsultant,
};
