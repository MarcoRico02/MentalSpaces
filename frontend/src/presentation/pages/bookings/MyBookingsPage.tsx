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
  Skeleton,
  Tabs,
} from "../../components/ui";

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

  const all: BookingCard[] = [
    {
      id: "BK-1201",
      room: "Consultorio 3",
      date: "2026-02-10",
      time: "10:00 - 11:00",
      location: "Sede Roma",
      status: "Upcoming",
      price: "$450.00",
    },
    {
      id: "BK-1191",
      room: "Consultorio 1",
      date: "2026-01-20",
      time: "18:00 - 19:00",
      location: "Sede Condesa",
      status: "Past",
      price: "$450.00",
    },
    {
      id: "BK-1170",
      room: "Consultorio 2",
      date: "2026-01-10",
      time: "12:00 - 13:00",
      location: "Sede Roma",
      status: "Cancelled",
      price: "$450.00",
      cancellationReason: "No pude asistir",
    },
    {
      id: "BK-1210",
      room: "Consultorio 4",
      date: "2026-02-12",
      time: "09:00 - 10:00",
      location: "Sede Roma",
      status: "Pending",
      price: "$450.00",
    },
  ];

  const filtered = all.filter((b) => b.status === tab);

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
        description="Gestiona tus reservas por estado (maqueta)."
        right={
          <Button variant="secondary">
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

      {/* Skeleton demo */}
      <div className="hidden">
        <Card>
          <CardContent>
            <Skeleton lines={3} />
          </CardContent>
        </Card>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin reservas"
          description="No hay reservas en esta sección."
        />
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
                    <Button variant="danger" onClick={() => setCancelOpen(true)}>
                      Cancelar
                    </Button>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  Reglas de cancelación: validación por configuración del sistema (demo)
                  · Refetch cada 5s (demo)
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
        onOpenChange={setCancelOpen}
        title="Cancelar reserva"
        description="Confirmación de cancelación (maqueta)."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setCancelOpen(false)}>
              Volver
            </Button>
            <Button variant="danger">
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
            ¿Seguro que deseas cancelar? Esta acción puede tener penalizaciones.
          </div>
        </div>
      </Dialog>
    </div>
  );
};
