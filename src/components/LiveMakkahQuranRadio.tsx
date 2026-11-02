import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Radio, Play, Pause, Volume2, VolumeX, Globe, Sparkles, 
  Clock, ShieldCheck, ChevronUp, ChevronDown, X, Maximize2, 
  ExternalLink, Waves, CheckCircle2, Award, AlertCircle, RefreshCw,
  Compass
} from 'lucide-react';
import { MAKKAH_LIVE_RADIO_STATIONS } from '../data/islamicData';
import { LiveRadioStation } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LiveMakkahQuranRadioProps {
  initialExpanded?: boolean;
  dockedMode?: boolean;
}

export const LiveMakkahQuranRadio: React.FC<LiveMakkahQuranRadioProps> = ({ 
  initialExpanded = false,
  dockedMode = false 
}) => {
  const { lang, isRtl } = useLanguage();
  const [activeStation, setActiveStation] = useState<LiveRadioStation>(MAKKAH_LIVE_RADIO_STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [makkahTime, setMakkahTime] = useState('');
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>('جاهز للبث الحي');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Makkah Clock (GMT+3 / UTC+3)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        const timeString = new Intl.DateTimeFormat('ar-SA', {
          timeZone: 'Asia/Riyadh',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setMakkahTime(timeString);
      } catch (e) {
        const utcHours = now.getUTCHours();
        const makkahHours = (utcHours + 3) % 24;
        const minutes = now.getUTCMinutes().toString().padStart(2, '0');
        const seconds = now.getUTCSeconds().toString().padStart(2, '0');
        setMakkahTime(`${makkahHours}:${minutes}:${seconds} بتوقيت مكة`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Compute all available stream URLs for current station (primary + backups)
  const getStreamUrls = useCallback((station: LiveRadioStation): string[] => {
    const list = [station.streamUrl];
    if (station.backupUrls) {
      station.backupUrls.forEach(url => {
        if (!list.includes(url)) list.push(url);
      });
    }
    // Add generic high-availability fallbacks
    const universalFallbacks = [
      'https://backup.qurango.net/radio/mix',
      'https://qurango.net/radio/mix',
      'https://backup.qurango.net/radio/tarateel'
    ];
    universalFallbacks.forEach(u => {
      if (!list.includes(u)) list.push(u);
    });
    return list;
  }, []);

  // Play audio safely
  const startPlayback = useCallback((station: LiveRadioStation, urlIdx: number = 0) => {
    if (!audioRef.current) return;
    const urls = getStreamUrls(station);
    const validIdx = urlIdx % urls.length;
    const currentUrl = urls[validIdx];

    setIsLoading(true);
    setErrorMsg(null);
    setStatusMessage(`جاري الاتصال بالبث المباشر (${station.name.slice(0, 25)}...)...`);

    audioRef.current.src = currentUrl;
    audioRef.current.load();

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          setStatusMessage('البث مباشر ويعمل الآن بنقاء عالي من الحرم المكي 🕋');
        })
        .catch((err) => {
          console.warn('Live stream error, trying mirror:', err);
          // Try next mirror if available
          if (validIdx + 1 < urls.length) {
            setFallbackIndex(validIdx + 1);
            startPlayback(station, validIdx + 1);
          } else {
            setIsLoading(false);
            setIsPlaying(false);
            setErrorMsg('تعذر الاتصال مؤقتاً بالسيرفر، اضغط لإعادة المحاولة أو اختر إذاعة أخرى');
          }
        });
    }
  }, [getStreamUrls]);

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsLoading(false);
      setStatusMessage('البث متوقف مؤقتاً • انقر للاستماع مجدداً');
    } else {
      startPlayback(activeStation, fallbackIndex);
    }
  };

  // Switch radio station
  const selectStation = (station: LiveRadioStation) => {
    setActiveStation(station);
    setFallbackIndex(0);
    setErrorMsg(null);
    
    // Automatically start playing the selected station
    startPlayback(station, 0);
  };

  return (
    <>
      {/* Hidden Native Audio Element with full resilient event binding */}
      <audio
        ref={audioRef}
        preload="none"
        onPlaying={() => {
          setIsPlaying(true);
          setIsLoading(false);
          setErrorMsg(null);
          setStatusMessage('البث مباشر ويعمل الآن بنقاء عالي من الحرم المكي 🕋');
        }}
        onWaiting={() => {
          setIsLoading(true);
          setStatusMessage('جاري تحميل تدفق الصوت الحي...');
        }}
        onCanPlay={() => {
          setIsLoading(false);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onError={() => {
          console.warn('Audio tag encountered network error, switching to backup mirror...');
          const urls = getStreamUrls(activeStation);
          const nextIdx = (fallbackIndex + 1);
          if (nextIdx < urls.length) {
            setFallbackIndex(nextIdx);
            startPlayback(activeStation, nextIdx);
          } else {
            setIsPlaying(false);
            setIsLoading(false);
            setErrorMsg('جاري إعادة توجيه الاتصال بسيرفر بديل...');
          }
        }}
      />

      {/* Floating Sticky Docked Bar (Visible if dockedMode is active) */}
      {dockedMode && (
        <div className="fixed bottom-16 sm:bottom-4 left-2 right-2 sm:left-auto sm:right-4 z-40 max-w-md w-auto animate-fade-in">
          <div className="bg-[#FAF8F2]/95 dark:bg-[#272B25]/95 backdrop-blur-md border border-[#E5DCCB] dark:border-[#3A4237] rounded-2xl shadow-xl p-2.5 sm:p-3 text-xs flex items-center justify-between gap-3 text-[#343832] dark:text-[#F7F5EF]">
            
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <button
                  onClick={togglePlay}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-black shadow-md active:scale-95 transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-red-700 hover:bg-red-800 text-white animate-pulse'
                      : 'bg-[#394E43] hover:bg-[#2F4238] text-[#F7F5EF]'
                  }`}
                  title={isPlaying ? 'إيقاف البث' : 'تشغيل إذاعة مكة الآن'}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#F7F5EF] border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current translate-x-0.5 text-[#B9A477]" />
                  )}
                </button>
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 border-2 border-[#FAF8F2] dark:border-[#272B25] rounded-full animate-ping" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-[#394E43] dark:text-[#B9A477] uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    مباشر من مكة المكرمة 🕋
                  </span>
                  <span className="text-[10px] text-[#657568] dark:text-[#D8CEBB] font-mono hidden sm:inline">
                    {makkahTime}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#343832] dark:text-[#F7F5EF] truncate">
                  {activeStation.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#3A4237] text-[#343832] dark:text-[#F7F5EF] hover:bg-[#E5DCCB] cursor-pointer"
                title="توسيع استوديو البث الإذاعي"
              >
                <Maximize2 className="w-4 h-4 text-[#394E43] dark:text-[#B9A477]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Dedicated Radio Console Deck */}
      {(!dockedMode || isExpanded) && (
        <section 
          className={`rounded-3xl border border-[#E5DCCB] dark:border-[#3A4237] bg-[#FAF8F2] dark:bg-[#272B25] overflow-hidden shadow-sm transition-all ${
            dockedMode ? 'fixed inset-4 sm:inset-10 z-50 overflow-y-auto bg-[#FAF8F2]/98 dark:bg-[#1F221E]/98 p-4 sm:p-8 flex flex-col justify-between' : 'p-6 sm:p-10 space-y-8'
          }`}
        >
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DCCB] dark:border-[#343832] pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-[#394E43] p-1 flex items-center justify-center text-[#F7F5EF] shadow-md shrink-0">
                <Radio className="w-7 h-7 text-[#B9A477] animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-[#394E43] dark:text-[#B9A477] bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#343832] px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                    <span>بث إذاعي مباشر 24/7 من الحرم المكي الشريف 🕋</span>
                  </span>
                  <span className="text-xs text-[#657568] dark:text-[#D8CEBB] font-mono">
                    FM 98.0 • مكة المكرمة
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-[#343832] dark:text-[#F7F5EF] font-amiri">
                  إذاعة القرآن الكريم مباشر من مكة المكرمة
                </h2>
              </div>
            </div>

            {/* Makkah Real-time Clock & Dock close button */}
            <div className="flex items-center gap-3">
              <div className="bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#343832] px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-2xs">
                <Clock className="w-4 h-4 text-[#394E43] dark:text-[#B9A477]" />
                <div className="text-left font-mono">
                  <span className="text-[10px] text-[#657568] dark:text-[#D8CEBB] block leading-tight">توقيت مكة المكرمة</span>
                  <span className="text-xs sm:text-sm font-bold text-[#394E43] dark:text-[#B9A477]">{makkahTime}</span>
                </div>
              </div>

              {dockedMode && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2.5 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] text-[#657568] dark:text-[#D8CEBB] hover:text-[#343832] cursor-pointer"
                  title="إغلاق التوسيع"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Current Live Display Screen */}
          <div className="relative rounded-3xl overflow-hidden bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#343832] p-6 sm:p-8 space-y-6 shadow-inner">
            <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono text-[#394E43] dark:text-[#B9A477] font-black uppercase tracking-wider bg-[#FAF8F2] dark:bg-[#272B25] px-2.5 py-0.5 rounded-md border border-[#E5DCCB] dark:border-[#3A4237]">
                    {activeStation.origin}
                  </span>
                  <span className="text-[#80887D]">•</span>
                  <span className="text-[11px] font-mono text-[#657568] dark:text-[#D8CEBB] font-bold">
                    {activeStation.frequency}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#343832] dark:text-[#F7F5EF] font-amiri">
                  {activeStation.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
                  {activeStation.description}
                </p>

                {activeStation.featuredImam && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#394E43] dark:text-[#B9A477] bg-[#FAF8F2] dark:bg-[#272B25] px-3.5 py-1.5 rounded-xl border border-[#E5DCCB] dark:border-[#3A4237] font-bold shadow-2xs">
                    <Award className="w-4 h-4 text-[#B9A477]" />
                    <span>أصوات التلاوة المعتمدة: {activeStation.featuredImam}</span>
                  </div>
                )}

                {/* Status Indicator Pill */}
                <div className="flex items-center gap-2 pt-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isPlaying 
                      ? 'bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border border-emerald-600/30' 
                      : isLoading
                        ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                        : 'bg-[#E5DCCB] dark:bg-[#343832] text-[#657568] dark:text-[#D8CEBB]'
                  }`}>
                    {isPlaying ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                        <span>{statusMessage}</span>
                      </>
                    ) : isLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                        <span>{statusMessage}</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-3.5 h-3.5 text-[#657568]" />
                        <span>{statusMessage}</span>
                      </>
                    )}
                  </span>

                  {errorMsg && (
                    <span className="text-xs text-red-600 dark:text-red-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errorMsg}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Main Play Deck Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                
                {/* Big Master Button */}
                <button
                  onClick={togglePlay}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center font-black transition-all shadow-xl cursor-pointer ${
                    isPlaying
                      ? 'bg-red-700 hover:bg-red-800 text-white animate-pulse'
                      : 'bg-[#394E43] hover:bg-[#2D3E35] text-[#F7F5EF] hover:scale-105 active:scale-95'
                  }`}
                  title={isPlaying ? 'إيقاف البث الحي' : 'استمع الآن للبث المباشر من مكة المكرمة'}
                >
                  {isLoading ? (
                    <div className="w-8 h-8 border-3 border-[#F7F5EF] border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <>
                      <Pause className="w-8 h-8 fill-current" />
                      <span className="text-[10px] mt-1 font-bold">إيقاف</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-8 h-8 fill-current translate-x-1 text-[#B9A477]" />
                      <span className="text-[10px] mt-1 font-bold text-[#F7F5EF]">استمع الآن</span>
                    </>
                  )}
                </button>

                {/* Volume & Audio Feedback Panel */}
                <div className="flex flex-col gap-2 bg-[#FAF8F2] dark:bg-[#272B25] p-3.5 rounded-2xl border border-[#E5DCCB] dark:border-[#3A4237] w-full sm:w-44 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] text-[#657568] dark:text-[#D8CEBB] font-bold">
                    <span className="flex items-center gap-1 text-[#394E43] dark:text-[#B9A477]">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>مستوى الصوت</span>
                    </span>
                    <span className="font-mono">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-full accent-[#394E43] cursor-pointer h-1.5 bg-[#D8CEBB] dark:bg-[#343832] rounded-lg"
                  />

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-[10px] text-[#657568] dark:text-[#D8CEBB] hover:text-[#343832] text-right font-medium cursor-pointer"
                  >
                    {isMuted ? 'إلغاء كتم الصوت 🔊' : 'كتم الصوت 🔇'}
                  </button>
                </div>

              </div>

            </div>

            {/* Audio Equalizer Visualizer Bars */}
            <div className="pt-4 border-t border-[#E5DCCB] dark:border-[#343832]">
              <div className="flex items-center justify-between text-[11px] text-[#657568] dark:text-[#D8CEBB] mb-2 font-bold">
                <span className="flex items-center gap-1.5 text-[#394E43] dark:text-[#B9A477]">
                  <Waves className="w-3.5 h-3.5" />
                  <span>ترددات البث الإذاعي الحي (Makkah Broadcast Frequencies)</span>
                </span>
                <span className="font-mono text-xs">
                  {isPlaying ? '🔴 مباشر متصل • Streaming 24/7' : '⚪ في انتظار التشغيل'}
                </span>
              </div>
              <div className="flex items-end gap-1.5 h-12 w-full">
                {[
                  35, 80, 50, 95, 60, 40, 85, 30, 90, 70, 50, 85, 45, 95, 60, 40, 75, 90, 55, 70,
                  40, 85, 60, 90, 50, 75, 35, 95, 65, 50, 80, 45, 90, 60, 40, 70, 85, 55, 65, 40
                ].map((val, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t-sm transition-all duration-300 ${
                      isPlaying 
                        ? 'bg-gradient-to-t from-[#394E43] via-[#657568] to-[#B9A477]' 
                        : 'bg-[#D8CEBB] dark:bg-[#343832]'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(15, (val * ((idx % 4) + 1.2)) % 100)}%` : '12%',
                      opacity: isPlaying ? 0.95 : 0.35,
                    }}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Station Selection Dial Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#343832] dark:text-[#F7F5EF] uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-[#394E43] dark:text-[#B9A477]" />
                <span>اختر القناة الإذاعية (Select Radio Station):</span>
              </span>
              <span className="text-[11px] text-[#394E43] dark:text-[#B9A477] font-bold">
                جميع القنوات تعمل ببث حي متصل ومجاني 24 ساعة
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {MAKKAH_LIVE_RADIO_STATIONS.map((station) => {
                const isCurrent = activeStation.id === station.id;
                return (
                  <button
                    key={station.id}
                    onClick={() => selectStation(station)}
                    className={`p-4 rounded-2xl text-right transition-all border flex flex-col justify-between gap-3 text-start cursor-pointer ${
                      isCurrent
                        ? 'bg-[#F0EDE4] dark:bg-[#1F221E] border-[#394E43] shadow-md ring-2 ring-[#394E43]/20'
                        : 'bg-[#FAF8F2] dark:bg-[#272B25] border-[#E5DCCB] dark:border-[#3A4237] hover:bg-[#F0EDE4] dark:hover:bg-[#1F221E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isCurrent 
                          ? 'bg-[#394E43] text-[#F7F5EF] font-black' 
                          : 'bg-[#E5DCCB] dark:bg-[#343832] text-[#657568] dark:text-[#D8CEBB]'
                      }`}>
                        {station.frequency}
                      </span>
                      {isCurrent && isPlaying && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-[#343832] dark:text-[#F7F5EF] leading-snug">
                        {station.name}
                      </h4>
                      <p className="text-[11px] text-[#657568] dark:text-[#D8CEBB] mt-1 line-clamp-2">
                        {station.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E5DCCB] dark:border-[#343832] flex items-center justify-between text-[10px]">
                      <span className="text-[#394E43] dark:text-[#B9A477] font-bold">{station.badge}</span>
                      <span className="text-[#657568] dark:text-[#D8CEBB] font-medium">
                        {isCurrent ? (isPlaying ? 'يعمل الآن' : 'انقر للتشغيل') : 'انقر للاستماع'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </section>
      )}
    </>
  );
};
