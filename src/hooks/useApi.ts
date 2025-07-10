/**
 * React hooks for API integration with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, type SalesData, type ForecastRequest, type ForecastResponse, type HealthResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const queryKeys = {
  health: ['health'] as const,
  forecast: (period: number) => ['forecast', period] as const,
};

// Health check hook
export const useHealth = () => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => apiService.getHealth(),
    refetchInterval: 30000, // Check every 30 seconds
    retry: 2,
  });
};

// Upload CSV file mutation
export const useUploadCsvFile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => apiService.uploadCsvFile(file),
    onSuccess: (result) => {
      toast({
        title: "Данные загружены",
        description: `Успешно загружено ${result.rows_processed} записей продаж`,
      });
      // Invalidate forecast queries to refetch with new data
      queryClient.invalidateQueries({ queryKey: ['forecast'] });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить данные. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });
};

// Generate forecast mutation
export const useGenerateForecast = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ForecastRequest) => apiService.generateForecast(request),
    onSuccess: (result) => {
      toast({
        title: "Прогноз сгенерирован",
        description: `Создан прогноз на ${result.forecast.length} дней с учетом указанных факторов`,
      });
      // Cache the result
      queryClient.setQueryData(['forecast', 'custom'], result);
    },
    onError: (error) => {
      console.error('Forecast generation error:', error);
      toast({
        title: "Ошибка генерации прогноза",
        description: "Не удалось сгенерировать прогноз. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });
};

// Get sales data hook
export const useSalesData = (skuId: string, limit: number = 52, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['salesData', skuId, limit],
    queryFn: () => apiService.getSalesData(skuId, limit),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Download sample CSV hook
export const useDownloadSample = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => apiService.downloadSampleCsv(),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sample_sales_data.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Файл загружен",
        description: "Образец CSV файла успешно загружен",
      });
    },
    onError: (error) => {
      console.error('Download error:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить образец файла",
        variant: "destructive",
      });
    },
  });
};
