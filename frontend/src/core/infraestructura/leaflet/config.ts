// Configuración para Leaflet + OpenStreetMap
export const LEAFLET_CONFIG = {
  // Centro predeterminado: Ciudad de México
  defaultCenter: [19.4326, -99.1332] as [number, number],
  defaultZoom: 13,
  minZoom: 3,
  maxZoom: 18,

  // OpenStreetMap tiles (gratuitos)
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

  // Estilo del mapa
  tileSize: 256,
  updateWhenIdle: true,
  updateWhenZooming: true,
};

// User-Agent para Nominatim (requerido)
export const NOMINATIM_HEADERS = {
  "User-Agent": "MentalSpaces/1.0 (localhost:5175; contact@example.com)",
  Accept: "application/json",
};

// Configuración del rate limiting para Nominatim
export const NOMINATIM_RATE_LIMIT = {
  minInterval: 1000, // 1 segundo entre requests
  maxRetries: 3,
};

// Configuración de caché
export const CACHE_CONFIG = {
  ttl: 86400000, // 24 horas en milisegundos
  maxSize: 1000,
};

// Importamos Leaflet dinámicamente
import L from "leaflet";

// Icono personalizado para marcadores
export const createCustomMarkerIcon = (color = "#ef4444") => {
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 18.4 5.6 24 12.5 24C19.4 24 25 18.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}"/>
        <path d="M12.5 2C6.7 2 2 6.7 2 12.5C2 18.3 6.7 23 12.5 23C18.3 23 23 18.3 23 12.5C23 6.7 18.3 2 12.5 2Z" fill="white"/>
        <circle cx="12.5" cy="12.5" r="6" fill="${color}"/>
      </svg>
    `)}`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41] as [number, number],
    iconAnchor: [12, 41] as [number, number],
    popupAnchor: [1, -34] as [number, number],
    shadowSize: [41, 41] as [number, number],
  });
};
