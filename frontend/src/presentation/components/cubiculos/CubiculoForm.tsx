import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { authAPI } from "../../../core/infraestructura/api/api";
import type {
  CubiculoResponse,
  CaracteristicaDTO,
  CaracteristicaNombre,
  DisponibilidadCreateRequestDTO,
} from "../../../core/dominio/tipos/api";
import { DisponibilidadManager, DisponibilidadInlineEditor } from "./DisponibilidadManager";

// Esquema de validación
const cubiculoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del cubículo es obligatorio")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  precio: z.number().min(0, "El precio no puede ser negativo"),
  imageUrl: z
    .string()
    .max(500, "La URL no puede exceder 500 caracteres")
    .url("La URL debe ser válida")
    .optional()
    .or(z.literal("")),
  caracteristicasIds: z.array(z.number()).optional(),
  active: z.boolean(),
});

type CubiculoFormData = z.infer<typeof cubiculoSchema>;

interface CubiculoFormProps {
  locationId?: number;
  cubiculo?: CubiculoResponse;
  caracteristicas: CaracteristicaDTO[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const CubiculoForm: React.FC<CubiculoFormProps> = ({
  locationId,
  cubiculo,
  caracteristicas,
  onSuccess,
  onCancel,
}) => {
  const isEditing = !!cubiculo;
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "disponibilidad">("info");
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadCreateRequestDTO[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CubiculoFormData>({
    resolver: zodResolver(cubiculoSchema),
    defaultValues: {
      nombre: cubiculo?.nombre || "",
      descripcion: cubiculo?.descripcion || "",
      precio: cubiculo?.precio || 0,
      imageUrl: cubiculo?.imageUrl || "",
      caracteristicasIds: cubiculo?.caracteristicas.map((c) => c.id) || [],
      active: cubiculo?.isActive ?? true,
    },
  });

  const selectedCaracteristicas = watch("caracteristicasIds") || [];
  const activeValue = watch("active");

  const onSubmit = async (data: CubiculoFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && cubiculo) {
        await authAPI.cubiculos.update(cubiculo.id, {
          ...data,
          caracteristicasIds: data.caracteristicasIds || [],
        });
        toast.success("Cubículo actualizado exitosamente");
      } else if (locationId) {
        await authAPI.cubiculos.create({
          locationId,
          ...data,
          caracteristicasIds: data.caracteristicasIds || [],
          disponibilidadCreateRequestDTO: disponibilidades.length > 0 ? disponibilidades : undefined,
        });
        toast.success("Cubículo creado exitosamente");
      }
      onSuccess();
      reset();
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al guardar el cubículo";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaracteristicaToggle = (caracteristicaId: number) => {
    const currentIds = selectedCaracteristicas;
    const newIds = currentIds.includes(caracteristicaId)
      ? currentIds.filter((id) => id !== caracteristicaId)
      : [...currentIds, caracteristicaId];
    setValue("caracteristicasIds", newIds);
  };

  const getCaracteristicaNombre = (nombre: CaracteristicaNombre): string => {
    return nombre
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Tabs — solo en modo edición */}
      {isEditing && (
        <div className="flex border-b border-gray-200">
          {(["info", "disponibilidad"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "info" ? "Información" : "Disponibilidad"}
            </button>
          ))}
        </div>
      )}

      {/* ── Pestaña información ─────────────────────────────────────────── */}
      {(!isEditing || activeTab === "info") && (
        <>
          {/* Campos básicos */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre del Cubículo *
              </label>
              <input
                type="text"
                id="nombre"
                {...register("nombre")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ej: Sala de Terapia Individual"
              />
              {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
            </div>

            <div className="col-span-2">
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                id="descripcion"
                rows={3}
                {...register("descripcion")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe el espacio y sus características..."
              />
              {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>}
            </div>

            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                Precio por hora *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="precio"
                  step="0.01"
                  min="0"
                  {...register("precio", { valueAsNumber: true })}
                  className="mt-1 block w-full pl-7 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
              {errors.precio && <p className="mt-1 text-sm text-red-600">{errors.precio.message}</p>}
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                URL de Imagen
              </label>
              <input
                type="url"
                id="imageUrl"
                {...register("imageUrl")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
            </div>
          </div>

          {/* Estado activo/inactivo */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-700">Estado del cubículo</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {activeValue ? "El cubículo estará disponible para reservas" : "El cubículo no estará disponible"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setValue("active", !activeValue)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                activeValue ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                activeValue ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          </div>

          {/* Características */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Características</label>
              {selectedCaracteristicas.length > 0 && (
                <span className="text-xs text-blue-600 font-medium">
                  {selectedCaracteristicas.length} seleccionada{selectedCaracteristicas.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {caracteristicas.map((caracteristica) => {
                  const isSelected = selectedCaracteristicas.includes(caracteristica.id);
                  return (
                    <button
                      key={caracteristica.id}
                      type="button"
                      onClick={() => handleCaracteristicaToggle(caracteristica.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                      }`}
                    >
                      {isSelected && (
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {getCaracteristicaNombre(caracteristica.nombre)}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-400">Haz clic para seleccionar o deseleccionar</p>
          </div>

          {/* Disponibilidad inline — solo al crear */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horarios de disponibilidad
              </label>
              <DisponibilidadInlineEditor
                value={disponibilidades}
                onChange={setDisponibilidades}
              />
            </div>
          )}
        </>
      )}

      {/* ── Pestaña disponibilidad (solo edición) ──────────────────────── */}
      {isEditing && activeTab === "disponibilidad" && cubiculo && (
        <DisponibilidadManager cubiculoId={cubiculo.id} />
      )}

      {/* Botones — siempre visibles excepto en tab disponibilidad */}
      {(!isEditing || activeTab === "info") && (
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </button>
        </div>
      )}
    </form>
  );
};
