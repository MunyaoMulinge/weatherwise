import { useEffect, useState } from 'react';
import { Cloud, Moon, Sun, Wind } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import SearchBar from '@/components/SearchBar';
import CurrentWeather from '@/components/CurrentWeather';
import DailyForecast from '@/components/DailyForecast';
import HourlyForecast from '@/components/HourlyForecast';
import WeatherMap from '@/components/WeatherMap';
import AISummary from '@/components/AISummary';
import UsageStats from '@/components/UsageStats';
import WeatherAlerts from '@/components/WeatherAlerts';
import LoadingState from '@/components/LoadingState';

function App() {
  const { location, weather, isLoading, isError, error, detectLocation, setLocation } = useWeather();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  const getWeatherGradient = () => {
    if (!weather) return 'from-blue-500 to-blue-700';
    const condition = weather.current.condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) return 'from-amber-400 to-orange-500';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'from-blue-500 to-blue-700';
    if (condition.includes('cloud')) return 'from-gray-400 to-slate-600';
    if (condition.includes('storm') || condition.includes('thunder')) return 'from-indigo-600 to-purple-700';
    if (condition.includes('snow')) return 'from-slate-300 to-slate-500';
    return 'from-blue-500 to-cyan-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                WeatherWise
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <a
                href="https://weather-ai.co/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Wind className="w-4 h-4" />
                API Docs
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className={`relative bg-gradient-to-br ${getWeatherGradient()} transition-all duration-1000`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              WeatherWise Dashboard
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Real-time forecasts, AI-powered insights, and intelligent weather analytics powered by Weather-AI
            </p>
          </div>
          <SearchBar onLocationSelect={setLocation} />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && !weather && <LoadingState />}

        {isError && !weather && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Cloud className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load weather data
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {error?.message || 'Please check your connection and try again.'}
            </p>
            <button
              onClick={() => detectLocation()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {weather && (
          <div className="space-y-8">
            {/* Location header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {weather.location.city || location?.name || 'Current Location'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {weather.location.region && `${weather.location.region}, `}
                  {weather.location.country}
                </p>
              </div>
              <span className="text-sm text-gray-400 dark:text-gray-500">
                Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Alerts */}
            {weather.alerts && weather.alerts.length > 0 && (
              <WeatherAlerts alerts={weather.alerts} />
            )}

            {/* Current Weather + Map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CurrentWeather current={weather.current} />
              </div>
              <div className="lg:col-span-1">
                <WeatherMap
                  lat={weather.location.lat}
                  lon={weather.location.lon}
                  city={weather.location.city}
                />
              </div>
            </div>

            {/* AI Summary */}
            {weather.ai_summary && <AISummary summary={weather.ai_summary} />}

            {/* Hourly Forecast */}
            {weather.hourly && weather.hourly.length > 0 && (
              <HourlyForecast hourly={weather.hourly} />
            )}

            {/* Daily Forecast */}
            {weather.forecast && weather.forecast.length > 0 && (
              <DailyForecast forecast={weather.forecast} />
            )}

            {/* Usage Stats */}
            <UsageStats />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-900 dark:text-white">WeatherWise</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Built with Weather-AI API • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
