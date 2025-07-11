
import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUploadCsvFile, useDownloadSample } from '@/hooks/useApi';
import { SalesData } from '@/pages/Index';

interface DataUploadProps {
  onDataUpload: (data: SalesData[]) => void;
}

export const DataUpload = ({ onDataUpload }: DataUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<SalesData[]>([]);
  const [isValidData, setIsValidData] = useState<boolean | null>(null);
  const { toast } = useToast();

  // API hooks
  const uploadMutation = useUploadCsvFile();
  const downloadMutation = useDownloadSample();

  const validateCsvData = (data: any[]): SalesData[] => {
    // Support both old format and new backend format
    const requiredColumnsOld = ['date', 'sku_id', 'sales_quantity', 'avg_temp'];
    const requiredColumnsNew = ['sku_id', 'date', 'units_sold', 'weather_temp'];

    if (data.length === 0) {
      throw new Error('Файл пустой');
    }

    const firstRow = data[0];
    const hasOldFormat = requiredColumnsOld.every(col => col in firstRow);
    const hasNewFormat = requiredColumnsNew.every(col => col in firstRow);

    if (!hasOldFormat && !hasNewFormat) {
      throw new Error(`Нужные колонки: ${requiredColumnsNew.join(', ')} или ${requiredColumnsOld.join(', ')}`);
    }

    return data.map((row, index) => {
      let salesQuantity: number;
      let avgTemp: number;

      if (hasNewFormat) {
        // New backend format
        salesQuantity = parseInt(row.units_sold);
        avgTemp = row.weather_temp ? parseFloat(row.weather_temp) : 0;
      } else {
        // Old format
        salesQuantity = parseInt(row.sales_quantity);
        avgTemp = parseFloat(row.avg_temp);
      }

      if (isNaN(salesQuantity)) {
        throw new Error(`Некорректные данные продаж в строке ${index + 1}`);
      }

      return {
        date: row.date,
        sku_id: row.sku_id,
        sales_quantity: salesQuantity,
        avg_temp: avgTemp || 0
      };
    });
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });
  };

  const handleFileUpload = useCallback(async (file: File) => {
    try {
        const text = await file.text()
        const parsedData = parseCSV(text)
        const validatedData = validateCsvData(parsedData)

        setPreviewData(validatedData.slice(0, 5))
        setIsValidData(true)
        setUploadedFile(file)

        toast({
            title: 'Файл загружен',
            description: `Найдено ${validatedData.length} записей. Проверьте данные перед сохранением.`,
        })
    } catch (error) {
        setIsValidData(false)
        toast({
            title: 'Ошибка валидации',
            description: error instanceof Error ? error.message : 'Некорректный формат файла',
            variant: 'destructive',
        })
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      handleFileUpload(file);
    } else {
      toast({
        title: "Неподдерживаемый формат",
        description: "Пожалуйста, загрузите CSV файл",
        variant: "destructive",
      });
    }
  }, [handleFileUpload, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const saveData = async () => {
    if (uploadedFile && isValidData) {
      try {
          // Upload file to API
          uploadMutation.mutate(uploadedFile)

          // Also parse for local preview (fallback)
          const text = await uploadedFile.text()
          const parsedData = parseCSV(text)
          const validatedData = validateCsvData(parsedData)

          onDataUpload(validatedData)

          // Сброс состояния
          setUploadedFile(null)
          setPreviewData([])
          setIsValidData(null)
      } catch (error) {
          toast({
              title: 'Ошибка сохранения',
              description: 'Не удалось сохранить данные',
              variant: 'destructive',
          })
      }
    }
  };

  const downloadTemplate = () => {
    // Try to download from API first
    downloadMutation.mutate();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-primary" />
            <span>Загрузка данных</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Шаблон
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Зона загрузки */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : isValidData === true
                ? 'border-green-300 bg-green-50'
                : isValidData === false
                  ? 'border-red-300 bg-red-50'
                  : 'border-slate-300 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
            id="csv-upload"
          />

          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="space-y-2">
              {isValidData === true ? (
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
              ) : isValidData === false ? (
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
              ) : (
                <FileText className="h-8 w-8 text-slate-400 mx-auto" />
              )}

              <div>
                <p className="text-sm font-medium">
                  {uploadedFile ? uploadedFile.name : 'Перетащите CSV файл сюда'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  или нажмите для выбора файла
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Формат данных */}
        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
          <p className="font-medium mb-1">Формат CSV:</p>
          <p>sku_id, date, units_sold, revenue, weather_temp, season</p>
          <p className="text-slate-500 mt-1">или: date, sku_id, sales_quantity, avg_temp</p>
        </div>

        {/* Предпросмотр данных */}
        {previewData.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Предпросмотр данных:</h4>
            <div className="text-xs space-y-1 max-h-32 overflow-y-auto bg-slate-50 p-2 rounded">
              {previewData.map((row, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  <span>{row.date}</span>
                  <span>{row.sku_id}</span>
                  <span>{row.sales_quantity}</span>
                  <span>{row.avg_temp}°C</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Кнопка сохранения */}
        {isValidData && uploadedFile && (
          <Button
            onClick={saveData}
            className="w-full animate-pulse-glow"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Загрузка...' : 'Сохранить данные'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
