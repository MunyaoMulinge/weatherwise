import type { GeocodeResult } from '../types';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function geocodeCity(query: string): Promise<GeocodeResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('q', query.trim());
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '5');
  url.searchParams.set('addressdetails', '1');

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'WeatherWise/1.0 (weatherwise-app)',
    },
  });

  if (!res.ok) {
    throw new Error(`Geocoding error: ${res.status}`);
  }

  const data = await res.json() as any[];

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item: any) => ({
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    name: item.name || item.display_name?.split(',')[0] || query,
    display_name: item.display_name,
    country: item.address?.country || '',
    region: item.address?.state || item.address?.county || '',
  }));
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodeResult | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', lat.toString());
  url.searchParams.set('lon', lon.toString());
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'WeatherWise/1.0 (weatherwise-app)',
    },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json() as any;

  if (!data || data.error) {
    return null;
  }

  return {
    lat: parseFloat(data.lat),
    lon: parseFloat(data.lon),
    name: data.name || data.display_name?.split(',')[0] || 'Unknown',
    display_name: data.display_name,
    country: data.address?.country || '',
    region: data.address?.state || data.address?.county || '',
  };
}
