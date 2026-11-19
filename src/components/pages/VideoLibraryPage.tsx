import React, { useCallback, useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Loader2,
  Play,
  Search,
  ShieldCheck,
  Video,
  X,
} from 'lucide-react';
import { NavigationPage, VideoCategory, VideoRecord } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { OFFICIAL_COMPLEX_LOGO } from '../../data/islamicData';
import {
  formatDuration,
  VIDEO_CATEGORY_LIST,
  VIDEO_CATEGORY_MAP,
} from '../../utils/videoCategories';
import { HlsVideoPlayer } from '../HlsVideoPlayer';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface VideoLibraryPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const VideoLibraryPage: React.FC<VideoLibraryPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  const { user } = useAuth();
  const isAr = lang === 'ar';

  const isAuthorizedAdmin = user?.role === 'admin' || user?.email === 'mekoogk@gmail.com';

  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeVideo, setActiveVideo] = useState<VideoRecord | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const qs = new URLSearchParams({
        page: String(page),
        limit: '12',
      });
      if (selectedCategory !== 'all') qs.set('category', selectedCategory);
      if (debouncedSearch) qs.set('q', debouncedSearch);

      const res = await fetch(`/api/v1/videos?${qs.toString()}`);
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(
          json?.error?.message ||
            (isAr ? 'تعذر تحميل المكتبة المرئية حالياً.' : 'Could not load video library.')
        );
      }

      setVideos(json.data.items || []);
      setTotalPages(json.data.pagination?.totalPages || 1);
      setTotalCount(json.data.pagination?.total || 0);
    } catch (err: any) {
      setErrorMsg(err?.message || (isAr ? 'حدث خطأ أثناء تحميل الفيديوهات.' : 'Load failed.'));
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, debouncedSearch, isAr]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleRecordView = useCallback((videoId: number) => {
    fetch(`/api/v1/videos/${videoId}/view`, { method: 'POST' }).catch(() => {});
  }, []);

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sky-Blue 3D Institutional Header */}
      <section className="rounded-3xl bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] border border-[#87CEEB]/55 p-6 sm:p-10 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <Sky3DIcon slug="videoLibrary" tone="indigo" size="md" />
              <p className="text-xs font-bold text-[#87CEEB]">
                {isAr
                  ? 'المبنى 07 · المركز الإعلامي · البث التكيفي عالي الدقة'
                  : 'Building 07 · Media Center · Adaptive HLS Video Streaming'}
              </p>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white leading-tight text-balance">
              {isAr
                ? 'المكتبة المرئية الإسلامية الرسمية لمجمع النور'
                : 'Al-Noor Official Islamic Video Library'}
            </h1>
            <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed">
              {isAr
                ? 'تلاوات قرآنية خاشعة، محاضرات ودروس علمية مؤصلة، حلقات تحفيظ القرآن والتجويد، دورات تعليمية، وتقارير ميدانية للأعمال الخيرية وكفالة الأيتام ببث تكيفي سريع لجميع الأجهزة.'
                : 'Reverent Quran recitations, scholarly Islamic lectures, memorization lessons, academic courses, charitable field reports, and official campus briefings streamed adaptively.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isAuthorizedAdmin && (
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-md transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'إدارة ورفع الفيديوهات' : 'Manage & Upload Videos'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('dawahLibrary')}
              className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-[#87CEEB]/50 text-white text-xs font-bold cursor-pointer whitespace-nowrap transition-colors"
            >
              {isAr ? 'أرشيف الدعوة والمناظرات' : 'Dawah Debate Archive'}
            </button>
          </div>
        </div>
      </section>

      {/* Search & Interactive Category Filter Buttons */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#0EA5A4] absolute top-1/2 -translate-y-1/2 start-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث في التلاوات، المحاضرات، الدروس، والأنشطة الخيرية...'
                  : 'Search recitations, lectures, courses, charity...'
              }
              className="w-full min-h-[44px] ps-10 pe-4 py-2 rounded-2xl bg-white/95 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 text-sm text-[#12345A] dark:text-white shadow-sm"
            />
          </div>

          <p className="text-xs text-[#12345A] dark:text-[#B8DEF5] font-mono font-bold tabular-nums">
            {isAr ? `${totalCount} مادة مرئية منشورة` : `${totalCount} published videos`}
          </p>
        </div>

        {/* 6 Requested Categories + All */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setPage(1);
            }}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4]'
                : 'bg-white/90 dark:bg-[#0F2747] border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-[#B8DEF5] hover:border-[#0EA5A4]'
            }`}
          >
            {isAr ? 'جميع الأقسام' : 'All Categories'}
          </button>

          {VIDEO_CATEGORY_LIST.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setPage(1);
              }}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4]'
                  : 'bg-white/90 dark:bg-[#0F2747] border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-[#B8DEF5] hover:border-[#0EA5A4]'
              }`}
            >
              {isAr ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>
      </section>

      {/* Active Theater Player */}
      {activeVideo && activeVideo.playbackUrl && (
        <section className="sky-card-3d rounded-3xl p-4 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-semibold text-[#0D7A7A] dark:text-[#87CEEB]">
                {isAr
                  ? VIDEO_CATEGORY_MAP[activeVideo.category]?.labelAr
                  : VIDEO_CATEGORY_MAP[activeVideo.category]?.labelEn}
                {activeVideo.durationSeconds > 0 && ` · ${formatDuration(activeVideo.durationSeconds)}`}
              </p>
              <h2 className="text-lg sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white">
                {isAr ? activeVideo.titleAr : activeVideo.titleEn}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="p-2 rounded-xl bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/50 cursor-pointer shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center text-[#12345A] dark:text-white"
              aria-label={isAr ? 'إغلاق المشغل' : 'Close Player'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <HlsVideoPlayer
            playbackUrl={activeVideo.playbackUrl}
            posterUrl={activeVideo.thumbnailUrl}
            title={isAr ? activeVideo.titleAr : activeVideo.titleEn}
            autoPlay={true}
            onPlayRecorded={() => handleRecordView(activeVideo.id)}
          />

          {activeVideo.description && (
            <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed max-w-prose">
              {activeVideo.description}
            </p>
          )}
        </section>
      )}

      {/* Video Grid */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-xs text-[#12345A] dark:text-[#B8DEF5]">
          <Loader2 className="w-7 h-7 animate-spin text-[#0EA5A4]" />
          <span>{isAr ? 'جاري تحميل المكتبة المرئية...' : 'Loading video catalog...'}</span>
        </div>
      ) : errorMsg ? (
        <div className="sky-card-3d p-8 rounded-3xl text-center space-y-3">
          <p className="text-sm font-bold text-[#B91C1C] dark:text-[#FCA5A5]">{errorMsg}</p>
          <button
            type="button"
            onClick={loadVideos}
            className="px-4 py-2 rounded-xl bg-[#12345A] text-white text-xs font-bold cursor-pointer"
          >
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      ) : videos.length === 0 ? (
        <div className="sky-card-3d p-10 rounded-3xl text-center space-y-3">
          <Video className="w-10 h-10 text-[#0EA5A4] mx-auto" />
          <h3 className="text-lg font-black font-amiri text-[#12345A] dark:text-white">
            {isAr
              ? 'لا توجد فيديوهات منشورة في هذا التصنيف حالياً'
              : 'No published videos in this category yet'}
          </h3>
          <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] max-w-lg mx-auto leading-relaxed">
            {isAr
              ? 'تُرفع وتُعتمد التلاوات والمحاضرات والدروس المرئية عبر لوحة إدارة المجمع بعد إتمام المعالجة والتدقيق الشرعي والفني.'
              : 'Verified recitations, lectures, and lessons are published by the Complex administration once transcoding and editorial review complete.'}
          </p>
          {isAuthorizedAdmin && (
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="px-5 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold cursor-pointer transition-colors"
            >
              {isAr ? 'الانتقال إلى لوحة رفع الفيديوهات' : 'Open Admin Video Uploader'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => {
            const catMeta = VIDEO_CATEGORY_MAP[v.category];
            return (
              <article
                key={v.id}
                className="sky-card-3d rounded-3xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveVideo(v)}
                    className="w-full relative aspect-video bg-[#12345A] overflow-hidden group cursor-pointer block text-start"
                  >
                    {v.thumbnailUrl ? (
                      <img
                        src={v.thumbnailUrl}
                        alt={isAr ? v.titleAr : v.titleEn}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#12345A] to-[#0EA5A4] flex flex-col items-center justify-center p-4 gap-2">
                        <img
                          src={OFFICIAL_COMPLEX_LOGO}
                          alt="شعار مجمع النور"
                          className="w-12 h-12 object-contain opacity-90 bg-white rounded-xl p-1"
                        />
                        <Film className="w-5 h-5 text-[#F7E7B4]" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#12345A]/80 via-[#12345A]/15 to-transparent flex items-center justify-center">
                      <span className="w-12 h-12 rounded-full bg-[#12345A]/90 border border-[#87CEEB] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-5 h-5 ms-0.5" />
                      </span>
                    </div>

                    {v.durationSeconds > 0 && (
                      <span className="absolute bottom-2.5 end-2.5 px-2 py-0.5 rounded bg-[#12345A]/90 text-white text-[11px] font-mono tabular-nums">
                        {formatDuration(v.durationSeconds)}
                      </span>
                    )}
                  </button>

                  <div className="p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#0D7A7A] dark:text-[#87CEEB] font-bold">
                      <span>{isAr ? catMeta?.labelAr : catMeta?.labelEn}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums text-[#4A7298] dark:text-[#B8DEF5]">
                        {v.viewsCount} {isAr ? 'مشاهدة' : 'views'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black font-amiri text-[#12345A] dark:text-white leading-snug line-clamp-2">
                      {isAr ? v.titleAr : v.titleEn}
                    </h3>

                    {v.description && (
                      <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed line-clamp-2">
                        {v.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-[#87CEEB]/30 dark:border-[#87CEEB]/15">
                  <button
                    type="button"
                    onClick={() => setActiveVideo(v)}
                    className="w-full min-h-[42px] py-2 px-4 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-[#87CEEB]" />
                    <span>{isAr ? 'مشاهدة الفيديو' : 'Watch Video'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-white/95 dark:bg-[#0F2747] border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 disabled:opacity-40 text-xs font-bold flex items-center gap-1 cursor-pointer text-[#12345A] dark:text-white"
          >
            <ChevronRight className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
            <span>{isAr ? 'السابق' : 'Previous'}</span>
          </button>

          <span className="text-xs font-mono font-bold tabular-nums text-[#12345A] dark:text-[#EAF8FF]">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-white/95 dark:bg-[#0F2747] border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 disabled:opacity-40 text-xs font-bold flex items-center gap-1 cursor-pointer text-[#12345A] dark:text-white"
          >
            <span>{isAr ? 'التالي' : 'Next'}</span>
            <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
          </button>
        </div>
      )}

      <SectionDynamicItems sectionSlug="videoLibrary" />
    </div>
  );
};
