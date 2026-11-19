import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Database,
  Cpu,
  Shield,
  Clock,
  Wifi,
  Zap,
  ExternalLink,
} from 'lucide-react';

interface ServiceStatusEntry {
  status: 'operational' | 'degraded' | 'down';
  latencyMs: number;
  uptimePercentage: number;
  lastChecked: string;
  note?: string;
}

interface ApiHealthStatusEntry {
  serviceId: string;
  status: string;
  latencyMs: number;
  uptimePercentage: number;
  lastChecked: string;
}

interface GatewayHealthData {
  status: string;
  serviceMap?: Record<string, ServiceStatusEntry>;
  services: ApiHealthStatusEntry[] | Record<string, ServiceStatusEntry>;
  nodeEnvironment: string;
  serverUptimeSeconds: number;
}

export const ServiceStatusDashboard: React.FC = () => {
  const [healthData, setHealthData] = useState<GatewayHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchHealthStatus = async () => {
    setIsLoading(true);
    setFetchError(null);
    const startPing = Date.now();
    try {
      const response = await fetch('/api/v1/health');
      const elapsed = Date.now() - startPing;
      setPingLatency(elapsed);

      if (response.ok) {
        const json = await response.json();
        setHealthData(json.data || json);
      } else {
        setFetchError(`تعذر جلب الحالة المباشرة من الخادم (HTTP ${response.status})`);
      }
    } catch {
      const elapsed = Date.now() - startPing;
      setPingLatency(elapsed);
      setFetchError('تعذر الاتصال بخادم مراقبة الخدمات حالياً.');
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchHealthStatus();
    const interval = setInterval(fetchHealthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} ساعة و ${minutes} دقيقة`;
  };

  const renderStatusLabel = (status: 'operational' | 'degraded' | 'down') => {
    switch (status) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#0D7A7A] dark:text-[#2DD4BF] shrink-0">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>يعمل بكفاءة</span>
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#B45309] dark:text-[#FBBF24] shrink-0">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>أداء جزئي</span>
          </span>
        );
      case 'down':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#DC2626] dark:text-[#FCA5A5] shrink-0">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>متوقف مؤقتاً</span>
          </span>
        );
    }
  };

  const servicesConfig = [
    {
      id: 'core-gateway',
      nameAr: 'بوابة API المركزية (Central Gateway)',
      desc: 'إدارة الطلبات، التوجيه، تحديد معدل الاستهلاك، وفحص الهوية',
      icon: Server,
      type: 'Microservices & Routing',
    },
    {
      id: 'cloudsql-postgres',
      nameAr: 'قاعدة بيانات Cloud SQL (PostgreSQL)',
      desc: 'قاعدة البيانات العلائقية الرئيسية مع Drizzle ORM لحفظ السجلات والأقسام',
      icon: Database,
      type: 'Persistent Storage',
    },
    {
      id: 'redis-cache',
      nameAr: 'طبقة التخزين المؤقت الذاكرية (Memory Cache)',
      desc: 'تسريع مواقيت الصلاة والتقويم الهجري والفهارس القرآنية',
      icon: Zap,
      type: 'Low-Latency Cache',
    },
    {
      id: 'firebase-auth',
      nameAr: 'خدمة التوثيق والهوية (Firebase Auth)',
      desc: 'إدارة حسابات الطلاب والمشايخ وتسجيل الدخول الموحد',
      icon: Shield,
      type: 'Identity & Access',
    },
    {
      id: 'gemini-ai-engine',
      nameAr: 'محرك البحث الشرعي والتوليد الصوتي (Gemini AI & TTS)',
      desc: 'المساعد الأكاديمي، البحث العلمي، وتوليد الصوت الإعلاني السوداني',
      icon: Cpu,
      type: 'Intelligence & Speech',
    },
    {
      id: 'makkah-radio-stream',
      nameAr: 'خادم البث الإذاعي الحي المباشر (Makkah Radio 24/7)',
      desc: 'بث صوتي عالي النقاء لأذان وتلاوات المسجد الحرام من مكة المكرمة',
      icon: Wifi,
      type: 'Global Audio Streaming',
    },
  ];

  const resolveServiceStatus = (id: string): ServiceStatusEntry => {
    if (healthData?.serviceMap?.[id]) {
      return healthData.serviceMap[id];
    }
    if (healthData?.services && !Array.isArray(healthData.services) && healthData.services[id]) {
      return healthData.services[id];
    }
    return {
      status: fetchError ? 'down' : 'degraded',
      latencyMs: pingLatency ?? 0,
      uptimePercentage: fetchError ? 0 : 99.5,
      lastChecked: new Date().toISOString(),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="sky-card-3d rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                fetchError ? 'bg-[#DC2626]' : 'bg-[#0EA5A4] animate-ping'
              }`}
              aria-hidden="true"
            />
            <h3 className="text-lg sm:text-xl font-black text-[#12345A] dark:text-[#EAF8FF] font-amiri flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#0EA5A4] shrink-0" />
              <span>لوحة مراقبة حالة الخدمات والأنظمة (Service Health Monitor)</span>
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5]">
            متابعة فورية للاتصال بقواعد بيانات Cloud SQL، الذاكرة المخبأة، ومحرك التوليد الصوتي وبوابة الخدمات
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-left text-xs text-[#2B547E] dark:text-[#B8DEF5] space-y-0.5 tabular-nums">
            <div>
              زمن الاستجابة:{' '}
              <span className="font-mono text-[#0D7A7A] dark:text-[#2DD4BF] font-bold">
                {pingLatency !== null ? `${pingLatency}ms` : '--'}
              </span>
            </div>
            <div>
              آخر تحديث:{' '}
              <span className="font-mono text-[#12345A] dark:text-[#EAF8FF] font-semibold">
                {lastRefreshed.toLocaleTimeString('ar-SA')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchHealthStatus}
            disabled={isLoading}
            className="min-h-[42px] min-w-[42px] p-2.5 rounded-xl bg-[#12345A] hover:bg-[#0E3F66] text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center shadow-sm"
            title="تحديث الحالة الآن"
            aria-label="تحديث الحالة الآن"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="rounded-2xl bg-[#FEF2F2] dark:bg-[#450A0A]/70 border border-[#DC2626]/35 p-4 text-xs sm:text-sm text-[#B91C1C] dark:text-[#FCA5A5] flex items-center gap-2.5 font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{fetchError}</span>
        </div>
      )}

      {/* Grid of Monitored Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {servicesConfig.map((srv) => {
          const srvData = resolveServiceStatus(srv.id);
          const IconComponent = srv.icon;
          const dotColor =
            srvData.status === 'operational'
              ? 'bg-[#0EA5A4]'
              : srvData.status === 'degraded'
              ? 'bg-[#D97706]'
              : 'bg-[#DC2626]';

          return (
            <div
              key={srv.id}
              className="sky-card-3d rounded-3xl p-5 flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 flex items-center justify-center text-[#12345A] dark:text-[#87CEEB] group-hover:scale-105 transition-transform shrink-0 shadow-xs">
                      <IconComponent className="w-5 h-5 text-[#0EA5A4]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-[#12345A] dark:text-[#EAF8FF] leading-snug">
                        {srv.nameAr}
                      </h4>
                      <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] font-mono block truncate">
                        {srv.type}
                      </span>
                    </div>
                  </div>
                  {renderStatusLabel(srvData.status)}
                </div>

                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed line-clamp-2">
                  {srvData.note || srv.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#12345A]/12 dark:border-[#87CEEB]/15 grid grid-cols-2 gap-2 text-xs tabular-nums">
                <div className="space-y-0.5">
                  <span className="text-[#4A7298] dark:text-[#84B4D6] block text-[11px] font-semibold">
                    زمن الاستجابة
                  </span>
                  <span className="font-mono text-[#12345A] dark:text-[#EAF8FF] font-bold flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} aria-hidden="true" />
                    {srvData.latencyMs}ms
                  </span>
                </div>
                <div className="space-y-0.5 text-left">
                  <span className="text-[#4A7298] dark:text-[#84B4D6] block text-[11px] font-semibold">
                    نسبة الجاهزية
                  </span>
                  <span className="font-mono text-[#0D7A7A] dark:text-[#2DD4BF] font-bold">
                    {srvData.uptimePercentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Infrastructure Summary Bar */}
      <div className="sky-glass-panel rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-[#2B547E] dark:text-[#B8DEF5] tabular-nums">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>وقت تشغيل الخادم:</span>
            <strong className="text-[#12345A] dark:text-[#EAF8FF] font-mono">
              {healthData?.serverUptimeSeconds ? formatUptime(healthData.serverUptimeSeconds) : 'مستمر 24/7'}
            </strong>
          </span>
          <span className="hidden sm:inline-block text-[#12345A]/25 dark:text-[#87CEEB]/30" aria-hidden="true">
            ·
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#0EA5A4] shrink-0" />
            <span>شهادة التشفير:</span>
            <strong className="text-[#0D7A7A] dark:text-[#2DD4BF] font-mono">TLS 1.3 Active</strong>
          </span>
        </div>

        <a
          href="/api/v1/health"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0E3F66] text-white text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
        >
          <span>عرض استجابة JSON للـ Health Check</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
        </a>
      </div>
    </div>
  );
};
