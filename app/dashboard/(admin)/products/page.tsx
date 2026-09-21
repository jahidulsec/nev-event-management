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
import { createProducts } from "@/features/product/actions/product";
import CreateProductButton from "@/features/product/components/create-button";
import ProductTable from "@/features/product/components/table";
import { getProducts } from "@/features/product/lib/product";
import { NoAccess } from "@/components/shared/state/state";
import { getActivePermissions } from "@/lib/permission-guard";
import { RowPermissions } from "@/types/permission";
import { SearchParams } from "@/types/search-params";
import { getPageData } from "@/utils/helper";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Products`,
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageTitle = "Products";

  const pageData = getPageData(pageTitle, "superadmin");

  const permissions = await getActivePermissions();

  if (!permissions.includes("product:view")) return <NoAccess />;

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
            {permissions.includes("product:import") && (
              <>
                <DownloadButton filePath="/public/templates/products_list_template.xlsx" />
                <ExcelUploadButton action={createProducts} />
              </>
            )}
            {permissions.includes("product:create") && <CreateProductButton />}
          </SectionActions>
        </SectionHeader>

        <SectionContent>
          <Suspense fallback={<TableSkeleton />}>
            <TableSection
              searchParams={searchParams}
              permissions={{
                update: permissions.includes("product:update"),
                delete: permissions.includes("product:delete"),
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

  const res = await getProducts({
    page: Number(page),
    size: Number(size),
    search: search?.toString().trim(),
  });

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <ProductTable data={res?.data ?? []} permissions={permissions} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
