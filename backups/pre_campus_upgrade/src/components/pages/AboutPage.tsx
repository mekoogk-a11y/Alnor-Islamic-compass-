import React from 'react';
import { 
  Building2, Globe, Award, ShieldCheck, Heart, 
  Users, Sparkles, BookOpen, CheckCircle2, ArrowLeft 
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { COMPLEX_INFO } from '../../data/islamicData';

interface AboutPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 border border-emerald-900/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
          <Building2 className="w-4 h-4" />
          <span>التعريف بمجمع النور الإسلامي العالمي الخيري الشامل</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          صرحٌ عالمي يُعنى ببناء أجيال القرآن ونشر رسالة الإسلام الخالدة
        </h1>
        
        {/* Slogan */}
        <div className="pt-2">
          <span className="text-xl sm:text-2xl font-black font-amiri text-amber-300 block">
            « {COMPLEX_INFO.slogan} »
          </span>
        </div>
      </div>

      {/* Vision, Mission, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-right shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-white">رؤيتنا الاستراتيجية</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            أن نكون الصرح الإسلامي الوقفي الرائد عالمياً في تحفيظ القرآن الكريم بإتقان وإسناد، وتأصيل العلوم الشرعية الوسطية، وبناء الإنسان الصالح النافع لأمته والإنسانية جمعاء.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-right shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-white">رسالتنا الخالدة</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            تيسير حفظ كتاب الله وفهم أحكامه لجميع المسلمين حول العالم عبر بيئة تعليمية وإلكترونية متطورة، يقودها نخبة من كبار العلماء والمقرئين المتقنين وفق أعلى معايير الجودة والحوكمة.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-right shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-white">قيمنا المؤسسية</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            الإخلاص لله تعالى، الإتقان والإسناد، الشمولية والتنوع، الوسطية والاعتدال، والشفافية المالية في إدارة الأوقاف والصدقات الجارية.
          </p>
        </div>

      </div>

      {/* Philosophy of the Slogan */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 text-right">
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>فلسفة الشعار الرسمي للمجمع: « نورٌ يهدي.. وصرحٌ يبني أجيال القرآن »</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <h4 className="text-sm font-bold text-amber-300">نورٌ يهدي</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              القرآن الكريم هو النور المبين الذي يجلو ظلمات الجهل والفرقة، ويهدي القلوب إلى صراط الله العزيز الحميد، ويزكي النفوس بفضائل الأخلاق ومكارم الشيم.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <h4 className="text-sm font-bold text-emerald-300">صرحٌ يبني أجيال القرآن</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              المجمع ليس مجرد مؤسسة تحفيظ عابرة، بل هو صرح حضاري وقفي شامخ يغرس قيم القرآن في ناشئة الأمة وشبابها ليكونوا قدوات صالحة ورواد نهضة في مجتمعاتهم.
            </p>
          </div>
        </div>
      </div>

      {/* Scholarly Council & Leadership */}
      <div className="space-y-6">
        <div className="text-right">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
            الهيئة العليا للأمناء والعلماء
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            إشراف علمي وإداري من كبار العلماء والمقرئين
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: 'فضيلة الشيخ المقرئ أ.د. عبد الله الصالح',
              role: 'رئيس مجلس الأمناء والمشرف العام',
              spec: 'عضو مجمع القراءات ومجاز بالقراءات العشر الكبرى',
            },
            {
              name: 'فضيلة أ.د. يوسف عبد الرحمن الفاسي',
              role: 'عميد كلية العلوم الإسلامية',
              spec: 'أستاذ الفقه المقارن وأصول الشريعة',
            },
            {
              name: 'فضيلة الشيخ د. أحمد بن محمد الأمين',
              role: 'رئيس المقرأة القرآنية الدولية',
              spec: 'خبير الإجازات والأسانيد المتصلة ومناهج التحفيظ',
            },
            {
              name: 'سعادة المستشار د. إبراهيم وقاص',
              role: 'أمين عام الأوقاف وصناديق التنمية',
              spec: 'خبير الحوكمة المالية والاستثمار الوقفي الإسلامي',
            },
          ].map((leader, i) => (
            <div
              key={i}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-right space-y-2 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-bold flex items-center justify-center font-mono">
                {i + 1}
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">{leader.name}</h4>
              <div className="text-xs text-amber-400 font-semibold">{leader.role}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{leader.spec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Global Spread Across 120 Countries */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-right space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <span>الانتشار الجغرافي والمقارئ الإقليمية والدولية</span>
            </h3>
            <p className="text-xs text-slate-400">
              ينتشر مجمع النور في أكثر من 120 دولة عبر شبكة المقارئ المباشرة والفصول الإلكترونية
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">
            120 فرعاً ومقرأة
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { region: 'العالم العربي والخليج', count: '42 مركزاً ومقرأة' },
            { region: 'شرق وجنوب آسيا', count: '35 مركزاً ومقرأة' },
            { region: 'إفريقيا الكبرى', count: '28 مركزاً ومقرأة' },
            { region: 'أوروبا والأمريكيتين', count: '15 مركزاً ومقرأة' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-white">{item.region}</div>
              <div className="text-amber-400 font-mono text-[11px]">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
