import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Heart, ShieldCheck, Building2, MessageCircle, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_DONATION_INFO, OFFICIAL_COMPLEX_LOGO } from '../data/islamicData';
import { useLanguage } from '../context/LanguageContext';

export const WheatHandSproutIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <defs>
      <radialGradient id="wheatGlowAura" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
        <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="wheatGrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="30%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="wheatStemGrad" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="40%" stopColor="#2DD4BF" />
        <stop offset="100%" stopColor="#0EA5A4" />
      </linearGradient>
      <linearGradient id="caringHandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>
    <circle cx="27" cy="24" r="22" fill="url(#wheatGlowAura)" />
    <path
      d="M13 41C13 41 16 35 22 35C25 35 26.5 36.5 27 37C27.5 36.5 29 35 32 35C38 35 41 41 41 41C41 45 36 48 27 48C18 48 13 45 13 41Z"
      fill="url(#caringHandGrad)"
      stroke="#FDE047"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M18 39C21 38 24 39 27 40.5C30 39 33 38 36 39"
      stroke="#FEF08A"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.85"
    />
    <path d="M27 36V10" stroke="url(#wheatStemGrad)" strokeWidth="2.2" strokeLinecap="round" />
    <path
      d="M27 7C25.8 8.8 25.8 11.2 27 12.5C28.2 11.2 28.2 8.8 27 7Z"
      fill="url(#wheatGrainGrad)"
      stroke="#D4AF37"
      strokeWidth="0.9"
    />
    <path d="M27 7V3" stroke="#FDE047" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M26 13.5C22.8 12.2 20.5 13.5 20 15C21.8 16.2 24.8 15.6 26 14.5" fill="url(#wheatGrainGrad)" stroke="#D4AF37" strokeWidth="0.9" />
    <path d="M20 15L16.5 12" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />
    <path d="M28 13.5C31.2 12.2 33.5 13.5 34 15C32.2 16.2 29.2 15.6 28 14.5" fill="url(#wheatGrainGrad)" stroke="#D4AF37" strokeWidth="0.9" />
    <path d="M34 15L37.5 12" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />
    <path d="M26 18C22 16.8 19.5 18.2 19 20C21.2 21.2 24.5 20.4 26 19.2" fill="url(#wheatGrainGrad)" stroke="#D4AF37" strokeWidth="0.9" />
    <path d="M19 20L15 17" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />
    <path d="M28 18C32 16.8 34.5 18.2 35 20C32.8 21.2 29.5 20.4 28 19.2" fill="url(#wheatGrainGrad)" stroke="#D4AF37" strokeWidth="0.9" />
    <path d="M35 20L39 17" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />
    <path d="M26 23C21.5 22 19 23.5 18.5 25.5C21 26.8 24.5 25.8 26 24.2" fill="url(#wheatGrainGrad)" stroke="#D4AF37" strokeWidth="0.9" />
    <path d="M18.5 25.5L14.5 23" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />
    <path d="M28 23C32.5 22 35 23.5 35.5 25.5C33 26.8 29.5 25.8 28 24.2" fill="url(#wheatGrainGrad)" stroke="#D4AF37" strokeWidth="0.9" />
    <path d="M35.5 25.5L39.5 23" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />
    <path d="M26 28C22.2 27.2 20 29 19.5 31C22 32 25 31 26 29.5" fill="url(#wheatGrainGrad)" stroke="#D4AF37" strokeWidth="0.9" />
    <path d="M28 28C31.8 27.2 34 29 34.5 31C32 32 29 31 28 29.5" fill="url(#wheatGrainGrad)" stroke="#D4AF37" strokeWidth="0.9" />
    <circle cx="16" cy="11" r="1" fill="#FEF08A" />
    <circle cx="38" cy="11" r="1" fill="#FEF08A" />
    <circle cx="27" cy="4" r="1.2" fill="#FEF08A" />
  </svg>
);

