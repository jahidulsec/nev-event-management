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
import { getProducts } from "@/features/product/lib/product";
import { createUserProduct, updateUserProduct } from "../actions/user-product";
import {
  createUserProductDTOSchema,
  CreateUserProductDTOType,
} from "../schema/schema";
import { users, product } from "@/lib/generated/prisma/client";

export default function UserProductForm({
  prevData,
  editId,
  onSuccess,
  onError,
}: {
  prevData?: Partial<CreateUserProductDTOType>;
  editId?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}) {
  const form = useForm<CreateUserProductDTOType>({
    defaultValues: prevData,
    resolver: zodResolver(createUserProductDTOSchema),
  });

  const onSubmit = async (data: CreateUserProductDTOType) => {
    const res = editId
      ? await updateUserProduct(editId, data)
      : await createUserProduct(data);

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
          name="product_id"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Product</FieldLabel>
              <Combobox
                getKey={(item: product) => item.id}
                getLabel={(item: product) => item.name}
                fetcher={getProducts as any}
                placeholder="Select product"
                onValueChange={(value) => field.onChange(value)}
                defaultValue={prevData?.product_id}
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
