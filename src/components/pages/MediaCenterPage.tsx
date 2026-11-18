import React, { useState } from 'react';
import {
  Radio, Newspaper, Mic, Video, BookOpen, ArrowUpRight,
  Calendar, Sparkles, Filter
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { MEDIA_ITEMS, CAMPUS_IMAGES } from '../../data/campusData';
import { useLanguage } from '../../context/LanguageContext';

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
      {/* Header Banner */}
      <section className="rounded-3xl overflow-hidden bg-gradient-to-l from-[#064E3B] to-[#022C22] text-[#FAF8F2] border border-[#C8A24A]/50 shadow-xl p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#022C22] border border-[#C8A24A]/50 text-xs font-bold text-[#E5C97B]">
              <Newspaper className="w-4 h-4" />
              <span>{isAr ? 'المبنى 07 · المركز الإعلامي والنشر المؤسسي' : 'Building 07 · Media & Publications Center'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white leading-tight">
              {isAr
                ? 'المركز الإعلامي وإذاعة الحرمين والمطبوعات المعرفية'
                : 'Media, Broadcast, Educational Articles & Official Publications Center'}
            </h1>

            <p className="text-xs sm:text-sm text-[#D1E7DD] leading-relaxed max-w-2xl">
              {isAr
                ? 'البوابة الإعلامية المعتمدة لأخبار مجمع النور وبياناته المؤسسية، والمقالات الدعوية، وأرشيف الدروس الصوتية والمرئية، وبث إذاعة القرآن الكريم من مكة على مدار الساعة.'
                : 'Official communications hub covering institutional announcements, educational essays, 24/7 live Makkah Quran radio, Sudanese vocal outreach studio, and multilingual lecture archives.'}
            </p>
          </div>

          <div className="lg:col-span-4 rounded-2xl overflow-hidden border border-[#C8A24A]/40 h-44">
            <img
              src={CAMPUS_IMAGES.mosqueArch}
              alt={isAr ? 'عمارة المركز الإعلامي' : 'Islamic Campus Archway'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Live Audio & Studio Wings Quick Access */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 space-y-3 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-[#E5C97B] flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black font-amiri text-[#0F2920] dark:text-white">
              {isAr ? 'إذاعة القرآن الكريم (مباشر من مكة)' : 'Makkah Live Quran Radio 24/7'}
            </h2>
            <p className="text-xs text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
              {isAr
                ? 'بث مباشر متواصل لتلاوات الحرمين الشريفين وإذاعات التفسير والقراءات المتعددة.'
                : 'Continuous live broadcasts from the Two Holy Mosques, Tafsir streams, and certified reciters.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('radio')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{isAr ? 'تشغيل الإذاعة المباشرة' : 'Open Radio Player'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 space-y-3 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-[#E5C97B] flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black font-amiri text-[#0F2920] dark:text-white">
              {isAr ? 'استوديو الصوت الإعلاني السوداني' : 'Sudanese Vocal Announcements Studio'}
            </h2>
            <p className="text-xs text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
              {isAr
                ? 'إنتاج وإلقاء النصوص الدعوية والحماسية بالعامية السودانية الأصيلة لدعم المبادرات القرآنية والخيرية.'
                : 'Authentic Sudanese Arabic male vocal scripts and audio synthesis supporting Quranic & charity outreach.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('audioStudio')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{isAr ? 'دخول الاستوديو الصوتي' : 'Open Voice Studio'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 space-y-3 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-[#E5C97B] flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black font-amiri text-[#0F2920] dark:text-white">
              {isAr ? 'أرشيف المحاضرات الدعوية المرئية' : 'International Lectures & Media Archive'}
            </h2>
            <p className="text-xs text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
              {isAr
                ? 'سلاسل علمية وحوارات مقارنة أديان ومحاضرات مترجمة بعدة لغات لخدمة الدعوة.'
                : 'Curated international lecture playlists, debates, and multilingual educational series.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('dawahLibrary')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{isAr ? 'تصفح أرشيف المحاضرات' : 'Browse Lecture Archive'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* News, Articles & Publications Archive */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#0F2920] dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#064E3B] dark:text-[#C8A24A]" />
            <span>{isAr ? 'الأخبار والبيانات والمقالات المعرفية' : 'Institutional Announcements & Articles'}</span>
          </h2>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <Filter className="w-3.5 h-3.5 text-[#38554B] dark:text-[#C8A24A] shrink-0" />
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors whitespace-nowrap ${
                  filterType === tab.id
                    ? 'bg-[#064E3B] text-white dark:bg-[#C8A24A] dark:text-[#022C22]'
                    : 'bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 text-[#0F2920] dark:text-[#D1E7DD]'
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
              className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C8A24A] transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-[#EFECE3] dark:bg-[#022C22] text-[#064E3B] dark:text-[#E5C97B] font-bold">
                    {isAr ? item.categoryAr : item.categoryEn}
                  </span>
                  <span className="text-[11px] font-mono text-[#5C746B] dark:text-[#A3C4B8] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.dateLabel}</span>
                  </span>
                </div>

                <h3 className="text-lg font-black font-amiri text-[#0F2920] dark:text-white leading-snug">
                  {isAr ? item.titleAr : item.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
                  {isAr ? item.summaryAr : item.summaryEn}
                </p>
              </div>

              {item.targetPage && (
                <div className="pt-3 border-t border-[#DDD6C7] dark:border-[#C8A24A]/20">
                  <button
                    type="button"
                    onClick={() => onNavigate(item.targetPage!)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] dark:text-[#C8A24A] hover:underline cursor-pointer"
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
    </div>
  );
};
