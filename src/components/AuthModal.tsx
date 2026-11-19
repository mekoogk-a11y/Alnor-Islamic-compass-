import React, { useState } from 'react';
import { X, User, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, loginWithGoogle, register, error, clearError } = useAuth();
  const { isRtl } = useLanguage();
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
    })
      .then(() => {
        closeAuthModal();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A223D]/75 backdrop-blur-md">
      <div
        className={`w-full max-w-lg bg-white dark:bg-[#0F2747] border border-[#12345A]/20 dark:border-[#87CEEB]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col ${
          isRtl ? 'text-right' : 'text-left'
        } text-[#12345A] dark:text-[#EAF8FF]`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-l from-[#12345A] to-[#0E3F66] border-b border-[#D4AF37]/30 flex items-center justify-between text-white">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F7E7B4]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>البوابة الرقمية الموحدة لمجمع النور</span>
            </div>
            <h3 className="text-xl font-black font-amiri text-white">
              {isRegisterMode ? 'إنشاء حساب طالب أو مقرئ جديد' : 'تسجيل الدخول إلى حسابك'}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="min-h-[40px] min-w-[40px] p-2 text-white/80 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="إغلاق نافذة تسجيل الدخول"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="p-3 bg-[#FEF2F2] dark:bg-[#7F1D1D]/40 border border-[#DC2626]/40 text-[#B91C1C] dark:text-[#FCA5A5] text-xs font-bold rounded-xl">
              {error}
            </div>
          )}

          {/* Firebase Google Auth Button */}
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full min-h-[44px] py-2.5 px-4 bg-[#EAF8FF] hover:bg-[#D8F1FD] dark:bg-[#0A223D] dark:hover:bg-[#133158] text-[#12345A] dark:text-[#EAF8FF] font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2.5 border border-[#12345A]/15 dark:border-[#87CEEB]/25 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>الدخول السريع بحساب Google المعتمد</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-[#4A7298] dark:text-[#84B4D6]">
            <div className="flex-1 h-px bg-[#12345A]/15 dark:bg-[#87CEEB]/20" />
            <span>أو عبر البريد الإلكتروني</span>
            <div className="flex-1 h-px bg-[#12345A]/15 dark:bg-[#87CEEB]/20" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] mb-1.5">
                    الاسم الكامل (كما يظهر في الشهادات)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: عبد الرحمن بن إبراهيم"
                      className="w-full min-h-[42px] px-4 py-2.5 bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 rounded-xl text-[#12345A] dark:text-[#EAF8FF] text-sm focus:outline-none focus:border-[#0EA5A4]"
                    />
                    <User className="w-4 h-4 text-[#4A7298] absolute left-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] mb-1.5">
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
                        className={`p-2.5 rounded-xl border text-right transition-colors cursor-pointer ${
                          role === opt.id
                            ? 'bg-[#12345A] border-[#D4AF37] text-white font-bold'
                            : 'bg-[#EAF8FF] dark:bg-[#0A223D] border-[#12345A]/15 dark:border-[#87CEEB]/20 text-[#2B547E] dark:text-[#B8DEF5] hover:border-[#0EA5A4]'
                        }`}
                      >
                        <p className={role === opt.id ? 'text-[#F7E7B4]' : 'text-[#12345A] dark:text-[#EAF8FF]'}>
                          {opt.label}
                        </p>
                        <p className="text-[10px] opacity-80 font-normal mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] mb-1.5">
                      الدولة
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 rounded-xl text-[#12345A] dark:text-[#EAF8FF] text-sm focus:outline-none focus:border-[#0EA5A4]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] mb-1.5">
                      الأحزاب المحفوظة حالياً
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={memorizedJuzCount}
                      onChange={(e) => setMemorizedJuzCount(Number(e.target.value))}
                      className="w-full min-h-[42px] px-3 py-2 bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 rounded-xl text-[#12345A] dark:text-[#EAF8FF] text-sm font-mono tabular-nums focus:outline-none focus:border-[#0EA5A4]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] mb-1.5">
                البريد الإلكتروني المؤسسي أو الشخصي
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full min-h-[42px] px-4 py-2.5 bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 rounded-xl text-[#12345A] dark:text-[#EAF8FF] text-sm focus:outline-none focus:border-[#0EA5A4]"
                />
                <Mail className="w-4 h-4 text-[#4A7298] absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[44px] py-3 bg-[#12345A] hover:bg-[#0E3F66] text-white font-black rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? 'جاري المعالجة...'
                : isRegisterMode
                ? 'إكمال إنشاء الحساب والانضمام'
                : 'تسجيل الدخول الفوري'}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-3 border-t border-[#12345A]/12 dark:border-[#87CEEB]/20 space-y-2">
            <p className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] text-center font-semibold">
              أو اختر حساباً تجريبياً جاهزاً للدخول السريع:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo('student', 'محمد عبد الله القاسمي', 'student@alnoor-global.org')
                }
                className="p-2.5 bg-[#EAF8FF] dark:bg-[#0A223D] hover:bg-[#D8F1FD] border border-[#12345A]/15 dark:border-[#87CEEB]/20 rounded-xl text-right transition-colors cursor-pointer"
              >
                <span className="font-bold text-[#12345A] dark:text-[#EAF8FF] block">طالب علم نموذجي</span>
                <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6]">
                  لوحة المتابعة وحفظ القرآن
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo('admin', 'أمانة مجمع النور العالمية', 'admin@alnoor-global.org')
                }
                className="p-2.5 bg-[#EAF8FF] dark:bg-[#0A223D] hover:bg-[#D8F1FD] border border-[#D4AF37]/45 rounded-xl text-right transition-colors cursor-pointer"
              >
                <span className="font-bold text-[#0D7A7A] dark:text-[#F7E7B4] block">
                  مدير المنصة (Admin)
                </span>
                <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6]">
                  إدارة المقارئ والتقارير العامة
                </span>
              </button>
            </div>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                clearError();
              }}
              className="text-xs text-[#0D7A7A] dark:text-[#2DD4BF] hover:underline font-bold cursor-pointer"
            >
              {isRegisterMode
                ? 'لديك حساب بالفعل؟ سجّل دخولك من هنا'
                : 'مستخدم جديد؟ اضغط هنا لإنشاء حساب طالب أو مقرئ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
