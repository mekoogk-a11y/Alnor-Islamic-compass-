import React, { useState } from 'react';
import { 
  HelpCircle, Search, MessageCircle, Phone, BookOpen, 
  Sparkles, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft,
  ChevronDown, Heart, Send, Globe, Users, ExternalLink, Clock
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface InquiryFaq {
  id: string;
  questionAr: string;
  questionEn: string;
  category: 'faith' | 'quran' | 'prophet' | 'worship' | 'morals' | 'science';
  categoryLabelAr: string;
  answerAr: string;
  answerEn: string;
  quranProof: string;
  reference: string;
}

const DISCOVER_ISLAM_FAQS: InquiryFaq[] = [
  {
    id: 'faq-god-concept',
    questionAr: 'ما هو مفهوم الإله (الله) في الإسلام؟ وما الفرق بينه وبين سائر المعتقدات؟',
    questionEn: 'What is the concept of God (Allah) in Islam, and how does it differ from other faiths?',
    category: 'faith',
    categoryLabelAr: 'العقيدة والتوحيد',
    answerAr: 'الله في الإسلام هو الإله الواحد الأحد، الفرد الصمد، خالق الكون ومدبره، ليس كمثله شيء، لم يلد ولم يولد ولم يكن له كفواً أحد. لا يتجسد في صورة بشر، ولا يحتاج إلى وسطاء أو شركاء، وهو قريب من عباده يسمع دعاءهم ويغفر ذنوبهم إذا تابوا إليه.',
    answerEn: 'Allah is the One and Only Supreme Creator, Sustainer, and Lord of the universe. He is without partners, children, or equal. He does not take human form, nor does He need intermediaries. He is Omnipotent, Merciful, and closer to each person than their own jugular vein.',
    quranProof: '﴿قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ﴾',
    reference: 'سورة الإخلاص [112: 1-4]'
  },
  {
    id: 'faq-purpose-life',
    questionAr: 'ما هي الغاية من خلق الإنسان ووجوده في هذه الحياة الدنيا؟',
    questionEn: 'What is the ultimate purpose of human creation and existence in this earthly life?',
    category: 'faith',
    categoryLabelAr: 'فلسفة الوجود والغاية',
    answerAr: 'غاية خلق الإنسان هي معرفة الله تعالى وعبادته باختياره، وعمارة الأرض بالعدل والإحسان، والنجاح في الاختبار الدنيوي للفوز برضوان الله ونعيم الجنة الأبدي. الحياة الدنيا ليست عبثاً، بل هي دار ممر ومزرعة للآخرة.',
    answerEn: 'The purpose of life is to recognize and worship the Creator through free will, to live with moral righteousness, and to act as responsible custodians on earth. Earthly life is an intentional test designed to prepare our souls for eternal bliss in Paradise.',
    quranProof: '﴿وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ﴾',
    reference: 'سورة الذاريات [51: 56]'
  },
  {
    id: 'faq-prophet-muhammad',
    questionAr: 'من هو النبي محمد ﷺ وما هي رسالته للإنسانية جمعاء؟',
    questionEn: 'Who is Prophet Muhammad ﷺ and what was his universal message to humanity?',
    category: 'prophet',
    categoryLabelAr: 'السيرة النبوية والرسل',
    answerAr: 'هو خاتم الأنبياء والمرسلين، أرسله الله رحمة للعالمين ليتمم مكارم الأخلاق، ويدعو الناس إلى التوحيد ونبذ عبادة الأوثان والخرافات، وإقامة مجتمع يسوده العدل والمساواة بين جميع الأعراق والأجناس.',
    answerEn: 'Prophet Muhammad ﷺ is the final messenger in the line of prophets that includes Abraham, Moses, and Jesus. Born in Makkah in 570 CE, he lived with impeccable honesty and brought a revolutionary message of racial equality, justice, charity, and pure monotheism.',
    quranProof: '﴿وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ﴾',
    reference: 'سورة الأنبياء [21: 107]'
  },
  {
    id: 'faq-women-status',
    questionAr: 'كيف كرّم الإسلام المرأة وما هي حقوقها الإنسانية والمدنية؟',
    questionEn: 'How does Islam honor women, and what are their spiritual, legal, and financial rights?',
    category: 'morals',
    categoryLabelAr: 'حقوق الإنسان والمجتمع',
    answerAr: 'كرّم الإسلام المرأة وجعلها شقيقة الرجل في التكليف والأجر والكرامة الإنسانية. منحها ذمة مالية مستقلة كاملة، وحق التملك والتجارة والإرث والتعليم والزواج برضاها، وجعل بر الوالدة أعظم أسباب دخول الجنة.',
    answerEn: 'Islam elevated women by declaring them spiritually and morally equal partners to men. Over 1,400 years ago, Islam granted women independent financial rights, property ownership, the right to inherit, choose their spouse, and pursue education, while honoring motherhood as the highest sacred virtue.',
    quranProof: '﴿مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً﴾',
    reference: 'سورة النحل [16: 97]'
  },
  {
    id: 'faq-quran-authenticity',
    questionAr: 'كيف نثق بأن القرآن الكريم هو نفسه الذي نزل على النبي محمد ﷺ دون تغيير؟',
    questionEn: 'How can we be certain that the Quran today is identical to what was originally revealed?',
    category: 'quran',
    categoryLabelAr: 'علوم القرآن والتوثيق',
    answerAr: 'حُفظ القرآن الكريم بطريقتين متزامنتين فريدتين: التواتر الصوتي الشفهي عبر ملايين الحفاظ في كل جيل بسند متصل، والتدوين الكتابي الفوري في عهد النبي ﷺ وجمعه في المصحف الإمام في عهد الصحابة، وتطابق المخطوطات القديمة كلياً مع المصاحف المتداولة اليوم.',
    answerEn: 'The Quran was uniquely preserved through dual simultaneous mechanisms: mass oral memorization passed down verbatim through unbroken chains of reciters, alongside immediate written documentation compiled into standard manuscripts. Ancient manuscripts in Birmingham, Istanbul, and Tashkent match modern texts letter-for-letter.',
    quranProof: '﴿إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ﴾',
    reference: 'سورة الحجر [15: 9]'
  },
  {
    id: 'faq-science-faith',
    questionAr: 'ما هي نظرة الإسلام للعلم والبحث الكوني؟ هل هناك تعارض بين الدين والعلم؟',
    questionEn: 'What is Islam\'s perspective on scientific inquiry and the study of the universe?',
    category: 'science',
    categoryLabelAr: 'العلم والكون',
    answerAr: 'لا تعارض مطلقاً بين صحيح الدين وصريح العلم؛ بل إن القرآن يحث في مئات الآيات على النظر في الآفاق والتفكر في نشأة الكون والأجنة والبحار، وكانت الحضارة الإسلامية مهداً لعلم الجبر والبصريات والطب والفلك.',
    answerEn: 'There is zero contradiction between authentic revelation and established scientific truths. The Quran repeatedly urges humanity to observe celestial bodies, embryology, geology, and nature, sparking the Golden Age of scientific discoveries in medicine, mathematics, and astronomy.',
    quranProof: '﴿قُلِ انظُرُوا مَاذَا فِي السَّمَاوَاتِ وَالْأَرْضِ﴾',
    reference: 'سورة يونس [10: 101]'
  }
];

interface DiscoverIslamPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const DiscoverIslamPage: React.FC<DiscoverIslamPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(DISCOVER_ISLAM_FAQS[0].id);
  const [customQuestion, setCustomQuestion] = useState('');
  const [questionSent, setQuestionSent] = useState(false);

  const filteredFaqs = DISCOVER_ISLAM_FAQS.filter((faq) => {
    const matchesCat = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesQuery = 
      faq.questionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answerAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answerEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    setQuestionSent(true);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16">
      
      {/* Hero Banner: Discover Islam / Ask About Islam */}
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-12 shadow-2xl border border-[#D4AF37]/35 bg-gradient-to-br from-[#070D1E] via-[#0B132B] to-[#040814] text-white">
        <div className="absolute inset-0 bg-noor-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#BAE6FD] text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>بوابة الحوار والتعريف بالإسلام • Discover Islam & Scholarly Q&A</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-amiri text-white leading-tight">
            اسأل عن الإسلام – هدايةٌ بالدليل والبرهان
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            مرحباً بك في مركز الإجابة الموثقة لمجمع النور الإسلامي العالمي. هنا تجد إجابات رصينة وشافية عن أصول الإسلام، والقرآن، والرسالة المحمدية، مع إمكانية التواصل المباشر مع نخبة من العلماء والدعاة بعدة لغات عالمية.
          </p>

          {/* Quick Help Contacts Bar */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <a
              href="https://wa.me/249904499914?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85%20%D9%88%D8%A7%D9%84%D8%AD%D9%88%D8%A7%D8%B1%20%D9%85%D8%B9%20%D8%A3%D8%AD%D8%AF%20%D8%A7%D9%84%D8%AF%D8%B9%D8%A7%D8%A9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>محادثة فورية مع داعية (واتساب: +249904499914)</span>
            </a>

            <button
              onClick={() => onNavigate('newMuslims')}
              className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-white/10 text-slate-200 text-xs font-bold transition flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span>دليل المهتدين الجدد</span>
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <section className="rounded-2xl border border-white/10 bg-[#0B132B]/90 p-4 sm:p-6 shadow-xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مسألة أو سؤال (التوحيد، القرآن، المرأة، العدل، الإعجاز)..."
              className={`w-full py-2.5 rounded-xl bg-[#070D1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] ${
                isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'
              }`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'جميع الموضوعات' },
              { id: 'faith', label: 'العقيدة والتوحيد' },
              { id: 'quran', label: 'القرآن الكريم' },
              { id: 'prophet', label: 'النبي والرسل' },
              { id: 'morals', label: 'الأخلاق والحقوق' },
              { id: 'science', label: 'العلم والكون' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition border ${
                  selectedCategory === cat.id
                    ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37] shadow-sm'
                    : 'bg-[#070D1E] text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQ Answers (With Academic & Quranic Citations) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black font-amiri text-white">
            الأسئلة الأكثر طرحاً مع الإجابات المعتمدة ({filteredFaqs.length})
          </h2>
          <span className="text-xs text-slate-400">توثيق علمي متكامل</span>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-white/10 bg-[#0B132B]/80 overflow-hidden transition-all shadow-md"
              >
                <button
                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] font-bold text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 inline-block">
                      {faq.categoryLabelAr}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                      {faq.questionAr}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans" dir="ltr">
                      {faq.questionEn}
                    </p>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-[#D4AF37] shrink-0 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="p-5 pt-0 space-y-4 border-t border-white/5 animate-fade-in text-slate-200">
                    
                    {/* Arabic Answer */}
                    <div className="space-y-2 pt-4">
                      <h4 className="text-xs font-bold text-[#D4AF37]">الجواب العلمي المعتمد:</h4>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                        {faq.answerAr}
                      </p>
                    </div>

                    {/* English Translation of Answer */}
                    <div className="space-y-1 p-3.5 rounded-xl bg-[#070D1E] border border-white/5 text-xs text-slate-300" dir="ltr">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">English Explanation:</span>
                      <p className="leading-relaxed">{faq.answerEn}</p>
                    </div>

                    {/* Quranic Proof Callout */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-r-4 border-[#D4AF37] space-y-1">
                      <p className="font-amiri text-base sm:text-lg text-[#F3E8CB] font-bold">
                        {faq.quranProof}
                      </p>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        {faq.reference}
                      </span>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Direct Scholar Question Form */}
      <section className="rounded-3xl border border-[#D4AF37]/30 bg-[#0B132B]/90 p-6 sm:p-10 shadow-2xl space-y-6 backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-bold">
            <Send className="w-3.5 h-3.5" />
            <span>نافذة الاستفسار المباشر</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-amiri text-white">
            لم تجد إجابة لسؤالك؟ أرسل استفسارك مباشرة لهيئة العلماء والدعاة
          </h3>
          <p className="text-xs text-slate-400">
            يتولى فريق من الباحثين الشرعيين والمترجمين المعتمدين مراجعة سؤالك والرد عليك بخصوصية تامة.
          </p>
        </div>

        {questionSent ? (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">تم استلام استفسارك بنجاح!</h4>
            <p className="text-xs text-slate-300">
              سيقوم الباحث المختص بإعداد الإجابة الموثقة وإرسالها إليك. يمكنك أيضاً متابعة الإجابة فورياً عبر واتساب المجمع: +249904499914.
            </p>
            <button
              onClick={() => {
                setQuestionSent(false);
                setCustomQuestion('');
              }}
              className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-bold"
            >
              إرسال سؤال آخر
            </button>
          </div>
        ) : (
          <form onSubmit={handleAskQuestion} className="space-y-4">
            <textarea
              rows={4}
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="اكتب سؤالك أو موضوع استفسارك هنا بكل وضوح..."
              className="w-full p-4 rounded-2xl bg-[#070D1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              required
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>خصوصية تامة، وأمانة علمية موثقة بنصوص الكتاب والسنة</span>
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={`https://wa.me/249904499914?text=${encodeURIComponent(
                    `السلام عليكم، لدي استفسار عن الإسلام: ${customQuestion || 'أود التواصل مع داعية'}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>إرسال عبر الواتساب</span>
                </a>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-bold text-xs shadow-md"
                >
                  إرسال الاستفسار
                </button>
              </div>
            </div>
          </form>
        )}
      </section>

    </div>
  );
};
