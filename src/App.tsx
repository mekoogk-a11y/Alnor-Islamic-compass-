/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PWAInstallButton } from './components/PWAInstallButton';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthModal } from './components/AuthModal';

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
import { LiveMakkahQuranRadio } from './components/LiveMakkahQuranRadio';
import { SudaneseAudioStudioPage } from './components/pages/SudaneseAudioStudioPage';
import { OrphansCarePage } from './components/pages/OrphansCarePage';
import { QuranTranslationsReaderPage } from './components/pages/QuranTranslationsReaderPage';
import { ApiGatewayPage } from './components/pages/ApiGatewayPage';
import { NoorAmbassadorPage } from './components/pages/NoorAmbassadorPage';
import { DiscoverIslamPage } from './components/pages/DiscoverIslamPage';
import { PrayerTimesBar } from './components/PrayerTimesBar';

import { NavigationPage } from './types';
import { COMPLEX_INFO, OFFICIAL_COMPLEX_LOGO } from './data/islamicData';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { 
  BookOpen, Globe, Mail, MapPin, Sparkles, ChevronLeft, 
  WifiOff, Laptop, Phone, MessageCircle, Radio, Compass, Scroll, GraduationCap, Users, Mic, Zap, HeartHandshake, ShieldCheck 
} from 'lucide-react';

