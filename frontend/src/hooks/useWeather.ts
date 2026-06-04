import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import {
  getWeatherForecast,
  getWeatherByIP,
  searchLocation,
  getUsageStats,
  reverseGeocode,
} from '@/services/api';
import type { GeocodeResult, WeatherData } from '@/types';

export function useWeather() {
  const [location, setLocationState] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const queryClient = useQueryClient();

  const weatherQuery = useQuery<WeatherData>({
    queryKey: ['weather', location?.lat, location?.lon],
    queryFn: () => {
      if (!location) throw new Error('No location selected');
      return getWeatherForecast(location.lat, location.lon);
    },
    enabled: !!location,
  });

  const setLocation = useCallback((lat: number, lon: number, name?: string) => {
    setLocationState({ lat, lon, name: name || `${lat.toFixed(2)}, ${lon.toFixed(2)}` });
  }, []);

  const detectLocation = useCallback(async () => {
    try {
      const data = await getWeatherByIP('auto');
      const loc = data.location;
      setLocationState({
        lat: loc.lat,
        lon: loc.lon,
        name: loc.city || loc.region || `${loc.lat.toFixed(2)}, ${loc.lon.toFixed(2)}`,
      });
      return data;
    } catch (error) {
      // Fallback to Nairobi
      setLocationState({ lat: -1.2921, lon: 36.8219, name: 'Nairobi, Kenya' });
      throw error;
    }
  }, []);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['weather'] });
  }, [queryClient]);

  return {
    location,
    setLocation,
    detectLocation,
    weather: weatherQuery.data,
    isLoading: weatherQuery.isLoading,
    isError: weatherQuery.isError,
    error: weatherQuery.error as Error | null,
    refresh,
  };
}

export function useLocationSearch() {
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const data = await searchLocation(query);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
  }, []);

  return { results, isSearching, search, clear };
}

export function useUsage() {
  return useQuery({
    queryKey: ['usage'],
    queryFn: getUsageStats,
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useReverseGeocode() {
  return useQuery({
    queryKey: ['reverseGeocode'],
    queryFn: () => reverseGeocode(-1.2921, 36.8219),
    enabled: false,
  });
}
