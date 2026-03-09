import React, { useState } from "react";
import { Plus } from "lucide-react";
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
import { PageHeader } from "../../components/common/PageHeader";
import { Button, Card, CardContent } from "../../components/ui";
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
          <h1 className="text-2xl font-bold text-default mb-4">
            Acceso Restringido
          </h1>
          <p className="text-secondary">
            Esta función está disponible solo para propietarios.
          </p>
        </div>
      </div>
    );
  }

  const handleCreateLocation = (form: LocationCreateFormData) => {
    const payload: LocationCreateRequestDTO = {
      name: form.name,
      description: form.description?.trim() || undefined,
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
      imageUrl: form.imageUrl || undefined,
    };
    createMutation.mutate(payload, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleUpdateLocation = (form: LocationCreateFormData) => {
    if (!editingLocation) return;
    const payload: LocationCreateRequestDTO = {
      name: form.name,
      description: form.description?.trim() || undefined,
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
      imageUrl: form.imageUrl || undefined,
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
    <div className="space-y-6">
      <PageHeader
        title="Mis Locaciones"
        description="Administra tus locaciones físicas donde se ofrecerán los servicios de consulta."
        right={
          <Button onClick={() => setShowForm(true)} disabled={isLoadingLocations}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Locación
          </Button>
        }
      />

      {/* Modal de creación/edición */}
      <LocationModal
        isOpen={showForm}
        onClose={handleCancelForm}
        location={editingLocation}
        onSubmit={editingLocation ? handleUpdateLocation : handleCreateLocation}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {isLoadingLocations ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-secondary">Cargando locaciones...</p>
        </div>
      ) : locations?.length === 0 ? (
        /* Estado vacío */
        <Card>
          <CardContent>
            <div className="py-16 text-center">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground mb-4"
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
              <h3 className="text-lg font-medium text-default mb-2">
                No hay locaciones registradas
              </h3>
              <p className="text-secondary mb-6">
                Comienza agregando tu primera locación para poder ofrecer consultorios.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Locación
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Locaciones Activas */}
          {activeLocations.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-default mb-4">
                Locaciones Activas ({activeLocations.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeLocations.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    onEdit={handleEditLocation}
                    onToggleActive={handleToggleActive}
                    isLoading={
                      activateMutation.isPending || deactivateMutation.isPending
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Locaciones Inactivas */}
          {inactiveLocations.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-default mb-4">
                Locaciones Inactivas ({inactiveLocations.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {inactiveLocations.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    onEdit={handleEditLocation}
                    onToggleActive={handleToggleActive}
                    isLoading={
                      activateMutation.isPending || deactivateMutation.isPending
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
