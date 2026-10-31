import React, { useState } from 'react';
import { 
  MessageSquare, HelpCircle, CheckCircle, Search, 
  ThumbsUp, ShieldCheck, User, Sparkles 
} from 'lucide-react';
import { COMMUNITY_QUESTIONS } from '../../data/hadithAndScholarsData';
import { CommunityQuestion, NavigationPage } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface CommunityPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = () => {
  const { user } = useAuth();
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
      authorCountry: user?.country || 'المملكة العربية السعودية',
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
    <div className="space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-900/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
            <MessageSquare className="w-4 h-4" />
            <span>الملتقى العلمي والأسئلة الشرعية المعتمدة • مجمع النور</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            مجتمعٌ إسلامي معرفي منضبط يجيب فيه كبار العلماء
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            منصة للتواصل العلمي الهادف، تجمع طلاب العلم والباحثين مع نخبة من العلماء للإجابة عن المسائل الفقهية والتربوية والقرآنية بأمانة علمية وتوثيق شرعي.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setIsAsking(!isAsking)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-lg shadow-amber-500/10 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{isAsking ? 'إغلاق نموذج السؤال' : 'طرح استفسار على اللجنة العلمية'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ask Question Form Section */}
      {isAsking && (
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              نموذج إرسال استفسار شرعي للهيئة الاستشارية
            </h3>
            <span className="text-xs text-slate-400">مجاناً وبسرية تامة</span>
          </div>

          {submitSuccess ? (
            <div className="p-4 bg-emerald-950 border border-emerald-600 text-emerald-200 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-bold">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>تم إرسال سؤالك إلى اللجنة العلمية للمجمع بنجاح! ستتم مراجعته والإجابة عليه قريباً.</span>
            </div>
          ) : (
            <form onSubmit={handleAskSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">عنوان السؤال المختصر</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: حكم السهو في تكبيرات الجنازة"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">القسم الشرعي</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="القرآن الكريم والتجويد">القرآن الكريم والتجويد</option>
                    <option value="الحديث الشريف">الحديث الشريف وعلومه</option>
                    <option value="الوقف والمعاملات">الوقف والمعاملات المالية</option>
                    <option value="فقه العبادات">فقه العبادات والأسرة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">تفاصيل السؤال وحيثيات المسألة</label>
                <textarea
                  rows={4}
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="اكتب تفاصيل السؤال بوضوح وأمانة ليتمكن أصحاب الفضيلة من تصور المسألة بدقة..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl transition shadow-md shadow-amber-500/20"
              >
                إرسال السؤال للاعتماد العلمي
              </button>
            </form>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الأسئلة المجاب عنها..."
            className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs no-scrollbar">
          <span className="text-slate-400 ml-1 whitespace-nowrap">التصنيف:</span>
          {[
            { id: 'all', label: 'الكل' },
            { id: 'القرآن الكريم والتجويد', label: 'القرآن والتجويد' },
            { id: 'الحديث الشريف', label: 'الحديث الشريف' },
            { id: 'الوقف والمعاملات', label: 'الوقف والمعاملات' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
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
            className="bg-slate-900/90 border border-slate-800 hover:border-emerald-700/60 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 transition duration-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {q.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {q.authorName} ({q.authorCountry})
                </span>
                <span className="text-xs text-slate-500">• {q.createdAt}</span>
              </div>

              <div className="flex items-center gap-2">
                {q.isVerifiedAnswer ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                    <CheckCircle className="w-3 h-3" />
                    تمت الإجابة والاعتماد
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/60">
                    قيد المراجعة العلمية
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">{q.questionTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{q.questionBody}</p>
            </div>

            {/* Answer Section */}
            {q.isVerifiedAnswer && q.verifiedAnswerBy && q.verifiedAnswerText && (
              <div className="p-5 bg-slate-950/90 rounded-2xl border border-emerald-900/60 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-amber-300">إجابة معتمدة: {q.verifiedAnswerBy}</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">مجمع النور العالمي</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-[2.1] text-justify">
                  {q.verifiedAnswerText}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
