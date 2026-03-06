import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  DollarSign,
  Star,
  X,
  ChevronDown,
  ChevronUp,
  Building2,
  Clock,
  Wifi,
  Wind,
  Armchair,
  Monitor,
  LayoutGrid,
  Layers,
} from "lucide-react";
import { authAPI } from "../../../core/infraestructura/api/api";
import type {
  CubiculoResponse,
  LocationResponseDTO,
  CaracteristicaNombre,
  CaracteristicaDTO,
} from "../../../core/dominio/tipos/api";

// ─── Tipos internos ─────────────────────────────────────────────────────────

interface FiltrosBusqueda {
  precioMin: string;
  precioMax: string;
  caracteristicasSeleccionadas: number[];
  soloDisponibles: boolean;
}

interface ResultadoLocation {
  location: LocationResponseDTO;
  cubiculos: CubiculoResponse[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCaracteristica(nombre: CaracteristicaNombre): string {
  return nombre
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function iconoCaracteristica(nombre: CaracteristicaNombre) {
  if (nombre.includes("INTERNET") || nombre.includes("CONEXION"))
    return <Wifi className="h-3 w-3" />;
  if (nombre.includes("CLIMATIZ") || nombre.includes("REFRIGER") || nombre.includes("VENTILACION"))
    return <Wind className="h-3 w-3" />;
  if (nombre.includes("SILLON") || nombre.includes("SOFA"))
    return <Armchair className="h-3 w-3" />;
  if (nombre.includes("PIZARRON") || nombre.includes("ESCRITORIO"))
    return <Monitor className="h-3 w-3" />;
  return <Star className="h-3 w-3" />;
}

// ─── Componente principal ────────────────────────────────────────────────────

export const BuscarCubiculosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasBuscado, setHasBuscado] = useState(false);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({
    precioMin: "",
    precioMax: "",
    caracteristicasSeleccionadas: [],
    soloDisponibles: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const resultadosRef = useRef<HTMLDivElement>(null);

  // ── Queries ──────────────────────────────────────────────────────────────

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ["locations-publicas"],
    queryFn: () =>
      authAPI.locations.getAll({ size: 100 }).then((res) => res.data),
  });

  const { data: caracteristicas = [] } = useQuery<CaracteristicaDTO[]>({
    queryKey: ["caracteristicas"],
    queryFn: () => authAPI.caracteristicas.getAll().then((res) => res.data),
  });

  const locations: LocationResponseDTO[] =
    locationsData?.content?.filter((l) => l.active) ?? [];

  // Cubículos de TODAS las locations activas (solo cuando se activa la búsqueda)
  const {
    data: todosCubiculosMap,
    isLoading: isLoadingCubiculos,
    isFetching,
  } = useQuery({
    queryKey: ["cubiculos-busqueda", locations.map((l) => l.id)],
    queryFn: async () => {
      if (locations.length === 0) return new Map<number, CubiculoResponse[]>();
      const resultados = await Promise.all(
        locations.map((loc) =>
          authAPI.cubiculos
            .getActiveByLocation(loc.id, { size: 100 })
            .then((res) => ({ locationId: loc.id, cubiculos: res.data.content ?? [] }))
            .catch(() => ({ locationId: loc.id, cubiculos: [] })),
        ),
      );
      const mapa = new Map<number, CubiculoResponse[]>();
      resultados.forEach(({ locationId, cubiculos }) =>
        mapa.set(locationId, cubiculos),
      );
      return mapa;
    },
    enabled: hasBuscado || mostrarTodos,
  });

  // ── Lógica de filtrado ────────────────────────────────────────────────────

  const resultados: ResultadoLocation[] = React.useMemo(() => {
    if (!todosCubiculosMap || locations.length === 0) return [];

    const precioMin = filtros.precioMin ? parseFloat(filtros.precioMin) : null;
    const precioMax = filtros.precioMax ? parseFloat(filtros.precioMax) : null;
    const busquedaLower = searchTerm.toLowerCase().trim();

    const salida: ResultadoLocation[] = [];

    for (const location of locations) {
      let cubiculos = todosCubiculosMap.get(location.id) ?? [];

      // Filtrar por texto (nombre, descripción, nombre de location)
      if (busquedaLower && hasBuscado) {
        cubiculos = cubiculos.filter(
          (c) =>
            c.nombre.toLowerCase().includes(busquedaLower) ||
            c.descripcion.toLowerCase().includes(busquedaLower) ||
            location.name.toLowerCase().includes(busquedaLower) ||
            location.address.toLowerCase().includes(busquedaLower),
        );
      }

      // Filtrar por precio mínimo
      if (precioMin !== null) {
        cubiculos = cubiculos.filter((c) => c.precio >= precioMin);
      }

      // Filtrar por precio máximo
      if (precioMax !== null) {
        cubiculos = cubiculos.filter((c) => c.precio <= precioMax);
      }

      // Filtrar por características
      if (filtros.caracteristicasSeleccionadas.length > 0) {
        cubiculos = cubiculos.filter((c) =>
          filtros.caracteristicasSeleccionadas.every((id) =>
            c.caracteristicas.some((car) => car.id === id),
          ),
        );
      }

      if (cubiculos.length > 0) {
        salida.push({ location, cubiculos });
      }
    }

    return salida;
  }, [todosCubiculosMap, locations, searchTerm, filtros, hasBuscado]);

  // ── Acciones ──────────────────────────────────────────────────────────────

  const handleBuscar = () => {
    setHasBuscado(true);
    setMostrarTodos(false);
    setTimeout(() => {
      resultadosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleMostrarTodos = () => {
    setMostrarTodos(true);
    setHasBuscado(false);
    setSearchTerm("");
    setFiltros({
      precioMin: "",
      precioMax: "",
      caracteristicasSeleccionadas: [],
      soloDisponibles: false,
    });
    setTimeout(() => {
      resultadosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleLimpiar = () => {
    setHasBuscado(false);
    setMostrarTodos(false);
    setSearchTerm("");
    setFiltros({
      precioMin: "",
      precioMax: "",
      caracteristicasSeleccionadas: [],
      soloDisponibles: false,
    });
  };

  const toggleCaracteristica = (id: number) => {
    setFiltros((prev) => ({
      ...prev,
      caracteristicasSeleccionadas: prev.caracteristicasSeleccionadas.includes(id)
        ? prev.caracteristicasSeleccionadas.filter((x) => x !== id)
        : [...prev.caracteristicasSeleccionadas, id],
    }));
  };

  const hayFiltrosActivos =
    filtros.precioMin !== "" ||
    filtros.precioMax !== "" ||
    filtros.caracteristicasSeleccionadas.length > 0;

  const enModoResultados = hasBuscado || mostrarTodos;
  const isLoading = isLoadingCubiculos || isFetching;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-app">

      {/* ── SECCIÓN DE BÚSQUEDA ─────────────────────────────────────────── */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          enModoResultados
            ? "py-4 bg-surface shadow-md border-b border-default sticky top-0 z-30"
            : "min-h-[70vh] flex flex-col items-center justify-center px-4 py-16"
        }`}
      >
        {/* Título — solo visible en modo inicial */}
        {!enModoResultados && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-default mb-2">
              Encuentra tu cubículo ideal
            </h1>
            <p className="text-secondary text-base max-w-md">
              Busca el espacio perfecto para tus sesiones entre todas las
              locaciones disponibles
            </p>
          </div>
        )}

        {/* Barra de búsqueda */}
        <div
          className={`transition-all duration-700 ${
            enModoResultados ? "max-w-4xl w-full mx-auto px-4" : "w-full max-w-2xl"
          }`}
        >
          {/* Input principal */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar por nombre, dirección, características..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                className="block w-full pl-10 pr-10 py-3 border border-default rounded-xl bg-surface text-default placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
              />
              {(searchTerm || enModoResultados) && (
                <button
                  onClick={handleLimpiar}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-default"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Botón filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors shadow-sm ${
                mostrarFiltros || hayFiltrosActivos
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-surface border-default text-secondary hover:bg-app"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
              {hayFiltrosActivos && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white text-blue-600 text-xs font-bold">
                  {filtros.caracteristicasSeleccionadas.length +
                    (filtros.precioMin ? 1 : 0) +
                    (filtros.precioMax ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Botón buscar */}
            <button
              onClick={handleBuscar}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </div>

          {/* Panel de filtros */}
          {mostrarFiltros && (
            <div className="mt-3 p-4 bg-surface border border-default rounded-xl shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Precio mínimo */}
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">
                    Precio mínimo ($/hr)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={filtros.precioMin}
                      onChange={(e) =>
                        setFiltros((f) => ({ ...f, precioMin: e.target.value }))
                      }
                      className="block w-full pl-7 pr-3 py-2 border border-default rounded-lg bg-app text-default text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Precio máximo */}
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">
                    Precio máximo ($/hr)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      min="0"
                      placeholder="Sin límite"
                      value={filtros.precioMax}
                      onChange={(e) =>
                        setFiltros((f) => ({ ...f, precioMax: e.target.value }))
                      }
                      className="block w-full pl-7 pr-3 py-2 border border-default rounded-lg bg-app text-default text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Características */}
              <div>
                <label className="block text-xs font-medium text-secondary mb-2">
                  Características requeridas
                </label>
                <div className="flex flex-wrap gap-2">
                  {caracteristicas.map((car) => {
                    const seleccionada = filtros.caracteristicasSeleccionadas.includes(car.id);
                    return (
                      <button
                        key={car.id}
                        onClick={() => toggleCaracteristica(car.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          seleccionada
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-app text-secondary border-default hover:border-blue-400 hover:text-blue-600"
                        }`}
                      >
                        {iconoCaracteristica(car.nombre)}
                        {formatCaracteristica(car.nombre)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Acciones de filtros */}
              {hayFiltrosActivos && (
                <div className="mt-3 pt-3 border-t border-default flex justify-end">
                  <button
                    onClick={() =>
                      setFiltros({
                        precioMin: "",
                        precioMax: "",
                        caracteristicasSeleccionadas: [],
                        soloDisponibles: false,
                      })
                    }
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Botón mostrar todos — solo en modo inicial */}
          {!enModoResultados && (
            <div className="mt-4 text-center">
              <button
                onClick={handleMostrarTodos}
                disabled={isLoadingLocations}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-default bg-surface text-secondary text-sm font-medium hover:bg-app hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm disabled:opacity-50"
              >
                <LayoutGrid className="h-4 w-4" />
                Mostrar todos los cubículos disponibles
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── RESULTADOS ──────────────────────────────────────────────────────── */}
      {enModoResultados && (
        <div ref={resultadosRef} className="max-w-6xl mx-auto px-4 py-6">

          {/* Encabezado de resultados */}
          <div className="flex items-center justify-between mb-6">
            <div>
              {isLoading ? (
                <p className="text-secondary text-sm">Buscando cubículos…</p>
              ) : (
                <p className="text-secondary text-sm">
                  {mostrarTodos ? (
                    <>
                      <span className="font-semibold text-default">
                        {resultados.reduce((acc, r) => acc + r.cubiculos.length, 0)}
                      </span>{" "}
                      cubículos disponibles en{" "}
                      <span className="font-semibold text-default">
                        {resultados.length}
                      </span>{" "}
                      locaciones
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-default">
                        {resultados.reduce((acc, r) => acc + r.cubiculos.length, 0)}
                      </span>{" "}
                      resultados para{" "}
                      {searchTerm && (
                        <>
                          "<span className="italic">{searchTerm}</span>"
                        </>
                      )}
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Botón mostrar todos (visible en modo búsqueda) */}
            {hasBuscado && !mostrarTodos && (
              <button
                onClick={handleMostrarTodos}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                <Layers className="h-3.5 w-3.5" />
                Ver todos
              </button>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="text-secondary text-sm">Cargando cubículos…</p>
            </div>
          )}

          {/* Sin resultados */}
          {!isLoading && resultados.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-2 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-default mb-1">
                Sin resultados
              </h3>
              <p className="text-secondary text-sm mb-4">
                No encontramos cubículos que coincidan con tu búsqueda.
              </p>
              <button
                onClick={handleMostrarTodos}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
              >
                <LayoutGrid className="h-4 w-4" />
                Ver todos los cubículos
              </button>
            </div>
          )}

          {/* Lista por locación */}
          {!isLoading &&
            resultados.map(({ location, cubiculos }) => (
              <LocationSection
                key={location.id}
                location={location}
                cubiculos={cubiculos}
              />
            ))}
        </div>
      )}
    </div>
  );
};

// ─── Sección de Locación ─────────────────────────────────────────────────────

interface LocationSectionProps {
  location: LocationResponseDTO;
  cubiculos: CubiculoResponse[];
}

const LocationSection: React.FC<LocationSectionProps> = ({
  location,
  cubiculos,
}) => {
  const [expandido, setExpandido] = useState(true);

  return (
    <section className="mb-8">
      {/* Encabezado de la locación */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface border border-default shadow-sm hover:shadow-md transition-shadow mb-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-default text-sm">{location.name}</p>
            <p className="text-xs text-secondary">{location.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium px-2.5 py-1 rounded-full">
            {cubiculos.length} cubículo{cubiculos.length !== 1 ? "s" : ""}
          </span>
          {expandido ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Grid de cubículos */}
      {expandido && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cubiculos.map((cubiculo) => (
            <CubiculoCard key={cubiculo.id} cubiculo={cubiculo} />
          ))}
        </div>
      )}
    </section>
  );
};

// ─── Tarjeta de Cubículo ──────────────────────────────────────────────────────

interface CubiculoCardProps {
  cubiculo: CubiculoResponse;
}

const CubiculoCard: React.FC<CubiculoCardProps> = ({ cubiculo }) => {
  const [verMas, setVerMas] = useState(false);
  const caracteristicasVisibles = verMas
    ? cubiculo.caracteristicas
    : cubiculo.caracteristicas.slice(0, 4);

  return (
    <div className="bg-surface rounded-xl border border-default shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Imagen */}
      {cubiculo.imageUrl ? (
        <div className="h-44 w-full overflow-hidden bg-surface-3">
          <img
            src={cubiculo.imageUrl}
            alt={cubiculo.nombre}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-44 w-full flex items-center justify-center bg-surface-2">
          <Building2 className="h-12 w-12 text-muted-foreground opacity-40" />
        </div>
      )}

      {/* Cuerpo */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="font-semibold text-default text-sm leading-tight line-clamp-2">
            {cubiculo.nombre}
          </h3>
          <div className="flex items-center gap-0.5 text-green-600 flex-shrink-0">
            <DollarSign className="h-4 w-4" />
            <span className="font-bold text-sm">{cubiculo.precio}</span>
            <span className="text-xs text-secondary">/hr</span>
          </div>
        </div>

        {cubiculo.descripcion && (
          <p className="text-xs text-secondary mb-3 line-clamp-2">
            {cubiculo.descripcion}
          </p>
        )}

        {/* Características */}
        {cubiculo.caracteristicas.length > 0 && (
          <div className="mt-auto">
            <div className="flex flex-wrap gap-1 mb-1">
              {caracteristicasVisibles.map((car) => (
                <span
                  key={car.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800"
                >
                  {iconoCaracteristica(car.nombre)}
                  {formatCaracteristica(car.nombre)}
                </span>
              ))}
            </div>
            {cubiculo.caracteristicas.length > 4 && (
              <button
                onClick={() => setVerMas(!verMas)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1"
              >
                {verMas
                  ? "Ver menos"
                  : `+${cubiculo.caracteristicas.length - 4} más`}
              </button>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="mt-4 pt-3 border-t border-default flex gap-2">
          <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors">
            <Clock className="h-3.5 w-3.5" />
            Ver disponibilidad
          </button>
          <button className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-default text-secondary hover:bg-app text-xs font-medium transition-colors">
            Detalles
          </button>
        </div>
      </div>
    </div>
  );
};


