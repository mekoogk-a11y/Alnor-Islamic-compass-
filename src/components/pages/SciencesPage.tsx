import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Clock, Calendar, CheckCircle2, 
  Sparkles, Award, FileText, ChevronDown, ChevronUp, ArrowLeft 
} from 'lucide-react';
import { NavigationPage, IslamicCourse } from '../../types';
import { ISLAMIC_COURSES } from '../../data/islamicData';

interface SciencesPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const SciencesPage: React.FC<SciencesPageProps> = ({ onNavigate }) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(ISLAMIC_COURSES[0].id);

  const departments = [
    { id: 'all', label: 'جميع الأقسام العلمية' },
    { id: 'قسم القرآن الكريم وعلومه', label: 'علوم القرآن والتفسير' },
    { id: 'قسم الفقه وأصوله', label: 'الفقه وأصوله والمعاملات' },
    { id: 'قسم السنة النبوية وعلوم الحديث', label: 'الحديث والسنة الشريفة' },
    { id: 'قسم اللغة العربية والدراسات اللغوية', label: 'اللغة العربية والبلاغة' },
  ];

  const filteredCourses = selectedDept === 'all'
    ? ISLAMIC_COURSES
    : ISLAMIC_COURSES.filter((c) => c.department === selectedDept);

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 border border-emerald-900/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
          <GraduationCap className="w-4 h-4" />
          <span>كلية العلوم الإسلامية والدراسات الشرعية • مجمع النور العالمي</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          منهاجٌ شرعي مؤصل لتخريج علماء وطلاب علم راسخين
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          برامج دراسية معتمدة ودبلومات تخصصية تجمع بين أصالة المتون الشرعية المعتمدة ومواكبة قضايا العصر الفقهية والفكرية وفق منهج الوسطية والاعتدال.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('register')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all"
          >
            التسجيل في دبلوم العلوم الشرعية
          </button>
        </div>
      </div>

      {/* College Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-right">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">شهادات معتمدة دولياً</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            تمنح الكلية إجازات علمية ودبلومات تخصصية معتمدة من كبرى المجامع الفقهية والمؤسسات الأكاديمية الإسلامية العالمية.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-right">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">نظام تعليمي مرن ومباشر</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            محاضرات تفاعلية عبر البث الحي، مع تسجيل كامل لجميع الدروس والامتحانات الدورية والاختبارات الشفهية المقننة.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-right">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">نخبة من كبار العلماء والمحاضرين</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            يشرف على التدريس أساتذة جامعيون وفقهاء متخصصون مشهود لهم بالرسوخ العلمي والأمانة والمنهج الوسطي المستقيم.
          </p>
        </div>
      </div>

      {/* Course Catalog & Departments Filter */}
      <div className="space-y-6">
        
        {/* Department Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDept === dept.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const isExpanded = expandedCourseId === course.id;
            return (
              <div
                key={course.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all"
              >
                <div
                  onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-850 transition-colors text-right"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                        {course.department}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        المستوى: {course.level}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white">
                      {course.title}
                    </h3>

                    <div className="text-xs text-slate-300 font-medium">
                      المحاضر: <strong className="text-emerald-400">{course.instructor}</strong> • {course.lessonsCount} محاضرة معتمدة
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      ⏱ {course.duration}
                    </span>
                    <button className="p-2 rounded-xl bg-slate-800 text-slate-300">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details & Syllabus */}
                {isExpanded && (
                  <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4 animate-in fade-in duration-150 text-right">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>مفردات الخطة الدراسية للمنهج:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {course.syllabus?.map((item: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 flex items-center gap-2.5 text-slate-200"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                      <div className="text-xs text-slate-400">
                        متاح الآن للتسجيل المجاني والدراسة عن بعد لجميع الطلاب.
                      </div>
                      <button
                        onClick={() => onNavigate('register')}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                      >
                        <span>التحق بهذا المقرر الآن</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
