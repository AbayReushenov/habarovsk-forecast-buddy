
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';
import { Metrics } from '@/pages/Index';

interface MetricsCardsProps {
  metrics: Metrics;
}

export const MetricsCards = ({ metrics }: MetricsCardsProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(num));
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <BarChart3 className="h-4 w-4 text-slate-500" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'bg-green-50 text-green-700 border-green-200';
    if (trend < 0) return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return 'text-green-600';
    if (accuracy >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* Общие продажи */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Target className="h-4 w-4 text-primary" />
            <span>Прогноз продаж</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {formatNumber(metrics.totalForecastSales)}
          </div>
          <p className="text-xs text-slate-600">шт. на 4 недели</p>
        </CardContent>
      </Card>

      {/* Средние продажи */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-accent" />
            <span>Средние продажи</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">
            {formatNumber(metrics.avgWeeklySales)}
          </div>
          <p className="text-xs text-slate-600">шт. в неделю</p>
        </CardContent>
      </Card>

      {/* Тренд */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            {getTrendIcon(metrics.trend)}
            <span>Тренд продаж</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              {metrics.trend >= 0 ? '+' : ''}{metrics.trend.toFixed(1)}%
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${getTrendColor(metrics.trend)}`}
            >
              {metrics.trend > 0 ? 'Рост' : metrics.trend < 0 ? 'Спад' : 'Стабильно'}
            </Badge>
          </div>
          <p className="text-xs text-slate-600">к предыдущему периоду</p>
        </CardContent>
      </Card>

      {/* Точность модели */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Target className="h-4 w-4 text-slate-500" />
            <span>Точность модели</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getAccuracyColor(metrics.accuracy)}`}>
            {metrics.accuracy.toFixed(1)}%
          </div>
          <p className="text-xs text-slate-600">средняя точность</p>
        </CardContent>
      </Card>

      {/* Дополнительная информация */}
      <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
        <p className="font-medium mb-1">Статистика:</p>
        <ul className="space-y-1">
          <li>• Данные обновляются в реальном времени</li>
          <li>• Учитывается сезонность и погода</li>
          <li>• Модель обучается на исторических данных</li>
        </ul>
      </div>
    </div>
  );
};
