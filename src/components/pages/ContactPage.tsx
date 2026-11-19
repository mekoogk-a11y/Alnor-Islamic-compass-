import React, { useState } from 'react';
import {
  Mail, Phone, MessageCircle, MapPin, Send, CheckCircle2,
  AlertCircle, Globe, ShieldCheck
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { COMPLEX_INFO } from '../../data/islamicData';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface ContactPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('general');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const whatsappNumber = COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setErrorMsg(isAr ? 'يرجى تعبئة الاسم والبريد الإلكتروني والرسالة.' : 'Please fill in your name, email, and message.');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/v1/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, department, message }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || (isAr ? 'تعذر إرسال الرسالة' : 'Submission error'));
      }
      setSentCode(json.data.trackingCode);
      setFullName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || (isAr ? 'حدث خطأ أثناء الإرسال' : 'Error sending message'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-10" dir={isRtl ? 'rtl' : 'ltr'}>
      <section className="rounded-3xl bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] text-white border border-[#87CEEB]/55 shadow-xl p-6 sm:p-10 space-y-3">
        <div className="flex items-center gap-3">
          <Sky3DIcon slug="contact" tone="sky" size="md" />
          <span className="text-xs font-bold text-[#87CEEB] flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#F7E7B4]" />
            <span>{isAr ? 'مكتب الاستقبال والتواصل الرسمي' : 'Official Contact & Institutional Desk'}</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white">
          {isAr ? 'تواصل مع إدارة وأقسام مجمع النور الإسلامي العالمي' : 'Contact Al Noor Global Islamic Charitable Complex'}
        </h1>
        <p className="text-xs sm:text-sm text-[#D7F1FC] max-w-2xl">
          {isAr
            ? 'نرحب باستفساراتكم حول التسجيل في مقارئ القرآن الكريم، المعهد الشرعي، الشراكات الدولية، والأعمال الخيرية وكفالة الأيتام.'
            : 'Reach out to our institutional teams regarding Quranic enrollment, Islamic sciences, international partnerships, and transparent charitable initiatives.'}
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Direct Official Channels */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sky-card-3d p-6 rounded-3xl space-y-4">
            <h2 className="text-lg font-black font-amiri text-[#12345A] dark:text-[#87CEEB] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0EA5A4]" />
              <span>{isAr ? 'قنوات الاتصال المعتمدة' : 'Verified Contact Channels'}</span>
            </h2>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('السلام عليكم ورحمة الله، أود التواصل مع إدارة مجمع النور')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/55 dark:border-[#87CEEB]/25 hover:border-[#0EA5A4] transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
              <div>
                <div className="text-xs text-[#4A7298] dark:text-[#B8DEF5]">{isAr ? 'خدمة المستفيدين (واتساب)' : 'Official WhatsApp Desk'}</div>
                <div className="text-sm font-black font-mono text-[#12345A] dark:text-white" dir="ltr">{COMPLEX_INFO.phones.whatsapp}</div>
              </div>
            </a>

            <a
              href={`tel:${COMPLEX_INFO.phones.mobile.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-3 p-4 rounded-2xl bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/55 dark:border-[#87CEEB]/25 hover:border-[#0EA5A4] transition-colors"
            >
              <Phone className="w-5 h-5 text-[#0EA5A4] shrink-0" />
              <div>
                <div className="text-xs text-[#4A7298] dark:text-[#B8DEF5]">{isAr ? 'الهاتف المباشر' : 'Direct Institutional Phone'}</div>
                <div className="text-sm font-black font-mono text-[#12345A] dark:text-white" dir="ltr">{COMPLEX_INFO.phones.mobile}</div>
              </div>
            </a>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/55 dark:border-[#87CEEB]/25">
              <Mail className="w-5 h-5 text-[#0EA5A4] shrink-0" />
              <div>
                <div className="text-xs text-[#4A7298] dark:text-[#B8DEF5]">{isAr ? 'البريد الرسمي للمجمع' : 'Official Institutional Email'}</div>
                <div className="text-xs sm:text-sm font-mono font-bold text-[#12345A] dark:text-white">{COMPLEX_INFO.officialEmail}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/55 dark:border-[#87CEEB]/25">
              <MapPin className="w-5 h-5 text-[#0EA5A4] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-[#4A7298] dark:text-[#B8DEF5]">{isAr ? 'المقر والنطاق العالمي' : 'Headquarters & Reach'}</div>
                <div className="text-xs text-[#12345A] dark:text-[#EAF8FF] leading-relaxed">{COMPLEX_INFO.headquarters}</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                {isAr ? 'بوابة تسجيل الطلاب' : 'Student Registration'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('internationalRelations')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#EAF8FF] dark:bg-[#0F2747] text-[#12345A] dark:text-[#87CEEB] border border-[#87CEEB]/55 dark:border-[#87CEEB]/25 text-xs font-bold cursor-pointer flex items-center justify-center gap-1 hover:border-[#0EA5A4]"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{isAr ? 'الشراكات الدولية' : 'Partnerships'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Message Form */}
        <div className="lg:col-span-7 sky-card-3d p-6 sm:p-8 rounded-3xl space-y-5">
          <h2 className="text-xl font-black font-amiri text-[#12345A] dark:text-[#87CEEB] border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-3">
            {isAr ? 'أرسل رسالة إلى إدارة المجمع' : 'Send a Direct Message'}
          </h2>

          {sentCode ? (
            <div className="p-6 rounded-2xl bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#0EA5A4]/50 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#0EA5A4] mx-auto" />
              <h3 className="text-lg font-black font-amiri text-[#12345A] dark:text-white">
                {isAr ? 'تم إرسال رسالتكم إلى الإدارة بنجاح' : 'Your Message Has Been Sent'}
              </h3>
              <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                {isAr ? 'رمز المتابعة:' : 'Tracking Code:'}{' '}
                <span className="font-mono font-black text-[#12345A] dark:text-[#F7E7B4]">{sentCode}</span>
              </p>
              <button
                type="button"
                onClick={() => setSentCode(null)}
                className="px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                {isAr ? 'إرسال رسالة جديدة' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-800 dark:text-rose-200 flex items-center gap-2 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#12345A] dark:text-white block">
                    {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#12345A] dark:text-white block">
                    {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#12345A] dark:text-white block">
                  {isAr ? 'القسم المختص' : 'Target Department'}
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-white"
                >
                  <option value="general">{isAr ? 'الإدارة العامة والعلاقات' : 'General Administration'}</option>
                  <option value="quran">{isAr ? 'مجمع القرآن الكريم والأكاديمية' : 'Quran Complex & Academy'}</option>
                  <option value="charity">{isAr ? 'المركز الخيري وكفالة الأيتام' : 'Charitable Center & Orphans'}</option>
                  <option value="research">{isAr ? 'مركز البحوث والمكتبة' : 'Research Center & Library'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#12345A] dark:text-white block">
                  {isAr ? 'نص الرسالة *' : 'Message *'}
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-3 rounded-2xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-60 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال الرسالة' : 'Send Inquiry')}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <SectionDynamicItems sectionSlug="contact" />
    </div>
  );
};
