/**
 * Self-contained geometric Islamic SVG artwork generators.
 * Replaces fragile external stock portrait/photo URLs with offline-ready,
 * fast-rendering institutional emblems and topic cards.
 */

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toSvgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

export function createScholarEmblemDataUri(
  monogram: string,
  accentColor: string = '#C8A24A',
  subtitle: string = 'AL-NOOR'
): string {
  const safeMono = escapeXml(monogram.slice(0, 3));
  const safeSub = escapeXml(subtitle.slice(0, 18));
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#022C22"/>
          <stop offset="100%" stop-color="#064E3B"/>
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="28" fill="url(#bg)"/>
      <circle cx="120" cy="112" r="78" fill="none" stroke="${accentColor}" stroke-opacity="0.28" stroke-width="2"/>
      <polygon points="120,26 146,52 184,52 184,90 210,116 184,142 184,180 146,180 120,206 94,180 56,180 56,142 30,116 56,90 56,52 94,52" fill="${accentColor}" fill-opacity="0.08" stroke="${accentColor}" stroke-opacity="0.55" stroke-width="1.5"/>
      <text x="120" y="128" text-anchor="middle" font-family="Amiri, serif" font-size="52" font-weight="bold" fill="${accentColor}">${safeMono}</text>
      <text x="120" y="216" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="2" fill="#FAF8F2">${safeSub}</text>
    </svg>
  `;
  return toSvgDataUri(svg);
}

export function createVideoPosterDataUri(
  titleAr: string,
  badge: string = 'AL-NOOR ARCHIVE',
  accentColor: string = '#C8A24A'
): string {
  const safeTitle = escapeXml(titleAr.slice(0, 32));
  const safeBadge = escapeXml(badge.slice(0, 26));
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
      <defs>
        <linearGradient id="vbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#022C22"/>
          <stop offset="55%" stop-color="#04382B"/>
          <stop offset="100%" stop-color="#064E3B"/>
        </linearGradient>
      </defs>
      <rect width="640" height="360" fill="url(#vbg)"/>
      <circle cx="520" cy="70" r="140" fill="${accentColor}" fill-opacity="0.09"/>
      <circle cx="110" cy="290" r="110" fill="#34D399" fill-opacity="0.07"/>
      <rect x="28" y="24" width="584" height="312" rx="18" fill="none" stroke="${accentColor}" stroke-opacity="0.35" stroke-width="1.5"/>
      <circle cx="320" cy="148" r="38" fill="${accentColor}" fill-opacity="0.16" stroke="${accentColor}" stroke-width="2"/>
      <polygon points="310,132 340,148 310,164" fill="${accentColor}"/>
      <text x="320" y="226" text-anchor="middle" font-family="Cairo, sans-serif" font-size="22" font-weight="bold" fill="#FAF8F2">${safeTitle}</text>
      <text x="320" y="264" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="2" fill="${accentColor}">${safeBadge}</text>
    </svg>
  `;
  return toSvgDataUri(svg);
}
