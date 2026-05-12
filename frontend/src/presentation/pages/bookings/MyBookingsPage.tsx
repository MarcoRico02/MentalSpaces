import React, { useState } from "react";
import { RefreshCcw, XCircle } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  Tabs,
} from "../../components/ui";
import { useCancelarReservaMutation } from "../../../core/aplicacion/hooks/useCancelarReservaMutation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../../../core/infraestructura/api/api";

type BookingStatus = "Upcoming" | "Past" | "Cancelled" | "Pending";

type BookingCard = {
  id: string;
  room: string;
  date: string;
  time: string;
  location: string;
  status: BookingStatus;
  price: string;
  cancellationReason?: string;
};

export const MyBookingsPage: React.FC = () => {
  const [tab, setTab] = useState<BookingStatus>("Upcoming");
  const [detailOpen, setDetailOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingCard | null>(null);
  const queryClient = useQueryClient();

  const { data: reservasData, isLoading, error } = useQuery({
    queryKey: ["reservas","me"],
    queryFn: async () => {
      const res = await authAPI.reservas.getAll();
      return res.data as any[];
    },
    staleTime: 1000 * 60 * 1,
  });

  const cancelarMutation = useCancelarReservaMutation();

  const bookings: BookingCard[] = (reservasData ?? []).map((r: any) => ({
    id: `BK-${r.id}`,
    room: r.cubiculoNombre ?? "-",
    date: r.inicio ? new Date(r.inicio).toISOString().split("T")[0] : "-",
    time: r.inicio && r.fin ? `${new Date(r.inicio).toTimeString().slice(0,5)} - ${new Date(r.fin).toTimeString().slice(0,5)}` : "-",
    location: r.cubiculoNombre ? "" : "", // si tu DTO incluye location, mapear aquí
    status: r.estadoReserva ? (r.estadoReserva === "PENDIENTE" ? "Pending" : r.estadoReserva === "CANCELADA" ? "Cancelled" : r.estadoReserva === "CONFIRMADA" ? "Upcoming" : "Past") : "Pending",
    price: "$0.00",
    cancellationReason: undefined,
  }));

  const filtered = bookings.filter((b) => b.status === tab);

  const badgeVariant = (s: BookingStatus) => {
    if (s === "Upcoming") return "info";
    if (s === "Past") return "success";
    if (s === "Cancelled") return "danger";
    return "warning";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Reservas"
        description="Gestiona tus reservas por estado."
        right={
          <Button variant="secondary" onClick={() => queryClient.invalidateQueries({queryKey:["reservas","me"]})}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refrescar
          </Button>
        }
      />

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as BookingStatus)}
        options={[
          { value: "Upcoming", label: "Próximas" },
          { value: "Past", label: "Pasadas" },
          { value: "Cancelled", label: "Canceladas" },
          { value: "Pending", label: "Pendientes" },
        ]}
      />

      {isLoading ? (
        <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="text-sm">Cargando reservas...</span>
        </div>
      ) : error ? (
        <div className="py-10 text-center text-red-600 text-sm">Error al cargar reservas. Intenta de nuevo.</div>
      ) : (filtered.length === 0 ? (
        <EmptyState title="Sin reservas" description="No hay reservas en esta sección." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <Card key={b.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-3">
                  <span>{b.room}</span>
                  <Badge variant={badgeVariant(b.status)}>{b.status}</Badge>
                </CardTitle>
                <p className="text-sm text-secondary mt-1">
                  {b.date} · {b.time} · {b.location}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-secondary">Precio total</div>
                  <div className="font-semibold text-default">{b.price}</div>
                </div>

                {b.status === "Cancelled" && b.cancellationReason && (
                  <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                    Motivo de cancelación: {b.cancellationReason}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => setDetailOpen(true)}>
                    Ver detalles
                  </Button>
                  {b.status === "Upcoming" && (
                    <Button
                      variant="danger"
                      onClick={() => {
                        setSelectedBooking(b);
                        setCancelOpen(true);
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  Reglas de cancelación: validación por configuración del sistema (demo)
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}

      <Dialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Detalle de la reserva"
        description="Modal expandido (maqueta)."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDetailOpen(false)}>
              Cerrar
            </Button>
            <Button variant="secondary">Descargar recibo</Button>
          </div>
        }
        maxWidthClassName="max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            ["Reserva", "BK-1201"],
            ["Sala", "Consultorio 3"],
            ["Ubicación", "Sede Roma"],
            ["Horario", "10:00 - 11:00"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md border border-default p-3">
              <div className="text-secondary">{k}</div>
              <div className="font-medium text-default">{v}</div>
            </div>
          ))}
          <div className="md:col-span-2 rounded-md border border-dashed border-default bg-app p-4 text-secondary">
            Aquí irían más detalles (terapeuta, estado, notas, etc.).
          </div>
        </div>
      </Dialog>

      <Dialog
        open={cancelOpen}
        onOpenChange={(open) => {
          setCancelOpen(open);
          if (!open) setSelectedBooking(null);
        }}
        title="Cancelar reserva"
        description="Confirmación de cancelación"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setCancelOpen(false)}>
              Volver
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!selectedBooking) return;
                try {
                  await cancelarMutation.mutateAsync(Number(selectedBooking.id.replace(/[^0-9]/g, "")));
                  // Refrescar lista real
                  queryClient.invalidateQueries({ queryKey: ["reservas", "me"] });
                  setCancelOpen(false);
                  setSelectedBooking(null);
                } catch (error) {
                  console.error("Error al cancelar reserva:", error);
                }
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Confirmar cancelación
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="rounded-md border border-default p-4 text-sm text-secondary">
            Validación de plazo mínimo · permisos del plan · mensajes de error (demo)
          </div>
          <div className="text-sm text-secondary">
            ¿Seguro que deseas cancelar la reserva {selectedBooking?.id}? Esta acción puede tener penalizaciones.
          </div>
        </div>
      </Dialog>
    </div>
  );
};