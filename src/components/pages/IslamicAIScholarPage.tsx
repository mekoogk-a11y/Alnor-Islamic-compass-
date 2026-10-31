import React, { useState } from 'react';
import { 
  Sparkles, Send, ShieldAlert, BookOpen, Scroll, CheckCircle, 
  HelpCircle, RefreshCw, Copy, ShieldCheck, AlertCircle, Bookmark 
} from 'lucide-react';
import { NavigationPage } from '../../types';

interface IslamicAIScholarPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const IslamicAIScholarPage: React.FC<IslamicAIScholarPageProps> = () => {
  const [selectedField, setSelectedField] = useState('علوم القرآن والتفسير');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseAnswer, setResponseAnswer] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Pre-configured questions for swift research
  const sampleQuestions = [
    {
      field: 'علوم القرآن والتفسير',
      q: 'ما هو الفرق بين المكي والمدني في القرآن الكريم وضوابط التمييز بينهما؟',
    },
    {
      field: 'الحديث وعلومه',
      q: 'ما هي شروط صحة الحديث الخمسة عند أئمة الحديث كالبخاري ومسلم؟',
    },
    {
      field: 'فقه العبادات',
      q: 'ما هي أركان سجود السهو ومواضعه قبل السلام وبعده مع الأدلة؟',
    },
    {
      field: 'اللغة وإعراب القرآن',
      q: 'ما هو المعنى البلاغي والإعرابي للتقديم والتأخير في قوله تعالى: (إياك نعبد)؟',
    },
  ];

  const handleAsk = async (queryText?: string) => {
    const textToQuery = queryText || inputQuery;
    if (!textToQuery.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResponseAnswer(null);

    try {
      const res = await fetch('/api/scholar/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToQuery,
          field: selectedField,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء معالجة السؤال العلمي');
      }

      setResponseAnswer(data.answer);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'تعذر الاتصال بالخادم العلمي، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (responseAnswer) {
      navigator.clipboard.writeText(responseAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-900/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>المساعد المعرفي الأكاديمي الموثق • الذكاء الاصطناعي الإسلامي الرشيد</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            بحثٌ علمي إسلامي رصين موثق بالأدلة والمراجع المعتمدة
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            محرك معرفي إسلامي منضبط بالضوابط الشرعية، يستند إلى نصوص الوحيين وأقوال أئمة الهدى المعتبرين، لمساعدة طلبة العلم والباحثين في تيسير الفهم وتوثيق المسائل.
          </p>

          {/* Ethical Guardrail Disclaimer */}
          <div className="p-3.5 bg-amber-950/30 border border-amber-600/40 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-amber-300">تنويه شرعي وأكاديمي واجب:</span>
              <p className="text-[11px] leading-relaxed text-amber-200/90">
                هذا المساعد أداة بحثية وتعليمية لتوثيق المسائل ونصوص العلماء، ولا يغني عن مراجعة المجالس الإفتائية الرسمية في النوازل الفردية والمسائل القضائية والطلاق والنزاعات الأسرية والمالية المعقدة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interaction Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Field Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300">
            اختر الحقل الشرعي للبحث:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {[
              'علوم القرآن والتفسير',
              'الحديث وعلومه',
              'فقه العبادات',
              'فقه المعاملات المالية',
              'السيرة النبوية والتاريخ',
              'اللغة وإعراب القرآن',
            ].map((field) => (
              <button
                key={field}
                type="button"
                onClick={() => setSelectedField(field)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  selectedField === field
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {field}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            اطرح مسألتك العلمية أو استفسارك الأكاديمي:
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="مثال: ما هي الفروق الفقهية بين زكاة المال وزكاة الفطر، وما هي أدلتها وشروط وجوبها؟"
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>الإجابات تخضع للتدقيق والتوثيق بالأدلة الشرعية</span>
            </div>

            <button
              onClick={() => handleAsk()}
              disabled={isLoading || !inputQuery.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري استحضار الأدلة وتوثيق المسألة...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>بحث وتأصيل المسألة</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Sample Queries */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <span className="text-[11px] text-slate-400 font-medium block">
            نماذج لبحوث ومسائل علمية جاهزة للاستعراض الفوري:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleQuestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedField(item.field);
                  setInputQuery(item.q);
                  handleAsk(item.q);
                }}
                className="p-2.5 bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-700/60 rounded-xl text-right text-xs text-slate-300 transition flex items-center justify-between group"
              >
                <span className="line-clamp-1 group-hover:text-amber-300">{item.q}</span>
                <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">[{item.field}]</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Presentation */}
      {errorMsg && (
        <div className="p-4 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {responseAnswer && (
        <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                {selectedField}
              </span>
              <span className="text-xs text-slate-400">توثيق مجمع النور الأكاديمي</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ الإجابة'}</span>
              </button>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-200 leading-[2.2] whitespace-pre-line font-sans">
            {responseAnswer}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>تم التأصيل بالاستناد إلى القرآن الكريم والسنة النبوية وأمهات كتب السلف</span>
            <span className="text-amber-400 font-medium">مجمع النور الإسلامي العالمي</span>
          </div>
        </div>
      )}
    </div>
  );
};
