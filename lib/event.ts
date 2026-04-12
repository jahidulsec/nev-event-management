import { EventSingleProps } from "@/features/event/lib/event";

export const getApproverEventStatus = (
  event: EventSingleProps,
  role: string,
) => {
  const eventStatus = event.event_approver;
  const eventApproverCount = event.event_type?.approver.length || 0;
  const getApproverIndex =
    eventStatus.length < eventApproverCount
      ? eventStatus.length
      : eventApproverCount;
  const eventType = event.event_type?.approver?.[getApproverIndex]?.type;
  const eventTypeRole =
    event.event_type?.approver?.[getApproverIndex]?.user_type;

  // get user status submission
  const eventUserStatus = event.event_approver.filter(
    (item) => item.user_role === role,
  );

  // if previous approver rejectes
  const prevRejected = event.event_approver.filter(
    (i) => i.event_status_history[0]?.status === "rejected",
  );

  const currentUserSubmission: any =
    prevRejected.length > 0
      ? "rejected"
      : (eventUserStatus?.[0]?.event_status_history?.[0]?.status ?? "pending");

  const currentUserLastStatus = eventUserStatus?.[0]?.event_status_history?.[0];

  return {
    eventType,
    eventTypeRole,
    currentUserLastStatus,
    currentUserSubmission,
  };
};