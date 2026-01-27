"use client";

import AlertModal from "@/components/shared/alert-dialog/alert-dialog";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { doctor } from "@/lib/generated/prisma";
import { deleteToastTemplate } from "@/lib/template";
import { formatDate } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { deleteDoctor } from "../actions/doctor";
import { ActionButton } from "@/components/shared/button/button";

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
            <Button onClick={() => setEdit(value)}>
              <Edit2 /> <span className="sr-only">Edit</span>
            </Button>
            <ActionButton isPending={pending} onClick={() => setDel(value.id)}>
              <Trash2 /> <span className="sr-only">Delete</span>
            </ActionButton>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable data={data} columns={columns} />

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
