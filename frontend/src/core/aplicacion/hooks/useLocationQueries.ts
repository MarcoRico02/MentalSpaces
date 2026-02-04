import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import type { LocationResponseDTO } from "../../dominio/tipos/api";

export const useLocationsQuery = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async (): Promise<LocationResponseDTO[]> => {
      const response = await authAPI.locations.getAll();
      return response.data.content;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLocationQuery = (id: number) => {
  return useQuery({
    queryKey: ["location", id],
    queryFn: async (): Promise<LocationResponseDTO> => {
      const response = await authAPI.locations.getById(id);
      return response.data;
    },
    enabled: !!id, // Only run query if id exists
  });
};
