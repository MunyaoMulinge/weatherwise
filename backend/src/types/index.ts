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

export interface TreeAnalysisResult {
  analysis_id: string;
  timestamp: string;
  farmer_id?: string;
  county?: string;
  location?: string;
  land_acres?: number;
  total_tree_count: number;
  tree_density_per_acre?: number;
  confidence_score: number;
  canopy_coverage_pct: number;
  tree_health: {
    healthy: number;
    needs_care: number;
    needs_replacement: number;
  };
  low_confidence: boolean;
  tree_species_guess?: string;
  observations: string[];
  recommendations: string[];
  original_image_url?: string;
  overlay_image_url?: string;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}
