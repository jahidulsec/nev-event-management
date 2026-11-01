"use client";

import { AuthUser } from "@/types/auth-user";
import React from "react";

type AuthContextProps = {
  user: AuthUser;
  role: string;
  sapAreaCode?: string;
};

const AuthContext = React.createContext<AuthContextProps | undefined>(
  undefined,
);

export const AuthProvider = ({
  children,
  authUser,
  currentRole,
  currentArea,
}: React.PropsWithChildren & {
  authUser: AuthUser;
  currentRole: string;
  currentArea?: string;
}) => {
  return (
    <AuthContext.Provider
      value={{ user: authUser, role: currentRole, sapAreaCode: currentArea }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);

  if (!context) throw new Error("Auth context is not defined");

  return context;
};
