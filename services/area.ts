import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getAreaUniq = async <T extends Prisma.areaDefaultArgs>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.areaWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.areaDefaultArgs>;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.areaGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.area.findUnique({
        where: filter,
        ...(options as Prisma.areaDefaultArgs),
      }) as Promise<Prisma.areaGetPayload<T> | null>,
    cacheTags.areas,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getAreas = async <T extends Prisma.areaDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.areaWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.areaDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.areaOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.areaGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.area.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.areaDefaultArgs),
      }) as Promise<Prisma.areaGetPayload<T>[] | null>,
    cacheTags.areas,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getAreaCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.areaWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.area.count({ where: filter }),
    cacheTags.areasCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createArea = async <T extends Prisma.areaDefaultArgs>({
  data,
  options,
}: {
  data: Prisma.areaCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.areaDefaultArgs>;
}): Promise<Prisma.areaGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.area.create({
        data,
        ...(options as Prisma.areaDefaultArgs),
      })) as Prisma.areaGetPayload<T> | null,
    [cacheTags.areas, cacheTags.areasCount],
  );

const updateArea = async <T extends Prisma.areaDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.areaWhereUniqueInput;
  data: Prisma.areaUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.areaDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.areaGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.area.update({
        where: filter,
        data,
        ...(options as Prisma.areaDefaultArgs),
      })) as Prisma.areaGetPayload<T> | null,
    [cacheTags.areas, cacheTags.areasCount, ...(revalidateTags ?? [])],
  );

const deleteArea = async <T extends Prisma.areaDefaultArgs>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.areaWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.areaDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.areaGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.area.delete({
        where: filter,
        ...(options as Prisma.areaDefaultArgs),
      })) as Prisma.areaGetPayload<T> | null,
    [cacheTags.areas, cacheTags.areas, ...(revalidateTags ?? [])],
  );

export const areaService = {
  getAreaUniq,
  getAreaCount,
  getAreas,
  createArea,
  updateArea,
  deleteArea,
};
