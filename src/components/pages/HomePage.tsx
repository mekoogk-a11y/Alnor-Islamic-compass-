import React, { useState, useRef, useMemo } from 'react';
import {
  BookOpen, Library, HeartHandshake, Sparkles, Globe,
  Play, Pause, Search, Compass, Scroll, Download, Check,
  Mic, MessageCircle, Phone, ChevronRight, Copy, Send,
  Landmark, ShieldCheck, CheckCircle2, Zap, Building2,
  ArrowDown, LayoutGrid
} from 'lucide-react';
import { NavigationPage, LibraryBook } from '../../types';
import {
  FEATURED_SURAHS, RECITERS, LIBRARY_BOOKS, OFFICIAL_DONATION_INFO
} from '../../data/islamicData';
import { CAMPUS_IMAGES } from '../../data/campusData';
import { PORTAL_SECTIONS, PortalSectionDef, PortalSectionGroup } from '../../data/portalSections';
import { DigitalCampusMap } from '../DigitalCampusMap';
import { LiveMakkahQuranRadio } from '../LiveMakkahQuranRadio';
import { BookReaderModal } from '../BookReaderModal';
import { IslamicGeometric3D } from '../IslamicGeometric3D';
import { Section3DCard } from '../Section3DCard';
import { useLanguage } from '../../context/LanguageContext';

