"use client";

import { Form } from "@/components/shared/form/form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormButton } from "@/components/shared/button/button";
import { toast } from "sonner";
import { updateEventTrackingNumber } from "../actions/event";
import {
  updateEventTrackingPayloadSchema,
  UpdateEventTrackingPayloadType,
} from "../schemas/events";

export default function TrackingEventForm({
  eventId,
  trackingNo,
}: {
  trackingNo?: string;
  eventId: string;
}) {
  const form = useForm<UpdateEventTrackingPayloadType>({
    resolver: zodResolver(updateEventTrackingPayloadSchema),
    defaultValues: {
      track_no: trackingNo,
      event_id: eventId,
    },
  });

  const onSubmit = async (data: UpdateEventTrackingPayloadType) => {
    const res = await updateEventTrackingNumber(data);

    toast[res.success ? "success" : "error"](res.message);
  };

  if(trackingNo) return <div className="max-w-4xl">
    <FieldGroup className="gap-3">
      <FieldLabel>Tracking No.</FieldLabel>
      <Input value={trackingNo} readOnly />
    </FieldGroup>
  </div>

  return (
    <Form className="max-w-4xl" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="track_no"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tracking No.</FieldLabel>
              <Input
                {...field}
                id={field.name}
                autoComplete="off"
                placeholder="Tracking Number"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FormButton className="max-w-sm" isPending={form.formState.isSubmitting}>
        Save
      </FormButton>
    </Form>
  );
}
