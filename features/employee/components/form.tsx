"use client";

import { user } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  EmployeeSchema,
  EmployeeType,
  UpdateEmployeeSchema,
  UpdateEmployeeType,
} from "../actions/schema";
import { createEmployee, updateEmployee } from "../actions/employee";
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
import { PasswordInput } from "@/components/shared/inputs/password";
import { Select } from "@/components/shared/select/select";

export default function EmployeeForm({
  onClose,
  prevData,
}: {
  onClose: () => void;
  prevData?: user;
}) {
  const form = useForm<EmployeeType | UpdateEmployeeType>({
    resolver: zodResolver(prevData ? UpdateEmployeeSchema : EmployeeSchema),
    defaultValues: {
      work_area_code: prevData?.work_area_code,
      role: prevData?.role as any,
    },
  });

  async function onSubmit(data: any) {
    const res = prevData
      ? await updateEmployee(prevData.id, data)
      : await createEmployee(data);
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
          name='work_area_code'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Work Area Code</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. 13051"
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
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
      <FieldGroup>
        <Controller
          control={form.control}
          name="role"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Role</FieldLabel>
              <Select
                defaultValue={prevData?.role}
                placeholder="Select Role"
                onValueChange={(value) => field.onChange(value)}
                data={[
                  {
                    label: "AO",
                    value: "ao",
                  },
                  {
                    label: "FLM",
                    value: "flm",
                  },
                  {
                    label: "SLM",
                    value: "slm",
                  },
                  {
                    label: "Marketing",
                    value: "marketing",
                  },
                  {
                    label: "Director",
                    value: "director",
                  },
                ]}
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
