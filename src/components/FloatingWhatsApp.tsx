import React, { useState } from 'react';
import { MessageCircle, Phone, X, Send, CheckCircle2 } from 'lucide-react';
import { COMPLEX_INFO } from '../data/islamicData';
import { useLanguage } from '../context/LanguageContext';

export const FloatingWhatsApp: React.FC = () => {
  const { lang, t, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const whatsappCleanNumber = COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '');
  const mobileCleanNumber = COMPLEX_INFO.phones.mobile.replace(/[^0-9+]/g, '');

  const quickMessages: { ar: string; en: string; [key: string]: string }[] = [
    {
      ar: 'السلام عليكم ورحمة الله، أرغب بالتسجيل في المقرأة القرآنية بمجمع النور.',
      en: 'Peace be upon you, I would like to enroll in the Quran Academy at Al-Noor Complex.',
      fr: 'Que la paix soit sur vous, je souhaite m’inscrire à l’académie coranique Al-Noor.',
      es: 'La paz sea con vosotros, deseo inscribirme en la Academia del Corán Al-Noor.',
      de: 'Friede sei mit Ihnen, ich möchte mich an der Al-Noor Koran-Akademie einschreiben.',
      tr: "Selamün aleyküm, El-Nur Kur'an Akademisi'ne kayıt yaptırmak istiyorum.",
      id: "Assalamu'alaikum, saya ingin mendaftar di Akademi Al-Quran Al-Noor.",
      ur: 'السلام علیکم ورحمۃ اللہ، میں مجمع النور قرآنی اکیڈمی میں داخلہ لینا چاہتا ہوں۔',
      ru: 'Мир вам, я хотел бы записаться в Академию Корана «Ан-Нур».',
      zh: '愿平安降临于您，我想报名参加安努尔古兰经学院。',
      sw: 'Amani iwe nanyi, ningependa kujiandikisha katika Chuo cha Qurani cha Al-Noor.',
      fa: 'سلام علیکم، مایل به ثبت‌نام در آکادمی قرآنی مجمع النور هستم.',
    },
    {
      ar: 'السلام عليكم، أود الاستفسار عن كفالة حلقات القرآن والمشاريع الوقفية.',
      en: 'Peace be upon you, I would like to inquire about Quran circle sponsorships and Waqf projects.',
      fr: 'Que la paix soit sur vous, je souhaite me renseigner sur le parrainage des cercles coraniques et le Waqf.',
      es: 'La paz sea con vosotros, deseo consultar sobre el patrocinio de círculos del Corán y el Waqf.',
      de: 'Friede sei mit Ihnen, ich möchte mich über Patenschaften für Korankreise und Waqf informieren.',
      tr: "Selamün aleyküm, Kur'an halkaları kefaleti ve vakıf projeleri hakkında bilgi almak istiyorum.",
      id: "Assalamu'alaikum, saya ingin bertanya tentang program donasi wakaf dan santri Quran.",
      ur: 'السلام علیکم، میں قرآنی حلقوں کی کفالت اور وقفی منصوبوں کے بارے میں استفسار کرنا چاہتا ہوں۔',
      ru: 'Мир вам, я хотел бы узнать о поддержке коранических кружков и проектах вакфа.',
      zh: '愿平安降临于您，我想咨询关于瓦克夫古兰经学子赞助项目。',
      sw: 'Amani iwe nanyi, ningependa kuulizia kuhusu ufadhili wa masomo ya Qurani na miradi ya wakfu.',
      fa: 'سلام علیکم، درباره کفالت حلقه‌های قرآنی و پروژه‌های وقفی سوال داشتم.',
    },
    {
      ar: 'السلام عليكم، استفسار عام بخصوص البرامج والمقر العام لمجمع النور.',
      en: 'Peace be upon you, general inquiry regarding courses and headquarters of Al-Noor Complex.',
      fr: 'Que la paix soit sur vous, demande d’informations générales sur les programmes et le siège.',
      es: 'La paz sea con vosotros, consulta general sobre cursos y la sede del Complejo Al-Noor.',
      de: 'Friede sei mit Ihnen, allgemeine Anfrage zu Kursen und zum Hauptsitz von Al-Noor.',
      tr: 'Selamün aleyküm, El-Nur Külliyesi programları ve genel merkezi hakkında bilgi rica ediyorum.',
      id: "Assalamu'alaikum, pertanyaan umum seputar program studi dan kantor pusat Al-Noor.",
      ur: 'السلام علیکم، مجمع النور کے تعلیمی کورسز اور مرکزی دفتر کے بارے میں عمومی استفسار۔',
      ru: 'Мир вам, общий вопрос по учебным программам и штаб-квартире комплекса «Ан-Нур».',
      zh: '愿平安降临于您，我想了解关于安努尔中心的常规课程与总部信息。',
      sw: 'Amani iwe nanyi, ningependa taarifa za jumla kuhusu kozi na makao makuu ya Al-Noor.',
      fa: 'سلام علیکم، استعلام کلی درباره برنامه‌های آموزشی و مقر اصلی مجمع النور.',
    },
  ];

  const getMsgText = (m: { ar: string; en: string; [key: string]: string }) => {
    return m[lang] || (lang === 'ar' || isRtl ? m.ar : m.en);
  };

  const buildWhatsappUrl = (msgToSend?: string) => {
    const defaultMsg = getMsgText(quickMessages[0]);
    const text = encodeURIComponent(msgToSend || userMsg || defaultMsg);
    return `https://wa.me/${whatsappCleanNumber}?text=${text}`;
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className={`fixed bottom-20 xl:bottom-6 z-50 ${isRtl ? 'left-4 sm:left-6' : 'right-4 sm:right-6'}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="تواصل عبر واتساب"
          className="group relative flex items-center gap-2.5 bg-gradient-to-tr from-[#1EBE5D] via-[#25D366] to-[#34E074] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200 ring-4 ring-white/40 cursor-pointer"
        >
          <svg
            className="w-7 h-7 fill-current drop-shadow"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>

          <span className="hidden sm:inline font-black text-xs tracking-wide whitespace-nowrap">
            {t.chatWhatsapp}
          </span>
        </button>
      </div>

      {/* Sky-Blue 3D WhatsApp Dialogue Card */}
      {isOpen && (
        <div
          className={`fixed bottom-36 xl:bottom-24 z-50 w-[92vw] sm:w-[380px] bg-white dark:bg-[#0F2747] border border-[#12345A]/20 dark:border-[#87CEEB]/30 rounded-3xl shadow-2xl overflow-hidden ${
            isRtl ? 'left-4 sm:left-6 text-right' : 'right-4 sm:right-6 text-left'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-l from-[#12345A] to-[#0E3F66] p-4 text-white relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 p-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="إغلاق نافذة واتساب"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 p-2 flex items-center justify-center border border-white/20 shrink-0">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
              <div className="pr-1">
                <h4 className="text-sm font-black leading-snug">{COMPLEX_INFO.name}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[#87CEEB] mt-0.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>{t.onlineNow}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Channels Action Box */}
          <div className="p-4 bg-[#EAF8FF] dark:bg-[#0A223D] border-b border-[#12345A]/12 dark:border-[#87CEEB]/20 space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-[#0F2747] border border-[#25D366]/40 rounded-xl">
              <div>
                <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] block">
                  {t.contactWhatsapp}
                </span>
                <span className="font-bold text-[#12345A] dark:text-[#EAF8FF] text-xs">{t.onlineNow}</span>
              </div>
              <a
                href={buildWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-[#0A223D] font-black rounded-lg text-xs transition-colors"
              >
                {t.chatWhatsapp}
              </a>
            </div>

            <div className="flex items-center justify-between p-3 bg-white dark:bg-[#0F2747] border border-[#12345A]/12 dark:border-[#87CEEB]/20 rounded-xl">
              <div>
                <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] block">
                  {t.contactMobile}
                </span>
                <span className="font-bold text-[#12345A] dark:text-[#F7E7B4] text-xs">
                  استفسارات القبول والوقف
                </span>
              </div>
              <a
                href={`tel:${mobileCleanNumber}`}
                className="px-3 py-1.5 bg-[#EAF8FF] dark:bg-[#12345A] hover:bg-[#D8F1FD] text-[#12345A] dark:text-[#EAF8FF] font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-[#0EA5A4]" />
                <span>{t.callDirect}</span>
              </a>
            </div>
          </div>

          {/* Quick Inquiry presets */}
          <div className="p-4 space-y-3 bg-white dark:bg-[#0F2747] text-xs">
            <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] font-bold block">
              {t.quickInquiry}:
            </span>

            <div className="space-y-1.5">
              {quickMessages.map((m, idx) => {
                const text = getMsgText(m);
                return (
                  <a
                    key={idx}
                    href={buildWhatsappUrl(text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-right p-2.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] hover:bg-[#D8F1FD] dark:hover:bg-[#133158] border border-[#12345A]/12 dark:border-[#87CEEB]/20 text-[#12345A] dark:text-[#EAF8FF] text-xs leading-relaxed transition-colors flex items-center justify-between gap-2"
                  >
                    <span className="line-clamp-2">{text}</span>
                    <Send className={`w-3.5 h-3.5 text-[#0EA5A4] shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
                  </a>
                );
              })}
            </div>

            <div className="pt-2">
              <div className="relative">
                <input
                  type="text"
                  value={userMsg}
                  onChange={(e) => setUserMsg(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب رسالتك المخصصة هنا...' : 'Type your inquiry here...'}
                  className="w-full bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 rounded-xl py-2.5 pr-3 pl-11 text-xs text-[#12345A] dark:text-[#EAF8FF] placeholder-[#4A7298] focus:outline-none focus:border-[#0EA5A4]"
                />
                <a
                  href={buildWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  aria-label="إرسال عبر واتساب"
                  className={`absolute top-1.5 ${
                    isRtl ? 'left-1.5' : 'right-1.5'
                  } p-1.5 rounded-lg bg-[#25D366] text-[#0A223D] hover:brightness-105`}
                >
                  <Send className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </a>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-[#EAF8FF] dark:bg-[#0A223D] text-center border-t border-[#12345A]/10 dark:border-[#87CEEB]/15 text-[11px] font-semibold text-[#2B547E] dark:text-[#B8DEF5]">
            مجمع النور الإسلامي · تواصل مباشر على مدار الساعة
          </div>
        </div>
      )}
    </>
  );
};
