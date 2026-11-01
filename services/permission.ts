import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getPermissions = async <T extends Prisma.role_permissionsDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.role_permissionsWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.role_permissionsDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.role_permissionsOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
} = {}): Promise<Prisma.role_permissionsGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.role_permissions.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.role_permissionsDefaultArgs),
      }) as Promise<Prisma.role_permissionsGetPayload<T>[] | null>,
    cacheTags.permissions,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const createPermissions = async ({
  data,
  revalidateTags,
}: {
  data: Prisma.role_permissionsCreateManyInput[];
  revalidateTags?: string[];
}): Promise<Prisma.BatchPayload> =>
  mutate(
    () => db.role_permissions.createMany({ data }),
    [cacheTags.permissions, ...(revalidateTags ?? [])],
  );

const deletePermissions = async ({
  filter,
  revalidateTags,
}: {
  filter: Prisma.role_permissionsWhereInput;
  revalidateTags?: string[];
}): Promise<Prisma.BatchPayload> =>
  mutate(
    () => db.role_permissions.deleteMany({ where: filter }),
    [cacheTags.permissions, ...(revalidateTags ?? [])],
  );

/**
 * Replace the full permission set of a role in one transaction. `role_permissions`
 * has no unique index on (role, permission), so callers must pass a de-duplicated
 * list.
 */
const replaceRolePermissions = async ({
  role,
  permissions,
  revalidateTags,
}: {
  role: string;
  permissions: string[];
  revalidateTags?: string[];
}): Promise<void> =>
  mutate(async () => {
    await db.$transaction([
      db.role_permissions.deleteMany({ where: { role } }),
      ...(permissions.length
        ? [
            db.role_permissions.createMany({
              data: permissions.map((permission) => ({ role, permission })),
            }),
          ]
        : []),
    ]);
  }, [cacheTags.permissions, ...(revalidateTags ?? [])]);

export const permissionService = {
  getPermissions,
  createPermissions,
  deletePermissions,
  replaceRolePermissions,
};
