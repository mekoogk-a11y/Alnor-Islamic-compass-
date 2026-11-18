import React from 'react';
import {
  Building2, ShieldCheck, Sparkles, BookOpen, ArrowLeft,
  Compass, Globe2, Mail
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { COMPLEX_INFO } from '../../data/islamicData';
import { CAMPUS_BUILDINGS } from '../../data/campusData';
import { useLanguage } from '../../context/LanguageContext';

interface AboutPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="space-y-10" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sanctuary Header Banner */}
      <section className="bg-gradient-to-l from-[#064E3B] to-[#022C22] border border-[#C8A24A]/50 rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 text-center text-[#FAF8F2]">
        <div className="inline-flex items-center gap-2 bg-[#022C22] border border-[#C8A24A]/50 px-3.5 py-1 rounded-xl text-xs font-bold text-[#E5C97B]">
          <Building2 className="w-4 h-4" />
          <span>
            {isAr
              ? 'التعريف بمجمع النور الإسلامي العالمي الخيري الشامل'
              : 'About Al Noor Global Islamic Charitable Complex'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white">
          {isAr
            ? 'صرحٌ عالمي يُعنى ببناء أجيال القرآن ونشر العلم النافع والعمل الخيري'
            : 'An International Islamic Campus Dedicated to Quran Memorization, Scholarship & Charity'}
        </h1>

        <div className="pt-2">
          <span className="text-lg sm:text-2xl font-bold font-amiri text-[#E5C97B] block">
            « {COMPLEX_INFO.slogan} »
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('internationalRelations')}
            className="px-5 py-2.5 rounded-xl bg-[#C8A24A] hover:bg-[#DFBE68] text-[#022C22] text-xs font-black flex items-center gap-1.5 cursor-pointer"
          >
            <Globe2 className="w-4 h-4" />
            <span>{isAr ? 'العلاقات والشراكات الدولية' : 'International Relations'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 rounded-xl bg-[#FAF8F2]/10 hover:bg-[#FAF8F2]/20 border border-[#C8A24A]/45 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#E5C97B]" />
            <span>{isAr ? 'مكتب التواصل الرسمي' : 'Official Contact Desk'}</span>
          </button>
        </div>
      </section>

      {/* Vision, Mission, Institutional Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#064E3B] text-[#E5C97B] flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black font-amiri text-[#0F2920] dark:text-white">
            {isAr ? 'رؤيتنا الاستراتيجية' : 'Strategic Vision'}
          </h2>
          <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
            {isAr
              ? 'أن نكون الصرح الإسلامي الوقفي الرائد عالمياً في تحفيظ القرآن الكريم بإتقان وإسناد، وتأصيل العلوم الشرعية الوسطية، وبناء الإنسان الصالح النافع لأمته والإنسانية جمعاء.'
              : 'To serve as a pioneering global Quranic endowment institution preserving connected-chain recitation, balanced Islamic scholarship, and transparent humanitarian care.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#047857] text-white flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black font-amiri text-[#0F2920] dark:text-white">
            {isAr ? 'رسالتنا الخالدة' : 'Institutional Mission'}
          </h2>
          <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
            {isAr
              ? 'تيسير حفظ كتاب الله وفهم أحكامه عبر بيئة تعليمية ورقمية متكاملة تحاكي دخول مجمع علمي متكامل، يقودها علماء ومقرئون متقنون وفق أعلى معايير الجودة والحوكمة.'
              : 'Delivering authentic Quran education and verifiable scholarship through an organized digital campus led by certified Qaris and Islamic scholars.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#C8A24A] text-[#022C22] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black font-amiri text-[#0F2920] dark:text-white">
            {isAr ? 'قيمنا المؤسسية' : 'Core Values'}
          </h2>
          <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD] leading-relaxed">
            {isAr
              ? 'الإخلاص لله تعالى، الإتقان والإسناد العلمي، الوسطية والاعتدال، رعاية الأيتام وطلاب العلم، والشفافية الكاملة في القنوات الوقفية المعتمدة.'
              : 'Sincerity, scholarly precision (Isnad), moderation, orphan welfare, and complete transparency in all verified endowment channels.'}
          </p>
        </div>
      </section>

      {/* Architectural Structure: 8 Wings */}
      <section className="bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDD6C7] dark:border-[#C8A24A]/25 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#064E3B] dark:text-[#E5C97B] flex items-center gap-2">
              <Compass className="w-5 h-5" />
              <span>{isAr ? 'الهيكل المعماري للمجمع الرقمي (8 أجنحة ومبانٍ)' : '8-Building Digital Campus Structure'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#38554B] dark:text-[#D1E7DD]">
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
              className="p-4 rounded-2xl bg-[#FAF8F2] dark:bg-[#022C22] border border-[#DDD6C7] dark:border-[#C8A24A]/30 hover:border-[#C8A24A] transition-colors text-start space-y-1.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#064E3B] text-[#E5C97B] font-mono text-[11px] font-bold">
                  {b.code}
                </span>
                <ArrowLeft className={`w-3.5 h-3.5 text-[#047857] dark:text-[#C8A24A] ${isRtl ? '' : 'rotate-180'}`} />
              </div>
              <h3 className="text-sm font-black font-amiri text-[#0F2920] dark:text-white group-hover:text-[#047857] dark:group-hover:text-[#E5C97B]">
                {isAr ? b.nameAr : b.nameEn}
              </h3>
              <p className="text-[11px] text-[#5C746B] dark:text-[#A3C4B8] line-clamp-2">
                {isAr ? b.subtitleAr : b.subtitleEn}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Scholarly Council & Stewardship */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-bold text-[#064E3B] dark:text-[#E5C97B] bg-[#EFECE3] dark:bg-[#04382B] px-3 py-1 rounded-lg border border-[#DDD6C7] dark:border-[#C8A24A]/30">
            {isAr ? 'الإشراف العلمي والإدارة' : 'Academic & Endowment Leadership'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#0F2920] dark:text-white mt-2">
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
              className="bg-[#FFFFFF] dark:bg-[#04382B] border border-[#DDD6C7] dark:border-[#C8A24A]/30 rounded-2xl p-5 space-y-2 shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-[#064E3B] text-[#E5C97B] font-bold flex items-center justify-center font-mono text-xs">
                0{i + 1}
              </div>
              <h3 className="text-sm font-black font-amiri text-[#0F2920] dark:text-white leading-snug">{leader.name}</h3>
              <div className="text-xs text-[#047857] dark:text-[#E5C97B] font-bold">{leader.role}</div>
              <p className="text-[11px] text-[#5C746B] dark:text-[#D1E7DD] leading-relaxed">{leader.spec}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
