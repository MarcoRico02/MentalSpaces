import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import type { CubiculoResponse } from "../../dominio/tipos/api";

export const useCubiculosActivosPorLocation = (locationId: number | null) => {
  return useQuery({
    queryKey: ["cubiculos", "activos", locationId],
    queryFn: async (): Promise<CubiculoResponse[]> => {
      const response = await authAPI.cubiculos.getActiveByLocation(locationId!);
      return response.data.content;
    },
    enabled: !!locationId,
    staleTime: 1000 * 60 * 5,
  });
};
