export const RESOURCES = [
  "users",
  "role",
  "policy",
  "area",
  "product",
  "users_area",
  "user_product",
  "events",
] as const;

export const ACTIONS = [
  "create",
  "read",
  "update",
  "delete",
  "approve",
  "export",
] as const;

export type CatalogResource = (typeof RESOURCES)[number];
export type CatalogAction = (typeof ACTIONS)[number];

export type Resource = CatalogResource | "*";
export type Action = CatalogAction | "*";
