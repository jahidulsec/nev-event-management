
export type AuthUser = {
    sapId: string;
    name: string;
    mobile: string;
    role: AuthUserRole;
};


export type AuthUserRole = 'superadmin' | 'admin' | 'mio'