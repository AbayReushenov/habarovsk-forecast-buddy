
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleAuthProps {
  onAuthenticated: () => void;
}

export const SimpleAuth = ({ onAuthenticated }: SimpleAuthProps) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Имитация небольшой задержки для UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (password === 'khabarovsk2024') {
      localStorage.setItem('demo_authenticated', 'true');
      onAuthenticated();
      toast({
        title: "Авторизация успешна",
        description: "Добро пожаловать в систему прогнозирования продаж!",
      });
    } else {
      toast({
        title: "Неверный пароль",
        description: "Проверьте правильность введенного пароля",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            SalesForecast
          </CardTitle>
          <p className="text-slate-600">Демо-доступ к системе прогнозирования</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Пароль для демо-доступа</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="text-center"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Проверяем...' : 'Войти в систему'}
            </Button>
          </form>
          <div className="text-center mt-6 text-xs text-slate-500">
            <p>Демо-версия системы прогнозирования продаж</p>
            <p>Данные сохраняются локально в браузере</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
