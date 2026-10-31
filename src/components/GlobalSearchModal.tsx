import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, X, BookOpen, Scroll, GraduationCap, Users, 
  Sparkles, ArrowRight, Filter
} from 'lucide-react';
import { NavigationPage } from '../types';
import { HADITH_DATA, SCHOLARS_DIRECTORY, ACADEMY_COURSES } from '../data/hadithAndScholarsData';
import { SURAHS_INDEX } from '../data/islamicData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: NavigationPage, params?: any) => void;
}

type FilterCategory = 'all' | 'quran' | 'hadith' | 'academy' | 'scholars';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<FilterCategory>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Unified index search across collections
  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.trim().toLowerCase();

    const matchedItems: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'quran' | 'hadith' | 'academy' | 'scholars';
      categoryLabel: string;
      page: NavigationPage;
      payload?: any;
    }> = [];

    // Search Quran Surahs
    if (category === 'all' || category === 'quran') {
      SURAHS_INDEX.forEach((surah) => {
        if (
          surah.name.includes(term) ||
          surah.englishName.toLowerCase().includes(term) ||
          surah.number.toString() === term
        ) {
          matchedItems.push({
            id: `quran-${surah.number}`,
            title: `${surah.name} (${surah.englishName})`,
            subtitle: `عدد الآيات: ${surah.numberOfAyahs} • نزلت في ${surah.revelationType}`,
            category: 'quran',
            categoryLabel: 'القرآن الكريم',
            page: 'quran',
            payload: { surahNumber: surah.number },
          });
        }
      });
    }

    // Search Hadith
    if (category === 'all' || category === 'hadith') {
      HADITH_DATA.forEach((h) => {
        if (
          h.arabicText.includes(term) ||
          h.translationEn.toLowerCase().includes(term) ||
          h.narrator.includes(term) ||
          h.bookName.includes(term) ||
          h.chapter.includes(term)
        ) {
          matchedItems.push({
            id: `hadith-${h.id}`,
            title: `${h.bookName} - حديث رقم ${h.hadithNumber}`,
            subtitle: `${h.arabicText.slice(0, 85)}... [درجة الصحة: ${h.grade}]`,
            category: 'hadith',
            categoryLabel: 'السنة النبوية',
            page: 'hadith',
            payload: { hadithId: h.id },
          });
        }
      });
    }

    // Search Academy Courses
    if (category === 'all' || category === 'academy') {
      ACADEMY_COURSES.forEach((c) => {
        if (
          c.title.includes(term) ||
          c.description.includes(term) ||
          c.instructor.includes(term)
        ) {
          matchedItems.push({
            id: `course-${c.id}`,
            title: c.title,
            subtitle: `${c.instructor} • المستوى: ${c.level} • المدة: ${c.duration}`,
            category: 'academy',
            categoryLabel: 'أكاديمية النور',
            page: 'academy',
            payload: { courseId: c.id },
          });
        }
      });
    }

    // Search Scholars
    if (category === 'all' || category === 'scholars') {
      SCHOLARS_DIRECTORY.forEach((s) => {
        if (
          s.name.includes(term) ||
          s.specialization.includes(term) ||
          s.title.includes(term)
        ) {
          matchedItems.push({
            id: `scholar-${s.id}`,
            title: s.name,
            subtitle: `${s.title} • ${s.specialization} (${s.country})`,
            category: 'scholars',
            categoryLabel: 'هيئة العلماء',
            page: 'scholars',
            payload: { scholarId: s.id },
          });
        }
      });
    }

    return matchedItems.slice(0, 15);
  }, [searchTerm, category]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-emerald-800/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-right"
        dir="rtl"
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/70">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث في القرآن، السنة النبوية، المقارئ، العلماء، والدورات..."
            className="w-full bg-transparent border-0 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-0"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="مسح النص"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-xs rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            إغلاق
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-3 px-5 border-b border-slate-800/70 overflow-x-auto text-xs bg-slate-900/90 no-scrollbar">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 ml-2">
            <Filter className="w-3.5 h-3.5" /> الفرز:
          </span>
          {[
            { id: 'all', label: 'الكل' },
            { id: 'quran', label: 'القرآن الكريم' },
            { id: 'hadith', label: 'السنة النبوية' },
            { id: 'academy', label: 'الأكاديمية' },
            { id: 'scholars', label: 'العلماء' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id as FilterCategory)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition font-medium ${
                category === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 divide-y divide-slate-800/60 max-h-[50vh]">
          {searchTerm.trim() === '' ? (
            <div className="p-8 text-center text-slate-400 space-y-3">
              <Sparkles className="w-8 h-8 text-amber-400/80 mx-auto" />
              <p className="text-sm font-medium">محرك البحث المركزي الذكي لمجمع النور</p>
              <p className="text-xs text-slate-500">
                اكتب أي كلمة أو آية، أو ابحث عن شيخ، أو دورة تجويد، أو حديث نبوي شريف
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs">
                {['سورة الفاتحة', 'إنما الأعمال بالنيات', 'خيركم من تعلم القرآن', 'المقرأة الدولية', 'الحديث الشريف'].map((suggest) => (
                  <button
                    key={suggest}
                    onClick={() => setSearchTerm(suggest)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-amber-300 rounded-lg border border-slate-700/60 transition"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <p className="text-sm">لم يتم العثور على نتائج تطابق: "{searchTerm}"</p>
              <p className="text-xs text-slate-500">
                جرّب البحث بكلمات أخرى أو تغيير تصنيف الفرز في الأعلى.
              </p>
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.page, item.payload);
                  onClose();
                }}
                className="w-full text-right p-3 rounded-2xl hover:bg-emerald-950/40 hover:border-emerald-800/40 border border-transparent transition flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-amber-300 border border-amber-500/20">
                      {item.categoryLabel}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition truncate">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition shrink-0 rotate-180 mt-1" />
              </button>
            ))
          )}
        </div>

        {/* Footer Shortcut Info */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 px-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[10px]">ESC</kbd> للإغلاق
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[10px]">↵</kbd> للانتقال
            </span>
          </div>
          <span className="text-amber-400 font-medium">مجمع النور الإسلامي العالمي</span>
        </div>
      </div>
    </div>
  );
};
