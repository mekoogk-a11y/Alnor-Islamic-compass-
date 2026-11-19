import React, { useState, useEffect } from 'react';
import { 
  Clock, Moon, Sun, Sunrise, Sunset, Compass, MapPin, 
  ChevronDown, Sparkles, RefreshCw, AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';
import { PrayerTimesData, HijriDateData } from '../types';

export const PrayerTimesBar: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('makkah');
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [hijriData, setHijriData] = useState<HijriDateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Supported cities list
  const CITIES = [
    { key: 'makkah', nameAr: 'مكة المكرمة 🕋', nameEn: 'Makkah' },
    { key: 'madinah', nameAr: 'المدينة المنورة', nameEn: 'Madinah' },
    { key: 'khartoum', nameAr: 'الخرطوم 🇸🇩', nameEn: 'Khartoum' },
    { key: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo' },
    { key: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh' },
    { key: 'london', nameAr: 'لندن', nameEn: 'London' },
    { key: 'paris', nameAr: 'باريس', nameEn: 'Paris' },
    { key: 'newyork', nameAr: 'نيويورك', nameEn: 'New York' },
    { key: 'istanbul', nameAr: 'إسطنبول', nameEn: 'Istanbul' },
    { key: 'jakarta', nameAr: 'جاكرتا', nameEn: 'Jakarta' },
    { key: 'kualalumpur', nameAr: 'كوالالمبور', nameEn: 'Kuala Lumpur' },
  ];

  const fetchTimes = async (cityKey: string) => {
    setIsLoading(true);
    try {
      const [timesRes, hijriRes] = await Promise.all([
        api.prayer.getTimes(cityKey),
        api.prayer.getHijriDate(),
      ]);
      setPrayerData(timesRes);
      setHijriData(hijriRes);
    } catch (e) {
      console.error('Error fetching prayer times:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimes(selectedCity);
  }, [selectedCity]);

  // Live seconds ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentCityObj = CITIES.find(c => c.key === selectedCity) || CITIES[0];

  return (
    <div className="bg-[#EAF8FF]/85 dark:bg-[#0F2747]/90 border-b border-white/80 dark:border-[#87CEEB]/25 px-4 py-2 backdrop-blur-md text-xs text-[#12345A] dark:text-[#EAF8FF] transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: City Selector & Hijri Date */}
        <div className="flex items-center gap-3">
          {/* City Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#102A4C] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 hover:border-[#0EA5A4] text-[#12345A] dark:text-[#EAF8FF] transition-colors cursor-pointer shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0EA5A4] dark:text-[#87CEEB]" />
              <span className="font-bold">{currentCityObj.nameAr}</span>
              <ChevronDown className="w-3 h-3 text-[#2B547E]" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-1.5 right-0 z-50 w-48 bg-white dark:bg-[#0B1F3A] border border-[#87CEEB] dark:border-[#87CEEB]/35 rounded-xl shadow-lg py-1 max-h-60 overflow-y-auto">
                {CITIES.map((city) => (
                  <button
                    key={city.key}
                    onClick={() => {
                      setSelectedCity(city.key);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-right px-3.5 py-1.5 text-xs hover:bg-[#EAF8FF] dark:hover:bg-[#133158] flex items-center justify-between cursor-pointer ${
                      city.key === selectedCity ? 'text-[#0D7A7A] dark:text-[#87CEEB] font-bold bg-[#EAF8FF] dark:bg-[#133158]' : 'text-[#12345A] dark:text-[#EAF8FF]'
                    }`}
                  >
                    <span>{city.nameAr}</span>
                    <span className="text-[10px] text-[#4A7298]">{city.nameEn}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hijri Date Display */}
          {hijriData && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#2B547E] dark:text-[#B8DEF5]">
              <span className="text-[#12345A] dark:text-[#87CEEB] font-bold">
                {hijriData.day} {hijriData.monthNameAr} {hijriData.year} هـ
              </span>
              {hijriData.isSacredMonth && (
                <span className="px-2 py-0.5 rounded-full bg-[#0EA5A4]/15 dark:bg-[#0EA5A4]/25 text-[#0D7A7A] dark:text-[#5EEAD4] text-[10px] border border-[#0EA5A4]/30 font-medium">
                  من الأشهر الحُرُم
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center: Prayer Times Pills */}
        {prayerData && (
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 no-scrollbar">
            
            {/* Fajr */}
            <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[11px] transition-all ${
              prayerData.nextPrayer?.nameAr === 'الفجر' 
                ? 'bg-[#12345A] border-[#D4AF37]/70 text-white font-bold shadow-sm' 
                : 'bg-white/90 dark:bg-[#102A4C] border-[#87CEEB]/55 dark:border-[#87CEEB]/25 text-[#2B547E] dark:text-[#B8DEF5]'
            }`}>
              <Moon className="w-3 h-3 text-[#D4AF37]" />
              <span>الفجر:</span>
              <span className="font-mono">{prayerData.timings.Fajr}</span>
            </div>

            {/* Sunrise */}
            <div className="px-2.5 py-1 rounded-xl bg-white/70 dark:bg-[#102A4C]/70 border border-[#87CEEB]/50 dark:border-[#87CEEB]/20 text-[#2B547E] dark:text-[#84B4D6] flex items-center gap-1.5 text-[11px] hidden md:flex">
              <Sunrise className="w-3 h-3 text-[#D4AF37]" />
              <span>الشروق:</span>
              <span className="font-mono">{prayerData.timings.Sunrise}</span>
            </div>

            {/* Dhuhr */}
            <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[11px] transition-all ${
              prayerData.nextPrayer?.nameAr === 'الظهر' 
                ? 'bg-[#12345A] border-[#D4AF37]/70 text-white font-bold shadow-sm' 
                : 'bg-white/90 dark:bg-[#102A4C] border-[#87CEEB]/55 dark:border-[#87CEEB]/25 text-[#2B547E] dark:text-[#B8DEF5]'
            }`}>
              <Sun className="w-3 h-3 text-[#D4AF37]" />
              <span>الظهر:</span>
              <span className="font-mono">{prayerData.timings.Dhuhr}</span>
            </div>

            {/* Asr */}
            <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[11px] transition-all ${
              prayerData.nextPrayer?.nameAr === 'العصر' 
                ? 'bg-[#12345A] border-[#D4AF37]/70 text-white font-bold shadow-sm' 
                : 'bg-white/90 dark:bg-[#102A4C] border-[#87CEEB]/55 dark:border-[#87CEEB]/25 text-[#2B547E] dark:text-[#B8DEF5]'
            }`}>
              <Sun className="w-3 h-3 text-[#0EA5A4]" />
              <span>العصر:</span>
              <span className="font-mono">{prayerData.timings.Asr}</span>
            </div>

            {/* Maghrib */}
            <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[11px] transition-all ${
              prayerData.nextPrayer?.nameAr === 'المغرب' 
                ? 'bg-[#12345A] border-[#D4AF37]/70 text-white font-bold shadow-sm' 
                : 'bg-white/90 dark:bg-[#102A4C] border-[#87CEEB]/55 dark:border-[#87CEEB]/25 text-[#2B547E] dark:text-[#B8DEF5]'
            }`}>
              <Sunset className="w-3 h-3 text-[#D4AF37]" />
              <span>المغرب:</span>
              <span className="font-mono">{prayerData.timings.Maghrib}</span>
            </div>

            {/* Isha */}
            <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[11px] transition-all ${
              prayerData.nextPrayer?.nameAr === 'العشاء' 
                ? 'bg-[#12345A] border-[#D4AF37]/70 text-white font-bold shadow-sm' 
                : 'bg-white/90 dark:bg-[#102A4C] border-[#87CEEB]/55 dark:border-[#87CEEB]/25 text-[#2B547E] dark:text-[#B8DEF5]'
            }`}>
              <Moon className="w-3 h-3 text-[#87CEEB]" />
              <span>العشاء:</span>
              <span className="font-mono">{prayerData.timings.Isha}</span>
            </div>

          </div>
        )}

        {/* Right: Next Prayer Countdown & Qibla */}
        <div className="flex items-center gap-3">
          {prayerData?.nextPrayer && (
            <div className="flex items-center gap-1.5 text-[11px] bg-white/90 dark:bg-[#102A4C] px-2.5 py-1 rounded-xl border border-[#87CEEB]/65 dark:border-[#87CEEB]/30">
              <span className="text-[#4A7298] dark:text-[#84B4D6]">الصلاة القادمة:</span>
              <span className="font-bold text-[#12345A] dark:text-[#87CEEB]">{prayerData.nextPrayer.nameAr}</span>
              <span className="text-[#0D7A7A] dark:text-[#5EEAD4] font-mono text-[10px]">({prayerData.nextPrayer.timeRemainingFormatted})</span>
            </div>
          )}

          {prayerData && (
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-[#2B547E] dark:text-[#B8DEF5]" title={`اتجاه القبلة: ${prayerData.qiblaDirection}°`}>
              <Compass className="w-3.5 h-3.5 text-[#0EA5A4] dark:text-[#87CEEB]" />
              <span>القبلة:</span>
              <span className="font-mono font-bold text-[#12345A] dark:text-[#EAF8FF]">{prayerData.qiblaDirection}°</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
