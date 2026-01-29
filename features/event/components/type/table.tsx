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
import { deleteEventType } from "../../actions/type";
import { TableActionButton } from "@/components/shared/button/button";
import EventTypeForm from "./form";
import { FormSheet } from "@/components/shared/sheet/sheet";
import { getCostLimitText } from "@/utils/helper";
import { EventTypeMultiProps } from "../../lib/type";
import { FormDialog } from "@/components/shared/modal/modal";
import { ApproverFlowChart } from "@/components/shared/flowchart/approver";

export default function EventTypeTable({
  data,
}: {
  data: EventTypeMultiProps[];
}) {
  const [edit, setEdit] = React.useState<EventTypeMultiProps | boolean>(false);
  const [flowchart, setFlowchart] = React.useState<
    EventTypeMultiProps | boolean
  >(false);
  const [del, setDel] = React.useState<string | boolean>(false);
  const [pending, startTransition] = React.useTransition();
  const serialColumn = useTableSerialColumn<EventTypeMultiProps>();

  const columns: ColumnDef<EventTypeMultiProps>[] = [
    serialColumn,
    { accessorKey: "title", header: "Title" },
    {
      id: "cost_limit",
      header: "Cost Limit",
      cell: ({ row }) => {
        const value = row.original;

        const limit = getCostLimitText(value);

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
              tooltip="Flowchart"
              onClick={() => setFlowchart(value)}
            >
              <Workflow /> <span className="sr-only">Workflow</span>
            </TableActionButton>
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
        formTitle="Edit event type"
      >
        <EventTypeForm
          onClose={() => setEdit(false)}
          prevData={typeof edit !== "boolean" ? edit : undefined}
        />
      </FormSheet>

      <FormDialog
        open={!!flowchart}
        onOpenChange={setFlowchart}
        formTitle="View approver flow"
      >
        {typeof flowchart !== "boolean" && (
          <ApproverFlowChart data={flowchart.approver} />
        )}
      </FormDialog>

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
