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
import { SectionHeading } from "@/components/shared/typography/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateUserAreaButton from "@/features/users-area/components/create-button";
import UserAreaTable from "@/features/users-area/components/table";
import { getUserAreas } from "@/features/users-area/libs/user-area";
import CreateUserProductButton from "@/features/users-product/components/create-button";
import UserProductTable from "@/features/users-product/components/table";
import { getUserProducts } from "@/features/users-product/libs/user-product";
import { SearchParams } from "@/types/search-params";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/settings";
import React from "react";

export default async function UserRelationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Section>
      <SectionHeader>
        <SectionHeading>User Relations</SectionHeading>
      </SectionHeader>

      <SectionContent>
        <Tabs defaultValue="area">
          <TabsList>
            <TabsTrigger value="area">Area Scope</TabsTrigger>
            <TabsTrigger value="product">Product Scope</TabsTrigger>
          </TabsList>

          <TabsContent value="area">
            <SectionContent className="mt-4">
              <SectionHeader>
                <SearchForm />
                <CreateUserAreaButton />
              </SectionHeader>

              <React.Suspense fallback={<TableSkeleton />}>
                <AreaScopeContainer searchParams={searchParams} />
              </React.Suspense>
            </SectionContent>
          </TabsContent>

          <TabsContent value="product">
            <SectionContent className="mt-4">
              <SectionHeader>
                <SearchForm />
                <CreateUserProductButton />
              </SectionHeader>

              <React.Suspense fallback={<TableSkeleton />}>
                <ProductScopeContainer searchParams={searchParams} />
              </React.Suspense>
            </SectionContent>
          </TabsContent>
        </Tabs>
      </SectionContent>
    </Section>
  );
}

const AreaScopeContainer = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { page, size, search } = await searchParams;

  const res = await getUserAreas({
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString(),
  });

  return (
    <ErrorBoundary message={res.success ? undefined : res.message}>
      <UserAreaTable data={res.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};

const ProductScopeContainer = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { page, size, search } = await searchParams;

  const res = await getUserProducts({
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    search: search?.toString(),
  });

  return (
    <ErrorBoundary message={res.success ? undefined : res.message}>
      <UserProductTable data={res.data ?? []} />
      <PagePagination count={res.count} />
    </ErrorBoundary>
  );
};
