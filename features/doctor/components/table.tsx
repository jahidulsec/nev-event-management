"use client";

import AlertModal from "@/components/shared/alert-dialog/alert-dialog";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { doctor } from "@/lib/generated/prisma";
import { deleteToastTemplate } from "@/lib/template";
import { formatDate } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { deleteDoctor } from "../actions/doctor";
import {
  ActionButton,
  TableActionButton,
} from "@/components/shared/button/button";
import DoctorForm from "./form";
import { FormSheet } from "@/components/shared/sheet/sheet";

export default function DoctorTable({ data }: { data: doctor[] }) {
  const [edit, setEdit] = React.useState<doctor | boolean>(false);
  const [del, setDel] = React.useState<string | boolean>(false);
  const [pending, startTransition] = React.useTransition();

  const columns: ColumnDef<doctor>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "full_name", header: "Full Name" },
    { accessorKey: "designation", header: "Designation" },
    { accessorKey: "speciality", header: "Speciality" },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => (
        <p>
          {row.original.created_at ? formatDate(row.original.created_at) : "-"}
        </p>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const value = row.original;

        return (
          <div className="flex justify-end items-center gap-1">
            <TableActionButton
              tooltip="Edit"
              variant={"edit"}
              onClick={() => setEdit(value)}
            >
              <Edit /> <span className="sr-only">Edit</span>
            </TableActionButton>
            <TableActionButton
              tooltip="delete"
              variant={"delete"}
              disabled={pending}
              onClick={() => setDel(value.id)}
            >
              <Trash2 /> <span className="sr-only">Delete</span>
            </TableActionButton>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable data={data} columns={columns} />

      <FormSheet open={!!edit} onOpenChange={setEdit} formTitle="Edit Doctor">
        <DoctorForm
          onClose={() => setEdit(false)}
          prevData={typeof edit !== "boolean" ? edit : undefined}
        />
      </FormSheet>

      <AlertModal
        onOpenChange={setDel}
        open={!!del}
        onAction={() => {
          const id = typeof del !== "boolean" ? del : "";

          startTransition(() => {
            deleteToastTemplate(() => deleteDoctor(id));
          });
        }}
      />
    </>
  );
}
