import { format, parseISO } from 'date-fns';
import WeatherIcon from './WeatherIcon';
import type { DailyForecast as DailyForecastType } from '@/types';

interface DailyForecastProps {
  forecast: DailyForecastType[];
}

export default function DailyForecast({ forecast }: DailyForecastProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        7-Day Forecast
      </h3>
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            {/* Day */}
            <div className="w-20 flex-shrink-0">
              <p className="font-medium text-gray-900 dark:text-white">
                {index === 0 ? 'Today' : formatDate(day.date)}
              </p>
            </div>

            {/* Icon */}
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <WeatherIcon
                condition={day.condition}
                icon={day.icon}
                size={28}
                className="text-blue-500"
              />
            </div>

            {/* Condition */}
            <p className="hidden sm:block flex-1 text-sm text-gray-600 dark:text-gray-300 capitalize">
              {day.description || day.condition}
            </p>

            {/* Precipitation */}
            <div className="flex items-center gap-1 text-blue-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
              </svg>
              <span className="text-sm font-medium">{Math.round(day.precipitation_chance * 100)}%</span>
            </div>

            {/* Temps */}
            <div className="flex items-center gap-3 w-24 flex-shrink-0 justify-end">
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.round(day.temp_high)}°
              </span>
              <span className="text-gray-400 dark:text-gray-500">
                {Math.round(day.temp_low)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    return format(date, 'EEE');
  } catch {
    return dateStr;
  }
}
