import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getRoleUniq = async <T extends Prisma.roleDefaultArgs>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.roleWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.roleDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.roleGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.role.findUnique({
        where: filter,
        ...(options as Prisma.roleDefaultArgs),
      }) as Promise<Prisma.roleGetPayload<T> | null>,
    cacheTags.roles,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getRoles = async <T extends Prisma.roleDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.roleWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.roleDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.roleOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
} = {}): Promise<Prisma.roleGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.role.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.roleDefaultArgs),
      }) as Promise<Prisma.roleGetPayload<T>[] | null>,
    cacheTags.roles,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getRoleCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.roleWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.role.count({ where: filter }),
    cacheTags.rolesCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createRole = async <T extends Prisma.roleDefaultArgs>({
  data,
  options,
}: {
  data: Prisma.roleCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.roleDefaultArgs>;
}): Promise<Prisma.roleGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.role.create({
        data,
        ...(options as Prisma.roleDefaultArgs),
      })) as Prisma.roleGetPayload<T> | null,
    [cacheTags.roles, cacheTags.rolesCount],
  );

const updateRole = async <T extends Prisma.roleDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.roleWhereUniqueInput;
  data: Prisma.roleUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.roleDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.roleGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.role.update({
        where: filter,
        data,
        ...(options as Prisma.roleDefaultArgs),
      })) as Prisma.roleGetPayload<T> | null,
    [cacheTags.roles, cacheTags.rolesCount, ...(revalidateTags ?? [])],
  );

const deleteRole = async <T extends Prisma.roleDefaultArgs>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.roleWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.roleDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.roleGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.role.delete({
        where: filter,
        ...(options as Prisma.roleDefaultArgs),
      })) as Prisma.roleGetPayload<T> | null,
    [cacheTags.roles, cacheTags.rolesCount, ...(revalidateTags ?? [])],
  );

export const roleService = {
  getRoleUniq,
  getRoleCount,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
};
