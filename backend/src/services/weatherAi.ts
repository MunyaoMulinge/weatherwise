import type { WeatherData, UsageStats, TreeAnalysisResult } from '../types';

const BASE_URL = 'https://api.weather-ai.co/v1';

function getApiKey(): string {
  return process.env.WEATHER_AI_API_KEY || '';
}

function getHeaders(): Record<string, string> {
  return {
    'Authorization': `Bearer ${getApiKey()}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchWeather(
  lat: number,
  lon: number,
  days: number = 7,
  ai: boolean = true,
  units: string = 'metric',
  lang: string = 'en'
): Promise<WeatherData> {
  const url = new URL(`${BASE_URL}/weather`);
  url.searchParams.set('lat', lat.toString());
  url.searchParams.set('lon', lon.toString());
  url.searchParams.set('days', days.toString());
  url.searchParams.set('ai', ai.toString());
  url.searchParams.set('units', units);
  url.searchParams.set('lang', lang);

  const res = await fetch(url.toString(), { headers: getHeaders() });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    throw new Error(err.message || `Weather API error: ${res.status}`);
  }

  const data = await res.json();
  return transformWeatherData(data, lat, lon);
}

export async function fetchCurrentWeather(
  lat: number,
  lon: number,
  ai: boolean = true,
  units: string = 'metric',
  lang: string = 'en'
): Promise<Partial<WeatherData>> {
  const url = new URL(`${BASE_URL}/current`);
  url.searchParams.set('lat', lat.toString());
  url.searchParams.set('lon', lon.toString());
  url.searchParams.set('ai', ai.toString());
  url.searchParams.set('units', units);
  url.searchParams.set('lang', lang);

  const res = await fetch(url.toString(), { headers: getHeaders() });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    throw new Error(err.message || `Current weather API error: ${res.status}`);
  }

  const data = await res.json();
  return transformWeatherData(data, lat, lon);
}

export async function fetchWeatherByIP(
  ip: string = 'auto',
  days: number = 7,
  ai: boolean = true
): Promise<WeatherData> {
  const url = new URL(`${BASE_URL}/weather-geo`);
  url.searchParams.set('ip', ip);
  url.searchParams.set('days', days.toString());
  url.searchParams.set('ai', ai.toString());

  const res = await fetch(url.toString(), { headers: getHeaders() });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    throw new Error(err.message || `Weather geo API error: ${res.status}`);
  }

  const data = await res.json() as any;
  const lat = parseFloat(res.headers.get('x-lat') || data.location?.lat || '0');
  const lon = parseFloat(res.headers.get('x-lon') || data.location?.lon || '0');
  return transformWeatherData(data, lat, lon);
}

export async function fetchUsage(): Promise<UsageStats> {
  const res = await fetch(`${BASE_URL}/usage`, { headers: getHeaders() });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    throw new Error(err.message || `Usage API error: ${res.status}`);
  }

  const data = await res.json() as any;
  return {
    plan: data.plan || 'free',
    requests_limit: data.requests_limit || 1000,
    requests_used: data.requests_used || 0,
    requests_remaining: data.requests_remaining || 1000,
    ai_requests_limit: data.ai_requests_limit || 200,
    ai_requests_used: data.ai_requests_used || 0,
    ai_requests_remaining: data.ai_requests_remaining || 200,
    resets_at: data.resets_at || new Date().toISOString(),
  };
}

export async function analyzeTreeImage(
  imageBuffer: Buffer,
  filename: string,
  fields: Record<string, string>
): Promise<TreeAnalysisResult> {
  const formData = new FormData();
  const blob = new Blob([imageBuffer]);
  formData.append('image', blob, filename);
  
  Object.entries(fields).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  const res = await fetch(`${BASE_URL}/trees/analyze`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: formData as any,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    throw new Error(err.message || `Tree analysis API error: ${res.status}`);
  }

  return res.json() as Promise<TreeAnalysisResult>;
}

function transformWeatherData(apiData: any, lat: number, lon: number): WeatherData {
  const loc = apiData.location || {};
  const current = apiData.current || apiData.weather || {};
  const forecast = apiData.forecast || apiData.daily || [];
  const hourly = apiData.hourly || [];

  return {
    location: {
      lat: loc.lat ?? lat,
      lon: loc.lon ?? lon,
      city: loc.city || loc.name,
      region: loc.region || loc.state,
      country: loc.country,
      timezone: loc.timezone,
    },
    current: {
      temp: current.temp ?? current.temperature ?? 0,
      feels_like: current.feels_like ?? current.feelsLike ?? current.temp ?? 0,
      humidity: current.humidity ?? 0,
      wind_speed: current.wind_speed ?? current.windSpeed ?? 0,
      wind_direction: current.wind_direction ?? current.windDirection ?? 0,
      pressure: current.pressure ?? current.sea_level ?? 0,
      uv_index: current.uv_index ?? current.uvi ?? 0,
      visibility: current.visibility ?? 0,
      condition: current.condition ?? current.main ?? 'Unknown',
      description: current.description ?? current.weather?.[0]?.description ?? '',
      icon: current.icon ?? current.weather?.[0]?.icon ?? '01d',
      sunrise: current.sunrise ?? '',
      sunset: current.sunset ?? '',
    },
    forecast: Array.isArray(forecast) ? forecast.map((d: any) => ({
      date: d.date ?? d.dt ?? '',
      temp_high: d.temp_high ?? d.temp?.max ?? d.high ?? 0,
      temp_low: d.temp_low ?? d.temp?.min ?? d.low ?? 0,
      humidity: d.humidity ?? 0,
      wind_speed: d.wind_speed ?? d.windSpeed ?? 0,
      condition: d.condition ?? d.weather?.[0]?.main ?? 'Unknown',
      description: d.description ?? d.weather?.[0]?.description ?? '',
      icon: d.icon ?? d.weather?.[0]?.icon ?? '01d',
      precipitation_chance: d.precipitation_chance ?? d.pop ?? d.rain ?? 0,
      uv_index: d.uv_index ?? d.uvi ?? 0,
    })) : [],
    hourly: Array.isArray(hourly) ? hourly.map((h: any) => ({
      time: h.time ?? h.dt ?? '',
      temp: h.temp ?? h.temperature ?? 0,
      feels_like: h.feels_like ?? h.feelsLike ?? h.temp ?? 0,
      humidity: h.humidity ?? 0,
      wind_speed: h.wind_speed ?? h.windSpeed ?? 0,
      condition: h.condition ?? h.weather?.[0]?.main ?? 'Unknown',
      icon: h.icon ?? h.weather?.[0]?.icon ?? '01d',
      precipitation_chance: h.precipitation_chance ?? h.pop ?? h.rain ?? 0,
    })) : [],
    ai_summary: apiData.ai_summary || apiData.aiSummary || apiData.summary,
    alerts: apiData.alerts || [],
  };
}
