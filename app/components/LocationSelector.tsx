/**
 * Location Selector Component
 * Handles location input with auto-detection and geocoding
 */

import React, { useCallback, useEffect, useState } from "react";
import { useLocation, LocationData, formatLocation, isValidLocation } from "@/lib/use-location";
import { toast } from "react-toastify";

interface LocationSelectorProps {
  onLocationChange: (location: LocationData | null) => void;
  initialLocation?: LocationData | null;
  required?: boolean;
}

export default function LocationSelector({
  onLocationChange,
  initialLocation = null,
  required = true,
}: LocationSelectorProps) {
  const { location, loading, error, detectLocation, geocodeAddress, clearLocation } = useLocation();
  const [manualLocation, setManualLocation] = useState<LocationData | null>(null);
  const [autoEditedLocation, setAutoEditedLocation] = useState<LocationData | null>(null);
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const initializedRef = React.useRef(false);
  const lastSentLocationRef = React.useRef<string | null>(null);

  // Helper to serialize location for comparison
  const serializeLocation = (loc: LocationData | null): string => {
    if (!loc) return "null";
    return JSON.stringify({
      city: loc.city,
      state: loc.state,
      pincode: loc.pincode,
      country: loc.country,
      address: loc.address,
      coordinates: loc.coordinates,
    });
  };

  // Initialize with provided location - only on mount
  useEffect(() => {
    if (!initializedRef.current && initialLocation && isValidLocation(initialLocation)) {
      // If user already has a location, show the form directly with their existing data
      setManualLocation(initialLocation);
      setShowAddressInput(true);
      lastSentLocationRef.current = serializeLocation(initialLocation);
      initializedRef.current = true;
    }
  }, []);

  // Handle auto-detected location
  useEffect(() => {
    if (location && isValidLocation(location)) {
      // Initialize autoEditedLocation with detected location
      if (!autoEditedLocation) {
        setAutoEditedLocation(location);
      }
      setLocalError(null);
    }
  }, [location, autoEditedLocation]);

  // Call parent only when manualLocation meaningfully changes
  useEffect(() => {
    if (manualLocation && isValidLocation(manualLocation)) {
      const serialized = serializeLocation(manualLocation);
      if (serialized !== lastSentLocationRef.current) {
        onLocationChange(manualLocation);
        lastSentLocationRef.current = serialized;
      }
    }
  }, [manualLocation]);

  // Call parent only when autoEditedLocation meaningfully changes
  useEffect(() => {
    if (autoEditedLocation && isValidLocation(autoEditedLocation)) {
      const serialized = serializeLocation(autoEditedLocation);
      if (serialized !== lastSentLocationRef.current) {
        onLocationChange(autoEditedLocation);
        lastSentLocationRef.current = serialized;
      }
    }
  }, [autoEditedLocation]);

  /**
   * Handle Enter Manually - Create empty location form
   */
  const handleEnterManually = () => {
    setShowAddressInput(true);
    setLocalError(null);
    // Create empty location object for form display
    const emptyLocation: LocationData = {
      city: "",
      state: "",
      pincode: "",
      country: "",
      address: "",
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    };
    setManualLocation(emptyLocation);
    onLocationChange(emptyLocation);
  };

  /**
   * Handle auto-detect location
   */
  const handleDetectLocation = async () => {
    setLocalError(null);
    try {
      await detectLocation();
      toast.success("Location detected successfully!");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to detect location";
      setLocalError(errorMsg);
      toast.error(errorMsg);
    }
  };

  /**
   * Handle location field update
   */
  const handleLocationUpdate = useCallback(
    (field: keyof LocationData, value: string) => {
      if (showAddressInput && manualLocation) {
        // Update manual location
        const updatedLocation = { ...manualLocation, [field]: value };
        setManualLocation(updatedLocation);
        onLocationChange(updatedLocation);
      } else if (autoEditedLocation) {
        // Update auto-detected location
        const updatedLocation = { ...autoEditedLocation, [field]: value };
        setAutoEditedLocation(updatedLocation);
        onLocationChange(updatedLocation);
      }
    },
    [autoEditedLocation, manualLocation, showAddressInput, onLocationChange]
  );

  /**
   * Clear location
   */
  const handleClearLocation = () => {
    clearLocation();
    setManualLocation(null);
    setAutoEditedLocation(null);
    onLocationChange(null);
    setShowAddressInput(false);
    setLocalError(null);
  };

  // Get current location (either from auto or manual)
  const currentLocation = showAddressInput ? manualLocation : autoEditedLocation;
  const hasLocationSelected = (currentLocation && isValidLocation(currentLocation)) || showAddressInput;

  return (
    <div className="space-y-4">
      {/* STEP 1: Show Buttons (No location selected yet) */}
      {!hasLocationSelected && (
        <div className="space-y-3">



          {/* Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Detecting your location...
                </>
              ) : (
                <>
                  <span>📍</span>
                  Auto Detect My Location
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleEnterManually}
              className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Enter Manually
            </button>
          </div>

          {/* Error Message */}
          {(localError || error) && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">
                ✗ {localError || error}
              </p>
              <p className="text-xs text-red-600 dark:text-red-500">
                You can try again or click "Enter Manually" to add your address manually
              </p>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Show Form (Location selected - either auto or manual) */}
      {hasLocationSelected && (
        <div className="space-y-4">
          {/* Green Success Box - Only for Auto-Detected */}
          {autoEditedLocation && !showAddressInput && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-green-700 dark:text-green-300 uppercase tracking-wide mb-2">
                    ✓ Location Detected Successfully
                  </p>
                  {autoEditedLocation.address && (
                    <p className="text-base font-semibold text-green-900 dark:text-green-100 wrap-break-word mb-2">
                      {autoEditedLocation.address}
                    </p>
                  )}
                  <p className="text-xs text-green-700 dark:text-green-400 font-semibold">
                    📍 {formatLocation(autoEditedLocation) || "Location coordinates obtained"}
                  </p>
                  {autoEditedLocation.coordinates && (
                    <p className="text-xs text-green-600 dark:text-green-500 mt-2 font-mono">
                      Lat: {autoEditedLocation.coordinates.latitude.toFixed(4)}, Lon: {autoEditedLocation.coordinates.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Editable Location Form - Same for both Auto and Manual */}
          <div className="space-y-3 p-4 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                  <span>✏️</span>
                  {showAddressInput && !initialLocation ? "Enter Location Details" : "Edit Location Details (Optional)"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 italic mt-1">
                  {showAddressInput && !initialLocation
                    ? "Fill in your location details below"
                    : "Your existing address is shown below. You can edit any field or get a new address."}
                </p>
              </div>
              {initialLocation && (
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={loading}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold text-xs whitespace-nowrap transition-colors flex items-center gap-1"
                >
                  {loading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Detecting...
                    </>
                  ) : (
                    <>
                      <span>🔄</span>
                      Get New Address
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* City */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={currentLocation?.city || ""}
                  onChange={(e) => handleLocationUpdate("city", e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  value={currentLocation?.state || ""}
                  onChange={(e) => handleLocationUpdate("state", e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={currentLocation?.pincode || ""}
                  onChange={(e) => handleLocationUpdate("pincode", e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={currentLocation?.country || ""}
                  onChange={(e) => handleLocationUpdate("country", e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Full Address Textarea */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Full Address
              </label>
              <textarea
                value={currentLocation?.address || ""}
                onChange={(e) => handleLocationUpdate("address", e.target.value)}
                rows={3}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="e.g., 123 Main Street, Apt 4B, Building A"
              />
            </div>

            {/* Coordinates Display - Only for Auto-Detected */}
            {autoEditedLocation && !showAddressInput && (
              <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded border border-gray-300 dark:border-gray-600">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  📍 Coordinates (Auto-filled from Detection)
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  Latitude: {autoEditedLocation.coordinates.latitude.toFixed(6)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  Longitude: {autoEditedLocation.coordinates.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
