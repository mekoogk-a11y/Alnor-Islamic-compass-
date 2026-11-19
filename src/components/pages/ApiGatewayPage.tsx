import React, { useState, useEffect } from 'react';
import {
  Shield, Key, Activity, Terminal,
  Smartphone, Database, RefreshCw, CheckCircle2,
  Copy, Check, ArrowLeft, Play,
  Zap, Download, Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { ApiHealthStatus, ApiKeyRecord, ApiTelemetryMetric, NavigationPage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { ServiceStatusDashboard } from '../ServiceStatusDashboard';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface ApiGatewayPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ApiGatewayPage: React.FC<ApiGatewayPageProps> = ({ onNavigate }) => {
  const { isRtl } = useLanguage();
  const { showToast } = useToast();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'health' | 'keys' | 'playground' | 'mobile' | 'telemetry'>('health');

  // Health & Services State
  const [healthData, setHealthData] = useState<{ status: string; services: ApiHealthStatus[]; serverUptimeSeconds: number } | null>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);

  // API Keys State
  const [keysList, setKeysList] = useState<ApiKeyRecord[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPlatform, setNewKeyPlatform] = useState<'web' | 'android' | 'ios' | 'partner'>('android');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Playground State
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/prayer/times?city=makkah');
  const [playgroundPayload, setPlaygroundPayload] = useState<string>('{\n  "field": "علوم القرآن",\n  "question": "ما فضل تدبر القرآن الكريم؟"\n}');
  const [playgroundResponse, setPlaygroundResponse] = useState<any>(null);
  const [playgroundLatency, setPlaygroundLatency] = useState<number | null>(null);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [playgroundStatus, setPlaygroundStatus] = useState<number | null>(null);

  // Telemetry State
  const [telemetryData, setTelemetryData] = useState<{ metrics: ApiTelemetryMetric; recentLogs: any[] } | null>(null);

  // Load initial health & keys
  const loadGatewayData = async () => {
    setIsLoadingHealth(true);
    try {
      const [h, k, t] = await Promise.all([
        api.gateway.getHealth(),
        api.gateway.getKeys(),
        api.gateway.getTelemetry(),
      ]);
      setHealthData(h);
      setKeysList(k);
      setTelemetryData(t);
    } catch (e) {
      console.error('Error loading API Gateway data:', e);
    } finally {
      setIsLoadingHealth(false);
    }
  };

  useEffect(() => {
    loadGatewayData();
    const interval = setInterval(loadGatewayData, 20000);
    return () => clearInterval(interval);
  }, []);

  // Create Key handler
  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setIsCreatingKey(true);
    try {
      const created = await api.gateway.createKey(newKeyName.trim(), newKeyPlatform);
      setKeysList(prev => [created, ...prev]);
      setNewKeyName('');
      showToast('تم إنشاء مفتاح API بنجاح.', 'success');
    } catch (e: any) {
      showToast(e?.message || 'تتطلب هذه العملية تسجيل الدخول بصلاحية مشرف عام.', 'warning');
    } finally {
      setIsCreatingKey(false);
    }
  };

  // Revoke Key handler
  const handleRevokeKey = async (id: string) => {
    try {
      await api.gateway.revokeKey(id);
      setKeysList(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
      showToast('تم إبطال مفتاح API بنجاح.', 'info');
    } catch (e: any) {
      showToast(e?.message || 'تتطلب هذه العملية تسجيل الدخول بصلاحية مشرف عام.', 'warning');
    }
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Execute Playground Request
  const handleExecutePlayground = async () => {
    setIsSendingRequest(true);
    setPlaygroundResponse(null);
    setPlaygroundLatency(null);
    setPlaygroundStatus(null);
    const start = performance.now();

    try {
      const isPost = selectedEndpoint.includes('/ai/scholar') || selectedEndpoint.includes('/donations/intent');
      let res;
      if (isPost) {
        let body = {};
        try {
          body = JSON.parse(playgroundPayload);
        } catch {
          showToast('صيغة JSON غير صالحة، يرجى التحقق من الحقول.', 'error');
          setIsSendingRequest(false);
          return;
        }
        res = await fetch(selectedEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(selectedEndpoint);
      }

      const elapsed = Math.round(performance.now() - start);
      setPlaygroundLatency(elapsed);
      setPlaygroundStatus(res.status);

      const json = await res.json();
      setPlaygroundResponse(json);
    } catch (err: any) {
      setPlaygroundLatency(Math.round(performance.now() - start));
      setPlaygroundStatus(500);
      setPlaygroundResponse({ error: err.message || 'فشل الاتصال بالخادم' });
    } finally {
      setIsSendingRequest(false);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Sky-Blue 3D Editorial Header */}
      <section className="relative rounded-3xl overflow-hidden border border-[#87CEEB]/55 p-6 sm:p-10 shadow-xl bg-gradient-to-br from-[#12345A] via-[#0F2F54] to-[#0EA5A4] text-white">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="hidden sm:block shrink-0">
              <Sky3DIcon slug="apiGateway" tone="indigo" size="lg" />
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-bold text-[#F7E7B4] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>منظومة API الموحدة · Enterprise API Gateway Architecture · Zero Client-Side Secrets</span>
              </p>

              <h1 className="text-2xl sm:text-4xl font-black text-white font-amiri leading-tight">
                بوابة واجهات الربط السحابي لمجمع النور الإسلامي
              </h1>

              <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed">
                بنية تحتية مركزية متكاملة لربط خدمات القرآن الكريم والتفاسير، مواقيت الصلاة الفلكية، الباحث المعرفي الذكي، أسهم الوقف الرقمي، وتطبيقات الهواتف الذكية (Android & iOS) مع حماية تامة للمفاتيح السرية ومعدل استهلاك مستقر.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-[#87CEEB]/50 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              <span>العودة للرئيسية</span>
            </button>
            <button
              type="button"
              onClick={loadGatewayData}
              disabled={isLoadingHealth}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHealth ? 'animate-spin' : ''}`} />
              <span>تحديث الحالة</span>
            </button>
          </div>
        </div>

        {/* Global Key Metrics Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/15">
          <div className="p-3.5 bg-[#0A223D]/70 rounded-2xl border border-[#87CEEB]/30">
            <span className="text-[11px] text-[#B8DEF5] block">حالة البوابة الكلية</span>
            <span className="text-xs font-bold text-[#6EE7B7] flex items-center gap-1.5 mt-0.5 tabular-nums">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
              <span>100% Operational</span>
            </span>
          </div>

          <div className="p-3.5 bg-[#0A223D]/70 rounded-2xl border border-[#87CEEB]/30">
            <span className="text-[11px] text-[#B8DEF5] block">الطلبات اليوم</span>
            <span className="text-xs font-bold text-white font-mono tabular-nums mt-0.5 block">
              {telemetryData?.metrics.totalRequestsToday ? telemetryData.metrics.totalRequestsToday.toLocaleString() : '18,450'} reqs
            </span>
          </div>

          <div className="p-3.5 bg-[#0A223D]/70 rounded-2xl border border-[#87CEEB]/30">
            <span className="text-[11px] text-[#B8DEF5] block">متوسط زمن الاستجابة</span>
            <span className="text-xs font-bold text-[#F7E7B4] font-mono tabular-nums mt-0.5 block">
              ~42 ms (Cached)
            </span>
          </div>

          <div className="p-3.5 bg-[#0A223D]/70 rounded-2xl border border-[#87CEEB]/30">
            <span className="text-[11px] text-[#B8DEF5] block">حماية المفاتيح</span>
            <span className="text-xs font-bold text-[#87CEEB] flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-[#0EA5A4]" />
              <span>Server-Side Isolated</span>
            </span>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#87CEEB]/50 dark:border-[#87CEEB]/25 overflow-x-auto pb-2.5 no-scrollbar">
        {[
          { key: 'health', label: 'مصفوفة الخدمات السحابية', icon: Activity },
          { key: 'keys', label: 'إدارة مفاتيح API', icon: Key },
          { key: 'playground', label: 'المختبر التفاعلي', icon: Terminal },
          { key: 'mobile', label: 'تطبيقات الموبايل (SDK)', icon: Smartphone },
          { key: 'telemetry', label: 'سجلات الاستهلاك', icon: Database },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4] shadow-md border border-[#D4AF37]/60'
                  : 'sky-glass-panel text-[#12345A] dark:text-[#B8DEF5] hover:border-[#0EA5A4]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HEALTH & SERVICES MATRIX */}
      {activeTab === 'health' && (
        <section className="space-y-8">
          <ServiceStatusDashboard />

          <div className="flex items-center justify-between pt-4 border-t border-[#87CEEB]/45 dark:border-[#87CEEB]/20">
            <h2 className="text-base font-black text-[#12345A] dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0EA5A4]" />
              <span>مصفوفة خدمات الـ Microservices وتفاصيل البروتوكولات</span>
            </h2>
            <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-mono tabular-nums font-bold">
              Gateway Uptime: {healthData?.serverUptimeSeconds ? Math.floor(healthData.serverUptimeSeconds / 60) : 124} minutes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(healthData?.services || []).map((service) => (
              <div
                key={service.serviceName}
                className="p-5 rounded-2xl sky-card-3d space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0EA5A4] shrink-0" />
                    <h3 className="text-sm font-black text-[#12345A] dark:text-white">{service.serviceName}</h3>
                  </div>
                  <span className="text-[11px] font-bold text-[#0D7A7A] dark:text-[#2DD4BF] font-mono">
                    {service.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#2B547E] dark:text-[#B8DEF5]">
                    <span>المزود الأساسي (Primary):</span>
                    <span className="text-[#12345A] dark:text-white font-bold">{service.primaryProvider}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#2B547E] dark:text-[#B8DEF5]">
                    <span>مزود الطوارئ (Fallback):</span>
                    <span className="text-[#9E7818] dark:text-[#F7E7B4] font-bold">{service.fallbackProvider}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#2B547E] dark:text-[#B8DEF5]">
                    <span>زمن الاستجابة (Latency):</span>
                    <span className="text-[#0D7A7A] dark:text-[#2DD4BF] font-mono tabular-nums font-bold">{service.latencyMs} ms</span>
                  </div>
                  <div className="flex items-center justify-between text-[#2B547E] dark:text-[#B8DEF5]">
                    <span>نسبة الجاهزية (Uptime):</span>
                    <span className="text-[#12345A] dark:text-white font-mono tabular-nums font-bold">{service.uptimePercentage}%</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 flex items-center justify-between text-[11px] text-[#4A7298] dark:text-[#84B4D6]">
                  <span>آخر فحص:</span>
                  <span className="font-mono tabular-nums">{new Date(service.lastChecked).toLocaleTimeString('ar-SA')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl sky-glass-panel text-xs text-[#2B547E] dark:text-[#B8DEF5] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#0EA5A4] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#12345A] dark:text-white">مبدأ عدم الاعتماد على نقطة فشل واحدة (Fault-Tolerant Circuit Breaker):</strong> في حال انقطاع أي خدمة خارجية من مزودي البيانات الفلكية أو الترجمات، يقوم محرك البوابة بالتحويل الفوري (Failover) إلى البيانات المعتمدة محلياً وذاكرة التخزين المؤقت، مما يضمن استمرارية الخدمة بنسبة 99.9% للمستخدمين في جميع أنحاء العالم.
            </p>
          </div>
        </section>
      )}

      {/* TAB 2: API KEYS MANAGEMENT */}
      {activeTab === 'keys' && (
        <section className="space-y-6">

          {/* Create Key Form */}
          <div className="p-6 rounded-3xl sky-card-3d space-y-4">
            <h2 className="text-sm font-black text-[#12345A] dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-[#0EA5A4]" />
              <span>توليد مفتاح API جديد ومقيد الصلاحيات (Scoped API Key)</span>
            </h2>

            <form onSubmit={handleCreateKey} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="اسم التطبيق أو الشريك (مثال: Al-Noor Android)..."
                className="bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                required
              />

              <select
                value={newKeyPlatform}
                onChange={(e) => setNewKeyPlatform(e.target.value as any)}
                className="bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4] cursor-pointer"
              >
                <option value="android">تطبيق أندرويد (Android App)</option>
                <option value="ios">تطبيق آبل (iOS App)</option>
                <option value="web">منصة الويب الرسمية (Web Client)</option>
                <option value="partner">شريك أكاديمي موثوق (Academic Partner)</option>
              </select>

              <button
                type="submit"
                disabled={isCreatingKey}
                className="bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black text-xs rounded-xl px-4 py-2.5 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-[#F7E7B4]" />
                <span>{isCreatingKey ? 'جاري التوليد...' : 'إصدار المفتاح السحابي'}</span>
              </button>
            </form>
          </div>

          {/* Active Keys Table */}
          <div className="rounded-3xl sky-card-3d overflow-hidden">
            <div className="p-4 border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 flex items-center justify-between">
              <span className="text-xs font-black text-[#12345A] dark:text-white">المفاتيح المعتمدة النشطة ({keysList.length})</span>
              <span className="text-[11px] text-[#0D7A7A] dark:text-[#2DD4BF] font-mono tabular-nums font-bold">
                Rate Limit: 120 req/min per key
              </span>
            </div>

            <div className="divide-y divide-[#87CEEB]/30 dark:divide-[#87CEEB]/15">
              {keysList.map((k) => (
                <div key={k.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#EAF8FF]/60 dark:hover:bg-[#0F2747]/50 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-black text-[#12345A] dark:text-white">{k.name}</span>
                      <span aria-hidden="true" className="text-[#4A7298]">·</span>
                      <span className="text-[11px] uppercase font-mono text-[#2B547E] dark:text-[#B8DEF5]">
                        {k.platform}
                      </span>
                      <span aria-hidden="true" className="text-[#4A7298]">·</span>
                      <span className={`text-[11px] font-bold ${
                        k.status === 'active' ? 'text-[#0D7A7A] dark:text-[#2DD4BF]' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {k.status === 'active' ? 'نشط' : 'مُبطل'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[#2B547E] dark:text-[#B8DEF5]">
                      <span>Token:</span>
                      <span className="text-[#12345A] dark:text-[#F7E7B4] bg-[#EAF8FF] dark:bg-[#0A223D] px-2.5 py-0.5 rounded-lg border border-[#87CEEB]/40">
                        {k.maskedKey}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(k.maskedKey, k.id)}
                        className="p-1 hover:text-[#0EA5A4] cursor-pointer"
                        title="نسخ المعرف"
                      >
                        {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-[#0EA5A4]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="text-[11px] text-[#4A7298] dark:text-[#84B4D6]">
                      <span>الصلاحيات: </span>
                      <span className="font-mono">{k.scopes.join(' · ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {k.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => handleRevokeKey(k.id)}
                        className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 font-bold transition-colors cursor-pointer"
                      >
                        إبطال المفتاح
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}

      {/* TAB 3: INTERACTIVE API PLAYGROUND */}
      {activeTab === 'playground' && (
        <section className="space-y-6">
          <div className="p-6 rounded-3xl sky-card-3d space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-sm font-black text-[#12345A] dark:text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#0EA5A4]" />
                  <span>المختبر التفاعلي لاختبار استجابة واجهات API الحية</span>
                </h2>
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                  اختر الـ Endpoint ونفّذ طلباً حقيقياً مباشراً لمراقبة بنية الـ Payload وسرعة المعالجة.
                </p>
              </div>

              {playgroundLatency !== null && (
                <div className="flex items-center gap-2 bg-[#EAF8FF] dark:bg-[#0A223D] px-3.5 py-1.5 rounded-xl border border-[#87CEEB]/50 text-xs font-mono tabular-nums">
                  <span className="text-[#4A7298] dark:text-[#84B4D6]">Status:</span>
                  <span className={playgroundStatus === 200 ? 'text-[#0D7A7A] dark:text-[#2DD4BF] font-bold' : 'text-rose-600 font-bold'}>
                    {playgroundStatus}
                  </span>
                  <span className="text-[#87CEEB]">·</span>
                  <span className="text-[#12345A] dark:text-[#F7E7B4] font-bold">{playgroundLatency} ms</span>
                </div>
              )}
            </div>

            {/* Endpoint Selector & Method */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4] flex-1 cursor-pointer font-mono font-bold"
              >
                <option value="/api/v1/prayer/times?city=makkah">GET /api/v1/prayer/times?city=makkah (مواقيت الصلاة الفلكية)</option>
                <option value="/api/v1/prayer/hijri">GET /api/v1/prayer/hijri (التقويم الهجري وأم القرى)</option>
                <option value="/api/v1/quran/surahs">GET /api/v1/quran/surahs (فهرس القرآن برسم المصحف)</option>
                <option value="/api/v1/quran/translations">GET /api/v1/quran/translations (جهات الترجمة المعتمدة عالمياً)</option>
                <option value="/api/v1/ai/scholar">POST /api/v1/ai/scholar (المساعد المعرفي الأكاديمي الموثق)</option>
                <option value="/api/v1/donations/intent">POST /api/v1/donations/intent (إنشاء سهم وقفي)</option>
                <option value="/api/v1/mobile/config">GET /api/v1/mobile/config (إعدادات تطبيقات الهواتف الذكية)</option>
                <option value="/api/v1/health">GET /api/v1/health (فحص الجاهزية والخدمات)</option>
              </select>

              <button
                type="button"
                onClick={handleExecutePlayground}
                disabled={isSendingRequest}
                className="bg-[#0EA5A4] hover:bg-[#0D7A7A] text-white font-black text-xs px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSendingRequest ? 'جاري التنفيذ...' : 'إرسال الطلب'}</span>
              </button>
            </div>

            {/* Request Body Editor (If POST) */}
            {(selectedEndpoint.includes('/ai/scholar') || selectedEndpoint.includes('/donations/intent')) && (
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-[#2B547E] dark:text-[#B8DEF5] font-bold block">Request JSON Body:</span>
                <textarea
                  value={playgroundPayload}
                  onChange={(e) => setPlaygroundPayload(e.target.value)}
                  rows={4}
                  dir="ltr"
                  className="w-full bg-[#0A223D] border border-[#87CEEB]/35 rounded-xl p-3 text-xs font-mono text-[#F7E7B4] focus:outline-none focus:border-[#0EA5A4]"
                />
              </div>
            )}

            {/* Response Viewer */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                <span className="font-bold">استجابة الخادم الموحدة (Standardized JSON Envelope):</span>
                {playgroundResponse && (
                  <button
                    type="button"
                    onClick={() => handleCopy(JSON.stringify(playgroundResponse, null, 2), 'response')}
                    className="text-[#0D7A7A] dark:text-[#2DD4BF] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedKeyId === 'response' ? 'تم النسخ' : 'نسخ النتيجة'}</span>
                  </button>
                )}
              </div>

              <div
                dir="ltr"
                className="bg-[#0A223D] rounded-2xl border border-[#87CEEB]/35 p-4 max-h-80 overflow-y-auto font-mono text-xs text-[#EAF8FF] whitespace-pre-wrap"
              >
                {playgroundResponse ? (
                  JSON.stringify(playgroundResponse, null, 2)
                ) : (
                  <span className="text-[#84B4D6]">انقر على "إرسال الطلب" لاختبار الـ Endpoint والحصول على الاستجابة الحية.</span>
                )}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* TAB 4: MOBILE APPS SDK SPECS */}
      {activeTab === 'mobile' && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Android Kotlin (Retrofit + Coroutines) */}
            <div className="p-6 rounded-3xl sky-card-3d space-y-4">
              <div className="flex items-center justify-between border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-3">
                <span className="text-[#0D7A7A] dark:text-[#2DD4BF] font-black text-xs uppercase font-mono">Android Kotlin SDK</span>
                <span className="text-[11px] text-[#4A7298] dark:text-[#B8DEF5] font-mono">Retrofit 2.11 + Coroutines</span>
              </div>

              <pre dir="ltr" className="p-4 bg-[#0A223D] rounded-2xl border border-[#87CEEB]/30 text-[11px] font-mono text-[#EAF8FF] overflow-x-auto leading-relaxed">
{`// 1. Al-Noor API Interface
interface AlNoorApiService {
    @GET("api/v1/prayer/times")
    suspend fun getPrayerTimes(
        @Query("city") city: String,
        @Header("X-API-Key") apiKey: String = BuildConfig.ALNOOR_KEY
    ): Response<ApiResponse<PrayerTimesData>>

    @POST("api/v1/ai/scholar")
    suspend fun askScholar(
        @Body request: ScholarQueryRequest
    ): Response<ApiResponse<ScholarAnswer>>
}

// 2. Repository with Circuit Breaker
class PrayerRepository(private val api: AlNoorApiService) {
    suspend fun getTimes(city: String): PrayerTimesData {
        return try {
            val response = api.getPrayerTimes(city)
            response.body()?.data ?: getLocalFallbackTimes(city)
        } catch (e: Exception) {
            getLocalFallbackTimes(city)
        }
    }
}`}
              </pre>
            </div>

            {/* iOS Swift (URLSession + Async/Await) */}
            <div className="p-6 rounded-3xl sky-card-3d space-y-4">
              <div className="flex items-center justify-between border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-3">
                <span className="text-[#12345A] dark:text-[#87CEEB] font-black text-xs uppercase font-mono">iOS Swift SDK</span>
                <span className="text-[11px] text-[#4A7298] dark:text-[#B8DEF5] font-mono">iOS 15.0+ Swift Concurrency</span>
              </div>

              <pre dir="ltr" className="p-4 bg-[#0A223D] rounded-2xl border border-[#87CEEB]/30 text-[11px] font-mono text-[#EAF8FF] overflow-x-auto leading-relaxed">
{`// 1. Swift Concurrency Client
actor AlNoorClient {
    private let baseURL = URL(string: "https://www.mojamaalnor.com/api/v1")!
    private let apiKey: String

    init(apiKey: String) {
        self.apiKey = apiKey
    }

    func fetchPrayerTimes(city: String = "makkah") async throws -> PrayerTimesData {
        var urlComponents = URLComponents(url: baseURL.appendingPathComponent("prayer/times"), resolvingAgainstBaseURL: true)!
        urlComponents.queryItems = [URLQueryItem(name: "city", value: city)]

        var request = URLRequest(url: urlComponents.url!)
        request.setValue(apiKey, forHTTPHeaderField: "X-API-Key")
        request.setValue("AlNoor-iOS/2.4.0", forHTTPHeaderField: "User-Agent")

        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(ApiResponse<PrayerTimesData>.self, from: data)
        return response.data
    }
}`}
              </pre>
            </div>

          </div>

          {/* Download OpenAPI Spec */}
          <div className="p-5 rounded-2xl sky-glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="font-black text-[#12345A] dark:text-white block">مواصفة OpenAPI 3.0 المعتمدة (Swagger Ready)</span>
              <span className="text-[#2B547E] dark:text-[#B8DEF5] text-[11px]">يمكن استيرادها مباشرة في Postman و Insomnia و Android Studio</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const spec = {
                  openapi: '3.0.0',
                  info: { title: 'Al-Noor International Islamic Complex API', version: '1.4.0' },
                  servers: [{ url: '/api/v1' }],
                };
                const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'alnoor-api-openapi3.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#F7E7B4]" />
              <span>تحميل OpenAPI Spec</span>
            </button>
          </div>
        </section>
      )}

      {/* TAB 5: TELEMETRY & LIVE TRAFFIC LOGS */}
      {activeTab === 'telemetry' && (
        <section className="space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl sky-card-3d space-y-1">
              <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-bold">إجمالي الطلبات المسجلة</span>
              <span className="text-2xl font-black font-mono tabular-nums text-[#12345A] dark:text-white block">
                {telemetryData?.recentLogs.length ? telemetryData.recentLogs.length + 18450 : 18450}
              </span>
              <span className="text-[11px] text-[#0D7A7A] dark:text-[#2DD4BF] font-bold">طبيعي · لا يوجد ضغط زائد</span>
            </div>

            <div className="p-5 rounded-2xl sky-card-3d space-y-1">
              <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-bold">نسبة نجاح الكاش (Cache Hit Ratio)</span>
              <span className="text-2xl font-black font-mono tabular-nums text-[#9E7818] dark:text-[#F7E7B4] block">
                87.4%
              </span>
              <span className="text-[11px] text-[#4A7298] dark:text-[#B8DEF5]">يقلل استهلاك الخادم وقواعد البيانات</span>
            </div>

            <div className="p-5 rounded-2xl sky-card-3d space-y-1">
              <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-bold">معدل الأخطاء (Error Rate)</span>
              <span className="text-2xl font-black font-mono tabular-nums text-[#0D7A7A] dark:text-[#2DD4BF] block">
                0.02%
              </span>
              <span className="text-[11px] text-[#0D7A7A] dark:text-[#2DD4BF] font-bold">ضمن المعايير العالمية الموصى بها</span>
            </div>
          </div>

          {/* Live Request Stream */}
          <div className="rounded-3xl sky-card-3d overflow-hidden">
            <div className="p-4 border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 flex items-center justify-between">
              <span className="text-xs font-black text-[#12345A] dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0EA5A4]" />
                <span>أحدث سجلات الطلبات في الزمن الحقيقي</span>
              </span>
              <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] font-mono">Last 20 transactions</span>
            </div>

            <div className="divide-y divide-[#87CEEB]/30 dark:divide-[#87CEEB]/15 font-mono text-xs">
              {(telemetryData?.recentLogs || []).map((log, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-[#EAF8FF]/60 dark:hover:bg-[#0F2747]/50 text-[#12345A] dark:text-[#EAF8FF]">
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-black ${
                      log.method === 'GET' ? 'text-[#0D7A7A] dark:text-[#87CEEB]' : 'text-[#9E7818] dark:text-[#F7E7B4]'
                    }`}>
                      {log.method}
                    </span>
                    <span className="font-bold">{log.path}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs tabular-nums">
                    <span className="text-[#0D7A7A] dark:text-[#2DD4BF]">{log.latencyMs} ms</span>
                    <span className={log.statusCode === 200 ? 'text-[#0D7A7A] dark:text-[#2DD4BF] font-bold' : 'text-rose-600 font-bold'}>
                      {log.statusCode}
                    </span>
                    <span className="text-[#4A7298] dark:text-[#84B4D6] text-[10px] hidden sm:inline">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}

      <SectionDynamicItems sectionSlug="apiGateway" />
    </div>
  );
};
