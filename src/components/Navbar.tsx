import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, Globe, HeartHandshake, GraduationCap, Library, 
  Info, Mail, Menu, X, Sparkles, MessageCircle, Radio, 
  ChevronDown, Check, Compass, Scroll, Users, Search, 
  Sun, Moon, User, ShieldCheck, HelpCircle, Mic, Zap, Video,
  ChevronRight, Award, ExternalLink
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
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch, onReplayIntro }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [educationMenuOpen, setEducationMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const { lang, setLang, t, isRtl, currentLangInfo } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, openAuthModal } = useAuth();

  const langDropdownRef = useRef<HTMLDivElement | null>(null);
  const educationDropdownRef = useRef<HTMLDivElement | null>(null);
  const moreDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (langDropdownRef.current && !langDropdownRef.current.contains(target)) {
        setLangMenuOpen(false);
      }
      if (educationDropdownRef.current && !educationDropdownRef.current.contains(target)) {
        setEducationMenuOpen(false);
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
    setEducationMenuOpen(false);
    setMoreMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLanguage = (code: typeof lang) => {
    setLang(code);
    setLangMenuOpen(false);
  };

  const whatsappCleanNumber = COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '');

  // Primary desktop nav items
  const primaryNavItems: { id: NavigationPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t.navHome, icon: Globe },
    { id: 'quran', label: t.navQuran, icon: BookOpen },
    { id: 'translationsReader', label: lang === 'ar' ? 'ترجمات القرآن 🌐' : 'Translations', icon: Globe },
    { id: 'dawahLibrary', label: lang === 'ar' ? 'المكتبة الدعوية 🎙️' : 'Dawah Library', icon: Video },
    { id: 'orphansCare', label: lang === 'ar' ? 'كفالة الأيتام 🤲' : 'Orphans Care', icon: HeartHandshake },
    { id: 'radio', label: lang === 'ar' ? 'إذاعة مكة 🕋' : 'Radio', icon: Radio },
  ];

  // Education & Sciences Sub-items
  const educationItems: { id: NavigationPage; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'academy', label: lang === 'ar' ? 'أكاديمية النور العالمية' : 'Quran Academy', desc: 'حلقات حفظ القرآن والإجازات بالسند المتصل', icon: GraduationCap },
    { id: 'hadith', label: lang === 'ar' ? 'السنة النبوية الشريفة' : 'Prophetic Hadith', desc: 'موسوعة كتب الحديث التسعة والتخريج المعتمد', icon: Scroll },
    { id: 'scholars', label: lang === 'ar' ? 'هيئة كبار العلماء' : 'Council of Scholars', desc: 'دليل العلماء والمقرئين المعتمدين بالمجمع', icon: Users },
    { id: 'sciences', label: lang === 'ar' ? 'العلوم الشرعية والأصول' : 'Islamic Sciences', desc: 'الفقه المقارن، التفسير، وأصول الشريعة', icon: Library },
    { id: 'library', label: lang === 'ar' ? 'المكتبة الرقمية المخطوطة' : 'Digital Library', desc: 'كتب ورسائل علمية ومخطوطات موثقة', icon: BookOpen },
  ];

  // More Services Sub-items
  const moreServicesItems: { id: NavigationPage; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'audioStudio', label: lang === 'ar' ? 'الصوت الإعلاني السوداني 🇸🇩' : 'Sudanese Voice Ads', desc: 'استوديو الصوت الجهوري الحماسي بالعامية السودانية', icon: Mic },
    { id: 'noorAmbassador', label: lang === 'ar' ? 'سفير النور العالمي 🌟' : 'Noor Ambassador', desc: 'بطاقات دعوية عالمية بلغات العالم للنشر والتوزيع', icon: Sparkles },
    { id: 'discoverIslam', label: lang === 'ar' ? 'اسأل عن الإسلام 💬' : 'Ask About Islam', desc: 'إجابات موثقة وحوار هادئ بلغات العالم مع خط ساخن', icon: MessageCircle },
    { id: 'waqf', label: lang === 'ar' ? 'السهم الوقفي والصدقات' : 'Islamic Waqf', desc: 'صدقة جارية وأسهم وقفية مستمرة لكفالة الحلقات', icon: HeartHandshake },
    { id: 'aiScholar', label: lang === 'ar' ? 'المساعد المعرفي الذكي' : 'AI Scholar Assistant', desc: 'باحث شرعي أكاديمي مدعوم بمصادر القرآن والسنة', icon: Sparkles },
    { id: 'apiGateway', label: lang === 'ar' ? 'بوابة API المركزية ⚡' : 'API Gateway', desc: 'الربط السحابي، مفاتيح المطورين، وحالة الخدمات', icon: Zap },
    { id: 'newMuslims', label: t.navNewMuslims, desc: 'رعاية المهتدين الجدد وتعليم أركان الدين', icon: Compass },
    { id: 'community', label: lang === 'ar' ? 'الملتقى العلمي للطلاب' : 'Scholarly Forum', desc: 'مجتمع أكاديمي للنقاش وبحوث طلاب العلم', icon: HelpCircle },
    { id: 'about', label: t.navAbout, desc: 'نبذة عن المجمع، الرؤية، والمقر العام والاتصال', icon: Info },
  ];

  const isEducationActive = educationItems.some(i => i.id === currentPage);
  const isMoreActive = moreServicesItems.some(i => i.id === currentPage);

  return (
    <header className="border-b border-[#D4AF37]/20 bg-[#070D1E]/95 backdrop-blur-xl sticky top-0 z-40 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-colors">
      
      {/* Top International Institutional Ribbon */}
      <div className="bg-[#0B132B] text-[#F8FAFC] py-1.5 px-4 text-xs font-semibold tracking-wide border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          
          {/* Slogan */}
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

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            
            {/* Cinematic Sunrise Intro Replay */}
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="flex items-center gap-1.5 bg-[#111C3D] hover:bg-[#1E2E5D] text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-sm"
                title="مشاهدة مشهد شروق النور ثلاثي الأبعاد السينمائي"
              >
                <span>شروق النور 🌅</span>
              </button>
            )}

            {/* Live Quran Radio shortcut */}
            <button
              onClick={() => handleNavClick('radio')}
              className="flex items-center gap-1.5 bg-[#111C3D] hover:bg-[#1E2E5D] text-[#F8FAFC] border border-[#D4AF37]/50 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(212,175,55,0.15)]"
              title="الاستماع لإذاعة القرآن الكريم مباشر من مكة المكرمة"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>مباشر مكة 🕋</span>
            </button>

            {/* Quick WhatsApp Support */}
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

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-[#111C3D] hover:bg-[#1E2E5D] text-[#D4AF37] transition-colors border border-[#D4AF37]/30 cursor-pointer"
              title={theme === 'dark' ? 'التبديل إلى المظهر العاجي النهاري' : 'التبديل إلى المظهر الداكن'}
              aria-label="تبديل مظهر الموقع"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />}
            </button>

            {/* International Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 bg-[#111C3D] text-[#F8FAFC] border border-[#D4AF37]/40 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-[#1E2E5D] transition-all shadow-sm cursor-pointer"
                aria-label="اختيار لغة الموقع العالمية"
              >
                <span>{currentLangInfo.flag}</span>
                <span>{currentLangInfo.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-[#D4AF37] transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className={`absolute top-full mt-2 w-72 sm:w-80 bg-[#0B132B] border border-[#D4AF37]/30 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${isRtl ? 'left-0 text-right' : 'right-0 text-left'}`}>
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2 mb-2 px-1">
                    <span className="text-xs font-bold text-[#D4AF37]">اللغات العالمية المعتمدة:</span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">12 لغات رسمية</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pr-1">
                    {WORLD_LANGUAGES.map((l) => {
                      const isSelected = lang === l.code;
                      return (
                        <button
                          key={l.code}
                          onClick={() => handleSelectLanguage(l.code)}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            isSelected 
                              ? 'bg-[#111C3D] text-[#D4AF37] border border-[#D4AF37]/60' 
                              : 'text-slate-300 hover:text-white hover:bg-[#111C3D]/60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{l.flag}</span>
                            <span>{l.nativeName}</span>
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
            className={`flex items-center gap-3.5 group focus:outline-none cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
          >
            <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl p-1 bg-gradient-to-tr from-[#111C3D] to-[#0B132B] border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform">
              <img 
                src={OFFICIAL_COMPLEX_LOGO} 
                alt="شعار مجمع النور الإسلامي العالمي" 
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-[#F8FAFC] group-hover:text-[#D4AF37] transition-colors leading-snug font-amiri">
                  مجمع النور الإسلامي العالمي
                </span>
              </div>
              <div className="text-[10px] text-[#D4AF37] font-semibold flex items-center gap-1.5 mt-0.5 tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>NOOR GLOBAL · A WORLD OF LIGHT</span>
              </div>
            </div>
          </button>

          {/* Desktop Nav Items - Clean & Orderly Hierarchy */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
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

            {/* Dropdown 1: Education & Sciences */}
            <div className="relative" ref={educationDropdownRef}>
              <button
                onClick={() => {
                  setEducationMenuOpen(!educationMenuOpen);
                  setMoreMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isEducationActive || educationMenuOpen
                    ? 'bg-[#111C3D] text-[#D4AF37] border border-[#D4AF37]/50'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B] border border-transparent'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>التعليم والعلوم ▾</span>
              </button>

              {educationMenuOpen && (
                <div className={`absolute top-full mt-2 w-80 bg-[#0B132B] border border-[#D4AF37]/40 rounded-2xl p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${isRtl ? 'right-0 text-right' : 'left-0 text-left'}`}>
                  <div className="text-[11px] font-bold text-[#D4AF37] px-3 py-1.5 border-b border-[#D4AF37]/20 mb-1">
                    مسارات التعليم والعلوم الشرعية:
                  </div>
                  <div className="space-y-1">
                    {educationItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentPage === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleNavClick(sub.id)}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            isSubActive 
                              ? 'bg-[#111C3D] text-[#D4AF37]' 
                              : 'text-slate-300 hover:text-white hover:bg-[#111C3D]/60'
                          }`}
                        >
                          <SubIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSubActive ? 'text-[#D4AF37]' : 'text-[#94A3B8]'}`} />
                          <div className="min-w-0">
                            <span className="font-bold block leading-tight">{sub.label}</span>
                            <span className="text-[10px] text-[#94A3B8] block line-clamp-1 mt-0.5">{sub.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown 2: More Services & Media */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={() => {
                  setMoreMenuOpen(!moreMenuOpen);
                  setEducationMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isMoreActive || moreMenuOpen
                    ? 'bg-[#111C3D] text-[#D4AF37] border border-[#D4AF37]/50'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B] border border-transparent'
                }`}
              >
                <span>المزيد من الأقسام ▾</span>
              </button>

              {moreMenuOpen && (
                <div className={`absolute top-full mt-2 w-84 bg-[#0B132B] border border-[#D4AF37]/40 rounded-2xl p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${isRtl ? 'left-0 text-right' : 'right-0 text-left'}`}>
                  <div className="text-[11px] font-bold text-[#D4AF37] px-3 py-1.5 border-b border-[#D4AF37]/20 mb-1">
                    أقسام المنصة والخدمات الإضافية:
                  </div>
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {moreServicesItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentPage === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleNavClick(sub.id)}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            isSubActive 
                              ? 'bg-[#111C3D] text-[#D4AF37]' 
                              : 'text-slate-300 hover:text-white hover:bg-[#111C3D]/60'
                          }`}
                        >
                          <SubIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSubActive ? 'text-[#D4AF37]' : 'text-[#94A3B8]'}`} />
                          <div className="min-w-0">
                            <span className="font-bold block leading-tight">{sub.label}</span>
                            <span className="text-[10px] text-[#94A3B8] block line-clamp-1 mt-0.5">{sub.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </nav>

          {/* Search Trigger, User Auth & Actions */}
          <div className="flex items-center gap-2">
            
            {/* Global Search Button (⌘K) */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0B132B] hover:bg-[#111C3D] border border-[#D4AF37]/30 text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl text-xs transition shadow-sm cursor-pointer"
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B132B] hover:bg-[#111C3D] border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline truncate max-w-[100px]">{(user.name || user.fullName || '').split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111C3D] hover:bg-[#1E2E5D] border border-[#D4AF37]/40 text-[#D4AF37] hover:text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-[#0B132B] border border-[#D4AF37]/30 text-[#E2E8F0] hover:text-[#D4AF37] cursor-pointer"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu - Clean Categorized Sections */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070D1E] border-b border-[#D4AF37]/30 px-4 py-4 space-y-5 animate-in fade-in duration-200 max-h-[80vh] overflow-y-auto">
          
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

          {/* Category 1: القرآن الكريم والسنة النبوية */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#D4AF37] flex items-center gap-1.5 px-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>القرآن الكريم والسنة النبوية</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'quran' as NavigationPage, label: 'المصحف الشريف', icon: BookOpen },
                { id: 'translationsReader' as NavigationPage, label: 'ترجمات 76 لغة 🌐', icon: Globe },
                { id: 'hadith' as NavigationPage, label: 'السنة النبوية', icon: Scroll },
                { id: 'radio' as NavigationPage, label: 'إذاعة مكة 24/7 🕋', icon: Radio },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl font-bold transition-all ${
                    currentPage === item.id 
                      ? 'bg-[#111C3D] text-[#D4AF37] border border-[#D4AF37]/60' 
                      : 'bg-[#0B132B] text-[#E2E8F0] border border-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4 text-[#D4AF37]" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 2: التعليم والدعوة والمكتبات */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#D4AF37] flex items-center gap-1.5 px-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>التعليم والدعوة والمكتبات</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'academy' as NavigationPage, label: 'أكاديمية النور', icon: GraduationCap },
                { id: 'dawahLibrary' as NavigationPage, label: 'المكتبة الدعوية 🎙️', icon: Video },
                { id: 'scholars' as NavigationPage, label: 'هيئة العلماء', icon: Users },
                { id: 'sciences' as NavigationPage, label: 'العلوم الشرعية', icon: Library },
                { id: 'noorAmbassador' as NavigationPage, label: 'سفير النور 🌟', icon: Sparkles },
                { id: 'discoverIslam' as NavigationPage, label: 'اسأل عن الإسلام 💬', icon: MessageCircle },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl font-bold transition-all ${
                    currentPage === item.id 
                      ? 'bg-[#111C3D] text-[#D4AF37] border border-[#D4AF37]/60' 
                      : 'bg-[#0B132B] text-[#E2E8F0] border border-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4 text-[#D4AF37]" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 3: العمل الخيري والوقفي */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#D4AF37] flex items-center gap-1.5 px-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>الرعاية الإنسانية والأوقاف</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'orphansCare' as NavigationPage, label: 'كفالة الأيتام 🤲', icon: HeartHandshake },
                { id: 'waqf' as NavigationPage, label: 'السهم الوقفي', icon: HeartHandshake },
                { id: 'newMuslims' as NavigationPage, label: 'المسلمون الجدد', icon: Compass },
                { id: 'audioStudio' as NavigationPage, label: 'الصوت الإعلاني 🇸🇩', icon: Mic },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl font-bold transition-all ${
                    currentPage === item.id 
                      ? 'bg-[#111C3D] text-[#D4AF37] border border-[#D4AF37]/60' 
                      : 'bg-[#0B132B] text-[#E2E8F0] border border-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4 text-[#D4AF37]" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 4: التقنية والإدارة */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#D4AF37] flex items-center gap-1.5 px-1">
              <Zap className="w-3.5 h-3.5" />
              <span>الخدمات الذكية وعن المجمع</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'aiScholar' as NavigationPage, label: 'المساعد الذكي', icon: Sparkles },
                { id: 'apiGateway' as NavigationPage, label: 'بوابة API ⚡', icon: Zap },
                { id: 'community' as NavigationPage, label: 'الملتقى العلمي', icon: HelpCircle },
                { id: 'about' as NavigationPage, label: 'عن المجمع', icon: Info },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl font-bold transition-all ${
                    currentPage === item.id 
                      ? 'bg-[#111C3D] text-[#D4AF37] border border-[#D4AF37]/60' 
                      : 'bg-[#0B132B] text-[#E2E8F0] border border-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4 text-[#D4AF37]" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* User Profile shortcut in mobile menu */}
          <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between">
            {user ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full py-2.5 bg-[#111C3D] text-[#D4AF37] font-bold rounded-xl text-xs border border-[#D4AF37]/40 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span>لوحة متابعة الطالب ({user.name || user.fullName})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-2.5 bg-[#111C3D] text-[#D4AF37] font-bold rounded-xl text-xs border border-[#D4AF37]/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span>تسجيل الدخول / إنشاء حساب جديد</span>
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
