import React, { useState } from 'react';
import {
  Mail, Send, CheckCircle2, AlertCircle, MapPin, Sparkles, RefreshCw,
  Phone, MessageCircle
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { COMPLEX_INFO } from '../../data/islamicData';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface RegisterPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = () => {
  const { t, isRtl } = useLanguage();

  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('السعودية');
  const [track, setTrack] = useState('مسار الحفظ المتقن الشامل');
  const [level, setLevel] = useState('مبتدئ (من قصار السور)');
  const [preferredTime, setPreferredTime] = useState('الفترة المسائية (بعد العصر / المغرب)');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !email.trim()) {
      setErrorMessage('الرجاء إدخال الاسم الكامل والبريد الإلكتروني');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          email,
          country,
          track,
          level,
          preferredTime,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'تعذر إرسال طلب التسجيل');
      }

      setRegistrationId(data.registrationId || `REG-${Date.now().toString().slice(-6)}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquiryName('');
      setInquiryEmail('');
      setInquirySubject('');
      setInquiryMessage('');
    }, 1000);
  };

  return (
    <div className="space-y-10" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Sky-Blue 3D Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#12345A] via-[#0E4466] to-[#0EA5A4] border border-[#87CEEB]/55 rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 text-center text-white">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center space-y-3">
          <Sky3DIcon slug="register" tone="turquoise" size="lg" />
          <p className="text-xs font-bold text-[#F7E7B4] flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#87CEEB]" />
            <span>بوابة القبول والتسجيل والتواصل المؤسسي العالمي · مجمع النور</span>
          </p>

          <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white">
            سجل الآن في الحلقات القرآنية وكلية العلوم الإسلامية
          </h1>

          <p className="text-xs sm:text-sm text-[#D7F1FC] max-w-2xl mx-auto leading-relaxed">
            نرحب بجميع طلاب العلم وحفظة القرآن من شتى بقاع الأرض. التسجيل مجاني ومتاح لجميع الأعمار بمتابعة نخبة من كبار المشايخ.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Registration Form (7 Cols) */}
        <div className="lg:col-span-7 sky-card-3d rounded-3xl p-6 sm:p-8 space-y-6 text-right">

          <div className="border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-4">
            <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#2DD4BF] block">
              استمارة الالتحاق الأكاديمي والقرآني
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#12345A] dark:text-white mt-1 font-amiri">
              بيانات الطالب والمسار المطلوب
            </h2>
          </div>

          {registrationId ? (
            <div className="p-8 bg-[#EAF8FF] dark:bg-[#0F2747] rounded-2xl border border-[#0EA5A4]/50 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#0EA5A4]/15 text-[#0EA5A4] flex items-center justify-center border border-[#0EA5A4]/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-black text-[#12345A] dark:text-white">
                تم تسجيل طلبكم بنجاح في مجمع النور!
              </h3>

              <div className="p-4 bg-white dark:bg-[#0A223D] rounded-xl border border-[#87CEEB]/50 inline-block font-mono">
                <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] block mb-1">رقم التسجيل المرجعي:</span>
                <span className="text-xl font-black text-[#0D7A7A] dark:text-[#F7E7B4] tabular-nums">{registrationId}</span>
              </div>

              <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] max-w-md mx-auto leading-relaxed">
                سيتواصل معكم منسق المقرأة أو الكلية عبر البريد الإلكتروني (<strong className="text-[#12345A] dark:text-white">{email}</strong>) خلال 24 ساعة لتحديد موعد اختبار قياس المستوى وتوزيعكم على الحلقة المناسبة.
              </p>

              <button
                type="button"
                onClick={() => {
                  setRegistrationId(null);
                  setStudentName('');
                  setEmail('');
                }}
                className="bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                تسجيل طالب آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#12345A] dark:text-[#EAF8FF] font-bold block">الاسم الثلاثي للطالب/الطالبة *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="مثال: عبد الله أحمد المنصور"
                    className="w-full bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl p-3 text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#12345A] dark:text-[#EAF8FF] font-bold block">البريد الإلكتروني الرسمي *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl p-3 text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#12345A] dark:text-[#EAF8FF] font-bold block">بلد الإقامة الحالي</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="مثال: السودان / المملكة العربية السعودية"
                    className="w-full bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl p-3 text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#12345A] dark:text-[#EAF8FF] font-bold block">المسار التعليمي المطلوب *</label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    className="w-full bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl p-3 text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                  >
                    <option value="مسار الحفظ المتقن الشامل">مسار الحفظ المتقن الشامل (للكبار والشباب)</option>
                    <option value="مسار الإجازة بالسند المتصل">مسار الإجازة بالسند المتصل (للحفظة المتقنين)</option>
                    <option value="مسار البراعم والأشبال">مسار البراعم والأشبال (الأطفال)</option>
                    <option value="مسار تصحيح التلاوة وأحكام التجويد">مسار تصحيح التلاوة وأحكام التجويد</option>
                    <option value="دبلوم كلية العلوم الإسلامية">دبلوم كلية العلوم الإسلامية (الفقه والحديث والعقيدة)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#12345A] dark:text-[#EAF8FF] font-bold block">المستوى القرآني الحالي</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl p-3 text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                  >
                    <option value="مبتدئ (من قصار السور)">مبتدئ (قصار السور وجزء عم)</option>
                    <option value="متوسط (حفظ من 5 إلى 15 جزءاً)">متوسط (حفظ من 5 إلى 15 جزءاً)</option>
                    <option value="متقدم (حفظ أكثر من 15 جزءاً)">متقدم (حفظ أكثر من 15 جزءاً)</option>
                    <option value="حافظ للقرآن كاملاً ويطلب الإجازة">حافظ للقرآن كاملاً ويطلب الإجازة</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#12345A] dark:text-[#EAF8FF] font-bold block">الفترة الزمنية المفضلة للحلقات</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl p-3 text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                  >
                    <option value="الفترة الصباحية (بعد الفجر)">الفترة الصباحية (بعد الفجر)</option>
                    <option value="الفترة المسائية (بعد العصر / المغرب)">الفترة المسائية (بعد العصر / المغرب)</option>
                    <option value="الفترة الليلية (بعد العشاء)">الفترة الليلية (بعد العشاء)</option>
                    <option value="حلقات نهاية الأسبوع المكثفة (الجمعة والسبت)">حلقات نهاية الأسبوع (الجمعة والسبت)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#12345A] dark:text-[#EAF8FF] font-bold block">ملاحظات إضافية أو خبرات حفظ سابقة (اختياري)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="أي معلومات إضافية تود إخبار المشايخ بها..."
                  className="w-full bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl p-3 text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4] resize-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#12345A] to-[#0EA5A4] hover:opacity-95 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري إرسال طلب التسجيل...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#F7E7B4]" />
                    <span>تأكيد وإرسال طلب الالتحاق</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Corporate Contact & Inquiries (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">

          <div className="sky-card-3d rounded-3xl p-6 space-y-4 text-right">
            <h3 className="text-base font-black text-[#12345A] dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0EA5A4]" />
              <span>المقر الرسمي والعناوين المعتمدة</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#0EA5A4]/45 rounded-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366]/15 text-[#128C7E] dark:text-[#25D366] flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#0D7A7A] dark:text-[#87CEEB] block font-bold">{t.contactWhatsapp}:</span>
                    <span className="font-bold text-[#12345A] dark:text-white text-xs">{t.onlineNow}</span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم ورحمة الله، استفسار عن التسجيل في مجمع النور')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#25D366] hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span>{t.chatWhatsapp}</span>
                </a>
              </div>

              <div className="p-3.5 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/50 rounded-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 text-[#9E7818] dark:text-[#F7E7B4] flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#4A7298] dark:text-[#84B4D6] block font-bold">{t.contactMobile}:</span>
                    <span className="font-bold text-[#12345A] dark:text-white text-xs">استفسارات القبول والتسجيل</span>
                  </div>
                </div>
                <a
                  href={`tel:${COMPLEX_INFO.phones.mobile.replace(/[^0-9+]/g, '')}`}
                  className="px-3.5 py-2 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold rounded-xl text-xs transition-colors"
                >
                  {t.callDirect}
                </a>
              </div>

              <div className="p-3.5 bg-[#EAF8FF]/80 dark:bg-[#0F2747] rounded-xl border border-[#87CEEB]/40 space-y-1">
                <span className="text-[#4A7298] dark:text-[#B8DEF5] block text-[11px] font-bold">البريد الإلكتروني الرسمي للمراسلات:</span>
                <span className="font-mono font-bold text-[#0D7A7A] dark:text-[#F7E7B4] block text-sm">
                  {COMPLEX_INFO.officialEmail}
                </span>
                <span className="text-[10px] text-[#4A7298] dark:text-[#84B4D6]">مخصص لجميع الاستفسارات والشراكات الأكاديمية</span>
              </div>

              <div className="p-3.5 bg-[#EAF8FF]/80 dark:bg-[#0F2747] rounded-xl border border-[#87CEEB]/40 space-y-1">
                <span className="text-[#4A7298] dark:text-[#B8DEF5] block text-[11px] font-bold">الاعتماد والانتشار الدولي:</span>
                <span className="font-bold text-[#12345A] dark:text-white block">
                  {COMPLEX_INFO.headquarters}
                </span>
                <span className="text-[10px] text-[#4A7298] dark:text-[#84B4D6]">منظومة تعليمية إلكترونية متصلة بـ 120 دولة</span>
              </div>

              <div className="p-3.5 bg-[#EAF8FF]/80 dark:bg-[#0F2747] rounded-xl border border-[#87CEEB]/40 space-y-1">
                <span className="text-[#4A7298] dark:text-[#B8DEF5] block text-[11px] font-bold">الفروع والممثليات الدولية:</span>
                <span className="font-bold text-[#0D7A7A] dark:text-[#2DD4BF] block">
                  120 فرعاً ومقرأة معتمدة في قارات العالم
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="sky-card-3d rounded-3xl p-6 space-y-4 text-right">
            <h3 className="text-base font-black text-[#12345A] dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0EA5A4]" />
              <span>مراسلة إدارة المجمع والأمانة العامة</span>
            </h3>

            {inquirySent ? (
              <div className="p-4 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#0EA5A4] rounded-xl text-[#12345A] dark:text-[#EAF8FF] text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto text-[#0EA5A4]" />
                <span className="font-bold block">شكراً لتواصلكم!</span>
                <span className="text-[11px] block">تم استلام رسالتكم وسيرد فريق العلاقات العامة خلال أقرب وقت.</span>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="الاسم الكريم *"
                  className="w-full bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl p-2.5 text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                />
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني *"
                  className="w-full bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl p-2.5 text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4] font-mono"
                />
                <input
                  type="text"
                  required
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  placeholder="موضوع الرسالة *"
                  className="w-full bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl p-2.5 text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                />
                <textarea
                  required
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  rows={3}
                  placeholder="نص الرسالة أو الاستفسار المؤسسي..."
                  className="w-full bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 rounded-xl p-2.5 text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4] resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                  <span>إرسال الرسالة</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      <SectionDynamicItems sectionSlug="register" />
    </div>
  );
};
