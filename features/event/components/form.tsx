"use client";

import { doctor } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { DoctorSchema, DoctorType } from "../actions/schema";
import { createDoctor, updateDoctor } from "../actions/type";
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

export default function DoctorForm({
  onClose,
  prevData,
}: {
  onClose: () => void;
  prevData?: doctor;
}) {
  const form = useForm<DoctorType>({
    resolver: zodResolver(DoctorSchema),
    defaultValues: {
      full_name: prevData?.full_name,
      designation: prevData?.designation,
      speciality: prevData?.speciality,
    },
  });

  async function onSubmit(data: DoctorType) {
    const res = prevData
      ? await updateDoctor(prevData.id, data)
      : await createDoctor(data);
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
              <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. Dr. Abdullah"
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
          name="designation"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Designation</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. Professor"
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
          name="speciality"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Speciality</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. Eye Specialist"
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
