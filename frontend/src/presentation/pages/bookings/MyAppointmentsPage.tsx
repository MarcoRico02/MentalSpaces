import React, { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import {
  Badge,
  Card,
  CardContent,
  Skeleton,
  Tabs,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  type TabsOption,
} from "../../components/ui";
import { useReservasQuery } from "../../../core/aplicacion/hooks/useReservasQuery";
import type { EstadoReserva, FiltroTemporal } from "../../../core/dominio/tipos/api";

type TabValue = "ALL" | FiltroTemporal;

const TABS_OPTIONS: TabsOption[] = [
  { value: "ALL", label: "Todas" },
  { value: "FUTURA", label: "Futuras" },
  { value: "PASADA", label: "Pasadas" },
  { value: "CANCELADA", label: "Canceladas" },
];

const BADGE_VARIANT: Record<EstadoReserva, "success" | "warning" | "danger" | "info"> = {
  CONFIRMADA: "success",
  PENDIENTE: "warning",
  CANCELADA: "danger",
  RECHAZADO: "danger",
  FINALIZADA: "info",
};

const ESTADO_LABEL: Record<EstadoReserva, string> = {
  CONFIRMADA: "Confirmada",
  PENDIENTE: "Pendiente",
  CANCELADA: "Cancelada",
  RECHAZADO: "Rechazado",
  FINALIZADA: "Finalizada",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

export const MyAppointmentsPage: React.FC = () => {
  const [tab, setTab] = useState<TabValue>("ALL");

  const filtro: FiltroTemporal | undefined = tab === "ALL" ? undefined : tab;
  const { data: reservas, isLoading } = useReservasQuery(filtro);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Reservas"
        description="Gestiona tus reservas por estado."
        right={<CalendarCheck className="h-5 w-5 text-muted-foreground" />}
      />

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as TabValue)}
        options={TABS_OPTIONS}
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <Skeleton lines={5} />
            </div>
          ) : !reservas || reservas.length === 0 ? (
            <EmptyState title="No se encontraron reservas." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Concultorio</TH>
                    <TH>Inicio</TH>
                    <TH>Fin</TH>
                    <TH>Estado</TH>
                    <TH>Creada</TH>
                    <TH>Notas</TH>
                  </TR>
                </THead>
                <TBody>
                  {reservas.map((r, i) => (
                    <TR key={r.id ?? i}>
                      <TD className="font-medium">{r.cubiculoNombre}</TD>
                      <TD>{formatDate(r.inicio)}</TD>
                      <TD>{formatDate(r.fin)}</TD>
                      <TD>
                        <Badge variant={BADGE_VARIANT[r.estadoReserva]}>
                          {ESTADO_LABEL[r.estadoReserva]}
                        </Badge>
                      </TD>
                      <TD>{formatDate(r.createdAt)}</TD>
                      <TD className="max-w-xs truncate text-muted-foreground">
                        {r.notas ?? "—"}
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
