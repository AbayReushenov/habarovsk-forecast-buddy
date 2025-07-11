
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DataUpload } from '@/components/DataUpload';
import { SalesChart } from '@/components/SalesChart';
import { ForecastPanel } from '@/components/ForecastPanel';
import { MetricsCards } from '@/components/MetricsCards';
import { RecommendationsPanel } from '@/components/RecommendationsPanel';
import { SimpleAuth } from '@/components/SimpleAuth';
import { ApiStatus } from '@/components/ApiStatus';
import { useToast } from '@/hooks/use-toast';
import {
  useHealth,
  useGenerateForecast
} from '@/hooks/useApi';
import { SalesData as ApiSalesData } from '@/lib/api';

export interface SalesData {
  date: string;
  sku_id: string;
  sales_quantity: number;
  avg_temp: number;
}

export interface ForecastData {
    date: string
    predicted_sales: number
    confidence: number
    predicted_temp?: number
}

export interface Metrics {
    totalForecastSales: number
    avgWeeklySales: number
    trend: number
    accuracy: number
}

const Index = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [salesData, setSalesData] = useState<SalesData[]>([])
    const [forecastData, setForecastData] = useState<ForecastData[]>([])
    const [metrics, setMetrics] = useState<Metrics>({
        totalForecastSales: 0,
        avgWeeklySales: 0,
        trend: 0,
        accuracy: 0,
    })
    const { toast } = useToast()

    // API hooks
    const { data: healthData } = useHealth()
    const generateForecastMutation = useGenerateForecast()

    // Проверяем аутентификацию при загрузке
    useEffect(() => {
        const authStatus = localStorage.getItem('demo_authenticated')
        if (authStatus === 'true') {
            setIsAuthenticated(true)
            // Загружаем сохраненные данные
            loadSavedData()
        }
    }, [])

    const loadSavedData = () => {
        const savedSalesData = localStorage.getItem('sales_data')
        const savedForecastData = localStorage.getItem('forecast_data')
        const savedMetrics = localStorage.getItem('metrics')

        if (savedSalesData) {
            setSalesData(JSON.parse(savedSalesData))
        }
        if (savedForecastData) {
            setForecastData(JSON.parse(savedForecastData))
        }
        if (savedMetrics) {
            // Sanitize metrics to ensure we have numeric values
            try {
                const parsed = JSON.parse(savedMetrics)
                const sanitize = (val: unknown) => (typeof val === 'number' && !isNaN(val) ? val : 0)
                setMetrics({
                    totalForecastSales: sanitize(parsed.totalForecastSales),
                    avgWeeklySales: sanitize(parsed.avgWeeklySales),
                    trend: sanitize(parsed.trend),
                    accuracy: sanitize(parsed.accuracy),
                })
            } catch (e) {
                console.warn('Failed to parse saved metrics, resetting to defaults', e)
                setMetrics({ totalForecastSales: 0, avgWeeklySales: 0, trend: 0, accuracy: 0 })
            }
        }
    }

    const handleDataUpload = (data: SalesData[]) => {
        // Keep local data for immediate UI update
        setSalesData(data)

        // Persist uploaded sales data
        localStorage.setItem('sales_data', JSON.stringify(data))

        // Reset forecast-related state because base data changed
        setForecastData([])
        setMetrics({ totalForecastSales: 0, avgWeeklySales: 0, trend: 0, accuracy: 0 })

        // Remove outdated cached values
        localStorage.removeItem('forecast_data')
        localStorage.removeItem('metrics')
    }

    const generateForecast = async (promotions: string, priceChanges: string) => {
        // Use API to generate forecast
        generateForecastMutation.mutate({
            period_days: 30, // Generate 30-day forecast
            promotions: promotions || undefined,
            price_changes: priceChanges || undefined,
        })
    }

    // Handle successful forecast generation
    useEffect(() => {
        if (generateForecastMutation.data) {
            const result = generateForecastMutation.data

            // DEBUG: log raw response
            console.log('Forecast API raw result:', result)

            // Convert backend format to weekly aggregated forecast format
            const convertToSales = (p: any) => p?.predicted_sales ?? p?.predicted_units ?? p?.sales ?? 0
            const weeklyForecast: ForecastData[] = []
            for (let i = 0; i < result.predictions.length; i += 7) {
                const slice = result.predictions.slice(i, i + 7)
                if (slice.length < 7) {
                    // Incomplete final week — skip
                    break
                }
                const weekSales = slice.reduce((sum, cur) => sum + convertToSales(cur), 0)
                const avgConfidence = slice.reduce((sum, cur) => sum + (cur.confidence ?? 0), 0) / slice.length
                const avgTempRaw =
                    slice.reduce((sum, cur) => sum + ((cur as any).predicted_temp ?? 0), 0) / slice.length
                const avgTemp = Number.isFinite(avgTempRaw) ? Math.round(avgTempRaw * 10) / 10 : undefined
                let weekDate = new Date(slice[0].date)
                const lastSalesDate = salesData.length > 0 ? new Date(salesData[salesData.length - 1].date) : null
                if (lastSalesDate && weekDate <= lastSalesDate) {
                    // Shift one year ahead to reflect future forecast period
                    weekDate.setFullYear(weekDate.getFullYear() + 1)
                }

                weeklyForecast.push({
                    date: weekDate.toISOString().split('T')[0], // ISO yyyy-mm-dd
                    predicted_sales: weekSales,
                    confidence: avgConfidence,
                    predicted_temp: avgTemp,
                })
            }

            // DEBUG: log weekly aggregated forecast
            console.log('Weekly aggregated forecast:', weeklyForecast)

            // Use aggregated forecast for UI
            const convertedForecast: ForecastData[] = weeklyForecast

            // Calculate metrics from response
            const totalForecastUnits =
                (result as any).total_predicted_sales ?? (result as any).total_predicted_units ?? 0
            const avgDailySales = totalForecastUnits / result.forecast_period
            const trend =
                salesData.length > 0
                    ? ((avgDailySales - salesData.slice(-7).reduce((sum, item) => sum + item.sales_quantity, 0) / 7) /
                          (salesData.slice(-7).reduce((sum, item) => sum + item.sales_quantity, 0) / 7)) *
                      100
                    : 0

            // Update local state with API response
            setForecastData(convertedForecast)
            setMetrics({
                totalForecastSales: totalForecastUnits,
                avgWeeklySales: avgDailySales * 7,
                trend: trend,
                accuracy: result.average_confidence * 100,
            })

            // Save to localStorage for persistence
            localStorage.setItem('forecast_data', JSON.stringify(convertedForecast))
            localStorage.setItem(
                'metrics',
                JSON.stringify({
                    totalForecastSales: totalForecastUnits,
                    avgWeeklySales: avgDailySales * 7,
                    trend: trend,
                    accuracy: result.average_confidence * 100,
                })
            )
        }
    }, [generateForecastMutation.data, salesData])

    const handleAuthentication = () => {
        setIsAuthenticated(true)
    }

    if (!isAuthenticated) {
        return <SimpleAuth onAuthenticated={handleAuthentication} />
    }

    return (
        <div className='min-h-screen bg-slate-50'>
            <Header />

            <main className='container mx-auto px-4 py-6 space-y-6'>
                {/* Заголовок */}
                <div className='text-center space-y-2 animate-fade-in'>
                    <h1 className='text-4xl font-bold text-slate-800'>Прогнозирование продаж пуховиков</h1>
                    <p className='text-lg text-slate-600'>Хабаровск • AI-powered прогнозы</p>
                </div>

                {/* Основная сетка */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                    {/* Левая колонка - Загрузка данных */}
                    <div className='lg:col-span-3 space-y-6'>
                        <ApiStatus />
                        <DataUpload onDataUpload={handleDataUpload} />
                        <MetricsCards metrics={metrics} />
                    </div>

                    {/* Центральная колонка - График */}
                    <div className='lg:col-span-6'>
                        <SalesChart salesData={salesData} forecastData={forecastData} />
                    </div>

                    {/* Правая колонка - Управление и отчеты */}
                    <div className='lg:col-span-3 space-y-6'>
                        <ForecastPanel
                            onGenerateForecast={generateForecast}
                            isGenerating={generateForecastMutation.isPending}
                        />
                        <RecommendationsPanel />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Index;
