import React, { useState } from 'react';
import {
  Sparkles, Send, ShieldAlert, CheckCircle,
  RefreshCw, Copy, ShieldCheck, AlertCircle
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface IslamicAIScholarPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const IslamicAIScholarPage: React.FC<IslamicAIScholarPageProps> = () => {
  const { isRtl } = useLanguage();
  const [selectedField, setSelectedField] = useState('علوم القرآن والتفسير');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseAnswer, setResponseAnswer] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sky-Blue 3D Header Banner */}
      <div className="bg-gradient-to-br from-[#12345A] via-[#0F3F6B] to-[#0EA5A4] border border-[#87CEEB]/55 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-5 max-w-4xl">
          <div className="hidden sm:block shrink-0">
            <Sky3DIcon slug="aiScholar" tone="ocean" size="lg" />
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-[#F7E7B4] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#87CEEB]" />
              <span>المساعد المعرفي الأكاديمي الموثق · الذكاء الاصطناعي الإسلامي الرشيد</span>
            </p>

            <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white leading-tight">
              بحثٌ علمي إسلامي رصين موثق بالأدلة والمراجع المعتمدة
            </h1>

            <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed">
              محرك معرفي إسلامي منضبط بالضوابط الشرعية، يستند إلى نصوص الوحيين وأقوال أئمة الهدى المعتبرين، لمساعدة طلبة العلم والباحثين في تيسير الفهم وتوثيق المسائل.
            </p>

            {/* Ethical Guardrail Disclaimer */}
            <div className="p-4 bg-[#FFF9E6] dark:bg-[#102A4C] border border-[#D4AF37]/60 rounded-2xl flex items-start gap-3 text-xs text-[#12345A] dark:text-[#EAF8FF]">
              <ShieldAlert className="w-5 h-5 text-[#9E7818] dark:text-[#F7E7B4] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-black block text-[#12345A] dark:text-[#F7E7B4]">تنويه شرعي وأكاديمي واجب:</span>
                <p className="text-[11px] leading-relaxed text-[#2B547E] dark:text-[#B8DEF5]">
                  هذا المساعد أداة بحثية وتعليمية لتوثيق المسائل ونصوص العلماء، ولا يغني عن مراجعة المجالس الإفتائية الرسمية في النوازل الفردية والمسائل القضائية والطلاق والنزاعات الأسرية والمالية المعقدة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interaction Card */}
      <div className="sky-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Field Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-[#12345A] dark:text-[#EAF8FF]">
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
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedField === field
                    ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4] shadow-sm'
                    : 'bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/50 text-[#12345A] dark:text-[#B8DEF5] hover:border-[#0EA5A4]'
                }`}
              >
                {field}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input */}
        <div className="space-y-3">
          <label className="block text-xs font-black text-[#12345A] dark:text-[#EAF8FF]">
            اطرح مسألتك العلمية أو استفسارك الأكاديمي:
          </label>
          <textarea
            rows={3}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="مثال: ما هي الفروق الفقهية بين زكاة المال وزكاة الفطر، وما هي أدلتها وشروط وجوبها؟"
            className="w-full p-4 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-2xl text-[#12345A] dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#0EA5A4] resize-none leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-[#2B547E] dark:text-[#B8DEF5] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#0EA5A4]" />
              <span>الإجابات تخضع للتدقيق والتوثيق بالأدلة الشرعية</span>
            </div>

            <button
              type="button"
              onClick={() => handleAsk()}
              disabled={isLoading || !inputQuery.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
        <div className="pt-3 border-t border-[#87CEEB]/40 dark:border-[#87CEEB]/20 space-y-2.5">
          <span className="text-[11px] text-[#2B547E] dark:text-[#B8DEF5] font-bold block">
            نماذج لبحوث ومسائل علمية جاهزة للاستعراض الفوري:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sampleQuestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedField(item.field);
                  setInputQuery(item.q);
                  handleAsk(item.q);
                }}
                className="p-3 bg-[#EAF8FF]/85 dark:bg-[#0F2747] hover:border-[#0EA5A4] border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 rounded-xl text-right text-xs text-[#12345A] dark:text-[#EAF8FF] transition flex items-center justify-between group cursor-pointer"
              >
                <span className="line-clamp-1 font-bold group-hover:text-[#0EA5A4]">{item.q}</span>
                <span className="text-[10px] text-[#4A7298] dark:text-[#84B4D6] shrink-0 mr-2">· {item.field}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Presentation */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {responseAnswer && (
        <div className="scholarly-reading-paper rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-black text-[#0D7A7A] dark:text-[#2DD4BF]">{selectedField}</span>
              <span aria-hidden="true" className="text-[#4A7298]">·</span>
              <span className="text-[#2B547E] dark:text-[#B8DEF5]">توثيق مجمع النور الأكاديمي</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 text-xs font-bold text-[#12345A] dark:text-white transition cursor-pointer"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-[#0EA5A4]" /> : <Copy className="w-3.5 h-3.5 text-[#0EA5A4]" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الإجابة'}</span>
            </button>
          </div>

          <div className="text-xs sm:text-sm text-[#12345A] dark:text-[#EAF8FF] leading-[2.15] whitespace-pre-line font-sans">
            {responseAnswer}
          </div>

          <div className="pt-4 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#2B547E] dark:text-[#B8DEF5]">
            <span>تم التأصيل بالاستناد إلى القرآن الكريم والسنة النبوية وأمهات كتب السلف</span>
            <span className="text-[#9E7818] dark:text-[#F7E7B4] font-bold">مجمع النور الإسلامي العالمي</span>
          </div>
        </div>
      )}

      <SectionDynamicItems sectionSlug="aiScholar" />
    </div>
  );
};
