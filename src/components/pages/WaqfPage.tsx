import React, { useState } from 'react';
import {
  HeartHandshake, Calculator, Copy, Check,
  ShieldCheck, ArrowLeft
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { COMPLEX_INFO, WAQF_PROJECTS, OFFICIAL_DONATION_INFO } from '../../data/islamicData';
import { useToast } from '../../context/ToastContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface WaqfPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const WaqfPage: React.FC<WaqfPageProps> = () => {
  const { showToast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Zakat Calculator State
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [goldGrams, setGoldGrams] = useState<number>(0);
  const [goldGramPrice] = useState<number>(75); // USD average
  const [silverGrams] = useState<number>(0);
  const [silverGramPrice] = useState<number>(1);
  const [tradeGoods, setTradeGoods] = useState<number>(0);
  const [debtsDue, setDebtsDue] = useState<number>(0);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Calculations
  const goldValue = goldGrams * goldGramPrice;
  const silverValue = silverGrams * silverGramPrice;
  const totalAssets = Math.max(0, cashAmount + goldValue + silverValue + tradeGoods - debtsDue);

  // Nisab threshold based on 85g of pure gold
  const nisabThreshold = 85 * goldGramPrice;
  const isNisabReached = totalAssets >= nisabThreshold;
  const zakatDue = isNisabReached ? totalAssets * 0.025 : 0;

  return (
    <div className="space-y-10" dir="rtl">

      {/* Sky-Blue 3D Header */}
      <div className="bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] border border-[#87CEEB]/55 rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 text-center text-white">
        <div className="flex justify-center">
          <Sky3DIcon slug="waqf" tone="turquoise" size="lg" />
        </div>

        <p className="text-xs font-bold text-[#87CEEB] flex items-center justify-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-[#F7E7B4]" />
          <span>الأوقاف والمشاريع الخيرية التنموية · مجمع النور العالمي</span>
        </p>

        <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white">
          أجرٌ جاري وصدقةٌ مباركة تدوم إلى يوم الدين
        </h1>

        <p className="text-xs sm:text-sm text-[#D7F1FC] max-w-2xl mx-auto leading-relaxed">
          تساهم أوقاف مجمع النور الإسلامي في كفالة آلاف الحلقات القرآنية، ورعاية حفظة كتاب الله، وطباعة المصاحف، عبر صناديق وقفية شرعية خاضعة للرقابة المالية والحوكمة المؤسسية.
        </p>
      </div>

      {/* Official Institutional Waqf Account Card (Bank of Khartoum 1727654) */}
      <div className="bg-gradient-to-br from-[#12345A] via-[#0F2747] to-[#0A223D] border-2 border-[#D4AF37]/75 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-center text-white">
        <p className="inline-flex items-center gap-2 text-xs font-bold text-[#F7E7B4]">
          <ShieldCheck className="w-4 h-4 text-[#5EEAD4]" />
          <span>القنوات المصرفية والتحويلات الوقفية الرسمية المعتمدة</span>
        </p>

        <h2 className="text-xl sm:text-3xl font-black text-white font-amiri">
          الحساب البنكي المعتمد لمجمع النور الإسلامي العالمي
        </h2>

        {/* Bank Highlight Card */}
        <div className="max-w-2xl mx-auto p-5 sm:p-6 bg-[#0A223D]/90 rounded-2xl border border-[#87CEEB]/45 shadow-inner space-y-4 text-right">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#87CEEB]/25 pb-4">
            <div>
              <span className="text-xs text-[#F7E7B4] font-bold block">
                {OFFICIAL_DONATION_INFO.bankName}
              </span>
              <span className="text-[11px] text-[#5EEAD4] font-medium">
                تطبيق بنكك (Bankak) متاح 24/7 من داخل وخارج السودان
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#12345A] px-3.5 py-2 rounded-xl border border-[#D4AF37]/50">
              <span className="text-2xl font-mono font-black text-[#F7E7B4]">
                {OFFICIAL_DONATION_INFO.accountNumber}
              </span>
              <button
                type="button"
                onClick={() => handleCopy('bankak', OFFICIAL_DONATION_INFO.accountNumber)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  copiedKey === 'bankak'
                    ? 'bg-[#0EA5A4] text-white'
                    : 'bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] font-black'
                }`}
              >
                {copiedKey === 'bankak' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'bankak' ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#87CEEB] block text-[11px]">اسم صاحب الحساب:</span>
              <span className="text-[#F7E7B4] font-bold text-sm font-amiri block mt-0.5">
                {OFFICIAL_DONATION_INFO.accountHolder}
              </span>
            </div>
            <div>
              <span className="text-[#87CEEB] block text-[11px]">الصفة المؤسسية:</span>
              <span className="text-[#D7F1FC] font-medium text-xs block mt-0.5 leading-relaxed">
                {OFFICIAL_DONATION_INFO.directorTitle}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#87CEEB]/25 flex flex-wrap items-center justify-between gap-2 text-xs text-[#BCE7FB]">
            <span>إشعار التحويل المباشر: {OFFICIAL_DONATION_INFO.whatsappNotify}</span>
            <span>البريد المعتمد: {COMPLEX_INFO.officialEmail}</span>
          </div>
        </div>
      </div>

      {/* Featured Waqf & Charity Projects */}
      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
            مشاريع الصدقة الجارية والوقف
          </p>
          <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white mt-1">
            صناديق الوقف القرآني المفتوحة للمساهمة
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {WAQF_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="sky-card-3d rounded-3xl p-6 space-y-4 text-right flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
                    {project.category}
                  </span>
                  <span className="text-[#0EA5A4] font-bold">
                    قيمة السهم المقترح: ${project.shareAmount || 50}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black font-amiri text-[#12345A] dark:text-white leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                  {project.description}
                </p>

                <div className="p-3 rounded-2xl bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                  <span className="font-bold text-[#12345A] dark:text-[#87CEEB] block mb-0.5">نطاق المصرف الشرعي للبرنامج:</span>
                  <span>متاح للمساهمة الموثقة وإصدار إشعار استلام رسمي عبر الإدارة المالية للمجمع.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 flex items-center justify-between text-xs">
                <span className="text-[#4A7298] dark:text-[#B8DEF5] font-semibold">سهم وقفي باسمك أو باسم والديك</span>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`للمساهمة في مشروع «${project.title}»، يرجى التحويل عبر الحساب المعتمد (${OFFICIAL_DONATION_INFO.accountNumber}) وإرسال الإشعار عبر واتساب أو البريد ${COMPLEX_INFO.officialEmail}`, 'info');
                  }}
                  className="bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>ساهم عبر القناة الرسمية</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Zakat Calculator */}
      <div className="sky-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F7E7B4] to-[#D4AF37] text-[#12345A] flex items-center justify-center shadow-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#12345A] dark:text-white">
                حاسبة الزكاة الشرعية الذكية
              </h3>
              <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                احسب زكاة أموالك والذهب والفضة وعروض التجارة بدقة وفق الشريعة الإسلامية
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#0D7A7A] dark:text-[#87CEEB] hidden sm:inline">
            نسبة الزكاة الواجبة: 2.5% (ربع العشر)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">

          <div className="space-y-1 text-right">
            <label className="text-[#12345A] dark:text-[#EAF8FF] font-bold block">الأموال النقدية والودائع البنكية ($):</label>
            <input
              type="number"
              min="0"
              value={cashAmount || ''}
              onChange={(e) => setCashAmount(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded-xl p-2.5 text-[#12345A] dark:text-white font-mono"
            />
          </div>

          <div className="space-y-1 text-right">
            <label className="text-[#12345A] dark:text-[#EAF8FF] font-bold block">وزن الذهب المدخر (جرام):</label>
            <input
              type="number"
              min="0"
              value={goldGrams || ''}
              onChange={(e) => setGoldGrams(Number(e.target.value))}
              placeholder="نصاب الذهب 85 جرام"
              className="w-full bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded-xl p-2.5 text-[#12345A] dark:text-white font-mono"
            />
            <span className="text-[10px] text-[#4A7298] dark:text-[#B8DEF5] block">سعر الجرام المقدر: ${goldGramPrice}</span>
          </div>

          <div className="space-y-1 text-right">
            <label className="text-[#12345A] dark:text-[#EAF8FF] font-bold block">عروض التجارة والبضائع ($):</label>
            <input
              type="number"
              min="0"
              value={tradeGoods || ''}
              onChange={(e) => setTradeGoods(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded-xl p-2.5 text-[#12345A] dark:text-white font-mono"
            />
          </div>

          <div className="space-y-1 text-right">
            <label className="text-[#12345A] dark:text-[#EAF8FF] font-bold block">الديون والالتزامات العاجلة الخصم ($):</label>
            <input
              type="number"
              min="0"
              value={debtsDue || ''}
              onChange={(e) => setDebtsDue(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded-xl p-2.5 text-[#12345A] dark:text-white font-mono"
            />
          </div>

        </div>

        {/* Calculation Result Banner */}
        <div className="p-6 bg-[#EAF8FF]/85 dark:bg-[#0F2747] rounded-2xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">حالة النصاب الشرعي:</span>
              <span className={`text-xs font-black ${
                isNisabReached ? 'text-[#0EA5A4]' : 'text-[#4A7298] dark:text-[#B8DEF5]'
              }`}>
                {isNisabReached ? 'بلغ النصاب الشرعي ✓' : 'لم يبلغ النصاب (أقل من 85 جرام ذهب)'}
              </span>
            </div>
            <div className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
              إجمالي الوعاء الزكوي الخاضع: <strong className="text-[#12345A] dark:text-white font-mono">${totalAssets.toLocaleString()}</strong>
            </div>
          </div>

          <div className="p-3 bg-[#12345A] rounded-2xl text-center sm:text-left min-w-[200px] shadow-md">
            <span className="text-[11px] text-[#87CEEB] block font-semibold">مقدار الزكاة الواجب إخراجها:</span>
            <span className="text-2xl font-black font-mono text-[#F7E7B4] block mt-0.5">
              ${zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

      </div>

      <SectionDynamicItems sectionSlug="waqf" />

    </div>
  );
};
