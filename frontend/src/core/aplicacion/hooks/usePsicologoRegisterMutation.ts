import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import { showToast } from "../../infraestructura/utilidades/toast";
import type { PsicologoRegisterRequestDTO } from "../../dominio/tipos/api";

export const usePsicologoRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PsicologoRegisterRequestDTO) => {
      const response = await authAPI.psicologos.register(data);
      return response.data;
    },
    onSuccess: (response) => {
      // Invalidate and refresh auth state
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      showToast.success(
        `¡Cuenta creada exitosamente! Bienvenido ${response.usuarioRegisterResponseDTO.fullName}`,
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Error al registrar psicólogo";
      showToast.error(errorMessage);
      console.error("Psychologist registration error:", error);
    },
  });
};
