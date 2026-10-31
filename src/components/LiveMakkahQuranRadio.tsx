import React, { useState, useRef, useEffect } from 'react';
import { 
  Radio, Play, Pause, Volume2, VolumeX, Globe, Sparkles, 
  Clock, ShieldCheck, ChevronUp, ChevronDown, X, Maximize2, 
  ExternalLink, Waves, CheckCircle2, Award 
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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Makkah Clock (GMT+3 / UTC+3)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Asia/Riyadh timezone
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
        // Fallback calculation UTC+3
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

  const [fallbackIndex, setFallbackIndex] = useState(0);

  const BACKUP_URLS: Record<string, string[]> = {
    'makkah-live': ['https://backup.qurango.net/radio/makkah', 'https://backup.qurango.net/radio/tarteel', 'https://server02.quran.com.kw:8010/'],
    'saudi-quran': ['https://backup.qurango.net/radio/saudi', 'https://qurango.net/radio/saudi'],
    'cairo-quran': ['https://stream.radiojar.com/8s5u8p4845ruv', 'https://stream.radiojar.com/0t5g0mg31v5tv'],
    'tarteel-live': ['https://backup.qurango.net/radio/tarteel', 'https://backup.qurango.net/radio/makkah'],
    'makkah-adhan': ['https://backup.qurango.net/radio/takbeer', 'https://backup.qurango.net/radio/makkah'],
  };

  const getStationUrl = (stationId: string, index: number) => {
    const list = BACKUP_URLS[stationId] || [activeStation.streamUrl];
    return list[index % list.length];
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const url = getStationUrl(activeStation.id, fallbackIndex);
      audioRef.current.src = url;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn('Audio playback interrupted or blocked by browser policy:', err);
          // Try next backup stream
          const nextIdx = fallbackIndex + 1;
          setFallbackIndex(nextIdx);
          if (audioRef.current) {
            audioRef.current.src = getStationUrl(activeStation.id, nextIdx);
            audioRef.current.play().then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            }).catch(() => {
              setIsPlaying(false);
              setIsLoading(false);
            });
          }
        });
    }
  };

  const selectStation = (station: LiveRadioStation) => {
    setActiveStation(station);
    setFallbackIndex(0);
    if (audioRef.current) {
      audioRef.current.src = station.streamUrl;
      if (isPlaying) {
        setIsLoading(true);
        audioRef.current
          .play()
          .then(() => setIsLoading(false))
          .catch(() => {
            setIsPlaying(false);
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <>
      {/* Hidden Audio Tag */}
      <audio
        ref={audioRef}
        preload="none"
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onError={() => {
          // If error occurs, try fallback URL
          const nextIdx = fallbackIndex + 1;
          const urls = BACKUP_URLS[activeStation.id] || [];
          if (nextIdx < urls.length && audioRef.current) {
            setFallbackIndex(nextIdx);
            audioRef.current.src = urls[nextIdx];
            audioRef.current.play().catch(console.warn);
          } else {
            setIsPlaying(false);
            setIsLoading(false);
          }
        }}
      />

      {/* Docked / Floating Persistent Player (Visible if dockedMode is active) */}
      {dockedMode && (
        <div className="fixed bottom-16 sm:bottom-4 left-2 right-2 sm:left-auto sm:right-4 z-40 max-w-md w-auto">
          <div className="bg-slate-950/95 backdrop-blur-md border border-amber-500/40 rounded-2xl shadow-2xl p-2.5 sm:p-3 text-xs flex items-center justify-between gap-3 text-white">
            
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                  title={isPlaying ? 'إيقاف البث' : 'تشغيل إذاعة مكة'}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  )}
                </button>
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-slate-950 rounded-full animate-ping" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    مباشر من مكة المكرمة 🕋
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    {makkahTime}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-100 truncate">
                  {activeStation.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                title="توسيع استوديو البث المباشر"
              >
                <Maximize2 className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Dedicated Radio Console Deck (Rendered inline or in expanded modal) */}
      {(!dockedMode || isExpanded) && (
        <section 
          className={`rounded-3xl luxury-card border border-amber-500/30 overflow-hidden shadow-2xl transition-all ${
            dockedMode ? 'fixed inset-4 sm:inset-10 z-50 overflow-y-auto bg-slate-950/98 p-4 sm:p-8 flex flex-col justify-between' : 'p-5 sm:p-8 space-y-6'
          }`}
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 p-0.5 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>بث إذاعي مباشر 24/7 من الحرم المكي الشريف 🕋</span>
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white mt-1">
                  إذاعة القرآن الكريم مباشر من مكة المكرمة
                </h2>
              </div>
            </div>

            {/* Makkah Real-time Clock & Dock close button */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <div className="text-left font-mono">
                  <span className="text-[10px] text-slate-400 block leading-tight">توقيت مكة المكرمة</span>
                  <span className="text-xs font-bold text-amber-300">{makkahTime}</span>
                </div>
              </div>

              {dockedMode && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Current Live Display Screen */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-5 sm:p-8 space-y-5">
            <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    {activeStation.origin}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    {activeStation.frequency}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {activeStation.name}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeStation.description}
                </p>

                {activeStation.featuredImam && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                    <Award className="w-3.5 h-3.5" />
                    <span>أصوات التلاوة: {activeStation.featuredImam}</span>
                  </div>
                )}
              </div>

              {/* Main Play Deck */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={togglePlay}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center font-black transition-all shadow-2xl cursor-pointer ${
                    isPlaying
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 animate-pulse'
                      : 'bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/30 hover:scale-105 active:scale-95'
                  }`}
                  title={isPlaying ? 'إيقاف البث الحي' : 'استمع الآن للبث المباشر'}
                >
                  {isLoading ? (
                    <div className="w-8 h-8 border-3 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current translate-x-1" />
                  )}
                </button>

                {/* Volume & Audio Feedback */}
                <div className="flex flex-col gap-2 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 w-full sm:w-44">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
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
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-[10px] text-slate-400 hover:text-white text-right"
                  >
                    {isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Equalizer Visualizer Bars */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-end gap-1.5 h-10 w-full">
                {[
                  35, 80, 50, 95, 60, 40, 85, 30, 90, 70, 50, 85, 45, 95, 60, 40, 75, 90, 55, 70,
                  40, 85, 60, 90, 50, 75, 35, 95, 65, 50, 80, 45, 90, 60, 40, 70, 85, 55, 65, 40
                ].map((val, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t-sm transition-all duration-300 ${
                      isPlaying 
                        ? 'bg-gradient-to-t from-emerald-600 via-amber-500 to-amber-300' 
                        : 'bg-slate-800/60'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(15, (val * ((idx % 4) + 1)) % 100)}%` : '15%',
                      opacity: isPlaying ? 0.95 : 0.25,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Station Selection Dial Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                اختر القناة الإذاعية (Select Radio Station):
              </span>
              <span className="text-[11px] text-amber-400 font-medium">
                جميع القنوات تعمل ببث حي متصل ومجاني
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {MAKKAH_LIVE_RADIO_STATIONS.map((station) => {
                const isCurrent = activeStation.id === station.id;
                return (
                  <button
                    key={station.id}
                    onClick={() => selectStation(station)}
                    className={`p-3.5 rounded-2xl text-right transition-all border flex flex-col justify-between gap-2.5 ${
                      isCurrent
                        ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCurrent 
                          ? 'bg-amber-500 text-slate-950 font-black' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {station.frequency}
                      </span>
                      {isCurrent && isPlaying && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-white leading-snug">
                        {station.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {station.origin}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                      <span className="text-amber-400/90 font-medium">{station.badge}</span>
                      <span className="text-slate-500">{isCurrent ? 'القناة المحددة' : 'انقر للاستماع'}</span>
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
