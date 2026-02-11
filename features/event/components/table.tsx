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
import { event_type, user_role } from "@/lib/generated/prisma";
import {
  calculateEventBudget,
  findEventTypeByCost,
  getCostLimitText,
} from "@/utils/helper";
import { EventTypeMultiProps } from "../lib/type";
import {
  ApproverTypeBadge,
  UserRoleBadge,
} from "@/components/shared/badge/badge";

export default function EventTable({
  data,
  type,
}: {
  data: EventMultiProps[];
  type?: EventTypeMultiProps[];
}) {
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
      header: "Work area code",
    },
    {
      accessorKey: "event_type",
      header: "Type",
      cell: ({ row }) => {
        const budget = calculateEventBudget(
          row.original.event_budget,
          row.original.event_consultant,
        );

        const eventType = row.original.type;

        const validType = findEventTypeByCost(type ?? [], eventType, budget);

        return (
          <p>
            {validType?.title} ({getCostLimitText(validType as any)})
          </p>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        let status = "pending";

        const budget = calculateEventBudget(
          row.original.event_budget,
          row.original.event_consultant,
        );

        const eventType = row.original.type;

        const validType = findEventTypeByCost(type ?? [], eventType, budget);

        const approverList = row.original.event_approver;
        if (approverList.length > 0) {
          status = approverList[0].event_status_history?.[0].status;
        }

        return (
          <p>
            <UserRoleBadge type={validType?.approver[0].user_type as user_role}>
              {validType?.approver[0].user_type}
            </UserRoleBadge>
            <ApproverTypeBadge type={validType?.approver[0].type as any}>
              {validType?.approver[0].type}
            </ApproverTypeBadge>
            <Badge variant={"outline"}>{status}</Badge>
          </p>
        );
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
