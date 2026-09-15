"use client";

import AlertModal from "@/components/shared/alert-dialog/alert-dialog";
import { TableActionButton } from "@/components/shared/button/button";
import { FormSheet } from "@/components/shared/sheet/sheet";
import {
  DataTable,
  useTableSerialColumn,
} from "@/components/shared/table/data-table";
import { deleteToastTemplate } from "@/lib/template";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { deleteUserArea } from "../actions/user-area";
import { UserAreaMultiProps } from "../libs/user-area";
import UserAreaForm from "./form";

export default function UserAreaTable({ data }: { data: UserAreaMultiProps[] }) {
  const [edit, setEdit] = React.useState<UserAreaMultiProps | boolean>(false);
  const [del, setDel] = React.useState<string | boolean>(false);
  const [pending, startTransition] = React.useTransition();

  const serialColumn = useTableSerialColumn<UserAreaMultiProps>();

  const columns: ColumnDef<UserAreaMultiProps>[] = [
    serialColumn,
    {
      header: "User",
      cell: ({ row }) => (
        <p>
          {row.original.users?.full_name}{" "}
          <span className="text-muted-foreground">
            ({row.original.employee_id})
          </span>
        </p>
      ),
    },
    {
      header: "Area",
      cell: ({ row }) => (
        <p>
          {row.original.area?.area_name}{" "}
          <span className="text-muted-foreground">
            ({row.original.sap_area_code})
          </span>
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
              tooltip="Delete"
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

      <FormSheet
        open={!!edit}
        onOpenChange={setEdit}
        formTitle="Edit Area Scope"
      >
        <UserAreaForm
          editId={typeof edit !== "boolean" ? edit.id : undefined}
          prevData={
            typeof edit !== "boolean"
              ? {
                  employee_id: edit.employee_id,
                  sap_area_code: edit.sap_area_code,
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
            deleteToastTemplate(() => deleteUserArea(id));
          });
        }}
      />
    </>
  );
}
