"use client";

import { approver, event_type } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "@/components/shared/form/form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FormButton } from "@/components/shared/button/button";
import {
  EventTypeApproverSchema,
  EventTypeApproverType,
} from "../../actions/schema";
import { Select } from "@/components/shared/select/select";
import React from "react";
import { approverTypeList, userRoleList } from "@/lib/data";
import {
  createEventTypeApprover,
  updateEventTypeApprover,
} from "../../actions/type-approver";
import { getEventTypes } from "../../lib/type";
import { getCostLimitText } from "@/utils/helper";

export default function EventTypeApproverForm({
  onClose,
  prevData,
}: {
  onClose: () => void;
  prevData?: approver;
}) {
  const [type, setType] = React.useState<event_type[]>([]);
  const [pending, startTransition] = React.useTransition();

  const form = useForm<EventTypeApproverType>({
    resolver: zodResolver(EventTypeApproverSchema),
    defaultValues: {
      event_type_id: prevData?.event_type_id,
      type: prevData?.type,
      user_type: prevData?.user_type as any,
    },
  });

  async function onSubmit(data: EventTypeApproverType) {
    const res = prevData
      ? await updateEventTypeApprover(prevData.id, data)
      : await createEventTypeApprover(data);
    toast[res.success ? "success" : "error"](res.message);

    if (res.success) {
      onClose();
    }
  }

  // get event types
  React.useEffect(() => {
    const handleEventTypes = () => {
      startTransition(async () => {
        const res = await getEventTypes({ page: 1, size: 20 });
        if (res.success) {
          setType(res?.data ?? []);
        }
      });
    };

    handleEventTypes();
  }, [prevData]);

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="event_type_id"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Event Type</FieldLabel>
              <Select
                placeholder="Select a type"
                defaultValue={prevData?.event_type_id}
                data={type.map((item) => ({
                  label: `${item.title} (${getCostLimitText(item)})`,
                  value: item.id,
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
          name="user_type"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>User Role</FieldLabel>
              <Select
                placeholder="Select a type"
                defaultValue={prevData?.user_type}
                data={userRoleList}
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
          name="type"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Approver Type</FieldLabel>
              <Select
                defaultValue={prevData?.type}
                placeholder="Select a type"
                data={approverTypeList}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FormButton isPending={form.formState.isSubmitting} size={"lg"}>
        Save
      </FormButton>
    </Form>
  );
}
