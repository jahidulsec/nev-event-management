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
import {
  getHonorariumCalculations,
  getHonorariumDesignations,
  HonorariumCalculationMultiProps,
} from "@/features/honorarium/lib/honorarium";
import { calculateHonorarium } from "@/utils/helper";
import CheckTierModal from "@/features/honorarium/components/check-tier-modal";

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

  const [hList, setHList] = React.useState<HonorariumCalculationMultiProps[]>(
    [],
  );
  const [selectedTier, setSelectedTier] = React.useState<string>();
  const [pending, startTransition] = React.useTransition();

  // get filter full object of tier
  const filteredTier = hList.find((i) => i.id === selectedTier);

  const eventConsultant = form.watch("eventConsultant");

  const eventCreator = form.watch("user_id");

  const isCreator = user?.workAreaCode === eventCreator || !eventCreator;

  // get total honorarium
  const handleHonorarium = (index: number) => {
    const consultant = form.getValues(`eventConsultant.${index}`);
    const tierId = form.getValues(`eventConsultant.${index}.tier_id`);

    const filteredTier = hList.find((i) => i.id === tierId);

    if (filteredTier) {
      const totalHonorarium = calculateHonorarium(filteredTier, {
        isSpeaker: consultant.role === "Speaker",
        nightStay: consultant.night_stay === "yes",
        diffDist: consultant.in_different_district === "yes",
        hours: consultant.duration_h,
      });

      form.setValue(`eventConsultant.${index}.honorarium`, totalHonorarium);
    }
  };

  // get honorarium list
  React.useEffect(() => {
    const handleList = async () => {
      const res = await getHonorariumCalculations();

      if (res.success) {
        setHList(res.data ?? []);
      }
    };

    if (hList.length !== 0) return;
    startTransition(handleList);
  }, []);

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
      </div>

      {fields.length > 0 ? (
        fields.map((item, index) => (
          <div key={item.id} className="grid grid-cols-1 gap-6 border-b pb-6">
            <div className="col-span-2 flex items-end gap-3 overflow-hidden">
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
                      }}
                      defaultValue={eventConsultant[index].doctor_id}
                      disabledKeys={eventConsultant.map((i) => i.doctor_id)}
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
              name={`eventConsultant.${index}.tier_id`}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="col-span-2 md:col-span-1"
                >
                  <div className="flex justify-between items-center gap-5">
                    <FieldLabel htmlFor={field.name}>Tier</FieldLabel>
                    <CheckTierModal />
                  </div>

                  <Select
                    data={hList.map((item) => ({
                      label: item.tier_name,
                      value: item.id,
                    }))}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedTier(value);
                      const consultant = form.getValues(
                        `eventConsultant.${index}`,
                      );
                      const filteredList = hList.find((i) => i.id === value);

                      if (filteredList) {
                        const totalHonorarium = calculateHonorarium(
                          filteredList,
                          {
                            isSpeaker: consultant.role === "Speaker",
                            nightStay: consultant.night_stay === "yes",
                            diffDist:
                              consultant.in_different_district === "yes",
                            hours: consultant.duration_h,
                          },
                        );

                        form.setValue(
                          `eventConsultant.${index}.honorarium`,
                          totalHonorarium,
                        );
                      }
                    }}
                    defaultValue={eventConsultant[index].tier_id}
                  />

                  {fieldState.error?.message && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name={`eventConsultant.${index}.role`}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="col-span-2 md:col-span-1"
                >
                  <FieldLabel htmlFor={field.name}>Role</FieldLabel>

                  <Select
                    data={consultantRole.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                    onValueChange={(value) => {
                      field.onChange(value);

                      handleHonorarium(index);
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
              name={`eventConsultant.${index}.in_different_district`}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="col-span-2 md:col-span-1"
                >
                  <FieldLabel htmlFor={field.name}>
                    Is in different district?
                  </FieldLabel>
                  <Select
                    {...field}
                    name="in_different_district"
                    data={yesNoList}
                    onValueChange={(value) => {
                      field.onChange(value);

                      handleHonorarium(index);
                    }}
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
                <Field
                  data-invalid={fieldState.invalid}
                  className="col-span-2 md:col-span-1"
                >
                  <FieldLabel htmlFor={field.name}>
                    Will stay at night?
                  </FieldLabel>
                  <Select
                    {...field}
                    name="night_stay"
                    data={yesNoList}
                    onValueChange={(value) => {
                      field.onChange(value);

                      handleHonorarium(index);
                    }}
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
              render={({ field, fieldState }) => {
                const { ref, ...rest } = field;

                return (
                  <Field
                    className="col-span-2 md:col-span-1"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor={field.name}>
                      Duration (hour)
                    </FieldLabel>
                    <Input
                      type="number"
                      {...rest}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber);
                        handleHonorarium(index);
                      }}
                    />

                    {fieldState.error?.message && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
            <Controller
              control={form.control}
              name={`eventConsultant.${index}.honorarium`}
              render={({ field, fieldState }) => {
                const { ref, ...rest } = field;

                return (
                  <Field
                    className="col-span-2 md:col-span-1"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor={field.name}>Honorarium</FieldLabel>
                    <Input
                      type="number"
                      {...rest}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />

                    {fieldState.error?.message && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
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

      {isCreator && (
        <Button
          variant={"outline"}
          type="button"
          className="text-primary"
          onClick={() =>
            append({
              doctor_id: "",
              role: "",
              duration_h: 1,
              honorarium: 0,
              in_different_district: "no",
              night_stay: "no",
              tier_id: "",
            })
          }
        >
          <PlusCircle />
          Add
        </Button>
      )}
    </>
  );
}
