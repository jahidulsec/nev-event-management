import type { EventSingleProps } from "@/features/events/libs/events";

export const getApproverEventStatus = (
  event: EventSingleProps,
  role: string,
) => {
  const eventStatus = event.event_approvers;
  const eventApproverCount = event.event_type?.approver.length || 0;
  const getApproverIndex =
    eventStatus.length < eventApproverCount
      ? eventStatus.length
      : eventApproverCount;
  const eventType = event.event_type?.approver?.[getApproverIndex]?.type;
  const eventTypeRole =
    event.event_type?.approver?.[getApproverIndex]?.user_type;

  // get user status submission
  const eventUserStatus = event.event_approvers.filter(
    (item) => item.user_role === role,
  );

  // if previous approver rejects
  const prevRejected = event.event_approvers.filter(
    (i) => i.event_status_histories[0]?.status === "rejected",
  );

  const currentUserSubmission: any =
    prevRejected.length > 0
      ? "rejected"
      : (eventUserStatus?.[0]?.event_status_histories?.[0]?.status ??
        "pending");

  const currentUserLastStatus =
    eventUserStatus?.[0]?.event_status_histories?.[0];

  return {
    eventType,
    eventTypeRole,
    currentUserLastStatus,
    currentUserSubmission,
  };
};