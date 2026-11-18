import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface UseResilientVideoOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  sources: string[];
  autoPlay?: boolean;
  playerId: string;
  storageKey?: string;
  onAutoClose?: () => void;
}

export interface ResilientVideoState {
  currentSrc: string;
  sourceIndex: number;
  isReady: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  bufferedPercent: number;
  progressPercent: number;
  hasEnded: boolean;
  autoplayBlockedAudio: boolean;
  autoplayBlockedCompletely: boolean;
  isOffline: boolean;
  errorMessage: string | null;
  recoveryAttempt: number;
}

const MAX_STALL_RECOVERIES = 3;
const MAX_ERROR_RETRIES = 2;
const STALL_TIMEOUT_MS = 4500;
const BUFFER_INDICATOR_DELAY_MS = 250;

export function formatVideoTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function useResilientVideo({
  videoRef,
  sources,
  autoPlay = false,
  playerId,
  storageKey,
}: UseResilientVideoOptions) {
  const safeSources = sources.length > 0 ? sources : [''];

  const [sourceIndex, setSourceIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(() => {
    if (!storageKey) return 0;
    try {
      const saved = sessionStorage.getItem(storageKey);
      const parsed = saved ? parseFloat(saved) : 0;
      return Number.isFinite(parsed) && parsed > 0.5 ? parsed : 0;
    } catch {
      return 0;
    }
  });
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [autoplayBlockedAudio, setAutoplayBlockedAudio] = useState(false);
  const [autoplayBlockedCompletely, setAutoplayBlockedCompletely] = useState(false);
  const [isOffline, setIsOffline] = useState(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recoveryAttempt, setRecoveryAttempt] = useState(0);

  // Refs to avoid stale closures and never tear down playback on React re-renders
  const savedTimeRef = useRef<number>(currentTime);
  const pendingSeekRef = useRef<number | null>(currentTime > 0.5 ? currentTime : null);
  const shouldResumeOnOnlineRef = useRef<boolean>(false);
  const stallCountRef = useRef<number>(0);
  const errorCountRef = useRef<number>(0);
  const sourceIndexRef = useRef<number>(0);
  const lastProgressTimeRef = useRef<number>(0);
  const stallTimerRef = useRef<number | null>(null);
  const bufferDelayTimerRef = useRef<number | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const autoPlayTriggeredRef = useRef<boolean>(false);

  const clearTimers = useCallback(() => {
    if (stallTimerRef.current !== null) {
      window.clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
    if (bufferDelayTimerRef.current !== null) {
      window.clearTimeout(bufferDelayTimerRef.current);
      bufferDelayTimerRef.current = null;
    }
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const persistTime = useCallback(
    (timeVal: number) => {
      savedTimeRef.current = timeVal;
      if (!storageKey) return;
      try {
        if (timeVal > 0.5) {
          sessionStorage.setItem(storageKey, timeVal.toFixed(2));
        } else {
          sessionStorage.removeItem(storageKey);
        }
      } catch {
        // Ignore storage quota / privacy mode failures
      }
    },
    [storageKey]
  );

  const computeBufferedPercent = useCallback((video: HTMLVideoElement) => {
    const dur = video.duration;
    if (!Number.isFinite(dur) || dur <= 0 || video.buffered.length === 0) return 0;
    const cur = video.currentTime || 0;
    let bestEnd = 0;
    for (let i = 0; i < video.buffered.length; i++) {
      const start = video.buffered.start(i);
      const end = video.buffered.end(i);
      if (cur >= start - 0.5 && cur <= end + 0.5) {
        bestEnd = Math.max(bestEnd, end);
      } else if (end > bestEnd && start <= cur + 1) {
        bestEnd = end;
      }
    }
    if (bestEnd === 0) {
      bestEnd = video.buffered.end(video.buffered.length - 1);
    }
    return Math.min(100, Math.max(0, (bestEnd / dur) * 100));
  }, []);

  const recoverPlaybackAtSavedTime = useCallback(
    (reason: 'stall' | 'error' | 'reconnect') => {
      const video = videoRef.current;
      if (!video || !isMountedRef.current) return;

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        shouldResumeOnOnlineRef.current = true;
        setIsOffline(true);
        setIsBuffering(false);
        return;
      }

      const targetTime = savedTimeRef.current;
      if (targetTime > 0.5) {
        pendingSeekRef.current = targetTime;
      }

      if (reason === 'stall') {
        stallCountRef.current += 1;
        setRecoveryAttempt(stallCountRef.current);

        if (stallCountRef.current === 1) {
          // Soft recovery: nudge past micro-gap without full reload
          try {
            if (video.buffered.length > 0 && video.readyState >= 2) {
              video.currentTime = Math.min(
                Number.isFinite(video.duration) ? Math.max(0, video.duration - 0.25) : targetTime + 0.05,
                targetTime + 0.05
              );
              video.play().catch(() => {});
              return;
            }
          } catch {
            // Fall through to reload
          }
        }

        if (stallCountRef.current > MAX_STALL_RECOVERIES) {
          setIsBuffering(false);
          setIsPlaying(false);
          setErrorMessage('الاتصال بطيء جداً أو متقطع حالياً. اضغط على إعادة المحاولة لاستكمال التشغيل من نفس الموضع.');
          return;
        }

        // If we hit max soft stalls and have a fallback source, switch source
        if (stallCountRef.current === MAX_STALL_RECOVERIES && sourceIndexRef.current + 1 < safeSources.length) {
          const nextIdx = sourceIndexRef.current + 1;
          sourceIndexRef.current = nextIdx;
          setSourceIndex(nextIdx);
          return;
        }
      }

      // Reload current source and resume at saved time once metadata loads
      setErrorMessage(null);
      setIsBuffering(true);
      video.load();
      video.play().catch(() => {
        // Fallback to muted if browser requires gesture after reload
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
    },
    [safeSources.length, videoRef]
  );

  const scheduleStallWatchdog = useCallback(() => {
    if (stallTimerRef.current !== null) {
      window.clearTimeout(stallTimerRef.current);
    }
    const video = videoRef.current;
    if (!video || video.paused || video.ended) return;

    const baselineTime = video.currentTime;
    stallTimerRef.current = window.setTimeout(() => {
      const vid = videoRef.current;
      if (!vid || !isMountedRef.current || vid.paused || vid.ended) return;
      if (Math.abs(vid.currentTime - baselineTime) < 0.05) {
        recoverPlaybackAtSavedTime('stall');
      }
    }, STALL_TIMEOUT_MS);
  }, [recoverPlaybackAtSavedTime, videoRef]);

  // Attempt smart autoplay once on mount if requested
  const attemptInitialPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isMountedRef.current) return;

    setErrorMessage(null);
    setAutoplayBlockedCompletely(false);

    try {
      video.muted = false;
      setIsMuted(false);
      await video.play();
      if (isMountedRef.current) {
        setIsPlaying(true);
        setAutoplayBlockedAudio(false);
        setAutoplayBlockedCompletely(false);
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;
      if (err?.name === 'NotAllowedError') {
        try {
          video.muted = true;
          setIsMuted(true);
          await video.play();
          if (isMountedRef.current) {
            setIsPlaying(true);
            setAutoplayBlockedAudio(true);
            setAutoplayBlockedCompletely(false);
          }
        } catch {
          if (isMountedRef.current) {
            setIsPlaying(false);
            setAutoplayBlockedAudio(true);
            setAutoplayBlockedCompletely(true);
          }
        }
      } else if (err?.name !== 'AbortError') {
        setIsPlaying(false);
      }
    }
  }, [videoRef]);

  // Attach native HTML5 Video API event listeners + coordinate other players + online/offline recovery
  useEffect(() => {
    isMountedRef.current = true;
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      if (!isMountedRef.current) return;
      if (Number.isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
      setIsReady(true);
      setBufferedPercent(computeBufferedPercent(video));

      if (pendingSeekRef.current !== null && pendingSeekRef.current > 0.5) {
        const clamped =
          Number.isFinite(video.duration) && video.duration > 1
            ? Math.min(pendingSeekRef.current, Math.max(0, video.duration - 0.5))
            : pendingSeekRef.current;
        pendingSeekRef.current = null;
        try {
          video.currentTime = clamped;
          setCurrentTime(clamped);
        } catch {
          // Ignore invalid seek state
        }
      }
    };

    const onLoadedData = () => {
      if (!isMountedRef.current) return;
      setIsReady(true);
      setBufferedPercent(computeBufferedPercent(video));
    };

    const onCanPlay = () => {
      if (!isMountedRef.current) return;
      setIsReady(true);
      setIsBuffering(false);
      if (bufferDelayTimerRef.current !== null) {
        window.clearTimeout(bufferDelayTimerRef.current);
        bufferDelayTimerRef.current = null;
      }
    };

    const onCanPlayThrough = () => {
      if (!isMountedRef.current) return;
      setIsBuffering(false);
      setBufferedPercent(computeBufferedPercent(video));
    };

    const onProgress = () => {
      if (!isMountedRef.current) return;
      setBufferedPercent(computeBufferedPercent(video));
    };

    const onTimeUpdate = () => {
      if (!isMountedRef.current) return;
      const nowTime = video.currentTime || 0;
      setCurrentTime(nowTime);
      persistTime(nowTime);

      if (Math.abs(nowTime - lastProgressTimeRef.current) >= 0.25) {
        lastProgressTimeRef.current = nowTime;
        // Playback is genuinely advancing — reset stall counters & timers
        stallCountRef.current = 0;
        errorCountRef.current = 0;
        setRecoveryAttempt(0);
        setIsBuffering(false);
        setErrorMessage(null);
        if (stallTimerRef.current !== null) {
          window.clearTimeout(stallTimerRef.current);
          stallTimerRef.current = null;
        }
        if (bufferDelayTimerRef.current !== null) {
          window.clearTimeout(bufferDelayTimerRef.current);
          bufferDelayTimerRef.current = null;
        }
      }
      setBufferedPercent(computeBufferedPercent(video));
    };

    const onPlay = () => {
      if (!isMountedRef.current) return;
      setIsPlaying(true);
      setHasEnded(false);
      setErrorMessage(null);
      setAutoplayBlockedCompletely(false);
      shouldResumeOnOnlineRef.current = true;
      window.dispatchEvent(new CustomEvent('alnoor:video-active', { detail: { playerId } }));
    };

    const onPlaying = () => {
      if (!isMountedRef.current) return;
      setIsPlaying(true);
      setIsBuffering(false);
      setHasEnded(false);
      setErrorMessage(null);
      if (stallTimerRef.current !== null) {
        window.clearTimeout(stallTimerRef.current);
        stallTimerRef.current = null;
      }
      if (bufferDelayTimerRef.current !== null) {
        window.clearTimeout(bufferDelayTimerRef.current);
        bufferDelayTimerRef.current = null;
      }
    };

    const onPause = () => {
      if (!isMountedRef.current) return;
      setIsPlaying(false);
      setIsBuffering(false);
      if (stallTimerRef.current !== null) {
        window.clearTimeout(stallTimerRef.current);
        stallTimerRef.current = null;
      }
      if (bufferDelayTimerRef.current !== null) {
        window.clearTimeout(bufferDelayTimerRef.current);
        bufferDelayTimerRef.current = null;
      }
    };

    const onWaiting = () => {
      if (!isMountedRef.current || video.paused || video.ended) return;
      if (bufferDelayTimerRef.current !== null) {
        window.clearTimeout(bufferDelayTimerRef.current);
      }
      bufferDelayTimerRef.current = window.setTimeout(() => {
        if (isMountedRef.current && !video.paused && !video.ended) {
          setIsBuffering(true);
        }
      }, BUFFER_INDICATOR_DELAY_MS);
      scheduleStallWatchdog();
    };

    const onStalled = () => {
      if (!isMountedRef.current || video.paused || video.ended) return;
      setIsBuffering(true);
      scheduleStallWatchdog();
    };

    const onSeeking = () => {
      if (!isMountedRef.current) return;
      if (video.readyState < 3) {
        setIsBuffering(true);
      }
    };

    const onSeeked = () => {
      if (!isMountedRef.current) return;
      setIsBuffering(false);
      persistTime(video.currentTime || 0);
      setCurrentTime(video.currentTime || 0);
    };

    const onVolumeChange = () => {
      if (!isMountedRef.current) return;
      setIsMuted(video.muted || video.volume === 0);
      setVolume(video.volume);
      if (!video.muted && video.volume > 0) {
        setAutoplayBlockedAudio(false);
      }
    };

    const onEnded = () => {
      if (!isMountedRef.current) return;
      setIsPlaying(false);
      setIsBuffering(false);
      setHasEnded(true);
      shouldResumeOnOnlineRef.current = false;
      clearTimers();
      persistTime(0);
    };

    const onError = () => {
      if (!isMountedRef.current) return;
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        shouldResumeOnOnlineRef.current = true;
        setIsOffline(true);
        setIsBuffering(false);
        setIsPlaying(false);
        return;
      }

      errorCountRef.current += 1;
      setRecoveryAttempt(errorCountRef.current);

      if (errorCountRef.current <= MAX_ERROR_RETRIES) {
        // First retry: try fallback source if available, else reload current source cleanly
        if (sourceIndexRef.current + 1 < safeSources.length) {
          const nextIdx = sourceIndexRef.current + 1;
          sourceIndexRef.current = nextIdx;
          if (savedTimeRef.current > 0.5) {
            pendingSeekRef.current = savedTimeRef.current;
          }
          setSourceIndex(nextIdx);
          return;
        }

        const delay = errorCountRef.current * 800;
        if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = window.setTimeout(() => {
          recoverPlaybackAtSavedTime('error');
        }, delay);
        return;
      }

      setIsBuffering(false);
      setIsPlaying(false);
      setErrorMessage('تعذر تحميل الفيديو مؤقتاً بسبب الشبكة. اضغط على إعادة المحاولة لاستكمال المشاهدة.');
    };

    const handleOtherPlayerActive = (evt: Event) => {
      const customEvt = evt as CustomEvent<{ playerId?: string }>;
      if (customEvt.detail?.playerId && customEvt.detail.playerId !== playerId) {
        if (!video.paused) {
          video.pause();
        }
      }
    };

    const handleOffline = () => {
      if (!isMountedRef.current) return;
      setIsOffline(true);
      if (!video.paused) {
        shouldResumeOnOnlineRef.current = true;
        persistTime(video.currentTime || savedTimeRef.current);
      }
    };

    const handleOnline = () => {
      if (!isMountedRef.current) return;
      setIsOffline(false);
      stallCountRef.current = 0;
      errorCountRef.current = 0;
      setRecoveryAttempt(0);
      setErrorMessage(null);
      if (shouldResumeOnOnlineRef.current || isBuffering) {
        recoverPlaybackAtSavedTime('reconnect');
      }
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('canplaythrough', onCanPlayThrough);
    video.addEventListener('progress', onProgress);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('play', onPlay);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('stalled', onStalled);
    video.addEventListener('seeking', onSeeking);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);

    window.addEventListener('alnoor:video-active', handleOtherPlayerActive);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    if (autoPlay && !autoPlayTriggeredRef.current) {
      autoPlayTriggeredRef.current = true;
      attemptInitialPlay();
    }

    return () => {
      isMountedRef.current = false;
      clearTimers();
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('canplaythrough', onCanPlayThrough);
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('stalled', onStalled);
      video.removeEventListener('seeking', onSeeking);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onError);
      window.removeEventListener('alnoor:video-active', handleOtherPlayerActive);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      video.pause();
    };
    // Intentionally attach once per mounted player instance; sourceIndex switching triggers native reload below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId]);

  // Reload cleanly when switching fallback source after an error/stall
  useEffect(() => {
    const video = videoRef.current;
    if (!video || sourceIndex === 0) return;
    if (savedTimeRef.current > 0.5) {
      pendingSeekRef.current = savedTimeRef.current;
    }
    video.load();
    video.play().catch(() => {
      video.muted = true;
      setIsMuted(true);
      video.play().catch(() => {});
    });
  }, [sourceIndex, videoRef]);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    setErrorMessage(null);
    if (video.paused || video.ended) {
      if (video.ended) {
        video.currentTime = 0;
        setCurrentTime(0);
        setHasEnded(false);
        persistTime(0);
      }
      try {
        await video.play();
        setIsPlaying(true);
        setAutoplayBlockedCompletely(false);
      } catch {
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
          setIsPlaying(true);
          setAutoplayBlockedAudio(true);
          setAutoplayBlockedCompletely(false);
        } catch {
          setIsPlaying(false);
        }
      }
    } else {
      shouldResumeOnOnlineRef.current = false;
      video.pause();
      setIsPlaying(false);
    }
  }, [persistTime, videoRef]);

  const replayFromStart = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    clearTimers();
    stallCountRef.current = 0;
    errorCountRef.current = 0;
    setRecoveryAttempt(0);
    setErrorMessage(null);
    setHasEnded(false);
    persistTime(0);
    video.currentTime = 0;
    setCurrentTime(0);
    try {
      video.muted = false;
      setIsMuted(false);
      await video.play();
      setIsPlaying(true);
      setAutoplayBlockedAudio(false);
    } catch {
      video.muted = true;
      setIsMuted(true);
      setAutoplayBlockedAudio(true);
      video.play().catch(() => {});
    }
  }, [clearTimers, persistTime, videoRef]);

  const seekTo = useCallback(
    (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      const maxDur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : duration;
      const clamped = Math.max(0, maxDur > 0 ? Math.min(seconds, maxDur) : seconds);
      try {
        video.currentTime = clamped;
        setCurrentTime(clamped);
        persistTime(clamped);
        if (hasEnded && clamped < maxDur - 0.5) {
          setHasEnded(false);
        }
      } catch {
        // Ignore if not seekable yet
      }
    },
    [duration, hasEnded, persistTime, videoRef]
  );

  const skipBy = useCallback(
    (deltaSeconds: number) => {
      const video = videoRef.current;
      const base = video ? video.currentTime : currentTime;
      seekTo(base + deltaSeconds);
    },
    [currentTime, seekTo, videoRef]
  );

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    if (!nextMuted && video.volume === 0) {
      video.volume = 1;
      setVolume(1);
    }
    setIsMuted(nextMuted);
    if (!nextMuted) {
      setAutoplayBlockedAudio(false);
      if (video.paused) {
        video.play().catch(() => {});
      }
    }
  }, [videoRef]);

  const enableSoundNow = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    if (video.volume === 0) {
      video.volume = 1;
      setVolume(1);
    }
    setIsMuted(false);
    setAutoplayBlockedAudio(false);
    if (video.paused) {
      video.play().catch(() => {});
    }
  }, [videoRef]);

  const setVolumeLevel = useCallback(
    (val: number) => {
      const video = videoRef.current;
      if (!video) return;
      const clamped = Math.max(0, Math.min(1, val));
      video.volume = clamped;
      video.muted = clamped === 0;
      setVolume(clamped);
      setIsMuted(clamped === 0);
      if (clamped > 0) setAutoplayBlockedAudio(false);
    },
    [videoRef]
  );

  const toggleFullscreen = useCallback(
    async (containerEl?: HTMLElement | null) => {
      const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
      const target = containerEl || video;
      if (!target) return;
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else if (target.requestFullscreen) {
          await target.requestFullscreen();
        } else if (video?.webkitEnterFullscreen) {
          // iOS Safari native fullscreen fallback
          video.webkitEnterFullscreen();
        }
      } catch {
        if (video?.webkitEnterFullscreen) {
          try {
            video.webkitEnterFullscreen();
          } catch {
            // Ignore unsupported fullscreen environments
          }
        }
      }
    },
    [videoRef]
  );

  const retry = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    clearTimers();
    stallCountRef.current = 0;
    errorCountRef.current = 0;
    setRecoveryAttempt(0);
    setErrorMessage(null);
    setIsBuffering(true);
    if (savedTimeRef.current > 0.5) {
      pendingSeekRef.current = savedTimeRef.current;
    }
    video.load();
    video.muted = false;
    setIsMuted(false);
    video.play().catch(() => {
      video.muted = true;
      setIsMuted(true);
      setAutoplayBlockedAudio(true);
      video.play().catch(() => {});
    });
  }, [clearTimers, videoRef]);

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return {
    state: {
      currentSrc: safeSources[sourceIndex] || safeSources[0],
      sourceIndex,
      isReady,
      isPlaying,
      isBuffering,
      isMuted,
      volume,
      currentTime,
      duration,
      bufferedPercent,
      progressPercent,
      hasEnded,
      autoplayBlockedAudio,
      autoplayBlockedCompletely,
      isOffline,
      errorMessage,
      recoveryAttempt,
    } satisfies ResilientVideoState,
    actions: {
      togglePlay,
      replayFromStart,
      seekTo,
      skipBy,
      toggleMute,
      enableSoundNow,
      setVolumeLevel,
      toggleFullscreen,
      retry,
    },
  };
}
