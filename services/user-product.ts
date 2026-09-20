import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getUserProductUniq = async <T extends Prisma.user_productDefaultArgs>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.user_productWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.user_productDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.user_productGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.user_product.findUnique({
        where: filter,
        ...(options as Prisma.user_productDefaultArgs),
      }) as Promise<Prisma.user_productGetPayload<T> | null>,
    cacheTags.userProducts,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getUserProducts = async <T extends Prisma.user_productDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.user_productWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.user_productDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.user_productOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.user_productGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.user_product.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.user_productDefaultArgs),
      }) as Promise<Prisma.user_productGetPayload<T>[] | null>,
    cacheTags.userProducts,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getUserProductCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.user_productWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.user_product.count({ where: filter }),
    cacheTags.userProductsCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createUserProduct = async <T extends Prisma.user_productDefaultArgs>({
  data,
  options,
}: {
  data: Prisma.user_productCreateInput | Prisma.user_productUncheckedCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.user_productDefaultArgs>;
}): Promise<Prisma.user_productGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.user_product.create({
        data,
        ...(options as Prisma.user_productDefaultArgs),
      })) as Prisma.user_productGetPayload<T> | null,
    [cacheTags.userProducts, cacheTags.userProductsCount],
  );

const updateUserProduct = async <T extends Prisma.user_productDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.user_productWhereUniqueInput;
  data: Prisma.user_productUpdateInput | Prisma.user_productUncheckedUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.user_productDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.user_productGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.user_product.update({
        where: filter,
        data,
        ...(options as Prisma.user_productDefaultArgs),
      })) as Prisma.user_productGetPayload<T> | null,
    [cacheTags.userProducts, cacheTags.userProductsCount, ...(revalidateTags ?? [])],
  );

const upsertUserProduct = async <T extends Prisma.user_productDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.user_productWhereUniqueInput;
  data: Prisma.user_productCreateInput | Prisma.user_productUncheckedCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.user_productDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.user_productGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.user_product.upsert({
        where: filter,
        create: data,
        update: data,
        ...(options as Prisma.user_productDefaultArgs),
      })) as Prisma.user_productGetPayload<T> | null,
    [cacheTags.userProducts, cacheTags.userProductsCount, ...(revalidateTags ?? [])],
  );

const deleteUserProduct = async <T extends Prisma.user_productDefaultArgs>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.user_productWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.user_productDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.user_productGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.user_product.delete({
        where: filter,
        ...(options as Prisma.user_productDefaultArgs),
      })) as Prisma.user_productGetPayload<T> | null,
    [cacheTags.userProducts, cacheTags.userProductsCount, ...(revalidateTags ?? [])],
  );

export const userProductService = {
  getUserProductCount,
  getUserProducts,
  getUserProductUniq,
  createUserProduct,
  updateUserProduct,
  upsertUserProduct,
  deleteUserProduct,
};
