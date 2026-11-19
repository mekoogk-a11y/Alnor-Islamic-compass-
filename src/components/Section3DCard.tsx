import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { PortalSectionDef } from '../data/portalSections';
import { Sky3DIcon } from './Sky3DIcon';

interface Section3DCardProps {
  section: PortalSectionDef;
  isAr: boolean;
  isRtl: boolean;
  onSelect: (section: PortalSectionDef) => void;
}

export const Section3DCard: React.FC<Section3DCardProps> = ({
  section,
  isAr,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(section)}
      className="group sky-card-3d rounded-3xl p-5 sm:p-6 text-start flex flex-col justify-between gap-4 cursor-pointer relative overflow-hidden min-h-[172px]"
    >
      {/* Subtle 3D Top Highlight Strip */}
      <div className="pointer-events-none absolute top-0 inset-x-6 h-0.5 bg-gradient-to-r from-transparent via-[#87CEEB] to-transparent opacity-70" />

      <div className="flex items-start justify-between gap-3">
        <Sky3DIcon slug={section.slug} tone={section.tone} size="md" />
        <span className="w-9 h-9 rounded-xl bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 flex items-center justify-center text-[#12345A] dark:text-[#87CEEB] group-hover:bg-[#12345A] group-hover:text-white dark:group-hover:bg-[#D4AF37] dark:group-hover:text-[#091B33] transition-colors shrink-0">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:scale-110" />
        </span>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-black font-amiri text-[#12345A] dark:text-[#EAF8FF] group-hover:text-[#0D7A7A] dark:group-hover:text-[#87CEEB] transition-colors leading-snug">
          {isAr ? section.titleAr : section.titleEn}
        </h3>
        <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed line-clamp-2">
          {isAr ? section.subtitleAr : section.subtitleEn}
        </p>
      </div>
    </button>
  );
};
