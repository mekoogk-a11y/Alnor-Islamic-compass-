import React from 'react';
import { Home, ChevronLeft, Building2, Compass } from 'lucide-react';
import { NavigationPage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DepartmentBreadcrumbProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

const PAGE_METADATA: Record<NavigationPage, { ar: string; en: string; deptCode?: string }> = {
  home: { ar: 'الساحة الرئيسية للمجمع', en: 'Central Campus' },
  about: { ar: 'عن مجمع النور', en: 'About the Complex' },
  quran: { ar: 'مجمع القرآن الكريم', en: 'Quran Complex', deptCode: '01' },
  translationsReader: { ar: 'مجمع القرآن · ترجمات 76 لغة', en: 'Quran Complex · 76 Translations', deptCode: '01' },
  sciences: { ar: 'معهد العلوم الإسلامية', en: 'Islamic Sciences Institute', deptCode: '02' },
  hadith: { ar: 'معهد العلوم · موسوعة السنة النبوية', en: 'Islamic Sciences · Hadith Encyclopedia', deptCode: '02' },
  scholars: { ar: 'هيئة العلماء والمشايخ', en: 'Council of Scholars', deptCode: '02' },
  library: { ar: 'المكتبة الإسلامية العالمية', en: 'Global Islamic Library', deptCode: '03' },
  dawahLibrary: { ar: 'المكتبة الدعوية الدولية', en: 'International Dawah Library', deptCode: '03' },
  waqf: { ar: 'المركز الخيري والإنساني والأوقاف', en: 'Charitable & Humanitarian Center', deptCode: '04' },
  orphansCare: { ar: 'المركز الخيري · بوابة كفالة الأيتام', en: 'Charitable Center · Orphans Care', deptCode: '04' },
  academy: { ar: 'الأكاديمية التعليمية', en: 'Educational Academy', deptCode: '05' },
  register: { ar: 'الأكاديمية · القبول والتسجيل', en: 'Academy · Admissions & Registration', deptCode: '05' },
  dashboard: { ar: 'الأكاديمية · لوحة الطالب', en: 'Academy · Student Portal', deptCode: '05' },
  researchCenter: { ar: 'مركز البحوث والدراسات', en: 'Research & Studies Center', deptCode: '06' },
  aiScholar: { ar: 'مركز البحوث · الباحث العلمي الموثق', en: 'Research Center · Scholarly Assistant', deptCode: '06' },
  mediaCenter: { ar: 'المركز الإعلامي والنشر', en: 'Media & Publications Center', deptCode: '07' },
  radio: { ar: 'المركز الإعلامي · إذاعة مكة 24/7', en: 'Media Center · Makkah Live Radio', deptCode: '07' },
  audioStudio: { ar: 'المركز الإعلامي · استوديو الصوت السوداني', en: 'Media Center · Audio Studio', deptCode: '07' },
  internationalRelations: { ar: 'مركز العلاقات الدولية', en: 'International Relations Center', deptCode: '08' },
  discoverIslam: { ar: 'العلاقات الدولية · اسأل عن الإسلام', en: 'International Relations · Ask About Islam', deptCode: '08' },
  newMuslims: { ar: 'العلاقات الدولية · رعاية المهتدين الجدد', en: 'International Relations · New Muslims Care', deptCode: '08' },
  noorAmbassador: { ar: 'العلاقات الدولية · سفير النور العالمي', en: 'International Relations · Noor Ambassador', deptCode: '08' },
  contact: { ar: 'اتصل بالمجمع ومكاتب التواصل', en: 'Contact Us & Institutional Desk' },
  community: { ar: 'الملتقى العلمي لطلاب العلم', en: 'Scholarly Community Forum' },
  apiGateway: { ar: 'بوابة الأنظمة وواجهات API', en: 'Enterprise API Architecture' },
  admin: { ar: 'الإدارة العامة والحوكمة المؤسسية', en: 'General Administration & RBAC' },
};

export const DepartmentBreadcrumb: React.FC<DepartmentBreadcrumbProps> = ({ currentPage, onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  if (currentPage === 'home') return null;

  const meta = PAGE_METADATA[currentPage] || PAGE_METADATA.home;
  const label = lang === 'ar' ? meta.ar : meta.en;

  return (
    <nav
      aria-label={lang === 'ar' ? 'مسار التنقل داخل المجمع' : 'Campus Breadcrumb'}
      className="rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3"
    >
      <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold">
        <li>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-[#064E3B] dark:text-[#C8A24A] hover:underline cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{lang === 'ar' ? 'رحاب المجمع الرئيسية' : 'Central Campus'}</span>
          </button>
        </li>
        <li aria-hidden="true" className="text-[#9E7B2B] dark:text-[#C8A24A]/70">
          <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
        </li>
        <li className="inline-flex items-center gap-2 text-[#0F2920] dark:text-[#FAF8F2] font-bold">
          {meta.deptCode && (
            <span className="px-2 py-0.5 rounded bg-[#064E3B] text-[#FAF8F2] dark:bg-[#C8A24A] dark:text-[#022C22] font-mono text-[11px]">
              {lang === 'ar' ? `مبنى ${meta.deptCode}` : `BLDG ${meta.deptCode}`}
            </span>
          )}
          <span>{label}</span>
        </li>
      </ol>

      <button
        type="button"
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F3EFE4] dark:bg-[#064E3B] border border-[#DDD6C7] dark:border-[#C8A24A]/35 text-[#064E3B] dark:text-[#FAF8F2] hover:bg-[#064E3B] hover:text-white dark:hover:bg-[#C8A24A] dark:hover:text-[#022C22] text-xs font-bold transition-colors cursor-pointer"
      >
        <Compass className="w-3.5 h-3.5" />
        <span>{lang === 'ar' ? 'العودة إلى خريطة المجمع' : 'Return to Campus Map'}</span>
      </button>
    </nav>
  );
};
