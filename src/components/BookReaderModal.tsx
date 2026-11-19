import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { LibraryBook } from '../types';

interface BookReaderModalProps {
  book: LibraryBook | null;
  onClose: () => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({ book, onClose }) => {
  const [fontSize, setFontSize] = useState<number>(18);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [readerTheme, setReaderTheme] = useState<'ivory' | 'parchment' | 'night'>('ivory');

  if (!book) return null;

  const chapters =
    book.chapters && book.chapters.length > 0
      ? book.chapters
      : [
          {
            id: 'sample',
            title: book.sampleChapterTitle || 'مقدمة الكتاب والباب الأول',
            content: book.sampleChapterText || book.description,
          },
        ];

  const safeChapterIndex = Math.min(activeChapterIndex, chapters.length - 1);
  const currentChapter = chapters[safeChapterIndex] || chapters[0];

  const handleCopyText = () => {
    const textToCopy = `《${book.title}》\nالمؤلف: ${book.author}\n${
      book.translator ? `المترجم: ${book.translator}\n` : ''
    }اللغة: ${book.languageLabel}\n\n${currentChapter.title}\n\n${
      currentChapter.content
    }\n\n— مجمع النور الإسلامي العالمي (المكتبة الرقمية)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const getThemeClasses = () => {
    switch (readerTheme) {
      case 'night':
        return 'bg-[#0A223D] text-[#EAF8FF] border-[#87CEEB]/25';
      case 'parchment':
        return 'bg-[#F4EFE2] text-[#2C2416] border-[#D8CEBB]';
      case 'ivory':
      default:
        return 'bg-white text-[#12345A] border-[#12345A]/15';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A223D]/75 backdrop-blur-md">
      <div className="w-full max-w-5xl h-[92vh] max-h-[850px] flex flex-col rounded-3xl bg-white dark:bg-[#0F2747] border border-[#12345A]/25 dark:border-[#87CEEB]/30 shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-l from-[#12345A] to-[#0E3F66] border-b border-[#D4AF37]/30 text-white shrink-0 gap-3">
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            <span className="text-2xl p-1.5 bg-white/10 rounded-xl border border-white/20 shrink-0">
              {book.flag}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#F7E7B4]">
                <span>{book.languageLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#87CEEB] truncate">{book.category}</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white font-amiri truncate">
                {book.title}
              </h2>
            </div>
          </div>

          {/* Quick Reader Controls & Close */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center bg-white/10 rounded-xl border border-white/20 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setFontSize((prev) => Math.max(14, prev - 2))}
                className="px-2 py-1 text-[#D8F1FD] hover:text-white cursor-pointer"
                title="تصغير الخط"
                aria-label="تصغير الخط"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 text-[11px] font-mono tabular-nums text-[#F7E7B4]">{fontSize}px</span>
              <button
                type="button"
                onClick={() => setFontSize((prev) => Math.min(28, prev + 2))}
                className="px-2 py-1 text-[#D8F1FD] hover:text-white cursor-pointer"
                title="تكبير الخط"
                aria-label="تكبير الخط"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reading Theme Selector */}
            <div className="flex items-center gap-1 bg-white/10 rounded-xl border border-white/20 p-1">
              <button
                type="button"
                onClick={() => setReaderTheme('ivory')}
                className={`w-5 h-5 rounded-md bg-white border cursor-pointer ${
                  readerTheme === 'ivory' ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]' : 'border-white/30'
                }`}
                title="المظهر الأبيض السماوي"
                aria-label="المظهر الأبيض السماوي"
              />
              <button
                type="button"
                onClick={() => setReaderTheme('parchment')}
                className={`w-5 h-5 rounded-md bg-[#F4EFE2] border cursor-pointer ${
                  readerTheme === 'parchment' ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]' : 'border-white/30'
                }`}
                title="ورق المخطوطات"
                aria-label="ورق المخطوطات"
              />
              <button
                type="button"
                onClick={() => setReaderTheme('night')}
                className={`w-5 h-5 rounded-md bg-[#0A223D] border cursor-pointer ${
                  readerTheme === 'night' ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]' : 'border-white/30'
                }`}
                title="المظهر الليلي"
                aria-label="المظهر الليلي"
              />
            </div>

            {book.pdfUrl && (
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C97B] text-[#0A223D] text-xs font-black shadow-sm transition-colors"
                title="تحميل الكتاب الكامل بصيغة PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">تحميل PDF</span>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="min-h-[38px] min-w-[38px] p-1.5 rounded-xl bg-white/10 hover:bg-[#DC2626]/30 text-white border border-white/20 transition-colors cursor-pointer flex items-center justify-center"
              title="إغلاق القارئ"
              aria-label="إغلاق القارئ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Layout: Sidebar TOC & Reading Surface */}
        <div className="flex-1 flex overflow-hidden">
          <div className="hidden md:flex flex-col w-72 bg-[#EAF8FF] dark:bg-[#0A223D] border-l border-[#12345A]/12 dark:border-[#87CEEB]/20 p-4 shrink-0 overflow-y-auto">
            <div className="space-y-4">
              <div className="p-3.5 bg-white dark:bg-[#0F2747] rounded-2xl border border-[#12345A]/12 dark:border-[#87CEEB]/20 text-xs space-y-2">
                <div>
                  <span className="text-[#4A7298] dark:text-[#84B4D6] text-[11px] block">المؤلف:</span>
                  <span className="font-bold text-[#12345A] dark:text-[#EAF8FF]">{book.author}</span>
                </div>
                {book.translator && (
                  <div>
                    <span className="text-[#4A7298] dark:text-[#84B4D6] text-[11px] block">المترجم:</span>
                    <span className="font-medium text-[#2B547E] dark:text-[#B8DEF5]">{book.translator}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-[#4A7298] dark:text-[#84B4D6] pt-2 border-t border-[#12345A]/10 dark:border-[#87CEEB]/15 tabular-nums">
                  <span>{book.pages} صفحة</span>
                  <span>{book.year}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#12345A] dark:text-[#F7E7B4] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#0EA5A4]" />
                  <span>فهرس الأبواب والفصول ({chapters.length}):</span>
                </span>

                {chapters.map((chap, idx) => {
                  const isActive = idx === safeChapterIndex;
                  return (
                    <button
                      type="button"
                      key={chap.id || idx}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`w-full text-right p-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-[#12345A] text-white shadow-xs'
                          : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-white dark:hover:bg-[#133158]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md text-[10px] flex items-center justify-center shrink-0 font-mono tabular-nums ${
                          isActive
                            ? 'bg-white/20 text-[#F7E7B4]'
                            : 'bg-[#12345A]/10 dark:bg-white/10 text-[#12345A] dark:text-[#87CEEB]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="truncate">{chap.title}</span>
                    </button>
                  );
                })}
              </div>

              {book.publisher && (
                <div className="p-3 rounded-xl bg-white/80 dark:bg-[#0F2747] text-[11px] text-[#2B547E] dark:text-[#B8DEF5] border border-[#12345A]/10 dark:border-[#87CEEB]/15">
                  <span className="text-[#12345A] dark:text-[#F7E7B4] font-bold block mb-0.5">
                    جهة النشر والاعتماد:
                  </span>
                  <span>{book.publisher}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Reading Surface */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className={`flex-1 overflow-y-auto p-6 sm:p-12 transition-colors ${getThemeClasses()}`}>
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="border-b pb-4 border-current/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold opacity-75 block mb-1">
                      {book.title} · الباب {safeChapterIndex + 1}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black font-amiri leading-snug">
                      {currentChapter.title}
                    </h1>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-current/5 hover:bg-current/10 text-xs font-bold transition-colors cursor-pointer border border-current/20"
                    title="نسخ نص الباب للاقتباس"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#0EA5A4]" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'تم النسخ بنجاح' : 'نسخ النص'}</span>
                  </button>
                </div>

                <div
                  className="font-serif leading-loose whitespace-pre-line text-justify"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {currentChapter.content}
                </div>

                <div className="p-4 rounded-2xl bg-current/5 border border-current/15 text-xs space-y-1.5 mt-12">
                  <div className="flex items-center gap-2 font-bold text-[#0EA5A4]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>توثيق مجمع النور الإسلامي العالمي:</span>
                  </div>
                  <p className="opacity-85 text-xs leading-relaxed">
                    تمت مقابلة وتدقيق هذا النص وفق النسخ المحققة المعتمدة. يمكنك تحميل الكتاب الأصلي كاملاً
                    بصيغة PDF للباحثين وطلاب العلم مجاناً.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Chapter Navigation Bar */}
            <div className="px-6 py-3 bg-[#EAF8FF] dark:bg-[#0A223D] border-t border-[#12345A]/12 dark:border-[#87CEEB]/20 flex items-center justify-between text-xs text-[#12345A] dark:text-[#EAF8FF] shrink-0">
              <button
                type="button"
                disabled={safeChapterIndex <= 0}
                onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
                className={`min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-colors ${
                  safeChapterIndex <= 0
                    ? 'opacity-35 cursor-not-allowed'
                    : 'bg-white dark:bg-[#12345A] hover:bg-[#D8F1FD] border border-[#12345A]/15 cursor-pointer'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
                <span>الباب السابق</span>
              </button>

              <span className="font-mono tabular-nums text-xs font-bold text-[#2B547E] dark:text-[#B8DEF5]">
                {safeChapterIndex + 1} / {chapters.length}
              </span>

              <button
                type="button"
                disabled={safeChapterIndex >= chapters.length - 1}
                onClick={() => setActiveChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1))}
                className={`min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-colors ${
                  safeChapterIndex >= chapters.length - 1
                    ? 'opacity-35 cursor-not-allowed'
                    : 'bg-white dark:bg-[#12345A] hover:bg-[#D8F1FD] border border-[#12345A]/15 cursor-pointer'
                }`}
              >
                <span>الباب التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
