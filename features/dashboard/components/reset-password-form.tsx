"use client";

import React from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/shared/form/form";
import { PasswordInput } from "@/components/shared/inputs/password";
import { ActionButton } from "@/components/shared/button/button";
import {
  updateUserDTOSchema,
  UpdateUserDTOType,
} from "@/features/users/schema/schema";
import { updateUser } from "@/features/users/actions/users";

export default function ResetPasswordForm({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const form = useForm<UpdateUserDTOType>({
    resolver: zodResolver(updateUserDTOSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(data: UpdateUserDTOType) {
    const res = await updateUser(id, data);
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
      </FieldGroup>

      <ActionButton isPending={form.formState.isSubmitting} size={"lg"}>
        Save
      </ActionButton>
    </Form>
  );
}
