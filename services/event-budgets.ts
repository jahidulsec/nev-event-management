import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getEventBudgetUniq = async <T extends Prisma.event_budgetsDefaultArgs>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.event_budgetsWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.event_budgetsDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.event_budgetsGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.event_budgets.findUnique({
        where: filter,
        ...(options as Prisma.event_budgetsDefaultArgs),
      }) as Promise<Prisma.event_budgetsGetPayload<T> | null>,
    cacheTags.eventBudgets,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getEventBudgets = async <T extends Prisma.event_budgetsDefaultArgs>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.event_budgetsWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.event_budgetsDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.event_budgetsOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.event_budgetsGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.event_budgets.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.event_budgetsDefaultArgs),
      }) as Promise<Prisma.event_budgetsGetPayload<T>[] | null>,
    cacheTags.eventBudgets,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getEventBudgetCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.event_budgetsWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.event_budgets.count({ where: filter }),
    cacheTags.eventBudgetsCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createEventBudget = async <T extends Prisma.event_budgetsDefaultArgs>({
  data,
  options,
  revalidateTags,
}: {
  data: Prisma.event_budgetsCreateInput | Prisma.event_budgetsUncheckedCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_budgetsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_budgetsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_budgets.create({
        data,
        ...(options as Prisma.event_budgetsDefaultArgs),
      })) as Prisma.event_budgetsGetPayload<T> | null,
    [
      cacheTags.eventBudgets,
      cacheTags.eventBudgetsCount,
      ...(revalidateTags ?? []),
    ],
  );

const updateEventBudget = async <T extends Prisma.event_budgetsDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_budgetsWhereUniqueInput;
  data: Prisma.event_budgetsUpdateInput | Prisma.event_budgetsUncheckedUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_budgetsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_budgetsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_budgets.update({
        where: filter,
        data,
        ...(options as Prisma.event_budgetsDefaultArgs),
      })) as Prisma.event_budgetsGetPayload<T> | null,
    [
      cacheTags.eventBudgets,
      cacheTags.eventBudgetsCount,
      ...(revalidateTags ?? []),
    ],
  );

const upsertEventBudget = async <T extends Prisma.event_budgetsDefaultArgs>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_budgetsWhereUniqueInput;
  data: Prisma.event_budgetsCreateInput | Prisma.event_budgetsUncheckedCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_budgetsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_budgetsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_budgets.upsert({
        where: filter,
        create: data,
        update: data,
        ...(options as Prisma.event_budgetsDefaultArgs),
      })) as Prisma.event_budgetsGetPayload<T> | null,
    [
      cacheTags.eventBudgets,
      cacheTags.eventBudgetsCount,
      ...(revalidateTags ?? []),
    ],
  );

const deleteEventBudget = async <T extends Prisma.event_budgetsDefaultArgs>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_budgetsWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.event_budgetsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_budgetsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_budgets.delete({
        where: filter,
        ...(options as Prisma.event_budgetsDefaultArgs),
      })) as Prisma.event_budgetsGetPayload<T> | null,
    [
      cacheTags.eventBudgets,
      cacheTags.eventBudgetsCount,
      ...(revalidateTags ?? []),
    ],
  );

const deleteEventBudgets = async ({
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_budgetsWhereInput;
  revalidateTags?: string[];
}): Promise<Prisma.BatchPayload> =>
  mutate(
    async () => await db.event_budgets.deleteMany({ where: filter }),
    [
      cacheTags.eventBudgets,
      cacheTags.eventBudgetsCount,
      ...(revalidateTags ?? []),
    ],
  );

export const eventBudgetService = {
  getEventBudgetUniq,
  getEventBudgets,
  getEventBudgetCount,
  createEventBudget,
  updateEventBudget,
  upsertEventBudget,
  deleteEventBudget,
  deleteEventBudgets,
};
