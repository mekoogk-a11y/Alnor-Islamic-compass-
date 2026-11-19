import React, { useState, useMemo } from 'react';
import {
  Scroll, Search, BookOpen, CheckCircle,
  Copy, Bookmark, Globe, Sparkles, ShieldCheck, ChevronDown
} from 'lucide-react';
import { HADITH_BOOKS, HADITH_DATA } from '../../data/hadithAndScholarsData';
import { HadithItem, NavigationPage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface HadithPageProps {
  onNavigate: (page: NavigationPage) => void;
  initialHadithId?: string;
}

export const HadithPage: React.FC<HadithPageProps> = () => {
  const { isRtl } = useLanguage();
  const [selectedBookId, setSelectedBookId] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<'all' | 'صحيح' | 'متفق عليه' | 'حسن'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLang, setActiveLang] = useState<'ar' | 'en' | 'fr'>('ar');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedExplanationId, setExpandedExplanationId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const filteredHadiths = useMemo(() => {
    return HADITH_DATA.filter((item) => {
      if (selectedBookId !== 'all' && item.bookId !== selectedBookId) return false;
      if (gradeFilter !== 'all' && item.grade !== gradeFilter) return false;
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
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sky-Blue 3D Hero Header */}
      <div className="bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] border border-[#87CEEB]/55 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-white">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Sky3DIcon slug="hadith" tone="gold" size="md" />
            <p className="text-xs font-bold text-[#87CEEB] flex items-center gap-1.5">
              <Scroll className="w-4 h-4 text-[#F7E7B4]" />
              <span>موسوعة السنة النبوية المطهرة · الكتب التسعة المعتمدة</span>
            </p>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white leading-tight">
            الأحاديث الصحيحة المروية بأوثق الأسانيد النبوية
          </h1>

          <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed">
            منظومة علمية متكاملة لخدمة حديث رسول الله صلى الله عليه وسلم، مع ضبط المتن، وتحقيق الأسانيد، وتخريج الأئمة (البخاري ومسلم والسنن)، مع الشرح الميسر والترجمة المعتمدة إلى اللغات العالمية.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap gap-3 pt-2 text-xs text-white">
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-[#87CEEB]/40">
              <ShieldCheck className="w-4 h-4 text-[#F7E7B4]" />
              <span>تحقيق وتدقيق علمي معتمد</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-[#87CEEB]/40">
              <Globe className="w-4 h-4 text-[#87CEEB]" />
              <span>ترجمات إنجليزية وفرنسية معتمدة</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-[#87CEEB]/40">
              <CheckCircle className="w-4 h-4 text-[#5EEAD4]" />
              <span>أمهات كتب الحديث المسندة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kutub al-Tis'ah Books Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#12345A] dark:text-[#EAF8FF]">
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0EA5A4]" />
            أمهات كتب الحديث الشريف المعتمدة
          </span>
          <span className="text-[#4A7298] dark:text-[#87CEEB] font-mono">الكتب التسعة الكبرى</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          <button
            type="button"
            onClick={() => setSelectedBookId('all')}
            className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
              selectedBookId === 'all'
                ? 'bg-[#12345A] text-white font-black border-[#D4AF37] shadow-lg'
                : 'sky-card-3d text-[#12345A] dark:text-[#EAF8FF]'
            }`}
          >
            <span className="block text-xs font-bold">جميع كتب السنة</span>
            <span className="text-[10px] opacity-80 mt-0.5 block">بحث في كل الدواوين</span>
          </button>

          {HADITH_BOOKS.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => setSelectedBookId(book.id)}
              className={`p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                selectedBookId === book.id
                  ? 'bg-gradient-to-br from-[#12345A] to-[#0EA5A4] border-[#D4AF37] text-white shadow-lg'
                  : 'sky-card-3d text-[#12345A] dark:text-[#EAF8FF]'
              }`}
            >
              <span className={`block text-xs font-black truncate ${selectedBookId === book.id ? 'text-[#F7E7B4]' : 'text-[#12345A] dark:text-white'}`}>
                {book.nameAr}
              </span>
              <span className={`text-[10px] truncate block mt-0.5 ${selectedBookId === book.id ? 'text-[#EAF8FF]' : 'text-[#4A7298] dark:text-[#B8DEF5]'}`}>
                {book.author}
              </span>
              <span className={`text-[9px] font-mono block mt-1 ${selectedBookId === book.id ? 'text-[#5EEAD4]' : 'text-[#0D7A7A] dark:text-[#87CEEB]'}`}>
                {book.verifiedStatus}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="sky-card-3d rounded-3xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في نص الحديث، الراوي، أو الباب..."
            className="w-full pl-4 pr-10 py-2.5 bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded-xl text-[#12345A] dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#0EA5A4]"
          />
          <Search className="w-4 h-4 text-[#0EA5A4] absolute right-3.5 top-3" />
        </div>

        {/* Filters and Language toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Grade Filter */}
          <div className="flex items-center gap-1 bg-[#EAF8FF] dark:bg-[#0F2747] p-1 rounded-xl border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 text-xs">
            <span className="text-[#2B547E] dark:text-[#B8DEF5] text-[11px] font-bold px-2">الدرجة:</span>
            {(['all', 'متفق عليه', 'صحيح', 'حسن'] as const).map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setGradeFilter(grade)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  gradeFilter === grade
                    ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4] font-bold'
                    : 'text-[#2B547E] dark:text-[#B8DEF5] hover:text-[#12345A]'
                }`}
              >
                {grade === 'all' ? 'الكل' : grade}
              </button>
            ))}
          </div>

          {/* Translation selector */}
          <div className="flex items-center gap-1 bg-[#EAF8FF] dark:bg-[#0F2747] p-1 rounded-xl border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 text-xs">
            <Globe className="w-3.5 h-3.5 text-[#0EA5A4] ml-1.5" />
            <button
              type="button"
              onClick={() => setActiveLang('ar')}
              className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${activeLang === 'ar' ? 'bg-[#12345A] text-white' : 'text-[#2B547E] dark:text-[#B8DEF5]'}`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${activeLang === 'en' ? 'bg-[#12345A] text-white' : 'text-[#2B547E] dark:text-[#B8DEF5]'}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('fr')}
              className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${activeLang === 'fr' ? 'bg-[#12345A] text-white' : 'text-[#2B547E] dark:text-[#B8DEF5]'}`}
            >
              Français
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-[#12345A] dark:text-[#B8DEF5] font-bold flex items-center justify-between">
        <span>عرض {filteredHadiths.length} حديثاً من أصول السنة النبوية المطهرة</span>
        {bookmarkedIds.length > 0 && (
          <span className="text-[#0D7A7A] dark:text-[#F7E7B4] font-bold">
            لديك {bookmarkedIds.length} أحاديث محفوظة في المفضلة
          </span>
        )}
      </div>

      {/* Hadith Cards List */}
      <div className="space-y-4">
        {filteredHadiths.length === 0 ? (
          <div className="sky-card-3d p-12 text-center rounded-3xl text-[#2B547E] dark:text-[#B8DEF5] space-y-2">
            <Scroll className="w-8 h-8 text-[#0EA5A4] mx-auto" />
            <p className="text-sm font-bold text-[#12345A] dark:text-white">لم نجد حديثاً يطابق معايير البحث الحالية</p>
            <p className="text-xs">جرّب إلغاء بعض عوامل التصفية أو تغيير كلمات البحث.</p>
          </div>
        ) : (
          filteredHadiths.map((hadith) => {
            const isBookmarked = bookmarkedIds.includes(hadith.id);
            const isExplanationOpen = expandedExplanationId === hadith.id;

            return (
              <div
                key={hadith.id}
                className="sky-card-3d rounded-3xl p-6 sm:p-7 space-y-5"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-4">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-black text-[#0D7A7A] dark:text-[#87CEEB]">
                      {hadith.bookName}
                    </span>
                    <span aria-hidden="true" className="text-[#87CEEB]">·</span>
                    <span className="text-[#2B547E] dark:text-[#B8DEF5]">
                      رقم الحديث: <span className="font-mono text-[#12345A] dark:text-[#F7E7B4] font-bold">{hadith.hadithNumber}</span>
                    </span>
                    <span aria-hidden="true" className="text-[#87CEEB]">·</span>
                    <span className="text-[#12345A] dark:text-[#EAF8FF] font-semibold">
                      {hadith.chapter}
                    </span>
                  </div>

                  {/* Authentication & Actions */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#0D7A7A] dark:text-[#5EEAD4]">
                      {hadith.grade}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(hadith)}
                      className="p-1.5 rounded-lg text-[#4A7298] dark:text-[#87CEEB] hover:bg-[#EAF8FF] dark:hover:bg-[#0F2747] transition cursor-pointer"
                      title="نسخ الحديث"
                    >
                      {copiedId === hadith.id ? (
                        <CheckCircle className="w-4 h-4 text-[#0EA5A4]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(hadith.id)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isBookmarked
                          ? 'text-[#D4AF37] bg-[#D4AF37]/15'
                          : 'text-[#4A7298] dark:text-[#87CEEB] hover:bg-[#EAF8FF] dark:hover:bg-[#0F2747]'
                      }`}
                      title="حفظ الحديث"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Narrator */}
                <div className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-serif leading-relaxed bg-[#EAF8FF]/85 dark:bg-[#0F2747] p-3.5 rounded-2xl border border-[#87CEEB]/45 dark:border-[#87CEEB]/20">
                  <span className="font-bold text-[#12345A] dark:text-[#F7E7B4] ml-2">راوي الحديث:</span>
                  عن {hadith.narrator}
                </div>

                {/* Matn (Hadith Text) in Arabic */}
                <div className="scholarly-reading-paper p-5 rounded-2xl">
                  <p className="font-amiri font-bold text-lg sm:text-2xl text-[#12345A] leading-[2.2] text-justify">
                    «{hadith.arabicText}»
                  </p>
                </div>

                {/* Foreign Translations if toggled */}
                {activeLang === 'en' && hadith.translationEn && (
                  <div className="p-4 bg-[#EAF8FF] dark:bg-[#0F2747] rounded-2xl border border-[#87CEEB]/50 text-[#12345A] dark:text-[#EAF8FF] text-xs sm:text-sm leading-relaxed" dir="ltr">
                    <p className="font-bold text-[#0D7A7A] dark:text-[#87CEEB] mb-1 text-xs">Translation ({hadith.bookName}):</p>
                    <p className="italic font-serif">"{hadith.translationEn}"</p>
                  </div>
                )}

                {activeLang === 'fr' && hadith.translationFr && (
                  <div className="p-4 bg-[#EAF8FF] dark:bg-[#0F2747] rounded-2xl border border-[#87CEEB]/50 text-[#12345A] dark:text-[#EAF8FF] text-xs sm:text-sm leading-relaxed" dir="ltr">
                    <p className="font-bold text-[#0D7A7A] dark:text-[#87CEEB] mb-1 text-xs">Traduction en Français :</p>
                    <p className="italic font-serif">« {hadith.translationFr} »</p>
                  </div>
                )}

                {/* Hadith Commentary Toggle */}
                <div className="border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pt-3">
                  <button
                    type="button"
                    onClick={() => setExpandedExplanationId(isExplanationOpen ? null : hadith.id)}
                    className="flex items-center justify-between w-full text-xs font-bold text-[#12345A] dark:text-[#87CEEB] hover:text-[#0EA5A4] transition py-1 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#0EA5A4]" />
                      الشرح الميسر وبيان التخريج والفوائد الفقهية
                    </span>
                    <ChevronDown className={`w-4 h-4 transition duration-200 ${isExplanationOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isExplanationOpen && (
                    <div className="mt-3 p-4 bg-[#EAF8FF]/85 dark:bg-[#0F2747] rounded-2xl border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 space-y-3 text-xs sm:text-sm text-[#12345A] dark:text-[#EAF8FF] leading-relaxed animate-in fade-in duration-150">
                      <div>
                        <h5 className="font-bold text-[#0D7A7A] dark:text-[#87CEEB] mb-1">المعنى الإجمالي والفوائد:</h5>
                        <p>{hadith.explanation}</p>
                      </div>

                      <div className="pt-2 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 flex items-center justify-between text-xs">
                        <span className="text-[#4A7298] dark:text-[#B8DEF5] font-semibold">التخريج المعتمد:</span>
                        <span className="text-[#0D7A7A] dark:text-[#5EEAD4] font-mono font-bold">{hadith.gradeAttribution}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <SectionDynamicItems sectionSlug="hadith" />
    </div>
  );
};
