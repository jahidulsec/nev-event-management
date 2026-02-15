"use client";

import AlertModal from "@/components/shared/alert-dialog/alert-dialog";
import {
  DataTable,
  useTableSerialColumn,
} from "@/components/shared/table/data-table";
import { deleteToastTemplate } from "@/lib/template";
import { formatDate } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Workflow } from "lucide-react";
import React from "react";
import { deleteEvent } from "../actions/event";
import { TableActionButton } from "@/components/shared/button/button";
import { EventMultiProps } from "../lib/event";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@bprogress/next";
import { user_role } from "@/lib/generated/prisma";
import { getCostLimitText } from "@/utils/helper";
import { EventTypeMultiProps } from "../lib/type";
import {
  ApproverTypeBadge,
  UserRoleBadge,
} from "@/components/shared/badge/badge";
import { FormDialog } from "@/components/shared/modal/modal";
import { ApproverFlowChart } from "@/components/shared/flowchart/approver";
import { AuthUser } from "@/types/auth-user";
import { cn } from "@/lib/utils";

export default function EventTable({
  data,
  authUser,
}: {
  data: EventMultiProps[];
  authUser?: AuthUser;
}) {
  const [del, setDel] = React.useState<string | boolean>(false);
  const [pending, startTransition] = React.useTransition();
  const [flowchart, setFlowchart] = React.useState<
    EventTypeMultiProps | boolean
  >(false);
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
        const eventType = row.original.event_type;

        return (
          <p>
            {eventType?.title} ({getCostLimitText(eventType as any)})
          </p>
        );
      },
    },
    {
      id: "current_status",
      header: "Event Status",
      cell: ({ row }) => {
        const status = row.original.current_status;
        return (
          <Badge
            variant={"outline"}
            className={cn(
              status === "approved"
                ? "bg-green-100 text-green-500"
                : status === "rejected"
                  ? "text-destructive bg-destructive/10"
                  : "bg-yellow-50 text-yellow-700",
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "status",
      header: "Approval Status",
      cell: ({ row }) => {
        let status = "pending";

        const eventType = row.original.event_type;
        const eventStatus = row.original.event_approver;
        const eventApproverCount =
          row.original.event_type?.approver.length || 0;

        const getApproverIndex =
          eventStatus.length === 0
            ? 0
            : eventStatus.length - 1 < eventApproverCount
              ? eventStatus.length - 1
              : eventApproverCount;

        const approverList = row.original.event_approver;
        if (approverList.length > 0) {
          status = approverList[0].event_status_history?.[0].status;
        }

        return (
          <p>
            <UserRoleBadge
              type={
                eventType?.approver[getApproverIndex].user_type as user_role
              }
            >
              {eventType?.approver[getApproverIndex].user_type}
            </UserRoleBadge>
            <ApproverTypeBadge
              type={eventType?.approver[getApproverIndex].type as any}
            >
              {eventType?.approver[getApproverIndex].type}
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
              tooltip="Flowchart"
              onClick={() => setFlowchart(value.event_type?.approver as any)}
            >
              <Workflow /> <span className="sr-only">Workflow</span>
            </TableActionButton>
            <TableActionButton
              tooltip="Edit"
              variant={"edit"}
              onClick={() => router.push(`/dashboard/events/${value.id}`)}
            >
              <Edit /> <span className="sr-only">Edit</span>
            </TableActionButton>
            {authUser?.workAreaCode === value.user_id && (
              <TableActionButton
                tooltip="delete"
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

      <FormDialog
        open={!!flowchart}
        onOpenChange={setFlowchart}
        formTitle="View approver flow"
      >
        {typeof flowchart !== "boolean" && (
          <ApproverFlowChart data={flowchart as any} />
        )}
      </FormDialog>
    </>
  );
}