interface HomePageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenSearch?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  // 3D Sections Explorer Filter & Search
  const [sectionGroup, setSectionGroup] = useState<'all' | PortalSectionGroup>('all');
  const [sectionFilterQuery, setSectionFilterQuery] = useState('');

  const filteredSections = useMemo(() => {
    const q = sectionFilterQuery.trim().toLowerCase();
    return PORTAL_SECTIONS.filter((sec) => {
      const matchesGroup = sectionGroup === 'all' || sec.group === sectionGroup;
      if (!matchesGroup) return false;
      if (!q) return true;
      return (
        sec.titleAr.toLowerCase().includes(q) ||
        sec.titleEn.toLowerCase().includes(q) ||
        sec.subtitleAr.toLowerCase().includes(q) ||
        sec.subtitleEn.toLowerCase().includes(q) ||
        sec.slug.toLowerCase().includes(q)
      );
    });
  }, [sectionGroup, sectionFilterQuery]);

  const handleSectionSelect = (section: PortalSectionDef) => {
    if (section.actionType === 'donation_modal') {
      window.dispatchEvent(new CustomEvent('alnoor:open-donation-modal'));
      return;
    }
    onNavigate(section.page);
  };

  // Quran Section Interactive State
  const [selectedSurah, setSelectedSurah] = useState(FEATURED_SURAHS[0]);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Hero Search Input State
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

  const scrollToSectionsGrid = () => {
    const el = document.getElementById('sections-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const matchedSection = PORTAL_SECTIONS.find(
      (s) =>
        s.titleAr.toLowerCase().includes(q) ||
        s.titleEn.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q)
    );
    if (matchedSection) {
      handleSectionSelect(matchedSection);
      return;
    }
    if (q.includes('قرآن') || q.includes('مصحف') || q.includes('تلاوة')) {
      onNavigate('quran');
    } else if (q.includes('ترجم') || q.includes('translation')) {
      onNavigate('translationsReader');
    } else if (q.includes('يتيم') || q.includes('كفال') || q.includes('وقف') || q.includes('charity')) {
      onNavigate('waqf');
    } else if (q.includes('حديث') || q.includes('سنة') || q.includes('hadith')) {
      onNavigate('hadith');
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

  const groupTabs: { id: 'all' | PortalSectionGroup; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'جميع الأقسام (26)', labelEn: 'All Sections (26)' },
    { id: 'primary', labelAr: 'القرآن والمنصات الرئيسية', labelEn: 'Quran & Core Hubs' },
    { id: 'academic', labelAr: 'الأكاديمية والعلوم والبحوث', labelEn: 'Academy & Sciences' },
    { id: 'outreach', labelAr: 'الدعوة والإعلام والحوار', labelEn: 'Dawah & Media' },
    { id: 'charity', labelAr: 'المشاريع الخيرية والأيتام', labelEn: 'Charity & Orphans' },
  ];

  const libraryLanguageFilters = [
    { id: 'all', label: isAr ? 'الكل' : 'All' },
    { id: 'ar', label: 'العربية' },
    { id: 'en', label: 'English' },
    { id: 'fr', label: 'Français' },
    { id: 'es', label: 'Español' },
    { id: 'ur', label: 'اردو' },
    { id: 'id', label: 'Indonesia' },
    { id: 'tr', label: 'Türkçe' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hidden audio element for Quran recitation preview */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingAudio(false)}
        onError={() => setIsPlayingAudio(false)}
      />

      {/* =========================================================================
          1. FUTURISTIC 3D SKY-BLUE ISLAMIC DIGITAL CAMPUS HERO
          ========================================================================= */}
      <section className="relative sky-card-3d rounded-[2rem] overflow-hidden">
        {/* Soft Atmospheric Sky Glow & Pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#87CEEB]/50 via-[#0EA5A4]/20 to-transparent blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-tl from-[#D4AF37]/25 via-[#87CEEB]/40 to-transparent blur-3xl"
        />
        <div className="absolute inset-0 bg-islamic-pattern opacity-35 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10 lg:px-14 pt-9 pb-7 sm:pt-12 sm:pb-10 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Hero Text & Institutional Actions */}
            <div className={`lg:col-span-8 space-y-5 text-center ${isRtl ? 'lg:text-right' : 'lg:text-left'}`}>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
                <Landmark className="w-4 h-4 text-[#D4AF37]" />
                <span>AL NOOR GLOBAL ISLAMIC CHARITABLE COMPLEX</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[#12345A] dark:text-[#EAF8FF]">www.mojamaalnor.com</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-black font-amiri text-[#12345A] dark:text-white leading-tight [text-wrap:balance]">
                مجمع النور الإسلامي العالمي الخيري الشامل لتحفيظ القرآن الكريم والعلوم الإسلامية
              </h1>

              <p className="text-sm sm:text-base text-[#2B547E] dark:text-[#B8DEF5] max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                {isAr
                  ? 'صرح رقمي إسلامي عالمي ثلاثي الأبعاد يجمع في فضاء واحد بين المصحف الإلكتروني الشريف، وعلوم القرآن والسنة، والمكتبة الرقمية متعددة اللغات، وأكاديمية التعليم، وبرامج كفالة الأيتام والأوقاف، وإذاعة القرآن من مكة.'
                  : 'A modern 3D digital Islamic complex unifying the Noble Quran Mushaf, Quranic & Prophetic sciences, a multilingual library, e-learning academy, verified orphan care & Waqf programs, and 24/7 Makkah Quran radio.'}
              </p>

              {/* Primary Hero Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <button
                  type="button"
                  onClick={scrollToSectionsGrid}
                  className="px-6 py-3.5 rounded-2xl bg-[#12345A] hover:bg-[#0D7A7A] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_12px_28px_-8px_rgba(18,52,90,0.45)] transition-all cursor-pointer"
                >
                  <LayoutGrid className="w-4 h-4 text-[#87CEEB]" />
                  <span>{isAr ? 'استكشاف أقسام المجمع (26 قسماً)' : 'Explore All 26 Sections'}</span>
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('quran')}
                  className="px-5 py-3.5 rounded-2xl bg-[#0EA5A4] hover:bg-[#0D7A7A] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isAr ? 'دخول المصحف الإلكتروني' : 'Open Noble Mushaf'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('alnoor:open-donation-modal'))}
                  className="px-5 py-3.5 rounded-2xl bg-[#FFFFFF] dark:bg-[#0F2747] hover:bg-[#EAF8FF] text-[#12345A] dark:text-[#EAF8FF] border border-[#D4AF37]/75 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isAr ? 'كفالة الأيتام (بنك الخرطوم 1727654)' : 'Support Orphans (#1727654)'}</span>
                </button>
              </div>

              {/* Central Complex Quick Search Bar */}
              <form onSubmit={handleQuickSearchSubmit} className="max-w-2xl mx-auto lg:mx-0 pt-2">
                <div className="relative flex items-center">
                  <Search className={`w-5 h-5 text-[#0D7A7A] dark:text-[#87CEEB] absolute ${isRtl ? 'right-4' : 'left-4'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isAr
                        ? 'ابحث في أقسام المجمع: القرآن، التفسير، الحديث، المكتبة، كفالة الأيتام...'
                        : 'Search campus departments: Quran, Tafsir, Hadith, Library, Charity...'
                    }
                    className={`w-full bg-[#FFFFFF] dark:bg-[#091B33] text-[#12345A] dark:text-[#EAF8FF] placeholder-[#4A7298] border border-[#87CEEB]/80 dark:border-[#87CEEB]/35 focus:border-[#0EA5A4] rounded-2xl py-3.5 text-xs sm:text-sm focus:outline-none shadow-sm ${
                      isRtl ? 'pr-12 pl-28' : 'pl-12 pr-28'
                    }`}
                  />
                  <button
                    type="submit"
                    className={`absolute ${isRtl ? 'left-2' : 'right-2'} bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer`}
                  >
                    {isAr ? 'بحث المجمع' : 'Search'}
                  </button>
                </div>
              </form>
            </div>

            {/* 3D Floating Islamic Geometric Centerpiece */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center gap-3">
              <IslamicGeometric3D />
              <button
                type="button"
                onClick={scrollToCampusMap}
                className="text-xs font-bold text-[#12345A] dark:text-[#87CEEB] hover:text-[#0EA5A4] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                <span>{isAr ? 'خريطة المجمع المعمارية التفاعلية (8 أجنحة)' : 'Interactive 8-Wing Campus Map'}</span>
              </button>
            </div>
          </div>

          {/* Verifiable Platform Structural Metrics Strip */}
          <div className="pt-5 border-t border-[#12345A]/10 dark:border-[#87CEEB]/20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { val: '26', labelAr: 'قسماً وخدمة رقمية', labelEn: 'Interactive Sections' },
              { val: '8', labelAr: 'مبانٍ وأجنحة مؤسسية', labelEn: 'Campus Pavilions' },
              { val: '114', labelAr: 'سورة بالمصحف الشريف', labelEn: 'Quranic Surahs' },
              { val: '76+', labelAr: 'لغة ترجمة قرآنية', labelEn: 'Translation Languages' },
              { val: '9', labelAr: 'مصنفات السنة التسعة', labelEn: 'Hadith Collections' },
              { val: '24/7', labelAr: 'إذاعة القرآن من مكة', labelEn: 'Makkah Live Radio' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="px-3 py-3 rounded-2xl bg-[#EAF8FF]/90 dark:bg-[#0F2747]/90 border border-white dark:border-[#87CEEB]/25 text-center shadow-sm"
              >
                <div className="text-xl sm:text-2xl font-black font-mono tabular-nums text-[#12345A] dark:text-[#87CEEB]">
                  {item.val}
                </div>
                <div className="text-[11px] font-bold text-[#2B547E] dark:text-[#B8DEF5] mt-0.5">
                  {isAr ? item.labelAr : item.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. 3D ICON-BASED SECTION EXPLORER GRID (ALL 26 COMPLEX SECTIONS)
          ========================================================================= */}
      <section id="sections-grid" className="space-y-6">
        <div className="sky-glass-panel rounded-3xl p-5 sm:p-8 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <span>{isAr ? 'دليل البوابات والأقسام ثلاثي الأبعاد' : '3D Section Architecture Directory'}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-amiri text-[#12345A] dark:text-white">
                {isAr ? 'اختر القسم المطلوب للدخول الفوري إلى خدماته' : 'Select Any Complex Wing to Launch Directly'}
              </h2>
            </div>

            {/* Live Section Search */}
            <div className="relative w-full lg:w-72">
              <Search className={`w-4 h-4 text-[#2B547E] dark:text-[#87CEEB] absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
              <input
                type="text"
                value={sectionFilterQuery}
                onChange={(e) => setSectionFilterQuery(e.target.value)}
                placeholder={isAr ? 'تصفية سريعة للأقسام...' : 'Filter sections...'}
                aria-label={isAr ? 'تصفية سريعة للأقسام' : 'Filter sections'}
                className={`w-full py-2.5 rounded-xl bg-white dark:bg-[#091B33] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 text-xs font-semibold text-[#12345A] dark:text-[#EAF8FF] placeholder-[#4A7298] focus:outline-none focus:border-[#0EA5A4] ${
                  isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'
                }`}
              />
            </div>
          </div>

          {/* Interactive Group Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {groupTabs.map((tab) => {
              const active = sectionGroup === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSectionGroup(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#12345A] text-white dark:bg-[#87CEEB] dark:text-[#091B33] shadow-sm'
                      : 'bg-white/85 dark:bg-[#0F2747] text-[#12345A] dark:text-[#B8DEF5] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 hover:border-[#0EA5A4]'
                  }`}
                >
                  {isAr ? tab.labelAr : tab.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Icon Cards Grid */}
        {filteredSections.length === 0 ? (
          <div className="sky-card-3d rounded-3xl p-8 text-center space-y-3">
            <p className="text-sm font-bold text-[#12345A] dark:text-[#EAF8FF]">
              {isAr ? 'لا توجد أقسام مطابقة لبحثك الحالي.' : 'No matching sections found.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSectionFilterQuery('');
                setSectionGroup('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#12345A] text-white text-xs font-bold cursor-pointer"
            >
              {isAr ? 'عرض جميع الأقسام' : 'Show All Sections'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredSections.map((sec) => (
              <Section3DCard
                key={sec.slug}
                section={sec}
                isAr={isAr}
                isRtl={isRtl}
                onSelect={handleSectionSelect}
              />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          3. INTERACTIVE DIGITAL ISLAMIC CAMPUS MAP (8 BUILDINGS / WINGS)
          ========================================================================= */}
      <DigitalCampusMap onNavigate={onNavigate} />

      {/* =========================================================================
          4. TRANSPARENT CHARITABLE WING & BANK OF KHARTOUM CHANNEL (1727654)
          ========================================================================= */}
      <section className="sky-card-3d rounded-3xl p-6 sm:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
              <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'المركز الخيري والإنساني · الشفافية والأمانة المؤسسية' : 'Charitable & Humanitarian Center · Transparency Notice'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-amiri text-[#12345A] dark:text-white">
              {isAr ? 'برامج كفالة الأيتام ودعم حلقات القرآن الكريم' : 'Orphan Care, Quran Student Support & Waqf Initiatives'}
            </h2>
            <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
              {isAr
                ? 'يعمل المركز الخيري على تنظيم طلبات كفالة الأيتام عبر استمارة التحقق الميداني وبوابة التتبع الإلكتروني، إلى جانب دعم طلاب القرآن والسلال الغذائية والأوقاف عبر القناة المصرفية المعتمدة.'
                : 'Our Humanitarian Center coordinates verified orphan sponsorship cases, Quran student stipends, and educational/food aid programs exclusively through audited official channels.'}
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#D4AF37]/60 space-y-3 shrink-0 shadow-sm">
            <div className="text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
              {OFFICIAL_DONATION_INFO.bankName}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-mono tabular-nums font-black text-[#12345A] dark:text-white" dir="ltr">
                {OFFICIAL_DONATION_INFO.accountNumber}
              </span>
              <span className="text-xs font-bold text-[#2B547E] dark:text-[#B8DEF5]">
                {OFFICIAL_DONATION_INFO.accountHolder}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('orphansCare')}
                className="px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0D7A7A] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                {isAr ? 'بوابة كفالة الأيتام والتقديم' : 'Orphan Care Portal'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('waqf')}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#0F2747] text-[#12345A] dark:text-[#EAF8FF] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 hover:border-[#0EA5A4] text-xs font-bold cursor-pointer transition-colors"
              >
                {isAr ? 'برامج الوقف وحاسبة الزكاة' : 'Waqf & Zakat Calculator'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SCHOLARLY READING CLARITY: NOBLE QURAN ON LUMINOUS SKY PAPER
          ========================================================================= */}
      <section className="rounded-3xl scholarly-reading-paper p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#87CEEB]/50 dark:border-[#87CEEB]/25 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>المصحف الإلكتروني الشريف · The Noble Quran</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white">
              {isAr ? 'تلاوة عطرة بالرسم العثماني المعتمد وتدبر الآيات' : 'Verified Uthmani Recitation & Tafsir Preview'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('translationsReader')}
              className="px-4 py-2 rounded-xl bg-[#0EA5A4] text-white text-xs font-bold hover:bg-[#0D7A7A] flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isAr ? 'ترجمات القرآن (76 لغة)' : '76 Translations'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('quran')}
              className="px-4 py-2 rounded-xl bg-[#12345A] text-white text-xs font-bold hover:bg-[#0A223D] flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
            >
              <span>{isAr ? 'المصحف الكامل (114 سورة)' : 'Full Mushaf (114 Surahs)'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#12345A] text-white font-bold text-xs flex items-center justify-center font-mono tabular-nums">
                  {selectedSurah.number}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#12345A] dark:text-white">{selectedSurah.name}</h3>
                  <span className="text-[11px] text-[#2B547E] dark:text-[#B8DEF5]">
                    {selectedSurah.englishName} · {selectedSurah.revelationType} · {selectedSurah.numberOfAyahs} آيات
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedReciter.id}
                  onChange={(e) => {
                    const r = RECITERS.find((x) => x.id === e.target.value) || RECITERS[0];
                    handleReciterChange(r);
                  }}
                  aria-label="اختيار القارئ"
                  className="text-xs bg-white dark:bg-[#0F2747] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 text-[#12345A] dark:text-[#EAF8FF] px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none"
                >
                  {RECITERS.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={toggleQuranAudio}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-[#D4AF37] text-[#12345A] shadow-sm'
                      : 'bg-[#12345A] text-white hover:bg-[#0EA5A4]'
                  }`}
                  title={isPlayingAudio ? 'إيقاف التلاوة' : 'استمع للتلاوة'}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#091B33] border border-[#87CEEB]/55 dark:border-[#87CEEB]/25 text-center space-y-6">
              <div className="text-xl sm:text-2xl font-amiri font-bold text-[#12345A] dark:text-[#87CEEB]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              <div className="space-y-4">
                {selectedSurah.sampleAyahs.slice(1, 5).map((ayah) => (
                  <div key={ayah.number} className="space-y-2 border-b border-[#EAF8FF] dark:border-[#87CEEB]/15 pb-3 last:border-none">
                    <p className="text-lg sm:text-xl font-amiri font-bold text-[#12345A] dark:text-white leading-loose">
                      {ayah.text} <span className="text-[#D4AF37] text-sm">﴿{ayah.number}﴾</span>
                    </p>
                    {ayah.tafsir && (
                      <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed max-w-xl mx-auto">
                        <strong>التفسير الميسر:</strong> {ayah.tafsir}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-[#12345A] dark:text-[#87CEEB] block">
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
                        ? 'bg-[#12345A] text-white border-[#D4AF37] shadow-md'
                        : 'bg-[#EAF8FF] dark:bg-[#091B33] text-[#12345A] dark:text-[#EAF8FF] border-[#87CEEB]/60 dark:border-[#87CEEB]/25 hover:border-[#0EA5A4]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center font-mono tabular-nums ${
                          isSelected ? 'bg-[#0EA5A4] text-white' : 'bg-white dark:bg-[#0F2747] text-[#12345A] dark:text-[#87CEEB]'
                        }`}
                      >
                        {surah.number}
                      </span>
                      <span className="text-xs font-bold">{surah.name}</span>
                    </div>
                    <span className="text-[10px] opacity-80 font-mono tabular-nums">{surah.numberOfAyahs} آية</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-[#EAF8FF] dark:bg-[#091B33] rounded-2xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 text-[11px] text-[#2B547E] dark:text-[#B8DEF5] flex items-center justify-between">
              <span>رواية المصحف: حفص عن عاصم</span>
              <span className="font-bold text-[#12345A] dark:text-[#87CEEB]">الرسم العثماني المعتمد</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. PROPHETIC SUNNAH & HADITH SHOWCASE
          ========================================================================= */}
      <section className="space-y-5">
        <div className="sky-glass-panel rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB] flex items-center gap-1.5">
              <Scroll className="w-4 h-4 text-[#D4AF37]" />
              <span>ديوان السنة النبوية المشرفة · The Prophetic Sunnah</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white">
              {isAr ? 'حديث اليوم النبوي الموثق والكتب التسعة' : 'Featured Verified Hadith & The Nine Canonical Collections'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('hadith')}
            className="px-4 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] dark:bg-[#D4AF37] dark:text-[#091B33] text-white text-xs font-bold flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-sm transition-colors"
          >
            <span>{isAr ? 'استعراض موسوعة الحديث الكاملة' : 'Open Hadith Encyclopedia'}</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl scholarly-reading-paper space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#87CEEB]/45 dark:border-[#87CEEB]/20 pb-3 text-xs">
            <div className="flex items-center gap-2 text-[#12345A] dark:text-[#EAF8FF] font-bold">
              <span>صحيح البخاري · حديث رقم 5027</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#2B547E] dark:text-[#B8DEF5] font-semibold">كتاب فضائل القرآن</span>
            </div>
            <span className="text-[11px] text-[#0D7A7A] dark:text-[#87CEEB] font-bold">سند صحيح متفق عليه</span>
          </div>

          <div className="space-y-3 py-2 text-center">
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
              عَنْ عُثْمَانَ بْنِ عَفَّانَ رَضِيَ اللَّهُ عَنْهُ، عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ:
            </p>
            <p className="text-xl sm:text-2xl font-amiri font-bold text-[#12345A] dark:text-white leading-relaxed max-w-2xl mx-auto">
              « خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ »
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            <strong className="text-[#12345A] dark:text-[#87CEEB]">الفوائد التربوية والعلمية:</strong> هذا الحديث أصلٌ عظيم في فضل الاشتغال بالقرآن الكريم تلاوةً وحفظاً وتدبراً وتعليماً، وهو المنهج الذي تقوم عليه مقارئ وحلقات مجمع النور الإسلامي.
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. DUAL OUTREACH: NOOR AMBASSADOR & ASK ABOUT ISLAM
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Noor Ambassador */}
        <div className="sky-card-3d rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0D7A7A] dark:text-[#87CEEB] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>{isAr ? 'برنامج سفير النور العالمي' : 'Noor Global Ambassador'}</span>
              </span>
              <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] font-mono">Multilingual Outreach</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white">
                {isAr ? 'كن سفيراً للنور وانشر رسالة القرآن' : 'Share Verified Quranic Wisdom Globally'}
              </h3>
              <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] mt-1 leading-relaxed">
                {isAr
                  ? 'بطاقات دعوية عالمية مترجمة وموثقة بآيات المحبة والسلام والتوحيد، جاهزة للمشاركة الموثقة عبر لغات العالم.'
                  : 'Authentic multilingual wisdom cards translated into major world languages, ready to share with precision.'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#2B547E] dark:text-[#B8DEF5] text-[11px]">{isAr ? 'لغة المعاينة:' : 'Language:'}</span>
              {(['en', 'fr', 'es', 'id'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setAmbassadorLang(l)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    ambassadorLang === l
                      ? 'bg-[#12345A] text-white dark:bg-[#87CEEB] dark:text-[#091B33]'
                      : 'bg-[#EAF8FF] dark:bg-[#091B33] text-[#12345A] dark:text-[#B8DEF5] border border-[#87CEEB]/50'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 space-y-2" dir="ltr">
              <div className="flex items-center justify-between border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-2">
                <span className="text-[11px] font-bold text-[#12345A] dark:text-[#87CEEB]">{currentSnippet.title}</span>
                <span className="text-[10px] text-[#4A7298] font-mono">NOOR AMBASSADOR</span>
              </div>
              <p className="text-sm sm:text-base font-serif italic text-[#12345A] dark:text-white leading-relaxed">
                {currentSnippet.quote}
              </p>
              <div className="text-[11px] text-[#0D7A7A] dark:text-[#D4AF37] font-semibold">
                {currentSnippet.ref}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('noorAmbassador')}
              className="flex-1 py-3 px-4 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>{isAr ? 'دخول استوديو سفير النور' : 'Open Ambassador Studio'}</span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleCopyAmbassadorSnippet}
              className="py-3 px-4 rounded-xl bg-[#EAF8FF] dark:bg-[#091B33] text-[#12345A] dark:text-[#EAF8FF] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copiedAmbassador ? <Check className="w-4 h-4 text-[#0EA5A4]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAmbassador ? (isAr ? 'تم النسخ!' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Ask About Islam */}
        <div className="sky-card-3d rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0D7A7A] dark:text-[#87CEEB] flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>{isAr ? 'منصة الحوار والإجابات المعتمدة' : 'Dialogue & Authenticated Answers'}</span>
              </span>
              <span className="text-[11px] text-[#12345A] dark:text-[#E5C97B] font-bold">
                {isAr ? 'دعم مباشر' : 'Direct Helpline'}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white">
                اسأل عن الإسلام · Ask About Islam
              </h3>
              <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] mt-1 leading-relaxed">
                {isAr
                  ? 'إجابات موثقة عن أركان الإيمان، حقيقة التوحيد، نبوة محمد ﷺ، ومكانة عيسى عليه السلام في القرآن الكريم.'
                  : 'Clear, source-grounded answers about monotheism, Prophethood, and foundational Islamic teachings with scholar support.'}
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('discoverIslam')}
                className="w-full p-3 bg-[#EAF8FF] dark:bg-[#091B33] rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 hover:border-[#0EA5A4] transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-[#12345A] dark:text-white">ما هو مفهوم التوحيد وخالقية الكون في الإسلام؟</span>
                <span className="text-[11px] font-bold text-[#0D7A7A] dark:text-[#87CEEB]">إجابة معتمدة ←</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('discoverIslam')}
                className="w-full p-3 bg-[#EAF8FF] dark:bg-[#091B33] rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 hover:border-[#0EA5A4] transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-[#12345A] dark:text-white">من هو عيسى ابن مريم عليه السلام في القرآن؟</span>
                <span className="text-[11px] font-bold text-[#0D7A7A] dark:text-[#87CEEB]">إجابة معتمدة ←</span>
              </button>
            </div>

            <div className="p-3 bg-[#EAF8FF] dark:bg-[#091B33] rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0D7A7A] dark:text-[#87CEEB]" />
                <div>
                  <span className="font-bold text-[#12345A] dark:text-white block">{isAr ? 'خط المشايخ للاستفسارات:' : 'Scholar Inquiry Line:'}</span>
                  <span className="text-[11px] text-[#0D7A7A] dark:text-[#E5C97B] font-mono tabular-nums" dir="ltr">+249 90 449 9914</span>
                </div>
              </div>
              <a
                href="https://wa.me/249904499914?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%B3%D8%A4%D8%A7%D9%84%20%D8%B9%D9%86%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#0EA5A4] hover:bg-[#0D7A7A] text-white font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'محادثة' : 'Chat'}</span>
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('discoverIslam')}
            className="w-full py-3 px-4 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>{isAr ? 'فتح بوابة الإجابات الشرعية الكاملة' : 'Open Discover Islam Portal'}</span>
            <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </section>

      {/* =========================================================================
          8. GLOBAL ISLAMIC LIBRARY ARCHITECTURAL PREVIEW
          ========================================================================= */}
      <section className="space-y-6">
        <div className="sky-card-3d rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 h-56 lg:h-full relative">
            <img
              src={CAMPUS_IMAGES.libraryHall}
              alt={isAr ? 'قاعة المكتبة الإسلامية العالمية' : 'Global Islamic Library Architectural Hall'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-[#12345A]/80 via-[#12345A]/20 to-transparent" />
          </div>
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-4">
            <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB] flex items-center gap-1.5">
              <Library className="w-4 h-4 text-[#D4AF37]" />
              <span>خزانة الكتب الإسلامية المحققة باللغات · Global Islamic Library</span>
            </span>
            <h2 className="text-xl sm:text-3xl font-black font-amiri text-[#12345A] dark:text-white">
              {isAr ? 'قراءة وتحميل أمهات الكتب الإسلامية باللغات الحية' : 'Read & Download Authentic Islamic Literature Worldwide'}
            </h2>
            <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
              {isAr
                ? 'موسوعة معتمدة من كتب التفسير، والحديث، والسيرة، والفقه بـ 9 لغات عالمية مع قارئ إلكتروني على خلفية هادئة مريحة وروابط PDF موثقة.'
                : 'Curated library spanning Tafsir, Hadith, Seerah, and Fiqh across 9+ languages with an ergonomic book reader and verified PDF downloads.'}
            </p>
            <div>
              <button
                type="button"
                onClick={() => onNavigate('library')}
                className="px-5 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <Library className="w-4 h-4 text-[#87CEEB]" />
                <span>{isAr ? 'دخول مبنى المكتبة الشاملة' : 'Enter Digital Library'}</span>
                <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Language Filter Tabs for Library */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {libraryLanguageFilters.map((langTab) => {
            const isSelected = activeLibraryLang === langTab.id;
            return (
              <button
                key={langTab.id}
                type="button"
                onClick={() => setActiveLibraryLang(langTab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#12345A] text-white dark:bg-[#87CEEB] dark:text-[#091B33] shadow-sm'
                    : 'bg-white/90 dark:bg-[#0F2747] text-[#12345A] dark:text-[#B8DEF5] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 hover:border-[#0EA5A4]'
                }`}
              >
                {langTab.label}
              </button>
            );
          })}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LIBRARY_BOOKS
            .filter((b) => activeLibraryLang === 'all' || b.language === activeLibraryLang)
            .slice(0, 6)
            .map((book) => (
              <div
                key={book.id}
                className="sky-card-3d rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                    <span className="font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
                      {book.languageLabel}
                    </span>
                    <span className="font-mono tabular-nums text-[11px]">
                      {book.pages} {isAr ? 'صفحة' : 'pp.'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#12345A] dark:text-white font-amiri leading-snug">
                      {book.title}
                    </h3>
                    <div className="text-xs text-[#2B547E] dark:text-[#B8DEF5] mt-1">
                      {isAr ? 'المؤلف:' : 'Author:'} <span className="font-semibold">{book.author}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]/90 leading-relaxed line-clamp-2">
                    {book.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBookForReading(book)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isAr ? 'قراءة فورية' : 'Read Online'}</span>
                  </button>

                  {book.pdfUrl && (
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-[#EAF8FF] dark:bg-[#091B33] text-[#12345A] dark:text-[#87CEEB] font-bold text-xs flex items-center justify-center gap-1 border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 cursor-pointer"
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
          9. LIVE MAKKAH QURAN RADIO DECK
          ========================================================================= */}
      <LiveMakkahQuranRadio initialExpanded={true} dockedMode={false} />

      {/* =========================================================================
          10. MEDIA STUDIO & ENTERPRISE API ARCHITECTURE
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sudanese Energetic Male Commercial Voice Studio */}
        <div className="sky-card-3d rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
              <Mic className="w-4 h-4 text-[#D4AF37]" />
              <span>استوديو الصوت الإعلاني بالعامية السودانية</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white">
              «يا هلا والله وحبابكم عشرة بلا كشرة يا أهلنا وعشيرتنا!»
            </h3>

            <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
              إعلانات إذاعية حماسية بصوت رجل سوداني جهوري مؤثر لدعم التحاق الطلاب بمقارئ القرآن الكريم وكفالة الأيتام عبر حساب بنك الخرطوم 1727654 باسم الشيخ الهادي سالم.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('audioStudio')}
              className="px-4 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Mic className="w-4 h-4" />
              <span>دخول استوديو الصوت</span>
            </button>

            <button
              type="button"
              onClick={handleCopySudaneseAd}
              className="px-4 py-2.5 rounded-xl bg-[#EAF8FF] dark:bg-[#091B33] text-[#12345A] dark:text-[#EAF8FF] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSudaneseAd ? <Check className="w-4 h-4 text-[#0EA5A4]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSudaneseAd ? 'تم النسخ!' : 'نسخ النص'}</span>
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent('🎙️ إعلان مجمع النور الإسلامي العالمي - حساب بنك الخرطوم 1727654 باسم الشيخ الهادي سالم - www.mojamaalnor.com')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#0EA5A4] hover:bg-[#0D7A7A] text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </a>
          </div>
        </div>

        {/* Cloud API Gateway Architecture */}
        <div className="sky-card-3d rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span>بوابة الأنظمة وواجهات API السحابية</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white">
              بنية تقنية آمنة لخدمات المجمع وتطبيقات الهواتف
            </h3>

            <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
              طبقة خادم محمية لعزل مفاتيح التشفير، وتوفير مواقيت الصلاة الفلكية، وفهرس القرآن الموثق، والباحث العلمي الذكي عبر نقطة نهاية موحدة.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 bg-[#EAF8FF] dark:bg-[#091B33] rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-[#EAF8FF] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5A4] shrink-0" />
                <span>Resilient API Gateway</span>
              </div>
              <div className="p-2.5 bg-[#EAF8FF] dark:bg-[#091B33] rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-[#EAF8FF] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Server-Side Guarded Keys</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('apiGateway')}
            className="w-full py-3 px-4 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Zap className="w-4 h-4 text-[#87CEEB]" />
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
