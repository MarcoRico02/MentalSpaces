import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CalendarDays,
  DoorOpen,
  RotateCcw,
  User,
  Users,
} from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import {
  Button,
  Card,
  CardContent,
  CheckboxSelect,
  Skeleton,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "../../components/ui";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { useAllCubiculosActivosQuery } from "../../../core/aplicacion/hooks/useAllCubiculosActivosQuery";
import { useReservasCalendarioQuery } from "../../../core/aplicacion/hooks/useReservasCalendarioQuery";
import { authAPI } from "../../../core/infraestructura/api/api";
import type { ReservaDTO, UsuarioInfoDTO } from "../../../core/dominio/tipos/api";

function formatHora(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatFechaCabecera(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrecio(precio: number): string {
  return `$${precio.toFixed(2)} MXN`;
}

function getDiaKey(iso: string): string {
  return iso.slice(0, 10);
}

export function BookingsList() {
  const { isAdmin, user } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const [fechaDesde, setFechaDesde] = useState(today);
  const [fechaHasta, setFechaHasta] = useState(today);
  const [selectedUsuarios, setSelectedUsuarios] = useState<number[]>([]);
  const [selectedCubiculos, setSelectedCubiculos] = useState<number[]>([]);

  const { data: psicologos = [] } = useQuery({
    queryKey: ["usuarios", "psicologos"],
    queryFn: async (): Promise<UsuarioInfoDTO[]> => {
      const res = await authAPI.usuarios.getPsicologos();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: cubiculos = [] } = useAllCubiculosActivosQuery();

  const {
    data: reservas = [],
    isLoading,
    isError,
  } = useReservasCalendarioQuery({
    fechaInicio: `${fechaDesde}T00:00:00`,
    fechaFin: `${fechaHasta}T23:59:59`,
    cubiculoIds: selectedCubiculos.length > 0 ? selectedCubiculos : undefined,
    usuarioIds: selectedUsuarios.length > 0 ? selectedUsuarios : undefined,
  });

  const psicologosOptions = useMemo(
    () => psicologos.map((u) => ({ value: u.id, label: u.fullName })),
    [psicologos],
  );

  const cubiculosOptions = useMemo(
    () => cubiculos.map((c) => ({ value: c.id, label: c.nombre })),
    [cubiculos],
  );

  const handleLimpiar = () => {
    setSelectedUsuarios([]);
    setSelectedCubiculos([]);
  };

  const reservasAgrupadas = useMemo(() => {
    const groups: Record<string, ReservaDTO[]> = {};
    for (const r of reservas) {
      const dia = getDiaKey(r.inicio);
      if (!groups[dia]) groups[dia] = [];
      groups[dia].push(r);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [reservas]);

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-app pb-4">
        <PageHeader
          title="Lista de reservas"
          description="Filtra y consulta reservas por usuario, cubículo y rango de fechas."
        />

        <div className="flex flex-wrap items-end gap-4 mt-4">
          <div className="w-48">
            <label className="block text-sm font-medium text-default mb-1">
              Fecha desde
            </label>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-secondary shrink-0" />
              <Input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </div>
          </div>

          <div className="w-48">
            <label className="block text-sm font-medium text-default mb-1">
              Fecha hasta
            </label>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-secondary shrink-0" />
              <Input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </div>
          </div>

          <div className="w-56">
            <label className="block text-sm font-medium text-default mb-1">
              <Users className="h-4 w-4 inline mr-1.5 text-secondary" />
              Usuarios
            </label>
            <CheckboxSelect<number>
              label="Seleccionar usuarios"
              options={psicologosOptions}
              selected={selectedUsuarios}
              onChange={setSelectedUsuarios}
            />
          </div>

          <div className="w-56">
            <label className="block text-sm font-medium text-default mb-1">
              <DoorOpen className="h-4 w-4 inline mr-1.5 text-secondary" />
              Cubículos
            </label>
            <CheckboxSelect<number>
              label="Seleccionar cubículos"
              options={cubiculosOptions}
              selected={selectedCubiculos}
              onChange={setSelectedCubiculos}
            />
          </div>

          <div>
            <Button variant="secondary" onClick={handleLimpiar}>
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Limpiar filtros
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <Skeleton lines={5} />
            </div>
          ) : isError ? (
            <EmptyState
              title="Error al cargar reservas"
              description="Ocurrió un error al obtener los datos. Intenta de nuevo más tarde."
            />
          ) : reservas.length === 0 ? (
            <EmptyState
              title="No se encontraron reservas"
              description="Intenta ajustar los filtros para ver más resultados."
            />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Hora</TH>
                  <TH>Cubículo</TH>
                  <TH>Usuario</TH>
                  <TH>Precio</TH>
                </TR>
              </THead>
              <TBody>
                {reservasAgrupadas.map(([diaKey, reservasDia]) => (
                  <FragmentGroup key={diaKey} diaKey={diaKey} reservas={reservasDia} isAdmin={isAdmin()} currentUserId={user?.usuarioInfoDTO.id ?? 0} />
                ))}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FragmentGroup({
  diaKey,
  reservas,
  isAdmin,
  currentUserId,
}: {
  diaKey: string;
  reservas: ReservaDTO[];
  isAdmin: boolean;
  currentUserId: number;
}) {
  return (
    <>
      <TR className="bg-surface-2/80">
        <TD colSpan={4} className="px-4 py-2 text-sm font-semibold text-default capitalize">
          {formatFechaCabecera(diaKey)}
        </TD>
      </TR>
      {reservas.map((r) => {
        const esPropia = r.psicologoId === currentUserId;
        const puedeVerDetalle = isAdmin || esPropia;
        return (
          <TR key={r.id}>
            <TD className="whitespace-nowrap">
              {formatHora(r.inicio)} - {formatHora(r.fin)}
            </TD>
            <TD>{r.cubiculoNombre}</TD>
            <TD>
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4 text-secondary shrink-0" />
                {puedeVerDetalle ? r.psicologoNombreCompleto : "Usuario oculto"}
              </span>
            </TD>
            <TD className="whitespace-nowrap">
              {puedeVerDetalle ? (
                <span className="inline-flex items-center gap-1.5">
                  {!r.pagado && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
                  )}
                  {formatPrecio(r.precio)}
                </span>
              ) : (
                <span className="text-secondary">—</span>
              )}
            </TD>
          </TR>
        );
      })}
    </>
  );
}
