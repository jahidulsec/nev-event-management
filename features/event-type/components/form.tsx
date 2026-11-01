"use client";

import { event_type } from "@/lib/generated/prisma/client";
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
import { Select } from "@/components/shared/select/select";
import React from "react";
import { eventTypePayloadSchema, EventTypePayloadType } from "../schema/schema";
import { createEventType, updateEventType } from "../actions/event-type";

// cost limit type list
const typeList = [
  { label: "All", value: "0" },
  { label: "Less than", value: "1" },
  { label: "In between", value: "2" },
  { label: "Greater than", value: "3" },
];

// work out which limit type an existing event type was saved with
const getLimitType = (prevData?: event_type) => {
  if (!prevData) return undefined;

  const lower = Number(prevData.lower_limit || 0);
  const upper = Number(prevData.upper_limit || 0);

  if (lower && upper) return "2";
  if (upper) return "1";
  if (lower) return "3";
  return "0";
};

export default function EventTypeForm({
  onClose,
  prevData,
}: {
  onClose: () => void;
  prevData?: event_type;
}) {
  const [type, setType] = React.useState<string | undefined>(
    getLimitType(prevData),
  );

  const form = useForm<EventTypePayloadType>({
    resolver: zodResolver(eventTypePayloadSchema),
    defaultValues: {
      title: prevData?.title ?? "",
      upper_limit: Number(prevData?.upper_limit || 0),
      lower_limit: Number(prevData?.lower_limit || 0),
    },
  });

  async function onSubmit(data: EventTypePayloadType) {
    const res = prevData
      ? await updateEventType(prevData.id, data)
      : await createEventType(data);
    toast[res.success ? "success" : "error"](res.message);

    if (res.success) {
      onClose();
    }
  }

  // clear the limit(s) that the selected type does not use
  const handleTypeChange = (value: string) => {
    setType(value);

    if (value === "0") {
      form.setValue("lower_limit", 0);
      form.setValue("upper_limit", 0);
    } else if (value === "1") {
      form.setValue("lower_limit", 0);
    } else if (value === "3") {
      form.setValue("upper_limit", 0);
    }
  };

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
        <Field>
          <FieldLabel>Limit Type</FieldLabel>
          <Select
            placeholder="Select a type"
            data={typeList}
            value={type}
            onValueChange={handleTypeChange}
          />
        </Field>
      </FieldGroup>

      {type && type !== "0" && (
        <FieldGroup className="flex-row">
          {type !== "3" && (
            <Controller
              control={form.control}
              name="upper_limit"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Max Value</FieldLabel>
                  <Input
                    type="number"
                    value={field.value}
                    id={field.name}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                    aria-invalid={fieldState.invalid}
                    placeholder="Not more than"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          {type !== "1" && (
            <Controller
              control={form.control}
              name="lower_limit"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Min. Value</FieldLabel>
                  <Input
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                    value={field.value}
                    type="number"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Not less than"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
        </FieldGroup>
      )}

      <FormButton isPending={form.formState.isSubmitting} size={"lg"}>
        Save
      </FormButton>
    </Form>
  );
}
