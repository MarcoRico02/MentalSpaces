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
import { useCrearReservaMutation } from "../../../core/aplicacion/hooks/useCrearReservaMutation";
import { showToast } from "../../../core/infraestructura/utilidades/toast";
import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../../core/infraestructura/api/api";

export const NewBookingPage: React.FC = () => {
  // Solo UI: simula modo crear/editar con un toggle
  const [mode, setMode] = useState<"create" | "edit">("create");
  // Campos controlados mínimos para crear reserva
  const [cubiculoId, setCubiculoId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [start, setStart] = useState<string>("08:00");
  const [end, setEnd] = useState<string>("09:00");
  const [notes, setNotes] = useState<string>("");

  const crearReservaMutation = useCrearReservaMutation();

  // --- Nueva consulta: obtener cubículos activos desde la API (por ubicación) ---
  const { data: cubiculos = [], isLoading: isLoadingCubiculos } = useQuery({
    queryKey: ["cubiculos", "all"],
    queryFn: async (): Promise<any[]> => {
      // Obtener locaciones y luego listar cubículos activos por cada locación
      const locRes = await authAPI.locations.getAll({ page: 0, size: 100 });
      const locations = locRes.data.content ?? [];
      const pages = await Promise.all(
        locations.map((loc: any) =>
          authAPI.cubiculos
            .getActiveByLocation(loc.id, { page: 0, size: 200 })
            .then((r) => (r.data?.content ?? []).map((c: any) => ({ ...c, locationName: loc.name }))),
        ),
      );
      return pages.flat();
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleCreate = async () => {
    if (!cubiculoId) {
      showToast.error("Selecciona un consultorio");
      return;
    }
    if (!date) {
      showToast.error("Selecciona una fecha");
      return;
    }
    if (!start || !end) {
      showToast.error("Selecciona horario inicio y fin");
      return;
    }
    // Validación básica de horas: start < end
    if (start >= end) {
      showToast.error("La hora de inicio debe ser anterior a la hora de fin");
      return;
    }

    const payload = {
      cubiculoId: Number(cubiculoId),
      inicio: `${date}T${start}:00`,
      fin: `${date}T${end}:00`,
      notas: notes || undefined,
    };

    try {
      await crearReservaMutation.mutateAsync(payload as any);
      // limpiar campos al crear
      setCubiculoId("");
      setDate("");
      setStart("08:00");
      setEnd("09:00");
      setNotes("");
    } catch (e) {
      // El hook ya muestra toast de error; solo logueamos en consola
      console.error("Error creating reserva", e);
    }
  };

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
            <p className="text-sm text-secondary mt-1">
              Validaciones complejas, disponibilidad y cálculo de costo (maqueta).
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room">Consultorio</Label>
                <Select id="room" value={cubiculoId} onChange={(e) => setCubiculoId(e.target.value)}>
                  <option value="" disabled>
                    {isLoadingCubiculos ? "Cargando consultorios..." : "Selecciona una sala"}
                  </option>
                  {isLoadingCubiculos ? (
                    <option value="" disabled>
                      Cargando...
                    </option>
                  ) : cubiculos.length === 0 ? (
                    <option value="" disabled>
                      No hay consultorios disponibles
                    </option>
                  ) : (
                    cubiculos.map((c: any) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.nombre} {c.locationName ? `· ${c.locationName}` : ""} · ${c.precio}/h
                      </option>
                    ))
                  )}
                </Select>
              </div>

              <div>
                <Label htmlFor="user">Usuario (admin)</Label>
                <Select id="user" defaultValue="me">
                  <option value="me">Mi usuario (default)</option>
                  <option value="u1">Terapeuta Demo</option>
                  <option value="u2">Otro terapeuta</option>
                </Select>
                <div className="text-xs text-muted-foreground mt-1">
                  Visible solo para administradores (maqueta).
                </div>
              </div>

              <div>
                <Label htmlFor="date">Fecha</Label>
                <div className="relative">
                  <CalendarDays className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                  <Input id="date" type="date" className="pl-9" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>

              <div>
                <Label htmlFor="start">Hora inicio</Label>
                <div className="relative">
                  <Clock className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                  <Select id="start" className="pl-9" value={start} onChange={(e) => setStart(e.target.value)}>
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
                <Select id="end" value={end} onChange={(e) => setEnd(e.target.value)}>
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
                <Input id="notes" placeholder="Opcional" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => (mode === "create" ? handleCreate() : showToast.info("Guardar (demo)"))} disabled={crearReservaMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {crearReservaMutation.isPending ? "Guardando..." : mode === "create" ? "Crear reserva" : "Guardar cambios"}
              </Button>
               <Button variant="secondary">Cancelar</Button>
             </div>

            <div className="text-xs text-muted-foreground">
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
            <div className="rounded-md bg-app p-3 text-sm">
              <div className="text-secondary">Precio original</div>
              <div className="font-semibold text-default">$450.00</div>
            </div>
            <div className="rounded-md bg-app p-3 text-sm">
              <div className="text-secondary">Descuento por plan</div>
              <div className="font-semibold text-default">-$150.00</div>
            </div>
            <div className="rounded-md border border-default p-3 text-sm">
              <div className="text-secondary">Total</div>
              <div className="text-xl font-bold text-default">$300.00</div>
            </div>

            <div className="text-sm text-secondary">
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
