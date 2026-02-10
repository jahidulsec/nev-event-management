"use client";

import { product } from "@/lib/generated/prisma";
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
import { EventSchema, EventType } from "../actions/schema";
import { createEvent, updateEvent } from "../actions/event";
import { DatePicker } from "@/components/shared/date-picker/date-picker";
import React from "react";
import { Select } from "@/components/shared/select/select";
import { getProducts } from "@/features/product/lib/product";
import { Separator } from "@/components/ui/separator";
import { EventBudgetSection } from "./event-budget-section";
import ConsultantSection from "./consultant-section";
import AttachmentSection from "./attachment-section";
import { AuthUser } from "@/types/auth-user";
import { EventSingleProps } from "../lib/event";
import { formatNumber } from "@/utils/formatter";
import { useParams } from "next/navigation";

export default function EventForm({
  prevData,
  user,
}: {
  prevData?: EventSingleProps;
  user?: AuthUser;
}) {
  const [products, setProducts] = React.useState<product[]>([]);
  const [pending, startTransition] = React.useTransition();

  const params = useParams();

  const form = useForm<EventType>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: prevData?.title,
      user_id: user?.employeeId ?? prevData?.user_id,
      product_id: prevData?.product_id,
      event_date: prevData?.event_date,
      venue_name: prevData?.venue_name,
      venue_address: prevData?.venue_address,
      venue_appropriateness: prevData?.venue_appropriateness,
      institute: prevData?.institute,
      institute_dept: prevData?.institute_dept,
      institute_unit: prevData?.institute_unit,
      objective: prevData?.objective,
      event_type: prevData?.event_type,
      approved_material: prevData?.approved_material,
      material_code: prevData?.material_code ?? undefined,
      internal_participants: prevData?.internal_participants,
      external_participants: prevData?.external_participants,
      other_participants: prevData?.other_participants ?? undefined,
      details_participants: prevData?.details_participants ?? undefined,
      eventAttachment: prevData?.event_attachment,
      eventConsultant: prevData?.event_consultant.map((item) => {
        const { duration_h, honorarium, ...rest } = item;

        return {
          ...rest,
          duration_h: Number(duration_h),
          honorarium: Number(honorarium),
        };
      }),
      eventBudget: prevData?.event_budget.map((item) => {
        const { unit_cost, ...rest } = item;

        return {
          ...rest,
          unit_cost: Number(unit_cost),
        };
      }),
    },
  });

  // get form value
  const objective = form.watch("objective");
  const eventType = form.watch("event_type");
  const internalParticipants = form.watch("internal_participants");
  const externalParticipants = form.watch("external_participants");
  const otherParticipants = form.watch("other_participants");

  async function onSubmit(data: EventType) {
    const res = prevData
      ? await updateEvent(prevData.id, data)
      : await createEvent(data);
    toast[res.success ? "success" : "error"](res.message);

    if (res.success) {
      // TODO: redirect to event list view page
    }
    console.log(data);
  }

  // get products
  React.useEffect(() => {
    const handleEventTypes = () => {
      startTransition(async () => {
        const res = await getProducts({ page: 1, size: 20 });
        if (res.success) {
          setProducts(res?.data ?? []);
        }
      });
    };

    handleEventTypes();
  }, []);

  return (
    <Form
      className="max-w-2xl mx-auto py-10"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <h3 className="text-2xl font-bold text-primary mb-6">
        {params.id ? "Event Details" : "Create Event"}
      </h3>
      <FieldGroup>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Event Title</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Event title"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="lg:flex-row">
        <Controller
          control={form.control}
          name="event_date"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Proposed Date</FieldLabel>
              <DatePicker
                className="w-full"
                defaultValue={prevData?.event_date}
                onChange={(value) => field.onChange(value)}
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
              <Select
                placeholder="Select a product"
                pending={pending}
                defaultValue={prevData?.product_id ?? undefined}
                data={products.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Separator />

      {/* venue */}
      <FieldGroup>
        <Controller
          control={form.control}
          name="venue_name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Venue Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Venue name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup className="lg:flex-row">
        <Controller
          control={form.control}
          name="venue_address"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Venue Address</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Venue Address"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="venue_appropriateness"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Venue Appropriateness
              </FieldLabel>
              <Select
                id={field.name}
                defaultValue={prevData?.venue_appropriateness ?? undefined}
                data={[
                  {
                    label: "Yes",
                    value: "yes",
                  },
                  {
                    label: "No",
                    value: "no",
                  },
                ]}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Separator />

      {/* institue */}
      <FieldGroup>
        <Controller
          control={form.control}
          name="institute"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Institute Name, Code & Area
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Institute"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="lg:flex-row">
        <Controller
          control={form.control}
          name="institute_unit"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Unit</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Institute unit"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="institute_dept"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Department/Speciality
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Institute Department"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Separator />

      {/* event data */}
      <FieldGroup className="lg:flex-row">
        <Controller
          control={form.control}
          name="objective"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Objective</FieldLabel>
              <Select
                defaultValue={
                  prevData?.objective
                    ? objectiveList.includes(prevData?.objective)
                      ? prevData.objective
                      : "Other"
                    : undefined
                }
                data={objectiveList.map((item) => ({
                  label: item,
                  value: item,
                }))}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              />
              {objective &&
                objectiveList.slice(0, 3).includes(objective) === false && (
                  <Input
                    defaultValue={objective}
                    onChange={(e) => {
                      form.setValue("objective", e.target.value);
                    }}
                    aria-invalid={fieldState.invalid}
                    placeholder="Others"
                    autoComplete="off"
                    className="max-w-sm"
                  />
                )}

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="event_type"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Event Type</FieldLabel>
              <Select
                defaultValue={
                  prevData?.event_type
                    ? eventTypeList.includes(prevData?.event_type)
                      ? prevData.event_type
                      : "Other"
                    : undefined
                }
                data={eventTypeList.map((item) => ({
                  label: item,
                  value: item,
                }))}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              />
              {eventType &&
                eventTypeList.slice(0, 4).includes(eventType) === false && (
                  <Input
                    defaultValue={eventType}
                    onChange={(e) => {
                      form.setValue("event_type", e.target.value);
                    }}
                    aria-invalid={fieldState.invalid}
                    placeholder="Others"
                    autoComplete="off"
                    className="max-w-sm"
                  />
                )}

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Separator />

      {/* material */}
      <FieldGroup className="lg:flex-row">
        <Controller
          control={form.control}
          name="approved_material"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Approved material</FieldLabel>
              <Select
                defaultValue={prevData?.approved_material ?? undefined}
                data={approvedMaterial.map((item) => ({
                  label: item.label,
                  value: item.value,
                }))}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="material_code"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Material Code</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Material Code"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Separator />

      {/* participants */}
      <FieldGroup className="lg:flex-row">
        <Controller
          control={form.control}
          name="internal_participants"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Internal Participants
              </FieldLabel>
              <Input
                onChange={(e) => {
                  field.onChange(Number(e.target.value));
                }}
                value={field.value}
                type="number"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Internals"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="external_participants"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                External Participants
              </FieldLabel>
              <Input
                onChange={(e) => {
                  field.onChange(Number(e.target.value));
                }}
                value={field.value}
                type="number"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Externals"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="other_participants"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Other Participants</FieldLabel>
              <Input
                onChange={(e) => {
                  field.onChange(Number(e.target.value));
                }}
                value={field.value}
                type="number"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Other"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <p className="font-semibold">
        Total:{" "}
        {formatNumber(
          internalParticipants +
            externalParticipants +
            (otherParticipants || 0),
        )}
      </p>

      <FieldGroup>
        <Controller
          control={form.control}
          name="details_participants"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Details Participants</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Details"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Separator />

      {/* event budget section */}
      <EventBudgetSection form={form} />

      <Separator />

      <ConsultantSection form={form} />

      <Separator />

      <AttachmentSection form={form} />

      <FormButton
        isPending={form.formState.isSubmitting}
        size={"lg"}
        className="max-w-sm"
      >
        Save
      </FormButton>
    </Form>
  );
}

const objectiveList = [
  "Brand Promotion",
  "Disease Awareness",
  "Scientific Knowledge Dissemination",
  "Other",
];

const eventTypeList = [
  "Non-paid Promotional",
  "Paid Promotional",
  "Non-paid Medical",
  "Paid Medical",
  "Other",
];

const approvedMaterial = [
  {
    label: "Promotional",
    value: "promotional",
  },
  {
    label: "Non-Branded",
    value: "non_branded",
  },
];
