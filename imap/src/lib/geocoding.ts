import { debounce } from '@/lib/utils';

export interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
  place_id: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
    road?: string;
    house_number?: string;
  };
}

export interface GeocodingError {
  error: string;
  message?: string;
}

// Geocoding service using Nominatim (OpenStreetMap)
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

export async function geocodeLocation(
  query: string,
  options?: {
    limit?: number;
    addressdetails?: boolean;
  }
): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: String(options?.addressdetails ?? true),
    limit: String(options?.limit ?? 5),
    acceptLanguage: 'zh-CN',
  });

  try {
    const response = await fetch(`${NOMINATIM_API}?${params.toString()}`, {
      headers: {
        'User-Agent': 'HandDrawnMap/1.0 (contact@handdrawnmap.app)',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.map((item: Record<string, unknown>) => ({
      lat: parseFloat(item.lat as string),
      lon: parseFloat(item.lon as string),
      display_name: item.display_name as string,
      place_id: item.place_id as number,
      address: item.address as GeocodingResult['address'],
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

// Reverse geocoding (coordinates to address)
export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<GeocodingResult | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: 'json',
    addressdetails: '1',
    acceptLanguage: 'zh-CN',
  });

  try {
    const response = await fetch(`${NOMINATIM_API.replace('/search', '/reverse')}?${params.toString()}`, {
      headers: {
        'User-Agent': 'HandDrawnMap/1.0 (contact@handdrawnmap.app)',
      },
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || data.error) {
      return null;
    }

    return {
      lat: parseFloat(data.lat as string),
      lon: parseFloat(data.lon as string),
      display_name: data.display_name as string,
      place_id: data.place_id as number,
      address: data.address as GeocodingResult['address'],
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

// Debounced geocoding for autocomplete
export function createDebouncedGeocode(
  onResults: (results: GeocodingResult[]) => void,
  onError?: (error: Error) => void,
  delay = 300
) {
  let lastQuery = '';

  const debouncedFn = debounce((query: string) => {
    if (!query || query.length < 3) {
      onResults([]);
      return;
    }

    if (query === lastQuery) return;
    lastQuery = query;

    geocodeLocation(query)
      .then(onResults)
      .catch((error: Error) => {
        onError?.(error);
      });
  }, delay);

  return debouncedFn;
}

// Format address for display
export function formatAddress(result: GeocodingResult): string {
  const parts: string[] = [];

  if (result.address?.city) {
    parts.push(result.address.city);
  } else if (result.address?.town) {
    parts.push(result.address.town);
  } else if (result.address?.village) {
    parts.push(result.address.village);
  } else if (result.address?.county) {
    parts.push(result.address.county);
  }

  if (result.address?.state && !parts[0]?.includes(result.address.state)) {
    parts.push(result.address.state);
  }

  if (result.address?.country) {
    parts.push(result.address.country);
  }

  return parts.join(', ') || result.display_name.split(',')[0];
}

// Validate coordinates
export function isValidCoordinate(lat: number, lon: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

// Parse coordinate string (e.g., "30.2741, 120.1551")
export function parseCoordinateString(input: string): { lat: number; lon: number } | null {
  // Match patterns like "30.2741, 120.1551" or "30.2741 120.1551"
  const match = input.match(/^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/);

  if (!match) return null;

  const lat = parseFloat(match[1]);
  const lon = parseFloat(match[2]);

  if (isValidCoordinate(lat, lon)) {
    return { lat, lon };
  }

  return null;
}
