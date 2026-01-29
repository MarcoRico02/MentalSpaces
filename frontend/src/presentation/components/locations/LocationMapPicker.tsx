import React, { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  LEAFLET_CONFIG,
  createCustomMarkerIcon,
} from "../../../core/infraestructura/leaflet/config";
import { reverseGeocode } from "../../../core/infraestructura/leaflet/geocoding";

interface LocationMapPickerProps {
  value?: {
    lat: number;
    lng: number;
    address?: string;
  };
  onChange: (location: { lat: number; lng: number; address?: string }) => void;
  height?: string;
  disabled?: boolean;
}

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  value,
  onChange,
  height = "400px",
  disabled = false,
}) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null,
  );
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const customIcon = createCustomMarkerIcon("#ef4444");

  const handleMapClick = useCallback(
    async (e: any) => {
      if (disabled) return;

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setMarkerPosition([lat, lng]);
      setIsLoading(true);

      try {
        // Simpre usar mock para evitar CORS
        await new Promise((resolve) => setTimeout(resolve, 200));
        const mockAddress = await reverseGeocode(lat, lng);

        onChange({ lat, lng, address: mockAddress });
      } catch (error) {
        console.error("Geocoding failed:", error);
        onChange({
          lat,
          lng,
          address: "Error al obtener dirección",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [onChange, disabled],
  );

  const handleDragEnd = useCallback(
    async (e: any) => {
      if (disabled) return;

      const marker = e.target;
      const position = marker.getLatLng();
      const lat = position.lat;
      const lng = position.lng;
      setMarkerPosition([lat, lng]);
      setIsLoading(true);

      try {
        // Simpre usar mock para evitar CORS
        await new Promise((resolve) => setTimeout(resolve, 200));
        const mockAddress = await reverseGeocode(lat, lng);

        onChange({ lat, lng, address: mockAddress });
      } catch (error) {
        console.error("Geocoding failed:", error);
        onChange({
          lat,
          lng,
          address: "Error al obtener dirección",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [onChange, disabled],
  );

  // Actualizar cuando el value externo cambia
  useEffect(() => {
    if (value && value.lat && value.lng) {
      setMarkerPosition([value.lat, value.lng]);
      if (value.address) {
        setAddress(value.address);
      }
    }
  }, [value]);

  return (
    <div className="w-full">
      {/* Mapa */}
      <div className="relative rounded-lg overflow-hidden border border-gray-300">
        {isLoading && (
          <div className="absolute top-4 right-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-md flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">
              Obteniendo ubicación...
            </span>
          </div>
        )}

        <MapContainer
          center={markerPosition || LEAFLET_CONFIG.defaultCenter}
          zoom={markerPosition ? 15 : LEAFLET_CONFIG.defaultZoom}
          style={{ height, width: "100%" }}
          className="z-10"
          ref={(map: any) => {
            if (map && !disabled) {
              map.on("click", handleMapClick);
            }
          }}
        >
          <TileLayer
            url={LEAFLET_CONFIG.tileUrl}
            attribution={LEAFLET_CONFIG.attribution}
          />

          {markerPosition && (
            <Marker
              position={markerPosition}
              icon={customIcon as any}
              draggable={!disabled}
              eventHandlers={{
                dragend: handleDragEnd,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold mb-2">
                    Ubicación Seleccionada
                  </div>
                  <div className="space-y-1">
                    <div>
                      <strong>Latitud:</strong> {markerPosition[0]?.toFixed(6)}
                    </div>
                    <div>
                      <strong>Longitud:</strong> {markerPosition[1]?.toFixed(6)}
                    </div>
                    {address && (
                      <div>
                        <strong>Dirección:</strong>
                        <div className="text-xs text-gray-600 mt-1">
                          {address}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Información de la ubicación seleccionada */}
      {(markerPosition || address) && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm">
            <div className="font-semibold text-blue-900 mb-1">
              Ubicación Seleccionada:
            </div>
            {markerPosition && (
              <div className="text-blue-700">
                <strong>Coordenadas:</strong> {markerPosition[0]?.toFixed(6)},{" "}
                {markerPosition[1]?.toFixed(6)}
              </div>
            )}
            {address && (
              <div className="text-blue-700 mt-1">
                <strong>Dirección:</strong> {address}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instrucciones */}
      {!markerPosition && !disabled && (
        <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="font-semibold mb-1">
            📍 Cómo seleccionar ubicación:
          </div>
          <ul className="space-y-1 text-xs">
            <li>• Haz clic en cualquier punto del mapa</li>
            <li>• Arrastra el marcador rojo para ajustar con precisión</li>
            <li>
              • Las coordenadas se sincronizan automáticamente con el formulario
            </li>
            <li>• Mock de geocoding generará direcciones realistas</li>
          </ul>
        </div>
      )}

      {/* Mensaje de deshabilitado */}
      {disabled && (
        <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          El mapa está deshabilitado. Modifica las coordenadas manualmente.
        </div>
      )}
    </div>
  );
};
