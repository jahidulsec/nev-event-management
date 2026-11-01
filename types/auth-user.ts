export type AuthUser = {
  employeeId: string;
  name: string;
  email: string;
  role: AuthUserRole[];
  sapAreaCodes?: string[];
};

export type AuthUserRole = string;
