import React from "react";
import { RefreshCcw } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "../../components/ui";

export const AccountSummaryPage: React.FC = () => {
  // UI only: datos mock para maqueta
  const stats = [
    { label: "Saldo actual", value: "$12,450.00" },
    { label: "Total pagado", value: "$38,900.00" },
    { label: "Cargos pendientes", value: "$1,250.00" },
    { label: "Próximo pago", value: "15 feb 2026" },
  ];

  const movements = Array.from({ length: 6 }).map((_, i) => {
    const status = ["pendiente", "exitoso", "fallido"][i % 3] as
      | "pendiente"
      | "exitoso"
      | "fallido";
    return {
      id: i + 1,
      concept: [
        "Reserva de consultorio",
        "Pago de suscripción",
        "Ajuste / reembolso",
      ][i % 3],
      amount: ["$450.00", "$1,299.00", "$-120.00"][i % 3],
      status,
      createdAt: "2026-02-05 10:24",
    };
  });

  const statusVariant = (s: string) => {
    if (s === "exitoso") return "success";
    if (s === "fallido") return "danger";
    return "warning";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resumen de Cuenta"
        description="Consulta tu información financiera y movimientos recientes."
        right={
          <Button variant="secondary">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refrescar
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-secondary">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-default">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Movimientos recientes</CardTitle>
          <p className="text-sm text-secondary mt-1">
            Últimas transacciones registradas en tu cuenta.
          </p>
        </CardHeader>
        <CardContent>
          {/* Skeleton demo */}
          <div className="hidden">
            <Skeleton className="h-12" />
          </div>

          <div className="divide-y divide-gray-100">
            {movements.map((m) => (
              <div
                key={m.id}
                className="py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-medium text-default">{m.concept}</div>
                  <div className="text-sm text-secondary">{m.createdAt}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold text-default">{m.amount}</div>
                  </div>
                  <Badge variant={statusVariant(m.status)}>{m.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
