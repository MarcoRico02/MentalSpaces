import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDays, Clock } from "lucide-react";
import { Button, Dialog, Input, Label, Select, Separator } from "../ui";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import type { ReservaCreateRequestDTO } from "../../../core/dominio/tipos/api";

// ─── Constantes de depuración ────────────────────────────────────────────────
const DEBUG_IS_ADMIN = true;
const debugSuscriptionPrice: number | null = null;

// ─── Datos demo ──────────────────────────────────────────────────────────────
interface DemoUsuario {
  id: number;
  nombre: string;
  tipo: "psicologo" | "propietario";
}

interface DemoCubiculo {
  id: number;
  nombre: string;
  sede: string;
  precioPorHora: number;
}

const DEMO_USUARIOS: DemoUsuario[] = [
  { id: 1, nombre: "Ana García (Psicóloga)", tipo: "psicologo" },
  { id: 2, nombre: "Carlos López (Psicólogo)", tipo: "psicologo" },
  { id: 3, nombre: "María Fernández (Propietaria)", tipo: "propietario" },
  { id: 4, nombre: "Juan Pérez (Propietario)", tipo: "propietario" },
];

const DEMO_CUBICULOS: DemoCubiculo[] = [
  { id: 1, nombre: "Consultorio 1", sede: "Sede Roma", precioPorHora: 450 },
  { id: 2, nombre: "Consultorio 2", sede: "Sede Condesa", precioPorHora: 450 },
  { id: 3, nombre: "Consultorio 3", sede: "Sede Roma", precioPorHora: 500 },
  { id: 4, nombre: "Consultorio A", sede: "Sede Condesa", precioPorHora: 400 },
  { id: 5, nombre: "Consultorio B", sede: "Sede Condesa", precioPorHora: 350 },
];

// ─── Zod Schema ──────────────────────────────────────────────────────────────
const reservaFormSchema = z.object({
  usuarioId: z.number().optional(),
  fecha: z.string().min(1, "La fecha es requerida"),
  horaInicio: z.string().min(1, "La hora de inicio es requerida"),
  horaFin: z.string().min(1, "La hora de fin es requerida"),
  cubiculoId: z.number().refine((v) => v && v > 0, "Selecciona un cubículo"),
  notas: z.string().max(300, "Máximo 300 caracteres").optional(),
});

type ReservaFormData = z.infer<typeof reservaFormSchema>;

// ─── Props ───────────────────────────────────────────────────────────────────
interface ReservaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  defaultFecha?: string;
  defaultHoraInicio?: string;
  defaultHoraFin?: string;
  onConfirm: (data: ReservaCreateRequestDTO) => void;
  isSubmitting?: boolean;
}

