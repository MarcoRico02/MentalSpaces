import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  Power,
  PowerOff,
  MapPin,
  DollarSign,
  Star,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { authAPI } from "../../../core/infraestructura/api/api";
import type {
  CubiculoResponse,
  CubiculoPage,
  LocationResponseDTO,
  CaracteristicaNombre,
} from "../../../core/dominio/tipos/api";
import { CubiculoForm } from "../../components/cubiculos/CubiculoForm";
import { Modal } from "../../components/common/Modal";

interface CubiculosPageProps {
  locationId?: number;
}

export const CubiculosPage: React.FC<CubiculosPageProps> = ({
  locationId: propLocationId,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    propLocationId || null,
  );
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortBy] = useState("nombre,asc");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCubiculo, setEditingCubiculo] =
    useState<CubiculoResponse | null>(null);

  const queryClient = useQueryClient();

  // Obtener locations del usuario
  const {
    data: locationsData,
    isLoading: isLoadingLocations,
    error: locationsError,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: () => authAPI.locations.getAll().then((res) => res.data),
  });

  const locations = locationsData?.content || [];

  // Obtener cubículos
  const {
    data: cubiculosData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "cubiculos",
      selectedLocationId,
      showInactive,
      currentPage,
      pageSize,
      sortBy,
    ],
    queryFn: async () => {
      if (!selectedLocationId) {
        return {
          content: [],
          pageable: {
            pageNumber: 0,
            pageSize: pageSize,
            sort: { sorted: false, unsorted: true },
          },
          totalElements: 0,
          totalPages: 0,
          last: true,
          first: true,
          numberOfElements: 0,
          empty: true,
          size: pageSize,
          number: 0,
        } as CubiculoPage;
      }

      const endpoint = showInactive
        ? authAPI.cubiculos.getAllByLocation
        : authAPI.cubiculos.getActiveByLocation;

      const response = await endpoint(selectedLocationId, {
        page: currentPage,
        size: pageSize,
        sort: sortBy,
      });
      return response.data;
    },
    enabled: !!selectedLocationId,
  });

  // Obtener características
  const {
    data: caracteristicas = [],
    isLoading: isLoadingCaracteristicas,
    error: caracteristicasError,
  } = useQuery({
    queryKey: ["caracteristicas"],
    queryFn: () => authAPI.caracteristicas.getAll().then((res) => res.data),
  });

  // Mutación para activar/desactivar
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      isActive
        ? authAPI.cubiculos.deactivate(id)
        : authAPI.cubiculos.activate(id),
    onSuccess: () => {
      toast.success(
        `Cubículo ${showInactive ? "activado" : "desactivado"} exitosamente`,
      );
      queryClient.invalidateQueries({ queryKey: ["cubiculos"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al cambiar estado del cubículo";
      toast.error(message);
    },
  });

  // Filtrar cubículos por término de búsqueda
  const filteredCubiculos =
    cubiculosData?.content?.filter(
      (cubiculo) =>
        cubiculo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cubiculo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const handleToggleActive = (cubiculo: CubiculoResponse) => {
    toggleActiveMutation.mutate({
      id: cubiculo.id,
      isActive: cubiculo.isActive,
    });
  };

  const getCaracteristicaNombre = (nombre: CaracteristicaNombre): string => {
    return nombre
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoadingLocations || isLoadingCaracteristicas) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-secondary">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (locationsError || caracteristicasError) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-red-500">
            <Filter className="h-full w-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-default">
            Error al cargar datos
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {(locationsError as any)?.response?.data?.message ||
              (caracteristicasError as any)?.response?.data?.message ||
              "Error desconocido"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-default">
            No hay locations
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Debes crear una location antes de gestionar cubículos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-default">
          Gestión de Cubículos
        </h1>
        <p className="text-secondary">
          Administra los espacios de tus locations
        </p>
      </div>

      {/* Selector de Location */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-secondary mb-2">
          Seleccionar Location
        </label>
        <select
          value={selectedLocationId || ""}
          onChange={(e) => {
            setSelectedLocationId(Number(e.target.value));
            setCurrentPage(0);
          }}
          className="block w-full rounded-md border-default shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Selecciona una location...</option>
          {locations.map((location: LocationResponseDTO) => (
            <option key={location.id} value={location.id}>
              {location.name} {location.active ? "" : "(Inactiva)"}
            </option>
          ))}
        </select>
      </div>

      {selectedLocationId && (
        <>
          {/* Barra de herramientas */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Buscar cubículos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-default rounded-md leading-5 bg-surface placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowInactive(!showInactive);
                  setCurrentPage(0);
                }}
                className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                  showInactive
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-surface text-secondary border-default hover:bg-app"
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showInactive ? "Todos" : "Activos"}
              </button>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cubículo
              </button>
            </div>
          </div>

          {/* Lista de Cubículos */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Error al cargar cubículos</p>
            </div>
          ) : filteredCubiculos.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-muted-foreground">
                <Star className="h-full w-full" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-default">
                {searchTerm ? "No hay resultados" : "No hay cubículos"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm
                  ? "Intenta con otra búsqueda"
                  : "Crea tu primer cubículo"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCubiculos.map((cubiculo) => (
                <div
                  key={cubiculo.id}
                  className={`bg-surface rounded-lg shadow-md border ${
                    !cubiculo.isActive
                      ? "opacity-75 border-default"
                      : "border-default"
                  }`}
                >
                  {/* Imagen */}
                  {cubiculo.imageUrl && (
                    <div className="h-48 w-full bg-surface-3 rounded-t-lg overflow-hidden">
                      <img
                        src={cubiculo.imageUrl}
                        alt={cubiculo.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-default truncate">
                        {cubiculo.nombre}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cubiculo.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-surface-2 text-default"
                        }`}
                      >
                        {cubiculo.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <p className="text-secondary text-sm mb-3 line-clamp-2">
                      {cubiculo.descripcion}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-default">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="font-medium">${cubiculo.precio}</span>
                      </div>
                    </div>

                    {/* Características */}
                    {cubiculo.caracteristicas.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {cubiculo.caracteristicas
                            .slice(0, 3)
                            .map((caracteristica) => (
                              <span
                                key={caracteristica.id}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                              >
                                {getCaracteristicaNombre(caracteristica.nombre)}
                              </span>
                            ))}
                          {cubiculo.caracteristicas.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-surface-2 text-default">
                              +{cubiculo.caracteristicas.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingCubiculo(cubiculo)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-default text-sm font-medium rounded-md text-secondary bg-surface hover:bg-app focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleActive(cubiculo)}
                        className={`flex-1 inline-flex items-center justify-center px-3 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          cubiculo.isActive
                            ? "border-red-300 text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500"
                            : "border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500"
                        }`}
                      >
                        {cubiculo.isActive ? (
                          <>
                            <PowerOff className="h-4 w-4 mr-1" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <Power className="h-4 w-4 mr-1" />
                            Activar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {cubiculosData && !showInactive && cubiculosData.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-secondary">
                Mostrando {cubiculosData.numberOfElements} de{" "}
                {cubiculosData.totalElements} cubículos
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 border border-default rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-sm">
                  Página {currentPage + 1} de {cubiculosData.totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(cubiculosData.totalPages - 1, currentPage + 1),
                    )
                  }
                  disabled={currentPage >= cubiculosData.totalPages - 1}
                  className="px-3 py-1 border border-default rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de Creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Cubículo"
      >
        {selectedLocationId && (
          <CubiculoForm
            locationId={selectedLocationId}
            caracteristicas={caracteristicas}
            onSuccess={() => {
              setIsCreateModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ["cubiculos"] });
            }}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        )}
      </Modal>

      {/* Modal de Edición */}
      <Modal
        isOpen={!!editingCubiculo}
        onClose={() => setEditingCubiculo(null)}
        title="Editar Cubículo"
      >
        {editingCubiculo && (
          <CubiculoForm
            cubiculo={editingCubiculo}
            caracteristicas={caracteristicas}
            onSuccess={() => {
              setEditingCubiculo(null);
              queryClient.invalidateQueries({ queryKey: ["cubiculos"] });
            }}
            onCancel={() => setEditingCubiculo(null)}
          />
        )}
      </Modal>
    </div>
  );
};
