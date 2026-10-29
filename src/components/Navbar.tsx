import React, { useState } from 'react';
import { 
  BookOpen, Globe, HeartHandshake, GraduationCap, Library, 
  Info, Mail, Menu, X, Sparkles, Phone, MessageCircle 
} from 'lucide-react';
import { NavigationPage, Language } from '../types';
import { COMPLEX_INFO } from '../data/islamicData';
import { PWAInstallButton } from './PWAInstallButton';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t, isRtl } = useLanguage();

  const navItems: { id: NavigationPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t.navHome, icon: Globe },
    { id: 'quran', label: t.navQuran, icon: BookOpen },
    { id: 'sciences', label: t.navSciences, icon: GraduationCap },
    { id: 'library', label: t.navLibrary, icon: Library },
    { id: 'waqf', label: t.navWaqf, icon: HeartHandshake },
    { id: 'about', label: t.navAbout, icon: Info },
    { id: 'register', label: t.navContact, icon: Mail },
  ];

  const handleNavClick = (page: NavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  return (
    <header className="border-b border-emerald-900/40 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 shadow-2xl">
      {/* Top Islamic Golden Ribbon with Contact Numbers & Language Selector */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-500 to-emerald-700 py-1.5 px-4 text-xs font-bold text-slate-950 tracking-wide shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          
          {/* Official Phone & WhatsApp quick links */}
          <div className="flex items-center gap-3 font-mono text-[11px] overflow-x-auto w-full md:w-auto justify-center md:justify-start">
            <a
              href={`https://wa.me/${COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-slate-950/20 hover:bg-slate-950/40 px-2 py-0.5 rounded text-slate-950 transition-colors"
              title="تواصل عبر واتساب"
            >
              <span className="font-bold">واتساب:</span>
              <span>{COMPLEX_INFO.phones.whatsapp}</span>
            </a>

            <span className="text-slate-950/60">•</span>

            <a
              href={`tel:${COMPLEX_INFO.phones.mobile.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1 bg-slate-950/20 hover:bg-slate-950/40 px-2 py-0.5 rounded text-slate-950 transition-colors"
              title="اتصال هاتفي مباشر"
            >
              <Phone className="w-3 h-3" />
              <span>{COMPLEX_INFO.phones.mobile}</span>
            </a>
          </div>

          {/* Slogan Banner */}
          <div className="hidden lg:flex items-center gap-1.5 font-amiri text-sm font-black">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span>{t.sloganQuote}</span>
          </div>

          {/* Actions: PWA Install & Language Switcher */}
          <div className="flex items-center gap-2">
            <PWAInstallButton />
            
            {/* 3-Language Selector (AR / EN / FR) */}
            <div className="flex items-center gap-1 bg-slate-950/25 p-0.5 rounded-lg border border-slate-950/20">
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLang(item.code)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-black transition-all ${
                    lang === item.code
                      ? 'bg-slate-950 text-amber-300 shadow-sm'
                      : 'text-slate-900 hover:text-white'
                  }`}
                >
                  <span>{item.flag}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Emblem & Name */}
          <button
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-3.5 group focus:outline-none ${isRtl ? 'text-right' : 'text-left'}`}
          >
            <div className="relative shrink-0">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-emerald-700 p-0.5 shadow-lg shadow-amber-500/15 group-hover:shadow-amber-500/30 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center p-2 text-amber-400 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-7 h-7 text-amber-400 stroke-[2.2]" />
                </div>
              </div>
              <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[10px] text-white font-bold">
                ★
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base lg:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  {t.complexName}
                </span>
              </div>
              <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t.heroBadge}</span>
              </div>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Direct CTA & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavClick('register')}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.btnRegister}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3 animate-in fade-in duration-200">
          
          {/* Mobile Numbers Quick Bar */}
          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
            <a
              href={`https://wa.me/${COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{COMPLEX_INFO.phones.whatsapp}</span>
            </a>
            <a
              href={`tel:${COMPLEX_INFO.phones.mobile.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 text-amber-300 font-bold"
            >
              <Phone className="w-4 h-4" />
              <span>{COMPLEX_INFO.phones.mobile}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all w-full ${isRtl ? 'text-right' : 'text-left'} ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 space-y-2">
            <PWAInstallButton variant="card" />
            <button
              onClick={() => handleNavClick('register')}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-xs py-3 rounded-xl shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.btnRegister}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
