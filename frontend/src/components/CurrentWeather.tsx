import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset, Thermometer } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import type { WeatherData } from '@/types';

interface CurrentWeatherProps {
  current: WeatherData['current'];
}

export default function CurrentWeather({ current }: CurrentWeatherProps) {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        {/* Main temp and icon */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 dark:from-blue-500/30 dark:to-cyan-400/30 flex items-center justify-center">
            <WeatherIcon
              condition={current.condition}
              icon={current.icon}
              size={56}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>
          <div>
            <div className="flex items-start">
              <span className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white">
                {Math.round(current.temp)}
              </span>
              <span className="text-2xl sm:text-3xl text-gray-500 dark:text-gray-400 mt-1">°C</span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 capitalize mt-1">
              {current.description || current.condition}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Thermometer className="w-4 h-4" />
              Feels like {Math.round(current.feels_like)}°C
            </p>
          </div>
        </div>

        {/* Sun times */}
        <div className="flex sm:flex-col gap-4 text-sm">
          {current.sunrise && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Sunrise className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sunrise</p>
                <p className="font-medium">
                  {new Date(current.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )}
          {current.sunset && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Sunset className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sunset</p>
                <p className="font-medium">
                  {new Date(current.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <DetailCard
          icon={<Droplets className="w-5 h-5 text-blue-500" />}
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <DetailCard
          icon={<Wind className="w-5 h-5 text-teal-500" />}
          label="Wind"
          value={`${current.wind_speed} km/h`}
        />
        <DetailCard
          icon={<Eye className="w-5 h-5 text-purple-500" />}
          label="Visibility"
          value={`${(current.visibility / 1000).toFixed(1)} km`}
        />
        <DetailCard
          icon={<Gauge className="w-5 h-5 text-rose-500" />}
          label="Pressure"
          value={`${current.pressure} hPa`}
        />
      </div>
    </div>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
      <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
