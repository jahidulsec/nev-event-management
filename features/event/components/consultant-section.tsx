"use client";

import React from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { EventType } from "../actions/schema";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Plus, PlusCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AsyncCombobox } from "@/components/shared/combobox/async-combobox";
import { getDoctors } from "@/features/doctor/lib/doctor";

export default function ConsultantSection({
  form,
}: {
  form: UseFormReturn<EventType>;
}) {
  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: "eventConsultant",
  });

  return (
    <>
      <div className="flex justify-baseline items-center gap-5">
        <div className="flex flex-col gap-1 w-full">
          <h4 className="w-full text-2xl font-medium">Event Consultants</h4>
        </div>

        <Button
          variant={"outline"}
          type="button"
          onClick={() =>
            append({
              doctor_id: "",
              role: "",
              duration_h: 1,
              honorarium: 0,
            })
          }
        >
          <PlusCircle />
          Add
        </Button>
      </div>

      {fields.length > 0 ? (
        fields.map((item, index) => (
          <div key={item.id} className="grid grid-cols-2 gap-2 border-b pb-6">
            <div className="col-span-2 flex items-end gap-3">
              <Controller
                control={form.control}
                name={`eventConsultant.${index}.doctor_id`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Doctor</FieldLabel>
                    <AsyncCombobox
                      getKey={(p: any) => p.id}
                      getLabel={(p: any) =>
                        `${p.full_name} (${p.dr_master_id}) - ${p.area_name}`
                      }
                      fetcher={getDoctors as any}
                      placeholder="Select a doctor"
                      onValueChange={(value) => field.onChange(value.id)}
                    />

                    {fieldState.error?.message && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button
                variant={"outline"}
                size={"icon"}
                type="button"
                onClick={() => remove(index)}
                className="text-destructive border-destructive"
              >
                <X />
                <span className="sr-only">Remove</span>
              </Button>
            </div>

            <Controller
              control={form.control}
              name={`eventConsultant.${index}.role`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor={field.name}>Role</FieldLabel>

                  <Input {...field} />

                  {fieldState.error?.message && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name={`eventConsultant.${index}.duration_h`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Duration (hour)</FieldLabel>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />

                  {fieldState.error?.message && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name={`eventConsultant.${index}.honorarium`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Honorarium</FieldLabel>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />

                  {fieldState.error?.message && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        ))
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <Plus />
            </EmptyMedia>
            <EmptyTitle>No budget added yet</EmptyTitle>
            <EmptyDescription>Add your budget for this event.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </>
  );
}
