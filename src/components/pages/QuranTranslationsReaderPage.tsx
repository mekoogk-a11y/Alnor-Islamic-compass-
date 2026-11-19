import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, Globe, Volume2, VolumeX, Play, Pause,
  Layers, Download, ArrowLeft, RefreshCw, AlertCircle, Info,
  ShieldCheck, Headphones
} from 'lucide-react';
import { NavigationPage, QuranTranslationAyah } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface QuranTranslationsReaderPageProps {
  onNavigate: (page: NavigationPage) => void;
}

const SURAHS = [
  { id: 1, nameAr: 'سورة الفاتحة', nameEn: 'Al-Fatihah', ayahs: 7, type: 'مكية' },
  { id: 2, nameAr: 'سورة البقرة', nameEn: 'Al-Baqarah', ayahs: 286, type: 'مدنية' },
  { id: 3, nameAr: 'سورة آل عمران', nameEn: "Ali 'Imran", ayahs: 200, type: 'مدنية' },
  { id: 4, nameAr: 'سورة النساء', nameEn: "An-Nisa'", ayahs: 176, type: 'مدنية' },
  { id: 18, nameAr: 'سورة الكهف', nameEn: 'Al-Kahf', ayahs: 110, type: 'مكية' },
  { id: 36, nameAr: 'سورة يس', nameEn: 'Ya-Sin', ayahs: 83, type: 'مكية' },
  { id: 55, nameAr: 'سورة الرحمن', nameEn: 'Ar-Rahman', ayahs: 78, type: 'مدنية' },
  { id: 67, nameAr: 'سورة الملك', nameEn: 'Al-Mulk', ayahs: 30, type: 'مكية' },
  { id: 112, nameAr: 'سورة الإخلاص', nameEn: 'Al-Ikhlas', ayahs: 4, type: 'مكية' },
  { id: 113, nameAr: 'سورة الفلق', nameEn: 'Al-Falaq', ayahs: 5, type: 'مكية' },
  { id: 114, nameAr: 'سورة الناس', nameEn: 'An-Nas', ayahs: 6, type: 'مكية' }
];

const AUDIO_TRANSLATION_PROVIDERS: Record<string, { reciterName: string; getUrl: (s: number, a: number) => string }> = {
  'english_saheeh': {
    reciterName: 'Ibrahim Walk (English - Saheeh International)',
    getUrl: (s, a) => `https://everyayah.com/data/English/Sahih_Intnl_Ibrahim_Walk_192kbps/${s.toString().padStart(3, '0')}${a.toString().padStart(3, '0')}.mp3`
  },
  'urdu_junagarhi': {
    reciterName: 'Shamshad Ali Khan (اردو - مولانا جونا گڑھی)',
    getUrl: (s, a) => `https://everyayah.com/data/translations/urdu_shamshad_ali_khan_46kbps/${s.toString().padStart(3, '0')}${a.toString().padStart(3, '0')}.mp3`
  },
  'persian_ih': {
    reciterName: 'Hedayatfar & Fooladvand (فارسی)',
    getUrl: (s, a) => `https://everyayah.com/data/translations/Fooladvand_Hedayatfar_40Kbps/${s.toString().padStart(3, '0')}${a.toString().padStart(3, '0')}.mp3`
  },
  'bosnian_korkut': {
    reciterName: 'Besim Korkut (Bosanski)',
    getUrl: (s, a) => `https://everyayah.com/data/translations/besim_korkut_ajet_po_ajet/${s.toString().padStart(3, '0')}${a.toString().padStart(3, '0')}.mp3`
  },
  'azerbaijani_balayev': {
    reciterName: 'Rasim Balayev (Azərbaycan)',
    getUrl: (s, a) => `https://everyayah.com/data/translations/azerbaijani/balayev/${s.toString().padStart(3, '0')}${a.toString().padStart(3, '0')}.mp3`
  }
};

interface TranslationOption {
  key: string;
  languageAr: string;
  languageNative: string;
  translator: string;
  publisher: string;
}

