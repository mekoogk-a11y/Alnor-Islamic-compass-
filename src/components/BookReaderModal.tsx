import React, { useState } from 'react';
import { 
  X, BookOpen, Download, Copy, Check, ZoomIn, ZoomOut, 
  Share2, ArrowLeft, ArrowRight, Bookmark, ExternalLink, ShieldCheck, FileText, Globe
} from 'lucide-react';
import { LibraryBook } from '../types';

interface BookReaderModalProps {
  book: LibraryBook | null;
  onClose: () => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({ book, onClose }) => {
  if (!book) return null;

  const [fontSize, setFontSize] = useState<number>(18); // base font size in px
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [readerTheme, setReaderTheme] = useState<'ivory' | 'parchment' | 'night'>('ivory');

  const chapters = book.chapters && book.chapters.length > 0 
    ? book.chapters 
    : [
        {
          id: 'sample',
          title: book.sampleChapterTitle || 'مقدمة الكتاب والباب الأول',
          content: book.sampleChapterText || book.description
        }
      ];

  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  const handleCopyText = () => {
    const textToCopy = `《${book.title}》\nالمؤلف: ${book.author}\n${book.translator ? `المترجم: ${book.translator}\n` : ''}اللغة: ${book.languageLabel}\n\n${currentChapter.title}\n\n${currentChapter.content}\n\n— مجمع النور الإسلامي العالمي (المكتبة الرقمية)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const getThemeClasses = () => {
    switch (readerTheme) {
      case 'night':
        return 'bg-[#0B132B] text-slate-100 border-slate-700';
      case 'parchment':
        return 'bg-[#F2ECE1] text-[#2C2416] border-[#D8CEBB]';
      case 'ivory':
      default:
        return 'bg-[#FBF9F4] text-[#1E242B] border-[#E5DCCB]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[92vh] max-h-[850px] flex flex-col rounded-3xl bg-[#070D1E] border border-[#D4AF37]/50 shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0B132B] border-b border-[#D4AF37]/30 text-white shrink-0">
          
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-2xl p-1.5 bg-[#111C3D] rounded-xl border border-[#D4AF37]/30 shrink-0">
              {book.flag}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#070D1E]">
                  {book.languageLabel}
                </span>
                <span className="text-xs text-slate-400 font-medium truncate">
                  {book.category}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white font-amiri truncate">
                {book.title}
              </h2>
            </div>
          </div>

          {/* Quick Reader Controls & Close */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Font Size Scaling */}
            <div className="hidden sm:flex items-center bg-[#111C3D] rounded-xl border border-slate-700 p-0.5 text-xs">
              <button 
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className="px-2 py-1 text-slate-300 hover:text-white"
                title="تصغير الخط"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-[11px] font-mono text-[#D4AF37]">{fontSize}px</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
                className="px-2 py-1 text-slate-300 hover:text-white"
                title="تكبير الخط"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reading Theme Selector */}
            <div className="flex items-center gap-1 bg-[#111C3D] rounded-xl border border-slate-700 p-1">
              <button
                onClick={() => setReaderTheme('ivory')}
                className={`w-5 h-5 rounded-md bg-[#FBF9F4] border ${readerTheme === 'ivory' ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' : 'border-transparent'}`}
                title="المظهر العاجي"
              />
              <button
                onClick={() => setReaderTheme('parchment')}
                className={`w-5 h-5 rounded-md bg-[#E8DCB8] border ${readerTheme === 'parchment' ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' : 'border-transparent'}`}
                title="ورق المخطوطات القديم"
              />
              <button
                onClick={() => setReaderTheme('night')}
                className={`w-5 h-5 rounded-md bg-[#0B132B] border ${readerTheme === 'night' ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' : 'border-transparent'}`}
                title="المظهر الليلي"
              />
            </div>

            {/* PDF Download Button */}
            {book.pdfUrl && (
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#070D1E] text-xs font-black shadow-sm hover:scale-105 transition-all"
                title="تحميل الكتاب الكامل بصيغة PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">تحميل PDF</span>
              </a>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#111C3D] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
              title="إغلاق القارئ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Reader Layout: Left Table of Contents (Desktop), Right Scrollable Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Table of Contents */}
          <div className="hidden md:flex flex-col w-72 bg-[#050914] border-r border-[#D4AF37]/20 p-4 shrink-0 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              
              {/* Book Metadata Box */}
              <div className="p-3 bg-[#0B132B] rounded-2xl border border-slate-800 text-xs space-y-1.5">
                <div>
                  <span className="text-slate-400 text-[10px] block">المؤلف:</span>
                  <span className="font-bold text-white text-xs">{book.author}</span>
                </div>
                {book.translator && (
                  <div>
                    <span className="text-slate-400 text-[10px] block">المترجم:</span>
                    <span className="font-medium text-slate-300 text-xs">{book.translator}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>{book.pages} صفحة</span>
                  <span>{book.year}</span>
                </div>
              </div>

              {/* Chapters list */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#D4AF37] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>فهرس الأبواب والفصول ({chapters.length}):</span>
                </span>
                
                {chapters.map((chap, idx) => {
                  const isActive = idx === activeChapterIndex;
                  return (
                    <button
                      key={chap.id || idx}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`w-full text-right p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-[#111C3D] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
                          : 'text-slate-300 hover:bg-[#0B132B] hover:text-white border border-transparent'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-md bg-black/40 text-[10px] flex items-center justify-center shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <span className="truncate">{chap.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Publisher info */}
              {book.publisher && (
                <div className="p-2.5 rounded-xl bg-[#0B132B]/60 text-[10px] text-slate-400 border border-slate-800">
                  <span className="text-[#D4AF37] font-semibold block">جهة النشر والاعتماد:</span>
                  <span>{book.publisher}</span>
                </div>
              )}

            </div>
          </div>

          {/* Main Reading Surface */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Reading Content Pane */}
            <div className={`flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar transition-colors ${getThemeClasses()}`}>
              <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Chapter Title Badge */}
                <div className="border-b pb-4 border-current/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold opacity-75 uppercase tracking-wider block mb-1">
                      {book.title} • الباب {activeChapterIndex + 1}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black font-amiri leading-snug">
                      {currentChapter.title}
                    </h1>
                  </div>

                  <button
                    onClick={handleCopyText}
                    className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/10 hover:bg-black/20 text-xs font-bold transition-all cursor-pointer border border-current/20"
                    title="نسخ نص الباب للاقتباس"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'تم النسخ بنجاح' : 'نسخ النص'}</span>
                  </button>
                </div>

                {/* Chapter Main Scholarly Text */}
                <div 
                  className="font-serif leading-loose tracking-wide whitespace-pre-line text-justify selection:bg-amber-300 selection:text-slate-950"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {currentChapter.content}
                </div>

                {/* Footnote / Trust Seal */}
                <div className="p-4 rounded-2xl bg-black/5 border border-current/15 text-xs space-y-2 mt-12">
                  <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-[#D4AF37]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>توثيق مجمع النور الإسلامي العالمي:</span>
                  </div>
                  <p className="opacity-80 text-[11px] leading-relaxed">
                    تمت مقابلة وتدقيق هذا النص وفق النسخ المحققة المعتمدة. يمكنك تحميل الكتاب الأصلي كاملاً بصيغة PDF بجودة عالية للباحثين وطلاب العلم مجاناً.
                  </p>
                </div>

              </div>
            </div>

            {/* Bottom Chapter Navigation Bar */}
            <div className="px-6 py-3 bg-[#0B132B] border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-white shrink-0">
              
              <button
                disabled={activeChapterIndex <= 0}
                onClick={() => setActiveChapterIndex(prev => prev - 1)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeChapterIndex <= 0
                    ? 'opacity-30 cursor-not-allowed text-slate-500'
                    : 'bg-[#111C3D] hover:bg-[#1E2E5D] text-white border border-slate-700 cursor-pointer'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
                <span>الباب السابق</span>
              </button>

              <span className="text-slate-400 font-mono text-[11px]">
                {activeChapterIndex + 1} / {chapters.length}
              </span>

              <button
                disabled={activeChapterIndex >= chapters.length - 1}
                onClick={() => setActiveChapterIndex(prev => prev + 1)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeChapterIndex >= chapters.length - 1
                    ? 'opacity-30 cursor-not-allowed text-slate-500'
                    : 'bg-[#111C3D] hover:bg-[#1E2E5D] text-white border border-slate-700 cursor-pointer'
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