export const FloatingDonationWidget: React.FC = () => {
  const { isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const [selectedPurposeId, setSelectedPurposeId] = useState<string>('orphans');
  const [currency, setCurrency] = useState<'SDG' | 'USD'>('SDG');
  const [amount, setAmount] = useState<number | string>(50000);
  const [customAmount, setCustomAmount] = useState('');

  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [transferRef, setTransferRef] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('alnoor:open-donation-modal', handler);
    return () => window.removeEventListener('alnoor:open-donation-modal', handler);
  }, []);

  const selectedPurpose =
    OFFICIAL_DONATION_INFO.purposes.find((p) => p.id === selectedPurposeId) ||
    OFFICIAL_DONATION_INFO.purposes[0];

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(OFFICIAL_DONATION_INFO.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleCopyAllDetails = () => {
    const textToCopy = `مجمع النور الإسلامي العالمي لتحفيظ القرآن الكريم والعلوم الإسلامية
بيانات التبرع وكفالة الأيتام الرسمية:
البنك: ${OFFICIAL_DONATION_INFO.bankName}
رقم الحساب: ${OFFICIAL_DONATION_INFO.accountNumber}
اسم الحساب: ${OFFICIAL_DONATION_INFO.accountHolder}
الصفة: ${OFFICIAL_DONATION_INFO.directorTitle}
وجه التبرع: ${selectedPurpose.titleAr}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const cleanWhatsappNumber = OFFICIAL_DONATION_INFO.whatsappNotify.replace(/[^0-9]/g, '');
  const amountText = amount
    ? `${amount} ${currency === 'SDG' ? 'جنيه سوداني' : 'دولار'}`
    : 'تبرع مبارك';
  const whatsappNotificationMsg = `السلام عليكم ورحمة الله وبركاته،
أود إرسال إشعار تحويل تبرع إلى مجمع النور الإسلامي العالمي:
• البنك: ${OFFICIAL_DONATION_INFO.bankShort}
• رقم الحساب: ${OFFICIAL_DONATION_INFO.accountNumber}
• باسم: ${OFFICIAL_DONATION_INFO.accountHolder}
• وجه التبرع: ${selectedPurpose.titleAr}
• المبلغ: ${amountText}
${donorName ? `• اسم المتبرع: ${donorName}\n` : ''}${
    donorPhone ? `• رقم الهاتف: ${donorPhone}\n` : ''
  }${transferRef ? `• رقم عملية التحويل / الإشعار: ${transferRef}\n` : ''}
بارك الله في جهودكم وجزاكم الله خيراً.`;
  const whatsappNotifyUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    whatsappNotificationMsg
  )}`;

  const handleSubmitNotice = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <>
      {/* FLOATING DONATION LAUNCHER */}
      <div
        className={`fixed bottom-20 xl:bottom-6 z-40 ${
          isRtl ? 'right-4 sm:right-6' : 'left-4 sm:left-6'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="تبرع للأيتام والمجمع - بنك الخرطوم 1727654"
          className="group relative flex items-center gap-2.5 bg-gradient-to-tr from-[#0A223D] via-[#12345A] to-[#0E3F66] text-[#F7E7B4] p-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-2xl border-2 border-[#D4AF37] hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
        >
          <div className="relative shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37] via-[#FFFBEB] to-[#F59E0B] flex items-center justify-center shadow-md">
            <img
              src={OFFICIAL_COMPLEX_LOGO}
              alt="شعار مجمع النور الإسلامي العالمي"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col text-right pr-0.5">
            <span className="font-amiri font-black text-xs sm:text-sm text-[#F7E7B4] leading-tight whitespace-nowrap">
              مجمع النور · كفالة وتبرع
            </span>
            <span className="text-[11px] font-mono tabular-nums font-bold text-[#87CEEB] leading-none mt-1">
              بنك الخرطوم: {OFFICIAL_DONATION_INFO.accountNumber}
            </span>
          </div>
        </button>
      </div>

      {/* SKY-BLUE 3D DONATION MODAL (Bank of Khartoum 1727654) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0A223D]/75 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-[#0F2747] border border-[#12345A]/20 dark:border-[#87CEEB]/30 rounded-3xl shadow-2xl overflow-hidden my-auto text-[#12345A] dark:text-[#EAF8FF]"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors cursor-pointer"
              aria-label="إغلاق نافذة التبرع"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="relative p-5 sm:p-7 bg-gradient-to-br from-[#0A223D] via-[#12345A] to-[#0E3F66] border-b border-[#D4AF37]/30 text-center text-white">
              <div className="flex justify-center mb-3">
                <div className="relative p-2 bg-white/10 rounded-2xl border border-[#D4AF37]/50">
                  <img
                    src={OFFICIAL_COMPLEX_LOGO}
                    alt="شعار مجمع النور الإسلامي العالمي"
                    referrerPolicy="no-referrer"
                    className="h-14 w-auto object-contain"
                  />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#F7E7B4] mb-1.5">
                <WheatHandSproutIcon className="w-4 h-4" />
                <span>بوابة التبرع وكفالة الأيتام المعتمدة</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#87CEEB]">حساب بنكي مباشر</span>
              </div>

              <h3 className="text-lg sm:text-2xl font-black font-amiri text-white leading-snug">
                مجمع النور الإسلامي العالمي الخيري الشامل
              </h3>

              <div className="mt-3 p-3 bg-white/10 rounded-2xl border border-white/15 max-w-xl mx-auto">
                <p className="font-amiri text-sm sm:text-base text-[#F7E7B4] leading-relaxed font-bold">
                  «{OFFICIAL_DONATION_INFO.sloganAyah}»
                </p>
                <span className="text-[11px] text-[#87CEEB] font-semibold block mt-1">
                  [{OFFICIAL_DONATION_INFO.sloganAyahRef}]
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 space-y-6 max-h-[72vh] overflow-y-auto">
              {/* BANK OF KHARTOUM FLAGSHIP CARD */}
              <div className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#0A223D] via-[#12345A] to-[#0E3F66] text-white border border-[#D4AF37]/60 shadow-lg">
                <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#F7E7B4]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        {OFFICIAL_DONATION_INFO.bankName}
                      </h4>
                      <span className="text-[11px] text-[#87CEEB] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                        التحويل متاح عبر تطبيق (بنكك - Bankak) من كل أنحاء العالم
                      </span>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block text-xs font-bold text-[#F7E7B4]">
                    حساب خيري معتمد
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-[#D4AF37]/45 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-right">
                    <span className="text-xs text-[#87CEEB] font-bold block mb-1">
                      رقم الحساب البنكي المعتمد:
                    </span>
                    <span className="text-3xl sm:text-4xl font-mono tabular-nums font-black text-[#F7E7B4] tracking-wider">
                      {OFFICIAL_DONATION_INFO.accountNumber}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAccountNumber}
                    className={`min-h-[44px] flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                      copiedAccount
                        ? 'bg-[#0EA5A4] text-white'
                        : 'bg-[#D4AF37] hover:bg-[#E5C97B] text-[#0A223D]'
                    }`}
                  >
                    {copiedAccount ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم نسخ رقم الحساب!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ رقم الحساب</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#87CEEB] block text-[11px] font-medium">اسم صاحب الحساب:</span>
                    <span className="text-[#F7E7B4] font-bold text-sm sm:text-base font-amiri block mt-0.5">
                      {OFFICIAL_DONATION_INFO.accountHolder}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#87CEEB] block text-[11px] font-medium">الصفة المؤسسية:</span>
                    <span className="text-white font-semibold text-xs leading-relaxed block mt-0.5">
                      {OFFICIAL_DONATION_INFO.directorTitle}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCopyAllDetails}
                    className="text-xs font-bold text-[#F7E7B4] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedAll ? (
                      <Check className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedAll ? 'تم نسخ كامل بيانات الحساب' : 'نسخ كامل تفاصيل التحويل'}</span>
                  </button>
                </div>
              </div>

              {/* DONATION PURPOSE SELECTOR */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-[#0EA5A4]" />
                    <span>حدد وجه التبرع والصدقة:</span>
                  </label>
                  <span className="text-xs text-[#0D7A7A] dark:text-[#2DD4BF] font-bold">
                    {selectedPurpose.titleAr}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {OFFICIAL_DONATION_INFO.purposes.map((p) => {
                    const isSelected = selectedPurposeId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPurposeId(p.id);
                          setAmount(currency === 'SDG' ? p.suggestedAmountsSdg[1] : p.suggestedAmountsUsd[1]);
                        }}
                        className={`p-3 rounded-2xl text-right transition-colors border cursor-pointer ${
                          isSelected
                            ? 'bg-[#12345A] border-[#D4AF37] text-white shadow-sm'
                            : 'bg-[#EAF8FF] dark:bg-[#0A223D] hover:bg-[#D8F1FD] border-[#12345A]/15 dark:border-[#87CEEB]/20 text-[#12345A] dark:text-[#EAF8FF]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs font-bold ${
                              isSelected ? 'text-[#F7E7B4]' : 'text-[#12345A] dark:text-[#EAF8FF]'
                            }`}
                          >
                            {p.titleAr}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#D4AF37]" />}
                        </div>
                        <p className={`text-[11px] leading-snug ${isSelected ? 'text-[#D8F1FD]' : 'text-[#2B547E] dark:text-[#B8DEF5]'}`}>
                          {p.descAr}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SUGGESTED AMOUNTS & CURRENCY */}
              <div className="space-y-3 p-4 bg-[#EAF8FF] dark:bg-[#0A223D] rounded-2xl border border-[#12345A]/15 dark:border-[#87CEEB]/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF]">
                    قيمة التبرع المقترحة:
                  </span>

                  <div className="flex items-center rounded-xl bg-white dark:bg-[#0F2747] p-1 border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency('SDG');
                        setAmount(selectedPurpose.suggestedAmountsSdg[1]);
                      }}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        currency === 'SDG'
                          ? 'bg-[#12345A] text-white font-black'
                          : 'text-[#2B547E] dark:text-[#B8DEF5]'
                      }`}
                    >
                      جنيه سوداني (ج.س)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency('USD');
                        setAmount(selectedPurpose.suggestedAmountsUsd[1]);
                      }}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        currency === 'USD'
                          ? 'bg-[#12345A] text-white font-black'
                          : 'text-[#2B547E] dark:text-[#B8DEF5]'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 tabular-nums">
                  {(currency === 'SDG'
                    ? selectedPurpose.suggestedAmountsSdg
                    : selectedPurpose.suggestedAmountsUsd
                  ).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setAmount(val);
                        setCustomAmount('');
                      }}
                      className={`py-2 px-1 text-center rounded-xl font-mono font-bold text-xs transition-colors cursor-pointer border ${
                        amount === val && !customAmount
                          ? 'bg-[#D4AF37] text-[#0A223D] border-[#D4AF37] font-black'
                          : 'bg-white dark:bg-[#0F2747] text-[#12345A] dark:text-[#EAF8FF] border-[#12345A]/15 dark:border-[#87CEEB]/20 hover:border-[#0EA5A4]'
                      }`}
                    >
                      {val.toLocaleString()} {currency === 'SDG' ? 'ج.س' : '$'}
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <input
                    type="number"
                    placeholder="أو اكتب مبلغاً آخر ترغب بالتبرع به..."
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount(e.target.value ? Number(e.target.value) : '');
                    }}
                    className="w-full min-h-[42px] bg-white dark:bg-[#0F2747] border border-[#12345A]/15 dark:border-[#87CEEB]/25 focus:border-[#0EA5A4] rounded-xl px-3.5 py-2 text-xs text-[#12345A] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* WHATSAPP DIRECT NOTIFICATION */}
              <div className="p-4 rounded-2xl bg-[#ECFDF5] dark:bg-[#064E3B]/35 border border-[#25D366]/45 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#0D7A7A] dark:text-[#25D366]">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-[#12345A] dark:text-white">
                      إشعار التحويل عبر واتساب الإدارة المباشر
                    </h5>
                    <p className="text-[11px] text-[#2B547E] dark:text-[#B8DEF5] leading-tight">
                      بعد تحويل التبرع عبر تطبيق (بنكك)، أرسل إشعار التحويل لتأكيد القيد واستلام سند الاستلام.
                    </p>
                  </div>
                </div>

                <a
                  href={whatsappNotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-[#0A223D] font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>إرسال إشعار التحويل للإدارة على واتساب (+249904499914)</span>
                </a>
              </div>

              {/* ONLINE RECEIPT NOTIFICATION FORM */}
              {!isSubmitted ? (
                <form
                  onSubmit={handleSubmitNotice}
                  className="p-4 bg-[#EAF8FF] dark:bg-[#0A223D] rounded-2xl border border-[#12345A]/15 dark:border-[#87CEEB]/20 space-y-3 text-xs"
                >
                  <span className="font-bold text-[#12345A] dark:text-[#EAF8FF] block">
                    أو سجّل بيانات التحويل هنا لتوثيق التبرع في سجلات المجمع:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="اسم المتبرع (أو فاعل خير)"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="min-h-[40px] bg-white dark:bg-[#0F2747] border border-[#12345A]/15 dark:border-[#87CEEB]/25 focus:border-[#0EA5A4] rounded-xl px-3 py-2 text-[#12345A] dark:text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="رقم الهاتف أو الواتساب"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="min-h-[40px] bg-white dark:bg-[#0F2747] border border-[#12345A]/15 dark:border-[#87CEEB]/25 focus:border-[#0EA5A4] rounded-xl px-3 py-2 text-[#12345A] dark:text-white focus:outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="رقم العملية / الرقم المرجعي للتحويل في تطبيق بنكك"
                    value={transferRef}
                    onChange={(e) => setTransferRef(e.target.value)}
                    className="w-full min-h-[40px] bg-white dark:bg-[#0F2747] border border-[#12345A]/15 dark:border-[#87CEEB]/25 focus:border-[#0EA5A4] rounded-xl px-3 py-2 text-[#12345A] dark:text-white focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="w-full min-h-[42px] py-2.5 bg-[#12345A] hover:bg-[#0E3F66] text-white font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    تسجيل إشعار التبرع
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-[#ECFDF5] dark:bg-[#064E3B]/45 border border-[#0EA5A4]/40 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#0EA5A4] mx-auto" />
                  <h5 className="font-bold text-[#12345A] dark:text-[#EAF8FF] text-sm">
                    تقبل الله طاعتكم وصدقتكم المباركة
                  </h5>
                  <p className="font-amiri text-xs sm:text-sm text-[#0D7A7A] dark:text-[#F7E7B4] font-bold leading-relaxed">
                    «جَزَاكُمُ اللَّهُ خَيْرًا وَبَارَكَ لَكُمْ فِي أَمْوَالِكُمْ وَأَهْلِيكُمْ وَجَعَلَهُ فِي مِيزَانِ حَسَنَاتِكُمْ صَدَقَةً جَارِيَةً يَوْمَ تَلْقَوْنَهُ»
                  </p>
                  <span className="text-[11px] text-[#2B547E] dark:text-[#B8DEF5] block">
                    تم تسجيل الإشعار بنجاح، وسيتم تدقيقه من أمانة الصندوق بمجمع النور.
                  </span>
                </div>
              )}

              {/* Hadith on Orphans Blessing */}
              <div className="scholarly-reading-paper p-3.5 rounded-2xl text-center">
                <span className="font-amiri text-xs sm:text-sm text-[#12345A] dark:text-[#F7E7B4] font-bold">
                  {OFFICIAL_DONATION_INFO.hadithOrphans}
                </span>
                <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] block mt-0.5">
                  حديث صحيح · متفق عليه
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#EAF8FF] dark:bg-[#0A223D] border-t border-[#12345A]/12 dark:border-[#87CEEB]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#2B547E] dark:text-[#B8DEF5]">
                <ShieldCheck className="w-4 h-4 text-[#0EA5A4] shrink-0" />
                <span>حساب رسمي موثق ومسجل لدى أمانة مجمع النور الإسلامي العالمي</span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#12345A] hover:bg-[#0E3F66] text-white font-bold transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
