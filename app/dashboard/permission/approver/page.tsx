import React from "react";
import { Section, SectionHeader } from "@/components/shared/section/section";
import {
  SectionHeading,
  SectionHeadingIcon,
} from "@/components/shared/typography/heading";
import { getPageData } from "@/utils/helper";
import TabSection from "@/components/permission/tab-section";

export default function PermissionApproverPage() {
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
        <TabSection />
      </Section>
    </>
  );
}
