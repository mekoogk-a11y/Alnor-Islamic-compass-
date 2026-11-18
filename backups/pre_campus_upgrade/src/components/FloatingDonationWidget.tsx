import React, { useState } from 'react';
import { 
  X, Copy, Check, Heart, Sparkles, Send, ShieldCheck, 
  Building2, MessageCircle, ArrowRight, CheckCircle2, 
  ExternalLink, QrCode, BookOpen, Gift, Users, Award
} from 'lucide-react';
import { OFFICIAL_DONATION_INFO, OFFICIAL_COMPLEX_LOGO } from '../data/islamicData';
import { useLanguage } from '../context/LanguageContext';

/**
 * Bespoke Hand with Sprouting Wheat Stalk SVG Icon (سنبلة نابتة على يد)
 * Symbolizing the Quranic verse: (مَثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ)
 */
export const WheatHandSproutIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg 
    viewBox="0 0 54 54" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      {/* Radiant Golden Glow */}
      <radialGradient id="wheatGlowAura" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
        <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
      </radialGradient>
      
      {/* Golden Wheat Grains Gradient */}
      <linearGradient id="wheatGrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="30%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>

      {/* Fresh Green Stem Gradient */}
      <linearGradient id="wheatStemGrad" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="40%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>

      {/* Noble Caring Hand Gradient */}
      <linearGradient id="caringHandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>

    {/* Ambient Radiant Backdrop */}
    <circle cx="27" cy="24" r="22" fill="url(#wheatGlowAura)" />

    {/* Caring Open Palm Hand (Base of Giving) */}
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

    {/* Central Growing Wheat Stalk / Stem */}
    <path 
      d="M27 36V10" 
      stroke="url(#wheatStemGrad)" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
    />

    {/* Top Crown Grain (قمة السنبلة) */}
    <path 
      d="M27 7C25.8 8.8 25.8 11.2 27 12.5C28.2 11.2 28.2 8.8 27 7Z" 
      fill="url(#wheatGrainGrad)" 
      stroke="#D4AF37" 
      strokeWidth="0.9" 
    />
    <path d="M27 7V3" stroke="#FDE047" strokeWidth="1.3" strokeLinecap="round" />

    {/* Grain Pair 1 (Upper) */}
    <path 
      d="M26 13.5C22.8 12.2 20.5 13.5 20 15C21.8 16.2 24.8 15.6 26 14.5" 
      fill="url(#wheatGrainGrad)" 
      stroke="#D4AF37" 
      strokeWidth="0.9" 
    />
    <path d="M20 15L16.5 12" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />

    <path 
      d="M28 13.5C31.2 12.2 33.5 13.5 34 15C32.2 16.2 29.2 15.6 28 14.5" 
      fill="url(#wheatGrainGrad)" 
      stroke="#D4AF37" 
      strokeWidth="0.9" 
    />
    <path d="M34 15L37.5 12" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />

    {/* Grain Pair 2 (Mid-High) */}
    <path 
      d="M26 18C22 16.8 19.5 18.2 19 20C21.2 21.2 24.5 20.4 26 19.2" 
      fill="url(#wheatGrainGrad)" 
      stroke="#D4AF37" 
      strokeWidth="0.9" 
    />
    <path d="M19 20L15 17" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />

    <path 
      d="M28 18C32 16.8 34.5 18.2 35 20C32.8 21.2 29.5 20.4 28 19.2" 
      fill="url(#wheatGrainGrad)" 
      stroke="#D4AF37" 
      strokeWidth="0.9" 
    />
    <path d="M35 20L39 17" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />

    {/* Grain Pair 3 (Mid) */}
    <path 
      d="M26 23C21.5 22 19 23.5 18.5 25.5C21 26.8 24.5 25.8 26 24.2" 
      fill="url(#wheatGrainGrad)" 
      stroke="#D4AF37" 
      strokeWidth="0.9" 
    />
    <path d="M18.5 25.5L14.5 23" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />

    <path 
      d="M28 23C32.5 22 35 23.5 35.5 25.5C33 26.8 29.5 25.8 28 24.2" 
      fill="url(#wheatGrainGrad)" 
      stroke="#D4AF37" 
      strokeWidth="0.9" 
    />
    <path d="M35.5 25.5L39.5 23" stroke="#FDE047" strokeWidth="1" strokeLinecap="round" />

    {/* Grain Pair 4 (Lower Sprout) */}
    <path 
      d="M26 28C22.2 27.2 20 29 19.5 31C22 32 25 31 26 29.5" 
      fill="url(#wheatGrainGrad)" 
      stroke="#D4AF37" 
      strokeWidth="0.9" 
    />
    <path 
      d="M28 28C31.8 27.2 34 29 34.5 31C32 32 29 31 28 29.5" 
      fill="url(#wheatGrainGrad)" 
      stroke="#D4AF37" 
      strokeWidth="0.9" 
    />

    {/* Light Sparks */}
    <circle cx="16" cy="11" r="1" fill="#FEF08A" />
    <circle cx="38" cy="11" r="1" fill="#FEF08A" />
    <circle cx="27" cy="4" r="1.2" fill="#FEF08A" />
  </svg>
);

