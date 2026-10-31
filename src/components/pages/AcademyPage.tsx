import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Award, Users, Video, Mic, 
  CheckCircle, Clock, ShieldCheck, 
  Search, Sparkles, AlertCircle, Radio
} from 'lucide-react';
import { ACADEMY_COURSES } from '../../data/hadithAndScholarsData';
import { AcademyCourse, NavigationPage } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface AcademyPageProps {
  onNavigate: (page: NavigationPage) => void;
  initialCourseId?: string;
}

export const AcademyPage: React.FC<AcademyPageProps> = ({ onNavigate, initialCourseId }) => {
  const { user, enrollCourse } = useAuth();
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
    <div className="space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-900/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
            <GraduationCap className="w-4 h-4" />
            <span>أكاديمية النور العالمية للقرآن الكريم والسنة النبوية</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            صرحٌ أكاديمي عالمي لتحفيظ القرآن وإجازة القراءات ونشر علوم السنة
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            برامج تعليمية ممنهجة تحت إشراف نخبة من كبار العلماء والمقرئين المجازين بالأسانيد المتصلة، مع غرف تسميع افتراضية مباشرة، ونظام آلي لتصحيح التلاوات، وشهادات معتمدة دولياً.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>أسانيد متصلة وإجازات معتمدة</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Users className="w-4 h-4 text-amber-400" />
              <span>مقارئ فردية وجماعية 24/7</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Award className="w-4 h-4 text-blue-400" />
              <span>نظام شهادات برقم تسلسلي موثق</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enroll success toast */}
      {enrollSuccessMessage && (
        <div className="p-4 bg-emerald-950 border border-emerald-500 text-emerald-200 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-bold">{enrollSuccessMessage}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto no-scrollbar">
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
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
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
            <span className="text-slate-400 ml-1">القسم:</span>
            {[
              { id: 'all', label: 'جميع المسارات' },
              { id: 'القرآن', label: 'القرآن والقراءات' },
              { id: 'الحديث', label: 'الحديث والسنة' },
              { id: 'الفقه', label: 'الفقه وأصوله' },
              { id: 'الدعوة', label: 'الدعوة والمهتدون الجدد' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDepartmentFilter(f.id)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                  departmentFilter === f.id
                    ? 'bg-emerald-800 text-white border border-emerald-600'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = user?.enrolledCourses?.some((c) => c.courseId === course.id);

              return (
                <div
                  key={course.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-emerald-700/60 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 transition duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {course.level}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {course.duration}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                      <p className="font-semibold text-emerald-400">
                        المشرف والمدرس: {course.instructor}
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        القسم: {course.department}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        {course.enrolledStudentsCount} طالباً مسجلاً
                      </span>
                      <span className="text-emerald-400 font-bold">منحة مجانية لوجه الله</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isEnrolled ? (
                        <div className="w-full py-2.5 bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>أنت مسجل في هذا المسار</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course)}
                          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/10"
                        >
                          التسجيل والانضمام للدورة
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
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
          <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-white">المقارئ وحلقات التسميع المباشرة الآن</h4>
                <p className="text-xs text-slate-400">حلقات تفاعلية صوتية ومرئية مفتوحة للطلاب على مدار 24 ساعة</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-amber-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <Radio className="w-4 h-4 animate-spin text-amber-400" />
              <span>3 مقارئ تبث حالياً</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeHalaqat.map((halaqa) => (
              <div
                key={halaqa.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-emerald-600/70 rounded-3xl p-6 shadow-xl space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-950/80 text-red-400 border border-red-800/50">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                    مباشر الآن
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    {halaqa.activeStudents} طالباً
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white">{halaqa.title}</h4>
                  <p className="text-xs text-amber-400 font-semibold">{halaqa.sheikh}</p>
                  <p className="text-[11px] text-slate-400">الرواية: {halaqa.riwayah}</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">جودة البث:</span>
                    <span className="text-emerald-400 font-bold">ستيريو HD نقي</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">الدور الحالي:</span>
                    <span className="text-amber-300 font-bold">تلاوة وتصحيح مباشر</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`جاري الاتصال بالغرفة الصوتية الافتراضية: ${halaqa.title}\nيرجى تجهيز الميكروفون والمصحف الشريف.`)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
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
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
              <Mic className="w-4 h-4" />
              <span>نظام تصحيح التلاوة وتدقيق مخارج الحروف</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              سجّل تلاوتك واحصل على تقييم وتصحيح من شيخ مجاز
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              خدمة مجانية تتيح لك إرسال تسجيل صوتي لمقطع من القرآن الكريم لمراجعته بدقة، مع بيان أحكام التجويد ومخارج الحروف والتنبيه على اللحن الجلي والخفي.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">السورة الكريمة</label>
                <input
                  type="text"
                  value={selectedSurah}
                  onChange={(e) => setSelectedSurah(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">الآيات المراد تصحيحها</label>
                <input
                  type="text"
                  value={ayahRange}
                  onChange={(e) => setAyahRange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5 text-xs">الرواية القرآنية</label>
              <select
                value={qiraahStyle}
                onChange={(e) => setQiraahStyle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              >
                <option>رواية حفص عن عاصم (طريق الشاطبية)</option>
                <option>رواية ورش عن نافع (طريق الأزرق)</option>
                <option>رواية قالون عن نافع</option>
                <option>رواية شعبة عن عاصم</option>
                <option>رواية السوسي عن أبي عمرو</option>
              </select>
            </div>

            {/* Audio Recorder */}
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-xl">
                <Mic className={`w-8 h-8 ${isRecording ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {isRecording ? 'جاري التسجيل الصوتي الآن... اقرأ بهدوء وترتيل' : 'اضغط للبدء بتسجيل تلاوتك بصوت نقي'}
                </p>
                <p className="text-xs text-slate-400 mt-1">الحد الأقصى للتسجيل: 3 دقائق لكل مقطع</p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${
                    isRecording
                      ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isRecording ? 'إيقاف التسجيل وإنهاء المقطع' : 'بدء التسجيل الصوتي'}
                </button>
              </div>

              {recordedAudioSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-600 text-emerald-200 text-xs rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>تم استلام تسجيلك الصوتي بنجاح! سيتم إرساله للمقرئ المعتمد وسيصلك الرد التقييمي خلال 24 ساعة.</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setRecordedAudioSuccess(true);
                setIsRecording(false);
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition shadow-lg shadow-amber-500/10"
            >
              إرسال التلاوة للمراجعة والتدقيق الإقرائي
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: CERTIFICATE VERIFICATION */}
      {activeTab === 'verifyCertificate' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
              <Award className="w-4 h-4" />
              <span>التحقق الرقمي من صحة الشهادات والإجازات القرآنية</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              بوابة التوثيق والاعتماد الدولي لمجمع النور
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
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
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono text-center focus:outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
            </div>

            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCertInputId('ALN-QUR-2024-8891')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              >
                جرّب إجازة نموذجية: ALN-QUR-2024-8891
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
            >
              التحقق من السجل الرسمي للشهادة
            </button>
          </form>

          {certSearchError && (
            <div className="p-4 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>لم يتم العثور على شهادة تطابق هذا الرقم في السجل العام للمجمع. يرجى التأكد من الرمز المدخل.</span>
            </div>
          )}

          {verifiedCertResult && (
            <div className="p-6 bg-slate-950 rounded-3xl border-2 border-emerald-500/50 space-y-4 text-slate-200 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle className="w-4 h-4" />
                  شهادة رسمية موثقة ومعتمدة بالسند المتصل
                </span>
                <span className="font-mono text-xs text-amber-400 font-bold">
                  {verifiedCertResult.certNumber}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">اسم الطالب المجاز:</span>
                  <span className="text-base font-bold text-white">{verifiedCertResult.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">موضوع الإجازة / الدورة:</span>
                  <span className="text-sm font-semibold text-amber-300">{verifiedCertResult.courseName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">التقدير:</span>
                    <span className="font-bold text-emerald-400">{verifiedCertResult.grade}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">تاريخ الصدور:</span>
                    <span>{verifiedCertResult.issueDate}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">الشيخ المجيز:</span>
                  <span className="font-bold text-white">{verifiedCertResult.scholar}</span>
                </div>
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-[11px] text-slate-300">
                  <span className="text-amber-400 font-bold block mb-1">بيان الإسناد القرآني المتصل:</span>
                  {verifiedCertResult.sanad}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Curriculum Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  منهج الدورة المعتمد
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedCourse.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                إغلاق
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedCourse.description}</p>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400">مفردات المنهج الأسبوعي:</h4>
              <div className="space-y-1.5">
                {selectedCourse.syllabus.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-600/60 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                handleEnroll(selectedCourse);
                setSelectedCourse(null);
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl text-xs transition"
            >
              تأكيد التسجيل في هذه الدورة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
