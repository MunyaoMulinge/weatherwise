import { BarChart3, Zap, Calendar } from 'lucide-react';
import { useUsage } from '@/hooks/useWeather';

export default function UsageStats() {
  const { data: usage, isLoading } = useUsage();

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      </div>
    );
  }

  if (!usage) return null;

  const requestPercent = (usage.requests_used / usage.requests_limit) * 100;
  const aiPercent = (usage.ai_requests_used / usage.ai_requests_limit) * 100;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          API Usage
        </h3>
        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full capitalize">
          {usage.plan}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Requests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                API Requests
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {usage.requests_used.toLocaleString()} / {usage.requests_limit.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(requestPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {usage.requests_remaining.toLocaleString()} remaining
          </p>
        </div>

        {/* AI Requests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SparklesIcon />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI Summaries
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {usage.ai_requests_used.toLocaleString()} / {usage.ai_requests_limit.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(aiPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {usage.ai_requests_remaining.toLocaleString()} remaining
          </p>
        </div>
      </div>

      {usage.resets_at && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Calendar className="w-4 h-4 text-gray-400" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Resets on {new Date(usage.resets_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
