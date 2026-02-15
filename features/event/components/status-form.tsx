"use client";

import { Form } from "@/components/shared/form/form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { EventStatusSchema, EventStatusSchemaType } from "../actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventSingleProps } from "../lib/event";
import { AuthUser } from "@/types/auth-user";
import { Select } from "@/components/shared/select/select";
import { FormButton } from "@/components/shared/button/button";
import { createEventStatus } from "../actions/event";
import { toast } from "sonner";
import { useRouter } from "@bprogress/next";

export default function EventStatusUpdateForm({
  authUser,
  event,
}: {
  authUser: AuthUser;
  event: EventSingleProps;
}) {
  const eventType = event.event_type?.approver?.[0].type;
  const router = useRouter();

  const form = useForm<EventStatusSchemaType>({
    resolver: zodResolver(EventStatusSchema),
    defaultValues: {
      user_id: authUser.workAreaCode,
      user_role: authUser.role,
      event_id: event.id,
    },
  });

  const onSubmit = async (data: EventStatusSchemaType) => {
    console.log(data);
    data.remarks = `${eventType}: ${data.status}`;

    const res = await createEventStatus(data);

    toast[res.success ? "success" : "error"](res.message);

    if (res.success) {
      router.replace("/dashboard/events");
    }
  };

  return (
    <Form
      className="max-w-2xl mx-auto py-10"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Separator />
      <h4 className="w-full text-2xl font-medium">Approval Section</h4>

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

      <FormButton
        isPending={form.formState.isSubmitting}
        size={"lg"}
        className="max-w-sm"
        // disabled={!!params.id?.toString()}
      >
        Submit
      </FormButton>
    </Form>
  );
}

const data = ["approved", "rejected"];
