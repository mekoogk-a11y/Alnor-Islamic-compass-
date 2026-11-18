import React from 'react';
import { Globe, BookOpen, Scroll, GraduationCap, Radio, User } from 'lucide-react';
import { NavigationPage } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPage, onNavigate }) => {
  const { user, openAuthModal } = useAuth();
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const items: { id: NavigationPage; labelAr: string; labelEn: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', labelAr: 'المجمع', labelEn: 'Campus', icon: Globe },
    { id: 'quran', labelAr: 'المصحف', labelEn: 'Quran', icon: BookOpen },
    { id: 'sciences', labelAr: 'العلوم', labelEn: 'Sciences', icon: Scroll },
    { id: 'academy', labelAr: 'الأكاديمية', labelEn: 'Academy', icon: GraduationCap },
    { id: 'radio', labelAr: 'الإذاعة', labelEn: 'Radio', icon: Radio },
    { id: 'dashboard', labelAr: user ? 'حسابي' : 'دخول', labelEn: user ? 'Portal' : 'Sign In', icon: User },
  ];

  const handleClick = (id: NavigationPage) => {
    if (id === 'dashboard' && !user) {
      openAuthModal();
      return;
    }
    onNavigate(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#022C22]/95 backdrop-blur-lg border-t border-[#C8A24A]/40 px-2 py-1.5 shadow-2xl safe-area-inset-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#E5C97B] font-black scale-105'
                  : 'text-[#D1E7DD] hover:text-white'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#064E3B] border border-[#C8A24A]/50' : ''}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] mt-0.5 whitespace-nowrap">
                {isAr ? item.labelAr : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
