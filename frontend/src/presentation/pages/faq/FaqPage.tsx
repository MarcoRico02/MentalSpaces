import React, { useMemo, useState } from "react";
import {
  HelpCircle,
  BookOpen,
  Settings,
  CreditCard,
  FileText,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { CategoriaCard, PreguntaItem, CategoriaSkeleton, PreguntaSkeleton, SearchBar } from "../../components/faq";
import { useFaqAllCategoriesWithQuestionsQuery } from "../../../core/aplicacion/hooks";
import type { CategoriaPreguntasDTO } from "../../../core/dominio/tipos/api";

// Mapeo de categorías con iconos de Tabler/Lucide
const CATEGORIA_ICONS: Record<string, React.ComponentType<any>> = {
  "Uso del Sistema": HelpCircle,
  Reservas: BookOpen,
  Configuracion: Settings,
  Pagos: CreditCard,
  Documentacion: FileText,
  "General": HelpCircle,
  "Cuenta": Settings,
};

/**
 * Normaliza una cadena removiendo acentos y convirtiendo a minúsculas
 * Permite búsquedas sin importar acentos (ej: "informacion" encontrará "información")
 */
const normalizarParaBusqueda = (texto: string): string => {
  return texto
    .toLowerCase()
    .normalize("NFD") // Descomponetifica caracteres acentuados
    .replace(/[\u0300-\u036f]/g, ""); // Elimina diacríticos combinados
};

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(
    null
  );

  // Consultar todas las categorías con sus preguntas
  const {
    data: categoriasData,
    isLoading: isLoadingCategorias,
    isError: isErrorCategorias,
    error: errorCategorias
  } = useFaqAllCategoriesWithQuestionsQuery();

  // Procesar datos y aplicar busca
  const processedData = useMemo(() => {
    if (!categoriasData) return [];

    const query = normalizarParaBusqueda(searchQuery.trim());

    return categoriasData
      .map((item: CategoriaPreguntasDTO) => {
        let preguntas = item.preguntas;

        // Filtrar preguntas por búsqueda
        if (query) {
          preguntas = preguntas.filter(
            (p) =>
              normalizarParaBusqueda(p.pregunta).includes(query) ||
              normalizarParaBusqueda(p.respuesta).includes(query)
          );
        }

        // Filtrar por categoría seleccionada
        if (selectedCategoriaId && item.categoria.id !== selectedCategoriaId) {
          return null;
        }

        return {
          ...item,
          preguntas,
        };
      })
      .filter(Boolean);
  }, [categoriasData, searchQuery, selectedCategoriaId]);

  // Obtener todas las categorías para el grid
  const allCategorias = useMemo(() => {
    return (categoriasData?.map((item: CategoriaPreguntasDTO) => item.categoria) || []);
  }, [categoriasData]);

  // Contar preguntas activas por categoría
  const preguntasCountByCategoria = useMemo(() => {
    const counts: Record<number, number> = {};
    categoriasData?.forEach((item: CategoriaPreguntasDTO) => {
      counts[item.categoria.id] = item.preguntas.filter((p) => p.activa).length;
    });
    return counts;
  }, [categoriasData]);

  // Obtener todas las preguntas filtradas (para estado vacío)
  const allFilteredPreguntas = useMemo(() => {
    return (processedData as CategoriaPreguntasDTO[]).flatMap((item) => item.preguntas);
  }, [processedData]);

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <PageHeader
        title="Centro de Ayuda"
        description="Encuentra respuestas a preguntas frecuentes sobre el uso del sistema y nuestras políticas."
      />

      {/* Mensagem de Error */}
      {isErrorCategorias && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Error al cargar las FAQs</h3>
            <p className="text-red-700 text-sm mt-1">
              {errorCategorias?.message || "No pudimos conectar con el servidor. Por favor, intenta de nuevo más tarde."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-red-600 hover:text-red-700 font-medium mt-2 underline"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Buscador */}
      {!isErrorCategorias && (
        <div className="max-w-2xl">
          <SearchBar
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              // Reiniciar selección de categoría al buscar
              if (value) setSelectedCategoriaId(null);
            }}
            placeholder="Buscar en preguntas y respuestas..."
            disabled={isLoadingCategorias}
            resultsCount={searchQuery.trim() ? allFilteredPreguntas.length : null}
          />
        </div>
      )}

      {/* Sección de Categorías */}
      {!isErrorCategorias && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-default">Categorías</h2>
            {selectedCategoriaId !== null && (
              <button
                onClick={() => setSelectedCategoriaId(null)}
                className="text-sm text-primary hover:underline transition-colors"
              >
                Limpiar filtro
              </button>
            )}
          </div>

          {isLoadingCategorias ? (
            <CategoriaSkeleton />
          ) : allCategorias.length === 0 ? (
            <EmptyState
              title="No hay categorías disponibles"
              description="Por el momento no hay categorías de FAQs configuradas."
              icon={<HelpCircle className="h-12 w-12 text-muted-foreground" />}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {allCategorias.map((categoria: any) => {
                const IconComponent =
                  CATEGORIA_ICONS[categoria.nombre] || HelpCircle;
                const preguntasCount =
                  preguntasCountByCategoria[categoria.id] || 0;

                return (
                  <CategoriaCard
                    key={categoria.id}
                    nombre={categoria.nombre}
                    descripcion={categoria.descripcion}
                    icon={IconComponent as React.ComponentType<any>}
                    preguntasCount={preguntasCount}
                    isActive={categoria.activa}
                    isSelected={selectedCategoriaId === categoria.id}
                    onClick={() => {
                      setSelectedCategoriaId(
                        selectedCategoriaId === categoria.id ? null : categoria.id
                      );
                      setSearchQuery(""); // Limpiar búsqueda al seleccionar categoría
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sección de Preguntas */}
      {!isErrorCategorias && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-default">Preguntas</h2>
              {searchQuery.trim() && (
                <p className="text-sm text-secondary mt-1">
                  Resultados para: <span className="font-medium">&quot;{searchQuery}&quot;</span>
                </p>
              )}
            </div>
            {(searchQuery.trim() || selectedCategoriaId) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategoriaId(null);
                }}
                className="text-sm text-primary hover:underline transition-colors whitespace-nowrap"
              >
                Limpiar todo
              </button>
            )}
          </div>

          {isLoadingCategorias ? (
            <PreguntaSkeleton count={3} />
          ) : allFilteredPreguntas.length === 0 ? (
            <EmptyState
              title={
                searchQuery
                  ? "No se encontraron preguntas para tu búsqueda"
                  : "No hay preguntas en esta categoría"
              }
              description={
                searchQuery
                  ? `Intenta con otros términos de búsqueda o selecciona una categoría.`
                  : "Selecciona una categoría con preguntas para comenzar."
              }
              icon={<BookOpen className="h-12 w-12 text-muted-foreground" />}
              action={
                searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-sm text-primary hover:underline transition-colors"
                  >
                    Limpiar búsqueda
                  </button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-3">
              {(processedData as CategoriaPreguntasDTO[]).map((categoryItem) => (
                <div key={categoryItem.categoria.id} className="space-y-3">
                  {categoryItem.preguntas.length > 0 && (
                    <>
                      {/* Mostrar nombre de categoría solo si no hay filtro de búsqueda */}
                      {!searchQuery.trim() && !selectedCategoriaId && (
                        <h3 className="text-lg font-semibold text-default mt-6 mb-3">
                          {categoryItem.categoria.nombre}
                        </h3>
                      )}

                      {/* Mostrar nombre de categoría si hay categoría seleccionada */}
                      {selectedCategoriaId && selectedCategoriaId === categoryItem.categoria.id && (
                        <h3 className="text-lg font-semibold text-default mb-3">
                          {categoryItem.categoria.nombre}
                        </h3>
                      )}

                      {/* Preguntas */}
                      {categoryItem.preguntas.map((pregunta, index: number) => (
                        <PreguntaItem
                          key={pregunta.id}
                          pregunta={pregunta}
                          defaultOpen={index === 0} // Abre la primera pregunta por defecto
                        />
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
