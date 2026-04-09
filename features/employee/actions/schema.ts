import { userRoleSchema } from "@/schemas/common";
import { QuerySchema } from "@/schemas/query";
import z from "zod";

//
// ✅ Employee Base Schema
//
export const EmployeeSchema = z.object({
  work_area_code: z
    .string()
    .min(2, { message: "Employee ID must be at least 2 characters." })
    .max(21, { message: "Not more than 21 characters" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),

  role: userRoleSchema,
});

//
// ✅ Update Schema (at least one field required)
//
export const UpdateEmployeeSchema = EmployeeSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided for update",
  },
);

//
// ✅ Query Schema
//
export const EmployeeQuerySchema = QuerySchema.extend({});

//
// ✅ Array Schema
//
export const EmployeesSchema = z.array(EmployeeSchema);

//
// ✅ AO Schema (clean & validated)
//
export const AOSchema = z.object({
  employee_id: z.string(),
  full_name: z.string(),
  designation: z.string(),
  email: z.email({ message: "Invalid email address" }),
  group_name: z.string(),
  rm_code: z.string(),
  zm_code: z.string(),
  wing_code: z.string(),
});

//
// ✅ AO + Employee Combined (clean merge)
//
export const AODetailsSchema = EmployeeSchema.omit({
  password: true,
  role: true,
}).extend(AOSchema.shape);

export const AOsSchema = z.array(AODetailsSchema);

//
// ✅ Types
//
export type EmployeeType = z.infer<typeof EmployeeSchema>;
export type EmployeesType = z.infer<typeof EmployeesSchema>;
export type AOsType = z.infer<typeof AOsSchema>;
export type UpdateEmployeeType = z.infer<typeof UpdateEmployeeSchema>;
export type EmployeeQueryType = z.infer<typeof EmployeeQuerySchema>;
