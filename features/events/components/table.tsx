"use client";

import AlertModal from "@/components/shared/alert-dialog/alert-dialog";
import {
  DataTable,
  useTableSerialColumn,
} from "@/components/shared/table/data-table";
import { deleteToastTemplate } from "@/lib/template";
import { formatDate, formatTime, getTitleCase } from "@/utils/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Printer, Trash2, Workflow } from "lucide-react";
import React from "react";
import { deleteEvent } from "../actions/event";
import { TableActionButton } from "@/components/shared/button/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@bprogress/next";
import { getCostLimitText } from "@/utils/helper";
import { StatusBadge, UserRoleBadge } from "@/components/shared/badge/badge";
import { FormDialog } from "@/components/shared/modal/modal";
import { ApproverFlowChart } from "@/components/shared/flowchart/approver";
import { cn } from "@/lib/utils";
import { EventMultiProps } from "../libs/events";
import { useAuthContext } from "@/providers/auth";
import Link from "next/link";

export type EventTablePermissions = {
  update?: boolean;
  print?: boolean;
  delete?: boolean;
};

export default function EventTable({
  data,
  permissions = {},
}: {
  data: EventMultiProps[];
  permissions?: EventTablePermissions;
}) {
  const { user } = useAuthContext();

  const [del, setDel] = React.useState<string | boolean>(false);
  const [pending, startTransition] = React.useTransition();
  const [flowchart, setFlowchart] = React.useState<string | boolean>(false);
  const serialColumn = useTableSerialColumn<EventMultiProps>();

  const router = useRouter();

  const columns: ColumnDef<EventMultiProps>[] = [
    serialColumn,
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <p
          title={row.original.title}
          className="min-w-40 text-wrap line-clamp-2"
        >
          {row.original.title}
        </p>
      ),
    },
    {
      accessorKey: "event_date",
      header: "Event Date",
      cell: ({ row }) => (
        <div>
          {row.original.event_date ? (
            <>
              <p className="font-medium">
                {formatDate(row.original.event_date)}
              </p>
              <p className="text-muted-foreground font-semibold text-xs">
                {formatTime(row.original.event_date)}
              </p>
            </>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      accessorKey: "sap_area_code",
      header: "Work Area",
    },
    {
      id: "event_type",
      header: "Type",
      cell: ({ row }) => {
        const value = row.original.event_type;

        return (
          <p className="text-wrap min-w-40">
            {value?.title} (
            {getCostLimitText({
              upper_limit: Number(value?.upper_limit),
              lower_limit: Number(value?.lower_limit),
            })}
            )
          </p>
        );
      },
    },
    {
      id: "product",
      header: "Product",
      cell: ({ row }) => <p>{getTitleCase(row.original.product.name)}</p>,
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
              "border-transparent",
              status === "approved"
                ? "bg-green-50 text-green-700"
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

        const value = row.original;

        const lastApproverRole = value.event_approvers[0]?.user_role ?? null;
        status = lastApproverRole
          ? value.current_status === "rejected"
            ? "rejected"
            : "approved"
          : "pending";

        return (
          <p>
            {lastApproverRole !== null ? (
              <>
                <UserRoleBadge type={lastApproverRole}>
                  {lastApproverRole}
                </UserRoleBadge>
                <StatusBadge type={status}>{status}</StatusBadge>
              </>
            ) : (
              <>
                <StatusBadge type={status}>{status}</StatusBadge>
              </>
            )}
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
              onClick={() => setFlowchart(value.event_type_id ?? "")}
            >
              <Workflow /> <span className="sr-only">Workflow</span>
            </TableActionButton>
            <TableActionButton tooltip="Preview" variant={"edit"}>
              <Link href={`/dashboard/events/${value.id}/preview`}>
                <Eye /> <span className="sr-only">Preview</span>
              </Link>
            </TableActionButton>

            {permissions.update &&
              ["processing", "rework"].includes(
                row.original.current_status ?? "",
              ) && (
                <TableActionButton
                  tooltip="Edit"
                  variant={"edit"}
                  onClick={() => router.push(`/dashboard/events/${value.id}`)}
                >
                  <Edit /> <span className="sr-only">Edit</span>
                </TableActionButton>
              )}

            {permissions.print && (
              <TableActionButton tooltip="Print" variant={"edit"}>
                <a
                  href={`/print/event/${value.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Printer /> <span className="sr-only">Print</span>
                </a>
              </TableActionButton>
            )}

            {permissions.delete && (
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
        <ApproverFlowChart
          eventTypeId={typeof flowchart === "string" ? flowchart : ""}
        />
      </FormDialog>
    </>
  );
}
