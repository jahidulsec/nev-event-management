"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useRouter } from "@bprogress/next/app";
import { Asterisk } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { user } from "@/lib/generated/prisma";
import { Form } from "@/components/shared/form/form";
import { LogoFull } from "@/components/shared/logo/logo";
import { PasswordInput } from "@/components/shared/inputs/password";
import { LoginSchema, LoginType } from "../actions/schema";
import { FormButton } from "@/components/shared/button/button";
import { userLogin } from "../actions/login";

export default function LoginForm() {
  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      work_area_code: "",
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: LoginType) {
    const res = await userLogin(data);
    toast[res.success ? "success" : "error"](res.message);

    if (res.success) {
      router.replace("/dashboard");
    }
  }

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="text-center w-full">
        <div className="flex items-center justify-center">
          <LogoFull width={200} height={100} />
        </div>
        <h2 className="text-center text-2xl text-secondary font-semibold">
          Welcome Back
        </h2>
        <p className="text-xs text-muted-foreground">
          Login with your credentials
        </p>
      </div>
      <FieldGroup>
        <Controller
          control={form.control}
          name='work_area_code'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Employee ID <Asterisk size={10} className="text-destructive" />
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Employee ID"
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
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Password <Asterisk size={10} className="text-destructive" />
              </FieldLabel>
              <PasswordInput
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="PASSWORD"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FormButton isPending={form.formState.isSubmitting} size={"lg"}>
        Login
      </FormButton>
    </Form>
  );
}
