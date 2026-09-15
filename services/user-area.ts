import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getUserAreaUniq = async <T extends Prisma.users_areaDefaultArgs>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.users_areaWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.users_areaDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.users_areaGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.users_area.findUnique({
        where: filter,
        ...(options as Prisma.users_areaDefaultArgs),
      }) as Promise<Prisma.users_areaGetPayload<T> | null>,
    cacheTags.userAreas,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getUserAreas = async <T extends Prisma.users_areaDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.users_areaWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.users_areaDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.users_areaOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.users_areaGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.users_area.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.users_areaDefaultArgs),
      }) as Promise<Prisma.users_areaGetPayload<T>[] | null>,
    cacheTags.userAreas,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getUserAreaCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.users_areaWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.users_area.count({ where: filter }),
    cacheTags.userAreasCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createUserArea = async <T extends Prisma.users_areaDefaultArgs>({
  data,
  options,
}: {
  data: Prisma.users_areaCreateInput | Prisma.users_areaUncheckedCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.users_areaDefaultArgs>;
}): Promise<Prisma.users_areaGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.users_area.create({
        data,
        ...(options as Prisma.users_areaDefaultArgs),
      })) as Prisma.users_areaGetPayload<T> | null,
    [cacheTags.userAreas, cacheTags.userAreasCount],
  );

const updateUserArea = async <T extends Prisma.users_areaDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.users_areaWhereUniqueInput;
  data: Prisma.users_areaUpdateInput | Prisma.users_areaUncheckedUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.users_areaDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.users_areaGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.users_area.update({
        where: filter,
        data,
        ...(options as Prisma.users_areaDefaultArgs),
      })) as Prisma.users_areaGetPayload<T> | null,
    [cacheTags.userAreas, cacheTags.userAreasCount, ...(revalidateTags ?? [])],
  );

const deleteUserArea = async <T extends Prisma.users_areaDefaultArgs>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.users_areaWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.users_areaDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.users_areaGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.users_area.delete({
        where: filter,
        ...(options as Prisma.users_areaDefaultArgs),
      })) as Prisma.users_areaGetPayload<T> | null,
    [cacheTags.userAreas, cacheTags.userAreasCount, ...(revalidateTags ?? [])],
  );

export const userAreaService = {
  getUserAreaCount,
  getUserAreas,
  getUserAreaUniq,
  createUserArea,
  updateUserArea,
  deleteUserArea,
};
