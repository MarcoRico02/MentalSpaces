import React, { useState } from "react";
import { Download, RefreshCcw } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  Input,
  Select,
  Table,
  TBody,
  TD,
  THead,
  TH,
  TR,
  TableToolbar,
} from "../../components/ui";

export const AccountHistoryPage: React.FC = () => {
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [payModalOpen, setPayModalOpen] = useState(false);

  const rows = Array.from({ length: 8 }).map((_, i) => {
    const st = ["Exitoso", "Fallido", "Reembolsado", "Pendiente"][i % 4];
    return {
      id: `PAY-${1000 + i}`,
      createdAt: "2026-02-04 12:40",
      concept: "Reserva de consultorio",
      amount: "$450.00",
      status: st,
      method: ["Stripe", "Transferencia", "Efectivo"][i % 3],
    };
  });

  const badgeVariant = (s: string) => {
    if (s === "Exitoso") return "success";
    if (s === "Fallido") return "danger";
    if (s === "Reembolsado") return "info";
    return "warning";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Historial de Pagos"
        description="Consulta todos tus pagos, filtra por estado o fechas y exporta a CSV."
        right={
          <div className="flex gap-2">
            <Button variant="secondary">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refrescar
            </Button>
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Estado</div>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">Todos</option>
                <option value="success">Exitosos</option>
                <option value="failed">Fallidos</option>
                <option value="refunded">Reembolsados</option>
                <option value="pending">Pendientes</option>
              </Select>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Desde</div>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Hasta</div>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button className="w-full">Filtrar</Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setStatus("all");
                  setFromDate("");
                  setToDate("");
                }}
              >
                Limpiar
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Refrescado automático: <span className="font-medium">ON</span> (demo)
            </div>
            <Button onClick={() => setPayModalOpen(true)}>Pagar pendientes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <TableToolbar className="mb-3">
            <div className="text-sm text-gray-600">Mostrando 1–8 de 42</div>
            <div className="flex gap-2">
              <Button variant="secondary">Anterior</Button>
              <Button variant="secondary">Siguiente</Button>
            </div>
          </TableToolbar>

          <Table>
            <THead>
              <TR>
                <TH>ID</TH>
                <TH>Fecha</TH>
                <TH>Concepto</TH>
                <TH>Monto</TH>
                <TH>Estado</TH>
                <TH>Método</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((r) => (
                <TR key={r.id}>
                  <TD className="font-medium text-gray-900">{r.id}</TD>
                  <TD>{r.createdAt}</TD>
                  <TD>{r.concept}</TD>
                  <TD className="font-semibold text-gray-900">{r.amount}</TD>
                  <TD>
                    <Badge variant={badgeVariant(r.status)}>{r.status}</Badge>
                  </TD>
                  <TD>{r.method}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={payModalOpen}
        onOpenChange={setPayModalOpen}
        title="Pagar pendientes"
        description="Maqueta de modal con integración de Stripe (solo UI)."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setPayModalOpen(false)}>
              Cancelar
            </Button>
            <Button>Confirmar pago</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-600">
            Aquí iría el formulario de tarjeta (Stripe Elements).\n\nValidación en tiempo real, 3D Secure, etc.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Nombre en la tarjeta
              </div>
              <Input placeholder="Nombre Apellido" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Código postal
              </div>
              <Input placeholder="00000" />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
