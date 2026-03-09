import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { showToast } from "../../../core/infraestructura/utilidades/toast";
import { apiClient } from "../../../core/infraestructura/api/api";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "../../components/ui";

type SystemConfig = {
  id: number;
  key: string;
  value: string;
  description: string;
  updatedAt: string;
  updatedBy: number;
};

type UpdatePayload = { key: string; value: string };

export const SystemConfigPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const roles = user?.usuarioInfoDTO?.roles ?? [];
  const canAccess = roles.includes("ADMIN") || roles.includes("PROPIETARIO");

  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const {
    data: configs,
    isLoading,
    error,
  } = useQuery<SystemConfig[]>({
    queryKey: ["/api/config"],
    enabled: canAccess,
    queryFn: async () => {
      const res = await apiClient.get<SystemConfig[]>("/config");
      return res.data;
    },
    retry: (failureCount, err: any) => {
      // No reintentar 403
      const status = err?.response?.status;
      if (status === 403) return false;
      return failureCount < 2;
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: async ({ key, value }: UpdatePayload) => {
      const res = await apiClient.put(`/config/${key}`, { value });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
      showToast.success("Configuración actualizada");
    },
    onError: (e: any) => {
      const status = e?.response?.status;
      if (status === 403) {
        showToast.error("Acceso restringido: se requiere rol ADMIN o PROPIETARIO.");
        return;
      }
      showToast.error(
          `Error al actualizar: ${e instanceof Error ? e.message : "Error desconocido"}`,
      );
    },
  });

  const isPending = updateConfigMutation.isPending;

  const handleEdit = (config: SystemConfig) => {
    setEditMode({ ...editMode, [config.key]: true });
    setEditValues({ ...editValues, [config.key]: config.value });
  };

  const handleSave = (config: SystemConfig) => {
    updateConfigMutation.mutate({
      key: config.key,
      value: editValues[config.key] || config.value,
    });
    setEditMode({ ...editMode, [config.key]: false });
  };

  const handleCancel = (config: SystemConfig) => {
    setEditMode({ ...editMode, [config.key]: false });
    setEditValues({ ...editValues, [config.key]: config.value });
  };

  const getConfigTitle = (key: string) => {
    const titles: Record<string, string> = {
      max_active_bookings: "Máximo de reservas activas por usuario",
      advance_booking_days: "Días de anticipación para reservar",
      cancellation_hours_notice: "Horas mínimas para cancelar reserva",
      max_booking_duration_hours: "Duración máxima de reserva (horas)",

      // Legacy
      booking_min_hours_before: "Días/Horas de anticipación (Legacy)",
      booking_max_active_per_user: "Máximo de reservas activas (Legacy)",
      booking_max_hours_duration: "Duración máxima (Legacy)",
      booking_min_hours_before_cancel: "Horas mínimas para cancelar (Legacy)",
    };
    return titles[key] || key;
  };

  const getConfigDescription = (key: string, currentValue: string) => {
    const descriptions: Record<string, string> = {
      max_active_bookings:
          "Límite de reservas simultáneas que puede tener un usuario.",
      advance_booking_days:
          "Días mínimos antes de realizar una reserva (0 = sin anticipación).",
      cancellation_hours_notice:
          "Tiempo mínimo antes del inicio para cancelar (recomendado: 24-48h).",
      max_booking_duration_hours: "Horas máximas que puede durar una sesión.",

      // Legacy
      booking_min_hours_before:
          "Clave legacy para compatibilidad. Recomendado usar advance_booking_days.",
      booking_max_active_per_user:
          "Clave legacy para compatibilidad. Recomendado usar max_active_bookings.",
      booking_max_hours_duration:
          "Clave legacy para compatibilidad. Recomendado usar max_booking_duration_hours.",
      booking_min_hours_before_cancel:
          "Clave legacy para compatibilidad. Recomendado usar cancellation_hours_notice.",
    };

    return `${descriptions[key] || "Sin descripción disponible."} Valor configurado: ${currentValue}.`;
  };

  const normalized = useMemo(() => configs ?? [], [configs]);

  if (!canAccess) {
    return (
        <div className="space-y-6">
          <PageHeader
              title="Configuración del Sistema"
              description="Acceso restringido: solo administradores y propietarios."
          />
          <Card>
            <CardContent>
              <div className="py-10 text-center">
                <div className="text-lg font-semibold text-default">
                  Acceso restringido
                </div>
                <div className="text-sm text-secondary mt-2">
                  Tu cuenta no tiene permisos para ver esta página.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    );
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (error) {
    const anyErr: any = error;
    const status = anyErr?.response?.status;
    const msg =
        status === 403
            ? "Acceso restringido: el backend respondió 403."
            : (error as Error).message;

    return (
        <div className="p-4">
          <p className="text-red-600">Error al cargar la configuración: {msg}</p>
        </div>
    );
  }

  if (!normalized || normalized.length === 0) {
    return (
        <div className="p-4">
          <p>No se encontraron configuraciones en el sistema.</p>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <PageHeader
            title="Configuración del Sistema"
            description="Aquí puedes configurar las reglas de reserva y otras configuraciones del sistema. Los cambios se aplicarán inmediatamente."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {normalized.map((config) => {
            const editing = editMode[config.key];
            const minValue = config.key === "advance_booking_days" ? 0 : 1;
            return (
                <Card key={config.key}>
                  <CardHeader>
                    <CardTitle>{getConfigTitle(config.key)}</CardTitle>
                    <CardDescription>
                      {getConfigDescription(config.key, config.value)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {!editing ? (
                        <div className="text-2xl font-semibold text-default">
                          {config.value}
                        </div>
                    ) : (
                        <Input
                            type="number"
                            value={editValues[config.key] ?? config.value}
                            onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  [config.key]: e.target.value,
                                })
                            }
                            min={minValue}
                            className="w-full"
                        />
                    )}

                    <div className="text-xs text-muted-foreground mt-2">
                      Última actualización: {new Date(config.updatedAt).toLocaleString()}
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-end gap-2">
                    {editing ? (
                        <>
                          <Button
                              variant="secondary"
                              onClick={() => handleCancel(config)}
                              disabled={isPending}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={() => handleSave(config)} disabled={isPending}>
                            {isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Guardar
                          </Button>
                        </>
                    ) : (
                        <Button onClick={() => handleEdit(config)}>Editar</Button>
                    )}
                  </CardFooter>
                </Card>
            );
          })}
        </div>
      </div>
  );
};

