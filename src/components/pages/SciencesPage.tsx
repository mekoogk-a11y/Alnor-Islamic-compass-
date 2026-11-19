import React, { useState } from 'react';
import {
  GraduationCap, BookOpen, Clock, CheckCircle2,
  Award, FileText, ChevronDown, ChevronUp, ArrowLeft, Scroll, Users
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { ISLAMIC_COURSES } from '../../data/islamicData';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

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
      {/* Building 02 Sky-Blue 3D Header */}
      <section className="rounded-3xl bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] border border-[#87CEEB]/55 p-6 sm:p-10 shadow-xl space-y-4 text-center text-white">
        <div className="flex justify-center">
          <Sky3DIcon slug="sciences" tone="navy" size="lg" />
        </div>

        <p className="text-xs font-bold text-[#87CEEB] flex items-center justify-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-[#F7E7B4]" />
          <span>
            {isAr
              ? 'المبنى 02 · معهد العلوم الإسلامية والدراسات الشرعية'
              : 'Building 02 · Islamic Sciences Institute'}
          </span>
        </p>

        <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white">
          {isAr
            ? 'منهاجٌ شرعي مؤصل في الفقه والحديث والتفسير والعقيدة واللغة'
            : 'Authentic Syllabi in Fiqh, Hadith, Tafsir, Aqeedah & Arabic Studies'}
        </h1>

        <p className="text-xs sm:text-sm text-[#D7F1FC] max-w-2xl mx-auto leading-relaxed">
          {isAr
            ? 'مسارات دراسية تجمع بين أصالة المتون الشرعية المعتمدة والمنهجية الأكاديمية الواضحة بإشراف نخبة من العلماء.'
            : 'Structured programs uniting classical Islamic scholarship with accessible online academic pedagogy.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] font-black text-xs sm:text-sm px-6 py-2.5 rounded-2xl shadow-md transition-colors cursor-pointer"
          >
            {isAr ? 'التسجيل في دبلوم العلوم الشرعية' : 'Enroll in Islamic Sciences'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('hadith')}
            className="bg-white/15 hover:bg-white/25 border border-[#87CEEB]/50 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Scroll className="w-4 h-4 text-[#F7E7B4]" />
            <span>{isAr ? 'موسوعة الحديث الشريف' : 'Hadith Encyclopedia'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('scholars')}
            className="bg-white/15 hover:bg-white/25 border border-[#87CEEB]/50 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Users className="w-4 h-4 text-[#87CEEB]" />
            <span>{isAr ? 'هيئة العلماء والمشايخ' : 'Scholars Directory'}</span>
          </button>
        </div>
      </section>

      {/* Institute Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="sky-card-3d p-5 rounded-3xl space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2B6CB0] to-[#12345A] text-[#F7E7B4] flex items-center justify-center mb-2 shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black font-amiri text-[#12345A] dark:text-white">
            {isAr ? 'مناهج موثقة وشهادات علمية' : 'Verified Curricula & Certificates'}
          </h3>
          <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            {isAr
              ? 'مقررات منهجية متدرجة تنتهي باختبارات تقييمية وشهادات موثقة رقمياً عبر سجل المجمع.'
              : 'Progressive curricula concluding with structured assessments and verifiable digital certificates.'}
          </p>
        </div>

        <div className="sky-card-3d p-5 rounded-3xl space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5EEAD4] to-[#0EA5A4] text-[#12345A] flex items-center justify-center mb-2 shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black font-amiri text-[#12345A] dark:text-white">
            {isAr ? 'نظام تعليمي مرن ومباشر' : 'Flexible Academic Schedule'}
          </h3>
          <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            {isAr
              ? 'تسهيل وصول طلاب العلم للدروس والشروحات في الفقه والحديث والعقيدة والتفسير في كل وقت.'
              : 'Accessible lesson materials and live guidance accessible across international time zones.'}
          </p>
        </div>

        <div className="sky-card-3d p-5 rounded-3xl space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F7E7B4] to-[#D4AF37] text-[#12345A] flex items-center justify-center mb-2 shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black font-amiri text-[#12345A] dark:text-white">
            {isAr ? 'إشراف نخبة من العلماء' : 'Guided by Accredited Scholars'}
          </h3>
          <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            {isAr
              ? 'يشرف على التدريس فقهاء ومتخصصون مشهود لهم بالرسوخ العلمي والمنهج الوسطي المستقيم.'
              : 'Led by qualified scholars committed to balanced pedagogy and classical source fidelity.'}
          </p>
        </div>
      </section>

      {/* Course Catalog & Filter */}
      <section className="space-y-6">
        <div className="sky-glass-panel flex flex-wrap items-center gap-2 p-2.5 rounded-2xl">
          {departments.map((dept) => (
            <button
              key={dept.id}
              type="button"
              onClick={() => setSelectedDept(dept.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDept === dept.id
                  ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4] shadow-sm'
                  : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-white/75 dark:hover:bg-[#14335B]'
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
                className="sky-card-3d rounded-3xl overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#EAF8FF]/60 dark:hover:bg-[#14335B]/60 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                      <span className="text-[#0D7A7A] dark:text-[#87CEEB]">
                        {course.department}
                      </span>
                      <span aria-hidden="true" className="text-[#87CEEB]">·</span>
                      <span className="text-[#4A7298] dark:text-[#B8DEF5] font-mono">
                        {isAr ? 'المستوى:' : 'Level:'} {course.level}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black font-amiri text-[#12345A] dark:text-white">
                      {course.title}
                    </h3>

                    <div className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-medium">
                      {isAr ? 'المحاضر:' : 'Instructor:'}{' '}
                      <strong className="text-[#0D7A7A] dark:text-[#87CEEB]">{course.instructor}</strong> · {course.lessonsCount}{' '}
                      {isAr ? 'محاضرة معتمدة' : 'lectures'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#12345A] dark:text-[#EAF8FF] font-mono font-bold">
                      {course.duration}
                    </span>
                    <span className="p-2 rounded-xl bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/50 text-[#12345A] dark:text-[#87CEEB]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-6 bg-[#EAF8FF]/80 dark:bg-[#0F2747]/90 border-t border-[#87CEEB]/40 dark:border-[#87CEEB]/20 space-y-4">
                    <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                      {course.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-black text-[#12345A] dark:text-[#87CEEB] flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#0EA5A4]" />
                        <span>{isAr ? 'مفردات الخطة الدراسية للمنهج:' : 'Course Syllabus:'}</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {course.syllabus?.map((item: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 bg-white dark:bg-[#102A4C] rounded-xl border border-[#87CEEB]/50 dark:border-[#87CEEB]/20 flex items-center gap-2.5 text-[#12345A] dark:text-[#EAF8FF]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#0EA5A4] shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20">
                      <div className="text-xs text-[#4A7298] dark:text-[#B8DEF5]">
                        {isAr ? 'متاح الآن للتسجيل المجاني والدراسة عن بعد.' : 'Open for free online enrollment.'}
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate('register')}
                        className="bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
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

      <SectionDynamicItems sectionSlug="sciences" />
    </div>
  );
};
