'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  geocodeLocation,
  GeocodingResult,
  formatAddress,
  createDebouncedGeocode,
} from '@/lib/geocoding';

interface UseGeocodingOptions {
  minLength?: number;
  debounceMs?: number;
  onError?: (error: Error) => void;
}

interface UseGeocodingReturn {
  query: string;
  setQuery: (query: string) => void;
  results: GeocodingResult[];
  loading: boolean;
  error: Error | null;
  suggestions: GeocodingResult[];
  selectedResult: GeocodingResult | null;
  setSelectedResult: (result: GeocodingResult | null) => void;
  search: (query: string) => Promise<void>;
  clear: () => void;
  selectResult: (result: GeocodingResult) => void;
}

export function useGeocoding(options: UseGeocodingOptions = {}): UseGeocodingReturn {
  const { minLength = 2, debounceMs = 300, onError } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<GeocodingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Debounced search
  const debouncedSearch = useCallback(
    createDebouncedGeocode(
      (newResults) => {
        setSuggestions(newResults);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
        onError?.(err);
      },
      debounceMs
    ),
    [debounceMs, onError]
  );

  // Search function
  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < minLength) {
      setSuggestions([]);
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const geocodeResults = await geocodeLocation(searchQuery);
      setResults(geocodeResults);
    } catch (err) {
      setError(err as Error);
      onError?.(err as Error);
    } finally {
      setLoading(false);
    }
  }, [minLength, onError]);

  // Auto-search when query changes
  useEffect(() => {
    if (query && query.length >= minLength) {
      debouncedSearch(query);
    } else {
      setSuggestions([]);
    }
  }, [query, minLength, debouncedSearch]);

  // Clear function
  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setSelectedResult(null);
    setError(null);
  }, []);

  // Select a result
  const selectResult = useCallback((result: GeocodingResult) => {
    setSelectedResult(result);
    setQuery(formatAddress(result));
    setSuggestions([]);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    suggestions,
    selectedResult,
    setSelectedResult,
    search,
    clear,
    selectResult,
  };
}
