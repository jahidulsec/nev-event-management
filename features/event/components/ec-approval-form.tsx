"use client";

import React from "react";
import { EventSingleProps } from "../lib/event";
import { CustomField } from "@/components/shared/field/field";
import { AuthUser } from "@/types/auth-user";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { yesNoList } from "@/lib/data";
import { Select } from "@/components/shared/select/select";
import { FormButton } from "@/components/shared/button/button";
import { Form } from "@/components/shared/form/form";
import { Input } from "@/components/ui/input";
import { EventECApprovalSchema, EventECApprovalType } from "../actions/schema";
import { createECapproval } from "../actions/consultant-approval";

export default function ECApprovalForm({
  eventData,
  authUser,
}: {
  eventData: EventSingleProps;
  authUser: AuthUser;
}) {
  const consultants = eventData.event_consultant;

  if (consultants.length === 0) return null;
  return (
    <div className="flex flex-col gap-6">
      {consultants.map((item) => (
        <div
          className="border rounded-md p-3 flex flex-col gap-3 border-primary/50"
          key={item.id}
        >
          <CustomField title="Doctor" value={item.doctor.full_name} />
          <Separator />
          <div className="">
            {authUser.role.includes("ec") &&
            !!!item.event_consultant_approval?.ec_id ? (
              <ApprovalForm authUser={authUser} consultant_id={item.id} />
            ) : (
              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <CustomField
                  title="Honorarium Check"
                  value={
                    item?.event_consultant_approval?.honorarium_check ??
                    "Not approved yet"
                  }
                />
                <CustomField
                  title="Consultant Form Attached?"
                  value={
                    item?.event_consultant_approval?.consultant_form_attached ??
                    "Not approved yet"
                  }
                />
                <CustomField
                  title="nTh Engagement?"
                  value={
                    item?.event_consultant_approval?.nth_engagement?.toString() ??
                    "Not approved yet"
                  }
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const ApprovalForm = ({
  authUser,
  consultant_id,
}: {
  authUser: AuthUser;
  consultant_id: string;
}) => {
  const form = useForm<EventECApprovalType>({
    resolver: zodResolver(EventECApprovalSchema),
    defaultValues: {
      consultant_id: consultant_id,
      ec_id: authUser.workAreaCode,
    },
  });

  const onSubmit = async (data: EventECApprovalType) => {
    const res = await createECapproval(data);

    toast[res.success ? "success" : "error"](res.message);
  };
  return (
    <Form
      onSubmit={form.handleSubmit(onSubmit)}
      className="gap-3 w-full max-w-4xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <Controller
          control={form.control}
          name="consultant_form_attached"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Consultant Form Attached?
              </FieldLabel>
              <Select
                data={yesNoList}
                onValueChange={(value) => field.onChange(value)}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="hororarium_check"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Honorarium Check?</FieldLabel>
              <Select
                data={yesNoList}
                onValueChange={(value) => field.onChange(value)}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="nth_engagement"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>nTh Engagement?</FieldLabel>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                id={field.name}
                placeholder="enter nth engagement"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <FormButton className="max-w-sm" isPending={form.formState.isSubmitting}>
        Check
      </FormButton>
    </Form>
  );
};
