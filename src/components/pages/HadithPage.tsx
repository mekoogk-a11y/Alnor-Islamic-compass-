import React, { useState, useMemo } from 'react';
import { 
  Scroll, Search, Filter, BookOpen, CheckCircle, Share2, 
  Copy, Bookmark, Globe, Sparkles, ShieldCheck, ChevronDown
} from 'lucide-react';
import { HADITH_BOOKS, HADITH_DATA } from '../../data/hadithAndScholarsData';
import { HadithItem, NavigationPage } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface HadithPageProps {
  onNavigate: (page: NavigationPage) => void;
  initialHadithId?: string;
}

export const HadithPage: React.FC<HadithPageProps> = ({ initialHadithId }) => {
  const { user } = useAuth();
  const [selectedBookId, setSelectedBookId] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<'all' | 'صحيح' | 'متفق عليه' | 'حسن'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLang, setActiveLang] = useState<'ar' | 'en' | 'fr'>('ar');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedExplanationId, setExpandedExplanationId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const filteredHadiths = useMemo(() => {
    return HADITH_DATA.filter((item) => {
      // Book filter
      if (selectedBookId !== 'all' && item.bookId !== selectedBookId) return false;
      // Grade filter
      if (gradeFilter !== 'all' && item.grade !== gradeFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inArabic = item.arabicText.includes(q) || item.narrator.includes(q) || item.chapter.includes(q);
        const inEnglish = item.translationEn.toLowerCase().includes(q);
        const inFrench = item.translationFr ? item.translationFr.toLowerCase().includes(q) : false;
        const inNumber = item.hadithNumber.toString() === q;
        if (!inArabic && !inEnglish && !inFrench && !inNumber) return false;
      }
      return true;
    });
  }, [selectedBookId, gradeFilter, searchQuery]);

  const handleCopy = (hadith: HadithItem) => {
    const textToCopy = `عن ${hadith.narrator}:\n\n«${hadith.arabicText}»\n\n[${hadith.bookName} - حديث رقم ${hadith.hadithNumber} - درجة الصحة: ${hadith.grade}]\nتخريج: ${hadith.gradeAttribution}\nعبر مجمع النور الإسلامي العالمي`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-900/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
            <Scroll className="w-4 h-4" />
            <span>موسوعة السنة النبوية المطهرة • الكتب التسعة المعتمدة</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            الأحاديث الصحيحة المروية بأوثق الأسانيد النبوية
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            منظومة علمية متكاملة لخدمة حديث رسول الله صلى الله عليه وسلم، مع ضبط المتن، وتحقيق الأسانيد، وتخريج الأئمة (البخاري ومسلم والسنن)، مع الشرح الميسر والترجمة المعتمدة إلى اللغات العالمية.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>تحقيق وتدقيق علمي معتمد</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>ترجمات إنجليزية وفرنسية معتمدة</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>أمهات كتب الحديث المسندة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kutub al-Tis'ah Books Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            أمهات كتب الحديث الشريف المعتمدة
          </span>
          <span className="text-slate-500 font-mono">الكتب التسعة الكبرى</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          <button
            onClick={() => setSelectedBookId('all')}
            className={`p-3 rounded-2xl border text-right transition ${
              selectedBookId === 'all'
                ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="block text-xs font-bold">جميع كتب السنة</span>
            <span className="text-[10px] opacity-80 mt-0.5 block">بحث في كل الدواوين</span>
          </button>

          {HADITH_BOOKS.map((book) => (
            <button
              key={book.id}
              onClick={() => setSelectedBookId(book.id)}
              className={`p-3 rounded-2xl border text-right transition ${
                selectedBookId === book.id
                  ? 'bg-emerald-950/90 border-amber-500 text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-emerald-800/60'
              }`}
            >
              <span className="block text-xs font-bold text-amber-300 truncate">{book.nameAr}</span>
              <span className="text-[10px] text-slate-400 truncate block mt-0.5">{book.author}</span>
              <span className="text-[9px] text-emerald-400 font-mono block mt-1">{book.verifiedStatus}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في نص الحديث، الراوي، أو الباب..."
            className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        </div>

        {/* Filters and Language toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Grade Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px] px-2">الدرجة:</span>
            {(['all', 'متفق عليه', 'صحيح', 'حسن'] as const).map((grade) => (
              <button
                key={grade}
                onClick={() => setGradeFilter(grade)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  gradeFilter === grade
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {grade === 'all' ? 'الكل' : grade}
              </button>
            ))}
          </div>

          {/* Translation selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
            <button
              onClick={() => setActiveLang('ar')}
              className={`px-2 py-1 rounded-lg font-bold transition ${activeLang === 'ar' ? 'bg-emerald-800 text-white' : 'text-slate-400'}`}
            >
              عربي
            </button>
            <button
              onClick={() => setActiveLang('en')}
              className={`px-2 py-1 rounded-lg font-bold transition ${activeLang === 'en' ? 'bg-emerald-800 text-white' : 'text-slate-400'}`}
            >
              English
            </button>
            <button
              onClick={() => setActiveLang('fr')}
              className={`px-2 py-1 rounded-lg font-bold transition ${activeLang === 'fr' ? 'bg-emerald-800 text-white' : 'text-slate-400'}`}
            >
              Français
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-slate-400 flex items-center justify-between">
        <span>عرض {filteredHadiths.length} حديثاً من أصول السنة النبوية المطهرة</span>
        {bookmarkedIds.length > 0 && (
          <span className="text-amber-400 font-medium">
            لديك {bookmarkedIds.length} أحاديث محفوظة في المفضلة
          </span>
        )}
      </div>

      {/* Hadith Cards List */}
      <div className="space-y-4">
        {filteredHadiths.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-400 space-y-2">
            <Scroll className="w-8 h-8 text-amber-400/60 mx-auto" />
            <p className="text-sm font-bold">لم نجد حديثاً يطابق معايير البحث الحالية</p>
            <p className="text-xs text-slate-500">جرّب إلغاء بعض عوامل التصفية أو تغيير كلمات البحث.</p>
          </div>
        ) : (
          filteredHadiths.map((hadith) => {
            const isBookmarked = bookmarkedIds.includes(hadith.id);
            const isExplanationOpen = expandedExplanationId === hadith.id;

            return (
              <div
                key={hadith.id}
                className="bg-slate-900/90 border border-slate-800/80 hover:border-emerald-800/60 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 transition duration-200"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                      {hadith.bookName}
                    </span>
                    <span className="text-xs text-slate-400">
                      رقم الحديث: <span className="font-mono text-amber-400 font-bold">{hadith.hadithNumber}</span>
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-300 font-medium">
                      {hadith.chapter}
                    </span>
                  </div>

                  {/* Authentication Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      hadith.grade === 'متفق عليه'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : hadith.grade === 'صحيح'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                    }`}>
                      {hadith.grade}
                    </span>

                    {/* Action buttons */}
                    <button
                      onClick={() => handleCopy(hadith)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="نسخ الحديث"
                    >
                      {copiedId === hadith.id ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => toggleBookmark(hadith.id)}
                      className={`p-1.5 rounded-lg transition ${
                        isBookmarked
                          ? 'text-amber-400 bg-amber-400/10'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title="حفظ الحديث"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Narrator */}
                <div className="text-xs text-slate-400 font-serif leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  <span className="font-bold text-amber-400/90 ml-2">راوي الحديث:</span>
                  عن {hadith.narrator}
                </div>

                {/* Matn (Hadith Text) in Arabic */}
                <div className="p-4 sm:p-5 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl">
                  <p className="font-serif text-lg sm:text-2xl text-amber-200 leading-[2.2] text-justify">
                    «{hadith.arabicText}»
                  </p>
                </div>

                {/* Foreign Translations if toggled */}
                {activeLang === 'en' && hadith.translationEn && (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed" dir="ltr">
                    <p className="font-bold text-amber-400 mb-1 text-xs">Translation ({hadith.bookName}):</p>
                    <p className="italic font-serif">"{hadith.translationEn}"</p>
                  </div>
                )}

                {activeLang === 'fr' && hadith.translationFr && (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed" dir="ltr">
                    <p className="font-bold text-amber-400 mb-1 text-xs">Traduction en Français :</p>
                    <p className="italic font-serif">« {hadith.translationFr} »</p>
                  </div>
                )}

                {/* Hadith Commentary Toggle */}
                <div className="border-t border-slate-800/80 pt-3">
                  <button
                    onClick={() => setExpandedExplanationId(isExplanationOpen ? null : hadith.id)}
                    className="flex items-center justify-between w-full text-xs font-bold text-slate-300 hover:text-amber-300 transition py-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      الشرح الميسر وبيان التخريج والفوائد الفقهية
                    </span>
                    <ChevronDown className={`w-4 h-4 transition duration-200 ${isExplanationOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isExplanationOpen && (
                    <div className="mt-3 p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed animate-in fade-in duration-150">
                      <div>
                        <h5 className="font-bold text-amber-400 mb-1">المعنى الإجمالي والفوائد:</h5>
                        <p>{hadith.explanation}</p>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">التخريج المعتمد:</span>
                        <span className="text-emerald-400 font-mono">{hadith.gradeAttribution}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