const TRANSLATION_OPTIONS: TranslationOption[] = [
  { key: 'english_saheeh', languageAr: 'الإنجليزية', languageNative: 'English', translator: 'Saheeh International', publisher: 'مجمع الملك فهد لطباعة المصحف الشريف' },
  { key: 'french_hamidullah', languageAr: 'الفرنسية', languageNative: 'Français', translator: 'Dr. Muhammad Hamidullah', publisher: 'مجمع الملك فهد (المدينة المنورة)' },
  { key: 'spanish_garcia', languageAr: 'الإسبانية', languageNative: 'Español', translator: 'Muhammad Isa García', publisher: 'مجمع الملك فهد' },
  { key: 'urdu_junagarhi', languageAr: 'الأوردية', languageNative: 'اردو', translator: 'مولانا محمد جونا گڑھی', publisher: 'مجمع الملك فهد' },
  { key: 'indonesian_complex', languageAr: 'الإندونيسية', languageNative: 'Bahasa Indonesia', translator: 'Kementerian Agama RI', publisher: 'مجمع الملك فهد' },
  { key: 'turkish_diyanet', languageAr: 'التركية', languageNative: 'Türkçe', translator: 'Diyanet İşleri Başkanlığı', publisher: 'رئاسة الشؤون الدينية التركية' },
  { key: 'german_bubenheim', languageAr: 'الألمانية', languageNative: 'Deutsch', translator: 'Frank Bubenheim & Nadeem Elyas', publisher: 'مجمع الملك فهد' },
  { key: 'russian_kuliev', languageAr: 'الروسية', languageNative: 'Русский', translator: 'Elmir Kuliev', publisher: 'مجمع الملك فهد' },
  { key: 'persian_ih', languageAr: 'الفارسية', languageNative: 'فارسی', translator: 'Fooladvand & Hedayatfar', publisher: 'مجمع الملك فهد' },
  { key: 'bosnian_korkut', languageAr: 'البوسنية', languageNative: 'Bosanski', translator: 'Besim Korkut', publisher: 'مجمع الملك فهد' },
  { key: 'azerbaijani_balayev', languageAr: 'الأذربيجانية', languageNative: 'Azərbaycan', translator: 'Rasim Balayev', publisher: 'مجمع الملك فهد' },
  { key: 'swahili_barwani', languageAr: 'السواحلية', languageNative: 'Kiswahili', translator: 'Ali Muhsin Al-Barwani', publisher: 'مجمع الملك فهد' },
  { key: 'chinese_makin', languageAr: 'الصينية', languageNative: '中文', translator: 'Muhammad Makin', publisher: 'مجمع الملك فهد' }
];

