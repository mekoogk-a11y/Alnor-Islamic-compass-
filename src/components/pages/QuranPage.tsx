import React, { useState, useRef } from 'react';
import { 
  BookOpen, Play, Pause, Volume2, Search, Check, 
  Award, Sparkles, ChevronRight, BookCheck, ShieldCheck, 
  ArrowLeft, Globe, Radio, CheckCircle2, Languages, HelpCircle 
} from 'lucide-react';
import { NavigationPage, QuranSurah, Language } from '../../types';
import { FEATURED_SURAHS, RECITERS, QURAN_TRANSLATION_AUTHORITIES } from '../../data/islamicData';
import { LiveMakkahQuranRadio } from '../LiveMakkahQuranRadio';
import { useLanguage } from '../../context/LanguageContext';

interface QuranPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const QuranPage: React.FC<QuranPageProps> = ({ onNavigate }) => {
  const { lang, t, isRtl } = useLanguage();
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah>(FEATURED_SURAHS[0]);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [showTafsir, setShowTafsir] = useState(true);
  const [activeTranslationLang, setActiveTranslationLang] = useState<Language>(lang);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.warn);
      setIsPlaying(true);
    }
  };

  const handleSelectSurah = (surah: QuranSurah) => {
    setSelectedSurah(surah);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const filteredSurahs = FEATURED_SURAHS.filter((s) =>
    s.name.includes(searchQuery) || 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString().includes(searchQuery)
  );

  const fontSizes = {
    normal: 'text-lg sm:text-xl leading-relaxed',
    large: 'text-xl sm:text-2xl lg:text-3xl leading-loose',
    huge: 'text-2xl sm:text-3xl lg:text-4xl leading-loose font-black',
  };

  const currentAuthority = QURAN_TRANSLATION_AUTHORITIES[activeTranslationLang] || QURAN_TRANSLATION_AUTHORITIES['en'];

  return (
    <div className="space-y-10 sm:space-y-12">
      
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-emerald-950/80 to-slate-950 border border-emerald-900/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4 text-center">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
            <BookCheck className="w-4 h-4" />
            <span>المقرأة القرآنية والمصحف الإلكتروني العالمي • مجمع النور</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black text-white font-amiri leading-tight">
            المصحف الإلكتروني والترجمات المعتمدة وإذاعة مكة المكرمة
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            تلاوة القرآن الكريم بالرسم العثماني الموثق، مع ترجمة معاني الآيات إلى 12 لغة عالمية معتمدة من مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة، والاستماع المباشر لإذاعة القرآن من الحرم المكي الشريف.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all"
            >
              سجل الآن في الحلقات القرآنية والإجازات
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 1: LIVE MAKKAH QURAN RADIO SUITE */}
      <LiveMakkahQuranRadio initialExpanded={false} dockedMode={false} />

      {/* 4 Quranic Tracks Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'مسار الحفظ المتقن الشامل',
            target: 'للكبار والشباب',
            duration: 'من سنتين إلى 3 سنوات',
            desc: 'خطة حفظ منهجية مع ضبط المتشابهات والتفسير الميسر والوقف والابتداء.',
            badge: 'الأكثر إقبالاً',
          },
          {
            title: 'مسار الإجازة بالسند المتصل',
            target: 'للحفظة المتقنين',
            duration: 'سنة واحدة كاملة',
            desc: 'عرض القرآن كاملاً غيباً على شيخ مجاز بالسند المتصل إلى رسول الله ﷺ.',
            badge: 'إجازة معتمدة',
          },
          {
            title: 'مسار البراعم والأشبال',
            target: 'من عمر 5 إلى 14 سنة',
            duration: 'مستمر طوال العام',
            desc: 'تحبيب الناشئة في كتاب الله عبر التلقين الصوتي وأسلوب القاعدة النورانية.',
            badge: 'برنامج تربوي',
          },
          {
            title: 'مسار تصحيح التلاوة والتجويد',
            target: 'لجميع الفئات العمرية',
            duration: '6 أشهر مكثفة',
            desc: 'إتقان مخارج الحروف وصفاتها وتطبيق أحكام النون والميم والمدود عملياً.',
            badge: 'مستوى تأسيسي',
          },
        ].map((track, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {track.badge}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">⏱ {track.duration}</span>
            </div>
            <h3 className="text-sm font-bold text-white">{track.title}</h3>
            <div className="text-[11px] text-emerald-400 font-medium">الفئة: {track.target}</div>
            <p className="text-xs text-slate-300 leading-relaxed">{track.desc}</p>
          </div>
        ))}
      </div>

      {/* FEATURE 2: CERTIFIED CANONICAL TRANSLATION BANNER & SELECTOR */}
      <div className="rounded-3xl bg-slate-900/90 border border-emerald-800/50 p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-black text-white">
                ترجمة معاني القرآن الكريم الرسمية المعتمدة (Certified Quran Translations)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              جميع الترجمات مأخوذة حرفياً من إصدارات مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة وتخضع للتدقيق التام بدون أي تأويل بشري أو توليد ذكاء اصطناعي.
            </p>
          </div>

          {/* Accreditation Shield */}
          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-700/60 px-3.5 py-2 rounded-2xl shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div className="text-right">
              <span className="text-[10px] text-emerald-300 block font-bold leading-tight">اعتماد رسمي موثق</span>
              <span className="text-xs font-black text-white">خالٍ من الأخطاء والتحريف</span>
            </div>
          </div>
        </div>

        {/* Translation Language Selector Buttons (12 World Languages) */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block">
            اختر لغة ترجمة المعاني (Select Translation Language):
          </span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(QURAN_TRANSLATION_AUTHORITIES) as Language[]).map((lCode) => {
              const auth = QURAN_TRANSLATION_AUTHORITIES[lCode];
              const isSelected = activeTranslationLang === lCode;
              return (
                <button
                  key={lCode}
                  onClick={() => setActiveTranslationLang(lCode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{auth.flag}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Authority Info Card */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800/80 p-3.5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-slate-300">
          <div>
            <span className="text-amber-400 font-bold ml-1">المصدر المعتمد:</span>
            <span className="text-white font-medium">{currentAuthority.name}</span>
            <span className="text-slate-400 block sm:inline sm:mr-2">({currentAuthority.translator})</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
            {currentAuthority.accreditation}
          </span>
        </div>
      </div>

      {/* FEATURE 3: ELECTRONIC MUSHAF READER & SURAH BROWSER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Right Side / Mobile Top: Surah List Navigation */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>فهرس سور المصحف الشريف</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              {filteredSurahs.length} سور معتمدة
            </span>
          </div>

          {/* Search Surah */}
          <div className="relative">
            <Search className={`w-3.5 h-3.5 text-slate-400 absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم السورة أو رقمها..."
              className={`w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl py-2 focus:outline-none focus:border-amber-500 placeholder-slate-500 ${
                isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
              }`}
            />
          </div>

          {/* Surah List Scroll Container */}
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
            {filteredSurahs.map((surah) => {
              const isSelected = selectedSurah.number === surah.number;
              return (
                <button
                  key={surah.number}
                  onClick={() => handleSelectSurah(surah)}
                  className={`w-full p-3 rounded-xl text-right transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-500/60 text-white shadow-md'
                      : 'bg-slate-950/60 border border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {surah.number}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{surah.name}</h4>
                      <span className="text-[10px] text-slate-400">{surah.englishName}</span>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-[10px] text-emerald-400 font-medium block">
                      {surah.revelationType}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {surah.numberOfAyahs} آيات
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Left Side: Active Surah Reader with Verified Translations & Audio Reciter */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Surah Meta & Control Deck */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    السورة رقم {selectedSurah.number} • {selectedSurah.revelationType}
                  </span>
                  <span className="text-xs text-slate-400">
                    عدد الآيات: {selectedSurah.numberOfAyahs}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-amiri mt-1">
                  {selectedSurah.name} ({selectedSurah.englishName})
                </h2>
              </div>

              {/* Reciter selector & Audio Play */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-medium shrink-0">القارئ:</span>
                <select
                  value={selectedReciter.id}
                  onChange={(e) => {
                    const r = RECITERS.find((x) => x.id === e.target.value) || RECITERS[0];
                    setSelectedReciter(r);
                    setIsPlaying(false);
                  }}
                  className="bg-slate-950 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2 flex-1 sm:flex-none focus:outline-none focus:border-amber-500"
                >
                  {RECITERS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={togglePlay}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all shrink-0 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? 'إيقاف' : 'استماع'}</span>
                </button>
              </div>
            </div>

            {/* Hidden Audio Player for Surah Recitation */}
            <audio
              ref={audioRef}
              src={selectedSurah.audioUrl}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Display Options */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTafsir}
                    onChange={(e) => setShowTafsir(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>إظهار التفسير الميسر</span>
                </label>
              </div>

              <div className="flex items-center gap-1.5">
                <span>حجم خط الآيات:</span>
                {(['normal', 'large', 'huge'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      fontSize === sz 
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {sz === 'normal' ? 'عادي' : sz === 'large' ? 'كبير' : 'ضخم'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Surah Verses Container */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-xl space-y-6">
            
            {/* Basmalah */}
            {selectedSurah.number !== 9 && selectedSurah.number !== 1 && (
              <div className="text-center py-4 border-b border-slate-800/80">
                <span className="text-xl sm:text-3xl font-amiri font-bold text-amber-300 tracking-wider">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
              </div>
            )}

            {/* Ayahs List */}
            <div className="space-y-6 text-right">
              {selectedSurah.sampleAyahs.map((ayah) => {
                const translationForLang = ayah.translations?.[activeTranslationLang] || ayah.translations?.['en'] || ayah.translation;
                
                return (
                  <div
                    key={ayah.number}
                    className="p-4 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 transition-colors space-y-3 shadow-inner"
                  >
                    {/* Verse Header Badge */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/50 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-400 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/30">
                          {ayah.number}
                        </span>
                        <span className="text-xs text-slate-400">
                          {selectedSurah.name} • الآية {ayah.number}
                        </span>
                      </div>

                      <span className="text-[11px] text-emerald-400 font-mono">
                        رواية حفص عن عاصم
                      </span>
                    </div>

                    {/* Uthmani Canonical Arabic Text */}
                    <p className={`font-amiri font-bold text-slate-100 ${fontSizes[fontSize]}`}>
                      {ayah.text}
                    </p>

                    {/* Accurate Certified Canonical Translation (if not Arabic or explicitly selected) */}
                    {activeTranslationLang !== 'ar' && translationForLang && (
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-left">
                        <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold border-b border-slate-800/60 pb-1">
                          <span>{currentAuthority.name} ({currentAuthority.flag})</span>
                          <span className="text-emerald-400 text-[10px]">ترجمة معتمدة موثقة</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans pt-1">
                          {translationForLang}
                        </p>
                      </div>
                    )}

                    {/* Arabic Tafsir Al-Muyassar */}
                    {showTafsir && ayah.tafsir && (
                      <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-900/30 text-xs text-emerald-300 leading-relaxed text-right">
                        <span className="text-amber-400 font-bold block mb-0.5">التفسير الميسر:</span>
                        {ayah.tafsir}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Notice */}
            <div className="p-5 bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-800/40 rounded-2xl text-center space-y-3">
              <span className="text-xs sm:text-sm text-emerald-200 font-bold block">
                هل ترغب في حفظ القرآن الكريم كاملاً وتلقي الإجازة بالسند المتصل إلى رسول الله ﷺ؟
              </span>
              <button
                onClick={() => onNavigate('register')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-700/20 cursor-pointer"
              >
                التحق بحلقات التحفيظ والإسناد المباشرة
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
