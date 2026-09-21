"use client";

import AlertModal from "@/components/shared/alert-dialog/alert-dialog";
import { TableActionButton } from "@/components/shared/button/button";
import { FormSheet } from "@/components/shared/sheet/sheet";
import {
  DataTable,
  useTableSerialColumn,
} from "@/components/shared/table/data-table";
import { deleteToastTemplate } from "@/lib/template";
import { formatDate } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { RowPermissions } from "@/types/permission";
import { deleteUserProduct } from "../actions/user-product";
import { UserProductMultiProps } from "../libs/user-product";
import UserProductForm from "./form";

export default function UserProductTable({
  data,
  permissions = {},
}: {
  data: UserProductMultiProps[];
  permissions?: RowPermissions;
}) {
  const [edit, setEdit] = React.useState<UserProductMultiProps | boolean>(false);
  const [del, setDel] = React.useState<string | boolean>(false);
  const [pending, startTransition] = React.useTransition();

  const serialColumn = useTableSerialColumn<UserProductMultiProps>();

  const columns: ColumnDef<UserProductMultiProps>[] = [
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
      header: "Product",
      cell: ({ row }) => <p>{row.original.product?.name}</p>,
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
            {permissions.update && (
              <TableActionButton
                tooltip="Edit"
                variant={"edit"}
                onClick={() => setEdit(value)}
              >
                <Edit /> <span className="sr-only">Edit</span>
              </TableActionButton>
            )}
            {permissions.delete && (
              <TableActionButton
                tooltip="Delete"
                variant={"delete"}
                disabled={pending}
                onClick={() => setDel(value.id)}
              >
                <Trash2 /> <span className="sr-only">Delete</span>
              </TableActionButton>
            )}
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
        formTitle="Edit Product Scope"
      >
        <UserProductForm
          editId={typeof edit !== "boolean" ? edit.id : undefined}
          prevData={
            typeof edit !== "boolean"
              ? {
                  employee_id: edit.employee_id,
                  product_id: edit.product_id,
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
            deleteToastTemplate(() => deleteUserProduct(id));
          });
        }}
      />
    </>
  );
}
