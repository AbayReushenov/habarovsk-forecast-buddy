
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DataUpload } from '@/components/DataUpload';
import { SalesChart } from '@/components/SalesChart';
import { ForecastPanel } from '@/components/ForecastPanel';
import { MetricsCards } from '@/components/MetricsCards';
import { RecommendationsPanel } from '@/components/RecommendationsPanel';
import { SimpleAuth } from '@/components/SimpleAuth';
import { useToast } from '@/hooks/use-toast';

export interface SalesData {
  date: string;
  sku_id: string;
  sales_quantity: number;
  avg_temp: number;
}

export interface ForecastData {
  date: string;
  predicted_sales: number;
  confidence: number;
}

export interface Metrics {
  totalForecastSales: number;
  avgWeeklySales: number;
  trend: number;
  accuracy: number;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalForecastSales: 0,
    avgWeeklySales: 0,
    trend: 0,
    accuracy: 0
  });
  const [isGeneratingForecast, setIsGeneratingForecast] = useState(false);
  const { toast } = useToast();

  // Проверяем аутентификацию при загрузке
  useEffect(() => {
    const authStatus = localStorage.getItem('demo_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      // Загружаем сохраненные данные
      loadSavedData();
    }
  }, []);

  const loadSavedData = () => {
    const savedSalesData = localStorage.getItem('sales_data');
    const savedForecastData = localStorage.getItem('forecast_data');
    const savedMetrics = localStorage.getItem('metrics');

    if (savedSalesData) {
      setSalesData(JSON.parse(savedSalesData));
    }
    if (savedForecastData) {
      setForecastData(JSON.parse(savedForecastData));
    }
    if (savedMetrics) {
      setMetrics(JSON.parse(savedMetrics));
    }
  };

  const handleDataUpload = (data: SalesData[]) => {
    setSalesData(data);
    localStorage.setItem('sales_data', JSON.stringify(data));
    toast({
      title: "Данные загружены",
      description: `Успешно загружено ${data.length} записей продаж`,
    });
  };

  const generateForecast = async (promotions: string, priceChanges: string) => {
    setIsGeneratingForecast(true);
    
    try {
      // Имитация генерации прогноза с учетом промоций и изменений цен
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Генерируем более реалистичные данные прогноза
      const baselineSales = salesData.length > 0 
        ? salesData.slice(-7).reduce((sum, item) => sum + item.sales_quantity, 0) / 7
        : 50;
      
      const mockForecast: ForecastData[] = Array.from({ length: 4 }, (_, i) => {
        let adjustedSales = baselineSales;
        
        // Учитываем влияние промоций
        if (promotions.includes('скидка') || promotions.includes('акция')) {
          adjustedSales *= 1.2; // +20% от промоций
        }
        
        // Учитываем изменения цен
        if (priceChanges.includes('+')) {
          adjustedSales *= 0.9; // -10% от роста цен
        } else if (priceChanges.includes('-')) {
          adjustedSales *= 1.1; // +10% от снижения цен
        }
        
        // Добавляем сезонность и случайность
        const seasonalFactor = 1 + Math.sin((i / 4) * Math.PI) * 0.2;
        const randomFactor = 0.8 + Math.random() * 0.4;
        
        return {
          date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          predicted_sales: Math.round(adjustedSales * seasonalFactor * randomFactor),
          confidence: Math.random() * 0.2 + 0.75
        };
      });
      
      setForecastData(mockForecast);
      localStorage.setItem('forecast_data', JSON.stringify(mockForecast));
      
      // Вычисляем метрики
      const totalForecast = mockForecast.reduce((sum, item) => sum + item.predicted_sales, 0);
      const avgWeekly = totalForecast / 4;
      const lastWeekSales = salesData.slice(-7).reduce((sum, item) => sum + item.sales_quantity, 0);
      const trend = lastWeekSales > 0 ? ((avgWeekly - lastWeekSales) / lastWeekSales) * 100 : 0;
      
      const newMetrics = {
        totalForecastSales: totalForecast,
        avgWeeklySales: avgWeekly,
        trend: trend,
        accuracy: 82.5 + Math.random() * 10
      };
      
      setMetrics(newMetrics);
      localStorage.setItem('metrics', JSON.stringify(newMetrics));
      
      toast({
        title: "Прогноз сгенерирован",
        description: "Успешно создан прогноз на 4 недели с учетом указанных факторов",
      });
    } catch (error) {
      console.error('Ошибка генерации прогноза:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать прогноз. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingForecast(false);
    }
  };

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <SimpleAuth onAuthenticated={handleAuthentication} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Заголовок */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl font-bold text-slate-800">
            Прогнозирование продаж пуховиков
          </h1>
          <p className="text-lg text-slate-600">Хабаровск • AI-powered прогнозы</p>
        </div>

        {/* Основная сетка */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Левая колонка - Загрузка данных */}
          <div className="lg:col-span-3 space-y-6">
            <DataUpload onDataUpload={handleDataUpload} />
            <MetricsCards metrics={metrics} />
          </div>

          {/* Центральная колонка - График */}
          <div className="lg:col-span-6">
            <SalesChart 
              salesData={salesData} 
              forecastData={forecastData}
            />
          </div>

          {/* Правая колонка - Управление и отчеты */}
          <div className="lg:col-span-3 space-y-6">
            <ForecastPanel 
              onGenerateForecast={generateForecast}
              isGenerating={isGeneratingForecast}
            />
            <RecommendationsPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
