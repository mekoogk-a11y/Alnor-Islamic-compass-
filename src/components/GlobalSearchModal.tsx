import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Sparkles, ArrowRight, Filter } from 'lucide-react';
import { NavigationPage } from '../types';
import { HADITH_DATA, SCHOLARS_DIRECTORY, ACADEMY_COURSES } from '../data/hadithAndScholarsData';
import { SURAHS_INDEX } from '../data/islamicData';
import { CAMPUS_BUILDINGS, RESEARCH_PUBLICATIONS, MEDIA_ITEMS } from '../data/campusData';
import { PORTAL_SECTIONS } from '../data/portalSections';
import { useLanguage } from '../context/LanguageContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: NavigationPage, params?: any) => void;
}

type FilterCategory = 'all' | 'campus' | 'quran' | 'hadith' | 'dawah' | 'academy' | 'scholars' | 'orphans';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<FilterCategory>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.trim().toLowerCase();

    const matchedItems: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: FilterCategory;
      categoryLabel: string;
      page: NavigationPage;
      payload?: any;
    }> = [];

    // 0. Search Portal 3D Sections
    if (category === 'all' || category === 'campus') {
      PORTAL_SECTIONS.forEach((sec) => {
        if (
          sec.titleAr.toLowerCase().includes(term) ||
          sec.titleEn.toLowerCase().includes(term) ||
          sec.subtitleAr.toLowerCase().includes(term) ||
          sec.subtitleEn.toLowerCase().includes(term)
        ) {
          matchedItems.push({
            id: `portal-${sec.slug}`,
            title: isAr ? sec.titleAr : sec.titleEn,
            subtitle: isAr ? sec.subtitleAr : sec.subtitleEn,
            category: 'campus',
            categoryLabel: isAr ? 'أقسام المجمع' : 'Complex Section',
            page: sec.page,
          });
        }
      });
    }

    // 1. Search Campus Buildings, Research, Media, International Relations & Contact
    if (category === 'all' || category === 'campus') {
      CAMPUS_BUILDINGS.forEach((b) => {
        if (
          b.nameAr.includes(term) ||
          b.nameEn.toLowerCase().includes(term) ||
          b.subtitleAr.includes(term) ||
          b.descAr.includes(term) ||
          b.code.includes(term)
        ) {
          matchedItems.push({
            id: b.id,
            title: isAr ? `مبنى ${b.code} · ${b.nameAr}` : `Building ${b.code} · ${b.nameEn}`,
            subtitle: isAr ? b.subtitleAr : b.subtitleEn,
            category: 'campus',
            categoryLabel: isAr ? 'مباني المجمع' : 'Campus Wing',
            page: b.targetPage,
          });
        }
      });

      RESEARCH_PUBLICATIONS.forEach((pub) => {
        if (
          pub.titleAr.includes(term) ||
          pub.titleEn.toLowerCase().includes(term) ||
          pub.fieldAr.includes(term) ||
          pub.abstractAr.includes(term)
        ) {
          matchedItems.push({
            id: pub.id,
            title: isAr ? pub.titleAr : pub.titleEn,
            subtitle: `${isAr ? pub.fieldAr : pub.fieldEn} • ${isAr ? pub.authorAr : pub.authorEn}`,
            category: 'campus',
            categoryLabel: isAr ? 'مركز البحوث' : 'Research Center',
            page: 'researchCenter',
          });
        }
      });

      MEDIA_ITEMS.forEach((med) => {
        if (med.titleAr.includes(term) || med.titleEn.toLowerCase().includes(term) || med.summaryAr.includes(term)) {
          matchedItems.push({
            id: med.id,
            title: isAr ? med.titleAr : med.titleEn,
            subtitle: isAr ? med.summaryAr : med.summaryEn,
            category: 'campus',
            categoryLabel: isAr ? 'المركز الإعلامي' : 'Media Center',
            page: 'mediaCenter',
          });
        }
      });
    }

    // 2. Search Quran Surahs & Translations
    if (category === 'all' || category === 'quran') {
      SURAHS_INDEX.forEach((surah) => {
        if (
          surah.name.includes(term) ||
          surah.englishName.toLowerCase().includes(term) ||
          surah.number.toString() === term
        ) {
          matchedItems.push({
            id: `quran-${surah.number}`,
            title: `${surah.name} (${surah.englishName})`,
            subtitle: `عدد الآيات: ${surah.numberOfAyahs} • نزلت في ${surah.revelationType}`,
            category: 'quran',
            categoryLabel: isAr ? 'مجمع القرآن' : 'Quran Complex',
            page: 'quran',
            payload: { surahNumber: surah.number },
          });
        }
      });
    }

    // 3. Search Hadith
    if (category === 'all' || category === 'hadith') {
      HADITH_DATA.forEach((h) => {
        if (
          h.arabicText.includes(term) ||
          h.translationEn.toLowerCase().includes(term) ||
          h.narrator.includes(term) ||
          h.bookName.includes(term) ||
          h.chapter.includes(term)
        ) {
          matchedItems.push({
            id: `hadith-${h.id}`,
            title: `${h.bookName} - حديث رقم ${h.hadithNumber}`,
            subtitle: `${h.arabicText.slice(0, 85)}... [درجة الصحة: ${h.grade}]`,
            category: 'hadith',
            categoryLabel: 'السنة النبوية',
            page: 'hadith',
            payload: { hadithId: h.id },
          });
        }
      });
    }

    // 4. Search Dawah Library & Reverts
    if (category === 'all' || category === 'dawah') {
      const dawahEntries = [
        { id: 'dawah-deedat', title: 'مناظرات ومحاضرات الشيخ أحمد ديدات', desc: 'القرآن معجزة المعجزات، وحوار الأديان', page: 'dawahLibrary' as NavigationPage },
        { id: 'dawah-naik', title: 'أبحاث الدكتور ذاكر نايك (Zakir Naik)', desc: 'القرآن والعلم الحديث وتفنيد الشبهات بلغة علمية', page: 'dawahLibrary' as NavigationPage },
        { id: 'dawah-discover', title: 'مركز اسأل عن الإسلام والرد على الشبهات', desc: 'إجابات موثقة عن حقيقة التوحيد، نبوة محمد ﷺ، والرحمة في الإسلام', page: 'discoverIslam' as NavigationPage },
        { id: 'dawah-reverts', title: 'بوابة المهتدين الجدد (New Muslims)', desc: 'برنامج رعاية المهتدين، خطوات الوضوء والصلاة، والمرشدين', page: 'newMuslims' as NavigationPage },
        { id: 'dawah-ambassador', title: 'سفير النور العالمي (Noor Ambassador)', desc: 'بطاقات دعوية عالمية بلغات متعددة مجهزة للنشر والتوزيع', page: 'noorAmbassador' as NavigationPage },
      ];

      dawahEntries.forEach((d) => {
        if (d.title.includes(term) || d.desc.includes(term)) {
          matchedItems.push({
            id: d.id,
            title: d.title,
            subtitle: d.desc,
            category: 'dawah',
            categoryLabel: 'المكتبة الدعوية',
            page: d.page,
          });
        }
      });
    }

    // 5. Search Academy Courses
    if (category === 'all' || category === 'academy') {
      ACADEMY_COURSES.forEach((c) => {
        if (c.title.includes(term) || c.description.includes(term) || c.instructor.includes(term)) {
          matchedItems.push({
            id: `course-${c.id}`,
            title: c.title,
            subtitle: `${c.instructor} • المستوى: ${c.level} • المدة: ${c.duration}`,
            category: 'academy',
            categoryLabel: 'الأكاديمية',
            page: 'academy',
            payload: { courseId: c.id },
          });
        }
      });
    }

    // 6. Search Scholars
    if (category === 'all' || category === 'scholars') {
      SCHOLARS_DIRECTORY.forEach((s) => {
        if (s.name.includes(term) || s.specialization.includes(term) || s.title.includes(term)) {
          matchedItems.push({
            id: `scholar-${s.id}`,
            title: s.name,
            subtitle: `${s.title} • ${s.specialization} (${s.country})`,
            category: 'scholars',
            categoryLabel: 'هيئة العلماء',
            page: 'scholars',
            payload: { scholarId: s.id },
          });
        }
      });
    }

    // 7. Search Orphans & Charity
    if (category === 'all' || category === 'orphans') {
      if (
        term.includes('يتيم') ||
        term.includes('أيتام') ||
        term.includes('كفالة') ||
        term.includes('تبرع') ||
        term.includes('1727654') ||
        term.includes('بنك') ||
        term.includes('خرطوم') ||
        term.includes('وقف') ||
        term.includes('خيري')
      ) {
        matchedItems.push({
          id: 'orphans-sponsorship-portal',
          title: 'كفالة الأيتام والرعاية الشاملة (بنك الخرطوم 1727654)',
          subtitle: 'بوابة التسجيل والتتبع الموثق بإشراف الشيخ الهادي سالم - مدير مجمع النور',
          category: 'orphans',
          categoryLabel: 'كفالة الأيتام',
          page: 'orphansCare',
        });
        matchedItems.push({
          id: 'waqf-shares',
          title: 'المركز الخيري والسهم الوقفي لمجمع النور',
          subtitle: 'مشاريع كفالة الحلقات، سقيا الماء، وحاسبة الزكاة الشرعية',
          category: 'orphans',
          categoryLabel: 'المركز الخيري',
          page: 'waqf',
        });
      }
    }

    return matchedItems.slice(0, 15);
  }, [searchTerm, category, isAr]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-24 px-4 bg-[#12345A]/65 backdrop-blur-md">
      <div
        className={`w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#0B1F3A] border-2 border-[#87CEEB] dark:border-[#87CEEB]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] ${isRtl ? 'text-right' : 'text-left'}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/25 flex items-center gap-3 bg-[#EAF8FF] dark:bg-[#0F2747]">
          <Search className="w-5 h-5 text-[#0EA5A4] dark:text-[#87CEEB] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث في أقسام المجمع، القرآن، السنة، الأبحاث، العلماء، والمشاريع الخيرية...'
                : 'Search complex sections, Quran, Hadith, research, scholars...'
            }
            className="w-full bg-transparent border-0 text-[#12345A] dark:text-white placeholder-[#4A7298] dark:placeholder-[#84B4D6] text-sm sm:text-base focus:outline-none focus:ring-0"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-[#2B547E] dark:text-[#B8DEF5] hover:text-[#12345A] dark:hover:text-white transition cursor-pointer"
              title={isAr ? 'مسح النص' : 'Clear'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs rounded-lg border border-[#87CEEB] dark:border-[#87CEEB]/35 text-[#12345A] dark:text-[#EAF8FF] hover:bg-white dark:hover:bg-[#133158] transition cursor-pointer font-bold"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 p-3 px-5 border-b border-[#87CEEB]/30 dark:border-[#87CEEB]/20 overflow-x-auto text-xs bg-[#EAF8FF]/60 dark:bg-[#0B1F3A] no-scrollbar">
          <span className="text-[#2B547E] dark:text-[#B8DEF5] flex items-center gap-1 shrink-0 font-bold">
            <Filter className="w-3.5 h-3.5" /> {isAr ? 'الفرز:' : 'Filter:'}
          </span>
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'campus', labelAr: 'الأقسام والبحوث', labelEn: 'Sections & Research' },
            { id: 'quran', labelAr: 'القرآن الكريم', labelEn: 'Quran' },
            { id: 'hadith', labelAr: 'السنة النبوية', labelEn: 'Hadith' },
            { id: 'dawah', labelAr: 'الدعوة', labelEn: 'Dawah' },
            { id: 'academy', labelAr: 'الأكاديمية', labelEn: 'Academy' },
            { id: 'scholars', labelAr: 'العلماء', labelEn: 'Scholars' },
            { id: 'orphans', labelAr: 'الأيتام والوقف', labelEn: 'Charity & Waqf' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id as FilterCategory)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap transition font-bold cursor-pointer ${
                category === tab.id
                  ? 'bg-[#12345A] text-white dark:bg-[#87CEEB] dark:text-[#091B33]'
                  : 'bg-white dark:bg-[#102A4C] text-[#12345A] dark:text-[#EAF8FF] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 hover:bg-[#EAF8FF]'
              }`}
            >
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 divide-y divide-[#87CEEB]/25 dark:divide-[#87CEEB]/15 max-h-[50vh]">
          {searchTerm.trim() === '' ? (
            <div className="p-8 text-center text-[#2B547E] dark:text-[#B8DEF5] space-y-3">
              <Sparkles className="w-8 h-8 text-[#0EA5A4] mx-auto" />
              <p className="text-sm font-bold text-[#12345A] dark:text-white">
                {isAr ? 'محرك البحث المركزي لمجمع النور الإسلامي العالمي' : 'Central Al-Noor Complex Search'}
              </p>
              <p className="text-xs text-[#4A7298] dark:text-[#84B4D6]">
                {isAr
                  ? 'اكتب اسم قسم، أو سورة، أو حديث، أو دورة علمية، أو موضوع خيري'
                  : 'Type a section, Surah, Hadith, research paper, or service'}
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs">
                {['القرآن الكريم', 'مكتبة الفيديوهات', 'كفالة الأيتام', 'الأكاديمية', 'إذاعة مكة'].map((suggest) => (
                  <button
                    key={suggest}
                    type="button"
                    onClick={() => setSearchTerm(suggest)}
                    className="px-2.5 py-1 bg-[#EAF8FF] dark:bg-[#102A4C] hover:bg-[#12345A] hover:text-white text-[#12345A] dark:text-[#EAF8FF] rounded-lg border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 transition cursor-pointer font-semibold"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-[#2B547E] dark:text-[#B8DEF5] space-y-2">
              <p className="text-sm font-bold">
                {isAr ? `لم يتم العثور على نتائج تطابق: "${searchTerm}"` : `No matching results for "${searchTerm}"`}
              </p>
              <p className="text-xs text-[#4A7298] dark:text-[#84B4D6]">
                {isAr ? 'جرّب البحث بكلمات أخرى أو تغيير تصنيف الفرز.' : 'Try different keywords or clear the filter.'}
              </p>
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.page, item.payload);
                  onClose();
                }}
                className="w-full text-start p-3 rounded-2xl hover:bg-[#EAF8FF] dark:hover:bg-[#102A4C] border border-transparent hover:border-[#87CEEB]/60 transition flex items-start justify-between gap-3 group cursor-pointer"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-lg font-bold bg-[#12345A] text-[#87CEEB] dark:bg-[#0EA5A4] dark:text-white">
                      {item.categoryLabel}
                    </span>
                    <h4 className="text-sm font-bold text-[#12345A] dark:text-white group-hover:text-[#0EA5A4] transition truncate">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
                <ArrowRight className={`w-4 h-4 text-[#4A7298] group-hover:text-[#0EA5A4] transition shrink-0 mt-1 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            ))
          )}
        </div>

        {/* Footer Shortcut Info */}
        <div className="p-3 bg-[#EAF8FF] dark:bg-[#0F2747] border-t border-[#87CEEB]/40 dark:border-[#87CEEB]/25 flex items-center justify-between text-[11px] text-[#2B547E] dark:text-[#B8DEF5] px-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#0B1F3A] border border-[#87CEEB]/60 rounded font-mono text-[10px]">
                ESC
              </kbd>
              <span>{isAr ? 'للإغلاق' : 'Close'}</span>
            </span>
          </div>
          <span className="text-[#12345A] dark:text-[#87CEEB] font-bold">
            {isAr ? 'مجمع النور الإسلامي العالمي' : 'Al Noor Global Complex'}
          </span>
        </div>
      </div>
    </div>
  );
};
