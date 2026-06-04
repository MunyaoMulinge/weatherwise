import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import WeatherIcon from './WeatherIcon';
import type { HourlyForecast as HourlyForecastType } from '@/types';

interface HourlyForecastProps {
  hourly: HourlyForecastType[];
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const displayHours = hourly.slice(0, 24);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Hourly Forecast
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayHours.map((hour, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 min-w-[90px]"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(hour.time)}
            </p>
            <WeatherIcon
              condition={hour.condition}
              icon={hour.icon}
              size={24}
              className="text-blue-500"
            />
            <p className="font-semibold text-gray-900 dark:text-white">
              {Math.round(hour.temp)}°
            </p>
            {hour.precipitation_chance > 0 && (
              <p className="text-xs text-blue-500">
                {Math.round(hour.precipitation_chance * 100)}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(timeStr: string): string {
  try {
    const date = parseISO(timeStr);
    return format(date, 'h a');
  } catch {
    return timeStr;
  }
}
