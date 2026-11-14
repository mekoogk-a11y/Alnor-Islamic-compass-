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

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplayBlockedAudio, setAutoplayBlockedAudio] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  // Immediately start playback on mount; gracefully fall back to muted autoplay if browser blocks audio
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const attemptAutoplay = async () => {
      try {
        video.muted = false;
        await video.play();
        if (!cancelled) {
          setIsPlaying(true);
          setIsMuted(false);
          setAutoplayBlockedAudio(false);
        }
      } catch (_) {
        // Browser policy requires user gesture for unmuted autoplay; start muted immediately
        try {
          video.muted = true;
          await video.play();
          if (!cancelled) {
            setIsPlaying(true);
            setIsMuted(true);
            setAutoplayBlockedAudio(true);
          }
        } catch (__) {
          if (!cancelled) {
            setIsPlaying(false);
          }
        }
      }
    };

    attemptAutoplay();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelled = true;
      window.removeEventListener('keydown', handleKeyDown);
      if (video) {
        video.pause();
      }
    };
  }, [onClose]);

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
        video.play().catch(() => {});
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
    video.muted = false;
    setIsMuted(false);
    setAutoplayBlockedAudio(false);
    video.play().then(() => setIsPlaying(true)).catch(() => {
      video.muted = true;
      setIsMuted(true);
      video.play().catch(() => {});
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
            autoPlay
            playsInline
            controls
            preload="auto"
            onPlay={() => {
              setIsPlaying(true);
              setHasEnded(false);
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              setHasEnded(true);
            }}
            onVolumeChange={(e) => {
              const target = e.currentTarget;
              setIsMuted(target.muted);
              if (!target.muted) setAutoplayBlockedAudio(false);
            }}
            className="w-full max-h-[65vh] object-contain bg-black focus:outline-none"
          />
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
