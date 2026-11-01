"use client";

import { cn } from "cn";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { LoginSchema, LoginType } from "@/features/auth/actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk } from "lucide-react";
import { PasswordInput } from "../../../components/shared/inputs/password";
import { FormButton } from "../../../components/shared/button/button";
import { AppLogo } from "@/components/shared/logo/app";
import { useRouter } from "@bprogress/next";
import { userLogin } from "../actions/login";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
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
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md", className)}
      {...props}
    >
      <div className="mx-auto">
        <AppLogo width={120} />
      </div>
      <Card>
        <CardHeader className="text-center flex justify-center items-center gap-0 flex-col">
          <CardTitle className="text-2xl mt-6">Welcome to SWiFT</CardTitle>
          <CardDescription className="text-sm">
            Unlock your profile with Sign In
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Username{" "}
                      <Asterisk size={10} className="text-destructive" />
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Employee ID/Username"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Password{" "}
                      <Asterisk size={10} className="text-destructive" />
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="PASSWORD"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <FormButton
                  isPending={form.formState.isSubmitting}
                  className="bg-foreground text-base"
                >
                  Sign in
                </FormButton>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
