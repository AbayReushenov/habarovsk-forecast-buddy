
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Calendar, Percent } from 'lucide-react';

interface ForecastPanelProps {
  onGenerateForecast: (promotions: string, priceChanges: string) => Promise<void>;
  isGenerating: boolean;
}

export const ForecastPanel = ({ onGenerateForecast, isGenerating }: ForecastPanelProps) => {
  const [promotions, setPromotions] = useState('');
  const [priceChanges, setPriceChanges] = useState('');

  const handleGenerateForecast = async () => {
    await onGenerateForecast(promotions, priceChanges);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <span>Генерация прогноза</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Планируемые акции */}
        <div className="space-y-2">
          <Label htmlFor="promotions" className="flex items-center space-x-2">
            <Percent className="h-4 w-4" />
            <span>Планируемые акции</span>
          </Label>
          <Textarea
            id="promotions"
            placeholder="Например: Скидка 20% с 15.12 по 25.12, промокод WINTER10 до конца месяца"
            value={promotions}
            onChange={(e) => setPromotions(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Изменения цен */}
        <div className="space-y-2">
          <Label htmlFor="price-changes" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Изменения цен товаров</span>
          </Label>
          <Textarea
            id="price-changes"
            placeholder="Например: SKU123 +15% с 01.01, SKU456 -10% с 20.12"
            value={priceChanges}
            onChange={(e) => setPriceChanges(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Кнопка генерации */}
        <Button
          onClick={handleGenerateForecast}
          disabled={isGenerating}
          className="w-full bg-accent hover:bg-accent/90 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Генерируем прогноз...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Сгенерировать прогноз
            </>
          )}
        </Button>

        {/* Информация */}
        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
          <p className="font-medium mb-1">Факторы учитываемые в прогнозе:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Корреляция температуры и продаж</li>
            <li>Сезонность продаж пуховиков</li>
            <li>Планируемые маркетинговые активности</li>
            <li>Исторические тренды</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
