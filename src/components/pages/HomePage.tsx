import React, { useState, useRef } from 'react';
import { 
  BookOpen, GraduationCap, Library, HeartHandshake, Heart,
  Sparkles, Globe, Users, Award, Play, Pause, Volume2, 
  ArrowLeft, CheckCircle2, Star, ShieldCheck, ChevronRight,
  Radio, Mic, MessageCircle, Phone, Search, Compass, BookCheck, 
  Flame, Zap, Scroll, BookMarked, Eye, Download, Check, Headphones,
  Share2, Clock, Landmark, Feather, Layers, ArrowUpRight, Copy, ExternalLink, Video, Send
} from 'lucide-react';
import { NavigationPage, LibraryBook } from '../../types';
import { COMPLEX_INFO, FEATURED_SURAHS, RECITERS, OFFICIAL_COMPLEX_LOGO, LIBRARY_BOOKS } from '../../data/islamicData';
import { PWAInstallButton } from '../PWAInstallButton';
import { LiveMakkahQuranRadio } from '../LiveMakkahQuranRadio';
import { LuminousGlobalGlobe } from '../LuminousGlobalGlobe';
import { BookReaderModal } from '../BookReaderModal';
import { useLanguage } from '../../context/LanguageContext';

interface HomePageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenSearch?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const { lang, t, isRtl } = useLanguage();
  
  // Quran Section Interactive State
  const [selectedSurah, setSelectedSurah] = useState(FEATURED_SURAHS[0]);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'quran' | 'translations' | 'hadith' | 'fatwa' | 'orphans'>('all');

  // Noor Ambassador Quick Interactive Card in Home
  const [ambassadorLang, setAmbassadorLang] = useState<'en' | 'fr' | 'es' | 'id'>('en');
  const [copiedAmbassador, setCopiedAmbassador] = useState(false);

  // Multilingual Library State in Home
  const [activeLibraryLang, setActiveLibraryLang] = useState<string>('all');
  const [selectedBookForReading, setSelectedBookForReading] = useState<LibraryBook | null>(null);

  // Sudanese Voice Ad Quick Copy State
  const [copiedSudaneseAd, setCopiedSudaneseAd] = useState(false);
  const handleCopySudaneseAd = () => {
    const text = `يا هلا والله وحبابكم عشرة بلا كشرة يا أهلنا وعشيرتنا وسندنا في كل مكان!
يا زول يا أصيل.. يا باغي الخير والرفعة.. النفير قام وأهل المروءة والشهامة اتنادوا!
مجمع النور الإسلامي العالمي فتح بابه على مصراعيه للخير.. لكفالة أيتامنا، وحفظ كتاب الله، وبناء صرح النور العظيم!
النبي صلى الله عليه وسلم قال: «أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا»..
الحساب جاهز ومباشر:
بنك الخرطوم.. حساب رقم: 1727654 باسم الشيخ الهادي سالم - مدير مجمع النور الإسلامي العالمي الخيري الشامل!
مجمع النور الإسلامي العالمي.. نورٌ يهدي، وصرحٌ يبني أجيال القرآن!
🌐 www.mojamaalnor.com`;
    navigator.clipboard.writeText(text);
    setCopiedSudaneseAd(true);
    setTimeout(() => setCopiedSudaneseAd(false), 2000);
  };

  // Audio Playback for Quran Preview
  const toggleQuranAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.src = selectedReciter.sampleAudio;
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(console.warn);
    }
  };

  const handleReciterChange = (reciter: typeof RECITERS[0]) => {
    setSelectedReciter(reciter);
    if (audioRef.current) {
      audioRef.current.src = reciter.sampleAudio;
      if (isPlayingAudio) {
        audioRef.current.play().catch(console.warn);
      }
    }
  };

  // Quick navigation filter based on search
  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenSearch) {
      onOpenSearch();
      return;
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    if (q.includes('قرآن') || q.includes('مصحف') || q.includes('تلاوة') || q.includes('فاتحة') || q.includes('يس')) {
      onNavigate('quran');
    } else if (q.includes('ترجم') || q.includes('لغ') || q.includes('english') || q.includes('french')) {
      onNavigate('translationsReader');
    } else if (q.includes('سفير') || q.includes('بطاق') || q.includes('دعوة') || q.includes('نشر')) {
      onNavigate('noorAmbassador');
    } else if (q.includes('اسأل') || q.includes('سؤال') || q.includes('فتوى') || q.includes('شبه')) {
      onNavigate('discoverIslam');
    } else if (q.includes('يتيم') || q.includes('أيتام') || q.includes('كفال') || q.includes('عطاء')) {
      onNavigate('orphansCare');
    } else if (q.includes('حديث') || q.includes('سنة') || q.includes('بخاري') || q.includes('مسلم')) {
      onNavigate('hadith');
    } else if (q.includes('أكاديمية') || q.includes('دورة') || q.includes('تسميع') || q.includes('إجازة') || q.includes('مقرأة')) {
      onNavigate('academy');
    } else if (q.includes('عالم') || q.includes('شيخ') || q.includes('مقرئ')) {
      onNavigate('scholars');
    } else if (q.includes('إذاعة') || q.includes('مكة') || q.includes('راديو') || q.includes('بث')) {
      onNavigate('radio');
    } else if (q.includes('صوت') || q.includes('إعلان') || q.includes('سودان') || q.includes('حماسي')) {
      onNavigate('audioStudio');
    } else if (q.includes('api') || q.includes('بوابة') || q.includes('ربط') || q.includes('برمجة')) {
      onNavigate('apiGateway');
    } else {
      onNavigate('register');
    }
  };

  const ambassadorSnippets: Record<string, { title: string; quote: string; ref: string }> = {
    en: {
      title: 'The Purpose of Life & Compassion',
      quote: '"And We have not sent you, [O Muhammad], except as a mercy to the worlds."',
      ref: 'Noble Quran · Surah Al-Anbya 21:107'
    },
    fr: {
      title: 'Miséricorde pour l’Humanité',
      quote: '"Et Nous ne t\'avons envoyé qu\'en miséricorde pour l\'univers."',
      ref: 'Saint Coran · Sourate Al-Anbya 21:107'
    },
    es: {
      title: 'Misericordia para el Mundo',
      quote: '"Y no te hemos enviado sino como misericordia para todos los mundos."',
      ref: 'El Noble Corán · Sura Al-Anbya 21:107'
    },
    id: {
      title: 'Rahmat Bagi Seluruh Alam',
      quote: '"Dan Kami tidak mengutus engkau (Muhammad) melainkan untuk (menjadi) rahmat bagi seluruh alam."',
      ref: 'Al-Qur’an Al-Karim · Surah Al-Anbiya 21:107'
    }
  };

  const currentSnippet = ambassadorSnippets[ambassadorLang];

  const handleCopyAmbassadorSnippet = () => {
    navigator.clipboard.writeText(`${currentSnippet.title}\n\n${currentSnippet.quote}\n${currentSnippet.ref}\n\n— NOOR GLOBAL: A World of Light`);
    setCopiedAmbassador(true);
    setTimeout(() => setCopiedAmbassador(false), 2000);
  };

  return (
    <div className="space-y-16 sm:space-y-24 text-slate-100">
      
      {/* Hidden audio element for preview */}
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlayingAudio(false)} 
        onError={() => setIsPlayingAudio(false)} 
      />

      {/* =========================================================================
          1. FLAGSHIP HERO: NOOR GLOBAL – A WORLD OF LIGHT with Luminous 3D Globe
          ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0B132B] via-[#070D1E] to-[#050914] border border-[#D4AF37]/30 shadow-[0_10px_40px_rgba(0,0,0,0.7)] p-6 sm:p-12 lg:p-16 transition-colors">
        
        {/* Glow Gradients */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[130px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column (7 cols): Vision, Slogan, Search & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
            
            {/* Silicon Valley Grade Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111C3D] border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)] mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span>NOOR GLOBAL · A WORLD OF LIGHT</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">منظومة إسلامية عالمية موحدة</span>
            </div>

            {/* Institution Crest Lockup - Harmonious, Executive & Radiant */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
              <div className="relative shrink-0 flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-2 bg-gradient-to-tr from-[#111C3D] via-[#0B132B] to-[#1A2A54] border-2 border-[#D4AF37]/60 shadow-[0_0_30px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform">
                <img 
                  src={OFFICIAL_COMPLEX_LOGO} 
                  alt="شعار مجمع النور الإسلامي العالمي" 
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                  loading="eager"
                />
              </div>

              <div className="space-y-1.5 text-center lg:text-right">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-amiri text-white leading-tight tracking-wide">
                  مجمع النور الإسلامي العالمي
                </h1>
                <div className="text-xs sm:text-sm text-[#D4AF37] font-bold font-amiri tracking-wider">
                  «القرآن هداية، والعلم بناء، والعمل الخيري عطاء»
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  NOOR GLOBAL · A WORLD OF LIGHT (140+ دولة)
                </div>
              </div>
            </div>

            {/* High-level Description */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
              صرح إسلامي وتقني متقدم ينطلق من هدي مكة المكرمة ليربط أكثر من 140 دولة بالقرآن الكريم وترجماته الحية، أسانيد القراءات العشر، الرعاية الإنسانية الشاملة لكفالة الأيتام، وحوار الحضارات بلغات العالم.
            </p>

            {/* Comprehensive Silicon Valley Search Bar */}
            <form onSubmit={handleQuickSearchSubmit} className="max-w-2xl mx-auto lg:mx-0 relative pt-1">
              <div className="relative flex items-center">
                <Search className={`w-5 h-5 text-[#D4AF37] absolute ${isRtl ? 'right-4' : 'left-4'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في القرآن، 76 لغة ترجمة، الأحاديث، كفالة الأيتام، فتاوى العلماء..."
                  className={`w-full bg-[#070D1E]/90 border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-2xl py-3.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all shadow-lg ${
                    isRtl ? 'pr-12 pl-28' : 'pl-12 pr-28'
                  }`}
                />
                <button
                  type="submit"
                  className={`absolute ${isRtl ? 'left-2' : 'right-2'} bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D4AF37] text-[#070D1E] font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer`}
                >
                  بحث شامل
                </button>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 mt-2.5 text-[11px] text-slate-400">
                <span className="text-[#D4AF37] font-semibold">أبرز الوجهات:</span>
                <button type="button" onClick={() => onNavigate('translationsReader')} className="hover:text-white underline cursor-pointer">ترجمات 76 لغة</button>
                <span>•</span>
                <button type="button" onClick={() => onNavigate('orphansCare')} className="hover:text-white underline cursor-pointer">كفالة الأيتام</button>
                <span>•</span>
                <button type="button" onClick={() => onNavigate('noorAmbassador')} className="hover:text-white underline cursor-pointer">سفير النور</button>
                <span>•</span>
                <button type="button" onClick={() => onNavigate('discoverIslam')} className="hover:text-white underline cursor-pointer">اسأل عن الإسلام</button>
                <span>•</span>
                <button type="button" onClick={() => onNavigate('radio')} className="hover:text-white underline cursor-pointer">إذاعة مكة 24/7</button>
              </div>
            </form>

            {/* Action Buttons Matrix - 2-Level Executive Structure */}
            <div className="space-y-3 pt-2">
              {/* Row 1: The Two Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto lg:mx-0">
                <button
                  onClick={() => onNavigate('translationsReader')}
                  className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:scale-[1.02] text-[#070D1E] font-black py-3 px-5 rounded-2xl text-xs sm:text-sm shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-[#070D1E]" />
                  <span>تصفح المصحف وترجمات 76 لغة</span>
                </button>

                <button
                  onClick={() => onNavigate('orphansCare')}
                  className="flex items-center justify-center gap-2.5 bg-[#111C3D] hover:bg-[#1A2A54] hover:scale-[1.02] text-rose-300 font-black py-3 px-5 rounded-2xl text-xs sm:text-sm border-2 border-rose-500/40 shadow-lg transition-all cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-400 fill-current" />
                  <span>كفالة الأيتام (بنكك 1727654)</span>
                </button>
              </div>

              {/* Row 2: Secondary 4 Service Chips Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto lg:mx-0 text-xs">
                <button
                  onClick={() => onNavigate('dawahLibrary')}
                  className="p-2.5 rounded-xl bg-[#0B132B] hover:bg-[#111C3D] border border-[#D4AF37]/30 text-amber-300 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">المكتبة الدعوية 🎙️</span>
                </button>

                <button
                  onClick={() => onNavigate('radio')}
                  className="p-2.5 rounded-xl bg-[#0B132B] hover:bg-[#111C3D] border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="truncate">إذاعة مكة 24/7 🕋</span>
                </button>

                <button
                  onClick={() => onNavigate('audioStudio')}
                  className="p-2.5 rounded-xl bg-[#0B132B] hover:bg-[#111C3D] border border-amber-400/30 text-amber-200 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">الصوت السوداني 🇸🇩</span>
                </button>

                <button
                  onClick={() => onNavigate('noorAmbassador')}
                  className="p-2.5 rounded-xl bg-[#0B132B] hover:bg-[#111C3D] border border-[#D4AF37]/30 text-[#D4AF37] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="truncate">سفير النور 🌟</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Interactive 3D Canvas Globe Showcase */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[#070D1E]/80 border border-[#D4AF37]/30 p-2 shadow-2xl relative group overflow-hidden">
              <div className="p-3 pb-1 flex items-center justify-between border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-white">الشبكة العالمية التفاعلية المباشرة</span>
                </div>
                <span className="text-[10px] text-[#D4AF37] font-mono font-bold">13 عاصمة ومركزاً عالمياً</span>
              </div>
              
              {/* Luminous Interactive Globe Mount */}
              <div className="h-[460px] sm:h-[480px] w-full">
                <LuminousGlobalGlobe onNavigate={onNavigate} />
              </div>
            </div>
          </div>

        </div>

        {/* Real Quantitative Database Statistics (User Condition: إحصائيات حقيقية مستمدة من قاعدة البيانات) */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 mt-12 pt-8 border-t border-[#D4AF37]/20">
          
          <div className="p-4 bg-[#0B132B]/90 border border-[#D4AF37]/30 rounded-2xl text-center shadow-lg">
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#D4AF37]">
              140+
            </div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">دولة حول العالم</div>
          </div>

          <div className="p-4 bg-[#0B132B]/90 border border-[#D4AF37]/30 rounded-2xl text-center shadow-lg">
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              +{COMPLEX_INFO.totalStudents.toLocaleString()}
            </div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">طالب وطالبة مسجلون</div>
          </div>

          <div className="p-4 bg-[#0B132B]/90 border border-[#D4AF37]/30 rounded-2xl text-center shadow-lg">
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#D4AF37]">
              +{COMPLEX_INFO.graduatedHuffaz.toLocaleString()}
            </div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">حافظ وحافظة مجازون بالسند</div>
          </div>

          <div className="p-4 bg-[#0B132B]/90 border border-[#D4AF37]/30 rounded-2xl text-center shadow-lg">
            <div className="text-2xl sm:text-3xl font-black font-mono text-sky-400">
              76
            </div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">لغة ترجمة حية موثقة</div>
          </div>

          <div className="p-4 bg-[#0B132B]/90 border border-[#D4AF37]/30 rounded-2xl text-center shadow-lg">
            <div className="text-2xl sm:text-3xl font-black font-mono text-rose-400">
              1,280+
            </div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">يتيم مكفول رعاية شاملة</div>
          </div>

          <div className="p-4 bg-[#0B132B]/90 border border-[#D4AF37]/30 rounded-2xl text-center shadow-lg">
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
              24/7
            </div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">بث مباشر لإذاعة مكة</div>
          </div>

        </div>

      </section>


      {/* =========================================================================
          2. DUAL FLAGSHIP SPOTLIGHT: سفير النور (Ambassador) & اسأل عن الإسلام (Ask Islam)
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Spotlight 1: سفير النور (Noor Ambassador) */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0B132B] to-[#070D1E] border border-[#D4AF37]/40 p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#111C3D] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                <span>برنامج سفير النور العالمي</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">دعوة بلغات العالم</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black font-amiri text-white">
                كن سفيراً للنور وانشر رسالة القرآن
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                بطاقات دعوية عالمية مترجمة وموثقة مع آيات المحبة والسلام والتوحيد، جاهزة للنشر بضغطة زر واحدة عبر واتساب ومنصات التواصل.
              </p>
            </div>

            {/* Language Selector for Preview */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px]">اختر لغة المعاينة:</span>
              {(['en', 'fr', 'es', 'id'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setAmbassadorLang(l)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    ambassadorLang === l
                      ? 'bg-[#D4AF37] text-[#070D1E]'
                      : 'bg-[#111C3D] text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Interactive Card Preview */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#050914] border border-[#D4AF37]/30 text-right space-y-2 relative shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[11px] font-bold text-[#D4AF37]">{currentSnippet.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">NOOR AMBASSADOR</span>
              </div>
              <p className="text-sm sm:text-base font-serif italic text-slate-200 leading-relaxed">
                {currentSnippet.quote}
              </p>
              <div className="text-[11px] text-[#D4AF37] font-semibold">
                {currentSnippet.ref}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <button
              onClick={() => onNavigate('noorAmbassador')}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#070D1E] font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <span>دخول استوديو سفير النور الكامل</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={handleCopyAmbassadorSnippet}
              className="py-3 px-4 rounded-xl bg-[#111C3D] hover:bg-[#1E2E5D] text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              title="نسخ نص البطاقة"
            >
              {copiedAmbassador ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAmbassador ? 'تم النسخ!' : 'نسخ'}</span>
            </button>
          </div>
        </div>

        {/* Spotlight 2: اسأل عن الإسلام (Discover Islam / Helpline) */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0B132B] to-[#070D1E] border border-sky-400/40 p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#111C3D] text-sky-400 border border-sky-400/40 text-xs font-bold flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>منصة الحوار والإجابات المعتمدة</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>الخط الساخن متاح</span>
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black font-amiri text-white">
                اسأل عن الإسلام • Ask About Islam
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                إجابات موثقة ومحققة عن أركان الإيمان، حقيقة التوحيد، نبوة محمد ﷺ، ومكانة عيسى عليه السلام في القرآن الكريم، مدعومة بخط ساخن مباشر مع المشايخ عبر واتساب.
              </p>
            </div>

            {/* Quick Question Preview Badges */}
            <div className="space-y-2">
              <div 
                onClick={() => onNavigate('discoverIslam')}
                className="p-3 bg-[#050914] rounded-xl border border-slate-800 hover:border-sky-400/60 transition-all cursor-pointer flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-200">ما هو مفهوم التوحيد وخالقية الكون في الإسلام؟</span>
                <span className="text-[10px] text-sky-400">إجابة معتمدة ←</span>
              </div>

              <div 
                onClick={() => onNavigate('discoverIslam')}
                className="p-3 bg-[#050914] rounded-xl border border-slate-800 hover:border-sky-400/60 transition-all cursor-pointer flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-200">من هو عيسى ابن مريم عليه السلام في القرآن؟</span>
                <span className="text-[10px] text-sky-400">إجابة معتمدة ←</span>
              </div>
            </div>

            {/* Direct WhatsApp Helpline Card */}
            <div className="p-3 bg-[#111C3D] rounded-xl border border-[#D4AF37]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <span className="font-bold text-white block">خط المشايخ للإفتاء والاستفسارات:</span>
                  <span className="text-[11px] text-[#D4AF37] font-mono">+249 90 449 9914 (واتساب)</span>
                </div>
              </div>
              <a
                href="https://wa.me/249904499914?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%B3%D8%A4%D8%A7%D9%84%20%D8%B9%D9%86%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#25D366] text-slate-950 font-black text-xs flex items-center gap-1 shadow-md hover:scale-105 transition-transform"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>محادثة فورية</span>
              </a>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => onNavigate('discoverIslam')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <span>فتح بوابة الإجابات الشرعية الكاملة</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

      </section>


      {/* =========================================================================
          3. SCHOLARLY READING CLARITY (IVORY / PARCHMENT SURFACES)
             Adhering strictly to user prompt rule:
             "رابعاً: وضوح المادة العلمية - لا تجعل الخلفيات المظلمة تؤثر على قراءة القرآن
              والكتب، اعتمد خلفيات عاجية وبيضاء مريحة للقراءة في صفحات القرآن والمكتبة"
          ========================================================================= */}
      <section className="rounded-3xl scholarly-reading-paper p-6 sm:p-10 space-y-8 shadow-xl border border-[#D8CEBB]">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8CEBB] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#657568] flex items-center gap-1.5 uppercase">
              <BookOpen className="w-4 h-4 text-[#B9A477]" />
              <span>المصحف الإلكتروني الشريف • The Noble Quran</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#394E43]">
              تلاوة عطرة بالرسم العثماني المعتمد وتدبر الآيات
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('translationsReader')}
              className="px-4 py-2 rounded-xl bg-[#657568] text-white text-xs font-bold hover:bg-[#394E43] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>ترجمات القرآن (76 لغة)</span>
            </button>

            <button
              onClick={() => onNavigate('quran')}
              className="px-4 py-2 rounded-xl bg-[#394E43] text-[#F7F5EF] text-xs font-bold hover:bg-[#2E3F36] flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>المصحف الكامل (114 سورة)</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Interactive Quran Reader Box on Ivory Background */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-[#343832]">
          
          {/* Main Quran Verse Plate */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Surah Title Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F0EDE4] border border-[#D8CEBB]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#394E43] text-[#F7F5EF] font-bold text-xs flex items-center justify-center font-mono">
                  {selectedSurah.number}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#343832]">{selectedSurah.name}</h3>
                  <span className="text-[10px] text-[#657568]">{selectedSurah.englishName} • {selectedSurah.revelationType} • {selectedSurah.numberOfAyahs} آيات</span>
                </div>
              </div>

              {/* Reciter selector dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedReciter.id}
                  onChange={(e) => {
                    const r = RECITERS.find(x => x.id === e.target.value) || RECITERS[0];
                    handleReciterChange(r);
                  }}
                  className="text-xs bg-[#FAF8F2] border border-[#D8CEBB] text-[#343832] px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none"
                >
                  {RECITERS.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>

                <button
                  onClick={toggleQuranAudio}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-[#B9A477] text-white shadow-sm'
                      : 'bg-[#394E43] text-[#F7F5EF] hover:bg-[#2D3F36]'
                  }`}
                  title={isPlayingAudio ? 'إيقاف التلاوة' : 'استمع للتلاوة'}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
                </button>
              </div>
            </div>

            {/* Verses Preview Plate */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F2] border border-[#D8CEBB] text-center space-y-6">
              <div className="text-xl sm:text-2xl font-amiri font-bold text-[#394E43]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              <div className="space-y-4">
                {selectedSurah.sampleAyahs.slice(1, 5).map((ayah) => (
                  <div key={ayah.number} className="space-y-2 border-b border-[#E5DCCB] pb-3 last:border-none">
                    <p className="text-lg sm:text-xl font-amiri font-bold text-[#1E242B] leading-loose">
                      {ayah.text} <span className="text-[#B9A477] text-sm">﴿{ayah.number}﴾</span>
                    </p>
                    {ayah.tafsir && (
                      <p className="text-xs text-[#5E655B] leading-relaxed max-w-xl mx-auto">
                        <strong>التفسير الميسر:</strong> {ayah.tafsir}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Surah List Selector Sidebar */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#343832] block">
              اختر السورة الكريمة للتلاوة والتدبر:
            </span>

            <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar p-1">
              {FEATURED_SURAHS.map((surah) => {
                const isSelected = selectedSurah.number === surah.number;
                return (
                  <button
                    key={surah.number}
                    onClick={() => {
                      setSelectedSurah(surah);
                      setIsPlayingAudio(false);
                      if (audioRef.current) audioRef.current.pause();
                    }}
                    className={`w-full p-3 rounded-2xl text-right transition-all border flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#394E43] text-[#F7F5EF] border-[#B9A477]/40 shadow-xs'
                        : 'bg-[#F0EDE4] text-[#343832] border-[#E5DCCB] hover:bg-[#E5DCCB]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center font-mono ${
                        isSelected ? 'bg-[#2E3F36] text-[#B9A477]' : 'bg-[#FAF8F2] text-[#5E655B]'
                      }`}>
                        {surah.number}
                      </span>
                      <span className="text-xs font-bold">{surah.name}</span>
                    </div>
                    <span className="text-[10px] opacity-80">{surah.numberOfAyahs} آية</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-[#F0EDE4] rounded-2xl border border-[#E5DCCB] text-[11px] text-[#5E655B] flex items-center justify-between">
              <span>رواية المصحف: حفص عن عاصم</span>
              <span className="font-bold text-[#394E43]">الرسم العثماني المعتمد</span>
            </div>
          </div>

        </div>

      </section>


      {/* =========================================================================
          4. PROPHETIC SUNNAH & HADITH (Verified Isnad & Scholarly Analysis)
          ========================================================================= */}
      <section className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 uppercase">
              <Scroll className="w-4 h-4 text-[#D4AF37]" />
              <span>ديوان السنة النبوية المشرفة • The Prophetic Sunnah</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-white">
              حديث اليوم النبوي الموثق والكتب التسعة
            </h2>
          </div>

          <button
            onClick={() => onNavigate('hadith')}
            className="px-4 py-2 rounded-xl bg-[#111C3D] hover:bg-[#1E2E5D] text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/40 flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <span>استعراض موسوعة الحديث الكاملة</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Featured Hadith Plaque in scholarly readable ivory card */}
        <div className="p-6 sm:p-8 rounded-3xl scholarly-reading-paper border border-[#D8CEBB] space-y-4 shadow-lg text-[#343832]">
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CEBB] pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#394E43] text-[#F7F5EF] text-[11px] font-bold">
                صحيح البخاري • حديث رقم 5027
              </span>
              <span className="text-xs text-[#657568] font-semibold">
                كتاب فضائل القرآن
              </span>
            </div>
            <span className="text-[11px] text-[#657568] font-semibold">سند صحيح متفق عليه</span>
          </div>

          <div className="space-y-3 py-2 text-center">
            <p className="text-xs text-[#657568] font-mono">
              عَنْ عُثْمَانَ بْنِ عَفَّانَ رَضِيَ اللَّهُ عَنْهُ، عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ:
            </p>
            <p className="text-xl sm:text-2xl font-amiri font-bold text-[#1E242B] leading-relaxed max-w-2xl mx-auto">
              « خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ »
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0EDE4] border border-[#D8CEBB] text-xs text-[#5E655B] leading-relaxed">
            <strong className="text-[#343832]">الفوائد التربوية والعلمية:</strong> هذا الحديث أصلٌ عظيم في فضل الاشتغال بالقرآن الكريم تلاوةً وحفظاً وتدبراً وتعليماً، وهو الشعار المؤسسي الذي تقوم عليه مقارئ وحلقات مجمع النور الإسلامي في كل قارات العالم.
          </div>

        </div>

      </section>


      {/* =========================================================================
          5. ACADEMIC & HUMANITARIAN PILLARS (NOOR GLOBAL Flagship Grid)
          ========================================================================= */}
      <section className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-white">
              أركان المنصة والخدمات العالمية
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              منظومة متكاملة تجمع بين العلم الشرعي الأصيل، التكنولوجيا الحديثة، والعمل الإنساني.
            </p>
          </div>

          <button
            onClick={() => onNavigate('academy')}
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>استعراض كافة البرامج والأكاديميات</span>
            <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: كفالة الأيتام */}
          <div 
            onClick={() => onNavigate('orphansCare')}
            className="p-6 rounded-3xl bg-[#0B132B] border border-rose-500/30 hover:border-rose-400 cursor-pointer transition-all space-y-3 group shadow-lg hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h3 className="text-base font-bold text-white font-amiri group-hover:text-rose-300 transition-colors">
              كفالة الأيتام والرعاية الشاملة
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              برنامج كفالة تعليمية ومعيشية وصحية لأكثر من 1,280 يتيماً، مع إمكانية التسجيل ورفع المستندات والمتابعة عبر لوحة الإدارة.
            </p>
            <div className="pt-2 text-[11px] font-bold text-rose-400 flex items-center gap-1">
              <span>دخول بوابة الأيتام واستمارة التسجيل</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 2: ترجمات القرآن */}
          <div 
            onClick={() => onNavigate('translationsReader')}
            className="p-6 rounded-3xl bg-[#0B132B] border border-[#D4AF37]/30 hover:border-[#D4AF37] cursor-pointer transition-all space-y-3 group shadow-lg hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#D4AF37]">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-amiri group-hover:text-[#D4AF37] transition-colors">
              قارئ ترجمات القرآن بـ 76 لغة
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ربط مباشر مع مجمع الملك فهد لطباعة المصحف وQuranEnc، مع عرض المتن العثماني والترجمة المعتمدة لكل آية ورقمها.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#D4AF37] flex items-center gap-1">
              <span>تصفح الترجمات العالمية</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 3: المقارئ والأكاديمية */}
          <div 
            onClick={() => onNavigate('academy')}
            className="p-6 rounded-3xl bg-[#0B132B] border border-blue-500/30 hover:border-blue-400 cursor-pointer transition-all space-y-3 group shadow-lg hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-amiri group-hover:text-blue-300 transition-colors">
              أكاديمية النور والمقارئ المسندة
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              حلقات إلكترونية مباشرة لتحفيظ القرآن وتصحيح التلاوة ومنح إجازات بالسند المتصل بروايات القراءات العشر.
            </p>
            <div className="pt-2 text-[11px] font-bold text-blue-400 flex items-center gap-1">
              <span>التسجيل في المقارئ</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 4: المكتبة الإسلامية */}
          <div 
            onClick={() => onNavigate('library')}
            className="p-6 rounded-3xl bg-[#0B132B] border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-all space-y-3 group shadow-lg hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Library className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-amiri group-hover:text-emerald-300 transition-colors">
              المكتبة الرقمية والمخطوطات
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              مكتبة شاملة من أمهات المصنفات المحققة والرسائل العلمية في الفقه وأصوله والعقيدة وعلوم اللسان العربي.
            </p>
            <div className="pt-2 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <span>دخول المكتبة والتحميل</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 5: المهتدون الجدد */}
          <div 
            onClick={() => onNavigate('newMuslims')}
            className="p-6 rounded-3xl bg-[#0B132B] border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all space-y-3 group shadow-lg hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-amiri group-hover:text-cyan-300 transition-colors">
              الدعوة العالمية والمهتدون الجدد
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              تعريف غير المسلمين بالإسلام بأسلوب برهاني راقٍ، ودليل تعليم الصلاة والوضوء للمسلمين الجدد بعشر لغات.
            </p>
            <div className="pt-2 text-[11px] font-bold text-cyan-400 flex items-center gap-1">
              <span>بوابة الدعوة والمهتدين</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 6: الباحث العلمي الذكي */}
          <div 
            onClick={() => onNavigate('aiScholar')}
            className="p-6 rounded-3xl bg-[#0B132B] border border-purple-500/30 hover:border-purple-400 cursor-pointer transition-all space-y-3 group shadow-lg hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-amiri group-hover:text-purple-300 transition-colors">
              المساعد المعرفي الإسلامي الموثق
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              بحث أكاديمي ذكي مدعوم بنصوص الآيات والأحاديث الموثقة وضوابط الفتوى المعتمدة لدى هيئة كبار العلماء.
            </p>
            <div className="pt-2 text-[11px] font-bold text-purple-400 flex items-center gap-1">
              <span>طرح استفسار أو مسألة علمية</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          5.5 SUDANESE ENERGETIC MALE COMMERCIAL VOICE STUDIO SHOWCASE
          ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border-2 border-[#D4AF37]/50 bg-gradient-to-br from-[#0B132B] via-[#070D1E] to-[#111C3D] shadow-[0_10px_35px_rgba(212,175,55,0.25)] space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center lg:text-right max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111C3D] border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] shadow-sm">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>استوديو الصوت الإعلاني الحماسي 🇸🇩 (صوت رجل جهوري)</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black font-amiri text-white leading-tight">
              «يا هلا والله وحبابكم عشرة بلا كشرة يا أهلنا وعشيرتنا وسندنا!»
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              إعلان إذاعي تجاري ناري بطاقة متدفقة وصوت رجل سوداني جهوري فخم، يحث على نفير الخير وكفالة الأيتام ودعم مجمع النور عبر بنك الخرطوم حساب 1727654 باسم الشيخ الهادي سالم. جاهز للاستماع الفوري، التوليد بالذكاء الاصطناعي (Gemini TTS)، والتحميل والمشاركة.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('audioStudio')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#070D1E] font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 text-[#070D1E]" />
              <span>دخول استوديو الصوت الإعلاني 🎙️</span>
            </button>

            <button
              onClick={handleCopySudaneseAd}
              className="px-4 py-3 rounded-2xl bg-[#111C3D] hover:bg-[#1A2A54] border border-[#D4AF37]/40 text-slate-100 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              {copiedSudaneseAd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
              <span>{copiedSudaneseAd ? 'تم النسخ!' : 'نسخ النص الإعلاني'}</span>
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent('🎙️ *إعلان حماسي بصوت رجل سوداني جهوري لمجمع النور الإسلامي العالمي:*\n\n"يا هلا والله وحبابكم عشرة بلا كشرة يا أهلنا وعشيرتنا وسندنا في كل مكان! النفير قام وأهل المروءة اتنادوا.. بنك الخرطوم حساب 1727654 باسم الشيخ الهادي سالم.. مجمع النور الإسلامي العالمي!"\n\n🌐 https://www.mojamaalnor.com')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>مشاركة واتساب</span>
            </a>
          </div>
        </div>
      </section>


      {/* =========================================================================
          6. MULTILINGUAL ISLAMIC LIBRARY (خزانة الكتب الإسلامية باللغات العالمية)
          ========================================================================= */}
      <section className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 uppercase">
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>خزانة الكتب الإسلامية المحققة باللغات • Multilingual Islamic Library</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-white">
              قراءة وتحميل أمهات الكتب الإسلامية باللغات الحية
            </h2>
            <p className="text-xs text-slate-400">
              موسوعة معتمدة من كتب التفسير، الحديث، السيرة، والفقه بـ 9 لغات عالمية مع إمكانية القراءة التفاعلية الفورية وتحميل النسخ الأصلية PDF.
            </p>
          </div>

          <button
            onClick={() => onNavigate('library')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#070D1E] text-xs font-black flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-md hover:scale-105 transition-all"
          >
            <Library className="w-4 h-4 text-[#070D1E]" />
            <span>دخول المكتبة الرقمية الشاملة</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Language Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
          {[
            { code: 'all', label: 'جميع اللغات', flag: '🌐' },
            { code: 'ar', label: 'العربية', flag: '🇸🇦' },
            { code: 'en', label: 'English', flag: '🇬🇧' },
            { code: 'fr', label: 'Français', flag: '🇫🇷' },
            { code: 'es', label: 'Español', flag: '🇪🇸' },
            { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
            { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
            { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
            { code: 'ur', label: 'اردو', flag: '🇵🇰' },
            { code: 'ru', label: 'Русский', flag: '🇷🇺' },
          ].map(langTab => {
            const isSelected = activeLibraryLang === langTab.code;
            return (
              <button
                key={langTab.code}
                onClick={() => setActiveLibraryLang(langTab.code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#070D1E] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'bg-[#0B132B] text-slate-300 hover:text-white border border-slate-800 hover:border-[#D4AF37]/40'
                }`}
              >
                <span>{langTab.flag}</span>
                <span>{langTab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LIBRARY_BOOKS
            .filter(b => activeLibraryLang === 'all' || b.language === activeLibraryLang)
            .slice(0, 9)
            .map(book => (
              <div
                key={book.id}
                className="rounded-3xl bg-[#0B132B] border border-[#D4AF37]/30 hover:border-[#D4AF37] p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 group"
              >
                <div className="space-y-3">
                  
                  {/* Top Book Meta */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#111C3D] text-[#D4AF37] font-bold border border-[#D4AF37]/30 text-[11px]">
                      <span>{book.flag}</span>
                      <span>{book.languageLabel}</span>
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {book.pages} صفحة
                    </span>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 className="text-base font-bold text-white font-amiri group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {book.title}
                    </h3>
                    <div className="text-xs text-slate-400 font-medium mt-1">
                      المؤلف: <span className="text-slate-200">{book.author}</span>
                    </div>
                    {book.translator && (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        المترجم: <span className="text-slate-300">{book.translator}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {book.description}
                  </p>

                  {/* Category Pill */}
                  <div className="text-[10px] text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded-md inline-block">
                    {book.category}
                  </div>
                </div>

                {/* Book Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedBookForReading(book)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#111C3D] hover:bg-[#1E2E5D] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#D4AF37]/40 shadow-xs cursor-pointer transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>قراءة فورية</span>
                  </button>

                  {book.pdfUrl && (
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 border border-slate-700 shadow-xs cursor-pointer transition-all"
                      title="تحميل الكتاب بصيغة PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                  )}
                </div>

              </div>
            ))}
        </div>

      </section>


      {/* =========================================================================
          7. LIVE MAKKAH RADIO DECK
          ========================================================================= */}
      <LiveMakkahQuranRadio initialExpanded={true} dockedMode={false} />


      {/* =========================================================================
          7. DUAL SPOTLIGHT: Sudanese Voice Ad Studio & Cloud API Gateway
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Banner 1: Sudanese Enthusiastic Commercial Voiceover Studio */}
        <div className="rounded-3xl bg-[#0B132B] border border-[#D4AF37]/30 p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xl hover:border-[#D4AF37] transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#111C3D] text-[#D4AF37] text-xs font-bold flex items-center gap-1.5 border border-[#D4AF37]/40">
                <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>صوت إعلاني حماسي • بالعامية السودانية 🇸🇩</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                صوت رجالي جهوري مؤثر
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black font-amiri text-white">
                استوديو الصوت الإعلاني بالعامية السودانية
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                استمع وحمّل مقاطع صوتية إعلانية حماسية تلهب القلوب للالتحاق بمقارئ القرآن، نيل الإجازات المسندة، وسماع إذاعة مكة ليل ونهار، مع إمكانية معايرة الصوت وتسجيل صوتك الشخصي.
              </p>
            </div>

            {/* Sudanese Dialect Quote Box */}
            <div className="p-4 bg-[#050914] rounded-2xl border border-slate-800 text-xs font-amiri text-[#D4AF37] leading-loose">
              "يا زول يا طيب، مشتاق تحفظ كتاب الله إنت ووليداتك؟ مجمع النور فتح ليك الأبواب.. أبشروا بالخير يا جماعة الخير، النور نوركم والصرح صرحكم!"
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('audioStudio')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#070D1E] font-black text-xs shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
            >
              <Mic className="w-4 h-4 text-[#070D1E]" />
              <span>تشغيل الإعلان في الاستوديو</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => onNavigate('audioStudio')}
              className="px-4 py-3 rounded-2xl bg-[#111C3D] hover:bg-[#1A2A54] text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              عرض السيناريوهات الـ 5
            </button>
          </div>
        </div>

        {/* Banner 2: Enterprise API Gateway Architecture */}
        <div className="rounded-3xl bg-[#0B132B] border border-amber-500/30 p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xl hover:border-amber-400 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#111C3D] text-[#D4AF37] text-xs font-bold flex items-center gap-1.5 border border-[#D4AF37]/40">
                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>منظومة API والربط السحابي الموحد ⚡</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                OpenAPI 3.0 Ready
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black font-amiri text-white">
                بنية API التحتية لتطبيقات الويب والموبايل
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                طبقة مركزية عازلة لمفاتيح الأمان السرية، توفر حساب مواقيت الصلاة فلكياً، فهرس القرآن الموثق، الباحث الذكي بضوابط أهل السنة، وحزم SDK كاملة لتطبيقات Android وiOS.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 bg-[#050914] rounded-xl border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Circuit Breaker Resilience</span>
              </div>
              <div className="p-2.5 bg-[#050914] rounded-xl border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>0 Secrets in Frontend</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('apiGateway')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black text-xs shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>دخول لوحة تحكم API والمختبر التفاعلي</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

      </section>

      {/* Book Reader Modal */}
      <BookReaderModal
        book={selectedBookForReading}
        onClose={() => setSelectedBookForReading(null)}
      />

    </div>
  );
};
