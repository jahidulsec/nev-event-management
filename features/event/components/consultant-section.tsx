import React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { EventType } from "../actions/schema";
import { ComboboxDoctor } from "@/components/shared/combobox/doctor";

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
    <div>
      <ComboboxDoctor />
    </div>
  );
}
