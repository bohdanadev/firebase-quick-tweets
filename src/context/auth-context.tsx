"use client";
import { IUser } from "@/types";
import { User } from "firebase/auth";
import React, { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  user: IUser | null;
  setAuthUserContext: (user: IUser) => void;
  setAuthContextNull: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);

  const setAuthUserContext = (user: IUser) => setUser(user);
  const setAuthContextNull = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, setAuthContextNull, setAuthUserContext }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
