import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import { SearchForm } from "@/components/shared/inputs/search";
import PagePagination from "@/components/shared/pagination/pagination";
import {
  Section,
  SectionActions,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { TableSkeleton } from "@/components/shared/skeleton/table";
import {
  SectionHeading,
  SectionHeadingIcon,
} from "@/components/shared/typography/heading";
import EventTable from "@/features/event/components/table";
import { getEvents } from "@/features/event/lib/event";
import { SearchParams } from "@/types/search-params";
import { getPageData } from "@/utils/helper";
import { Suspense } from "react";

export default function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageTitle = "Events";

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

          <SectionActions>
            <SearchForm />
            {/* <DownloadButton filePath="/public/templates/quiz_template.xlsx" /> */}
            {/* <ExcelUploadButton action={createDoctors} /> */}
            {/* <CreateDoctorButton /> */}
          </SectionActions>
        </SectionHeader>

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

  const res = await getEvents({
    page: Number(page),
    size: Number(size),
    search: search?.toString().trim(),
  });

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <EventTable data={res?.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
