import React, { useState } from 'react';
import { 
  Library, BookOpen, Search, Sparkles, Send, 
  HelpCircle, FileText, CheckCircle2, AlertCircle, RefreshCw,
  Globe, Download, ArrowDownToLine, Eye, X, BookmarkCheck
} from 'lucide-react';
import { NavigationPage, LibraryBook } from '../../types';
import { LIBRARY_BOOKS } from '../../data/islamicData';
import { QuranTranslationsCenter } from '../QuranTranslationsCenter';
import { useLanguage } from '../../context/LanguageContext';

interface LibraryPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<'translations' | 'publications'>('translations');
  
  // Library Catalog State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewBook, setPreviewBook] = useState<LibraryBook | null>(null);
  
  // Scholar Assistant State
  const [scholarlyQuestion, setScholarlyQuestion] = useState('');
  const [scholarlyField, setScholarlyField] = useState('علوم القرآن وتفسيره');
  const [isQuerying, setIsQuerying] = useState(false);
  const [scholarlyAnswer, setScholarlyAnswer] = useState<string | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'جميع التصنيفات' },
    { id: 'علوم القرآن والتجويد', label: 'علوم القرآن والتجويد' },
    { id: 'الفقه الإسلامي والوقف', label: 'الفقه الإسلامي والوقف' },
    { id: 'تحفيظ القرآن ومراجعة الحفظ', label: 'تحفيظ القرآن ومراجعة الحفظ' },
    { id: 'العقيدة والتزكية', label: 'العقيدة والتزكية' },
  ];

  const filteredBooks = LIBRARY_BOOKS.filter((b) => {
    const matchesCat = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesSearch = b.title.includes(searchQuery) || b.author.includes(searchQuery);
    return matchesCat && matchesSearch;
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
    <div className="space-y-10">
      
      {/* Top Institutional Header */}
      <div className="rounded-3xl p-6 sm:p-10 border border-[#E5DCCB] dark:border-[#3A4237] bg-gradient-to-br from-[#F0EDE4] via-[#F7F5EF] to-[#E5DCCB] dark:from-[#272B25] dark:via-[#1F221E] dark:to-[#2F362C] shadow-sm space-y-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#394E43] text-[#F7F5EF] px-3.5 py-1 rounded-full text-xs font-black shadow-2xs">
            <Library className="w-4 h-4 text-[#B9A477]" />
            <span>المكتبة الرقمية العالمية وخزائن ترجمات القرآن الكريم</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black text-[#343832] dark:text-[#F7F5EF] font-amiri">
            خزائن المعرفة القرآنية والترجمات الإسلامية المحققة
          </h1>
          
          <p className="text-xs sm:text-sm text-[#657568] dark:text-[#D8CEBB] max-w-3xl mx-auto leading-relaxed">
            منصة مجمع النور لتحميل وقراءة النسخ الأصلية المعتمدة لترجمات معاني القرآن الكريم الصادرة عن <strong>مجمع الملك فهد بالمدينة المنورة</strong> بأكثر من 18 لغة عالمية، إلى جانب البحوث الفقهية وإصدارات المجمع المعتمدة.
          </p>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex border-b border-[#E5DCCB] dark:border-[#343832] gap-4">
        <button
          onClick={() => setActiveTab('translations')}
          className={`pb-3 text-sm font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'translations'
              ? 'border-[#394E43] text-[#394E43] dark:text-[#F7F5EF] dark:border-[#B9A477]'
              : 'border-transparent text-[#657568] dark:text-[#D8CEBB] hover:text-[#343832]'
          }`}
        >
          <Globe className="w-4 h-4 text-[#B9A477]" />
          <span>مركز تحميل ترجمات معاني القرآن الأصلية (18+ لغة عالمية)</span>
        </button>

        <button
          onClick={() => setActiveTab('publications')}
          className={`pb-3 text-sm font-black flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'publications'
              ? 'border-[#394E43] text-[#394E43] dark:text-[#F7F5EF] dark:border-[#B9A477]'
              : 'border-transparent text-[#657568] dark:text-[#D8CEBB] hover:text-[#343832]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#B9A477]" />
          <span>إصدارات وبحوث مجمع النور والمساعد العلمي</span>
        </button>
      </div>

      {/* TAB 1: Quran Translations Official Download Center */}
      {activeTab === 'translations' && (
        <div className="space-y-6 animate-fade-in">
          <QuranTranslationsCenter />
        </div>
      )}

      {/* TAB 2: Institutional Books, Scholar AI & Research */}
      {activeTab === 'publications' && (
        <div className="space-y-10 animate-fade-in">
          
          {/* AI Scholar Research Box */}
          <div className="bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E5DCCB] dark:border-[#343832] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#394E43] text-[#F7F5EF] flex items-center justify-center shadow-2xs">
                  <Sparkles className="w-5 h-5 text-[#B9A477]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#343832] dark:text-[#F7F5EF]">
                    الباحث والمساعد العلمي التفاعلي
                  </h3>
                  <p className="text-xs text-[#657568] dark:text-[#D8CEBB]">
                    ابحث في نصوص القرآن والحديث والفتاوى الموثقة بأقوال الأئمة الأربعة
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-[#394E43] dark:text-[#B9A477] font-bold bg-[#F0EDE4] dark:bg-[#1F221E] px-3 py-1 rounded-full border border-[#D8CEBB] dark:border-[#343832] hidden sm:inline">
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
                    className="w-full bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#D8CEBB] dark:border-[#343832] rounded-xl p-3 text-xs sm:text-sm text-[#343832] dark:text-[#F7F5EF] placeholder-[#80887D] focus:outline-hidden focus:border-[#394E43]"
                  />
                </div>

                <div className="sm:col-span-4 flex gap-2">
                  <select
                    value={scholarlyField}
                    onChange={(e) => setScholarlyField(e.target.value)}
                    className="bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#D8CEBB] dark:border-[#343832] rounded-xl px-3 py-2 text-xs text-[#343832] dark:text-[#F7F5EF] focus:outline-hidden focus:border-[#394E43] flex-1"
                  >
                    <option value="علوم القرآن وتفسيره">علوم القرآن والتفسير</option>
                    <option value="الفقه وأصوله">الفقه والأحكام</option>
                    <option value="الحديث النبوي الشريف">الحديث وعلومه</option>
                    <option value="العقيدة الإسلامية">العقيدة والتزكية</option>
                  </select>

                  <button
                    type="submit"
                    disabled={isQuerying || !scholarlyQuestion.trim()}
                    className="bg-[#394E43] hover:bg-[#2D3E35] text-[#F7F5EF] font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {isQuerying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#B9A477]" />
                        <span>جاري البحث...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 rotate-180 text-[#B9A477]" />
                        <span>بحث علمي</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Sample Questions */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[#80887D] text-[11px]">نماذج استفسارات شائعة:</span>
                {sampleQuestions.map((q, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setScholarlyQuestion(q)}
                    className="bg-[#F0EDE4] dark:bg-[#1F221E] hover:bg-[#E5DCCB] text-[#343832] dark:text-[#D8CEBB] border border-[#D8CEBB] dark:border-[#343832] px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </form>

            {queryError && (
              <div className="p-3 bg-red-600/10 border border-red-600/30 rounded-xl text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{queryError}</span>
              </div>
            )}

            {/* Scholarly Answer Box */}
            {scholarlyAnswer && (
              <div className="p-5 sm:p-6 bg-[#F0EDE4] dark:bg-[#1F221E] rounded-2xl border border-[#394E43] text-right space-y-3 animate-fade-in shadow-inner">
                <div className="flex items-center justify-between border-b border-[#E5DCCB] dark:border-[#343832] pb-2">
                  <span className="text-xs font-bold text-[#394E43] dark:text-[#B9A477] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>إجابة الباحث العلمي المؤصلة:</span>
                  </span>
                  <button
                    onClick={() => setScholarlyAnswer(null)}
                    className="text-[11px] text-[#657568] hover:text-[#343832] cursor-pointer"
                  >
                    إغلاق الإجابة ✕
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#343832] dark:text-[#F7F5EF] leading-loose whitespace-pre-line font-sans">
                  {scholarlyAnswer}
                </p>
              </div>
            )}
          </div>

          {/* Digital Library Catalog */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#343832] dark:text-[#F7F5EF] font-amiri">
                  إصدارات ومطبوعات مجمع النور الرسمية
                </h2>
                <p className="text-xs text-[#657568] dark:text-[#D8CEBB] mt-0.5">
                  كتب ومراجع معتمدة في تعليم القرآن ومناهج كلية العلوم الإسلامية
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-[#80887D] absolute top-3 right-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن كتاب أو مؤلف..."
                  className="w-full bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] rounded-xl pr-9 pl-3 py-2 text-xs text-[#343832] dark:text-[#F7F5EF] placeholder-[#80887D] focus:outline-hidden focus:border-[#394E43]"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-[#394E43] text-[#F7F5EF] font-black shadow-xs'
                      : 'bg-[#FAF8F2] dark:bg-[#272B25] text-[#657568] dark:text-[#D8CEBB] border border-[#E5DCCB] dark:border-[#3A4237] hover:bg-[#F0EDE4]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Book Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] rounded-3xl p-6 shadow-2xs space-y-4 text-right flex flex-col justify-between hover:border-[#394E43] transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#394E43] dark:text-[#B9A477] bg-[#F0EDE4] dark:bg-[#1F221E] px-2.5 py-0.5 rounded-md border border-[#E5DCCB] dark:border-[#343832]">
                        {book.category}
                      </span>
                      <span className="text-[11px] text-[#657568] dark:text-[#D8CEBB] font-mono">
                        {book.pages} صفحة • {book.era || book.year || 'طبعة معتمدة'}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-[#343832] dark:text-[#F7F5EF] leading-snug font-amiri">
                      {book.title}
                    </h3>

                    <div className="text-xs text-[#657568] dark:text-[#D8CEBB] font-medium">
                      المؤلف: {book.author}
                    </div>

                    <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed line-clamp-3">
                      {book.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E5DCCB] dark:border-[#343832] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#80887D]">متاح للمطالعة والتحميل الوقفية</span>
                    <button
                      onClick={() => setPreviewBook(book)}
                      className="bg-[#F0EDE4] dark:bg-[#1F221E] hover:bg-[#E5DCCB] text-[#394E43] dark:text-[#F7F5EF] font-bold px-3.5 py-2 rounded-xl border border-[#D8CEBB] dark:border-[#343832] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#B9A477]" />
                      <span>تصفح الكتاب</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* Book Reader Modal */}
      {previewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5DCCB] dark:border-[#343832] pb-3">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-[#394E43] dark:text-[#B9A477]" />
                <h3 className="text-base font-bold text-[#343832] dark:text-[#F7F5EF] font-amiri">
                  {previewBook.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewBook(null)}
                className="text-xs text-[#657568] hover:text-[#343832] p-1.5 rounded-lg bg-[#F0EDE4] dark:bg-[#1F221E] cursor-pointer"
              >
                ✕ إغلاق
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[#5E655B] dark:text-[#D8CEBB]">
              <div className="p-3 bg-[#F0EDE4] dark:bg-[#1F221E] rounded-xl space-y-1">
                <span className="font-bold text-[#343832] dark:text-[#F7F5EF] block">المؤلف: {previewBook.author}</span>
                <span>التصنيف: {previewBook.category} • عدد الصفحات: {previewBook.pages}</span>
              </div>
              <p className="p-4 bg-[#F0EDE4] dark:bg-[#1F221E] rounded-xl text-sm font-amiri leading-loose">
                {previewBook.description}
                <br /><br />
                هذا الكتاب متوفر ومسجل ضمن أوقاف مجمع النور الإسلامي العالمي لخدمة طلبة العلم، ويمكن لجميع الدارسين في الأكاديمية تحميل الفصول كاملة ومتابعة الشروحات المباشرة مع المشايخ المعتمدين.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5DCCB] dark:border-[#343832]">
              <button
                onClick={() => {
                  const blob = new Blob([`كتاب: ${previewBook.title}\nالمؤلف: ${previewBook.author}\n\n${previewBook.description}`], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${previewBook.title}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 rounded-xl bg-[#394E43] text-[#F7F5EF] text-xs font-bold hover:bg-[#2D3E35] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#B9A477]" />
                <span>تنزيل ملخص الكتاب</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
