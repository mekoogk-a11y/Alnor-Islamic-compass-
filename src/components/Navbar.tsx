import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen, Globe, HeartHandshake, GraduationCap, Library,
  Info, Mail, Menu, X, Sparkles, MessageCircle, Radio,
  ChevronDown, Check, Compass, Scroll, Users, Search,
  Sun, Moon, User, ShieldCheck, HelpCircle, Mic, Zap,
  Microscope, Newspaper, Globe2, Home, Layers, Video
} from 'lucide-react';
import { NavigationPage } from '../types';
import { COMPLEX_INFO, OFFICIAL_COMPLEX_LOGO } from '../data/islamicData';
import { PWAInstallButton } from './PWAInstallButton';
import { useLanguage, WORLD_LANGUAGES } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const { lang, setLang, t, isRtl, currentLangInfo } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, openAuthModal } = useAuth();
  const isAr = lang === 'ar';

  const langDropdownRef = useRef<HTMLDivElement | null>(null);
  const moreDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (langDropdownRef.current && !langDropdownRef.current.contains(target)) {
        setLangMenuOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(target)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: NavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLanguage = (code: typeof lang) => {
    setLang(code);
    setLangMenuOpen(false);
  };

  const whatsappCleanNumber = COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '');
  const isAuthorizedAdmin = user?.role === 'admin' || user?.email === 'mekoogk@gmail.com';

  // 11 Global Campus Navigation Items
  const globalCampusNavItems: { id: NavigationPage; labelAr: string; labelEn: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: Home },
    { id: 'about', labelAr: 'عن المجمع', labelEn: 'About Complex', icon: Info },
    { id: 'quran', labelAr: 'مجمع القرآن', labelEn: 'Quran Complex', icon: BookOpen },
    { id: 'sciences', labelAr: 'العلوم الإسلامية', labelEn: 'Islamic Sciences', icon: Scroll },
    { id: 'library', labelAr: 'المكتبة الرقمية', labelEn: 'Digital Library', icon: Library },
    { id: 'academy', labelAr: 'الأكاديمية', labelEn: 'Academy', icon: GraduationCap },
    { id: 'waqf', labelAr: 'المشاريع الخيرية', labelEn: 'Charitable Projects', icon: HeartHandshake },
    { id: 'researchCenter', labelAr: 'مركز البحوث', labelEn: 'Research Center', icon: Microscope },
    { id: 'mediaCenter', labelAr: 'المركز الإعلامي', labelEn: 'Media Center', icon: Newspaper },
    { id: 'internationalRelations', labelAr: 'العلاقات الدولية', labelEn: 'Intl Relations', icon: Globe2 },
    { id: 'contact', labelAr: 'اتصل بنا', labelEn: 'Contact Us', icon: Mail },
  ];

  // Specialized Campus Wings & Services
  const specializedWings: { id: NavigationPage; labelAr: string; labelEn: string; descAr: string; descEn: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'translationsReader', labelAr: 'ترجمات القرآن (76 لغة)', labelEn: 'Quran Translations (76)', descAr: 'الترجمات المعتمدة من مجمع الملك فهد', descEn: 'Certified global translations', icon: Globe },
    { id: 'hadith', labelAr: 'موسوعة السنة النبوية', labelEn: 'Hadith Encyclopedia', descAr: 'أصح الأحاديث والتخريج العلمي الموثق', descEn: 'Canonical Hadith collections', icon: Scroll },
    { id: 'scholars', labelAr: 'هيئة كبار العلماء', labelEn: 'Council of Scholars', descAr: 'دليل العلماء والمقرئين المجازين', descEn: 'Verified scholars & Qaris', icon: Users },
    { id: 'orphansCare', labelAr: 'كفالة ورعاية الأيتام', labelEn: 'Orphans Care Portal', descAr: 'استمارات الكفالة والتتبع وبنك الخرطوم 1727654', descEn: 'Sponsorship & field verification', icon: HeartHandshake },
    { id: 'videoLibrary', labelAr: 'المكتبة المرئية الإسلامية (HLS)', labelEn: 'Islamic Video Library', descAr: 'تلاوات ومحاضرات ودورات وأنشطة خيرية ببث تكيفي', descEn: 'Recitations, lectures & courses via HLS', icon: Video },
    { id: 'dawahLibrary', labelAr: 'المكتبة الدعوية العالمية', labelEn: 'Dawah Library', descAr: 'سلاسل المناظرات والمحاضرات الموثقة', descEn: 'Debates & educational media', icon: Layers },
    { id: 'noorAmbassador', labelAr: 'سفير النور العالمي', labelEn: 'Noor Ambassador', descAr: 'بطاقات دعوية بعدة لغات للنشر والتوزيع', descEn: 'Multilingual outreach cards', icon: Sparkles },
    { id: 'discoverIslam', labelAr: 'اسأل عن الإسلام', labelEn: 'Ask About Islam', descAr: 'حوار هادئ وإجابات موثقة بلغات العالم', descEn: 'Global Q&A and dialogue desk', icon: MessageCircle },
    { id: 'newMuslims', labelAr: 'رعاية المهتدين الجدد', labelEn: 'New Muslims Academy', descAr: 'منهج متدرج للوضوء والصلاة وحفظ الفاتحة', descEn: 'Foundational guide for reverts', icon: Compass },
    { id: 'radio', labelAr: 'إذاعة القرآن من مكة 24/7', labelEn: 'Makkah Live Radio', descAr: 'بث مباشر متواصل من الحرم المكي الشريف', descEn: 'Continuous live Makkah broadcast', icon: Radio },
    { id: 'audioStudio', labelAr: 'استوديو الصوت الإعلاني السوداني', labelEn: 'Sudanese Voice Studio', descAr: 'توليد الصوت الإعلاني الإذاعي باللهجة السودانية', descEn: 'Energetic Sudanese broadcast voice', icon: Mic },
    { id: 'aiScholar', labelAr: 'المساعد العلمي الذكي', labelEn: 'AI Research Scholar', descAr: 'أداة بحثية موثقة بالآيات والأحاديث', descEn: 'Source-grounded scholarly helper', icon: Sparkles },
    { id: 'community', labelAr: 'الملتقى العلمي للطلاب', labelEn: 'Scholarly Forum', descAr: 'حلقات نقاش وأسئلة طلاب العلم', descEn: 'Student & scholar dialogue forum', icon: HelpCircle },
    { id: 'apiGateway', labelAr: 'بوابة واجهات API السحابية', labelEn: 'Cloud API Gateway', descAr: 'الربط التقني ومؤشرات أداء الخادم', descEn: 'System status & developer APIs', icon: Zap },
  ];

  if (isAuthorizedAdmin) {
    specializedWings.unshift({
      id: 'admin',
      labelAr: 'لوحة الإدارة العامة والحوكمة',
      labelEn: 'Admin & Governance Console',
      descAr: 'إدارة طلبات التسجيل والأيتام والشراكات والرسائل',
      descEn: 'Manage admissions, orphans, partnerships & messages',
      icon: ShieldCheck,
    });
  }

  const isMoreActive = specializedWings.some((i) => i.id === currentPage);

  return (
    <header className="sticky top-0 z-40 shadow-[0_12px_30px_-12px_rgba(18,52,90,0.22)] transition-colors bg-[#EAF8FF]/92 dark:bg-[#0B1F3A]/92 backdrop-blur-xl border-b border-white/80 dark:border-[#87CEEB]/25">
      {/* Top Institutional Deep Navy & Sky Ribbon */}
      <div className="bg-[#12345A] dark:bg-[#071528] text-[#EAF8FF] py-1.5 px-4 text-xs font-semibold border-b border-[#87CEEB]/25">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Motto & Campus Reach */}
          <div className="flex items-center gap-3 text-[11px] overflow-x-auto w-full md:w-auto justify-center md:justify-start no-scrollbar">
            <span className="flex items-center gap-1.5 bg-[#0A223D] text-[#F7E7B4] px-3 py-0.5 rounded-lg font-bold border border-[#D4AF37]/45 shrink-0">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span className="font-amiri text-xs font-bold">
                {isAr
                  ? '«القرآن هداية، والعلم بناء، والعمل الخيري عطاء»'
                  : '“Quran as Guidance · Knowledge as Construction · Charity as Giving”'}
              </span>
            </span>

            <span className="hidden lg:inline-block text-[#87CEEB]/50">•</span>

            <span className="hidden lg:inline-flex items-center gap-1.5 text-[#BCE7FB] font-medium shrink-0">
              <Globe className="w-3.5 h-3.5 text-[#87CEEB]" />
              <span>
                {isAr
                  ? 'الصرح الرقمي لمجمع النور الإسلامي العالمي · خدمات تعليمية وخيرية متكاملة'
                  : 'Al Noor Global Digital Islamic Campus · Integrated Educational & Charitable Portal'}
              </span>
            </span>
          </div>

          {/* Quick Campus Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Makkah Radio Shortcut */}
            <button
              type="button"
              onClick={() => handleNavClick('radio')}
              className="flex items-center gap-1.5 bg-[#0EA5A4] hover:bg-[#0D9488] text-white border border-white/25 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
              title={isAr ? 'الاستماع لإذاعة القرآن الكريم من مكة' : 'Listen to Makkah Quran Radio'}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{isAr ? 'مباشر مكة' : 'Makkah Live'}</span>
            </button>

            {/* Quick WhatsApp Support */}
            <a
              href={`https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent('السلام عليكم ورحمة الله، أود الاستفسار عن مجمع النور الإسلامي العالمي')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#1B4B7A] hover:bg-[#0EA5A4] text-[#EAF8FF] border border-[#87CEEB]/30 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#5EEAD4]" />
              <span className="hidden sm:inline">{t.contactWhatsapp}</span>
              <span className="sm:hidden">{isAr ? 'واتساب' : 'WhatsApp'}</span>
            </a>

            <PWAInstallButton />

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-[#1B4B7A] hover:bg-[#0EA5A4] text-[#F7E7B4] transition-colors border border-[#87CEEB]/35 cursor-pointer"
              title={theme === 'dark' ? 'التبديل إلى المظهر السماوي النهاري' : 'التبديل إلى المظهر الليلي الهادئ'}
              aria-label={isAr ? 'تبديل مظهر الموقع' : 'Toggle Theme'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#F7E7B4]" /> : <Moon className="w-3.5 h-3.5 text-[#EAF8FF]" />}
            </button>

            {/* International Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 bg-[#1B4B7A] text-[#EAF8FF] border border-[#87CEEB]/40 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-[#0EA5A4] transition-colors cursor-pointer"
                aria-label={isAr ? 'اختيار لغة الموقع العالمية' : 'Select Language'}
              >
                <span>{currentLangInfo.flag}</span>
                <span>{currentLangInfo.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-[#87CEEB] transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className={`absolute top-full mt-2 w-72 sm:w-80 bg-[#FFFFFF] dark:bg-[#0B1F3A] border border-[#87CEEB]/60 dark:border-[#87CEEB]/35 rounded-2xl p-3 shadow-2xl z-50 ${isRtl ? 'left-0 text-right' : 'right-0 text-left'}`}>
                  <div className="flex items-center justify-between border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-2 mb-2 px-1">
                    <span className="text-xs font-bold text-[#12345A] dark:text-[#87CEEB]">
                      {isAr ? 'اللغات العالمية المعتمدة:' : 'Supported Languages:'}
                    </span>
                    <span className="text-[10px] text-[#2B547E] dark:text-[#B8DEF5] font-mono">12 Languages</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto">
                    {WORLD_LANGUAGES.map((l) => {
                      const isSelected = lang === l.code;
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => handleSelectLanguage(l.code)}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#12345A] text-white border border-[#D4AF37]'
                              : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-[#EAF8FF] dark:hover:bg-[#133158]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{l.flag}</span>
                            <span>{l.nativeName}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Campus Identity & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Official Brand Emblem */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-3 group focus:outline-none cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
          >
            <div className="relative shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl p-1 bg-white dark:bg-[#12345A] border-2 border-[#D4AF37]/75 shadow-[0_6px_16px_rgba(18,52,90,0.18)] group-hover:scale-105 transition-transform">
              <img
                src={OFFICIAL_COMPLEX_LOGO}
                alt="شعار مجمع النور الإسلامي العالمي"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <span className="text-sm sm:text-base font-black text-[#12345A] dark:text-[#EAF8FF] group-hover:text-[#0D7A7A] dark:group-hover:text-[#87CEEB] transition-colors leading-snug font-amiri block">
                {isAr ? 'مجمع النور الإسلامي العالمي' : 'Al Noor Global Islamic Complex'}
              </span>
              <div className="text-[10px] text-[#0D7A7A] dark:text-[#87CEEB] font-semibold flex items-center gap-1.5 tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5A4]" />
                <span>AL NOOR 3D DIGITAL CAMPUS</span>
              </div>
            </div>
          </button>

          {/* Right Controls: More Wings, Search, Account, Mobile Drawer */}
          <div className="flex items-center gap-2">
            {/* Specialized Wings Dropdown (Desktop & Tablet) */}
            <div className="relative hidden md:block" ref={moreDropdownRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isMoreActive || moreMenuOpen
                    ? 'bg-[#12345A] text-white border-[#D4AF37]'
                    : 'bg-white/85 dark:bg-[#102A4C] text-[#12345A] dark:text-[#EAF8FF] border-[#87CEEB] dark:border-[#87CEEB]/30 hover:border-[#0EA5A4]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#0EA5A4] dark:text-[#D4AF37]" />
                <span>{isAr ? 'بوابات وخدمات المجمع ▾' : 'Specialized Wings ▾'}</span>
              </button>

              {moreMenuOpen && (
                <div className={`absolute top-full mt-2 w-80 bg-white/95 dark:bg-[#0B1F3A]/95 backdrop-blur-xl border border-[#87CEEB]/70 dark:border-[#87CEEB]/35 rounded-2xl p-2.5 shadow-2xl z-50 ${isRtl ? 'left-0 text-right' : 'right-0 text-left'}`}>
                  <div className="text-[11px] font-bold text-[#12345A] dark:text-[#87CEEB] px-3 py-1.5 border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 mb-1">
                    {isAr ? 'المرافق المتخصصة والخدمات الرقمية:' : 'Specialized Campus Facilities:'}
                  </div>
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {specializedWings.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentPage === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleNavClick(sub.id)}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            isSubActive
                              ? 'bg-[#12345A] text-white'
                              : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-[#EAF8FF] dark:hover:bg-[#133158]'
                          }`}
                        >
                          <SubIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSubActive ? 'text-[#87CEEB]' : 'text-[#0EA5A4] dark:text-[#D4AF37]'}`} />
                          <div className="min-w-0">
                            <span className="font-bold block leading-tight">{isAr ? sub.labelAr : sub.labelEn}</span>
                            <span className={`text-[10px] block line-clamp-1 mt-0.5 ${isSubActive ? 'text-[#BCE7FB]' : 'text-[#2B547E] dark:text-[#B8DEF5]'}`}>
                              {isAr ? sub.descAr : sub.descEn}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Global Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/85 dark:bg-[#102A4C] hover:bg-white dark:hover:bg-[#133158] border border-[#87CEEB] dark:border-[#87CEEB]/30 text-[#12345A] dark:text-[#EAF8FF] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title={isAr ? 'البحث الشامل (⌘K)' : 'Campus Search (⌘K)'}
            >
              <Search className="w-3.5 h-3.5 text-[#0EA5A4] dark:text-[#87CEEB]" />
              <span className="hidden md:inline">{isAr ? 'بحث المجمع' : 'Search'}</span>
              <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 bg-[#EAF8FF] dark:bg-[#0B1F3A] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded text-[#12345A] dark:text-[#87CEEB]">
                ⌘K
              </kbd>
            </button>

            {/* User Account / Login Button */}
            {user ? (
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#12345A] hover:bg-[#0D7A7A] border border-[#D4AF37]/60 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#87CEEB]" />
                <span className="hidden sm:inline truncate max-w-[100px]">
                  {(user.name || user.fullName || '').split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#12345A] hover:bg-[#0EA5A4] dark:bg-[#0EA5A4] dark:hover:bg-[#87CEEB] text-white dark:text-[#091B33] rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            )}

            {/* Admin Shortcut if authorized */}
            {isAuthorizedAdmin && (
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  currentPage === 'admin'
                    ? 'bg-[#D4AF37] text-[#12345A] border-[#D4AF37]'
                    : 'bg-white/85 dark:bg-[#102A4C] text-[#12345A] dark:text-[#F7E7B4] border-[#D4AF37]/60'
                }`}
                title={isAr ? 'لوحة الإدارة العامة' : 'Admin Console'}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{isAr ? 'الإدارة' : 'Admin'}</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-white/85 dark:bg-[#102A4C] border border-[#87CEEB] dark:border-[#87CEEB]/30 text-[#12345A] dark:text-[#87CEEB] cursor-pointer"
              aria-label={isAr ? 'القائمة الرئيسية' : 'Main Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop 11 Global Navigation Items Bar */}
        <nav
          aria-label={isAr ? 'التنقل الرئيسي لأقسام المجمع' : 'Global Campus Navigation'}
          className="hidden xl:flex flex-wrap items-center justify-center gap-1 pt-2.5 mt-2.5 border-t border-[#87CEEB]/50 dark:border-[#87CEEB]/20"
        >
          {globalCampusNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#12345A] text-white dark:bg-[#87CEEB] dark:text-[#091B33] shadow-sm'
                    : 'text-[#12345A] dark:text-[#EAF8FF] hover:text-[#0D7A7A] dark:hover:text-[#87CEEB] hover:bg-white/75 dark:hover:bg-[#133158]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#87CEEB] dark:text-[#091B33]' : 'text-[#0EA5A4] dark:text-[#87CEEB]'}`} />
                <span>{isAr ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu — Structured Categorized Campus Wings */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#EAF8FF] dark:bg-[#0B1F3A] border-t border-[#87CEEB]/50 dark:border-[#87CEEB]/25 px-4 py-4 space-y-5 max-h-[78vh] overflow-y-auto shadow-xl">
          {/* Section 1: 11 Global Navigation Items */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#12345A] dark:text-[#87CEEB] flex items-center gap-1.5 px-1">
              <Home className="w-3.5 h-3.5" />
              <span>{isAr ? 'مباني وأقسام المجمع الرئيسية' : 'Main Campus Navigation'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {globalCampusNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl font-bold transition-all text-start cursor-pointer ${
                      isActive
                        ? 'bg-[#12345A] text-white border border-[#D4AF37]'
                        : 'bg-white dark:bg-[#102A4C] text-[#12345A] dark:text-[#EAF8FF] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#87CEEB]' : 'text-[#0EA5A4] dark:text-[#87CEEB]'}`} />
                    <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Specialized Portals */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#12345A] dark:text-[#87CEEB] flex items-center gap-1.5 px-1">
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'الخدمات والمرافق التخصصية' : 'Specialized Facilities'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {specializedWings.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl font-bold transition-all text-start cursor-pointer ${
                      isActive
                        ? 'bg-[#12345A] text-white border border-[#D4AF37]'
                        : 'bg-white dark:bg-[#102A4C] text-[#12345A] dark:text-[#EAF8FF] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#87CEEB]' : 'text-[#0EA5A4] dark:text-[#87CEEB]'}`} />
                    <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account Action */}
          <div className="pt-2 border-t border-[#87CEEB]/40 dark:border-[#87CEEB]/20">
            {user ? (
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className="w-full py-2.5 bg-[#12345A] text-white font-bold rounded-xl text-xs border border-[#D4AF37]/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-[#87CEEB]" />
                <span>
                  {isAr
                    ? `بوابة حسابي (${user.name || user.fullName})`
                    : `My Portal (${user.name || user.fullName})`}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-2.5 bg-[#12345A] text-white font-bold rounded-xl text-xs border border-[#87CEEB]/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-[#87CEEB]" />
                <span>{isAr ? 'تسجيل الدخول / إنشاء حساب طالب' : 'Sign In / Create Account'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
