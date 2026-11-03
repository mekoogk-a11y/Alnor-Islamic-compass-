import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, Globe, HeartHandshake, GraduationCap, Library, 
  Info, Mail, Menu, X, Sparkles, MessageCircle, Radio, 
  ChevronDown, Check, Compass, Scroll, Users, Search, 
  Sun, Moon, User, ShieldCheck, HelpCircle, Mic, Zap
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
    { id: 'translationsReader', label: lang === 'ar' ? 'ترجمات القرآن 🌐' : 'Translations', icon: Globe },
    { id: 'noorAmbassador', label: lang === 'ar' ? 'سفير النور 🌟' : 'Ambassador', icon: Sparkles },
    { id: 'discoverIslam', label: lang === 'ar' ? 'اسأل عن الإسلام 💬' : 'Ask Islam', icon: MessageCircle },
    { id: 'orphansCare', label: lang === 'ar' ? 'كفالة الأيتام 🤲' : 'Orphans Care', icon: HeartHandshake },
    { id: 'hadith', label: lang === 'ar' ? 'السنة النبوية' : 'Hadith', icon: Scroll },
    { id: 'academy', label: lang === 'ar' ? 'الأكاديمية' : 'Academy', icon: GraduationCap },
    { id: 'scholars', label: lang === 'ar' ? 'هيئة العلماء' : 'Scholars', icon: Users },
    { id: 'aiScholar', label: lang === 'ar' ? 'المساعد الذكي' : 'AI Scholar', icon: Sparkles },
    { id: 'radio', label: lang === 'ar' ? 'إذاعة مكة 🕋' : 'Radio', icon: Radio },
    { id: 'audioStudio', label: lang === 'ar' ? 'الصوت الإعلاني 🇸🇩' : 'Voice Ads', icon: Mic },
    { id: 'apiGateway', label: lang === 'ar' ? 'بوابة API ⚡' : 'API Gateway', icon: Zap },
    { id: 'newMuslims', label: t.navNewMuslims, icon: Compass },
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
    <header className="border-b border-[#D4AF37]/20 bg-[#070D1E]/95 backdrop-blur-xl sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-colors">
      
      {/* Top International Institutional Ribbon (Deep Nocturnal Blue & Radiant Gold) */}
      <div className="bg-[#0B132B] text-[#F8FAFC] py-1.5 px-4 text-xs font-semibold tracking-wide border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          
          {/* Institutional Global Mission & Slogan */}
          <div className="flex items-center gap-3 text-[11px] overflow-x-auto w-full md:w-auto justify-center md:justify-start">
            <span className="flex items-center gap-1.5 bg-[#111C3D] text-[#D4AF37] px-3 py-0.5 rounded-full font-bold border border-[#D4AF37]/40 shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.15)]">
              <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
              <span className="font-amiri text-xs font-bold">«القرآن هداية، والعلم بناء، والعمل الخيري عطاء»</span>
            </span>

            <span className="hidden sm:inline-block text-[#D4AF37]/60">•</span>

            <span className="hidden sm:inline-flex items-center gap-1 text-[#94A3B8] font-medium shrink-0">
              <Globe className="w-3 h-3 text-[#D4AF37]" />
              <span>منصة عالمية موحدة تربط 140 دولة بالهداية والعلم الرصين</span>
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            
            {/* Live Quran Radio from Makkah */}
            <button
              onClick={() => handleNavClick('radio')}
              className="flex items-center gap-1.5 bg-[#111C3D] hover:bg-[#1E2E5D] text-[#F8FAFC] border border-[#D4AF37]/50 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(212,175,55,0.15)]"
              title="الاستماع لإذاعة القرآن الكريم مباشر من مكة المكرمة"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>مباشر مكة 🕋</span>
            </button>

            {/* Quick Contact Helpdesk */}
            <a
              href={`https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent('السلام عليكم ورحمة الله، أود الاستفسار عن مجمع النور الإسلامي العالمي')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#111C3D] hover:bg-[#1E2E5D] text-[#E2E8F0] border border-[#D4AF37]/30 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
              title="محادثة فورية مع خدمة المستفيدين"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden sm:inline">{t.contactWhatsapp}</span>
              <span className="sm:hidden">واتساب</span>
            </a>

            <PWAInstallButton />

            {/* Theme Toggle (Day / Night Mode) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-[#111C3D] hover:bg-[#1E2E5D] text-[#D4AF37] transition-colors border border-[#D4AF37]/30"
              title={theme === 'dark' ? 'التبديل إلى المظهر العاجي النهاري' : 'التبديل إلى المظهر الداكن'}
              aria-label="تبديل مظهر الموقع"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />}
            </button>

            {/* International Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 bg-[#111C3D] text-[#F8FAFC] border border-[#D4AF37]/40 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-[#1E2E5D] transition-all shadow-sm"
                aria-label="اختيار لغة الموقع العالمية"
              >
                <span>{currentLangInfo.flag}</span>
                <span>{currentLangInfo.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-[#D4AF37] transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className={`absolute top-full mt-2 w-72 sm:w-80 bg-[#0B132B] border border-[#D4AF37]/30 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${isRtl ? 'left-0 text-right' : 'right-0 text-left'}`}>
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2 mb-2 px-1">
                    <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
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
            className={`flex items-center gap-3 group focus:outline-none ${isRtl ? 'text-right' : 'text-left'}`}
          >
            <div className="relative shrink-0 flex items-center justify-center">
              <img 
                src={OFFICIAL_COMPLEX_LOGO} 
                alt="شعار مجمع النور الإسلامي العالمي" 
                className="h-12 w-auto max-w-[58px] object-contain filter drop-shadow-[0_0_12px_rgba(212,175,55,0.5)] group-hover:scale-105 transition-transform"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black text-[#F8FAFC] group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {t.complexName}
                </span>
              </div>
              <div className="text-[11px] text-[#D4AF37] font-semibold flex items-center gap-1.5 mt-0.5 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span>NOOR GLOBAL · A WORLD OF LIGHT</span>
              </div>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#111C3D] text-[#D4AF37] border border-[#D4AF37]/50 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#64748B]'}`} />
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
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0B132B] hover:bg-[#111C3D] border border-[#D4AF37]/30 text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl text-xs transition shadow-sm"
              title="البحث المركزي الشامل (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden md:inline">بحث المنصة</span>
              <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 bg-[#070D1E] border border-[#D4AF37]/30 rounded text-[#D4AF37]">⌘K</kbd>
            </button>

            {/* User Account / Login Button */}
            {user ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B132B] hover:bg-[#111C3D] border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl text-xs font-bold transition"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline truncate max-w-[100px]">{(user.name || user.fullName || '').split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B132B] hover:bg-[#111C3D] border border-[#D4AF37]/30 text-[#E2E8F0] rounded-xl text-xs font-bold transition"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">دخول</span>
              </button>
            )}

            {/* Admin Dashboard shortcut if admin */}
            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#111C3D] hover:bg-[#1E2E5D] border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl text-xs font-bold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden md:inline">الإدارة</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('register')}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D4AF37] text-[#070D1E] text-xs font-black px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#070D1E]" />
              <span>{t.btnRegister}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-[#0B132B] border border-[#D4AF37]/30 text-[#E2E8F0] hover:text-[#D4AF37]"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070D1E] border-b border-[#D4AF37]/30 px-4 py-4 space-y-4 animate-in fade-in duration-200">
          
          {/* Quick Helpdesk Banner */}
          <div className="p-3 bg-[#0B132B] rounded-2xl border border-[#D4AF37]/30 flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">خدمة المستفيدين والدعم المباشر:</span>
            <a
              href={`https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent('السلام عليكم ورحمة الله، استفسار عن برامج مجمع النور')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-[#25D366] text-slate-950 px-3 py-1 rounded-lg font-black shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>واتساب فوري</span>
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
                      ? 'bg-[#111C3D] text-[#D4AF37] border border-[#D4AF37]/60 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                      : 'bg-[#0B132B] text-[#E2E8F0] hover:bg-[#111C3D] border border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#64748B]'}`} />
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
