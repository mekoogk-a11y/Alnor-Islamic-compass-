import { VideoCategory } from '../types';

export interface VideoCategoryMeta {
  id: VideoCategory;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
}

export const VIDEO_CATEGORY_LIST: VideoCategoryMeta[] = [
  {
    id: 'quran_recitations',
    labelAr: 'تلاوات القرآن الكريم',
    labelEn: 'Quran Recitations',
    descAr: 'تلاوات خاشعة بروايات القراءات المعتمدة ومقرئي المجمع',
    descEn: 'Reverent recitations by certified Qaris across authentic narrations',
  },
  {
    id: 'islamic_lectures',
    labelAr: 'المحاضرات والدروس الإسلامية',
    labelEn: 'Islamic Lectures',
    descAr: 'محاضرات علمية ودعوية مؤصلة في العقيدة والسيرة والأخلاق',
    descEn: 'Grounded scholarly lectures in Aqeedah, Seerah, and Islamic ethics',
  },
  {
    id: 'quran_memorization',
    labelAr: 'دروس تحفيظ القرآن',
    labelEn: 'Quran Memorization Lessons',
    descAr: 'حلقات تعليم التجويد ومخارج الحروف ومناهج الحفظ المتدرج',
    descEn: 'Tajweed instruction, articulation drills, and structured memorization',
  },
  {
    id: 'educational_courses',
    labelAr: 'الدورات التعليمية',
    labelEn: 'Educational Courses',
    descAr: 'مسارات أكاديمية منظمة في الفقه والحديث واللسان العربي',
    descEn: 'Structured academic courses in Fiqh, Hadith, and Arabic sciences',
  },
  {
    id: 'charity_activities',
    labelAr: 'الأنشطة الخيرية والمشاريع',
    labelEn: 'Charity & Foundation Activities',
    descAr: 'توثيق ميداني لمشاريع كفالة الأيتام وسقيا الماء والأوقاف',
    descEn: 'Field reports of orphan care, water wells, and Waqf initiatives',
  },
  {
    id: 'official_intro',
    labelAr: 'الفيديوهات التعريفية للمجمع',
    labelEn: 'Official Introductory Videos',
    descAr: 'مواد تعريفية رسمية بأجنحة ومرافق مجمع النور العالمي',
    descEn: 'Official introductions to Al-Noor Campus buildings and mission',
  },
];

export const VIDEO_CATEGORY_MAP: Record<VideoCategory, VideoCategoryMeta> = VIDEO_CATEGORY_LIST.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<VideoCategory, VideoCategoryMeta>
);

export const ALLOWED_CLIENT_EXTENSIONS = [
  '.mp4',
  '.m4v',
  '.mov',
  '.webm',
  '.mkv',
  '.mpeg',
  '.mpg',
  '.avi',
  '.3gp',
];

export const DEFAULT_MAX_VIDEO_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB

export function validateVideoFileClient(
  file: File,
  maxBytes: number = DEFAULT_MAX_VIDEO_BYTES
): { valid: true } | { valid: false; messageAr: string; messageEn: string } {
  if (!file || file.size <= 0) {
    return {
      valid: false,
      messageAr: 'ملف الفيديو المختار فارغ أو تالف.',
      messageEn: 'The selected video file is empty or unreadable.',
    };
  }

  const lower = file.name.toLowerCase();
  const dotIdx = lower.lastIndexOf('.');
  const ext = dotIdx >= 0 ? lower.slice(dotIdx) : '';

  if (!ALLOWED_CLIENT_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      messageAr: `صيغة الملف (${ext || 'غير معروفة'}) غير مدعومة. الصيغ المسموحة: MP4, MOV, WEBM, MKV, AVI.`,
      messageEn: `Unsupported video extension (${ext || 'unknown'}). Allowed: MP4, MOV, WEBM, MKV, AVI.`,
    };
  }

  if (file.type && !file.type.startsWith('video/')) {
    return {
      valid: false,
      messageAr: `نوع الملف (${file.type}) ليس ملف فيديو صالحاً.`,
      messageEn: `Invalid file MIME type (${file.type}).`,
    };
  }

  if (file.size > maxBytes) {
    const maxGb = (maxBytes / (1024 * 1024 * 1024)).toFixed(1);
    return {
      valid: false,
      messageAr: `حجم الفيديو يتجاوز الحد المسموح (${maxGb} جيجابايت).`,
      messageEn: `Video exceeds maximum allowed size (${maxGb} GB).`,
    };
  }

  return { valid: true };
}

/**
 * Computes a collision-resistant SHA-256 fingerprint over file metadata + head/tail byte slices
 * so multi-GB videos fingerprint cleanly on mobile devices without exhausting memory.
 */
export async function computeFileFingerprint(file: File): Promise<string> {
  const sampleSize = 512 * 1024;
  const headBuf = await file.slice(0, Math.min(file.size, sampleSize)).arrayBuffer();
  const tailStart = Math.max(0, file.size - sampleSize);
  const tailBuf = await file.slice(tailStart, file.size).arrayBuffer();
  const metaBytes = new TextEncoder().encode(`${file.name}|${file.size}|${file.type}|${file.lastModified}`);

  const combined = new Uint8Array(metaBytes.length + headBuf.byteLength + tailBuf.byteLength);
  combined.set(metaBytes, 0);
  combined.set(new Uint8Array(headBuf), metaBytes.length);
  combined.set(new Uint8Array(tailBuf), metaBytes.length + headBuf.byteLength);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  return `${file.name}-${file.size}-${file.lastModified}`;
}

export async function compressThumbnailToDataUrl(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('صيغة الصورة المصغرة يجب أن تكون JPEG أو PNG أو WEBP.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('حجم الصورة الأصلية كبير جداً (أقصى حد 10 ميجابايت قبل الضغط).');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('تعذر قراءة ملف الصورة المصغرة.'));
      el.src = objectUrl;
    });

    const maxW = 1280;
    const maxH = 720;
    const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
    const width = Math.max(1, Math.round(img.width * ratio));
    const height = Math.max(1, Math.round(img.height * ratio));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('متصفحك لا يدعم معالجة الصورة المصغرة.');
    }
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function formatBytes(bytes: number): string {
  const b = Math.max(0, Number(bytes || 0));
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  return `${(b / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
