import React, { useMemo, useState } from "react";
import {
  HelpCircle,
  BookOpen,
  Settings,
  CreditCard,
  FileText,
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

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(
    null
  );

  // Consultar todas las categorías con sus preguntas
  const { data: categoriasData, isLoading: isLoadingCategorias } =
    useFaqAllCategoriesWithQuestionsQuery();

  // Procesar datos y aplicar busca
  const processedData = useMemo(() => {
    if (!categoriasData) return [];

    const query = searchQuery.trim().toLowerCase();

    return categoriasData
      .map((item: CategoriaPreguntasDTO) => {
        let preguntas = item.preguntas;

        // Filtrar preguntas por búsqueda
        if (query) {
          preguntas = preguntas.filter(
            (p) =>
              p.pregunta.toLowerCase().includes(query) ||
              p.respuesta.toLowerCase().includes(query)
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

      {/* Buscador */}
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

      {/* Sección de Categorías */}
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

      {/* Sección de Preguntas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-default">Preguntas</h2>
            {searchQuery.trim() && (
              <p className="text-sm text-secondary mt-1">
                Resultados para: <span className="font-medium">"{searchQuery}"</span>
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
    </div>
  );
};
