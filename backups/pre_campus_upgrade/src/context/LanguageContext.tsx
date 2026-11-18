import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, Translations } from '../data/translations';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  isRtl: boolean;
}

export const WORLD_LANGUAGES: LanguageInfo[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isRtl: true },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', isRtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isRtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isRtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isRtl: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', isRtl: false },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', isRtl: false },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', isRtl: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', isRtl: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isRtl: false },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿', isRtl: false },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', isRtl: true },
];

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  isRtl: boolean;
  currentLangInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('alnoor_lang') as Language;
    const exists = WORLD_LANGUAGES.some(l => l.code === saved);
    if (saved && exists) {
      return saved;
    }
    return 'ar';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('alnoor_lang', newLang);
    } catch (e) {}
  };

  const currentLangInfo = WORLD_LANGUAGES.find(l => l.code === lang) || WORLD_LANGUAGES[0];
  const isRtl = currentLangInfo.isRtl;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [lang, isRtl]);

  const value = {
    lang,
    setLang,
    t: TRANSLATIONS[lang] || TRANSLATIONS['ar'],
    isRtl,
    currentLangInfo,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
