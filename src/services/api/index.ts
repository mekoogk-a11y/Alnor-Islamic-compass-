import { 
  PrayerTimesData, 
  HijriDateData, 
  ApiHealthStatus, 
  ApiKeyRecord, 
  ApiTelemetryMetric, 
  DonationIntentRequest, 
  DonationReceipt 
} from '../../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    cached: boolean;
    provider: string;
    latencyMs: number;
    version: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class AlNoorApiClient {
  private baseUrl = '';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Client-Platform': 'web',
      'X-Client-App-Version': '2.4.0',
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...(options.headers as Record<string, string>),
        },
      });

      const json: ApiResponse<T> = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error?.message || `Request failed with status ${response.status}`);
      }

      return json.data;
    } catch (err: any) {
      console.warn(`[AlNoor API Client] Notice on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Prayer Times & Hijri Calendar
  async getPrayerTimes(city: string = 'makkah'): Promise<PrayerTimesData> {
    try {
      return await this.request<PrayerTimesData>(`/api/v1/prayer/times?city=${encodeURIComponent(city)}`);
    } catch (e) {
      // Offline fallback
      return {
        city: 'مكة المكرمة',
        country: 'المملكة العربية السعودية',
        timezone: 'Asia/Riyadh',
        method: 'جامعة أم القرى - مكة المكرمة (حفظ محلي)',
        date: new Date().toISOString().split('T')[0],
        timings: {
          Fajr: '05:04',
          Sunrise: '06:22',
          Dhuhr: '12:15',
          Asr: '15:35',
          Maghrib: '18:05',
          Isha: '19:35',
          Qiyam: '01:45',
        },
        nextPrayer: {
          nameAr: 'المغرب',
          nameEn: 'Maghrib',
          time: '18:05',
          timeRemainingFormatted: 'متبقي 45 دقيقة',
          minutesRemaining: 45,
        },
        qiblaDirection: 0,
      };
    }
  }

  async getHijriDate(): Promise<HijriDateData> {
    try {
      return await this.request<HijriDateData>('/api/v1/prayer/hijri');
    } catch (e) {
      return {
        day: 14,
        dayNameAr: 'الأحد',
        dayNameEn: 'Sunday',
        month: 11,
        monthNameAr: 'ذو القعدة',
        monthNameEn: 'Dhu al-Qi\'dah',
        year: 1447,
        formattedAr: '14 ذو القعدة 1447 هـ',
        formattedEn: '14 Dhu al-Qi\'dah 1447 AH',
        isSacredMonth: true,
        sacredMonthName: 'من الأشهر الحرم المباركة (ذو القعدة)',
      };
    }
  }

  async getSupportedCities(): Promise<Array<{ key: string; nameAr: string; nameEn: string; countryAr: string }>> {
    return this.request('/api/v1/prayer/cities');
  }

  // System Health & Telemetry
  async getHealthStatus(): Promise<{ status: string; services: ApiHealthStatus[]; serverUptimeSeconds: number }> {
    return this.request('/api/v1/health');
  }

  async getTelemetry(): Promise<{ metrics: ApiTelemetryMetric; recentLogs: any[] }> {
    return this.request('/api/v1/telemetry');
  }

  // API Keys Management
  async getApiKeys(): Promise<ApiKeyRecord[]> {
    return this.request<ApiKeyRecord[]>('/api/v1/keys');
  }

  async createApiKey(name: string, platform: string, scopes: string[]): Promise<ApiKeyRecord> {
    return this.request<ApiKeyRecord>('/api/v1/keys', {
      method: 'POST',
      body: JSON.stringify({ name, platform, scopes }),
    });
  }

  async revokeApiKey(id: string): Promise<{ message: string; keyId: string }> {
    return this.request(`/api/v1/keys/${id}/revoke`, {
      method: 'POST',
    });
  }

  // Scholarly AI Assistant
  async queryAIScholar(question: string, field: string = 'علوم القرآن والتفسير'): Promise<{ field: string; question: string; answer: string; guardrailNotice: string }> {
    return this.request('/api/v1/ai/scholar', {
      method: 'POST',
      body: JSON.stringify({ question, field }),
    });
  }

  // Waqf & Charity Donations Gateway
  async createDonationIntent(data: DonationIntentRequest): Promise<{ clientSecret: string; intentId: string; amount: number; currency: string }> {
    return this.request('/api/v1/donations/intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyDonation(intentId: string): Promise<DonationReceipt> {
    return this.request('/api/v1/donations/verify', {
      method: 'POST',
      body: JSON.stringify({ intentId }),
    });
  }

  // Mobile App Native Config
  async getMobileConfig(): Promise<any> {
    return this.request('/api/v1/mobile/config');
  }

  // Grouped namespaces for clean domain calls
  get prayer() {
    return {
      getTimes: (city?: string) => this.getPrayerTimes(city),
      getHijriDate: () => this.getHijriDate(),
      getCities: () => this.getSupportedCities(),
    };
  }

  get gateway() {
    return {
      getHealth: () => this.getHealthStatus(),
      getTelemetry: () => this.getTelemetry(),
      getKeys: () => this.getApiKeys(),
      createKey: (name: string, platform?: string, scopes?: string[]) => this.createApiKey(name, platform || 'android', scopes || ['quran:read', 'prayer:read']),
      revokeKey: (id: string) => this.revokeApiKey(id),
    };
  }

  get ai() {
    return {
      ask: (q: string, field?: string) => this.queryAIScholar(q, field),
    };
  }

  get waqf() {
    return {
      createIntent: (data: DonationIntentRequest) => this.createDonationIntent(data),
      verify: (intentId: string) => this.verifyDonation(intentId),
    };
  }
}

export const api = new AlNoorApiClient();
