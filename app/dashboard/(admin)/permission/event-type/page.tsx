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
import CreatEventTypeButton from "@/features/event-type/components/create-button";
import { TableSkeleton } from "@/components/shared/skeleton/table";
import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import EventTypeTable from "@/features/event-type/components/table";
import PagePagination from "@/components/shared/pagination/pagination";
import { SearchParams } from "@/types/search-params";
import { Metadata } from "next";
import { getEventTypes } from "@/features/event-type/libs/event-type";

export const metadata: Metadata = {
  title: `Event Type - Permission`,
};

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
        <CreatEventTypeButton />

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

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <EventTypeTable data={res?.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
