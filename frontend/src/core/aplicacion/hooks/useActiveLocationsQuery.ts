import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import type { LocationResponseDTO } from "../../dominio/tipos/api";

export const useActiveLocationsQuery = () => {
  return useQuery({
    queryKey: ["locations", "active"],
    queryFn: async (): Promise<LocationResponseDTO[]> => {
      const res = await authAPI.locations.getAllActive();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
