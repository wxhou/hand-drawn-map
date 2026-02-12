'use client';

import * as React from 'react';
import Image from 'next/image';
import { useBaseMap, AspectRatio } from '@/hooks/useBaseMap';
import { AspectRatioSelector, ZoomSelector } from '@/components/ui/MapControls';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface BaseMapPreviewProps {
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
  className?: string;
  showControls?: boolean;
  aspectRatio?: AspectRatio;
  onAspectRatioChange?: (ratio: AspectRatio) => void;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
}

export function BaseMapPreview({
  location,
  className,
  showControls = true,
  aspectRatio: controlledAspectRatio,
  onAspectRatioChange,
  zoom: controlledZoom,
  onZoomChange,
}: BaseMapPreviewProps) {
  const [localAspectRatio, setLocalAspectRatio] = React.useState<AspectRatio | null>(null);
  const [localZoom, setLocalZoom] = React.useState<number | null>(null);

  const aspectRatio = controlledAspectRatio || localAspectRatio || undefined;
  const zoom = controlledZoom !== undefined ? controlledZoom : localZoom;

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    if (onAspectRatioChange) {
      onAspectRatioChange(ratio);
    } else {
      setLocalAspectRatio(ratio);
    }
  };

  const handleZoomChange = (newZoom: number) => {
    if (onZoomChange) {
      onZoomChange(newZoom);
    } else {
      setLocalZoom(newZoom);
    }
  };

  const {
    mapUrl,
    loading,
    error,
    refresh,
    attribution,
  } = useBaseMap({
    location,
    options: {
      zoom: zoom || undefined,
      width: aspectRatio?.width,
      height: aspectRatio?.height,
    },
  });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Controls */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <AspectRatioSelector
            value={aspectRatio || { label: '16:9', value: '16:9', width: 1280, height: 720 }}
            onChange={handleAspectRatioChange}
          />
          <div className="flex items-center gap-4">
            <ZoomSelector
              value={zoom || 14}
              onChange={handleZoomChange}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              disabled={loading}
            >
              <RefreshCw
                className={cn(
                  'h-4 w-4 mr-1',
                  loading && 'animate-spin'
                )}
              />
              刷新
            </Button>
          </div>
        </div>
      )}

      {/* Map Preview */}
      <div
        className="relative bg-light-background rounded-xl overflow-hidden border border-light-border"
        style={{
          aspectRatio: aspectRatio
            ? `${aspectRatio.width} / ${aspectRatio.height}`
            : undefined,
          minHeight: aspectRatio ? undefined : '300px',
        }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-light-background/80 z-10">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-light-text-muted">
                正在加载地图...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-light-background/90 z-10">
            <div className="flex flex-col items-center gap-3 p-4 text-center">
              <p className="text-red-500">{error.message}</p>
              <Button variant="outline" size="sm" onClick={refresh}>
                重试
              </Button>
            </div>
          </div>
        )}

        {mapUrl && (
          <Image
            src={mapUrl}
            alt={`Map of ${location.address?.city || 'selected location'}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            priority
          />
        )}

        {/* Attribution */}
        <p className="absolute bottom-2 right-2 text-xs text-light-text-muted/70 bg-light-surface/80 px-2 py-1 rounded">
          {attribution}
        </p>
      </div>
    </div>
  );
}
