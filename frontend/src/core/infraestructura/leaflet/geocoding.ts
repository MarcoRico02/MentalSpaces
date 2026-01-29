// Cliente de geocoding real sin mock (usando proxy)
import {
  NOMINATIM_HEADERS,
  NOMINATIM_RATE_LIMIT,
  CACHE_CONFIG,
} from "./config";

interface CacheItem {
  data: string;
  timestamp: number;
}

class GeocodingCache {
  private cache = new Map<string, CacheItem>();
  private readonly maxSize = CACHE_CONFIG.maxSize;
  private readonly ttl = CACHE_CONFIG.ttl;

  get(key: string): string | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key: string, data: string): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

class RateLimitedGeocoder {
  private lastRequest = 0;
  private readonly minInterval = NOMINATIM_RATE_LIMIT.minInterval;
  private cache = new GeocodingCache();

  private getCacheKey(lat: number, lng: number): string {
    return `${lat.toFixed(4)},${lng.toFixed(4)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    // Verificar caché primero
    const cacheKey = this.getCacheKey(lat, lng);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;

    if (timeSinceLastRequest < this.minInterval) {
      await this.delay(this.minInterval - timeSinceLastRequest);
    }

    this.lastRequest = Date.now();

    try {
      // Usar endpoint relativo para que el proxy lo maneje
      const url = `/nominatim/reverse?format=json&lat=${lat}&lon=${lng}`;
      const response = await fetch(url, {
        method: "GET",
        headers: NOMINATIM_HEADERS,
      });

      if (!response.ok) {
        if (response.status === 404) {
          return "Ubicación no encontrada";
        }
        if (response.status === 429) {
          return "Servicio temporalmente no disponible. Intenta más tarde.";
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const address = data.display_name || "Dirección no encontrada";

      // Guardar en caché
      this.cache.set(cacheKey, address);

      return address;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return "";
    }
  }
}

// Singleton instance
export const geocodingService = new RateLimitedGeocoder();

// Funciones exportadas para uso fácil
export const reverseGeocode = (lat: number, lng: number): Promise<string> => {
  return geocodingService.reverseGeocode(lat, lng);
};
