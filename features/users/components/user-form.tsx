"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/shared/inputs/password";
import { FormButton } from "@/components/shared/button/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserDTOSchema,
  CreateUserDTOType,
  updateUserDTOSchema,
} from "@/features/user/schema/schema";
import { createUser, getRoles, updateUser } from "../actions/users";
import { Select } from "@/components/shared/select/select";
import { ComboboxMultipleSelect } from "@/components/ui/multi-combobox";
import { role } from "@/lib/generated/prisma/client";

export default function UserForm({
  prevData,
  editId,
  onSuccess,
  onError,
}: {
  prevData?: Partial<CreateUserDTOType>;
  editId?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}) {
  const form = useForm<any>({
    defaultValues: { status: "active", roles: [], ...prevData },
    resolver: zodResolver(editId ? updateUserDTOSchema : createUserDTOSchema),
  });

  const [roles, setRoles] = React.useState<role[]>([]);

  React.useEffect(() => {
    (async () => {
      const res = await getRoles();
      setRoles(res.data ?? []);
    })();
  }, []);

  const onSubmit = async (data: CreateUserDTOType) => {
    const res = editId
      ? await updateUser(editId, data)
      : await createUser(data);

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
          name="employee_id"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Employee ID</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. EMP001"
                autoComplete="off"
                disabled={!!editId}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="full_name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. John Doe"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                type="email"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. john@example.com"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <PasswordInput
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Password"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="designation"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Designation</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. Sales Executive"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="mobile"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Mobile</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. 01812345678"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="group"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Group</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. Sales"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="status"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Status</FieldLabel>
              <Select
                data={[
                  {
                    label: "Active",
                    value: "active",
                  },
                  {
                    label: "Inactive",
                    value: "inactive",
                  },
                ]}
                defaultValue={prevData?.status}
                onValueChange={field.onChange}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="roles"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Roles</FieldLabel>
              <ComboboxMultipleSelect
                items={roles.map((item) => item.role)}
                value={field.value}
                onValueChange={field.onChange}
                id={field.name}
                placeholder="Select roles"
                aria-invalid={fieldState.invalid}
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
