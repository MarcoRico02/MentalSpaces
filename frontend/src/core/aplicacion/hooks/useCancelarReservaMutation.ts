import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import { showToast } from "../../infraestructura/utilidades/toast";

export function useCancelarReservaMutation() {
  return useMutation<void, Error, number>({
    mutationFn: async (reservaId: number) => {
      await authAPI.reservas.cancelar(reservaId);
    },
    onSuccess: () => {
      showToast.success("Reserva cancelada correctamente");
    },
    onError: (error: any) => {
      const mensaje =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        "Ocurrió un error al cancelar la reserva.";
      showToast.error(mensaje);
    },
  });
}

