export interface WeatherData {
  location: {
    lat: number;
    lon: number;
    city?: string;
    region?: string;
    country?: string;
    timezone?: string;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_direction: number;
    pressure: number;
    uv_index: number;
    visibility: number;
    condition: string;
    description: string;
    icon: string;
    sunrise: string;
    sunset: string;
  };
  forecast: DailyForecast[];
  hourly: HourlyForecast[];
  ai_summary?: string;
  alerts?: WeatherAlert[];
}

export interface DailyForecast {
  date: string;
  temp_high: number;
  temp_low: number;
  humidity: number;
  wind_speed: number;
  condition: string;
  description: string;
  icon: string;
  precipitation_chance: number;
  uv_index: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  condition: string;
  icon: string;
  precipitation_chance: number;
}

export interface WeatherAlert {
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  start: string;
  end: string;
}

export interface GeocodeResult {
  lat: number;
  lon: number;
  name: string;
  display_name: string;
  country: string;
  region?: string;
}

export interface UsageStats {
  plan: string;
  requests_limit: number;
  requests_used: number;
  requests_remaining: number;
  ai_requests_limit: number;
  ai_requests_used: number;
  ai_requests_remaining: number;
  resets_at: string;
}
