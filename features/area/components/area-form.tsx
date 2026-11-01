"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { createAreaDTOSchema, CreateAreaDTOType } from "../schema/schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormButton } from "@/components/shared/button/button";
import { Select } from "@/components/shared/select/select";
import { createArea, updateArea } from "../actions/area";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AreaForm({
  prevData,
  editId,
  lockParent,
  onSuccess,
  onError,
}: {
  prevData?: Partial<CreateAreaDTOType>;
  editId?: string;
  lockParent?: boolean;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}) {
  const form = useForm<CreateAreaDTOType>({
    defaultValues: prevData,
    resolver: zodResolver(createAreaDTOSchema),
  });

  const onSubmit = async (data: CreateAreaDTOType) => {
    const res = editId
      ? await updateArea(editId, data)
      : await createArea(data);

    if (res.success) {
      onSuccess?.(res.message ?? "");
    } else {
      onError?.(res.message ?? "");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="sap_area_code"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>SAP Area Code</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. 20089"
                autoComplete="off"
                disabled={!!editId}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="parent_area_code"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Parent Area Code</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. 20089"
                autoComplete="off"
                disabled={lockParent}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="area_name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Area name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. Dhaka"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="type"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Type</FieldLabel>
              <Select
                data={["mio", "rm", "zm", "sm", "wing"].map((i) => ({
                  label: i.toUpperCase(),
                  value: i,
                }))}
                defaultValue={prevData?.type}
                onValueChange={(value) => field.onChange(value)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <FormButton isPending={form.formState.isSubmitting}>Save</FormButton>
      </FieldGroup>
    </form>
  );
}
