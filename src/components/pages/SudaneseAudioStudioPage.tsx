import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, 
  Share2, Copy, Check, Radio, Award, Sliders, Waves, 
  Headphones, Download, Disc, Flame, AlertCircle, ArrowLeft,
  ChevronRight, BookmarkCheck, Heart, Send, BellRing, Wand2, Loader2, Music
} from 'lucide-react';
import { SUDANESE_VOICE_ADS } from '../../data/sudaneseVoiceAds';
import { SudaneseVoiceAd, NavigationPage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface SudaneseAudioStudioPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const SudaneseAudioStudioPage: React.FC<SudaneseAudioStudioPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  
  // Voice ads catalogue (initial + user generated)
  const [adsList, setAdsList] = useState<SudaneseVoiceAd[]>(SUDANESE_VOICE_ADS);
  const [selectedAd, setSelectedAd] = useState<SudaneseVoiceAd>(SUDANESE_VOICE_ADS[0]);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(SUDANESE_VOICE_ADS[0].durationSeconds);
  
  // AI Voice Synthesis (Gemini 3.8 Flash-Lite TTS Server Engine)
  const [isAiGeneratingVoice, setIsAiGeneratingVoice] = useState(false);
  const [aiGeneratedAudioUrl, setAiGeneratedAudioUrl] = useState<string | null>(null);
  const [activeAudioSource, setActiveAudioSource] = useState<'ai_wav' | 'speech_synth'>('speech_synth');
  const aiAudioElementRef = useRef<HTMLAudioElement | null>(null);

  // Custom AI Script Generator
  const [customTopic, setCustomTopic] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptGenSuccess, setScriptGenSuccess] = useState(false);

  // Audio customization controls (calibrated for masculine Sudanese timbre)
  const [rate, setRate] = useState<number>(selectedAd.rate);
  const [pitch, setPitch] = useState<number>(selectedAd.pitch);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [enableStudioAmbience, setEnableStudioAmbience] = useState(true);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

  // Microphone recording test
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Web Audio Context & Oscillator for studio acoustic background
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientGainNodeRef = useRef<GainNode | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // Auto-select preferred Arabic male voice
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

  // Sync state when selected ad changes
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

  // Play introductory radio broadcast jingle before speaking
  const playStudioJingle = (audioCtx: AudioContext) => {
    try {
      const now = audioCtx.currentTime;
      // High-grade acoustic broadcast chord chime (A major triad: A4, C#5, E5)
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

  // Handle ambient acoustic synthesis (Warm Studio backing sound)
  const startStudioAmbience = () => {
    if (!enableStudioAmbience) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      playStudioJingle(ctx);

      // Create warm resonant background hum and harmonic shimmer
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(98, ctx.currentTime); // G2 deep acoustic body
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(146.8, ctx.currentTime); // D3 fifth harmonic

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
        } catch (e) {}
      }, selectedAd.durationSeconds * 1000);

    } catch (e) {
      console.warn('Web Audio ambient sound:', e);
    }
  };

  const stopStudioAmbience = () => {
    if (audioCtxRef.current && ambientGainNodeRef.current) {
      try {
        ambientGainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.3);
      } catch (e) {}
    }
  };

  // Handle AI Server-Side Voice Synthesis using Gemini 3.8 Flash-Lite TTS
  const handleGenerateAiVoice = async () => {
    stopPlayback();
    setIsAiGeneratingVoice(true);
    try {
      const response = await fetch('/api/v1/ai/sudanese-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedAd.scriptSudanese,
          voiceName: 'Fenrir', // Masculine, authoritative and warm
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
        setActiveAudioSource('ai_wav');

        // Play the synthesized audio
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
      // Seamlessly fallback to browser speech synthesis
      handlePlayVoiceAd();
    } finally {
      setIsAiGeneratingVoice(false);
    }
  };

  // Play Sudanese Voice Advertisement (Speech Synthesis)
  const handlePlayVoiceAd = () => {
    // If we have AI generated WAV audio and user clicks play
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
      alert('متصفحك لا يدعم محرك تخليق الصوت Web Speech Synthesis');
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
    
    // Discover available Arabic voices
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

    // Deep resonant male parameters
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

  // Generate Custom Sudanese Ad Script via Gemini
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
            'نورٌ يهدي.. وعلمٌ يبني!'
          ]
        };

        setAdsList(prev => [newAd, ...prev]);
        setSelectedAd(newAd);
        setCustomTopic('');
        setScriptGenSuccess(true);
        setTimeout(() => setScriptGenSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to generate script:', err);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Preset vocal modes
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

  // Copy script to clipboard
  const handleCopyScript = () => {
    navigator.clipboard.writeText(selectedAd.scriptSudanese);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Download script as a formatted text file
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

  // Share script directly to WhatsApp
  const handleShareWhatsApp = () => {
    const text = `🎙️ *صوت إعلاني حماسي لمجمع النور بالعامية السودانية (صوت رجل جهوري):*%0A%0A"${encodeURIComponent(selectedAd.scriptSudanese)}"%0A%0A🌐 *الدومين المعتمد للاستماع والتسجيل:* https://www.mojamaalnor.com`;
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Record user's own Sudanese voice test
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
      } catch (err) {
        alert('تعذر الوصول للميكروفون، يرجى السماح بصلاحية التسجيل في المتصفح.');
      }
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-16">
      
      {/* Hidden Audio Tag for Gemini Synthesized Audio */}
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

      {/* Studio Banner & Header in Royal Ivory & Deep Nocturnal Gold Style */}
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-10 shadow-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#0B132B] via-[#070D1E] to-[#111C3D]">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#D4AF37] text-[#070D1E] text-xs font-black flex items-center gap-1.5 shadow-md">
                <Flame className="w-3.5 h-3.5 text-[#070D1E] animate-pulse" />
                <span>استوديو الصوت الإعلاني الحماسي 🇸🇩 (Sudanese Male Voice Studio)</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-[#111C3D] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold">
                صوت رجالي جهوري فخم • العامية السودانية الأصيلة
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#F8FAFC] font-amiri leading-tight">
              صوت إعلاني حماسي جهوري بالعامية السودانية
            </h1>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              إعلان تجاري وإذاعي متدفق بالطاقة والحيوية والنخوة السودانية، يحث القلوب على حفظ كتاب الله، التسجيل في مقارئ مجمع النور العالمية، وكفالة الأيتام وحلقات العلم. يمكنك الاستماع فوراً بصوت رجل سوداني جهوري بنقاء استوديوهات الإذاعة، وضبط نبرة الصوت وسرعة الإلقاء، أو توليد الصوت بالذكاء الاصطناعي (Gemini TTS)، ونسخ أو تنزيل السيناريو الإعلاني لحملاتك الدعوية.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2.5 rounded-xl bg-[#0B132B] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#E2E8F0] hover:text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              <span>العودة للرئيسية</span>
            </button>
            <button
              onClick={() => onNavigate('radio')}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#070D1E] text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Radio className="w-4 h-4 text-[#070D1E]" />
              <span>إذاعة مكة 24/7</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Broadcast Console & Sound Deck */}
      <section className="rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-10 shadow-xl space-y-8 bg-[#0B132B] relative overflow-hidden">
        
        {/* Console Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#D4AF37] font-black tracking-wider uppercase flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-[#D4AF37]" />
              <span>منصة التوليد الصوتي الإذاعي المباشر • Live Sudanese Voice Deck</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] font-amiri">
              {selectedAd.titleAr}
            </h2>
            <p className="text-xs text-[#94A3B8]">
              {selectedAd.scriptFormalSummary}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct AI Synthesis Button */}
            <button
              onClick={handleGenerateAiVoice}
              disabled={isAiGeneratingVoice}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-60"
              title="توليد الصوت الرجالي السوداني بالذكاء الاصطناعي الفائق"
            >
              {isAiGeneratingVoice ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>جاري توليد الصوت...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-slate-950" />
                  <span>توليد بالذكاء الاصطناعي (Gemini TTS) 🎙️</span>
                </>
              )}
            </button>

            {/* Download WAV button if AI voice is ready */}
            {aiGeneratedAudioUrl && (
              <a
                href={aiGeneratedAudioUrl}
                download={`AlNoor-Sudanese-Ad-${selectedAd.id}.wav`}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md cursor-pointer animate-bounce"
                title="تحميل ملف الصوت الإعلاني WAV بجودة الاستوديو"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الصوت (WAV) 🎵</span>
              </a>
            )}

            <button
              onClick={handleCopyScript}
              className="px-3.5 py-2 rounded-xl bg-[#111C3D] hover:bg-[#1E2E5D] border border-[#D4AF37]/40 text-[#F8FAFC] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="نسخ النص الإعلاني الكامل"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
            </button>

            <button
              onClick={handleDownloadScript}
              className="px-3.5 py-2 rounded-xl bg-[#111C3D] hover:bg-[#1E2E5D] border border-[#D4AF37]/40 text-[#F8FAFC] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="تنزيل السيناريو الإعلاني بصيغة TXT"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>تنزيل السيناريو</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="مشاركة النص عبر واتساب"
            >
              <Send className="w-4 h-4" />
              <span>مشاركة واتساب</span>
            </button>
          </div>
        </div>

        {/* Quick Voice Mode Presets */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-[#070D1E] rounded-2xl border border-[#D4AF37]/20">
          <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5 ml-2">
            <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>نبرة صوت الرجل السوداني:</span>
          </span>
          <button
            onClick={() => applyPreset('hyper')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pitch <= 0.88 && rate >= 1.08
                ? 'bg-[#D4AF37] text-[#070D1E] shadow-sm font-black'
                : 'bg-[#111C3D] text-[#94A3B8] hover:text-white hover:bg-[#1E2E5D]'
            }`}
          >
            🔥 حماسي جهوري قوي (موصى به)
          </button>
          <button
            onClick={() => applyPreset('warm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pitch > 0.88 && pitch < 0.96
                ? 'bg-[#D4AF37] text-[#070D1E] shadow-sm font-black'
                : 'bg-[#111C3D] text-[#94A3B8] hover:text-white hover:bg-[#1E2E5D]'
            }`}
          >
            🌿 شهم حار وودود (طابع أصيل)
          </button>
          <button
            onClick={() => applyPreset('reverent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pitch <= 0.82 && rate < 1.0
                ? 'bg-[#D4AF37] text-[#070D1E] shadow-sm font-black'
                : 'bg-[#111C3D] text-[#94A3B8] hover:text-white hover:bg-[#1E2E5D]'
            }`}
          >
            📜 وقور متأنٍ ورزين (صوت إيماني عميق)
          </button>
        </div>

        {/* Voiceover Master Play Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Big Play / Stop Button and Audio Visualizer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <button
                  onClick={isPlaying ? handlePause : handlePlayVoiceAd}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex flex-col items-center justify-center font-black transition-all shadow-2xl cursor-pointer ${
                    isPlaying 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : 'bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] text-[#070D1E] hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(212,175,55,0.4)]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-9 h-9 fill-current" />
                      <span className="text-[10px] mt-1 font-bold">إيقاف مؤقت</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-9 h-9 fill-current translate-x-1 text-[#070D1E]" />
                      <span className="text-[10px] mt-1 font-bold text-[#070D1E]">تشغيل الإعلان</span>
                    </>
                  )}
                </button>
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-[#0B132B] rounded-full animate-ping" />
                )}
              </div>

              <div className="space-y-3 flex-1 w-full">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#D4AF37] font-black text-sm">
                    {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-[#94A3B8] font-medium">
                    المدة التقديرية: ~{duration} ثانية
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3.5 bg-[#070D1E] rounded-full overflow-hidden border border-[#D4AF37]/30 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-300 transition-all duration-300 rounded-full"
                    style={{ width: `${playbackProgress}%` }}
                  />
                </div>

                {/* Quick actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={stopPlayback}
                    className="text-xs text-[#94A3B8] hover:text-[#D4AF37] flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة من البداية</span>
                  </button>

                  <div className="flex items-center gap-3">
                    {aiGeneratedAudioUrl && (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        ✓ صوت Gemini TTS نشط
                      </span>
                    )}

                    <label className="text-[11px] text-[#94A3B8] flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableStudioAmbience}
                        onChange={(e) => setEnableStudioAmbience(e.target.checked)}
                        className="rounded accent-[#D4AF37]"
                      />
                      <span className="font-medium">شارة البداية ومؤثر الاستوديو</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Live 36-Band Graphic Sound Equalizer */}
            <div className="bg-[#070D1E] rounded-2xl p-4 border border-[#D4AF37]/20 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span className="flex items-center gap-1.5 text-[#D4AF37] font-bold">
                  <Waves className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>مؤشر الترددات الصوتية الرجالية (Sudanese Male Announcer EQ)</span>
                </span>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {isPlaying ? '🔴 بث صوتي نشط • On Air' : '⚪ وضع الاستعداد • Ready'}
                </span>
              </div>
              <div className="flex items-end gap-1 h-14 w-full">
                {[
                  40, 75, 90, 60, 95, 80, 65, 92, 98, 70, 50, 85, 92, 96, 65, 78,
                  84, 100, 90, 72, 58, 80, 92, 98, 62, 74, 88, 92, 96, 70, 55, 85,
                  90, 65, 80, 50
                ].map((val, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t-sm transition-all duration-200 ${
                      isPlaying
                        ? 'bg-gradient-to-t from-amber-600 via-[#D4AF37] to-amber-200'
                        : 'bg-[#1E293B]'
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
          <div className="bg-[#070D1E] border border-[#D4AF37]/20 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-[#D4AF37] flex items-center gap-1.5 uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-[#D4AF37]" />
              <span>معايرة صوت المذيع (Voice Modulation)</span>
            </h3>

            {/* Speaking Rate / Pace */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#F8FAFC] font-bold">
                <span>سرعة الإلقاء الحماسي</span>
                <span className="font-mono text-[#D4AF37]">{rate}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer h-1.5 bg-[#1E293B] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8]">
                <span>متأنٍ (0.8x)</span>
                <span>طبيعي</span>
                <span>حماسي متدفق (1.3x)</span>
              </div>
            </div>

            {/* Vocal Pitch (Deep authoritative vs Bright) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#F8FAFC] font-bold">
                <span>طبقة الصوت الجهوري (Pitch)</span>
                <span className="font-mono text-[#D4AF37]">{pitch}</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.25"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer h-1.5 bg-[#1E293B] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8]">
                <span>جهوري فخم (0.75)</span>
                <span>متوسط</span>
                <span>شبابي (1.25)</span>
              </div>
            </div>

            {/* Volume */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#F8FAFC] font-bold">
                <span>مستوى الصوت الرئيسي</span>
                <span className="font-mono text-[#D4AF37]">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
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
                className="w-full accent-[#D4AF37] cursor-pointer h-1.5 bg-[#1E293B] rounded-lg"
              />
            </div>

            <div className="p-3 bg-[#111C3D] rounded-xl border border-[#D4AF37]/20 text-[11px] text-[#94A3B8] space-y-1">
              <span className="text-[#D4AF37] font-bold block">مواصفات نبرة الصوت:</span>
              <p className="leading-relaxed">{selectedAd.tone}</p>
            </div>
          </div>

        </div>

        {/* Script Display Card with Live Karaoke / Teleprompter Highlight */}
        <div className="space-y-3 pt-4 border-t border-[#D4AF37]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>النص الكامل للإعلان بالعامية السودانية (Teleprompter Script):</span>
            </span>
            <span className="text-[11px] text-[#D4AF37] font-bold">
              جاهز للإلقاء الإذاعي والإعلانات الترويجية
            </span>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#070D1E] border border-[#D4AF37]/30 text-[#F8FAFC] font-amiri text-lg sm:text-2xl leading-loose tracking-wide shadow-inner">
            <div className="whitespace-pre-line">
              {selectedAd.scriptSudanese}
            </div>
          </div>

          {/* Key Catchy Sudanese Phrases Highlights */}
          <div className="space-y-2 pt-2">
            <span className="text-xs text-[#94A3B8] font-bold block">
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
                        ? 'bg-[#D4AF37] text-[#070D1E] border-[#F3E5AB] shadow-md scale-105'
                        : 'bg-[#111C3D] text-[#E2E8F0] border-[#D4AF37]/30'
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
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-black text-[#F8FAFC] flex items-center gap-2">
            <Disc className="w-4 h-4 text-[#D4AF37] animate-spin-slow" />
            <span>اختر من السيناريوهات الإعلانية السودانية المعتمدة:</span>
          </h2>
          <span className="text-xs text-[#94A3B8]">
            {adsList.length} سيناريوهات إعلانية جاهزة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {adsList.map((ad, idx) => {
            const isSelected = selectedAd.id === ad.id;
            return (
              <button
                key={ad.id}
                onClick={() => setSelectedAd(ad)}
                className={`p-4 rounded-2xl text-right transition-all border flex flex-col justify-between gap-3 text-start cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B132B] border-[#D4AF37] shadow-xl ring-2 ring-[#D4AF37]/40'
                    : 'bg-[#070D1E] border-[#D4AF37]/20 hover:bg-[#0B132B] hover:border-[#D4AF37]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-[#D4AF37] text-[#070D1E]' : 'bg-[#111C3D] text-[#94A3B8]'
                  }`}>
                    {idx === 0 ? '★ الإعلان الحماسي المختار' : `سيناريو 0${idx + 1}`}
                  </span>
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                    ~{ad.durationSeconds} ثانية
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-black text-[#F8FAFC] line-clamp-2 leading-relaxed">
                    {ad.titleAr}
                  </h3>
                  <p className="text-[10px] text-[#94A3B8] mt-1 line-clamp-2">
                    {ad.tone}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#D4AF37]/10 flex items-center justify-between text-[10px]">
                  <span className={`font-bold ${isSelected ? 'text-[#D4AF37]' : 'text-[#64748B]'}`}>
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
      <section className="rounded-3xl bg-[#0B132B] border border-[#D4AF37]/30 p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#D4AF37] font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>مولد السيناريوهات الإعلانية الذكي • AI Sudanese Copywriter</span>
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#F8FAFC] font-amiri">
              اكتب موضوعك وولّد إعلاناً حماسياً بالعامية السودانية فوراً
            </h3>
            <p className="text-xs text-[#94A3B8]">
              حدد فكرة حملتك الدعوية أو الخيرية، وسيقوم الذكاء الاصطناعي بكتابة نص سوداني حماسي ناري جاهز للإلقاء الصوتي.
            </p>
          </div>

          {scriptGenSuccess && (
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
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
              className="flex-1 px-4 py-3 rounded-2xl bg-[#070D1E] border border-[#D4AF37]/30 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              disabled={isGeneratingScript || !customTopic.trim()}
              className="px-6 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#070D1E] font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isGeneratingScript ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#070D1E]" />
                  <span>جاري الصياغة الحماسية...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-[#070D1E]" />
                  <span>توليد الإعلان الحماسي ⚡</span>
                </>
              )}
            </button>
          </div>

          {/* Quick topic suggestion chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#94A3B8]">
            <span className="text-[11px] font-bold text-[#D4AF37]">أفكار سريعة:</span>
            {[
              'كفالة الأيتام والرعاية الشاملة ببنك الخرطوم',
              'التسجيل في مقرأة مجمع النور والحفظ عن بعد',
              'إجازة القراءات العشر المسندة إلى النبي ﷺ',
              'بث إذاعة القرآن الكريم مباشرة من مكة',
              'السهم الوقفي والصدقة الجارية لطباعة المصاحف'
            ].map((chip, cIdx) => (
              <button
                key={cIdx}
                type="button"
                onClick={() => setCustomTopic(chip)}
                className="px-2.5 py-1 rounded-lg bg-[#111C3D] hover:bg-[#1E2E5D] text-slate-300 hover:text-white border border-[#D4AF37]/20 text-[11px] transition-colors cursor-pointer"
              >
                + {chip}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* Recording Studio & Custom Sudanese Voiceover Test */}
      <section className="rounded-3xl bg-[#0B132B] border border-[#D4AF37]/30 p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#D4AF37] font-bold flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-rose-500" />
              <span>استوديو تسجيل صوتك الشخصي • Voiceover Recording Booth</span>
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#F8FAFC] font-amiri">
              سجّل إعلانك بصوتك الخاص بالعامية السودانية
            </h3>
            <p className="text-xs text-[#94A3B8]">
              يمكنك قراءة النص أعلاه وتسجيله بميكروفون جهازك لاختباره وسماعه فوراً، أو تنزيل ملف الصوت للمونتاج والإعلانات.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleRecording}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isRecording 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                  : 'bg-[#D4AF37] hover:bg-[#E5C158] text-[#070D1E]'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isRecording ? `جاري التسجيل (${recordingSeconds} ث) - انقر للإيقاف` : 'ابدأ التسجيل بالمايكروفون'}</span>
            </button>
          </div>
        </div>

        {/* Recorded Audio Playback Deck */}
        {recordedAudioUrl && (
          <div className="bg-[#070D1E] p-4 rounded-2xl border border-[#D4AF37]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#070D1E] flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="text-xs font-bold text-[#F8FAFC] block">تم تسجيل المقطع بنجاح!</span>
                <span className="text-[11px] text-[#94A3B8]">استمع للتسجيل أو قم بتنزيله بصيغة WebM</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <audio src={recordedAudioUrl} controls className="h-10 accent-[#D4AF37]" />
              <a
                href={recordedAudioUrl}
                download="alnoor-sudanese-voice-ad.webm"
                className="px-4 py-2 rounded-xl bg-[#111C3D] hover:bg-[#1E2E5D] text-[#D4AF37] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>تنزيل الصوت</span>
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Suggested Commercial Distribution Channels */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B132B] border border-[#D4AF37]/20 space-y-2 shadow-sm">
          <div className="text-[#D4AF37] font-bold text-xs flex items-center gap-1.5">
            <Radio className="w-4 h-4" />
            <span>البث الإذاعي المحلي</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            مناسب للبث الصوتي في الإذاعات السودانية المحلية، وبرامج الصباح الروحية والمساجد والمراكز الإسلامية.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B132B] border border-[#D4AF37]/20 space-y-2 shadow-sm">
          <div className="text-[#D4AF37] font-bold text-xs flex items-center gap-1.5">
            <Send className="w-4 h-4" />
            <span>حملات واتساب وتليجرام</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            نص مخصص للانتشار السريع كرسالة صوتية (Voice Note) في مجموعات الأسر والمغتربين السودانيين ورواد المساجد.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B132B] border border-[#D4AF37]/20 space-y-2 shadow-sm">
          <div className="text-[#D4AF37] font-bold text-xs flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>فيديوهات وسائل التواصل</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            يمكن استخدام الصوت كتعليق صوتي (Voiceover) لمقاطع تيك توك، فيسبوك ريلز، وانستغرام لحملات كفالة الأيتام والقرآن.
          </p>
        </div>
      </section>

    </div>
  );
};
