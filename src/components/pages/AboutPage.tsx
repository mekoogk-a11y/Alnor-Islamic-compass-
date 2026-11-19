import React from 'react';
import {
  Building2, ShieldCheck, Sparkles, BookOpen, ArrowLeft,
  Compass, Globe2, Mail
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { COMPLEX_INFO } from '../../data/islamicData';
import { CAMPUS_BUILDINGS } from '../../data/campusData';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface AboutPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="space-y-10" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sky-Blue 3D Sanctuary Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] border border-[#87CEEB]/55 p-6 sm:p-10 shadow-xl text-white">
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-3">
            <Sky3DIcon slug="about" tone="sky" size="lg" />
          </div>

          <p className="text-xs font-bold tracking-wide text-[#87CEEB] flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#F7E7B4]" />
            <span>
              {isAr
                ? 'التعريف بمجمع النور الإسلامي العالمي الخيري الشامل'
                : 'About Al Noor Global Islamic Charitable Complex'}
            </span>
          </p>

          <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white max-w-3xl leading-tight">
            {isAr
              ? 'صرحٌ عالمي يُعنى ببناء أجيال القرآن ونشر العلم النافع والعمل الخيري'
              : 'An International Islamic Campus Dedicated to Quran Memorization, Scholarship & Charity'}
          </h1>

          <div className="pt-1">
            <span className="text-lg sm:text-2xl font-bold font-amiri text-[#F7E7B4] block">
              « {COMPLEX_INFO.slogan} »
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('internationalRelations')}
              className="px-5 py-2.5 rounded-2xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] text-xs font-black flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Globe2 className="w-4 h-4" />
              <span>{isAr ? 'العلاقات والشراكات الدولية' : 'International Relations'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-[#87CEEB]/50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#87CEEB]" />
              <span>{isAr ? 'مكتب التواصل الرسمي' : 'Official Contact Desk'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Institutional Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="sky-card-3d p-6 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2B6CB0] to-[#12345A] text-[#F7E7B4] flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black font-amiri text-[#12345A] dark:text-white">
            {isAr ? 'رؤيتنا الاستراتيجية' : 'Strategic Vision'}
          </h2>
          <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            {isAr
              ? 'أن نكون الصرح الإسلامي الوقفي الرائد عالمياً في تحفيظ القرآن الكريم بإتقان وإسناد، وتأصيل العلوم الشرعية الوسطية، وبناء الإنسان الصالح النافع لأمته والإنسانية جمعاء.'
              : 'To serve as a pioneering global Quranic endowment institution preserving connected-chain recitation, balanced Islamic scholarship, and transparent humanitarian care.'}
          </p>
        </div>

        <div className="sky-card-3d p-6 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5EEAD4] to-[#0EA5A4] text-[#12345A] flex items-center justify-center shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black font-amiri text-[#12345A] dark:text-white">
            {isAr ? 'رسالتنا الخالدة' : 'Institutional Mission'}
          </h2>
          <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            {isAr
              ? 'تيسير حفظ كتاب الله وفهم أحكامه عبر بيئة تعليمية ورقمية متكاملة تحاكي دخول مجمع علمي متكامل، يقودها علماء ومقرئون متقنون وفق أعلى معايير الجودة والحوكمة.'
              : 'Delivering authentic Quran education and verifiable scholarship through an organized digital campus led by certified Qaris and Islamic scholars.'}
          </p>
        </div>

        <div className="sky-card-3d p-6 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F7E7B4] to-[#D4AF37] text-[#12345A] flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black font-amiri text-[#12345A] dark:text-white">
            {isAr ? 'قيمنا المؤسسية' : 'Core Values'}
          </h2>
          <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            {isAr
              ? 'الإخلاص لله تعالى، الإتقان والإسناد العلمي، الوسطية والاعتدال، رعاية الأيتام وطلاب العلم، والشفافية الكاملة في القنوات الوقفية المعتمدة.'
              : 'Sincerity, scholarly precision (Isnad), moderation, orphan welfare, and complete transparency in all verified endowment channels.'}
          </p>
        </div>
      </section>

      {/* Architectural Structure: 8 Wings */}
      <section className="sky-card-3d rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#87CEEB]/45 dark:border-[#87CEEB]/20 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-[#87CEEB] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#0EA5A4]" />
              <span>{isAr ? 'الهيكل المعماري للمجمع الرقمي (8 أجنحة ومبانٍ)' : '8-Building Digital Campus Structure'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] mt-1">
              {isAr
                ? 'ينتظم المجمع في ثمانية مبانٍ رقمية مترابطة، لكل مبنى رسالته وبرامجه وخدماته.'
                : 'Organized across eight interconnected campus departments serving Quranic, academic, research, media, and humanitarian missions.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {CAMPUS_BUILDINGS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onNavigate(b.targetPage)}
              className="p-4 rounded-2xl bg-[#EAF8FF]/85 dark:bg-[#0F2747]/90 border border-[#87CEEB]/55 dark:border-[#87CEEB]/25 hover:border-[#0EA5A4] hover:-translate-y-0.5 transition-all text-start space-y-1.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-black text-[#0D7A7A] dark:text-[#87CEEB]">
                  {b.code}
                </span>
                <ArrowLeft className={`w-3.5 h-3.5 text-[#0EA5A4] ${isRtl ? '' : 'rotate-180'}`} />
              </div>
              <h3 className="text-sm font-black font-amiri text-[#12345A] dark:text-white group-hover:text-[#0EA5A4] dark:group-hover:text-[#87CEEB]">
                {isAr ? b.nameAr : b.nameEn}
              </h3>
              <p className="text-[11px] text-[#4A7298] dark:text-[#B8DEF5] line-clamp-2">
                {isAr ? b.subtitleAr : b.subtitleEn}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Scholarly Council & Stewardship */}
      <section className="space-y-4">
        <div>
          <p className="text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
            {isAr ? 'الإشراف العلمي والإدارة' : 'Academic & Endowment Leadership'}
          </p>
          <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white mt-1">
            {isAr ? 'إشراف علمي وإداري من العلماء والمقرئين' : 'Supervised by Scholars, Qaris & Endowment Trustees'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: 'الشيخ الهادي سالم',
              role: 'مدير مجمع النور الإسلامي العالمي الخيري الشامل',
              spec: 'الإشراف العام والعمل الوقفي وكفالة الأيتام (حساب 1727654)',
            },
            {
              name: 'هيئة الإقراء والسند المتصل',
              role: 'إدارة مجمع القرآن الكريم',
              spec: 'الإشراف على روايات القراءات العشر وتصحيح التلاوة والإجازات',
            },
            {
              name: 'المجلس الأكاديمي للعلوم الشرعية',
              role: 'إدارة المعهد الشرعي والبحوث',
              spec: 'إعداد المناهج التأصيلية في الفقه والحديث والتفسير واللغة',
            },
            {
              name: 'لجنة التواصل والشراكات الدولية',
              role: 'مكتب العلاقات الدولية',
              spec: 'التنسيق مع المراكز الإسلامية والهيئات التعليمية العالمية',
            },
          ].map((leader, i) => (
            <div
              key={i}
              className="sky-card-3d rounded-3xl p-5 space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#12345A] to-[#0EA5A4] text-white font-bold flex items-center justify-center font-mono text-xs shadow-sm">
                0{i + 1}
              </div>
              <h3 className="text-sm font-black font-amiri text-[#12345A] dark:text-white leading-snug">{leader.name}</h3>
              <div className="text-xs text-[#0D7A7A] dark:text-[#87CEEB] font-bold">{leader.role}</div>
              <p className="text-[11px] text-[#4A7298] dark:text-[#B8DEF5] leading-relaxed">{leader.spec}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionDynamicItems sectionSlug="about" />
    </div>
  );
};
