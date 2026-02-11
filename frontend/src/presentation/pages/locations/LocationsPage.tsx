import React, { useState } from "react";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { useLocationsQuery } from "../../../core/aplicacion/hooks/useLocationQueries";
import {
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useActivateLocationMutation,
  useDeactivateLocationMutation,
} from "../../../core/aplicacion/hooks/useLocationMutations";
import { LocationCard } from "../../components/locations/LocationCard";
import { LocationModal } from "../../components/locations/LocationModal";
import { Button } from "../../components/ui";
import type {
  LocationCreateRequestDTO,
  LocationResponseDTO,
} from "../../../core/dominio/tipos/api";
import type { LocationCreateFormData } from "../../../core/dominio/tipos/schemas";

export const LocationsPage: React.FC = () => {
  const { isPropietario } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<
    LocationResponseDTO | undefined
  >();

  const { data: locations, isLoading: isLoadingLocations } =
    useLocationsQuery();
  const createMutation = useCreateLocationMutation();
  const updateMutation = useUpdateLocationMutation(editingLocation?.id || 0);
  const activateMutation = useActivateLocationMutation();
  const deactivateMutation = useDeactivateLocationMutation();

  if (!isPropietario()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Restringido
          </h1>
          <p className="text-gray-600">
            Esta función está disponible solo para propietarios.
          </p>
        </div>
      </div>
    );
  }

  const handleCreateLocation = (form: LocationCreateFormData) => {
    const payload: LocationCreateRequestDTO = {
      name: form.name,
      description: form.description?.trim() ? form.description.trim() : undefined,
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

  const handleUpdateLocation = (form: LocationCreateFormData) => {
    if (!editingLocation) return;

    const payload: LocationCreateRequestDTO = {
      name: form.name,
      description: form.description?.trim() ? form.description.trim() : undefined,
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        setEditingLocation(undefined);
        setShowForm(false);
      },
    });
  };

  const handleEditLocation = (location: LocationResponseDTO) => {
    setEditingLocation(location);
    setShowForm(true);
  };

  const handleToggleActive = (id: number) => {
    const location = locations?.find((l) => l.id === id);
    if (location?.active) {
      deactivateMutation.mutate(id);
    } else {
      activateMutation.mutate(id);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingLocation(undefined);
  };

  const activeLocations = locations?.filter((l) => l.active) || [];
  const inactiveLocations = locations?.filter((l) => !l.active) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestionar Locaciones
              </h1>
              <p className="mt-2 text-gray-600">
                Administra tus locaciones físicas donde se ofrecerán los
                servicios de consulta.
              </p>
            </div>
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                disabled={isLoadingLocations}
              >
                Nueva Locación
              </Button>
            )}
          </div>
        </div>

        {showForm && (
          <LocationModal
            isOpen={showForm}
            onClose={handleCancelForm}
            location={editingLocation}
            onSubmit={
              editingLocation ? handleUpdateLocation : handleCreateLocation
            }
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        )}

        {isLoadingLocations ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando locaciones...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Locations */}
            {activeLocations.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Locaciones Activas ({activeLocations.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeLocations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      onEdit={handleEditLocation}
                      onToggleActive={handleToggleActive}
                      isLoading={
                        activateMutation.isPending ||
                        deactivateMutation.isPending
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Inactive Locations */}
            {inactiveLocations.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Locaciones Inactivas ({inactiveLocations.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inactiveLocations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      onEdit={handleEditLocation}
                      onToggleActive={handleToggleActive}
                      isLoading={
                        activateMutation.isPending ||
                        deactivateMutation.isPending
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!showForm && locations?.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay locaciones registradas
                </h3>
                <p className="text-gray-600 mb-4">
                  Comienza agregando tu primera locación para poder ofrecer
                  consultorios.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  Crear Primera Locación
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
