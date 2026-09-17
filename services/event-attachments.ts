import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma/browser";
import {
  cachedRead,
  cacheTags,
  mutate,
  ServerCacheOptions,
} from "@/lib/server-cache";

const getEventAttachmentUniq = async <
  T extends Prisma.event_attachmentsDefaultArgs,
>({
  filter,
  options,
  cacheOption,
}: {
  filter: Prisma.event_attachmentsWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.event_attachmentsDefaultArgs>;
  cacheOption?: Partial<ServerCacheOptions>;
}): Promise<Prisma.event_attachmentsGetPayload<T> | null> =>
  cachedRead(
    () =>
      db.event_attachments.findUnique({
        where: filter,
        ...(options as Prisma.event_attachmentsDefaultArgs),
      }) as Promise<Prisma.event_attachmentsGetPayload<T> | null>,
    cacheTags.eventAttachments,
    [JSON.stringify(filter), JSON.stringify(options ?? {})],
    cacheOption,
  );

const getEventAttachments = async <
  T extends Prisma.event_attachmentsDefaultArgs,
>({
  filter,
  options,
  take,
  skip,
  sort,
  cacheOption,
}: {
  filter?: Prisma.event_attachmentsWhereInput;
  options?: Prisma.SelectSubset<T, Prisma.event_attachmentsDefaultArgs>;
  take?: number;
  skip?: number;
  sort?: Prisma.event_attachmentsOrderByWithRelationInput;
  cacheOption?: ServerCacheOptions;
}): Promise<Prisma.event_attachmentsGetPayload<T>[] | null> =>
  cachedRead(
    () =>
      db.event_attachments.findMany({
        where: filter,
        take,
        skip,
        orderBy: sort,
        ...(options as Prisma.event_attachmentsDefaultArgs),
      }) as Promise<Prisma.event_attachmentsGetPayload<T>[] | null>,
    cacheTags.eventAttachments,
    [
      JSON.stringify(filter),
      JSON.stringify(options ?? {}),
      JSON.stringify({ take, skip, sort }),
    ],
    cacheOption,
  );

const getEventAttachmentCount = async ({
  filter,
  cacheOption,
}: {
  filter?: Prisma.event_attachmentsWhereInput;
  cacheOption?: ServerCacheOptions;
}): Promise<number> =>
  cachedRead(
    () => db.event_attachments.count({ where: filter }),
    cacheTags.eventAttachmentsCount,
    [JSON.stringify(filter)],
    cacheOption,
  );

const createEventAttachment = async <
  T extends Prisma.event_attachmentsDefaultArgs,
>({
  data,
  options,
  revalidateTags,
}: {
  data:
    | Prisma.event_attachmentsCreateInput
    | Prisma.event_attachmentsUncheckedCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_attachmentsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_attachmentsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_attachments.create({
        data,
        ...(options as Prisma.event_attachmentsDefaultArgs),
      })) as Prisma.event_attachmentsGetPayload<T> | null,
    [
      cacheTags.eventAttachments,
      cacheTags.eventAttachmentsCount,
      ...(revalidateTags ?? []),
    ],
  );

const updateEventAttachment = async <
  T extends Prisma.event_attachmentsDefaultArgs,
>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_attachmentsWhereUniqueInput;
  data:
    | Prisma.event_attachmentsUpdateInput
    | Prisma.event_attachmentsUncheckedUpdateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_attachmentsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_attachmentsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_attachments.update({
        where: filter,
        data,
        ...(options as Prisma.event_attachmentsDefaultArgs),
      })) as Prisma.event_attachmentsGetPayload<T> | null,
    [
      cacheTags.eventAttachments,
      cacheTags.eventAttachmentsCount,
      ...(revalidateTags ?? []),
    ],
  );

const upsertEventAttachment = async <
  T extends Prisma.event_attachmentsDefaultArgs,
>({
  data,
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_attachmentsWhereUniqueInput;
  data:
    | Prisma.event_attachmentsCreateInput
    | Prisma.event_attachmentsUncheckedCreateInput;
  options?: Prisma.SelectSubset<T, Prisma.event_attachmentsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_attachmentsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_attachments.upsert({
        where: filter,
        create: data,
        update: data,
        ...(options as Prisma.event_attachmentsDefaultArgs),
      })) as Prisma.event_attachmentsGetPayload<T> | null,
    [
      cacheTags.eventAttachments,
      cacheTags.eventAttachmentsCount,
      ...(revalidateTags ?? []),
    ],
  );

const deleteEventAttachment = async <
  T extends Prisma.event_attachmentsDefaultArgs,
>({
  options,
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_attachmentsWhereUniqueInput;
  options?: Prisma.SelectSubset<T, Prisma.event_attachmentsDefaultArgs>;
  revalidateTags?: string[];
}): Promise<Prisma.event_attachmentsGetPayload<T> | null> =>
  mutate(
    async () =>
      (await db.event_attachments.delete({
        where: filter,
        ...(options as Prisma.event_attachmentsDefaultArgs),
      })) as Prisma.event_attachmentsGetPayload<T> | null,
    [
      cacheTags.eventAttachments,
      cacheTags.eventAttachmentsCount,
      ...(revalidateTags ?? []),
    ],
  );

const deleteEventAttachments = async ({
  filter,
  revalidateTags,
}: {
  filter: Prisma.event_attachmentsWhereInput;
  revalidateTags?: string[];
}): Promise<Prisma.BatchPayload> =>
  mutate(
    async () => await db.event_attachments.deleteMany({ where: filter }),
    [
      cacheTags.eventAttachments,
      cacheTags.eventAttachmentsCount,
      ...(revalidateTags ?? []),
    ],
  );

export const eventAttachmentService = {
  getEventAttachmentUniq,
  getEventAttachments,
  getEventAttachmentCount,
  createEventAttachment,
  updateEventAttachment,
  upsertEventAttachment,
  deleteEventAttachment,
  deleteEventAttachments,
};
