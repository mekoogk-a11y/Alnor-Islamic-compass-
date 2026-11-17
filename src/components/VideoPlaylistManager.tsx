import React, { useState, useMemo } from 'react';
import { 
  Play, Pause, Search, Filter, FolderPlus, Layers, Video, 
  Clock, User, Globe, Sparkles, ChevronRight, ChevronLeft, 
  Check, Bookmark, BookmarkCheck, Share2, Download, ListFilter,
  Eye, ThumbsUp, Tag, PlusCircle, FileText, ExternalLink,
  SlidersHorizontal, CheckCircle2, RotateCcw
} from 'lucide-react';
import { DawahLecture, DawahCategory, DawahScholar } from '../types';
import { DAWAH_CATEGORIES, INITIAL_DAWAH_SCHOLARS, INITIAL_DAWAH_LECTURES } from '../data/dawahData';
import { useLanguage } from '../context/LanguageContext';
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
    descriptionAr: 'الموسوعة الكاملة لمناظرات فارس الدعوة الشيخ أحمد ديدات رحمه الله في جنوب أفريقيا وأمريكا وبريطانيا، مترجمة ومفهرسة بالأدلة من القرآن والإنجيل.',
    descriptionEn: 'The definitive archive of Sheikh Ahmed Deedat’s debates with Christian theologians, fully cross-referenced.',
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
    descriptionAr: 'أقوى سلسلة علمية تثبت بالحقائق الكونية والطبية والفلكية إعجاز القرآن الكريم، مع إجابات فورية على أسئلة المشككين والملحدين.',
    descriptionEn: 'Comprehensive scientific lecture series detailing scientific miracles in the Quran and answers to skeptics.',
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
    descriptionAr: 'دروس إيمانية رقيقة تلامس مشاعر الشباب والمهتدين، تعالج القلق والضيق وتعزز حسن الظن بالله والرحمة في الإسلام.',
    descriptionEn: 'Heartfelt, uplifting series focusing on emotional well-being, mercy in Islam, and reconnecting with Allah.',
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
    descriptionAr: 'قصص ملهمة لعلماء وقساوسة ومفكرين من مختلف قارات العالم وجدوا الطمأنينة في رحاب الإسلام بعد رحلات بحث طويلة.',
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
    descriptionAr: 'وقفات بيانية مذهلة مع أسرار النظم القرآني ودقة اختيار الكلمات في كتاب الله المبين بأسلوب عصري محبب للشباب.',
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
    descriptionAr: 'دراسة تحليلية مفصلة لسيرة الحبيب المصطفى ﷺ مع استنباط القواعد الدعوية والتربوية المعاصرة لمخاطبة العالم.',
    descriptionEn: 'Analytical exploration of the Seerah with actionable lessons for contemporary global dawah.',
    featured: false,
    language: 'ar',
  },
];

interface VideoPlaylistManagerProps {
  onSelectVideo?: (lecture: DawahLecture) => void;
}

