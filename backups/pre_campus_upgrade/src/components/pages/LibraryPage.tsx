import React, { useState } from 'react';
import { 
  Library, BookOpen, Search, Sparkles, Send, 
  HelpCircle, FileText, CheckCircle2, AlertCircle, RefreshCw,
  Globe, Download, ArrowDownToLine, Eye, X, BookmarkCheck, ChevronRight, Filter
} from 'lucide-react';
import { NavigationPage, LibraryBook } from '../../types';
import { LIBRARY_BOOKS, OFFICIAL_COMPLEX_LOGO } from '../../data/islamicData';
import { QuranTranslationsCenter } from '../QuranTranslationsCenter';
import { BookReaderModal } from '../BookReaderModal';
import { useLanguage } from '../../context/LanguageContext';

interface LibraryPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
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
    <div className="space-y-10 animate-fade-in">
      
      {/* Top Institutional Header with Grand Official Crest Emblem */}
      <div className="rounded-3xl p-6 sm:p-12 border border-[#D4AF37]/40 bg-gradient-to-br from-[#0B132B] via-[#070D1E] to-[#050914] text-white shadow-2xl relative overflow-hidden text-center">
        
        {/* Radiant Ambient Halo */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 max-w-4xl mx-auto">
          
          {/* Official Emblem Display - Crisp, Majestic, and Unaltered */}
          <div className="flex justify-center">
            <div className="relative group inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37]/30 via-yellow-400/40 to-[#D4AF37]/30 rounded-3xl blur-2xl group-hover:opacity-100 transition duration-700 pointer-events-none animate-pulse" />
              <div className="relative p-3.5 sm:p-4 bg-[#0B132B]/90 rounded-3xl border-2 border-[#D4AF37]/70 shadow-[0_0_35px_rgba(212,175,55,0.4)] backdrop-blur-xl">
                <img 
                  src={OFFICIAL_COMPLEX_LOGO} 
                  alt="شعار مجمع النور الإسلامي العالمي الخيري الشامل لتحفيظ القرآن الكريم والعلوم الإسلامية" 
                  className="w-48 sm:w-64 md:w-72 h-auto object-contain filter drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#111C3D] text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold border border-[#D4AF37]/40 shadow-sm">
            <Library className="w-4 h-4 text-[#D4AF37]" />
            <span>المكتبة الرقمية العالمية وخزائن الكتب والترجمات المعتمدة</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-amiri leading-tight">
            خزائن المعرفة الإسلامية والكتب المحققة بـ 9 لغات عالمية
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed">
            منصة مجمع النور لقراءة وتحميل أمهات كتب الحديث، التفسير، السيرة النبوية، والفقه المقارن، إلى جانب النسخ الأصلية المعتمدة لترجمات معاني القرآن الصادرة عن <strong>مجمع الملك فهد بالمدينة المنورة</strong>، مع إمكانية القراءة التفاعلية الفورية والتحميل المباشر.
          </p>

          <div className="p-3 bg-[#0B132B] rounded-2xl border border-[#D4AF37]/30 text-xs font-amiri text-[#D4AF37] inline-block shadow-inner">
            «القرآن هداية، والعلم بناء، والعمل الخيري عطاء»
          </div>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-3 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setActiveTab('books')}
          className={`pb-3 text-sm font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'books'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#D4AF37]" />
          <span>خزانة الكتب والمصنفات باللغات العالمية ({LIBRARY_BOOKS.length} كتاباً)</span>
        </button>

        <button
          onClick={() => setActiveTab('translations')}
          className={`pb-3 text-sm font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'translations'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4 text-sky-400" />
          <span>مركز تحميل ترجمات معاني القرآن الأصلية (18+ لغة عالمية)</span>
        </button>

        <button
          onClick={() => setActiveTab('scholar')}
          className={`pb-3 text-sm font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'scholar'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>الباحث والمساعد العلمي التفاعلي</span>
        </button>
      </div>

      {/* TAB 1: Multilingual Books Catalog (Active by default) */}
      {activeTab === 'books' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Controls: Search and Filters */}
          <div className="bg-[#0B132B] p-5 sm:p-6 rounded-3xl border border-[#D4AF37]/30 shadow-lg space-y-5">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-auto">
                <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 uppercase">
                  <Filter className="w-3.5 h-3.5" />
                  <span>تصفية الكتب حسب اللغة والتصنيف</span>
                </span>
                <span className="text-xs text-slate-400">
                  عرض {filteredBooks.length} من أصل {LIBRARY_BOOKS.length} كتاباً متاحاً
                </span>
              </div>

              {/* Central Search Box */}
              <div className="relative w-full md:w-80">
                <Search className={`w-4 h-4 text-slate-400 absolute top-3 pointer-events-none ${isRtl ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالعنوان، المؤلف، المترجم..."
                  className={`w-full bg-[#070D1E] border border-slate-700 focus:border-[#D4AF37] rounded-xl py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] ${
                    isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>
            </div>

            {/* Language Selector Bar */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">اختر اللغة:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {languagesList.map((item) => {
                  const isSelected = selectedLanguage === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => setSelectedLanguage(item.code)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#070D1E] shadow-sm'
                          : 'bg-[#070D1E] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
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
              <span className="text-[11px] font-bold text-slate-300 block">اختر التصنيف العلمي:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {categories.map((c) => {
                  const isSelected = selectedCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#111C3D] text-[#D4AF37] border border-[#D4AF37]/60 shadow-sm'
                          : 'bg-[#070D1E] text-slate-400 hover:text-white border border-slate-800'
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
            <div className="text-center py-16 bg-[#0B132B] rounded-3xl border border-slate-800 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">لم يتم العثور على كتب مطابقة</h3>
              <p className="text-xs text-slate-400">جرب تغيير معايير البحث أو اختيار "جميع اللغات".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLanguage('all');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#070D1E] font-bold text-xs"
              >
                إعادة ضبط عوامل التصفية
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="rounded-3xl bg-[#0B132B] border border-[#D4AF37]/30 hover:border-[#D4AF37] p-6 shadow-xl flex flex-col justify-between space-y-5 transition-all hover:-translate-y-1 group"
                >
                  <div className="space-y-3">
                    
                    {/* Header: Flag, Language & Pages */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111C3D] text-[#D4AF37] font-bold border border-[#D4AF37]/30 text-xs">
                        <span>{book.flag}</span>
                        <span>{book.languageLabel}</span>
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {book.pages} صفحة • {book.year}
                      </span>
                    </div>

                    {/* Book Title & Original */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white font-amiri group-hover:text-[#D4AF37] transition-colors leading-snug">
                        {book.title}
                      </h3>
                      {book.titleNative && book.titleNative !== book.title && (
                        <div className="text-xs text-[#D4AF37]/80 font-serif mt-0.5">
                          {book.titleNative}
                        </div>
                      )}
                    </div>

                    {/* Author & Translator */}
                    <div className="space-y-0.5 text-xs">
                      <div className="text-slate-300">
                        <span className="text-slate-500">المؤلف:</span> <strong className="text-white">{book.author}</strong>
                      </div>
                      {book.translator && (
                        <div className="text-slate-400 text-[11px]">
                          <span className="text-slate-500">المترجم:</span> {book.translator}
                        </div>
                      )}
                      {book.publisher && (
                        <div className="text-slate-400 text-[11px] truncate">
                          <span className="text-slate-500">جهة النشر:</span> {book.publisher}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {book.description}
                    </p>

                    {/* Category badge */}
                    <div className="pt-1">
                      <span className="text-[10px] text-[#D4AF37] bg-[#111C3D] px-2.5 py-0.5 rounded-md border border-[#D4AF37]/20 inline-block font-semibold">
                        {book.category}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: Read & Download */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2.5">
                    
                    <button
                      onClick={() => setSelectedBookForReading(book)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D4AF37] text-[#070D1E] font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                      <BookOpen className="w-4 h-4 text-[#070D1E]" />
                      <span>قراءة الكتاب الآن</span>
                    </button>

                    {book.pdfUrl && (
                      <a
                        href={book.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3.5 rounded-xl bg-[#111C3D] hover:bg-[#1E2E5D] text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 shadow-sm cursor-pointer transition-colors"
                        title="تحميل الكتاب كاملاً بصيغة PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
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
          
          <div className="bg-[#0B132B] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#111C3D] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/40 shadow-sm">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    الباحث والمساعد العلمي التفاعلي
                  </h3>
                  <p className="text-xs text-slate-400">
                    ابحث في نصوص القرآن والحديث والفتاوى الموثقة بأقوال الأئمة الأربعة
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-[#D4AF37] font-bold bg-[#111C3D] px-3 py-1 rounded-full border border-[#D4AF37]/30 hidden sm:inline">
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
                    className="w-full bg-[#070D1E] border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-4 flex gap-2">
                  <select
                    value={scholarlyField}
                    onChange={(e) => setScholarlyField(e.target.value)}
                    className="bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] flex-1"
                  >
                    <option value="علوم القرآن وتفسيره">علوم القرآن والتفسير</option>
                    <option value="الفقه وأصوله">الفقه والأحكام</option>
                    <option value="الحديث النبوي الشريف">الحديث وعلومه</option>
                    <option value="العقيدة الإسلامية">العقيدة والتزكية</option>
                  </select>

                  <button
                    type="submit"
                    disabled={isQuerying || !scholarlyQuestion.trim()}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#070D1E] font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {isQuerying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#070D1E]" />
                        <span>جاري البحث...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 rotate-180 text-[#070D1E]" />
                        <span>بحث علمي</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Sample Questions */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 text-[11px]">نماذج استفسارات شائعة:</span>
                {sampleQuestions.map((q, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setScholarlyQuestion(q)}
                    className="bg-[#070D1E] hover:bg-[#111C3D] text-slate-300 hover:text-white border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </form>

            {queryError && (
              <div className="p-3 bg-red-600/10 border border-red-600/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{queryError}</span>
              </div>
            )}

            {/* Scholarly Answer Box */}
            {scholarlyAnswer && (
              <div className="p-5 sm:p-6 bg-[#070D1E] rounded-2xl border border-[#D4AF37]/50 text-right space-y-3 animate-fade-in shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>إجابة الباحث العلمي المؤصلة:</span>
                  </span>
                  <button
                    onClick={() => setScholarlyAnswer(null)}
                    className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    إغلاق الإجابة ✕
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-loose whitespace-pre-line font-sans">
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

    </div>
  );
};
