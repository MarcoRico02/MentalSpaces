import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, X } from "lucide-react";
import { Label, Input, Button } from "../ui";
import {
  locationCreateSchema,
  type LocationCreateFormData,
} from "../../../core/dominio/tipos/schemas";
import type { LocationResponseDTO } from "../../../core/dominio/tipos/api";
import { LocationMapPicker } from "./LocationMapPicker";

interface LocationFormProps {
  location?: LocationResponseDTO;
  onSubmit: (data: LocationCreateFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const LocationForm: React.FC<LocationFormProps> = ({
  location,
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [showMap, setShowMap] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<LocationCreateFormData>({
    resolver: zodResolver(locationCreateSchema),
    mode: "onChange",
    defaultValues: location
      ? {
          name: location.name,
          description: location.description || "",
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
          imageUrl: location.imageUrl || "",
        }
      : { imageUrl: "" },
  });

  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const imageUrlValue = watch("imageUrl");

  const handleMapLocationSelect = (locationData: {
    lat: number;
    lng: number;
    address?: string;
  }) => {
    setValue("latitude", locationData.lat);
    setValue("longitude", locationData.lng);
    if (locationData.address) {
      setValue("address", locationData.address);
    }
    setShowMap(false);
  };

  const onFormSubmit = (data: LocationCreateFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre de la locación</Label>
        <Input
          id="name"
          type="text"
          placeholder="Consultorio Central"
          {...register("name")}
          disabled={isLoading}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Descripción (opcional)</Label>
        <textarea
          id="description"
          rows={3}
          placeholder="Descripción detallada de la locación..."
          {...register("description")}
          disabled={isLoading}
          className={`w-full px-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.description ? "border-red-500" : ""
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Campo de imagen */}
      <div>
        <Label htmlFor="imageUrl">URL de imagen de referencia (opcional)</Label>
        <div className="space-y-2">
          <Input
            id="imageUrl"
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg"
            {...register("imageUrl")}
            disabled={isLoading}
            className={errors.imageUrl ? "border-red-500" : ""}
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
          )}
          {/* Preview de imagen */}
          {imageUrlValue && !errors.imageUrl ? (
            <div className="relative rounded-lg overflow-hidden border border-default h-40">
              <img
                src={imageUrlValue}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setValue("imageUrl", "");
                }}
                className="absolute top-2 right-2 bg-surface rounded-full p-1 shadow hover:bg-surface-2"
              >
                <X className="h-4 w-4 text-secondary" />
              </button>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-default h-24 flex items-center justify-center text-muted-foreground gap-2">
              <ImageIcon className="h-5 w-5" />
              <span className="text-sm">Vista previa de la imagen</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          type="text"
          placeholder="Ej: Avenida Juárez 2345, Ciudad de México"
          {...register("address")}
          disabled={isLoading}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitud</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="19.4326"
            {...register("latitude", { valueAsNumber: true })}
            disabled={isLoading}
            className={errors.latitude ? "border-red-500" : ""}
          />
          {errors.latitude && (
            <p className="text-red-500 text-sm mt-1">
              {errors.latitude.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="longitude">Longitud</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="-99.1332"
            {...register("longitude", { valueAsNumber: true })}
            disabled={isLoading}
            className={errors.longitude ? "border-red-500" : ""}
          />
          {errors.longitude && (
            <p className="text-red-500 text-sm mt-1">
              {errors.longitude.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowMap(!showMap)}
          disabled={isLoading}
        >
          {showMap ? "Ocultar mapa" : "Seleccionar en mapa"}
        </Button>
        {latitude && longitude && (
          <span className="text-sm text-secondary">
            Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </span>
        )}
      </div>

      {showMap && (
        <div className="border border-default rounded-lg p-4 bg-app">
          <div className="text-center text-secondary mb-2">
            🗺️ Seleccionar ubicación en mapa
          </div>
          <LocationMapPicker
            value={
              latitude && longitude
                ? { lat: latitude, lng: longitude }
                : undefined
            }
            onChange={handleMapLocationSelect}
            height="400px"
          />
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || !isValid}
          className="flex-1"
        >
          {isLoading
            ? "Guardando..."
            : location
              ? "Actualizar locación"
              : "Crear locación"}
        </Button>
      </div>
    </form>
  );
};
