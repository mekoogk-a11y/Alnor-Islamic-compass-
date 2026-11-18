import React, { useState } from 'react';
import {
  Globe2, Building2, GraduationCap, HeartHandshake, Send,
  CheckCircle2, AlertCircle, Sparkles, MessageCircle, Compass
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface InternationalRelationsPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const InternationalRelationsPage: React.FC<InternationalRelationsPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [orgName, setOrgName] = useState('');
  const [country, setCountry] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [cooperationType, setCooperationType] = useState<'educational' | 'charitable' | 'research' | 'donor'>('educational');
  const [proposal, setProposal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ trackingCode: string } | null>(null);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!orgName.trim() || !contactName.trim() || !email.trim() || !proposal.trim()) {
      setSubmitError(isAr ? 'يرجى إكمال الحقول الأساسية لنموذج الشراكة.' : 'Please complete all required partnership fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/partnerships/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName: orgName,
          country,
          contactName,
          email,
          cooperationType,
          proposal,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || (isAr ? 'تعذر إرسال الطلب حالياً' : 'Submission failed'));
      }
      setSubmitResult({ trackingCode: json.data.trackingCode });
      setOrgName('');
      setCountry('');
      setContactName('');
      setEmail('');
      setProposal('');
    } catch (err: any) {
      setSubmitError(err.message || (isAr ? 'حدث خطأ غير متوقع' : 'Unexpected error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <section className="rounded-3xl bg-gradient-to-l from-[#064E3B] to-[#022C22] text-[#FAF8F2] border border-[#C8A24A]/50 shadow-xl p-6 sm:p-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#022C22] border border-[#C8A24A]/50 text-xs font-bold text-[#E5C97B]">
          <Globe2 className="w-4 h-4" />
          <span>{isAr ? 'المبنى 08 · مركز العلاقات والشراكات الدولية' : 'Building 08 · International Relations Center'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white leading-tight">
          {isAr
            ? 'مركز العلاقات الدولية والتعاون مع المؤسسات الإسلامية والخيرية'
            : 'International Relations, Institutional Partnerships & Global Cooperation'}
        </h1>

        <p className="text-xs sm:text-sm text-[#D1E7DD] leading-relaxed max-w-3xl">
          {isAr
            ? 'نبني جسور التعاون العلمي والخيري مع الجامعات الإسلامية والمراكز القرآنية والهيئات الإنسانية المعتمدة، وندير برامج التعريف الحضاري بالإسلام ورعاية المهتدين الجدد بلغات العالم.'
            : 'Building academic and humanitarian partnerships with Islamic universities, Quranic institutes, and charitable organizations worldwide, alongside global dialogue and new Muslim support.'}
        </p>

        <div className="flex flex-wrap gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('discoverIslam')}
            className="px-4 py-2 rounded-xl bg-[#C8A24A] text-[#022C22] text-xs font-black flex items-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isAr ? 'بوابة اسأل عن الإسلام' : 'Ask About Islam Portal'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('newMuslims')}
            className="px-4 py-2 rounded-xl bg-[#FAF8F2]/10 hover:bg-[#FAF8F2]/20 border border-[#C8A24A]/40 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#E5C97B]" />
            <span>{isAr ? 'رعاية المهتدين الجدد' : 'New Muslims Academy'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('noorAmbassador')}
            className="px-4 py-2 rounded-xl bg-[#FAF8F2]/10 hover:bg-[#FAF8F2]/20 border border-[#C8A24A]/40 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#E5C97B]" />
            <span>{isAr ? 'برنامج سفير النور العالمي' : 'Noor Global Ambassador'}</span>
          </button>
        </div>
      </section>

      {/* Cooperation Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            icon: GraduationCap,
            titleAr: 'الشراكات التعليمية والمقارئ',
            titleEn: 'Educational & Quranic Cooperation',
            descAr: 'توأمة المناهج القرآنية، وتبادل المقرئين المجازين، وإتاحة برامج الأكاديمية لمراكز التحفيظ حول العالم.',
            descEn: 'Curriculum exchange, certified Qari mentorship networks, and digital classroom access for partner schools.',
          },
          {
            icon: HeartHandshake,
            titleAr: 'التنسيق الخيري والإنساني',
            titleEn: 'Charitable & Humanitarian Coordination',
            descAr: 'التعاون الموثق في رعاية الأيتام وطلاب القرآن والمشاريع الإغاثية عبر قنوات شفافة ومعتمدة.',
            descEn: 'Transparent institutional coordination on orphan care, student stipends, and community relief initiatives.',
          },
          {
            icon: Building2,
            titleAr: 'علاقات المانحين والمؤسسات',
            titleEn: 'Donor & Institutional Liaison',
            descAr: 'تقارير دورية واضحة واتفاقيات تفاهم رسمية مع الأوقاف والهيئات الداعمة للتعليم الإسلامي.',
            descEn: 'Structured Memoranda of Understanding and institutional reporting channels with endowments and philanthropic partners.',
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 space-y-2.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-[#E5C97B] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black font-amiri text-[#0F2920] dark:text-white">
                {isAr ? card.titleAr : card.titleEn}
              </h2>
              <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
                {isAr ? card.descAr : card.descEn}
              </p>
            </div>
          );
        })}
      </section>

      {/* Partnership Application Form */}
      <section className="rounded-3xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/35 p-6 sm:p-10 shadow-md max-w-4xl mx-auto space-y-6">
        <div className="space-y-1 border-b border-[#DDD6C7] dark:border-[#C8A24A]/25 pb-4">
          <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#064E3B] dark:text-[#E5C97B]">
            {isAr ? 'نموذج تقديم طلب شراكة أو تعاون مؤسسي' : 'Institutional Partnership Application Form'}
          </h2>
          <p className="text-xs text-[#38554B] dark:text-[#D1E7DD]">
            {isAr
              ? 'ترسل الطلبات مباشرة إلى مكتب العلاقات الدولية بالمجمع للمراجعة الرسمية والتواصل معكم.'
              : 'Submitted proposals are logged directly with the International Relations Directorate for official review.'}
          </p>
        </div>

        {submitResult ? (
          <div className="p-6 rounded-2xl bg-[#ECFDF5] dark:bg-[#022C22] border border-[#047857]/40 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#047857] dark:text-[#34D399] mx-auto" />
            <h3 className="text-lg font-black font-amiri text-[#064E3B] dark:text-white">
              {isAr ? 'تم استلام طلب الشراكة بنجاح' : 'Partnership Application Received'}
            </h3>
            <p className="text-xs text-[#38554B] dark:text-[#D1E7DD]">
              {isAr ? 'الرقم المرجعي للمتابعة:' : 'Reference Tracking Code:'}{' '}
              <span className="font-mono font-black text-[#064E3B] dark:text-[#E5C97B]">{submitResult.trackingCode}</span>
            </p>
            <button
              type="button"
              onClick={() => setSubmitResult(null)}
              className="px-4 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
            >
              {isAr ? 'تقديم طلب آخر' : 'Submit Another Request'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 flex items-center gap-2 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#0F2920] dark:text-[#FAF8F2] block">
                  {isAr ? 'اسم المؤسسة أو الجمعية *' : 'Institution / Organization Name *'}
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/35 text-[#0F2920] dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F2920] dark:text-[#FAF8F2] block">
                  {isAr ? 'الدولة والمدينة' : 'Country & City'}
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/35 text-[#0F2920] dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F2920] dark:text-[#FAF8F2] block">
                  {isAr ? 'اسم الممثل المسؤول *' : 'Representative Name *'}
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/35 text-[#0F2920] dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F2920] dark:text-[#FAF8F2] block">
                  {isAr ? 'البريد الإلكتروني الرسمي *' : 'Official Email *'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/35 text-[#0F2920] dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0F2920] dark:text-[#FAF8F2] block">
                {isAr ? 'مجال التعاون المقترح' : 'Cooperation Area'}
              </label>
              <select
                value={cooperationType}
                onChange={(e) => setCooperationType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/35 text-[#0F2920] dark:text-white"
              >
                <option value="educational">{isAr ? 'شراكة تعليمية ومقارئ قرآنية' : 'Educational & Quranic Partnership'}</option>
                <option value="charitable">{isAr ? 'شراكة خيرية وإنسانية وأوقاف' : 'Charitable & Humanitarian Partnership'}</option>
                <option value="research">{isAr ? 'تعاون بحثي ونشر علمي' : 'Academic Research & Publishing'}</option>
                <option value="donor">{isAr ? 'رعاية مؤسسية وعلاقات مانحين' : 'Institutional Sponsorship & Donor Liaison'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0F2920] dark:text-[#FAF8F2] block">
                {isAr ? 'تفاصيل مقترح التعاون *' : 'Cooperation Proposal Details *'}
              </label>
              <textarea
                rows={4}
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/35 text-[#0F2920] dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-[#064E3B] hover:bg-[#047857] dark:bg-[#C8A24A] dark:hover:bg-[#DFBE68] text-white dark:text-[#022C22] font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? (isAr ? 'جاري الإرسال...' : 'Submitting...') : (isAr ? 'إرسال طلب الشراكة' : 'Submit Partnership Application')}</span>
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
