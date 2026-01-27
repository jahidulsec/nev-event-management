import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import { DownloadButton } from "@/components/shared/button/download";
import { ExcelUploadButton } from "@/components/shared/button/excel-upload";
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
import { createEmployees } from "@/features/employee/actions/employee";
import CreateEmployeeButton from "@/features/employee/components/create-button";
import EmployeeTable from "@/features/employee/components/table";
import { getEmployees } from "@/features/employee/lib/employee";
import { SearchParams } from "@/types/search-params";
import { getPageData } from "@/utils/helper";
import { Suspense } from "react";

export default function DoctorsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageTitle = "Employees";

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
            <DownloadButton filePath="/public/templates/quiz_template.xlsx" />
            <ExcelUploadButton action={createEmployees} />
            <CreateEmployeeButton />
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

  const res = await getEmployees({
    page: Number(page),
    size: Number(size),
    search: search?.toString().trim(),
  });

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <EmployeeTable data={res?.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
