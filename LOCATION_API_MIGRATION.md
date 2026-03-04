# Location API Migration Guide

## Migration Summary
**Status:** ✅ Complete
**Date:** 4 March 2026
**Old API:** Google Maps Geocoding API (Required API key)
**New API:** Nominatim (OpenStreetMap) - Free and open-source

---

## What Changed

### Previous Implementation
- **Dependency:** Google Maps API key required
- **Environment Variable:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (mandatory)
- **Cost:** Paid API with usage-based billing
- **Configuration:** Required setup and API key management

### New Implementation
- **Dependency:** Nominatim API (Free, no key required)
- **Environment Variable:** None
- **Cost:** Completely free
- **Configuration:** Zero setup required

---

## Key Features

### ✅ Auto-Detection
Users can click **"Auto Detect"** to automatically detect their current location using browser geolocation:
- Uses browser's native Geolocation API
- Retrieves user's latitude and longitude
- Reverse geocodes to get address details

### ✅ Manual Address Entry
Users can enter an address manually and search:
- Type full address or partial address
- Nominatim searches the OpenStreetMap database
- Returns matching addresses with coordinates

### ✅ Location Details Display
Once location is selected, users can:
- View and edit all location fields:
  - City
  - State
  - Pincode
  - Country
  - Full Address
- See coordinates (latitude/longitude) in read-only format

---

## API Endpoints Used

### 1. Reverse Geocoding
```
GET https://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}
```
Used when: User clicks "Auto Detect" location

**Response Example:**
```json
{
  "lat": "28.7041",
  "lon": "77.1025",
  "display_name": "Delhi, India",
  "address": {
    "city": "Delhi",
    "state": "Delhi",
    "postcode": "110001",
    "country": "India"
  }
}
```

### 2. Forward Geocoding
```
GET https://nominatim.openstreetmap.org/search?format=json&q={address}&limit=1
```
Used when: User enters an address manually

**Response Example:**
```json
[
  {
    "lat": "28.7041",
    "lon": "77.1025",
    "display_name": "Delhi, India",
    "address": {
      "city": "Delhi",
      "state": "Delhi",
      "postcode": "110001",
      "country": "India"
    }
  }
]
```

---

## File Changes

### 1. `/lib/use-location.ts`
**Changes:**
- ✅ Replaced `GeocodingResponse` interface with `NominatimReverse` and `NominatimForward`
- ✅ Updated `reverseGeocode()` function to use Nominatim API
- ✅ Updated `geocodeAddress()` function to use Nominatim API
- ✅ Removed all Google Maps API key checks
- ✅ Replaced `extractLocationData()` with `extractLocationFromNominatim()`

**Benefits:**
- No API key management needed
- No monthly billing concerns
- Consistent, reliable data from OpenStreetMap

### 2. `/app/components/LocationSelector.tsx`
**No changes required** - Component works seamlessly with new implementation

### 3. Registration Forms
**No changes required** - Both forms already structured correctly:
- `/app/register/ContractorRegisterForm.tsx`
- `/app/register/LabourRegisterForm.tsx`

---

## Environment Variables

### Old (Removed)
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```
❌ No longer needed

### New
✅ No environment variables required for location functionality

---

## Data Structure

All location data is stored with GeoJSON format compliance:

```typescript
location: {
  city: string;
  state: string;
  pincode: string;
  country: string;
  address: string;
  coordinates: {
    type: "Point";
    coordinates: [longitude, latitude]; // GeoJSON format
  };
}
```

---

## Browser Compatibility

Location detection works on:
- ✅ Chrome/Chromium (all versions)
- ✅ Firefox (25+)
- ✅ Safari (5+)
- ✅ Edge (all versions)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Note:** Users must grant permission to access their location when using "Auto Detect"

---

## Limitations & Considerations

### Nominatim Specifics
1. **Usage Policy:** Free tier has reasonable usage limits
2. **Response Time:** Generally fast (< 1 second)
3. **Accuracy:** Based on OpenStreetMap data (village-level accuracy in most areas)
4. **User-Agent:** Nominatim requires a `User-Agent` header in production

### Current Implementation
✅ User-Agent is automatically set by browser in fetch requests

### If Usage Becomes High
Consider:
1. **Caching:** Implement Redis for frequently searched locations
2. **Rate Limiting:** Add backend rate limiting for API requests
3. **Paid Alternative:** Migrate to self-hosted Nominatim instance

---

## Testing Checklist

- [x] Auto-detect location works
- [x] Manual address search works
- [x] Location coordinates are accurate
- [x] Location form validation works
- [x] Both registration forms accept location data
- [x] No API key errors in console

---

## Troubleshooting

### Issue: "No address found for these coordinates"
**Solution:** This is a rare edge case. Try:
- Enabling precise location (high accuracy)
- Using manual address entry instead
- Testing with a known address first

### Issue: Address search returns no results
**Solution:**
- Try a more complete address
- Try searching by city name only
- Try searching by coordinates using Auto Detect

### Issue: Location not updated after search
**Solution:**
- Clear browser cache
- Allow location permission if using Auto Detect
- Check browser console for detailed errors

---

## Production Recommendations

1. **Implement Caching:** Cache frequently searched locations to reduce API calls
2. **Add Error Boundaries:** Handle edge cases gracefully
3. **Monitor API Usage:** Track Nominatim API usage for compliance
4. **User Feedback:** Provide clear feedback during location detection

---

## References

- **Nominatim Documentation:** https://nominatim.org/release-docs/latest/
- **OpenStreetMap:** https://www.openstreetmap.org/
- **Browser Geolocation API:** https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- **GeoJSON Format:** https://geojson.org/
