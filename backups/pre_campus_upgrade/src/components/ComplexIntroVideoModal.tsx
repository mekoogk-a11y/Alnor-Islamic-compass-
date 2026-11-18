import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  ArrowLeft,
  RotateCcw,
  Maximize2,
  Loader2,
  WifiOff,
  AlertTriangle,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { OFFICIAL_COMPLEX_LOGO } from '../data/islamicData';
import { useLanguage } from '../context/LanguageContext';
import { formatVideoTime, useResilientVideo } from '../hooks/useResilientVideo';

export const INTRO_VIDEO_OPTIMIZED_SRC = '/assets/aistudio/intro_alnoor_optimized.mp4';
export const INTRO_VIDEO_SRC = '/assets/aistudio/InShot_20261102_195200401_a7afa276.mp4';
export const INTRO_VIDEO_SOURCES = [INTRO_VIDEO_OPTIMIZED_SRC, INTRO_VIDEO_SRC];
export const INTRO_VIDEO_POSTER = '/assets/aistudio/intro_alnoor_poster.jpg';

interface ComplexIntroVideoModalProps {
  onClose: () => void;
}

export const ComplexIntroVideoModal: React.FC<ComplexIntroVideoModalProps> = ({ onClose }) => {
  const { isRtl } = useLanguage();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [isClosing, setIsClosing] = useState(false);
  const [autoSkipSeconds, setAutoSkipSeconds] = useState<number | null>(null);
  const [autoSkipCancelled, setAutoSkipCancelled] = useState(false);

  const { state, actions } = useResilientVideo({
    videoRef,
    sources: INTRO_VIDEO_SOURCES,
    autoPlay: true,
    playerId: 'intro-modal',
    storageKey: 'alnoor_intro_video_pos',
  });

  const handleSmoothClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      onCloseRef.current();
    } else {
      window.setTimeout(() => {
        onCloseRef.current();
      }, 260);
    }
  }, [isClosing]);

  // Smart fallback: if playback fails unrecoverably, start a gentle auto-skip countdown
  useEffect(() => {
    if (!state.errorMessage || autoSkipCancelled) {
      setAutoSkipSeconds(null);
      return;
    }
    setAutoSkipSeconds(6);
    const interval = window.setInterval(() => {
      setAutoSkipSeconds((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          window.clearInterval(interval);
          handleSmoothClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [state.errorMessage, autoSkipCancelled, handleSmoothClose]);

  // Keyboard shortcuts (Escape, Space, ArrowLeft/Right, M, F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key === 'Escape') {
        handleSmoothClose();
      } else if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        actions.togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        actions.toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        actions.toggleFullscreen(stageContainerRef.current);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        actions.skipBy(5);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        actions.skipBy(-5);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions, handleSmoothClose]);

  const handleSeekInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetSec = parseFloat(e.target.value);
    if (Number.isFinite(targetSec)) {
      actions.seekTo(targetSec);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-[#030712]/95 backdrop-blur-xl overflow-y-auto transition-opacity duration-300 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-fade-in'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      aria-label="الفيديو التعريفي لمجمع النور الإسلامي العالمي"
    >
      <div
        className={`relative w-full max-w-3xl bg-[#070D1E] border border-[#D4AF37]/50 rounded-3xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] overflow-hidden my-auto transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Top Institutional Header Bar (Outside video canvas) */}
        <div className="px-4 py-3 sm:px-6 bg-[#0B132B] border-b border-[#D4AF37]/25 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={OFFICIAL_COMPLEX_LOGO}
              alt="شعار مجمع النور الإسلامي العالمي"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-contain bg-[#070D1E] p-1 border border-[#D4AF37]/40 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[#D4AF37] tracking-wide truncate">
                الفيديو التعريفي الرسمي للمجمع
              </p>
              <h2 className="text-sm sm:text-base font-black text-white font-amiri truncate">
                مجمع النور الإسلامي العالمي الخيري الشامل
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSmoothClose}
            className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-[#111C3D] hover:bg-rose-950/70 text-[#E2E8F0] hover:text-white border border-[#D4AF37]/30 text-xs font-bold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            aria-label="إغلاق الفيديو والدخول للموقع"
          >
            <span className="hidden sm:inline">تخطي ودخول الموقع</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unaltered Native Video Stage with aspect-ratio protection */}
        <div
          ref={stageContainerRef}
          className="relative bg-black flex items-center justify-center w-full overflow-hidden [&:fullscreen]:h-screen [&:fullscreen]:w-screen [&:fullscreen>div]:max-h-screen [&:fullscreen>div]:h-screen [&:fullscreen_video]:max-h-screen"
        >
          <div className="w-full max-h-[60vh] aspect-square flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src={state.currentSrc}
              poster={INTRO_VIDEO_POSTER}
              playsInline
              preload="metadata"
              onClick={actions.togglePlay}
              className="w-full h-full max-h-[60vh] object-contain bg-black cursor-pointer focus:outline-none"
            />
          </div>

          {/* Center Play Overlay if browser blocked even muted autoplay */}
          {state.autoplayBlockedCompletely && !state.isPlaying && !state.errorMessage && (
            <button
              type="button"
              onClick={actions.togglePlay}
              aria-label="بدء تشغيل الفيديو التعريفي"
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 hover:bg-black/45 transition-colors cursor-pointer"
            >
              <span className="w-16 h-16 rounded-full bg-[#D4AF37] text-[#070D1E] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.55)]">
                <Play className="w-7 h-7 fill-current ml-0.5" />
              </span>
              <span className="px-4 py-1.5 rounded-xl bg-[#0B132B]/90 border border-[#D4AF37]/50 text-xs font-bold text-[#F8FAFC]">
                اضغط لتشغيل الفيديو التعريفي
              </span>
            </button>
          )}

          {/* Buffering / Loading Indicator */}
          {(state.isBuffering || state.isOffline) && !state.errorMessage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black/60 pointer-events-none px-4 text-center">
              {state.isOffline ? (
                <>
                  <WifiOff className="w-9 h-9 text-amber-400" />
                  <p className="text-xs sm:text-sm font-bold text-amber-200 max-w-xs">
                    انقطع الاتصال بالإنترنت، سيتم استئناف الفيديو تلقائياً عند عودة الشبكة.
                  </p>
                </>
              ) : (
                <>
                  <Loader2 className="w-9 h-9 text-[#D4AF37] animate-spin" />
                  <p className="text-xs font-bold text-[#F8FAFC]">
                    {state.recoveryAttempt > 0
                      ? 'جاري استعادة بث الفيديو بسلاسة...'
                      : 'جاري تحميل المقطع...'}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Error & Smart Fallback Overlay */}
          {state.errorMessage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 bg-[#070D1E]/92 p-6 text-center">
              <AlertTriangle className="w-10 h-10 text-amber-400" />
              <p className="text-xs sm:text-sm text-amber-100 font-bold max-w-sm leading-relaxed">
                {state.errorMessage}
              </p>
              {autoSkipSeconds !== null && !autoSkipCancelled && (
                <p className="text-[11px] text-[#CBD5E1]">
                  سيتم الدخول تلقائياً إلى البوابة الرئيسية خلال {autoSkipSeconds} ثوانٍ...
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setAutoSkipCancelled(false);
                    actions.retry();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#070D1E] text-xs font-black cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة المحاولة</span>
                </button>
                <button
                  type="button"
                  onClick={handleSmoothClose}
                  className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#111C3D] hover:bg-[#1E2E5D] text-[#F8FAFC] border border-[#D4AF37]/40 text-xs font-bold cursor-pointer transition-colors"
                >
                  <span>تخطي ودخول الموقع</span>
                  <ArrowLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
                </button>
                {autoSkipSeconds !== null && !autoSkipCancelled && (
                  <button
                    type="button"
                    onClick={() => setAutoSkipCancelled(true)}
                    className="px-3 py-2 text-[11px] text-[#94A3B8] hover:text-white underline cursor-pointer"
                  >
                    إلغاء التخطي التلقائي
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Timeline Scrubber & Time Readout (Always LTR for media seeking intuition) */}
        <div className="px-4 pt-3 pb-2 sm:px-6 bg-[#0B132B] border-t border-[#D4AF37]/20 space-y-1.5" dir="ltr">
          <div className="relative flex items-center h-6">
            {/* Background Track & Buffered Bar */}
            <div className="absolute inset-x-0 h-1.5 rounded-full bg-[#1E293B] overflow-hidden pointer-events-none">
              <div
                className="h-full bg-[#D4AF37]/30 transition-all duration-200"
                style={{ width: `${state.bufferedPercent}%` }}
              />
              <div
                className="h-full bg-[#D4AF37] -mt-1.5 transition-all duration-100"
                style={{ width: `${state.progressPercent}%` }}
              />
            </div>

            <input
              type="range"
              min={0}
              max={state.duration > 0 ? state.duration : 85}
              step={0.1}
              value={state.currentTime}
              onChange={handleSeekInput}
              aria-label="شريط التقدم والتنقل داخل الفيديو"
              className="relative z-10 w-full h-6 opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[#CBD5E1]">
            <span>{formatVideoTime(state.currentTime)}</span>
            <span className="text-[#94A3B8]">
              {state.duration > 0 ? formatVideoTime(state.duration) : '01:25'}
            </span>
          </div>
        </div>

        {/* Bottom Controls & Navigation Bar */}
        <div className="px-4 pb-4 pt-2 sm:px-6 bg-[#070D1E] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Play / Pause */}
            <button
              type="button"
              onClick={actions.togglePlay}
              className="flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-[#111C3D] hover:bg-[#1A2A54] border border-[#D4AF37]/35 text-[#F8FAFC] text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              {state.isPlaying ? (
                <Pause className="w-4 h-4 text-[#D4AF37]" />
              ) : (
                <Play className="w-4 h-4 text-[#D4AF37]" />
              )}
              <span>{state.isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}</span>
            </button>

            {/* Rewind / Forward 10s */}
            <button
              type="button"
              onClick={() => actions.skipBy(-10)}
              title="ترجيع 10 ثوانٍ"
              aria-label="ترجيع 10 ثوانٍ"
              className="flex items-center justify-center p-2 min-w-[40px] min-h-[40px] rounded-xl bg-[#111C3D] hover:bg-[#1A2A54] border border-[#D4AF37]/25 text-[#E2E8F0] cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => actions.skipBy(10)}
              title="تقديم 10 ثوانٍ"
              aria-label="تقديم 10 ثوانٍ"
              className="flex items-center justify-center p-2 min-w-[40px] min-h-[40px] rounded-xl bg-[#111C3D] hover:bg-[#1A2A54] border border-[#D4AF37]/25 text-[#E2E8F0] cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Sound Enable / Mute */}
            {state.autoplayBlockedAudio || state.isMuted ? (
              <button
                type="button"
                onClick={actions.enableSoundNow}
                className="flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#070D1E] text-xs font-black shadow-[0_0_18px_rgba(212,175,55,0.4)] cursor-pointer whitespace-nowrap"
              >
                <Volume2 className="w-4 h-4" />
                <span>تشغيل الصوت</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={actions.toggleMute}
                className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-[#111C3D] hover:bg-[#1A2A54] border border-[#D4AF37]/30 text-[#E2E8F0] text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                {state.isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>{state.isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}</span>
              </button>
            )}

            {/* Replay from start */}
            {state.hasEnded && (
              <button
                type="button"
                onClick={actions.replayFromStart}
                className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-[#111C3D] hover:bg-[#1A2A54] border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المشاهدة</span>
              </button>
            )}

            {/* Fullscreen */}
            <button
              type="button"
              onClick={() => actions.toggleFullscreen(stageContainerRef.current)}
              title="ملء الشاشة"
              aria-label="ملء الشاشة"
              className="flex items-center justify-center p-2 min-w-[40px] min-h-[40px] rounded-xl bg-[#111C3D] hover:bg-[#1A2A54] border border-[#D4AF37]/25 text-[#E2E8F0] cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#070D1E] text-xs sm:text-sm font-black shadow-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>دخول إلى بوابة المجمع</span>
            <ArrowLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
