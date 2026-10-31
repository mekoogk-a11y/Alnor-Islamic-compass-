import React from 'react';
import { Globe, BookOpen, GraduationCap, Library, HeartHandshake, UserPlus, Radio, Compass } from 'lucide-react';
import { NavigationPage } from '../types';

interface MobileBottomNavProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPage, onNavigate }) => {
  const items: { id: NavigationPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'الرئيسية', icon: Globe },
    { id: 'newMuslims', label: 'المهتدون', icon: Compass },
    { id: 'audioAd', label: 'إعلان صوتي 🎙️', icon: Radio },
    { id: 'quran', label: 'المصحف', icon: BookOpen },
    { id: 'sciences', label: 'العلوم', icon: GraduationCap },
    { id: 'waqf', label: 'الوقف', icon: HeartHandshake },
    { id: 'register', label: 'التسجيل', icon: UserPlus },
  ];

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-emerald-900/40 px-2 py-1.5 shadow-2xl safe-area-inset-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
