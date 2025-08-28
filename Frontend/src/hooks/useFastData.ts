import { useState, useEffect, useCallback, useRef } from 'react';

interface UseFastDataOptions<T> {
  data: T;
  delay?: number;
  cache?: boolean;
  cacheKey?: string;
}

interface UseFastDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Simple in-memory cache
const dataCache = new Map<string, any>();

export function useFastData<T>({
  data,
  delay = 100,
  cache = true,
  cacheKey
}: UseFastDataOptions<T>): UseFastDataReturn<T> {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  const fetchData = useCallback(() => {
    // Check cache first if enabled
    if (cache && cacheKey && dataCache.has(cacheKey)) {
      const cachedData = dataCache.get(cacheKey);
      setState({
        data: cachedData,
        loading: false,
        error: null
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Simulate API call with minimal delay
    timeoutRef.current = setTimeout(() => {
      try {
        // Cache the data if enabled
        if (cache && cacheKey) {
          dataCache.set(cacheKey, data);
        }

        setState({
          data,
          loading: false,
          error: null
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        });
      }
    }, delay);
  }, [data, delay, cache, cacheKey]);

  useEffect(() => {
    fetchData();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fetchData]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchData
  };
}

// Hook for filtering data instantly without loading states
export function useInstantFilter<T>(
  items: T[],
  filterFn: (item: T) => boolean
): T[] {
  const [filteredItems, setFilteredItems] = useState<T[]>(items);

  useEffect(() => {
    // Use requestAnimationFrame for smooth filtering
    const frame = requestAnimationFrame(() => {
      const filtered = items.filter(filterFn);
      setFilteredItems(filtered);
    });

    return () => cancelAnimationFrame(frame);
  }, [items, filterFn]);

  return filteredItems;
}

// Hook for instant sorting without delays
export function useInstantSort<T>(
  items: T[],
  sortFn: (a: T, b: T) => number
): T[] {
  const [sortedItems, setSortedItems] = useState<T[]>([...items]);

  useEffect(() => {
    // Use requestAnimationFrame for smooth sorting
    const frame = requestAnimationFrame(() => {
      const sorted = [...items].sort(sortFn);
      setSortedItems(sorted);
    });

    return () => cancelAnimationFrame(frame);
  }, [items, sortFn]);

  return sortedItems;
}

// Clear all cached data
export function clearDataCache() {
  dataCache.clear();
}

// Get cache size for debugging
export function getCacheSize() {
  return dataCache.size;
}