"use client";

import { AuthUser } from "@/types/auth-user";
import React from "react";

type AuthContextProps = {
  user: AuthUser;
};

const AuthContext = React.createContext<AuthContextProps | undefined>(
  undefined,
);

export const AuthProvider = ({
  children,
  authUser,
}: React.PropsWithChildren & { authUser: AuthUser }) => {
  return (
    <AuthContext.Provider value={{ user: authUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);

  if (!context) throw new Error("Auth context is not defined");

  return context;
};
