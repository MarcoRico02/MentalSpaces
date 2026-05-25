import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import type { CubiculoResponse } from "../../dominio/tipos/api";

export const useCubiculosPublicosQuery = (locationId: number | null) => {
  return useQuery({
    queryKey: ["cubiculos", "active-public", locationId],
    queryFn: async (): Promise<CubiculoResponse[]> => {
      const res = await authAPI.cubiculos.getActiveByLocationPublic(locationId!);
      return res.data;
    },
    enabled: !!locationId,
    staleTime: 1000 * 60 * 5,
  });
};
