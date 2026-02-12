'use client';

import * as React from 'react';
import { Search, MapPin, MapPinOff } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

export interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (location: {
    name: string;
    lat: number;
    lon: number;
  }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

interface Suggestion {
  place_id?: number;
  lat: number;
  lon: number;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

export function LocationInput({
  value,
  onChange,
  onSelect,
  placeholder = '输入地点名称，如：杭州西湖、北京故宫...',
  className,
  disabled = false,
}: LocationInputProps) {
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  const formatAddress = (suggestion: Suggestion): string => {
    const parts: string[] = [];

    if (suggestion.address?.city) {
      parts.push(suggestion.address.city);
    } else if (suggestion.address?.town) {
      parts.push(suggestion.address.town);
    } else if (suggestion.address?.village) {
      parts.push(suggestion.address.village);
    } else if (suggestion.address?.county) {
      parts.push(suggestion.address.county);
    }

    if (suggestion.address?.state && !parts[0]?.includes(suggestion.address.state)) {
      parts.push(suggestion.address.state);
    }

    if (suggestion.address?.country) {
      parts.push(suggestion.address.country);
    }

    return parts.join(', ') || suggestion.display_name.split(',')[0];
  };

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '5',
      });

      const response = await fetch(`/api/geocode?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      setError('Failed to load suggestions');
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Debounce API calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleSelect = (suggestion: Suggestion) => {
    const name = formatAddress(suggestion);
    onChange(name);
    onSelect({
      name,
      lat: suggestion.lat,
      lon: suggestion.lon,
    });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSubmit = () => {
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative', className)} ref={inputRef}>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        icon={<Search className="h-5 w-5" />}
        error={error || undefined}
        disabled={disabled}
        className="h-16 text-lg"
      />

      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-14 top-1/2 -translate-y-1/2">
          <LoadingSpinner size="sm" />
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-light-surface rounded-xl border border-light-border shadow-lg animate-slide-down">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id || index}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-light-background/50 transition-colors flex items-start gap-3"
            >
              <MapPin className="h-5 w-5 text-light-text-muted mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-light-text truncate">
                  {formatAddress(suggestion)}
                </p>
                <p className="text-sm text-light-text-muted truncate">
                  {suggestion.display_name.split(',').slice(1).join(',').trim()}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Manual coordinate input option */}
      {showSuggestions && suggestions.length === 0 && value && !loading && (
        <div className="absolute z-50 w-full mt-2 py-2 px-4 bg-light-surface rounded-xl border border-light-border shadow-lg">
          <p className="text-sm text-light-text-muted text-center">
            未找到该地点，你可以尝试输入坐标
            <br />
            <span className="text-light-primary">格式：纬度, 经度</span>
          </p>
        </div>
      )}
    </div>
  );
}
