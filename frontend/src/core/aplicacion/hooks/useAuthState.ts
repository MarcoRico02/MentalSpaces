import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";

export const useAuthState = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      try {
        const { data } = await authAPI.me();
        return data;
      } catch (e) {
        // Si el backend falla (500) o responde 401/403, tratamos como 'no autenticado'
        // para no romper el render del app shell.
        // eslint-disable-next-line no-console
        console.error("Error en /usuarios/me", e);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
  };
};
