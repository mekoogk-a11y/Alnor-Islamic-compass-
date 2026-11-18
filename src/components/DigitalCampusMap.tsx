import React, { useState } from 'react';
import {
  BookOpen, GraduationCap, Library, HeartHandshake, Award,
  FlaskConical, Radio, Globe2, Compass, ChevronLeft, CheckCircle2,
  Building2, ArrowUpRight, Landmark
} from 'lucide-react';
import { CampusBuilding, NavigationPage } from '../types';
import { CAMPUS_BUILDINGS, CAMPUS_IMAGES } from '../data/campusData';
import { useLanguage } from '../context/LanguageContext';

interface DigitalCampusMapProps {
  onNavigate: (page: NavigationPage) => void;
}

const BUILDING_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'bldg-quran': BookOpen,
  'bldg-sciences': GraduationCap,
  'bldg-library': Library,
  'bldg-charity': HeartHandshake,
  'bldg-academy': Award,
  'bldg-research': FlaskConical,
  'bldg-media': Radio,
  'bldg-international': Globe2,
};

export const DigitalCampusMap: React.FC<DigitalCampusMapProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding>(CAMPUS_BUILDINGS[0]);

  const northWing = CAMPUS_BUILDINGS.slice(0, 4);
  const southWing = CAMPUS_BUILDINGS.slice(4, 8);
  const SelectedIcon = BUILDING_ICONS[selectedBuilding.id] || Building2;

  const renderPavilionCard = (bldg: CampusBuilding) => {
    const Icon = BUILDING_ICONS[bldg.id] || Building2;
    const isSelected = selectedBuilding.id === bldg.id;

    return (
      <div
        key={bldg.id}
        role="button"
        tabIndex={0}
        onClick={() => setSelectedBuilding(bldg)}
        onMouseEnter={() => setSelectedBuilding(bldg)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedBuilding(bldg);
          }
        }}
        className={`group relative rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
          isSelected
            ? 'bg-[#064E3B] text-[#FAF8F2] border-[#C8A24A] shadow-[0_12px_30px_-8px_rgba(6,78,59,0.45)] -translate-y-0.5'
            : 'bg-[#FFFFFF] dark:bg-[#04382B] text-[#0F2920] dark:text-[#FAF8F2] border-[#DDD6C7] dark:border-[#C8A24A]/25 hover:border-[#C8A24A]'
        }`}
      >
        {/* Top Architectural Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isSelected
                  ? 'bg-[#022C22] border-[#C8A24A]/60 text-[#C8A24A]'
                  : 'bg-[#F3EFE4] dark:bg-[#064E3B] border-[#DDD6C7] dark:border-[#C8A24A]/30 text-[#064E3B] dark:text-[#C8A24A]'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span
                className={`text-[10px] font-mono font-bold tracking-wider uppercase block ${
                  isSelected ? 'text-[#E5C97B]' : 'text-[#8C6D23] dark:text-[#C8A24A]'
                }`}
              >
                {isAr ? `المبنى ${bldg.code} · ${bldg.wingAr}` : `BLDG ${bldg.code} · ${bldg.wingEn}`}
              </span>
              <h3 className="text-sm sm:text-base font-black font-amiri leading-snug">
                {isAr ? bldg.nameAr : bldg.nameEn}
              </h3>
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
              isSelected
                ? 'bg-[#C8A24A] text-[#022C22]'
                : 'bg-[#F3EFE4] dark:bg-[#022C22] text-[#064E3B] dark:text-[#D1E7DD]'
            }`}
          >
            {bldg.code}
          </span>
        </div>

        <p
          className={`text-xs leading-relaxed line-clamp-2 ${
            isSelected ? 'text-[#E2EFEA]' : 'text-[#38554B] dark:text-[#D1E7DD]'
          }`}
        >
          {isAr ? bldg.subtitleAr : bldg.subtitleEn}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-current/10 text-xs font-bold">
          <span className={isSelected ? 'text-[#E5C97B]' : 'text-[#064E3B] dark:text-[#C8A24A]'}>
            {isAr ? 'معاينة القسم' : 'Inspect Wing'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(bldg.targetPage);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
              isSelected
                ? 'bg-[#C8A24A] text-[#022C22] hover:bg-[#DFBE68]'
                : 'bg-[#064E3B] text-[#FAF8F2] hover:bg-[#047857]'
            }`}
          >
            <span>{isAr ? 'دخول المبنى' : 'Enter'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <section
      id="campus-map"
      aria-label={isAr ? 'الخريطة التفاعلية لمباني مجمع النور' : 'Interactive Digital Islamic Campus Map'}
      className="rounded-3xl bg-[#FFFFFF] dark:bg-[#033126] border border-[#DDD6C7] dark:border-[#C8A24A]/35 shadow-xl overflow-hidden"
    >
      {/* Campus Map Section Header */}
      <div className="px-6 sm:px-10 py-7 bg-gradient-to-l from-[#064E3B] to-[#022C22] text-[#FAF8F2] border-b border-[#C8A24A]/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E5C97B]">
            <Compass className="w-4 h-4" />
            <span>
              {isAr
                ? 'المخطط المعماري التفاعلي للصرح · ثمانية مبانٍ وأقسام مؤسسية'
                : 'Interactive Campus Masterplan · Eight Institutional Wings'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-amiri text-white">
            {isAr
              ? 'استكشف مباني وأقسام مجمع النور الإسلامي العالمي'
              : 'Explore the Buildings & Departments of Al Noor Complex'}
          </h2>
          <p className="text-xs sm:text-sm text-[#D1E7DD] max-w-2xl">
            {isAr
              ? 'اختر أي مبنى من أجنحة المجمع للاطلاع على خدماته ومرافقه العلمية والخيرية والانتقال المباشر إلى بوابته التخصصية.'
              : 'Select any pavilion in the campus courtyard to preview its academic, library, research, media, or humanitarian services and enter its portal.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="px-4 py-2.5 rounded-xl bg-[#FAF8F2]/10 hover:bg-[#FAF8F2]/20 border border-[#C8A24A]/45 text-[#FAF8F2] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Landmark className="w-4 h-4 text-[#E5C97B]" />
            <span>{isAr ? 'عن المجمع والهوية المعمارية' : 'Campus Vision & About'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-8 lg:p-10 bg-islamic-pattern space-y-8">
        {/* Desktop Spatial Campus Courtyard Layout (Wings flanking Central Courtyard Plaza) */}
        <div className="hidden md:grid md:grid-cols-12 gap-5 items-stretch">
          {/* East / Right Courtyard Wing: Buildings 01 - 04 */}
          <div className="md:col-span-4 space-y-4">
            <div className="px-3 py-1.5 rounded-xl bg-[#EFECE3] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/30 text-xs font-bold text-[#064E3B] dark:text-[#E5C97B] text-center">
              {isAr ? 'الرواق الشرقي: الوحي والعلوم والمعرفة والعطاء' : 'East Colonnade: Revelation, Sciences, Library & Charity'}
            </div>
            <div className="space-y-3.5">
              {northWing.map(renderPavilionCard)}
            </div>
          </div>

          {/* Central Courtyard Fountain & Active Building Inspector */}
          <div className="md:col-span-4 flex flex-col justify-between rounded-3xl bg-[#FAF8F2] dark:bg-[#022C22] border-2 border-[#C8A24A]/50 shadow-inner overflow-hidden">
            {/* Architectural Visual Frame (Strictly zero humans) */}
            <div className="relative h-52 overflow-hidden border-b border-[#C8A24A]/40">
              <img
                src={
                  selectedBuilding.id === 'bldg-library'
                    ? CAMPUS_IMAGES.libraryHall
                    : selectedBuilding.id === 'bldg-research'
                    ? CAMPUS_IMAGES.researchPavilion
                    : CAMPUS_IMAGES.courtyardEntrance
                }
                alt={isAr ? selectedBuilding.nameAr : selectedBuilding.nameEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022C22] via-[#022C22]/40 to-transparent" />
              <div className="absolute bottom-3 inset-x-4 flex items-end justify-between gap-2 text-white">
                <div>
                  <span className="text-[11px] font-mono text-[#E5C97B] block">
                    {isAr ? `مبنى رقم ${selectedBuilding.code}` : `PAVILION ${selectedBuilding.code}`}
                  </span>
                  <h3 className="text-xl font-black font-amiri leading-tight">
                    {isAr ? selectedBuilding.nameAr : selectedBuilding.nameEn}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#064E3B]/90 border border-[#C8A24A] flex items-center justify-center shrink-0">
                  <SelectedIcon className="w-5 h-5 text-[#E5C97B]" />
                </div>
              </div>
            </div>

            {/* Pavilion Inspector Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-[#0F2920] dark:text-[#D1E7DD] leading-relaxed font-medium">
                  {isAr ? selectedBuilding.descAr : selectedBuilding.descEn}
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-[#064E3B] dark:text-[#E5C97B] block">
                    {isAr ? 'مرافق وخدمات هذا المبنى:' : 'Key Pavilion Facilities:'}
                  </span>
                  <ul className="space-y-1.5">
                    {(isAr ? selectedBuilding.servicesAr : selectedBuilding.servicesEn).map((srv, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#38554B] dark:text-[#FAF8F2]/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399] shrink-0 mt-1" />
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Related Wing Shortcuts */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {selectedBuilding.relatedPages.map((rel) => (
                    <button
                      key={rel.page + rel.labelAr}
                      type="button"
                      onClick={() => onNavigate(rel.page)}
                      className="px-2.5 py-1 rounded-lg bg-[#EFECE3] dark:bg-[#04382B] hover:bg-[#064E3B] hover:text-white dark:hover:bg-[#C8A24A] dark:hover:text-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/30 text-[11px] font-bold text-[#064E3B] dark:text-[#FAF8F2] transition-colors cursor-pointer"
                    >
                      {isAr ? rel.labelAr : rel.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(selectedBuilding.targetPage)}
                className="w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] dark:bg-[#C8A24A] dark:hover:bg-[#DFBE68] text-[#FAF8F2] dark:text-[#022C22] font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>
                  {isAr ? `الدخول إلى ${selectedBuilding.nameAr}` : `Enter ${selectedBuilding.nameEn}`}
                </span>
                <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
              </button>
            </div>
          </div>

          {/* West / Left Courtyard Wing: Buildings 05 - 08 */}
          <div className="md:col-span-4 space-y-4">
            <div className="px-3 py-1.5 rounded-xl bg-[#EFECE3] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/30 text-xs font-bold text-[#064E3B] dark:text-[#E5C97B] text-center">
              {isAr ? 'الرواق الغربي: الأكاديمية والبحوث والإعلام والعلاقات' : 'West Colonnade: Academy, Research, Media & Relations'}
            </div>
            <div className="space-y-3.5">
              {southWing.map(renderPavilionCard)}
            </div>
          </div>
        </div>

        {/* Mobile Structured Vertical Campus Exploration (Clean Accordion-like Cards) */}
        <div className="md:hidden space-y-4">
          {CAMPUS_BUILDINGS.map((bldg) => {
            const Icon = BUILDING_ICONS[bldg.id] || Building2;
            const isOpen = selectedBuilding.id === bldg.id;

            return (
              <div
                key={bldg.id}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  isOpen
                    ? 'bg-[#FFFFFF] dark:bg-[#022C22] border-[#C8A24A] shadow-md'
                    : 'bg-[#FAF8F2] dark:bg-[#04382B] border-[#DDD6C7] dark:border-[#C8A24A]/25'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedBuilding(bldg)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-right cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-[#C8A24A] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <span className="text-[10px] font-mono font-bold text-[#8C6D23] dark:text-[#E5C97B] block">
                        {isAr ? `مبنى ${bldg.code}` : `BLDG ${bldg.code}`}
                      </span>
                      <h3 className="text-base font-black font-amiri text-[#0F2920] dark:text-white">
                        {isAr ? bldg.nameAr : bldg.nameEn}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#EFECE3] dark:bg-[#064E3B] text-xs font-bold text-[#064E3B] dark:text-[#C8A24A]">
                    {isAr ? (isOpen ? 'مفتوح' : 'استكشف') : (isOpen ? 'Open' : 'View')}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t border-[#DDD6C7] dark:border-[#C8A24A]/20 space-y-3">
                    <p className="text-xs text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
                      {isAr ? bldg.descAr : bldg.descEn}
                    </p>
                    <ul className="space-y-1">
                      {(isAr ? bldg.servicesAr : bldg.servicesEn).slice(0, 3).map((s, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-[#0F2920] dark:text-[#FAF8F2]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399] shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => onNavigate(bldg.targetPage)}
                      className="w-full py-2.5 rounded-xl bg-[#064E3B] dark:bg-[#C8A24A] text-white dark:text-[#022C22] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{isAr ? `الدخول إلى ${bldg.nameAr}` : `Enter ${bldg.nameEn}`}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
