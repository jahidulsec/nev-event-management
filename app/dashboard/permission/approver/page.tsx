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
import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import PagePagination from "@/components/shared/pagination/pagination";
import EventTypeTable from "@/features/event/components/type/table";
import { getEventTypeApprovers } from "@/features/event/lib/type-approver";
import { SearchParams } from "@/types/search-params";
import { TableSkeleton } from "@/components/shared/skeleton/table";
import EventTypeApproverTable from "@/features/event/components/type-approver/table";
import CreatEventTypeApproverButton from "@/features/event/components/type-approver/create-button";
import { db } from "@/config/db";

export default function PermissionApproverPage({
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
          <CreatEventTypeApproverButton />
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

  const res = await getEventTypeApprovers({
    page: Number(page),
    size: Number(size),
    search: search?.toString().trim(),
  });

 

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <EventTypeApproverTable data={res?.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
