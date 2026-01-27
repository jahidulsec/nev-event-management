"use client";

import AlertModal from "@/components/shared/alert-dialog/alert-dialog";
import { DataTable } from "@/components/shared/table/data-table";
import { product } from "@/lib/generated/prisma";
import { deleteToastTemplate } from "@/lib/template";
import { formatDate } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { TableActionButton } from "@/components/shared/button/button";
import { FormSheet } from "@/components/shared/sheet/sheet";
import ProductForm from "./form";
import { Badge } from "@/components/ui/badge";
import { deleteProduct } from "../actions/product";

export default function ProductTable({ data }: { data: product[] }) {
  const [edit, setEdit] = React.useState<product | boolean>(false);
  const [del, setDel] = React.useState<string | boolean>(false);
  const [pending, startTransition] = React.useTransition();

  const columns: ColumnDef<product>[] = [
    { accessorKey: "name", header: "Product Name" },
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
        <ProductForm
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
            deleteToastTemplate(() => deleteProduct(id));
          });
        }}
      />
    </>
  );
}
