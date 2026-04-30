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
import { getTitleCase } from "@/utils/formatter";
import { getApproverEventStatus } from "@/lib/event";

export default function EventStatusUpdateForm({
  authUser,
  event,
  role,
}: {
  authUser: AuthUser;
  event: EventSingleProps;
  role: AuthUserRole;
}) {
  const {
    currentUserLastStatus,
    currentUserSubmission,
    eventType,
    eventTypeRole,
  } = getApproverEventStatus(event, role);

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

  if (role === 'superadmin') return null

  // get first approver for consultant approver check
  const firstApproverRole = event.event_type?.approver?.[0]?.user_type;


  if (
    role !== eventTypeRole ||
    (role === eventTypeRole &&
      currentUserLastStatus?.remarks?.includes(eventType as string) &&
      currentUserSubmission === "approved") ||
    currentUserSubmission === "rejected"
  ) {
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
  }

  return (
    <Form className="w-full max-w-2xl" onSubmit={form.handleSubmit(onSubmit)}>
      <p className="text-mguted-foreground">
        Approve as{" "}
        <strong className="text-foreground">
          {eventTypeRole.toUpperCase()}
        </strong>{" "}
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
                  label: getTitleCase(item),
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
              <FieldLabel>Remarks</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Enter remarks"
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
          (role === "ec" &&
            !event?.event_consultant?.every(
              (i) => i?.event_consultant_approval?.ec_id,
            )) ||
          (role === firstApproverRole &&
            !event?.event_consultant?.every(
              (i) => i?.event_consultant_approval?.first_approver_id,
            ))
        }
      >
        Submit
      </FormButton>
    </Form>
  );
}

const data = ["approved", "rejected"];
