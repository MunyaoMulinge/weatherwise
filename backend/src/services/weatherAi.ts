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

// WMO weather code mapping derived from Weather-AI icon URLs
const wmoCodes: Record<string, { condition: string; description: string }> = {
  '0': { condition: 'Clear', description: 'Clear sky' },
  '1': { condition: 'Mainly Clear', description: 'Mainly clear' },
  '2': { condition: 'Partly Cloudy', description: 'Partly cloudy' },
  '3': { condition: 'Overcast', description: 'Overcast' },
  '45': { condition: 'Fog', description: 'Foggy' },
  '48': { condition: 'Fog', description: 'Depositing rime fog' },
  '51': { condition: 'Drizzle', description: 'Light drizzle' },
  '53': { condition: 'Drizzle', description: 'Moderate drizzle' },
  '55': { condition: 'Drizzle', description: 'Dense drizzle' },
  '56': { condition: 'Drizzle', description: 'Light freezing drizzle' },
  '57': { condition: 'Drizzle', description: 'Dense freezing drizzle' },
  '61': { condition: 'Rain', description: 'Slight rain' },
  '63': { condition: 'Rain', description: 'Moderate rain' },
  '65': { condition: 'Rain', description: 'Heavy rain' },
  '66': { condition: 'Rain', description: 'Light freezing rain' },
  '67': { condition: 'Rain', description: 'Heavy freezing rain' },
  '71': { condition: 'Snow', description: 'Slight snow fall' },
  '73': { condition: 'Snow', description: 'Moderate snow fall' },
  '75': { condition: 'Snow', description: 'Heavy snow fall' },
  '77': { condition: 'Snow', description: 'Snow grains' },
  '80': { condition: 'Rain Showers', description: 'Slight rain showers' },
  '81': { condition: 'Rain Showers', description: 'Moderate rain showers' },
  '82': { condition: 'Rain Showers', description: 'Violent rain showers' },
  '85': { condition: 'Snow Showers', description: 'Slight snow showers' },
  '86': { condition: 'Snow Showers', description: 'Heavy snow showers' },
  '95': { condition: 'Thunderstorm', description: 'Thunderstorm' },
  '96': { condition: 'Thunderstorm', description: 'Thunderstorm with slight hail' },
  '99': { condition: 'Thunderstorm', description: 'Thunderstorm with heavy hail' },
};

