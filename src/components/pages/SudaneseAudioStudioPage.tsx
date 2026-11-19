import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles,
  Copy, Check, Radio, Award, Sliders, Waves,
  Headphones, Download, Disc, Flame, ArrowLeft,
  BookmarkCheck, Send, Wand2, Loader2
} from 'lucide-react';
import { SUDANESE_VOICE_ADS } from '../../data/sudaneseVoiceAds';
import { SudaneseVoiceAd, NavigationPage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface SudaneseAudioStudioPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const SudaneseAudioStudioPage: React.FC<SudaneseAudioStudioPageProps> = ({ onNavigate }) => {
  const { isRtl } = useLanguage();
  const { showToast } = useToast();

  const [adsList, setAdsList] = useState<SudaneseVoiceAd[]>(SUDANESE_VOICE_ADS);
  const [selectedAd, setSelectedAd] = useState<SudaneseVoiceAd>(SUDANESE_VOICE_ADS[0]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(SUDANESE_VOICE_ADS[0].durationSeconds);

  const [isAiGeneratingVoice, setIsAiGeneratingVoice] = useState(false);
  const [aiGeneratedAudioUrl, setAiGeneratedAudioUrl] = useState<string | null>(null);
  const aiAudioElementRef = useRef<HTMLAudioElement | null>(null);

  const [customTopic, setCustomTopic] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptGenSuccess, setScriptGenSuccess] = useState(false);

  const [rate, setRate] = useState<number>(selectedAd.rate);
  const [pitch, setPitch] = useState<number>(selectedAd.pitch);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [enableStudioAmbience, setEnableStudioAmbience] = useState(true);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientGainNodeRef = useRef<GainNode | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);

        const arabicMale = voices.find(v =>
          v.lang.startsWith('ar') && (
            v.name.toLowerCase().includes('male') ||
            v.name.toLowerCase().includes('maged') ||
            v.name.toLowerCase().includes('tarik') ||
            v.name.toLowerCase().includes('naayf') ||
            v.name.toLowerCase().includes('saudi') ||
            v.name.toLowerCase().includes('sudan')
          )
        ) || voices.find(v => v.lang.startsWith('ar')) || voices[0];

        if (arabicMale) {
          setSelectedVoiceName(arabicMale.name);
        }
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    stopPlayback();
    setRate(selectedAd.rate);
    setPitch(selectedAd.pitch);
    setDuration(selectedAd.durationSeconds);
    setCurrentTime(0);
    setPlaybackProgress(0);
    setCurrentPhraseIndex(0);
    setAiGeneratedAudioUrl(null);
  }, [selectedAd]);

  const playStudioJingle = (audioCtx: AudioContext) => {
    try {
      const now = audioCtx.currentTime;
      const freqs = [440, 554.37, 659.25];
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.06, now + idx * 0.08 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });
    } catch (e) {
      console.warn('Jingle synthesis note:', e);
    }
  };

  const startStudioAmbience = () => {
    if (!enableStudioAmbience) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      playStudioJingle(ctx);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(98, ctx.currentTime);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(146.8, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 1.2);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      ambientGainNodeRef.current = gain;

      setTimeout(() => {
        try {
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
          setTimeout(() => {
            osc1.stop();
            osc2.stop();
          }, 1000);
        } catch (_) {}
      }, selectedAd.durationSeconds * 1000);
    } catch (e) {
      console.warn('Web Audio ambient sound:', e);
    }
  };

  const stopStudioAmbience = () => {
    if (audioCtxRef.current && ambientGainNodeRef.current) {
      try {
        ambientGainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.3);
      } catch (_) {}
    }
  };

  const handleGenerateAiVoice = async () => {
    stopPlayback();
    setIsAiGeneratingVoice(true);
    try {
      const response = await fetch('/api/v1/ai/sudanese-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedAd.scriptSudanese,
          voiceName: 'Fenrir',
        }),
      });

      if (!response.ok) {
        throw new Error('فشل توليد الصوت بالذكاء الاصطناعي');
      }

      const json = await response.json();
      const base64Data = json.data?.audioBase64 || json.audioBase64;
      if (base64Data) {
        const audioUrl = `data:audio/wav;base64,${base64Data}`;
        setAiGeneratedAudioUrl(audioUrl);

        if (aiAudioElementRef.current) {
          aiAudioElementRef.current.src = audioUrl;
          aiAudioElementRef.current.play();
          setIsPlaying(true);
          setIsPaused(false);
        }
      } else {
        throw new Error('لم يتم استلام ملف الصوت');
      }
    } catch (err) {
      console.warn('AI TTS failed, falling back to Web Speech engine:', err);
      handlePlayVoiceAd();
    } finally {
      setIsAiGeneratingVoice(false);
    }
  };

  const handlePlayVoiceAd = () => {
    if (aiGeneratedAudioUrl && aiAudioElementRef.current) {
      if (isPaused) {
        aiAudioElementRef.current.play();
        setIsPaused(false);
        setIsPlaying(true);
      } else if (isPlaying) {
        aiAudioElementRef.current.pause();
        setIsPaused(true);
        setIsPlaying(false);
      } else {
        aiAudioElementRef.current.currentTime = 0;
        aiAudioElementRef.current.play();
        setIsPlaying(true);
        setIsPaused(false);
      }
      return;
    }

    if (!('speechSynthesis' in window)) {
      showToast('متصفحك لا يدعم محرك تخليق الصوت Web Speech Synthesis', 'warning');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    stopStudioAmbience();

    const utterance = new SpeechSynthesisUtterance(selectedAd.scriptSudanese);

    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    let voiceToUse: SpeechSynthesisVoice | undefined;

    if (selectedVoiceName) {
      voiceToUse = voices.find(v => v.name === selectedVoiceName);
    }

    if (!voiceToUse) {
      voiceToUse = voices.find(v =>
        v.lang.startsWith('ar') && (
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('maged') ||
          v.name.toLowerCase().includes('tarik') ||
          v.name.toLowerCase().includes('naayf') ||
          v.name.toLowerCase().includes('saudi') ||
          v.name.toLowerCase().includes('sudan')
        )
      ) || voices.find(v => v.lang.startsWith('ar')) || voices[0];
    }

    if (voiceToUse) {
      utterance.voice = voiceToUse;
      utterance.lang = voiceToUse.lang || 'ar-SA';
    } else {
      utterance.lang = 'ar-SA';
    }

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = isMuted ? 0 : volume;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      startStudioAmbience();

      const stepMs = 250;
      let elapsed = 0;
      const totalEstimatedMs = (selectedAd.durationSeconds / rate) * 1000;

      if (progressTimerRef.current) clearInterval(progressTimerRef.current);

      progressTimerRef.current = setInterval(() => {
        elapsed += stepMs;
        const currentSec = Math.min(selectedAd.durationSeconds, Math.floor(elapsed / 1000));
        setCurrentTime(currentSec);
        setPlaybackProgress(Math.min(100, (elapsed / totalEstimatedMs) * 100));

        const phraseCount = selectedAd.keyPhrases.length;
        const phraseDuration = totalEstimatedMs / (phraseCount || 1);
        const curIdx = Math.min(phraseCount - 1, Math.floor(elapsed / phraseDuration));
        setCurrentPhraseIndex(curIdx);

        if (elapsed >= totalEstimatedMs) {
          if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        }
      }, stepMs);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      stopStudioAmbience();
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setPlaybackProgress(100);
      setTimeout(() => {
        setPlaybackProgress(0);
        setCurrentTime(0);
      }, 1500);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis state:', e);
      setIsPlaying(false);
      setIsPaused(false);
      stopStudioAmbience();
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (aiAudioElementRef.current && aiGeneratedAudioUrl) {
      aiAudioElementRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      stopStudioAmbience();
    }
  };

  const stopPlayback = () => {
    if (aiAudioElementRef.current) {
      aiAudioElementRef.current.pause();
      aiAudioElementRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    stopStudioAmbience();
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setPlaybackProgress(0);
    setCurrentTime(0);
  };

  const handleGenerateCustomScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    setIsGeneratingScript(true);
    setScriptGenSuccess(false);

    try {
      const response = await fetch('/api/v1/ai/sudanese-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customTopic.trim(),
          targetAudience: 'الشباب والأسر وعامة المسلمين',
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const scriptData = json.data || json;
        const newAd: SudaneseVoiceAd = {
          id: `custom-${Date.now()}`,
          titleAr: `إعلان خاص: ${customTopic.trim()}`,
          titleEn: `Custom Ad: ${customTopic.trim()}`,
          category: 'general',
          durationSeconds: 45,
          pitch: 0.85,
          rate: 1.12,
          tone: 'صوت رجل سوداني جهوري حماسي، مليء بالنخوة والحرارة والشهامة',
          scriptSudanese: scriptData.script || 'يا هلا والله وحبابكم في مجمع النور الإسلامي العالمي!',
          scriptFormalSummary: `إعلان خاص تم توليده بالذكاء الاصطناعي حول: ${customTopic.trim()}`,
          keyPhrases: [
            'يا هلا والله وحبابكم عشرة!',
            'صحي النوم وشد حيلك.. مجمع النور بيناديك!',
            'أبشروا بالخير يا أهل المروءة والشهامة!',
            'نورٌ يهدي.. وعلمٌ يبني!',
          ],
        };

        setAdsList(prev => [newAd, ...prev]);
        setSelectedAd(newAd);
        setCustomTopic('');
        setScriptGenSuccess(true);
        setTimeout(() => setScriptGenSuccess(false), 3000);
      } else {
        const errBody = await response.json().catch(() => ({}));
        showToast(errBody?.error?.message || 'تعذر توليد النص الإعلاني حالياً، يرجى المحاولة بعد قليل.', 'error');
      }
    } catch (err) {
      console.error('Failed to generate script:', err);
      showToast('حدث خطأ في الاتصال بالخادم أثناء توليد النص الإعلاني.', 'error');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const applyPreset = (presetType: 'hyper' | 'warm' | 'reverent') => {
    stopPlayback();
    if (presetType === 'hyper') {
      setRate(1.12);
      setPitch(0.85);
    } else if (presetType === 'warm') {
      setRate(1.02);
      setPitch(0.92);
    } else {
      setRate(0.95);
      setPitch(0.80);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(selectedAd.scriptSudanese);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadScript = () => {
    const content = `==========================================================\nمجمع النور الإسلامي العالمي - نص الإعلان الحماسي بالعامية السودانية\nالعنوان: ${selectedAd.titleAr}\nطبيعة الصوت: ${selectedAd.tone}\nالمدة التقديرية: ${selectedAd.durationSeconds} ثانية\nالدومين الرسمي: www.mojamaalnor.com\n==========================================================\n\nنص الإعلان:\n${selectedAd.scriptSudanese}\n\n==========================================================\nالعبارات المفتاحية:\n${selectedAd.keyPhrases.join('\n')}\n==========================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AlNoor-Sudanese-Ad-${selectedAd.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🎙️ *صوت إعلاني حماسي لمجمع النور بالعامية السودانية (صوت رجل جهوري):*\n\n"${selectedAd.scriptSudanese}"\n\n🌐 *الدومين المعتمد:* https://www.mojamaalnor.com`
  )}`;

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(audioUrl);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingSeconds(0);

        const recTimer = setInterval(() => {
          setRecordingSeconds((prev) => {
            if (prev >= 60) {
              clearInterval(recTimer);
              toggleRecording();
              return 60;
            }
            return prev + 1;
          });
        }, 1000);
      } catch {
        showToast('تعذر الوصول للميكروفون، يرجى السماح بصلاحية التسجيل في المتصفح.', 'warning');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16" dir={isRtl ? 'rtl' : 'ltr'}>

      <audio
        ref={aiAudioElementRef}
        onTimeUpdate={() => {
          if (aiAudioElementRef.current) {
            const current = aiAudioElementRef.current.currentTime;
            const dur = aiAudioElementRef.current.duration || selectedAd.durationSeconds;
            setCurrentTime(Math.floor(current));
            setPlaybackProgress((current / dur) * 100);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setIsPaused(false);
          setPlaybackProgress(100);
          setTimeout(() => {
            setPlaybackProgress(0);
            setCurrentTime(0);
          }, 1000);
        }}
      />

      {/* Sky-Blue 3D Studio Header */}
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-10 shadow-xl border border-[#87CEEB]/55 bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] text-white">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs font-bold text-[#F7E7B4] flex items-center gap-2 flex-wrap">
              <Flame className="w-3.5 h-3.5 text-[#F7E7B4]" />
              <span>استوديو الصوت الإعلاني الحماسي · Sudanese Male Voice Studio</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#5EEAD4]">صوت رجالي جهوري فخم</span>
            </p>

            <h1 className="text-2xl sm:text-4xl font-black text-white font-amiri leading-tight">
              صوت إعلاني حماسي جهوري بالعامية السودانية
            </h1>

            <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed">
              إعلان تجاري وإذاعي متدفق بالطاقة والحيوية والنخوة السودانية، يحث القلوب على حفظ كتاب الله، التسجيل في مقارئ مجمع النور العالمية، وكفالة الأيتام وحلقات العلم. يمكنك الاستماع فوراً بصوت رجل سوداني جهوري بنقاء استوديوهات الإذاعة، أو توليد الصوت بالذكاء الاصطناعي وتنزيل السيناريو.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Sky3DIcon slug="audioStudio" tone="gold" size="lg" />
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              <span>العودة للرئيسية</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('radio')}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer whitespace-nowrap"
            >
              <Radio className="w-4 h-4" />
              <span>إذاعة مكة 24/7</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Broadcast Console & Sound Deck */}
      <section className="sky-card-3d rounded-3xl p-6 sm:p-10 space-y-8 border-[#D4AF37]/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#87CEEB]/35 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#5EEAD4] flex items-center gap-1.5">
              <Headphones className="w-4 h-4" />
              <span>منصة التوليد الصوتي الإذاعي المباشر · Live Sudanese Voice Deck</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white font-amiri">
              {selectedAd.titleAr}
            </h2>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
              {selectedAd.scriptFormalSummary}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleGenerateAiVoice}
              disabled={isAiGeneratingVoice}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-60"
            >
              {isAiGeneratingVoice ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري توليد الصوت...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>توليد بالذكاء الاصطناعي (TTS)</span>
                </>
              )}
            </button>

            {aiGeneratedAudioUrl && (
              <a
                href={aiGeneratedAudioUrl}
                download={`AlNoor-Sudanese-Ad-${selectedAd.id}.wav`}
                className="px-3.5 py-2.5 rounded-xl bg-[#0EA5A4] hover:bg-[#0D7A7A] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الصوت (WAV)</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleCopyScript}
              className="px-3.5 py-2.5 rounded-xl sky-glass-panel text-[#12345A] dark:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#0EA5A4]" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadScript}
              className="px-3.5 py-2.5 rounded-xl sky-glass-panel text-[#12345A] dark:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#0EA5A4]" />
              <span>تنزيل TXT</span>
            </button>

            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>مشاركة واتساب</span>
            </a>
          </div>
        </div>

        {/* Quick Voice Mode Presets */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-[#EAF8FF] dark:bg-[#0A223D] rounded-2xl border border-[#87CEEB]/50">
          <span className="text-xs font-bold text-[#12345A] dark:text-white flex items-center gap-1.5 ml-2">
            <Sliders className="w-3.5 h-3.5 text-[#0EA5A4]" />
            <span>نبرة صوت الرجل السوداني:</span>
          </span>
          <button
            type="button"
            onClick={() => applyPreset('hyper')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pitch <= 0.88 && rate >= 1.08
                ? 'bg-[#12345A] text-[#F7E7B4] shadow-sm font-black'
                : 'bg-white/80 dark:bg-[#12345A]/40 text-[#2B547E] dark:text-[#B8DEF5]'
            }`}
          >
            حماسي جهوري قوي (موصى به)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('warm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pitch > 0.88 && pitch < 0.96
                ? 'bg-[#12345A] text-[#F7E7B4] shadow-sm font-black'
                : 'bg-white/80 dark:bg-[#12345A]/40 text-[#2B547E] dark:text-[#B8DEF5]'
            }`}
          >
            شهم حار وودود
          </button>
          <button
            type="button"
            onClick={() => applyPreset('reverent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pitch <= 0.82 && rate < 1.0
                ? 'bg-[#12345A] text-[#F7E7B4] shadow-sm font-black'
                : 'bg-white/80 dark:bg-[#12345A]/40 text-[#2B547E] dark:text-[#B8DEF5]'
            }`}
          >
            وقور متأنٍ ورزين
          </button>
        </div>

        {/* Voiceover Master Play Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <button
                  type="button"
                  onClick={isPlaying ? handlePause : handlePlayVoiceAd}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex flex-col items-center justify-center font-black transition-all shadow-xl cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-gradient-to-tr from-[#D4AF37] to-[#F7E7B4] text-[#12345A] hover:scale-105'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-9 h-9 fill-current" />
                      <span className="text-[11px] mt-1 font-bold">إيقاف مؤقت</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-9 h-9 fill-current translate-x-1" />
                      <span className="text-[11px] mt-1 font-bold">تشغيل الإعلان</span>
                    </>
                  )}
                </button>
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full animate-ping" />
                )}
              </div>

              <div className="space-y-3 flex-1 w-full">
                <div className="flex items-center justify-between text-xs tabular-nums">
                  <span className="font-mono text-[#12345A] dark:text-[#F7E7B4] font-black text-sm">
                    {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-[#2B547E] dark:text-[#B8DEF5] font-medium">
                    المدة التقديرية: ~{duration} ثانية
                  </span>
                </div>

                <div className="w-full h-3.5 bg-[#EAF8FF] dark:bg-[#0A223D] rounded-full overflow-hidden border border-[#87CEEB]/50 relative">
                  <div
                    className="h-full bg-gradient-to-r from-[#0EA5A4] via-[#12345A] to-[#D4AF37] transition-all duration-300 rounded-full"
                    style={{ width: `${playbackProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={stopPlayback}
                    className="text-xs text-[#2B547E] dark:text-[#B8DEF5] hover:text-[#12345A] flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة من البداية</span>
                  </button>

                  <div className="flex items-center gap-3">
                    {aiGeneratedAudioUrl && (
                      <span className="text-[11px] font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">
                        صوت الذكاء الاصطناعي جاهز ✓
                      </span>
                    )}

                    <label className="text-[11px] text-[#2B547E] dark:text-[#B8DEF5] flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableStudioAmbience}
                        onChange={(e) => setEnableStudioAmbience(e.target.checked)}
                        className="rounded accent-[#0EA5A4]"
                      />
                      <span className="font-medium">شارة البداية ومؤثر الاستوديو</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Live 36-Band Graphic Sound Equalizer */}
            <div className="bg-[#0A223D] rounded-2xl p-4 border border-[#87CEEB]/35 space-y-2 text-white">
              <div className="flex items-center justify-between text-[11px] text-[#B8DEF5]">
                <span className="flex items-center gap-1.5 text-[#F7E7B4] font-bold">
                  <Waves className="w-3.5 h-3.5" />
                  <span>مؤشر الترددات الصوتية (Sudanese Male Announcer EQ)</span>
                </span>
                <span className="font-mono text-xs font-bold text-[#5EEAD4]">
                  {isPlaying ? 'بث صوتي نشط · On Air' : 'وضع الاستعداد · Ready'}
                </span>
              </div>
              <div className="flex items-end gap-1 h-14 w-full">
                {[
                  40, 75, 90, 60, 95, 80, 65, 92, 98, 70, 50, 85, 92, 96, 65, 78,
                  84, 100, 90, 72, 58, 80, 92, 98, 62, 74, 88, 92, 96, 70, 55, 85,
                  90, 65, 80, 50,
                ].map((val, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t-sm transition-all duration-200 ${
                      isPlaying
                        ? 'bg-gradient-to-t from-[#0EA5A4] via-[#87CEEB] to-[#F7E7B4]'
                        : 'bg-[#12345A]'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(12, (val * ((idx % 3) + 1.2)) % 100)}%` : '12%',
                      opacity: isPlaying ? 0.95 : 0.4,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Announcer Voice Fine-Tuning Controls */}
          <div className="bg-[#EAF8FF]/85 dark:bg-[#0A223D] border border-[#87CEEB]/50 rounded-2xl p-5 space-y-4 shadow-sm tabular-nums">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-[#12345A] dark:text-[#F7E7B4] flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#0EA5A4]" />
                <span>معايرة صوت المذيع</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="text-xs text-[#2B547E] dark:text-[#87CEEB] hover:text-[#12345A] cursor-pointer"
                aria-label="كتم الصوت"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-[#0EA5A4]" />}
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#12345A] dark:text-white font-bold">
                <span>سرعة الإلقاء الحماسي</span>
                <span className="font-mono text-[#0D7A7A] dark:text-[#F7E7B4]">{rate}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-[#0EA5A4] cursor-pointer h-1.5 bg-[#D8F1FD] dark:bg-[#12345A] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#4A7298] dark:text-[#87CEEB]">
                <span>متأنٍ (0.8x)</span>
                <span>طبيعي</span>
                <span>حماسي (1.3x)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#12345A] dark:text-white font-bold">
                <span>طبقة الصوت الجهوري (Pitch)</span>
                <span className="font-mono text-[#0D7A7A] dark:text-[#F7E7B4]">{pitch}</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.25"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-[#0EA5A4] cursor-pointer h-1.5 bg-[#D8F1FD] dark:bg-[#12345A] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#4A7298] dark:text-[#87CEEB]">
                <span>جهوري (0.75)</span>
                <span>متوسط</span>
                <span>شبابي (1.25)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#12345A] dark:text-white font-bold">
                <span>مستوى الصوت الرئيسي</span>
                <span className="font-mono text-[#0D7A7A] dark:text-[#F7E7B4]">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
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
                className="w-full accent-[#0EA5A4] cursor-pointer h-1.5 bg-[#D8F1FD] dark:bg-[#12345A] rounded-lg"
              />
            </div>

            <div className="p-3 bg-white/80 dark:bg-[#12345A]/50 rounded-xl border border-[#87CEEB]/40 text-[11px] text-[#2B547E] dark:text-[#B8DEF5] space-y-1">
              <span className="text-[#12345A] dark:text-[#F7E7B4] font-bold block">مواصفات نبرة الصوت:</span>
              <p className="leading-relaxed">{selectedAd.tone}</p>
            </div>
          </div>
        </div>

        {/* Teleprompter Script Card */}
        <div className="space-y-3 pt-4 border-t border-[#87CEEB]/35">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-[#12345A] dark:text-white flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4 text-[#0EA5A4]" />
              <span>النص الكامل للإعلان بالعامية السودانية (Teleprompter Script):</span>
            </span>
            <span className="text-[11px] text-[#0D7A7A] dark:text-[#5EEAD4] font-bold">
              جاهز للإلقاء الإذاعي والإعلانات الترويجية
            </span>
          </div>

          <div className="scholarly-reading-paper p-6 sm:p-8 rounded-2xl font-amiri text-lg sm:text-2xl leading-loose shadow-inner">
            <div className="whitespace-pre-line">{selectedAd.scriptSudanese}</div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-bold block">
              العبارات الحماسية المفتاحية في هذا الإعلان:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedAd.keyPhrases.map((phrase, pIdx) => {
                const isCurrentPhrase = isPlaying && currentPhraseIndex === pIdx;
                return (
                  <span
                    key={pIdx}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isCurrentPhrase
                        ? 'bg-[#D4AF37] text-[#12345A] border-[#F7E7B4] shadow-sm'
                        : 'bg-[#EAF8FF] dark:bg-[#0A223D] text-[#12345A] dark:text-[#EAF8FF] border-[#87CEEB]/45'
                    }`}
                  >
                    ★ {phrase}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Selection Bar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between tabular-nums">
          <h2 className="text-sm sm:text-base font-black text-[#12345A] dark:text-white flex items-center gap-2">
            <Disc className="w-4 h-4 text-[#0EA5A4]" />
            <span>اختر من السيناريوهات الإعلانية السودانية المعتمدة:</span>
          </h2>
          <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-bold">
            {adsList.length} سيناريوهات جاهزة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adsList.map((ad, idx) => {
            const isSelected = selectedAd.id === ad.id;
            return (
              <button
                key={ad.id}
                type="button"
                onClick={() => setSelectedAd(ad)}
                className={`sky-card-3d p-5 rounded-2xl text-start flex flex-col justify-between gap-3 cursor-pointer ${
                  isSelected ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40' : ''
                }`}
              >
                <div className="flex items-center justify-between text-[11px] tabular-nums">
                  <span className={`font-black ${isSelected ? 'text-[#9A7418] dark:text-[#F7E7B4]' : 'text-[#0D7A7A] dark:text-[#5EEAD4]'}`}>
                    {idx === 0 ? '★ الإعلان المختار' : `سيناريو 0${idx + 1}`}
                  </span>
                  <span className="font-mono text-[#4A7298] dark:text-[#87CEEB] font-bold">
                    ~{ad.durationSeconds} ثانية
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#12345A] dark:text-white line-clamp-2 leading-relaxed font-amiri">
                    {ad.titleAr}
                  </h3>
                  <p className="text-[11px] text-[#2B547E] dark:text-[#B8DEF5] mt-1 line-clamp-2">
                    {ad.tone}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#87CEEB]/30 flex items-center justify-between text-[11px]">
                  <span className={`font-bold ${isSelected ? 'text-[#12345A] dark:text-[#F7E7B4]' : 'text-[#4A7298] dark:text-[#87CEEB]'}`}>
                    {isSelected ? 'الإعلان الحالي في الاستوديو' : 'اختر للإطلاق والتسميع'}
                  </span>
                  {isSelected && isPlaying && (
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Dynamic AI Sudanese Ad Generator */}
      <section className="sky-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#87CEEB]/35 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#5EEAD4] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>مولد السيناريوهات الإعلانية الذكي · AI Sudanese Copywriter</span>
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#12345A] dark:text-white font-amiri">
              اكتب موضوعك وولّد إعلاناً حماسياً بالعامية السودانية فوراً
            </h3>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
              حدد فكرة حملتك الدعوية أو الخيرية، وسيقوم الذكاء الاصطناعي بكتابة نص سوداني حماسي جاهز للإلقاء الصوتي.
            </p>
          </div>

          {scriptGenSuccess && (
            <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#5EEAD4] flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>تم توليد الإعلان وإدراجه بنجاح!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleGenerateCustomScript} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="مثال: إعلان لحث الأهالي على تسجيل أطفالهم في حلقة حفظ القرآن قبل شهر رمضان..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 text-[#12345A] dark:text-white placeholder-[#4A7298] text-xs sm:text-sm focus:outline-none focus:border-[#0EA5A4]"
            />
            <button
              type="submit"
              disabled={isGeneratingScript || !customTopic.trim()}
              className="px-6 py-3 rounded-2xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isGeneratingScript ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الصياغة الحماسية...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-[#F7E7B4]" />
                  <span>توليد الإعلان الحماسي</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[11px] font-bold text-[#12345A] dark:text-[#F7E7B4]">أفكار سريعة:</span>
            {[
              'كفالة الأيتام والرعاية الشاملة ببنك الخرطوم',
              'التسجيل في مقرأة مجمع النور والحفظ عن بعد',
              'إجازة القراءات العشر المسندة إلى النبي ﷺ',
              'بث إذاعة القرآن الكريم مباشرة من مكة',
              'السهم الوقفي والصدقة الجارية لطباعة المصاحف',
            ].map((chip, cIdx) => (
              <button
                key={cIdx}
                type="button"
                onClick={() => setCustomTopic(chip)}
                className="px-2.5 py-1 rounded-lg bg-[#EAF8FF] dark:bg-[#0A223D] hover:bg-[#87CEEB]/30 text-[#12345A] dark:text-[#EAF8FF] border border-[#87CEEB]/45 text-[11px] transition-colors cursor-pointer"
              >
                + {chip}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* Recording Studio */}
      <section className="sky-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#87CEEB]/35 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#5EEAD4] flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-rose-500" />
              <span>استوديو تسجيل صوتك الشخصي · Voiceover Recording Booth</span>
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#12345A] dark:text-white font-amiri">
              سجّل إعلانك بصوتك الخاص بالعامية السودانية
            </h3>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
              يمكنك قراءة النص أعلاه وتسجيله بميكروفون جهازك لاختباره وسماعه فوراً، أو تنزيل ملف الصوت للمونتاج والإعلانات.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleRecording}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0 ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-[#12345A] hover:bg-[#0EA5A4] text-white'
            }`}
          >
            <Mic className="w-4 h-4 text-[#F7E7B4]" />
            <span className="tabular-nums">
              {isRecording ? `جاري التسجيل (${recordingSeconds} ث) - انقر للإيقاف` : 'ابدأ التسجيل بالمايكروفون'}
            </span>
          </button>
        </div>

        {recordedAudioUrl && (
          <div className="bg-[#EAF8FF] dark:bg-[#0A223D] p-4 rounded-2xl border border-[#87CEEB]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0EA5A4] text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="text-xs font-bold text-[#12345A] dark:text-white block">تم تسجيل المقطع بنجاح!</span>
                <span className="text-[11px] text-[#2B547E] dark:text-[#B8DEF5]">استمع للتسجيل أو قم بتنزيله بصيغة WebM</span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <audio src={recordedAudioUrl} controls className="h-10 accent-[#0EA5A4]" />
              <a
                href={recordedAudioUrl}
                download="alnoor-sudanese-voice-ad.webm"
                className="px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#F7E7B4]" />
                <span>تنزيل الصوت</span>
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Distribution Channels */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Radio,
            title: 'البث الإذاعي المحلي',
            desc: 'مناسب للبث الصوتي في الإذاعات السودانية المحلية، وبرامج الصباح الروحية والمساجد والمراكز الإسلامية.',
          },
          {
            icon: Send,
            title: 'حملات واتساب وتليجرام',
            desc: 'نص مخصص للانتشار السريع كرسالة صوتية (Voice Note) في مجموعات الأسر والمغتربين السودانيين ورواد المساجد.',
          },
          {
            icon: Award,
            title: 'فيديوهات وسائل التواصل',
            desc: 'يمكن استخدام الصوت كتعليق صوتي (Voiceover) لمقاطع تيك توك، فيسبوك ريلز، وانستغرام لحملات كفالة الأيتام والقرآن.',
          },
        ].map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="sky-card-3d p-5 rounded-2xl space-y-2">
              <div className="text-[#12345A] dark:text-[#F7E7B4] font-bold text-xs flex items-center gap-1.5">
                <IconComp className="w-4 h-4 text-[#0EA5A4]" />
                <span>{item.title}</span>
              </div>
              <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* Admin-managed Dynamic Section Items */}
      <SectionDynamicItems sectionSlug="audioStudio" />
    </div>
  );
};