export const QuranTranslationsReaderPage: React.FC<QuranTranslationsReaderPageProps> = ({ onNavigate }) => {
  const { isRtl } = useLanguage();

  const [selectedSurahId, setSelectedSurahId] = useState<number>(1);
  const [selectedTranslationKey, setSelectedTranslationKey] = useState<string>('english_saheeh');
  const [secondaryTranslationKey, setSecondaryTranslationKey] = useState<string>('urdu_junagarhi');
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);

  const [arabicFontSize, setArabicFontSize] = useState<number>(24);
  const [translationFontSize, setTranslationFontSize] = useState<number>(16);
  const [showFootnotes, setShowFootnotes] = useState<boolean>(true);

  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
  const [isAudioTranslationPlaying, setIsAudioTranslationPlaying] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isArabicRecitationPlaying, setIsArabicRecitationPlaying] = useState<boolean>(false);
  const [arabicPlayingAyah, setArabicPlayingAyah] = useState<number | null>(null);
  const arabicAudioRef = useRef<HTMLAudioElement | null>(null);

  const [ayahsData, setAyahsData] = useState<QuranTranslationAyah[]>([]);
  const [secondaryAyahsData, setSecondaryAyahsData] = useState<QuranTranslationAyah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(false);

  const currentTranslationMeta = TRANSLATION_OPTIONS.find(
    (e) => e.key === selectedTranslationKey
  ) || TRANSLATION_OPTIONS[0];

  const hasAudioTranslation = Boolean(AUDIO_TRANSLATION_PROVIDERS[selectedTranslationKey]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (arabicAudioRef.current) {
      arabicAudioRef.current.pause();
      arabicAudioRef.current.src = '';
    }
    setIsAudioTranslationPlaying(false);
    setCurrentPlayingAyah(null);
    setIsArabicRecitationPlaying(false);
    setArabicPlayingAyah(null);
  };

  useEffect(() => {
    let isCancelled = false;
    const fetchSurah = async () => {
      setIsLoadingAyahs(true);
      setAudioError(null);
      stopAudio();

      try {
        const res = await fetch(`https://quranenc.com/api/v1/translation/sura/${selectedTranslationKey}/${selectedSurahId}`);
        if (!res.ok) throw new Error('Failed to fetch from QuranEnc');
        const data = await res.json();

        if (!isCancelled && data.result) {
          const mapped: QuranTranslationAyah[] = data.result.map((item: any) => ({
            id: `${selectedSurahId}_${item.aya}`,
            sura: Number(item.sura),
            aya: Number(item.aya),
            arabic_text: item.arabic_text,
            translation: item.translation,
            footnotes: item.footnotes || ''
          }));
          setAyahsData(mapped);
        }
      } catch (err) {
        console.warn('Fallback to local canonical surah excerpt:', err);
        if (!isCancelled) {
          const sampleAyahs: QuranTranslationAyah[] = [
            {
              id: `${selectedSurahId}_1`,
              sura: selectedSurahId,
              aya: 1,
              arabic_text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
              translation: selectedTranslationKey.startsWith('english')
                ? 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'
                : 'شروع کرتا ہوں اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے',
              footnotes: 'Bismillah is considered the first verse of Surah Al-Fatihah.'
            },
            {
              id: `${selectedSurahId}_2`,
              sura: selectedSurahId,
              aya: 2,
              arabic_text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
              translation: selectedTranslationKey.startsWith('english')
                ? '[All] praise is [due] to Allah, Lord of the worlds -'
                : 'سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے',
              footnotes: 'Rabb signifies the Creator, Owner, and Sustainer of everything.'
            },
            {
              id: `${selectedSurahId}_3`,
              sura: selectedSurahId,
              aya: 3,
              arabic_text: 'الرَّحْمَٰنِ الرَّحِيمِ',
              translation: selectedTranslationKey.startsWith('english')
                ? 'The Entirely Merciful, the Especially Merciful,'
                : 'بڑا مہربان، نہایت رحم فرمانے والا',
              footnotes: ''
            },
            {
              id: `${selectedSurahId}_4`,
              sura: selectedSurahId,
              aya: 4,
              arabic_text: 'مَالِكِ يَوْمِ الدِّينِ',
              translation: selectedTranslationKey.startsWith('english')
                ? 'Sovereign of the Day of Recompense.'
                : 'روز جزا کا مالک',
              footnotes: 'Yawm ad-Deen means the Day of Judgment.'
            },
            {
              id: `${selectedSurahId}_5`,
              sura: selectedSurahId,
              aya: 5,
              arabic_text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
              translation: selectedTranslationKey.startsWith('english')
                ? 'It is You we worship and You we ask for help.'
                : 'ہم صرف تیری ہی عبادت کرتے ہیں اور صرف تجھ ہی سے مدد مانگتے ہیں',
              footnotes: 'Direct dedication of pure monotheism (Tawheed).'
            },
            {
              id: `${selectedSurahId}_6`,
              sura: selectedSurahId,
              aya: 6,
              arabic_text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
              translation: selectedTranslationKey.startsWith('english')
                ? 'Guide us to the straight path -'
                : 'ہمیں سیدھے راستے کی ہدایت فرما',
              footnotes: 'As-Sirat al-Mustaqeem: the path of Islam, truth, and righteousness.'
            },
            {
              id: `${selectedSurahId}_7`,
              sura: selectedSurahId,
              aya: 7,
              arabic_text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
              translation: selectedTranslationKey.startsWith('english')
                ? 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.'
                : 'ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، نہ ان کا جن پر غضب نازل ہوا اور نہ گمراہوں کا',
              footnotes: 'Amen.'
            }
          ];
          setAyahsData(sampleAyahs);
        }
      } finally {
        if (!isCancelled) setIsLoadingAyahs(false);
      }
    };

    fetchSurah();
    return () => { isCancelled = true; };
  }, [selectedSurahId, selectedTranslationKey]);

  useEffect(() => {
    if (!isCompareMode) return;
    let isCancelled = false;
    const fetchSecondary = async () => {
      try {
        const res = await fetch(`https://quranenc.com/api/v1/translation/sura/${secondaryTranslationKey}/${selectedSurahId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!isCancelled && data.result) {
          const mapped: QuranTranslationAyah[] = data.result.map((item: any) => ({
            id: `${selectedSurahId}_${item.aya}`,
            sura: Number(item.sura),
            aya: Number(item.aya),
            arabic_text: item.arabic_text,
            translation: item.translation,
            footnotes: item.footnotes || ''
          }));
          setSecondaryAyahsData(mapped);
        }
      } catch {
        // Optional secondary comparison fallback ignored silently
      }
    };
    fetchSecondary();
    return () => { isCancelled = true; };
  }, [isCompareMode, secondaryTranslationKey, selectedSurahId]);

  const playAudioTranslation = (ayahNum: number) => {
    const provider = AUDIO_TRANSLATION_PROVIDERS[selectedTranslationKey];
    if (!provider) {
      setAudioError(`التسجيل الصوتي غير متوفر لهذه الترجمة (${currentTranslationMeta.languageAr}) حالياً، ويتم العمل على إضافته قريباً.`);
      return;
    }

    setAudioError(null);
    if (isAudioTranslationPlaying && currentPlayingAyah === ayahNum) {
      audioRef.current?.pause();
      setIsAudioTranslationPlaying(false);
      return;
    }

    const audioUrl = provider.getUrl(selectedSurahId, ayahNum);
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    audioRef.current.src = audioUrl;
    audioRef.current.play().then(() => {
      setIsAudioTranslationPlaying(true);
      setCurrentPlayingAyah(ayahNum);
    }).catch((err) => {
      console.warn('Audio playback error:', err);
      setAudioError('تعذر تشغيل التسجيل الصوتي للترجمة من الخادم.');
      setIsAudioTranslationPlaying(false);
    });

    audioRef.current.onended = () => {
      const nextAyah = ayahNum + 1;
      const surahMeta = SURAHS.find(s => s.id === selectedSurahId);
      if (surahMeta && nextAyah <= surahMeta.ayahs) {
        playAudioTranslation(nextAyah);
      } else {
        setIsAudioTranslationPlaying(false);
        setCurrentPlayingAyah(null);
      }
    };
  };

  const playArabicRecitation = (ayahNum: number) => {
    if (isArabicRecitationPlaying && arabicPlayingAyah === ayahNum) {
      arabicAudioRef.current?.pause();
      setIsArabicRecitationPlaying(false);
      return;
    }

    const sPadded = selectedSurahId.toString().padStart(3, '0');
    const aPadded = ayahNum.toString().padStart(3, '0');
    const arabicUrl = `https://everyayah.com/data/Alafasy_128kbps/${sPadded}${aPadded}.mp3`;

    if (!arabicAudioRef.current) {
      arabicAudioRef.current = new Audio();
    }

    arabicAudioRef.current.src = arabicUrl;
    arabicAudioRef.current.play().then(() => {
      setIsArabicRecitationPlaying(true);
      setArabicPlayingAyah(ayahNum);
    }).catch(() => {
      setIsArabicRecitationPlaying(false);
    });

    arabicAudioRef.current.onended = () => {
      setIsArabicRecitationPlaying(false);
      setArabicPlayingAyah(null);
    };
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Sky-Blue 3D Header Banner */}
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-10 shadow-xl border border-[#87CEEB]/55 bg-gradient-to-br from-[#12345A] via-[#0F3F6B] to-[#0EA5A4] text-white">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="hidden sm:block shrink-0">
              <Sky3DIcon slug="translationsReader" tone="ocean" size="lg" />
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-bold text-[#F7E7B4] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#87CEEB]" />
                <span>قسم ترجمات معاني القرآن الكريم متعدد اللغات · مجمع الملك فهد لطباعة المصحف</span>
              </p>

              <h1 className="text-2xl sm:text-4xl font-black text-white font-amiri leading-tight">
                قارئ ترجمات معاني القرآن الكريم العالمية
              </h1>

              <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed">
                تصفح معاني القرآن الكريم باللغات العالمية الحية مع النص العثماني الشريف، استمع للتلاوة الصوتية المسجلة للترجمة بلغتك بصوت نخبة من المتحدثين الأصليين، وقارن بين الترجمات المعتمدة آية بآية بدقة علمية موثقة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('quran')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-[#87CEEB]/50 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              <span>المصحف الشريف</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('library')}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>مركز تنزيل المصاحف PDF</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Control Console */}
      <section className="sky-card-3d rounded-3xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* 1. Surah Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#12345A] dark:text-[#EAF8FF] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#0EA5A4]" />
              <span>اختر السورة الكريمة:</span>
            </label>
            <select
              value={selectedSurahId}
              onChange={(e) => setSelectedSurahId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-[#EAF8FF] dark:bg-[#0F2747] text-xs font-bold text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
            >
              {SURAHS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}. {s.nameAr} ({s.nameEn} - {s.ayahs} آيات)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Primary Translation Switcher */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#12345A] dark:text-[#EAF8FF] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#0EA5A4]" />
              <span>لغة الترجمة الأساسية:</span>
            </label>
            <select
              value={selectedTranslationKey}
              onChange={(e) => setSelectedTranslationKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-[#EAF8FF] dark:bg-[#0F2747] text-xs font-bold text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
            >
              {TRANSLATION_OPTIONS.map((ed) => (
                <option key={ed.key} value={ed.key}>
                  {ed.languageNative} · {ed.languageAr} ({ed.translator})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Audio Translation Status Indicator */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#12345A] dark:text-[#EAF8FF] flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-[#0EA5A4]" />
              <span>التسجيل الصوتي للترجمة:</span>
            </label>
            <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${
              hasAudioTranslation
                ? 'bg-[#EAF8FF] dark:bg-[#0F2747] border-[#0EA5A4]/50 text-[#0D7A7A] dark:text-[#2DD4BF]'
                : 'bg-[#FFF9E6] dark:bg-[#102A4C] border-[#D4AF37]/50 text-[#9E7818] dark:text-[#F7E7B4]'
            }`}>
              {hasAudioTranslation ? (
                <>
                  <Volume2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">متوفر: {AUDIO_TRANSLATION_PROVIDERS[selectedTranslationKey]?.reciterName.split('(')[0]}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 shrink-0" />
                  <span>غير متوفر صوتياً حالياً</span>
                </>
              )}
            </div>
          </div>

          {/* 4. Display Controls & Compare Mode Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#12345A] dark:text-[#EAF8FF] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#0EA5A4]" />
              <span>خيارات العرض والمقارنة:</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCompareMode(!isCompareMode)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCompareMode
                    ? 'bg-[#12345A] text-white border-[#D4AF37] shadow-sm'
                    : 'bg-[#EAF8FF] dark:bg-[#0F2747] border-[#87CEEB]/60 text-[#12345A] dark:text-[#EAF8FF]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isCompareMode ? 'إلغاء المقارنة' : 'مقارنة ترجمتين'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFootnotes(!showFootnotes)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  showFootnotes
                    ? 'bg-[#0EA5A4] text-white border-[#0EA5A4]'
                    : 'bg-[#EAF8FF] dark:bg-[#0F2747] border-[#87CEEB]/60 text-[#4A7298]'
                }`}
              >
                الهوامش
              </button>
            </div>
          </div>
        </div>

        {/* Secondary translation selector when compare mode is enabled */}
        {isCompareMode && (
          <div className="p-4 rounded-2xl sky-glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#12345A] dark:text-[#EAF8FF]">
              <Layers className="w-4 h-4 text-[#0EA5A4]" />
              <span>اختر الترجمة الثانية للمقارنة آية بآية:</span>
            </div>

            <select
              value={secondaryTranslationKey}
              onChange={(e) => setSecondaryTranslationKey(e.target.value)}
              className="px-4 py-2 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 text-xs font-bold bg-white dark:bg-[#0F2747] text-[#12345A] dark:text-[#EAF8FF]"
            >
              {TRANSLATION_OPTIONS.map((ed) => (
                <option key={ed.key} value={ed.key}>
                  {ed.languageNative} · {ed.languageAr} ({ed.translator})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Font size sliders */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[#2B547E] dark:text-[#B8DEF5] font-bold">حجم خط الرسم العثماني:</span>
            <input
              type="range"
              min="18"
              max="36"
              value={arabicFontSize}
              onChange={(e) => setArabicFontSize(Number(e.target.value))}
              className="accent-[#0EA5A4] w-28 h-1.5 cursor-pointer"
            />
            <span className="font-mono tabular-nums font-bold text-[#12345A] dark:text-[#F7E7B4]">{arabicFontSize}px</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#2B547E] dark:text-[#B8DEF5] font-bold">حجم خط الترجمة:</span>
            <input
              type="range"
              min="13"
              max="24"
              value={translationFontSize}
              onChange={(e) => setTranslationFontSize(Number(e.target.value))}
              className="accent-[#0EA5A4] w-28 h-1.5 cursor-pointer"
            />
            <span className="font-mono tabular-nums font-bold text-[#12345A] dark:text-[#F7E7B4]">{translationFontSize}px</span>
          </div>
        </div>
      </section>

      {/* Audio Error Alert */}
      {audioError && (
        <div className="p-4 rounded-2xl bg-[#FFF9E6] dark:bg-[#102A4C] border border-[#D4AF37] text-[#12345A] dark:text-[#F7E7B4] text-xs font-bold flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#9E7818]" />
            <span>{audioError}</span>
          </div>
          <button
            type="button"
            onClick={() => setAudioError(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Ayahs Translation Reader Container */}
      <section className="space-y-6">
        <div className="scholarly-reading-paper rounded-3xl p-6 text-center space-y-1.5 shadow-md">
          <p className="text-xs font-bold text-[#0D7A7A] dark:text-[#2DD4BF]">
            {SURAHS.find(s => s.id === selectedSurahId)?.type} · {SURAHS.find(s => s.id === selectedSurahId)?.ayahs} آيات
          </p>
          <h2 className="text-2xl sm:text-3xl font-black font-amiri text-[#12345A] dark:text-white">
            {SURAHS.find(s => s.id === selectedSurahId)?.nameAr}
          </h2>
          <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-mono">
            {currentTranslationMeta.languageAr} · {currentTranslationMeta.languageNative} — {currentTranslationMeta.publisher}
          </p>
        </div>

        {isLoadingAyahs ? (
          <div className="py-16 text-center space-y-3 sky-card-3d rounded-3xl">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#0EA5A4]" />
            <p className="text-xs font-bold text-[#12345A] dark:text-[#B8DEF5]">
              جاري جلب نص السورة وترجمتها المعتمدة...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ayahsData.map((ayah) => {
              const isTranslationAudioActive = isAudioTranslationPlaying && currentPlayingAyah === ayah.aya;
              const isArabicAudioActive = isArabicRecitationPlaying && arabicPlayingAyah === ayah.aya;
              const secondaryAyah = secondaryAyahsData.find(s => s.aya === ayah.aya);

              return (
                <div
                  key={ayah.id}
                  className={`scholarly-reading-paper rounded-3xl p-6 sm:p-8 transition-all space-y-5 ${
                    isTranslationAudioActive || isArabicAudioActive
                      ? 'ring-2 ring-[#0EA5A4] border-[#0EA5A4]'
                      : ''
                  }`}
                >
                  {/* Top Ayah bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#12345A] text-[#F7E7B4] text-xs font-black font-amiri flex items-center justify-center shadow-sm tabular-nums">
                        {ayah.aya}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#2B547E] dark:text-[#B8DEF5]">
                        الآية {ayah.aya}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => playArabicRecitation(ayah.aya || 1)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                          isArabicAudioActive
                            ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                            : 'bg-[#EAF8FF] dark:bg-[#0F2747] border-[#87CEEB]/60 text-[#12345A] dark:text-[#EAF8FF] hover:border-[#0EA5A4]'
                        }`}
                      >
                        {isArabicAudioActive ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current text-[#0EA5A4]" />}
                        <span>تلاوة عربية</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => playAudioTranslation(ayah.aya || 1)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                          isTranslationAudioActive
                            ? 'bg-[#0EA5A4] text-white border-[#0EA5A4] animate-pulse'
                            : 'bg-[#12345A] text-white border-[#12345A] hover:bg-[#0EA5A4]'
                        }`}
                      >
                        {isTranslationAudioActive ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-[#F7E7B4]" />}
                        <span>صوت الترجمة</span>
                      </button>
                    </div>
                  </div>

                  {/* Canonical Uthmani Arabic Script */}
                  <div className="text-right">
                    <p
                      className="font-amiri font-bold text-[#12345A] dark:text-white leading-loose"
                      style={{ fontSize: `${arabicFontSize}px` }}
                      dir="rtl"
                    >
                      {ayah.arabic_text} ﴿{ayah.aya}﴾
                    </p>
                  </div>

                  {/* Translation Text */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF8FF]/80 dark:bg-[#0F2747]/80 border border-[#87CEEB]/45 dark:border-[#87CEEB]/25 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#0D7A7A] dark:text-[#2DD4BF]">
                      <span>{currentTranslationMeta.languageNative} ({currentTranslationMeta.languageAr})</span>
                      <span>{currentTranslationMeta.translator}</span>
                    </div>

                    <p
                      className="text-[#12345A] dark:text-[#EAF8FF] leading-relaxed"
                      style={{ fontSize: `${translationFontSize}px` }}
                      dir={currentTranslationMeta.languageAr === 'الأوردية' || currentTranslationMeta.languageAr === 'الفارسية' ? 'rtl' : 'ltr'}
                    >
                      {ayah.translation}
                    </p>

                    {showFootnotes && ayah.footnotes && (
                      <div className="pt-2 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 text-xs text-[#2B547E] dark:text-[#B8DEF5] flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-[#0EA5A4] shrink-0 mt-0.5" />
                        <span className="leading-normal">{ayah.footnotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Secondary Translation in Compare Mode */}
                  {isCompareMode && secondaryAyah && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9E6] dark:bg-[#14335B] border border-[#D4AF37]/50 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#9E7818] dark:text-[#F7E7B4]">
                        <span>ترجمة المقارنة: {secondaryTranslationKey}</span>
                        <span>مجمع الملك فهد</span>
                      </div>
                      <p
                        className="text-[#12345A] dark:text-[#EAF8FF] leading-relaxed"
                        style={{ fontSize: `${translationFontSize}px` }}
                      >
                        {secondaryAyah.translation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Accreditation Footer */}
      <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#12345A] to-[#0EA5A4] text-white border border-[#87CEEB]/50 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[#F7E7B4] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>الاعتماد الأكاديمي والتوثيق الشرعي</span>
            </span>
            <h3 className="text-lg font-black font-amiri text-white">
              معايير ترجمات معاني القرآن الكريم بمجمع النور
            </h3>
            <p className="text-xs text-[#D7F1FC] max-w-2xl">
              تعتمد المنصة حصرياً الترجمات الصادرة والمعتمدة رسمياً من مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة ومؤسسة القرآن العالمية، لضمان سلامة العقيدة ودقة نقل المعاني.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('library')}
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] text-xs font-black transition-all shrink-0 cursor-pointer"
          >
            تنزيل كتب التفسير والترجمات الكاملة
          </button>
        </div>
      </section>

      <SectionDynamicItems sectionSlug="translationsReader" />
    </div>
  );
};
