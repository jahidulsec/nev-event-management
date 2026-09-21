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
import { NoAccess } from "@/components/shared/state/state";
import { getActivePermissions } from "@/lib/permission-guard";
import { RowPermissions } from "@/types/permission";
import { SearchParams } from "@/types/search-params";
import { getPageData } from "@/utils/helper";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Doctors`,
};

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageTitle = "Doctors";

  const pageData = getPageData(pageTitle, "superadmin");

  const permissions = await getActivePermissions();

  if (!permissions.includes("doctor:view")) return <NoAccess />;

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
            {permissions.includes("doctor:import") && (
              <>
                <DownloadButton filePath="/public/templates/doctor_list_template.xlsx" />
                <ExcelUploadButton action={createDoctors} />
              </>
            )}
            {permissions.includes("doctor:create") && <CreateDoctorButton />}
          </SectionActions>
        </SectionHeader>

        <SectionContent>
          <Suspense fallback={<TableSkeleton />}>
            <TableSection
              searchParams={searchParams}
              permissions={{
                update: permissions.includes("doctor:update"),
                delete: permissions.includes("doctor:delete"),
              }}
            />
          </Suspense>
        </SectionContent>
      </Section>
    </>
  );
}

const TableSection = async ({
  searchParams,
  permissions,
}: {
  searchParams: SearchParams;
  permissions: RowPermissions;
}) => {
  const { page, size, search } = await searchParams;

  const res = await getDoctors({
    page: Number(page),
    size: Number(size),
    search: search?.toString().trim(),
  });

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <DoctorTable data={res?.data ?? []} permissions={permissions} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
