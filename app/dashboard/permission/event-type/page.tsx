import React, { Suspense } from "react";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import {
  SectionHeading,
  SectionHeadingIcon,
} from "@/components/shared/typography/heading";
import { getPageData } from "@/utils/helper";
import TabSection from "@/components/permission/tab-section";
import CreatEventTypeButton from "@/features/event/components/type/create-button";
import { TableSkeleton } from "@/components/shared/skeleton/table";
import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import EventTypeTable from "@/features/event/components/type/table";
import PagePagination from "@/components/shared/pagination/pagination";
import { getEventTypes } from "@/features/event/lib/type";
import { SearchParams } from "@/types/search-params";
import { Prisma } from "@/lib/generated/prisma";

export default function PermissionEventTypePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageTitle = "Permissions";

  const pageData = getPageData(pageTitle, "superadmin");

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionHeading>
            {pageData && (
              <SectionHeadingIcon>
                <pageData.icon />
              </SectionHeadingIcon>
            )}
            {pageTitle}
          </SectionHeading>
        </SectionHeader>
        <TabSection>
          <CreatEventTypeButton />
        </TabSection>

        <SectionContent>
          <Suspense fallback={<TableSkeleton />}>
            <TableSection searchParams={searchParams} />
          </Suspense>
        </SectionContent>
      </Section>
    </>
  );
}

const TableSection = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { page, size, search } = await searchParams;

  const res = await getEventTypes({
    page: Number(page),
    size: Number(size),
    search: search?.toString().trim(),
  });

  const test = new Prisma.Decimal(150.02);

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <EventTypeTable data={res?.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
