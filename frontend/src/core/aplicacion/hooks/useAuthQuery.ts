import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import type { UsuarioMeResponseDTO } from "../../dominio/tipos/api";

// Authentication Service - Single Responsibility
export class AuthService {
  static async login(credentials: {
    username: string;
    password: string;
  }): Promise<void> {
    await authAPI.login(credentials);
  }

  static async logout(): Promise<void> {
    await authAPI.logout();
  }

  static async getCurrentUser(): Promise<UsuarioMeResponseDTO> {
    const { data } = await authAPI.me();
    return data;
  }
}

// Login Mutation Hook - Single Responsibility
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
    onError: (error) => {
      console.error("Login failed:", error);
      throw error; // Let caller handle the error
    },
  });
};

// Logout Mutation Hook - Single Responsibility
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Still clear state even on error
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
      queryClient.clear();
    },
  });
};

// User Query Hook - Single Responsibility
export const useUserQuery = () => {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: AuthService.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export class useAuthQuery {
}