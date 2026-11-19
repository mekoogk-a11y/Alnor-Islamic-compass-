import React, { useState } from 'react';
import {
  Library, BookOpen, Search, Sparkles, Send,
  CheckCircle2, AlertCircle, RefreshCw,
  Globe, Download, Filter
} from 'lucide-react';
import { NavigationPage, LibraryBook } from '../../types';
import { LIBRARY_BOOKS, OFFICIAL_COMPLEX_LOGO } from '../../data/islamicData';
import { QuranTranslationsCenter } from '../QuranTranslationsCenter';
import { BookReaderModal } from '../BookReaderModal';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface LibraryPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = () => {
  const { isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<'books' | 'translations' | 'scholar'>('books');

  // Library Catalog State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBookForReading, setSelectedBookForReading] = useState<LibraryBook | null>(null);

  // Scholar Assistant State
  const [scholarlyQuestion, setScholarlyQuestion] = useState('');
  const [scholarlyField, setScholarlyField] = useState('علوم القرآن وتفسيره');
  const [isQuerying, setIsQuerying] = useState(false);
  const [scholarlyAnswer, setScholarlyAnswer] = useState<string | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  const languagesList = [
    { code: 'all', label: 'جميع اللغات', flag: '🌐' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'ur', label: 'اردو', flag: '🇵🇰' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  const categories = [
    { id: 'all', label: 'جميع التصنيفات' },
    { id: 'السنة النبوية والحديث', label: 'السنة النبوية والحديث' },
    { id: 'علوم القرآن والتفاسير', label: 'علوم القرآن والتفاسير' },
    { id: 'السيرة النبوية', label: 'السيرة النبوية الشريفة' },
    { id: 'العقيدة والتوحيد', label: 'العقيدة والتوحيد' },
    { id: 'دعوة والمهتدون الجدد', label: 'الدعوة والمهتدون الجدد' },
    { id: 'الفقه الإسلامي والوقف', label: 'الفقه الإسلامي والوقف' },
  ];

  const filteredBooks = LIBRARY_BOOKS.filter((b) => {
    const matchesLang = selectedLanguage === 'all' || b.language === selectedLanguage;
    const matchesCat = selectedCategory === 'all' || b.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      b.title.toLowerCase().includes(query) ||
      (b.titleNative && b.titleNative.toLowerCase().includes(query)) ||
      b.author.toLowerCase().includes(query) ||
      (b.translator && b.translator.toLowerCase().includes(query)) ||
      b.description.toLowerCase().includes(query) ||
      b.languageLabel.toLowerCase().includes(query);

    return matchesLang && matchesCat && matchesSearch;
  });

  const handleAskScholar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarlyQuestion.trim()) return;

    setIsQuerying(true);
    setQueryError(null);

    try {
      const res = await fetch('/api/scholar/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: scholarlyQuestion,
          field: scholarlyField,
        }),
      });

      if (!res.ok) {
        throw new Error('تعذر جلب الإجابة من المنصة، يرجى المحاولة مرة أخرى');
      }

      const data = await res.json();
      setScholarlyAnswer(data.answer);
    } catch (err: any) {
      setQueryError(err.message || 'حدث خطأ في الاتصال');
    } finally {
      setIsQuerying(false);
    }
  };

  const sampleQuestions = [
    'ما هي شروط نيل الإجازة القرآنية بالسند المتصل؟',
    'ما الراجح في حكم زكاة المال المودع للأوقاف الخيرية؟',
    'كيف يثبت طالب العلم حفظه ويضبط المتشابهات اللفظية في القرآن؟',
  ];

  return (
    <div className="space-y-10 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Top Institutional Sky-Blue 3D Header with Grand Official Emblem */}
      <div className="rounded-3xl p-6 sm:p-12 border border-[#87CEEB]/55 bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] text-white shadow-xl relative overflow-hidden text-center">
        <div className="relative z-10 space-y-5 max-w-4xl mx-auto">

          <div className="flex flex-col items-center gap-4">
            <div className="relative p-3.5 sm:p-4 bg-white rounded-3xl border-2 border-[#D4AF37]/80 shadow-lg">
              <img
                src={OFFICIAL_COMPLEX_LOGO}
                alt="شعار مجمع النور الإسلامي العالمي الخيري الشامل لتحفيظ القرآن الكريم والعلوم الإسلامية"
                className="w-40 sm:w-52 h-auto object-contain"
                loading="eager"
              />
            </div>
            <Sky3DIcon slug="library" tone="turquoise" size="md" />
          </div>

          <p className="text-xs font-bold text-[#87CEEB] flex items-center justify-center gap-2">
            <Library className="w-4 h-4 text-[#F7E7B4]" />
            <span>المكتبة الرقمية العالمية وخزائن الكتب والترجمات المعتمدة</span>
          </p>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-amiri leading-tight">
            خزائن المعرفة الإسلامية والكتب المحققة بـ 9 لغات عالمية
          </h1>

          <p className="text-xs sm:text-sm text-[#D7F1FC] max-w-3xl mx-auto leading-relaxed">
            منصة مجمع النور لقراءة وتحميل أمهات كتب الحديث، التفسير، السيرة النبوية، والفقه المقارن، إلى جانب النسخ الأصلية المعتمدة لترجمات معاني القرآن الصادرة عن <strong>مجمع الملك فهد بالمدينة المنورة</strong>، مع إمكانية القراءة التفاعلية الفورية والتحميل المباشر.
          </p>

          <div className="px-4 py-2 bg-[#12345A]/80 rounded-2xl border border-[#87CEEB]/40 text-xs font-amiri text-[#F7E7B4] inline-block">
            «القرآن هداية، والعلم بناء، والعمل الخيري عطاء»
          </div>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="sky-glass-panel flex rounded-2xl p-2 gap-2 overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'books'
              ? 'bg-[#12345A] text-white shadow-sm'
              : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-white/70 dark:hover:bg-[#14335B]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#D4AF37]" />
          <span>خزانة الكتب والمصنفات باللغات العالمية ({LIBRARY_BOOKS.length} كتاباً)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('translations')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'translations'
              ? 'bg-[#12345A] text-white shadow-sm'
              : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-white/70 dark:hover:bg-[#14335B]'
          }`}
        >
          <Globe className="w-4 h-4 text-[#0EA5A4]" />
          <span>مركز تحميل ترجمات معاني القرآن الأصلية (18+ لغة عالمية)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scholar')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'scholar'
              ? 'bg-[#12345A] text-white shadow-sm'
              : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-white/70 dark:hover:bg-[#14335B]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>الباحث والمساعد العلمي التفاعلي</span>
        </button>
      </div>

      {/* TAB 1: Multilingual Books Catalog */}
      {activeTab === 'books' && (
        <div className="space-y-8 animate-fade-in">

          {/* Controls: Search and Filters */}
          <div className="sky-card-3d p-5 sm:p-6 rounded-3xl space-y-5">

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-auto">
                <span className="text-xs font-black text-[#12345A] dark:text-[#87CEEB] flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#0EA5A4]" />
                  <span>تصفية الكتب حسب اللغة والتصنيف</span>
                </span>
                <span className="text-xs text-[#4A7298] dark:text-[#B8DEF5]">
                  عرض {filteredBooks.length} من أصل {LIBRARY_BOOKS.length} كتاباً متاحاً
                </span>
              </div>

              {/* Central Search Box */}
              <div className="relative w-full md:w-80">
                <Search className={`w-4 h-4 text-[#0EA5A4] absolute top-3 pointer-events-none ${isRtl ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالعنوان، المؤلف، المترجم..."
                  className={`w-full bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 focus:border-[#0EA5A4] rounded-xl py-2.5 text-xs text-[#12345A] dark:text-white focus:outline-none ${
                    isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>
            </div>

            {/* Language Selector Bar */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#12345A] dark:text-[#EAF8FF] block">اختر اللغة:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {languagesList.map((item) => {
                  const isSelected = selectedLanguage === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setSelectedLanguage(item.code)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4] shadow-sm'
                          : 'bg-[#EAF8FF] dark:bg-[#0F2747] text-[#12345A] dark:text-[#B8DEF5] border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 hover:border-[#0EA5A4]'
                      }`}
                    >
                      <span>{item.flag}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categories Selector Bar */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#12345A] dark:text-[#EAF8FF] block">اختر التصنيف العلمي:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {categories.map((c) => {
                  const isSelected = selectedCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0EA5A4] text-white shadow-sm'
                          : 'bg-[#EAF8FF] dark:bg-[#0F2747] text-[#2B547E] dark:text-[#B8DEF5] border border-[#87CEEB]/45 dark:border-[#87CEEB]/25'
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <div className="sky-card-3d text-center py-16 rounded-3xl space-y-3">
              <BookOpen className="w-12 h-12 text-[#0EA5A4] mx-auto" />
              <h3 className="text-base font-bold text-[#12345A] dark:text-white">لم يتم العثور على كتب مطابقة</h3>
              <p className="text-xs text-[#4A7298] dark:text-[#B8DEF5]">جرب تغيير معايير البحث أو اختيار "جميع اللغات".</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLanguage('all');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#12345A] text-white font-bold text-xs cursor-pointer"
              >
                إعادة ضبط عوامل التصفية
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="sky-card-3d rounded-3xl p-6 flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-3">

                    {/* Header: Flag, Language & Pages */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-black text-[#0D7A7A] dark:text-[#87CEEB]">
                        <span>{book.flag}</span>
                        <span>{book.languageLabel}</span>
                      </span>
                      <span className="text-[#4A7298] dark:text-[#B8DEF5] font-mono text-[11px]">
                        {book.pages} صفحة · {book.year}
                      </span>
                    </div>

                    {/* Book Title & Original */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#12345A] dark:text-white font-amiri group-hover:text-[#0EA5A4] dark:group-hover:text-[#87CEEB] transition-colors leading-snug">
                        {book.title}
                      </h3>
                      {book.titleNative && book.titleNative !== book.title && (
                        <div className="text-xs text-[#4A7298] dark:text-[#87CEEB] font-serif mt-0.5">
                          {book.titleNative}
                        </div>
                      )}
                    </div>

                    {/* Author & Translator */}
                    <div className="space-y-0.5 text-xs">
                      <div className="text-[#2B547E] dark:text-[#B8DEF5]">
                        <span className="text-[#4A7298] dark:text-[#84B4D6]">المؤلف:</span>{' '}
                        <strong className="text-[#12345A] dark:text-white">{book.author}</strong>
                      </div>
                      {book.translator && (
                        <div className="text-[#4A7298] dark:text-[#B8DEF5] text-[11px]">
                          <span>المترجم:</span> {book.translator}
                        </div>
                      )}
                      {book.publisher && (
                        <div className="text-[#4A7298] dark:text-[#B8DEF5] text-[11px] truncate">
                          <span>جهة النشر:</span> {book.publisher}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed line-clamp-3">
                      {book.description}
                    </p>

                    <div className="pt-1 text-[11px] font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
                      {book.category}
                    </div>
                  </div>

                  {/* Action Buttons: Read & Download */}
                  <div className="pt-4 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 flex items-center justify-between gap-2.5">

                    <button
                      type="button"
                      onClick={() => setSelectedBookForReading(book)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-[#F7E7B4]" />
                      <span>قراءة الكتاب الآن</span>
                    </button>

                    {book.pdfUrl && (
                      <a
                        href={book.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0F2747] hover:border-[#0EA5A4] text-[#12345A] dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-[#87CEEB]/55 dark:border-[#87CEEB]/25 shadow-sm cursor-pointer transition-colors"
                        title="تحميل الكتاب كاملاً بصيغة PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-[#0EA5A4]" />
                        <span>PDF</span>
                      </a>
                    )}

                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: Quran Translations Official Download Center */}
      {activeTab === 'translations' && (
        <div className="space-y-6 animate-fade-in">
          <QuranTranslationsCenter />
        </div>
      )}

      {/* TAB 3: Scholar AI & Research Assistant */}
      {activeTab === 'scholar' && (
        <div className="space-y-10 animate-fade-in">

          <div className="sky-card-3d rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#12345A] to-[#0EA5A4] text-[#F7E7B4] flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#12345A] dark:text-white">
                    الباحث والمساعد العلمي التفاعلي
                  </h3>
                  <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                    ابحث في نصوص القرآن والحديث والفتاوى الموثقة بأقوال الأئمة الأربعة
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-[#0D7A7A] dark:text-[#87CEEB] font-bold hidden sm:inline">
                بحث مؤصل ومدقق
              </span>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskScholar} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={scholarlyQuestion}
                    onChange={(e) => setScholarlyQuestion(e.target.value)}
                    placeholder="اكتب مسألتك أو سؤالك العلمي هنا (مثال: ما هي شروط الإجازة في القراءات العشر؟)..."
                    className="w-full bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded-xl p-3 text-xs sm:text-sm text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                  />
                </div>

                <div className="sm:col-span-4 flex gap-2">
                  <select
                    value={scholarlyField}
                    onChange={(e) => setScholarlyField(e.target.value)}
                    className="bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded-xl px-3 py-2 text-xs text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4] flex-1"
                  >
                    <option value="علوم القرآن وتفسيره">علوم القرآن والتفسير</option>
                    <option value="الفقه وأصوله">الفقه والأحكام</option>
                    <option value="الحديث النبوي الشريف">الحديث وعلومه</option>
                    <option value="العقيدة الإسلامية">العقيدة والتزكية</option>
                  </select>

                  <button
                    type="submit"
                    disabled={isQuerying || !scholarlyQuestion.trim()}
                    className="bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {isQuerying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري البحث...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 rotate-180" />
                        <span>بحث علمي</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Sample Questions */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[#4A7298] dark:text-[#B8DEF5] text-[11px] font-bold">نماذج استفسارات شائعة:</span>
                {sampleQuestions.map((q, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setScholarlyQuestion(q)}
                    className="bg-[#EAF8FF] dark:bg-[#0F2747] hover:border-[#0EA5A4] text-[#12345A] dark:text-[#EAF8FF] border border-[#87CEEB]/50 px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </form>

            {queryError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 rounded-xl text-rose-700 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{queryError}</span>
              </div>
            )}

            {/* Scholarly Answer Box */}
            {scholarlyAnswer && (
              <div className="scholarly-reading-paper p-5 sm:p-6 rounded-2xl text-right space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#87CEEB]/40 pb-2">
                  <span className="text-xs font-bold text-[#12345A] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0EA5A4]" />
                    <span>إجابة الباحث العلمي المؤصلة:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setScholarlyAnswer(null)}
                    className="text-[11px] text-[#4A7298] hover:text-[#12345A] cursor-pointer font-bold"
                  >
                    إغلاق الإجابة ✕
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#12345A] leading-loose whitespace-pre-line font-sans">
                  {scholarlyAnswer}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Book Reader Modal */}
      <BookReaderModal
        book={selectedBookForReading}
        onClose={() => setSelectedBookForReading(null)}
      />

      <SectionDynamicItems sectionSlug="library" />

    </div>
  );
};
