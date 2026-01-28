"use client";

import AlertModal from "@/components/shared/alert-dialog/alert-dialog";
import {
  DataTable,
  useTableSerialColumn,
} from "@/components/shared/table/data-table";
import { event_type } from "@/lib/generated/prisma";
import { deleteToastTemplate } from "@/lib/template";
import { formatDate, formatNumber } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { deleteEventType } from "../../actions/type";
import { TableActionButton } from "@/components/shared/button/button";
import DoctorForm from "./form";
import { FormSheet } from "@/components/shared/sheet/sheet";
import { useSearchParams } from "next/navigation";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/settings";

export default function EventTypeTable({ data }: { data: event_type[] }) {
  const [edit, setEdit] = React.useState<event_type | boolean>(false);
  const [del, setDel] = React.useState<string | boolean>(false);
  const [pending, startTransition] = React.useTransition();
  const serialColumn = useTableSerialColumn<event_type>();

  const columns: ColumnDef<event_type>[] = [
    serialColumn,
    { accessorKey: "title", header: "Title" },
    {
      id: "cost_limit",
      header: "Cost Limit",
      cell: ({ row }) => {
        const value = row.original;

        const upperLimit = Number(value.upper_limit);
        const lowerLimit = Number(value.lower_limit);

        let limit = "All";

        if (upperLimit > 0 && lowerLimit > 0)
          limit = `${formatNumber(lowerLimit)} <= Cost <= ${formatNumber(upperLimit)}`;
        else if (upperLimit) limit = `Cost <= ${formatNumber(upperLimit)}`;
        else if (lowerLimit) limit = `${formatNumber(lowerLimit)} <= Cost`;

        return <p>{limit}</p>;
      },
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
            deleteToastTemplate(() => deleteEventType(id));
          });
        }}
      />
    </>
  );
}
