export type AuthUser = {
  employeeId: string;
  name: string;
  email: string;
  role: AuthUserRole[];
};

export type AuthUserRole = string;
