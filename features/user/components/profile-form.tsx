"use client";

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
import { AuthUser } from "@/types/auth-user";
import { ProfileSchema, ProfileType } from "../actions/schema";
import { FormButton } from "@/components/shared/button/button";
import { updateUserProfile } from "../actions/user";
import { Form } from "@/components/shared/form/form";

export default function UserProfileForm({
  onClose,
  prevData,
}: {
  onClose: () => void;
  prevData: AuthUser;
}) {
  const form = useForm<ProfileType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      full_name: prevData?.name,
      mobile: prevData?.mobile,
    },
  });

  async function onSubmit(data: ProfileType) {
    const res = await updateUserProfile(prevData.employeeId, data);
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
