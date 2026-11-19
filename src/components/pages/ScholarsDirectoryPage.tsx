import React, { useState } from 'react';
import {
  Users, Calendar, Globe,
  ShieldCheck, CheckCircle, Search, Star
} from 'lucide-react';
import { SCHOLARS_DIRECTORY } from '../../data/hadithAndScholarsData';
import { ScholarProfile, NavigationPage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface ScholarsDirectoryPageProps {
  onNavigate: (page: NavigationPage) => void;
  initialScholarId?: string;
}

export const ScholarsDirectoryPage: React.FC<ScholarsDirectoryPageProps> = () => {
  const { isRtl } = useLanguage();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedScholar, setSelectedScholar] = useState<ScholarProfile | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const filteredScholars = SCHOLARS_DIRECTORY.filter((scholar) => {
    if (selectedSpecialty !== 'all' && scholar.specialization !== selectedSpecialty) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = scholar.name.toLowerCase().includes(q);
      const inSpec = scholar.specialization.toLowerCase().includes(q);
      const inTitle = scholar.title.toLowerCase().includes(q);
      const inCountry = scholar.country.toLowerCase().includes(q);
      if (!inName && !inSpec && !inTitle && !inCountry) return false;
    }
    return true;
  });

  const handleBookSession = (day: string) => {
    if (!selectedScholar) return;
    setBookingSuccess(`تم تأكيد حجز جلستك العلمية الفردية مع ${selectedScholar.name} يوم ${day}. تم إرسال رابط الغرفة الافتراضية المباشرة إلى بريدك الإلكتروني.`);
    setTimeout(() => {
      setBookingSuccess(null);
      setSelectedScholar(null);
    }, 4000);
  };

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sky-Blue 3D Header Banner */}
      <div className="bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] border border-[#87CEEB]/55 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-white">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Sky3DIcon slug="scholars" tone="gold" size="md" />
            <p className="text-xs font-bold text-[#87CEEB] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#F7E7B4]" />
              <span>هيئة كبار العلماء والمقرئين المعتمدين · مجمع النور العالمي</span>
            </p>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-amiri text-white leading-tight">
            نخبةٌ من علماء الأمة المجازين بأعلى الأسانيد النبوية المتصلة
          </h1>

          <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed">
            يضم مجمع النور مجلساً علمياً دولياً معتمداً من كبار أئمة الإقراء وعلماء الفقه والحديث واللغة، يمنحون الإجازات بالسند المتصل ويشرفون على الحلقات والبحوث العلمية.
          </p>

          <div className="flex flex-wrap gap-3 pt-2 text-xs text-white">
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-[#87CEEB]/40">
              <ShieldCheck className="w-4 h-4 text-[#F7E7B4]" />
              <span>إجازات معتمدة بالسند المتصل</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-[#87CEEB]/40">
              <Calendar className="w-4 h-4 text-[#87CEEB]" />
              <span>جلسات إقراء فردية مباشرة</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-[#87CEEB]/40">
              <Globe className="w-4 h-4 text-[#5EEAD4]" />
              <span>علماء من مكة، المدينة، الأزهر، والشنقيط</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="sky-card-3d rounded-3xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم العالم، التخصص، أو الدولة..."
            className="w-full pl-4 pr-10 py-2.5 bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 rounded-xl text-[#12345A] dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#0EA5A4]"
          />
          <Search className="w-4 h-4 text-[#0EA5A4] absolute right-3.5 top-3" />
        </div>

        {/* Specialty Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs no-scrollbar">
          <span className="text-[#12345A] dark:text-[#EAF8FF] font-bold ml-1 whitespace-nowrap">التخصص:</span>
          {[
            { id: 'all', label: 'جميع العلماء' },
            { id: 'علوم القرآن والقراءات', label: 'القراءات العشر' },
            { id: 'الحديث الشريف وعلومه', label: 'علوم الحديث' },
            { id: 'الفقه المقارن والأصول', label: 'الفقه المقارن' },
            { id: 'اللغة العربية والبلاغة', label: 'اللغة والبلاغة' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedSpecialty(item.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedSpecialty === item.id
                  ? 'bg-[#12345A] text-white dark:bg-[#0EA5A4] shadow-sm'
                  : 'bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/50 text-[#12345A] dark:text-[#B8DEF5]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scholars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScholars.map((scholar) => (
          <div
            key={scholar.id}
            className="sky-card-3d rounded-3xl p-6 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between text-xs">
                <span className="font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
                  {scholar.specialization}
                </span>
                <span className="text-[#4A7298] dark:text-[#B8DEF5] flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#0EA5A4]" />
                  {scholar.country} · {scholar.city}
                </span>
              </div>

              <div>
                <span className="text-xs text-[#0EA5A4] font-bold block">{scholar.title}</span>
                <h3 className="text-lg font-black text-[#12345A] dark:text-white mt-0.5 font-amiri">{scholar.name}</h3>
              </div>

              <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed line-clamp-3">
                {scholar.bio}
              </p>

              {/* Ijazahs Brief */}
              <div className="p-3.5 bg-[#EAF8FF]/85 dark:bg-[#0F2747] rounded-2xl border border-[#87CEEB]/45 dark:border-[#87CEEB]/20 space-y-1 text-xs">
                <span className="text-[#0D7A7A] dark:text-[#F7E7B4] font-bold block text-[11px]">الإجازات والأسانيد المعتمدة:</span>
                <ul className="text-[#12345A] dark:text-[#EAF8FF] text-[11px] leading-relaxed space-y-0.5">
                  {scholar.ijazahs.slice(0, 2).map((ijazah, idx) => (
                    <li key={idx} className="line-clamp-1">• {ijazah}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#4A7298] dark:text-[#B8DEF5]">
                <span>الطلاب النشطون: <span className="font-bold text-[#12345A] dark:text-white font-mono">{scholar.activeStudents}+</span></span>
                <span className="text-[#0EA5A4] font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                  {scholar.rating} تقييم التلقي
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedScholar(scholar)}
                  className="w-full py-2.5 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>حجز موعد إقراء ({scholar.sessionDuration})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedScholar(scholar)}
                  className="px-3.5 py-2.5 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/55 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  السيرة
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scholar Profile & Booking Modal */}
      {selectedScholar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091B33]/75 backdrop-blur-md">
          <div className="w-full max-w-xl sky-card-3d rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-4">
              <div>
                <span className="text-xs text-[#0D7A7A] dark:text-[#87CEEB] font-bold">{selectedScholar.specialization}</span>
                <h3 className="text-xl font-black text-[#12345A] dark:text-white mt-1 font-amiri">{selectedScholar.name}</h3>
                <p className="text-xs text-[#4A7298] dark:text-[#B8DEF5]">{selectedScholar.title} · {selectedScholar.country}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScholar(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#12345A] dark:text-white bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#87CEEB]/50 cursor-pointer"
              >
                إغلاق
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-4 bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#0EA5A4] text-[#12345A] dark:text-[#EAF8FF] rounded-2xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#0EA5A4] shrink-0" />
                <span className="text-xs sm:text-sm font-bold">{bookingSuccess}</span>
              </div>
            ) : (
              <>
                <div className="space-y-3 text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                  <h4 className="font-bold text-[#12345A] dark:text-[#87CEEB] text-xs">نبذة عن المسيرة العلمية والإقرائية:</h4>
                  <p>{selectedScholar.bio}</p>
                </div>

                <div className="p-4 bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/50 rounded-2xl space-y-2 text-xs">
                  <h5 className="font-bold text-[#0D7A7A] dark:text-[#F7E7B4]">الإجازات والأسانيد المسندة:</h5>
                  <ul className="space-y-1 text-[#12345A] dark:text-[#EAF8FF]">
                    {selectedScholar.ijazahs.map((ijazah, i) => (
                      <li key={i}>• {ijazah}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#87CEEB]/40 dark:border-[#87CEEB]/20">
                  <h4 className="font-bold text-[#12345A] dark:text-[#87CEEB] text-xs">
                    الأيام المتاحة لحجز جلسة تسميع أو استشارة علمية (مدة الجلسة: {selectedScholar.sessionDuration}):
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {selectedScholar.availableDays.map((day, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleBookSession(day)}
                        className="p-2.5 bg-[#EAF8FF] dark:bg-[#0F2747] hover:border-[#0EA5A4] border border-[#87CEEB]/50 rounded-xl text-right transition flex items-center justify-between group cursor-pointer"
                      >
                        <span className="text-[#12345A] dark:text-white group-hover:text-[#0EA5A4] font-bold">{day}</span>
                        <Calendar className="w-3.5 h-3.5 text-[#0EA5A4]" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <SectionDynamicItems sectionSlug="scholars" />
    </div>
  );
};
