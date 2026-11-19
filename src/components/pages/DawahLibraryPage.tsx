import React, { useState, useMemo } from 'react';
import {
  Video, Play, Search, Filter, Globe, Sparkles, Share2,
  Check, Clock, User, ExternalLink, ChevronRight, X,
  ShieldCheck, Trash2
} from 'lucide-react';
import {
  DAWAH_CATEGORIES,
  INITIAL_DAWAH_SCHOLARS,
  INITIAL_DAWAH_LECTURES
} from '../../data/dawahData';
import {
  DawahCategory,
  DawahScholar,
  DawahLecture,
  NavigationPage
} from '../../types';
import { VideoPlaylistManager } from '../VideoPlaylistManager';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createScholarEmblemDataUri } from '../../utils/islamicArtwork';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface DawahLibraryPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const DawahLibraryPage: React.FC<DawahLibraryPageProps> = () => {
  const { lang, isRtl } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const STORAGE_KEY_SCHOLARS = 'alnoor_dawah_scholars_v1';
  const STORAGE_KEY_LECTURES = 'alnoor_dawah_lectures_v1';

  const [scholars, setScholars] = useState<DawahScholar[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCHOLARS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_DAWAH_SCHOLARS;
  });

  const [lectures, setLectures] = useState<DawahLecture[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LECTURES);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_DAWAH_LECTURES;
  });

  const [selectedScholarId, setSelectedScholarId] = useState<string | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<DawahCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debatesOnly, setDebatesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'playlists_studio' | 'classic_scholars'>('playlists_studio');

  const [activeLecture, setActiveLecture] = useState<DawahLecture | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'lectures' | 'scholars'>('lectures');

  const [newLecture, setNewLecture] = useState({
    titleAr: '',
    titleEn: '',
    scholarId: 'ahmed-deedat',
    youtubeId: '',
    category: 'comparative_religion' as DawahCategory,
    durationMinutes: 45,
    language: 'both' as 'ar' | 'en' | 'both',
    descriptionAr: '',
    descriptionEn: '',
    isDebate: false,
    opponentName: '',
    featured: false,
    topicsText: 'مقارنة الأديان, القرآن, الدعوة',
  });

  const [newScholar, setNewScholar] = useState({
    id: '',
    nameAr: '',
    nameEn: '',
    titleAr: '',
    titleEn: '',
    bioAr: '',
    bioEn: '',
    imageUrl: '',
    country: '',
    isEnglishSpeaker: true,
    specialtiesText: 'مقارنة الأديان, الرد على الشبهات',
    accentColor: '#D4AF37',
  });

  const isUserAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'mekoogk@gmail.com';

  const currentScholar = useMemo(() => {
    if (selectedScholarId === 'all') return null;
    return scholars.find(s => s.id === selectedScholarId) || null;
  }, [scholars, selectedScholarId]);

  const filteredLectures = useMemo(() => {
    return lectures.filter((lec) => {
      if (selectedScholarId !== 'all' && lec.scholarId !== selectedScholarId) {
        return false;
      }
      if (selectedCategory !== 'all' && lec.category !== selectedCategory) {
        return false;
      }
      if (debatesOnly && !lec.isDebate) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = lec.titleAr.toLowerCase().includes(q) || lec.titleEn.toLowerCase().includes(q);
        const matchesScholar = lec.scholarNameAr.toLowerCase().includes(q) || lec.scholarNameEn.toLowerCase().includes(q);
        const matchesDesc = lec.descriptionAr.toLowerCase().includes(q) || lec.descriptionEn.toLowerCase().includes(q);
        const matchesTopics = (lec.topics || []).some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesScholar && !matchesDesc && !matchesTopics) {
          return false;
        }
      }
      return true;
    });
  }, [lectures, selectedScholarId, selectedCategory, debatesOnly, searchQuery]);

  const handleShare = (lecture: DawahLecture) => {
    const shareUrl = `${window.location.origin}/#dawah-${lecture.id}`;
    const textToShare = `${lecture.titleAr}\n${lecture.scholarNameAr}\nالمكتبة الدعوية العالمية - مجمع النور الإسلامي\n${shareUrl}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLecture.titleAr.trim() || !newLecture.youtubeId.trim()) return;

    const matchedScholar = scholars.find(s => s.id === newLecture.scholarId);
    const cleanYtId = newLecture.youtubeId
      .replace(/https?:\/\/(www\.)?youtube\.com\/watch\?v=/, '')
      .replace(/https?:\/\/youtu\.be\//, '')
      .trim();

    const created: DawahLecture = {
      id: `lec-${Date.now()}`,
      scholarId: newLecture.scholarId,
      scholarNameAr: matchedScholar?.nameAr || 'داعية إسلامي',
      scholarNameEn: matchedScholar?.nameEn || 'Islamic Scholar',
      titleAr: newLecture.titleAr,
      titleEn: newLecture.titleEn || newLecture.titleAr,
      youtubeId: cleanYtId,
      youtubeUrl: `https://www.youtube.com/watch?v=${cleanYtId}`,
      category: newLecture.category,
      durationMinutes: Number(newLecture.durationMinutes) || 45,
      language: newLecture.language,
      hasSubtitles: true,
      subtitlesLanguages: ['العربية', 'English'],
      descriptionAr: newLecture.descriptionAr,
      descriptionEn: newLecture.descriptionEn || newLecture.descriptionAr,
      isDebate: newLecture.isDebate,
      opponentName: newLecture.opponentName,
      featured: newLecture.featured,
      topics: newLecture.topicsText.split(',').map(s => s.trim()).filter(Boolean),
    };

    const updated = [created, ...lectures];
    setLectures(updated);
    try {
      localStorage.setItem(STORAGE_KEY_LECTURES, JSON.stringify(updated));
    } catch (_) {}

    setNewLecture({
      titleAr: '',
      titleEn: '',
      scholarId: 'ahmed-deedat',
      youtubeId: '',
      category: 'comparative_religion',
      durationMinutes: 45,
      language: 'both',
      descriptionAr: '',
      descriptionEn: '',
      isDebate: false,
      opponentName: '',
      featured: false,
      topicsText: 'مقارنة الأديان, القرآن',
    });
    showToast('تمت إضافة المحاضرة الدعوية بنجاح إلى المكتبة!', 'success');
  };

  const handleAddScholar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScholar.nameAr.trim() || !newScholar.nameEn.trim()) return;

    const scholarId = newScholar.id.trim() || `scholar-${Date.now()}`;
    const createdScholar: DawahScholar = {
      id: scholarId,
      nameAr: newScholar.nameAr,
      nameEn: newScholar.nameEn,
      titleAr: newScholar.titleAr || 'داعية ومحاضر إسلامي',
      titleEn: newScholar.titleEn || 'Islamic Scholar and Lecturer',
      bioAr: newScholar.bioAr,
      bioEn: newScholar.bioEn,
      imageUrl: newScholar.imageUrl || createScholarEmblemDataUri(newScholar.nameAr.slice(0, 2), newScholar.accentColor || '#D4AF37', 'AL-NOOR DAWAH'),
      country: newScholar.country || 'عالمي',
      isEnglishSpeaker: newScholar.isEnglishSpeaker,
      specialties: newScholar.specialtiesText.split(',').map(s => s.trim()).filter(Boolean),
      totalLecturesCount: 0,
      accentColor: newScholar.accentColor || '#D4AF37',
      featured: true,
    };

    const updated = [...scholars, createdScholar];
    setScholars(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SCHOLARS, JSON.stringify(updated));
    } catch (_) {}

    setNewScholar({
      id: '',
      nameAr: '',
      nameEn: '',
      titleAr: '',
      titleEn: '',
      bioAr: '',
      bioEn: '',
      imageUrl: '',
      country: '',
      isEnglishSpeaker: true,
      specialtiesText: 'مقارنة الأديان, الرد على الشبهات',
      accentColor: '#D4AF37',
    });
    showToast('تمت إضافة الداعية الجديد بنجاح إلى الهيئة الدعوية للمكتبة!', 'success');
  };

  const handleDeleteLecture = (id: string) => {
    const updated = lectures.filter(l => l.id !== id);
    setLectures(updated);
    try {
      localStorage.setItem(STORAGE_KEY_LECTURES, JSON.stringify(updated));
    } catch (_) {}
    showToast('تمت إزالة المحاضرة من القائمة بنجاح.', 'info');
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Sky-Blue 3D Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] border border-[#87CEEB]/55 shadow-xl p-6 sm:p-10 text-white">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-6 text-center">
          <div className="flex justify-center">
            <Sky3DIcon slug="dawahLibrary" tone="ocean" size="lg" />
          </div>

          <p className="text-xs font-bold text-[#F7E7B4] flex items-center justify-center gap-2 flex-wrap">
            <Sparkles className="w-3.5 h-3.5 text-[#F7E7B4]" />
            <span>المكتبة الدعوية العالمية · Global Dawah Library</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#5EEAD4]">حوار العقول وهداية القلوب</span>
          </p>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-amiri text-white leading-tight">
            مكتبة الدعوة العالمية ومقارنة الأديان
          </h1>

          <p className="text-xs sm:text-base text-[#D7F1FC] max-w-3xl mx-auto leading-relaxed">
            منظومة وثائقية متكاملة تضم تراث كبار مناظري ودعاة الإسلام في العصر الحديث: من مناظرات الشيخ أحمد ديدات التاريخية، ومحاضرات د. ذاكر نايك، والشيخ يوسف إستس، والمفتي منك، والأستاذ نعمان علي خان، بلغات حية وتصنيفات علمية رصينة.
          </p>

          {/* Quick Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-2 tabular-nums">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-[#87CEEB]/35">
              <span className="text-xl sm:text-2xl font-mono font-black text-[#F7E7B4] block">
                {scholars.length}
              </span>
              <span className="text-[11px] text-[#EAF8FF] font-semibold">من كبار الدعاة العالميين</span>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-[#87CEEB]/35">
              <span className="text-xl sm:text-2xl font-mono font-black text-white block">
                {lectures.length}+
              </span>
              <span className="text-[11px] text-[#EAF8FF] font-semibold">مناظرة ومحاضرة موثقة</span>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-[#87CEEB]/35">
              <span className="text-xl sm:text-2xl font-mono font-black text-[#87CEEB] block">
                8
              </span>
              <span className="text-[11px] text-[#EAF8FF] font-semibold">تصنيفات دعوية متخصصة</span>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-[#87CEEB]/35">
              <span className="text-xl sm:text-2xl font-mono font-black text-[#5EEAD4] block">
                100M+
              </span>
              <span className="text-[11px] text-[#EAF8FF] font-semibold">مشاهدة وتأثير حول العالم</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-[#12345A] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث في عناوين المحاضرات، المناظرات، الشبهات، أو أسماء الدعاة...' : 'Search debates, topics, answers to misconceptions, or scholars...'}
                className="w-full bg-white/95 border-2 border-[#87CEEB] focus:border-[#D4AF37] rounded-2xl py-3.5 pr-12 pl-10 text-xs sm:text-sm text-[#12345A] placeholder-[#4A7298] focus:outline-none shadow-lg transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 -translate-y-1/2 left-3 p-1 rounded-lg text-[#4A7298] hover:text-[#12345A] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-white/20">
            <button
              type="button"
              onClick={() => setViewMode('playlists_studio')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'playlists_studio'
                  ? 'bg-[#D4AF37] text-[#12345A] shadow-md'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>استوديو السلاسل وقوائم التشغيل</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('classic_scholars')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'classic_scholars'
                  ? 'bg-[#D4AF37] text-[#12345A] shadow-md'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
              }`}
            >
              <User className="w-4 h-4" />
              <span>عرض كبار أعلام الدعوة والمناظرات</span>
            </button>

            {isUserAdmin && (
              <button
                type="button"
                onClick={() => setIsAdminPanelOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0A223D]/70 hover:bg-[#0A223D] border border-[#D4AF37]/50 text-xs font-bold text-[#F7E7B4] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إدارة المشرفين' : 'Admin Panel'}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* VideoPlaylistManager Studio */}
      {viewMode === 'playlists_studio' && (
        <VideoPlaylistManager onSelectVideo={(lec) => setActiveLecture(lec)} />
      )}

      {/* Classic Scholars View */}
      {viewMode === 'classic_scholars' && (
        <>
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#0EA5A4]" />
                <h2 className="text-lg sm:text-xl font-black font-amiri text-[#12345A] dark:text-white">
                  {lang === 'ar' ? 'أعلام الدعوة الإسلامية ومقارنة الأديان' : 'Eminent Islamic Dawah Scholars'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedScholarId('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedScholarId === 'all'
                      ? 'bg-[#12345A] text-white font-black shadow-sm'
                      : 'sky-glass-panel text-[#12345A] dark:text-[#EAF8FF]'
                  }`}
                >
                  {lang === 'ar' ? 'جميع الدعاة' : 'All Scholars'}
                </button>
                <button
                  type="button"
                  onClick={() => setDebatesOnly(!debatesOnly)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border whitespace-nowrap shrink-0 ${
                    debatesOnly
                      ? 'bg-[#0EA5A4] text-white border-[#0EA5A4] shadow-sm font-black'
                      : 'sky-glass-panel text-[#12345A] dark:text-[#EAF8FF] border-[#87CEEB]/50'
                  }`}
                >
                  {lang === 'ar' ? 'المناظرات فقط' : 'Debates Only'}
                </button>
              </div>
            </div>

            {/* Scholar Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {scholars.map((scholar) => {
                const isSelected = selectedScholarId === scholar.id;
                const count = lectures.filter(l => l.scholarId === scholar.id).length;

                return (
                  <button
                    key={scholar.id}
                    type="button"
                    onClick={() => setSelectedScholarId(isSelected ? 'all' : scholar.id)}
                    className={`sky-card-3d text-right rounded-2xl p-4 flex flex-col justify-between gap-3 cursor-pointer ${
                      isSelected ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-[#87CEEB]/60 bg-[#EAF8FF] dark:bg-[#0A223D] shadow-sm">
                        <img
                          src={scholar.imageUrl}
                          alt={scholar.nameAr}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#12345A] dark:text-white truncate font-amiri">
                          {lang === 'ar' ? scholar.nameAr : scholar.nameEn}
                        </h3>
                        <span className="text-[11px] text-[#0D7A7A] dark:text-[#5EEAD4] font-medium block truncate">
                          {scholar.country}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#4A7298] dark:text-[#87CEEB] border-t border-[#87CEEB]/30 pt-2 tabular-nums">
                      <span>{count} {lang === 'ar' ? 'محاضرة ومناظرة' : 'Lectures'}</span>
                      <span className="text-[#12345A] dark:text-[#F7E7B4] font-bold flex items-center gap-1">
                        <span>{isSelected ? 'محدد ✓' : 'تصفح'}</span>
                        <ChevronRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Scholar Highlight Bio Card */}
            {currentScholar && (
              <div className="scholarly-reading-paper p-5 sm:p-6 rounded-3xl shadow-md">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shrink-0 shadow-md">
                      <img
                        src={currentScholar.imageUrl}
                        alt={currentScholar.nameAr}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white">
                          {lang === 'ar' ? currentScholar.nameAr : currentScholar.nameEn}
                        </h3>
                        <span aria-hidden="true" className="text-[#87CEEB]">·</span>
                        <span className="text-xs text-[#0D7A7A] dark:text-[#5EEAD4] font-bold">
                          {currentScholar.titleAr}
                        </span>
                      </div>
                      <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] max-w-2xl leading-relaxed">
                        {lang === 'ar' ? currentScholar.bioAr : currentScholar.bioEn}
                      </p>
                      <div className="text-[11px] font-bold text-[#9A7418] dark:text-[#F7E7B4] pt-1">
                        {currentScholar.specialties.join(' · ')}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedScholarId('all')}
                    className="px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    {lang === 'ar' ? 'عرض جميع الدعاة' : 'Show All Scholars'}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Categories Filter Tabs */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#0EA5A4]" />
                <span>{lang === 'ar' ? 'التصنيفات الدعوية المتخصصة:' : 'Specialized Dawah Categories:'}</span>
              </span>

              <span className="text-xs text-[#0D7A7A] dark:text-[#5EEAD4] font-mono font-bold tabular-nums">
                {filteredLectures.length} {lang === 'ar' ? 'محاضرة متوفرة' : 'Available Lectures'}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#12345A] text-white font-black border-[#12345A] shadow-sm'
                    : 'sky-glass-panel text-[#12345A] dark:text-[#EAF8FF] border-[#87CEEB]/50'
                }`}
              >
                {lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}
              </button>

              {DAWAH_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-[#0EA5A4] text-white font-black border-[#0EA5A4] shadow-sm'
                        : 'sky-glass-panel text-[#12345A] dark:text-[#EAF8FF] border-[#87CEEB]/50'
                    }`}
                  >
                    <span>{lang === 'ar' ? cat.nameAr : cat.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Lectures Grid */}
          <section className="space-y-6">
            {filteredLectures.length === 0 ? (
              <div className="sky-card-3d p-12 text-center rounded-3xl space-y-3">
                <Video className="w-12 h-12 text-[#0EA5A4] mx-auto" />
                <h3 className="text-base font-bold text-[#12345A] dark:text-white">
                  لم يتم العثور على محاضرات تطابق هذا البحث
                </h3>
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                  جرب تغيير كلمات البحث أو اختيار تصنيف دعوي مختلف.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedScholarId('all');
                    setSelectedCategory('all');
                    setDebatesOnly(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#12345A] text-white font-bold text-xs cursor-pointer"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLectures.map((lecture) => {
                  const categoryMeta = DAWAH_CATEGORIES.find(c => c.id === lecture.category);
                  const scholarMeta = scholars.find(s => s.id === lecture.scholarId);

                  return (
                    <article
                      key={lecture.id}
                      className="sky-card-3d group rounded-3xl flex flex-col justify-between overflow-hidden"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-[#0A223D] overflow-hidden">
                        <img
                          src={`https://img.youtube.com/vi/${lecture.youtubeId}/hqdefault.jpg`}
                          alt={lecture.titleAr}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#091B33]/90 via-[#091B33]/30 to-transparent" />

                        <button
                          type="button"
                          onClick={() => setActiveLecture(lecture)}
                          className="absolute inset-0 flex items-center justify-center cursor-pointer group/btn"
                          aria-label="تشغيل المحاضرة"
                        >
                          <div className="w-14 h-14 rounded-full bg-[#D4AF37] group-hover/btn:bg-[#F7E7B4] text-[#12345A] flex items-center justify-center shadow-xl group-hover/btn:scale-110 transition-all duration-300">
                            <Play className="w-6 h-6 fill-current translate-x-0.5" />
                          </div>
                        </button>

                        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#091B33]/85 text-[11px] font-mono font-bold text-white tabular-nums">
                          <Clock className="w-3 h-3 text-[#F7E7B4]" />
                          <span>{lecture.durationMinutes} دقيقة</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-[#0D7A7A] dark:text-[#5EEAD4] font-bold">
                            <span>{lang === 'ar' ? categoryMeta?.nameAr : categoryMeta?.nameEn}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#4A7298] dark:text-[#87CEEB] flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              <span>{lecture.hasSubtitles ? 'مترجم' : 'إنجليزي'}</span>
                            </span>
                            {lecture.isDebate && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-rose-600 dark:text-rose-400">مناظرة</span>
                              </>
                            )}
                          </div>

                          <h3
                            onClick={() => setActiveLecture(lecture)}
                            className="font-bold text-base text-[#12345A] dark:text-white hover:text-[#0EA5A4] transition-colors line-clamp-2 cursor-pointer font-amiri leading-snug"
                          >
                            {lang === 'ar' ? lecture.titleAr : lecture.titleEn}
                          </h3>

                          {lecture.isDebate && lecture.opponentName && (
                            <div className="text-[11px] text-[#2B547E] dark:text-[#B8DEF5] font-semibold">
                              الطرف المناظر: <span className="font-bold text-[#12345A] dark:text-white">{lecture.opponentName}</span>
                            </div>
                          )}

                          <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] line-clamp-2 leading-relaxed">
                            {lang === 'ar' ? lecture.descriptionAr : lecture.descriptionEn}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {scholarMeta && (
                              <img
                                src={scholarMeta.imageUrl}
                                alt={scholarMeta.nameAr}
                                referrerPolicy="no-referrer"
                                className="w-7 h-7 rounded-full object-cover border border-[#87CEEB]/60 shrink-0"
                              />
                            )}
                            <span className="text-xs font-bold text-[#12345A] dark:text-[#F7E7B4] truncate">
                              {lang === 'ar' ? lecture.scholarNameAr : lecture.scholarNameEn}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleShare(lecture)}
                              className="p-1.5 rounded-lg bg-[#EAF8FF] dark:bg-[#0A223D] hover:bg-[#87CEEB]/30 text-[#12345A] dark:text-[#87CEEB] transition-colors cursor-pointer"
                              title="مشاركة المحاضرة"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveLecture(lecture)}
                              className="px-3 py-1.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                            >
                              <span>مشاهدة</span>
                              <Play className="w-3 h-3 fill-current" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {/* Video Player Modal */}
      {activeLecture && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#091B33]/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setActiveLecture(null)}
        >
          <div
            className="sky-card-3d relative w-full max-w-4xl border-2 border-[#D4AF37]/60 rounded-3xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#12345A] to-[#0E3F66] text-white border-b border-[#87CEEB]/35 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <Video className="w-5 h-5 text-[#F7E7B4] shrink-0" />
                <h3 className="font-bold text-sm sm:text-base text-white truncate font-amiri">
                  {lang === 'ar' ? activeLecture.titleAr : activeLecture.titleEn}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveLecture(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeLecture.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeLecture.titleAr}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-5 sm:p-7 space-y-5 max-h-[42vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#87CEEB]/35 pb-4">
                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-black text-[#12345A] dark:text-white font-amiri">
                    {lang === 'ar' ? activeLecture.titleAr : activeLecture.titleEn}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-[#0D7A7A] dark:text-[#5EEAD4] font-bold tabular-nums">
                    <User className="w-3.5 h-3.5" />
                    <span>{activeLecture.scholarNameAr}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeLecture.durationMinutes} دقيقة</span>
                    {activeLecture.dateRecorded && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{activeLecture.dateRecorded}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleShare(activeLecture)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#87CEEB]/50 text-[#12345A] dark:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedShare ? <Check className="w-3.5 h-3.5 text-[#0EA5A4]" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedShare ? 'تم النسخ!' : 'مشاركة'}</span>
                  </button>

                  <a
                    href={activeLecture.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] text-xs font-black transition-all cursor-pointer shadow-sm"
                  >
                    <span>فتح في YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] block">نبذة ومحاور المحاضرة:</span>
                <p className="scholarly-reading-paper text-xs sm:text-sm leading-relaxed p-4 rounded-2xl">
                  {lang === 'ar' ? activeLecture.descriptionAr : activeLecture.descriptionEn}
                </p>
              </div>

              {(activeLecture.topics || []).length > 0 && (
                <div className="text-[11px] text-[#4A7298] dark:text-[#87CEEB]">
                  الكلمات الدلالية: {(activeLecture.topics || []).join(' · ')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Management Modal */}
      {isAdminPanelOpen && isUserAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#091B33]/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsAdminPanelOpen(false)}
        >
          <div
            className="sky-card-3d relative w-full max-w-3xl border-2 border-[#D4AF37]/70 rounded-3xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#12345A] to-[#0E3F66] text-white border-b border-[#87CEEB]/35 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#F7E7B4]" />
                <h3 className="font-bold text-base text-white font-amiri">
                  لوحة إدارة المكتبة الدعوية العالمية (المشرفين)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsAdminPanelOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center border-b border-[#87CEEB]/35 bg-[#EAF8FF] dark:bg-[#0A223D] px-5 pt-3 gap-4 tabular-nums">
              <button
                type="button"
                onClick={() => setAdminTab('lectures')}
                className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  adminTab === 'lectures'
                    ? 'border-[#0EA5A4] text-[#12345A] dark:text-[#F7E7B4]'
                    : 'border-transparent text-[#4A7298] dark:text-[#84B4D6]'
                }`}
              >
                إضافة وإدارة المحاضرات ({lectures.length})
              </button>

              <button
                type="button"
                onClick={() => setAdminTab('scholars')}
                className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  adminTab === 'scholars'
                    ? 'border-[#0EA5A4] text-[#12345A] dark:text-[#F7E7B4]'
                    : 'border-transparent text-[#4A7298] dark:text-[#84B4D6]'
                }`}
              >
                إضافة داعية جديد ({scholars.length})
              </button>
            </div>

            {adminTab === 'lectures' && (
              <div className="p-5 sm:p-7 space-y-6 max-h-[68vh] overflow-y-auto text-xs">
                <form onSubmit={handleAddLecture} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#12345A] dark:text-white font-bold mb-1">عنوان المحاضرة (بالعربية)*</label>
                      <input
                        type="text"
                        required
                        value={newLecture.titleAr}
                        onChange={(e) => setNewLecture({ ...newLecture, titleAr: e.target.value })}
                        placeholder="مثال: مناظرة هل القرآن كلام الله؟"
                        className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#12345A] dark:text-white font-bold mb-1">Title (in English)</label>
                      <input
                        type="text"
                        value={newLecture.titleEn}
                        onChange={(e) => setNewLecture({ ...newLecture, titleEn: e.target.value })}
                        placeholder="e.g. Is the Quran God's Word?"
                        className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#12345A] dark:text-white font-bold mb-1">الداعية*</label>
                      <select
                        value={newLecture.scholarId}
                        onChange={(e) => setNewLecture({ ...newLecture, scholarId: e.target.value })}
                        className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                      >
                        {scholars.map(s => (
                          <option key={s.id} value={s.id}>{s.nameAr}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#12345A] dark:text-white font-bold mb-1">معرف أو رابط YouTube*</label>
                      <input
                        type="text"
                        required
                        value={newLecture.youtubeId}
                        onChange={(e) => setNewLecture({ ...newLecture, youtubeId: e.target.value })}
                        placeholder="3c4JjQz9p8g"
                        className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#12345A] dark:text-white font-bold mb-1">التصنيف الدعوي*</label>
                      <select
                        value={newLecture.category}
                        onChange={(e) => setNewLecture({ ...newLecture, category: e.target.value as DawahCategory })}
                        className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                      >
                        {DAWAH_CATEGORIES.map(c => (
                          <option key={c.id} value={c.id}>{c.nameAr}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#12345A] dark:text-white font-bold mb-1">المدة (بالدقائق)</label>
                      <input
                        type="number"
                        value={newLecture.durationMinutes}
                        onChange={(e) => setNewLecture({ ...newLecture, durationMinutes: Number(e.target.value) })}
                        className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#12345A] dark:text-white font-bold mb-1">اللغة</label>
                      <select
                        value={newLecture.language}
                        onChange={(e) => setNewLecture({ ...newLecture, language: e.target.value as 'ar' | 'en' | 'both' })}
                        className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                      >
                        <option value="both">مترجم للعربية والإنجليزية</option>
                        <option value="ar">عربي</option>
                        <option value="en">إنجليزي</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 pt-5">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#12345A] dark:text-white">
                        <input
                          type="checkbox"
                          checked={newLecture.isDebate}
                          onChange={(e) => setNewLecture({ ...newLecture, isDebate: e.target.checked })}
                          className="accent-[#0EA5A4]"
                        />
                        <span>مناظرة كبرى</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#12345A] dark:text-white">
                        <input
                          type="checkbox"
                          checked={newLecture.featured}
                          onChange={(e) => setNewLecture({ ...newLecture, featured: e.target.checked })}
                          className="accent-[#0EA5A4]"
                        />
                        <span>مميزة</span>
                      </label>
                    </div>
                  </div>

                  {newLecture.isDebate && (
                    <div>
                      <label className="block text-[#12345A] dark:text-white font-bold mb-1">اسم الطرف المناظر</label>
                      <input
                        type="text"
                        value={newLecture.opponentName}
                        onChange={(e) => setNewLecture({ ...newLecture, opponentName: e.target.value })}
                        className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[#12345A] dark:text-white font-bold mb-1">وصف المحاضرة ومحاورها (بالعربية)</label>
                    <textarea
                      rows={2}
                      value={newLecture.descriptionAr}
                      onChange={(e) => setNewLecture({ ...newLecture, descriptionAr: e.target.value })}
                      className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black text-xs transition-colors cursor-pointer"
                  >
                    حفظ وإضافة المحاضرة للمكتبة الدعوية
                  </button>
                </form>

                {/* Existing lectures quick delete list */}
                <div className="border-t border-[#87CEEB]/35 pt-4 space-y-2">
                  <h4 className="font-bold text-[#12345A] dark:text-white">المحاضرات المدرجة ({lectures.length})</h4>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {lectures.map(l => (
                      <div key={l.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D]">
                        <span className="font-bold text-[#12345A] dark:text-white truncate">{l.titleAr}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteLecture(l.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-500/10 cursor-pointer shrink-0"
                          title="حذف المحاضرة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'scholars' && (
              <form onSubmit={handleAddScholar} className="p-5 sm:p-7 space-y-4 max-h-[68vh] overflow-y-auto text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#12345A] dark:text-white font-bold mb-1">اسم الداعية (بالعربية)*</label>
                    <input
                      type="text"
                      required
                      value={newScholar.nameAr}
                      onChange={(e) => setNewScholar({ ...newScholar, nameAr: e.target.value })}
                      className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#12345A] dark:text-white font-bold mb-1">Scholar Name (English)*</label>
                    <input
                      type="text"
                      required
                      value={newScholar.nameEn}
                      onChange={(e) => setNewScholar({ ...newScholar, nameEn: e.target.value })}
                      className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#12345A] dark:text-white font-bold mb-1">اللقب العلمي</label>
                    <input
                      type="text"
                      value={newScholar.titleAr}
                      onChange={(e) => setNewScholar({ ...newScholar, titleAr: e.target.value })}
                      className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#12345A] dark:text-white font-bold mb-1">الدولة</label>
                    <input
                      type="text"
                      value={newScholar.country}
                      onChange={(e) => setNewScholar({ ...newScholar, country: e.target.value })}
                      className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#12345A] dark:text-white font-bold mb-1">نبذة تعريفية موثقة</label>
                  <textarea
                    rows={3}
                    value={newScholar.bioAr}
                    onChange={(e) => setNewScholar({ ...newScholar, bioAr: e.target.value })}
                    className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-3 py-2 text-[#12345A] dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black text-xs transition-colors cursor-pointer"
                >
                  حفظ وإضافة الداعية
                </button>
              </form>
            )}

            <div className="p-4 bg-[#EAF8FF] dark:bg-[#0A223D] border-t border-[#87CEEB]/35 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAdminPanelOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#12345A] text-white font-bold text-xs cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin-managed Dynamic Section Items */}
      <SectionDynamicItems sectionSlug="dawahLibrary" />
    </div>
  );
};
