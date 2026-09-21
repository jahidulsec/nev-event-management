import React, { Suspense } from "react";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import {
  SectionHeading2,
  SectionHeadingWithBackButton,
} from "@/components/shared/typography/heading";
import { NoAccess } from "@/components/shared/state/state";
import { SectionSpinner } from "@/components/shared/spinner/section";
import { Separator } from "@/components/ui/separator";
import { getEventTypes } from "@/features/event-type/libs/event-type";
import { EventStatusHistorySection } from "@/features/event-status-histories/components/event-status-history";
import EventStatusUpdateForm from "@/features/event-status-histories/components/status-form";
import EventForm from "@/features/events/components/form";
import { getEvent } from "@/features/events/libs/events";
import { getEventFormValues } from "@/features/events/utils/form-values";
import { getAuthUser, getDashboardRole } from "@/lib/dal";
import { getActivePermissions } from "@/lib/permission-guard";
import { AuthUser } from "@/types/auth-user";
import { Params } from "@/types/search-params";
import { notFound } from "next/navigation";

export default async function EventDetailsPage({ params }: { params: Params }) {
  const permissions = await getActivePermissions();
  const { id } = await params;

  if (!permissions.includes("event:update")) return <NoAccess />;

  return (
    <Section>
      <SectionHeader>
        <SectionHeadingWithBackButton
          title="Events"
          subtitle="dashboard / event / edit"
          href={"/dashboard/events"}
        />
      </SectionHeader>
      <Suspense fallback={<SectionSpinner />}>
        <EventFormSection
          eventId={id?.toString() ?? ""}
          canApprove={permissions.includes("event:approve")}
        />
      </Suspense>
      <Suspense fallback={<SectionSpinner />}>
        <EventStatusHistorySection eventId={id?.toString() ?? ""} />
      </Suspense>
    </Section>
  );
}

const EventFormSection = async ({
  eventId,
  canApprove,
}: {
  eventId: string;
  canApprove: boolean;
}) => {
  const [res, eventTypeRes, user, role] = await Promise.all([
    getEvent(eventId),
    getEventTypes({ page: 1, size: 100 }),
    getAuthUser(),
    getDashboardRole(),
  ]);

  if (!res.data) return notFound();

  return (
    <>
      <SectionContent className="border p-6 rounded-md">
        <EventForm
          eventTypes={eventTypeRes.data ?? []}
          prevData={getEventFormValues(res.data)}
        />
      </SectionContent>
      {canApprove && (
        <SectionContent className="border rounded-md">
          <div className="max-w-4xl mx-auto flex flex-col w-full py-10 gap-6 p-6">
            <SectionHeading2>Approval Section</SectionHeading2>
            <Separator />
            <EventStatusUpdateForm
              role={role as string}
              authUser={user as AuthUser}
              event={res.data}
            />
          </div>
        </SectionContent>
      )}
    </>
  );
};
