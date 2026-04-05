"use client";

import { Form } from "@/components/shared/form/form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { EventStatusSchema, EventStatusSchemaType } from "../actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventSingleProps } from "../lib/event";
import { AuthUser, AuthUserRole } from "@/types/auth-user";
import { Select } from "@/components/shared/select/select";
import { FormButton } from "@/components/shared/button/button";
import { createEventStatus } from "../actions/event";
import { toast } from "sonner";
import { useRouter } from "@bprogress/next";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { ApproverTypeBadge } from "@/components/shared/badge/badge";
import { Textarea } from "@/components/ui/textarea";

export default function EventStatusUpdateForm({
  authUser,
  event,
  role,
}: {
  authUser: AuthUser;
  event: EventSingleProps;
  role: AuthUserRole;
}) {
  // get event status current approver stage
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

  const router = useRouter();

  const form = useForm<EventStatusSchemaType>({
    resolver: zodResolver(EventStatusSchema),
    defaultValues: {
      user_id: authUser.workAreaCode,
      user_role: role as any,
      event_id: event.id,
      eventUserType: eventType,
    },
  });

  const onSubmit = async (data: EventStatusSchemaType) => {
    if (!data.remarks) {
      data.remarks = `${eventType}: ${data.status}`;
    } else {
      data.remarks = `${eventType}: ${data.remarks}`;
    }

    const res = await createEventStatus(data);

    toast[res.success ? "success" : "error"](res.message);

    if (res.success) {
      router.replace("/dashboard/events");
    }
  };

  if (
    role !== eventTypeRole ||
    (role === eventTypeRole &&
      currentUserLastStatus?.remarks?.includes(eventType as string) &&
      currentUserSubmission === "approved") ||
    currentUserSubmission === "rejected"
  )
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className={cn(
              currentUserSubmission === "approved"
                ? "bg-green-100"
                : currentUserSubmission === "rejected"
                  ? "bg-red-100"
                  : "bg-yellow-100",
            )}
          ></EmptyMedia>
          <EmptyTitle>{currentUserSubmission}</EmptyTitle>
          <EmptyDescription>
            {currentUserSubmission === "rejected"
              ? "Other approver rejected this event"
              : currentUserSubmission === "pending"
                ? "Waiting for other approver approval."
                : `You ${currentUserSubmission} this event.`}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  return (
    <Form className="w-full max-w-2xl" onSubmit={form.handleSubmit(onSubmit)}>
      <p className="text-mguted-foreground">
        Approve as <strong className="text-foreground">{eventTypeRole}</strong>{" "}
        <ApproverTypeBadge type={eventType as any}>
          {eventType}
        </ApproverTypeBadge>
      </p>
      <FieldGroup>
        <Controller
          control={form.control}
          name="status"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Status</FieldLabel>
              <Select
                placeholder="Select a status"
                // defaultValue={prevData?.sta ?? undefined}
                data={data.map((item) => ({
                  label: item,
                  value: item,
                }))}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          control={form.control}
          name="remarks"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Remarks (optional)</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Enter remarks (optional)"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FormButton
        isPending={form.formState.isSubmitting}
        size={"lg"}
        className="max-w-sm"
        disabled={
          role === "ec" &&
          !event.event_consultant.some(
            (i) => i.event_consultant_approval?.created_at,
          )
        }
      >
        Submit
      </FormButton>
    </Form>
  );
}

const data = ["approved", "rejected"];
