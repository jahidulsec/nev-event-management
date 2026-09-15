"use client";

import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/shared/select/select";
import { FormButton } from "@/components/shared/button/button";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { createPolicyDTOSchema, CreatePolicyDTOType } from "../schema/schema";
import { createPolicy, updatePolicy } from "../actions/policy";
import { RESOURCES, ACTIONS } from "@/lib/abac/catalog";

const ATTRIBUTE_OPTIONS = [
  { label: "Subject: Role", value: "subject.role" },
  { label: "Subject: Areas", value: "subject.areas" },
  { label: "Subject: Products", value: "subject.products" },
  { label: "Subject: Employee ID", value: "subject.employeeId" },
  { label: "Subject: Designation", value: "subject.designation" },
  { label: "Subject: Group", value: "subject.group" },
  { label: "Resource: Area Code", value: "resource.sap_area_code" },
  { label: "Resource: Product ID", value: "resource.product_id" },
  { label: "Resource: Status", value: "resource.status" },
  { label: "Resource: Owner Employee ID", value: "resource.employee_id" },
];

const OPERATOR_OPTIONS = [
  { label: "Equals", value: "eq" },
  { label: "Not equals", value: "ne" },
  { label: "In", value: "in" },
  { label: "Not in", value: "not_in" },
  { label: "Contains", value: "contains" },
];

const RESOURCE_OPTIONS = [...RESOURCES, "*"].map((value) => ({
  label: value,
  value,
}));
const ACTION_OPTIONS = [...ACTIONS, "*"].map((value) => ({
  label: value,
  value,
}));
const EFFECT_OPTIONS = [
  { label: "Allow", value: "allow" },
  { label: "Deny", value: "deny" },
];
const ENABLED_OPTIONS = [
  { label: "Enabled", value: "true" },
  { label: "Disabled", value: "false" },
];
const MATCH_OPTIONS = [
  { label: "All conditions (AND)", value: "all" },
  { label: "Any condition (OR)", value: "any" },
];

export default function PolicyForm({
  prevData,
  editId,
  onSuccess,
  onError,
}: {
  prevData?: Partial<CreatePolicyDTOType>;
  editId?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}) {
  const form = useForm<any>({
    defaultValues: {
      effect: "allow",
      priority: 0,
      enabled: true,
      conditions: { match: "all", rules: [] },
      ...prevData,
    },
    resolver: zodResolver(createPolicyDTOSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "conditions.rules",
  });

  const onSubmit = async (data: CreatePolicyDTOType) => {
    const res = editId
      ? await updatePolicy(editId, data)
      : await createPolicy(data);

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
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. EC can approve area events"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="What this policy is for"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="resource"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Resource</FieldLabel>
              <Select
                data={RESOURCE_OPTIONS}
                defaultValue={prevData?.resource}
                onValueChange={field.onChange}
                id={field.name}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="action"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Action</FieldLabel>
              <Select
                data={ACTION_OPTIONS}
                defaultValue={prevData?.action}
                onValueChange={field.onChange}
                id={field.name}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="effect"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Effect</FieldLabel>
              <Select
                data={EFFECT_OPTIONS}
                defaultValue={prevData?.effect ?? "allow"}
                onValueChange={field.onChange}
                id={field.name}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="priority"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
              <Input
                {...field}
                type="number"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="0"
              />
              <FieldDescription>
                Bookkeeping only — every matching policy is evaluated and a
                matching deny always wins over a matching allow, regardless of
                priority.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="enabled"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Status</FieldLabel>
              <Select
                data={ENABLED_OPTIONS}
                defaultValue={(prevData?.enabled ?? true) ? "true" : "false"}
                onValueChange={(value) => field.onChange(value === "true")}
                id={field.name}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="conditions.match"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Match</FieldLabel>
              <Select
                data={MATCH_OPTIONS}
                defaultValue={prevData?.conditions?.match ?? "all"}
                onValueChange={field.onChange}
                id={field.name}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel>Conditions</FieldLabel>
          <FieldDescription>
            Leave empty to apply to every subject. For a value, use a literal
            (eg. &quot;superadmin&quot;) or reference the current user&apos;s
            own attribute with $subject.role, $subject.areas,
            $subject.products, $subject.employeeId, $subject.designation, or
            $subject.group.
          </FieldDescription>

          <div className="flex flex-col gap-3">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-2 items-start sm:items-center border rounded-md p-3"
              >
                <Controller
                  control={form.control}
                  name={`conditions.rules.${index}.attribute`}
                  render={({ field }) => (
                    <Select
                      data={ATTRIBUTE_OPTIONS}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Attribute"
                      className="w-full sm:w-56"
                    />
                  )}
                />

                <Controller
                  control={form.control}
                  name={`conditions.rules.${index}.operator`}
                  render={({ field }) => (
                    <Select
                      data={OPERATOR_OPTIONS}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Operator"
                      className="w-full sm:w-40"
                    />
                  )}
                />

                <Controller
                  control={form.control}
                  name={`conditions.rules.${index}.value`}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={typeof field.value === "string" ? field.value : ""}
                      placeholder="Value or $subject.areas"
                      autoComplete="off"
                    />
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="text-destructive shrink-0"
                  onClick={() => remove(index)}
                >
                  <Trash2 />
                  <span className="sr-only">Remove condition</span>
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                attribute: ATTRIBUTE_OPTIONS[0].value,
                operator: "eq",
                value: "",
              })
            }
          >
            <Plus /> Add condition
          </Button>
        </Field>

        <FormButton isPending={form.formState.isSubmitting}>Save</FormButton>
      </FieldGroup>
    </form>
  );
}
