import React, { useState } from 'react';
import {
  FlaskConical, BookOpen, Scroll, Search, Sparkles,
  FileText, Users, ArrowUpRight, Filter
} from 'lucide-react';
import { NavigationPage, ResearchPublication } from '../../types';
import { RESEARCH_PUBLICATIONS, CAMPUS_IMAGES } from '../../data/campusData';
import { SCHOLARS_DIRECTORY } from '../../data/hadithAndScholarsData';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

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
      {/* Sky-Blue 3D Architectural Research Pavilion Header */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] text-white border border-[#87CEEB]/55 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-4 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <Sky3DIcon slug="researchCenter" tone="navy" size="md" />
              <span className="text-xs font-bold text-[#87CEEB] flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-[#F7E7B4]" />
                <span>{isAr ? 'المبنى 06 · مركز البحوث والدراسات الإسلامية' : 'Building 06 · Research & Studies Center'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white leading-tight">
              {isAr
                ? 'مركز البحوث والدراسات والتحقيق العلمي للتراث الإسلامي'
                : 'Center for Islamic Research, Heritage Preservation & Academic Publications'}
            </h1>

            <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed max-w-2xl">
              {isAr
                ? 'صرح بحثي متخصص في الدراسات القرآنية والحديثية والفقهية المعاصرة، وإحياء التراث المخطوط، ونشر الأبحاث المحكمة لخدمة الباحثين وطلاب العلم حول العالم.'
                : 'A specialized academic wing publishing peer-reviewed studies in Quranic sciences, Hadith methodology, comparative Fiqh governance, and Islamic manuscript heritage.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('aiScholar')}
                className="px-5 py-2.5 rounded-2xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] font-black text-xs sm:text-sm flex items-center gap-2 shadow cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'فتح الباحث العلمي الموثق بالكتاب والسنة' : 'Open Grounded Research Assistant'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('library')}
                className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-[#87CEEB]/50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#F7E7B4]" />
                <span>{isAr ? 'خزانة المصادر والمخطوطات' : 'Library Reference Collection'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[240px]">
            <img
              src={CAMPUS_IMAGES.researchPavilion}
              alt={isAr ? 'مبنى مركز البحوث والدراسات' : 'Research Pavilion Architecture'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#12345A] via-[#12345A]/25 to-transparent" />
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sky-card-3d rounded-3xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className={`w-4 h-4 text-[#0EA5A4] absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في الأبحاث والدراسات العلمية أو اسم الباحث...' : 'Search research papers, fields, or authors...'}
              className={`w-full py-2.5 rounded-xl bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 text-xs sm:text-sm text-[#12345A] dark:text-[#EAF8FF] ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold text-[#0EA5A4] flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
            </span>
            {fields.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedField(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedField === f.id
                    ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4]'
                    : 'bg-[#EAF8FF] dark:bg-[#0F2747] text-[#12345A] dark:text-[#B8DEF5] border border-[#87CEEB]/45 hover:border-[#0EA5A4]'
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
          <h2 className="text-xl font-black font-amiri text-[#12345A] dark:text-white flex items-center gap-2">
            <Scroll className="w-5 h-5 text-[#0EA5A4]" />
            <span>{isAr ? 'الأبحاث والمطبوعات العلمية المحكمة' : 'Peer-Reviewed Academic Publications'}</span>
          </h2>

          {filteredPapers.length === 0 ? (
            <div className="sky-card-3d p-8 rounded-3xl text-center text-sm text-[#2B547E] dark:text-[#B8DEF5]">
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
                    className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#12345A] to-[#0E3F66] text-white border-[#D4AF37] shadow-lg'
                        : 'sky-card-3d text-[#12345A] dark:text-[#EAF8FF]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span
                        className={`font-bold ${
                          isSelected
                            ? 'text-[#F7E7B4]'
                            : 'text-[#0D7A7A] dark:text-[#87CEEB]'
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

                    <p className={`text-xs ${isSelected ? 'text-[#87CEEB]' : 'text-[#2B547E] dark:text-[#B8DEF5]'} font-bold`}>
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
              <div className="flex items-center justify-between border-b border-[#87CEEB]/50 pb-3">
                <span className="text-xs font-bold text-[#12345A] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#0EA5A4]" />
                  <span>{isAr ? 'ملخص الورقة البحثية' : 'Research Abstract'}</span>
                </span>
                <span className="text-[11px] font-mono text-[#2B547E]">{activePaper.yearHijri}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-black font-amiri text-[#12345A] leading-snug">
                {isAr ? activePaper.titleAr : activePaper.titleEn}
              </h3>

              <p className="text-xs sm:text-sm text-[#12345A] leading-relaxed">
                {isAr ? activePaper.abstractAr : activePaper.abstractEn}
              </p>

              <div className="p-3.5 rounded-2xl bg-[#EAF8FF] border border-[#87CEEB]/50 text-xs space-y-1">
                <div className="font-bold text-[#12345A]">
                  {isAr ? activePaper.authorAr : activePaper.authorEn}
                </div>
                <div className="text-[#2B547E]">
                  {isAr ? `التخصص: ${activePaper.fieldAr}` : `Discipline: ${activePaper.fieldEn}`}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('aiScholar')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#F7E7B4]" />
                  <span>{isAr ? 'بحث معمق في هذا الموضوع' : 'Explore Related Sources'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Research Fellows Directory */}
          <div className="sky-card-3d rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#12345A] dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0EA5A4]" />
                <span>{isAr ? 'الهيئة العلمية والباحثون' : 'Research Fellows & Scholars'}</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('scholars')}
                className="text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB] hover:underline flex items-center gap-1 cursor-pointer"
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
                  className="p-3 rounded-2xl bg-[#EAF8FF]/85 dark:bg-[#0F2747]/90 border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 flex items-center gap-3 cursor-pointer hover:border-[#0EA5A4] transition-colors"
                >
                  <img
                    src={scholar.avatarUrl}
                    alt={scholar.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-contain shrink-0 border border-[#D4AF37]/50 bg-white"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#12345A] dark:text-white truncate">{scholar.name}</div>
                    <div className="text-[11px] text-[#4A7298] dark:text-[#B8DEF5] truncate">{scholar.specialization}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDynamicItems sectionSlug="researchCenter" />
    </div>
  );
};
