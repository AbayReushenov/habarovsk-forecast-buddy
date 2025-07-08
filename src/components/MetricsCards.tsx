
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, BarChart } from 'lucide-react';
import { Metrics } from '@/pages/Index';

interface MetricsCardsProps {
  metrics: Metrics;
}

export const MetricsCards = ({ metrics }: MetricsCardsProps) => {
  const formatNumber = (num: number) => {
    return Math.round(num).toLocaleString('ru-RU');
  };

  const formatPercent = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  return (
    <div className="space-y-4">
      {/* Общие продажи прогноз */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Прогноз на 4 недели</CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {formatNumber(metrics.totalForecastSales)} шт
          </div>
          <p className="text-xs text-slate-600">
            общие продажи пуховиков
          </p>
        </CardContent>
      </Card>

      {/* Средние продажи в неделю */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Среднее в неделю</CardTitle>
          <BarChart className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(metrics.avgWeeklySales)} шт
          </div>
          <p className="text-xs text-slate-600">
            прогнозируемые продажи
          </p>
        </CardContent>
      </Card>

      {/* Тренд */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Тренд</CardTitle>
          {metrics.trend >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            metrics.trend >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatPercent(metrics.trend)}
          </div>
          <p className="text-xs text-slate-600">
            {metrics.trend >= 0 ? 'рост' : 'снижение'} к прошлой неделе
          </p>
        </CardContent>
      </Card>

      {/* Точность модели */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Точность модели</CardTitle>
          <div className="h-4 w-4 bg-green-500 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {metrics.accuracy.toFixed(1)}%
          </div>
          <p className="text-xs text-slate-600">
            средняя точность прогнозов
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
