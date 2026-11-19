import React, { useState } from 'react';
import {
  Download,
  Globe,
  Search,
  BookOpen,
  Check,
  Copy,
  ShieldCheck,
  Eye,
  X,
  FileText,
  ArrowDownToLine,
} from 'lucide-react';
import { QURAN_TRANSLATION_EDITIONS } from '../data/quranTranslationsData';
import { QuranTranslationEdition } from '../types';

interface QuranTranslationsCenterProps {
  initialLanguage?: string;
}

export const QuranTranslationsCenter: React.FC<QuranTranslationsCenterProps> = ({ initialLanguage }) => {
  const [searchQuery, setSearchQuery] = useState(initialLanguage || '');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [previewEdition, setPreviewEdition] = useState<QuranTranslationEdition | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const regionFilters = [
    { id: 'all', label: 'جميع اللغات العالمية (18+ لغة)' },
    { id: 'european', label: 'اللغات الأوروبية (English, Français, Deutsch...)' },
    { id: 'asian', label: 'اللغات الآسيوية (اردو, 中文, Türkçe, Bahasa...)' },
    { id: 'african', label: 'اللغات الإفريقية (Kiswahili, Hausa...)' },
  ];

  const getRegionForCode = (code: string): string => {
    if (['en', 'fr', 'es', 'de', 'ru', 'it', 'pt', 'bs'].includes(code)) return 'european';
    if (['tr', 'id', 'ur', 'zh', 'fa', 'bn', 'ja', 'ko'].includes(code)) return 'asian';
    if (['sw', 'ha'].includes(code)) return 'african';
    return 'other';
  };

  const filteredEditions = QURAN_TRANSLATION_EDITIONS.filter((edition) => {
    const region = getRegionForCode(edition.languageCode);
    const matchesRegion = selectedRegion === 'all' || region === selectedRegion;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      edition.languageNameAr.toLowerCase().includes(q) ||
      edition.languageNameNative.toLowerCase().includes(q) ||
      edition.titleAr.toLowerCase().includes(q) ||
      edition.titleNative.toLowerCase().includes(q) ||
      edition.translator.toLowerCase().includes(q) ||
      edition.languageCode.toLowerCase().includes(q);

    return matchesRegion && matchesSearch;
  });

  const handleCopyLink = (edition: QuranTranslationEdition) => {
    navigator.clipboard.writeText(edition.pdfDownloadUrl);
    setCopiedId(edition.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleMarkDownload = (editionId: string) => {
    setDownloadSuccessId(editionId);
    setTimeout(() => setDownloadSuccessId(null), 3500);
  };

  const handleDownloadTxt = (edition: QuranTranslationEdition) => {
    const content = `====================================================================
مجمع النور الإسلامي العالمي - مركز الترجمات المعتمدة
${edition.titleAr}
${edition.titleNative}
====================================================================
اللغة: ${edition.languageNameAr} (${edition.languageNameNative})
المترجم: ${edition.translator}
جهة الاعتماد: ${edition.accreditation}
الناشر: ${edition.publisher}
سنة النشر: ${edition.yearPublished}
عدد الصفحات: ${edition.pagesCount} صفحة
الترخيص: وقف إسلامي مجاني لخدمة كتاب الله
رابط التحميل المباشر للنسخة المصورة الأصلية (PDF):
${edition.pdfDownloadUrl}
====================================================================

نماذج من الآيات المترجمة المعتمدة:
${edition.sampleAyahs
  .map(
    (a) => `
[${a.surahNameAr} - آية ${a.ayahNumber}]
النص القرآني:
${a.arabicText}

الترجمة المعتمدة (${edition.languageNameNative}):
${a.translationText}
`
  )
  .join('\n--------------------------------------------------------------------\n')}
====================================================================
مجمع النور الإسلامي العالمي - نورٌ يهدي، وعلمٌ يبني
====================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quran-Translation-${edition.languageCode}-${edition.languageNameNative}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    handleMarkDownload(edition.id);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner for Translations Center */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#0A223D] via-[#12345A] to-[#0E3F66] text-white border border-[#D4AF37]/40 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#F7E7B4]">
              <Globe className="w-4 h-4 text-[#D4AF37]" />
              <span>مركز تحميل ترجمات معاني القرآن الكريم الأصلية المعتمدة</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#87CEEB]">نسخ مجمع الملك فهد لطباعة المصحف الشريف</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-amiri leading-tight">
              تحميل وقراءة ترجمات معاني القرآن الكريم بمختلف اللغات العالمية
            </h2>

            <p className="text-xs sm:text-sm text-[#D8F1FD] leading-relaxed">
              نوفر لك النسخ الأصلية الكاملة والمحققة الصادرة عن{' '}
              <strong>مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة</strong> والمؤسسات الإسلامية
              الدولية المعتمدة، بصيغتي PDF عالية الدقة والنص الرقمي، ومتاحة للتحميل المباشر والمجاني لوجه الله
              تعالى.
            </p>
          </div>

          <div className="shrink-0">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-[#87CEEB]/30 text-center min-w-[140px] tabular-nums">
              <span className="text-2xl sm:text-3xl font-black text-[#F7E7B4] block font-mono">
                {QURAN_TRANSLATION_EDITIONS.length}
              </span>
              <span className="text-xs text-[#EAF8FF] font-bold block mt-0.5">نسخة لغوية معتمدة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Region Filter Bar */}
      <div className="sky-glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#0EA5A4] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن لغة (الإنجليزية، الفرنسية، الأردية، الصينية، المترجم...)"
            className="w-full min-h-[42px] pr-10 pl-4 py-2 rounded-xl bg-white dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-xs sm:text-sm text-[#12345A] dark:text-[#EAF8FF] focus:outline-none focus:border-[#0EA5A4] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {regionFilters.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedRegion(tab.id)}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                selectedRegion === tab.id
                  ? 'bg-[#12345A] text-white shadow-sm'
                  : 'bg-white/80 dark:bg-[#0F2747] text-[#2B547E] dark:text-[#B8DEF5] hover:bg-white dark:hover:bg-[#133158]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Translations Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEditions.map((edition) => (
          <div
            key={edition.id}
            className="sky-card-3d rounded-3xl p-6 flex flex-col justify-between gap-5 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl p-1.5 bg-[#EAF8FF] dark:bg-[#0A223D] rounded-xl border border-[#12345A]/12 dark:border-[#87CEEB]/20 shrink-0">
                    {edition.flagEmoji}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-[#12345A] dark:text-[#EAF8FF] truncate">
                      {edition.languageNameAr}
                    </h3>
                    <span className="text-xs text-[#4A7298] dark:text-[#84B4D6] font-medium block truncate">
                      {edition.languageNameNative} · {edition.languageCode.toUpperCase()}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono tabular-nums font-bold text-[#0D7A7A] dark:text-[#2DD4BF] shrink-0">
                  {edition.fileSizeBytes}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <h4 className="text-sm font-bold text-[#12345A] dark:text-[#EAF8FF] font-amiri leading-snug line-clamp-2">
                  {edition.titleAr}
                </h4>
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] italic line-clamp-1">
                  {edition.titleNative}
                </p>
              </div>

              {/* Accreditation Box */}
              <div className="p-3.5 bg-[#EAF8FF]/80 dark:bg-[#0A223D]/70 rounded-2xl border border-[#12345A]/12 dark:border-[#87CEEB]/20 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-[#12345A] dark:text-[#F7E7B4] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#0EA5A4] shrink-0" />
                  <span>جهة التحقيق والاعتماد:</span>
                </div>
                <p className="text-[11px] text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                  {edition.accreditation}
                </p>
                <div className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] pt-1.5 border-t border-[#12345A]/10 dark:border-[#87CEEB]/15 flex items-center justify-between gap-2 tabular-nums">
                  <span className="truncate">المترجم: {edition.translator}</span>
                  <span className="font-mono shrink-0">{edition.pagesCount} صفحة</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-3 border-t border-[#12345A]/10 dark:border-[#87CEEB]/15">
              <a
                href={edition.pdfDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleMarkDownload(edition.id)}
                className="w-full min-h-[42px] py-2.5 px-4 rounded-xl bg-[#12345A] hover:bg-[#0E3F66] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                title="تنزيل النسخة الأصلية المصورة المعتمدة بصيغة PDF"
              >
                <ArrowDownToLine className="w-4 h-4 text-[#D4AF37]" />
                <span>تنزيل النسخة الأصلية (PDF مجاناً)</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewEdition(edition)}
                  className="min-h-[40px] py-2 px-3 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] hover:bg-[#D8F1FD] dark:hover:bg-[#133158] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="معاينة وقراءة نماذج من الترجمة مباشرة"
                >
                  <Eye className="w-3.5 h-3.5 text-[#0EA5A4]" />
                  <span>معاينة وقراءة</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadTxt(edition)}
                  className="min-h-[40px] py-2 px-3 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] hover:bg-[#D8F1FD] dark:hover:bg-[#133158] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="تنزيل ملف النص المعتمد بصيغة TXT"
                >
                  <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>ملف نصي (TXT)</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 px-1 text-[#2B547E] dark:text-[#B8DEF5]">
                <button
                  type="button"
                  onClick={() => handleCopyLink(edition)}
                  className="hover:text-[#12345A] dark:hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                >
                  {copiedId === edition.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0EA5A4]" />
                      <span className="text-[#0D7A7A] dark:text-[#2DD4BF]">تم نسخ رابط التحميل!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الرابط المباشر</span>
                    </>
                  )}
                </button>

                {downloadSuccessId === edition.id && (
                  <span className="text-[#0D7A7A] dark:text-[#2DD4BF] font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>بدأ التحميل!</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEditions.length === 0 && (
        <div className="sky-card-3d p-12 text-center rounded-3xl space-y-3">
          <BookOpen className="w-10 h-10 text-[#0EA5A4] mx-auto" />
          <h4 className="text-base font-bold text-[#12345A] dark:text-[#EAF8FF]">
            لم نجد نتائج مطابقة لبحثك
          </h4>
          <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
            جرب البحث باسم اللغة أو اضغط على «جميع اللغات العالمية» لعرض كافة النسخ المعتمدة.
          </p>
        </div>
      )}

      {/* Interactive Reader Preview Modal */}
      {previewEdition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A223D]/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#0F2747] border border-[#12345A]/20 dark:border-[#87CEEB]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#12345A]/12 dark:border-[#87CEEB]/20 flex items-center justify-between gap-4 bg-[#EAF8FF] dark:bg-[#0A223D]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-3xl shrink-0">{previewEdition.flagEmoji}</span>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-[#12345A] dark:text-[#EAF8FF] truncate">
                    {previewEdition.titleAr}
                  </h3>
                  <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] truncate block">
                    {previewEdition.titleNative} · {previewEdition.languageNameNative}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewEdition(null)}
                className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-white dark:bg-[#12345A] text-[#12345A] dark:text-[#EAF8FF] hover:bg-[#D8F1FD] cursor-pointer flex items-center justify-center"
                aria-label="إغلاق المعاينة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Publication Credentials Card */}
              <div className="p-4 rounded-2xl bg-[#EAF8FF] dark:bg-[#0A223D]/70 border border-[#12345A]/12 dark:border-[#87CEEB]/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] block">المترجم المعتمد:</span>
                  <span className="font-bold text-[#12345A] dark:text-[#EAF8FF]">
                    {previewEdition.translator}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] block">جهة الاعتماد الرسمية:</span>
                  <span className="font-bold text-[#0D7A7A] dark:text-[#2DD4BF]">
                    {previewEdition.accreditation}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] block">الناشر وسنة الإصدار:</span>
                  <span className="text-[#2B547E] dark:text-[#B8DEF5]">
                    {previewEdition.publisher} ({previewEdition.yearPublished})
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6] block">حجم النسخة الأصلية:</span>
                  <span className="text-[#2B547E] dark:text-[#B8DEF5] font-mono tabular-nums">
                    {previewEdition.fileSizeBytes} · {previewEdition.pagesCount} صفحة
                  </span>
                </div>
              </div>

              {/* Sample Ayahs Reader View */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-[#12345A] dark:text-[#EAF8FF] flex items-center gap-2 border-b border-[#12345A]/12 dark:border-[#87CEEB]/20 pb-2">
                  <BookOpen className="w-4 h-4 text-[#0EA5A4]" />
                  <span>نماذج من الآيات المترجمة في هذه النسخة:</span>
                </h4>

                <div className="space-y-4">
                  {previewEdition.sampleAyahs.map((ayah, aIdx) => (
                    <div key={aIdx} className="scholarly-reading-paper p-5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#4A7298] dark:text-[#84B4D6] border-b border-[#12345A]/10 dark:border-[#87CEEB]/15 pb-1.5">
                        <span className="font-bold text-[#12345A] dark:text-[#F7E7B4]">
                          {ayah.surahNameAr}
                        </span>
                        <span className="font-medium">{ayah.surahNameNative}</span>
                      </div>

                      <p className="text-lg sm:text-xl font-amiri font-bold text-[#12345A] dark:text-[#EAF8FF] leading-loose text-right">
                        {ayah.arabicText}
                      </p>

                      <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed pt-2 border-t border-[#12345A]/10 dark:border-[#87CEEB]/15">
                        {ayah.translationText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer with Direct Actions */}
            <div className="p-4 sm:p-5 border-t border-[#12345A]/12 dark:border-[#87CEEB]/20 bg-[#EAF8FF] dark:bg-[#0A223D] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-medium">
                نسخة مجمع الملك فهد الأصلية بصيغة PDF كاملة
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadTxt(previewEdition)}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-white dark:bg-[#12345A] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] hover:bg-[#D8F1FD] cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>تنزيل النص (TXT)</span>
                </button>

                <a
                  href={previewEdition.pdfDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleMarkDownload(previewEdition.id)}
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-[#12345A] hover:bg-[#0E3F66] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                  <span>تنزيل النسخة الأصلية (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
