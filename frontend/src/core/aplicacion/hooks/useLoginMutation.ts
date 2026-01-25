import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import { showToast } from "../../infraestructura/utilidades/toast";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      await authAPI.login(credentials);
    },
    onSuccess: () => {
      // Invalidate and refresh the user
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      showToast.success("¡Bienvenido a SATI!");
    },
    onError: (error) => {
      showToast.error("Credenciales incorrectas");
      console.error("Login error:", error);
    },
  });
};
