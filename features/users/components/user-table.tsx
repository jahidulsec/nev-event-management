"use client";

import AlertModal from "@/components/shared/alert-dialog/alert-dialog";
import {
  DataTable,
  useTableSerialColumn,
} from "@/components/shared/table/data-table";
import { FormSheet } from "@/components/shared/sheet/sheet";
import { deleteToastTemplate } from "@/lib/template";
import { formatDate } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { deleteUser } from "../actions/users";
import { TableActionButton } from "@/components/shared/button/button";
import { UserMultiProps } from "../libs/users";
import UserForm from "./user-form";
import { StatusBadge } from "@/components/shared/badge/badge";

export default function UserTable({ data }: { data: UserMultiProps[] }) {
  const [edit, setEdit] = React.useState<UserMultiProps | boolean>(false);
  const [del, setDel] = React.useState<string | boolean>(false);
  const [pending, startTransition] = React.useTransition();

  const serialColumn = useTableSerialColumn<UserMultiProps>();

  const columns: ColumnDef<UserMultiProps>[] = [
    serialColumn,
    { accessorKey: "employee_id", header: "Employee ID" },
    { accessorKey: "full_name", header: "Full Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "designation", header: "Designation" },
    {
      accessorKey: "mobile",
      header: "Mobile",
      cell: ({ row }) => <p>{row.original.mobile || "-"}</p>,
    },
    {
      accessorKey: "sap_area_code",
      header: "SAP Area Code",
      cell: ({ row }) => <p>{row.original.sap_area_code || "-"}</p>,
    },
    {
      accessorKey: "group",
      header: "Group",
      cell: ({ row }) => <p>{row.original.group || "-"}</p>,
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status ?? "active";
        return <StatusBadge type={status}>{status}</StatusBadge>;
      },
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
              tooltip="Delete"
              variant={"delete"}
              disabled={pending}
              onClick={() => setDel(value.employee_id)}
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

      <FormSheet open={!!edit} onOpenChange={setEdit} formTitle="Edit user">
        <UserForm
          editId={typeof edit !== "boolean" ? edit.employee_id : undefined}
          prevData={
            typeof edit !== "boolean"
              ? {
                employee_id: edit.employee_id,
                full_name: edit.full_name,
                email: edit.email,
                designation: edit.designation,
                mobile: edit.mobile ?? undefined,
                sap_area_code: edit.sap_area_code ?? undefined,
                group: edit.group ?? undefined,
                status: edit.status ?? undefined,
              }
              : undefined
          }
          onSuccess={() => setEdit(false)}
        />
      </FormSheet>

      <AlertModal
        onOpenChange={setDel}
        open={!!del}
        onAction={() => {
          const id = typeof del !== "boolean" ? del : "";

          startTransition(() => {
            deleteToastTemplate(() => deleteUser(id));
          });
        }}
      />
    </>
  );
}
