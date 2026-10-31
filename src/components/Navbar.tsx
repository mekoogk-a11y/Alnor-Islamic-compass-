import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, Globe, HeartHandshake, GraduationCap, Library, 
  Info, Mail, Menu, X, Sparkles, MessageCircle, Radio, 
  ChevronDown, Check, Compass, Scroll, Users, Search, 
  Sun, Moon, User, ShieldCheck, HelpCircle
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
    { id: 'radio', label: lang === 'ar' ? 'إذاعة مكة 📻' : 'Radio', icon: Radio },
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
    <header className="border-b border-emerald-900/40 bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 shadow-2xl transition-colors">
      
      {/* Top International Institutional Ribbon */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-emerald-800 py-1.5 px-4 text-xs font-bold text-slate-950 tracking-wide shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          
          {/* Institutional Global Mission & Slogan */}
          <div className="flex items-center gap-3 text-[11px] overflow-x-auto w-full md:w-auto justify-center md:justify-start">
            <span className="flex items-center gap-1.5 bg-slate-950/20 px-2.5 py-0.5 rounded-full text-slate-950 font-bold shrink-0">
              <Sparkles className="w-3 h-3" />
              <span>{t.sloganQuote}</span>
            </span>

            <span className="hidden sm:inline-block text-slate-950/50">•</span>

            <span className="hidden sm:inline-flex items-center gap-1 text-slate-900 font-semibold shrink-0">
              <Globe className="w-3 h-3 text-slate-950" />
              <span>140 دولة • إشراف نخبة من كبار العلماء والمقرئين المعتمدين</span>
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            
            {/* Live Quran Radio from Makkah indicator button */}
            <button
              onClick={() => handleNavClick('radio')}
              className="flex items-center gap-1.5 bg-slate-950/25 hover:bg-slate-950/40 text-slate-950 px-2.5 py-1 rounded-lg text-[11px] font-black transition-colors cursor-pointer"
              title="الاستماع لإذاعة القرآن الكريم مباشر من مكة المكرمة"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>مباشر من مكة 🕋</span>
            </button>

            {/* Quick Contact Helpdesk */}
            <a
              href={`https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent('السلام عليكم ورحمة الله، أود الاستفسار عن مجمع النور الإسلامي العالمي')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 px-2.5 py-1 rounded-lg text-[11px] font-black transition-colors"
              title="محادثة فورية مع خدمة المستفيدين"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.contactWhatsapp}</span>
              <span className="sm:hidden">واتساب</span>
            </a>

            <PWAInstallButton />

            {/* Theme Toggle (Day / Night Mode) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 transition-colors"
              title={theme === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
              aria-label="تبديل مظهر الموقع"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* International Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 bg-slate-950 text-amber-300 border border-slate-800 px-3 py-1 rounded-lg text-[11px] font-black hover:bg-slate-900 transition-all shadow-sm"
                aria-label="اختيار لغة الموقع العالمية"
              >
                <span>{currentLangInfo.flag}</span>
                <span>{currentLangInfo.nativeName}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className={`absolute top-full mt-2 w-72 sm:w-80 bg-slate-900 border border-amber-500/30 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${isRtl ? 'left-0 text-right' : 'right-0 text-left'}`}>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 px-1">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>اللغات العالمية المتاحة ({WORLD_LANGUAGES.length})</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Verified</span>
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
                              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                              : 'bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{item.flag}</span>
                            <div className="flex flex-col text-[11px] leading-tight">
                              <span className="font-bold">{item.nativeName}</span>
                              <span className={`text-[9px] ${isSelected ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                                {item.name}
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
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
          
          {/* Brand Emblem & Name */}
          <button
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-3.5 group focus:outline-none ${isRtl ? 'text-right' : 'text-left'}`}
          >
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-emerald-700 p-0.5 shadow-lg shadow-amber-500/15 group-hover:shadow-amber-500/30 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center p-2 text-amber-400 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6 text-amber-400 stroke-[2.2]" />
                </div>
              </div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[9px] text-white font-bold">
                ★
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {t.complexName}
                </span>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
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
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs transition"
              title="البحث المركزي (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">بحث</span>
              <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 bg-slate-950 border border-slate-700 rounded text-slate-400">⌘K</kbd>
            </button>

            {/* User Account / Login Button */}
            {user ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded-xl text-xs font-bold transition"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline truncate max-w-[100px]">{(user.name || user.fullName || '').split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">دخول</span>
              </button>
            )}

            {/* Admin Dashboard shortcut if admin */}
            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-700 text-purple-300 rounded-xl text-xs font-bold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">الإدارة</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('register')}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.btnRegister}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="2xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="2xl:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-4 animate-in fade-in duration-200">
          
          {/* Quick Helpdesk Banner */}
          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">خدمة المستفيدين والاستفسارات:</span>
            <a
              href={`https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent('السلام عليكم ورحمة الله، استفسار عن برامج مجمع النور')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-[#25D366] text-slate-950 px-3 py-1 rounded-lg font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
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
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Profile shortcut in mobile menu */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            {user ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full py-2 bg-emerald-950 text-emerald-300 font-bold rounded-xl text-xs border border-emerald-700/60 flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>لوحة متابعة الطالب ({user.name || user.fullName})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-2 bg-slate-900 text-amber-400 font-bold rounded-xl text-xs border border-slate-800 flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>تسجيل الدخول / إنشاء حساب جديد</span>
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
