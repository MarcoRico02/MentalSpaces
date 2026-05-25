import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import type { ReservaDTO, ReservaFilterRequestDTO } from "../../dominio/tipos/api";

interface UseReservasCalendarioParams {
  fechaInicio: string;
  fechaFin: string;
  locationIds?: number[];
  cubiculoIds?: number[];
}

export const useReservasCalendarioQuery = (params: UseReservasCalendarioParams) => {
  return useQuery({
    queryKey: ["reservas", "calendario", params],
    queryFn: async (): Promise<ReservaDTO[]> => {
      const filterParams: ReservaFilterRequestDTO = {
        fechaInicio: params.fechaInicio,
        fechaFin: params.fechaFin,
        locationIds: params.locationIds,
        cubiculoIds: params.cubiculoIds,
      };
      const res = await authAPI.reservas.getByFilter(filterParams);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });
};
