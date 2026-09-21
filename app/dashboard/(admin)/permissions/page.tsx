import React from "react";
import { Metadata } from "next";
import { Key } from "lucide-react";
import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import {
  SectionHeading,
  SectionHeadingIcon,
  SectionSubTitle,
} from "@/components/shared/typography/heading";
import PermissionManager from "@/features/permission/components/permission-manager";
import PermissionSkeleton from "@/features/permission/components/permission-skeleton";
import { getRolePermissions } from "@/features/permission/libs/permission";
import { NoAccess } from "@/components/shared/state/state";
import { getActivePermissions } from "@/lib/permission-guard";

export const metadata: Metadata = {
  title: "Permissions",
};

export default async function PermissionsPage() {
  const permissions = await getActivePermissions();

  if (!permissions.includes("permission:view")) return <NoAccess />;

  return (
    <Section>
      <SectionHeader>
        <div className="flex flex-col gap-1">
          <SectionHeading>
            <SectionHeadingIcon>
              <Key />
            </SectionHeadingIcon>
            Permissions
          </SectionHeading>
          <SectionSubTitle>
            Overview of all roles and their associated resource permissions.
          </SectionSubTitle>
        </div>
      </SectionHeader>

      <SectionContent>
        <React.Suspense fallback={<PermissionSkeleton />}>
          <PermissionSection
            canManage={permissions.includes("permission:manage")}
          />
        </React.Suspense>
      </SectionContent>
    </Section>
  );
}

const PermissionSection = async ({ canManage }: { canManage: boolean }) => {
  const res = await getRolePermissions();

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <PermissionManager data={res.data ?? []} canManage={canManage} />
    </ErrorBoundary>
  );
};
