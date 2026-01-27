import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const EmployeeSchema = z.object({
  employee_id: z
    .string("Enter Employee id")
    .min(2, "Employee ID must be at least 2 characters.")
    .max(21, "Not more than 21 characters"),
  password: z
    .string("Enter password")
    .min(6, "Password must be at least 6 characters."),
  role: z.enum(
    ["superadmin", "ao", "flm", "slm", "marketing", "director"],
    "Select a role",
  ),
});

export const UpdateEmployeeSchema = EmployeeSchema.partial();

export const EmployeeQuerySchema = QuerySchema.extend({
  // participant_id: z.string().optional(),
});

export const EmployeesSchema = z.array(EmployeeSchema);

export type EmployeeType = z.infer<typeof EmployeeSchema>;
export type EmployeesType = z.infer<typeof EmployeesSchema>;
export type UpdateEmployeeType = z.infer<typeof UpdateEmployeeSchema>;
export type EmployeeQueryType = z.infer<typeof EmployeeQuerySchema>;
