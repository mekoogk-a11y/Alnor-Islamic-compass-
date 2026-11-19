import React from 'react';
import { OFFICIAL_COMPLEX_LOGO } from '../data/islamicData';

interface IslamicGeometric3DProps {
  className?: string;
}

/**
 * 3D Floating Islamic Geometric Star (Rub el Hizb) & Sky-Blue Medallion
 * Crafted cleanly in vector SVG with layered gradients, inner light, and gentle float animation.
 */
export const IslamicGeometric3D: React.FC<IslamicGeometric3DProps> = ({ className = '' }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
    >
      {/* Soft Sky-Blue & Turquoise Ambient Halo */}
      <div className="absolute w-64 h-64 sm:w-76 sm:h-76 rounded-full bg-gradient-to-tr from-[#87CEEB]/55 via-[#0EA5A4]/25 to-[#D4AF37]/30 blur-2xl animate-pulse pointer-events-none" />

      {/* Floating 3D Geometric SVG Structure */}
      <div className="relative animate-float-slow drop-shadow-[0_26px_38px_rgba(18,52,90,0.34)]">
        <svg
          viewBox="0 0 260 260"
          className="w-56 h-56 sm:w-72 sm:h-72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skyFrameGold" x1="20" y1="20" x2="240" y2="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF7D6" />
              <stop offset="40%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#9A7418" />
            </linearGradient>
            <linearGradient id="skyGlassFace" x1="40" y1="30" x2="220" y2="230" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.96" />
              <stop offset="45%" stopColor="#EAF8FF" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#87CEEB" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="navyInnerCore" x1="65" y1="65" x2="195" y2="195" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E4E84" />
              <stop offset="55%" stopColor="#12345A" />
              <stop offset="100%" stopColor="#091B33" />
            </linearGradient>
            <linearGradient id="turquoiseRing" x1="50" y1="50" x2="210" y2="210" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5EEAD4" />
              <stop offset="55%" stopColor="#0EA5A4" />
              <stop offset="100%" stopColor="#0F766E" />
            </linearGradient>
          </defs>

          {/* Outer Celestial Orbit Ring */}
          <circle
            cx="130"
            cy="130"
            r="118"
            stroke="url(#skyFrameGold)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            opacity="0.7"
          />

          {/* 3D Shadow Layer Under Star */}
          <rect
            x="50"
            y="54"
            width="160"
            height="160"
            rx="18"
            fill="#12345A"
            opacity="0.22"
            transform="rotate(45 130 134)"
          />

          {/* Rub el Hizb Square A (Rotated 0deg) */}
          <rect
            x="50"
            y="50"
            width="160"
            height="160"
            rx="16"
            fill="url(#skyGlassFace)"
            stroke="url(#skyFrameGold)"
            strokeWidth="3"
          />

          {/* Rub el Hizb Square B (Rotated 45deg) */}
          <rect
            x="50"
            y="50"
            width="160"
            height="160"
            rx="16"
            fill="url(#skyGlassFace)"
            stroke="url(#skyFrameGold)"
            strokeWidth="3"
            transform="rotate(45 130 130)"
          />

          {/* Inner Turquoise Architectural Medallion Ring */}
          <circle
            cx="130"
            cy="130"
            r="68"
            fill="url(#turquoiseRing)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />

          {/* Deep Navy Recessed Core */}
          <circle
            cx="130"
            cy="130"
            r="56"
            fill="url(#navyInnerCore)"
            stroke="url(#skyFrameGold)"
            strokeWidth="2.5"
          />

          {/* Specular Dome Highlight */}
          <ellipse cx="114" cy="96" rx="26" ry="12" fill="#FFFFFF" opacity="0.16" />
        </svg>

        {/* Official Complex Crest Suspended in Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 border-2 border-[#D4AF37] p-2 shadow-[0_6px_22px_rgba(14,165,164,0.35)] flex items-center justify-center">
            <img
              src={OFFICIAL_COMPLEX_LOGO}
              alt="شعار مجمع النور الإسلامي العالمي"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
