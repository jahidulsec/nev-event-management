import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { SectionHeadingWithBackButton } from "@/components/shared/typography/heading";
import { getEventTypes } from "@/features/event-type/libs/event-type";
import EventForm from "@/features/events/components/form";
import { getAuthUser, getDashboardArea } from "@/lib/dal";
import { AuthUser } from "@/types/auth-user";
import React from "react";

export default async function EventCreatePage() {
  const authUser = await getAuthUser();
  const dashboardUserAreaCode = await getDashboardArea();
  const res = await getEventTypes({ page: 1, size: 100 });

  return (
    <Section>
      <SectionHeader>
        <SectionHeadingWithBackButton
          title="Events"
          subtitle="dashboard / event / create"
        />
      </SectionHeader>

      <SectionContent className="border p-6 rounded-md">
        <EventForm
          eventTypes={res.data ?? []}
          prevData={{
            employee_id: authUser?.employeeId,
            sap_area_code:
              dashboardUserAreaCode || authUser?.sapAreaCodes?.[0] || "",
          }}
        />
      </SectionContent>
    </Section>
  );
}
