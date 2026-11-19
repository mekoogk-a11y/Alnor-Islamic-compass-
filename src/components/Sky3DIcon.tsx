import React from 'react';
import {
  BookOpen, Globe, Scroll, FileText, Library, Mic, GraduationCap,
  BookMarked, Radio, Video, Newspaper, Microscope, Users, HeartHandshake,
  Heart, Landmark, Globe2, Sparkles, MessageCircle, Compass, AudioLines,
  BrainCircuit, HelpCircle, Zap, Building2, Mail
} from 'lucide-react';
import type { Sky3DIconTone } from '../data/portalSections';

interface Sky3DIconProps {
  slug: string;
  tone?: Sky3DIconTone;
  size?: 'sm' | 'md' | 'lg';
}

const TONE_CLASSES: Record<
  Sky3DIconTone,
  { bg: string; glow: string; ring: string; iconColor: string }
> = {
  sky: {
    bg: 'from-[#87CEEB] via-[#38BDF8] to-[#0284C7]',
    glow: 'shadow-[0_12px_24px_-6px_rgba(2,132,199,0.45),inset_0_2px_2px_rgba(255,255,255,0.85),inset_0_-4px_6px_rgba(12,74,110,0.35)]',
    ring: 'border-[#EAF8FF]',
    iconColor: 'text-white drop-shadow-[0_2px_4px_rgba(18,52,90,0.45)]',
  },
  turquoise: {
    bg: 'from-[#5EEAD4] via-[#0EA5A4] to-[#0F766E]',
    glow: 'shadow-[0_12px_24px_-6px_rgba(14,165,164,0.45),inset_0_2px_2px_rgba(255,255,255,0.8),inset_0_-4px_6px_rgba(17,94,89,0.4)]',
    ring: 'border-[#E6FFFA]',
    iconColor: 'text-white drop-shadow-[0_2px_4px_rgba(12,74,70,0.45)]',
  },
  navy: {
    bg: 'from-[#2B6CB0] via-[#12345A] to-[#0A223D]',
    glow: 'shadow-[0_12px_24px_-6px_rgba(18,52,90,0.50),inset_0_2px_2px_rgba(135,206,235,0.65),inset_0_-4px_6px_rgba(5,16,32,0.55)]',
    ring: 'border-[#BCE7FB]',
    iconColor: 'text-[#EAF8FF] drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]',
  },
  gold: {
    bg: 'from-[#F7E7B4] via-[#D4AF37] to-[#9A7418]',
    glow: 'shadow-[0_12px_24px_-6px_rgba(212,175,55,0.48),inset_0_2px_2px_rgba(255,255,255,0.9),inset_0_-4px_6px_rgba(120,84,12,0.38)]',
    ring: 'border-[#FFFDF2]',
    iconColor: 'text-[#12345A] drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]',
  },
  ocean: {
    bg: 'from-[#7DD3FC] via-[#0369A1] to-[#12345A]',
    glow: 'shadow-[0_12px_24px_-6px_rgba(3,105,161,0.45),inset_0_2px_2px_rgba(255,255,255,0.8),inset_0_-4px_6px_rgba(12,35,64,0.45)]',
    ring: 'border-[#EAF8FF]',
    iconColor: 'text-white drop-shadow-[0_2px_4px_rgba(10,34,61,0.45)]',
  },
  indigo: {
    bg: 'from-[#60A5FA] via-[#1D4ED8] to-[#12345A]',
    glow: 'shadow-[0_12px_24px_-6px_rgba(29,78,216,0.42),inset_0_2px_2px_rgba(255,255,255,0.82),inset_0_-4px_6px_rgba(18,52,90,0.45)]',
    ring: 'border-[#EFF6FF]',
    iconColor: 'text-white drop-shadow-[0_2px_4px_rgba(18,52,90,0.45)]',
  },
};

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  quran: BookOpen,
  translationsReader: Globe,
  sciences: FileText,
  hadith: Scroll,
  library: Library,
  dawahLibrary: BookMarked,
  academy: GraduationCap,
  register: BookMarked,
  radio: Radio,
  videoLibrary: Video,
  mediaCenter: Newspaper,
  researchCenter: Microscope,
  scholars: Users,
  waqf: HeartHandshake,
  orphansCare: Heart,
  donations: Landmark,
  internationalRelations: Globe2,
  noorAmbassador: Sparkles,
  discoverIslam: MessageCircle,
  newMuslims: Compass,
  audioStudio: AudioLines,
  aiScholar: BrainCircuit,
  community: HelpCircle,
  apiGateway: Zap,
  about: Building2,
  contact: Mail,
};

export const Sky3DIcon: React.FC<Sky3DIconProps> = ({ slug, tone = 'sky', size = 'md' }) => {
  const style = TONE_CLASSES[tone];
  const Icon = ICON_MAP[slug] || Mic;

  const sizeClass =
    size === 'sm'
      ? 'w-11 h-11 rounded-2xl'
      : size === 'lg'
      ? 'w-16 h-16 rounded-3xl'
      : 'w-14 h-14 rounded-2xl';

  const iconSizeClass =
    size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-8 h-8' : 'w-7 h-7';

  return (
    <div
      className={`relative shrink-0 ${sizeClass} bg-gradient-to-br ${style.bg} ${style.glow} border ${style.ring} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
      aria-hidden="true"
    >
      {/* Top-Left 3D Specular Gloss Reflection */}
      <span className="pointer-events-none absolute top-1 left-1.5 right-3 h-3 rounded-full bg-white/35 blur-[1px]" />
      {/* Subtle Bottom Rim Reflection */}
      <span className="pointer-events-none absolute bottom-1 inset-x-3 h-1 rounded-full bg-white/20" />
      <Icon className={`relative z-10 ${iconSizeClass} ${style.iconColor} stroke-[2]`} />
    </div>
  );
};
