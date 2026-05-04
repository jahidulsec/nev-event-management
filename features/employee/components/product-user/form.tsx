"use client";

import { product, product_user } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { ProductUserSchema, ProductUserSchemaType } from "../../actions/schema";
import Combobox from "@/components/shared/combobox/combobox";
import { getProducts } from "@/features/product/lib/product";
import { createProductUser, updateProductUser } from "../../actions/product-user";

export default function ProductUserForm({
  onClose,
  prevData,
}: {
  onClose: () => void;
  prevData?: product_user;
}) {
  const form = useForm<ProductUserSchemaType>({
    resolver: zodResolver(ProductUserSchema),
    defaultValues: {
      work_area_code: prevData?.work_area_code,
      product_slug: prevData?.product_slug as any,
    },
  });

  async function onSubmit(data: any) {
    const res = prevData
      ? await updateProductUser(prevData.id, data)
      : await createProductUser(data);
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
          name='product_slug'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Product Name</FieldLabel>
              <Combobox
                getKey={(item: product) => item.id}
                getLabel={(item: product) => item.name}
                fetcher={getProducts as any}
                placeholder="Select"
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                defaultValue={prevData?.product_slug}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>


      <FormButton isPending={form.formState.isSubmitting} size={"lg"}>
        Save
      </FormButton>
    </Form >
  );
}
