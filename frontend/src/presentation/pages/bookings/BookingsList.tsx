import { useMemo, useState } from "react";
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
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "../../components/ui";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";

interface ReservaMock {
  id: number;
  cubiculoId: number;
  cubiculoNombre: string;
  usuarioId: number;
  usuarioNombre: string;
  inicio: string;
  fin: string;
  precio: number;
  pagado: boolean;
}

const MOCK_RESERVAS: ReservaMock[] = [
  {
    id: 1,
    cubiculoId: 1,
    cubiculoNombre: "Consultorio A",
    usuarioId: 1,
    usuarioNombre: "María García López",
    inicio: "2026-05-25T09:00:00",
    fin: "2026-05-25T10:00:00",
    precio: 500,
    pagado: true,
  },
  {
    id: 2,
    cubiculoId: 2,
    cubiculoNombre: "Consultorio B",
    usuarioId: 2,
    usuarioNombre: "Juan Pérez Hernández",
    inicio: "2026-05-25T11:00:00",
    fin: "2026-05-25T12:30:00",
    precio: 750,
    pagado: false,
  },
  {
    id: 3,
    cubiculoId: 1,
    cubiculoNombre: "Consultorio A",
    usuarioId: 3,
    usuarioNombre: "Ana Martínez Ruiz",
    inicio: "2026-05-26T08:00:00",
    fin: "2026-05-26T09:00:00",
    precio: 500,
    pagado: true,
  },
  {
    id: 4,
    cubiculoId: 3,
    cubiculoNombre: "Consultorio C",
    usuarioId: 1,
    usuarioNombre: "María García López",
    inicio: "2026-05-26T14:00:00",
    fin: "2026-05-26T15:00:00",
    precio: 600,
    pagado: false,
  },
  {
    id: 5,
    cubiculoId: 2,
    cubiculoNombre: "Consultorio B",
    usuarioId: 4,
    usuarioNombre: "Carlos Sánchez Torres",
    inicio: "2026-05-27T10:00:00",
    fin: "2026-05-27T11:00:00",
    precio: 750,
    pagado: true,
  },
  {
    id: 6,
    cubiculoId: 1,
    cubiculoNombre: "Consultorio A",
    usuarioId: 2,
    usuarioNombre: "Juan Pérez Hernández",
    inicio: "2026-05-27T16:00:00",
    fin: "2026-05-27T17:30:00",
    precio: 500,
    pagado: true,
  },
  {
    id: 7,
    cubiculoId: 3,
    cubiculoNombre: "Consultorio C",
    usuarioId: 5,
    usuarioNombre: "Laura Jiménez Díaz",
    inicio: "2026-05-28T09:00:00",
    fin: "2026-05-28T10:00:00",
    precio: 600,
    pagado: false,
  },
  {
    id: 8,
    cubiculoId: 1,
    cubiculoNombre: "Consultorio A",
    usuarioId: 3,
    usuarioNombre: "Ana Martínez Ruiz",
    inicio: "2026-05-28T12:00:00",
    fin: "2026-05-28T13:00:00",
    precio: 500,
    pagado: true,
  },
  {
    id: 9,
    cubiculoId: 4,
    cubiculoNombre: "Consultorio D",
    usuarioId: 6,
    usuarioNombre: "Pedro Ramírez Ortiz",
    inicio: "2026-05-29T15:00:00",
    fin: "2026-05-29T16:00:00",
    precio: 800,
    pagado: true,
  },
  {
    id: 10,
    cubiculoId: 2,
    cubiculoNombre: "Consultorio B",
    usuarioId: 4,
    usuarioNombre: "Carlos Sánchez Torres",
    inicio: "2026-05-29T17:00:00",
    fin: "2026-05-29T18:00:00",
    precio: 750,
    pagado: false,
  },
];

const USUARIOS = [
  { value: 1, label: "María García López" },
  { value: 2, label: "Juan Pérez Hernández" },
  { value: 3, label: "Ana Martínez Ruiz" },
  { value: 4, label: "Carlos Sánchez Torres" },
  { value: 5, label: "Laura Jiménez Díaz" },
  { value: 6, label: "Pedro Ramírez Ortiz" },
];

const CUBICULOS = [
  { value: 1, label: "Consultorio A" },
  { value: 2, label: "Consultorio B" },
  { value: 3, label: "Consultorio C" },
  { value: 4, label: "Consultorio D" },
];

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
  const { isAdmin } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const [fechaDesde, setFechaDesde] = useState(today);
  const [fechaHasta, setFechaHasta] = useState(today);
  const [selectedUsuarios, setSelectedUsuarios] = useState<number[]>([]);
  const [selectedCubiculos, setSelectedCubiculos] = useState<number[]>([]);

  const handleLimpiar = () => {
    setSelectedUsuarios([]);
    setSelectedCubiculos([]);
  };

  const reservasFiltradas = useMemo(() => {
    let result = [...MOCK_RESERVAS];

    if (fechaDesde) {
      result = result.filter((r) => getDiaKey(r.inicio) >= fechaDesde);
    }
    if (fechaHasta) {
      result = result.filter((r) => getDiaKey(r.inicio) <= fechaHasta);
    }
    if (selectedUsuarios.length > 0) {
      result = result.filter((r) => selectedUsuarios.includes(r.usuarioId));
    }
    if (selectedCubiculos.length > 0) {
      result = result.filter((r) => selectedCubiculos.includes(r.cubiculoId));
    }

    result.sort((a, b) => a.inicio.localeCompare(b.inicio));

    return result;
  }, [fechaDesde, fechaHasta, selectedUsuarios, selectedCubiculos]);

  const reservasAgrupadas = useMemo(() => {
    const groups: Record<string, ReservaMock[]> = {};
    for (const r of reservasFiltradas) {
      const dia = getDiaKey(r.inicio);
      if (!groups[dia]) groups[dia] = [];
      groups[dia].push(r);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [reservasFiltradas]);

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
              options={USUARIOS}
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
              options={CUBICULOS}
              selected={selectedCubiculos}
              onChange={setSelectedCubiculos}
              panelClassName="w-56"
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
          {reservasFiltradas.length === 0 ? (
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
                {reservasAgrupadas.map(([diaKey, reservas]) => (
                  <FragmentGroup key={diaKey} diaKey={diaKey} reservas={reservas} isAdmin={isAdmin()} />
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
}: {
  diaKey: string;
  reservas: ReservaMock[];
  isAdmin: boolean;
}) {
  return (
    <>
      <TR className="bg-surface-2/80">
        <TD colSpan={4} className="px-4 py-2 text-sm font-semibold text-default capitalize">
          {formatFechaCabecera(diaKey)}
        </TD>
      </TR>
      {reservas.map((r) => (
        <TR key={r.id}>
          <TD className="whitespace-nowrap">
            {formatHora(r.inicio)} - {formatHora(r.fin)}
          </TD>
          <TD>{r.cubiculoNombre}</TD>
          <TD>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4 text-secondary shrink-0" />
              {isAdmin ? "Usuario oculto" : r.usuarioNombre}
            </span>
          </TD>
          <TD className="whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5">
              {!r.pagado && (
                <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
              )}
              {formatPrecio(r.precio)}
            </span>
          </TD>
        </TR>
      ))}
    </>
  );
}
