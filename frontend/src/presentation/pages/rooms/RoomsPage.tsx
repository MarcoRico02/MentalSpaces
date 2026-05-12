import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  Plus,
  Edit,
  Power,
  PowerOff,
  ChevronLeft,
  DollarSign,
  LayoutGrid,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { PageHeader } from "../../components/common/PageHeader";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../components/ui";
import { Modal } from "../../components/common/Modal";
import { CubiculoForm } from "../../components/cubiculos/CubiculoForm";
import { authAPI } from "../../../core/infraestructura/api/api";
import type {
  LocationResponseDTO,
  CubiculoResponse,
  CaracteristicaDTO,
  CaracteristicaNombre,
} from "../../../core/dominio/tipos/api";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=60";

const formatCaracteristica = (nombre: CaracteristicaNombre): string =>
  nombre.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());

// ─── Sub-componente: panel de cubículos de una locación ──────────────────────
interface CubiculosPanelProps {
  location: LocationResponseDTO;
  caracteristicas: CaracteristicaDTO[];
  onBack: () => void;
}

const CubiculosPanel: React.FC<CubiculosPanelProps> = ({
  location,
  caracteristicas,
  onBack,
}) => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCubiculo, setEditingCubiculo] = useState<CubiculoResponse | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  const { data: cubiculosData, isLoading, error } = useQuery({
    queryKey: ["cubiculos", location.id, showInactive, currentPage, pageSize],
    queryFn: () => {
      const endpoint = showInactive
        ? authAPI.cubiculos.getAllByLocation
        : authAPI.cubiculos.getActiveByLocation;
      return endpoint(location.id, { page: currentPage, size: pageSize, sort: "nombre,asc" })
        .then((r) => r.data);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      isActive ? authAPI.cubiculos.deactivate(id) : authAPI.cubiculos.activate(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cubiculos", location.id] });
      toast.success(`Cubículo ${variables.isActive ? "desactivado" : "activado"} exitosamente`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Error al cambiar el estado");
    },
  });

  const createQuickMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        locationId: location.id,
        nombre: "Nuevo cubículo",
        descripcion: "",
        precio: 0,
        imageUrl: "",
        caracteristicasIds: [],
        active: true,
      } as any;
      return authAPI.cubiculos.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cubiculos", location.id] });
      toast.success("Cubículo creado exitosamente");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Error al crear el cubículo");
    },
  });

  // Filtro local por búsqueda
  const allCubiculos = cubiculosData?.content ?? [];
  const filtered = searchTerm.trim()
    ? allCubiculos.filter(
        (c) =>
          c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : allCubiculos;

  const totalPages = cubiculosData?.totalPages ?? 0;
  const totalElements = cubiculosData?.totalElements ?? 0;
  const numberOfElements = cubiculosData?.numberOfElements ?? 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xl text-muted-foreground hover:text-default transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Locaciones
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-xl font-medium text-default">{location.name}</span>
      </div>

      {/* Banner de la locación */}
      <div
        className="h-32 rounded-xl bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${location.imageUrl || DEFAULT_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent p-5 flex flex-col justify-end">
          <p className="text-white text-xl font-bold">{location.name}</p>
          <p className="text-white/80 text-sm flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {location.address}
          </p>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Buscador */}
        <div className="flex-1 min-w-0 sm:min-w-64 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar cubículos..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
            className="h-15 w-full pl-9 pr-3 border border-default rounded-md text-sm bg-surface focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtro activos/todos */}
        <button
          onClick={() => { setShowInactive(!showInactive); setCurrentPage(0); }}
          className={`h-15 inline-flex items-center gap-2 px-4 border rounded-md text-sm font-medium transition-colors ${
            showInactive
              ? "bg-primary text-white border-primary"
              : "bg-surface text-secondary border-default hover:bg-app"
          }`}
        >
          <Filter className="h-4 w-4" />
          {showInactive ? "Todos" : "Solo activos"}
        </button>

        {/* Botón crear (creación rápida) */}
        <Button
          className="h-15 whitespace-nowrap shrink-0"
          onClick={() => createQuickMutation.mutate()}
          disabled={createQuickMutation.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          {createQuickMutation.isPending ? "Creando..." : "Nuevo Cubículo"}
        </Button>
      </div>

      {/* Contador */}
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <LayoutGrid className="h-4 w-4" />
        <span>
          {searchTerm
            ? `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}`
            : `${totalElements} cubículo${totalElements !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Grid de cubículos */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="text-sm">Cargando cubículos...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent>
            <div className="py-10 text-center text-red-600 text-sm">
              Error al cargar cubículos. Intenta de nuevo.
            </div>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent>
            <div className="py-14 text-center space-y-3">
              <LayoutGrid className="mx-auto h-10 w-10 text-gray-300" />
              <p className="font-medium text-secondary">
                {searchTerm ? "Sin resultados" : "Sin cubículos"}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchTerm
                  ? "Intenta con otra búsqueda"
                  : "Agrega el primer cubículo a esta locación."}
              </p>
              {!searchTerm && (
                <Button onClick={() => createQuickMutation.mutate()} className="mt-2" disabled={createQuickMutation.isPending}>
                  <Plus className="h-4 w-4 mr-2" />
                  {createQuickMutation.isPending ? "Creando..." : "Crear Cubículo"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Card
              key={c.id}
              className={`overflow-hidden ${!c.isActive ? "opacity-60" : ""}`}
            >
              {/* Imagen del cubículo */}
              {c.imageUrl ? (
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${c.imageUrl})` }}
                >
                  <div className="h-full w-full bg-linear-to-t from-black/60 to-transparent p-3 flex items-end justify-between">
                    <span className="text-white font-semibold text-sm drop-shadow truncate max-w-[70%]">
                      {c.nombre}
                    </span>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-surface-3 text-secondary"
                    }`}>
                      {c.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-14 bg-surface-2 flex items-center justify-between px-4">
                  <span className="font-semibold text-default text-sm truncate">{c.nombre}</span>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                    c.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-surface-3 text-secondary"
                  }`}>
                    {c.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              )}

              <CardContent className="pt-3 space-y-3">
                {/* Nombre (cuando hay imagen, ya se muestra arriba) */}
                {!c.imageUrl && (
                  <p className="text-xs text-muted-foreground">Sin imagen de referencia</p>
                )}

                {c.descripcion && (
                  <p className="text-sm text-secondary line-clamp-2">{c.descripcion}</p>
                )}

                <div className="flex items-center gap-1 text-default font-medium text-sm">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  ${c.precio} / hr
                </div>

                {/* Características */}
                {c.caracteristicas.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {c.caracteristicas.slice(0, 3).map((car) => (
                      <span
                        key={car.id}
                        className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                      >
                        {formatCaracteristica(car.nombre)}
                      </span>
                    ))}
                    {c.caracteristicas.length > 3 && (
                      <span className="text-xs bg-surface-2 text-secondary px-2 py-0.5 rounded-full">
                        +{c.caracteristicas.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setEditingCubiculo(c)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant={c.isActive ? "danger" : "primary"}
                    className="flex-1"
                    onClick={() => toggleMutation.mutate({ id: c.id, isActive: c.isActive })}
                    disabled={toggleMutation.isPending}
                  >
                    {c.isActive ? (
                      <><PowerOff className="h-3.5 w-3.5 mr-1" />Desactivar</>
                    ) : (
                      <><Power className="h-3.5 w-3.5 mr-1" />Activar</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Paginación — solo cuando no hay búsqueda activa y hay más de 1 página */}
      {!searchTerm && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-secondary">
            Mostrando {numberOfElements} de {totalElements} cubículos
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1.5 border border-default rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-app"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5 text-sm text-secondary">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1.5 border border-default rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-app"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal crear */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nuevo Cubículo" size="lg">
        <CubiculoForm
          locationId={location.id}
          caracteristicas={caracteristicas}
          onSuccess={() => {
            setIsCreateOpen(false);
            queryClient.invalidateQueries({ queryKey: ["cubiculos", location.id] });
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Modal editar */}
      <Modal isOpen={!!editingCubiculo} onClose={() => setEditingCubiculo(null)} title="Editar Cubículo" size="lg">
        {editingCubiculo && (
          <CubiculoForm
            cubiculo={editingCubiculo}
            caracteristicas={caracteristicas}
            onSuccess={() => {
              setEditingCubiculo(null);
              queryClient.invalidateQueries({ queryKey: ["cubiculos", location.id] });
            }}
            onCancel={() => setEditingCubiculo(null)}
          />
        )}
      </Modal>
    </div>
  );
};

// ─── Página principal ────────────────────────────────────────────────────────
export const RoomsPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationResponseDTO | null>(null);

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ["locations"],
    queryFn: async (): Promise<LocationResponseDTO[]> =>
      authAPI.locations.getAll().then((r) => r.data.content),
  });

  const { data: caracteristicas = [] } = useQuery<CaracteristicaDTO[]>({
    queryKey: ["caracteristicas"],
    queryFn: () => authAPI.caracteristicas.getAll().then((r) => r.data),
  });

  const locations: LocationResponseDTO[] = locationsData ?? [];

  if (selectedLocation) {
    return (
      <CubiculosPanel
        location={selectedLocation}
        caracteristicas={caracteristicas}
        onBack={() => setSelectedLocation(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Locaciones"
        description="Selecciona una locación para gestionar sus cubículos."
      />

      {isLoadingLocations ? (
        <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="text-sm">Cargando locaciones...</span>
        </div>
      ) : locations.length === 0 ? (
        <Card>
          <CardContent>
            <div className="py-16 text-center space-y-2">
              <MapPin className="mx-auto h-10 w-10 text-gray-300" />
              <p className="font-medium text-secondary">Sin locaciones registradas</p>
              <p className="text-sm text-muted-foreground">
                Crea una locación desde el menú Locaciones para empezar.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {locations.filter((l) => l.active).length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Activas</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {locations.filter((l) => l.active).map((loc) => (
                  <LocationCard key={loc.id} location={loc} onClick={() => setSelectedLocation(loc)} />
                ))}
              </div>
            </div>
          )}
          {locations.filter((l) => !l.active).length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Inactivas</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {locations.filter((l) => !l.active).map((loc) => (
                  <LocationCard key={loc.id} location={loc} onClick={() => setSelectedLocation(loc)} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Card de locación ────────────────────────────────────────────────────────
interface LocationCardProps {
  location: LocationResponseDTO;
  onClick: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onClick }) => (
  <Card
    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
    onClick={onClick}
  >
    <div
      className="h-44 bg-cover bg-center"
      style={{ backgroundImage: `url(${location.imageUrl || DEFAULT_IMAGE})` }}
    >
      <div className="h-full w-full bg-linear-to-t from-black/70 via-black/20 to-transparent p-4 flex flex-col justify-between">
        <div className="flex justify-end">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
            location.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {location.active ? "Activa" : "Inactiva"}
          </span>
        </div>
        <div className="text-white">
          <div className="text-xl font-bold drop-shadow">{location.name}</div>
          <div className="text-sm opacity-90 flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{location.address}</span>
          </div>
        </div>
      </div>
    </div>

    <CardHeader>
      <CardTitle>Acerca de la locación</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {location.description ? (
        <p className="text-sm text-secondary line-clamp-2">{location.description}</p>
      ) : (
        <p className="text-sm text-muted-foreground italic">Sin descripción</p>
      )}
      <Button className="w-full group-hover:bg-blue-700 transition-colors">
        <LayoutGrid className="h-4 w-4 mr-2" />
        Gestionar Cubículos
      </Button>
    </CardContent>
  </Card>
);
