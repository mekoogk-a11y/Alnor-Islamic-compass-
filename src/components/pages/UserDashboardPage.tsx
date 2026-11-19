import React from 'react';
import {
  User, BookOpen, GraduationCap, Award, Bookmark,
  Calendar, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { ACADEMY_COURSES } from '../../data/hadithAndScholarsData';
import { NavigationPage } from '../../types';
import { Sky3DIcon } from '../Sky3DIcon';

interface UserDashboardPageProps {
  onNavigate: (page: NavigationPage, params?: any) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ onNavigate }) => {
  const { user, logout, openAuthModal, updateMemorizationProgress } = useAuth();
  const { isRtl } = useLanguage();
  const { showToast } = useToast();

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-8 sky-card-3d rounded-3xl text-center space-y-4 my-12" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex justify-center">
          <Sky3DIcon slug="academy" tone="sky" size="md" />
        </div>
        <h2 className="text-xl font-black text-[#12345A] dark:text-white font-amiri">بوابة الطالب والباحث</h2>
        <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
          يرجى تسجيل الدخول أو إنشاء حساب للوصول إلى لوحة المتابعة الشخصية، ومتابعة حفظ القرآن، والدورات المسجلة.
        </p>
        <button
          type="button"
          onClick={openAuthModal}
          className="w-full py-3 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black rounded-xl text-sm transition cursor-pointer shadow-md"
        >
          تسجيل الدخول / إنشاء حساب
        </button>
      </div>
    );
  }

  const memorizationPercentage = Math.round(((user.memorizedJuzCount || 0) / 60) * 100);
  const enrolledCoursesData = ACADEMY_COURSES.filter((c) =>
    user.enrolledCourses?.some((ec) => ec.courseId === c.id)
  );

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sky-Blue 3D Profile Header */}
      <div className="bg-gradient-to-br from-[#12345A] via-[#0E4466] to-[#0EA5A4] border border-[#87CEEB]/55 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 border border-[#D4AF37]/70 flex items-center justify-center text-[#F7E7B4] shadow-lg shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                <span aria-hidden="true" className="text-[#87CEEB]">·</span>
                <span className="text-xs font-bold text-[#F7E7B4]">
                  {user.role === 'admin' ? 'مشرف عام' : user.role === 'teacher' ? 'مقرئ معتمد' : 'طالب علم'}
                </span>
              </div>
              <p className="text-xs text-[#D7F1FC]">
                {user.email} · {user.country || 'العالم الإسلامي'} · عضو منذ {user.joinedDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-rose-600/80 text-white border border-[#87CEEB]/40 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 sky-card-3d rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#0EA5A4]" />
              <h3 className="text-sm font-black text-[#12345A] dark:text-white">تقدم حفظ القرآن الكريم (الأحزاب)</h3>
            </div>
            <span className="text-xs font-mono tabular-nums text-[#0D7A7A] dark:text-[#2DD4BF] font-bold">
              {user.memorizedJuzCount || 0} من أصل 60 حزباً
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#2B547E] dark:text-[#B8DEF5] font-bold">
              <span>نسبة الإنجاز الإجمالي</span>
              <span className="text-[#9E7818] dark:text-[#F7E7B4] tabular-nums">{memorizationPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-[#EAF8FF] dark:bg-[#0F2747] rounded-full overflow-hidden p-0.5 border border-[#87CEEB]/50">
              <div
                className="h-full bg-gradient-to-r from-[#0EA5A4] to-[#D4AF37] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(3, memorizationPercentage))}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <span className="text-[#2B547E] dark:text-[#B8DEF5] font-bold">تحديث تقدم الحفظ بعد التسميع:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateMemorizationProgress(Math.max(0, (user.memorizedJuzCount || 0) - 1))}
                className="px-3 py-1.5 bg-[#EAF8FF] dark:bg-[#0F2747] hover:border-[#0EA5A4] border border-[#87CEEB]/60 text-[#12345A] dark:text-white rounded-lg font-bold cursor-pointer"
              >
                -1 حزب
              </button>
              <button
                type="button"
                onClick={() => updateMemorizationProgress(Math.min(60, (user.memorizedJuzCount || 0) + 1))}
                className="px-3 py-1.5 bg-[#0EA5A4] hover:bg-[#0D7A7A] text-white rounded-lg font-bold cursor-pointer"
              >
                +1 حزب جديد
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-[#EAF8FF]/85 dark:bg-[#0F2747] rounded-2xl border border-[#87CEEB]/50 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0EA5A4]" />
              <span className="text-[#2B547E] dark:text-[#B8DEF5]">موعد حلقة التسميع القادمة:</span>
              <span className="text-[#12345A] dark:text-white font-bold">اليوم، 05:00 م (توقيت مكة المكرمة)</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('academy')}
              className="text-[#0D7A7A] dark:text-[#2DD4BF] hover:underline font-bold cursor-pointer"
            >
              دخول المقرأة
            </button>
          </div>
        </div>

        {/* Last Read Bookmark */}
        <div className="sky-card-3d rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-3">
              <Bookmark className="w-5 h-5 text-[#0EA5A4]" />
              <h3 className="text-sm font-black text-[#12345A] dark:text-white">علامة القراءة الأخيرة</h3>
            </div>

            {user.lastReadAyah ? (
              <div className="p-3.5 bg-[#EAF8FF] dark:bg-[#0F2747] rounded-xl border border-[#87CEEB]/50 space-y-1">
                <span className="text-xs font-black text-[#12345A] dark:text-[#F7E7B4] block">
                  سورة {user.lastReadAyah.surahName}
                </span>
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                  الآية رقم <span className="font-mono font-bold text-[#12345A] dark:text-white">{user.lastReadAyah.ayahNumber}</span> (صفحة {user.lastReadAyah.page})
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-[#EAF8FF] dark:bg-[#0F2747] rounded-xl border border-[#87CEEB]/50 space-y-1">
                <span className="text-xs font-black text-[#12345A] dark:text-[#F7E7B4] block">سورة الكهف</span>
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">الآية رقم 1 · الجزء 15</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('quran')}
            className="w-full py-2.5 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer"
          >
            مواصلة القراءة من المصحف
          </button>
        </div>
      </div>

      {/* Enrolled Academy Courses */}
      <div className="sky-card-3d rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#0EA5A4]" />
            <h3 className="text-sm font-black text-[#12345A] dark:text-white">الدورات والمسارات المسجل بها</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('academy')}
            className="text-xs text-[#0D7A7A] dark:text-[#2DD4BF] hover:underline font-bold cursor-pointer"
          >
            تصفح كل الدورات
          </button>
        </div>

        {enrolledCoursesData.length === 0 ? (
          <div className="p-8 text-center text-[#2B547E] dark:text-[#B8DEF5] space-y-3">
            <p className="text-xs">لست مسجلاً في أي دورة حالياً.</p>
            <button
              type="button"
              onClick={() => onNavigate('academy')}
              className="px-4 py-2 bg-[#12345A] hover:bg-[#0EA5A4] text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              استكشف دورات أكاديمية النور
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCoursesData.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-[#EAF8FF] dark:bg-[#0F2747] rounded-2xl border border-[#87CEEB]/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-[#12345A] dark:text-white">{course.title}</h4>
                  <span className="text-[11px] font-bold text-[#0D7A7A] dark:text-[#2DD4BF]">
                    نشطة
                  </span>
                </div>
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] line-clamp-1">{course.instructor}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#2B547E] dark:text-[#B8DEF5]">
                    <span>نسبة إتمام الدروس</span>
                    <span className="text-[#0D7A7A] dark:text-[#2DD4BF] font-mono tabular-nums font-bold">65%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white dark:bg-[#0A223D] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0EA5A4] rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Certificates */}
      <div className="sky-card-3d rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-sm font-black text-[#12345A] dark:text-white">الشهادات والإجازات المكتسبة</h3>
          </div>
          <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-mono tabular-nums font-bold">{user.certificates?.length || 0} إجازات</span>
        </div>

        {user.certificates && user.certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.certificates.map((cert) => (
              <div
                key={cert.id}
                className="scholarly-reading-paper p-4 rounded-2xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#9E7818] dark:text-[#F7E7B4] font-bold">{cert.certificateNumber}</span>
                  <span className="text-[11px] text-[#4A7298] dark:text-[#B8DEF5]">{cert.issueDate}</span>
                </div>
                <h4 className="text-sm font-black text-[#12345A] dark:text-white">{cert.courseName}</h4>
                <p className="text-[#2B547E] dark:text-[#B8DEF5] text-[11px]">المشرف والمجيز: {cert.scholarName}</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[#0D7A7A] dark:text-[#2DD4BF] font-bold">التقدير: {cert.grade}</span>
                  <button
                    type="button"
                    onClick={() => showToast(`جاري تجهيز ملف الإجازة الرسمية للشهادة رقم: ${cert.certificateNumber}`, 'info')}
                    className="text-[#12345A] dark:text-[#F7E7B4] hover:underline font-bold cursor-pointer"
                  >
                    تحميل بصيغة PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-[#2B547E] dark:text-[#B8DEF5] text-xs">
            لا توجد شهادات صادرة بعد. أكمل مقررات الأكاديمية واجتز اختبار المقرأة للحصول على إجازتك المعتمدة.
          </div>
        )}
      </div>
    </div>
  );
};