export const FloatingDonationWidget: React.FC = () => {
  const { lang, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  
  // Donation Selection State
  const [selectedPurposeId, setSelectedPurposeId] = useState<string>('orphans');
  const [currency, setCurrency] = useState<'SDG' | 'USD'>('SDG');
  const [amount, setAmount] = useState<number | string>(50000);
  const [customAmount, setCustomAmount] = useState('');
  
  // Confirmation state
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [transferRef, setTransferRef] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedPurpose = OFFICIAL_DONATION_INFO.purposes.find(p => p.id === selectedPurposeId) 
    || OFFICIAL_DONATION_INFO.purposes[0];

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

  const handleSendWhatsAppNotification = () => {
    const cleanNumber = OFFICIAL_DONATION_INFO.whatsappNotify.replace(/[^0-9]/g, '');
    const amountText = amount ? `${amount} ${currency === 'SDG' ? 'جنيه سوداني' : 'دولار'}` : 'تبرع مبارك';
    const msg = `السلام عليكم ورحمة الله وبركاته،
أود إرسال إشعار تحويل تبرع إلى مجمع النور الإسلامي العالمي:
• البنك: ${OFFICIAL_DONATION_INFO.bankShort}
• رقم الحساب: ${OFFICIAL_DONATION_INFO.accountNumber}
• باسم: ${OFFICIAL_DONATION_INFO.accountHolder}
• وجه التبرع: ${selectedPurpose.titleAr}
• المبلغ: ${amountText}
${donorName ? `• اسم المتبرع: ${donorName}\n` : ''}${donorPhone ? `• رقم الهاتف: ${donorPhone}\n` : ''}${transferRef ? `• رقم عملية التحويل / الإشعار: ${transferRef}\n` : ''}
بارك الله في جهودكم وجزاكم الله خيراً.`;
    
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmitNotice = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <>
      {/* =========================================================================
          1. FLOATING ACTION BUTTON (Wheat Stalk on Hand - السنبلة النابتة على يد)
          Balanced & non-intrusive placement: Sits on the right (RTL) opposite WhatsApp (left)
          ========================================================================= */}
      <div 
        className={`fixed bottom-20 xl:bottom-6 z-40 ${
          isRtl ? 'right-4 sm:right-6' : 'left-4 sm:left-6'
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          aria-label="تبرع للأيتام والمجمع - بنك الخرطوم 1727654"
          className="group relative flex items-center gap-2.5 bg-gradient-to-tr from-[#0F1E36] via-[#112445] to-[#0A172D] text-amber-300 p-2.5 sm:px-4 sm:py-3 rounded-full shadow-[0_8px_30px_rgba(212,175,55,0.35)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.6)] border-2 border-[#D4AF37] hover:border-yellow-300 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-xl"
        >
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-emerald-500/30 blur-sm group-hover:opacity-100 opacity-60 animate-pulse pointer-events-none" />

          {/* Official Complex Crest Emblem Icon */}
          <div className="relative shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37] via-[#FFFBEB] to-[#F59E0B] flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.7)] group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <img 
              src={OFFICIAL_COMPLEX_LOGO} 
              alt="شعار مجمع النور الإسلامي العالمي" 
              className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" 
            />
          </div>

          {/* Label & Account Badge (Compact & Pristine) */}
          <div className="flex flex-col text-right pr-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-amiri font-black text-xs sm:text-sm text-yellow-300 tracking-wide leading-tight group-hover:text-yellow-200">
                مجمع النور • كفالة وتبرع
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-200/90 leading-none mt-0.5">
              بنك الخرطوم: {OFFICIAL_DONATION_INFO.accountNumber}
            </span>
          </div>

          {/* Quick Notification Dot */}
          <span className="absolute -top-1 -left-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-slate-950"></span>
          </span>
        </button>
      </div>

      {/* =========================================================================
          2. LUXURY ISLAMIC DONATION MODAL (Bank of Khartoum 1727654)
          ========================================================================= */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-gradient-to-b from-[#0B132B] via-[#070D1E] to-[#050914] border-2 border-[#D4AF37]/60 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden my-auto text-slate-100"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 z-20 p-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
              aria-label="إغلاق نافذة التبرع"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header: Emblem, Quranic Ayah & Identity */}
            <div className="relative p-5 sm:p-7 bg-gradient-to-b from-[#111C3D] to-[#0B132B] border-b border-[#D4AF37]/30 text-center">
              
              {/* Official Crest Icon */}
              <div className="flex justify-center mb-3">
                <div className="relative p-2 bg-[#070D1E]/90 rounded-2xl border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                  <img 
                    src={OFFICIAL_COMPLEX_LOGO} 
                    alt="شعار مجمع النور الإسلامي العالمي" 
                    className="h-16 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                  />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070D1E] border border-amber-400/40 text-[11px] font-bold text-amber-300 mb-2">
                <WheatHandSproutIcon className="w-4 h-4" />
                <span>بوابة التبرع وكفالة الأيتام المعتمدة</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400">حساب بنكي مباشر</span>
              </div>

              <h3 className="text-lg sm:text-2xl font-black font-amiri text-white leading-snug">
                مجمع النور الإسلامي العالمي الخيري الشامل
              </h3>

              {/* Quranic Verse Calligraphy */}
              <div className="mt-3 p-3 bg-[#070D1E]/80 rounded-2xl border border-[#D4AF37]/30 max-w-xl mx-auto shadow-inner">
                <p className="font-amiri text-sm sm:text-base text-yellow-200/95 leading-relaxed font-bold">
                  «{OFFICIAL_DONATION_INFO.sloganAyah}»
                </p>
                <span className="text-[10px] text-amber-400/80 font-semibold block mt-1">
                  [{OFFICIAL_DONATION_INFO.sloganAyahRef}]
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 space-y-6 max-h-[72vh] overflow-y-auto custom-scrollbar">

              {/* -----------------------------------------------------------
                  FLAGSHIP BANK CARD: BANK OF KHARTOUM ACCOUNT 1727654
                  ----------------------------------------------------------- */}
              <div className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#121F42] via-[#0D1836] to-[#081024] border-2 border-amber-400/70 shadow-[0_8px_30px_rgba(212,175,55,0.25)]">
                
                {/* Decorative Badge */}
                <div className="flex items-center justify-between gap-3 border-b border-amber-400/20 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <Building2 className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        {OFFICIAL_DONATION_INFO.bankName}
                      </h4>
                      <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        التحويل متاح عبر تطبيق (بنكك - Bankak) من كل أنحاء العالم
                      </span>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold">
                    حساب خيري معتمد
                  </span>
                </div>

                {/* Account Number Box (Central Feature) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#070D1E] border border-amber-400/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
                  <div className="text-center sm:text-right">
                    <span className="text-xs text-amber-300/80 font-bold block mb-1">
                      رقم الحساب البنكي المعتمد:
                    </span>
                    <span className="text-3xl sm:text-4xl font-mono font-black text-amber-300 tracking-wider">
                      {OFFICIAL_DONATION_INFO.accountNumber}
                    </span>
                  </div>

                  {/* Fast 1-Click Copy Button */}
                  <button
                    onClick={handleCopyAccountNumber}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-md ${
                      copiedAccount 
                        ? 'bg-emerald-600 text-white shadow-emerald-500/30' 
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/30 hover:scale-105'
                    }`}
                  >
                    {copiedAccount ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>تم نسخ رقم الحساب!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-950" />
                        <span>نسخ رقم الحساب</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Beneficiary Name & Title */}
                <div className="mt-4 pt-3 border-t border-amber-400/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">اسم صاحب الحساب:</span>
                    <span className="text-amber-200 font-bold text-sm sm:text-base font-amiri block mt-0.5">
                      {OFFICIAL_DONATION_INFO.accountHolder}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">الصفة المؤسسية:</span>
                    <span className="text-slate-200 font-semibold text-xs leading-relaxed block mt-0.5">
                      {OFFICIAL_DONATION_INFO.directorTitle}
                    </span>
                  </div>
                </div>

                {/* Copy All Details Button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleCopyAllDetails}
                    className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAll ? 'تم نسخ كامل بيانات الحساب' : 'نسخ كامل تفاصيل التحويل'}</span>
                  </button>
                </div>

              </div>

              {/* -----------------------------------------------------------
                  DONATION PURPOSE SELECTOR (أوجه التبرع والخير)
                  ----------------------------------------------------------- */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-400 fill-current" />
                    <span>حدد وجه التبرع والصدقة:</span>
                  </label>
                  <span className="text-[11px] text-amber-300 font-medium">
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
                        className={`p-3 rounded-2xl text-right transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#14234C] border-amber-400 shadow-md ring-1 ring-amber-400/50'
                            : 'bg-[#0B132B]/80 hover:bg-[#111C3D] border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                            {p.titleAr}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {p.descAr}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* -----------------------------------------------------------
                  SUGGESTED AMOUNTS & CURRENCY
                  ----------------------------------------------------------- */}
              <div className="space-y-3 p-4 bg-[#0B132B]/70 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    قيمة التبرع المقترحة:
                  </span>
                  
                  {/* Currency Switcher */}
                  <div className="flex items-center rounded-xl bg-[#070D1E] p-1 border border-slate-700 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency('SDG');
                        setAmount(selectedPurpose.suggestedAmountsSdg[1]);
                      }}
                      className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                        currency === 'SDG' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
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
                      className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                        currency === 'USD' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>

                {/* Quick Chips */}
                <div className="grid grid-cols-4 gap-2">
                  {(currency === 'SDG' ? selectedPurpose.suggestedAmountsSdg : selectedPurpose.suggestedAmountsUsd).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setAmount(val);
                        setCustomAmount('');
                      }}
                      className={`py-2 px-1 text-center rounded-xl font-mono font-bold text-xs transition-all cursor-pointer border ${
                        amount === val && !customAmount
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                          : 'bg-[#070D1E] text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {val.toLocaleString()} {currency === 'SDG' ? 'ج.س' : '$'}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="pt-2">
                  <input
                    type="number"
                    placeholder="أو اكتب مبلغاً آخر ترغب بالتبرع به..."
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount(e.target.value ? Number(e.target.value) : '');
                    }}
                    className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* -----------------------------------------------------------
                  WHATSAPP DIRECT NOTIFICATION (Fast Track)
                  ----------------------------------------------------------- */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#0B2518] to-slate-900 border border-emerald-500/40 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-[#25D366]">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">
                      إشعار التحويل عبر واتساب الإدارة المباشر
                    </h5>
                    <p className="text-[11px] text-emerald-200/90 leading-tight">
                      بعد تحويل التبرع عبر تطبيق (بنكك)، أرسل إشعار التحويل لتأكيد القيد واستلام سند الاستلام والدعاء.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendWhatsAppNotification}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-emerald-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>إرسال إشعار التحويل للإدارة على واتساب (+249904499914)</span>
                </button>
              </div>

              {/* -----------------------------------------------------------
                  ONLINE RECEIPT NOTIFICATION FORM (Optional in-app form)
                  ----------------------------------------------------------- */}
              {!isSubmitted ? (
                <form onSubmit={handleSubmitNotice} className="p-4 bg-[#070D1E]/90 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <span className="font-bold text-white block">
                    أو سجّل بيانات التحويل هنا لتوثيق التبرع في سجلات المجمع:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="اسم المتبرع (أو فاعل خير)"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="bg-[#0B132B] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="رقم الهاتف أو الواتساب"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="bg-[#0B132B] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <input 
                    type="text" 
                    placeholder="رقم العملية / الرقم المرجعي للتحويل في تطبيق بنكك"
                    value={transferRef}
                    onChange={(e) => setTransferRef(e.target.value)}
                    className="w-full bg-[#0B132B] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#14234C] hover:bg-[#1C3168] text-amber-300 font-bold rounded-xl border border-amber-400/40 transition-colors cursor-pointer"
                  >
                    تسجيل إشعار التبرع
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-2 animate-fade-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h5 className="font-bold text-emerald-200 text-sm">
                    تقبل الله طاعتكم وصدقتكم المباركة
                  </h5>
                  <p className="font-amiri text-xs sm:text-sm text-yellow-200 font-bold leading-relaxed">
                    «جَزَاكُمُ اللَّهُ خَيْرًا وَبَارَكَ لَكُمْ فِي أَمْوَالِكُمْ وَأَهْلِيكُمْ وَجَعَلَهُ فِي مِيزَانِ حَسَنَاتِكُمْ صَدَقَةً جَارِيَةً يَوْمَ تَلْقَوْنَهُ»
                  </p>
                  <span className="text-[10px] text-slate-400 block">
                    تم تسجيل الإشعار بنجاح، وسيتم تدقيقه من أمانة الصندوق بمجمع النور.
                  </span>
                </div>
              )}

              {/* Hadith on Orphans Blessing */}
              <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-center">
                <span className="font-amiri text-xs sm:text-sm text-rose-200 font-bold">
                  {OFFICIAL_DONATION_INFO.hadithOrphans}
                </span>
                <span className="text-[10px] text-rose-400 block mt-0.5">
                  حديث صحيح · متفق عليه
                </span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#070D1E] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>حساب رسمي موثق ومسجل لدى أمانة مجمع النور الإسلامي العالمي</span>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
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
