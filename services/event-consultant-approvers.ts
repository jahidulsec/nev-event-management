import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getEventConsultantApprovalUniq = async <
  T extends Prisma.event_consultant_approvalsDefaultArgs,
>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.event_consultant_approvalsWhereUniqueInput;
  options?: Prisma.SelectSubset<
    T,
    Prisma.event_consultant_approvalsDefaultArgs
  >;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.event_consultant_approvalsGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.event_consultant_approvals.findUnique({
        where: filter,
        ...(options as Prisma.event_consultant_approvalsDefaultArgs),
      }) as Promise<Prisma.event_consultant_approvalsGetPayload<T> | null>,
    cacheTags.eventConsultantApprovals,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getEventConsultantApprovals = async <
  T extends Prisma.event_consultant_approvalsDefaultArgs,
>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.event_consultant_approvalsWhereInput;
  options?: Prisma.SelectSubset<
    T,
    Prisma.event_consultant_approvalsDefaultArgs
  >;
  take?: number;
  skip?: number;
  sort?: Prisma.event_consultant_approvalsOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.event_consultant_approvalsGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.event_consultant_approvals.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.event_consultant_approvalsDefaultArgs),
      }) as Promise<Prisma.event_consultant_approvalsGetPayload<T>[] | null>,
    cacheTags.eventConsultantApprovals,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getEventConsultantApprovalCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.event_consultant_approvalsWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.event_consultant_approvals.count({ where: filter }),
    cacheTags.eventConsultantApprovalsCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createEventConsultantApproval = async <
  T extends Prisma.event_consultant_approvalsDefaultArgs,
>({
  data,
  options,
}: {
  data: Prisma.event_consultant_approvalsCreateInput;
  options?: Prisma.SelectSubset<
    T,
    Prisma.event_consultant_approvalsDefaultArgs
  >;
}): Promise<Prisma.event_consultant_approvalsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_consultant_approvals.create({
        data,
        ...(options as Prisma.event_consultant_approvalsDefaultArgs),
      })) as Prisma.event_consultant_approvalsGetPayload<T> | null,
    [cacheTags.eventConsultantApprovals, cacheTags.eventConsultantApprovalsCount],
  );

const updateEventConsultantApproval = async <
  T extends Prisma.event_consultant_approvalsDefaultArgs,
>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_consultant_approvalsWhereUniqueInput;
  data: Prisma.event_consultant_approvalsUpdateInput;
  options?: Prisma.SelectSubset<
    T,
    Prisma.event_consultant_approvalsDefaultArgs
  >;
  revalidateTags?: string[];
}): Promise<Prisma.event_consultant_approvalsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_consultant_approvals.update({
        where: filter,
        data,
        ...(options as Prisma.event_consultant_approvalsDefaultArgs),
      })) as Prisma.event_consultant_approvalsGetPayload<T> | null,
    [
      cacheTags.eventConsultantApprovals,
      cacheTags.eventConsultantApprovalsCount,
      ...(revalidateTags ?? []),
    ],
  );

const deleteEventConsultantApproval = async <
  T extends Prisma.event_consultant_approvalsDefaultArgs,
>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_consultant_approvalsWhereUniqueInput;
  options?: Prisma.SelectSubset<
    T,
    Prisma.event_consultant_approvalsDefaultArgs
  >;
  revalidateTags?: string[];
}): Promise<Prisma.event_consultant_approvalsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_consultant_approvals.delete({
        where: filter,
        ...(options as Prisma.event_consultant_approvalsDefaultArgs),
      })) as Prisma.event_consultant_approvalsGetPayload<T> | null,
    [
      cacheTags.eventConsultantApprovals,
      cacheTags.eventConsultantApprovalsCount,
      ...(revalidateTags ?? []),
    ],
  );

export const eventConsultantApprovalService = {
  getEventConsultantApprovalUniq,
  getEventConsultantApprovalCount,
  getEventConsultantApprovals,
  createEventConsultantApproval,
  updateEventConsultantApproval,
  deleteEventConsultantApproval,
};
