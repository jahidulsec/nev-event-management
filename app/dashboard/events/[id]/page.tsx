import React, { Suspense } from "react";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "@/components/shared/section/section";
import { SectionHeadingWithBackButton } from "@/components/shared/typography/heading";
import EventForm from "@/features/event/components/form";
import { getEvent } from "@/features/event/lib/event";
import { Params } from "@/types/search-params";
import { notFound } from "next/navigation";
import { getEventTypes } from "@/features/event/lib/type";
import { getAuthUser } from "@/lib/dal";
import { AuthUser } from "@/types/auth-user";
import EventStatusUpdateForm from "@/features/event/components/status-form";
import { Separator } from "@/components/ui/separator";
import { getEventStatusHistories } from "@/features/event/lib/status-history";
import { SquareCheck, SquareX } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatter";
import { event_current_status } from "@/lib/generated/prisma";

export default async function EventDetailsPage({ params }: { params: Params }) {
  return (
    <Section>
      <SectionHeader>
        <SectionHeadingWithBackButton
          title="Events"
          subtitle="dashboard / event / edit"
        />
      </SectionHeader>
      <Suspense>
        <EventFormSection params={params} />
      </Suspense>
      <Suspense>
        <EventStatusHistorySection params={params} />
      </Suspense>
    </Section>
  );
}

const EventFormSection = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const res = await getEvent(id?.toString() ?? "");
  const eventTypeRes = await getEventTypes({ page: 1, size: 100 });
  const user = await getAuthUser();

  if (!res.data) return notFound();

  return (
    <SectionContent className="border p-6 rounded-md">
      <EventForm
        authUser={user as AuthUser}
        eventTypes={eventTypeRes.data ?? []}
        prevData={res.data}
      />

      {user?.role !== "ao" && (
        <div className="max-w-2xl mx-auto flex flex-col w-full py-10 gap-6">
          <Separator />
          <h4 className="w-full text-2xl font-medium">Approval Section</h4>
          <EventStatusUpdateForm authUser={user as AuthUser} event={res.data} />
        </div>
      )}
    </SectionContent>
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
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
        <h4 className="w-full text-2xl font-medium">Event Approval History</h4>
        <Separator />
        <div className="flex flex-col gap-3">
          {res.data?.map((item, index) => (
            <Step
              key={item.id}
              status={item.status}
              description={`${item.event_approver.user_role} (${item.event_approver.user_id}) - ${item.remarks}`}
              createdAt={item.created_at as Date}
              isLast={res.count === index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Step = ({
  status,
  description,
  createdAt,
  isLast,
}: {
  description: string;
  createdAt: Date;
  isLast?: boolean;
  status: event_current_status;
}) => {
  return (
    <div className="flex gap-6 overflow-hidden min-h-20 py-3">
      <p className="text-sm hidden lg:block mt-1.5">{formatDate(createdAt)}</p>

      {/* icon */}
      <div className="relative">
        <div
          className={cn(
            "w-fit h-fit p-2 rounded-full after:bg-muted-foreground after:w-px after:h-full after:block after:absolute after:left-2 after:mx-2 after:-bottom-10",
            isLast ? "after:hidden" : "",
            status === "approved"
              ? "bg-green-100"
              : status === "rejected"
                ? "bg-red-100"
                : "bg-yellow-100",
          )}
        >
          {status === "approved" ? (
            <SquareCheck className="size-4 fill-green-500/40 text-green-700" />
          ) : status === "rejected" ? (
            <SquareX className="size-4 fill-red-500/40 text-red-700" />
          ) : (
            <SquareCheck className="size-4 fill-yellow-500/40 text-yellow-700" />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p></p>
        <p className="text-muted-foreground">
          {" "}
          <strong>{status.replaceAll("_", " ")}:</strong> {description}
        </p>
        <p className="text-sm block lg:hidden">{formatDate(createdAt)}</p>
      </div>
    </div>
  );
};
