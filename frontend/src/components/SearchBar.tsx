import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, X, Loader2, Navigation } from 'lucide-react';
import { useLocationSearch } from '@/hooks/useWeather';

interface SearchBarProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { results, isSearching, search, clear } = useLocationSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useCallback(
    (() => {
      let timeout: ReturnType<typeof setTimeout>;
      return (value: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => search(value), 400);
      };
    })(),
    [search]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length >= 2) {
      setIsOpen(true);
      debouncedSearch(value);
    } else {
      clear();
      setIsOpen(false);
    }
  };

  const handleSelect = (lat: number, lon: number, name: string) => {
    onLocationSelect(lat, lon, name);
    setQuery(name);
    setIsOpen(false);
    clear();
  };

  const handleClear = () => {
    setQuery('');
    clear();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSelect(
            position.coords.latitude,
            position.coords.longitude,
            'My Location'
          );
          setQuery('My Location');
        },
        () => {
          // Fallback handled by parent
        }
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim().length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder="Search for a city..."
          className="w-full pl-12 pr-24 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg text-lg"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleDetectLocation}
            className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
            title="Use my location"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (results.length > 0 || isSearching) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {isSearching && results.length === 0 && (
            <div className="flex items-center justify-center py-4 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Searching...
            </div>
          )}
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelect(result.lat, result.lon, result.name)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
            >
              <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{result.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {result.display_name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
