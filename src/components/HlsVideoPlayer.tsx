import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  AlertTriangle,
  Maximize2,
  Pause,
  Play,
  RefreshCw,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HlsVideoPlayerProps {
  playbackUrl: string;
  posterUrl?: string | null;
  title?: string;
  autoPlay?: boolean;
  onPlayRecorded?: () => void;
}

interface QualityOption {
  index: number;
  label: string;
  height: number;
}

export const HlsVideoPlayer: React.FC<HlsVideoPlayerProps> = ({
  playbackUrl,
  posterUrl,
  title,
  autoPlay = false,
  onPlayRecorded,
}) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRecordedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [qualities, setQualities] = useState<QualityOption[]>([]);
  const [activeQuality, setActiveQuality] = useState<number>(-1);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    viewRecordedRef.current = false;
    setErrorMsg(null);
    setIsLoading(true);
    setQualities([]);
    setActiveQuality(-1);

    const videoEl = videoRef.current;
    if (!videoEl || !playbackUrl) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      if (!viewRecordedRef.current && onPlayRecorded) {
        viewRecordedRef.current = true;
        onPlayRecorded();
      }
    };
    const handlePause = () => setIsPlaying(false);

    videoEl.addEventListener('canplay', handleCanPlay);
    videoEl.addEventListener('waiting', handleWaiting);
    videoEl.addEventListener('playing', handlePlaying);
    videoEl.addEventListener('pause', handlePause);

    const isHlsStream = playbackUrl.toLowerCase().includes('.m3u8');

    if (isHlsStream && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 30,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        startLevel: -1,
      });

      hlsRef.current = hls;
      hls.loadSource(playbackUrl);
      hls.attachMedia(videoEl);

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        setIsLoading(false);
        const levels: QualityOption[] = (data.levels || []).map((lvl, idx) => ({
          index: idx,
          label: lvl.height ? `${lvl.height}p` : `${Math.round((lvl.bitrate || 0) / 1000)}k`,
          height: lvl.height || 0,
        }));
        levels.sort((a, b) => b.height - a.height);
        setQualities(levels);
        if (autoPlay) {
          videoEl.play().catch(() => {});
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }
        setIsLoading(false);
        setErrorMsg(
          isAr
            ? 'تعذر تشغيل بث الفيديو التكيفي (HLS) حالياً. يرجى التحقق من اتصال الإنترنت وإعادة المحاولة.'
            : 'Unable to play adaptive HLS stream. Please check your connection and retry.'
        );
        hls.destroy();
      });
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl') || !isHlsStream) {
      videoEl.src = playbackUrl;
      videoEl.load();
      if (autoPlay) {
        videoEl.play().catch(() => {});
      }
    } else {
      setIsLoading(false);
      setErrorMsg(
        isAr
          ? 'متصفحك الحالي لا يدعم تشغيل بث الفيديو التكيفي (HLS).'
          : 'Your current browser does not support adaptive HLS video playback.'
      );
    }

    return () => {
      videoEl.removeEventListener('canplay', handleCanPlay);
      videoEl.removeEventListener('waiting', handleWaiting);
      videoEl.removeEventListener('playing', handlePlaying);
      videoEl.removeEventListener('pause', handlePause);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [playbackUrl, autoPlay, reloadNonce, isAr, onPlayRecorded]);

  const handleQualityChange = (levelIndex: number) => {
    setActiveQuality(levelIndex);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(el.muted);
  };

  const toggleFullscreen = () => {
    const target = containerRef.current;
    const videoEl = videoRef.current as any;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (target?.requestFullscreen) {
      target.requestFullscreen().catch(() => {});
    } else if (videoEl?.webkitEnterFullscreen) {
      videoEl.webkitEnterFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="rounded-2xl overflow-hidden bg-[#0A223D] border border-[#87CEEB]/30 shadow-lg"
    >
      <div className="relative aspect-video bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          poster={posterUrl || undefined}
          aria-label={title || (isAr ? 'مشغل الفيديو التكيفي' : 'Adaptive Video Player')}
          className="w-full h-full object-contain bg-black"
        />

        {isLoading && !errorMsg && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35">
            <div className="px-4 py-2 rounded-xl bg-[#0A223D]/95 border border-[#87CEEB]/35 text-xs font-bold text-[#EAF8FF] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
              <span>{isAr ? 'جاري تحميل البث التكيفي...' : 'Loading adaptive stream...'}</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0A223D]/95 text-[#EAF8FF] space-y-3">
            <AlertTriangle className="w-8 h-8 text-[#D4AF37]" />
            <p className="text-xs sm:text-sm max-w-md leading-relaxed">{errorMsg}</p>
            <button
              type="button"
              onClick={() => setReloadNonce((n) => n + 1)}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C97B] text-[#0A223D] text-xs font-black flex items-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isAr ? 'إعادة تحميل البث' : 'Retry Stream'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Adaptive Quality & Playback Toolbar */}
      <div className="px-3.5 py-2.5 bg-[#12345A] border-t border-[#87CEEB]/20 flex flex-wrap items-center justify-between gap-2 text-xs text-[#EAF8FF]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="px-3 py-1.5 rounded-lg bg-[#0E3F66] hover:bg-[#0EA5A4] border border-[#87CEEB]/25 flex items-center gap-1.5 font-bold cursor-pointer min-h-[36px] transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? (isAr ? 'إيقاف' : 'Pause') : isAr ? 'تشغيل' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-lg bg-[#0E3F66] hover:bg-[#0EA5A4] border border-[#87CEEB]/25 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
            aria-label={isAr ? 'كتم الصوت' : 'Toggle Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#D4AF37]" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-[#0E3F66] hover:bg-[#0EA5A4] border border-[#87CEEB]/25 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
            aria-label={isAr ? 'ملء الشاشة' : 'Fullscreen'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {qualities.length > 0 && (
            <label className="flex items-center gap-1.5 bg-[#0A223D] border border-[#87CEEB]/25 rounded-lg px-2.5 py-1">
              <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] text-[#B8DEF5]">{isAr ? 'الجودة:' : 'Quality:'}</span>
              <select
                value={activeQuality}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer tabular-nums"
              >
                <option value={-1} className="bg-[#0A223D]">
                  {isAr ? 'تلقائي (ABR)' : 'Auto (ABR)'}
                </option>
                {qualities.map((q) => (
                  <option key={q.index} value={q.index} className="bg-[#0A223D]">
                    {q.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex items-center gap-1.5 bg-[#0A223D] border border-[#87CEEB]/25 rounded-lg px-2.5 py-1">
            <span className="text-[11px] text-[#B8DEF5]">{isAr ? 'السرعة:' : 'Speed:'}</span>
            <select
              value={playbackRate}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer tabular-nums"
            >
              {[0.75, 1, 1.25, 1.5, 2].map((r) => (
                <option key={r} value={r} className="bg-[#0A223D]">
                  {r}x
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};
