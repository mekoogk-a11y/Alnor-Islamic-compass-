import React, { useState, useRef } from 'react';
import { 
  BookOpen, GraduationCap, Library, HeartHandshake, Heart,
  Sparkles, Globe, Users, Award, Play, Pause, Volume2, 
  ArrowLeft, CheckCircle2, Star, ShieldCheck, ChevronRight,
  Radio, Mic, MessageCircle, Phone, Search, Compass, BookCheck, 
  Flame, Zap, Scroll, BookMarked, Eye, Download, Check, Headphones,
  Share2, Clock, Landmark, Feather, Layers
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { COMPLEX_INFO, FEATURED_SURAHS, RECITERS } from '../../data/islamicData';
import { PWAInstallButton } from '../PWAInstallButton';
import { LiveMakkahQuranRadio } from '../LiveMakkahQuranRadio';
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

  // Search input
  const [searchQuery, setSearchQuery] = useState('');

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
    } else if (q.includes('مهتدي') || q.includes('جدد') || q.includes('دعوة') || q.includes('إسلام')) {
      onNavigate('newMuslims');
    } else if (q.includes('مكتبة') || q.includes('كتاب') || q.includes('مخطوط')) {
      onNavigate('library');
    } else if (q.includes('وقف') || q.includes('تبرع') || q.includes('زكاة') || q.includes('صدقة')) {
      onNavigate('waqf');
    } else {
      onNavigate('register');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* Hidden audio player for Quran preview */}
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlayingAudio(false)} 
        onError={() => setIsPlayingAudio(false)} 
      />

      {/* =========================================================================
          1. LUXURY EDITORIAL HERO: Calm, Dignified, Modern Islamic Architecture
          ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden bg-[#F0EDE4] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] p-8 sm:p-14 lg:p-20 shadow-sm transition-colors">
        
        {/* Subtle Sacred Geometry Watermark */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-60 pointer-events-none" />

        {/* Ambient Warm Architectural Light */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#E5DCCB]/40 dark:bg-[#343B31]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#657568]/10 dark:bg-[#B9A477]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          
          {/* Institutional Top Kicker */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F2] dark:bg-[#1F221E] border border-[#D8CEBB] dark:border-[#3A4237] text-xs font-semibold text-[#657568] dark:text-[#B9A477] shadow-2xs">
            <span>صرحٌ إسلامي وقفي شامل</span>
            <span aria-hidden="true" className="text-[#B9A477]">·</span>
            <span>اعتماد أكاديمي دولي</span>
            <span aria-hidden="true" className="text-[#B9A477]">·</span>
            <span>خدمات موثقة في 140 دولة</span>
          </div>

          {/* Official Emblem & Crest */}
          <div className="inline-block relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-[#394E43] p-1 shadow-sm border border-[#B9A477]/50 flex items-center justify-center">
              <div className="w-full h-full bg-[#394E43] rounded-[22px] flex items-center justify-center text-[#F7F5EF]">
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-[#B9A477] stroke-[2]" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#B9A477] border-2 border-[#F0EDE4] dark:border-[#272B25] flex items-center justify-center text-[10px] text-white font-bold shadow-xs">
              ★
            </div>
          </div>

          {/* Primary Slogan & Institution Title */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-amiri text-[#394E43] dark:text-[#F7F5EF] leading-tight tracking-wide">
              «نورٌ يهدي، وعلمٌ يبني»
            </h1>
            
            <p className="text-sm sm:text-base font-bold text-[#657568] dark:text-[#B9A477] tracking-wider uppercase">
              {t.complexName}
            </p>
          </div>

          {/* Official Description */}
          <p className="text-base sm:text-lg text-[#5E655B] dark:text-[#D8CEBB] max-w-2xl mx-auto leading-relaxed font-sans">
            منصة إسلامية عالمية لخدمة القرآن الكريم والعلوم الإسلامية ونشر المعرفة والدعوة إلى الله بمختلف لغات العالم.
          </p>

          {/* Global Search Bar */}
          <form onSubmit={handleQuickSearchSubmit} className="max-w-xl mx-auto relative pt-2">
            <div className="relative flex items-center">
              <Search className={`w-4 h-4 text-[#80887D] absolute ${isRtl ? 'right-4' : 'left-4'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في القرآن الكريم، الأحاديث، المقارئ، أو فتاوى العلماء..."
                className={`w-full bg-[#FAF8F2] dark:bg-[#1F221E] border border-[#D8CEBB] dark:border-[#3A4237] focus:border-[#394E43] dark:focus:border-[#B9A477] rounded-2xl py-3.5 text-xs sm:text-sm text-[#343832] dark:text-[#F7F5EF] placeholder-[#80887D] focus:outline-none transition-all shadow-xs ${
                  isRtl ? 'pr-11 pl-28' : 'pl-11 pr-28'
                }`}
              />
              <button
                type="submit"
                className={`absolute ${isRtl ? 'left-2' : 'right-2'} bg-[#394E43] hover:bg-[#2D3F36] text-[#F7F5EF] font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer border border-[#B9A477]/30`}
              >
                استكشاف
              </button>
            </div>
          </form>

          {/* Primary Action Buttons (Clear, unhurried, luxury buttons) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            
            {/* Primary Quran Button */}
            <button
              onClick={() => onNavigate('quran')}
              className="flex items-center gap-2.5 bg-[#394E43] hover:bg-[#2E3F36] text-[#F7F5EF] font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-sm transition-all border border-[#B9A477]/40 cursor-pointer hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4 text-[#B9A477]" />
              <span>تلاوة القرآن الكريم وتفسيره</span>
            </button>

            {/* Primary Library Button */}
            <button
              onClick={() => onNavigate('library')}
              className="flex items-center gap-2.5 bg-[#FAF8F2] dark:bg-[#1F221E] hover:bg-[#E5DCCB] dark:hover:bg-[#2C322A] text-[#343832] dark:text-[#F7F5EF] font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm border border-[#D8CEBB] dark:border-[#3A4237] transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <Library className="w-4 h-4 text-[#394E43] dark:text-[#B9A477]" />
              <span>المكتبة الإسلامية الرقمية</span>
            </button>

            {/* Multilingual Quran Translations Reader */}
            <button
              onClick={() => onNavigate('translationsReader')}
              className="flex items-center gap-2 bg-[#FAF8F2] dark:bg-[#1F221E] hover:bg-[#E5DCCB] dark:hover:bg-[#2C322A] text-[#394E43] dark:text-[#F7F5EF] font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm border border-[#D8CEBB] dark:border-[#3A4237] transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#394E43] dark:text-[#B9A477]" />
              <span>ترجمات القرآن الكريم 🌐</span>
            </button>

            {/* Orphans Care Program */}
            <button
              onClick={() => onNavigate('orphansCare')}
              className="flex items-center gap-2 bg-[#FAF8F2] dark:bg-[#1F221E] hover:bg-[#E5DCCB] dark:hover:bg-[#2C322A] text-[#394E43] dark:text-[#F7F5EF] font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm border border-[#B9A477]/50 transition-all cursor-pointer ring-1 ring-[#B9A477]/30"
            >
              <Heart className="w-4 h-4 text-red-600 fill-current" />
              <span>كفالة الأيتام 🤲</span>
            </button>

            {/* Live Makkah Radio Shortcut */}
            <button
              onClick={() => onNavigate('radio')}
              className="flex items-center gap-2 bg-[#FAF8F2] dark:bg-[#1F221E] hover:bg-[#E5DCCB] dark:hover:bg-[#2C322A] text-[#394E43] dark:text-[#B9A477] font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm border border-[#D8CEBB] dark:border-[#3A4237] transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4 text-[#394E43] dark:text-[#B9A477]" />
              <span>إذاعة مكة المباشرة 🕋</span>
            </button>

            {/* Sudanese Voice Ad Studio Shortcut */}
            <button
              onClick={() => onNavigate('audioStudio')}
              className="flex items-center gap-2 bg-[#394E43] hover:bg-[#2E3F36] text-[#F7F5EF] font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm border border-[#B9A477]/40 transition-all cursor-pointer shadow-sm"
            >
              <Mic className="w-4 h-4 text-[#B9A477]" />
              <span>استوديو الصوت الإعلاني 🇸🇩</span>
            </button>

            {/* API Architecture Shortcut */}
            <button
              onClick={() => onNavigate('apiGateway')}
              className="flex items-center gap-2 bg-[#FAF8F2] dark:bg-[#1F221E] hover:bg-[#E5DCCB] dark:hover:bg-[#2C322A] text-[#5E655B] dark:text-[#D8CEBB] font-semibold px-5 py-3.5 rounded-2xl text-xs sm:text-sm border border-[#D8CEBB] dark:border-[#3A4237] transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#B9A477]" />
              <span>بوابة API والربط السحابي</span>
            </button>

          </div>

        </div>

        {/* Global Impact Quantitative Grid (Refined, minimal, light champagne/cream) */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#E5DCCB] dark:border-[#3A4237]">
          
          <div className="p-4 bg-[#FAF8F2] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#3A4237] rounded-2xl text-center">
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#394E43] dark:text-[#F7F5EF]">
              +{COMPLEX_INFO.totalStudents.toLocaleString()}
            </div>
            <div className="text-xs text-[#5E655B] dark:text-[#D8CEBB] mt-1 font-semibold">{t.statsStudents}</div>
          </div>

          <div className="p-4 bg-[#FAF8F2] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#3A4237] rounded-2xl text-center">
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#B9A477]">
              +{COMPLEX_INFO.graduatedHuffaz.toLocaleString()}
            </div>
            <div className="text-xs text-[#5E655B] dark:text-[#D8CEBB] mt-1 font-semibold">{t.statsHuffaz}</div>
          </div>

          <div className="p-4 bg-[#FAF8F2] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#3A4237] rounded-2xl text-center">
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#394E43] dark:text-[#F7F5EF]">
              {COMPLEX_INFO.internationalBranchesCount}
            </div>
            <div className="text-xs text-[#5E655B] dark:text-[#D8CEBB] mt-1 font-semibold">{t.statsBranches}</div>
          </div>

          <div className="p-4 bg-[#FAF8F2] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#3A4237] rounded-2xl text-center">
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#657568] dark:text-[#A4B5A7]">
              {COMPLEX_INFO.activeTeachers}
            </div>
            <div className="text-xs text-[#5E655B] dark:text-[#D8CEBB] mt-1 font-semibold">{t.statsTeachers}</div>
          </div>

        </div>

      </section>


      {/* =========================================================================
          2. INSTITUTIONAL MISSION & VISION: رسالة المجمع ورؤيته وأهدافه
          ========================================================================= */}
      <section className="space-y-6">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#657568] dark:text-[#B9A477] uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5 text-[#B9A477]" />
            <span>الهوية المؤسسية والمنهج الأكاديمي</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-amiri text-[#394E43] dark:text-[#F7F5EF]">
            رسالة المجمع ورؤيته العالمية
          </h2>
          <p className="text-xs sm:text-sm text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
            منظومة وقفية تعليمية تعتمد منهج أهل السنة والجماعة بروح الوسطية والاتصال بالسند النبوي الشريف، واستثمار التقنيات الحديثة لخدمة الأمة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: الرسالة */}
          <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#394E43]/10 dark:bg-[#394E43]/30 flex items-center justify-center text-[#394E43] dark:text-[#B9A477]">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#343832] dark:text-[#F7F5EF] font-amiri">
              رسالتنا السامية
            </h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              إتقان حفظ كتاب الله وتجويده بالسند المتصل، ونشر علوم القرآن والحديث النبوي، وتقديم الفقه الميسر بمختلف لغات الأرض بالحكمة والموعظة الحسنة.
            </p>
          </div>

          {/* Card 2: الرؤية */}
          <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#B9A477]/15 dark:bg-[#B9A477]/25 flex items-center justify-center text-[#B9A477]">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#343832] dark:text-[#F7F5EF] font-amiri">
              رؤيتنا الدولية
            </h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              أن يكون مجمع النور المرجعية الرقمية والوقفية الرائدة عالمياً في تعليم القرآن الكريم وتخريج الحفاظ المتقنين المجازين بالقراءات المتواترة.
            </p>
          </div>

          {/* Card 3: الركائز والقيم */}
          <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#657568]/15 dark:bg-[#657568]/25 flex items-center justify-center text-[#657568] dark:text-[#A4B5A7]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#343832] dark:text-[#F7F5EF] font-amiri">
              الأصالة والإسناد
            </h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              صون الرواية والتلاوة عبر شيوخ مقرئين ذوي إجازات مسندة إلى رسول الله ﷺ، مع إتاحة التعليم مجاناً لوجه الله تعالى بدعم الأوقاف الإسلامية.
            </p>
          </div>

        </div>

      </section>


      {/* =========================================================================
          3. CORE SERVICES & SECTORS: بطاقات أنيقة للخدمات والأقسام
          ========================================================================= */}
      <section className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DCCB] dark:border-[#3A4237] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#394E43] dark:text-[#F7F5EF]">
              الأقسام الأكاديمية والخدمات الرقمية
            </h2>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] mt-1">
              خدمات تعليمية وبحثية شاملة لخدمة كتاب الله والسنة النبوية الشريفة.
            </p>
          </div>

          <button
            onClick={() => onNavigate('academy')}
            className="text-xs font-bold text-[#394E43] dark:text-[#B9A477] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>استعراض كافة البرامج والأكاديميات</span>
            <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: المصحف الشريف */}
          <div 
            onClick={() => onNavigate('quran')}
            className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] hover:border-[#394E43] dark:hover:border-[#B9A477] cursor-pointer transition-all space-y-3 group shadow-2xs hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#394E43]/10 dark:bg-[#394E43]/30 flex items-center justify-center text-[#394E43] dark:text-[#B9A477]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#343832] dark:text-[#F7F5EF] font-amiri group-hover:text-[#394E43] dark:group-hover:text-[#B9A477] transition-colors">
              المصحف الإلكتروني والتفاسير
            </h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              تصفح القرآن بالرسم العثماني المعتمد، مع تفاسير السعدي وابن كثير والطبري وترجمات دقيقة بـ 12 لغة.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#394E43] dark:text-[#B9A477] flex items-center gap-1">
              <span>دخول المصحف الشريف</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 2: السنة النبوية */}
          <div 
            onClick={() => onNavigate('hadith')}
            className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] hover:border-[#394E43] dark:hover:border-[#B9A477] cursor-pointer transition-all space-y-3 group shadow-2xs hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#657568]/15 dark:bg-[#657568]/30 flex items-center justify-center text-[#657568] dark:text-[#A4B5A7]">
              <Scroll className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#343832] dark:text-[#F7F5EF] font-amiri group-hover:text-[#394E43] dark:group-hover:text-[#B9A477] transition-colors">
              موسوعة السنة والكتب التسعة
            </h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              متون الأحاديث النبوية مخرجة ومحققة من صحيحي البخاري ومسلم وأمهات كتب السنة التسعة مع الشروح والفوائد.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#394E43] dark:text-[#B9A477] flex items-center gap-1">
              <span>تصفح موسوعة الحديث</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 3: المقارئ والأكاديمية */}
          <div 
            onClick={() => onNavigate('academy')}
            className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] hover:border-[#394E43] dark:hover:border-[#B9A477] cursor-pointer transition-all space-y-3 group shadow-2xs hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#B9A477]/15 dark:bg-[#B9A477]/30 flex items-center justify-center text-[#B9A477]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#343832] dark:text-[#F7F5EF] font-amiri group-hover:text-[#394E43] dark:group-hover:text-[#B9A477] transition-colors">
              أكاديمية النور والمقارئ المسندة
            </h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              حلقات إلكترونية مباشرة لتحفيظ القرآن وتصحيح التلاوة ومنح إجازات بالسند المتصل بروايات القراءات العشر.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#394E43] dark:text-[#B9A477] flex items-center gap-1">
              <span>التسجيل في المقارئ</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 4: المكتبة الإسلامية */}
          <div 
            onClick={() => onNavigate('library')}
            className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] hover:border-[#394E43] dark:hover:border-[#B9A477] cursor-pointer transition-all space-y-3 group shadow-2xs hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#394E43]/10 dark:bg-[#394E43]/30 flex items-center justify-center text-[#394E43] dark:text-[#B9A477]">
              <Library className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#343832] dark:text-[#F7F5EF] font-amiri group-hover:text-[#394E43] dark:group-hover:text-[#B9A477] transition-colors">
              المكتبة الرقمية والمخطوطات
            </h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              مكتبة شاملة من أمهات المصنفات المحققة والرسائل العلمية في الفقه وأصوله والعقيدة وعلوم اللسان العربي.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#394E43] dark:text-[#B9A477] flex items-center gap-1">
              <span>دخول المكتبة والتحميل</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 5: المهتدون الجدد والدعوة */}
          <div 
            onClick={() => onNavigate('newMuslims')}
            className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] hover:border-[#394E43] dark:hover:border-[#B9A477] cursor-pointer transition-all space-y-3 group shadow-2xs hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#657568]/15 dark:bg-[#657568]/30 flex items-center justify-center text-[#657568] dark:text-[#A4B5A7]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#343832] dark:text-[#F7F5EF] font-amiri group-hover:text-[#394E43] dark:group-hover:text-[#B9A477] transition-colors">
              الدعوة العالمية والمهتدون الجدد
            </h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              تعريف غير المسلمين بالإسلام بأسلوب برهاني راقٍ، ودليل تعليم الصلاة والوضوء للمسلمين الجدد بعشر لغات.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#394E43] dark:text-[#B9A477] flex items-center gap-1">
              <span>بوابة الدعوة والمهتدين</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 6: الباحث العلمي الذكي */}
          <div 
            onClick={() => onNavigate('aiScholar')}
            className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] hover:border-[#394E43] dark:hover:border-[#B9A477] cursor-pointer transition-all space-y-3 group shadow-2xs hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#B9A477]/15 dark:bg-[#B9A477]/30 flex items-center justify-center text-[#B9A477]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#343832] dark:text-[#F7F5EF] font-amiri group-hover:text-[#394E43] dark:group-hover:text-[#B9A477] transition-colors">
              المساعد المعرفي الإسلامي الموثق
            </h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              بحث أكاديمي ذكي مدعوم بنصوص الآيات والأحاديث الموثقة وضوابط الفتوى المعتمدة لدى هيئة كبار العلماء.
            </p>
            <div className="pt-2 text-[11px] font-bold text-[#394E43] dark:text-[#B9A477] flex items-center gap-1">
              <span>طرح استفسار أو مسألة علمية</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </div>
          </div>

        </div>

      </section>


      {/* =========================================================================
          4. THE HOLY QURAN SECTION: قسم القرآن الكريم والتلاوة العطرة
          ========================================================================= */}
      <section className="rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] p-6 sm:p-10 space-y-8 shadow-xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DCCB] dark:border-[#3A4237] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#657568] dark:text-[#B9A477] flex items-center gap-1.5 uppercase">
              <BookOpen className="w-4 h-4 text-[#B9A477]" />
              <span>المصحف الإلكتروني الشريف • The Noble Quran</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#394E43] dark:text-[#F7F5EF]">
              تلاوة عطرة وتدبر في آيات الذكر الحكيم
            </h2>
          </div>

          <button
            onClick={() => onNavigate('quran')}
            className="px-4 py-2 rounded-xl bg-[#394E43] hover:bg-[#2E3F36] text-[#F7F5EF] text-xs font-bold border border-[#B9A477]/40 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <span>فتح المصحف الكامل (114 سورة)</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Interactive Quran Reader Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Quran Verse Plate */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Surah Title Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#3A4237]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#394E43] text-[#F7F5EF] font-bold text-xs flex items-center justify-center font-mono">
                  {selectedSurah.number}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">{selectedSurah.name}</h3>
                  <span className="text-[10px] text-[#80887D]">{selectedSurah.englishName} • {selectedSurah.revelationType} • {selectedSurah.numberOfAyahs} آيات</span>
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
                  className="text-xs bg-[#FAF8F2] dark:bg-[#272B25] border border-[#D8CEBB] dark:border-[#3A4237] text-[#343832] dark:text-[#E5DCCB] px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none"
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
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F2] dark:bg-[#1F221E] border border-[#D8CEBB] dark:border-[#3A4237] text-center space-y-6">
              <div className="text-xl sm:text-2xl font-amiri font-bold text-[#394E43] dark:text-[#B9A477]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              <div className="space-y-4">
                {selectedSurah.sampleAyahs.slice(1, 5).map((ayah) => (
                  <div key={ayah.number} className="space-y-2 border-b border-[#E5DCCB]/60 dark:border-[#3A4237]/60 pb-3 last:border-none">
                    <p className="text-lg sm:text-xl font-amiri font-bold text-[#343832] dark:text-[#F7F5EF] leading-loose">
                      {ayah.text} <span className="text-[#B9A477] text-sm">﴿{ayah.number}﴾</span>
                    </p>
                    {ayah.tafsir && (
                      <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed max-w-xl mx-auto">
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
            <span className="text-xs font-bold text-[#343832] dark:text-[#F7F5EF] block">
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
                        : 'bg-[#F0EDE4] dark:bg-[#1F221E] text-[#343832] dark:text-[#D8CEBB] border-[#E5DCCB] dark:border-[#3A4237] hover:bg-[#E5DCCB] dark:hover:bg-[#2C322A]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center font-mono ${
                        isSelected ? 'bg-[#2E3F36] text-[#B9A477]' : 'bg-[#FAF8F2] dark:bg-[#272B25] text-[#5E655B]'
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

            <div className="p-3 bg-[#F0EDE4] dark:bg-[#1F221E] rounded-2xl border border-[#E5DCCB] dark:border-[#3A4237] text-[11px] text-[#5E655B] dark:text-[#D8CEBB] flex items-center justify-between">
              <span>رواية المصحف: حفص عن عاصم</span>
              <span className="font-bold text-[#394E43] dark:text-[#B9A477]">الرسم العثماني</span>
            </div>
          </div>

        </div>

      </section>


      {/* =========================================================================
          5. PROPHETIC SUNNAH & HADITH: قسم السنة النبوية الشريفة
          ========================================================================= */}
      <section className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DCCB] dark:border-[#3A4237] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#657568] dark:text-[#B9A477] flex items-center gap-1.5 uppercase">
              <Scroll className="w-4 h-4 text-[#B9A477]" />
              <span>ديوان السنة النبوية المشرفة • The Prophetic Sunnah</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#394E43] dark:text-[#F7F5EF]">
              حديث اليوم النبوي الموثق والكتب التسعة
            </h2>
          </div>

          <button
            onClick={() => onNavigate('hadith')}
            className="px-4 py-2 rounded-xl bg-[#FAF8F2] dark:bg-[#1F221E] hover:bg-[#E5DCCB] dark:hover:bg-[#2C322A] text-[#394E43] dark:text-[#B9A477] text-xs font-bold border border-[#D8CEBB] dark:border-[#3A4237] flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <span>استعراض موسوعة الحديث الكاملة</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Featured Hadith Plaque */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-4 shadow-xs">
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DCCB] dark:border-[#3A4237] pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#394E43] text-[#F7F5EF] text-[11px] font-bold">
                صحيح البخاري • حديث رقم 5027
              </span>
              <span className="text-xs text-[#657568] dark:text-[#B9A477] font-semibold">
                كتاب فضائل القرآن
              </span>
            </div>
            <span className="text-[11px] text-[#80887D]">سند صحيح متفق عليه</span>
          </div>

          <div className="space-y-3 py-2 text-center">
            <p className="text-xs text-[#80887D] font-mono">
              عَنْ عُثْمَانَ بْنِ عَفَّانَ رَضِيَ اللَّهُ عَنْهُ، عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ:
            </p>
            <p className="text-xl sm:text-2xl font-amiri font-bold text-[#394E43] dark:text-[#F7F5EF] leading-relaxed max-w-2xl mx-auto">
              « خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ »
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#3A4237] text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
            <strong className="text-[#343832] dark:text-[#F7F5EF]">الفوائد التربوية والعلمية:</strong> هذا الحديث أصلٌ عظيم في فضل الاشتغال بالقرآن الكريم تلاوةً وحفظاً وتدبراً وتعليماً، وهو الشعار المؤسسي الذي تقوم عليه مقارئ وحلقات مجمع النور الإسلامي في كل قارات العالم.
          </div>

        </div>

      </section>


      {/* =========================================================================
          6. TAFSIR & QURANIC SCIENCES: قسم التفسير وعلوم القرآن
          ========================================================================= */}
      <section className="space-y-6">
        
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#657568] dark:text-[#B9A477] uppercase tracking-wider">
            مباحث التنزيل وأصول الفهم
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#394E43] dark:text-[#F7F5EF]">
            التفسير وعلوم القرآن الكريم
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#394E43]/10 text-[#394E43] dark:text-[#B9A477] inline-block">
              أمهات التفاسير
            </span>
            <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">تفسير ابن كثير والسعدي</h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              تفسير القرآن بالقرآن وبالسنة وأقوال السلف مع بيان الأحكام العقدية والتربوية.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#657568]/15 text-[#657568] dark:text-[#A4B5A7] inline-block">
              أسباب النزول
            </span>
            <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">أسباب نزول الآيات</h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              فهم ملابسات الوقائع وسياق الخطاب القرآني استناداً إلى الروايات الصحيحة المعتمدة.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#B9A477]/20 text-[#394E43] dark:text-[#B9A477] inline-block">
              علم التجويد
            </span>
            <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">أحكام التجويد ومخارج الحروف</h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              شرح صوتي وتفاعلي للمتون الجزرية وتحفة الأطفال وضبط الصفات والمخارج بدقة.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#394E43]/10 text-[#394E43] dark:text-[#B9A477] inline-block">
              علم القراءات
            </span>
            <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">القراءات العشر المتواترة</h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              دراسة مقارنة لأوجه القراءات الصغرى والكبرى مع التوجيه اللغوي والإعرابي.
            </p>
          </div>

        </div>

      </section>


      {/* =========================================================================
          7. DIGITAL ISLAMIC LIBRARY: قسم المكتبة الإسلامية المحققة
          ========================================================================= */}
      <section className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DCCB] dark:border-[#3A4237] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#657568] dark:text-[#B9A477] flex items-center gap-1.5 uppercase">
              <Library className="w-4 h-4 text-[#B9A477]" />
              <span>المكتبة الإسلامية الرقمية والمخطوطات</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#394E43] dark:text-[#F7F5EF]">
              كنوز التراث الإسلامي والرسائل المحققة
            </h2>
          </div>

          <button
            onClick={() => onNavigate('library')}
            className="px-4 py-2 rounded-xl bg-[#394E43] hover:bg-[#2E3F36] text-[#F7F5EF] text-xs font-bold border border-[#B9A477]/40 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <span>استعراض كافة الكتب والمخطوطات</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] text-[#657568] dark:text-[#B9A477] font-bold">علوم القرآن</span>
              <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">الإتقان في علوم القرآن</h3>
              <p className="text-[11px] text-[#80887D]">للإمام جلال الدين السيوطي • طبعة محققة مع مقابلة النسخ الخطية</p>
            </div>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-bold text-[#394E43] dark:text-[#B9A477] hover:underline flex items-center gap-1 pt-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>قراءة وتحميل مجاني</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] text-[#657568] dark:text-[#B9A477] font-bold">علم التجويد</span>
              <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">شرح المقدمة الجزرية</h3>
              <p className="text-[11px] text-[#80887D]">لابن الجزري • تحقيق لجان الإقراء بمجمع النور</p>
            </div>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-bold text-[#394E43] dark:text-[#B9A477] hover:underline flex items-center gap-1 pt-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>قراءة وتحميل مجاني</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] text-[#657568] dark:text-[#B9A477] font-bold">الفقه المقارن</span>
              <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">بداية المجتهد ونهاية المقتصد</h3>
              <p className="text-[11px] text-[#80887D]">لابن رشد الحفيد • دراسة فقهية مقارنة بأدلة المذاهب الأربعة</p>
            </div>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-bold text-[#394E43] dark:text-[#B9A477] hover:underline flex items-center gap-1 pt-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>قراءة وتحميل مجاني</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] text-[#657568] dark:text-[#B9A477] font-bold">السيرة النبوية</span>
              <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">زاد المعاد في هدي خير العباد</h3>
              <p className="text-[11px] text-[#80887D]">للإمام ابن قيم الجوزية • مع تخريج الأحاديث وتحقيق الأعلام</p>
            </div>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-bold text-[#394E43] dark:text-[#B9A477] hover:underline flex items-center gap-1 pt-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>قراءة وتحميل مجاني</span>
            </button>
          </div>

        </div>

      </section>


      {/* =========================================================================
          8. GLOBAL DAWAH IN WORLD LANGUAGES: قسم الدعوة إلى الإسلام
          ========================================================================= */}
      <section className="rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] p-6 sm:p-10 space-y-6 shadow-xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DCCB] dark:border-[#3A4237] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#657568]/15 text-[#394E43] dark:text-[#B9A477] text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-[#B9A477]" />
              <span>قسم الدعوة العالمية • Global Dawah & New Muslims</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#394E43] dark:text-[#F7F5EF]">
              واحة النور للمهتدين الجدد والتعريف بالإسلام
            </h2>
          </div>

          <button
            onClick={() => onNavigate('newMuslims')}
            className="px-5 py-2.5 rounded-xl bg-[#394E43] hover:bg-[#2E3F36] text-[#F7F5EF] text-xs font-bold border border-[#B9A477]/40 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <span>دخول بوابة الدعوة والمهتدين</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div 
            onClick={() => onNavigate('newMuslims')}
            className="p-4 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#3A4237] space-y-2 cursor-pointer hover:border-[#394E43]"
          >
            <span className="text-[11px] font-bold text-[#394E43] dark:text-[#B9A477]">01. الدعوة بالإنجليزية</span>
            <h4 className="text-xs font-bold text-[#343832] dark:text-[#F7F5EF]">Discovering Islam & Monotheism</h4>
            <p className="text-[11px] text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              بيان التوحيد ورسالة النبي محمد ﷺ ومكانة عيسى عليه السلام في القرآن.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('newMuslims')}
            className="p-4 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#3A4237] space-y-2 cursor-pointer hover:border-[#394E43]"
          >
            <span className="text-[11px] font-bold text-[#657568] dark:text-[#A4B5A7]">02. الدعوة باللغات الحية</span>
            <h4 className="text-xs font-bold text-[#343832] dark:text-[#F7F5EF]">World Languages Portal</h4>
            <p className="text-[11px] text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              مواد تعريفية وترجمات معتمدة بالفرنسية، الإسبانية، الألمانية، والتركية.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('newMuslims')}
            className="p-4 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#3A4237] space-y-2 cursor-pointer hover:border-[#394E43]"
          >
            <span className="text-[11px] font-bold text-[#B9A477]">03. الفقه الميسر والوضوء</span>
            <h4 className="text-xs font-bold text-[#343832] dark:text-[#F7F5EF]">Interactive Prayer & Wudu</h4>
            <p className="text-[11px] text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              شرح تفاعلي مرئي لحركات وأذكار الصلاة الخمس والوضوء للمسلمين الجدد.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('newMuslims')}
            className="p-4 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#E5DCCB] dark:border-[#3A4237] space-y-2 cursor-pointer hover:border-[#394E43]"
          >
            <span className="text-[11px] font-bold text-[#394E43] dark:text-[#B9A477]">04. الحوار والتواصل المباشر</span>
            <h4 className="text-xs font-bold text-[#343832] dark:text-[#F7F5EF]">Live Dawah Support</h4>
            <p className="text-[11px] text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              جلسات حوارية خاصة للإجابة عن التساؤلات والشبهات مع دعاة متخصصين.
            </p>
          </div>

        </div>

      </section>


      {/* =========================================================================
          9. RECITATION CORRECTION & TEACHERS: صحيح القراءة ومعلمو القرآن
          ========================================================================= */}
      <section className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DCCB] dark:border-[#3A4237] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#657568] dark:text-[#B9A477] uppercase tracking-wider">
              المقارئ الإلكترونية الحية 24/7
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#394E43] dark:text-[#F7F5EF]">
              صحيح القراءة والتواصل مع معلمي القرآن
            </h2>
          </div>

          <button
            onClick={() => onNavigate('academy')}
            className="px-4 py-2 rounded-xl bg-[#394E43] hover:bg-[#2E3F36] text-[#F7F5EF] text-xs font-bold border border-[#B9A477]/40 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <span>حجز جلسة تسميع فورية</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#394E43] dark:text-[#B9A477]">
              <Headphones className="w-4 h-4 text-[#B9A477]" />
              <span>مقرأة التسميع المباشر</span>
            </div>
            <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">جلسات فردية مع مشايخ مجازين</h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              غرف افتراضية خاصة تمكن الطالب من التسميع وتصحيح مخارج الحروف وأحكام المد والإدغام بدقة متناهية.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#657568] dark:text-[#A4B5A7]">
              <Award className="w-4 h-4 text-[#B9A477]" />
              <span>برنامج الإجازة القرآنية</span>
            </div>
            <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">السند المتصل إلى النبي ﷺ</h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              ختم القرآن كاملاً غيباً عن ظهر قلب بإتقان تام لنيل شهادة الإجازة المعتمدة من هيئة الإقراء بمجمع النور.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#B9A477]">
              <Users className="w-4 h-4 text-[#B9A477]" />
              <span>حلقات مخصصة للنساء والناشئة</span>
            </div>
            <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">معلمات حافظات ومجازات</h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              بيئة تعليمية مخصصة للأخوات والبراعم الصغار مع مناهج تفاعلية تشجع على حب القرآن والاستمرار في حفظه.
            </p>
          </div>

        </div>

      </section>


      {/* =========================================================================
          10. LATEST PUBLICATIONS & SCHOLARLY EDITIONS: آخر الإضافات والإصدارات
          ========================================================================= */}
      <section className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DCCB] dark:border-[#3A4237] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#657568] dark:text-[#B9A477] uppercase tracking-wider">
              البحوث المحكمة وإصدارات المجمع
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#394E43] dark:text-[#F7F5EF]">
              آخر الإضافات والإصدارات العلمية
            </h2>
          </div>

          <button
            onClick={() => onNavigate('library')}
            className="text-xs font-bold text-[#394E43] dark:text-[#B9A477] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>أرشيف الإصدارات والبحوث</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3">
            <span className="text-[10px] text-[#80887D] block">ربيع الآخر 1447 هـ • العدد 28</span>
            <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">
              مجلة مجمع النور للدراسات القرآنية المحكمة
            </h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              عدد خاص يتناول مناهج أئمة القراءات في توجيه الفرش والرسم العثماني بمشاركة كبار علماء العالم الإسلامي.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3">
            <span className="text-[10px] text-[#80887D] block">طبعة جديدة فاخرة • 1447 هـ</span>
            <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">
              الدليل العملي لضبط أصول رواية الدوري عن أبي عمرو
            </h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              كتاب تطبيقي شامل لطلاب الإجازة بالسند المتصل مع جداول مقارنة وشروح لأوجه الإدغام الكبير والإمالة.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3">
            <span className="text-[10px] text-[#80887D] block">سلسلة الدعوة المعاصرة • إصدار رقم 14</span>
            <h3 className="text-sm font-bold text-[#343832] dark:text-[#F7F5EF]">
              أصول الحوار مع غير المسلمين في الغرب
            </h3>
            <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
              دراسة تأصيلية منهجية في أساليب المخاطبة العقلية والقرآنية المعاصرة لطلاب العلم والدعاة في المهجر.
            </p>
          </div>

        </div>

      </section>


      {/* =========================================================================
          11. LIVE MAKKAH RADIO DECK
          ========================================================================= */}
      <LiveMakkahQuranRadio initialExpanded={true} dockedMode={false} />


      {/* =========================================================================
          12. DUAL SPOTLIGHT: Sudanese Voice Ad Studio & Cloud API Gateway
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Banner 1: Sudanese Enthusiastic Commercial Voiceover Studio */}
        <div className="rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xs hover:border-[#394E43] dark:hover:border-[#B9A477] transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#657568]/15 text-[#394E43] dark:text-[#B9A477] text-xs font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#B9A477]" />
                <span>صوت إعلاني حماسي • بالعامية السودانية 🇸🇩</span>
              </span>
              <span className="text-[11px] font-mono text-[#80887D]">
                صوت رجالي جهوري مؤثر
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#394E43] dark:text-[#F7F5EF]">
                استوديو الصوت الإعلاني بالعامية السودانية
              </h3>
              <p className="text-xs sm:text-sm text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
                استمع وحمّل مقاطع صوتية إعلانية حماسية تلهب القلوب للالتحاق بمقارئ القرآن، نيل الإجازات المسندة، وسماع إذاعة مكة ليل ونهار، مع إمكانية معايرة الصوت وتسجيل صوتك الشخصي.
              </p>
            </div>

            {/* Sudanese Dialect Quote Box */}
            <div className="p-4 bg-[#F0EDE4] dark:bg-[#1F221E] rounded-2xl border border-[#D8CEBB] dark:border-[#3A4237] text-xs font-amiri text-[#394E43] dark:text-[#E5DCCB] leading-loose">
              "يا زول يا طيب، مشتاق تحفظ كتاب الله إنت ووليداتك؟ مجمع النور فتح ليك الأبواب.. أبشروا بالخير يا جماعة الخير، النور نوركم والصرح صرحكم!"
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('audioStudio')}
              className="px-5 py-3 rounded-2xl bg-[#394E43] hover:bg-[#2D3F36] text-[#F7F5EF] font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all border border-[#B9A477]/40"
            >
              <Mic className="w-4 h-4 text-[#B9A477]" />
              <span>تشغيل الإعلان في الاستوديو</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => onNavigate('audioStudio')}
              className="px-4 py-3 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] hover:bg-[#E5DCCB] text-[#343832] dark:text-[#D8CEBB] text-xs font-bold border border-[#D8CEBB] dark:border-[#3A4237] transition-colors"
            >
              عرض السيناريوهات الـ 5
            </button>
          </div>
        </div>

        {/* Banner 2: Enterprise API Gateway Architecture */}
        <div className="rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xs hover:border-[#394E43] dark:hover:border-[#B9A477] transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#B9A477]/15 text-[#394E43] dark:text-[#B9A477] text-xs font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#B9A477]" />
                <span>منظومة API والربط السحابي الموحد ⚡</span>
              </span>
              <span className="text-[11px] font-mono text-[#80887D]">
                OpenAPI 3.0 Ready
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#394E43] dark:text-[#F7F5EF]">
                بنية API التحتية لتطبيقات الويب والموبايل
              </h3>
              <p className="text-xs sm:text-sm text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
                طبقة مركزية عازلة لمفاتيح الأمان السرية، توفر حساب مواقيت الصلاة فلكياً، فهرس القرآن الموثق، الباحث الذكي بضوابط أهل السنة، وحزم SDK كاملة لتطبيقات Android وiOS.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 bg-[#F0EDE4] dark:bg-[#1F221E] rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] text-[#5E655B] dark:text-[#D8CEBB] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#657568] dark:text-[#B9A477] shrink-0" />
                <span>Circuit Breaker Resilience</span>
              </div>
              <div className="p-2.5 bg-[#F0EDE4] dark:bg-[#1F221E] rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] text-[#5E655B] dark:text-[#D8CEBB] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#394E43] dark:text-[#B9A477] shrink-0" />
                <span>0 Secrets in Frontend</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('apiGateway')}
              className="px-5 py-3 rounded-2xl bg-[#394E43] hover:bg-[#2D3F36] text-[#F7F5EF] font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all border border-[#B9A477]/40"
            >
              <Zap className="w-4 h-4 text-[#B9A477]" />
              <span>دخول لوحة تحكم API والمختبر التفاعلي</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};
