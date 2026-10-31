import React, { useState } from 'react';
import { 
  Library, BookOpen, Search, Sparkles, Send, 
  HelpCircle, FileText, CheckCircle2, AlertCircle, RefreshCw 
} from 'lucide-react';
import { NavigationPage, LibraryBook } from '../../types';
import { LIBRARY_BOOKS } from '../../data/islamicData';

interface LibraryPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
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
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 border border-emerald-900/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
          <Library className="w-4 h-4" />
          <span>المكتبة الرقمية وأبحاث هيئة علماء مجمع النور</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          خزائن المعرفة الإسلامية والبحوث الشرعية المحكمة
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          منصة معرفية تضم أحدث إصدارات وأبحاث مجمع النور في علوم القرآن، الفقه، الحديث، وركن الباحث الشرعي للرد على أسئلة الطلاب والباحثين.
        </p>
      </div>

      {/* AI Scholar Research Box */}
      <div className="bg-slate-900/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                الباحث والمساعد العلمي التفاعلي
              </h3>
              <p className="text-xs text-slate-400">
                ابحث في نصوص القرآن والحديث والفتاوى الموثقة بأقوال الأئمة الأربعة
              </p>
            </div>
          </div>
          <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 hidden sm:inline">
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
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-4 flex gap-2">
              <select
                value={scholarlyField}
                onChange={(e) => setScholarlyField(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 flex-1"
              >
                <option value="علوم القرآن وتفسيره">علوم القرآن والتفسير</option>
                <option value="الفقه وأصوله">الفقه والأحكام</option>
                <option value="الحديث النبوي الشريف">الحديث وعلومه</option>
                <option value="العقيدة الإسلامية">العقيدة والتزكية</option>
              </select>

              <button
                type="submit"
                disabled={isQuerying || !scholarlyQuestion.trim()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
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
            <span className="text-slate-500 text-[11px]">نماذج استفسارات شائعة:</span>
            {sampleQuestions.map((q, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setScholarlyQuestion(q)}
                className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </form>

        {queryError && (
          <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{queryError}</span>
          </div>
        )}

        {/* Scholarly Answer Box */}
        {scholarlyAnswer && (
          <div className="p-5 sm:p-6 bg-slate-950 rounded-2xl border border-emerald-900/40 text-right space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>إجابة الباحث العلمي المؤصلة:</span>
              </span>
              <button
                onClick={() => setScholarlyAnswer(null)}
                className="text-[11px] text-slate-500 hover:text-slate-300"
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

      {/* Digital Library Catalog */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              إصدارات ومطبوعات مجمع النور الرسمية
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              كتب ومراجع معتمدة في تعليم القرآن ومناهج كلية العلوم الإسلامية
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute top-3 right-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كتاب أو مؤلف..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
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
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-right flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {book.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {book.pages} صفحة • {book.era || book.year || 'تراث إسلامي'}
                  </span>
                </div>

                <h3 className="text-base font-black text-white leading-snug">
                  {book.title}
                </h3>

                <div className="text-xs text-amber-400/90 font-medium">
                  المؤلف: {book.author}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {book.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">متاح للمطالعة والتحميل المجاني</span>
                <button
                  onClick={() => alert(`كتاب «${book.title}» متوفر للمطالعة في مقرأة ومكتبة المجمع الرقمية.`)}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>تصفح الكتاب</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
