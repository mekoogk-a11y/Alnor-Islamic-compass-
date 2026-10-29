import React, { useState, useRef } from 'react';
import { 
  BookOpen, Play, Pause, Volume2, Search, Check, 
  Award, Sparkles, ChevronRight, BookCheck, ShieldCheck, ArrowLeft 
} from 'lucide-react';
import { NavigationPage, QuranSurah } from '../../types';
import { FEATURED_SURAHS, RECITERS } from '../../data/islamicData';

interface QuranPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const QuranPage: React.FC<QuranPageProps> = ({ onNavigate }) => {
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah>(FEATURED_SURAHS[0]);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [showTafsir, setShowTafsir] = useState(true);

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
    s.name.includes(searchQuery) || s.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fontSizes = {
    normal: 'text-lg sm:text-xl leading-relaxed',
    large: 'text-xl sm:text-2xl leading-loose',
    huge: 'text-2xl sm:text-3xl leading-loose font-extrabold',
  };

  return (
    <div className="space-y-10">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 border border-emerald-900/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
          <BookCheck className="w-4 h-4" />
          <span>المقرأة القرآنية العالمية • مجمع النور الإسلامي</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          تحفيظ القرآن الكريم والإجازات بالسند المتصل
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          حلقات نموذجية عالمية بإشراف كبار المقرئين المجازين بالقراءات العشر المتواترة، تتيح للطلاب في أنحاء العالم الحفظ والإتقان ونيل الإجازة بالسند المتصل إلى النبي ﷺ.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('register')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all"
          >
            سجل الآن في الحلقات القرآنية
          </button>
        </div>
      </div>

      {/* 4 Quranic Tracks Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Main Interactive Quran Reader & Audio Station */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar: Surah List (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-black text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>فهرس السور المباركة</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {filteredSurahs.length} سور متاحة
            </span>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute top-3 right-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اسم السورة..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredSurahs.map((surah) => {
              const isSelected = selectedSurah.number === surah.number;
              return (
                <button
                  key={surah.number}
                  onClick={() => handleSelectSurah(surah)}
                  className={`w-full text-right p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/80 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 text-xs font-mono font-bold flex items-center justify-center">
                      {surah.number}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">{surah.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{surah.englishName}</div>
                    </div>
                  </div>
                  <div className="text-left text-[11px] text-slate-400">
                    <span className="block">{surah.numberOfAyahs} آيات</span>
                    <span className="text-[10px] text-emerald-400">{surah.revelationType}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Surah Display & Ayahs (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Audio Controls Header */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                  {selectedSurah.revelationType} • {selectedSurah.numberOfAyahs} آيات
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  {selectedSurah.name}
                </h2>
              </div>

              {/* Reciter selector */}
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
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all shrink-0"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? 'إيقاف' : 'استماع'}</span>
                </button>
              </div>
            </div>

            {/* Hidden Audio Player */}
            <audio
              ref={audioRef}
              src={selectedSurah.audioUrl}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Display Options */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-3">
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
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      fontSize === sz ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {sz === 'normal' ? 'عادي' : sz === 'large' ? 'كبير' : 'ضخم'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Surah Verses Container */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* Basmalah */}
            {selectedSurah.number !== 9 && (
              <div className="text-center py-4 border-b border-slate-800/80">
                <span className="text-xl sm:text-2xl font-amiri font-bold text-amber-300 tracking-wider">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
              </div>
            )}

            {/* Ayahs List */}
            <div className="space-y-6 text-right">
              {selectedSurah.sampleAyahs.map((ayah) => (
                <div
                  key={ayah.number}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/30 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/50 pb-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center border border-amber-500/20">
                      {ayah.number}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {selectedSurah.name} • الآية {ayah.number}
                    </span>
                  </div>

                  {/* Quranic Text */}
                  <p className={`font-amiri font-bold text-slate-100 ${fontSizes[fontSize]}`}>
                    {ayah.text}
                  </p>

                  {/* Tafsir */}
                  {showTafsir && ayah.tafsir && (
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-emerald-300/90 leading-relaxed">
                      <span className="text-amber-400 font-bold block mb-0.5">التفسير الميسر:</span>
                      {ayah.tafsir}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer Notice */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-center space-y-2">
              <span className="text-xs text-emerald-300 font-bold block">
                هل ترغب بحفظ السورة كاملة على أيدي مشايخ معتمدين؟
              </span>
              <button
                onClick={() => onNavigate('register')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-md"
              >
                التحق بحلقات التحفيظ المباشرة مجاناً
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