export const VideoPlaylistManager: React.FC<VideoPlaylistManagerProps> = ({ onSelectVideo }) => {
  const { lang, isRtl } = useLanguage();
  const { showToast } = useToast();

  // Navigation tabs: 'all_videos' | 'by_series' | 'by_topic' | 'my_queue' | 'studio_ingest'
  const [activeTab, setActiveTab] = useState<'all_videos' | 'by_series' | 'by_topic' | 'my_queue' | 'studio_ingest'>('by_series');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScholar, setSelectedScholar] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);

  // Watch Later Queue
  const [watchQueue, setWatchQueue] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('alnoor_dawah_video_queue');
      return saved ? JSON.parse(saved) : ['deedat-is-bible-gods-word', 'zakir-quran-modern-science'];
    } catch {
      return ['deedat-is-bible-gods-word'];
    }
  });

  // Selected Active Video Modal
  const [activeVideo, setActiveVideo] = useState<DawahLecture | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Studio Ingest State (Simulating bulk indexing of thousands of videos)
  const [customSeriesTitle, setCustomSeriesTitle] = useState('');
  const [bulkVideoJson, setBulkVideoJson] = useState('');
  const [ingestSuccessMessage, setIngestSuccessMessage] = useState<string | null>(null);
  const [allLectures, setAllLectures] = useState<DawahLecture[]>(INITIAL_DAWAH_LECTURES);
  const [allSeries, setAllSeries] = useState<VideoSeries[]>(INITIAL_VIDEO_SERIES);

  // Toggle Watch Later
  const toggleQueue = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchQueue((prev) => {
      const exists = prev.includes(videoId);
      const next = exists ? prev.filter((id) => id !== videoId) : [...prev, videoId];
      try {
        localStorage.setItem('alnoor_dawah_video_queue', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  // Filtered Lectures
  const filteredLectures = useMemo(() => {
    return allLectures.filter((lecture) => {
      if (selectedCategory !== 'all' && lecture.category !== selectedCategory) return false;
      if (selectedScholar !== 'all' && lecture.scholarId !== selectedScholar) return false;
      if (selectedLanguage !== 'all' && lecture.language !== selectedLanguage) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = lecture.titleAr.toLowerCase().includes(q) || lecture.titleEn.toLowerCase().includes(q);
        const matchesDesc = lecture.descriptionAr.toLowerCase().includes(q) || lecture.descriptionEn.toLowerCase().includes(q);
        const matchesTopics = lecture.topics.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTopics) return false;
      }
      return true;
    });
  }, [allLectures, selectedCategory, selectedScholar, selectedLanguage, searchQuery]);

  // Queue Lectures
  const queueLectures = useMemo(() => {
    return allLectures.filter((lec) => watchQueue.includes(lec.id));
  }, [allLectures, watchQueue]);

  // Handle Bulk Ingest
  const handleBulkIngest = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedVideos: any[] = [];
      if (bulkVideoJson.trim()) {
        parsedVideos = JSON.parse(bulkVideoJson);
      } else {
        // Create 5 sample mock episodes for the series
        const sId = `series-${Date.now()}`;
        const newSeriesObj: VideoSeries = {
          id: sId,
          titleAr: customSeriesTitle || 'سلسلة دعوية جديدة موثقة',
          titleEn: 'Newly Catalogued Dawah Series',
          scholarId: selectedScholar !== 'all' ? selectedScholar : 'deedat',
          scholarNameAr: 'كوكبة دعاة مجمع النور',
          category: (selectedCategory !== 'all' ? selectedCategory : 'comparative_religion') as DawahCategory,
          totalEpisodes: 8,
          descriptionAr: 'سلسلة دعوية تم فهرستها وتجهيزها في خوادم مجمع النور الإسلامي العالمي.',
          descriptionEn: 'Newly catalogued Islamic dawah series ready for global streaming.',
          language: 'ar',
          featured: false,
        };
        setAllSeries((prev) => [newSeriesObj, ...prev]);

        setIngestSuccessMessage(`تمت إضافة وفهرسة السلسلة بنجاح! جاهزة لاستقبال آلاف الفيديوهات.`);
        setTimeout(() => setIngestSuccessMessage(null), 4000);
        setCustomSeriesTitle('');
        setBulkVideoJson('');
        return;
      }

      if (Array.isArray(parsedVideos)) {
        const newLectures: DawahLecture[] = parsedVideos.map((item, idx) => ({
          id: item.id || `ingest-${Date.now()}-${idx}`,
          scholarId: item.scholarId || 'deedat',
          scholarNameAr: item.scholarNameAr || 'كوكبة دعاة مجمع النور',
          scholarNameEn: item.scholarNameEn || 'Al-Noor Islamic Scholars',
          titleAr: item.titleAr || item.title || `فيديو دعوي ${idx + 1}`,
          titleEn: item.titleEn || `Dawah Lecture ${idx + 1}`,
          youtubeId: item.youtubeId || '9U3Kn6j_f8Y',
          youtubeUrl: item.youtubeUrl || `https://www.youtube.com/watch?v=${item.youtubeId || '9U3Kn6j_f8Y'}`,
          category: item.category || 'comparative_religion',
          durationMinutes: item.durationMinutes || 45,
          language: (item.language as any) || 'ar',
          hasSubtitles: false,
          subtitlesLanguages: [],
          descriptionAr: item.descriptionAr || 'محاضرة دعوية موثقة من مكتبة مجمع النور.',
          descriptionEn: item.descriptionEn || 'Documented Islamic lecture.',
          isDebate: !!item.isDebate,
          topics: item.topics || ['دعوة', 'مناظرات', 'إسلام'],
          featured: false,
        }));

        setAllLectures((prev) => [...newLectures, ...prev]);
        setIngestSuccessMessage(`تم استيراد ${newLectures.length} فيديو بنجاح إلى قاعدة البيانات السحابية.`);
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
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0B132B] via-[#070D1E] to-[#111C3D] border border-[#D4AF37]/30 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#070D1E] text-xs font-black flex items-center gap-1.5 shadow-md">
                <Video className="w-3.5 h-3.5 text-[#070D1E]" />
                <span>استوديو ومكتبة الفيديوهات الدعوية العالمية (Dawah Video Studio)</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-[#111C3D] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold">
                جاهز لاستيعاب آلاف الفيديوهات والسلاسل
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] font-amiri leading-tight">
              فهرس السلاسل والمحاضرات والمناظرات الدعوية الكبرى
            </h2>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              منصة سحابية متقدمة لتصنيف وفهرسة آلاف المحاضرات والمناظرات الدعوية العالمية، مقسمة حسب السلاسل العلمية، الدعاة الكبار، الموضوعات العقدية، ولغات العالم، مع مشغل متطور وقائمة تشغيل مخصصة للمشاهدة لاحقاً.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="px-4 py-3 rounded-2xl bg-[#070D1E] border border-[#D4AF37]/20 text-center min-w-[90px]">
              <span className="text-xl font-black text-[#D4AF37] block font-mono">{allSeries.length}</span>
              <span className="text-[10px] text-[#94A3B8] font-bold">سلسلة كبرى</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#070D1E] border border-[#D4AF37]/20 text-center min-w-[90px]">
              <span className="text-xl font-black text-emerald-400 block font-mono">{allLectures.length}+</span>
              <span className="text-[10px] text-[#94A3B8] font-bold">فيديو مفهرس</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#070D1E] border border-[#D4AF37]/20 text-center min-w-[90px]">
              <span className="text-xl font-black text-sky-400 block font-mono">{watchQueue.length}</span>
              <span className="text-[10px] text-[#94A3B8] font-bold">في قائمتي</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-[#D4AF37]/20">
          <button
            onClick={() => { setActiveTab('by_series'); setSelectedSeriesId(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'by_series'
                ? 'bg-[#D4AF37] text-[#070D1E] shadow-md font-black'
                : 'bg-[#111C3D] text-[#94A3B8] hover:text-white hover:bg-[#1E2E5D]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>السلاسل الدعوية ({allSeries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all_videos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'all_videos'
                ? 'bg-[#D4AF37] text-[#070D1E] shadow-md font-black'
                : 'bg-[#111C3D] text-[#94A3B8] hover:text-white hover:bg-[#1E2E5D]'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>كل الفيديوهات ({filteredLectures.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('by_topic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'by_topic'
                ? 'bg-[#D4AF37] text-[#070D1E] shadow-md font-black'
                : 'bg-[#111C3D] text-[#94A3B8] hover:text-white hover:bg-[#1E2E5D]'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>حسب التصنيف والموضوع</span>
          </button>

          <button
            onClick={() => setActiveTab('my_queue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'my_queue'
                ? 'bg-[#D4AF37] text-[#070D1E] shadow-md font-black'
                : 'bg-[#111C3D] text-[#94A3B8] hover:text-white hover:bg-[#1E2E5D]'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>قائمتي للمشاهدة ({watchQueue.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('studio_ingest')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer mr-auto ${
              activeTab === 'studio_ingest'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-[#070D1E] border border-amber-500/40 text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>استوديو الإدخال والفهرسة الضخمة ⚡</span>
          </button>
        </div>
      </div>

      {/* Global Filter & Search Bar */}
      {activeTab !== 'studio_ingest' && (
        <div className="bg-[#0B132B] p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/20 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#D4AF37] absolute top-3.5 right-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في آلاف الفيديوهات والسلاسل والمناظرات..."
                className="w-full bg-[#070D1E] border border-[#D4AF37]/30 rounded-xl pr-10 pl-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#D4AF37] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-3 text-xs text-[#94A3B8] hover:text-white"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#070D1E] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-[#E2E8F0] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="all">جميع التصنيفات</option>
                {DAWAH_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameAr}
                  </option>
                ))}
              </select>

              {/* Scholar */}
              <select
                value={selectedScholar}
                onChange={(e) => setSelectedScholar(e.target.value)}
                className="bg-[#070D1E] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-[#E2E8F0] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="all">جميع الدعاة والمشايخ</option>
                {INITIAL_DAWAH_SCHOLARS.map((sch) => (
                  <option key={sch.id} value={sch.id}>
                    {sch.nameAr}
                  </option>
                ))}
              </select>

              {/* Language */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-[#070D1E] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 text-xs text-[#E2E8F0] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="all">جميع اللغات</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
                <option value="ur">Urdu (أوردو)</option>
                <option value="fr">Français (فرنسية)</option>
              </select>

              {/* Reset Filters */}
              {(selectedCategory !== 'all' || selectedScholar !== 'all' || selectedLanguage !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedScholar('all');
                    setSelectedLanguage('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
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

      {/* TAB 1: BY SERIES (السلاسل الدعوية) */}
      {activeTab === 'by_series' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allSeries.map((series) => (
              <div
                key={series.id}
                className="group rounded-3xl bg-[#0B132B] border border-[#D4AF37]/20 hover:border-[#D4AF37] p-6 shadow-xl transition-all duration-300 flex flex-col justify-between gap-5 relative overflow-hidden"
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/15 transition-all" />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-0.5 rounded-full bg-[#111C3D] border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-mono font-bold flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>{series.totalEpisodes} حلقة مفهرسة</span>
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#070D1E] text-[#94A3B8] font-bold">
                      {series.language === 'ar' ? '🇸🇩 العربية' : '🌐 English'}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#F8FAFC] font-amiri group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {series.titleAr}
                  </h3>

                  <p className="text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
                    {series.descriptionAr}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D4AF37]/10 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] text-xs font-bold">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#E2E8F0]">
                      {series.scholarNameAr}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedScholar(series.scholarId);
                      setActiveTab('all_videos');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#070D1E] text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <span>فتح السلسلة</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ALL VIDEOS (كل الفيديوهات) */}
      {activeTab === 'all_videos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span>عرض {filteredLectures.length} فيديو دعوي متطابق</span>
            <span className="text-[#D4AF37] font-bold">فهرس المحاضرات والمناظرات</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLectures.map((lecture) => {
              const inQueue = watchQueue.includes(lecture.id);
              return (
                <div
                  key={lecture.id}
                  onClick={() => handleOpenVideo(lecture)}
                  className="group rounded-2xl bg-[#0B132B] border border-[#D4AF37]/20 hover:border-[#D4AF37] overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video bg-[#070D1E] overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${lecture.youtubeId}/hqdefault.jpg`}
                      alt={lecture.titleAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = createVideoPosterDataUri(lecture.titleAr, 'AL-NOOR DAWAH ARCHIVE');
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070D1E] via-transparent to-black/40" />

                    {/* Duration badge */}
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold flex items-center gap-1 backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      <span>{lecture.durationMinutes} دقيقة</span>
                    </span>

                    {/* Play Button Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#070D1E] flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    {/* Queue Toggle Button */}
                    <button
                      onClick={(e) => toggleQueue(lecture.id, e)}
                      className={`absolute top-2.5 left-2.5 p-2 rounded-xl backdrop-blur-md transition-all ${
                        inQueue
                          ? 'bg-[#D4AF37] text-[#070D1E] shadow-md'
                          : 'bg-black/60 text-white hover:bg-black/90'
                      }`}
                      title={inQueue ? 'إزالة من قائمتي' : 'حفظ للمشاهدة لاحقاً'}
                    >
                      {inQueue ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {lecture.isDebate && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[10px] font-bold">
                            مناظرة كبرى ⚖️
                          </span>
                        )}
                        <span className="text-[10px] text-[#94A3B8]">
                          {lecture.language === 'ar' ? 'عربي' : 'English'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-relaxed">
                        {lecture.titleAr}
                      </h4>

                      <p className="text-[11px] text-[#94A3B8] line-clamp-2">
                        {lecture.descriptionAr}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#D4AF37]/10 flex items-center justify-between text-[11px] text-[#94A3B8]">
                      <span className="font-medium text-[#E2E8F0]">
                        {INITIAL_DAWAH_SCHOLARS.find((s) => s.id === lecture.scholarId)?.nameAr || 'الداعية'}
                      </span>
                      <span className="text-[#D4AF37] font-bold flex items-center gap-0.5">
                        <span>مشاهدة</span>
                        <ChevronLeft className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BY TOPIC (حسب الموضوع) */}
      {activeTab === 'by_topic' && (
        <div className="space-y-8">
          {DAWAH_CATEGORIES.map((cat) => {
            const lecturesInCat = allLectures.filter((l) => l.category === cat.id);
            return (
              <div key={cat.id} className="space-y-4 bg-[#0B132B] p-6 rounded-3xl border border-[#D4AF37]/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D4AF37]/10 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-[#F8FAFC] font-amiri flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#D4AF37]" />
                      <span>{cat.nameAr}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#111C3D] text-[#D4AF37] font-mono">
                        {lecturesInCat.length} فيديو
                      </span>
                    </h3>
                    <p className="text-xs text-[#94A3B8]">{cat.descAr}</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActiveTab('all_videos');
                    }}
                    className="text-xs text-[#D4AF37] hover:underline font-bold self-start sm:self-auto"
                  >
                    عرض الكل في هذا القسم ←
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {lecturesInCat.slice(0, 4).map((lec) => (
                    <div
                      key={lec.id}
                      onClick={() => handleOpenVideo(lec)}
                      className="group rounded-2xl bg-[#070D1E] border border-[#D4AF37]/20 hover:border-[#D4AF37] p-3 transition-all cursor-pointer space-y-2.5"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40">
                        <img
                          src={`https://img.youtube.com/vi/${lec.youtubeId}/mqdefault.jpg`}
                          alt={lec.titleAr}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                          {lec.durationMinutes} دقيقة
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#D4AF37] line-clamp-2 leading-relaxed">
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

      {/* TAB 4: MY QUEUE (قائمتي للمشاهدة لاحقاً) */}
      {activeTab === 'my_queue' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#F8FAFC] flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-[#D4AF37]" />
              <span>قائمتك الخاصة للفيديوهات المحفوظة ({queueLectures.length})</span>
            </h3>

            {queueLectures.length > 0 && (
              <button
                onClick={() => {
                  setWatchQueue([]);
                  localStorage.removeItem('alnoor_dawah_video_queue');
                }}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold"
              >
                تفريغ القائمة
              </button>
            )}
          </div>

          {queueLectures.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0B132B] border border-[#D4AF37]/20 space-y-3">
              <Bookmark className="w-12 h-12 text-[#94A3B8]/40 mx-auto" />
              <p className="text-sm font-bold text-[#94A3B8]">قائمتك فارغة حالياً</p>
              <p className="text-xs text-[#64748B]">انقر على أيقونة الإشارة المرجعية على أي فيديو لحفظه للمشاهدة لاحقاً.</p>
              <button
                onClick={() => setActiveTab('all_videos')}
                className="mt-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-[#070D1E] text-xs font-black"
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
                  className="rounded-2xl bg-[#0B132B] border border-[#D4AF37]/30 overflow-hidden p-4 space-y-3 cursor-pointer group hover:border-[#D4AF37] transition-all"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    <img
                      src={`https://img.youtube.com/vi/${lecture.youtubeId}/hqdefault.jpg`}
                      alt={lecture.titleAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                      {lecture.durationMinutes} دقيقة
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#D4AF37] line-clamp-2">
                    {lecture.titleAr}
                  </h4>

                  <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/10">
                    <button
                      onClick={(e) => toggleQueue(lecture.id, e)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold"
                    >
                      إزالة من القائمة
                    </button>
                    <button className="px-3 py-1 rounded-lg bg-[#D4AF37] text-[#070D1E] text-xs font-bold">
                      تشغيل الآن
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: STUDIO INGEST (استوديو الإدخال والفهرسة لآلاف الفيديوهات) */}
      {activeTab === 'studio_ingest' && (
        <div className="bg-[#0B132B] rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-2 border-b border-[#D4AF37]/20 pb-4">
            <span className="text-xs font-mono text-[#D4AF37] font-black uppercase tracking-wider flex items-center gap-1.5">
              <FolderPlus className="w-4 h-4 text-[#D4AF37]" />
              <span>استوديو إدخال وفهرسة الفيديوهات والسلاسل الكبرى (Batch Ingest Studio)</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#F8FAFC] font-amiri">
              إضافة سلاسل وفهرسة آلاف المحاضرات والمناظرات الدعوية
            </h3>
            <p className="text-xs text-[#94A3B8]">
              هذه الأداة مخصصة لفريق المحتوى والدعاة لإدخال قوائم التشغيل والسلاسل بالجملة (Batch JSON) أو إنشاء سلسلة جديدة وربطها بنظام الفهرسة السحابي.
            </p>
          </div>

          {ingestSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{ingestSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleBulkIngest} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E2E8F0] block">
                  عنوان السلسلة أو قائمة التشغيل
                </label>
                <input
                  type="text"
                  value={customSeriesTitle}
                  onChange={(e) => setCustomSeriesTitle(e.target.value)}
                  placeholder="مثال: سلسلة الرد على الشبهات المعاصرة - الجزء الأول"
                  className="w-full bg-[#070D1E] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E2E8F0] block">
                  تصنيف السلسلة
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#070D1E] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#D4AF37]"
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
                <label className="font-bold text-[#E2E8F0]">
                  حزمة الفيديوهات بصيغة JSON (أو اتركها فارغة لإنشاء هيكل السلسلة مباشرة):
                </label>
                <span className="text-[10px] text-[#94A3B8] font-mono">يدعم استيراد مئات العناصر دفعة واحدة</span>
              </div>
              <textarea
                value={bulkVideoJson}
                onChange={(e) => setBulkVideoJson(e.target.value)}
                rows={6}
                placeholder={`[\n  {\n    "id": "video-101",\n    "titleAr": "محاضرة: حقيقة الإيمان",\n    "titleEn": "The Reality of Faith",\n    "youtubeId": "9U3Kn6j_f8Y",\n    "category": "aqeedah",\n    "durationMinutes": 52,\n    "language": "ar"\n  }\n]`}
                className="w-full bg-[#070D1E] border border-[#D4AF37]/30 rounded-xl p-4 text-xs font-mono text-[#D4AF37] focus:outline-none focus:border-[#D4AF37] leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#070D1E] text-xs font-black transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-[#070D1E]" />
                <span>حفظ وفهرسة السلسلة في النظام السحابي</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomSeriesTitle('');
                  setBulkVideoJson('');
                }}
                className="px-4 py-3 rounded-xl bg-[#111C3D] hover:bg-[#1E2E5D] text-[#94A3B8] text-xs font-bold transition-all"
              >
                مسح الحقول
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Video Playback Modal with Theater Mode & Episode Navigator */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B132B] border border-[#D4AF37]/40 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#D4AF37]/20 bg-[#070D1E]">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#070D1E] flex items-center justify-center font-bold">
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#F8FAFC] line-clamp-1">
                    {activeVideo.titleAr}
                  </h3>
                  <span className="text-[11px] text-[#94A3B8]">
                    {INITIAL_DAWAH_SCHOLARS.find((s) => s.id === activeVideo.scholarId)?.nameAr || 'الداعية'} • {activeVideo.durationMinutes} دقيقة
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-[#111C3D] border border-[#D4AF37]/30 text-xs text-[#E2E8F0] font-bold flex items-center gap-1 hover:border-[#D4AF37]"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  <span>{isCopied ? 'تم النسخ' : 'مشاركة'}</span>
                </button>
                <button
                  onClick={() => toggleQueue(activeVideo.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                    watchQueue.includes(activeVideo.id)
                      ? 'bg-[#D4AF37] text-[#070D1E]'
                      : 'bg-[#111C3D] text-[#E2E8F0]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{watchQueue.includes(activeVideo.id) ? 'في قائمتك' : 'حفظ'}</span>
                </button>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 rounded-full bg-[#111C3D] hover:bg-rose-950/60 text-[#94A3B8] hover:text-rose-300 flex items-center justify-center font-bold text-lg"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Video Player Container */}
            <div className="relative aspect-video bg-black w-full">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.titleAr}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer & Description */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#0B132B]">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  نبذة عن المحاضرة وتفاصيلها:
                </h4>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  {activeVideo.descriptionAr}
                </p>
              </div>

              {activeVideo.topics && activeVideo.topics.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-[#94A3B8] font-bold">المواضيع والوسوم:</span>
                  {activeVideo.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#070D1E] border border-[#D4AF37]/30 text-[11px] text-[#E2E8F0]"
                    >
                      #{t}
                    </span>
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
