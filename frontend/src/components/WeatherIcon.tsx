import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  CloudSun,
  CloudMoon,
  Moon,
  Wind,
  Droplets,
} from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  icon?: string;
  className?: string;
  size?: number;
}

export default function WeatherIcon({ condition, icon, className = '', size = 24 }: WeatherIconProps) {
  const normalized = condition.toLowerCase();
  const isNight = icon?.includes('n') || icon === '01n';

  let IconComponent = Cloud;

  if (normalized.includes('clear') || normalized.includes('sun')) {
    IconComponent = isNight ? Moon : Sun;
  } else if (normalized.includes('partly') || normalized.includes('few')) {
    IconComponent = isNight ? CloudMoon : CloudSun;
  } else if (normalized.includes('drizzle') || normalized.includes('light rain')) {
    IconComponent = CloudDrizzle;
  } else if (normalized.includes('rain') || normalized.includes('shower')) {
    IconComponent = CloudRain;
  } else if (normalized.includes('thunder') || normalized.includes('storm')) {
    IconComponent = CloudLightning;
  } else if (normalized.includes('snow') || normalized.includes('sleet') || normalized.includes('ice')) {
    IconComponent = CloudSnow;
  } else if (normalized.includes('fog') || normalized.includes('mist') || normalized.includes('haze')) {
    IconComponent = CloudFog;
  } else if (normalized.includes('wind')) {
    IconComponent = Wind;
  } else if (normalized.includes('humid') || normalized.includes('dew')) {
    IconComponent = Droplets;
  }

  return <IconComponent className={className} size={size} />;
}
