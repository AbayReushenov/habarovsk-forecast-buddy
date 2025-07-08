
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Download, AlertTriangle, TrendingUp, Snowflake } from 'lucide-react';

export const RecommendationsPanel = () => {
  const recommendations = [
    {
      id: 1,
      type: 'warning',
      icon: AlertTriangle,
      priority: 'Высокий',
      title: 'Ожидается похолодание',
      description: 'Прогнозируется снижение температуры на -5°C в следующие 2 недели. Увеличьте запасы на 15%.',
      action: 'Увеличить заказ'
    },
    {
      id: 2,
      type: 'success',
      icon: TrendingUp,
      priority: 'Средний',
      title: 'Рост продаж',
      description: 'Модель прогнозирует рост продаж на 12% в декабре. Подготовьте дополнительный персонал.',
      action: 'Планировать штат'
    },
    {
      id: 3,
      type: 'info',
      icon: Snowflake,
      priority: 'Низкий',
      title: 'Сезонная акция',
      description: 'Рекомендуется запустить акцию "Зимняя распродажа" для увеличения продаж на 8%.',
      action: 'Создать акцию'
    }
  ];

  const exportReport = () => {
    // Здесь будет логика экспорта отчета в PDF
    console.log('Экспорт отчета в PDF');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Высокий': return 'bg-red-100 text-red-700 border-red-200';
      case 'Средний': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Низкий': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-red-500';
      case 'success': return 'text-green-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>Рекомендации</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportReport}
            className="hidden sm:flex"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF отчет
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => {
          const IconComponent = rec.icon;
          return (
            <div key={rec.id} className="border border-slate-200 rounded-lg p-3 space-y-2">
              {/* Заголовок с иконкой и приоритетом */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-4 w-4 ${getIconColor(rec.type)}`} />
                  <h4 className="text-sm font-medium">{rec.title}</h4>
                </div>
                <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                  {rec.priority}
                </Badge>
              </div>

              {/* Описание */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {rec.description}
              </p>

              {/* Действие */}
              <Button variant="outline" size="sm" className="w-full">
                {rec.action}
              </Button>
            </div>
          );
        })}

        {/* Общие рекомендации */}
        <div className="bg-slate-50 p-3 rounded-lg space-y-2">
          <h4 className="text-sm font-medium flex items-center space-x-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span>Общие советы</span>
          </h4>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            <li>Отслеживайте прогноз погоды еженедельно</li>
            <li>Корректируйте закупки за 2 недели до похолодания</li>
            <li>Используйте акции при прогнозируемом снижении продаж</li>
            <li>Анализируйте точность прогнозов для улучшения модели</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
