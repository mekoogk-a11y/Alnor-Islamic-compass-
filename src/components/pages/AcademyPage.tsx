import React, { useState } from 'react';
import {
  GraduationCap, BookOpen, Award, Users, Video, Mic,
  CheckCircle, Clock, ShieldCheck,
  Search, AlertCircle, Radio
} from 'lucide-react';
import { ACADEMY_COURSES } from '../../data/hadithAndScholarsData';
import { AcademyCourse, NavigationPage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface AcademyPageProps {
  onNavigate: (page: NavigationPage) => void;
  initialCourseId?: string;
}

export const AcademyPage: React.FC<AcademyPageProps> = () => {
  const { user, enrollCourse } = useAuth();
  const { isRtl } = useLanguage();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'courses' | 'halaqat' | 'recitationCorrection' | 'verifyCertificate'>('courses');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse | null>(null);
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);

  // Recitation correction state
  const [selectedSurah, setSelectedSurah] = useState('الفاتحة');
  const [ayahRange, setAyahRange] = useState('الآيات 1-7');
  const [qiraahStyle, setQiraahStyle] = useState('رواية حفص عن عاصم');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioSuccess, setRecordedAudioSuccess] = useState(false);

  // Certificate verification state
  const [certInputId, setCertInputId] = useState('');
  const [verifiedCertResult, setVerifiedCertResult] = useState<any | null>(null);
  const [certSearchError, setCertSearchError] = useState(false);

  // Active virtual halaqat (live interactive rooms)
  const activeHalaqat = [
    {
      id: 'HLQ-101',
      title: 'مقرأة الإتقان الصباحية - تصحيح تلاوة سورة البقرة',
      sheikh: 'أ.د. عبد الرحمن بن يوسف المتقي',
      riwayah: 'حفص عن عاصم من طريق الشاطبية',
      activeStudents: 18,
      status: 'live',
    },
    {
      id: 'HLQ-102',
      title: 'حلقة إجازة القراءات العشر الكبرى',
      sheikh: 'فضيلة د. حسن الوراقي',
      riwayah: 'طريق طيبة النشر',
      activeStudents: 9,
      status: 'live',
    },
    {
      id: 'HLQ-103',
      title: 'مجلس سماع وضبط صحيح الإمام البخاري',
      sheikh: 'د. محمد إبراهيم الأزهري',
      riwayah: 'رواية الفربري بالسند المتصل',
      activeStudents: 42,
      status: 'live',
    },
  ];

  const handleEnroll = (course: AcademyCourse) => {
    enrollCourse(course.id);
    setEnrollSuccessMessage(`تم تسجيلك بنجاح في دورة: ${course.title}! يمكنك متابعة تقدمك في لوحة الطالب.`);
    setTimeout(() => setEnrollSuccessMessage(null), 4000);
  };

  const handleVerifyCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    setCertSearchError(false);
    const id = certInputId.trim().toUpperCase();

    if (id === 'ALN-QUR-2024-8891' || id === 'ALN-001' || id.startsWith('ALN-')) {
      setVerifiedCertResult({
        certNumber: id || 'ALN-QUR-2024-8891',
        studentName: user?.name || 'عبد الرحمن بن إبراهيم السبيعي',
        courseName: 'إجازة في حفظ وإتقان القرآن الكريم برواية حفص عن عاصم',
        grade: 'ممتاز مع مرتبة الشرف (98.5%)',
        issueDate: '15 رجب 1445 هـ - 2024 م',
        scholar: 'أ.د. عبد الرحمن بن يوسف المتقي (رئيس هيئة الإقراء)',
        sanad: 'سند متصل إلى رسول الله صلى الله عليه وسلم عن جبريل عن رب العزة جل وعلا',
        isAuthentic: true,
      });
    } else {
      setCertSearchError(true);
      setVerifiedCertResult(null);
    }
  };

  const filteredCourses = ACADEMY_COURSES.filter((c) => {
    if (departmentFilter === 'all') return true;
    return c.department.includes(departmentFilter);
  });

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sky-Blue 3D Header Banner */}
      <div className="bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] border border-[#87CEEB]/55 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-white">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Sky3DIcon slug="academy" tone="sky" size="md" />
            <p className="text-xs font-bold text-[#87CEEB] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#F7E7B4]" />
              <span>أكاديمية النور العالمية للقرآن الكريم والسنة النبوية</span>
            </p>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white leading-tight">
            صرحٌ أكاديمي عالمي لتحفيظ القرآن وإجازة القراءات ونشر علوم السنة
          </h1>

          <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed">
            برامج تعليمية ممنهجة تحت إشراف نخبة من كبار العلماء والمقرئين المجازين بالأسانيد المتصلة، مع غرف تسميع افتراضية مباشرة، ونظام آلي لتصحيح التلاوات، وشهادات معتمدة دولياً.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap gap-3 pt-2 text-xs text-white">
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-[#87CEEB]/40">
              <ShieldCheck className="w-4 h-4 text-[#F7E7B4]" />
              <span>أسانيد متصلة وإجازات معتمدة</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-[#87CEEB]/40">
              <Users className="w-4 h-4 text-[#87CEEB]" />
              <span>مقارئ فردية وجماعية 24/7</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-[#87CEEB]/40">
              <Award className="w-4 h-4 text-[#5EEAD4]" />
              <span>نظام شهادات برقم تسلسلي موثق</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enroll success toast */}
      {enrollSuccessMessage && (
        <div className="p-4 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#0EA5A4] text-[#12345A] dark:text-[#EAF8FF] rounded-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 text-[#0EA5A4] shrink-0" />
          <span className="text-sm font-bold">{enrollSuccessMessage}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="sky-glass-panel flex items-center gap-2 p-2 rounded-2xl overflow-x-auto no-scrollbar">
        {[
          { id: 'courses', label: 'الدورات والمسارات الأكاديمية', icon: BookOpen },
          { id: 'halaqat', label: 'المقارئ وغرف التسميع المباشرة', icon: Video },
          { id: 'recitationCorrection', label: 'طلب تصحيح التلاوة والتسجيل', icon: Mic },
          { id: 'verifyCertificate', label: 'التحقق من صحة الشهادات والإجازات', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#12345A] text-white shadow-sm'
                  : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-white/75 dark:hover:bg-[#14335B]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COURSES CATALOG */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[#12345A] dark:text-[#EAF8FF] font-bold ml-1">القسم:</span>
            {[
              { id: 'all', label: 'جميع المسارات' },
              { id: 'القرآن', label: 'القرآن والقراءات' },
              { id: 'الحديث', label: 'الحديث والسنة' },
              { id: 'الفقه', label: 'الفقه وأصوله' },
              { id: 'الدعوة', label: 'الدعوة والمهتدون الجدد' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setDepartmentFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  departmentFilter === f.id
                    ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4]'
                    : 'bg-white/90 dark:bg-[#0F2747] border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-[#B8DEF5]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = user?.enrolledCourses?.some((c) => c.courseId === course.id);

              return (
                <div
                  key={course.id}
                  className="sky-card-3d rounded-3xl p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
                        {course.level}
                      </span>
                      <span className="text-[#4A7298] dark:text-[#B8DEF5] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#0EA5A4]" />
                        {course.duration}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#12345A] dark:text-white leading-snug font-amiri">
                      {course.title}
                    </h3>

                    <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    <div className="pt-2 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 text-xs space-y-1">
                      <p className="font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
                        المشرف والمدرس: {course.instructor}
                      </p>
                      <p className="text-[#4A7298] dark:text-[#B8DEF5] text-[11px]">
                        القسم: {course.department}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20">
                    <div className="flex items-center justify-between text-xs text-[#4A7298] dark:text-[#B8DEF5]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#0EA5A4]" />
                        {course.enrolledStudentsCount} طالباً مسجلاً
                      </span>
                      <span className="text-[#0EA5A4] font-bold">منحة مجانية لوجه الله</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isEnrolled ? (
                        <div className="w-full py-2.5 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#0EA5A4]/50 text-[#0D7A7A] dark:text-[#5EEAD4] font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>أنت مسجل في هذا المسار</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEnroll(course)}
                          className="w-full py-2.5 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
                        >
                          التسجيل والانضمام للدورة
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedCourse(course)}
                        className="px-3.5 py-2.5 bg-[#EAF8FF] dark:bg-[#0F2747] hover:border-[#0EA5A4] border border-[#87CEEB]/55 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-white text-xs font-bold rounded-xl transition cursor-pointer"
                        title="تفاصيل المنهج"
                      >
                        المنهج
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE HALAQAT & VIRTUAL CLASSROOMS */}
      {activeTab === 'halaqat' && (
        <div className="space-y-6">
          <div className="sky-card-3d p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#0EA5A4] animate-pulse" />
              <div>
                <h4 className="text-sm font-black text-[#12345A] dark:text-white">المقارئ وحلقات التسميع المباشرة الآن</h4>
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">حلقات تفاعلية صوتية ومرئية مفتوحة للطلاب على مدار 24 ساعة</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#0D7A7A] dark:text-[#87CEEB] font-bold bg-[#EAF8FF] dark:bg-[#0F2747] px-3 py-1.5 rounded-xl border border-[#87CEEB]/50">
              <Radio className="w-4 h-4 text-[#0EA5A4]" />
              <span>3 مقارئ تبث حالياً</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeHalaqat.map((halaqa) => (
              <div
                key={halaqa.id}
                className="sky-card-3d rounded-3xl p-6 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-black text-rose-600 dark:text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    مباشر الآن
                  </span>
                  <span className="text-xs text-[#4A7298] dark:text-[#B8DEF5] flex items-center gap-1 font-mono">
                    <Users className="w-3.5 h-3.5 text-[#0EA5A4]" />
                    {halaqa.activeStudents} طالباً
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-black text-[#12345A] dark:text-white">{halaqa.title}</h4>
                  <p className="text-xs text-[#0D7A7A] dark:text-[#87CEEB] font-bold">{halaqa.sheikh}</p>
                  <p className="text-[11px] text-[#4A7298] dark:text-[#B8DEF5]">الرواية: {halaqa.riwayah}</p>
                </div>

                <div className="p-3 bg-[#EAF8FF]/85 dark:bg-[#0F2747] rounded-2xl border border-[#87CEEB]/45 dark:border-[#87CEEB]/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#4A7298] dark:text-[#B8DEF5]">جودة البث:</span>
                    <span className="text-[#0EA5A4] font-bold">ستيريو HD نقي</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#4A7298] dark:text-[#B8DEF5]">الدور الحالي:</span>
                    <span className="text-[#12345A] dark:text-[#F7E7B4] font-bold">تلاوة وتصحيح مباشر</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast(`جاري الاتصال بالغرفة الصوتية الافتراضية: ${halaqa.title}\nيرجى تجهيز الميكروفون والمصحف الشريف.`, 'info')}
                  className="w-full py-3 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>دخول الغرفة الافتراضية والتسميع</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RECITATION CORRECTION */}
      {activeTab === 'recitationCorrection' && (
        <div className="max-w-2xl mx-auto sky-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="inline-flex items-center gap-2 text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
              <Mic className="w-4 h-4 text-[#0EA5A4]" />
              <span>نظام تصحيح التلاوة وتدقيق مخارج الحروف</span>
            </p>
            <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white">
              سجّل تلاوتك واحصل على تقييم وتصحيح من شيخ مجاز
            </h3>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] max-w-lg mx-auto">
              خدمة مجانية تتيح لك إرسال تسجيل صوتي لمقطع من القرآن الكريم لمراجعته بدقة، مع بيان أحكام التجويد ومخارج الحروف والتنبيه على اللحن الجلي والخفي.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1.5">السورة الكريمة</label>
                <input
                  type="text"
                  value={selectedSurah}
                  onChange={(e) => setSelectedSurah(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded-xl text-[#12345A] dark:text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1.5">الآيات المراد تصحيحها</label>
                <input
                  type="text"
                  value={ayahRange}
                  onChange={(e) => setAyahRange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded-xl text-[#12345A] dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1.5 text-xs">الرواية القرآنية</label>
              <select
                value={qiraahStyle}
                onChange={(e) => setQiraahStyle(e.target.value)}
                className="w-full px-3 py-2 bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded-xl text-[#12345A] dark:text-white text-xs"
              >
                <option>رواية حفص عن عاصم (طريق الشاطبية)</option>
                <option>رواية ورش عن نافع (طريق الأزرق)</option>
                <option>رواية قالون عن نافع</option>
                <option>رواية شعبة عن عاصم</option>
                <option>رواية السوسي عن أبي عمرو</option>
              </select>
            </div>

            {/* Audio Recorder */}
            <div className="p-6 bg-[#EAF8FF]/85 dark:bg-[#0F2747] rounded-2xl border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-white dark:bg-[#102A4C] border-2 border-[#0EA5A4] flex items-center justify-center shadow-md">
                <Mic className={`w-8 h-8 ${isRecording ? 'text-rose-500 animate-pulse' : 'text-[#0EA5A4]'}`} />
              </div>

              <div>
                <p className="text-sm font-black text-[#12345A] dark:text-white">
                  {isRecording ? 'جاري التسجيل الصوتي الآن... اقرأ بهدوء وترتيل' : 'اضغط للبدء بتسجيل تلاوتك بصوت نقي'}
                </p>
                <p className="text-xs text-[#4A7298] dark:text-[#B8DEF5] mt-1">الحد الأقصى للتسجيل: 3 دقائق لكل مقطع</p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    isRecording
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      : 'bg-[#0EA5A4] hover:bg-[#0D7A7A] text-white'
                  }`}
                >
                  {isRecording ? 'إيقاف التسجيل وإنهاء المقطع' : 'بدء التسجيل الصوتي'}
                </button>
              </div>

              {recordedAudioSuccess && (
                <div className="p-3 bg-white dark:bg-[#102A4C] border border-[#0EA5A4] text-[#12345A] dark:text-[#EAF8FF] text-xs rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#0EA5A4]" />
                  <span>تم استلام تسجيلك الصوتي بنجاح! سيتم إرساله للمقرئ المعتمد وسيصلك الرد التقييمي خلال 24 ساعة.</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setRecordedAudioSuccess(true);
                setIsRecording(false);
              }}
              className="w-full py-3 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black rounded-2xl text-xs sm:text-sm transition shadow-md cursor-pointer"
            >
              إرسال التلاوة للمراجعة والتدقيق الإقرائي
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: CERTIFICATE VERIFICATION */}
      {activeTab === 'verifyCertificate' && (
        <div className="max-w-2xl mx-auto sky-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="inline-flex items-center gap-2 text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>التحقق الرقمي من صحة الشهادات والإجازات القرآنية</span>
            </p>
            <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white">
              بوابة التوثيق والاعتماد الدولي لمجمع النور
            </h3>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] max-w-lg mx-auto">
              أدخل الرقم التسلسلي المطبوع على الشهادة أو الإجازة للتحقق الفوري من صحتها وسلامة سندها وأسماء العلماء الموقعين عليها.
            </p>
          </div>

          <form onSubmit={handleVerifyCertificate} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                required
                value={certInputId}
                onChange={(e) => setCertInputId(e.target.value)}
                placeholder="أدخل رقم الشهادة مثل: ALN-QUR-2024-8891"
                className="w-full px-4 py-3 bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded-xl text-[#12345A] dark:text-white text-sm font-mono text-center focus:outline-none focus:border-[#0EA5A4]"
              />
              <Search className="w-4 h-4 text-[#0EA5A4] absolute right-4 top-3.5" />
            </div>

            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCertInputId('ALN-QUR-2024-8891')}
                className="px-3 py-1 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/50 text-[#12345A] dark:text-[#B8DEF5] rounded-lg transition cursor-pointer"
              >
                جرّب إجازة نموذجية: ALN-QUR-2024-8891
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black rounded-2xl text-sm transition shadow-md cursor-pointer"
            >
              التحقق من السجل الرسمي للشهادة
            </button>
          </form>

          {certSearchError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>لم يتم العثور على شهادة تطابق هذا الرقم في السجل العام للمجمع. يرجى التأكد من الرمز المدخل.</span>
            </div>
          )}

          {verifiedCertResult && (
            <div className="p-6 bg-[#EAF8FF] dark:bg-[#0F2747] rounded-3xl border-2 border-[#0EA5A4] space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#87CEEB]/40 pb-3">
                <span className="flex items-center gap-1.5 text-[#0D7A7A] dark:text-[#5EEAD4] font-bold text-xs">
                  <CheckCircle className="w-4 h-4" />
                  شهادة رسمية موثقة ومعتمدة بالسند المتصل
                </span>
                <span className="font-mono text-xs text-[#12345A] dark:text-[#F7E7B4] font-bold">
                  {verifiedCertResult.certNumber}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#12345A] dark:text-[#EAF8FF]">
                <div>
                  <span className="text-[#4A7298] dark:text-[#B8DEF5] block text-[11px]">اسم الطالب المجاز:</span>
                  <span className="text-base font-black">{verifiedCertResult.studentName}</span>
                </div>
                <div>
                  <span className="text-[#4A7298] dark:text-[#B8DEF5] block text-[11px]">موضوع الإجازة / الدورة:</span>
                  <span className="text-sm font-bold text-[#0D7A7A] dark:text-[#87CEEB]">{verifiedCertResult.courseName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[#4A7298] dark:text-[#B8DEF5] block text-[11px]">التقدير:</span>
                    <span className="font-bold text-[#0EA5A4]">{verifiedCertResult.grade}</span>
                  </div>
                  <div>
                    <span className="text-[#4A7298] dark:text-[#B8DEF5] block text-[11px]">تاريخ الصدور:</span>
                    <span>{verifiedCertResult.issueDate}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[#4A7298] dark:text-[#B8DEF5] block text-[11px]">الشيخ المجيز:</span>
                  <span className="font-bold">{verifiedCertResult.scholar}</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#102A4C] border border-[#87CEEB]/45 rounded-xl text-[11px]">
                  <span className="text-[#0D7A7A] dark:text-[#F7E7B4] font-bold block mb-1">بيان الإسناد القرآني المتصل:</span>
                  {verifiedCertResult.sanad}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Curriculum Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091B33]/75 backdrop-blur-md">
          <div className="w-full max-w-xl sky-card-3d rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-3">
              <div>
                <span className="text-[11px] font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
                  منهج الدورة المعتمد
                </span>
                <h3 className="text-lg font-black text-[#12345A] dark:text-white mt-1">{selectedCourse.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="px-3 py-1 rounded-lg text-xs font-bold text-[#12345A] dark:text-white bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/45 cursor-pointer"
              >
                إغلاق
              </button>
            </div>

            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">{selectedCourse.description}</p>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#12345A] dark:text-[#87CEEB]">مفردات المنهج الأسبوعي:</h4>
              <div className="space-y-1.5">
                {selectedCourse.syllabus.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/45 text-xs text-[#12345A] dark:text-[#EAF8FF]">
                    <span className="w-5 h-5 rounded-full bg-[#12345A] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleEnroll(selectedCourse);
                setSelectedCourse(null);
              }}
              className="w-full py-3 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black rounded-2xl text-xs transition cursor-pointer"
            >
              تأكيد التسجيل في هذه الدورة
            </button>
          </div>
        </div>
      )}

      <SectionDynamicItems sectionSlug="academy" />
    </div>
  );
};
