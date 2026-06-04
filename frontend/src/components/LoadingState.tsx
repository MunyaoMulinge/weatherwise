import { Cloud, Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="py-16 text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse" />
        <div className="absolute inset-2 bg-blue-200 dark:bg-blue-800/40 rounded-full animate-pulse delay-75" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cloud className="w-10 h-10 text-blue-500 animate-float" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Loading weather data...
      </h3>
      <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Fetching forecasts from Weather-AI
      </p>
    </div>
  );
}
