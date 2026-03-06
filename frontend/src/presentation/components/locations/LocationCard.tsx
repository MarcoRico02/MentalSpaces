import React from "react";
import { MapPin, Edit, Power, PowerOff } from "lucide-react";
import type { LocationResponseDTO } from "../../../core/dominio/tipos/api";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../ui";

interface LocationCardProps {
  location: LocationResponseDTO;
  onEdit: (location: LocationResponseDTO) => void;
  onToggleActive: (id: number) => void;
  isLoading?: boolean;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=60";

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onEdit,
  onToggleActive,
  isLoading = false,
}) => {
  const imageUrl = location.imageUrl || DEFAULT_IMAGE;

  return (
    <Card className="overflow-hidden">
      {/* Imagen con degradado y nombre superpuesto */}
      <div
        className="h-44 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div
          className="h-full w-full bg-linear-to-t from-black/70 via-black/20 to-transparent p-4 flex flex-col justify-between"
        >
          {/* Badge estado */}
          <div className="flex justify-end">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                location.active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {location.active ? "Activa" : "Inactiva"}
            </span>
          </div>
          {/* Nombre y dirección */}
          <div className="text-white">
            <div className="text-xl font-bold drop-shadow">
              {location.name}
            </div>
            <div className="text-sm opacity-90 flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{location.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <CardHeader>
        <CardTitle>Acerca de la locación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {location.description ? (
          <p className="text-sm text-secondary line-clamp-2">
            {location.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Sin descripción</p>
        )}

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="secondary"
            onClick={() => onEdit(location)}
            disabled={isLoading}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            variant={location.active ? "danger" : "primary"}
            onClick={() => onToggleActive(location.id)}
            disabled={isLoading}
            className="flex-1"
          >
            {location.active ? (
              <>
                <PowerOff className="h-4 w-4 mr-1" />
                Desactivar
              </>
            ) : (
              <>
                <Power className="h-4 w-4 mr-1" />
                Activar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
