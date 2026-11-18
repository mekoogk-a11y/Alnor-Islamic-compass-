/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PWAInstallButton } from './components/PWAInstallButton';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { FloatingDonationWidget } from './components/FloatingDonationWidget';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthModal } from './components/AuthModal';
import { DepartmentBreadcrumb } from './components/DepartmentBreadcrumb';
import { PrayerTimesBar } from './components/PrayerTimesBar';
import { LiveMakkahQuranRadio } from './components/LiveMakkahQuranRadio';

// Pages
import { HomePage } from './components/pages/HomePage';
import { QuranPage } from './components/pages/QuranPage';
import { HadithPage } from './components/pages/HadithPage';
import { AcademyPage } from './components/pages/AcademyPage';
import { ScholarsDirectoryPage } from './components/pages/ScholarsDirectoryPage';
import { IslamicAIScholarPage } from './components/pages/IslamicAIScholarPage';
import { CommunityPage } from './components/pages/CommunityPage';
import { UserDashboardPage } from './components/pages/UserDashboardPage';
import { AdminDashboardPage } from './components/pages/AdminDashboardPage';
import { SciencesPage } from './components/pages/SciencesPage';
import { LibraryPage } from './components/pages/LibraryPage';
import { WaqfPage } from './components/pages/WaqfPage';
import { AboutPage } from './components/pages/AboutPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { NewMuslimsPage } from './components/pages/NewMuslimsPage';
import { SudaneseAudioStudioPage } from './components/pages/SudaneseAudioStudioPage';
import { OrphansCarePage } from './components/pages/OrphansCarePage';
import { QuranTranslationsReaderPage } from './components/pages/QuranTranslationsReaderPage';
import { ApiGatewayPage } from './components/pages/ApiGatewayPage';
import { NoorAmbassadorPage } from './components/pages/NoorAmbassadorPage';
import { DiscoverIslamPage } from './components/pages/DiscoverIslamPage';
import { DawahLibraryPage } from './components/pages/DawahLibraryPage';
import { ResearchCenterPage } from './components/pages/ResearchCenterPage';
import { MediaCenterPage } from './components/pages/MediaCenterPage';
import { InternationalRelationsPage } from './components/pages/InternationalRelationsPage';
import { ContactPage } from './components/pages/ContactPage';

import { NavigationPage } from './types';
import { COMPLEX_INFO, OFFICIAL_COMPLEX_LOGO } from './data/islamicData';
import { CAMPUS_BUILDINGS } from './data/campusData';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import {
  Globe, Mail, MapPin, Sparkles, ChevronLeft,
  WifiOff, Laptop, Phone, MessageCircle, Radio, Mic, Zap,
  Copy, Check, ExternalLink, Building2
} from 'lucide-react';

