
import { Activity, Database, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
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
              <p className="text-sm text-slate-600">Пуховики • Хабаровск</p>
            </div>
          </div>

          {/* Статус и действия */}
          <div className="flex items-center space-x-4">
            {/* Статус подключения */}
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-green-500" />
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Подключено к БД
              </Badge>
            </div>

            {/* Кнопка экспорта */}
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" />
              Экспорт данных
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
