import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getNotificationUniq = async <T extends Prisma.notificationsDefaultArgs>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.notificationsWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.notificationsDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.notificationsGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.notifications.findUnique({
        where: filter,
        ...(options as Prisma.notificationsDefaultArgs),
      }) as Promise<Prisma.notificationsGetPayload<T> | null>,
    cacheTags.notifications,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getNotifications = async <T extends Prisma.notificationsDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.notificationsWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.notificationsDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.notificationsOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.notificationsGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.notifications.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.notificationsDefaultArgs),
      }) as Promise<Prisma.notificationsGetPayload<T>[] | null>,
    cacheTags.notifications,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getNotificationCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.notificationsWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.notifications.count({ where: filter }),
    cacheTags.notificationsCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createNotification = async <T extends Prisma.notificationsDefaultArgs>({
  data,
  options,
}: {
  data: Prisma.notificationsCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.notificationsDefaultArgs>;
}): Promise<Prisma.notificationsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.notifications.create({
        data,
        ...(options as Prisma.notificationsDefaultArgs),
      })) as Prisma.notificationsGetPayload<T> | null,
    [cacheTags.notifications, cacheTags.notificationsCount],
  );

const updateNotification = async <T extends Prisma.notificationsDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.notificationsWhereUniqueInput;
  data: Prisma.notificationsUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.notificationsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.notificationsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.notifications.update({
        where: filter,
        data,
        ...(options as Prisma.notificationsDefaultArgs),
      })) as Prisma.notificationsGetPayload<T> | null,
    [
      cacheTags.notifications,
      cacheTags.notificationsCount,
      ...(revalidateTags ?? []),
    ],
  );

const updateNotifications = async ({
  filter,
  data,
  revalidateTags,
}: {
  filter: Prisma.notificationsWhereInput;
  data: Prisma.notificationsUpdateManyMutationInput;
  revalidateTags?: string[];
}): Promise<Prisma.BatchPayload> =>
  mutate(
    () => db.notifications.updateMany({ where: filter, data }),
    [
      cacheTags.notifications,
      cacheTags.notificationsCount,
      ...(revalidateTags ?? []),
    ],
  );

const deleteNotification = async <T extends Prisma.notificationsDefaultArgs>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.notificationsWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.notificationsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.notificationsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.notifications.delete({
        where: filter,
        ...(options as Prisma.notificationsDefaultArgs),
      })) as Prisma.notificationsGetPayload<T> | null,
    [
      cacheTags.notifications,
      cacheTags.notificationsCount,
      ...(revalidateTags ?? []),
    ],
  );

export const notificationService = {
  getNotificationUniq,
  getNotificationCount,
  getNotifications,
  createNotification,
  updateNotification,
  updateNotifications,
  deleteNotification,
};
