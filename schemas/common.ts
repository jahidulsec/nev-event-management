import z from "zod";

export const userRoleSchema = z.enum(
  ["superadmin", "ao", "flm", "slm", "marketing", "director", "eo"],
  "Select a role",
);

export const eventApproverTypeEnum = z.enum(
  ["first", "second", "third", "final", "budget"],
  "Select a type",
);

export const eventApproverStatusEnum = z.enum(
  ["approved", "rejected", "rewrite"],
  "Select a type",
);
