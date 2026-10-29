import React, { useState, useRef } from 'react';
import { 
  BookOpen, GraduationCap, Library, HeartHandshake, 
  Sparkles, Globe, Users, Award, Play, Pause, Volume2, 
  ArrowLeft, CheckCircle2, Star, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { COMPLEX_INFO, FEATURED_SURAHS, RECITERS } from '../../data/islamicData';
import { PWAInstallButton } from '../PWAInstallButton';
import { useLanguage } from '../../context/LanguageContext';

interface HomePageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { lang, t, isRtl } = useLanguage();
  const [selectedSurah, setSelectedSurah] = useState(FEATURED_SURAHS[0]);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(console.warn);
      setIsPlayingAudio(true);
    }
  };

  const handleSurahChange = (surahIndex: number) => {
    const surah = FEATURED_SURAHS[surahIndex];
    setSelectedSurah(surah);
    setIsPlayingAudio(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Grand Islamic Architectural Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/60 border border-emerald-900/40 p-6 sm:p-10 lg:p-14 shadow-2xl">
        {/* Subtle decorative Islamic stars & lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Decorative Islamic Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            {t.complexName}
          </h1>

          {/* Majestic Slogan Badge */}
          <div className="pt-2">
            <div className="inline-block bg-gradient-to-r from-amber-500/15 via-emerald-500/20 to-amber-500/15 border-y-2 border-amber-500/50 px-8 py-3.5 rounded-2xl shadow-xl">
              <span className="text-xs text-amber-400/90 font-bold block mb-1">
                {lang === 'ar' ? 'الشعار الرسمي المبارك' : 'Official Slogan'}
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-amiri text-amber-300 tracking-wider">
                {t.sloganQuote}
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigate('quran')}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-6 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.btnQuran}</span>
            </button>

            <button
              onClick={() => onNavigate('sciences')}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold px-6 py-3 rounded-xl text-sm transition-all"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>{t.btnSciences}</span>
            </button>

            <button
              onClick={() => onNavigate('waqf')}
              className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold px-6 py-3 rounded-xl text-sm transition-all"
            >
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <span>{t.btnWaqf}</span>
            </button>

            <PWAInstallButton className="px-6 py-3 text-sm" />
          </div>

        </div>

        {/* Global Statistics Banner */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80">
          
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              +{COMPLEX_INFO.totalStudents.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-semibold">{t.statsStudents}</div>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
              +{COMPLEX_INFO.graduatedHuffaz.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-semibold">{t.statsHuffaz}</div>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {COMPLEX_INFO.internationalBranchesCount}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-semibold">{t.statsBranches}</div>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
              {COMPLEX_INFO.activeTeachers}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-semibold">{t.statsTeachers}</div>
          </div>

        </div>

      </section>

      {/* Live Quran Recitation Bar */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                إذاعة القرآن الكريم بمجمع النور
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                تلاوات خاشعة ومباركة من الذكر الحكيم
              </h3>
            </div>
          </div>

          {/* Select Reciter & Surah */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={FEATURED_SURAHS.findIndex((s) => s.number === selectedSurah.number)}
              onChange={(e) => handleSurahChange(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              {FEATURED_SURAHS.map((s, idx) => (
                <option key={s.number} value={idx}>
                  {s.name} ({s.revelationType})
                </option>
              ))}
            </select>

            <select
              value={selectedReciter.id}
              onChange={(e) => {
                const r = RECITERS.find((x) => x.id === e.target.value) || RECITERS[0];
                setSelectedReciter(r);
                setIsPlayingAudio(false);
              }}
              className="bg-slate-950 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>إيقاف التلاوة</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>استماع للتلاوة</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={selectedSurah.audioUrl}
          onEnded={() => setIsPlayingAudio(false)}
        />

        {/* Selected Surah Preview Ayah */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div className="space-y-1">
            <span className="text-[11px] text-amber-400 font-bold">نموذج من {selectedSurah.name}:</span>
            <p className="text-base sm:text-lg font-amiri text-slate-100 font-bold">
              « {selectedSurah.sampleAyahs[0]?.text || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'} »
            </p>
          </div>
          <button
            onClick={() => onNavigate('quran')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 shrink-0"
          >
            <span>فتح المصحف كاملاً مع التفسير</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* The 4 Core Pillars of Al-Noor Global Complex */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            أركان الصرح الإسلامي
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            منظومة متكاملة لخدمة القرآن والعلوم الشرعية
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            يضم مجمع النور أربعة قطاعات رئيسية تعمل بتكامل لتحقيق ريادة عالمية في التعليم والبحث والعمل الخيري.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Pillar 1 */}
          <div 
            onClick={() => onNavigate('quran')}
            className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-lg space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                المقرأة القرآنية والإجازات
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                حلقات قرآنية نموذجية حضورية وإلكترونية للرجال والنساء والأطفال، مع منح الإجازات بالسند المتصل إلى رسول الله ﷺ في القراءات العشر.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>استكشف الحلقات</span>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div 
            onClick={() => onNavigate('sciences')}
            className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-lg space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                كلية العلوم الإسلامية
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                أقسام أكاديمية في الفقه وأصوله، الحديث الشريف، العقيدة، والتفسير واللغة العربية، وفق مناهج علمية رصينة ودبلومات معتمدة.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>تصفح المناهج والدورات</span>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div 
            onClick={() => onNavigate('library')}
            className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-lg space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Library className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-blue-300 transition-colors">
                المكتبة الرقمية والبحوث
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                مكتبة رقمية ضخمة تضم آلاف أمهات الكتب والمخطوطات، مع مساعد بحثي ذكي متخصص للإجابة على الاستفسارات الفقهية والقرآنية الموثقة.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400">
              <span>دخول المكتبة والباحث</span>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </div>
          </div>

          {/* Pillar 4 */}
          <div 
            onClick={() => onNavigate('waqf')}
            className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-lg space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">
                الوقف والمشاريع الخيرية
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                صناديق وقفية مستدامة لكفالة الحلقات والمعلمين، طباعة المصاحف، وبناء المجمعات القرآنية عبر حسابات مصرفية رسمية معتمدة دولياً.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400">
              <span>المشاريع وحاسبة الزكاة</span>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </div>
          </div>

        </div>
      </section>

      {/* Daily Spiritual Guidance (Ayah & Hadith) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ayah of the Day */}
        <div className="bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-current" />
              <span>قبسٌ من نور الذكر الحكيم</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">سورة فاطر: 29-30</span>
          </div>

          <p className="text-lg sm:text-xl font-amiri text-amber-200 font-bold leading-loose text-center py-2">
            « إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنفَقُوا مِمَّا رَزَقْنَاهُمْ سِرًّا وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَّن تَبُورَ »
          </p>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-400 block mb-0.5">من هدايات الآية:</strong>
            تجارة أهل القرآن تجارة مضمونة الأرباح لا يعتريها كساد ولا خسارة، ثمرتها مغفرة الذنوب والخلود في جنات النعيم.
          </div>
        </div>

        {/* Hadith of the Day */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>من هدي النبوة الشريفة</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">صحيح البخاري</span>
          </div>

          <p className="text-lg sm:text-xl font-amiri text-emerald-200 font-bold leading-loose text-center py-2">
            « خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ »
          </p>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-emerald-400 block mb-0.5">من معاني الحديث:</strong>
            أفضل الناس وأعلاهم منزلة عند الله هم من جمعوا بين تعلم كتاب الله تدبراً وعملاً، وتعليمه للناس ابتغاء وجه الله تعالى.
          </div>
        </div>

      </section>

      {/* Global Call to Action Section */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-emerald-800/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            انضم إلى قوافل حفظة كتاب الله ودارسي العلوم الشرعية
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            التسجيل متاح لكافة الأعمار والجنسيات حول العالم عبر مقرأة مجمع النور الإلكترونية. فصول صباحية ومسائية تناسب جميع التوقيتات الدولية.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('register')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all"
          >
            قدم طلب الالتحاق الآن
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-700 transition-all"
          >
            تعرف على فروعنا العالمية
          </button>
        </div>
      </section>

    </div>
  );
};
