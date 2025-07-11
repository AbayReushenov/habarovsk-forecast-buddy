/**
 * API service for communication with FastAPI backend
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

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

export interface ForecastRequest {
  sku_id?: string;
  period_days: number;
  promotions?: string;
  price_changes?: string;
}

export interface ForecastResponse {
    sku_id: string
    forecast_period: number
    generated_at: string
    predictions: Array<{
        date: string
        predicted_units?: number
        predicted_sales?: number // new field from backend
        predicted_revenue?: number
        confidence: number
        sales?: number // sometimes backend may return 'sales' in mock
    }>
    total_predicted_units?: number
    total_predicted_sales?: number // aggregate when backend renamed field
    total_predicted_revenue?: number
    average_confidence: number
    model_explanation?: string
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health check
  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  // Upload CSV file
  async uploadCsvFile(file: File): Promise<{ message: string; rows_processed: number }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload-csv`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Download sample CSV
  async downloadSampleCsv(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/sample-csv`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.blob();
  }

  // Generate forecast
  async generateForecast(request: ForecastRequest): Promise<ForecastResponse> {
    return this.request<ForecastResponse>('/forecast', {
      method: 'POST',
      body: JSON.stringify({
        sku_id: request.sku_id || 'DOWN_JACKET_001',
        period: request.period_days === 7 ? "7" : request.period_days === 14 ? "14" : "30", // Convert to string
        context: `Промоции: ${request.promotions || 'нет'}. Изменения цен: ${request.price_changes || 'нет'}.`,
      }),
    });
  }

  // Get sales data for SKU
  async getSalesData(skuId: string, limit: number = 52): Promise<{ sku_id: string; data: SalesData[]; total_records: number }> {
    return this.request(`/data/${skuId}?limit=${limit}`);
  }
}

export const apiService = new ApiService();
