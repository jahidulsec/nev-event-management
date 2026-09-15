"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { createRoleDTOSchema, CreateRoleDTOType } from "../schema/schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormButton } from "@/components/shared/button/button";
import { createRole, updateRole } from "../actions/role";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RoleForm({
  prevData,
  editId,
  onSuccess,
  onError,
}: {
  prevData?: Partial<CreateRoleDTOType>;
  editId?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}) {
  const form = useForm<CreateRoleDTOType>({
    defaultValues: prevData,
    resolver: zodResolver(createRoleDTOSchema),
  });

  const onSubmit = async (data: CreateRoleDTOType) => {
    const res = editId
      ? await updateRole(editId, data)
      : await createRole(data);

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
          name="role"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Role</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. admin"
                autoComplete="off"
                disabled={!!editId}
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
