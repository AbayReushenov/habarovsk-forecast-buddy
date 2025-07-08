
import { Activity, Database, Download, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('demo_authenticated');
    localStorage.removeItem('sales_data');
    localStorage.removeItem('forecast_data');
    localStorage.removeItem('metrics');
    window.location.reload();
    toast({
      title: "Выход выполнен",
      description: "Данные сессии очищены",
    });
  };

  const exportAllData = () => {
    const salesData = localStorage.getItem('sales_data');
    const forecastData = localStorage.getItem('forecast_data');
    const metrics = localStorage.getItem('metrics');
    
    const exportData = {
      exported_at: new Date().toISOString(),
      sales_data: salesData ? JSON.parse(salesData) : [],
      forecast_data: forecastData ? JSON.parse(forecastData) : [],
      metrics: metrics ? JSON.parse(metrics) : {}
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_forecast_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Данные экспортированы",
      description: "Все данные успешно сохранены в файл",
    });
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Логотип и заголовок */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">SalesForecast</h1>
              <p className="text-sm text-slate-600">Пуховики • Хабаровск • Демо-режим</p>
            </div>
          </div>

          {/* Статус и действия */}
          <div className="flex items-center space-x-4">
            {/* Статус локального хранилища */}
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-blue-500" />
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Локальное хранилище
              </Badge>
            </div>

            {/* Кнопка экспорта */}
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex"
              onClick={exportAllData}
            >
              <Download className="h-4 w-4 mr-2" />
              Экспорт данных
            </Button>

            {/* Кнопка выхода */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
