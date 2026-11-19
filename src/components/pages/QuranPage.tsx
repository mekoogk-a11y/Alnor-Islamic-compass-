import React, { useState, useRef } from 'react';
import {
  BookOpen, Play, Pause, Search, Check,
  BookCheck, ShieldCheck, Languages, Download
} from 'lucide-react';
import { NavigationPage, QuranSurah, Language } from '../../types';
import { FEATURED_SURAHS, RECITERS, QURAN_TRANSLATION_AUTHORITIES } from '../../data/islamicData';
import { LiveMakkahQuranRadio } from '../LiveMakkahQuranRadio';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface QuranPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const QuranPage: React.FC<QuranPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
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
    <div className="space-y-10 sm:space-y-12" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Sky-Blue 3D Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] border border-[#87CEEB]/55 rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 text-center text-white">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 space-y-3 flex flex-col items-center">
          <Sky3DIcon slug="quran" tone="sky" size="lg" />

          <p className="text-xs font-bold text-[#87CEEB] flex items-center gap-1.5">
            <BookCheck className="w-4 h-4 text-[#F7E7B4]" />
            <span>المقرأة القرآنية والمصحف الإلكتروني العالمي · مجمع النور</span>
          </p>

          <h1 className="text-2xl sm:text-4xl font-black text-white font-amiri leading-tight">
            المصحف الإلكتروني والترجمات المعتمدة وإذاعة مكة المكرمة
          </h1>

          <p className="text-xs sm:text-sm text-[#D7F1FC] max-w-2xl mx-auto leading-relaxed">
            تلاوة القرآن الكريم بالرسم العثماني الموثق، مع ترجمة معاني الآيات إلى 12 لغة عالمية معتمدة من مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة، والاستماع المباشر لإذاعة القرآن من الحرم المكي الشريف.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] font-black text-xs sm:text-sm px-6 py-2.5 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              سجل الآن في الحلقات القرآنية والإجازات
            </button>
            <button
              type="button"
              onClick={() => onNavigate('library')}
              className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl border border-[#87CEEB]/50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#F7E7B4]" />
              <span>تحميل ترجمات معاني القرآن الأصلية (PDF لـ 18+ لغة)</span>
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
          <div key={i} className="sky-card-3d p-5 rounded-3xl space-y-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
                {track.badge}
              </span>
              <span className="text-[#4A7298] dark:text-[#B8DEF5] font-mono">{track.duration}</span>
            </div>
            <h3 className="text-sm font-black text-[#12345A] dark:text-white">{track.title}</h3>
            <div className="text-[11px] text-[#0EA5A4] font-bold">الفئة: {track.target}</div>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">{track.desc}</p>
          </div>
        ))}
      </div>

      {/* FEATURE 2: CERTIFIED CANONICAL TRANSLATION BANNER & SELECTOR */}
      <div className="sky-card-3d rounded-3xl p-5 sm:p-7 space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-[#0EA5A4]" />
              <h3 className="text-base sm:text-lg font-black text-[#12345A] dark:text-white">
                ترجمة معاني القرآن الكريم الرسمية المعتمدة (Certified Quran Translations)
              </h3>
            </div>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
              جميع الترجمات مأخوذة حرفياً من إصدارات مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة وتخضع للتدقيق التام بدون أي تأويل بشري أو توليد ذكاء اصطناعي.
            </p>
          </div>

          {/* Accreditation Shield */}
          <div className="flex items-center gap-2 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#0EA5A4]/45 px-3.5 py-2 rounded-2xl shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#0EA5A4]" />
            <div className="text-right">
              <span className="text-[10px] text-[#0D7A7A] dark:text-[#87CEEB] block font-bold leading-tight">اعتماد رسمي موثق</span>
              <span className="text-xs font-black text-[#12345A] dark:text-white">خالٍ من الأخطاء والتحريف</span>
            </div>
          </div>
        </div>

        {/* Translation Language Selector Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] block">
            اختر لغة ترجمة المعاني (Select Translation Language):
          </span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(QURAN_TRANSLATION_AUTHORITIES) as Language[]).map((lCode) => {
              const auth = QURAN_TRANSLATION_AUTHORITIES[lCode];
              const isSelected = activeTranslationLang === lCode;
              return (
                <button
                  key={lCode}
                  type="button"
                  onClick={() => setActiveTranslationLang(lCode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4] font-black shadow-md scale-105'
                      : 'bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-[#B8DEF5] hover:border-[#0EA5A4]'
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
        <div className="bg-[#EAF8FF]/85 dark:bg-[#0F2747]/90 rounded-2xl border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 p-3.5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[#12345A] dark:text-[#EAF8FF]">
          <div>
            <span className="text-[#0D7A7A] dark:text-[#87CEEB] font-bold ml-1">المصدر المعتمد:</span>
            <span className="font-bold">{currentAuthority.name}</span>
            <span className="text-[#4A7298] dark:text-[#B8DEF5] block sm:inline sm:mr-2">({currentAuthority.translator})</span>
          </div>
          <span className="text-[11px] text-[#0D7A7A] dark:text-[#87CEEB] font-mono font-bold">
            {currentAuthority.accreditation}
          </span>
        </div>
      </div>

      {/* FEATURE 3: ELECTRONIC MUSHAF READER & SURAH BROWSER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Surah List Navigation */}
        <div className="lg:col-span-4 sky-card-3d rounded-3xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-3">
            <h3 className="text-sm font-black text-[#12345A] dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0EA5A4]" />
              <span>فهرس سور المصحف الشريف</span>
            </h3>
            <span className="text-[11px] font-mono text-[#0D7A7A] dark:text-[#87CEEB] font-bold">
              {filteredSurahs.length} سور معتمدة
            </span>
          </div>

          {/* Search Surah */}
          <div className="relative">
            <Search className={`w-3.5 h-3.5 text-[#0EA5A4] absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم السورة أو رقمها..."
              className={`w-full bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 text-xs text-[#12345A] dark:text-white rounded-xl py-2 focus:outline-none focus:border-[#0EA5A4] ${
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
                  type="button"
                  onClick={() => handleSelectSurah(surah)}
                  className={`w-full p-3 rounded-2xl text-right transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#12345A] text-white shadow-md border border-[#D4AF37]'
                      : 'bg-[#EAF8FF]/70 dark:bg-[#0F2747]/80 border border-[#87CEEB]/40 dark:border-[#87CEEB]/20 text-[#12345A] dark:text-[#EAF8FF] hover:border-[#0EA5A4]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#12345A] font-black'
                        : 'bg-white dark:bg-[#14335B] text-[#12345A] dark:text-[#87CEEB] border border-[#87CEEB]/40'
                    }`}>
                      {surah.number}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold">{surah.name}</h4>
                      <span className={`text-[10px] ${isSelected ? 'text-[#87CEEB]' : 'text-[#4A7298] dark:text-[#B8DEF5]'}`}>
                        {surah.englishName}
                      </span>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className={`text-[10px] font-bold block ${isSelected ? 'text-[#F7E7B4]' : 'text-[#0EA5A4]'}`}>
                      {surah.revelationType}
                    </span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-[#CBEBFB]' : 'text-[#4A7298] dark:text-[#84B4D6]'}`}>
                      {surah.numberOfAyahs} آيات
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Surah Reader with Verified Translations & Audio Reciter */}
        <div className="lg:col-span-8 space-y-6">

          {/* Surah Meta & Control Deck */}
          <div className="sky-card-3d rounded-3xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
                    السورة رقم {selectedSurah.number} · {selectedSurah.revelationType}
                  </span>
                  <span className="text-[#4A7298] dark:text-[#B8DEF5]">
                    · عدد الآيات: {selectedSurah.numberOfAyahs}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white font-amiri mt-1">
                  {selectedSurah.name} ({selectedSurah.englishName})
                </h2>
              </div>

              {/* Reciter selector & Audio Play */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-bold shrink-0">القارئ:</span>
                <select
                  value={selectedReciter.id}
                  onChange={(e) => {
                    const r = RECITERS.find((x) => x.id === e.target.value) || RECITERS[0];
                    setSelectedReciter(r);
                    setIsPlaying(false);
                  }}
                  className="bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 text-[#12345A] dark:text-white text-xs font-bold rounded-xl px-3 py-2 flex-1 sm:flex-none focus:outline-none focus:border-[#0EA5A4]"
                >
                  {RECITERS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={togglePlay}
                  className="bg-[#0EA5A4] hover:bg-[#0D7A7A] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer"
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
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#2B547E] dark:text-[#B8DEF5] pt-1">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={showTafsir}
                    onChange={(e) => setShowTafsir(e.target.checked)}
                    className="accent-[#0EA5A4] rounded"
                  />
                  <span>إظهار التفسير الميسر</span>
                </label>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold">حجم خط الآيات:</span>
                {(['normal', 'large', 'huge'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFontSize(sz)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      fontSize === sz
                        ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4] shadow-sm'
                        : 'bg-[#EAF8FF] dark:bg-[#0F2747] text-[#12345A] dark:text-[#B8DEF5] border border-[#87CEEB]/50'
                    }`}
                  >
                    {sz === 'normal' ? 'عادي' : sz === 'large' ? 'كبير' : 'ضخم'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Surah Verses Container */}
          <div className="scholarly-reading-paper rounded-3xl p-5 sm:p-8 shadow-xl space-y-6">

            {/* Basmalah */}
            {selectedSurah.number !== 9 && selectedSurah.number !== 1 && (
              <div className="text-center py-4 border-b border-[#87CEEB]/40">
                <span className="text-xl sm:text-3xl font-amiri font-bold text-[#12345A] tracking-wider">
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
                    className="p-4 sm:p-6 rounded-2xl bg-[#EAF8FF]/65 border border-[#87CEEB]/55 hover:border-[#0EA5A4] transition-colors space-y-3"
                  >
                    {/* Verse Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-[#87CEEB]/35 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#12345A] text-[#F7E7B4] font-mono text-xs font-bold flex items-center justify-center">
                          {ayah.number}
                        </span>
                        <span className="text-xs font-bold text-[#2B547E]">
                          {selectedSurah.name} · الآية {ayah.number}
                        </span>
                      </div>

                      <span className="text-[11px] text-[#0D7A7A] font-mono font-bold">
                        رواية حفص عن عاصم
                      </span>
                    </div>

                    {/* Uthmani Canonical Arabic Text */}
                    <p className={`font-amiri font-bold text-[#12345A] ${fontSizes[fontSize]}`}>
                      {ayah.text}
                    </p>

                    {/* Accurate Certified Canonical Translation */}
                    {activeTranslationLang !== 'ar' && translationForLang && (
                      <div className="p-3.5 rounded-xl bg-white border border-[#87CEEB]/50 space-y-1 text-left">
                        <div className="flex items-center justify-between text-[11px] text-[#12345A] font-bold border-b border-[#87CEEB]/30 pb-1">
                          <span>{currentAuthority.name} ({currentAuthority.flag})</span>
                          <span className="text-[#0EA5A4] text-[10px]">ترجمة معتمدة موثقة</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#12345A] leading-relaxed font-sans pt-1">
                          {translationForLang}
                        </p>
                      </div>
                    )}

                    {/* Arabic Tafsir Al-Muyassar */}
                    {showTafsir && ayah.tafsir && (
                      <div className="p-3.5 bg-white/90 rounded-xl border border-[#0EA5A4]/35 text-xs text-[#12345A] leading-relaxed text-right">
                        <span className="text-[#0D7A7A] font-black block mb-0.5">التفسير الميسر:</span>
                        {ayah.tafsir}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Notice */}
            <div className="p-5 bg-gradient-to-r from-[#12345A] to-[#0EA5A4] border border-[#87CEEB]/50 rounded-2xl text-center space-y-3 text-white">
              <span className="text-xs sm:text-sm font-bold block">
                هل ترغب في حفظ القرآن الكريم كاملاً وتلقي الإجازة بالسند المتصل إلى رسول الله ﷺ؟
              </span>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                التحق بحلقات التحفيظ والإسناد المباشرة
              </button>
            </div>

          </div>

        </div>

      </div>

      <SectionDynamicItems sectionSlug="quran" />

    </div>
  );
};
