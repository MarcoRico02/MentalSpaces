import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus, Edit, Trash2, Save, X, CreditCard,
  Users, Percent, Package, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { ConfirmModal } from "../../components/common/Modal";
import {
  Badge, Button, Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle, Dialog, Input, Label,
  Table, TBody, TD, THead, TH, TR,
} from "../../components/ui";
import { authAPI } from "../../../core/infraestructura/api/api";
import { showToast } from "../../../core/infraestructura/utilidades/toast";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import type { SuscripcionDTO, CrearSuscripcionRequest } from "../../../core/dominio/tipos/api";

// ─── Esquema de validación ────────────────────────────────────────────────────
const planSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100),
  precio: z.coerce.number().min(0, "El precio no puede ser negativo"),
  cubiculosActivosPermitidos: z.coerce
    .number()
    .int("Debe ser un número entero")
    .min(1, "Debe permitir al menos 1 cubículo"),
  comisionPorcentaje: z.coerce
    .number()
    .min(0, "La comisión no puede ser negativa")
    .max(100, "La comisión no puede exceder 100%"),
  descripcion: z.string().max(500).optional(),
});

type PlanFormValues = z.infer<typeof planSchema>;

// ─── Componente del formulario ────────────────────────────────────────────────
const PlanForm: React.FC<{
  initial?: SuscripcionDTO;
  onSave: (data: CrearSuscripcionRequest) => void;
  onCancel: () => void;
  isSaving: boolean;
}> = ({ initial, onSave, onCancel, isSaving }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanFormValues, any, PlanFormValues>({
    resolver: zodResolver(planSchema) as any,
    defaultValues: {
      nombre: initial?.nombre ?? "",
      precio: initial?.precio ?? 0,
      cubiculosActivosPermitidos: initial?.cubiculosActivosPermitidos ?? 1,
      comisionPorcentaje: initial?.comisionPorcentaje ?? 0,
      descripcion: initial?.descripcion ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave as any)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="sm:col-span-2">
          <Label htmlFor="nombre">Nombre del plan *</Label>
          <Input
            id="nombre"
            {...register("nombre")}
            placeholder="Ej: Plan Básico"
            error={errors.nombre?.message}
          />
        </div>

        {/* Precio */}
        <div>
          <Label htmlFor="precio">Precio mensual (MXN) *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              id="precio"
              type="number"
              step="0.01"
              min="0"
              {...register("precio")}
              className="pl-7"
              error={errors.precio?.message}
            />
          </div>
        </div>

        {/* Comisión */}
        <div>
          <Label htmlFor="comisionPorcentaje">Comisión (%) *</Label>
          <div className="relative">
            <Input
              id="comisionPorcentaje"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register("comisionPorcentaje")}
              className="pr-7"
              error={errors.comisionPorcentaje?.message}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
          </div>
        </div>

        {/* Cubículos */}
        <div>
          <Label htmlFor="cubiculosActivosPermitidos">Cubículos activos permitidos *</Label>
          <Input
            id="cubiculosActivosPermitidos"
            type="number"
            min="1"
            {...register("cubiculosActivosPermitidos")}
            error={errors.cubiculosActivosPermitidos?.message}
          />
        </div>

        {/* Descripción */}
        <div className="sm:col-span-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <textarea
            id="descripcion"
            rows={3}
            {...register("descripcion")}
            placeholder="Describe los beneficios y características del plan..."
            className="w-full px-3 py-2 border border-default rounded-md bg-surface text-default placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm resize-none"
          />
          {errors.descripcion && (
            <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-default">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          <X className="h-4 w-4 mr-1" /> Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          <Save className="h-4 w-4 mr-1" />
          {isSaving ? "Guardando..." : initial ? "Actualizar plan" : "Crear plan"}
        </Button>
      </div>
    </form>
  );
};

// ─── Card de plan ─────────────────────────────────────────────────────────────
const PlanCard: React.FC<{
  plan: SuscripcionDTO;
  onEdit: (plan: SuscripcionDTO) => void;
  onDelete: (plan: SuscripcionDTO) => void;
  canManage: boolean;
}> = ({ plan, onEdit, onDelete, canManage }) => (
  <Card className="flex flex-col">
    <CardHeader>
      <div className="flex items-start justify-between gap-2">
        <CardTitle className="text-lg">{plan.nombre}</CardTitle>
        <Badge variant="info" className="shrink-0">
          <Package className="h-3 w-3 mr-1" />
          Plan #{plan.id}
        </Badge>
      </div>
      {plan.descripcion && (
        <CardDescription className="mt-1 line-clamp-2">{plan.descripcion}</CardDescription>
      )}
    </CardHeader>

    <CardContent className="flex-1 space-y-3">
      {/* Precio */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <CreditCard className="h-5 w-5 text-primary shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">Precio mensual</p>
          <p className="text-xl font-bold text-primary">
            ${Number(plan.precio).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            <span className="text-sm font-normal text-muted-foreground ml-1">MXN</span>
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2 rounded-md bg-surface-2">
          <Users className="h-4 w-4 text-secondary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Cubículos</p>
            <p className="text-sm font-semibold text-default">
              {plan.cubiculosActivosPermitidos}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-md bg-surface-2">
          <Percent className="h-4 w-4 text-secondary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Comisión</p>
            <p className="text-sm font-semibold text-default">
              {Number(plan.comisionPorcentaje).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </CardContent>

    <CardFooter className="flex gap-2">
      {canManage ? (
        <>
          <Button variant="secondary" className="flex-1" onClick={() => onEdit(plan)}>
            <Edit className="h-3.5 w-3.5 mr-1" /> Editar
          </Button>
          <Button variant="danger" className="flex-1" onClick={() => onDelete(plan)}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Eliminar
          </Button>
        </>
      ) : (
        <p className="text-xs text-muted-foreground w-full text-center py-1">
          Solo administradores pueden gestionar planes
        </p>
      )}
    </CardFooter>
  </Card>
);

// ─── Página principal ─────────────────────────────────────────────────────────
export const SubscriptionManagementPage: React.FC = () => {
  const qc = useQueryClient();
  const { isAdmin } = useAuth();
  const canManage = isAdmin();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SuscripcionDTO | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<SuscripcionDTO | null>(null);

  // ── Queries ────────────────────────────────────────────────────────────────
  const {
    data: planes = [],
    isLoading,
    error,
  } = useQuery<SuscripcionDTO[]>({
    queryKey: ["suscripciones"],
    queryFn: () =>
      authAPI.suscripciones.getOrdenadosPorPrecio().then((r) => r.data),
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const crearMutation = useMutation({
    mutationFn: (data: CrearSuscripcionRequest) =>
      authAPI.suscripciones.crear(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suscripciones"] });
      setDialogOpen(false);
      showToast.success("Plan creado correctamente.");
    },
    onError: (e: any) => {
      showToast.error(e?.response?.data?.message ?? "Error al crear el plan.");
    },
  });

  const actualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CrearSuscripcionRequest }) =>
      authAPI.suscripciones.actualizar(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suscripciones"] });
      setDialogOpen(false);
      setEditingPlan(null);
      showToast.success("Plan actualizado correctamente.");
    },
    onError: (e: any) => {
      showToast.error(
        e?.response?.data?.message ?? "Error al actualizar el plan.",
      );
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => authAPI.suscripciones.eliminar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suscripciones"] });
      setDeletingPlan(null);
      showToast.success("Plan eliminado.");
    },
    onError: (e: any) => {
      showToast.error(
        e?.response?.data?.message ?? "Error al eliminar el plan.",
      );
    },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingPlan(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (plan: SuscripcionDTO) => {
    setEditingPlan(plan);
    setDialogOpen(true);
  };

  const handleSave = (data: CrearSuscripcionRequest) => {
    if (editingPlan) {
      actualizarMutation.mutate({ id: editingPlan.id, data });
    } else {
      crearMutation.mutate(data);
    }
  };

  const isSaving = crearMutation.isPending || actualizarMutation.isPending;

  // ── Resumen ────────────────────────────────────────────────────────────────
  const precioMin = planes.length
    ? Math.min(...planes.map((p) => Number(p.precio)))
    : 0;
  const precioMax = planes.length
    ? Math.max(...planes.map((p) => Number(p.precio)))
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Suscripciones"
        description="Planes de suscripción disponibles para los propietarios."
        right={
          canManage ? (
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo plan
            </Button>
          ) : undefined
        }
      />

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Planes activos</p>
              <p className="text-2xl font-bold text-default">{planes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
              <CreditCard className="h-5 w-5 text-green-700 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Precio mínimo</p>
              <p className="text-2xl font-bold text-default">
                ${precioMin.toLocaleString("es-MX", { minimumFractionDigits: 0 })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <CreditCard className="h-5 w-5 text-purple-700 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Precio máximo</p>
              <p className="text-2xl font-bold text-default">
                ${precioMax.toLocaleString("es-MX", { minimumFractionDigits: 0 })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de carga / error */}
      {isLoading && (
        <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="text-sm">Cargando planes...</span>
        </div>
      )}

      {!isLoading && error && (
        <Card>
          <CardContent>
            <div className="py-10 text-center space-y-2">
              <AlertTriangle className="mx-auto h-8 w-8 text-red-500" />
              <p className="font-medium text-default">Error al cargar los planes</p>
              <p className="text-sm text-muted-foreground">
                Verifica tu conexión o que el servidor esté disponible.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid de planes */}
      {!isLoading && !error && planes.length === 0 && (
        <Card>
          <CardContent>
            <div className="py-16 text-center space-y-3">
              <Package className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="font-medium text-default">Sin planes registrados</p>
              <p className="text-sm text-muted-foreground">
                {canManage
                  ? "Crea el primer plan de suscripción para los propietarios."
                  : "Aún no hay planes de suscripción disponibles. Contacta al administrador."}
              </p>
              {canManage && (
                <Button onClick={handleOpenCreate} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primer plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && planes.length > 0 && (
        <>
          {/* Cards de planes */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {planes.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                canManage={canManage}
                onEdit={handleOpenEdit}
                onDelete={setDeletingPlan}
              />
            ))}
          </div>

          {/* Tabla comparativa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Comparativa de planes
              </CardTitle>
              <CardDescription>
                Resumen de todos los planes ordenados por precio.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <THead>
                  <TR>
                    <TH>Plan</TH>
                    <TH>Precio / mes</TH>
                    <TH>Cubículos</TH>
                    <TH>Comisión</TH>
                    <TH>Descripción</TH>
                    {canManage && <TH>Acciones</TH>}
                  </TR>
                </THead>
                <TBody>
                  {planes.map((plan) => (
                    <TR key={plan.id}>
                      <TD>
                        <span className="font-medium text-default">{plan.nombre}</span>
                      </TD>
                      <TD>
                        <span className="font-semibold text-primary">
                          ${Number(plan.precio).toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </TD>
                      <TD>
                        <Badge variant="info">
                          {plan.cubiculosActivosPermitidos} cubículo
                          {plan.cubiculosActivosPermitidos !== 1 ? "s" : ""}
                        </Badge>
                      </TD>
                      <TD>
                        <Badge variant="default">
                          {Number(plan.comisionPorcentaje).toFixed(1)}%
                        </Badge>
                      </TD>
                      <TD className="max-w-xs">
                        <span className="text-secondary text-sm line-clamp-1">
                          {plan.descripcion || "—"}
                        </span>
                      </TD>
                      {canManage && (
                        <TD>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(plan)}
                              className="p-1.5 rounded hover:bg-surface-2 text-muted-foreground hover:text-primary transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingPlan(plan)}
                              className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TD>
                      )}
                    </TR>
                  ))}
                </TBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Dialog crear / editar */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            setEditingPlan(null);
          }
        }}
        title={editingPlan ? `Editar plan: ${editingPlan.nombre}` : "Nuevo plan de suscripción"}
        description={
          editingPlan
            ? "Modifica los datos del plan. Los cambios se aplicarán a las nuevas suscripciones."
            : "Completa los datos del nuevo plan. Los propietarios podrán suscribirse a él."
        }
        maxWidthClassName="max-w-xl"
      >
        <PlanForm
          key={editingPlan?.id ?? "new"}
          initial={editingPlan ?? undefined}
          onSave={handleSave}
          onCancel={() => {
            setDialogOpen(false);
            setEditingPlan(null);
          }}
          isSaving={isSaving}
        />
      </Dialog>

      {/* Confirm eliminar */}
      <ConfirmModal
        isOpen={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
        onConfirm={() => {
          if (deletingPlan) eliminarMutation.mutate(deletingPlan.id);
        }}
        title="Eliminar plan"
        message={`¿Estás seguro de eliminar el plan "${deletingPlan?.nombre}"? Esta acción no se puede deshacer. Los propietarios con este plan activo no serán afectados inmediatamente.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};



