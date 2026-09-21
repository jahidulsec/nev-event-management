"use client";

import React from "react";
import { ChevronRight, Edit, Folder, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { area, area_type } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import { ColorBadge } from "@/components/shared/badge/badge";
import { NoData } from "@/components/shared/state/state";
import { TableActionButton } from "@/components/shared/button/button";
import { FormSheet } from "@/components/shared/sheet/sheet";
import AreaForm from "./area-form";
import { CreateAreaDTOType } from "../schema/schema";

type AreaNode = area & { children: AreaNode[] };

const typeColor: Record<area_type, React.ComponentProps<typeof ColorBadge>["color"]> = {
  wing: "violet",
  zm: "blue",
  rm: "green",
  sm: "yellow",
  mio: "rose",
};

function buildAreaTree(areas: area[]): AreaNode[] {
  const nodeMap = new Map<string, AreaNode>(
    areas.map((area) => [area.sap_area_code, { ...area, children: [] }]),
  );

  const roots: AreaNode[] = [];

  nodeMap.forEach((node) => {
    const parent = node.parent_area_code
      ? nodeMap.get(node.parent_area_code)
      : undefined;

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

type FormState =
  | { mode: "create"; parent?: AreaNode }
  | { mode: "edit"; node: AreaNode };

export type AreaTreePermissions = {
  create?: boolean;
  update?: boolean;
};

function TreeNode({
  node,
  depth = 0,
  permissions,
  onCreateChild,
  onEdit,
}: {
  node: AreaNode;
  depth?: number;
  permissions: AreaTreePermissions;
  onCreateChild: (node: AreaNode) => void;
  onEdit: (node: AreaNode) => void;
}) {
  const hasChildren = node.children.length > 0;
  const [open, setOpen] = React.useState(depth === 0);

  return (
    <div>
      <div
        className="group flex items-center gap-2 rounded-md py-1.5 pr-2 hover:bg-accent"
        style={{ paddingLeft: depth * 20 }}
      >
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          disabled={!hasChildren}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted",
            !hasChildren && "opacity-0",
          )}
        >
          <ChevronRight
            className={cn("size-4 transition-transform", open && "rotate-90")}
          />
        </button>

        <Folder className="size-4 shrink-0 text-muted-foreground" />

        <span className="truncate text-sm font-medium">{node.area_name}</span>
        <span className="text-xs text-muted-foreground">
          {node.sap_area_code}
        </span>

        <ColorBadge color={typeColor[node.type]} className="ml-auto">
          {node.type.toUpperCase()}
        </ColorBadge>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
          {permissions.create && (
            <TableActionButton
              tooltip="Add sub-area"
              onClick={() => onCreateChild(node)}
            >
              <PlusCircle /> <span className="sr-only">Add sub-area</span>
            </TableActionButton>
          )}
          {permissions.update && (
            <TableActionButton
              tooltip="Edit"
              variant="edit"
              onClick={() => onEdit(node)}
            >
              <Edit /> <span className="sr-only">Edit</span>
            </TableActionButton>
          )}
        </div>
      </div>

      {hasChildren && open && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.sap_area_code}
              node={child}
              depth={depth + 1}
              permissions={permissions}
              onCreateChild={onCreateChild}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PreviewTree({
  data,
  permissions = {},
}: {
  data: area[];
  permissions?: AreaTreePermissions;
}) {
  const tree = React.useMemo(() => buildAreaTree(data), [data]);
  const [formState, setFormState] = React.useState<FormState | null>(null);

  const closeForm = () => setFormState(null);

  const formTitle =
    formState?.mode === "edit"
      ? `Edit Area - ${formState.node.area_name}`
      : formState?.parent
        ? `Add sub-area of ${formState.parent.area_name}`
        : "Create Area";

  const prevData: Partial<CreateAreaDTOType> | undefined =
    formState?.mode === "edit"
      ? {
          sap_area_code: formState.node.sap_area_code,
          area_name: formState.node.area_name,
          type: formState.node.type,
          parent_area_code: formState.node.parent_area_code ?? undefined,
        }
      : formState?.parent
        ? { parent_area_code: formState.parent.sap_area_code }
        : undefined;

  if (tree.length === 0) return <NoData />;

  return (
    <div className="flex flex-col">
      {tree.map((node) => (
        <TreeNode
          key={node.sap_area_code}
          node={node}
          permissions={permissions}
          onCreateChild={(parent) => setFormState({ mode: "create", parent })}
          onEdit={(node) => setFormState({ mode: "edit", node })}
        />
      ))}

      <FormSheet
        open={!!formState}
        onOpenChange={(open) => !open && closeForm()}
        formTitle={formTitle}
      >
        <AreaForm
          key={
            formState?.mode === "edit" ? formState.node.sap_area_code : "create"
          }
          prevData={prevData}
          editId={formState?.mode === "edit" ? formState.node.sap_area_code : undefined}
          lockParent={formState?.mode === "create" && !!formState.parent}
          onSuccess={(message) => {
            toast.success(message);
            closeForm();
          }}
          onError={(message) => toast.error(message)}
        />
      </FormSheet>
    </div>
  );
}
