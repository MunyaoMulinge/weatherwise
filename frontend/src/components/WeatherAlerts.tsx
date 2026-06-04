import { AlertTriangle, AlertCircle, Info, XCircle } from 'lucide-react';
import type { WeatherAlert } from '@/types';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

const severityConfig = {
  minor: { icon: Info, color: 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  moderate: { icon: AlertCircle, color: 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  severe: { icon: AlertTriangle, color: 'bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
  extreme: { icon: XCircle, color: 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800' },
};

export default function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => {
        const config = severityConfig[alert.severity] || severityConfig.moderate;
        const Icon = config.icon;
        
        return (
          <div
            key={index}
            className={`flex items-start gap-3 p-4 rounded-xl border ${config.color}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold">{alert.title}</h4>
              <p className="text-sm opacity-90 mt-1">{alert.description}</p>
              {(alert.start || alert.end) && (
                <p className="text-xs opacity-70 mt-2">
                  {alert.start && `From ${new Date(alert.start).toLocaleString()}`}
                  {alert.start && alert.end && ' — '}
                  {alert.end && `Until ${new Date(alert.end).toLocaleString()}`}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
