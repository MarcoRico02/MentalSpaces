import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import type { ReservaDTO, FiltroTemporal } from "../../dominio/tipos/api";

export const useReservasQuery = (filtro?: FiltroTemporal) => {
  return useQuery({
    queryKey: ["reservas", filtro],
    queryFn: async (): Promise<ReservaDTO[]> => {
      const response = await authAPI.reservas.getMine(filtro);
      const dto = response.data;
      return [...dto.reservasPropias, ...dto.reservasEnMisCubiculos];
    },
    staleTime: 1000 * 60 * 5,
  });
};
