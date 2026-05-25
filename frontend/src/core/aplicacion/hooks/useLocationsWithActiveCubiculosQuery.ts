import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import type { LocationResponseDTO } from "../../dominio/tipos/api";

export const useLocationsWithActiveCubiculosQuery = () => {
  return useQuery({
    queryKey: ["locations", "with-active-cubiculos"],
    queryFn: async (): Promise<LocationResponseDTO[]> => {
      const res = await authAPI.locations.getActiveWithActiveCubiculos();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
