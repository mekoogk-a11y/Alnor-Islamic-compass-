import React, { useState } from 'react';
import {
  Radio, Newspaper, Mic, Video, BookOpen, ArrowUpRight,
  Calendar, Sparkles, Filter
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { MEDIA_ITEMS, CAMPUS_IMAGES } from '../../data/campusData';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface MediaCenterPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const MediaCenterPage: React.FC<MediaCenterPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const [filterType, setFilterType] = useState<'all' | 'announcement' | 'article' | 'lecture' | 'publication'>('all');

  const filteredItems = MEDIA_ITEMS.filter(
    (item) => filterType === 'all' || item.type === filterType
  );

  return (
    <div className="space-y-10" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sky-Blue 3D Header Banner */}
      <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] text-white border border-[#87CEEB]/55 shadow-xl p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <Sky3DIcon slug="mediaCenter" tone="ocean" size="md" />
              <span className="text-xs font-bold text-[#87CEEB] flex items-center gap-1.5">
                <Newspaper className="w-4 h-4 text-[#F7E7B4]" />
                <span>{isAr ? 'المبنى 07 · المركز الإعلامي والنشر المؤسسي' : 'Building 07 · Media & Publications Center'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white leading-tight">
              {isAr
                ? 'المركز الإعلامي وإذاعة الحرمين والمطبوعات المعرفية'
                : 'Media, Broadcast, Educational Articles & Official Publications Center'}
            </h1>

            <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed max-w-2xl">
              {isAr
                ? 'البوابة الإعلامية المعتمدة لأخبار مجمع النور وبياناته المؤسسية، والمقالات الدعوية، وأرشيف الدروس الصوتية والمرئية، وبث إذاعة القرآن الكريم من مكة على مدار الساعة.'
                : 'Official communications hub covering institutional announcements, educational essays, 24/7 live Makkah Quran radio, Sudanese vocal outreach studio, and multilingual lecture archives.'}
            </p>
          </div>

          <div className="lg:col-span-4 rounded-2xl overflow-hidden border border-[#87CEEB]/50 h-44 shadow-lg">
            <img
              src={CAMPUS_IMAGES.mosqueArch}
              alt={isAr ? 'عمارة المركز الإعلامي' : 'Islamic Campus Archway'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Live Audio & Studio Wings Quick Access */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="sky-card-3d p-6 rounded-3xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5EEAD4] to-[#0EA5A4] text-[#12345A] flex items-center justify-center shadow-sm">
              <Radio className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black font-amiri text-[#12345A] dark:text-white">
              {isAr ? 'إذاعة القرآن الكريم (مباشر من مكة)' : 'Makkah Live Quran Radio 24/7'}
            </h2>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
              {isAr
                ? 'بث مباشر متواصل لتلاوات الحرمين الشريفين وإذاعات التفسير والقراءات المتعددة.'
                : 'Continuous live broadcasts from the Two Holy Mosques, Tafsir streams, and certified reciters.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('radio')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>{isAr ? 'تشغيل الإذاعة المباشرة' : 'Open Radio Player'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="sky-card-3d p-6 rounded-3xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F7E7B4] to-[#D4AF37] text-[#12345A] flex items-center justify-center shadow-sm">
              <Mic className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black font-amiri text-[#12345A] dark:text-white">
              {isAr ? 'استوديو الصوت الإعلاني السوداني' : 'Sudanese Vocal Announcements Studio'}
            </h2>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
              {isAr
                ? 'إنتاج وإلقاء النصوص الدعوية والحماسية بالعامية السودانية الأصيلة لدعم المبادرات القرآنية والخيرية.'
                : 'Authentic Sudanese Arabic male vocal scripts and audio synthesis supporting Quranic & charity outreach.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('audioStudio')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>{isAr ? 'دخول الاستوديو الصوتي' : 'Open Voice Studio'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="sky-card-3d p-6 rounded-3xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#87CEEB] to-[#0284C7] text-white flex items-center justify-center shadow-sm">
              <Video className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black font-amiri text-[#12345A] dark:text-white">
              {isAr ? 'أرشيف المحاضرات الدعوية المرئية' : 'International Lectures & Media Archive'}
            </h2>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
              {isAr
                ? 'سلاسل علمية وحوارات مقارنة أديان ومحاضرات مترجمة بعدة لغات لخدمة الدعوة.'
                : 'Curated international lecture playlists, debates, and multilingual educational series.'}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onNavigate('videoLibrary')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>{isAr ? 'فتح المكتبة المرئية الرسمية (HLS)' : 'Open Official Video Library'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dawahLibrary')}
              className="w-full py-2 px-4 rounded-xl bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/55 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-[#87CEEB] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:border-[#0EA5A4] transition-colors"
            >
              <span>{isAr ? 'أرشيف الدعوة والمناظرات' : 'Browse Dawah Archive'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* News, Articles & Publications Archive */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#0EA5A4]" />
            <span>{isAr ? 'الأخبار والبيانات والمقالات المعرفية' : 'Institutional Announcements & Articles'}</span>
          </h2>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <Filter className="w-3.5 h-3.5 text-[#0EA5A4] shrink-0" />
            {[
              { id: 'all', ar: 'الكل', en: 'All' },
              { id: 'announcement', ar: 'البيانات', en: 'Announcements' },
              { id: 'article', ar: 'المقالات', en: 'Articles' },
              { id: 'lecture', ar: 'الصوتيات', en: 'Audio' },
              { id: 'publication', ar: 'المطبوعات', en: 'Publications' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors whitespace-nowrap ${
                  filterType === tab.id
                    ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4]'
                    : 'bg-white/90 dark:bg-[#0F2747] border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-[#B8DEF5]'
                }`}
              >
                {isAr ? tab.ar : tab.en}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="sky-card-3d p-6 rounded-3xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#0D7A7A] dark:text-[#87CEEB] font-bold">
                    {isAr ? item.categoryAr : item.categoryEn}
                  </span>
                  <span className="text-[11px] font-mono text-[#4A7298] dark:text-[#B8DEF5] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.dateLabel}</span>
                  </span>
                </div>

                <h3 className="text-lg font-black font-amiri text-[#12345A] dark:text-white leading-snug">
                  {isAr ? item.titleAr : item.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                  {isAr ? item.summaryAr : item.summaryEn}
                </p>
              </div>

              {item.targetPage && (
                <div className="pt-3 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20">
                  <button
                    type="button"
                    onClick={() => onNavigate(item.targetPage!)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB] hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? 'الانتقال إلى القسم المرتبط' : 'Explore Related Section'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <SectionDynamicItems sectionSlug="mediaCenter" />
    </div>
  );
};
