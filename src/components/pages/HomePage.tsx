import React, { useState, useRef } from 'react';
import { 
  BookOpen, GraduationCap, Library, HeartHandshake, 
  Sparkles, Globe, Users, Award, Play, Pause, Volume2, 
  ArrowLeft, CheckCircle2, Star, ShieldCheck, ChevronRight,
  Radio, Mic, MessageCircle, Phone, Search, Compass, BookCheck, Flame
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { COMPLEX_INFO, FEATURED_SURAHS, RECITERS } from '../../data/islamicData';
import { PWAInstallButton } from '../PWAInstallButton';
import { useLanguage } from '../../context/LanguageContext';

interface HomePageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { lang, t, isRtl } = useLanguage();
  const [selectedSurah, setSelectedSurah] = useState(FEATURED_SURAHS[0]);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Quick Sudanese Audio Ad state
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const isAdCancelledRef = useRef(false);

  const toggleSudaneseAd = () => {
    if (!('speechSynthesis' in window)) {
      alert('متصفحك لا يدعم توليد الصوت المباشر');
      return;
    }

    if (isPlayingAd) {
      isAdCancelledRef.current = true;
      window.speechSynthesis.cancel();
      setIsPlayingAd(false);
      return;
    }

    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    isAdCancelledRef.current = false;
    setIsPlayingAd(true);

    const script = "يا زول يا أصيل! السلام عليكم ورحمة الله.. بتفتش لأولادك على مكان يحفظهم كتاب الله بإتقان وأسانيد متصلة؟ مجمع النور الإسلامي العالمي الخيري الشامل فاتح أبوابه ليكم في كل مكان! شيوخ مجازين، قراءات عشر، ومتابعة يومية على مدار الساعة، وبرامج لكل الأعمار وبشهادات معتمدة عالمياً! ما تفوت الفرصة عليك وعلى عيالك.. النور في بيوتكم وقلوبكم! تواصل هسع مع مجمع النور طوالي عبر الواتساب والموقع الرسمي.. ألحق سجّل هسع وما تتردد!";

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = 'ar-SA';
    utterance.rate = 1.08;
    utterance.pitch = 0.92;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (v) => v.lang.startsWith('ar') && (v.name.includes('Maged') || v.name.includes('Tarik') || v.name.includes('Male'))
    ) || voices.find((v) => v.lang.startsWith('ar'));
    
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => {
      setIsPlayingAd(false);
    };

    utterance.onerror = () => {
      setIsPlayingAd(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      if (isPlayingAd) {
        window.speechSynthesis.cancel();
        setIsPlayingAd(false);
      }
      audioRef.current.play().catch(console.warn);
      setIsPlayingAudio(true);
    }
  };

  const handleSurahChange = (surahIndex: number) => {
    const surah = FEATURED_SURAHS[surahIndex];
    setSelectedSurah(surah);
    setIsPlayingAudio(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Quick navigation filter based on search
  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    if (q.includes('قرآن') || q.includes('مصحف') || q.includes('تلاوة') || q.includes('فاتحة') || q.includes('يس')) {
      onNavigate('quran');
    } else if (q.includes('علم') || q.includes('فقه') || q.includes('حديث') || q.includes('شريعة') || q.includes('دبلوم')) {
      onNavigate('sciences');
    } else if (q.includes('كتب') || q.includes('مكتبة') || q.includes('بحث')) {
      onNavigate('library');
    } else if (q.includes('وقف') || q.includes('تبرع') || q.includes('زكاة') || q.includes('صدقة')) {
      onNavigate('waqf');
    } else if (q.includes('صوت') || q.includes('إعلان') || q.includes('سودان') || q.includes('راديو')) {
      onNavigate('audioAd');
    } else {
      onNavigate('register');
    }
  };

  return (
    <div className="space-y-16">
      
      {/* =========================================================================
          GRAND EDITORIAL HERO: Designed with High-End Global Architecture
          ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden luxury-card border border-amber-500/20 p-6 sm:p-12 lg:p-16 shadow-2xl">
        
        {/* Subtle Atmospheric Light Cones */}
        <div className="absolute -top-24 right-1/4 w-[32rem] h-[32rem] bg-gradient-to-br from-amber-500/15 via-emerald-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-[32rem] h-[32rem] bg-gradient-to-tr from-emerald-900/25 via-slate-900 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle Islamic Sacred Geometric Watermark */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          
          {/* Typographic Kicker (Clean, unboxed, zero-pill discipline) */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-amber-300 tracking-wide">
            <span>صرحٌ إسلامي وقفي شامل</span>
            <span aria-hidden="true" className="text-amber-500/60">·</span>
            <span>اعتماد أكاديمي دولي</span>
            <span aria-hidden="true" className="text-amber-500/60">·</span>
            <span className="text-emerald-400">يخدم طلاب القرآن في 120 دولة</span>
          </div>

          {/* Majestic Institutional Emblem & Crest */}
          <div className="inline-block relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-300 to-emerald-600 p-0.5 shadow-2xl shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-amber-400">
                <BookOpen className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.2]" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[11px] text-white font-black shadow-md">
              ★
            </div>
          </div>

          {/* Primary Institutional Title */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight font-sans">
              {t.complexName}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-400 font-medium">
              Al-Noor Global Comprehensive Islamic Charitable Complex
            </p>
          </div>

          {/* Official Calligraphic Slogan (Luxury Foil Plate) */}
          <div className="py-1">
            <div className="inline-block bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-y border-amber-500/40 px-8 sm:px-14 py-4 rounded-2xl shadow-inner backdrop-blur-md">
              <span className="text-[11px] text-amber-400/90 font-bold tracking-widest uppercase block mb-1">
                {lang === 'ar' ? 'الشعار الرسمي المبارك' : 'Official Slogan'}
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-amiri text-amber-300 tracking-wider">
                {t.sloganQuote}
              </span>
            </div>
          </div>

          {/* Hero Description */}
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>

          {/* Interactive Global Command Search Bar */}
          <form onSubmit={handleQuickSearchSubmit} className="max-w-xl mx-auto relative pt-1">
            <div className="relative flex items-center">
              <Search className={`w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-4' : 'left-4'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث عن سورة، مقرأة، دورة فقهية، أو استفسار شرعي...' : 'Search Surah, Academy course, or fatwa...'}
                className={`w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-400 rounded-2xl py-3.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-all shadow-lg ${
                  isRtl ? 'pr-11 pl-24' : 'pl-11 pr-24'
                }`}
              />
              <button
                type="submit"
                className={`absolute ${isRtl ? 'left-2' : 'right-2'} bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors`}
              >
                {lang === 'ar' ? 'استكشف' : 'Search'}
              </button>
            </div>
          </form>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            
            {/* Highlighted Sudanese Voice Ad Studio Action */}
            <button
              onClick={() => onNavigate('audioAd')}
              className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
              <span>{lang === 'ar' ? 'استوديو الصوت الإعلاني الحماسي 🎙️' : 'Sudanese Voice Ad Studio'}</span>
            </button>

            {/* Dedicated New Muslims & Global Dawah Portal Shortcut */}
            <button
              onClick={() => onNavigate('newMuslims')}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-emerald-200 border border-emerald-500/50 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>{t.navNewMuslims}</span>
            </button>

            <button
              onClick={() => onNavigate('quran')}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{t.btnQuran}</span>
            </button>

            <button
              onClick={() => onNavigate('sciences')}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition-all"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>{t.btnSciences}</span>
            </button>

            <button
              onClick={() => onNavigate('waqf')}
              className="flex items-center gap-2 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition-all"
            >
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <span>{t.btnWaqf}</span>
            </button>

            <PWAInstallButton className="px-5 py-3.5 text-xs sm:text-sm" />
          </div>

        </div>

        {/* Global Impact Quantitative Grid */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80">
          
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl text-center hover:border-amber-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              +{COMPLEX_INFO.totalStudents.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-semibold">{t.statsStudents}</div>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl text-center hover:border-emerald-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300 tracking-tight">
              +{COMPLEX_INFO.graduatedHuffaz.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-semibold">{t.statsHuffaz}</div>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl text-center hover:border-blue-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {COMPLEX_INFO.internationalBranchesCount}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-semibold">{t.statsBranches}</div>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl text-center hover:border-purple-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight">
              {COMPLEX_INFO.activeTeachers}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-semibold">{t.statsTeachers}</div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SUDANESE VOICE ADVERTISING BROADCAST BANNER & CONSOLE (Ultra-Prestigious)
          ========================================================================= */}
      <section className="bg-gradient-to-r from-slate-950 via-emerald-950/60 to-slate-950 border border-emerald-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Ad Info & Identity */}
          <div className="space-y-3 text-center lg:text-right max-w-2xl">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-amber-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>البث الصوتي الإعلاني الحماسي · صوت رجالي بالعامية السودانية</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 font-mono">35 ثانية</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight font-sans">
              «يا زول يا أصيل! النور لبيتك وعيالك.. مجمع النور مستنيك!»
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              استمع الآن لإعلان مجمع النور الحماسي بالعامية السودانية المحبوبة بصوت رجالي جهوري ومتحمس، يبث الهمة للتسجيل في حلقات القرآن الكريم والإسناد المتصل ودعم الوقف الخيري.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-3 pt-1 text-xs text-slate-400">
              <span>تسجيل إذاعي استوديو معتمد</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">متاح للتحميل والمشاركة الفورية</span>
            </div>
          </div>

          {/* Ad Actions: Play Voiceover / Open Full Studio */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={toggleSudaneseAd}
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer ${
                isPlayingAd
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/25'
              }`}
            >
              {isPlayingAd ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>إيقاف الإعلان الصوتي</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>استمع للإعلان الحماسي الآن 🔊</span>
                </>
              )}
            </button>

            <button
              onClick={() => onNavigate('audioAd')}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/30 hover:border-amber-500 px-6 py-3 rounded-2xl text-xs font-bold transition-all"
            >
              <Mic className="w-4 h-4 text-amber-400" />
              <span>فتح الاستوديو الصوتي وتوليد الإعلانات</span>
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          NEW MUSLIMS & GLOBAL DAWAH PORTAL BANNER (Dedicated Institutional Portal)
          ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-700/50 p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-islamic-pattern opacity-15 pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-emerald-900/60 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Compass className="w-3.5 h-3.5" />
                <span>قسم المهتدين الجدد والدعوة العالمية • New Muslims & Global Dawah</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white font-amiri leading-tight">
                واحة النور للمهتدين الجدد والتعريف بالإسلام حول العالم
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                قسم مؤسسي شامل مخصص لتعليم الصلاة والوضوء خطوة بخطوة، مع مكتبة محاضرات عالمية، وإذاعة صوتية حية بشتى لغات العالم، ودعوة متخصصة باللغة الإنجليزية واللغات الحية.
              </p>
            </div>

            <button
              onClick={() => onNavigate('newMuslims')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>دخول بوابة المهتدين الجدد</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* 5 Branches Interactive Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
            
            <div 
              onClick={() => onNavigate('newMuslims')}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                قسم الدعوة بالإنجليزية
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                بيان التوحيد، نبوة محمد ﷺ، مكانة عيسى عليه السلام، ودليل الشبهات.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('newMuslims')}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors">
                الدعوة باللغات العالمية
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                مواد دعوية معتمدة بـ 10 لغات حية (فرنسي، إسباني، ألماني، تركي...).
              </p>
            </div>

            <div 
              onClick={() => onNavigate('newMuslims')}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="text-xs font-black text-white group-hover:text-sky-300 transition-colors">
                مكتبة الفيديوهات والمحاضرات
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                سلاسل مرئية لكبار العلماء وقصص واقعية مؤثرة لرحلات المهتدين.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('newMuslims')}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h3 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                الفقه الميسر والوضوء والصلاة
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تعليم تفاعلي بالصوت والصورة لحركات وأذكار الصلاة الخمس والوضوء.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('newMuslims')}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold text-xs">
                05
              </div>
              <h3 className="text-xs font-black text-white group-hover:text-purple-300 transition-colors">
                الإذاعة الدعوية العالمية
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                بث إذاعي صوتي متواصل 24/7 ببرامج إرشادية وتلاوات مترجمة.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          LIVE QURAN RECITATION SUITE: High-Fidelity Audio Deck
          ========================================================================= */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                {t.quranRadioTitle}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                {t.quranRadioSub}
              </h3>
            </div>
          </div>

          {/* Select Reciter & Surah */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={FEATURED_SURAHS.findIndex((s) => s.number === selectedSurah.number)}
              onChange={(e) => handleSurahChange(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-white text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
            >
              {FEATURED_SURAHS.map((s, idx) => (
                <option key={s.number} value={idx}>
                  {s.name} ({s.revelationType})
                </option>
              ))}
            </select>

            <select
              value={selectedReciter.id}
              onChange={(e) => {
                const r = RECITERS.find((x) => x.id === e.target.value) || RECITERS[0];
                setSelectedReciter(r);
                setIsPlayingAudio(false);
              }}
              className="bg-slate-950 border border-slate-700 text-white text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>{t.btnPauseRecitation}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t.btnPlayRecitation}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hidden canonical Audio Element */}
        <audio
          ref={audioRef}
          src={selectedSurah.audioUrl}
          onEnded={() => setIsPlayingAudio(false)}
        />

        {/* Selected Surah Preview Ayah */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="space-y-1.5">
            <div className="text-xs text-amber-400 font-bold flex items-center justify-center sm:justify-start gap-2">
              <span>قبس مبارك من {selectedSurah.name}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-normal">{selectedReciter.style}</span>
            </div>
            <p className="text-base sm:text-xl font-amiri text-slate-100 font-bold leading-relaxed">
              « {selectedSurah.sampleAyahs[0]?.text || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'} »
            </p>
          </div>
          <button
            onClick={() => onNavigate('quran')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 shrink-0 bg-emerald-950/40 border border-emerald-800/50 px-4 py-2 rounded-xl transition-colors"
          >
            <span>فتح المصحف كاملاً مع التفسير</span>
            <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </section>

      {/* =========================================================================
          THE 4 CORE PILLARS: Crafted with British-Islamic Prestige
          ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400 tracking-wider">
            <span>أركان المنظومة المؤسسية</span>
            <span aria-hidden="true">·</span>
            <span>الريادة والتعليم والوقف</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {t.pillarsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            {t.pillarsDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div 
            onClick={() => onNavigate('quran')}
            className="group p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer shadow-xl space-y-4 flex flex-col justify-between hover:translate-y-[-2px]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                المقرأة القرآنية والإجازات
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                حلقات قرآنية نموذجية إلكترونية وحضورية، مع منح الإجازات بالسند المتصل إلى رسول الله ﷺ بالقراءات العشر الصغرى والكبرى.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>استكشف الحلقات</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Pillar 2 */}
          <div 
            onClick={() => onNavigate('sciences')}
            className="group p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xl space-y-4 flex flex-col justify-between hover:translate-y-[-2px]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                كلية العلوم الإسلامية
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                برامج أكاديمية في الفقه المقارن، أصول الفقه، الحديث النبوي، التفسير والعقيدة، مع شهادات ودبلومات تخصصية معتمدة.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>تصفح المناهج والدورات</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Pillar 3 */}
          <div 
            onClick={() => onNavigate('library')}
            className="group p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer shadow-xl space-y-4 flex flex-col justify-between hover:translate-y-[-2px]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Library className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-blue-300 transition-colors">
                المكتبة والبحوث الرقمية
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                مكتبة رقمية شاملة تضم أمهات المصادر والمراجع، مع مساعد بحثي ذكي متخصص للإجابة على الاستفسارات العلمية والشرعية الموثقة.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400">
              <span>دخول المكتبة والباحث</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Pillar 4 */}
          <div 
            onClick={() => onNavigate('waqf')}
            className="group p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer shadow-xl space-y-4 flex flex-col justify-between hover:translate-y-[-2px]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">
                الأوقاف والمشاريع الخيرية
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                صناديق وقفية مستدامة لكفالة الحلقات والطلاب، ورعاية حفظة كتاب الله، وطباعة المصاحف الشريفة بنظام حوكمة وشفافية مالية تامة.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400">
              <span>المشاريع وحاسبة الزكاة</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SPIRITUAL GUIDANCE (Ayah & Hadith with Authentic Scholarly Exegesis)
          ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ayah of the Day */}
        <div className="bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>قبسٌ من نور الذكر الحكيم</span>
            </span>
            <span className="text-slate-400 font-mono">سورة فاطر: 29-30</span>
          </div>

          <p className="text-lg sm:text-2xl font-amiri text-amber-200 font-bold leading-loose text-center py-2">
            « إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنفَقُوا مِمَّا رَزَقْنَاهُمْ سِرًّا وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَّن تَبُورَ »
          </p>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-400 block mb-0.5">من هدايات الآية:</strong>
            تجارة أهل القرآن مع الله تجارة رابحة لا يعتريها بوار، ثمرتها مغفرة الذنوب ورفعة الدرجات في جنات النعيم.
          </div>
        </div>

        {/* Hadith of the Day */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>من هدي النبوة الشريفة</span>
            </span>
            <span className="text-slate-400 font-mono">صحيح البخاري</span>
          </div>

          <p className="text-lg sm:text-2xl font-amiri text-emerald-200 font-bold leading-loose text-center py-2">
            « خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ »
          </p>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-emerald-400 block mb-0.5">من معاني الحديث:</strong>
            أعظم الناس فضلاً وأشرفهم منزلة من جمع بين تلقي كتاب الله تعلماً وتدبراً، وبذله للناس تعليماً وتربية لوجه الله تعالى.
          </div>
        </div>

      </section>

      {/* =========================================================================
          GLOBAL INVITATION CTA: Ultra-Refined Global Card
          ========================================================================= */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/80 border border-amber-500/30 rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            انضم إلى قوافل حفظة كتاب الله ودارسي العلوم الشرعية
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            التسجيل مفتوح لكافة الأعمار والجنسيات حول العالم عبر مقرأة مجمع النور الإلكترونية. فصول صباحية ومسائية تناسب جميع التوقيتات الدولية.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
          <button
            onClick={() => onNavigate('register')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 cursor-pointer"
          >
            {t.btnRegister}
          </button>
          
          <button
            onClick={() => onNavigate('about')}
            className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm px-6 py-3.5 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all"
          >
            تعرف على فروعنا العالمية (120 دولة)
          </button>
        </div>
      </section>

    </div>
  );
};
