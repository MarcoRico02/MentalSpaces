import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";

export const useAuthState = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const { data } = await authAPI.me();
      return data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
  };
};
