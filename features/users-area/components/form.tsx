"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Combobox from "@/components/shared/combobox/combobox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FormButton } from "@/components/shared/button/button";
import { getUsers } from "@/features/users/libs/users";
import { getAreas } from "@/features/area/libs/area";
import { createUserArea, updateUserArea } from "../actions/user-area";
import { createUserAreaDTOSchema, CreateUserAreaDTOType } from "../schema/schema";
import { users, area } from "@/lib/generated/prisma/client";

export default function UserAreaForm({
  prevData,
  editId,
  onSuccess,
  onError,
}: {
  prevData?: Partial<CreateUserAreaDTOType>;
  editId?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}) {
  const form = useForm<CreateUserAreaDTOType>({
    defaultValues: prevData,
    resolver: zodResolver(createUserAreaDTOSchema),
  });

  const onSubmit = async (data: CreateUserAreaDTOType) => {
    const res = editId
      ? await updateUserArea(editId, data)
      : await createUserArea(data);

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
              <FieldLabel>User</FieldLabel>
              <Combobox
                getKey={(item: users) => item.employee_id}
                getLabel={(item: users) => `${item.full_name} (${item.employee_id})`}
                fetcher={getUsers as any}
                placeholder="Select user"
                onValueChange={(value) => field.onChange(value)}
                defaultValue={prevData?.employee_id}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="sap_area_code"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Area</FieldLabel>
              <Combobox
                getKey={(item: area) => item.sap_area_code}
                getLabel={(item: area) => `${item.area_name} (${item.sap_area_code})`}
                fetcher={getAreas as any}
                placeholder="Select area"
                onValueChange={(value) => field.onChange(value)}
                defaultValue={prevData?.sap_area_code}
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