function MainAppContent() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [pageParams, setPageParams] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const isOnline = useOnlineStatus();
  const { lang, t, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const handleCopyDomain = () => {
    navigator.clipboard.writeText('www.mojamaalnor.com');
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2500);
  };

  const handleNavigate = (page: NavigationPage, params?: any) => {
    setCurrentPage(page);
    setPageParams(params || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic SEO document title per active portal section
  useEffect(() => {
    const pageTitlesAr: Record<NavigationPage, string> = {
      home: 'الرئيسية · الصرح الرقمي',
      quran: 'مجمع القرآن الكريم والتلاوات',
      hadith: 'موسوعة السنة النبوية الشريفة',
      academy: 'الأكاديمية التعليمية والمقارئ',
      scholars: 'هيئة كبار العلماء والمقرئين',
      aiScholar: 'الباحث العلمي الإسلامي الموثق',
      community: 'الملتقى العلمي لطلاب العلم',
      dashboard: 'لوحة الطالب والشهادات',
      admin: 'لوحة الإدارة والحوكمة المؤسسية',
      sciences: 'معهد العلوم الإسلامية',
      library: 'المكتبة الإسلامية العالمية',
      waqf: 'المركز الخيري والأوقاف والزكاة',
      about: 'عن مجمع النور الإسلامي العالمي',
      register: 'القبول والتسجيل في الأكاديمية',
      newMuslims: 'بوابة رعاية المهتدين الجدد',
      radio: 'إذاعة القرآن الكريم من مكة المكرمة 24/7',
      audioStudio: 'استوديو الصوت الإعلاني السوداني',
      orphansCare: 'بوابة كفالة ورعاية الأيتام',
      translationsReader: 'ترجمات معاني القرآن الكريم (76 لغة)',
      apiGateway: 'بوابة الأنظمة وواجهات API',
      noorAmbassador: 'برنامج سفير النور العالمي',
      discoverIslam: 'مركز اسأل عن الإسلام',
      dawahLibrary: 'المكتبة الدعوية العالمية',
      researchCenter: 'مركز البحوث والدراسات الإسلامية',
      mediaCenter: 'المركز الإعلامي والنشر',
      internationalRelations: 'مركز العلاقات والشراكات الدولية',
      contact: 'اتصل بالمجمع ومكتب الاستقبال',
    };

    const pageTitlesEn: Record<NavigationPage, string> = {
      home: 'Digital Islamic Campus',
      quran: 'Quran Complex & Recitations',
      hadith: 'Hadith & Sunnah Encyclopedia',
      academy: 'Educational Academy & Ijazah',
      scholars: 'Council of Scholars',
      aiScholar: 'Grounded Research Assistant',
      community: 'Scholarly Community Forum',
      dashboard: 'Student Portal',
      admin: 'Administration & Governance',
      sciences: 'Islamic Sciences Institute',
      library: 'Global Islamic Library',
      waqf: 'Charitable & Humanitarian Center',
      about: 'About Al Noor Complex',
      register: 'Academy Admissions',
      newMuslims: 'New Muslims Academy',
      radio: 'Makkah Holy Quran Radio 24/7',
      audioStudio: 'Sudanese Vocal Studio',
      orphansCare: 'Orphan Sponsorship Portal',
      translationsReader: '76-Language Quran Translations',
      apiGateway: 'Cloud API Architecture',
      noorAmbassador: 'Noor Global Ambassador',
      discoverIslam: 'Ask About Islam',
      dawahLibrary: 'International Dawah Library',
      researchCenter: 'Research & Studies Center',
      mediaCenter: 'Media & Publications Center',
      internationalRelations: 'International Relations Center',
      contact: 'Contact Us',
    };

    const suffix = isAr ? 'مجمع النور الإسلامي العالمي' : 'Al Noor Global Islamic Complex';
    const titlePart = isAr ? pageTitlesAr[currentPage] : pageTitlesEn[currentPage];
    document.title = currentPage === 'home'
      ? `${suffix} | AL NOOR CAMPUS`
      : `${titlePart || suffix} | ${suffix}`;
  }, [currentPage, isAr]);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#FAF8F2] dark:bg-[#022C22] text-[#0F2920] dark:text-[#FAF8F2] flex flex-col font-sans selection:bg-[#C8A24A]/30 selection:text-[#0F2920] dark:selection:text-[#FAF8F2] antialiased pb-28 xl:pb-8 transition-colors ${isRtl ? 'text-right' : 'text-left'}`}
    >
      {/* Offline Alert Indicator */}
      {!isOnline && (
        <div className="bg-[#C8A24A] text-[#022C22] text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 sticky top-0 z-50 shadow-sm border-b border-[#064E3B]/20">
          <WifiOff className="w-4 h-4" />
          <span>
            {isAr
              ? 'أنت الآن في وضع عدم الاتصال (Offline) - يتم استخدام البيانات المحفوظة محلياً في المنصة.'
              : 'You are currently offline — serving cached campus resources.'}
          </span>
        </div>
      )}

      {/* Top Global Campus Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Real-time Astronomical Prayer Times & Hijri Calendar Bar */}
      <PrayerTimesBar />

      {/* Main Pages Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* Campus Departmental Breadcrumb on Sub-pages */}
        <DepartmentBreadcrumb currentPage={currentPage} onNavigate={handleNavigate} />

        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} onOpenSearch={() => setIsSearchOpen(true)} />}
        {currentPage === 'newMuslims' && <NewMuslimsPage onNavigate={handleNavigate} />}
        {currentPage === 'quran' && <QuranPage onNavigate={handleNavigate} />}
        {currentPage === 'hadith' && <HadithPage onNavigate={handleNavigate} initialHadithId={pageParams?.hadithId} />}
        {currentPage === 'academy' && <AcademyPage onNavigate={handleNavigate} initialCourseId={pageParams?.courseId} />}
        {currentPage === 'scholars' && <ScholarsDirectoryPage onNavigate={handleNavigate} initialScholarId={pageParams?.scholarId} />}
        {currentPage === 'aiScholar' && <IslamicAIScholarPage onNavigate={handleNavigate} />}
        {currentPage === 'community' && <CommunityPage onNavigate={handleNavigate} />}
        {currentPage === 'dashboard' && <UserDashboardPage onNavigate={handleNavigate} />}
        {currentPage === 'admin' && <AdminDashboardPage onNavigate={handleNavigate} />}
        {currentPage === 'sciences' && <SciencesPage onNavigate={handleNavigate} />}
        {currentPage === 'library' && <LibraryPage onNavigate={handleNavigate} />}
        {currentPage === 'waqf' && <WaqfPage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
        {currentPage === 'noorAmbassador' && <NoorAmbassadorPage onNavigate={handleNavigate} />}
        {currentPage === 'discoverIslam' && <DiscoverIslamPage onNavigate={handleNavigate} />}
        {currentPage === 'dawahLibrary' && <DawahLibraryPage onNavigate={handleNavigate} />}
        {currentPage === 'audioStudio' && <SudaneseAudioStudioPage onNavigate={handleNavigate} />}
        {currentPage === 'orphansCare' && <OrphansCarePage onNavigate={handleNavigate} />}
        {currentPage === 'translationsReader' && <QuranTranslationsReaderPage onNavigate={handleNavigate} />}
        {currentPage === 'apiGateway' && <ApiGatewayPage onNavigate={handleNavigate} />}
        {currentPage === 'researchCenter' && <ResearchCenterPage onNavigate={handleNavigate} />}
        {currentPage === 'mediaCenter' && <MediaCenterPage onNavigate={handleNavigate} />}
        {currentPage === 'internationalRelations' && <InternationalRelationsPage onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
        {currentPage === 'radio' && (
          <div className="space-y-8 animate-fade-in">
            <LiveMakkahQuranRadio initialExpanded={true} />
          </div>
        )}
      </main>

      {/* Global Comprehensive Architectural Islamic Campus Footer */}
      <footer className="border-t-2 border-[#C8A24A]/40 bg-[#022C22] text-[#FAF8F2] pt-14 pb-12 xl:pb-8 px-4 text-xs transition-colors">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1: Identity & Official Slogan (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-[#064E3B] border border-[#C8A24A]/50 p-1.5 shadow-md">
                  <img
                    src={OFFICIAL_COMPLEX_LOGO}
                    alt="شعار مجمع النور الإسلامي العالمي"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white leading-tight font-amiri">
                    {t.complexName}
                  </h4>
                  <span className="text-[11px] text-[#E5C97B] font-medium tracking-wide">
                    AL NOOR GLOBAL ISLAMIC CHARITABLE COMPLEX
                  </span>
                </div>
              </div>

              {/* Official Slogan */}
              <div className="p-3.5 bg-[#064E3B]/70 rounded-2xl border border-[#C8A24A]/35">
                <span className="text-[11px] text-[#E5C97B] font-bold block mb-1">
                  {isAr ? 'الشعار المؤسسي المعتمد:' : 'Official Institutional Motto:'}
                </span>
                <span className="text-base sm:text-lg font-amiri font-bold text-[#FAF8F2] block">
                  «القرآن هداية، والعلم بناء، والعمل الخيري عطاء»
                </span>
              </div>

              <p className="text-xs text-[#D1E7DD] leading-relaxed max-w-md">
                {t.heroDesc}
              </p>

              {/* PWA Install Box */}
              <div className="p-3 bg-[#064E3B]/60 rounded-xl border border-[#C8A24A]/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-[#E5C97B] shrink-0" />
                  <span className="text-[11px] text-[#D1E7DD]">
                    {isAr
                      ? 'متوافق كتطبيق على أجهزة الحاسوب والآيفون والأندرويد'
                      : 'Installable Campus App on Desktop, iOS & Android'}
                  </span>
                </div>
                <PWAInstallButton />
              </div>
            </div>

            {/* Column 2: The 8 Core Campus Buildings */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-[#E5C97B] border-b border-[#C8A24A]/30 pb-2 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>{isAr ? 'مباني وأقسام المجمع الثمانية' : 'The 8 Campus Wings'}</span>
              </h5>
              <ul className="space-y-2 text-xs">
                {CAMPUS_BUILDINGS.map((b) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => handleNavigate(b.targetPage)}
                      className="hover:text-[#E5C97B] transition-colors flex items-center gap-1.5 text-[#D1E7DD] cursor-pointer text-start"
                    >
                      <span className="font-mono text-[10px] text-[#E5C97B]">{b.code}</span>
                      <span>{isAr ? b.nameAr : b.nameEn}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Essential Services & Specialized Wings */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-[#E5C97B] border-b border-[#C8A24A]/30 pb-2">
                {isAr ? 'البوابات والخدمات المتخصصة' : 'Specialized Wings & Services'}
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button type="button" onClick={() => handleNavigate('translationsReader')} className="hover:text-[#E5C97B] transition-colors flex items-center gap-1.5 text-[#D1E7DD] cursor-pointer">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#C8A24A] ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{isAr ? 'ترجمات القرآن (76 لغة)' : 'Quran Translations (76 Languages)'}</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavigate('hadith')} className="hover:text-[#E5C97B] transition-colors flex items-center gap-1.5 text-[#D1E7DD] cursor-pointer">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#C8A24A] ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{isAr ? 'موسوعة السنة النبوية' : 'Hadith Encyclopedia'}</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavigate('orphansCare')} className="hover:text-[#E5C97B] transition-colors flex items-center gap-1.5 text-[#FAF8F2] font-bold cursor-pointer">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#C8A24A] ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{isAr ? 'كفالة ورعاية الأيتام' : 'Orphans Care Portal'}</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavigate('discoverIslam')} className="hover:text-[#E5C97B] transition-colors flex items-center gap-1.5 text-[#D1E7DD] cursor-pointer">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#C8A24A] ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{isAr ? 'اسأل عن الإسلام' : 'Ask About Islam'}</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavigate('newMuslims')} className="hover:text-[#E5C97B] transition-colors flex items-center gap-1.5 text-[#D1E7DD] cursor-pointer">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#C8A24A] ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{t.navNewMuslims}</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavigate('radio')} className="text-[#E5C97B] hover:text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>{isAr ? 'إذاعة مكة مباشر 24/7' : 'Makkah Quran Radio 24/7'}</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavigate('audioStudio')} className="text-[#D1E7DD] hover:text-[#E5C97B] transition-colors flex items-center gap-1.5 cursor-pointer">
                    <Mic className="w-3.5 h-3.5 text-[#C8A24A]" />
                    <span>{isAr ? 'استوديو الصوت الإعلاني السوداني' : 'Sudanese Voice Studio'}</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavigate('aiScholar')} className="text-[#D1E7DD] hover:text-[#E5C97B] transition-colors flex items-center gap-1.5 cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A24A]" />
                    <span>{isAr ? 'الباحث العلمي الذكي' : 'Scholarly AI Assistant'}</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavigate('apiGateway')} className="text-[#D1E7DD] hover:text-[#E5C97B] transition-colors flex items-center gap-1.5 cursor-pointer">
                    <Zap className="w-3.5 h-3.5 text-[#C8A24A]" />
                    <span>{isAr ? 'بوابة واجهات API' : 'API Gateway'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Official Contact & Headquarters */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-[#E5C97B] border-b border-[#C8A24A]/30 pb-2">
                {isAr ? 'التواصل الرسمي والمقر العام' : 'Official Contact & Office'}
              </h5>
              <div className="space-y-2.5 text-xs">
                <a
                  href={`https://wa.me/${COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم ورحمة الله، استفسار عن مجمع النور')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#064E3B] border border-[#C8A24A]/35 hover:border-[#C8A24A] transition-colors group"
                >
                  <MessageCircle className="w-4 h-4 text-[#E5C97B] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#E5C97B] block">{t.contactWhatsapp}</span>
                    <span className="text-[#FAF8F2] text-xs font-bold">{t.chatWhatsapp}</span>
                  </div>
                </a>

                <a
                  href={`tel:${COMPLEX_INFO.phones.mobile.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#064E3B] border border-[#C8A24A]/35 hover:border-[#C8A24A] transition-colors group"
                >
                  <Phone className="w-4 h-4 text-[#E5C97B] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#D1E7DD] block">{t.contactMobile}</span>
                    <span className="text-[#FAF8F2] text-xs font-bold">{t.callDirect}</span>
                  </div>
                </a>

                <div className="flex items-start gap-2 pt-1">
                  <Mail className="w-4 h-4 text-[#E5C97B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[#A3C4B8] block">{t.contactEmail}:</span>
                    <span className="font-mono text-[#FAF8F2] text-xs font-bold">{COMPLEX_INFO.officialEmail}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#E5C97B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[#A3C4B8] block">{t.contactAddress}:</span>
                    <span className="text-[#D1E7DD] text-xs">{COMPLEX_INFO.headquarters}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate('contact')}
                  className="w-full py-2 px-3 rounded-xl bg-[#C8A24A] hover:bg-[#DFBE68] text-[#022C22] font-black text-xs text-center transition-colors cursor-pointer"
                >
                  {isAr ? 'مكتب الاستقبال واتصل بنا' : 'Open Contact Desk'}
                </button>
              </div>
            </div>
          </div>

          {/* Official Domain Showcase Bar (www.mojamaalnor.com) */}
          <div className="rounded-3xl bg-gradient-to-r from-[#064E3B] via-[#04382B] to-[#064E3B] border-2 border-[#C8A24A]/50 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 text-center md:text-start z-10">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#C8A24A] text-[#022C22] text-xs font-black flex items-center gap-1.5 shadow-sm">
                  <Globe className="w-3.5 h-3.5 text-[#022C22]" />
                  <span>{isAr ? 'الدومين الرسمي المعتمد لمجمع النور الإسلامي العالمي' : 'Official Verified Global Domain'}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#022C22] border border-[#C8A24A]/40 text-[#E5C97B] text-[11px] font-mono font-bold">
                  www.mojamaalnor.com
                </span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
                <span className="text-2xl sm:text-4xl font-mono font-black text-white tracking-wider select-all">
                  www.mojamaalnor.com
                </span>
              </div>

              <p className="text-xs text-[#D1E7DD] max-w-xl">
                {isAr
                  ? 'بوابتك الرقمية العالمية المعتمدة لتعليم القرآن الكريم، العلوم الشرعية، المكتبة، إذاعة مكة 24/7، والعمل الخيري.'
                  : 'Your unified international gateway to Quran education, Islamic sciences, library archives, and transparent charitable work.'}
              </p>
            </div>

            <div className="flex items-center gap-3 z-10 shrink-0 flex-wrap justify-center">
              <button
                type="button"
                onClick={handleCopyDomain}
                className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                  copiedDomain
                    ? 'bg-[#047857] text-white'
                    : 'bg-[#C8A24A] hover:bg-[#DFBE68] text-[#022C22]'
                }`}
                title={isAr ? 'انقر لنسخ رابط الدومين الرسمي' : 'Copy Official Domain'}
              >
                {copiedDomain ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>{isAr ? 'تم نسخ الدومين بنجاح!' : 'Domain Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#022C22]" />
                    <span>{isAr ? 'نسخ رابط الدومين' : 'Copy Official Domain'}</span>
                  </>
                )}
              </button>

              <a
                href="https://www.mojamaalnor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 rounded-2xl bg-[#022C22] hover:bg-[#04382B] text-[#E5C97B] hover:text-white border border-[#C8A24A]/50 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{isAr ? 'زيارة الموقع' : 'Visit Domain'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#C8A24A]/25 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start text-[11px] text-[#A3C4B8]">
            <div>
              {isAr
                ? `جميع الحقوق محفوظة © ${new Date().getFullYear()} مجمع النور الإسلامي العالمي • صرحٌ وقفي لله تعالى`
                : `All Rights Reserved © ${new Date().getFullYear()} Al-Noor Global Islamic Charitable Complex`}
            </div>
            <div className="flex items-center gap-4 text-[#E5C97B] font-amiri text-xs">
              <span>« وَقُل رَّبِّ زِدْنِي عِلْمًا »</span>
              <span>•</span>
              <span>« إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ »</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Native-Style Bottom Navigation for Mobile & Tablets */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Floating 24/7 Live Makkah Quran Radio Mini Player */}
      <LiveMakkahQuranRadio dockedMode={true} />

      {/* Floating Official WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Floating Charitable Donation Widget (Bank of Khartoum 1727654) */}
      <FloatingDonationWidget />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <MainAppContent />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
