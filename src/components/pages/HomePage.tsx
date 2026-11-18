import React, { useState, useRef } from 'react';
import {
  BookOpen, GraduationCap, Library, HeartHandshake, Heart,
  Sparkles, Globe, Play, Pause, Search, Compass, BookCheck,
  Flame, Zap, Scroll, Download, Check, Mic, MessageCircle,
  Phone, ChevronRight, Copy, Send, Landmark, ShieldCheck,
  CheckCircle2, Video, Building2, ArrowDown
} from 'lucide-react';
import { NavigationPage, LibraryBook } from '../../types';
import {
  COMPLEX_INFO, FEATURED_SURAHS, RECITERS,
  OFFICIAL_COMPLEX_LOGO, LIBRARY_BOOKS, OFFICIAL_DONATION_INFO
} from '../../data/islamicData';
import { CAMPUS_IMAGES } from '../../data/campusData';
import { DigitalCampusMap } from '../DigitalCampusMap';
import { LiveMakkahQuranRadio } from '../LiveMakkahQuranRadio';
import { BookReaderModal } from '../BookReaderModal';
import { useLanguage } from '../../context/LanguageContext';

interface HomePageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenSearch?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  // Quran Section Interactive State
  const [selectedSurah, setSelectedSurah] = useState(FEATURED_SURAHS[0]);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

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

  const scrollToCampusMap = () => {
    const el = document.getElementById('campus-map');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenSearch) {
      onOpenSearch();
      return;
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    if (q.includes('قرآن') || q.includes('مصحف') || q.includes('تلاوة')) {
      onNavigate('quran');
    } else if (q.includes('ترجم') || q.includes('translation')) {
      onNavigate('translationsReader');
    } else if (q.includes('يتيم') || q.includes('كفال') || q.includes('وقف') || q.includes('charity')) {
      onNavigate('waqf');
    } else if (q.includes('حديث') || q.includes('سنة') || q.includes('hadith')) {
      onNavigate('hadith');
    } else if (q.includes('بحث') || q.includes('research')) {
      onNavigate('researchCenter');
    } else if (q.includes('إعلام') || q.includes('media') || q.includes('radio')) {
      onNavigate('mediaCenter');
    } else if (q.includes('شراكة') || q.includes('دول') || q.includes('international')) {
      onNavigate('internationalRelations');
    } else {
      onNavigate('library');
    }
  };

  const ambassadorSnippets: Record<string, { title: string; quote: string; ref: string }> = {
    en: {
      title: 'The Purpose of Life & Compassion',
      quote: '"And We have not sent you, [O Muhammad], except as a mercy to the worlds."',
      ref: 'Noble Quran · Surah Al-Anbya 21:107',
    },
    fr: {
      title: 'Miséricorde pour l’Humanité',
      quote: '"Et Nous ne t\'avons envoyé qu\'en miséricorde pour l\'univers."',
      ref: 'Saint Coran · Sourate Al-Anbya 21:107',
    },
    es: {
      title: 'Misericordia para el Mundo',
      quote: '"Y no te hemos enviado sino como misericordia para todos los mundos."',
      ref: 'El Noble Corán · Sura Al-Anbya 21:107',
    },
    id: {
      title: 'Rahmat Bagi Seluruh Alam',
      quote: '"Dan Kami tidak mengutus engkau (Muhammad) melainkan untuk (menjadi) rahmat bagi seluruh alam."',
      ref: 'Al-Qur’an Al-Karim · Surah Al-Anbiya 21:107',
    },
  };

  const currentSnippet = ambassadorSnippets[ambassadorLang];

  const handleCopyAmbassadorSnippet = () => {
    navigator.clipboard.writeText(`${currentSnippet.title}\n\n${currentSnippet.quote}\n${currentSnippet.ref}\n\n— Al Noor Global Islamic Charitable Complex`);
    setCopiedAmbassador(true);
    setTimeout(() => setCopiedAmbassador(false), 2000);
  };

  return (
    <div className="space-y-14 sm:space-y-20">
      {/* Hidden audio element for Quran recitation preview */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingAudio(false)}
        onError={() => setIsPlayingAudio(false)}
      />

      {/* =========================================================================
          1. ARCHITECTURAL DIGITAL ISLAMIC CAMPUS ENTRANCE HERO (NO VIDEO)
          ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden border border-[#C8A24A]/50 shadow-2xl bg-[#022C22] text-[#FAF8F2]">
        {/* Architectural Courtyard Photography Backdrop (Zero Human Figures) */}
        <div className="relative min-h-[540px] sm:min-h-[600px] flex flex-col justify-between">
          <img
            src={CAMPUS_IMAGES.courtyardEntrance}
            alt="رحاب مجمع النور الإسلامي العالمي الخيري الشامل"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Deep Emerald Architectural Scrim for Crisp Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22] via-[#022C22]/80 to-[#064E3B]/70" />
          <div className="absolute inset-0 bg-islamic-pattern opacity-35 pointer-events-none" />

          {/* Main Entrance Content */}
          <div className="relative z-10 max-w-6xl mx-auto w-full px-5 sm:px-10 lg:px-14 pt-10 pb-8 sm:pt-14 sm:pb-10 space-y-8">
            {/* Crest Lockup + Bilingual Official Complex Identity */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 text-center lg:text-right">
              <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-2 bg-[#FAF8F2] border-2 border-[#C8A24A] shadow-[0_10px_35px_rgba(0,0,0,0.4)] flex items-center justify-center">
                <img
                  src={OFFICIAL_COMPLEX_LOGO}
                  alt="شعار مجمع النور الإسلامي العالمي"
                  className="w-full h-full object-contain"
                  loading="eager"
                />
              </div>

              <div className={`space-y-2.5 flex-1 ${isRtl ? 'lg:text-right' : 'lg:text-left'}`}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#064E3B]/90 border border-[#C8A24A]/60 text-xs font-bold text-[#E5C97B]">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Al Noor Global Islamic Charitable Complex</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-amiri text-white leading-tight drop-shadow-sm">
                  مجمع النور الإسلامي العالمي الخيري الشامل
                </h1>

                <p className="text-base sm:text-xl font-bold font-amiri text-[#E5C97B]">
                  لتحفيظ القرآن الكريم والعلوم الإسلامية
                </p>

                <p className="text-xs sm:text-sm text-[#E2EFEA] max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                  {isAr
                    ? 'صرح رقمي إسلامي عالمي متكامل المرافق، يجمع بين مجمع تحفيظ القرآن الكريم، ومعهد العلوم الشرعية، والمكتبة الرقمية، والأكاديمية التعليمية، ومركز البحوث، والمركز الخيري والإنساني، والعلاقات الدولية في بيئة معمارية موحدة.'
                    : 'A distinguished digital Islamic educational and charitable campus unifying Quran memorization, Islamic sciences, a global knowledge library, academic research, live media, international cooperation, and transparent humanitarian initiatives.'}
                </p>
              </div>
            </div>

            {/* Required Entrance Navigation Actions (6 Institutional Actions) */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={scrollToCampusMap}
                  className="px-6 py-3.5 rounded-2xl bg-[#C8A24A] hover:bg-[#DFBE68] text-[#022C22] font-black text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Landmark className="w-4 h-4" />
                  <span>{isAr ? 'دخول رحاب المجمع' : 'Enter the Complex'}</span>
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={scrollToCampusMap}
                  className="px-5 py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#047857] text-[#FAF8F2] border border-[#C8A24A]/60 font-bold text-sm flex items-center gap-2 shadow transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#E5C97B]" />
                  <span>{isAr ? 'استكشاف الأقسام والمباني' : 'Explore Our Departments'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('quran')}
                  className="p-3 rounded-xl bg-[#FAF8F2]/10 hover:bg-[#FAF8F2]/20 backdrop-blur-sm border border-[#C8A24A]/40 text-[#FAF8F2] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#E5C97B]" />
                  <span>{isAr ? 'مركز تعليم القرآن الكريم' : 'Quran Learning Center'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('library')}
                  className="p-3 rounded-xl bg-[#FAF8F2]/10 hover:bg-[#FAF8F2]/20 backdrop-blur-sm border border-[#C8A24A]/40 text-[#FAF8F2] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Library className="w-4 h-4 text-[#E5C97B]" />
                  <span>{isAr ? 'المكتبة المعرفية الإسلامية' : 'Islamic Knowledge Library'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('waqf')}
                  className="p-3 rounded-xl bg-[#FAF8F2]/10 hover:bg-[#FAF8F2]/20 backdrop-blur-sm border border-[#C8A24A]/40 text-[#FAF8F2] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4 text-[#E5C97B]" />
                  <span>{isAr ? 'المشاريع الخيرية والأوقاف' : 'Charitable Projects'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="p-3 rounded-xl bg-[#FAF8F2]/10 hover:bg-[#FAF8F2]/20 backdrop-blur-sm border border-[#C8A24A]/40 text-[#FAF8F2] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#E5C97B]" />
                  <span>{isAr ? 'عن مجمع النور' : 'About the Complex'}</span>
                </button>
              </div>
            </div>

            {/* Central Campus Search Bar */}
            <form onSubmit={handleQuickSearchSubmit} className="max-w-3xl">
              <div className="relative flex items-center">
                <Search className={`w-5 h-5 text-[#C8A24A] absolute ${isRtl ? 'right-4' : 'left-4'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isAr
                      ? 'ابحث داخل أقسام المجمع: القرآن، السنة، المكتبة، الأكاديمية، البحوث، أو كفالة الأيتام...'
                      : 'Search campus departments: Quran, Hadith, Library, Academy, Research, or Charity...'
                  }
                  className={`w-full bg-[#FAF8F2] text-[#0F2920] placeholder-[#5C746B] border-2 border-[#C8A24A]/60 focus:border-[#C8A24A] rounded-2xl py-3.5 text-xs sm:text-sm focus:outline-none shadow-lg ${
                    isRtl ? 'pr-12 pl-28' : 'pl-12 pr-28'
                  }`}
                />
                <button
                  type="submit"
                  className={`absolute ${isRtl ? 'left-2' : 'right-2'} bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer`}
                >
                  {isAr ? 'بحث المجمع' : 'Search'}
                </button>
              </div>
            </form>
          </div>

          {/* Verifiable Platform Structural Capabilities Bar (Zero Unverified Financial/Donation Counts) */}
          <div className="relative z-10 bg-[#022C22]/90 border-t border-[#C8A24A]/35 px-5 sm:px-10 py-5">
            <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { val: '8', labelAr: 'مبانٍ وأقسام مؤسسية', labelEn: 'Campus Departments' },
                { val: '114', labelAr: 'سورة بالمصحف الشريف', labelEn: 'Quranic Surahs' },
                { val: '76+', labelAr: 'لغة ترجمة قرآنية', labelEn: 'Translation Languages' },
                { val: '9', labelAr: 'مصنفات السنة التسعة', labelEn: 'Hadith Collections' },
                { val: '12', labelAr: 'لغة واجهة عالمية', labelEn: 'Portal Languages' },
                { val: '24/7', labelAr: 'إذاعة القرآن من مكة', labelEn: 'Makkah Live Radio' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2.5 rounded-xl bg-[#064E3B]/70 border border-[#C8A24A]/30 text-center"
                >
                  <div className="text-xl sm:text-2xl font-black font-mono text-[#E5C97B]">{item.val}</div>
                  <div className="text-[11px] font-semibold text-[#FAF8F2] mt-0.5">
                    {isAr ? item.labelAr : item.labelEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. INTERACTIVE DIGITAL ISLAMIC CAMPUS MAP (8 BUILDINGS / WINGS)
          ========================================================================= */}
      <DigitalCampusMap onNavigate={onNavigate} />

      {/* =========================================================================
          3. TRANSPARENT CHARITABLE WING & BANK OF KHARTOUM CHANNEL
          ========================================================================= */}
      <section className="rounded-3xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/35 p-6 sm:p-10 shadow-md space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#DDD6C7] dark:border-[#C8A24A]/25 pb-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] dark:text-[#E5C97B]">
              <HeartHandshake className="w-4 h-4" />
              <span>{isAr ? 'المركز الخيري والإنساني · الشفافية والأمانة المؤسسية' : 'Charitable & Humanitarian Center · Transparency Notice'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-amiri text-[#0F2920] dark:text-white">
              {isAr ? 'برامج كفالة الأيتام ودعم حلقات القرآن الكريم' : 'Orphan Care, Quran Student Support & Waqf Initiatives'}
            </h2>
            <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
              {isAr
                ? 'يعمل المركز الخيري على تنظيم طلبات كفالة الأيتام عبر استمارة التحقق الميداني وبوابة التتبع الإلكتروني، إلى جانب دعم طلاب القرآن والسلال الغذائية والأوقاف عبر القناة المصرفية المعتمدة.'
                : 'Our Humanitarian Center coordinates verified orphan sponsorship cases, Quran student stipends, and educational/food aid programs exclusively through audited official channels.'}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#022C22] border border-[#C8A24A]/50 space-y-2 shrink-0">
            <div className="text-[11px] font-bold text-[#064E3B] dark:text-[#E5C97B]">
              {OFFICIAL_DONATION_INFO.bankName}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono font-black text-[#064E3B] dark:text-white" dir="ltr">
                {OFFICIAL_DONATION_INFO.accountNumber}
              </span>
              <span className="text-xs font-bold text-[#38554B] dark:text-[#D1E7DD]">
                {OFFICIAL_DONATION_INFO.accountHolder}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('orphansCare')}
                className="px-3.5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold cursor-pointer"
              >
                {isAr ? 'بوابة كفالة الأيتام والتقديم' : 'Orphan Care Portal'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('waqf')}
                className="px-3.5 py-2 rounded-xl bg-[#EFECE3] dark:bg-[#064E3B] text-[#064E3B] dark:text-[#FAF8F2] border border-[#DDD6C7] dark:border-[#C8A24A]/35 text-xs font-bold cursor-pointer"
              >
                {isAr ? 'برامج الوقف وحاسبة الزكاة' : 'Waqf & Zakat Calculator'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SCHOLARLY READING CLARITY: NOBLE QURAN ON IVORY PAPER
          ========================================================================= */}
      <section className="rounded-3xl scholarly-reading-paper p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD6C7] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#064E3B] flex items-center gap-1.5 uppercase">
              <BookOpen className="w-4 h-4 text-[#B48D35]" />
              <span>المصحف الإلكتروني الشريف · The Noble Quran</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#064E3B]">
              {isAr ? 'تلاوة عطرة بالرسم العثماني المعتمد وتدبر الآيات' : 'Verified Uthmani Recitation & Tafsir Preview'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('translationsReader')}
              className="px-4 py-2 rounded-xl bg-[#047857] text-white text-xs font-bold hover:bg-[#064E3B] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isAr ? 'ترجمات القرآن (76 لغة)' : '76 Translations'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('quran')}
              className="px-4 py-2 rounded-xl bg-[#064E3B] text-[#FAF8F2] text-xs font-bold hover:bg-[#022C22] flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>{isAr ? 'المصحف الكامل (114 سورة)' : 'Full Mushaf (114 Surahs)'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-[#142B22]">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#EFECE3] border border-[#DDD6C7]">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#064E3B] text-[#FAF8F2] font-bold text-xs flex items-center justify-center font-mono">
                  {selectedSurah.number}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#064E3B]">{selectedSurah.name}</h3>
                  <span className="text-[11px] text-[#38554B]">{selectedSurah.englishName} · {selectedSurah.revelationType} · {selectedSurah.numberOfAyahs} آيات</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedReciter.id}
                  onChange={(e) => {
                    const r = RECITERS.find(x => x.id === e.target.value) || RECITERS[0];
                    handleReciterChange(r);
                  }}
                  aria-label="اختيار القارئ"
                  className="text-xs bg-[#FAF8F2] border border-[#DDD6C7] text-[#142B22] px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none"
                >
                  {RECITERS.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={toggleQuranAudio}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-[#C8A24A] text-[#022C22] shadow-sm'
                      : 'bg-[#064E3B] text-[#FAF8F2] hover:bg-[#022C22]'
                  }`}
                  title={isPlayingAudio ? 'إيقاف التلاوة' : 'استمع للتلاوة'}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#DDD6C7] text-center space-y-6">
              <div className="text-xl sm:text-2xl font-amiri font-bold text-[#064E3B]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              <div className="space-y-4">
                {selectedSurah.sampleAyahs.slice(1, 5).map((ayah) => (
                  <div key={ayah.number} className="space-y-2 border-b border-[#EFECE3] pb-3 last:border-none">
                    <p className="text-lg sm:text-xl font-amiri font-bold text-[#142B22] leading-loose">
                      {ayah.text} <span className="text-[#B48D35] text-sm">﴿{ayah.number}﴾</span>
                    </p>
                    {ayah.tafsir && (
                      <p className="text-xs text-[#38554B] leading-relaxed max-w-xl mx-auto">
                        <strong>التفسير الميسر:</strong> {ayah.tafsir}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-[#064E3B] block">
              {isAr ? 'اختر السورة الكريمة للتلاوة والتدبر:' : 'Select Surah to Recite:'}
            </span>

            <div className="space-y-2 max-h-80 overflow-y-auto p-1">
              {FEATURED_SURAHS.map((surah) => {
                const isSelected = selectedSurah.number === surah.number;
                return (
                  <button
                    key={surah.number}
                    type="button"
                    onClick={() => {
                      setSelectedSurah(surah);
                      setIsPlayingAudio(false);
                      if (audioRef.current) audioRef.current.pause();
                    }}
                    className={`w-full p-3 rounded-2xl text-right transition-all border flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#064E3B] text-[#FAF8F2] border-[#C8A24A]'
                        : 'bg-[#EFECE3] text-[#142B22] border-[#DDD6C7] hover:bg-[#E7E2D8]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center font-mono ${
                        isSelected ? 'bg-[#022C22] text-[#E5C97B]' : 'bg-[#FAF8F2] text-[#064E3B]'
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

            <div className="p-3 bg-[#EFECE3] rounded-2xl border border-[#DDD6C7] text-[11px] text-[#38554B] flex items-center justify-between">
              <span>رواية المصحف: حفص عن عاصم</span>
              <span className="font-bold text-[#064E3B]">الرسم العثماني المعتمد</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PROPHETIC SUNNAH & HADITH SHOWCASE
          ========================================================================= */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD6C7] dark:border-[#C8A24A]/30 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#064E3B] dark:text-[#C8A24A] flex items-center gap-1.5 uppercase">
              <Scroll className="w-4 h-4" />
              <span>ديوان السنة النبوية المشرفة · The Prophetic Sunnah</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#0F2920] dark:text-white">
              {isAr ? 'حديث اليوم النبوي الموثق والكتب التسعة' : 'Featured Verified Hadith & The Nine Canonical Collections'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('hadith')}
            className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#047857] dark:bg-[#C8A24A] dark:text-[#022C22] text-white text-xs font-bold flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <span>{isAr ? 'استعراض موسوعة الحديث الكاملة' : 'Open Hadith Encyclopedia'}</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl scholarly-reading-paper space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DDD6C7] pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#064E3B] text-[#FAF8F2] text-[11px] font-bold">
                صحيح البخاري · حديث رقم 5027
              </span>
              <span className="text-xs text-[#38554B] font-semibold">كتاب فضائل القرآن</span>
            </div>
            <span className="text-[11px] text-[#047857] font-bold">سند صحيح متفق عليه</span>
          </div>

          <div className="space-y-3 py-2 text-center">
            <p className="text-xs text-[#38554B] font-mono">
              عَنْ عُثْمَانَ بْنِ عَفَّانَ رَضِيَ اللَّهُ عَنْهُ، عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ:
            </p>
            <p className="text-xl sm:text-2xl font-amiri font-bold text-[#064E3B] leading-relaxed max-w-2xl mx-auto">
              « خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ »
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFECE3] border border-[#DDD6C7] text-xs text-[#38554B] leading-relaxed">
            <strong className="text-[#064E3B]">الفوائد التربوية والعلمية:</strong> هذا الحديث أصلٌ عظيم في فضل الاشتغال بالقرآن الكريم تلاوةً وحفظاً وتدبراً وتعليماً، وهو المنهج الذي تقوم عليه مقارئ وحلقات مجمع النور الإسلامي.
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. DUAL OUTREACH: NOOR AMBASSADOR & ASK ABOUT ISLAM
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Noor Ambassador */}
        <div className="rounded-3xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/35 p-6 sm:p-8 flex flex-col justify-between shadow-sm space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-[#EFECE3] dark:bg-[#022C22] text-[#064E3B] dark:text-[#E5C97B] border border-[#C8A24A]/40 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'برنامج سفير النور العالمي' : 'Noor Global Ambassador'}</span>
              </span>
              <span className="text-[11px] text-[#5C746B] dark:text-[#A3C4B8] font-mono">Multilingual Outreach</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#0F2920] dark:text-white">
                {isAr ? 'كن سفيراً للنور وانشر رسالة القرآن' : 'Share Verified Quranic Wisdom Globally'}
              </h3>
              <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] mt-1 leading-relaxed">
                {isAr
                  ? 'بطاقات دعوية عالمية مترجمة وموثقة بآيات المحبة والسلام والتوحيد، جاهزة للمشاركة الموثقة عبر لغات العالم.'
                  : 'Authentic multilingual wisdom cards translated into major world languages, ready to share with precision.'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#5C746B] dark:text-[#D1E7DD] text-[11px]">{isAr ? 'لغة المعاينة:' : 'Language:'}</span>
              {(['en', 'fr', 'es', 'id'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setAmbassadorLang(l)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    ambassadorLang === l
                      ? 'bg-[#064E3B] text-white dark:bg-[#C8A24A] dark:text-[#022C22]'
                      : 'bg-[#EFECE3] dark:bg-[#022C22] text-[#0F2920] dark:text-[#D1E7DD]'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F2] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/30 space-y-2" dir="ltr">
              <div className="flex items-center justify-between border-b border-[#DDD6C7] dark:border-[#C8A24A]/20 pb-2">
                <span className="text-[11px] font-bold text-[#064E3B] dark:text-[#E5C97B]">{currentSnippet.title}</span>
                <span className="text-[10px] text-[#5C746B] font-mono">NOOR AMBASSADOR</span>
              </div>
              <p className="text-sm sm:text-base font-serif italic text-[#0F2920] dark:text-white leading-relaxed">
                {currentSnippet.quote}
              </p>
              <div className="text-[11px] text-[#8C6D23] dark:text-[#C8A24A] font-semibold">
                {currentSnippet.ref}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('noorAmbassador')}
              className="flex-1 py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] dark:bg-[#C8A24A] dark:text-[#022C22] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isAr ? 'دخول استوديو سفير النور' : 'Open Ambassador Studio'}</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleCopyAmbassadorSnippet}
              className="py-3 px-4 rounded-xl bg-[#EFECE3] dark:bg-[#022C22] text-[#064E3B] dark:text-[#FAF8F2] border border-[#DDD6C7] dark:border-[#C8A24A]/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copiedAmbassador ? <Check className="w-4 h-4 text-[#047857]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAmbassador ? (isAr ? 'تم النسخ!' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Ask About Islam */}
        <div className="rounded-3xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/35 p-6 sm:p-8 flex flex-col justify-between shadow-sm space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-[#EFECE3] dark:bg-[#022C22] text-[#064E3B] dark:text-[#E5C97B] border border-[#C8A24A]/40 text-xs font-bold flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'منصة الحوار والإجابات المعتمدة' : 'Dialogue & Authenticated Answers'}</span>
              </span>
              <span className="text-[11px] text-[#047857] dark:text-[#34D399] font-bold">
                {isAr ? 'دعم مباشر' : 'Direct Helpline'}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#0F2920] dark:text-white">
                اسأل عن الإسلام · Ask About Islam
              </h3>
              <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] mt-1 leading-relaxed">
                {isAr
                  ? 'إجابات موثقة عن أركان الإيمان، حقيقة التوحيد، نبوة محمد ﷺ، ومكانة عيسى عليه السلام في القرآن الكريم.'
                  : 'Clear, source-grounded answers about monotheism, Prophethood, and foundational Islamic teachings with scholar support.'}
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('discoverIslam')}
                className="w-full p-3 bg-[#FAF8F2] dark:bg-[#022C22] rounded-xl border border-[#DDD6C7] dark:border-[#C8A24A]/30 hover:border-[#C8A24A] transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-[#0F2920] dark:text-white">ما هو مفهوم التوحيد وخالقية الكون في الإسلام؟</span>
                <span className="text-[11px] font-bold text-[#064E3B] dark:text-[#E5C97B]">إجابة معتمدة ←</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('discoverIslam')}
                className="w-full p-3 bg-[#FAF8F2] dark:bg-[#022C22] rounded-xl border border-[#DDD6C7] dark:border-[#C8A24A]/30 hover:border-[#C8A24A] transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-[#0F2920] dark:text-white">من هو عيسى ابن مريم عليه السلام في القرآن؟</span>
                <span className="text-[11px] font-bold text-[#064E3B] dark:text-[#E5C97B]">إجابة معتمدة ←</span>
              </button>
            </div>

            <div className="p-3 bg-[#EFECE3] dark:bg-[#022C22] rounded-xl border border-[#DDD6C7] dark:border-[#C8A24A]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#064E3B] dark:text-[#C8A24A]" />
                <div>
                  <span className="font-bold text-[#0F2920] dark:text-white block">{isAr ? 'خط المشايخ للاستفسارات:' : 'Scholar Inquiry Line:'}</span>
                  <span className="text-[11px] text-[#047857] dark:text-[#E5C97B] font-mono" dir="ltr">+249 90 449 9914</span>
                </div>
              </div>
              <a
                href="https://wa.me/249904499914?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%B3%D8%A4%D8%A7%D9%84%20%D8%B9%D9%86%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#064E3B] text-white font-bold text-xs flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'محادثة' : 'Chat'}</span>
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('discoverIslam')}
            className="w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] dark:bg-[#C8A24A] dark:text-[#022C22] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isAr ? 'فتح بوابة الإجابات الشرعية الكاملة' : 'Open Discover Islam Portal'}</span>
            <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </section>

      {/* =========================================================================
          7. GLOBAL ISLAMIC LIBRARY ARCHITECTURAL PREVIEW
          ========================================================================= */}
      <section className="space-y-6">
        <div className="rounded-3xl overflow-hidden bg-[#064E3B] text-white border border-[#C8A24A]/50 grid grid-cols-1 lg:grid-cols-12 shadow-lg">
          <div className="lg:col-span-5 h-56 lg:h-auto relative">
            <img
              src={CAMPUS_IMAGES.libraryHall}
              alt={isAr ? 'قاعة المكتبة الإسلامية العالمية' : 'Global Islamic Library Architectural Hall'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-[#064E3B] via-transparent to-transparent" />
          </div>
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-4">
            <span className="text-xs font-bold text-[#E5C97B] flex items-center gap-1.5">
              <Library className="w-4 h-4" />
              <span>خزانة الكتب الإسلامية المحققة باللغات · Global Islamic Library</span>
            </span>
            <h2 className="text-xl sm:text-3xl font-black font-amiri text-white">
              {isAr ? 'قراءة وتحميل أمهات الكتب الإسلامية باللغات الحية' : 'Read & Download Authentic Islamic Literature Worldwide'}
            </h2>
            <p className="text-xs sm:text-sm text-[#D1E7DD] leading-relaxed">
              {isAr
                ? 'موسوعة معتمدة من كتب التفسير، والحديث، والسيرة، والفقه بـ 9 لغات عالمية مع قارئ إلكتروني على خلفية عاجية مريحة وروابط PDF موثقة.'
                : 'Curated library spanning Tafsir, Hadith, Seerah, and Fiqh across 9+ languages with an ergonomic ivory book reader and legal PDF downloads.'}
            </p>
            <div>
              <button
                type="button"
                onClick={() => onNavigate('library')}
                className="px-5 py-2.5 rounded-xl bg-[#C8A24A] hover:bg-[#DFBE68] text-[#022C22] font-black text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Library className="w-4 h-4" />
                <span>{isAr ? 'دخول مبنى المكتبة الشاملة' : 'Enter Digital Library'}</span>
                <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Language Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
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
                type="button"
                onClick={() => setActiveLibraryLang(langTab.code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#064E3B] text-white dark:bg-[#C8A24A] dark:text-[#022C22]'
                    : 'bg-[#FFFFFF] dark:bg-[#04382B] text-[#0F2920] dark:text-[#D1E7DD] border border-[#DDD6C7] dark:border-[#C8A24A]/30'
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
            .slice(0, 6)
            .map(book => (
              <div
                key={book.id}
                className="rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 hover:border-[#C8A24A] p-5 shadow-sm flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#EFECE3] dark:bg-[#022C22] text-[#064E3B] dark:text-[#E5C97B] font-bold text-[11px]">
                      <span>{book.flag}</span>
                      <span>{book.languageLabel}</span>
                    </span>
                    <span className="text-[#5C746B] dark:text-[#A3C4B8] font-mono text-[11px]">
                      {book.pages} {isAr ? 'صفحة' : 'pp.'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#0F2920] dark:text-white font-amiri leading-snug">
                      {book.title}
                    </h3>
                    <div className="text-xs text-[#38554B] dark:text-[#D1E7DD] mt-1">
                      {isAr ? 'المؤلف:' : 'Author:'} <span className="font-semibold">{book.author}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#38554B] dark:text-[#D1E7DD]/90 leading-relaxed line-clamp-2">
                    {book.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFECE3] dark:border-[#C8A24A]/20 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBookForReading(book)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isAr ? 'قراءة فورية' : 'Read Online'}</span>
                  </button>

                  {book.pdfUrl && (
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-[#EFECE3] dark:bg-[#022C22] text-[#064E3B] dark:text-[#E5C97B] font-bold text-xs flex items-center justify-center gap-1 border border-[#DDD6C7] dark:border-[#C8A24A]/30 cursor-pointer"
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
          8. LIVE MAKKAH QURAN RADIO DECK
          ========================================================================= */}
      <LiveMakkahQuranRadio initialExpanded={true} dockedMode={false} />

      {/* =========================================================================
          9. MEDIA STUDIO & ENTERPRISE API ARCHITECTURE
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sudanese Energetic Male Commercial Voice Studio */}
        <div className="rounded-3xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/40 p-6 sm:p-8 flex flex-col justify-between gap-5 shadow-sm">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EFECE3] dark:bg-[#022C22] text-[#064E3B] dark:text-[#E5C97B] text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-[#B48D35]" />
              <span>استوديو الصوت الإعلاني بالعامية السودانية 🇸🇩</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#0F2920] dark:text-white">
              «يا هلا والله وحبابكم عشرة بلا كشرة يا أهلنا وعشيرتنا!»
            </h3>

            <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
              إعلانات إذاعية حماسية بصوت رجل سوداني جهوري مؤثر لدعم التحاق الطلاب بمقارئ القرآن الكريم وكفالة الأيتام عبر حساب بنك الخرطوم 1727654 باسم الشيخ الهادي سالم.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('audioStudio')}
              className="px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] dark:bg-[#C8A24A] dark:text-[#022C22] text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>دخول استوديو الصوت</span>
            </button>

            <button
              type="button"
              onClick={handleCopySudaneseAd}
              className="px-4 py-2.5 rounded-xl bg-[#EFECE3] dark:bg-[#022C22] text-[#0F2920] dark:text-white border border-[#DDD6C7] dark:border-[#C8A24A]/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSudaneseAd ? <Check className="w-4 h-4 text-[#047857]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSudaneseAd ? 'تم النسخ!' : 'نسخ النص'}</span>
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent('🎙️ إعلان مجمع النور الإسلامي العالمي - حساب بنك الخرطوم 1727654 باسم الشيخ الهادي سالم - www.mojamaalnor.com')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#047857] text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </a>
          </div>
        </div>

        {/* Cloud API Gateway Architecture */}
        <div className="rounded-3xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/40 p-6 sm:p-8 flex flex-col justify-between gap-5 shadow-sm">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EFECE3] dark:bg-[#022C22] text-[#064E3B] dark:text-[#E5C97B] text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-[#B48D35]" />
              <span>بوابة الأنظمة وواجهات API السحابية</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#0F2920] dark:text-white">
              بنية تقنية آمنة لخدمات المجمع وتطبيقات الهواتف
            </h3>

            <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
              طبقة خادم محمية لعزل مفاتيح التشفير، وتوفير مواقيت الصلاة الفلكية، وفهرس القرآن الموثق، والباحث العلمي الذكي عبر نقطة نهاية موحدة.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 bg-[#FAF8F2] dark:bg-[#022C22] rounded-xl border border-[#DDD6C7] dark:border-[#C8A24A]/25 text-[#0F2920] dark:text-[#D1E7DD] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399] shrink-0" />
                <span>Resilient API Gateway</span>
              </div>
              <div className="p-2.5 bg-[#FAF8F2] dark:bg-[#022C22] rounded-xl border border-[#DDD6C7] dark:border-[#C8A24A]/25 text-[#0F2920] dark:text-[#D1E7DD] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B48D35] shrink-0" />
                <span>Server-Side Guarded Keys</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('apiGateway')}
            className="w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] dark:bg-[#C8A24A] dark:text-[#022C22] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>{isAr ? 'دخول بوابة واجهات API والمطورين' : 'Open API Architecture Console'}</span>
          </button>
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
