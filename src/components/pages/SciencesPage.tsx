import React, { useState } from 'react';
import {
  GraduationCap, BookOpen, Clock, CheckCircle2,
  Award, FileText, ChevronDown, ChevronUp, ArrowLeft, Scroll, Users
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { ISLAMIC_COURSES } from '../../data/islamicData';
import { useLanguage } from '../../context/LanguageContext';

interface SciencesPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const SciencesPage: React.FC<SciencesPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(ISLAMIC_COURSES[0]?.id || null);

  const departments = [
    { id: 'all', label: isAr ? 'جميع الأقسام العلمية' : 'All Academic Departments' },
    { id: 'قسم القرآن الكريم وعلومه', label: isAr ? 'علوم القرآن والتفسير' : 'Quranic Sciences & Tafsir' },
    { id: 'قسم الفقه وأصوله', label: isAr ? 'الفقه وأصوله والمعاملات' : 'Fiqh & Legal Principles' },
    { id: 'قسم السنة النبوية وعلوم الحديث', label: isAr ? 'الحديث والسنة الشريفة' : 'Hadith Sciences' },
    { id: 'قسم اللغة العربية والدراسات اللغوية', label: isAr ? 'اللغة العربية والبلاغة' : 'Arabic Language & Eloquence' },
  ];

  const filteredCourses = selectedDept === 'all'
    ? ISLAMIC_COURSES
    : ISLAMIC_COURSES.filter((c) => c.department === selectedDept);

  return (
    <div className="space-y-10" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Building 02 Header */}
      <section className="bg-gradient-to-l from-[#064E3B] to-[#022C22] border border-[#C8A24A]/50 rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 text-center text-[#FAF8F2]">
        <div className="inline-flex items-center gap-2 bg-[#022C22] border border-[#C8A24A]/50 px-3.5 py-1 rounded-xl text-xs font-bold text-[#E5C97B]">
          <GraduationCap className="w-4 h-4" />
          <span>
            {isAr
              ? 'المبنى 02 · معهد العلوم الإسلامية والدراسات الشرعية'
              : 'Building 02 · Islamic Sciences Institute'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white">
          {isAr
            ? 'منهاجٌ شرعي مؤصل في الفقه والحديث والتفسير والعقيدة واللغة'
            : 'Authentic Syllabi in Fiqh, Hadith, Tafsir, Aqeedah & Arabic Studies'}
        </h1>

        <p className="text-xs sm:text-sm text-[#D1E7DD] max-w-2xl mx-auto leading-relaxed">
          {isAr
            ? 'مسارات دراسية تجمع بين أصالة المتون الشرعية المعتمدة والمنهجية الأكاديمية الواضحة بإشراف نخبة من العلماء.'
            : 'Structured programs uniting classical Islamic scholarship with accessible online academic pedagogy.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="bg-[#C8A24A] hover:bg-[#DFBE68] text-[#022C22] font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
          >
            {isAr ? 'التسجيل في دبلوم العلوم الشرعية' : 'Enroll in Islamic Sciences'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('hadith')}
            className="bg-[#FAF8F2]/10 hover:bg-[#FAF8F2]/20 border border-[#C8A24A]/45 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Scroll className="w-4 h-4 text-[#E5C97B]" />
            <span>{isAr ? 'موسوعة الحديث الشريف' : 'Hadith Encyclopedia'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('scholars')}
            className="bg-[#FAF8F2]/10 hover:bg-[#FAF8F2]/20 border border-[#C8A24A]/45 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#E5C97B]" />
            <span>{isAr ? 'هيئة العلماء والمشايخ' : 'Scholars Directory'}</span>
          </button>
        </div>
      </section>

      {/* Institute Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-[#E5C97B] flex items-center justify-center mb-2">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black font-amiri text-[#0F2920] dark:text-white">
            {isAr ? 'مناهج موثقة وشهادات علمية' : 'Verified Curricula & Certificates'}
          </h3>
          <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
            {isAr
              ? 'مقررات منهجية متدرجة تنتهي باختبارات تقييمية وشهادات موثقة رقمياً عبر سجل المجمع.'
              : 'Progressive curricula concluding with structured assessments and verifiable digital certificates.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#047857] text-white flex items-center justify-center mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black font-amiri text-[#0F2920] dark:text-white">
            {isAr ? 'نظام تعليمي مرن ومباشر' : 'Flexible Academic Schedule'}
          </h3>
          <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
            {isAr
              ? 'تسهيل وصول طلاب العلم للدروس والشروحات في الفقه والحديث والعقيدة والتفسير في كل وقت.'
              : 'Accessible lesson materials and live guidance accessible across international time zones.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#C8A24A] text-[#022C22] flex items-center justify-center mb-2">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black font-amiri text-[#0F2920] dark:text-white">
            {isAr ? 'إشراف نخبة من العلماء' : 'Guided by Accredited Scholars'}
          </h3>
          <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
            {isAr
              ? 'يشرف على التدريس فقهاء ومتخصصون مشهود لهم بالرسوخ العلمي والمنهج الوسطي المستقيم.'
              : 'Led by qualified scholars committed to balanced pedagogy and classical source fidelity.'}
          </p>
        </div>
      </section>

      {/* Course Catalog & Filter */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 bg-[#EFECE3] dark:bg-[#04382B] p-2 rounded-2xl border border-[#DDD6C7] dark:border-[#C8A24A]/30">
          {departments.map((dept) => (
            <button
              key={dept.id}
              type="button"
              onClick={() => setSelectedDept(dept.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDept === dept.id
                  ? 'bg-[#064E3B] text-white dark:bg-[#C8A24A] dark:text-[#022C22] shadow-sm'
                  : 'text-[#38554B] dark:text-[#D1E7DD] hover:bg-[#FFFFFF] dark:hover:bg-[#064E3B]'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const isExpanded = expandedCourseId === course.id;
            return (
              <div
                key={course.id}
                className="bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <div
                  onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF8F2] dark:hover:bg-[#064E3B]/50 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-[#064E3B] dark:text-[#E5C97B] bg-[#EFECE3] dark:bg-[#022C22] px-2.5 py-0.5 rounded border border-[#DDD6C7] dark:border-[#C8A24A]/30">
                        {course.department}
                      </span>
                      <span className="text-[11px] text-[#5C746B] dark:text-[#A3C4B8] font-mono">
                        {isAr ? 'المستوى:' : 'Level:'} {course.level}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black font-amiri text-[#0F2920] dark:text-white">
                      {course.title}
                    </h3>

                    <div className="text-xs text-[#38554B] dark:text-[#D1E7DD] font-medium">
                      {isAr ? 'المحاضر:' : 'Instructor:'}{' '}
                      <strong className="text-[#047857] dark:text-[#E5C97B]">{course.instructor}</strong> • {course.lessonsCount}{' '}
                      {isAr ? 'محاضرة معتمدة' : 'lectures'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#38554B] dark:text-[#D1E7DD] font-mono bg-[#FAF8F2] dark:bg-[#022C22] px-2.5 py-1 rounded-lg border border-[#DDD6C7] dark:border-[#C8A24A]/25">
                      {course.duration}
                    </span>
                    <span className="p-2 rounded-xl bg-[#EFECE3] dark:bg-[#022C22] text-[#064E3B] dark:text-[#E5C97B]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-6 bg-[#FAF8F2] dark:bg-[#022C22] border-t border-[#DDD6C7] dark:border-[#C8A24A]/25 space-y-4">
                    <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
                      {course.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-black text-[#064E3B] dark:text-[#E5C97B] flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>{isAr ? 'مفردات الخطة الدراسية للمنهج:' : 'Course Syllabus:'}</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {course.syllabus?.map((item: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#FFFFFF] dark:bg-[#04382B] rounded-xl border border-[#DDD6C7] dark:border-[#C8A24A]/25 flex items-center gap-2.5 text-[#0F2920] dark:text-[#FAF8F2]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#047857] dark:text-[#34D399] shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DDD6C7] dark:border-[#C8A24A]/25">
                      <div className="text-xs text-[#5C746B] dark:text-[#A3C4B8]">
                        {isAr ? 'متاح الآن للتسجيل المجاني والدراسة عن بعد.' : 'Open for free online enrollment.'}
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate('register')}
                        className="bg-[#064E3B] hover:bg-[#047857] dark:bg-[#C8A24A] dark:text-[#022C22] text-white font-black text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{isAr ? 'التحق بهذا المقرر الآن' : 'Enroll Now'}</span>
                        <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? '' : 'rotate-180'}`} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
