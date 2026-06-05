import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  CloudSun,
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
  const normalized = (condition || '').toLowerCase();

  if (icon && icon.startsWith('http')) {
    // Weather-AI returns full icon URLs — use an <img> tag
    return (
      <img
        src={icon}
        alt={condition || 'weather'}
        className={`inline-block object-contain ${className}`}
        style={{ width: size, height: size }}
        onError={(e) => {
          // Fallback to lucide icon if image fails to load
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  let IconComponent = Cloud;

  if (normalized.includes('clear') || normalized.includes('sun')) {
    IconComponent = Sun;
  } else if (normalized.includes('mainly clear')) {
    IconComponent = CloudSun;
  } else if (normalized.includes('partly cloudy')) {
    IconComponent = CloudSun;
  } else if (normalized.includes('overcast')) {
    IconComponent = Cloud;
  } else if (normalized.includes('drizzle')) {
    IconComponent = CloudDrizzle;
  } else if (normalized.includes('rain')) {
    IconComponent = CloudRain;
  } else if (normalized.includes('thunder') || normalized.includes('storm')) {
    IconComponent = CloudLightning;
  } else if (normalized.includes('snow')) {
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
