import axios from 'axios';
import type { WeatherData, GeocodeResult, UsageStats } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export async function getWeatherForecast(
  lat: number,
  lon: number,
  days: number = 7,
  ai: boolean = true
): Promise<WeatherData> {
  const { data } = await api.get('/api/weather/forecast', {
    params: { lat, lon, days, ai },
  });
  return data;
}

export async function getCurrentWeather(
  lat: number,
  lon: number,
  ai: boolean = true
): Promise<Partial<WeatherData>> {
  const { data } = await api.get('/api/weather/current', {
    params: { lat, lon, ai },
  });
  return data;
}

export async function getWeatherByIP(
  ip: string = 'auto',
  days: number = 7
): Promise<WeatherData> {
  const { data } = await api.get('/api/weather/geo', {
    params: { ip, days },
  });
  return data;
}

export async function searchLocation(query: string): Promise<GeocodeResult[]> {
  const { data } = await api.get('/api/geocode/search', {
    params: { q: query },
  });
  return data;
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodeResult> {
  const { data } = await api.get('/api/geocode/reverse', {
    params: { lat, lon },
  });
  return data;
}

export async function getUsageStats(): Promise<UsageStats> {
  const { data } = await api.get('/api/usage');
  return data;
}
