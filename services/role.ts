import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import { cachedRead, cacheTags, ServerCacheOptions } from "@/lib/server-cache";

const getRoles = async <T extends Prisma.roleDefaultArgs>({
  filter,
  options,
  sort,
  cacheOption,
}: {
  filter?: Prisma.roleWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.roleDefaultArgs>;
  sort?: Prisma.roleOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
} = {}): Promise<Prisma.roleGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.role.findMany({
        where: filter,
        orderBy: sort,
        ...(options as Prisma.roleDefaultArgs),
      }) as Promise<Prisma.roleGetPayload<T>[] | null>,
    cacheTags.roles,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

export const roleService = {
  getRoles,
};
