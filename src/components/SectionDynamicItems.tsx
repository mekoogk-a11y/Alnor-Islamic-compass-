import React, { useEffect, useState } from 'react';
import { ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface DynamicSectionItem {
  id: number;
  section: string;
  title: string;
  body: string;
  url: string;
  createdAt: string;
}

interface SectionDynamicItemsProps {
  sectionSlug: string;
  headingAr?: string;
  headingEn?: string;
}

export const SectionDynamicItems: React.FC<SectionDynamicItemsProps> = ({
  sectionSlug,
  headingAr = 'إصدارات ومواد منشورة من الإدارة في هذا القسم',
  headingEn = 'Published Resources & Announcements for This Section',
}) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [items, setItems] = useState<DynamicSectionItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/v1/sections/${encodeURIComponent(sectionSlug)}/items`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json?.success && Array.isArray(json.data)) {
          setItems(json.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [sectionSlug]);

  if (!loaded || items.length === 0) return null;

  return (
    <section className="sky-card-3d rounded-3xl p-5 sm:p-7 space-y-4">
      <div className="flex items-center justify-between gap-2 border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-3">
        <div className="flex items-center gap-2 text-[#12345A] dark:text-[#EAF8FF]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#0EA5A4] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-black font-amiri">
            {isAr ? headingAr : headingEn}
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
          {items.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl bg-[#EAF8FF]/85 dark:bg-[#0F2747]/90 border border-[#87CEEB]/55 dark:border-[#87CEEB]/25 p-4 flex flex-col justify-between gap-2.5"
          >
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-[#0EA5A4] shrink-0 mt-1" />
                <h4 className="text-sm font-black text-[#12345A] dark:text-white leading-snug">
                  {item.title}
                </h4>
              </div>
              {item.body && (
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed whitespace-pre-line">
                  {item.body}
                </p>
              )}
            </div>

            {item.url && (
              <div className="pt-1 flex justify-end">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold transition-colors"
                >
                  <span>{isAr ? 'فتح الرابط المرفق' : 'Open Resource'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};
