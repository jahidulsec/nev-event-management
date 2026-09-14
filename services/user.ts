import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getUserUniq = async <T extends Prisma.usersDefaultArgs>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.usersWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.usersDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.usersGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.users.findUnique({
        where: filter,
        ...(options as Prisma.usersDefaultArgs),
      }) as Promise<Prisma.usersGetPayload<T> | null>,
    cacheTags.users,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getusers = async <T extends Prisma.usersDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.usersWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.usersDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.usersOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.usersGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.users.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.usersDefaultArgs),
      }) as Promise<Prisma.usersGetPayload<T>[] | null>,
    cacheTags.users,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getuserCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.usersWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.users.count({ where: filter }),
    cacheTags.userCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createUser = async <T extends Prisma.usersDefaultArgs>({
  data,
  options,
}: {
  data: Prisma.usersCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.usersDefaultArgs>;
}): Promise<Prisma.usersGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.users.create({
        data,
        ...(options as Prisma.usersDefaultArgs),
      })) as Prisma.usersGetPayload<T> | null,
    [cacheTags.users, cacheTags.userCount],
  );

const updateUser = async <T extends Prisma.usersDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.usersWhereUniqueInput;
  data: Prisma.usersUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.usersDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.usersGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.users.update({
        where: filter,
        data,
        ...(options as Prisma.usersDefaultArgs),
      })) as Prisma.usersGetPayload<T> | null,
    [cacheTags.users, cacheTags.userCount, ...(revalidateTags ?? [])],
  );

const deleteUser = async <T extends Prisma.usersDefaultArgs>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.usersWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.usersDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.usersGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.users.delete({
        where: filter,
        ...(options as Prisma.usersDefaultArgs),
      })) as Prisma.usersGetPayload<T> | null,
    [cacheTags.users, cacheTags.userCount, ...(revalidateTags ?? [])],
  );

export const userService = {
  getuserCount,
  getusers,
  getUserUniq,
  createUser,
  updateUser,
  deleteUser,
};
