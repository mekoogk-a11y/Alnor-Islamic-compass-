import React, { useState } from 'react';
import { Download, Smartphone, Laptop, Check, X, Share2, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'button' | 'badge' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ className = '', variant = 'button' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already installed and running in standalone mode, show confirmation badge or hide
  if (isInstalled) {
    if (variant === 'badge') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full">
          <Check className="w-3.5 h-3.5" />
          <span>التطبيق مثبت على جهازك</span>
        </span>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowModal(true);
    }
  };

  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-emerald-950/40 border border-amber-500/40 shadow-xl text-right space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-white block">ثبّت مجمع النور كتطبيق</span>
              <span className="text-[10px] text-amber-300/80">يعمل بدون إنترنت على الهاتف والحاسوب</span>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تثبيت</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="تثبيت موقع مجمع النور كتطبيق على هاتفك أو حاسوبك"
        className={`flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md shadow-amber-500/25 transition-all transform active:scale-95 ${className}`}
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>تثبيت التطبيق</span>
      </button>

      {/* Guide Modal for iOS Safari / Manual Installation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-right space-y-5 relative">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">تثبيت تطبيق مجمع النور الإسلامي</h3>
                <span className="text-xs text-emerald-400 font-medium">سريع وخفيف ويعمل كتطبيق أصلي</span>
              </div>
            </div>

            {isIOS ? (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
                <div className="font-bold text-amber-300 flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span>خطوات التثبيت على الآيفون والآيباد (iOS):</span>
                </div>
                <ol className="space-y-2 list-decimal list-inside pr-1 text-slate-200">
                  <li>اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح سفاري بالأسفل.</li>
                  <li>مرر للأسفل واضغط على <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.</li>
                  <li>اضغط <strong>إضافة (Add)</strong> بالأعلى لتظهر أيقونة المجمع على شاشتك.</li>
                </ol>
              </div>
            ) : (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
                <div className="font-bold text-amber-300 flex items-center gap-2">
                  <Laptop className="w-4 h-4" />
                  <span>خطوات التثبيت على الهاتف والحاسوب:</span>
                </div>
                <ul className="space-y-2 text-slate-200">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>على الحاسوب (Chrome / Edge):</strong> اضغط على أيقونة التثبيت في شريط العنوان أعلى المتصفح.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>على الأندرويد:</strong> اضغط على القائمة (الثلاث نقاط) واختر "تثبيت التطبيق" أو "إضافة للشاشة الرئيسية".</span>
                  </li>
                </ul>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </>
  );
};
