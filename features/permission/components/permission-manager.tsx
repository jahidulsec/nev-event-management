"use client";

import React from "react";
import { toast } from "sonner";
import {
  CheckCheck,
  Download,
  Eye,
  Globe,
  Hash,
  Lock,
  LucideIcon,
  Pencil,
  Plus,
  Printer,
  Settings2,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormButton } from "@/components/shared/button/button";
import {
  ALL_PERMISSIONS,
  getPermissionKey,
  PERMISSION_ACTION_LABELS,
  PermissionAction,
  permissionGroups,
  SUPERADMIN_ROLE,
} from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { setRolePermissions } from "../actions/permission";
import { RolePermissionItem } from "../schema/schema";

const ACTION_ICONS: Record<PermissionAction, LucideIcon> = {
  view: Eye,
  update: Pencil,
  create: Plus,
  delete: Trash2,
  view_all: Globe,
  import: Upload,
  approve: CheckCheck,
  update_tracking: Hash,
  export: Download,
  print: Printer,
  manage: Settings2,
};

// shown in every row, in this order, so the columns of icons line up
const CORE_ACTIONS: PermissionAction[] = ["view", "update", "create", "delete"];

type PermissionMap = Record<string, Set<string>>;

const toPermissionMap = (data: RolePermissionItem[]): PermissionMap =>
  Object.fromEntries(
    data.map(({ role, permissions }) => [
      role,
      new Set<string>(role === SUPERADMIN_ROLE ? ALL_PERMISSIONS : permissions),
    ]),
  );

const countDifference = (a: Set<string>, b: Set<string>) =>
  [...a].filter((item) => !b.has(item)).length +
  [...b].filter((item) => !a.has(item)).length;

export default function PermissionManager({
  data,
}: {
  data: RolePermissionItem[];
}) {
  // `saved` mirrors the database, `draft` holds edits that are not saved yet
  const [saved, setSaved] = React.useState(() => toPermissionMap(data));
  const [draft, setDraft] = React.useState(() => toPermissionMap(data));
  const [pending, startTransition] = React.useTransition();

  const changedRoles = data
    .map((item) => item.role)
    .filter((role) => countDifference(saved[role], draft[role]) > 0);

  const changeCount = changedRoles.reduce(
    (sum, role) => sum + countDifference(saved[role], draft[role]),
    0,
  );

  const activeCount = data.reduce((sum, { role }) => sum + draft[role].size, 0);

  const toggle = (role: string, permission: string) =>
    setDraft((prev) => {
      const next = new Set(prev[role]);
      if (!next.delete(permission)) next.add(permission);
      return { ...prev, [role]: next };
    });

  const onSave = () =>
    startTransition(async () => {
      const results = await Promise.all(
        changedRoles.map(async (role) => ({
          role,
          res: await setRolePermissions({
            role,
            permissions: ALL_PERMISSIONS.filter((p) => draft[role].has(p)),
          }),
        })),
      );

      const succeeded = results.filter(({ res }) => res.success);

      if (succeeded.length) {
        setSaved((prev) => {
          const next = { ...prev };
          succeeded.forEach(({ role }) => (next[role] = new Set(draft[role])));
          return next;
        });
        toast.success(
          succeeded.length === 1
            ? (succeeded[0].res.message ?? "Permissions updated")
            : `Permissions updated for ${succeeded.length} roles`,
        );
      }

      // failed roles keep their edits so they can be retried
      results
        .filter(({ res }) => !res.success)
        .forEach(({ role, res }) =>
          toast.error(`${role}: ${res.message ?? "Something went wrong"}`),
        );
    });

  if (!data.length)
    return (
      <p className="text-sm text-muted-foreground">
        No roles found. Create a role first, then assign its permissions here.
      </p>
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard value={data.length} label="Roles" />
        <StatCard value={permissionGroups.length} label="Resources" />
        <StatCard value={activeCount} label="Active Permissions" />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 min-h-9">
        <p className="text-sm text-muted-foreground">
          {changeCount
            ? `${changeCount} unsaved ${changeCount === 1 ? "change" : "changes"} in ${changedRoles.length} ${changedRoles.length === 1 ? "role" : "roles"}`
            : "Click an icon to grant or revoke a permission."}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!changeCount || pending}
            onClick={() => setDraft(saved)}
          >
            Discard
          </Button>
          <FormButton
            type="button"
            isPending={pending}
            disabled={!changeCount}
            onClick={onSave}
          >
            Save changes
          </FormButton>
        </div>
      </div>

      <Card className="rounded-3xl py-0 gap-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="sticky left-0 z-10 bg-background h-16 min-w-52 px-4 font-semibold text-foreground">
                Resource
              </TableHead>
              {data.map(({ role, userCount }) => (
                <TableHead key={role} className="h-16 min-w-56 px-4">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground capitalize">
                    {role.replaceAll("_", " ")}
                    {role === SUPERADMIN_ROLE && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Lock className="size-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Superadmin has full access and cannot be edited
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    {userCount} {userCount === 1 ? "user" : "users"}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {permissionGroups.map((group) => {
              const extraActions = group.actions.filter(
                (action) => !CORE_ACTIONS.includes(action),
              );

              return (
                <TableRow key={group.resource} className="hover:bg-transparent">
                  <TableCell className="sticky left-0 z-10 bg-background px-4 py-3 font-medium">
                    {group.label}
                  </TableCell>

                  {data.map(({ role }) => (
                    <TableCell key={role} className="px-4 py-3 whitespace-normal">
                      <div className="flex flex-wrap items-center gap-1.5 w-51">
                        {[...CORE_ACTIONS, ...extraActions].map((action) => {
                          // keep the slot so the core icons stay aligned
                          if (!group.actions.includes(action))
                            return (
                              <span key={action} className="size-7" aria-hidden />
                            );

                          const key = getPermissionKey(group.resource, action);

                          return (
                            <PermissionToggle
                              key={key}
                              icon={ACTION_ICONS[action]}
                              active={draft[role].has(key)}
                              disabled={role === SUPERADMIN_ROLE || pending}
                              label={PERMISSION_ACTION_LABELS[action]}
                              description={`${PERMISSION_ACTION_LABELS[action]} ${group.label.toLowerCase()} for ${role}`}
                              onToggle={() => toggle(role, key)}
                            />
                          );
                        })}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

const StatCard = ({ value, label }: { value: number; label: string }) => (
  <Card className="rounded-3xl gap-1 px-6 py-6">
    <p className="text-3xl font-semibold leading-none">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </Card>
);

const PermissionToggle = ({
  icon: Icon,
  active,
  disabled,
  label,
  description,
  onToggle,
}: {
  icon: LucideIcon;
  active: boolean;
  disabled: boolean;
  label: string;
  description: string;
  onToggle: () => void;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        aria-pressed={active}
        aria-label={description}
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "size-7 shrink-0 rounded-full border flex items-center justify-center transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-3.5",
          active
            ? "border-transparent bg-primary/10 text-primary"
            : "bg-background text-muted-foreground/60 hover:bg-muted",
          disabled && "cursor-not-allowed",
          disabled && !active && "opacity-60",
        )}
      >
        <Icon />
      </button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);
