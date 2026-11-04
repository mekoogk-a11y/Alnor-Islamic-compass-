import React, { useState, useMemo } from 'react';
import { 
  Video, Play, Search, Filter, Globe, Sparkles, Share2, 
  BookOpen, Heart, Award, Check, Clock, User, Compass, 
  ExternalLink, ChevronRight, X, Plus, Edit, Trash2, ShieldCheck, 
  Sliders, MessageCircle, ArrowLeft, ArrowRight, Eye, Tag
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
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { OFFICIAL_COMPLEX_LOGO } from '../../data/islamicData';

interface DawahLibraryPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const DawahLibraryPage: React.FC<DawahLibraryPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  const { user } = useAuth();
  
  // Storage keys for persistent additions
  const STORAGE_KEY_SCHOLARS = 'alnoor_dawah_scholars_v1';
  const STORAGE_KEY_LECTURES = 'alnoor_dawah_lectures_v1';

  // Dynamic state for scholars & lectures (loads from localStorage or initial defaults)
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

  // Navigation & Filter state
  const [selectedScholarId, setSelectedScholarId] = useState<string | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<DawahCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'ar' | 'en' | 'both'>('all');
  const [debatesOnly, setDebatesOnly] = useState(false);

  // Active Video Modal State
  const [activeLecture, setActiveLecture] = useState<DawahLecture | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Admin Management Modal & State
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'lectures' | 'scholars'>('lectures');
  
  // New Lecture Form State
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

  // New Scholar Form State
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

  // Check if current user is admin
  const isUserAdmin = user?.role === 'admin' || user?.email === 'mekoogk@gmail.com';

  // Selected Scholar details (if filtered to one)
  const currentScholar = useMemo(() => {
    if (selectedScholarId === 'all') return null;
    return scholars.find(s => s.id === selectedScholarId) || null;
  }, [scholars, selectedScholarId]);

  // Filtered Lectures
  const filteredLectures = useMemo(() => {
    return lectures.filter((lec) => {
      // Scholar filter
      if (selectedScholarId !== 'all' && lec.scholarId !== selectedScholarId) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && lec.category !== selectedCategory) {
        return false;
      }
      // Language filter
      if (selectedLanguage !== 'all' && lec.language !== selectedLanguage && lec.language !== 'both') {
        return false;
      }
      // Debates only
      if (debatesOnly && !lec.isDebate) {
        return false;
      }
      // Search query filter (matches Ar/En titles, scholars, topics, and descriptions)
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
  }, [lectures, selectedScholarId, selectedCategory, selectedLanguage, debatesOnly, searchQuery]);

  // Handle Share Lecture
  const handleShare = (lecture: DawahLecture) => {
    const shareUrl = `${window.location.origin}/#dawah-${lecture.id}`;
    const textToShare = `${lecture.titleAr}\n${lecture.scholarNameAr}\nالمكتبة الدعوية العالمية - مجمع النور الإسلامي\n${shareUrl}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Add Lecture to State & LocalStorage
  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLecture.titleAr.trim() || !newLecture.youtubeId.trim()) return;

    const matchedScholar = scholars.find(s => s.id === newLecture.scholarId);
    const created: DawahLecture = {
      id: `lec-${Date.now()}`,
      scholarId: newLecture.scholarId,
      scholarNameAr: matchedScholar?.nameAr || 'داعية إسلامي',
      scholarNameEn: matchedScholar?.nameEn || 'Islamic Scholar',
      titleAr: newLecture.titleAr,
      titleEn: newLecture.titleEn || newLecture.titleAr,
      youtubeId: newLecture.youtubeId.replace(/https?:\/\/(www\.)?youtube\.com\/watch\?v=/, '').replace(/https?:\/\/youtu\.be\//, '').trim(),
      youtubeUrl: `https://www.youtube.com/watch?v=${newLecture.youtubeId}`,
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

    // Reset Form
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
    alert('تمت إضافة المحاضرة الدعوية بنجاح إلى المكتبة!');
  };

  // Add Scholar to State & LocalStorage
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
      imageUrl: newScholar.imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
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
    alert('تمت إضافة الداعية الجديد بنجاح إلى الهيئة الدعوية للمكتبة!');
  };

  // Delete Lecture
  const handleDeleteLecture = (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المحاضرة؟')) return;
    const updated = lectures.filter(l => l.id !== id);
    setLectures(updated);
    try {
      localStorage.setItem(STORAGE_KEY_LECTURES, JSON.stringify(updated));
    } catch (_) {}
  };

  return (
    <div className="space-y-12 sm:space-y-16 text-slate-100" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* =========================================================================
          1. GRAND DAWAH HERO BANNER: GLOBAL DAWAH LIBRARY
          ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0B132B] via-[#070D1E] to-[#050914] border border-[#D4AF37]/40 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-6 sm:p-12 transition-colors">
        
        {/* Glow ambient spots */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-6 text-center">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111C3D] border border-[#D4AF37]/50 text-xs font-bold text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>المكتبة الدعوية العالمية · GLOBAL DAWAH LIBRARY</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400">حوار العقول وهداية القلوب</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-amiri text-white tracking-wide leading-tight">
            مكتبة الدعوة العالمية ومقارنة الأديان
          </h1>

          <p className="text-xs sm:text-base text-[#D8CEBB] max-w-3xl mx-auto leading-relaxed">
            منظومة وثائقية متكاملة تضم تراث كبار مناظري ودعاة الإسلام في العصر الحديث: من مناظرات الشيخ أحمد ديدات التاريخية، ومحاضرات د. ذاكر نايك، والشيخ يوسف إستس، والمفتي منك، والأستاذ نعمان علي خان، بلغات حية وتصنيفات علمية رصينة.
          </p>

          {/* Quick Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-2">
            <div className="p-3 bg-[#0B132B]/80 rounded-2xl border border-amber-400/30">
              <span className="text-xl sm:text-2xl font-mono font-black text-amber-300 block">
                {scholars.length}
              </span>
              <span className="text-[11px] text-slate-300 font-semibold">من كبار الدعاة العالميين</span>
            </div>
            <div className="p-3 bg-[#0B132B]/80 rounded-2xl border border-amber-400/30">
              <span className="text-xl sm:text-2xl font-mono font-black text-white block">
                {lectures.length}+
              </span>
              <span className="text-[11px] text-slate-300 font-semibold">مناظرة ومحاضرة موثقة</span>
            </div>
            <div className="p-3 bg-[#0B132B]/80 rounded-2xl border border-sky-400/30">
              <span className="text-xl sm:text-2xl font-mono font-black text-sky-400 block">
                8
              </span>
              <span className="text-[11px] text-slate-300 font-semibold">تصنيفات دعوية متخصصة</span>
            </div>
            <div className="p-3 bg-[#0B132B]/80 rounded-2xl border border-emerald-400/30">
              <span className="text-xl sm:text-2xl font-mono font-black text-emerald-400 block">
                100M+
              </span>
              <span className="text-[11px] text-slate-300 font-semibold">مشاهدة وتأثير حول العالم</span>
            </div>
          </div>

          {/* Central Live Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-amber-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث في عناوين المحاضرات، المناظرات، الشبهات، أو أسماء الدعاة...' : 'Search debates, topics, answers to misconceptions, or scholars...'}
                className="w-full bg-[#070D1E]/95 border-2 border-amber-400/50 focus:border-yellow-300 rounded-2xl py-3.5 pr-12 pl-4 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none shadow-2xl transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 -translate-y-1/2 left-4 p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Admin Management Button (for Admins) */}
          <div className="flex justify-center pt-1">
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'إدارة محتوى المكتبة الدعوية (لوحة المشرفين)' : 'Manage Dawah Library (Admin Panel)'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. SCHOLARS SELECTION CAROUSEL & PROFILE BARS
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-black font-amiri text-white">
              {lang === 'ar' ? 'أعلام الدعوة الإسلامية ومقارنة الأديان' : 'Eminent Islamic Dawah Scholars'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedScholarId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedScholarId === 'all'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-[#0B132B] hover:bg-[#111C3D] text-slate-300 border border-slate-700'
              }`}
            >
              {lang === 'ar' ? 'جميع الدعاة' : 'All Scholars'}
            </button>
            <button
              onClick={() => setDebatesOnly(!debatesOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                debatesOnly
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md font-black'
                  : 'bg-[#0B132B] hover:bg-[#111C3D] text-slate-300 border-slate-700'
              }`}
            >
              {lang === 'ar' ? 'المناظرات فقط ⚖️' : 'Debates Only ⚖️'}
            </button>
          </div>
        </div>

        {/* Scholar Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {scholars.map((scholar) => {
            const isSelected = selectedScholarId === scholar.id;
            const count = lectures.filter(l => l.scholarId === scholar.id).length;

            return (
              <div
                key={scholar.id}
                onClick={() => setSelectedScholarId(isSelected ? 'all' : scholar.id)}
                className={`relative rounded-2xl p-4 transition-all duration-300 cursor-pointer border flex flex-col justify-between gap-3 overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#16254C] to-[#0B1530] border-amber-400 ring-2 ring-amber-400/50 shadow-xl scale-[1.02]'
                    : 'bg-[#0B132B]/90 hover:bg-[#101D3D] border-slate-800 text-slate-300 hover:border-slate-700 hover:shadow-lg'
                }`}
              >
                {/* Active Indicator Pin */}
                {isSelected && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                    محدد ✓
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <div className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400/40 bg-slate-800 shadow-md">
                    <img
                      src={scholar.imageUrl}
                      alt={scholar.nameAr}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-white truncate font-amiri">
                      {lang === 'ar' ? scholar.nameAr : scholar.nameEn}
                    </h3>
                    <span className="text-[10px] text-amber-300/90 font-medium block truncate">
                      {scholar.country}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>{count} {lang === 'ar' ? 'محاضرة ومناظرة' : 'Lectures'}</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1 text-[10px]">
                    <span>تصفح</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Scholar Highlight Bio Card (if filtered to one) */}
        {currentScholar && (
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#111C3D] via-[#0B132B] to-[#0A1633] border-2 border-amber-400/60 shadow-xl animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-lg">
                  <img
                    src={currentScholar.imageUrl}
                    alt={currentScholar.nameAr}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-2xl font-black font-amiri text-white">
                      {lang === 'ar' ? currentScholar.nameAr : currentScholar.nameEn}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/40 text-[10px] text-amber-300 font-bold">
                      {currentScholar.titleAr}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    {lang === 'ar' ? currentScholar.bioAr : currentScholar.bioEn}
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {currentScholar.specialties.map((spec, i) => (
                      <span key={i} className="text-[10px] bg-[#070D1E] text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-md">
                        #{spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedScholarId('all')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                {lang === 'ar' ? 'عرض جميع الدعاة' : 'Show All Scholars'}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          3. CATEGORIES FILTER TABS (التصنيفات الدعوية الثمانية)
          ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>{lang === 'ar' ? 'التصنيفات الدعوية المتخصصة:' : 'Specialized Dawah Categories:'}</span>
          </span>

          <span className="text-xs text-amber-300 font-mono font-bold">
            {filteredLectures.length} {lang === 'ar' ? 'محاضرة متوفرة' : 'Available Lectures'}
          </span>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-md'
                : 'bg-[#0B132B] hover:bg-[#111C3D] text-slate-300 border-slate-800'
            }`}
          >
            {lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}
          </button>

          {DAWAH_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black border-amber-300 shadow-md'
                    : 'bg-[#0B132B] hover:bg-[#111C3D] text-slate-300 border-slate-800'
                }`}
              >
                <span>{lang === 'ar' ? cat.nameAr : cat.nameEn}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. LECTURES & DEBATES GRID (مع مشغل الفيديو المدمج)
          ========================================================================= */}
      <section className="space-y-6">
        {filteredLectures.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0B132B]/80 border border-slate-800 space-y-3">
            <Video className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">لم يتم العثور على محاضرات تطابق هذا البحث</h3>
            <p className="text-xs text-slate-400">جرب تغيير كلمات البحث أو اختيار تصنيف دعوي مختلف.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedScholarId('all');
                setSelectedCategory('all');
                setDebatesOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
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
                <div
                  key={lecture.id}
                  className="group rounded-3xl bg-gradient-to-b from-[#0B132B] to-[#070D1E] border border-slate-800 hover:border-amber-400/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Video Thumbnail & Preview Banner */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${lecture.youtubeId}/hqdefault.jpg`}
                      alt={lecture.titleAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Play Button Trigger */}
                    <button
                      onClick={() => setActiveLecture(lecture)}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer group/btn"
                      aria-label="تشغيل المحاضرة"
                    >
                      <div className="w-14 h-14 rounded-full bg-amber-400/90 group-hover/btn:bg-amber-300 text-slate-950 flex items-center justify-center shadow-xl group-hover/btn:scale-110 transition-all duration-300">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </button>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-mono font-bold text-white">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{lecture.durationMinutes} دقيقة</span>
                    </div>

                    {/* Debate / Special Badge */}
                    {lecture.isDebate && (
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black shadow-md flex items-center gap-1">
                        <span>مناظرة كبرى ⚖️</span>
                      </div>
                    )}

                    {lecture.featured && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-current" />
                        <span>محاضرة مختارة</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Category & Language Tag */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`px-2 py-0.5 rounded-md font-bold border ${categoryMeta?.badgeColor || 'text-amber-300'}`}>
                          {lang === 'ar' ? categoryMeta?.nameAr : categoryMeta?.nameEn}
                        </span>

                        <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                          <Globe className="w-3 h-3 text-amber-400" />
                          <span>{lecture.hasSubtitles ? 'مترجم للعربية والإنجليزية' : 'لغة إنجليزية'}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 
                        onClick={() => setActiveLecture(lecture)}
                        className="font-bold text-base text-white hover:text-amber-300 transition-colors line-clamp-2 cursor-pointer font-amiri leading-snug"
                      >
                        {lang === 'ar' ? lecture.titleAr : lecture.titleEn}
                      </h3>

                      {/* Opponent in Debates */}
                      {lecture.isDebate && lecture.opponentName && (
                        <div className="text-[11px] text-rose-300 font-semibold flex items-center gap-1">
                          <span>الطرف المناظر:</span>
                          <span className="font-mono text-white">{lecture.opponentName}</span>
                        </div>
                      )}

                      {/* Description Snippet */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {lang === 'ar' ? lecture.descriptionAr : lecture.descriptionEn}
                      </p>
                    </div>

                    {/* Card Footer: Scholar Info & Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {scholarMeta && (
                          <img
                            src={scholarMeta.imageUrl}
                            alt={scholarMeta.nameAr}
                            className="w-7 h-7 rounded-full object-cover border border-amber-400/50"
                          />
                        )}
                        <span className="text-xs font-bold text-amber-200">
                          {lang === 'ar' ? lecture.scholarNameAr : lecture.scholarNameEn}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShare(lecture)}
                          className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                          title="مشاركة المحاضرة"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setActiveLecture(lecture)}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1 cursor-pointer"
                        >
                          <span>مشاهدة</span>
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          5. IN-APP DEDICATED VIDEO PLAYER MODAL (YouTube Official Embed)
          ========================================================================= */}
      {activeLecture && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={() => setActiveLecture(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-gradient-to-b from-[#0B132B] via-[#070D1E] to-[#050914] border-2 border-amber-400/60 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto text-slate-100"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#111C3D] to-[#0B132B] border-b border-amber-400/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <Video className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="font-bold text-sm sm:text-base text-white truncate font-amiri">
                  {lang === 'ar' ? activeLecture.titleAr : activeLecture.titleEn}
                </h3>
              </div>

              <button
                onClick={() => setActiveLecture(null)}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-App YouTube Embed Frame */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeLecture.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeLecture.titleAr}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Video Details & Actions */}
            <div className="p-5 sm:p-7 space-y-5 max-h-[42vh] overflow-y-auto custom-scrollbar">
              
              {/* Title & Scholar Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-black text-white font-amiri">
                    {lang === 'ar' ? activeLecture.titleAr : activeLecture.titleEn}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-amber-300">
                    <User className="w-3.5 h-3.5" />
                    <span>{activeLecture.scholarNameAr}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{activeLecture.durationMinutes} دقيقة</span>
                    {activeLecture.dateRecorded && (
                      <>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 font-mono">{activeLecture.dateRecorded}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(activeLecture)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedShare ? 'تم النسخ!' : 'مشاركة'}</span>
                  </button>

                  <a
                    href={activeLecture.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md"
                  >
                    <span>فتح في YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">نبذة ومحاور المحاضرة:</span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#070D1E] p-4 rounded-2xl border border-slate-800">
                  {lang === 'ar' ? activeLecture.descriptionAr : activeLecture.descriptionEn}
                </p>
              </div>

              {/* Topics Tags */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[11px] text-slate-400">الكلمات الدلالية:</span>
                {(activeLecture.topics || []).map((tag, idx) => (
                  <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-[#111C3D] text-amber-200 border border-amber-400/30">
                    #{tag}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. ADMIN MANAGEMENT MODAL (لوحة إدارة المكتبة الدعوية)
          ========================================================================= */}
      {isAdminPanelOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={() => setIsAdminPanelOpen(false)}
        >
          <div 
            className="relative w-full max-w-3xl bg-gradient-to-b from-[#0B132B] via-[#070D1E] to-[#050914] border-2 border-amber-400/70 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#111C3D] to-[#0B132B] border-b border-amber-400/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white font-amiri">
                  لوحة إدارة المكتبة الدعوية العالمية (المشرفين)
                </h3>
              </div>

              <button
                onClick={() => setIsAdminPanelOpen(false)}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs: Lectures vs Scholars */}
            <div className="flex items-center border-b border-slate-800 bg-[#070D1E] px-5 pt-3 gap-3">
              <button
                onClick={() => setAdminTab('lectures')}
                className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  adminTab === 'lectures'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                إضافة وإدارة المحاضرات ({lectures.length})
              </button>

              <button
                onClick={() => setAdminTab('scholars')}
                className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  adminTab === 'scholars'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                إضافة داعية جديد ({scholars.length})
              </button>
            </div>

            {/* Tab 1: Add New Lecture Form */}
            {adminTab === 'lectures' && (
              <form onSubmit={handleAddLecture} className="p-5 sm:p-7 space-y-4 max-h-[68vh] overflow-y-auto text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">عنوان المحاضرة (بالعربية)*</label>
                    <input
                      type="text"
                      required
                      value={newLecture.titleAr}
                      onChange={(e) => setNewLecture({ ...newLecture, titleAr: e.target.value })}
                      placeholder="مثال: مناظرة هل القرآن كلام الله؟"
                      className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Title (in English)</label>
                    <input
                      type="text"
                      value={newLecture.titleEn}
                      onChange={(e) => setNewLecture({ ...newLecture, titleEn: e.target.value })}
                      placeholder="e.g. Is the Quran God's Word?"
                      className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">الداعية*</label>
                    <select
                      value={newLecture.scholarId}
                      onChange={(e) => setNewLecture({ ...newLecture, scholarId: e.target.value })}
                      className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                    >
                      {scholars.map(s => (
                        <option key={s.id} value={s.id}>{s.nameAr}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">معرف أو رابط YouTube*</label>
                    <input
                      type="text"
                      required
                      value={newLecture.youtubeId}
                      onChange={(e) => setNewLecture({ ...newLecture, youtubeId: e.target.value })}
                      placeholder="معرف الفيديو مثل 3c4JjQz9p8g"
                      className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">التصنيف الدعوي*</label>
                    <select
                      value={newLecture.category}
                      onChange={(e) => setNewLecture({ ...newLecture, category: e.target.value as DawahCategory })}
                      className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                    >
                      {DAWAH_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.nameAr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">المدة (بالدقائق)</label>
                    <input
                      type="number"
                      value={newLecture.durationMinutes}
                      onChange={(e) => setNewLecture({ ...newLecture, durationMinutes: Number(e.target.value) })}
                      className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">اللغة</label>
                    <select
                      value={newLecture.language}
                      onChange={(e) => setNewLecture({ ...newLecture, language: e.target.value as any })}
                      className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="both">مترجم للعربية والإنجليزية</option>
                      <option value="ar">عربي</option>
                      <option value="en">إنجليزي</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newLecture.isDebate}
                        onChange={(e) => setNewLecture({ ...newLecture, isDebate: e.target.checked })}
                        className="accent-amber-400"
                      />
                      <span>مناظرة كبرى؟</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newLecture.featured}
                        onChange={(e) => setNewLecture({ ...newLecture, featured: e.target.checked })}
                        className="accent-amber-400"
                      />
                      <span>مميزة في الواجهة</span>
                    </label>
                  </div>
                </div>

                {newLecture.isDebate && (
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">اسم الطرف المناظر (المسيحي / المستشرق)</label>
                    <input
                      type="text"
                      value={newLecture.opponentName}
                      onChange={(e) => setNewLecture({ ...newLecture, opponentName: e.target.value })}
                      placeholder="مثل: القس جيمي سواغارت"
                      className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-bold mb-1">وصف المحاضرة ومحاورها (بالعربية)</label>
                  <textarea
                    rows={2}
                    value={newLecture.descriptionAr}
                    onChange={(e) => setNewLecture({ ...newLecture, descriptionAr: e.target.value })}
                    className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">الكلمات الدلالية (مفصولة بفاصلة)</label>
                  <input
                    type="text"
                    value={newLecture.topicsText}
                    onChange={(e) => setNewLecture({ ...newLecture, topicsText: e.target.value })}
                    className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                >
                  حفظ وإضافة المحاضرة للمكتبة الدعوية
                </button>
              </form>
            )}

            {/* Tab 2: Add New Scholar Form */}
            {adminTab === 'scholars' && (
              <form onSubmit={handleAddScholar} className="p-5 sm:p-7 space-y-4 max-h-[68vh] overflow-y-auto text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">اسم الداعية (بالعربية)*</label>
                    <input
                      type="text"
                      required
                      value={newScholar.nameAr}
                      onChange={(e) => setNewScholar({ ...newScholar, nameAr: e.target.value })}
                      placeholder="مثل: الشيخ بلال فيليبس"
                      className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Scholar Name (English)*</label>
                    <input
                      type="text"
                      required
                      value={newScholar.nameEn}
                      onChange={(e) => setNewScholar({ ...newScholar, nameEn: e.target.value })}
                      placeholder="e.g. Dr. Bilal Philips"
                      className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">اللقب / الصفة العلمية</label>
                    <input
                      type="text"
                      value={newScholar.titleAr}
                      onChange={(e) => setNewScholar({ ...newScholar, titleAr: e.target.value })}
                      placeholder="مثل: مؤسس الجامعة الإسلامية المفتوحة"
                      className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">الدولة أو بلد الإقامة</label>
                    <input
                      type="text"
                      value={newScholar.country}
                      onChange={(e) => setNewScholar({ ...newScholar, country: e.target.value })}
                      placeholder="مثل: كندا / قطر"
                      className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">رابط الصورة الشخصية (Image URL)</label>
                  <input
                    type="url"
                    value={newScholar.imageUrl}
                    onChange={(e) => setNewScholar({ ...newScholar, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">نبذة تعريفية موثقة</label>
                  <textarea
                    rows={3}
                    value={newScholar.bioAr}
                    onChange={(e) => setNewScholar({ ...newScholar, bioAr: e.target.value })}
                    placeholder="اكتب نبذة عن مؤهلات الداعية، إسهاماته الدعوية، وأهم ما يميزه..."
                    className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">التخصصات الدعوية (مفصولة بفاصلة)</label>
                  <input
                    type="text"
                    value={newScholar.specialtiesText}
                    onChange={(e) => setNewScholar({ ...newScholar, specialtiesText: e.target.value })}
                    placeholder="مقارنة الأديان, العقيدة, دعوة الغرب"
                    className="w-full bg-[#070D1E] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                >
                  حفظ وإضافة الداعية
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="p-4 bg-[#070D1E] border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsAdminPanelOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
