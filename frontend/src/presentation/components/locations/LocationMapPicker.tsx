import React, { useState, useCallback, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LocateFixed, Loader2 } from "lucide-react";
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

// Componente interno que consume el contexto del mapa para volar a una posición
const FlyToLocation: React.FC<{ position: [number, number] | null }> = ({ position }) => {
  const map = useMap();
  const prevPosition = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (
      position &&
      (prevPosition.current?.[0] !== position[0] ||
        prevPosition.current?.[1] !== position[1])
    ) {
      map.flyTo(position, 13, { animate: true, duration: 1.2 });
      prevPosition.current = position;
    }
  }, [position, map]);

  return null;
};

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  value,
  onChange,
  height = "400px",
  disabled = false,
}) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const customIcon = createCustomMarkerIcon("#ef4444");

  // ── Geocodifica y notifica al padre ──────────────────────────────────────
  const resolveAndNotify = useCallback(
    async (lat: number, lng: number) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const addr = await reverseGeocode(lat, lng);
        setAddress(addr);
        onChange({ lat, lng, address: addr });
      } catch {
        onChange({ lat, lng, address: "Error al obtener dirección" });
      } finally {
        setIsLoading(false);
      }
    },
    [onChange],
  );

  // ── Clic en el mapa ───────────────────────────────────────────────────────
  const handleMapClick = useCallback(
    async (e: any) => {
      if (disabled) return;
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      await resolveAndNotify(lat, lng);
    },
    [disabled, resolveAndNotify],
  );

  // ── Arrastrar marcador ────────────────────────────────────────────────────
  const handleDragEnd = useCallback(
    async (e: any) => {
      if (disabled) return;
      const { lat, lng } = e.target.getLatLng();
      setMarkerPosition([lat, lng]);
      await resolveAndNotify(lat, lng);
    },
    [disabled, resolveAndNotify],
  );

  // ── Botón "Mi ubicación" ──────────────────────────────────────────────────
  const handleLocateMe = useCallback(async () => {
    if (isLocating || disabled) return;
    setIsLocating(true);

    const centerMap = (lat: number, lng: number) => {
      setFlyTo([lat, lng]);
      setIsLocating(false);
    };

    const fallbackToIP = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.latitude && data.longitude) {
          centerMap(data.latitude, data.longitude);
        } else {
          setIsLocating(false);
        }
      } catch {
        setIsLocating(false);
      }
    };

    if (!navigator.geolocation) {
      await fallbackToIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => centerMap(pos.coords.latitude, pos.coords.longitude),
      async () => await fallbackToIP(),
      { timeout: 8000, enableHighAccuracy: false },
    );
  }, [isLocating, disabled]);

  // ── Sincronizar value externo ─────────────────────────────────────────────
  useEffect(() => {
    if (value?.lat && value?.lng) {
      setMarkerPosition([value.lat, value.lng]);
      if (value.address) setAddress(value.address);
    }
  }, [value]);

  return (
    <div className="w-full">
      <div className="relative rounded-lg overflow-hidden border border-gray-300">
        {/* Indicador de carga geocoding */}
        {isLoading && (
          <div className="absolute top-4 right-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-md flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            <span className="text-sm text-gray-600">Obteniendo ubicación...</span>
          </div>
        )}

        {/* Botón Mi ubicación */}
        {!disabled && (
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            title="Centrar mapa en mi ciudad"
            className="absolute bottom-4 right-4 z-[1000] bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg shadow-md flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            {isLocating ? "Localizando..." : "Mi ubicación"}
          </button>
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

          <FlyToLocation position={flyTo} />

          {markerPosition && (
            <Marker
              position={markerPosition}
              icon={customIcon as any}
              draggable={!disabled}
              eventHandlers={{ dragend: handleDragEnd }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold mb-2">Ubicación Seleccionada</div>
                  <div className="space-y-1">
                    <div><strong>Latitud:</strong> {markerPosition[0]?.toFixed(6)}</div>
                    <div><strong>Longitud:</strong> {markerPosition[1]?.toFixed(6)}</div>
                    {address && (
                      <div>
                        <strong>Dirección:</strong>
                        <div className="text-xs text-gray-600 mt-1">{address}</div>
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
            <div className="font-semibold text-blue-900 mb-1">Ubicación Seleccionada:</div>
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
          <div className="font-semibold mb-1">📍 Cómo seleccionar ubicación:</div>
          <ul className="space-y-1 text-xs">
            <li>• Haz clic en <strong>Mi ubicación</strong> para centrar el mapa donde estás</li>
            <li>• O haz clic en cualquier punto del mapa</li>
            <li>• Arrastra el marcador rojo para ajustar con precisión</li>
            <li>• Las coordenadas se sincronizan automáticamente con el formulario</li>
          </ul>
        </div>
      )}

      {disabled && (
        <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          El mapa está deshabilitado. Modifica las coordenadas manualmente.
        </div>
      )}
    </div>
  );
};
