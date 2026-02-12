import { NextRequest, NextResponse } from 'next/server';
import { geocodeLocation, reverseGeocode, parseCoordinateString } from '@/lib/geocoding';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('q');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const limit = searchParams.get('limit') || '10';

  // Handle reverse geocoding
  if (lat && lon) {
    try {
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);

      if (isNaN(latNum) || isNaN(lonNum)) {
        return NextResponse.json(
          { error: 'Invalid coordinates', message: 'Latitude and longitude must be valid numbers' },
          { status: 400 }
        );
      }

      const result = await reverseGeocode(latNum, lonNum);

      if (!result) {
        return NextResponse.json(
          { error: 'Not found', message: 'No address found for these coordinates' },
          { status: 404 }
        );
      }

      return NextResponse.json(result);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return NextResponse.json(
        { error: 'Server error', message: 'Failed to reverse geocode coordinates' },
        { status: 500 }
      );
    }
  }

  // Handle forward geocoding
  if (!query) {
    return NextResponse.json(
      { error: 'Missing query', message: 'Please provide a search query (q parameter)' },
      { status: 400 }
    );
  }

  // Check if input is coordinates
  const coords = parseCoordinateString(query);
  if (coords) {
    try {
      const result = await reverseGeocode(coords.lat, coords.lon);
      return NextResponse.json(result || { error: 'Not found' });
    } catch (error) {
      console.error('Coordinate parsing error:', error);
      return NextResponse.json(
        { error: 'Server error', message: 'Failed to parse coordinates' },
        { status: 500 }
      );
    }
  }

  try {
    const results = await geocodeLocation(query, {
      limit: parseInt(limit, 10),
      addressdetails: true,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Server error', message: 'Failed to geocode location' },
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
