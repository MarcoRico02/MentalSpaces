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
} from "../../../core/dominio/tipos/api";

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
    },
  });

  const selectedCaracteristicas = watch("caracteristicasIds") || [];

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
        });
        toast.success("Cubículo creado exitosamente");
      }
      onSuccess();
      reset();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al guardar el cubículo";
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Campos básicos */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="col-span-2">
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre del Cubículo *
          </label>
          <input
            type="text"
            id="nombre"
            {...register("nombre")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ej: Sala de Terapia Individual"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            rows={3}
            {...register("descripcion")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe el espacio y sus características..."
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600">
              {errors.descripcion.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="precio"
            className="block text-sm font-medium text-gray-700"
          >
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
          {errors.precio && (
            <p className="mt-1 text-sm text-red-600">{errors.precio.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            URL de Imagen
          </label>
          <input
            type="url"
            id="imageUrl"
            {...register("imageUrl")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">
              {errors.imageUrl.message}
            </p>
          )}
        </div>
      </div>

      {/* Características */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Características
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {caracteristicas.map((caracteristica) => (
            <label
              key={caracteristica.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCaracteristicas.includes(caracteristica.id)}
                onChange={() => handleCaracteristicaToggle(caracteristica.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                {getCaracteristicaNombre(caracteristica.nombre)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
    </form>
  );
};
