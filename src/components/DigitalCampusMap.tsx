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
            ? 'bg-gradient-to-br from-[#12345A] to-[#0A223D] text-white border-[#D4AF37] shadow-[0_18px_36px_-10px_rgba(18,52,90,0.48)] -translate-y-1'
            : 'sky-card-3d text-[#12345A] dark:text-[#EAF8FF]'
        }`}
      >
        {/* Top Architectural Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isSelected
                  ? 'bg-[#0EA5A4]/25 border-[#87CEEB]/70 text-[#87CEEB]'
                  : 'bg-[#EAF8FF] dark:bg-[#0F2747] border-[#87CEEB]/70 dark:border-[#87CEEB]/30 text-[#12345A] dark:text-[#87CEEB]'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span
                className={`text-[10px] font-mono font-bold tracking-wider uppercase block ${
                  isSelected ? 'text-[#F7E7B4]' : 'text-[#0D7A7A] dark:text-[#87CEEB]'
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
                ? 'bg-[#D4AF37] text-[#12345A]'
                : 'bg-[#EAF8FF] dark:bg-[#0B1F3A] text-[#12345A] dark:text-[#87CEEB]'
            }`}
          >
            {bldg.code}
          </span>
        </div>

        <p
          className={`text-xs leading-relaxed line-clamp-2 ${
            isSelected ? 'text-[#BCE7FB]' : 'text-[#2B547E] dark:text-[#B8DEF5]'
          }`}
        >
          {isAr ? bldg.subtitleAr : bldg.subtitleEn}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-current/10 text-xs font-bold">
          <span className={isSelected ? 'text-[#F7E7B4]' : 'text-[#0D7A7A] dark:text-[#87CEEB]'}>
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
                ? 'bg-[#D4AF37] text-[#12345A] hover:bg-[#F7E7B4]'
                : 'bg-[#12345A] text-white hover:bg-[#0EA5A4]'
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
      className="sky-glass-panel rounded-3xl overflow-hidden"
    >
      {/* Campus Map Section Header */}
      <div className="px-6 sm:px-10 py-7 bg-gradient-to-l from-[#12345A] via-[#174270] to-[#0D5D73] text-white border-b border-[#87CEEB]/35 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#87CEEB]">
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            <span>
              {isAr
                ? 'المخطط المعماري ثلاثي الأبعاد للصرح · ثمانية مبانٍ وأقسام مؤسسية'
                : '3D Interactive Campus Masterplan · Eight Institutional Wings'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-amiri text-white">
            {isAr
              ? 'استكشف مباني وأقسام مجمع النور الإسلامي العالمي'
              : 'Explore the Buildings & Departments of Al Noor Complex'}
          </h2>
          <p className="text-xs sm:text-sm text-[#CBEBFB] max-w-2xl">
            {isAr
              ? 'اختر أي مبنى من أجنحة المجمع للاطلاع على خدماته ومرافقه العلمية والخيرية والانتقال المباشر إلى بوابته التخصصية.'
              : 'Select any pavilion in the campus courtyard to preview its academic, library, research, media, or humanitarian services and enter its portal.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="px-4 py-2.5 rounded-xl bg-white/12 hover:bg-white/22 border border-[#87CEEB]/45 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Landmark className="w-4 h-4 text-[#F7E7B4]" />
            <span>{isAr ? 'عن المجمع والهوية المعمارية' : 'Campus Vision & About'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-8 lg:p-10 bg-islamic-pattern space-y-8">
        {/* Desktop Spatial Campus Courtyard Layout (Wings flanking Central Courtyard Plaza) */}
        <div className="hidden md:grid md:grid-cols-12 gap-5 items-stretch">
          {/* East / Right Courtyard Wing: Buildings 01 - 04 */}
          <div className="md:col-span-4 space-y-4">
            <div className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-[#0F2747] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 text-xs font-bold text-[#12345A] dark:text-[#87CEEB] text-center shadow-sm">
              {isAr ? 'الرواق الشرقي: الوحي والعلوم والمعرفة والعطاء' : 'East Colonnade: Revelation, Sciences, Library & Charity'}
            </div>
            <div className="space-y-3.5">
              {northWing.map(renderPavilionCard)}
            </div>
          </div>

          {/* Central Courtyard Fountain & Active Building Inspector */}
          <div className="md:col-span-4 flex flex-col justify-between rounded-3xl sky-card-3d overflow-hidden">
            {/* Architectural Visual Frame (Strictly zero humans) */}
            <div className="relative h-52 overflow-hidden border-b border-[#87CEEB]/50">
              <img
                src={
                  selectedBuilding.id === 'bldg-library'
                    ? CAMPUS_IMAGES.libraryHall
                    : selectedBuilding.id === 'bldg-research'
                    ? CAMPUS_IMAGES.researchPavilion
                    : CAMPUS_IMAGES.courtyardEntrance
                }
                alt={isAr ? selectedBuilding.nameAr : selectedBuilding.nameEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12345A] via-[#12345A]/45 to-transparent" />
              <div className="absolute bottom-3 inset-x-4 flex items-end justify-between gap-2 text-white">
                <div>
                  <span className="text-[11px] font-mono text-[#87CEEB] block">
                    {isAr ? `مبنى رقم ${selectedBuilding.code}` : `PAVILION ${selectedBuilding.code}`}
                  </span>
                  <h3 className="text-xl font-black font-amiri leading-tight">
                    {isAr ? selectedBuilding.nameAr : selectedBuilding.nameEn}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#12345A]/90 border border-[#D4AF37] flex items-center justify-center shrink-0">
                  <SelectedIcon className="w-5 h-5 text-[#F7E7B4]" />
                </div>
              </div>
            </div>

            {/* Pavilion Inspector Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-[#12345A] dark:text-[#EAF8FF] leading-relaxed font-medium">
                  {isAr ? selectedBuilding.descAr : selectedBuilding.descEn}
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-[#0D7A7A] dark:text-[#87CEEB] block">
                    {isAr ? 'مرافق وخدمات هذا المبنى:' : 'Key Pavilion Facilities:'}
                  </span>
                  <ul className="space-y-1.5">
                    {(isAr ? selectedBuilding.servicesAr : selectedBuilding.servicesEn).map((srv, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5A4] shrink-0 mt-1" />
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
                      className="px-2.5 py-1 rounded-lg bg-[#EAF8FF] dark:bg-[#0F2747] hover:bg-[#12345A] hover:text-white dark:hover:bg-[#0EA5A4] border border-[#87CEEB]/70 dark:border-[#87CEEB]/25 text-[11px] font-bold text-[#12345A] dark:text-[#EAF8FF] transition-colors cursor-pointer"
                    >
                      {isAr ? rel.labelAr : rel.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(selectedBuilding.targetPage)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#12345A] to-[#0EA5A4] hover:brightness-110 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
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
            <div className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-[#0F2747] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 text-xs font-bold text-[#12345A] dark:text-[#87CEEB] text-center shadow-sm">
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
                    ? 'sky-card-3d border-[#D4AF37]'
                    : 'bg-white/85 dark:bg-[#0F2747] border-[#87CEEB]/50 dark:border-[#87CEEB]/25'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedBuilding(bldg)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-right cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#12345A] to-[#0EA5A4] text-white flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <span className="text-[10px] font-mono font-bold text-[#0D7A7A] dark:text-[#87CEEB] block">
                        {isAr ? `مبنى ${bldg.code}` : `BLDG ${bldg.code}`}
                      </span>
                      <h3 className="text-base font-black font-amiri text-[#12345A] dark:text-white">
                        {isAr ? bldg.nameAr : bldg.nameEn}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#EAF8FF] dark:bg-[#102A4C] text-xs font-bold text-[#12345A] dark:text-[#87CEEB]">
                    {isAr ? (isOpen ? 'مفتوح' : 'استكشف') : (isOpen ? 'Open' : 'View')}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 space-y-3">
                    <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                      {isAr ? bldg.descAr : bldg.descEn}
                    </p>
                    <ul className="space-y-1">
                      {(isAr ? bldg.servicesAr : bldg.servicesEn).slice(0, 3).map((s, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-[#12345A] dark:text-[#EAF8FF]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5A4] shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => onNavigate(bldg.targetPage)}
                      className="w-full py-2.5 rounded-xl bg-[#12345A] dark:bg-[#0EA5A4] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
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
