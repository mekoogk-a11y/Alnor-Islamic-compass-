import React, { useState } from 'react';
import { 
  Download, Globe, Search, BookOpen, Check, Copy, 
  ExternalLink, ShieldCheck, Eye, X, FileText, Sparkles, 
  ChevronRight, Award, Bookmark, ArrowDownToLine, Share2
} from 'lucide-react';
import { QURAN_TRANSLATION_EDITIONS } from '../data/quranTranslationsData';
import { QuranTranslationEdition } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface QuranTranslationsCenterProps {
  initialLanguage?: string;
}

export const QuranTranslationsCenter: React.FC<QuranTranslationsCenterProps> = ({ initialLanguage }) => {
  const { lang, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
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
${edition.sampleAyahs.map(a => `
[${a.surahNameAr} - آية ${a.ayahNumber}]
النص القرآني:
${a.arabicText}

الترجمة المعتمدة (${edition.languageNameNative}):
${a.translationText}
`).join('\n--------------------------------------------------------------------\n')}
====================================================================
مجمع النور الإسلامي العالمي - نورٌ يهدي، وعلمٌ يبني
https://alnoor-complex.org
====================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quran-Translation-${edition.languageCode}-${edition.languageNameNative}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccessId(edition.id);
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  const handleTriggerPdfDownload = (edition: QuranTranslationEdition) => {
    // Open direct PDF download in new tab
    window.open(edition.pdfDownloadUrl, '_blank', 'noopener,noreferrer');
    setDownloadSuccessId(edition.id);
    setTimeout(() => setDownloadSuccessId(null), 3500);
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Banner for Translations Center */}
      <div className="rounded-3xl p-6 sm:p-10 border border-[#E5DCCB] dark:border-[#3A4237] bg-gradient-to-br from-[#F0EDE4] via-[#F7F5EF] to-[#E5DCCB] dark:from-[#272B25] dark:via-[#1F221E] dark:to-[#2F362C] shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#394E43] text-[#F7F5EF] text-xs font-black flex items-center gap-1.5 shadow-xs">
                <Globe className="w-3.5 h-3.5 text-[#B9A477]" />
                <span>مركز تحميل ترجمات معاني القرآن الكريم الأصلية المعتمدة</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FAF8F2] dark:bg-[#343832] border border-[#B9A477]/40 text-[#394E43] dark:text-[#E5DCCB] text-xs font-mono font-bold">
                نسخ مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة 🇸🇦
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#343832] dark:text-[#F7F5EF] font-amiri leading-tight">
              تحميل وقراءة ترجمات معاني القرآن الكريم بمختلف اللغات العالمية
            </h2>

            <p className="text-xs sm:text-sm text-[#657568] dark:text-[#D8CEBB] leading-relaxed">
              نوفر لك النسخ الأصلية الكاملة والمحققة الصادرة عن <strong>مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة</strong> والمؤسسات الإسلامية الدولية المعتمدة، بصيغتي PDF عالية الدقة والنص الرقمي، خالية تماماً من الأخطاء والتحريفات، ومتاحة للتحميل المباشر والمجاني لوجه الله تعالى.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
            <div className="p-3.5 bg-[#FAF8F2] dark:bg-[#272B25] rounded-2xl border border-[#D8CEBB] dark:border-[#3A4237] text-center shadow-2xs">
              <span className="text-xl sm:text-2xl font-black text-[#394E43] dark:text-[#B9A477] block font-mono">
                {QURAN_TRANSLATION_EDITIONS.length}
              </span>
              <span className="text-[11px] text-[#657568] dark:text-[#D8CEBB] font-bold">
                نسخة لغوية معتمدة للتحميل
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Region Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF8F2] dark:bg-[#272B25] p-4 rounded-2xl border border-[#E5DCCB] dark:border-[#3A4237] shadow-2xs">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#80887D] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن لغة (الإنجليزية، الفرنسية، الأردية، الصينية، المترجم...)"
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#D8CEBB] dark:border-[#343832] text-xs text-[#343832] dark:text-[#F7F5EF] focus:outline-hidden focus:border-[#394E43] transition-colors"
          />
        </div>

        {/* Region tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {regionFilters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRegion(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRegion === tab.id
                  ? 'bg-[#394E43] text-[#F7F5EF] shadow-2xs'
                  : 'bg-[#F0EDE4] dark:bg-[#1F221E] text-[#657568] dark:text-[#D8CEBB] hover:bg-[#E5DCCB]'
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
            className="rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] hover:border-[#394E43] dark:hover:border-[#B9A477] p-6 flex flex-col justify-between gap-5 transition-all shadow-2xs hover:shadow-sm group"
          >
            
            {/* Top Badge & Flag */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-1 bg-[#F0EDE4] dark:bg-[#1F221E] rounded-xl border border-[#D8CEBB] dark:border-[#343832]">
                    {edition.flagEmoji}
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[#343832] dark:text-[#F7F5EF]">
                      {edition.languageNameAr}
                    </h3>
                    <span className="text-xs text-[#657568] dark:text-[#D8CEBB] font-medium font-sans">
                      {edition.languageNameNative} ({edition.languageCode.toUpperCase()})
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#657568]/15 dark:bg-[#657568]/30 text-[#394E43] dark:text-[#A4B5A7]">
                  {edition.fileSizeBytes}
                </span>
              </div>

              {/* Title & Accreditation */}
              <div className="space-y-1.5 pt-1">
                <h4 className="text-sm font-bold text-[#394E43] dark:text-[#F7F5EF] font-amiri leading-snug line-clamp-2">
                  {edition.titleAr}
                </h4>
                <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB] font-sans italic line-clamp-1">
                  {edition.titleNative}
                </p>
              </div>

              {/* Accreditation Box */}
              <div className="p-3 bg-[#F0EDE4] dark:bg-[#1F221E] rounded-2xl border border-[#D8CEBB] dark:border-[#3A4237] space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-[#394E43] dark:text-[#B9A477] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#B9A477]" />
                  <span>جهة التحقيق والاعتماد:</span>
                </div>
                <p className="text-[11px] text-[#5E655B] dark:text-[#D8CEBB] leading-relaxed">
                  {edition.accreditation}
                </p>
                <div className="text-[10px] text-[#80887D] pt-1 border-t border-[#E5DCCB] dark:border-[#343832] flex items-center justify-between">
                  <span>المترجم: {edition.translator.slice(0, 30)}...</span>
                  <span className="font-mono">{edition.pagesCount} صفحة</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-[#E5DCCB] dark:border-[#343832]">
              
              {/* Primary Download Button */}
              <button
                onClick={() => handleTriggerPdfDownload(edition)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#394E43] hover:bg-[#2D3E35] text-[#F7F5EF] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                title="تنزيل النسخة الأصلية المصورة المعتمدة بصيغة PDF"
              >
                <ArrowDownToLine className="w-4 h-4 text-[#B9A477]" />
                <span>تنزيل النسخة الأصلية (PDF مجاناً)</span>
              </button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-2">
                
                {/* Preview in browser */}
                <button
                  onClick={() => setPreviewEdition(edition)}
                  className="py-2 px-3 rounded-xl bg-[#F0EDE4] dark:bg-[#1F221E] hover:bg-[#E5DCCB] dark:hover:bg-[#343832] border border-[#D8CEBB] dark:border-[#3A4237] text-xs font-bold text-[#343832] dark:text-[#F7F5EF] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="معاينة وقراءة نماذج من الترجمة مباشرة"
                >
                  <Eye className="w-3.5 h-3.5 text-[#394E43] dark:text-[#B9A477]" />
                  <span>معاينة وقراءة</span>
                </button>

                {/* Download Text file */}
                <button
                  onClick={() => handleDownloadTxt(edition)}
                  className="py-2 px-3 rounded-xl bg-[#F0EDE4] dark:bg-[#1F221E] hover:bg-[#E5DCCB] dark:hover:bg-[#343832] border border-[#D8CEBB] dark:border-[#3A4237] text-xs font-bold text-[#343832] dark:text-[#F7F5EF] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="تنزيل ملف النص المعتمد بصيغة TXT"
                >
                  <FileText className="w-3.5 h-3.5 text-[#657568] dark:text-[#B9A477]" />
                  <span>ملف نصي (TXT)</span>
                </button>

              </div>

              {/* Direct Link Copier */}
              <div className="flex items-center justify-between text-[11px] pt-1 px-1 text-[#657568] dark:text-[#D8CEBB]">
                <button
                  onClick={() => handleCopyLink(edition)}
                  className="hover:text-[#394E43] dark:hover:text-[#F7F5EF] flex items-center gap-1 font-bold cursor-pointer"
                >
                  {copiedId === edition.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 dark:text-emerald-400">تم نسخ رابط التحميل!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>نسخ الرابط المباشر</span>
                    </>
                  )}
                </button>

                {downloadSuccessId === edition.id && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>بدأ التحميل!</span>
                  </span>
                )}
              </div>

            </div>

          </div>
        ))}
      </div>

      {filteredEditions.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] space-y-3">
          <BookOpen className="w-10 h-10 text-[#80887D] mx-auto" />
          <h4 className="text-base font-bold text-[#343832] dark:text-[#F7F5EF]">
            لم نجد نتائج مطابقة لبحثك
          </h4>
          <p className="text-xs text-[#5E655B] dark:text-[#D8CEBB]">
            جرب البحث باسم اللغة أو اضغط على «جميع اللغات العالمية» لعرض كافة النسخ المعتمدة.
          </p>
        </div>
      )}

      {/* Interactive Reader Preview Modal */}
      {previewEdition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E5DCCB] dark:border-[#343832] flex items-center justify-between gap-4 bg-[#F0EDE4] dark:bg-[#1F221E]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-3xl shrink-0">{previewEdition.flagEmoji}</span>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-[#343832] dark:text-[#F7F5EF] truncate">
                    {previewEdition.titleAr}
                  </h3>
                  <span className="text-xs text-[#657568] dark:text-[#D8CEBB] font-sans truncate block">
                    {previewEdition.titleNative} • {previewEdition.languageNameNative}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setPreviewEdition(null)}
                className="p-2 rounded-xl bg-[#FAF8F2] dark:bg-[#272B25] text-[#657568] hover:text-[#343832] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Publication Credentials Card */}
              <div className="p-4 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#D8CEBB] dark:border-[#343832] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#80887D] block">المترجم المعتمد:</span>
                  <span className="font-bold text-[#343832] dark:text-[#F7F5EF]">{previewEdition.translator}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#80887D] block">جهة الاعتماد الرسمية:</span>
                  <span className="font-bold text-[#394E43] dark:text-[#B9A477]">{previewEdition.accreditation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#80887D] block">الناشر وسنة الإصدار:</span>
                  <span className="text-[#5E655B] dark:text-[#D8CEBB]">{previewEdition.publisher} ({previewEdition.yearPublished})</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#80887D] block">حجم النسخة الأصلية:</span>
                  <span className="text-[#5E655B] dark:text-[#D8CEBB] font-mono">{previewEdition.fileSizeBytes} ({previewEdition.pagesCount} صفحة)</span>
                </div>
              </div>

              {/* Sample Ayahs Reader View */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-[#394E43] dark:text-[#F7F5EF] flex items-center gap-2 border-b border-[#E5DCCB] dark:border-[#343832] pb-2">
                  <BookOpen className="w-4 h-4 text-[#B9A477]" />
                  <span>نماذج من الآيات المترجمة في هذه النسخة:</span>
                </h4>

                <div className="space-y-4">
                  {previewEdition.sampleAyahs.map((ayah, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-5 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#D8CEBB] dark:border-[#343832] space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs text-[#80887D] border-b border-[#E5DCCB]/60 dark:border-[#343832] pb-1.5">
                        <span className="font-bold text-[#394E43] dark:text-[#B9A477]">{ayah.surahNameAr}</span>
                        <span className="font-sans font-medium">{ayah.surahNameNative}</span>
                      </div>

                      {/* Arabic Verse */}
                      <p className="text-lg sm:text-xl font-amiri font-bold text-[#343832] dark:text-[#F7F5EF] leading-loose text-right">
                        {ayah.arabicText}
                      </p>

                      {/* Translated Verse */}
                      <p className="text-xs sm:text-sm text-[#5E655B] dark:text-[#D8CEBB] font-sans leading-relaxed pt-1 border-t border-[#E5DCCB]/60 dark:border-[#343832]">
                        {ayah.translationText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer with Direct Actions */}
            <div className="p-4 sm:p-5 border-t border-[#E5DCCB] dark:border-[#343832] bg-[#F0EDE4] dark:bg-[#1F221E] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#657568] dark:text-[#D8CEBB] font-medium">
                نسخة مجمع الملك فهد الأصلية بصيغة PDF كاملة
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadTxt(previewEdition)}
                  className="px-4 py-2 rounded-xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#D8CEBB] dark:border-[#3A4237] text-xs font-bold text-[#343832] dark:text-[#F7F5EF] hover:bg-[#E5DCCB] cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#B9A477]" />
                  <span>تنزيل النص (TXT)</span>
                </button>

                <button
                  onClick={() => handleTriggerPdfDownload(previewEdition)}
                  className="px-5 py-2 rounded-xl bg-[#394E43] hover:bg-[#2D3E35] text-[#F7F5EF] text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-[#B9A477]" />
                  <span>تنزيل النسخة الأصلية (PDF)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
