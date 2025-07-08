
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SalesData, ForecastData } from '@/pages/Index';

interface SalesChartProps {
  salesData: SalesData[];
  forecastData: ForecastData[];
}

export const SalesChart = ({ salesData, forecastData }: SalesChartProps) => {
  // Подготавливаем данные для графика
  const chartData = [...salesData.map(item => ({
    date: item.date,
    actual: item.sales_quantity,
    temperature: item.avg_temp,
    type: 'historical'
  })), ...forecastData.map(item => ({
    date: item.date,
    forecast: item.predicted_sales,
    confidence: item.confidence,
    type: 'forecast'
  }))].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatTooltip = (value: any, name: string) => {
    if (name === 'actual') return [`${value} шт`, 'Фактические продажи'];
    if (name === 'forecast') return [`${value} шт`, 'Прогноз продаж'];
    if (name === 'temperature') return [`${value}°C`, 'Температура'];
    return [value, name];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  return (
    <Card className="w-full h-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Продажи и прогноз</span>
          </div>
          <div className="flex items-center space-x-2">
            {salesData.length > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                История: {salesData.length} дней
              </Badge>
            )}
            {forecastData.length > 0 && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                <TrendingUp className="h-3 w-3 mr-1" />
                Прогноз: 4 недели
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                yAxisId="sales"
                orientation="left"
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                yAxisId="temp"
                orientation="right"
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={(label) => `Дата: ${formatDate(label)}`}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              
              {/* Линия фактических продаж */}
              <Line
                yAxisId="sales"
                type="monotone"
                dataKey="actual"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                connectNulls={false}
                name="Фактические продажи"
              />
              
              {/* Линия прогноза */}
              <Line
                yAxisId="sales"
                type="monotone"
                dataKey="forecast"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                connectNulls={false}
                name="Прогноз продаж"
              />
              
              {/* Линия температуры */}
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                stroke="#10b981"
                strokeWidth={1}
                dot={false}
                connectNulls={false}
                name="Температура (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-slate-500">
            <div className="text-center space-y-2">
              <BarChart3 className="h-12 w-12 mx-auto opacity-50" />
              <p className="text-lg font-medium">График будет доступен после загрузки данных</p>
              <p className="text-sm">Загрузите CSV файл с историческими данными продаж</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
