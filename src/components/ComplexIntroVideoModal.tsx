import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, X, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { OFFICIAL_COMPLEX_LOGO } from '../data/islamicData';
import { useLanguage } from '../context/LanguageContext';

export const INTRO_VIDEO_SRC = '/assets/aistudio/InShot_20261102_195200401_a7afa276.mp4';

interface ComplexIntroVideoModalProps {
  onClose: () => void;
}

export const ComplexIntroVideoModal: React.FC<ComplexIntroVideoModalProps> = ({ onClose }) => {
  const { isRtl } = useLanguage();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplayBlockedAudio, setAutoplayBlockedAudio] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Immediately start playback once on mount without tearing down on parent re-renders
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const attemptAutoplay = async () => {
      if (cancelled) return;
      setVideoError(null);
      try {
        video.muted = false;
        await video.play();
        if (!cancelled) {
          setIsPlaying(true);
          setIsMuted(false);
          setAutoplayBlockedAudio(false);
        }
      } catch (err: any) {
        if (cancelled) return;
        // If browser policy blocks unmuted autoplay, gracefully fall back to muted autoplay
        if (err?.name === 'NotAllowedError') {
          try {
            video.muted = true;
            await video.play();
            if (!cancelled) {
              setIsPlaying(true);
              setIsMuted(true);
              setAutoplayBlockedAudio(true);
            }
          } catch (_) {
            if (!cancelled) {
              setIsPlaying(false);
              setAutoplayBlockedAudio(true);
            }
          }
        } else if (err?.name !== 'AbortError') {
          setIsPlaying(false);
        }
      }
    };

    attemptAutoplay();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelled = true;
      window.removeEventListener('keydown', handleKeyDown);
      video.pause();
    };
  }, []);

  const handleVideoError = () => {
    const video = videoRef.current;
    if (!video) return;
    if (retryCount < 2) {
      setRetryCount((c) => c + 1);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play().catch(() => {});
        }
      }, 600);
      return;
    }
    setIsPlaying(false);
    setVideoError('تعذر تحميل الفيديو مؤقتاً، يرجى الضغط على إعادة المحاولة.');
  };

  const handleRetryLoad = () => {
    const video = videoRef.current;
    if (!video) return;
    setVideoError(null);
    setRetryCount(0);
    video.load();
    video.muted = false;
    video.play()
      .then(() => {
        setIsPlaying(true);
        setIsMuted(false);
        setAutoplayBlockedAudio(false);
      })
      .catch(() => {
        video.muted = true;
        setIsMuted(true);
        setAutoplayBlockedAudio(true);
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      });
  };

  const handleTogglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) {
      if (video.ended) {
        video.currentTime = 0;
        setHasEnded(false);
      }
      try {
        await video.play();
        setIsPlaying(true);
        setVideoError(null);
      } catch (_) {}
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      setAutoplayBlockedAudio(false);
      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleEnableSoundNow = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setIsMuted(false);
    setAutoplayBlockedAudio(false);
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setHasEnded(false);
    setVideoError(null);
    video.muted = false;
    setIsMuted(false);
    setAutoplayBlockedAudio(false);
    video.play().then(() => setIsPlaying(true)).catch(() => {
      video.muted = true;
      setIsMuted(true);
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#030712]/95 backdrop-blur-xl animate-fade-in overflow-y-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      aria-label="الفيديو التعريفي لمجمع النور الإسلامي العالمي"
    >
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#0B132B] via-[#070D1E] to-[#050914] border-2 border-[#D4AF37]/60 rounded-3xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] overflow-hidden my-auto">
        
        {/* Top Institutional Header Bar (Outside video canvas) */}
        <div className="px-4 py-3.5 sm:px-6 bg-[#0B132B] border-b border-[#D4AF37]/25 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={OFFICIAL_COMPLEX_LOGO}
              alt="شعار مجمع النور الإسلامي العالمي"
              className="w-10 h-10 rounded-xl object-contain bg-[#070D1E] p-1 border border-[#D4AF37]/40 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="text-[11px] font-bold text-[#D4AF37] tracking-wide">
                  الفيديو التعريفي الرسمي للمجمع
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white font-amiri truncate">
                مجمع النور الإسلامي العالمي الخيري الشامل
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111C3D] hover:bg-rose-950/70 text-[#E2E8F0] hover:text-white border border-[#D4AF37]/30 text-xs font-bold transition-all cursor-pointer shrink-0"
            aria-label="إغلاق الفيديو والدخول للموقع"
          >
            <span className="hidden sm:inline">تخطي ودخول الموقع</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unaltered Native Video Stage */}
        <div className="relative bg-black flex items-center justify-center w-full">
          <video
            ref={videoRef}
            src={INTRO_VIDEO_SRC}
            playsInline
            controls
            preload="auto"
            onPlay={() => {
              setIsPlaying(true);
              setHasEnded(false);
              setVideoError(null);
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              setHasEnded(true);
            }}
            onError={handleVideoError}
            onVolumeChange={(e) => {
              const target = e.currentTarget;
              setIsMuted(target.muted);
              if (!target.muted) setAutoplayBlockedAudio(false);
            }}
            className="w-full max-h-[65vh] object-contain bg-black focus:outline-none"
          />
          {videoError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 p-6 text-center">
              <p className="text-xs sm:text-sm text-amber-200 font-bold">{videoError}</p>
              <button
                type="button"
                onClick={handleRetryLoad}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-[#070D1E] text-xs font-black cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة تشغيل الفيديو</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Controls & Audio Prompt (Outside video canvas so video remains 100% unobstructed) */}
        <div className="p-4 sm:px-6 bg-[#070D1E] border-t border-[#D4AF37]/25 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {autoplayBlockedAudio || isMuted ? (
              <button
                onClick={handleEnableSoundNow}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:brightness-110 text-[#070D1E] text-xs font-black shadow-[0_0_20px_rgba(212,175,55,0.45)] animate-pulse cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>اضغط هنا لتشغيل الصوت 🔊</span>
              </button>
            ) : (
              <button
                onClick={handleToggleMute}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111C3D] hover:bg-[#1A2A54] border border-[#D4AF37]/30 text-[#E2E8F0] text-xs font-bold cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span>{isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}</span>
              </button>
            )}

            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111C3D] hover:bg-[#1A2A54] border border-[#D4AF37]/30 text-[#E2E8F0] text-xs font-bold cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-[#D4AF37]" /> : <Play className="w-4 h-4 text-[#D4AF37]" />}
              <span>{isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}</span>
            </button>

            {hasEnded && (
              <button
                onClick={handleReplay}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111C3D] hover:bg-[#1A2A54] border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المشاهدة</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:scale-[1.02] text-[#070D1E] text-xs sm:text-sm font-black shadow-lg transition-all cursor-pointer mr-auto sm:mr-0"
          >
            <span>دخول إلى بوابة المجمع</span>
            <ArrowLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
