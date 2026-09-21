import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { SectionLoader } from "@/components/shared/skeleton/section";
import { SectionHeading } from "@/components/shared/typography/heading";
import CreateAreaButton from "@/features/area/components/create-button";
import PreviewTree from "@/features/area/components/preview-tree";
import { getAreas } from "@/features/area/libs/area";
import { NoAccess } from "@/components/shared/state/state";
import { getActivePermissions } from "@/lib/permission-guard";
import { SearchParams } from "@/types/search-params";
import React from "react";

export default async function AreaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const permissions = await getActivePermissions();

  if (!permissions.includes("area:view")) return <NoAccess />;

  return (
    <Section>
      <div className="border rounded-md p-4">
        <SectionHeader>
          <SectionHeading>Area</SectionHeading>

          {permissions.includes("area:create") && <CreateAreaButton />}
        </SectionHeader>

        <SectionContent>
          <React.Suspense fallback={<SectionLoader />}>
            <AreaPreview
              searchParams={searchParams}
              permissions={{
                create: permissions.includes("area:create"),
                update: permissions.includes("area:update"),
              }}
            />
          </React.Suspense>
        </SectionContent>
      </div>
    </Section>
  );
}

const AreaPreview = async ({
  searchParams,
  permissions,
}: {
  searchParams: SearchParams;
  permissions: { create: boolean; update: boolean };
}) => {
  const { page, search } = await searchParams;
  const res = await getAreas({
    page: Number(page || 1),
    size: 1000,
    search: search?.toString(),
  });
  return (
    <ErrorBoundary message={res.message ? undefined : res.message}>
      <PreviewTree data={res.data ?? []} permissions={permissions} />
    </ErrorBoundary>
  );
};
