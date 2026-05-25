import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import type { CubiculoResponse } from "../../dominio/tipos/api";

export const useAllCubiculosActivosQuery = () => {
  return useQuery({
    queryKey: ["cubiculos", "active-public", "all"],
    queryFn: async (): Promise<CubiculoResponse[]> => {
      const res = await authAPI.cubiculos.getAllActivePublic();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
