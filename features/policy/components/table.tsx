"use client";

import AlertModal from "@/components/shared/alert-dialog/alert-dialog";
import { TableActionButton } from "@/components/shared/button/button";
import { FormSheet } from "@/components/shared/sheet/sheet";
import {
  DataTable,
  useTableSerialColumn,
} from "@/components/shared/table/data-table";
import { Badge } from "@/components/ui/badge";
import { deleteToastTemplate } from "@/lib/template";
import { formatDate } from "@/utils/formatter";
import { policy } from "@/lib/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { deletePolicy } from "../actions/policy";
import { CreatePolicyDTOType } from "../schema/schema";
import PolicyForm from "./form";

export default function PolicyTable({ data }: { data: policy[] }) {
  const [edit, setEdit] = React.useState<policy | boolean>(false);
  const [del, setDel] = React.useState<string | boolean>(false);
  const [pending, startTransition] = React.useTransition();

  const serialColumn = useTableSerialColumn<policy>();

  const columns: ColumnDef<policy>[] = [
    serialColumn,
    { accessorKey: "name", header: "Name" },
    { accessorKey: "resource", header: "Resource" },
    { accessorKey: "action", header: "Action" },
    {
      accessorKey: "effect",
      header: "Effect",
      cell: ({ row }) => (
        <Badge
          variant={row.original.effect === "deny" ? "destructive" : "default"}
        >
          {row.original.effect}
        </Badge>
      ),
    },
    { accessorKey: "priority", header: "Priority" },
    {
      accessorKey: "enabled",
      header: "Status",
      cell: ({ row }) => <p>{row.original.enabled ? "Enabled" : "Disabled"}</p>,
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

      <FormSheet open={!!edit} onOpenChange={setEdit} formTitle="Edit Policy">
        <PolicyForm
          editId={typeof edit !== "boolean" ? edit.id : undefined}
          prevData={
            typeof edit !== "boolean"
              ? ({
                  name: edit.name,
                  description: edit.description ?? undefined,
                  resource: edit.resource,
                  action: edit.action,
                  effect: edit.effect,
                  priority: edit.priority,
                  enabled: edit.enabled,
                  conditions: (edit.conditions as CreatePolicyDTOType["conditions"]) ?? {
                    match: "all",
                    rules: [],
                  },
                } satisfies Partial<CreatePolicyDTOType>)
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
            deleteToastTemplate(() => deletePolicy(id));
          });
        }}
      />
    </>
  );
}
