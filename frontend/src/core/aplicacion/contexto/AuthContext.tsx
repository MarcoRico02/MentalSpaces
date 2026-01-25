import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { UsuarioMeResponseDTO } from "../../dominio/tipos/api";
import { useAuthState } from "../hooks/useAuthState";
import { useRoles } from "../hooks/useRoles";
import { useLoginMutation } from "../hooks/useLoginMutation";
import { useLogoutMutation } from "../hooks/useLogoutMutation";

interface AuthContextType {
  user: UsuarioMeResponseDTO | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // Role utilities
  hasRole: (role: string) => boolean;
  isPsicologo: () => boolean;
  isPropietario: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Auth state management
  const { user, isLoading, isAuthenticated } = useAuthState();

  // Role utilities
  const { hasRole, isPsicologo, isPropietario, isAdmin } = useRoles();

  // Mutations
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    isPsicologo,
    isPropietario,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
