import React, { useState } from 'react';
import {
  FlaskConical, BookOpen, Scroll, Search, Sparkles,
  FileText, Users, ArrowUpRight, Filter, BookMarked
} from 'lucide-react';
import { NavigationPage, ResearchPublication } from '../../types';
import { RESEARCH_PUBLICATIONS, CAMPUS_IMAGES } from '../../data/campusData';
import { SCHOLARS_DIRECTORY } from '../../data/hadithAndScholarsData';
import { useLanguage } from '../../context/LanguageContext';

interface ResearchCenterPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ResearchCenterPage: React.FC<ResearchCenterPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [selectedField, setSelectedField] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePaper, setActivePaper] = useState<ResearchPublication | null>(RESEARCH_PUBLICATIONS[0]);

  const fields = [
    { id: 'all', labelAr: 'جميع المجالات البحثية', labelEn: 'All Research Fields' },
    { id: 'علوم القرآن', labelAr: 'علوم القرآن والقراءات', labelEn: 'Quranic Studies' },
    { id: 'الفقه', labelAr: 'الفقه المقارن والوقف', labelEn: 'Comparative Fiqh & Waqf' },
    { id: 'السنة', labelAr: 'علوم السنة النبوية', labelEn: 'Hadith Sciences' },
    { id: 'اللغوية', labelAr: 'الدراسات اللغوية والترجمة', labelEn: 'Linguistic Studies' },
  ];

  const filteredPapers = RESEARCH_PUBLICATIONS.filter((paper) => {
    const matchesField =
      selectedField === 'all' || paper.fieldAr.includes(selectedField);
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      paper.titleAr.toLowerCase().includes(q) ||
      paper.titleEn.toLowerCase().includes(q) ||
      paper.authorAr.toLowerCase().includes(q) ||
      paper.abstractAr.toLowerCase().includes(q);
    return matchesField && matchesQuery;
  });

  return (
    <div className="space-y-10" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Architectural Research Pavilion Header */}
      <section className="relative rounded-3xl overflow-hidden bg-[#064E3B] text-[#FAF8F2] border border-[#C8A24A]/50 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-4 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#022C22]/80 border border-[#C8A24A]/50 text-xs font-bold text-[#E5C97B] self-start">
              <FlaskConical className="w-4 h-4" />
              <span>{isAr ? 'المبنى 06 · مركز البحوث والدراسات الإسلامية' : 'Building 06 · Research & Studies Center'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white leading-tight">
              {isAr
                ? 'مركز البحوث والدراسات والتحقيق العلمي للتراث الإسلامي'
                : 'Center for Islamic Research, Heritage Preservation & Academic Publications'}
            </h1>

            <p className="text-xs sm:text-sm text-[#D1E7DD] leading-relaxed max-w-2xl">
              {isAr
                ? 'صرح بحثي متخصص في الدراسات القرآنية والحديثية والفقهية المعاصرة، وإحياء التراث المخطوط، ونشر الأبحاث المحكمة لخدمة الباحثين وطلاب العلم حول العالم.'
                : 'A specialized academic wing publishing peer-reviewed studies in Quranic sciences, Hadith methodology, comparative Fiqh governance, and Islamic manuscript heritage.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('aiScholar')}
                className="px-5 py-2.5 rounded-xl bg-[#C8A24A] hover:bg-[#DFBE68] text-[#022C22] font-black text-xs sm:text-sm flex items-center gap-2 shadow cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'فتح الباحث العلمي الموثق بالكتاب والسنة' : 'Open Grounded Research Assistant'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('library')}
                className="px-4 py-2.5 rounded-xl bg-[#022C22]/80 hover:bg-[#022C22] border border-[#C8A24A]/40 text-[#FAF8F2] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#E5C97B]" />
                <span>{isAr ? 'خزانة المصادر والمخطوطات' : 'Library Reference Collection'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[240px]">
            <img
              src={CAMPUS_IMAGES.researchPavilion}
              alt={isAr ? 'مبنى مركز البحوث والدراسات' : 'Research Pavilion Architecture'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#064E3B] via-[#064E3B]/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className={`w-4 h-4 text-[#064E3B] dark:text-[#C8A24A] absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في الأبحاث والدراسات العلمية أو اسم الباحث...' : 'Search research papers, fields, or authors...'}
              className={`w-full py-2.5 rounded-xl bg-[#FAF8F2] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/35 text-xs sm:text-sm text-[#0F2920] dark:text-[#FAF8F2] ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold text-[#38554B] dark:text-[#D1E7DD] flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
            </span>
            {fields.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedField(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedField === f.id
                    ? 'bg-[#064E3B] text-white dark:bg-[#C8A24A] dark:text-[#022C22]'
                    : 'bg-[#EFECE3] dark:bg-[#022C22] text-[#0F2920] dark:text-[#D1E7DD] hover:border-[#C8A24A]'
                }`}
              >
                {isAr ? f.labelAr : f.labelEn}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Publications & Active Abstract Viewer */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-black font-amiri text-[#0F2920] dark:text-white flex items-center gap-2">
            <Scroll className="w-5 h-5 text-[#064E3B] dark:text-[#C8A24A]" />
            <span>{isAr ? 'الأبحاث والمطبوعات العلمية المحكمة' : 'Peer-Reviewed Academic Publications'}</span>
          </h2>

          {filteredPapers.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 text-center text-sm text-[#38554B] dark:text-[#D1E7DD]">
              {isAr ? 'لم يتم العثور على أبحاث مطابقة لعبارة البحث.' : 'No publications match your filter criteria.'}
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredPapers.map((paper) => {
                const isSelected = activePaper?.id === paper.id;
                return (
                  <div
                    key={paper.id}
                    onClick={() => setActivePaper(paper)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-[#064E3B] text-[#FAF8F2] border-[#C8A24A] shadow-lg'
                        : 'bg-[#FFFFFF] dark:bg-[#04382B] text-[#0F2920] dark:text-[#FAF8F2] border-[#DDD6C7] dark:border-[#C8A24A]/30 hover:border-[#C8A24A]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span
                        className={`px-2.5 py-0.5 rounded font-bold ${
                          isSelected
                            ? 'bg-[#C8A24A] text-[#022C22]'
                            : 'bg-[#EFECE3] dark:bg-[#022C22] text-[#064E3B] dark:text-[#E5C97B]'
                        }`}
                      >
                        {isAr ? paper.fieldAr : paper.fieldEn}
                      </span>
                      <span className="font-mono text-[11px] opacity-85">
                        {paper.yearHijri} · {paper.pagesCount} {isAr ? 'صفحة' : 'pp.'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black font-amiri leading-snug">
                      {isAr ? paper.titleAr : paper.titleEn}
                    </h3>

                    <p className={`text-xs ${isSelected ? 'text-[#E5C97B]' : 'text-[#047857] dark:text-[#34D399]'} font-bold`}>
                      {isAr ? `إعداد: ${paper.authorAr}` : `By: ${paper.authorEn}`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Paper Abstract & Heritage Focus */}
        <div className="lg:col-span-5 space-y-5">
          {activePaper && (
            <div className="rounded-3xl scholarly-reading-paper p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-[#DDD6C7] pb-3">
                <span className="text-xs font-bold text-[#064E3B] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#B48D35]" />
                  <span>{isAr ? 'ملخص الورقة البحثية' : 'Research Abstract'}</span>
                </span>
                <span className="text-[11px] font-mono text-[#38554B]">{activePaper.yearHijri}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-black font-amiri text-[#064E3B] leading-snug">
                {isAr ? activePaper.titleAr : activePaper.titleEn}
              </h3>

              <p className="text-xs sm:text-sm text-[#142B22] leading-relaxed">
                {isAr ? activePaper.abstractAr : activePaper.abstractEn}
              </p>

              <div className="p-3.5 rounded-xl bg-[#EFECE3] border border-[#DDD6C7] text-xs space-y-1">
                <div className="font-bold text-[#064E3B]">
                  {isAr ? activePaper.authorAr : activePaper.authorEn}
                </div>
                <div className="text-[#38554B]">
                  {isAr ? `التخصص: ${activePaper.fieldAr}` : `Discipline: ${activePaper.fieldEn}`}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('aiScholar')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#E5C97B]" />
                  <span>{isAr ? 'بحث معمق في هذا الموضوع' : 'Explore Related Sources'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Research Fellows Directory (Non-human calligraphic emblems) */}
          <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#0F2920] dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#064E3B] dark:text-[#C8A24A]" />
                <span>{isAr ? 'الهيئة العلمية والباحثون' : 'Research Fellows & Scholars'}</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('scholars')}
                className="text-xs font-bold text-[#064E3B] dark:text-[#C8A24A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isAr ? 'الدليل الكامل' : 'Full Directory'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {SCHOLARS_DIRECTORY.slice(0, 3).map((scholar) => (
                <div
                  key={scholar.id}
                  onClick={() => onNavigate('scholars')}
                  className="p-3 rounded-xl bg-[#FAF8F2] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/25 flex items-center gap-3 cursor-pointer hover:border-[#C8A24A] transition-colors"
                >
                  <img
                    src={scholar.avatarUrl}
                    alt={scholar.name}
                    className="w-10 h-10 rounded-xl object-contain shrink-0 border border-[#C8A24A]/40"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0F2920] dark:text-white truncate">{scholar.name}</div>
                    <div className="text-[11px] text-[#38554B] dark:text-[#D1E7DD] truncate">{scholar.specialization}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
