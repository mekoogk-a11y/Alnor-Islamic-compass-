import React, { useState } from 'react';
import {
  MessageSquare, HelpCircle, CheckCircle, Search,
  ShieldCheck, User, Sparkles
} from 'lucide-react';
import { COMMUNITY_QUESTIONS } from '../../data/hadithAndScholarsData';
import { CommunityQuestion, NavigationPage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface CommunityPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = () => {
  const { user } = useAuth();
  const { isRtl } = useLanguage();
  const [questions, setQuestions] = useState<CommunityQuestion[]>(COMMUNITY_QUESTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAsking, setIsAsking] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState('القرآن الكريم والتجويد');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      return (
        q.questionTitle.toLowerCase().includes(term) ||
        q.questionBody.toLowerCase().includes(term) ||
        (q.verifiedAnswerBy && q.verifiedAnswerBy.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const newQ: CommunityQuestion = {
      id: `CQ-${Date.now()}`,
      questionTitle: newTitle.trim(),
      questionBody: newBody.trim(),
      authorName: user?.name || 'طالب علم النور',
      authorCountry: user?.country || 'العالم الإسلامي',
      category: newCategory,
      createdAt: 'الآن',
      answersCount: 0,
      isVerifiedAnswer: false,
      tags: ['استفسار جديد', newCategory],
    };

    setQuestions([newQ, ...questions]);
    setNewTitle('');
    setNewBody('');
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsAsking(false);
    }, 3000);
  };

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sky-Blue 3D Header Banner */}
      <div className="bg-gradient-to-br from-[#12345A] via-[#0E4466] to-[#0EA5A4] border border-[#87CEEB]/55 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="hidden sm:block shrink-0">
              <Sky3DIcon slug="community" tone="turquoise" size="lg" />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-[#F7E7B4] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#87CEEB]" />
                <span>الملتقى العلمي والأسئلة الشرعية المعتمدة · مجمع النور</span>
              </p>

              <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white leading-tight">
                مجتمعٌ إسلامي معرفي منضبط يجيب فيه كبار العلماء
              </h1>

              <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed">
                منصة للتواصل العلمي الهادف، تجمع طلاب العلم والباحثين مع نخبة من العلماء للإجابة عن المسائل الفقهية والتربوية والقرآنية بأمانة علمية وتوثيق شرعي.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAsking(!isAsking)}
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{isAsking ? 'إغلاق نموذج السؤال' : 'طرح استفسار على اللجنة العلمية'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ask Question Form Section */}
      {isAsking && (
        <div className="sky-card-3d rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-3">
            <h3 className="text-base font-black text-[#12345A] dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0EA5A4]" />
              <span>نموذج إرسال استفسار شرعي للهيئة الاستشارية</span>
            </h3>
            <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-bold">مجاناً وبسرية تامة</span>
          </div>

          {submitSuccess ? (
            <div className="p-4 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#0EA5A4] text-[#12345A] dark:text-[#EAF8FF] rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-bold">
              <CheckCircle className="w-5 h-5 text-[#0EA5A4] shrink-0" />
              <span>تم إرسال سؤالك إلى اللجنة العلمية للمجمع بنجاح! ستتم مراجعته والإجابة عليه قريباً.</span>
            </div>
          ) : (
            <form onSubmit={handleAskSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">عنوان السؤال المختصر</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: حكم السهو في تكبيرات الجنازة"
                    className="w-full px-3.5 py-2.5 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                  />
                </div>
                <div>
                  <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">القسم الشرعي</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                  >
                    <option value="القرآن الكريم والتجويد">القرآن الكريم والتجويد</option>
                    <option value="الحديث الشريف">الحديث الشريف وعلومه</option>
                    <option value="الوقف والمعاملات">الوقف والمعاملات المالية</option>
                    <option value="فقه العبادات">فقه العبادات والأسرة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">تفاصيل السؤال وحيثيات المسألة</label>
                <textarea
                  rows={4}
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="اكتب تفاصيل السؤال بوضوح وأمانة ليتمكن أصحاب الفضيلة من تصور المسألة بدقة..."
                  className="w-full p-3.5 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold rounded-xl transition shadow-md cursor-pointer"
              >
                إرسال السؤال للاعتماد العلمي
              </button>
            </form>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="sky-glass-panel rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الأسئلة المجاب عنها..."
            className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl text-[#12345A] dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#0EA5A4]"
          />
          <Search className="w-4 h-4 text-[#0EA5A4] absolute right-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs no-scrollbar">
          <span className="text-[#2B547E] dark:text-[#B8DEF5] font-bold ml-1 whitespace-nowrap">التصنيف:</span>
          {[
            { id: 'all', label: 'الكل' },
            { id: 'القرآن الكريم والتجويد', label: 'القرآن والتجويد' },
            { id: 'الحديث الشريف', label: 'الحديث الشريف' },
            { id: 'الوقف والمعاملات', label: 'الوقف والمعاملات' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4] shadow-sm'
                  : 'bg-white/80 dark:bg-[#0F2747] border border-[#87CEEB]/50 text-[#12345A] dark:text-[#B8DEF5] hover:border-[#0EA5A4]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="sky-card-3d rounded-3xl p-6 sm:p-7 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-[#2B547E] dark:text-[#B8DEF5]">
                <span className="font-bold text-[#0D7A7A] dark:text-[#2DD4BF]">{q.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#0EA5A4]" />
                  {q.authorName} ({q.authorCountry})
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#4A7298] dark:text-[#84B4D6]">{q.createdAt}</span>
              </div>

              <div>
                {q.isVerifiedAnswer ? (
                  <span className="flex items-center gap-1 text-xs text-[#0D7A7A] dark:text-[#2DD4BF] font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>تمت الإجابة والاعتماد</span>
                  </span>
                ) : (
                  <span className="text-xs text-[#9E7818] dark:text-[#F7E7B4] font-bold">
                    قيد المراجعة العلمية
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-[#12345A] dark:text-white mb-1.5 font-amiri">{q.questionTitle}</h3>
              <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">{q.questionBody}</p>
            </div>

            {/* Answer Section */}
            {q.isVerifiedAnswer && q.verifiedAnswerBy && q.verifiedAnswerText && (
              <div className="scholarly-reading-paper p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0EA5A4]" />
                    <span className="font-black text-[#12345A] dark:text-[#F7E7B4]">إجابة معتمدة: {q.verifiedAnswerBy}</span>
                  </div>
                  <span className="text-[#4A7298] dark:text-[#B8DEF5] text-[11px]">مجمع النور العالمي</span>
                </div>
                <p className="text-xs sm:text-sm text-[#12345A] dark:text-[#EAF8FF] leading-[2.05] text-justify">
                  {q.verifiedAnswerText}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <SectionDynamicItems sectionSlug="community" />
    </div>
  );
};
