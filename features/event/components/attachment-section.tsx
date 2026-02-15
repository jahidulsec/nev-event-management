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
import { FileText, Plus, PlusCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AttachmentSection({
  form,
  userId,
}: {
  form: UseFormReturn<EventType>;
  userId?: string;
}) {
  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: "eventAttachment",
  });

  const isCreator = userId === form.getValues("user_id");

  return (
    <>
      <div className="flex justify-baseline items-center gap-5">
        <div className="flex flex-col gap-1 w-full">
          <h4 className="w-full text-2xl font-medium">Event Attachements</h4>
        </div>

        {isCreator && (
          <Button
            variant={"outline"}
            type="button"
            onClick={() =>
              append({
                document_title: "",
                file: undefined as any,
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
                name={`eventAttachment.${index}.document_title`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Document Title</FieldLabel>
                    <Input {...field} placeholder="eg. Consultant form" />

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
                  onClick={() => {
                    remove(index);
                  }}
                  className="text-destructive border-destructive"
                >
                  <X />
                  <span className="sr-only">Remove</span>
                </Button>
              )}
            </div>

            <Controller
              control={form.control}
              name={`eventAttachment.${index}.file`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor={field.name}>Upload</FieldLabel>

                  <Input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        field.onChange(e.target.files[0]);
                      }
                    }}
                  />

                  {fieldState.error?.message && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {item.file_path && (
              <div className="my-3">
                <a
                  target="_blank"
                  href={`/api/files/?file_path=${item.file_path}`}
                  className="border rounded-md w-full p-2 flex items-center gap-3 [&_svg]:size-4"
                >
                  <FileText className="text-primary" /> {item.document_title}
                </a>
              </div>
            )}
          </div>
        ))
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <Plus />
            </EmptyMedia>
            <EmptyTitle>No attachment added yet</EmptyTitle>
            {isCreator && (
              <EmptyDescription>
                Add attachments for this event.
              </EmptyDescription>
            )}
          </EmptyHeader>
        </Empty>
      )}
    </>
  );
}
