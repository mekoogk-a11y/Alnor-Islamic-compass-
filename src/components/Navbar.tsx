import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, Globe, HeartHandshake, GraduationCap, Library, 
  Info, Mail, Menu, X, Sparkles, MessageCircle, Radio, 
  ChevronDown, Check, Compass, Scroll, Users, Search, 
  Sun, Moon, User, ShieldCheck, HelpCircle, Mic, Zap
} from 'lucide-react';
import { NavigationPage } from '../types';
import { COMPLEX_INFO } from '../data/islamicData';
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
  const { lang, setLang, t, isRtl, currentLangInfo } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, openAuthModal } = useAuth();
  const langDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: NavigationPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t.navHome, icon: Globe },
    { id: 'quran', label: t.navQuran, icon: BookOpen },
    { id: 'hadith', label: lang === 'ar' ? 'السنة النبوية' : 'Hadith', icon: Scroll },
    { id: 'academy', label: lang === 'ar' ? 'الأكاديمية' : 'Academy', icon: GraduationCap },
    { id: 'scholars', label: lang === 'ar' ? 'هيئة العلماء' : 'Scholars', icon: Users },
    { id: 'aiScholar', label: lang === 'ar' ? 'المساعد الذكي' : 'AI Scholar', icon: Sparkles },
    { id: 'newMuslims', label: t.navNewMuslims, icon: Compass },
    { id: 'radio', label: lang === 'ar' ? 'إذاعة مكة 🕋' : 'Radio', icon: Radio },
    { id: 'audioStudio', label: lang === 'ar' ? 'الصوت الإعلاني 🇸🇩' : 'Voice Ads', icon: Mic },
    { id: 'apiGateway', label: lang === 'ar' ? 'بوابة API ⚡' : 'API Gateway', icon: Zap },
    { id: 'sciences', label: t.navSciences, icon: Library },
    { id: 'waqf', label: t.navWaqf, icon: HeartHandshake },
    { id: 'community', label: lang === 'ar' ? 'الملتقى' : 'Forum', icon: HelpCircle },
    { id: 'about', label: t.navAbout, icon: Info },
  ];

  const handleNavClick = (page: NavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLanguage = (code: typeof lang) => {
    setLang(code);
    setLangMenuOpen(false);
  };

  const whatsappCleanNumber = COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '');

  return (
    <header className="border-b border-[#E5DCCB] dark:border-[#3A4237] bg-[#F7F5EF]/95 dark:bg-[#1F221E]/95 backdrop-blur-md sticky top-0 z-40 shadow-sm transition-colors">
      
      {/* Top International Institutional Ribbon (Deep Elegant Green) */}
      <div className="bg-[#394E43] text-[#F7F5EF] py-1.5 px-4 text-xs font-semibold tracking-wide border-b border-[#B9A477]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          
          {/* Institutional Global Mission & Slogan */}
          <div className="flex items-center gap-3 text-[11px] overflow-x-auto w-full md:w-auto justify-center md:justify-start">
            <span className="flex items-center gap-1.5 bg-[#2B3B33] text-[#F7F5EF] px-2.5 py-0.5 rounded-full font-bold border border-[#B9A477]/30 shrink-0">
              <Sparkles className="w-3 h-3 text-[#B9A477]" />
              <span className="font-amiri text-xs font-bold">{t.sloganQuote}</span>
            </span>

            <span className="hidden sm:inline-block text-[#B9A477]/60">•</span>

            <span className="hidden sm:inline-flex items-center gap-1 text-[#E5DCCB] font-medium shrink-0">
              <Globe className="w-3 h-3 text-[#B9A477]" />
              <span>صرح إسلامي وقفي شامل يخدم المستفيدين في 140 دولة</span>
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            
            {/* Live Quran Radio from Makkah */}
            <button
              onClick={() => handleNavClick('radio')}
              className="flex items-center gap-1.5 bg-[#2B3B33] hover:bg-[#23302A] text-[#F7F5EF] border border-[#B9A477]/40 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
              title="الاستماع لإذاعة القرآن الكريم مباشر من مكة المكرمة"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>مباشر من مكة 🕋</span>
            </button>

            {/* Quick Contact Helpdesk */}
            <a
              href={`https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent('السلام عليكم ورحمة الله، أود الاستفسار عن مجمع النور الإسلامي العالمي')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#2B3B33] hover:bg-[#23302A] text-[#F7F5EF] border border-[#B9A477]/30 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
              title="محادثة فورية مع خدمة المستفيدين"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#B9A477]" />
              <span className="hidden sm:inline">{t.contactWhatsapp}</span>
              <span className="sm:hidden">واتساب</span>
            </a>

            <PWAInstallButton />

            {/* Theme Toggle (Day / Night Mode) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-[#2B3B33] hover:bg-[#23302A] text-[#E5DCCB] transition-colors border border-[#B9A477]/20"
              title={theme === 'dark' ? 'التبديل إلى المظهر العاجي النهاري' : 'التبديل إلى المظهر الداكن'}
              aria-label="تبديل مظهر الموقع"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#B9A477]" /> : <Moon className="w-3.5 h-3.5 text-[#E5DCCB]" />}
            </button>

            {/* International Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 bg-[#2B3B33] text-[#F7F5EF] border border-[#B9A477]/40 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-[#23302A] transition-all shadow-sm"
                aria-label="اختيار لغة الموقع العالمية"
              >
                <span>{currentLangInfo.flag}</span>
                <span>{currentLangInfo.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-[#B9A477] transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className={`absolute top-full mt-2 w-72 sm:w-80 bg-[#FAF8F2] dark:bg-[#272B25] border border-[#D8CEBB] dark:border-[#4A5447] rounded-2xl p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 ${isRtl ? 'left-0 text-right' : 'right-0 text-left'}`}>
                  <div className="flex items-center justify-between border-b border-[#E5DCCB] dark:border-[#3A4237] pb-2 mb-2 px-1">
                    <span className="text-xs font-bold text-[#394E43] dark:text-[#E5DCCB] flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#B9A477]" />
                      <span>اللغات العالمية المتاحة ({WORLD_LANGUAGES.length})</span>
                    </span>
                    <span className="text-[10px] text-[#657568] dark:text-[#B9A477] font-semibold">Verified</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto p-0.5 custom-scrollbar">
                    {WORLD_LANGUAGES.map((item) => {
                      const isSelected = item.code === lang;
                      return (
                        <button
                          key={item.code}
                          onClick={() => handleSelectLanguage(item.code)}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                            isSelected
                              ? 'bg-[#394E43] text-[#F7F5EF] font-bold shadow-sm'
                              : 'bg-[#F0EDE4] dark:bg-[#20241E] text-[#343832] dark:text-[#E5DCCB] hover:bg-[#E5DCCB] dark:hover:bg-[#2E352B] border border-[#E5DCCB] dark:border-[#3A4237]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{item.flag}</span>
                            <div className="flex flex-col text-[11px] leading-tight">
                              <span className="font-bold">{item.nativeName}</span>
                              <span className={`text-[9px] ${isSelected ? 'text-[#E5DCCB]' : 'text-[#80887D]'}`}>
                                {item.name}
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
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

      {/* Main Global Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Emblem & Official Institution Name */}
          <button
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-3.5 group focus:outline-none ${isRtl ? 'text-right' : 'text-left'}`}
          >
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-[#394E43] p-0.5 shadow-sm border border-[#B9A477]/40 group-hover:border-[#B9A477] transition-all">
                <div className="w-full h-full bg-[#394E43] rounded-[14px] flex items-center justify-center p-2 text-[#F7F5EF] group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5 text-[#B9A477] stroke-[2.2]" />
                </div>
              </div>
              <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-[#B9A477] border border-[#F7F5EF] dark:border-[#1F221E] flex items-center justify-center text-[8px] text-white font-bold">
                ★
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black text-[#343832] dark:text-[#F7F5EF] group-hover:text-[#394E43] dark:group-hover:text-[#B9A477] transition-colors leading-snug">
                  {t.complexName}
                </span>
              </div>
              <div className="text-[11px] text-[#657568] dark:text-[#B9A477] font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#657568] dark:bg-[#B9A477]" />
                <span>{t.heroBadge}</span>
              </div>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden 2xl:flex items-center gap-1">
            {navItems.slice(0, 8).map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#394E43] text-[#F7F5EF] font-bold shadow-sm'
                      : 'text-[#5E655B] dark:text-[#D8CEBB] hover:text-[#343832] dark:hover:text-[#F7F5EF] hover:bg-[#F0EDE4] dark:hover:bg-[#272B25]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B9A477]' : 'text-[#657568] dark:text-[#B9A477]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search Trigger, User Auth & Actions */}
          <div className="flex items-center gap-2">
            
            {/* Global Search Button (⌘K) */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#F0EDE4] dark:bg-[#272B25] hover:bg-[#E5DCCB] dark:hover:bg-[#343B31] border border-[#E5DCCB] dark:border-[#3A4237] text-[#5E655B] dark:text-[#D8CEBB] hover:text-[#343832] dark:hover:text-white rounded-xl text-xs transition"
              title="البحث المركزي (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#B9A477]" />
              <span className="hidden md:inline">بحث</span>
              <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 bg-[#FAF8F2] dark:bg-[#1F221E] border border-[#D8CEBB] dark:border-[#4A5447] rounded text-[#80887D]">⌘K</kbd>
            </button>

            {/* User Account / Login Button */}
            {user ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#394E43]/10 dark:bg-[#394E43]/30 hover:bg-[#394E43]/20 border border-[#394E43]/40 text-[#394E43] dark:text-[#E5DCCB] rounded-xl text-xs font-bold transition"
              >
                <User className="w-3.5 h-3.5 text-[#B9A477]" />
                <span className="hidden sm:inline truncate max-w-[100px]">{(user.name || user.fullName || '').split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0EDE4] dark:bg-[#272B25] hover:bg-[#E5DCCB] dark:hover:bg-[#343B31] border border-[#E5DCCB] dark:border-[#3A4237] text-[#343832] dark:text-[#E5DCCB] rounded-xl text-xs font-bold transition"
              >
                <User className="w-3.5 h-3.5 text-[#B9A477]" />
                <span className="hidden sm:inline">دخول</span>
              </button>
            )}

            {/* Admin Dashboard shortcut if admin */}
            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#657568]/15 hover:bg-[#657568]/25 border border-[#657568]/30 text-[#394E43] dark:text-[#E5DCCB] rounded-xl text-xs font-bold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#B9A477]" />
                <span className="hidden md:inline">الإدارة</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('register')}
              className="hidden sm:flex items-center gap-1.5 bg-[#394E43] hover:bg-[#2E3F36] text-[#F7F5EF] text-xs font-bold px-3.5 py-1.5 rounded-xl border border-[#B9A477]/40 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B9A477]" />
              <span>{t.btnRegister}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="2xl:hidden p-2 rounded-xl bg-[#F0EDE4] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] text-[#343832] dark:text-[#E5DCCB] hover:text-[#394E43]"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="2xl:hidden bg-[#FAF8F2] dark:bg-[#242822] border-b border-[#E5DCCB] dark:border-[#3A4237] px-4 py-4 space-y-4 animate-in fade-in duration-200">
          
          {/* Quick Helpdesk Banner */}
          <div className="p-3 bg-[#F0EDE4] dark:bg-[#1F221E] rounded-2xl border border-[#E5DCCB] dark:border-[#3A4237] flex items-center justify-between text-xs">
            <span className="text-[#5E655B] dark:text-[#D8CEBB]">خدمة المستفيدين والاستفسارات:</span>
            <a
              href={`https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent('السلام عليكم ورحمة الله، استفسار عن برامج مجمع النور')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-[#394E43] text-[#F7F5EF] px-3 py-1 rounded-lg font-bold border border-[#B9A477]/30"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#B9A477]" />
              <span>تواصل واتساب</span>
            </a>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl font-bold transition-all ${isRtl ? 'text-right' : 'text-left'} ${
                    isActive
                      ? 'bg-[#394E43] text-[#F7F5EF] font-bold shadow-sm'
                      : 'bg-[#F0EDE4] dark:bg-[#1F221E] text-[#343832] dark:text-[#D8CEBB] hover:bg-[#E5DCCB] border border-[#E5DCCB] dark:border-[#3A4237]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B9A477]' : 'text-[#657568] dark:text-[#B9A477]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Profile shortcut in mobile menu */}
          <div className="pt-2 border-t border-[#E5DCCB] dark:border-[#3A4237] flex items-center justify-between">
            {user ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full py-2 bg-[#394E43] text-[#F7F5EF] font-bold rounded-xl text-xs border border-[#B9A477]/30 flex items-center justify-center gap-2 shadow-sm"
              >
                <User className="w-4 h-4 text-[#B9A477]" />
                <span>لوحة متابعة الطالب ({user.name || user.fullName})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-2 bg-[#F0EDE4] dark:bg-[#1F221E] text-[#394E43] dark:text-[#B9A477] font-bold rounded-xl text-xs border border-[#E5DCCB] dark:border-[#3A4237] flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-[#B9A477]" />
                <span>تسجيل الدخول / إنشاء حساب جديد</span>
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
