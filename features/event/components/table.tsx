"use client";

import AlertModal from "@/components/shared/alert-dialog/alert-dialog";
import {
  DataTable,
  useTableSerialColumn,
} from "@/components/shared/table/data-table";
import { deleteToastTemplate } from "@/lib/template";
import { formatDate } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { deleteEvent } from "../actions/event";
import { TableActionButton } from "@/components/shared/button/button";
import { EventMultiProps } from "../lib/event";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@bprogress/next";

export default function EventTable({ data }: { data: EventMultiProps[] }) {
  const [del, setDel] = React.useState<string | boolean>(false);
  const [pending, startTransition] = React.useTransition();
  const serialColumn = useTableSerialColumn<EventMultiProps>();

  const router = useRouter();

  const columns: ColumnDef<EventMultiProps>[] = [
    serialColumn,
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "event_date",
      header: "Event Date",
      cell: ({ row }) => (
        <p>
          {row.original.event_date ? formatDate(row.original.event_date) : "-"}
        </p>
      ),
    },
    {
      accessorKey: "user_id",
      header: "Employee ID",
    },
    {
      id: "AO",
      header: "AO name",
      cell: ({ row }) => {
        <p>{row.original.user.user_details?.full_name ?? "-"}</p>;
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        <Badge variant={"outline"}>{row.original.current_status}</Badge>;
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
              onClick={() => router.push(`/dashboard/events/${value.id}`)}
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

      <AlertModal
        onOpenChange={setDel}
        open={!!del}
        onAction={() => {
          const id = typeof del !== "boolean" ? del : "";

          startTransition(() => {
            deleteToastTemplate(() => deleteEvent(id));
          });
        }}
      />
    </>
  );
}
