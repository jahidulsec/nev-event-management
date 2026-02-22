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
import { getDoctors } from "@/features/doctor/lib/doctor";
import { formatNumber } from "@/utils/formatter";
import Combobox from "@/components/shared/combobox/combobox";
import { Select } from "@/components/shared/select/select";
import { AuthUser } from "@/types/auth-user";
import { yesNoList } from "@/lib/data";

const consultantRole = [
  "Speaker",
  "Chairperson",
  "Chief Guest",
  "Panelist",
  "Guest of Honor",
  "Moderator",
  "Other",
];

export default function ConsultantSection({
  form,
  user,
}: {
  form: UseFormReturn<EventType>;
  user?: AuthUser;
}) {
  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: "eventConsultant",
  });

  const eventConsultant = form.watch("eventConsultant");

  const eventCreator = form.watch("user_id");

  const isCreator = user?.workAreaCode === eventCreator || !eventCreator;

  return (
    <>
      <div className="flex justify-baseline items-center gap-5">
        <div className="flex flex-col gap-1 w-full">
          <h4 className="w-full text-2xl font-medium">Event Consultants</h4>
          <p>
            Total:{" "}
            <strong>
              BDT{" "}
              {formatNumber(
                eventConsultant?.reduce(
                  (acc, sum) => acc + (sum.honorarium || 0),
                  0,
                ),
              )}
            </strong>
          </p>
        </div>

        {isCreator && (
          <Button
            variant={"outline"}
            type="button"
            onClick={() =>
              append({
                doctor_id: "",
                role: "",
                duration_h: 1,
                honorarium: 0,
                in_different_district: "no",
                night_stay: "no",
              })
            }
          >
            <PlusCircle />
            Add
          </Button>
        )}
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
                    <Combobox
                      getKey={(p: any) => p.id}
                      getLabel={(p: any) =>
                        `${p.full_name} (${p.dr_child_id}) - ${p.area_name}`
                      }
                      fetcher={getDoctors as any}
                      placeholder="Select a doctor"
                      onValueChange={(value) => {
                        field.onChange(value);
                        console.log(value);
                      }}
                      defaultValue={eventConsultant[index].doctor_id}
                    />

                    {fieldState.error?.message && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {isCreator && (
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
              )}
            </div>

            <Controller
              control={form.control}
              name={`eventConsultant.${index}.role`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor={field.name}>Role</FieldLabel>

                  <Select
                    data={consultantRole.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={eventConsultant[index].role}
                  />

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

            <Controller
              control={form.control}
              name={`eventConsultant.${index}.in_different_district`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Is in different district?
                  </FieldLabel>
                  <Select
                    {...field}
                    name="in_different_district"
                    data={yesNoList}
                    onValueChange={(value) => field.onChange(value)}
                  />

                  {fieldState.error?.message && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name={`eventConsultant.${index}.night_stay`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Will stay at night?
                  </FieldLabel>
                  <Select
                    {...field}
                    name="night_stay"
                    data={yesNoList}
                    onValueChange={(value) => field.onChange(value)}
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
            <EmptyTitle>No consultant added yet</EmptyTitle>
            {isCreator && (
              <EmptyDescription>
                Add Consultants for this event.
              </EmptyDescription>
            )}
          </EmptyHeader>
        </Empty>
      )}
    </>
  );
}
