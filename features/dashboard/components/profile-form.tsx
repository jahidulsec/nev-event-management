"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormButton } from "@/components/shared/button/button";
import { Form } from "@/components/shared/form/form";
import {
  updateUserDTOSchema,
  UpdateUserDTOType,
} from "@/features/users/schema/schema";
import { updateUser } from "@/features/users/actions/users";
import { useUser } from "@/features/users/hooks/use-user";

export default function UserProfileForm({
  onClose,
  employeeId,
}: {
  onClose: () => void;
  employeeId: string;
}) {
  const { data: user, isLoading } = useUser(employeeId);

  const form = useForm<UpdateUserDTOType>({
    resolver: zodResolver(updateUserDTOSchema),
    defaultValues: {
      full_name: "",
      email: "",
      mobile: undefined,
    },
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      full_name: user.full_name,
      email: user.email,
      mobile: user.mobile ?? undefined,
    });
  }, [user, form]);

  async function onSubmit(data: UpdateUserDTOType) {
    const res = await updateUser(employeeId, data);
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
          name="full_name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Full name"
                autoComplete="off"
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. m@nevian.com.bd"
                autoComplete="off"
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name="mobile"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Mobile</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="01X XXX XXX XXX"
                autoComplete="off"
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FormButton
        isPending={form.formState.isSubmitting}
        disabled={isLoading}
        size={"lg"}
      >
        Save
      </FormButton>
    </Form>
  );
}
