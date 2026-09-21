import {
  ApproverTypeBadge,
  UserRoleBadge,
} from "@/components/shared/badge/badge";
import { Step, StepContainer } from "@/components/shared/progress/step";
import { SectionHeading2 } from "@/components/shared/typography/heading";
import { Separator } from "@/components/ui/separator";
import { QuoteIcon } from "lucide-react";
import { getEventStatusHistories } from "../libs/event-status-histories";

export const EventStatusHistorySection = async ({
  eventId,
}: {
  eventId: string;
}) => {
  const res = await getEventStatusHistories({
    page: 1,
    size: 100,
    event_id: eventId,
  });

  if (res.data?.length === 0) return null;

  return (
    <div className="border rounded-md p-4 mt-6 py-10">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
        <SectionHeading2>Event Approval History</SectionHeading2>
        <Separator />
        <StepContainer>
          {res.data?.map((item, index) => {
            const approver = item.event_approvers;
            const approverFullName = approver.users?.full_name ?? "";

            const approverType = item.remarks?.split(":")[0];
            const comment = item.remarks?.split(":")[1];

            return (
              <Step
                key={item.id}
                status={item.status}
                description={
                  <>
                    <br />
                    <strong>{approverFullName} </strong>
                    <em className="text-sm">({approver.employee_id})</em> :{" "}
                    <UserRoleBadge type={approver.user_role as "ao"}>
                      {approver.user_role}
                    </UserRoleBadge>
                    <ApproverTypeBadge type={approverType as "final"}>
                      {approverType}
                    </ApproverTypeBadge>
                    <br />
                    <blockquote className="relative border rounded-md p-8 py-4 bg-background text-sm mt-3 isolate">
                      <QuoteIcon className="size-3.5 fill-muted text-muted absolute rotate-180 -z-1 top-3 left-2" />
                      {comment}
                    </blockquote>
                  </>
                }
                createdAt={item.created_at as Date}
                isLast={res.count === index + 1}
              />
            );
          })}
        </StepContainer>
      </div>
    </div>
  );
};
