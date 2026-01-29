import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import { showToast } from "../../infraestructura/utilidades/toast";
import type { PropietarioRegisterRequestDTO } from "../../dominio/tipos/api";

export const usePropietarioRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PropietarioRegisterRequestDTO) => {
      const response = await authAPI.propietarios.register(data);
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
        error.response?.data?.message || "Error al registrar propietario";
      showToast.error(errorMessage);
      console.error("Owner registration error:", error);
    },
  });
};
