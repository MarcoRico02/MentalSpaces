import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import type { ReservaCreateRequestDTO, ReservaCreateResponseDTO } from "../../dominio/tipos/api";
import { showToast } from "../../infraestructura/utilidades/toast";

export function useCrearReservaMutation() {
  return useMutation<ReservaCreateResponseDTO, Error, ReservaCreateRequestDTO>({
    mutationFn: async (data) => {
      const res = await authAPI.reservas.crear(data);
      return res.data;
    },
    onSuccess: () => {
      showToast.success("¡Reserva creada exitosamente!");
    },
    onError: (error: any) => {
      const mensaje =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        "Ocurrió un error al crear la reserva.";
      showToast.error(mensaje);
    },
  });
}

