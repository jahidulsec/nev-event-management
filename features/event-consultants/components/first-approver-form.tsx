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
import { formatNumber, getTitleCase } from "@/utils/formatter";
import { Controller, useForm } from "react-hook-form";
import {
  EventFirstApprovalSchema,
  EventFirstApprovalType,
} from "../actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@/components/shared/select/select";
import { yesNoList } from "@/lib/data";
import { FormButton } from "@/components/shared/button/button";
import { AuthUser, AuthUserRole } from "@/types/auth-user";
import { createFirstApproverApproval } from "../actions/consultant-approval";
import { toast } from "sonner";
import { CustomField } from "@/components/shared/field/field";
import { SectionContent } from "@/components/shared/section/section";
import { SectionHeading2 } from "@/components/shared/typography/heading";

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
    <SectionContent className="border rounded-md p-6">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
        <SectionHeading2>Consultant Approval</SectionHeading2>
        <Separator />

        {consultants.map((item) => (
          <div
            className="border p-3 rounded-md border-primary/50"
            key={item.id}
          >
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
                value={getTitleCase(item.in_different_district ?? "")}
              />
              <CustomField title="Night Stay?" value={getTitleCase(item.night_stay ?? "") } />
            </div>
            <Separator className="my-3" />

            {eventData.event_type?.approver?.[0]?.user_type === role &&
            !item.event_consultant_approval?.first_approver_id ? (
              <ApprovalForm consultant_id={item.id} authUser={authUser} />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <CustomField
                  title="Suitable for participants?"
                  value={
                    item.event_consultant_approval?.is_suitable
                      ? getTitleCase(
                          item.event_consultant_approval?.is_suitable,
                        )
                      : "Not approved yet"
                  }
                />
                <CustomField
                  title="Relevant TA/Topic Expert?"
                  value={
                    item.event_consultant_approval?.topic_expert
                      ? getTitleCase(
                          item.event_consultant_approval?.topic_expert,
                        )
                      : "Not approved yet"
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionContent>
  );
}

const ApprovalForm = ({
  authUser,
  consultant_id,
}: {
  authUser: AuthUser;
  consultant_id: string;
}) => {
  const form = useForm<EventFirstApprovalType>({
    resolver: zodResolver(EventFirstApprovalSchema),
    defaultValues: {
      consultant_id: consultant_id,
      first_approver_id: authUser.workAreaCode,
    },
  });

  const onSubmit = async (data: EventFirstApprovalType) => {
    console.log(data);
    const res = await createFirstApproverApproval(data);

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
              <FieldLabel htmlFor={field.name}>
                Relevant TA/Topic Expert?
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
          name="is_suitable"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Suitable for Participants?
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
        Check
      </FormButton>
    </Form>
  );
};
