import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, RotateCcw, Download, Sparkles, 
  Radio, Phone, MessageCircle, Sliders, Mic, FileText, CheckCircle2, 
  Share2, Heart, Award, ArrowRight, ShieldCheck, Music
} from 'lucide-react';
import { COMPLEX_INFO } from '../data/islamicData';
import { useLanguage } from '../context/LanguageContext';

export interface AdScript {
  id: string;
  title: string;
  badge: string;
  energy: 'خارق الحماس' | 'حماسي إذاعي' | 'مؤثر ووقور';
  durationEst: string;
  script: string;
  callToAction: string;
}

const PRESET_SCRIPTS: AdScript[] = [
  {
    id: 'ad-registration',
    title: 'إعلان التسجيل في حلقات القرآن الكريم (حماسي جداً)',
    badge: 'الأكثر طلباً ★',
    energy: 'خارق الحماس',
    durationEst: '35 ثانية',
    script: 'يا زول يا أصيل! السلام عليكم ورحمة الله.. بتفتش لأولادك على مكان يحفظهم كتاب الله بإتقان وأسانيد متصلة؟ مجمع النور الإسلامي العالمي الخيري الشامل فاتح أبوابه ليكم في كل مكان! شيوخ مجازين، قراءات عشر، ومتابعة يومية على مدار الساعة، وبرامج لكل الأعمار وبشهادات معتمدة عالمياً! ما تفوت الفرصة عليك وعلى عيالك.. النور في بيوتكم وقلوبكم! تواصل هسع مع مجمع النور طوالي عبر الواتساب والموقع الرسمي.. ألحق سجّل هسع وما تتردد!',
    callToAction: 'سجل الآن عبر خدمة المستفيدين بالواتساب',
  },
  {
    id: 'ad-waqf',
    title: 'إعلان الصدقة الجارية ووقف القرآن (حماسي ومؤثر)',
    badge: 'أجر مستمر',
    energy: 'مؤثر ووقور',
    durationEst: '40 ثانية',
    script: 'أهلاً بيكم يا أهل الخير والجود والشهامة السودانية! داير ليك أجر ما ينقطع ليوم القيامة؟ سهمك الوقفي في مجمع النور الإسلامي العالمي الخيري الشامل بيبني حلقات التحفيظ، ويكفل طلاب القرآن، ويطبع المصاحف.. كل حرف يرتلوه في ميزان حسناتك جبال من الأجر! قال حبيبنا المصطفى ﷺ: إذا مات ابن آدم انقطع عمله إلا من ثلاث.. أو صدقة جارية. بادر بالخير وما تبخل على نفسك، وتواصل فوراً مع إدارة الوقف عبر الواتساب الرسمي.. مجمع النور: نورٌ يهدي، وصرحٌ يبني أجيال القرآن!',
    callToAction: 'ساهم في الوقف القرآني الآن',
  },
  {
    id: 'ad-app',
    title: 'إعلان المنصة والتطبيق الذكي (عصري ومبهر)',
    badge: 'تقنية إسلامية',
    energy: 'حماسي إذاعي',
    durationEst: '30 ثانية',
    script: 'يا هلا بكل سوداني وكل مسلم في أي بلد حول العالم! من قلب المجمع إلى العالم كلو.. مجمع النور بيقدّم ليكم منصة إسلامية متكاملة وتطبيق ذكي بنزل في ثواني على جوالك والحاسوب! مصحف إلكتروني بروايات معتمدة، إذاعة تلاوات خاشعة، مكتبة إسلامية شاملة، واستشارات شرعية موثوقة.. نزل التطبيق واستمتع برحلة الإيمان.. ادخل على موقعنا الرسمي، وخلي القرآن رفيق دربك أينما كنت!',
    callToAction: 'نزل التطبيق وتصفح المصحف الإلكتروني',
  },
  {
    id: 'ad-ijaza',
    title: 'إعلان مقرأة الإجازة بالسند المتصل (علمي ورنان)',
    badge: 'إسناد متصل',
    energy: 'حماسي إذاعي',
    durationEst: '35 ثانية',
    script: 'بشرى سارة لطلاب العلم وحفظة كتاب الله! يعلن مجمع النور الإسلامي العالمي عن فتح باب القبول لمقرأة الإجازة بالسند المتصل إلى رسول الله ﷺ بالقراءات العشر، ودبلوم العلوم الشرعية والفقه وأصوله، بإشراف نخبة من كبار العلماء والمقرئين المجازين.. مقاعد محدودة ومتابعة فردية دقيقة! للاستفسار وحجز المقعد، سارع بمراسلتنا عبر الواتساب والموقع الرسمي.. مجمع النور، نورٌ يهدي وصرحٌ يبني أجيال القرآن!',
    callToAction: 'احجز مقعدك في مقرأة الإسناد المتصل',
  },
];

