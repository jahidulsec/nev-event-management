"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import React from "react";
import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormButton } from "./button";
import ExcelJS from "exceljs";
import { toast } from "sonner";
import { FormDialog } from "../modal/modal";

const ExcelUploadSchema = z.object({
  file: z
    .instanceof(File, { message: "Upload a valid file" })
    .refine(
      (file) =>
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Upload only excel file",
    ),
});

type ExcelUploadType = z.infer<typeof ExcelUploadSchema>;

const getWorkbookJSONData = async (file: File) => {
  const fileBuffer = await file.arrayBuffer();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);

  const worksheet = workbook.worksheets[0];

  // First row = headers
  const headers: string[] = [];
  worksheet.getRow(1).eachCell((cell) => {
    headers.push(String(cell.value).trim());
  });

  // Rows → JSON
  const json: Record<string, any>[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header row

    const rowData: Record<string, any> = {};

    row.eachCell((cell, colNumber) => {
      const key = headers[colNumber - 1];
      rowData[key] = String(cell.value) ?? "";
    });

    json.push(rowData);
  });

  return json;
};

function ExcelUploadButton({
  action,
}: {
  action: (
    data: any,
  ) => Promise<{ success: boolean; message: string; data: any }>;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant={"outline"} onClick={() => setOpen(true)}>
        <Upload /> Upload
      </Button>

      <FormDialog open={open} onOpenChange={setOpen} formTitle="Upload Excel">
        <ExcelUploadForm action={action} />
      </FormDialog>
    </>
  );
}

function ExcelUploadForm({
  action,
}: {
  action: (
    data: any,
  ) => Promise<{ success: boolean; message: string; data: any }>;
}) {
  const form = useForm<ExcelUploadType>({
    resolver: zodResolver(ExcelUploadSchema),
  });

  const onSubmit = async (data: ExcelUploadType) => {
    console.log(data);

    const jsonData = await getWorkbookJSONData(data.file);
    console.log(jsonData);

    const res = await action(jsonData);

    toast[res.success ? "success" : "error"](res.message);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="file"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>File</FieldLabel>
              <Input
                onChange={(e) => {
                  const file = e.target.files;
                  if (file && file.length > 0) {
                    field.onChange(file[0]);
                  }
                }}
                type="file"
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Full name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FormButton isPending={form.formState.isSubmitting}>Upload</FormButton>
    </form>
  );
}

export { ExcelUploadButton };
