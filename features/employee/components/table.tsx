"use client";

import AlertModal from "@/components/shared/alert-dialog/alert-dialog";
import { DataTable } from "@/components/shared/table/data-table";
import { doctor, user } from "@/lib/generated/prisma";
import { deleteToastTemplate } from "@/lib/template";
import { formatDate } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { TableActionButton } from "@/components/shared/button/button";
import { FormSheet } from "@/components/shared/sheet/sheet";
import EmployeeForm from "./form";
import { Badge } from "@/components/ui/badge";
import { deleteEmployee } from "../actions/employee";

export default function EmployeeTable({ data }: { data: user[] }) {
  const [edit, setEdit] = React.useState<user | boolean>(false);
  const [del, setDel] = React.useState<string | boolean>(false);
  const [pending, startTransition] = React.useTransition();

  const columns: ColumnDef<user>[] = [
    { accessorKey: "employee_id", header: "Employee ID" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant={"outline"}>{row.original.role}</Badge>,
    },
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

      <FormSheet open={!!edit} onOpenChange={setEdit} formTitle="Edit Employee">
        <EmployeeForm
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
            deleteToastTemplate(() => deleteEmployee(id));
          });
        }}
      />
    </>
  );
}
