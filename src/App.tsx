/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PWAInstallButton } from './components/PWAInstallButton';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HomePage } from './components/pages/HomePage';
import { QuranPage } from './components/pages/QuranPage';
import { SciencesPage } from './components/pages/SciencesPage';
import { LibraryPage } from './components/pages/LibraryPage';
import { WaqfPage } from './components/pages/WaqfPage';
import { AboutPage } from './components/pages/AboutPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { NavigationPage } from './types';
import { COMPLEX_INFO } from './data/islamicData';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { 
  BookOpen, Globe, Mail, MapPin, Sparkles, ChevronLeft, 
  WifiOff, Smartphone, Laptop, Phone, MessageCircle 
} from 'lucide-react';

function MainAppContent() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const isOnline = useOnlineStatus();
  const { lang, t, isRtl } = useLanguage();

  const handleNavigate = (page: NavigationPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 antialiased pb-20 xl:pb-0 ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* Offline Alert Indicator if user loses connection */}
      {!isOnline && (
        <div className="bg-amber-600 text-slate-950 text-xs font-black py-2 px-4 text-center flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
          <WifiOff className="w-4 h-4" />
          <span>أنت الآن في وضع عدم الاتصال (Offline) - يتم استخدام البيانات المحفوظة في التطبيق.</span>
        </div>
      )}

      {/* Top Global Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Pages Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'quran' && <QuranPage onNavigate={handleNavigate} />}
        {currentPage === 'sciences' && <SciencesPage onNavigate={handleNavigate} />}
        {currentPage === 'library' && <LibraryPage onNavigate={handleNavigate} />}
        {currentPage === 'waqf' && <WaqfPage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
      </main>

      {/* Global Comprehensive Islamic Footer */}
      <footer className="border-t border-emerald-950/80 bg-slate-950 text-slate-400 pt-14 pb-12 xl:pb-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Column 1: Identity & Slogan (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-600 p-0.5 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/10 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center p-2 text-amber-400">
                    <BookOpen className="w-7 h-7" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white leading-tight">
                    {t.complexName}
                  </h4>
                  <span className="text-xs text-emerald-400 font-medium">{t.heroBadge}</span>
                </div>
              </div>

              {/* Official Slogan */}
              <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-amber-500/30 shadow-inner">
                <span className="text-[11px] text-amber-400/90 font-bold block mb-0.5">
                  {lang === 'ar' ? 'الشعار الرسمي:' : 'Official Slogan:'}
                </span>
                <span className="text-base sm:text-lg font-amiri font-black text-amber-300">
                  {t.sloganQuote}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                {t.heroDesc}
              </p>

              {/* PWA Install Promotion Box */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] text-slate-300">
                    {lang === 'ar' ? 'متوافق كتطبيق على أجهزة الحاسوب والآيفون والأندرويد' : 'Installable on Desktop, iPhone & Android'}
                  </span>
                </div>
                <PWAInstallButton />
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                {lang === 'ar' ? 'أقسام البوابة الإلكترونية' : 'Portal Navigation'}
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => handleNavigate('home')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <ChevronLeft className={`w-3.5 h-3.5 text-slate-600 ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{t.navHome}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('quran')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <ChevronLeft className={`w-3.5 h-3.5 text-slate-600 ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{t.navQuran}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('sciences')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <ChevronLeft className={`w-3.5 h-3.5 text-slate-600 ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{t.navSciences}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('library')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <ChevronLeft className={`w-3.5 h-3.5 text-slate-600 ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{t.navLibrary}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('waqf')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <ChevronLeft className={`w-3.5 h-3.5 text-slate-600 ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{t.navWaqf}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('about')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <ChevronLeft className={`w-3.5 h-3.5 text-slate-600 ${isRtl ? '' : 'rotate-180'}`} />
                    <span>{t.navAbout}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Academic & Maqra'ah Tracks */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                {lang === 'ar' ? 'المسارات والبرامج' : 'Programs & Tracks'}
              </h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>• {lang === 'ar' ? 'مسار الحفظ المتقن (عن بُعد وحضورياً)' : 'Comprehensive Quran Memorization'}</li>
                <li>• {lang === 'ar' ? 'مسار الإجازة بالسند المتصل (القراءات العشر)' : 'Continuous Chain (Isnad) Ijaza Track'}</li>
                <li>• {lang === 'ar' ? 'مسار براعم وأشبال القرآن الكريم' : 'Young Quran Memorizers Track'}</li>
                <li>• {lang === 'ar' ? 'دبلوم الفقه المقارن وأصول الشريعة' : 'Comparative Fiqh & Sharia Diploma'}</li>
                <li>• {lang === 'ar' ? 'حاسبة الزكاة الشرعية الذكية' : 'Smart Islamic Zakat Calculator'}</li>
              </ul>
            </div>

            {/* Column 4: Official Contact With Specified Numbers */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                {lang === 'ar' ? 'أرقام التواصل والمقر العام' : 'Official Contact & Phones'}
              </h5>
              <div className="space-y-2.5 text-xs">
                
                {/* Official WhatsApp */}
                <a
                  href={`https://wa.me/${COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 p-2 rounded-xl bg-emerald-950/30 border border-emerald-900/50 hover:border-emerald-500/50 transition-colors group"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-emerald-300 block">{t.contactWhatsapp}:</span>
                    <span className="font-mono text-white text-xs font-bold tracking-wider group-hover:text-emerald-300">
                      {COMPLEX_INFO.phones.whatsapp}
                    </span>
                  </div>
                </a>

                {/* Official Mobile */}
                <a
                  href={`tel:${COMPLEX_INFO.phones.mobile.replace(/[^0-9+]/g, '')}`}
                  className="flex items-start gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-colors group"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.contactMobile}:</span>
                    <span className="font-mono text-white text-xs font-bold tracking-wider group-hover:text-amber-300">
                      {COMPLEX_INFO.phones.mobile}
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">{t.contactEmail}:</span>
                    <span className="font-mono text-white text-xs font-bold">{COMPLEX_INFO.officialEmail}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">{t.contactAddress}:</span>
                    <span className="text-white text-xs">{COMPLEX_INFO.headquarters}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right text-[11px] text-slate-500">
            <div>
              {lang === 'ar' 
                ? `جميع الحقوق محفوظة © ${new Date().getFullYear()} مجمع النور الإسلامي • صرحٌ وقفي لله تعالى`
                : `All Rights Reserved © ${new Date().getFullYear()} Al-Noor Islamic Complex • Charitable Waqf`}
            </div>
            <div className="flex items-center gap-4 text-amber-400/80 font-amiri text-xs">
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

      {/* Floating Professional WhatsApp Widget */}
      <FloatingWhatsApp />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}
