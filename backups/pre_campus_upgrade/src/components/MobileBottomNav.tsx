import React from 'react';
import { Globe, BookOpen, Scroll, GraduationCap, Radio, User, Compass } from 'lucide-react';
import { NavigationPage } from '../types';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPage, onNavigate }) => {
  const { user, openAuthModal } = useAuth();

  const items: { id: NavigationPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'الرئيسية', icon: Globe },
    { id: 'quran', label: 'المصحف', icon: BookOpen },
    { id: 'hadith', label: 'السنة', icon: Scroll },
    { id: 'academy', label: 'الأكاديمية', icon: GraduationCap },
    { id: 'radio', label: 'إذاعة مكة 📻', icon: Radio },
    { id: 'dashboard', label: user ? 'حسابي' : 'دخول', icon: User },
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
    <nav className="2xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-emerald-900/40 px-2 py-1.5 shadow-2xl safe-area-inset-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-amber-400 font-black scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-amber-500/15 border border-amber-500/30' : ''}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
