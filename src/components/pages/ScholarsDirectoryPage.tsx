import React, { useState } from 'react';
import { 
  Users, Award, Calendar, Globe, 
  ShieldCheck, CheckCircle, Search, Star
} from 'lucide-react';
import { SCHOLARS_DIRECTORY } from '../../data/hadithAndScholarsData';
import { ScholarProfile, NavigationPage } from '../../types';

interface ScholarsDirectoryPageProps {
  onNavigate: (page: NavigationPage) => void;
  initialScholarId?: string;
}

export const ScholarsDirectoryPage: React.FC<ScholarsDirectoryPageProps> = () => {
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
    <div className="space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-900/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
            <Users className="w-4 h-4" />
            <span>هيئة كبار العلماء والمقرئين المعتمدين • مجمع النور العالمي</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            نخبةٌ من علماء الأمة المجازين بأعلى الأسانيد النبوية المتصلة
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            يضم مجمع النور مجلساً علمياً دولياً معتمداً من كبار أئمة الإقراء وعلماء الفقه والحديث واللغة، يمنحون الإجازات بالسند المتصل ويشرفون على الحلقات والبحوث العلمية.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>إجازات معتمدة بالسند المتصل</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>جلسات إقراء فردية مباشرة</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>علماء من مكة، المدينة، الأزهر، والشنقيط</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم العالم، التخصص، أو الدولة..."
            className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        </div>

        {/* Specialty Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs no-scrollbar">
          <span className="text-slate-400 ml-1 whitespace-nowrap">التخصص:</span>
          {[
            { id: 'all', label: 'جميع العلماء' },
            { id: 'علوم القرآن والقراءات', label: 'القراءات العشر' },
            { id: 'الحديث الشريف وعلومه', label: 'علوم الحديث' },
            { id: 'الفقه المقارن والأصول', label: 'الفقه المقارن' },
            { id: 'اللغة العربية والبلاغة', label: 'اللغة والبلاغة' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedSpecialty(item.id)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                selectedSpecialty === item.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scholars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredScholars.map((scholar) => (
          <div
            key={scholar.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-emerald-700/60 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 transition duration-200"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  {scholar.specialization}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  {scholar.country} • {scholar.city}
                </span>
              </div>

              <div>
                <span className="text-xs text-amber-400 font-semibold block">{scholar.title}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{scholar.name}</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {scholar.bio}
              </p>

              {/* Ijazahs Brief */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                <span className="text-amber-400 font-bold block text-[11px]">الإجازات والأسانيد المعتمدة:</span>
                <ul className="text-slate-300 text-[11px] leading-relaxed space-y-0.5">
                  {scholar.ijazahs.slice(0, 2).map((ijazah, idx) => (
                    <li key={idx} className="line-clamp-1">• {ijazah}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>الطلاب النشطون: <span className="font-bold text-white font-mono">{scholar.activeStudents}+</span></span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current text-amber-400" />
                  {scholar.rating} تقييم التلقي
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedScholar(scholar)}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>حجز موعد إقراء ({scholar.sessionDuration})</span>
                </button>

                <button
                  onClick={() => setSelectedScholar(scholar)}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-bold">{selectedScholar.specialization}</span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedScholar.name}</h3>
                <p className="text-xs text-slate-400">{selectedScholar.title} • {selectedScholar.country}</p>
              </div>
              <button
                onClick={() => setSelectedScholar(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                إغلاق
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-4 bg-emerald-950 border border-emerald-600 text-emerald-200 rounded-2xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold">{bookingSuccess}</span>
              </div>
            ) : (
              <>
                <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <h4 className="font-bold text-amber-400 text-xs">نبذة عن المسيرة العلمية والإقرائية:</h4>
                  <p>{selectedScholar.bio}</p>
                </div>

                <div className="p-4 bg-emerald-950/30 border border-emerald-900/60 rounded-2xl space-y-2 text-xs">
                  <h5 className="font-bold text-amber-400">الإجازات والأسانيد المسندة:</h5>
                  <ul className="space-y-1 text-slate-300">
                    {selectedScholar.ijazahs.map((ijazah, i) => (
                      <li key={i}>• {ijazah}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="font-bold text-amber-400 text-xs">
                    الأيام المتاحة لحجز جلسة تسميع أو استشارة علمية (مدة الجلسة: {selectedScholar.sessionDuration}):
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {selectedScholar.availableDays.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleBookSession(day)}
                        className="p-2.5 bg-slate-950 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500 rounded-xl text-right transition flex items-center justify-between group"
                      >
                        <span className="text-slate-300 group-hover:text-amber-300">{day}</span>
                        <Calendar className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
