/**
 * Custom hook for geolocation handling
 * Provides automatic location detection and reverse geocoding
 */

import { useState, useCallback } from "react";

export interface LocationData {
  city: string;
  state: string;
  pincode: string;
  country: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface NominatimReverse {
  lat: string;
  lon: string;
  address: {
    postcode?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
  };
  display_name: string;
}

interface NominatimForward {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    postcode?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

export function useLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);

  /**
   * Get current browser location using Geolocation API
   */
  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      return new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position.coords);
          },
          (err) => {
            reject(new Error(err.message || "Failed to get location"));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to get current location";
      setError(errorMsg);
      throw err;
    }
  }, []);

  /**
   * Reverse geocode coordinates to address
   * Uses Nominatim (OpenStreetMap) - Free, no API key required
   */
  const reverseGeocode = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          throw new Error("Failed to reverse geocode coordinates");
        }

        const data = await response.json() as NominatimReverse;

        if (!data.address) {
          throw new Error("No address found for these coordinates");
        }

        const locationData = extractLocationFromNominatim(
          data,
          latitude,
          longitude
        );

        setLocation(locationData);
        return locationData;
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to reverse geocode location";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Geocode address to coordinates
   * Uses Nominatim (OpenStreetMap) - Free, no API key required
   */
  const geocodeAddress = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );

      if (!response.ok) {
        throw new Error("Failed to geocode address");
      }

      const data = await response.json() as NominatimForward[];

      if (!data || data.length === 0) {
        throw new Error("Address not found");
      }

      const result = data[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);

      if (isNaN(lat) || isNaN(lon)) {
        throw new Error("Invalid coordinates from geocoding");
      }

      const locationData = extractLocationFromNominatim(result, lat, lon);
      setLocation(locationData);
      return locationData;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to geocode address";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Detect location automatically using browser geolocation
   * Then reverse geocode the coordinates
   */
  const detectLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const coords = await getCurrentLocation();
      const locationData = await reverseGeocode(coords.latitude, coords.longitude);
      return locationData;
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to detect location";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCurrentLocation, reverseGeocode]);

  /**
   * Clear location data
   */
  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return {
    location,
    loading,
    error,
    detectLocation,
    geocodeAddress,
    reverseGeocode,
    getCurrentLocation,
    clearLocation,
  };
}

/**
 * Extract location data from Nominatim response
 */
function extractLocationFromNominatim(
  data: NominatimReverse | NominatimForward,
  latitude: number,
  longitude: number
): LocationData {
  const address = data.address || {};

  // Extract location fields from Nominatim response
  const city = address.city || address.county || "";
  const state = address.state || "";
  const country = address.country || "";
  const pincode = address.postcode || "";
  const displayName = data.display_name || "";

  return {
    city,
    state,
    pincode,
    country,
    address: displayName,
    coordinates: {
      latitude,
      longitude,
    },
  };
}

/**
 * Format location data for display
 */
export function formatLocation(locationData: LocationData): string {
  const parts = [];
  if (locationData.city) parts.push(locationData.city);
  if (locationData.state) parts.push(locationData.state);
  if (locationData.pincode) parts.push(locationData.pincode);
  if (locationData.country) parts.push(locationData.country);
  return parts.join(", ");
}

/**
 * Validate location data
 * A location is valid if it has coordinates and at least an address
 */
export function isValidLocation(locationData: LocationData | null): boolean {
  if (!locationData) return false;
  // Valid if we have coordinates and either an address or at least one location detail
  return Boolean(
    locationData.coordinates &&
      (locationData.address || 
       locationData.city || 
       locationData.state || 
       locationData.country)
  );
}
