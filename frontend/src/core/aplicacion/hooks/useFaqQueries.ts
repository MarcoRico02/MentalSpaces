import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../infraestructura/api/api";
import type {
  CategoriaFAQDTO,
  PreguntaFAQDTO,
  CategoriaPreguntasDTO,
} from "../../dominio/tipos/api";

export const useFaqCategoriasQuery = () => {
  return useQuery<CategoriaFAQDTO[]>({
    queryKey: ["faqs", "categorias"],
    queryFn: async () => {
      const response = await authAPI.faqs.getCategorias();
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useFaqPreguntasByCategoriaQuery = (categoriaId: number | null) => {
  return useQuery<PreguntaFAQDTO[]>({
    queryKey: ["faqs", "preguntas", categoriaId],
    queryFn: async () => {
      if (!categoriaId) return [];
      const response = await authAPI.faqs.getPreguntasByCategoria(categoriaId);
      return response.data;
    },
    enabled: !!categoriaId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useFaqAllCategoriesWithQuestionsQuery = () => {
  return useQuery<CategoriaPreguntasDTO[]>({
    queryKey: ["faqs", "categorias-preguntas"],
    queryFn: async () => {
      const response = await authAPI.faqs.getAllCategoriesWithQuestions();
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useFaqSearchQuery = (query: string) => {
  return useQuery<PreguntaFAQDTO[]>({
    queryKey: ["faqs", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await authAPI.faqs.searchPreguntas(query);
      return response.data;
    },
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

