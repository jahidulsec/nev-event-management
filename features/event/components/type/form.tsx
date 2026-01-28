"use client";

import { event_type } from "@/lib/generated/prisma";
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
import { Input } from "@/components/ui/input";
import { FormButton } from "@/components/shared/button/button";
import { EventTypeSchema, EventTypeType } from "../../actions/schema";
import { createEventType, updateEventType } from "../../actions/type";

export default function EventTypeForm({
  onClose,
  prevData,
}: {
  onClose: () => void;
  prevData?: event_type;
}) {
  const form = useForm<EventTypeType>({
    resolver: zodResolver(EventTypeSchema),
    defaultValues: {
      title: prevData?.title,
      upper_limit: Number(prevData?.upper_limit) ?? undefined,
      lower_limit: Number(prevData?.lower_limit) ?? undefined,
    },
  });

  async function onSubmit(data: EventTypeType) {
    const res = prevData
      ? await updateEventType(prevData.id, data)
      : await createEventType(data);
    toast[res.success ? "success" : "error"](res.message);

    if (res.success) {
      onClose();
    }
  }
  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Event Title</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Event Title"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          control={form.control}
          name="upper_limit"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Max Value</FieldLabel>
              <Input
                type="number"
                id={field.name}
                value={field.value}
                onChange={(e) => {
                  field.onChange(Number(e.target.value));
                }}
                aria-invalid={fieldState.invalid}
                placeholder="eg. Professor"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup>
        <Controller
          control={form.control}
          name="lower_limit"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Min. Value</FieldLabel>
              <Input
                value={field.value}
                onChange={(e) => {
                  field.onChange(Number(e.target.value));
                }}
                type="number"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. Eye Specialist"
                autoComplete="off"
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
