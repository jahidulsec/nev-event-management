import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const createUserDTOSchema = z.object({
  employee_id: z
    .string("Enter employee id")
    .min(3, "At least 3 characters")
    .max(10, "not more than 10 character"),

  full_name: z
    .string("Enter full name")
    .min(3, "At least 3 characters")
    .max(50, "not more than 50 character"),

  password: z
    .string("Enter password")
    .min(6, "At least 6 characters")
    .max(100, "not more than 100 character"),

  email: z.email("Enter a valid email").max(100, "not more than 100 character"),

  designation: z
    .string("Enter designation")
    .min(2, "At least 2 characters")
    .max(50, "not more than 50 character"),

  mobile: z
    .string("Enter mobile number")
    .regex(/^01[3-9]{1}\d{8}$/, "Invalid phone number")
    .optional(),

  group: z
    .string("Enter group")
    .max(50, "not more than 50 character")
    .optional(),

  status: z.enum(["active", "inactive"]).optional(),

  roles: z.array(z.string()).min(1, "Select at least one role"),
});

export const createUsersDTOSchema = z.array(
  createUserDTOSchema.partial({ password: true }).extend({
    roles: z.preprocess(
      (val) => {
        if (typeof val !== "string") return val;
        return val.toLowerCase()
          .split(",")
          .map((role) => role.trim())
          .filter(Boolean);
      },
      z.array(z.string()).min(1, "Select at least one role"),
    ),
    // excel drops the leading 0 when the mobile column is a numeric cell
    mobile: z.preprocess((val) => {
      if (typeof val === "string" && val.startsWith("1")) return `0${val}`;
      return val;
    }, createUserDTOSchema.shape.mobile),
  }),
);

export const userQuerySchema = QuerySchema.extend({});

export const updateUserDTOSchema = createUserDTOSchema.partial();

export type CreateUserDTOType = z.infer<typeof createUserDTOSchema>;
export type CreateUsersDTOType = z.infer<typeof createUsersDTOSchema>;
export type UpdateUserDTOType = z.infer<typeof updateUserDTOSchema>;
export type UserQueryType = z.infer<typeof userQuerySchema>;
