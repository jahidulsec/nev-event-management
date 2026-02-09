import { QuerySchema } from "@/schemas/query";
import z from "zod";

export const DoctorSchema = z.object({
  full_name: z
    .string("Enter doctor name")
    .min(2, "Name must be at least 2 characters."),
  degrees: z
    .string("Enter degrees")
    .min(2, "Degrees must be at least 2 characters."),
  speciality: z
    .string("Enter speciality")
    .min(2, "Sepciality must be at least 2 characters."),
  territory_code: z
    .string("Enter territory code")
    .min(5, "At least 5 characters"),
  area_name: z.string().optional(),
  dr_child_id: z.string().optional(),
  dr_master_id: z
    .string("enter doctor master id")
    .min(3, "At least 3 characters"),
  chamber: z.string().optional(),
});

export const DoctorQuerySchema = QuerySchema.extend({
  // participant_id: z.string().optional(),
});

export const DoctorsSchema = z.array(
  z.object({
    TerritoryCode: z.string().min(5),
    AreaName: z.string().optional(),
    DrMasterID: z.string().min(3),
    DrChildID: z.string().optional(),
    DoctorName: z.string().min(1),
    Degrees: z.string().optional(),
    Speciality: z.string().min(1),
    Chamber: z.string().optional(),
  }),
);

export type DoctorType = z.infer<typeof DoctorSchema>;
export type DoctorsType = z.infer<typeof DoctorsSchema>;
export type DoctorQueryType = z.infer<typeof DoctorQuerySchema>;
