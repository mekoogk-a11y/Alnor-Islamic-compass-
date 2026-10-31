import React from 'react';
import { 
  User, BookOpen, GraduationCap, Award, Bookmark, 
  Calendar, CheckCircle, Clock, ArrowLeft, LogOut, ShieldCheck, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ACADEMY_COURSES } from '../../data/hadithAndScholarsData';
import { NavigationPage } from '../../types';

interface UserDashboardPageProps {
  onNavigate: (page: NavigationPage, params?: any) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ onNavigate }) => {
  const { user, logout, openAuthModal, updateMemorizationProgress } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 my-12" dir="rtl">
        <User className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">بوابة الطالب والباحث</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          يرجى تسجيل الدخول أو إنشاء حساب للوصول إلى لوحة المتابعة الشخصية، ومتابعة حفظ القرآن، والدورات المسجلة.
        </p>
        <button
          onClick={openAuthModal}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm transition"
        >
          تسجيل الدخول / إنشاء حساب
        </button>
      </div>
    );
  }

  // Calculate stats
  const memorizationPercentage = Math.round(((user.memorizedJuzCount || 0) / 60) * 100);
  const enrolledCoursesData = ACADEMY_COURSES.filter((c) =>
    user.enrolledCourses?.some((ec) => ec.courseId === c.id)
  );

  return (
    <div className="space-y-8" dir="rtl">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border-2 border-amber-500/60 flex items-center justify-center text-amber-400 shadow-xl shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {user.role === 'admin' ? 'مشرف عام' : user.role === 'teacher' ? 'مقرئ معتمد' : 'طالب علم'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {user.email} • {user.country || 'العالم الإسلامي'} • عضو منذ {user.joinedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700/60 text-xs transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards: Quran Memorization & Reading Streak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quran Memorization Card */}
        <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">تقدم حفظ القرآن الكريم (الأحزاب)</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {user.memorizedJuzCount || 0} من أصل 60 حزباً
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span>نسبة الإنجاز الإجمالي</span>
              <span className="text-amber-400">{memorizationPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(3, memorizationPercentage))}%` }}
              />
            </div>
          </div>

          {/* Quick Controls to increment/decrement memorization */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <span className="text-slate-400">تحديث تقدم الحفظ بعد التسميع:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateMemorizationProgress(Math.max(0, (user.memorizedJuzCount || 0) - 1))}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold"
              >
                -1 حزب
              </button>
              <button
                onClick={() => updateMemorizationProgress(Math.min(60, (user.memorizedJuzCount || 0) + 1))}
                className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold"
              >
                +1 حزب جديد
              </button>
            </div>
          </div>

          {/* Next Halaqa Slot */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">موعد حلقة التسميع القادمة:</span>
              <span className="text-white font-bold">اليوم، 05:00 م (توقيت مكة المكرمة)</span>
            </div>
            <button
              onClick={() => onNavigate('academy')}
              className="text-amber-400 hover:underline font-bold"
            >
              دخول المقرأة
            </button>
          </div>
        </div>

        {/* Last Read Bookmark */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Bookmark className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">علامة القراءة الأخيرة</h3>
            </div>

            {user.lastReadAyah ? (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-amber-300 block">
                  سورة {user.lastReadAyah.surahName}
                </span>
                <p className="text-xs text-slate-400">
                  الآية رقم <span className="font-mono text-white">{user.lastReadAyah.ayahNumber}</span> (صفحة {user.lastReadAyah.page})
                </p>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-amber-300 block">سورة الكهف</span>
                <p className="text-xs text-slate-400">الآية رقم 1 • الجزء 15</p>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('quran')}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/10"
          >
            مواصلة القراءة من المصحف
          </button>
        </div>
      </div>

      {/* Enrolled Academy Courses */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">الدورات والمسارات المسجل بها</h3>
          </div>
          <button
            onClick={() => onNavigate('academy')}
            className="text-xs text-amber-400 hover:underline font-bold"
          >
            تصفح كل الدورات
          </button>
        </div>

        {enrolledCoursesData.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <p className="text-xs">لست مسجلاً في أي دورة حالياً.</p>
            <button
              onClick={() => onNavigate('academy')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
            >
              استكشف دورات أكاديمية النور
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCoursesData.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{course.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    نشطة
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{course.instructor}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>نسبة إتمام الدروس</span>
                    <span className="text-emerald-400 font-mono">65%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Certificates */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">الشهادات والإجازات المكتسبة</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{user.certificates?.length || 0} إجازات</span>
        </div>

        {user.certificates && user.certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 bg-slate-950 rounded-2xl border border-emerald-900/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-amber-400 font-bold">{cert.certificateNumber}</span>
                  <span className="text-[10px] text-slate-500">{cert.issueDate}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{cert.courseName}</h4>
                <p className="text-slate-400 text-[11px]">المشرف والمجيز: {cert.scholarName}</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">التقدير: {cert.grade}</span>
                  <button
                    onClick={() => alert(`جاري تنزيل ملف الإجازة الرسمية للشهادة رقم: ${cert.certificateNumber}`)}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    تحميل بصيغة PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs">
            لا توجد شهادات صادرة بعد. أكمل مقررات الأكاديمية واجتز اختبار المقرأة للحصول على إجازتك المعتمدة.
          </div>
        )}
      </div>
    </div>
  );
};
