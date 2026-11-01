/**
 * Permission catalog: the single source of truth for every permission in the
 * app. The database (`role_permissions`) only stores which permissions a role
 * has been granted; what a permission *is* lives here.
 *
 * A permission is a `resource:action` string, e.g. `event:create`.
 */

export const SUPERADMIN_ROLE = "superadmin";

export const PERMISSION_ACTION_LABELS = {
  view: "View",
  view_all: "View all (bypass area/product scope)",
  create: "Create",
  update: "Update",
  delete: "Delete",
  import: "Bulk import",
  approve: "Approve / reject / rework",
  update_tracking: "Update tracking number",
  export: "Export",
  print: "Print",
  manage: "Manage",
} as const;

export type PermissionAction = keyof typeof PERMISSION_ACTION_LABELS;

export const PERMISSION_CATALOG = [
  {
    resource: "event",
    label: "Events",
    actions: [
      "view",
      "view_all",
      "create",
      "update",
      "delete",
      "approve",
      "update_tracking",
      "export",
      "print",
    ],
  },
  {
    resource: "event_type",
    label: "Event types",
    actions: ["view", "create", "update", "delete"],
  },
  {
    resource: "approver",
    label: "Approvers",
    actions: ["view", "create", "update", "delete"],
  },
  {
    resource: "user",
    label: "Users",
    actions: ["view", "create", "update", "delete", "import"],
  },
  {
    resource: "user_area",
    label: "User areas",
    actions: ["view", "create", "update", "delete", "import"],
  },
  {
    resource: "user_product",
    label: "User products",
    actions: ["view", "create", "update", "delete", "import"],
  },
  {
    resource: "role",
    label: "Roles",
    actions: ["view", "create", "update", "delete"],
  },
  {
    resource: "permission",
    label: "Permissions",
    actions: ["view", "manage"],
  },
  {
    resource: "doctor",
    label: "Doctors",
    actions: ["view", "create", "update", "delete", "import"],
  },
  {
    resource: "product",
    label: "Products",
    actions: ["view", "create", "update", "delete", "import"],
  },
  {
    resource: "area",
    label: "Areas",
    actions: ["view", "create", "update", "delete"],
  },
  {
    resource: "notification",
    label: "Notifications",
    actions: ["view"],
  },
] as const satisfies readonly {
  resource: string;
  label: string;
  actions: readonly PermissionAction[];
}[];

type PermissionCatalogGroup = (typeof PERMISSION_CATALOG)[number];

export type Permission = PermissionCatalogGroup extends infer G
  ? G extends {
      resource: infer R extends string;
      actions: readonly (infer A extends string)[];
    }
    ? `${R}:${A}`
    : never
  : never;

export type PermissionGroup = {
  resource: string;
  label: string;
  actions: readonly PermissionAction[];
};

/** The catalog widened to plain arrays so it is easy to iterate. */
export const permissionGroups: readonly PermissionGroup[] = PERMISSION_CATALOG;

export const ALL_PERMISSIONS: readonly Permission[] = permissionGroups.flatMap(
  (group) =>
    group.actions.map((action) => `${group.resource}:${action}` as Permission),
);

const permissionSet: ReadonlySet<string> = new Set(ALL_PERMISSIONS);

export const isPermission = (value: string): value is Permission =>
  permissionSet.has(value);

export const getPermissionKey = (resource: string, action: PermissionAction) =>
  `${resource}:${action}` as Permission;
