import { $Enums } from "@/lib/generated/prisma";

export type AuthUser = {
    id: string;
    employeeId: string;
    name: string;
    mobile: string;
    role: AuthUserRole;
};


export type AuthUserRole = $Enums.user_role