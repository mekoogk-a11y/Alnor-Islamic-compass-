import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen, Globe, HeartHandshake, GraduationCap, Library,
  Info, Mail, Menu, X, Sparkles, MessageCircle, Radio,
  ChevronDown, Check, Compass, Scroll, Users, Search,
  Sun, Moon, User, ShieldCheck, HelpCircle, Mic, Zap,
  Microscope, Newspaper, Globe2, Home, Layers
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
    <header className="sticky top-0 z-40 shadow-md transition-colors bg-[#FFFFFF]/95 dark:bg-[#04382B]/95 backdrop-blur-xl border-b border-[#DDD6C7] dark:border-[#C8A24A]/35">
      {/* Top Institutional Emerald Sanctuary Ribbon */}
      <div className="bg-[#022C22] text-[#FAF8F2] py-1.5 px-4 text-xs font-semibold border-b border-[#C8A24A]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Motto & Campus Reach */}
          <div className="flex items-center gap-3 text-[11px] overflow-x-auto w-full md:w-auto justify-center md:justify-start no-scrollbar">
            <span className="flex items-center gap-1.5 bg-[#064E3B] text-[#E5C97B] px-3 py-0.5 rounded-lg font-bold border border-[#C8A24A]/40 shrink-0">
              <Sparkles className="w-3 h-3 text-[#C8A24A]" />
              <span className="font-amiri text-xs font-bold">
                {isAr
                  ? '«القرآن هداية، والعلم بناء، والعمل الخيري عطاء»'
                  : '“Quran as Guidance · Knowledge as Construction · Charity as Giving”'}
              </span>
            </span>

            <span className="hidden lg:inline-block text-[#C8A24A]/60">•</span>

            <span className="hidden lg:inline-flex items-center gap-1.5 text-[#D1E7DD] font-medium shrink-0">
              <Globe className="w-3.5 h-3.5 text-[#C8A24A]" />
              <span>
                {isAr
                  ? 'الصرح الرقمي لمجمع النور الإسلامي العالمي · 8 مبانٍ وأقسام متخصصة'
                  : 'Al Noor Global Digital Islamic Campus · 8 Specialized Departments'}
              </span>
            </span>
          </div>

          {/* Quick Campus Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Makkah Radio Shortcut */}
            <button
              type="button"
              onClick={() => handleNavClick('radio')}
              className="flex items-center gap-1.5 bg-[#064E3B] hover:bg-[#047857] text-[#FAF8F2] border border-[#C8A24A]/45 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
              title={isAr ? 'الاستماع لإذاعة القرآن الكريم من مكة' : 'Listen to Makkah Quran Radio'}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isAr ? 'مباشر مكة' : 'Makkah Live'}</span>
            </button>

            {/* Quick WhatsApp Support */}
            <a
              href={`https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent('السلام عليكم ورحمة الله، أود الاستفسار عن مجمع النور الإسلامي العالمي')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#064E3B] hover:bg-[#047857] text-[#FAF8F2] border border-[#C8A24A]/35 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#34D399]" />
              <span className="hidden sm:inline">{t.contactWhatsapp}</span>
              <span className="sm:hidden">{isAr ? 'واتساب' : 'WhatsApp'}</span>
            </a>

            <PWAInstallButton />

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-[#064E3B] hover:bg-[#047857] text-[#E5C97B] transition-colors border border-[#C8A24A]/35 cursor-pointer"
              title={theme === 'dark' ? 'التبديل إلى المظهر العاجي النهاري' : 'التبديل إلى المظهر الزمردي الليلي'}
              aria-label={isAr ? 'تبديل مظهر الموقع' : 'Toggle Theme'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#E5C97B]" /> : <Moon className="w-3.5 h-3.5 text-[#E5C97B]" />}
            </button>

            {/* International Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 bg-[#064E3B] text-[#FAF8F2] border border-[#C8A24A]/45 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-[#047857] transition-colors cursor-pointer"
                aria-label={isAr ? 'اختيار لغة الموقع العالمية' : 'Select Language'}
              >
                <span>{currentLangInfo.flag}</span>
                <span>{currentLangInfo.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-[#C8A24A] transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className={`absolute top-full mt-2 w-72 sm:w-80 bg-[#FFFFFF] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/40 rounded-2xl p-3 shadow-2xl z-50 ${isRtl ? 'left-0 text-right' : 'right-0 text-left'}`}>
                  <div className="flex items-center justify-between border-b border-[#DDD6C7] dark:border-[#C8A24A]/25 pb-2 mb-2 px-1">
                    <span className="text-xs font-bold text-[#064E3B] dark:text-[#E5C97B]">
                      {isAr ? 'اللغات العالمية المعتمدة:' : 'Supported Languages:'}
                    </span>
                    <span className="text-[10px] text-[#5C746B] dark:text-[#A3C4B8] font-mono">12 Languages</span>
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
                              ? 'bg-[#064E3B] text-[#FAF8F2] border border-[#C8A24A]'
                              : 'text-[#0F2920] dark:text-[#D1E7DD] hover:bg-[#EFECE3] dark:hover:bg-[#064E3B]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{l.flag}</span>
                            <span>{l.nativeName}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#C8A24A]" />}
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
            <div className="relative shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl p-1 bg-[#022C22] border border-[#C8A24A]/50 shadow-sm group-hover:scale-105 transition-transform">
              <img
                src={OFFICIAL_COMPLEX_LOGO}
                alt="شعار مجمع النور الإسلامي العالمي"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <span className="text-sm sm:text-base font-black text-[#064E3B] dark:text-[#FAF8F2] group-hover:text-[#047857] dark:group-hover:text-[#E5C97B] transition-colors leading-snug font-amiri block">
                {isAr ? 'مجمع النور الإسلامي العالمي' : 'Al Noor Global Islamic Complex'}
              </span>
              <div className="text-[10px] text-[#9E7B2B] dark:text-[#E5C97B] font-semibold flex items-center gap-1.5 tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#047857] dark:bg-[#34D399]" />
                <span>AL NOOR DIGITAL ISLAMIC CAMPUS</span>
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
                    ? 'bg-[#064E3B] text-[#FAF8F2] border-[#C8A24A]'
                    : 'bg-[#FAF8F2] dark:bg-[#022C22] text-[#0F2920] dark:text-[#FAF8F2] border-[#DDD6C7] dark:border-[#C8A24A]/35 hover:border-[#C8A24A]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#C8A24A]" />
                <span>{isAr ? 'بوابات وخدمات المجمع ▾' : 'Specialized Wings ▾'}</span>
              </button>

              {moreMenuOpen && (
                <div className={`absolute top-full mt-2 w-80 bg-[#FFFFFF] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/40 rounded-2xl p-2.5 shadow-2xl z-50 ${isRtl ? 'left-0 text-right' : 'right-0 text-left'}`}>
                  <div className="text-[11px] font-bold text-[#064E3B] dark:text-[#E5C97B] px-3 py-1.5 border-b border-[#DDD6C7] dark:border-[#C8A24A]/25 mb-1">
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
                              ? 'bg-[#064E3B] text-white'
                              : 'text-[#0F2920] dark:text-[#FAF8F2] hover:bg-[#FAF8F2] dark:hover:bg-[#064E3B]/70'
                          }`}
                        >
                          <SubIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSubActive ? 'text-[#E5C97B]' : 'text-[#047857] dark:text-[#C8A24A]'}`} />
                          <div className="min-w-0">
                            <span className="font-bold block leading-tight">{isAr ? sub.labelAr : sub.labelEn}</span>
                            <span className={`text-[10px] block line-clamp-1 mt-0.5 ${isSubActive ? 'text-[#D1E7DD]' : 'text-[#5C746B] dark:text-[#A3C4B8]'}`}>
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
              className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF8F2] dark:bg-[#022C22] hover:bg-[#EFECE3] dark:hover:bg-[#064E3B] border border-[#DDD6C7] dark:border-[#C8A24A]/35 text-[#0F2920] dark:text-[#FAF8F2] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title={isAr ? 'البحث الشامل (⌘K)' : 'Campus Search (⌘K)'}
            >
              <Search className="w-3.5 h-3.5 text-[#064E3B] dark:text-[#C8A24A]" />
              <span className="hidden md:inline">{isAr ? 'بحث المجمع' : 'Search'}</span>
              <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/35 rounded text-[#064E3B] dark:text-[#E5C97B]">
                ⌘K
              </kbd>
            </button>

            {/* User Account / Login Button */}
            {user ? (
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#064E3B] hover:bg-[#047857] border border-[#C8A24A]/50 text-[#FAF8F2] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#E5C97B]" />
                <span className="hidden sm:inline truncate max-w-[100px]">
                  {(user.name || user.fullName || '').split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#064E3B] hover:bg-[#047857] dark:bg-[#C8A24A] dark:hover:bg-[#DFBE68] text-white dark:text-[#022C22] rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
                    ? 'bg-[#C8A24A] text-[#022C22] border-[#C8A24A]'
                    : 'bg-[#FAF8F2] dark:bg-[#022C22] text-[#064E3B] dark:text-[#E5C97B] border-[#C8A24A]/50'
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
              className="xl:hidden p-2 rounded-xl bg-[#FAF8F2] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/35 text-[#064E3B] dark:text-[#E5C97B] cursor-pointer"
              aria-label={isAr ? 'القائمة الرئيسية' : 'Main Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop 11 Global Navigation Items Bar */}
        <nav
          aria-label={isAr ? 'التنقل الرئيسي لأقسام المجمع' : 'Global Campus Navigation'}
          className="hidden xl:flex flex-wrap items-center justify-center gap-1 pt-2.5 mt-2.5 border-t border-[#EFECE3] dark:border-[#C8A24A]/20"
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
                    ? 'bg-[#064E3B] text-[#FAF8F2] dark:bg-[#C8A24A] dark:text-[#022C22] shadow-sm'
                    : 'text-[#38554B] dark:text-[#D1E7DD] hover:text-[#064E3B] dark:hover:text-[#FAF8F2] hover:bg-[#EFECE3] dark:hover:bg-[#064E3B]/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E5C97B] dark:text-[#022C22]' : 'text-[#047857] dark:text-[#C8A24A]'}`} />
                <span>{isAr ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu — Structured Categorized Campus Wings */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF8F2] dark:bg-[#022C22] border-t border-[#DDD6C7] dark:border-[#C8A24A]/35 px-4 py-4 space-y-5 max-h-[78vh] overflow-y-auto shadow-xl">
          {/* Section 1: 11 Global Navigation Items */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#064E3B] dark:text-[#E5C97B] flex items-center gap-1.5 px-1">
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
                        ? 'bg-[#064E3B] text-white border border-[#C8A24A]'
                        : 'bg-[#FFFFFF] dark:bg-[#04382B] text-[#0F2920] dark:text-[#FAF8F2] border border-[#DDD6C7] dark:border-[#C8A24A]/25'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E5C97B]' : 'text-[#047857] dark:text-[#C8A24A]'}`} />
                    <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Specialized Portals */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#064E3B] dark:text-[#E5C97B] flex items-center gap-1.5 px-1">
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
                        ? 'bg-[#064E3B] text-white border border-[#C8A24A]'
                        : 'bg-[#FFFFFF] dark:bg-[#04382B] text-[#0F2920] dark:text-[#FAF8F2] border border-[#DDD6C7] dark:border-[#C8A24A]/25'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E5C97B]' : 'text-[#047857] dark:text-[#C8A24A]'}`} />
                    <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account Action */}
          <div className="pt-2 border-t border-[#DDD6C7] dark:border-[#C8A24A]/25">
            {user ? (
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className="w-full py-2.5 bg-[#064E3B] text-[#FAF8F2] font-bold rounded-xl text-xs border border-[#C8A24A]/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-[#E5C97B]" />
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
                className="w-full py-2.5 bg-[#064E3B] text-white font-bold rounded-xl text-xs border border-[#C8A24A]/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-[#E5C97B]" />
                <span>{isAr ? 'تسجيل الدخول / إنشاء حساب طالب' : 'Sign In / Create Account'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
