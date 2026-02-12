'use client';

import * as React from 'react';
import { AspectRatio, ASPECT_RATIOS } from '@/hooks/useBaseMap';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
  className?: string;
}

export function AspectRatioSelector({
  value,
  onChange,
  className,
}: AspectRatioSelectorProps) {
  return (
    <div className={cn('flex gap-2 flex-wrap', className)}>
      {ASPECT_RATIOS.map((ratio) => (
        <Button
          key={ratio.value}
          variant={value.value === ratio.value ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onChange(ratio)}
          className="min-w-[80px]"
        >
          {ratio.label}
        </Button>
      ))}
    </div>
  );
}

interface ZoomSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function ZoomSelector({
  value,
  onChange,
  min = 1,
  max = 19,
  className,
}: ZoomSelectorProps) {
  const handleDecrease = () => {
    onChange(Math.max(min, value - 1));
  };

  const handleIncrease = () => {
    onChange(Math.min(max, value + 1));
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={value <= min}
        className="h-8 w-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Button>
      <span className="text-sm font-medium min-w-[3ch] text-center">
        {value}x
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={value >= max}
        className="h-8 w-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Button>
    </div>
  );
}
