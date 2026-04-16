import { Step, StepContainer } from "@/components/shared/progress/step";
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
import ECApprovalForm from "@/features/event/components/ec-approval-form";
import EventSection from "@/features/event/components/event-section";
import FirstApproverForm from "@/features/event/components/first-approver-form";
import { EventStatusSection } from "@/features/event/components/preview/event-status-section";
import EventStatusUpdateForm from "@/features/event/components/status-form";
import TrackingEventForm from "@/features/event/components/tracking-form";
import { getEvent } from "@/features/event/lib/event";
import { getEventStatusHistories } from "@/features/event/lib/status-history";
import { getAuthUser, getDashboardRole } from "@/lib/dal";
import { getApproverEventStatus } from "@/lib/event";
import { event_current_status } from "@/lib/generated/prisma";
import { AuthUser } from "@/types/auth-user";
import { Params } from "@/types/search-params";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function EventPreviewPage({ params }: { params: Params }) {
  const dashboardRole = await getDashboardRole();

  if (dashboardRole === "ao") return notFound();

  return (
    <Section>
      <SectionHeader>
        <SectionHeadingWithBackButton
          title="Events"
          subtitle="dashboard / event / preview"
        />
      </SectionHeader>

      <Suspense fallback={<SectionSpinner />}>
        <EventDetailsSection params={params} />
      </Suspense>

      <Suspense fallback={<SectionSpinner />}>
        <EventStatusHistorySection params={params} />
      </Suspense>
    </Section>
  );
}

const EventDetailsSection = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const res = await getEvent(id?.toString() ?? "");
  const user = await getAuthUser();
  const role = await getDashboardRole();

  const canBypassStatusCheck = ["ec", "superadmin"].some((i) => i == role);
  const isFinalStatus = ["approved", "rejected"].includes(
    res.data?.current_status ?? "",
  );

  if (!res.data) return notFound();

  const { currentUserSubmission, eventTypeRole } = getApproverEventStatus(
    res.data,
    role as string,
  );

  if (!canBypassStatusCheck) {
    if (currentUserSubmission !== 'pending') {
      return (
        <Section className="border p-6 rounded-md mt-10">
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <SectionHeading2>Event Current Status</SectionHeading2>
            <Separator />
            <p className="text-center">
              This event - ({res.data.product.name}) /{" "}
              {res.data.event_type?.title} / <strong>{res.data.title}</strong>{" "}
              is <em>{currentUserSubmission}</em> by you.
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

      <FirstApproverForm
        authUser={user as AuthUser}
        role={role as string}
        eventData={res.data}
      />

      {(role === "ec" || role === 'superadmin') && (
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

      {res.data.event_consultant.length !== 0 && (
        <SectionContent className="border rounded-md p-6">
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
            <SectionHeading2>Event Coordinator Approval</SectionHeading2>
            <Separator />
            <ECApprovalForm authUser={user as AuthUser} eventData={res.data} />
          </div>
        </SectionContent>
      )}

      {!["ao"].includes(role as string) && (
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

const EventStatusHistorySection = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const res = await getEventStatusHistories({
    page: 1,
    size: 100,
    event_id: id?.toString(),
  });

  if (res.data?.length === 0) return null;

  return (
    <div className="border rounded-md p-4 mt-6 py-10">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
        <SectionHeading2>Event Approval History</SectionHeading2>
        <Separator />
        <StepContainer>
          {res.data?.map((item, index) => (
            <Step
              key={item.id}
              status={item.status}
              description={`${item.event_approver.user_role} (${item.event_approver.user_id}) - ${item.remarks}`}
              createdAt={item.created_at as Date}
              isLast={res.count === index + 1}
            />
          ))}
        </StepContainer>
      </div>
    </div>
  );
};
