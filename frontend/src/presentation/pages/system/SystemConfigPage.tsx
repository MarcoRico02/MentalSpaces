
import React from "react";
import { Loader2 } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "../../components/ui";

type SystemConfigRow = {
  key: string;
  label: string;
  value: string;
  description: string;
};

export const SystemConfigPage: React.FC = () => {
  // Solo UI: simula estados
  const loading = false;
  const error = false;

  const configs: SystemConfigRow[] = [
    {
      key: "max_bookings_per_user",
      label: "Máximo de reservas por usuario",
      value: "10",
      description: "Limita la cantidad total de reservas activas por usuario.",
    },
    {
      key: "booking_advance_days",
      label: "Días de anticipación",
      value: "30",
      description: "Cuántos días antes se puede reservar.",
    },
    {
      key: "cancellation_hours",
      label: "Horas mínimas para cancelar",
      value: "24",
      description: "Plazo mínimo para permitir cancelaciones.",
    },
    {
      key: "max_consecutive_bookings",
      label: "Reservas consecutivas máximas",
      value: "2",
      description: "Número máximo de reservas seguidas por usuario.",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración del Sistema"
        description="Vista de solo lectura (solo admin) — maqueta."
      />

      <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        Control de acceso: esta página es solo para administradores. Si el usuario
        no es admin, debe ver “Acceso Restringido” (maqueta).
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando configuración...
          </div>
        </div>
      ) : error ? (
        <Card>
          <CardContent>
            <div className="py-10 text-center text-red-700">
              Error al cargar la configuración. (demo)
            </div>
          </CardContent>
        </Card>
      ) : configs.length === 0 ? (
        <EmptyState
          title="Sin configuraciones"
          description="No hay datos disponibles."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {configs.map((c) => (
            <Card key={c.key}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-3">
                  <span>{c.label}</span>
                  <Badge variant="outline">Solo lectura</Badge>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{c.description}</p>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{c.value}</div>
                <div className="text-xs text-gray-500 mt-2">Clave: {c.key}</div>
                <div className="text-xs text-gray-500 mt-2">
                  Debug: logs en consola (mencionado) — demo.
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
