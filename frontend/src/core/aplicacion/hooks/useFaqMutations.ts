import { useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "../../infraestructura/api/api";
import type {
  CategoriaFAQDTO,
  PreguntaFAQDTO,
} from "../../dominio/tipos/api";

/**
 * Crear nueva categoría de FAQ
 */
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<CategoriaFAQDTO, "id">) => {
      const response = await apiClient.post<CategoriaFAQDTO>(
        "/faqs/categorias",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqCategories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["faqAllCategoriesWithQuestions"],
      });
    },
  });
};

/**
 * Actualizar categoría de FAQ
 */
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CategoriaFAQDTO>;
    }) => {
      const response = await apiClient.put<CategoriaFAQDTO>(
        `/faqs/categorias/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqCategories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["faqAllCategoriesWithQuestions"],
      });
    },
  });
};

/**
 * Eliminar categoría de FAQ
 */
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/faqs/categorias/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqCategories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["faqAllCategoriesWithQuestions"],
      });
    },
  });
};

/**
 * Crear nueva pregunta de FAQ
 */
export const useCreateQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<PreguntaFAQDTO, "id">) => {
      const response = await apiClient.post<PreguntaFAQDTO>("/faqs/preguntas", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqQuestions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["faqAllCategoriesWithQuestions"],
      });
    },
  });
};

/**
 * Actualizar pregunta de FAQ
 */
export const useUpdateQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<PreguntaFAQDTO>;
    }) => {
      const response = await apiClient.put<PreguntaFAQDTO>(
        `/faqs/preguntas/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqQuestions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["faqAllCategoriesWithQuestions"],
      });
    },
  });
};

/**
 * Eliminar pregunta de FAQ
 */
export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/faqs/preguntas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqQuestions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["faqAllCategoriesWithQuestions"],
      });
    },
  });
};