function MainAppContent() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [pageParams, setPageParams] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isOnline = useOnlineStatus();
  const { lang, t, isRtl } = useLanguage();

  const handleNavigate = (page: NavigationPage, params?: any) => {
    setCurrentPage(page);
    setPageParams(params || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-[#070D1E] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#F8FAFC] antialiased pb-36 xl:pb-8 transition-colors ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* Offline Alert Indicator if user loses connection */}
      {!isOnline && (
        <div className="bg-[#B9A477] text-[#343832] text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 sticky top-0 z-50 shadow-sm border-b border-[#D8CEBB]">
          <WifiOff className="w-4 h-4" />
          <span>أنت الآن في وضع عدم الاتصال (Offline) - يتم استخدام البيانات المحفوظة محلياً في المنصة.</span>
        </div>
      )}

      {/* Top Global Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Real-time Astronomical Prayer Times & Hijri Calendar Bar */}
      <PrayerTimesBar />

      {/* Main Pages Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
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
        {currentPage === 'audioStudio' && <SudaneseAudioStudioPage onNavigate={handleNavigate} />}
        {currentPage === 'orphansCare' && <OrphansCarePage onNavigate={handleNavigate} />}
        {currentPage === 'translationsReader' && <QuranTranslationsReaderPage onNavigate={handleNavigate} />}
        {currentPage === 'apiGateway' && <ApiGatewayPage onNavigate={handleNavigate} />}
        {currentPage === 'radio' && (
          <div className="space-y-8 animate-fade-in">
            <LiveMakkahQuranRadio initialExpanded={true} />
          </div>
        )}

        {/* Global Floating Docked Radio Player when navigating other subpages */}
        {currentPage !== 'radio' && currentPage !== 'home' && (
          <LiveMakkahQuranRadio dockedMode={true} />
        )}
      </main>

      {/* Global Comprehensive Islamic Institutional Footer */}
      <footer className="border-t border-[#B9A477]/20 bg-[#070D1E] text-[#E2E8F0] pt-14 pb-12 xl:pb-8 px-4 text-xs transition-colors">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Column 1: Identity & Slogan (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0 flex items-center justify-center">
                  <img 
                    src={OFFICIAL_COMPLEX_LOGO} 
                    alt="شعار مجمع النور الإسلامي العالمي" 
                    className="h-16 w-auto max-w-[80px] object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-[#F8FAFC] leading-tight">
                    {t.complexName}
                  </h4>
                  <span className="text-xs text-[#D4AF37] font-medium tracking-wide">NOOR GLOBAL · A WORLD OF LIGHT</span>
                </div>
              </div>

              {/* Official Slogan */}
              <div className="p-3.5 bg-[#0B132B]/80 rounded-2xl border border-[#D4AF37]/30 shadow-inner">
                <span className="text-[11px] text-[#D4AF37] font-bold block mb-1">
                  {lang === 'ar' ? 'الشعار المؤسسي المعتمد:' : 'Official Slogan:'}
                </span>
                <span className="text-base sm:text-lg font-amiri font-bold text-[#F8FAFC] block">
                  «القرآن هداية، والعلم بناء، والعمل الخيري عطاء»
                </span>
              </div>

              <p className="text-xs text-[#D8CEBB] leading-relaxed max-w-md">
                {t.heroDesc}
              </p>

              {/* PWA Install Promotion Box */}
              <div className="p-3 bg-[#282C26] rounded-xl border border-[#464D43] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-[#B9A477] shrink-0" />
                  <span className="text-[11px] text-[#D8CEBB]">
                    {lang === 'ar' ? 'متوافق كتطبيق على أجهزة الحاسوب والآيفون والأندرويد' : 'Installable on Desktop, iPhone & Android'}
                  </span>
                </div>
                <PWAInstallButton />
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-[#F7F5EF] border-b border-[#464D43] pb-2">
                {lang === 'ar' ? 'أقسام البوابة الإلكترونية' : 'Portal Navigation'}
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => handleNavigate('home')} className="hover:text-[#B9A477] transition-colors flex items-center gap-1.5 text-[#D8CEBB]">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#B9A477] ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{t.navHome}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('quran')} className="hover:text-[#B9A477] transition-colors flex items-center gap-1.5 text-[#D8CEBB]">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#B9A477] ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{t.navQuran}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('hadith')} className="hover:text-[#B9A477] transition-colors flex items-center gap-1.5 font-bold text-[#F7F5EF]">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#B9A477] ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{lang === 'ar' ? 'موسوعة السنة النبوية' : 'Hadith Encyclopedia'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('academy')} className="hover:text-[#B9A477] transition-colors flex items-center gap-1.5 text-[#D8CEBB]">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#B9A477] ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{lang === 'ar' ? 'أكاديمية النور والمقارئ' : 'Quran Academy'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('scholars')} className="hover:text-[#B9A477] transition-colors flex items-center gap-1.5 text-[#D8CEBB]">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#B9A477] ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{lang === 'ar' ? 'هيئة كبار العلماء' : 'Scholars Directory'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('aiScholar')} className="hover:text-[#B9A477] transition-colors flex items-center gap-1.5 text-[#D8CEBB]">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#B9A477] ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{lang === 'ar' ? 'المساعد العلمي الذكي' : 'AI Islamic Scholar'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('newMuslims')} className="hover:text-[#B9A477] transition-colors flex items-center gap-1.5 font-bold text-[#E5DCCB]">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#B9A477] ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{t.navNewMuslims}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('radio')} className="text-[#B9A477] hover:text-[#F7F5EF] font-bold transition-colors flex items-center gap-1.5">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#B9A477] ${isRtl ? '' : 'rotate-180'}`} />
                    <span className="flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      <span>{lang === 'ar' ? 'إذاعة القرآن الكريم (مباشر من مكة) 🕋' : 'Holy Quran Radio (Makkah Live)'}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('audioStudio')} className="text-[#D8CEBB] hover:text-[#B9A477] font-bold transition-colors flex items-center gap-1.5">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#B9A477] ${isRtl ? '' : 'rotate-180'}`} />
                    <span className="flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5 text-[#B9A477] animate-pulse" />
                      <span>{lang === 'ar' ? 'استوديو الصوت الإعلاني السوداني 🇸🇩' : 'Sudanese Voice Ads Studio'}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('noorAmbassador')} className="text-[#D4AF37] hover:text-white font-bold transition-colors flex items-center gap-1.5">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#D4AF37] ${isRtl ? '' : 'rotate-180'}`} />
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                      <span>{lang === 'ar' ? 'سفير النور العالمي 🌟' : 'Noor Ambassador'}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('discoverIslam')} className="text-[#38BDF8] hover:text-white font-bold transition-colors flex items-center gap-1.5">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#38BDF8] ${isRtl ? '' : 'rotate-180'}`} />
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>{lang === 'ar' ? 'اسأل عن الإسلام 💬' : 'Ask About Islam'}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('apiGateway')} className="text-[#94A3B8] hover:text-[#D4AF37] font-bold transition-colors flex items-center gap-1.5">
                    <ChevronLeft className={`w-3.5 h-3.5 text-[#D4AF37] ${isRtl ? '' : 'rotate-180'}`} />
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{lang === 'ar' ? 'بوابة واجهات API السحابية ⚡' : 'API Gateway & Architecture'}</span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Academic & Maqra'ah Tracks */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-[#F7F5EF] border-b border-[#464D43] pb-2">
                {lang === 'ar' ? 'المسارات والبرامج' : 'Programs & Tracks'}
              </h5>
              <ul className="space-y-2 text-xs text-[#D8CEBB]">
                <li>• {lang === 'ar' ? 'مسار الحفظ المتقن (عن بُعد وحضورياً)' : 'Comprehensive Quran Memorization'}</li>
                <li>• {lang === 'ar' ? 'مسار الإجازة بالسند المتصل (القراءات العشر)' : 'Continuous Chain (Isnad) Ijaza Track'}</li>
                <li>• {lang === 'ar' ? 'مقارئ تصحيح التلاوة المباشرة 24/7' : 'Live Recitation Correction Rooms'}</li>
                <li>• {lang === 'ar' ? 'دبلوم الفقه المقارن وأصول الشريعة' : 'Comparative Fiqh & Sharia Diploma'}</li>
                <li>• {lang === 'ar' ? 'حاسبة الزكاة الشرعية والأوقاف' : 'Smart Islamic Zakat & Waqf'}</li>
              </ul>
            </div>

            {/* Column 4: Official Contact & Headquarters (No raw phone numbers) */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-[#F7F5EF] border-b border-[#464D43] pb-2">
                {lang === 'ar' ? 'التواصل الرسمي والمقر العام' : 'Official Contact & Office'}
              </h5>
              <div className="space-y-2.5 text-xs">
                
                {/* Official WhatsApp Action */}
                <a
                  href={`https://wa.me/${COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم ورحمة الله، استفسار عن مجمع النور')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#282C26] border border-[#464D43] hover:border-[#B9A477] transition-colors group"
                >
                  <MessageCircle className="w-4 h-4 text-[#B9A477] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#B9A477] block">{t.contactWhatsapp}</span>
                    <span className="text-[#F7F5EF] text-xs font-bold group-hover:text-[#B9A477]">
                      {t.chatWhatsapp}
                    </span>
                  </div>
                </a>

                {/* Direct Call Action */}
                <a
                  href={`tel:${COMPLEX_INFO.phones.mobile.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#282C26] border border-[#464D43] hover:border-[#B9A477] transition-colors group"
                >
                  <Phone className="w-4 h-4 text-[#B9A477] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#D8CEBB] block">{t.contactMobile}</span>
                    <span className="text-[#F7F5EF] text-xs font-bold group-hover:text-[#B9A477]">
                      {t.callDirect}
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-2 pt-1">
                  <Mail className="w-4 h-4 text-[#B9A477] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[#80887D] block">{t.contactEmail}:</span>
                    <span className="font-mono text-[#F7F5EF] text-xs font-bold">{COMPLEX_INFO.officialEmail}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#B9A477] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[#80887D] block">{t.contactAddress}:</span>
                    <span className="text-[#E5DCCB] text-xs">{COMPLEX_INFO.headquarters}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#464D43] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right text-[11px] text-[#9EA89A]">
            <div>
              {lang === 'ar' 
                ? `جميع الحقوق محفوظة © ${new Date().getFullYear()} مجمع النور الإسلامي • صرحٌ وقفي لله تعالى`
                : `All Rights Reserved © ${new Date().getFullYear()} Al-Noor Islamic Complex • Charitable Waqf`}
            </div>
            <div className="flex items-center gap-4 text-[#B9A477] font-amiri text-xs">
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

      {/* Floating Professional WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Global Google-Style Central Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Global Auth Modal for Students, Teachers & Administrators */}
      <AuthModal />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainAppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
