import React, { useState } from 'react';
import { 
  ShieldCheck, Users, BookOpen, Award, CheckCircle, 
  AlertTriangle, Filter, Eye, RefreshCw, BarChart2, Globe, HeartHandshake 
} from 'lucide-react';
import { NavigationPage } from '../../types';

interface AdminDashboardPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'students' | 'moderation'>('overview');

  // Sample pending registrations
  const [registrations, setRegistrations] = useState([
    {
      id: 'REG-89210',
      studentName: 'سفيان بن عبد العزيز الخالدي',
      country: 'المملكة العربية السعودية',
      email: 'sufyan@example.com',
      track: 'إجازة في القراءات العشر الكبرى',
      level: 'متقدم (حافظ لكتاب الله)',
      date: 'منذ ساعتين',
      status: 'pending',
    },
    {
      id: 'REG-89209',
      studentName: 'إبراهيم مصطفى تراوري',
      country: 'السنغال',
      email: 'ibrahim.t@example.com',
      track: 'حفظ القرآن الكريم وتصحيح التلاوة',
      level: 'متوسط (15 جزءاً)',
      date: 'منذ 5 ساعات',
      status: 'pending',
    },
    {
      id: 'REG-89208',
      studentName: 'مالك عبد السلام إدريس',
      country: 'المملكة المتحدة (UK)',
      email: 'malik.idris@example.co.uk',
      track: 'شرح متن الجزرية وعلم التجويد',
      level: 'مبتدئ',
      date: 'أمس',
      status: 'approved',
    },
  ]);

  const handleApprove = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-amber-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>لوحة المتابعة والحوكمة المؤسسية • الإدارة العامة لمجمع النور العالمي</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            مؤشرات الأداء والرقابة الأكاديمية والوقفية
          </h1>

          <p className="text-xs text-slate-300 leading-relaxed">
            متابعة فورية لنشاط المقارئ العالمية، والطلاب المسجلين، وسجلات الحلقات، واعتماد الشهادات بالسند المتصل وفق معايير الحوكمة الإسلامية المعتمدة.
          </p>
        </div>
      </div>

      {/* Global Real-time Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الطلاب النشطين', value: '28,450', sub: 'في 142 دولة', icon: Users, color: 'text-amber-400' },
          { label: 'ساعات التسميع الشهرية', value: '14,200', sub: 'ساعة إقراء معتمدة', icon: BookOpen, color: 'text-emerald-400' },
          { label: 'المقرئون والعلماء المعتمدون', value: '185', sub: 'يحملون أسانيد متصلة', icon: Award, color: 'text-blue-400' },
          { label: 'الصناديق الوقفية الخاضعة للتدقيق', value: '6 صناديق', sub: 'حوكمة ورقابة شرعية', icon: HeartHandshake, color: 'text-purple-400' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-black text-white font-mono">{stat.value}</p>
              <p className="text-[11px] text-slate-500">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Administrative Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto text-xs font-bold no-scrollbar">
        {[
          { id: 'overview', label: 'طلبات التسجيل الأكاديمية الجديدة' },
          { id: 'teachers', label: 'إدارة المقارئ والأساتذة المجازين' },
          { id: 'moderation', label: 'مراجعة استفسارات الملتقى العلمي' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: REGISTRATIONS AUDIT */}
      {activeTab === 'overview' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">طلبات الالتحاق بمقارئ تحفيظ القرآن وإجازة القراءات</h3>
            <span className="text-xs text-slate-400 font-mono">3 طلبات جديدة هذا الأسبوع</span>
          </div>

          <div className="space-y-3">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{reg.studentName}</span>
                    <span className="text-slate-400">({reg.country})</span>
                    <span className="font-mono text-[10px] text-slate-500">#{reg.id}</span>
                  </div>
                  <p className="text-slate-400">
                    المسار: <span className="text-amber-300 font-medium">{reg.track}</span> • المستوى: {reg.level}
                  </p>
                  <p className="text-[11px] text-slate-500">البريد: {reg.email} • {reg.date}</p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {reg.status === 'approved' ? (
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-xl font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      معتمد في الحلقة
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprove(reg.id)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold rounded-xl transition shadow"
                    >
                      اعتماد الطالب وتعيين الشيخ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TEACHERS */}
      {activeTab === 'teachers' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            المقارئ الفعالة وهيئة التدريس المعتمدة
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            جميع الشيوخ والمقرئين تم التحقق من أسانيدهم المتصلة وتزكيات كبار أئمة الإقراء في العالم الإسلامي.
          </p>
          <div className="p-4 bg-emerald-950/30 border border-emerald-900 rounded-2xl text-emerald-300 text-xs font-semibold">
            حالة البث والاتصال السحابي: مستقرة (100% جهوزية) عبر ملقمات مجمع النور العالمية.
          </div>
        </div>
      )}

      {/* TAB CONTENT: MODERATION */}
      {activeTab === 'moderation' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            مراجعة منشورات وأسئلة طلبة العلم
          </h3>
          <p className="text-xs text-slate-400">
            تتم مراجعة كافة الأسئلة الشرعية قبل إحالتها للمشايخ لمنع التكرار وضمان الالتزام بالأدب العلمي الرصين.
          </p>
        </div>
      )}
    </div>
  );
};
