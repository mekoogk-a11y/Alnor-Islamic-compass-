import React, { useState, useMemo } from 'react';
import {
  Play,
  Search,
  FolderPlus,
  Layers,
  Video,
  Clock,
  User,
  ChevronLeft,
  Check,
  Bookmark,
  BookmarkCheck,
  Share2,
  ListFilter,
  Tag,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { DawahLecture, DawahCategory } from '../types';
import { DAWAH_CATEGORIES, INITIAL_DAWAH_SCHOLARS, INITIAL_DAWAH_LECTURES } from '../data/dawahData';
import { useToast } from '../context/ToastContext';
import { createVideoPosterDataUri } from '../utils/islamicArtwork';

export interface VideoSeries {
  id: string;
  titleAr: string;
  titleEn: string;
  scholarId: string;
  scholarNameAr: string;
  category: DawahCategory;
  totalEpisodes: number;
  descriptionAr: string;
  descriptionEn: string;
  coverImage?: string;
  featured?: boolean;
  language: string;
}

export const INITIAL_VIDEO_SERIES: VideoSeries[] = [
  {
    id: 'deedat-debates-master',
    titleAr: 'سلسلة مناظرات الشيخ أحمد ديدات الكبرى مع كبار المنصرين',
    titleEn: 'Sheikh Ahmed Deedat Major Debates Series',
    scholarId: 'deedat',
    scholarNameAr: 'الشيخ أحمد ديدات',
    category: 'comparative_religion',
    totalEpisodes: 24,
    descriptionAr:
      'الموسوعة الكاملة لمناظرات فارس الدعوة الشيخ أحمد ديدات رحمه الله في جنوب أفريقيا وأمريكا وبريطانيا، مترجمة ومفهرسة بالأدلة من القرآن والإنجيل.',
    descriptionEn:
      'The definitive archive of Sheikh Ahmed Deedat’s debates with Christian theologians, fully cross-referenced.',
    featured: true,
    language: 'ar',
  },
  {
    id: 'zakir-quran-modern-science',
    titleAr: 'سلسلة القرآن والعلم الحديث: توافق أم تعارض؟ - د. ذاكر نايك',
    titleEn: 'The Quran & Modern Science: Compatible or Incompatible? - Dr. Zakir Naik',
    scholarId: 'zakir_naik',
    scholarNameAr: 'الدكتور ذاكر نايك',
    category: 'quran_science',
    totalEpisodes: 30,
    descriptionAr:
      'أقوى سلسلة علمية تثبت بالحقائق الكونية والطبية والفلكية إعجاز القرآن الكريم، مع إجابات فورية على أسئلة المشككين والملحدين.',
    descriptionEn:
      'Comprehensive scientific lecture series detailing scientific miracles in the Quran and answers to skeptics.',
    featured: true,
    language: 'ar',
  },
  {
    id: 'menk-heart-therapy',
    titleAr: 'سلسلة سكينة القلوب ومعارج الإيمان - د. إسماعيل منك',
    titleEn: 'Tranquility of the Soul & Steps of Faith - Mufti Ismail Menk',
    scholarId: 'ismail_menk',
    scholarNameAr: 'المفتي إسماعيل منك',
    category: 'intro_to_islam',
    totalEpisodes: 20,
    descriptionAr:
      'دروس إيمانية رقيقة تلامس مشاعر الشباب والمهتدين، تعالج القلق والضيق وتعزز حسن الظن بالله والرحمة في الإسلام.',
    descriptionEn:
      'Heartfelt, uplifting series focusing on emotional well-being, mercy in Islam, and reconnecting with Allah.',
    featured: true,
    language: 'en',
  },
  {
    id: 'revert-stories-global',
    titleAr: 'سلسلة رحلة إلى النور: شهادات وقصص المهتدين الجدد',
    titleEn: 'Journey to the Light: True Revert Stories',
    scholarId: 'yusuf_estes',
    scholarNameAr: 'الشيخ يوسف إستس',
    category: 'new_muslims',
    totalEpisodes: 18,
    descriptionAr:
      'قصص ملهمة لعلماء وقساوسة ومفكرين من مختلف قارات العالم وجدوا الطمأنينة في رحاب الإسلام بعد رحلات بحث طويلة.',
    descriptionEn: 'Inspiring personal accounts of priests, scientists, and truth-seekers who embraced Islam.',
    featured: true,
    language: 'en',
  },
  {
    id: 'nouman-quran-literary-gems',
    titleAr: 'سلسلة روائع البيان وإعجاز البلاغة في القرآن - نعمان علي خان',
    titleEn: 'Literary & Linguistic Miracles of the Quran - Nouman Ali Khan',
    scholarId: 'nouman_ali_khan',
    scholarNameAr: 'الأستاذ نعمان علي خان',
    category: 'quran_science',
    totalEpisodes: 15,
    descriptionAr:
      'وقفات بيانية مذهلة مع أسرار النظم القرآني ودقة اختيار الكلمات في كتاب الله المبين بأسلوب عصري محبب للشباب.',
    descriptionEn: 'Linguistic nuances, structural coherence, and literary wonders of the Quranic text.',
    featured: false,
    language: 'en',
  },
  {
    id: 'sirah-nabawiyyah-masters',
    titleAr: 'سلسلة السيرة النبوية العطرة ومنهج الدعوة في العهدين المكي والمدني',
    titleEn: 'The Prophetic Seerah & Dawah Methodology Series',
    scholarId: 'deedat',
    scholarNameAr: 'نخبة من دعاة المجمع',
    category: 'intro_to_islam',
    totalEpisodes: 35,
    descriptionAr:
      'دراسة تحليلية مفصلة لسيرة الحبيب المصطفى ﷺ مع استنباط القواعد الدعوية والتربوية المعاصرة لمخاطبة العالم.',
    descriptionEn: 'Analytical exploration of the Seerah with actionable lessons for contemporary global dawah.',
    featured: false,
    language: 'ar',
  },
];

interface VideoPlaylistManagerProps {
  onSelectVideo?: (lecture: DawahLecture) => void;
}

export const VideoPlaylistManager: React.FC<VideoPlaylistManagerProps> = ({ onSelectVideo }) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'all_videos' | 'by_series' | 'by_topic' | 'my_queue' | 'studio_ingest'
  >('by_series');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScholar, setSelectedScholar] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const [watchQueue, setWatchQueue] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('alnoor_dawah_video_queue');
      return saved ? JSON.parse(saved) : ['deedat-is-bible-gods-word', 'zakir-quran-modern-science'];
    } catch {
      return ['deedat-is-bible-gods-word'];
    }
  });

  const [activeVideo, setActiveVideo] = useState<DawahLecture | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const [customSeriesTitle, setCustomSeriesTitle] = useState('');
  const [bulkVideoJson, setBulkVideoJson] = useState('');
  const [ingestSuccessMessage, setIngestSuccessMessage] = useState<string | null>(null);
  const [allLectures, setAllLectures] = useState<DawahLecture[]>(INITIAL_DAWAH_LECTURES);
  const [allSeries, setAllSeries] = useState<VideoSeries[]>(INITIAL_VIDEO_SERIES);

  const toggleQueue = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchQueue((prev) => {
      const exists = prev.includes(videoId);
      const next = exists ? prev.filter((id) => id !== videoId) : [...prev, videoId];
      try {
        localStorage.setItem('alnoor_dawah_video_queue', JSON.stringify(next));
      } catch {
        // storage unavailable
      }
      return next;
    });
  };

  const filteredLectures = useMemo(() => {
    return allLectures.filter((lecture) => {
      if (selectedCategory !== 'all' && lecture.category !== selectedCategory) return false;
      if (selectedScholar !== 'all' && lecture.scholarId !== selectedScholar) return false;
      if (selectedLanguage !== 'all' && lecture.language !== selectedLanguage) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle =
          lecture.titleAr.toLowerCase().includes(q) || lecture.titleEn.toLowerCase().includes(q);
        const matchesDesc =
          lecture.descriptionAr.toLowerCase().includes(q) ||
          lecture.descriptionEn.toLowerCase().includes(q);
        const matchesTopics = lecture.topics.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTopics) return false;
      }
      return true;
    });
  }, [allLectures, selectedCategory, selectedScholar, selectedLanguage, searchQuery]);

  const queueLectures = useMemo(() => {
    return allLectures.filter((lec) => watchQueue.includes(lec.id));
  }, [allLectures, watchQueue]);

  const handleBulkIngest = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!bulkVideoJson.trim()) {
        const sId = `series-${Date.now()}`;
        const newSeriesObj: VideoSeries = {
          id: sId,
          titleAr: customSeriesTitle || 'سلسلة دعوية جديدة موثقة',
          titleEn: 'Newly Catalogued Dawah Series',
          scholarId: selectedScholar !== 'all' ? selectedScholar : 'deedat',
          scholarNameAr: 'كوكبة دعاة مجمع النور',
          category: (selectedCategory !== 'all'
            ? selectedCategory
            : 'comparative_religion') as DawahCategory,
          totalEpisodes: 8,
          descriptionAr: 'سلسلة دعوية تم فهرستها وتجهيزها في خوادم مجمع النور الإسلامي العالمي.',
          descriptionEn: 'Newly catalogued Islamic dawah series ready for global streaming.',
          language: 'ar',
          featured: false,
        };
        setAllSeries((prev) => [newSeriesObj, ...prev]);
        setIngestSuccessMessage('تمت إضافة وفهرسة السلسلة بنجاح وجاهزة لعرض المحاضرات.');
        setTimeout(() => setIngestSuccessMessage(null), 4000);
        setCustomSeriesTitle('');
        return;
      }

      const parsedVideos = JSON.parse(bulkVideoJson);
      if (Array.isArray(parsedVideos)) {
        const newLectures: DawahLecture[] = parsedVideos.map((item, idx) => ({
          id: item.id || `ingest-${Date.now()}-${idx}`,
          scholarId: item.scholarId || 'deedat',
          scholarNameAr: item.scholarNameAr || 'كوكبة دعاة مجمع النور',
          scholarNameEn: item.scholarNameEn || 'Al-Noor Islamic Scholars',
          titleAr: item.titleAr || item.title || `فيديو دعوي ${idx + 1}`,
          titleEn: item.titleEn || `Dawah Lecture ${idx + 1}`,
          youtubeId: item.youtubeId || '9U3Kn6j_f8Y',
          youtubeUrl:
            item.youtubeUrl || `https://www.youtube.com/watch?v=${item.youtubeId || '9U3Kn6j_f8Y'}`,
          category: item.category || 'comparative_religion',
          durationMinutes: item.durationMinutes || 45,
          language: item.language || 'ar',
          hasSubtitles: false,
          subtitlesLanguages: [],
          descriptionAr: item.descriptionAr || 'محاضرة دعوية موثقة من مكتبة مجمع النور.',
          descriptionEn: item.descriptionEn || 'Documented Islamic lecture.',
          isDebate: Boolean(item.isDebate),
          topics: item.topics || ['دعوة', 'مناظرات', 'إسلام'],
          featured: false,
        }));

        setAllLectures((prev) => [...newLectures, ...prev]);
        setIngestSuccessMessage(`تم استيراد ${newLectures.length} فيديو بنجاح إلى الفهرس.`);
        setTimeout(() => setIngestSuccessMessage(null), 4000);
        setBulkVideoJson('');
      }
    } catch (err: any) {
      showToast(`خطأ في صيغة JSON: ${err.message}`, 'error');
    }
  };

  const handleOpenVideo = (lec: DawahLecture) => {
    setActiveVideo(lec);
    if (onSelectVideo) onSelectVideo(lec);
  };

  const handleCopyLink = () => {
    if (!activeVideo) return;
    navigator.clipboard.writeText(`https://www.mojamaalnor.com/dawah/video/${activeVideo.id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Stats Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0A223D] via-[#12345A] to-[#0E3F66] text-white border border-[#D4AF37]/40 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#F7E7B4]">
              <Video className="w-4 h-4 text-[#D4AF37]" />
              <span>استوديو ومكتبة الفيديوهات الدعوية العالمية (Dawah Video Studio)</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#87CEEB]">فهرس السلاسل والمناظرات</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-amiri leading-tight">
              فهرس السلاسل والمحاضرات والمناظرات الدعوية الكبرى
            </h2>

            <p className="text-xs sm:text-sm text-[#D8F1FD] leading-relaxed">
              منصة منظمة لتصنيف وفهرسة المحاضرات والمناظرات الدعوية العالمية حسب السلاسل العلمية، الدعاة
              الكبار، الموضوعات العقدية، ولغات العالم، مع مشغل مباشر وقائمة للمشاهدة لاحقاً.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap tabular-nums">
            <div className="px-4 py-3 rounded-2xl bg-white/10 border border-[#87CEEB]/25 text-center min-w-[95px]">
              <span className="text-xl font-black text-[#F7E7B4] block font-mono">{allSeries.length}</span>
              <span className="text-[11px] text-[#EAF8FF] font-bold">سلسلة كبرى</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/10 border border-[#87CEEB]/25 text-center min-w-[95px]">
              <span className="text-xl font-black text-[#2DD4BF] block font-mono">
                {allLectures.length}+
              </span>
              <span className="text-[11px] text-[#EAF8FF] font-bold">فيديو مفهرس</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/10 border border-[#87CEEB]/25 text-center min-w-[95px]">
              <span className="text-xl font-black text-[#87CEEB] block font-mono">{watchQueue.length}</span>
              <span className="text-[11px] text-[#EAF8FF] font-bold">في قائمتي</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-white/15">
          <button
            type="button"
            onClick={() => setActiveTab('by_series')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'by_series'
                ? 'bg-[#D4AF37] text-[#0A223D] font-black shadow-sm'
                : 'bg-white/10 text-[#EAF8FF] hover:bg-white/20'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>السلاسل الدعوية ({allSeries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all_videos')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'all_videos'
                ? 'bg-[#D4AF37] text-[#0A223D] font-black shadow-sm'
                : 'bg-white/10 text-[#EAF8FF] hover:bg-white/20'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>كل الفيديوهات ({filteredLectures.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('by_topic')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'by_topic'
                ? 'bg-[#D4AF37] text-[#0A223D] font-black shadow-sm'
                : 'bg-white/10 text-[#EAF8FF] hover:bg-white/20'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>حسب التصنيف والموضوع</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my_queue')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'my_queue'
                ? 'bg-[#D4AF37] text-[#0A223D] font-black shadow-sm'
                : 'bg-white/10 text-[#EAF8FF] hover:bg-white/20'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>قائمتي للمشاهدة ({watchQueue.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('studio_ingest')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer mr-auto whitespace-nowrap ${
              activeTab === 'studio_ingest'
                ? 'bg-[#0EA5A4] text-white font-black shadow-sm'
                : 'bg-white/10 border border-[#D4AF37]/40 text-[#F7E7B4] hover:bg-white/20'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>استوديو الإدخال والفهرسة</span>
          </button>
        </div>
      </div>

      {/* Global Filter & Search Bar */}
      {activeTab !== 'studio_ingest' && (
        <div className="sky-glass-panel p-4 sm:p-5 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#0EA5A4] absolute top-1/2 -translate-y-1/2 right-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الفيديوهات والسلاسل والمناظرات..."
                className="w-full min-h-[42px] bg-white dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 rounded-xl pr-10 pl-12 py-2 text-xs sm:text-sm text-[#12345A] dark:text-[#EAF8FF] placeholder-[#4A7298] focus:outline-none focus:border-[#0EA5A4]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#2B547E] dark:text-[#B8DEF5] hover:text-[#12345A] cursor-pointer"
                >
                  مسح
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="min-h-[42px] bg-white dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 rounded-xl px-3 py-2 text-xs font-semibold text-[#12345A] dark:text-[#EAF8FF] focus:outline-none focus:border-[#0EA5A4] cursor-pointer"
              >
                <option value="all">جميع التصنيفات</option>
                {DAWAH_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameAr}
                  </option>
                ))}
              </select>

              <select
                value={selectedScholar}
                onChange={(e) => setSelectedScholar(e.target.value)}
                className="min-h-[42px] bg-white dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 rounded-xl px-3 py-2 text-xs font-semibold text-[#12345A] dark:text-[#EAF8FF] focus:outline-none focus:border-[#0EA5A4] cursor-pointer"
              >
                <option value="all">جميع الدعاة والمشايخ</option>
                {INITIAL_DAWAH_SCHOLARS.map((sch) => (
                  <option key={sch.id} value={sch.id}>
                    {sch.nameAr}
                  </option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="min-h-[42px] bg-white dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 rounded-xl px-3 py-2 text-xs font-semibold text-[#12345A] dark:text-[#EAF8FF] focus:outline-none focus:border-[#0EA5A4] cursor-pointer"
              >
                <option value="all">جميع اللغات</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
                <option value="ur">Urdu (أوردو)</option>
                <option value="fr">Français (فرنسية)</option>
              </select>

              {(selectedCategory !== 'all' ||
                selectedScholar !== 'all' ||
                selectedLanguage !== 'all' ||
                searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedScholar('all');
                    setSelectedLanguage('all');
                    setSearchQuery('');
                  }}
                  className="min-h-[42px] px-3 py-2 rounded-xl bg-[#FEF2F2] dark:bg-[#7F1D1D]/40 border border-[#DC2626]/30 text-[#B91C1C] dark:text-[#FCA5A5] text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  title="إعادة ضبط الفلاتر"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">إعادة ضبط</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: BY SERIES */}
      {activeTab === 'by_series' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSeries.map((series) => (
            <div
              key={series.id}
              className="sky-card-3d rounded-3xl p-6 flex flex-col justify-between gap-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#0D7A7A] dark:text-[#2DD4BF] tabular-nums">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{series.totalEpisodes} حلقة مفهرسة</span>
                  </span>
                  <span className="text-[#4A7298] dark:text-[#84B4D6]">
                    {series.language === 'ar' ? 'العربية' : 'English'}
                  </span>
                </div>

                <h3 className="text-lg font-black text-[#12345A] dark:text-[#EAF8FF] font-amiri group-hover:text-[#0EA5A4] transition-colors leading-snug">
                  {series.titleAr}
                </h3>

                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] line-clamp-3 leading-relaxed">
                  {series.descriptionAr}
                </p>
              </div>

              <div className="pt-4 border-t border-[#12345A]/10 dark:border-[#87CEEB]/15 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 flex items-center justify-center text-[#0EA5A4] shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] truncate">
                    {series.scholarNameAr}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedScholar(series.scholarId);
                    setActiveTab('all_videos');
                  }}
                  className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-[#12345A] hover:bg-[#0E3F66] text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>فتح السلسلة</span>
                  <ChevronLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ALL VIDEOS */}
      {activeTab === 'all_videos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] tabular-nums">
            <span>عرض {filteredLectures.length} فيديو دعوي متطابق</span>
            <span className="text-[#0D7A7A] dark:text-[#2DD4BF]">فهرس المحاضرات والمناظرات</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLectures.map((lecture) => {
              const inQueue = watchQueue.includes(lecture.id);
              return (
                <div
                  key={lecture.id}
                  onClick={() => handleOpenVideo(lecture)}
                  className="sky-card-3d group rounded-3xl overflow-hidden flex flex-col justify-between cursor-pointer"
                >
                  <div className="relative aspect-video bg-[#0A223D] overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${lecture.youtubeId}/hqdefault.jpg`}
                      alt={lecture.titleAr}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = createVideoPosterDataUri(
                          lecture.titleAr,
                          'AL-NOOR DAWAH ARCHIVE'
                        );
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A223D]/85 via-transparent to-black/25" />

                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#0A223D]/90 text-white font-mono tabular-nums text-[11px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      <span>{lecture.durationMinutes} دقيقة</span>
                    </span>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#0A223D] flex items-center justify-center shadow-xl">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleQueue(lecture.id, e)}
                      className={`absolute top-2.5 left-2.5 p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
                        inQueue
                          ? 'bg-[#D4AF37] text-[#0A223D] shadow-md'
                          : 'bg-[#0A223D]/75 text-white hover:bg-[#0A223D]'
                      }`}
                      title={inQueue ? 'إزالة من قائمتي' : 'حفظ للمشاهدة لاحقاً'}
                      aria-label={inQueue ? 'إزالة من قائمتي' : 'حفظ للمشاهدة لاحقاً'}
                    >
                      {inQueue ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-[#4A7298] dark:text-[#84B4D6]">
                        {lecture.isDebate && (
                          <>
                            <span className="text-[#0D7A7A] dark:text-[#2DD4BF]">مناظرة كبرى</span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        <span>{lecture.language === 'ar' ? 'عربي' : 'English'}</span>
                      </div>

                      <h4 className="text-sm font-black text-[#12345A] dark:text-[#EAF8FF] group-hover:text-[#0EA5A4] transition-colors line-clamp-2 leading-relaxed">
                        {lecture.titleAr}
                      </h4>

                      <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] line-clamp-2">
                        {lecture.descriptionAr}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#12345A]/10 dark:border-[#87CEEB]/15 flex items-center justify-between text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                      <span className="font-bold text-[#12345A] dark:text-[#EAF8FF]">
                        {INITIAL_DAWAH_SCHOLARS.find((s) => s.id === lecture.scholarId)?.nameAr || 'الداعية'}
                      </span>
                      <span className="text-[#0D7A7A] dark:text-[#2DD4BF] font-bold flex items-center gap-0.5">
                        <span>مشاهدة</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BY TOPIC */}
      {activeTab === 'by_topic' && (
        <div className="space-y-8">
          {DAWAH_CATEGORIES.map((cat) => {
            const lecturesInCat = allLectures.filter((l) => l.category === cat.id);
            return (
              <div key={cat.id} className="sky-card-3d space-y-5 p-6 rounded-3xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#12345A]/12 dark:border-[#87CEEB]/20 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-[#12345A] dark:text-[#EAF8FF] font-amiri flex flex-wrap items-center gap-2">
                      <Tag className="w-4 h-4 text-[#0EA5A4]" />
                      <span>{cat.nameAr}</span>
                      <span className="text-xs font-mono tabular-nums text-[#0D7A7A] dark:text-[#2DD4BF]">
                        · {lecturesInCat.length} فيديو
                      </span>
                    </h3>
                    <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">{cat.descAr}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActiveTab('all_videos');
                    }}
                    className="text-xs text-[#0D7A7A] dark:text-[#2DD4BF] hover:underline font-bold self-start sm:self-auto cursor-pointer"
                  >
                    عرض الكل في هذا القسم
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {lecturesInCat.slice(0, 4).map((lec) => (
                    <div
                      key={lec.id}
                      onClick={() => handleOpenVideo(lec)}
                      className="group rounded-2xl bg-[#EAF8FF]/80 dark:bg-[#0A223D]/70 border border-[#12345A]/12 dark:border-[#87CEEB]/20 hover:border-[#0EA5A4] p-3 transition-colors cursor-pointer space-y-2.5"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0A223D]">
                        <img
                          src={`https://img.youtube.com/vi/${lec.youtubeId}/mqdefault.jpg`}
                          alt={lec.titleAr}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = createVideoPosterDataUri(
                              lec.titleAr,
                              'AL-NOOR DAWAH ARCHIVE'
                            );
                          }}
                        />
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-[#0A223D]/85 text-[10px] text-white font-mono tabular-nums">
                          {lec.durationMinutes} دقيقة
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] group-hover:text-[#0EA5A4] line-clamp-2 leading-relaxed">
                        {lec.titleAr}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: MY QUEUE */}
      {activeTab === 'my_queue' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#12345A] dark:text-[#EAF8FF] flex items-center gap-2 tabular-nums">
              <BookmarkCheck className="w-5 h-5 text-[#0EA5A4]" />
              <span>قائمتك الخاصة للفيديوهات المحفوظة ({queueLectures.length})</span>
            </h3>

            {queueLectures.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setWatchQueue([]);
                  localStorage.removeItem('alnoor_dawah_video_queue');
                }}
                className="text-xs text-[#DC2626] dark:text-[#FCA5A5] hover:underline font-bold cursor-pointer"
              >
                تفريغ القائمة
              </button>
            )}
          </div>

          {queueLectures.length === 0 ? (
            <div className="sky-card-3d p-12 text-center rounded-3xl space-y-3">
              <Bookmark className="w-12 h-12 text-[#0EA5A4] mx-auto" />
              <p className="text-sm font-bold text-[#12345A] dark:text-[#EAF8FF]">قائمتك فارغة حالياً</p>
              <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                انقر على أيقونة الإشارة المرجعية على أي فيديو لحفظه للمشاهدة لاحقاً.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('all_videos')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#12345A] text-white text-xs font-bold cursor-pointer"
              >
                استعراض كل الفيديوهات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {queueLectures.map((lecture) => (
                <div
                  key={lecture.id}
                  onClick={() => handleOpenVideo(lecture)}
                  className="sky-card-3d rounded-3xl overflow-hidden p-4 space-y-3 cursor-pointer group"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0A223D]">
                    <img
                      src={`https://img.youtube.com/vi/${lecture.youtubeId}/hqdefault.jpg`}
                      alt={lecture.titleAr}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = createVideoPosterDataUri(
                          lecture.titleAr,
                          'AL-NOOR DAWAH ARCHIVE'
                        );
                      }}
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#0A223D]/85 text-[10px] text-white font-mono tabular-nums">
                      {lecture.durationMinutes} دقيقة
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-[#12345A] dark:text-[#EAF8FF] group-hover:text-[#0EA5A4] line-clamp-2">
                    {lecture.titleAr}
                  </h4>

                  <div className="flex items-center justify-between pt-2 border-t border-[#12345A]/10 dark:border-[#87CEEB]/15">
                    <button
                      type="button"
                      onClick={(e) => toggleQueue(lecture.id, e)}
                      className="text-xs text-[#DC2626] dark:text-[#FCA5A5] hover:underline font-bold cursor-pointer"
                    >
                      إزالة من القائمة
                    </button>
                    <span className="px-3 py-1 rounded-lg bg-[#12345A] text-white text-xs font-bold">
                      تشغيل الآن
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: STUDIO INGEST */}
      {activeTab === 'studio_ingest' && (
        <div className="sky-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-[#12345A]/12 dark:border-[#87CEEB]/20 pb-4">
            <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#2DD4BF] flex items-center gap-1.5">
              <FolderPlus className="w-4 h-4" />
              <span>استوديو إدخال وفهرسة الفيديوهات والسلاسل (Batch Ingest Studio)</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-[#EAF8FF] font-amiri">
              إضافة سلاسل وفهرسة المحاضرات والمناظرات الدعوية
            </h3>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
              أداة مخصصة لفريق المحتوى والدعاة لإدخال قوائم التشغيل والسلاسل بصيغة JSON أو إنشاء سلسلة جديدة
              مباشرة.
            </p>
          </div>

          {ingestSuccessMessage && (
            <div className="p-4 rounded-2xl bg-[#ECFDF5] dark:bg-[#064E3B]/50 border border-[#0EA5A4]/40 text-[#065F46] dark:text-[#A7F3D0] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{ingestSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleBulkIngest} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] block">
                  عنوان السلسلة أو قائمة التشغيل
                </label>
                <input
                  type="text"
                  value={customSeriesTitle}
                  onChange={(e) => setCustomSeriesTitle(e.target.value)}
                  placeholder="مثال: سلسلة الرد على الشبهات المعاصرة - الجزء الأول"
                  className="w-full min-h-[42px] bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#12345A] dark:text-[#EAF8FF] focus:outline-none focus:border-[#0EA5A4]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] block">
                  تصنيف السلسلة
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full min-h-[42px] bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#12345A] dark:text-[#EAF8FF] focus:outline-none focus:border-[#0EA5A4]"
                >
                  {DAWAH_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#12345A] dark:text-[#EAF8FF]">
                  حزمة الفيديوهات بصيغة JSON (أو اتركها فارغة لإنشاء هيكل السلسلة مباشرة):
                </label>
                <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6]">
                  يدعم استيراد دفعة واحدة
                </span>
              </div>
              <textarea
                value={bulkVideoJson}
                onChange={(e) => setBulkVideoJson(e.target.value)}
                rows={6}
                dir="ltr"
                placeholder={`[\n  {\n    "id": "video-101",\n    "titleAr": "محاضرة: حقيقة الإيمان",\n    "titleEn": "The Reality of Faith",\n    "youtubeId": "9U3Kn6j_f8Y",\n    "category": "aqeedah",\n    "durationMinutes": 52,\n    "language": "ar"\n  }\n]`}
                className="w-full bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 rounded-xl p-4 text-xs font-mono text-[#12345A] dark:text-[#F7E7B4] focus:outline-none focus:border-[#0EA5A4] leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0E3F66] text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-[#D4AF37]" />
                <span>حفظ وفهرسة السلسلة في الفهرس</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomSeriesTitle('');
                  setBulkVideoJson('');
                }}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-[#EAF8FF] text-xs font-bold transition-colors cursor-pointer"
              >
                مسح الحقول
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Video Playback Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A223D]/80 backdrop-blur-md">
          <div className="bg-white dark:bg-[#0F2747] border border-[#12345A]/25 dark:border-[#87CEEB]/30 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#12345A]/12 dark:border-[#87CEEB]/20 bg-[#EAF8FF] dark:bg-[#0A223D] gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-full bg-[#12345A] text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-[#12345A] dark:text-[#EAF8FF] truncate">
                    {activeVideo.titleAr}
                  </h3>
                  <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] tabular-nums">
                    {INITIAL_DAWAH_SCHOLARS.find((s) => s.id === activeVideo.scholarId)?.nameAr || 'الداعية'} ·{' '}
                    {activeVideo.durationMinutes} دقيقة
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white dark:bg-[#12345A] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-xs text-[#12345A] dark:text-[#EAF8FF] font-bold flex items-center gap-1 cursor-pointer"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-[#0EA5A4]" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5 text-[#0EA5A4]" />
                  )}
                  <span>{isCopied ? 'تم النسخ' : 'مشاركة'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleQueue(activeVideo.id)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    watchQueue.includes(activeVideo.id)
                      ? 'bg-[#D4AF37] text-[#0A223D]'
                      : 'bg-white dark:bg-[#12345A] border border-[#12345A]/15 text-[#12345A] dark:text-[#EAF8FF]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{watchQueue.includes(activeVideo.id) ? 'في قائمتك' : 'حفظ'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="min-h-[38px] min-w-[38px] rounded-xl bg-white dark:bg-[#12345A] hover:bg-[#FEE2E2] text-[#12345A] dark:text-[#EAF8FF] hover:text-[#DC2626] flex items-center justify-center font-bold text-lg cursor-pointer"
                  aria-label="إغلاق الفيديو"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="relative aspect-video bg-black w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.titleAr}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-5 overflow-y-auto space-y-4 bg-white dark:bg-[#0F2747]">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#0D7A7A] dark:text-[#2DD4BF]">
                  نبذة عن المحاضرة وتفاصيلها:
                </h4>
                <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                  {activeVideo.descriptionAr}
                </p>
              </div>

              {activeVideo.topics && activeVideo.topics.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-[#4A7298] dark:text-[#84B4D6]">
                  <span className="font-bold text-[#12345A] dark:text-[#EAF8FF]">المواضيع:</span>
                  {activeVideo.topics.map((t, idx) => (
                    <span key={idx}>#{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
