import { NextRequest, NextResponse } from 'next/server';
import {
  fetchMapTiles,
  getOptimalZoomLevel,
  imageDataToBlob,
  getTileAttribution,
} from '@/lib/map-tiles';

// Cache for generated maps
const mapCache = new Map<string, { data: Blob; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const MAX_CACHE_SIZE = 50;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const zoom = searchParams.get('zoom');
  const width = searchParams.get('width') || '800';
  const height = searchParams.get('height') || '600';
  const format = searchParams.get('format') || 'png';
  const quality = searchParams.get('quality') || '85';

  // Validate required parameters
  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Missing required parameters', message: 'lat and lon are required' },
      { status: 400 }
    );
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (isNaN(latNum) || isNaN(lonNum)) {
    return NextResponse.json(
      { error: 'Invalid coordinates', message: 'lat and lon must be valid numbers' },
      { status: 400 }
    );
  }

  // Validate coordinate ranges
  if (latNum < -90 || latNum > 90) {
    return NextResponse.json(
      { error: 'Invalid latitude', message: 'Latitude must be between -90 and 90' },
      { status: 400 }
    );
  }

  if (lonNum < -180 || lonNum > 180) {
    return NextResponse.json(
      { error: 'Invalid longitude', message: 'Longitude must be between -180 and 180' },
      { status: 400 }
    );
  }

  // Parse optional parameters
  let zoomNum: number;
  if (zoom) {
    zoomNum = parseInt(zoom, 10);
    if (isNaN(zoomNum) || zoomNum < 1 || zoomNum > 19) {
      return NextResponse.json(
        { error: 'Invalid zoom', message: 'Zoom must be a number between 1 and 19' },
        { status: 400 }
      );
    }
  } else {
    // Auto-detect zoom level
    zoomNum = getOptimalZoomLevel('city');
  }

  const widthNum = parseInt(width, 10);
  const heightNum = parseInt(height, 10);

  // Validate dimensions
  if (widthNum < 100 || widthNum > 4096) {
    return NextResponse.json(
      { error: 'Invalid width', message: 'Width must be between 100 and 4096 pixels' },
      { status: 400 }
    );
  }

  if (heightNum < 100 || heightNum > 4096) {
    return NextResponse.json(
      { error: 'Invalid height', message: 'Height must be between 100 and 4096 pixels' },
      { status: 400 }
    );
  }

  // Create cache key
  const cacheKey = `${latNum.toFixed(6)},${lonNum.toFixed(6)}-${zoomNum}-${widthNum}x${heightNum}`;

  // Check cache
  const cached = mapCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return new NextResponse(cached.data, {
      headers: {
        'Content-Type': `image/${format === 'jpg' ? 'jpeg' : 'png'}`,
        'Cache-Control': 'public, max-age=3600',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    // Fetch and composite map tiles
    const imageData = await fetchMapTiles(latNum, lonNum, zoomNum, widthNum, heightNum);

    // Convert to blob
    const blob = await imageDataToBlob(imageData, format as 'image/png' | 'image/jpeg');

    // Update cache
    if (mapCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entry
      const iterator = mapCache.keys();
      const oldestKey = iterator.next().value;
      if (oldestKey) {
        mapCache.delete(oldestKey);
      }
    }
    mapCache.set(cacheKey, { data: blob, timestamp: Date.now() });

    return new NextResponse(blob, {
      headers: {
        'Content-Type': `image/${format === 'jpg' ? 'jpeg' : 'png'}`,
        'Content-Disposition': `inline; filename="map-${cacheKey}.${format === 'jpg' ? 'jpg' : 'png'}"`,
        'Cache-Control': 'public, max-age=3600',
        'X-Cache': 'MISS',
        'X-Tile-Attribution': getTileAttribution(),
      },
    });
  } catch (error) {
    console.error('Map generation error:', error);
    return NextResponse.json(
      { error: 'Map generation failed', message: 'Failed to generate map tiles' },
      { status: 500 }
    );
  }
}

// Enable CORS for API access
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
