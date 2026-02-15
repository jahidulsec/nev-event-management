"use client";

import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { EventType } from "../actions/schema";
import { formatNumber } from "@/utils/formatter";
import { Button } from "@/components/ui/button";
import { Plus, PlusCircle, X } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Select } from "@/components/shared/select/select";

const budgetType = [
  "Venue Charge",
  "Food",
  "Transportation",
  "Projector-Screen",
  "Sound System",
  "Logistics/Others",
];

export const EventBudgetSection = ({
  form,
  userId,
}: {
  form: UseFormReturn<EventType>;
  userId?: string;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "eventBudget",
  });

  const eventBudget = form.watch("eventBudget");
  const eventConsultant = form.watch("eventConsultant");

  const isCreator = userId === form.getValues("user_id");

  return (
    <>
      {/* event budget section */}
      <div className="flex justify-baseline items-center gap-5">
        <div className="flex flex-col gap-1 w-full">
          <h4 className="w-full text-2xl font-medium">Event Budget</h4>
          <p>
            Total cost:{" "}
            <strong>
              BDT{" "}
              {formatNumber(
                eventBudget?.reduce(
                  (acc, sum) => acc + sum.unit_cost * sum.unit,
                  0,
                ) +
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
                item: "",
                unit: 1,
                unit_cost: 1,
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
                name={`eventBudget.${index}.item`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Budget Field Name
                    </FieldLabel>
                    <Select
                      data={budgetType.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      id={field.name}
                      placeholder="Item"
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={eventBudget[index].item}
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
              name={`eventBudget.${index}.unit`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Unit</FieldLabel>

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
              name={`eventBudget.${index}.unit_cost`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Unit Cost</FieldLabel>
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
            {isCreator && (
              <EmptyDescription>
                Add your budget for this event.
              </EmptyDescription>
            )}
          </EmptyHeader>
        </Empty>
      )}
    </>
  );
};
