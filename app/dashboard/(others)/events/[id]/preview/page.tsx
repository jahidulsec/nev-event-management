import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { SectionSpinner } from "@/components/shared/spinner/section";
import {
  SectionHeading2,
  SectionHeadingWithBackButton,
} from "@/components/shared/typography/heading";
import { Separator } from "@/components/ui/separator";
import FirstApproverForm from "@/features/event-consultant-approvers/components/first-approver-form";
import { EventStatusHistorySection } from "@/features/event-status-histories/components/event-status-history";
import EventSection from "@/features/events/components/event-section";
import { EventStatusSection } from "@/features/event-status-histories/components/event-status-section";
import TrackingEventForm from "@/features/events/components/tracking-form";
import { getEvent } from "@/features/events/libs/events";
import { getAuthUser, getDashboardRole } from "@/lib/dal";
import { getApproverEventStatus } from "@/lib/event";
import { event_current_status } from "@/lib/generated/prisma/client";
import { AuthUser } from "@/types/auth-user";
import { Params } from "@/types/search-params";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EventStatusUpdateForm from "@/features/event-status-histories/components/status-form";
import ECApprovalForm from "@/features/event-approvers/components/ec-approval-form";
import { NoAccess } from "@/components/shared/state/state";
import { getActivePermissions } from "@/lib/permission-guard";
import { Permission } from "@/lib/permissions";

export default async function EventPreviewPage({ params }: { params: Params }) {
  const permissions = await getActivePermissions();
  const { id } = await params;

  if (!permissions.includes("event:view")) return <NoAccess />;

  return (
    <Section>
      <SectionHeader>
        <SectionHeadingWithBackButton
          title="Events"
          subtitle="dashboard / event / preview"
          href={"/dashboard/events"}
        />
      </SectionHeader>

      <Suspense fallback={<SectionSpinner />}>
        <EventDetailsSection params={params} permissions={permissions} />
      </Suspense>

      <Suspense fallback={<SectionSpinner />}>
        <EventStatusHistorySection eventId={id?.toString() ?? ""} />
      </Suspense>
    </Section>
  );
}

const EventDetailsSection = async ({
  params,
  permissions,
}: {
  params: Params;
  permissions: Permission[];
}) => {
  const { id } = await params;
  const res = await getEvent(id?.toString() ?? "");
  const user = await getAuthUser();
  const role = await getDashboardRole();

  const canBypassStatusCheck = ["ec", "superadmin"].some((i) => i == role);
  const isFinalStatus = ["approved", "rejected"].includes(
    res.data?.current_status ?? "",
  );

  if (!res.data) return notFound();

  const { currentUserSubmission } = getApproverEventStatus(
    res.data,
    role as string,
  );

  if (!canBypassStatusCheck) {
    if (currentUserSubmission !== "pending") {
      return (
        <Section className="border p-6 rounded-md mt-10">
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <SectionHeading2>Event Current Status</SectionHeading2>
            <Separator />
            <p className="text-center">
              This event - ({res.data.product.name}) /{" "}
              {res.data.event_type?.title} / <strong>{res.data.title}</strong>{" "}
              is <em>{currentUserSubmission}</em>{" "}
              {res.data?.current_status === "rejected" ? "" : "by you"}.
            </p>
          </div>
        </Section>
      );
    }
    if (isFinalStatus) {
      return (
        <EventStatusSection
          status={res.data.current_status as event_current_status}
        />
      );
    }
  }

  return (
    <>
      <SectionContent className="border p-6 rounded-md">
        <EventSection role={role as string} prevData={res.data} />
      </SectionContent>

      {permissions.includes("event:approve") && (
        <FirstApproverForm
          authUser={user as AuthUser}
          role={role as string}
          eventData={res.data}
        />
      )}

      {permissions.includes("event:update_tracking") && (
        <SectionContent className="border rounded-md p-6">
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
            <SectionHeading2>Tracking No.</SectionHeading2>
            <Separator />
            <TrackingEventForm
              eventId={res.data.id}
              trackingNo={res.data.track_no ?? ""}
            />
          </div>
        </SectionContent>
      )}

      {permissions.includes("event:approve") &&
        res.data.event_consultants.length !== 0 && (
          <SectionContent className="border rounded-md p-6">
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
              <SectionHeading2>Event Coordinator Approval</SectionHeading2>
              <Separator />
              <ECApprovalForm
                authUser={user as AuthUser}
                eventData={res.data}
              />
            </div>
          </SectionContent>
        )}

      {permissions.includes("event:approve") && (
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
