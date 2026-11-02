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
    <div className="bg-[#F0EDE4] dark:bg-[#272B25] border-y border-[#E5DCCB] dark:border-[#3A4237] px-4 py-2 backdrop-blur-md text-xs text-[#343832] dark:text-[#F7F5EF] transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: City Selector & Hijri Date */}
        <div className="flex items-center gap-3">
          {/* City Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F5EF] dark:bg-[#1F221E] border border-[#D8CEBB] dark:border-[#3A4237] hover:border-[#394E43] dark:hover:border-[#B9A477] text-[#343832] dark:text-[#F7F5EF] transition-colors cursor-pointer shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-[#394E43] dark:text-[#B9A477]" />
              <span className="font-bold">{currentCityObj.nameAr}</span>
              <ChevronDown className="w-3 h-3 text-[#80887D]" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-1.5 right-0 z-50 w-48 bg-[#FAF8F2] dark:bg-[#20241E] border border-[#D8CEBB] dark:border-[#4A5447] rounded-xl shadow-lg py-1 max-h-60 overflow-y-auto">
                {CITIES.map((city) => (
                  <button
                    key={city.key}
                    onClick={() => {
                      setSelectedCity(city.key);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-right px-3.5 py-1.5 text-xs hover:bg-[#E5DCCB] dark:hover:bg-[#2C322A] flex items-center justify-between ${
                      city.key === selectedCity ? 'text-[#394E43] dark:text-[#B9A477] font-bold bg-[#E5DCCB]/60 dark:bg-[#2C322A]' : 'text-[#343832] dark:text-[#D8CEBB]'
                    }`}
                  >
                    <span>{city.nameAr}</span>
                    <span className="text-[10px] text-[#80887D]">{city.nameEn}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hijri Date Display */}
          {hijriData && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#5E655B] dark:text-[#D8CEBB]">
              <span className="text-[#394E43] dark:text-[#B9A477] font-bold">
                {hijriData.day} {hijriData.monthNameAr} {hijriData.year} هـ
              </span>
              {hijriData.isSacredMonth && (
                <span className="px-2 py-0.5 rounded-full bg-[#394E43]/10 dark:bg-[#394E43]/30 text-[#394E43] dark:text-[#B9A477] text-[10px] border border-[#394E43]/20 dark:border-[#B9A477]/30 font-medium">
                  من الأشهر الحُرُم
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center: Prayer Times Pills */}
        {prayerData && (
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
            
            {/* Fajr */}
            <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[11px] transition-all ${
              prayerData.nextPrayer?.nameAr === 'الفجر' 
                ? 'bg-[#394E43] border-[#B9A477]/50 text-[#F7F5EF] font-bold shadow-sm' 
                : 'bg-[#F7F5EF] dark:bg-[#1F221E] border-[#E5DCCB] dark:border-[#3A4237] text-[#5E655B] dark:text-[#D8CEBB]'
            }`}>
              <Moon className="w-3 h-3 text-[#B9A477]" />
              <span>الفجر:</span>
              <span className="font-mono">{prayerData.timings.Fajr}</span>
            </div>

            {/* Sunrise */}
            <div className="px-2.5 py-1 rounded-xl bg-[#F7F5EF]/70 dark:bg-[#1F221E]/60 border border-[#E5DCCB] dark:border-[#3A4237] text-[#80887D] flex items-center gap-1.5 text-[11px] hidden md:flex">
              <Sunrise className="w-3 h-3 text-[#B9A477]" />
              <span>الشروق:</span>
              <span className="font-mono">{prayerData.timings.Sunrise}</span>
            </div>

            {/* Dhuhr */}
            <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[11px] transition-all ${
              prayerData.nextPrayer?.nameAr === 'الظهر' 
                ? 'bg-[#394E43] border-[#B9A477]/50 text-[#F7F5EF] font-bold shadow-sm' 
                : 'bg-[#F7F5EF] dark:bg-[#1F221E] border-[#E5DCCB] dark:border-[#3A4237] text-[#5E655B] dark:text-[#D8CEBB]'
            }`}>
              <Sun className="w-3 h-3 text-[#B9A477]" />
              <span>الظهر:</span>
              <span className="font-mono">{prayerData.timings.Dhuhr}</span>
            </div>

            {/* Asr */}
            <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[11px] transition-all ${
              prayerData.nextPrayer?.nameAr === 'العصر' 
                ? 'bg-[#394E43] border-[#B9A477]/50 text-[#F7F5EF] font-bold shadow-sm' 
                : 'bg-[#F7F5EF] dark:bg-[#1F221E] border-[#E5DCCB] dark:border-[#3A4237] text-[#5E655B] dark:text-[#D8CEBB]'
            }`}>
              <Sun className="w-3 h-3 text-[#B9A477]" />
              <span>العصر:</span>
              <span className="font-mono">{prayerData.timings.Asr}</span>
            </div>

            {/* Maghrib */}
            <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[11px] transition-all ${
              prayerData.nextPrayer?.nameAr === 'المغرب' 
                ? 'bg-[#394E43] border-[#B9A477]/50 text-[#F7F5EF] font-bold shadow-sm' 
                : 'bg-[#F7F5EF] dark:bg-[#1F221E] border-[#E5DCCB] dark:border-[#3A4237] text-[#5E655B] dark:text-[#D8CEBB]'
            }`}>
              <Sunset className="w-3 h-3 text-[#B9A477]" />
              <span>المغرب:</span>
              <span className="font-mono">{prayerData.timings.Maghrib}</span>
            </div>

            {/* Isha */}
            <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[11px] transition-all ${
              prayerData.nextPrayer?.nameAr === 'العشاء' 
                ? 'bg-[#394E43] border-[#B9A477]/50 text-[#F7F5EF] font-bold shadow-sm' 
                : 'bg-[#F7F5EF] dark:bg-[#1F221E] border-[#E5DCCB] dark:border-[#3A4237] text-[#5E655B] dark:text-[#D8CEBB]'
            }`}>
              <Moon className="w-3 h-3 text-[#B9A477]" />
              <span>العشاء:</span>
              <span className="font-mono">{prayerData.timings.Isha}</span>
            </div>

          </div>
        )}

        {/* Right: Next Prayer Countdown & Qibla */}
        <div className="flex items-center gap-3">
          {prayerData?.nextPrayer && (
            <div className="flex items-center gap-1.5 text-[11px] bg-[#F7F5EF] dark:bg-[#1F221E] px-2.5 py-1 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237]">
              <span className="text-[#80887D]">الصلاة القادمة:</span>
              <span className="font-bold text-[#394E43] dark:text-[#B9A477]">{prayerData.nextPrayer.nameAr}</span>
              <span className="text-[#657568] dark:text-[#A4B5A7] font-mono text-[10px]">({prayerData.nextPrayer.timeRemainingFormatted})</span>
            </div>
          )}

          {prayerData && (
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-[#5E655B] dark:text-[#D8CEBB]" title={`اتجاه القبلة: ${prayerData.qiblaDirection}°`}>
              <Compass className="w-3.5 h-3.5 text-[#394E43] dark:text-[#B9A477]" />
              <span>القبلة:</span>
              <span className="font-mono font-bold text-[#343832] dark:text-[#F7F5EF]">{prayerData.qiblaDirection}°</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
