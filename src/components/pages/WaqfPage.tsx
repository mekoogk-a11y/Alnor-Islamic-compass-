import React, { useState } from 'react';
import { 
  HeartHandshake, CreditCard, Calculator, Copy, Check, 
  ShieldCheck, Sparkles, Building, BookOpen, Users, FileText, ArrowLeft 
} from 'lucide-react';
import { NavigationPage, WaqfProject } from '../../types';
import { COMPLEX_INFO, WAQF_PROJECTS } from '../../data/islamicData';

interface WaqfPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const WaqfPage: React.FC<WaqfPageProps> = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Zakat Calculator State
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [goldGrams, setGoldGrams] = useState<number>(0);
  const [goldGramPrice, setGoldGramPrice] = useState<number>(75); // USD average
  const [silverGrams, setSilverGrams] = useState<number>(0);
  const [silverGramPrice, setSilverGramPrice] = useState<number>(1); // USD average
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
    <div className="space-y-10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 border border-emerald-900/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
          <HeartHandshake className="w-4 h-4" />
          <span>الأوقاف والمشاريع الخيرية التنموية • مجمع النور العالمي</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          أجرٌ جاري وصدقةٌ مباركة تدوم إلى يوم الدين
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          تساهم أوقاف مجمع النور الإسلامي في كفالة آلاف الحلقات القرآنية، ورعاية حفظة كتاب الله، وطباعة المصاحف، عبر صناديق وقفية شرعية خاضعة للرقابة المالية والحوكمة المؤسسية.
        </p>
      </div>

      {/* Official Institutional Waqf Accounts Status (Without fake banks) */}
      <div className="bg-slate-900/90 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>القنوات المصرفية والتحويلات الوقفية الرسمية</span>
        </div>

        <h2 className="text-lg sm:text-2xl font-black text-white">
          الحسابات البنكية المعتمدة لمجمع النور الإسلامي
        </h2>

        <div className="max-w-2xl mx-auto p-6 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            تخضع جميع التبرعات والمساهمات الوقفية لمجمع النور الإسلامي لأعلى معايير الحوكمة المؤسسية والشفافية الشرعية.
          </p>
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 font-medium text-xs sm:text-sm">
            جاري تحديث وتوثيق بيانات الحسابات المصرفية الدولية من قِبل الإدارة العامة للشؤون المالية للمجمع، وسيتم رفعها ونشرها رسمياً في هذه الصفحة فور اكتمال الاعتماد المالي.
          </div>
          <p className="text-slate-400 text-xs">
            للتواصل المباشر مع أمانة الوقف أو الاستفسار المؤسسي، يرجى المراسلة عبر البريد الإلكتروني الرسمي المعتمد:
            <span className="font-mono text-amber-400 font-bold block mt-1.5">{COMPLEX_INFO.officialEmail}</span>
          </p>
        </div>
      </div>

      {/* Featured Waqf & Charity Projects */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
            مشاريع الصدقة الجارية والوقف
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            صناديق الوقف القرآني المفتوحة للمساهمة
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {WAQF_PROJECTS.map((project) => {
            const collected = project.collectedAmount ?? project.currentAmount ?? 0;
            const percentage = Math.min(100, Math.round((collected / project.targetAmount) * 100));
            return (
              <div
                key={project.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-right flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                      {project.category}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      سهم المشاركة: ${project.shareAmount || 50}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="text-xs text-slate-400 font-medium">
                    الأثر المبارك: <strong className="text-white">{project.beneficiaries || `${project.beneficiariesCount || 1000} مستفيد`}</strong>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>تم جمع: ${collected.toLocaleString()}</span>
                      <span>الهدف: ${project.targetAmount.toLocaleString()} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">سهم وقفي باسمك أو باسم والديك</span>
                  <button
                    onClick={() => {
                      alert(`للمساهمة في مشروع «${project.title}»، يرجى التحويل عبر أحد الحسابات البنكية الرسمية أعلاه، مع إرسال الإشعار إلى ${COMPLEX_INFO.officialEmail}`);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span>ساهم الآن</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Zakat Calculator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                حاسبة الزكاة الشرعية الذكية
              </h3>
              <p className="text-xs text-slate-400">
                احسب زكاة أموالك والذهب والفضة وعروض التجارة بدقة وفق الشريعة الإسلامية
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20 hidden sm:inline">
            نسبة الزكاة الواجبة: 2.5% (ربع العشر)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="space-y-1 text-right">
            <label className="text-slate-300 font-bold block">الأموال النقدية والودائع البنكية ($):</label>
            <input
              type="number"
              min="0"
              value={cashAmount || ''}
              onChange={(e) => setCashAmount(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div className="space-y-1 text-right">
            <label className="text-slate-300 font-bold block">وزن الذهب المدخر (جرام):</label>
            <input
              type="number"
              min="0"
              value={goldGrams || ''}
              onChange={(e) => setGoldGrams(Number(e.target.value))}
              placeholder="نصاب الذهب 85 جرام"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
            />
            <span className="text-[10px] text-slate-500 block">سعر الجرام المقدر: ${goldGramPrice}</span>
          </div>

          <div className="space-y-1 text-right">
            <label className="text-slate-300 font-bold block">عروض التجارة والبضائع ($):</label>
            <input
              type="number"
              min="0"
              value={tradeGoods || ''}
              onChange={(e) => setTradeGoods(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div className="space-y-1 text-right">
            <label className="text-slate-300 font-bold block">الديون والالتزامات العاجلة الخصم ($):</label>
            <input
              type="number"
              min="0"
              value={debtsDue || ''}
              onChange={(e) => setDebtsDue(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

        </div>

        {/* Calculation Result Banner */}
        <div className="p-6 bg-slate-950 rounded-2xl border border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs text-slate-400">حالة النصاب الشرعي:</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                isNisabReached ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
              }`}>
                {isNisabReached ? 'بلغ النصاب الشرعي ✓' : 'لم يبلغ النصاب (أقل من 85 جرام ذهب)'}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              إجمالي الوعاء الزكوي الخاضع: <strong className="text-white font-mono">${totalAssets.toLocaleString()}</strong>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center sm:text-left min-w-[200px]">
            <span className="text-[11px] text-slate-400 block font-semibold">مقدار الزكاة الواجب إخراجها:</span>
            <span className="text-2xl font-black font-mono text-amber-400 block mt-0.5">
              ${zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
