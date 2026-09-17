import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getNotificationUniq = async <T extends Prisma.notificationDefaultArgs>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.notificationWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.notificationDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.notificationGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.notification.findUnique({
        where: filter,
        ...(options as Prisma.notificationDefaultArgs),
      }) as Promise<Prisma.notificationGetPayload<T> | null>,
    cacheTags.notifications,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getNotifications = async <T extends Prisma.notificationDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.notificationWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.notificationDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.notificationOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.notificationGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.notification.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.notificationDefaultArgs),
      }) as Promise<Prisma.notificationGetPayload<T>[] | null>,
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
  filter?: Prisma.notificationWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.notification.count({ where: filter }),
    cacheTags.notificationsCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createNotification = async <T extends Prisma.notificationDefaultArgs>({
  data,
  options,
}: {
  data: Prisma.notificationCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.notificationDefaultArgs>;
}): Promise<Prisma.notificationGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.notification.create({
        data,
        ...(options as Prisma.notificationDefaultArgs),
      })) as Prisma.notificationGetPayload<T> | null,
    [cacheTags.notifications, cacheTags.notificationsCount],
  );

const updateNotification = async <T extends Prisma.notificationDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.notificationWhereUniqueInput;
  data: Prisma.notificationUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.notificationDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.notificationGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.notification.update({
        where: filter,
        data,
        ...(options as Prisma.notificationDefaultArgs),
      })) as Prisma.notificationGetPayload<T> | null,
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
  filter: Prisma.notificationWhereInput;
  data: Prisma.notificationUpdateManyMutationInput;
  revalidateTags?: string[];
}): Promise<Prisma.BatchPayload> =>
  mutate(
    () => db.notification.updateMany({ where: filter, data }),
    [
      cacheTags.notifications,
      cacheTags.notificationsCount,
      ...(revalidateTags ?? []),
    ],
  );

const deleteNotification = async <T extends Prisma.notificationDefaultArgs>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.notificationWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.notificationDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.notificationGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.notification.delete({
        where: filter,
        ...(options as Prisma.notificationDefaultArgs),
      })) as Prisma.notificationGetPayload<T> | null,
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