export const SudaneseVoiceAdStudio: React.FC = () => {
  const { lang, isRtl } = useLanguage();
  
  // Selection and script state
  const [selectedScript, setSelectedScript] = useState<AdScript>(PRESET_SCRIPTS[0]);
  const [customText, setCustomText] = useState(PRESET_SCRIPTS[0].script);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  // Audio Controls
  const [voicePitch, setVoicePitch] = useState<number>(0.92); // Deep male tone
  const [voiceRate, setVoiceRate] = useState<number>(1.08); // Energetic broadcast tempo
  const [bgMusicEnabled, setBgMusicEnabled] = useState<boolean>(true);
  const [bgVolume, setBgVolume] = useState<number>(0.25);
  
  // Audio Engine Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgGainRef = useRef<GainNode | null>(null);
  const bgOscIntervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isCancelledRef = useRef<boolean>(false);

  // Initialize and clean up AudioContext & Speech
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Update custom text when selecting a preset
  const handleSelectPreset = (ad: AdScript) => {
    stopAudio();
    setSelectedScript(ad);
    setCustomText(ad.script);
  };

  // Play synthetic radio jingle and Islamic ambient pulse via Web Audio API
  const playStudioJingle = (ctx: AudioContext) => {
    try {
      const now = ctx.currentTime;
      // Chime note 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(392.00, now); // G4
      osc1.frequency.exponentialRampToValueAtTime(587.33, now + 0.3); // D5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      // Chime note 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, now + 0.15); // C5
      osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.45); // G5
      gain2.gain.setValueAtTime(0.3, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.65);
    } catch (e) {
      console.warn('Web Audio SFX jingle error:', e);
    }
  };

  // Start background rhythmic duff / ambient studio heartbeat
  const startBackgroundAmbience = (ctx: AudioContext) => {
    if (!bgMusicEnabled) return;
    
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(bgVolume * 0.4, ctx.currentTime);
    masterGain.connect(ctx.destination);
    bgGainRef.current = masterGain;

    // Periodic soft acoustic drum beat simulating a dignified Islamic daf rhythm
    const beatInterval = 650; // ms
    const triggerDaf = () => {
      if (!ctx || ctx.state === 'closed') return;
      const t = ctx.currentTime;
      
      // Low resonance thump
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.22);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.25);
    };

    triggerDaf();
    bgOscIntervalRef.current = window.setInterval(triggerDaf, beatInterval);
  };

  const stopBackgroundAmbience = () => {
    if (bgOscIntervalRef.current) {
      clearInterval(bgOscIntervalRef.current);
      bgOscIntervalRef.current = null;
    }
    if (bgGainRef.current) {
      try {
        bgGainRef.current.gain.setValueAtTime(0, 0);
      } catch (e) {}
    }
  };

  // Real-time Visualizer Canvas Animation
  const startVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const bars = 36;
      const barWidth = canvas.width / bars - 2;
      
      for (let i = 0; i < bars; i++) {
        // Generate dynamic animated waveform heights
        const wave = Math.sin(tick * 0.15 + i * 0.35);
        const noise = Math.random() * 0.4;
        const heightMultiplier = Math.max(0.15, Math.abs(wave) + noise);
        const barHeight = heightMultiplier * (canvas.height * 0.85);
        
        // Gradient from Gold to Emerald
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#f59e0b'); // Islamic Gold
        grad.addColorStop(0.6, '#10b981'); // Emerald
        grad.addColorStop(1, '#6ee7b7'); // Soft glow
        
        ctx.fillStyle = grad;
        const x = i * (barWidth + 2);
        const y = (canvas.height - barHeight) / 2;
        
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const stopVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw resting flat line
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, 2);
      }
    }
  };

  // Start Playing the Male Sudanese Voiceover
  const playAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('متصفحك لا يدعم توليد الصوت المباشر.');
      return;
    }

    stopAudio();
    isCancelledRef.current = false;

    // 1. AudioContext for Broadcast Jingle and Background Pulse
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        playStudioJingle(ctx);
        if (bgMusicEnabled) {
          startBackgroundAmbience(ctx);
        }
      }
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }

    startVisualizer();
    setIsPlaying(true);

    // 2. SpeechSynthesis Male Configuration
    const utterance = new SpeechSynthesisUtterance(customText);
    utterance.lang = 'ar-SA'; // Arabic
    utterance.rate = voiceRate; // Energetic advertising speed
    utterance.pitch = voicePitch; // Deep male radio presenter resonance

    // Select Arabic male voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (v) => v.lang.startsWith('ar') && (v.name.includes('Maged') || v.name.includes('Tarik') || v.name.includes('Male') || v.name.includes('Naayf'))
    ) || voices.find((v) => v.lang.startsWith('ar'));
    
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => {
      if (!isCancelledRef.current) {
        stopAudio();
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      stopAudio();
    };

    // Delay speech slightly to let the radio intro chime shine
    setTimeout(() => {
      if (!isCancelledRef.current) {
        window.speechSynthesis.speak(utterance);
      }
    }, 450);
  };

  const stopAudio = () => {
    isCancelledRef.current = true;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    stopBackgroundAmbience();
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    stopVisualizer();
    setIsPlaying(false);
  };

  // Generate new AI custom script in Sudanese dialect
  const handleGenerateAIScript = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/audio-ad/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignType: selectedScript.title,
          targetAudience: 'الجمهور السوداني والإسلامي العالمي، أولياء الأمور وحفظة القرآن',
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.script) {
        setCustomText(data.data.script);
        setSelectedScript({
          id: `custom-ai-${Date.now()}`,
          title: data.data.title || 'إعلان سوداني حماسي جديد (مُولّد بالذكاء الاصطناعي)',
          badge: 'توليد حصري ✨',
          energy: 'خارق الحماس',
          durationEst: '35 ثانية',
          script: data.data.script,
          callToAction: data.data.callToAction || 'سجل الآن عبر واتساب مجمع النور',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Download Audio Script as a text file / broadcast asset
  const handleDownloadAsset = () => {
    const content = `=====================================================
مجمع النور الإسلامي العالمي الخيري الشامل لتحفيظ القرآن الكريم والعلوم الإسلامية
المكتب الإعلامي - الاستوديو الصوتي الإعلاني الحماسي
=====================================================

عنوان الإعلان: ${selectedScript.title}
مستوى الطاقة: ${selectedScript.energy}
المدة التقديرية: ${selectedScript.durationEst}
نبرة الصوت: صوت رجالي عميق ومتحمس بالعامية السودانية الأصيلة

[النص الإعلاني الرسمي]:
"${customText}"

[دعوة العمل والاتصال]:
واتساب: ${COMPLEX_INFO.phones.whatsapp}
موبايل: ${COMPLEX_INFO.phones.mobile}
المقر: ${COMPLEX_INFO.headquarters}
شعار المجمع: "${COMPLEX_INFO.slogan}"

ملاحظات المهندس الصوتي:
- يتم الأداء بنبرة حماسية إذاعية سودانية مع إيقاع دَفّ هادئ وتردد صوتي (Radio Limiter).
- مناسب للنشر عبر حالات الواتساب، فيسبوك، ومجموعات التليجرام.
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `اعلان_سوداني_حماسي_مجمع_النور_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      
      {/* Studio Header Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-emerald-950/80 to-slate-950 border border-emerald-800/50 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 shadow-sm">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>استوديو الصوت الإعلاني الحماسي • بالعامية السودانية الأصيلة</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            الصوت الإعلاني الحماسي لمجمع النور
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            استمع لأقوى الإعلانات الإذاعية بصوت رجالي سوداني جهوري وحماسي، مصمم لبث الحماس في نفوس الطلاب وأولياء الأمور للتسجيل في حلقات القرآن الكريم والعلوم الإسلامية ودعم الوقف الخيري.
          </p>

          {/* Quick Contact & Action Buttons (Clean, no raw phone numbers) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/${COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم ورحمة الله، استمعت للإعلان الصوتي الحماسي وأرغب في التسجيل في مجمع النور')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>خدمة المستفيدين عبر واتساب المعتمد</span>
            </a>

            <a
              href={`tel:${COMPLEX_INFO.phones.mobile.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>طلب اتصال مباشر ودعم التسجيل</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Interactive Studio Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Sound Deck & Visualizer Player */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Studio Audio Master Rack */}
          <div className="bg-slate-900/90 border-2 border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Top Rack Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Mic className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>{selectedScript.title}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold">
                      {selectedScript.energy}
                    </span>
                    <span>•</span>
                    <span>صوت رجالي إذاعي سوداني جهوري</span>
                    <span>•</span>
                    <span className="font-mono text-amber-400">{selectedScript.durationEst}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {isPlaying ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>البث مباشر (ON AIR)</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold">
                    <span>جاهز للبث</span>
                  </span>
                )}
              </div>
            </div>

            {/* Neon Sound Waveform Visualizer Canvas */}
            <div className="my-6 bg-slate-950/90 rounded-2xl border border-slate-800 p-4 shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 font-mono">
                <span>AUDIO FREQUENCY SPECTRUM (LIVE)</span>
                <span>48kHz • 24-BIT BROADCAST</span>
              </div>
              <canvas
                ref={canvasRef}
                width={700}
                height={90}
                className="w-full h-24 rounded-lg bg-slate-950 block"
              />
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                {!isPlaying ? (
                  <button
                    onClick={playAudio}
                    className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-8 py-4 rounded-2xl text-base shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-6 h-6 fill-slate-950" />
                    <span>تشغيل الإعلان الحماسي الآن</span>
                  </button>
                ) : (
                  <button
                    onClick={stopAudio}
                    className="flex items-center gap-2.5 bg-red-600 hover:bg-red-500 text-white font-black px-8 py-4 rounded-2xl text-base shadow-xl shadow-red-600/30 transition-all cursor-pointer"
                  >
                    <Pause className="w-6 h-6 fill-white" />
                    <span>إيقاف الصوت المؤقت</span>
                  </button>
                )}

                <button
                  onClick={stopAudio}
                  title="إعادة ضبط"
                  className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {/* Direct WhatsApp Call to Action Button */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، استمعت للإعلان الصوتي الحماسي بالعامية السودانية وأود التسجيل في مجمع النور الإسلامي')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold px-4 py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>تواصل عبر واتساب فوراً</span>
                </a>

                <button
                  onClick={handleDownloadAsset}
                  title="تحميل النص الإعلاني وبيانات البث"
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3.5 py-3.5 rounded-xl text-xs font-bold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">تحميل النص</span>
                </button>
              </div>
            </div>

            {/* Sound Engineering Parameters */}
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Voice Resonance / Pitch */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    نبرة الصوت الرجالي:
                  </span>
                  <span className="text-amber-400 font-mono font-bold">
                    {voicePitch < 0.95 ? 'جهوري وعميق' : 'طبيعي'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.2"
                  step="0.05"
                  value={voicePitch}
                  onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Speech Rate / Tempo */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    سرعة وحماس الإلقاء:
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {voiceRate > 1.1 ? 'سريع وحماسي جداً' : 'متوازن إذاعي'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.9"
                  max="1.3"
                  step="0.05"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Background Music & Duff Pulse */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-blue-400" />
                    المؤثر الإذاعي والخلفية:
                  </span>
                  <button
                    onClick={() => setBgMusicEnabled(!bgMusicEnabled)}
                    className="text-xs font-bold text-amber-400 hover:underline"
                  >
                    {bgMusicEnabled ? 'مفعّل' : 'مكتوم'}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  disabled={!bgMusicEnabled}
                  value={bgMusicEnabled ? bgVolume : 0}
                  onChange={(e) => setBgVolume(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40"
                />
              </div>

            </div>

          </div>

          {/* Interactive Script Editor & AI Enhancer */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  نص الإعلان باللهجة السودانية الحماسية (قابل للتعديل الفوري)
                </h4>
              </div>

              <button
                onClick={handleGenerateAIScript}
                disabled={isGeneratingAI}
                className="flex items-center gap-1.5 text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingAI ? 'جاري الصياغة بالذكاء الاصطناعي...' : 'توليد نص إعلاني سوداني جديد بالـ AI'}</span>
              </button>
            </div>

            <textarea
              rows={5}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-4 text-sm text-slate-200 leading-relaxed font-sans focus:outline-none transition-colors"
              placeholder="اكتب أو عدل النص الإعلاني بالعامية السودانية هنا..."
            />

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>يحتوي النص تلقائياً على رقم الواتساب والموبايل وشعار المجمع المبارك.</span>
              </div>
              <button
                onClick={playAudio}
                className="text-amber-400 hover:text-amber-300 font-bold underline"
              >
                تشغيل النص المعدّل الآن 🔊
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Ready Commercial Campaigns Library */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white">
                  الحملات الإعلانية السودانية الجاهزة
                </h3>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                4 نماذج رسمية
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              اختر أي نموذج للاستماع إليه فوراً بصوت رجل سوداني متحمس ومؤثر:
            </p>

            <div className="space-y-3">
              {PRESET_SCRIPTS.map((ad) => {
                const isSelected = selectedScript.id === ad.id;
                return (
                  <button
                    key={ad.id}
                    onClick={() => handleSelectPreset(ad)}
                    className={`w-full text-right p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/15 via-emerald-950/40 to-slate-900 border-amber-500/60 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-white line-clamp-1">
                        {ad.title}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'
                      }`}>
                        {ad.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {ad.script}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-500">
                      <span className="font-mono text-emerald-400">{ad.durationEst}</span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <span>انقر للاستماع</span>
                        <Play className="w-2.5 h-2.5 fill-amber-400" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sudanese Dialect Glossary & Tips */}
          <div className="bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-900/50 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ميزات الصوت الإعلاني السوداني بالمجمع:</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>لهجة سودانية أصيلة محبوبة وقريبة من القلب («يا زول يا أصيل»، «هسع»، «بتفتش»).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>نبرة إذاعية رجالية رنانة تبث الهمة لحفظ كتاب الله وسماع التلاوات.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>تضمين مباشر لأرقام الواتساب والموبايل لتسهيل التسجيل السريع.</span>
              </li>
            </ul>
          </div>

          {/* Quick Contact Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-center space-y-3">
            <h4 className="text-xs font-bold text-white">هل ترغب في تسجيل إعلان مخصص لحملتك؟</h4>
            <p className="text-[11px] text-slate-400">
              تواصل مباشرة مع إدارة الإعلام بمجمع النور لتسجيل إعلانات إذاعية مخصصة بأصوات نخبة من المنشدين والإعلاميين السودانيين.
            </p>
            <a
              href={`https://wa.me/${COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، أرغب في طلب تسجيل إعلان إذاعي مخصص لمجمع النور')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-800/60 font-bold py-2.5 rounded-xl text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>تواصل مع المكتب الإعلامي</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
