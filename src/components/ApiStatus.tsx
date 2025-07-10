/**
 * API Status component showing backend connection health
 */

import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { useHealth } from '@/hooks/useApi';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ApiStatus = () => {
  const { data: health, isLoading, isError } = useHealth();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 animate-pulse text-gray-400" />
            <span className="text-sm text-gray-600">Проверка соединения...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !health) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">API недоступен</span>
            <Badge variant="destructive" className="text-xs">
              Offline
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

    return (
    <Card className="w-full border-green-200 bg-green-50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700">API подключен</span>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              {health.status}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">v{health.version}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
