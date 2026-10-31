import React, { useState } from 'react';
import { X, User, Mail, ShieldCheck, Lock, Sparkles, BookOpen, GraduationCap, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, error, clearError, user } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('المملكة العربية السعودية');
  const [role, setRole] = useState<UserRole>('student');
  const [memorizedJuzCount, setMemorizedJuzCount] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    try {
      if (isRegisterMode) {
        await register({
          name: name.trim() || 'طالب علم النور',
          email: email.trim(),
          role,
          country,
          memorizedJuzCount,
        });
      } else {
        await login(email.trim() || 'student@alnoor-global.org');
      }
      closeAuthModal();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (demoRole: UserRole, demoName: string, demoEmail: string) => {
    setIsSubmitting(true);
    clearError();
    register({
      name: demoName,
      email: demoEmail,
      role: demoRole,
      country: 'المملكة العربية السعودية',
      memorizedJuzCount: demoRole === 'hafiz' ? 30 : 5,
    }).then(() => {
      setIsSubmitting(false);
      closeAuthModal();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-emerald-800/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right text-slate-100"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>البوابة الرقمية الموحدة لمجمع النور</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {isRegisterMode ? 'إنشاء حساب طالب أو مقرئ جديد' : 'تسجيل الدخول إلى حسابك'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    الاسم الكامل (كما يظهر في الشهادات)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: عبد الرحمن بن إبراهيم"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    نوع الحساب والدور التعليمي
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'student', label: 'طالب علم / متدرب', desc: 'لحفظ ومراجعة القرآن' },
                      { id: 'hafiz', label: 'حافظ / باحث إجازة', desc: 'لإتقان القراءات العشر' },
                      { id: 'teacher', label: 'أستاذ / مقرئ معتمد', desc: 'لإدارة الحلقات والمقارئ' },
                      { id: 'visitor', label: 'زائر / داعم للوقف', desc: 'لمتابعة الأنشطة والتقارير' },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setRole(opt.id as UserRole)}
                        className={`p-2.5 rounded-xl border text-right transition ${
                          role === opt.id
                            ? 'bg-emerald-950/80 border-amber-500 text-white font-bold'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <p className="text-amber-300">{opt.label}</p>
                        <p className="text-[10px] text-slate-400 font-normal mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">الدولة</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">الأحزاب المحفوظة حالياً</label>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={memorizedJuzCount}
                      onChange={(e) => setMemorizedJuzCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                البريد الإلكتروني المؤسسي أو الشخصي
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري المعالجة...' : isRegisterMode ? 'إكمال إنشاء الحساب والانضمام' : 'تسجيل الدخول الفوري'}
            </button>
          </form>

          {/* Quick Demo Logins for immediate evaluation */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <p className="text-[11px] text-slate-400 text-center font-medium">
              أو اختر حساباً تجريبياً جاهزاً للدخول السريع:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('student', 'محمد عبد الله القاسمي', 'student@alnoor-global.org')}
                className="p-2 bg-slate-950 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-700/60 rounded-xl text-right transition"
              >
                <span className="font-bold text-white block">طالب علم نموذجي</span>
                <span className="text-[10px] text-slate-400">لوحة المتابعة وحفظ القرآن</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin', 'أمانة مجمع النور العالمية', 'admin@alnoor-global.org')}
                className="p-2 bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-700/60 rounded-xl text-right transition"
              >
                <span className="font-bold text-amber-400 block">مدير المنصة (Admin)</span>
                <span className="text-[10px] text-slate-400">إدارة المقارئ والتقارير العامة</span>
              </button>
            </div>
          </div>

          {/* Toggle Register / Signin */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                clearError();
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
            >
              {isRegisterMode ? 'لديك حساب بالفعل؟ سجّل دخولك من هنا' : 'مستخدم جديد؟ اضغط هنا لإنشاء حساب طالب أو مقرئ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