function parseIconUrl(iconUrl: string): { code: string; condition: string; description: string } {
  if (!iconUrl) return { code: '', condition: 'Unknown', description: '' };
  
  // Extract WMO code from URL like: .../53_drizzle_moderate_day.svg
  const match = iconUrl.match(/\/([0-9]+)_[^/]+\.svg$/);
  const code = match ? match[1] : '';
  const info = wmoCodes[code];
  
  if (info) {
    return { code, condition: info.condition, description: info.description };
  }
  
  // Fallback: derive from filename
  const filename = iconUrl.split('/').pop()?.replace('.svg', '') || '';
  if (filename.includes('clear')) return { code, condition: 'Clear', description: 'Clear sky' };
  if (filename.includes('cloudy')) return { code, condition: 'Cloudy', description: 'Cloudy' };
  if (filename.includes('overcast')) return { code, condition: 'Overcast', description: 'Overcast' };
  if (filename.includes('drizzle')) return { code, condition: 'Drizzle', description: 'Drizzle' };
  if (filename.includes('rain')) return { code, condition: 'Rain', description: 'Rain' };
  if (filename.includes('snow')) return { code, condition: 'Snow', description: 'Snow' };
  if (filename.includes('fog')) return { code, condition: 'Fog', description: 'Fog' };
  if (filename.includes('thunder')) return { code, condition: 'Thunderstorm', description: 'Thunderstorm' };
  
  return { code, condition: 'Unknown', description: '' };
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
      'Authorization': `Bearer ${getApiKey()}`,
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
  const currentRaw = apiData.current || {};
  const forecastRaw = apiData.forecast || apiData.daily || [];
  const hourlyRaw = apiData.hourly || [];

  // Transform hourly first (needed for daily high/low computation)
  const hourly = Array.isArray(hourlyRaw) ? hourlyRaw.map((h: any) => {
    const iconInfo = parseIconUrl(h.icon);
    return {
      time: h.time ?? '',
      temp: h.temperature ?? h.temp ?? 0,
      feels_like: h.feels_like ?? h.temp ?? 0,
      humidity: h.humidity ?? 0,
      wind_speed: h.wind_speed ?? 0,
      condition: iconInfo.condition,
      icon: h.icon ?? '',
      precipitation_chance: h.precipitation_probability ?? h.precipitation_chance ?? h.pop ?? 0,
    };
  }) : [];

  // Compute daily forecast from hourly data
  const dailyMap = new Map<string, { temps: number[]; humidities: number[]; windSpeeds: number[]; icon: string; precipitation: number[]; uv: number[] }>();
  
  for (const h of hourly) {
    const date = h.time.split('T')[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, { temps: [], humidities: [], windSpeeds: [], icon: h.icon, precipitation: [], uv: [] });
    }
    const day = dailyMap.get(date)!;
    day.temps.push(h.temp);
    day.humidities.push(h.humidity);
    day.windSpeeds.push(h.wind_speed);
    day.precipitation.push(h.precipitation_chance);
  }

  // If API provides forecast array, use it for dates/icons, but fill temps from hourly
  const forecast = Array.isArray(forecastRaw) ? forecastRaw.map((d: any) => {
    const date = d.date ?? '';
    const iconInfo = parseIconUrl(d.icon);
    const dayData = dailyMap.get(date);
    
    return {
      date,
      temp_high: dayData ? Math.max(...dayData.temps) : 0,
      temp_low: dayData ? Math.min(...dayData.temps) : 0,
      humidity: dayData ? Math.round(dayData.humidities.reduce((a, b) => a + b, 0) / dayData.humidities.length) : 0,
      wind_speed: dayData ? Math.round(dayData.windSpeeds.reduce((a, b) => a + b, 0) / dayData.windSpeeds.length) : 0,
      condition: iconInfo.condition,
      description: iconInfo.description,
      icon: d.icon ?? '',
      precipitation_chance: d.precipitation_probability ?? d.precipitation_chance ?? d.pop ?? 0,
      uv_index: d.uv_index ?? d.uvi ?? 0,
    };
  }) : [];

  // If no forecast array but we have hourly data, generate forecast from dailyMap
  if (forecast.length === 0 && dailyMap.size > 0) {
    for (const [date, dayData] of dailyMap) {
      const iconInfo = parseIconUrl(dayData.icon);
      forecast.push({
        date,
        temp_high: Math.max(...dayData.temps),
        temp_low: Math.min(...dayData.temps),
        humidity: Math.round(dayData.humidities.reduce((a, b) => a + b, 0) / dayData.humidities.length),
        wind_speed: Math.round(dayData.windSpeeds.reduce((a, b) => a + b, 0) / dayData.windSpeeds.length),
        condition: iconInfo.condition,
        description: iconInfo.description,
        icon: dayData.icon,
        precipitation_chance: Math.max(...dayData.precipitation),
        uv_index: 0,
      });
    }
  }

  // Transform current weather
  const currentIconInfo = parseIconUrl(currentRaw.icon);
  const current = {
    temp: currentRaw.temp ?? currentRaw.temperature ?? 0,
    feels_like: currentRaw.feels_like ?? currentRaw.temp ?? 0,
    humidity: currentRaw.humidity ?? 0,
    wind_speed: currentRaw.wind_speed ?? 0,
    wind_direction: currentRaw.wind_direction ?? 0,
    pressure: currentRaw.pressure ?? 0,
    uv_index: currentRaw.uv_index ?? 0,
    visibility: currentRaw.visibility ?? 0,
    condition: currentIconInfo.condition,
    description: currentIconInfo.description,
    icon: currentRaw.icon ?? '',
    sunrise: currentRaw.sunrise ?? '',
    sunset: currentRaw.sunset ?? '',
  };

  return {
    location: {
      lat: loc.lat ?? lat,
      lon: loc.lon ?? lon,
      city: loc.city || loc.name,
      region: loc.region || loc.state,
      country: loc.country,
      timezone: loc.timezone,
    },
    current,
    forecast,
    hourly,
    ai_summary: apiData.ai_summary || apiData.aiSummary || apiData.summary || undefined,
    alerts: apiData.alerts || [],
  };
}