// ─── Componente ──────────────────────────────────────────────────────────────
export const ReservaForm: React.FC<ReservaFormProps> = ({
  open,
  onOpenChange,
  mode = "create",
  defaultFecha = "",
  defaultHoraInicio = "09:00",
  defaultHoraFin = "10:00",
  onConfirm,
  isSubmitting = false,
}) => {
  const { isAdmin: authIsAdmin } = useAuth();
  const isAdmin = DEBUG_IS_ADMIN || authIsAdmin;

  const showDescuento = debugSuscriptionPrice !== null && debugSuscriptionPrice > 0;

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReservaFormData>({
    resolver: zodResolver(reservaFormSchema),
    mode: "onChange",
    defaultValues: {
      fecha: defaultFecha,
      horaInicio: defaultHoraInicio,
      horaFin: defaultHoraFin,
      notas: "",
    },
  });

  const selectedCubiculoId = watch("cubiculoId");
  const horaInicio = watch("horaInicio");
  const horaFin = watch("horaFin");

  const cubiculoSeleccionado = DEMO_CUBICULOS.find((c) => c.id === selectedCubiculoId);
  const precioPorHora = cubiculoSeleccionado?.precioPorHora ?? 0;

  const horas = useMemo(() => {
    if (!horaInicio || !horaFin) return 0;
    const [h1, m1] = horaInicio.split(":").map(Number);
    const [h2, m2] = horaFin.split(":").map(Number);
    return Math.max(0, (h2 * 60 + m2 - h1 * 60 - m1) / 60);
  }, [horaInicio, horaFin]);

  const precioOriginal = precioPorHora * horas;
  const descuento = showDescuento ? (debugSuscriptionPrice ?? 0) * horas : 0;
  const total = Math.max(0, precioOriginal - descuento);

  const onSubmit = (data: ReservaFormData) => {
    const inicio = `${data.fecha}T${data.horaInicio}:00`;
    const fin = `${data.fecha}T${data.horaFin}:00`;

    onConfirm({
      cubiculoId: data.cubiculoId,
      inicio,
      fin,
      notas: data.notas,
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const formatDinero = (valor: number) => `$${valor.toFixed(2)} MXN/hora`;

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
      title={mode === "create" ? "Nueva Reserva" : "Editar Reserva"}
      maxWidthClassName="max-w-lg"
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {mode === "create" ? "Confirmar reserva" : "Guardar cambios"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Usuario — solo visible para admin */}
        {isAdmin && (
          <Controller
            name="usuarioId"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor="usuario">Usuario</Label>
                <Select
                  id="usuario"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val ? Number(val) : undefined);
                  }}
                >
                  <option value="">Selecciona un usuario</option>
                  {DEMO_USUARIOS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          />
        )}

        {/* Fecha */}
        <div>
          <Label htmlFor="fecha">Fecha</Label>
          <div className="relative">
            <CalendarDays className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
            <Input
              id="fecha"
              type="date"
              className="pl-9"
              {...register("fecha")}
              error={errors.fecha?.message}
            />
          </div>
        </div>

        {/* Hora inicio / Hora fin — misma fila */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="horaInicio"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor="horaInicio">Hora inicio</Label>
                <div className="relative">
                  <Clock className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                  <Select id="horaInicio" className="pl-9" {...field}>
                    {Array.from({ length: 13 }, (_, i) => i + 8).map((h) => (
                      <option key={h} value={`${String(h).padStart(2, "0")}:00`}>
                        {String(h).padStart(2, "0")}:00
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}
          />
          <Controller
            name="horaFin"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor="horaFin">Hora fin</Label>
                <Select id="horaFin" {...field}>
                  {Array.from({ length: 13 }, (_, i) => i + 9).map((h) => (
                    <option key={h} value={`${String(h).padStart(2, "0")}:00`}>
                      {String(h).padStart(2, "0")}:00
                    </option>
                  ))}
                </Select>
              </div>
            )}
          />
        </div>

        {/* Cubículo */}
        <Controller
          name="cubiculoId"
          control={control}
          render={({ field }) => (
            <div>
              <Label htmlFor="cubiculoId">Cubículo</Label>
              <Select
                id="cubiculoId"
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val ? Number(val) : undefined);
                }}
                error={errors.cubiculoId?.message}
              >
                <option value="">Selecciona un cubículo</option>
                {DEMO_CUBICULOS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} · {c.sede} · ${c.precioPorHora}/h
                  </option>
                ))}
              </Select>
            </div>
          )}
        />

        {/* Notas */}
        <div>
          <Label htmlFor="notas">Notas</Label>
          <Input
            id="notas"
            placeholder="Opcional"
            {...register("notas")}
            error={errors.notas?.message}
          />
        </div>

        <Separator />

        {/* Resumen de costo */}
        <div className="space-y-3 rounded-md bg-app p-4 text-sm">
          {showDescuento && (
            <div className="flex justify-between">
              <span className="text-secondary">Precio original</span>
              <span className="font-semibold text-default">
                {cubiculoSeleccionado
                  ? `${formatDinero(precioOriginal)}`
                  : "—"}
              </span>
            </div>
          )}
          {showDescuento && (
            <div className="flex justify-between">
              <span className="text-secondary">Descuento de suscripción</span>
              <span className="font-semibold text-green-600">
                -{formatDinero(descuento)}
              </span>
            </div>
          )}
          {showDescuento && (
            <Separator />
          )}
          <div className="flex justify-between">
            <span className="text-sm font-medium text-default">Total</span>
            <span className="text-lg font-bold text-default">
              {cubiculoSeleccionado ? formatDinero(total) : "—"}
            </span>
          </div>
        </div>
      </form>
    </Dialog>
  );
};
