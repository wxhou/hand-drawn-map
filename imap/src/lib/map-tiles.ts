export interface MapTileConfig {
  lat: number;
  lon: number;
  zoom: number;
  width: number;
  height: number;
}

export interface TileCoordinate {
  x: number;
  y: number;
}

// Tile server configurations with fallbacks
const TILE_SERVERS = [
  { name: 'OpenStreetMap', url: 'https://tile.openstreetmap.org', attribution: '© OpenStreetMap' },
  { name: 'CartoDB Positron', url: 'https://a.basemaps.cartocdn.com/light_all', attribution: '© OpenStreetMap contributors © CARTO' },
  { name: 'CartoDB Voyager', url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager', attribution: '© OpenStreetMap contributors © CARTO' },
];

// Standard tile size
const TILE_SIZE = 256;

// Convert latitude/longitude to tile coordinates
export function latLonToTile(lat: number, lon: number, zoom: number): TileCoordinate {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lon + 180) / 360) * n);
  const y = Math.floor((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2 * n);

  return { x, y };
}

// Convert tile coordinates to lat/lon (top-left corner of tile)
export function tileToLatLon(x: number, y: number, zoom: number): { lat: number; lon: number } {
  const n = Math.pow(2, zoom);
  const lon = (x / n) * 360 - 180;
  const lat = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * (180 / Math.PI);

  return { lat, lon };
}

// Calculate tile range for a given center point and image dimensions
export function calculateTileRange(
  centerLat: number,
  centerLon: number,
  zoom: number,
  width: number,
  height: number
): { minX: number; maxX: number; minY: number; maxY: number } {
  // Convert center to tile coordinates
  const centerTile = latLonToTile(centerLat, centerLon, zoom);

  // Calculate how many tiles we need in each direction
  const tilesX = Math.ceil(width / TILE_SIZE);
  const tilesY = Math.ceil(height / TILE_SIZE);

  // Calculate half in each direction
  const halfTilesX = Math.ceil(tilesX / 2);
  const halfTilesY = Math.ceil(tilesY / 2);

  return {
    minX: Math.max(0, centerTile.x - halfTilesX),
    maxX: centerTile.x + halfTilesX,
    minY: Math.max(0, centerTile.y - halfTilesY),
    maxY: centerTile.y + halfTilesY,
  };
}

// Get the optimal zoom level based on the type of location
export function getOptimalZoomLevel(
  locationType: 'city' | 'scenic' | 'region' | 'country' = 'city'
): number {
  const zoomLevels: Record<typeof locationType, number> = {
    city: 14,
    scenic: 16,
    region: 10,
    country: 6,
  };

  return zoomLevels[locationType] || 14;
}

// Auto-detect location type from address components
export function detectLocationType(address?: {
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  country?: string;
}): 'city' | 'scenic' | 'region' | 'country' {
  if (!address) return 'city';

  // Check for country-level
  if (address.country && !address.state) return 'country';

  // Check for region/state level
  if (address.state && !address.city && !address.county) return 'region';

  // Check for scenic indicators in display name
  const displayName = address.city || address.town || address.county || '';
  const scenicKeywords = ['公园', '景区', '山', '湖', '海', '岛', '森林', '自然'];

  for (const keyword of scenicKeywords) {
    if (displayName.includes(keyword)) return 'scenic';
  }

  return 'city';
}

// Fetch a single tile
export async function fetchTile(
  x: number,
  y: number,
  zoom: number,
  serverIndex = 0
): Promise<ArrayBuffer> {
  const server = TILE_SERVERS[serverIndex];
  const url = `${server.url}/${zoom}/${x}/${y}.png`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'HandDrawnMap/1.0 (contact@handdrawnmap.app)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tile: ${response.statusText}`);
  }

  return response.arrayBuffer();
}

// Fetch tiles with fallback to next server
export async function fetchTileWithFallback(
  x: number,
  y: number,
  zoom: number
): Promise<ArrayBuffer> {
  let lastError: Error | null = null;

  for (let i = 0; i < TILE_SERVERS.length; i++) {
    try {
      return await fetchTile(x, y, zoom, i);
    } catch (error) {
      lastError = error as Error;
      console.warn(`Tile server ${TILE_SERVERS[i].name} failed, trying next...`);
    }
  }

  throw lastError || new Error('All tile servers failed');
}

// Helper to create ImageData from blob (browser environment)
export async function createImageDataFromBlob(blob: Blob): Promise<ImageData> {
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(bitmap, 0, 0);
  return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

// Composite multiple tiles into a single image
export async function compositeTiles(
  tiles: Map<number, Map<number, ArrayBuffer>>,
  width: number,
  height: number
): Promise<ImageData> {
  // Create offscreen canvas
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Draw each tile
  Array.from(tiles.entries()).forEach(([y, row]) => {
    Array.from(row.entries()).forEach(([x, buffer]) => {
      createImageDataFromBlob(new Blob([buffer], { type: 'image/png' }))
        .then((imageData) => {
          ctx.putImageData(imageData, x * TILE_SIZE, y * TILE_SIZE);
        })
        .catch((error) => {
          console.error(`Failed to composite tile at (${x}, ${y}):`, error);
        });
    });
  });

  return ctx.getImageData(0, 0, width, height);
}

// Main function to fetch and composite map tiles
export async function fetchMapTiles(
  centerLat: number,
  centerLon: number,
  zoom: number,
  width: number,
  height: number
): Promise<ImageData> {
  const tileRange = calculateTileRange(centerLat, centerLon, zoom, width, height);

  // Calculate actual canvas size
  const tilesX = tileRange.maxX - tileRange.minX + 1;
  const tilesY = tileRange.maxY - tileRange.minY + 1;
  const canvasWidth = tilesX * TILE_SIZE;
  const canvasHeight = tilesY * TILE_SIZE;

  // Fetch all tiles
  const tiles = new Map<number, Map<number, ArrayBuffer>>();

  for (let y = tileRange.minY; y <= tileRange.maxY; y++) {
    const row = new Map<number, ArrayBuffer>();

    for (let x = tileRange.minX; x <= tileRange.maxX; x++) {
      try {
        const buffer = await fetchTileWithFallback(x, y, zoom);
        row.set(x, buffer);
      } catch (error) {
        console.error(`Failed to fetch tile at (${x}, ${y}):`, error);
        // Fill with white on failure
        row.set(x, new ArrayBuffer(0));
      }
    }

    tiles.set(y, row);
  }

  return compositeTiles(tiles, canvasWidth, canvasHeight);
}

// Convert ImageData to blob
export async function imageDataToBlob(imageData: ImageData, format: 'image/png' | 'image/jpeg' = 'image/png'): Promise<Blob> {
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.convertToBlob({ type: format, quality: format === 'image/jpeg' ? 0.92 : undefined });
}

// Get tile server attribution text
export function getTileAttribution(): string {
  return TILE_SERVERS.map(s => s.attribution).join(' | ');
}
