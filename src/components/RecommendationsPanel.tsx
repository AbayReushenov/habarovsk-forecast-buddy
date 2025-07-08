
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Download } from 'lucide-react';

export const RecommendationsPanel = () => {
  const recommendations = [
    {
      type: 'success',
      title: 'Увеличить закупки',
      description: 'Прогноз показывает рост продаж на 15% в следующем месяце',
      priority: 'high',
      action: 'Заказать дополнительные 200 единиц SKU001'
    },
    {
      type: 'warning',
      title: 'Температурная корреляция',
      description: 'При снижении температуры на 5°C ожидается рост продаж на 12%',
      priority: 'medium',
      action: 'Подготовить рекламную кампанию'
    },
    {
      type: 'info',
      title: 'Оптимизация цен',
      description: 'Рекомендуется снизить цены на 3% для максимизации прибыли',
      priority: 'low',
      action: 'Провести A/B тестирование цен'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const exportReport = () => {
    const reportData = {
      generated_at: new Date().toISOString(),
      recommendations: recommendations,
      summary: {
        total_recommendations: recommendations.length,
        high_priority: recommendations.filter(r => r.priority === 'high').length,
        medium_priority: recommendations.filter(r => r.priority === 'medium').length,
        low_priority: recommendations.filter(r => r.priority === 'low').length
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span>Рекомендации</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportReport}
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Отчет
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {getIcon(rec.type)}
                <h4 className="font-medium text-sm">{rec.title}</h4>
              </div>
              <Badge 
                variant="outline" 
                className={`text-xs ${getPriorityColor(rec.priority)}`}
              >
                {rec.priority === 'high' ? 'Высокий' : rec.priority === 'medium' ? 'Средний' : 'Низкий'}
              </Badge>
            </div>
            
            <p className="text-xs text-slate-600">
              {rec.description}
            </p>
            
            <div className="bg-slate-50 p-2 rounded text-xs">
              <span className="font-medium">Действие: </span>
              {rec.action}
            </div>
          </div>
        ))}

        {/* Дополнительная информация */}
        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
          <p className="font-medium mb-1">Факторы анализа:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Сезонные тренды продаж</li>
            <li>Корреляция с температурой</li>
            <li>Эффективность промо-акций</li>
            <li>Динамика цен конкурентов</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
