import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import { showToast } from "../../infraestructura/utilidades/toast";
import type {
  LocationCreateRequestDTO,
  LocationResponseDTO,
} from "../../dominio/tipos/api";

export const useCreateLocationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: LocationCreateRequestDTO,
    ): Promise<LocationResponseDTO> => {
      const response = await authAPI.locations.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      showToast.success("¡Locación creada exitosamente!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Error al crear locación";
      showToast.error(errorMessage);
      console.error("Create location error:", error);
    },
  });
};

export const useUpdateLocationMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: LocationCreateRequestDTO,
    ): Promise<LocationResponseDTO> => {
      const response = await authAPI.locations.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location", id] });
      showToast.success("¡Locación actualizada exitosamente!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.status === 404
          ? "La locación no existe o no pertenece al propietario"
          : "Error al actualizar locación");
      showToast.error(errorMessage);
      console.error("Update location error:", error);
    },
  });
};

export const useDeactivateLocationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await authAPI.locations.deactivate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      showToast.success("Locación desactivada exitosamente");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.status === 404
          ? "La locación no existe o no pertenece al propietario"
          : "Error al desactivar locación");
      showToast.error(errorMessage);
      console.error("Deactivate location error:", error);
    },
  });
};

export const useActivateLocationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await authAPI.locations.activate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      showToast.success("Locación activada exitosamente");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.status === 404
          ? "La locación no existe o no pertenece al propietario"
          : "Error al activar locación");
      showToast.error(errorMessage);
      console.error("Activate location error:", error);
    },
  });
};
