import React, { useState } from 'react';
import { 
  Mail, Send, CheckCircle2, AlertCircle, BookOpen, 
  GraduationCap, Globe, ShieldCheck, MapPin, Sparkles, RefreshCw, 
  Phone, MessageCircle, Copy, Check 
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { COMPLEX_INFO } from '../../data/islamicData';
import { useLanguage } from '../../context/LanguageContext';

interface RegisterPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = () => {
  const { lang, t, isRtl } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };
  // Registration Form State
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

  // Inquiry Form State
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
    <div className="space-y-10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 border border-emerald-900/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
          <Mail className="w-4 h-4" />
          <span>بوابة القبول والتسجيل والتواصل المؤسسي العالمي</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          سجل الآن في الحلقات القرآنية وكلية العلوم الإسلامية
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          نرحب بجميع طلاب العلم وحفظة القرآن من شتى بقاع الأرض. التسجيل مجاني ومتاح لجميع الأعمار بمتابعة نخبة من كبار المشايخ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Registration Form (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-right">
          
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              استمارة الالتحاق الأكاديمي والقرآني
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              بيانات الطالب والمسار المطلوب
            </h2>
          </div>

          {registrationId ? (
            <div className="p-8 bg-slate-950 rounded-2xl border border-emerald-500/50 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-black text-white">
                تم تسجيل طلبكم بنجاح في مجمع النور!
              </h3>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 inline-block font-mono">
                <span className="text-xs text-slate-400 block mb-1">رقم التسجيل المرجعي:</span>
                <span className="text-xl font-black text-amber-400">{registrationId}</span>
              </div>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                سيتواصل معكم منسق المقرأة أو الكلية عبر البريد الإلكتروني (<strong className="text-white">{email}</strong>) خلال 24 ساعة لتحديد موعد اختبار قياس المستوى وتوزيعكم على الحلقة المناسبة.
              </p>

              <button
                onClick={() => {
                  setRegistrationId(null);
                  setStudentName('');
                  setEmail('');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition-colors"
              >
                تسجيل طالب آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">الاسم الثلاثي للطالب/الطالبة *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="مثال: عبد الله أحمد المنصور"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">البريد الإلكتروني الرسمي *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">بلد الإقامة الحالي</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="مثال: المملكة العربية السعودية"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">المسار التعليمي المطلوب *</label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
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
                  <label className="text-slate-300 font-bold block">المستوى القرآني الحالي</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="مبتدئ (من قصار السور)">مبتدئ (قصار السور وجزء عم)</option>
                    <option value="متوسط (حفظ من 5 إلى 15 جزءاً)">متوسط (حفظ من 5 إلى 15 جزءاً)</option>
                    <option value="متقدم (حفظ أكثر من 15 جزءاً)">متقدم (حفظ أكثر من 15 جزءاً)</option>
                    <option value="حافظ للقرآن كاملاً ويطلب الإجازة">حافظ للقرآن كاملاً ويطلب الإجازة</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">الفترة الزمنية المفضلة للحلقات</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="الفترة الصباحية (بعد الفجر)">الفترة الصباحية (بعد الفجر)</option>
                    <option value="الفترة المسائية (بعد العصر / المغرب)">الفترة المسائية (بعد العصر / المغرب)</option>
                    <option value="الفترة الليلية (بعد العشاء)">الفترة الليلية (بعد العشاء)</option>
                    <option value="حلقات نهاية الأسبوع المكثفة (الجمعة والسبت)">حلقات نهاية الأسبوع (الجمعة والسبت)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">ملاحظات إضافية أو خبرات حفظ سابقة (اختياري)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="أي معلومات إضافية تود إخبار المشايخ بها..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري إرسال طلب التسجيل...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>تأكيد وإرسال طلب الالتحاق</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Corporate Contact & Inquiries (5 Cols) - NO MOBILE PHONE */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Official Complex Info Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>المقر الرسمي والعناوين المعتمدة</span>
            </h3>

            <div className="space-y-3 text-xs">
              
              {/* WhatsApp Official Contact Channel */}
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#25D366] flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-300 block font-bold">{t.contactWhatsapp}:</span>
                      <span className="font-bold text-white text-xs">{t.onlineNow}</span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم ورحمة الله، استفسار عن التسجيل في مجمع النور')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#25D366] hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs transition-colors flex items-center gap-1 shadow-md"
                  >
                    <span>{t.chatWhatsapp}</span>
                  </a>
                </div>
              </div>

              {/* Direct Telephone Channel */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">{t.contactMobile}:</span>
                      <span className="font-bold text-amber-300 text-xs">استفسارات القبول والتسجيل</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${COMPLEX_INFO.phones.mobile.replace(/[^0-9+]/g, '')}`}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black rounded-xl text-xs transition-colors flex items-center gap-1 border border-slate-700"
                  >
                    <span>{t.callDirect}</span>
                  </a>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">البريد الإلكتروني الرسمي للمراسلات:</span>
                <span className="font-mono font-bold text-amber-400 block text-sm">
                  {COMPLEX_INFO.officialEmail}
                </span>
                <span className="text-[10px] text-slate-500">مخصص لجميع الاستفسارات والشراكات الأكاديمية</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">الاعتماد والانتشار الدولي:</span>
                <span className="font-bold text-white block">
                  {COMPLEX_INFO.headquarters}
                </span>
                <span className="text-[10px] text-slate-500">منظومة تعليمية إلكترونية متصلة بـ 120 دولة</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">الفروع والممثليات الدولية:</span>
                <span className="font-bold text-emerald-400 block">
                  120 فرعاً ومقرأة معتمدة في قارات العالم
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>مراسلة إدارة المجمع والأمانة العامة</span>
            </h3>

            {inquirySent ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl text-emerald-300 text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                <span className="font-bold block">شكراً لتواصلكم!</span>
                <span className="text-[11px] block">تم استلام رسالتكم وسيرد فريق العلاقات العامة خلال أقرب وقت.</span>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                <div>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="الاسم الكريم *"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="بريدك الإلكتروني *"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={inquirySubject}
                    onChange={(e) => setInquirySubject(e.target.value)}
                    placeholder="موضوع الرسالة *"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <textarea
                    required
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    rows={3}
                    placeholder="نص الرسالة أو الاستفسار المؤسسي..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                  <span>إرسال الرسالة</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
