import { $Enums } from "@/lib/generated/prisma";

export type AuthUser = {
    id: string;
    workAreaCode: string;
    name: string;
    mobile: string;
    role: AuthUserRole;
};


export type AuthUserRole = $Enums.user_role