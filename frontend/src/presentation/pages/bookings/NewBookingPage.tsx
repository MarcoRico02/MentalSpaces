import React, { useState } from "react";
import { CalendarDays, Clock, Save } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
} from "../../components/ui";

export const NewBookingPage: React.FC = () => {
  // Solo UI: simula modo crear/editar con un toggle
  const [mode, setMode] = useState<"create" | "edit">("create");

  return (
    <div className="space-y-6">
      <PageHeader
        title={mode === "create" ? "Nueva Reserva" : "Editar Reserva"}
        description="Formulario de reserva (solo diseño)."
        right={
          <div className="flex gap-2">
            <Button
              variant={mode === "create" ? "primary" : "secondary"}
              onClick={() => setMode("create")}
            >
              Crear
            </Button>
            <Button
              variant={mode === "edit" ? "primary" : "secondary"}
              onClick={() => setMode("edit")}
            >
              Editar
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Datos de la reserva</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Validaciones complejas, disponibilidad y cálculo de costo (maqueta).
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room">Consultorio</Label>
                <Select id="room" defaultValue="">
                  <option value="" disabled>
                    Selecciona una sala
                  </option>
                  <option>Consultorio 1 · Sede Roma · $450/h</option>
                  <option>Consultorio 2 · Sede Condesa · $450/h</option>
                  <option>Consultorio 3 · Sede Roma · $500/h</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="user">Usuario (admin)</Label>
                <Select id="user" defaultValue="me">
                  <option value="me">Mi usuario (default)</option>
                  <option value="u1">Terapeuta Demo</option>
                  <option value="u2">Otro terapeuta</option>
                </Select>
                <div className="text-xs text-gray-500 mt-1">
                  Visible solo para administradores (maqueta).
                </div>
              </div>

              <div>
                <Label htmlFor="date">Fecha</Label>
                <div className="relative">
                  <CalendarDays className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  <Input id="date" type="date" className="pl-9" />
                </div>
              </div>

              <div>
                <Label htmlFor="start">Hora inicio</Label>
                <div className="relative">
                  <Clock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  <Select id="start" className="pl-9">
                    <option>08:00</option>
                    <option>09:00</option>
                    <option>10:00</option>
                    <option>11:00</option>
                    <option>12:00</option>
                    <option>13:00</option>
                    <option>14:00</option>
                    <option>15:00</option>
                    <option>16:00</option>
                    <option>17:00</option>
                    <option>18:00</option>
                    <option>19:00</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="end">Hora fin</Label>
                <Select id="end">
                  <option>09:00</option>
                  <option>10:00</option>
                  <option>11:00</option>
                  <option>12:00</option>
                  <option>13:00</option>
                  <option>14:00</option>
                  <option>15:00</option>
                  <option>16:00</option>
                  <option>17:00</option>
                  <option>18:00</option>
                  <option>19:00</option>
                  <option>20:00</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notas</Label>
                <Input id="notes" placeholder="Opcional" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                {mode === "create" ? "Crear reserva" : "Guardar cambios"}
              </Button>
              <Button variant="secondary">Cancelar</Button>
            </div>

            <div className="text-xs text-gray-500">
              Estados UI: isSubmitting, spinner en botón, validación de traslapes,
              reglas del sistema, límites de usuario, etc. (demo)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de costo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md bg-gray-50 p-3 text-sm">
              <div className="text-gray-600">Precio original</div>
              <div className="font-semibold text-gray-900">$450.00</div>
            </div>
            <div className="rounded-md bg-gray-50 p-3 text-sm">
              <div className="text-gray-600">Descuento por plan</div>
              <div className="font-semibold text-gray-900">-$150.00</div>
            </div>
            <div className="rounded-md border border-gray-200 p-3 text-sm">
              <div className="text-gray-600">Total</div>
              <div className="text-xl font-bold text-gray-900">$300.00</div>
            </div>

            <div className="text-sm text-gray-600">
              Integración con planes: horas disponibles, hoursToCover, validación
              de horas suficientes (maqueta).
            </div>

            <Badge variant="info">Plan detectado: Pro</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
