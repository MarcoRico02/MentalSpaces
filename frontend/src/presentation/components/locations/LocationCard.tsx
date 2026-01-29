import React from "react";
import type { LocationResponseDTO } from "../../../core/dominio/tipos/api";
import { Button } from "../ui";

interface LocationCardProps {
  location: LocationResponseDTO;
  onEdit: (location: LocationResponseDTO) => void;
  onToggleActive: (id: number) => void;
  isLoading?: boolean;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onEdit,
  onToggleActive,
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {location.name}
          </h3>
          <p className="text-sm text-gray-600">{location.address}</p>
        </div>
        <div className="flex items-center space-x-2">
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
      </div>

      {location.description && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {location.description}
        </p>
      )}

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
      </div>

      <div className="flex space-x-2 pt-4 border-t border-gray-100">
        <Button
          variant="secondary"
          onClick={() => onEdit(location)}
          disabled={isLoading}
          className="flex-1"
        >
          Editar
        </Button>
        <Button
          variant={location.active ? "danger" : "primary"}
          onClick={() => onToggleActive(location.id)}
          disabled={isLoading}
          className="flex-1"
        >
          {location.active ? "Desactivar" : "Activar"}
        </Button>
      </div>
    </div>
  );
};
