"use client";

import { Form } from "@/components/shared/form/form";
import { EventSingleProps } from "../lib/event";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { formatNumber } from "@/utils/formatter";
import { Controller, useForm } from "react-hook-form";
import {
  EventConsultantApprovalSchema,
  EventConsultantApprovalType,
} from "../actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@/components/shared/select/select";
import { yesNoList } from "@/lib/data";
import { FormButton } from "@/components/shared/button/button";
import { AuthUser, AuthUserRole } from "@/types/auth-user";
import { createConsultantApproval } from "../actions/consultant-approval";
import { toast } from "sonner";

export default function FirstApproverForm({
  eventData,
  role,
  authUser,
}: {
  eventData: EventSingleProps;
  role: AuthUserRole;
  authUser: AuthUser;
}) {
  const consultants = eventData.event_consultant;

  if (consultants.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
      <h2 className="w-full text-2xl font-medium">Consultant</h2>
      <Separator />

      {consultants.map((item) => (
        <div className="border p-3 rounded-md " key={item.id}>
          <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3 gap-y-6">
            <CustomField title="Doctor" value={item.doctor.full_name} />
            <CustomField title="Degrees" value={item.doctor.degrees ?? "-"} />
            <CustomField title="Speciality" value={item.doctor.speciality} />
            <CustomField
              title="Chamber ID"
              value={item.doctor.dr_child_id ?? "-"}
            />
            <CustomField title="Role" value={item.role} />
            <CustomField
              title="Duration (hours)"
              value={String(item.duration_h)}
            />
            <CustomField
              title="Honorarium"
              value={formatNumber(Number(item.honorarium)).toString()}
            />
            <CustomField
              title="Different District?"
              value={item.in_different_district ?? ""}
            />
            <CustomField title="Night Stay?" value={item.night_stay ?? ""} />
          </div>
          <Separator className="my-3" />

          {eventData.event_type?.approver?.[0]?.user_type === role &&
          !item.event_consultant_approval ? (
            <ApprovalForm consultant_id={item.id} authUser={authUser} />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <CustomField
                title="Suitable for participants?"
                value={
                  item.event_consultant_approval?.is_suitable ??
                  "Not approved yet"
                }
              />
              <CustomField
                title="Topic Expert?"
                value={
                  item.event_consultant_approval?.topic_expert ??
                  "Not approved yet"
                }
              />
            </div>
          )}
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
  const form = useForm<EventConsultantApprovalType>({
    resolver: zodResolver(EventConsultantApprovalSchema),
    defaultValues: {
      consultant_id: consultant_id,
      first_approver_id: authUser.workAreaCode,
    },
  });

  const onSubmit = async (data: EventConsultantApprovalType) => {
    console.log(data);
    const res = await createConsultantApproval(data);

    toast[res.success ? "success" : "error"](res.message);
  };

  return (
    <Form
      onSubmit={form.handleSubmit(onSubmit)}
      className="gap-3 w-full max-w-4xl"
    >
      <h3 className="font-semibold text-xl">Approval</h3>
      <FieldGroup className="flex-row">
        <Controller
          control={form.control}
          name="topic_expert"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Topic Expert?</FieldLabel>
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
          name="is_suitable"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Suitable for participants?
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
      </FieldGroup>

      <FormButton className="max-w-sm" isPending={form.formState.isSubmitting}>
        Submit
      </FormButton>
    </Form>
  );
};

const CustomField = ({ title, value }: { title: string; value?: string }) => {
  return (
    <Field>
      <FieldLabel className="text-muted-foreground font-medium">
        {title}
      </FieldLabel>
      <FieldTitle>{value}</FieldTitle>
    </Field>
  );
};
