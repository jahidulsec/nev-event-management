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
import { createDoctors } from "@/features/doctor/actions/doctor";
import CreateDoctorButton from "@/features/doctor/components/create-button";
import DoctorTable from "@/features/doctor/components/table";
import { getDoctors } from "@/features/doctor/lib/doctor";
import { getDashboardRole } from "@/lib/dal";
import { SearchParams } from "@/types/search-params";
import { getPageData } from "@/utils/helper";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageTitle = "Doctors";

  const pageData = getPageData(pageTitle, "superadmin");

  const role = await getDashboardRole();

  if (role !== "superadmin") return notFound();

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
            <DownloadButton filePath="/public/templates/doctor_list_template.xlsx" />
            <ExcelUploadButton action={createDoctors} />
            <CreateDoctorButton />
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

  const res = await getDoctors({
    page: Number(page),
    size: Number(size),
    search: search?.toString().trim(),
  });

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <DoctorTable data={res?.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
