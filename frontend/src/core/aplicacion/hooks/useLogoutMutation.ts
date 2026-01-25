import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import { showToast } from "../../infraestructura/utilidades/toast";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authAPI.logout();
    },
    onSuccess: () => {
      // Clear authentication cache
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
      queryClient.clear();
      showToast.info("Sesión cerrada");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even if there's an error, clear the local state
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
      queryClient.clear();
      showToast.info("Sesión cerrada");
    },
  });
};
