'use client';

import { useState, useCallback, useEffect } from 'react';
import { getOptimalZoomLevel, detectLocationType } from '@/lib/map-tiles';

export interface MapOptions {
  lat: number;
  lon: number;
  zoom?: number;
  width?: number;
  height?: number;
  format?: 'png' | 'jpg';
  quality?: number;
}

export interface AspectRatio {
  label: string;
  value: string;
  width: number;
  height: number;
}

export const ASPECT_RATIOS: AspectRatio[] = [
  { label: '16:9 宽屏', value: '16:9', width: 1280, height: 720 },
  { label: '4:3 标准', value: '4:3', width: 1024, height: 768 },
  { label: '1:1 方形', value: '1:1', width: 1024, height: 1024 },
  { label: '3:4 竖版', value: '3:4', width: 768, height: 1024 },
];

export interface UseBaseMapReturn {
  mapUrl: string | null;
  loading: boolean;
  error: Error | null;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  refresh: () => void;
  attribution: string;
}

interface UseBaseMapProps {
  location: {
    lat: number;
    lon: number;
    address?: {
      city?: string;
      town?: string;
      village?: string;
      county?: string;
      state?: string;
      country?: string;
    };
  };
  options?: Partial<Omit<MapOptions, 'lat' | 'lon'>>;
}

export function useBaseMap({ location, options = {} }: UseBaseMapProps): UseBaseMapReturn {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [aspectRatio, setAspectRatioState] = useState<AspectRatio>(ASPECT_RATIOS[0]);
  const [zoom, setZoomState] = useState(options.zoom || getOptimalZoomLevel('city'));
  const [refreshCount, setRefreshCount] = useState(0);

  // Auto-detect zoom level based on location type
  useEffect(() => {
    if (!options.zoom) {
      const locationType = detectLocationType(location.address);
      setZoomState(getOptimalZoomLevel(locationType));
    }
  }, [location.address, options.zoom]);

  const buildMapUrl = useCallback(() => {
    const params = new URLSearchParams({
      lat: String(location.lat),
      lon: String(location.lon),
      zoom: String(zoom),
      width: String(aspectRatio.width),
      height: String(aspectRatio.height),
      format: options.format || 'png',
    });

    if (options.quality) {
      params.set('quality', String(options.quality));
    }

    return `/api/map?${params.toString()}`;
  }, [location.lat, location.lon, zoom, aspectRatio, options.format, options.quality]);

  const refresh = useCallback(() => {
    setRefreshCount((prev) => prev + 1);
  }, []);

  // Generate map URL when dependencies change
  useEffect(() => {
    const fetchMap = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = buildMapUrl();
        // Preload the image
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          setMapUrl(url);
          setLoading(false);
        };

        img.onerror = () => {
          setError(new Error('Failed to load map tiles'));
          setLoading(false);
        };

        img.src = url;
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchMap();
  }, [buildMapUrl]);

  const setAspectRatio = useCallback((ratio: AspectRatio) => {
    setAspectRatioState(ratio);
  }, []);

  const setZoom = useCallback((newZoom: number) => {
    setZoomState(Math.max(1, Math.min(19, newZoom)));
  }, []);

  return {
    mapUrl,
    loading,
    error,
    aspectRatio,
    setAspectRatio,
    zoom,
    setZoom,
    refresh,
    attribution: '© OpenStreetMap contributors © CARTO',
  };
}
