import React, { useState } from 'react';
import { 
  ShieldCheck, Users, BookOpen, Award, CheckCircle, 
  AlertTriangle, Filter, Eye, RefreshCw, BarChart2, Globe, HeartHandshake 
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { ServiceStatusDashboard } from '../ServiceStatusDashboard';

interface AdminDashboardPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orphansAudit' | 'dawahInquiries' | 'teachers' | 'students' | 'moderation' | 'services'>('overview');
  const [dawahFilter, setDawahFilter] = useState<'all' | 'free_quran' | 'question' | 'counselor_request'>('all');

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

  const [orphansList, setOrphansList] = useState([
    {
      id: 'APP-9901',
      trackingNumber: 'ALNOOR-ORPHAN-841920',
      applicantName: 'آمنة عبد الله البشير',
      orphanName: 'عمر عثمان إبراهيم',
      phone: '+249912169169',
      address: 'الخرطوم بحري - الحلفايا',
      status: 'field_visit',
      statusLabel: 'زيارة باحث ميداني',
    },
    {
      id: 'APP-9902',
      trackingNumber: 'ALNOOR-ORPHAN-712894',
      applicantName: 'خديجة محمد الأمين',
      orphanName: 'سارة عبد الرحمن',
      phone: '+249912445566',
      address: 'أم درمان - الثورة',
      status: 'approved',
      statusLabel: 'معتمد للكفالة الشهرية',
    }
  ]);

  const [dawahList, setDawahList] = useState([
    {
      id: 'INQ-8801',
      trackingCode: 'ALNOOR-DAWAH-104928',
      inquiryType: 'free_quran',
      fullName: 'David M. Miller',
      email: 'david.m@example.com',
      country: 'United States',
      message: 'Requesting an English translation of the Holy Quran for comparative study.',
      status: 'assigned',
      mentor: 'د. بلال العمري',
    },
    {
      id: 'INQ-8802',
      trackingCode: 'ALNOOR-DAWAH-104929',
      inquiryType: 'question',
      fullName: 'Marc Dupont',
      email: 'm.dupont@example.fr',
      country: 'France',
      message: 'Dialogue sur la fraternité humaine et la science en Islam.',
      status: 'in_dialogue',
      mentor: 'أ. طارق المغربي',
    }
  ]);

  const handleApprove = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
  };

  const handleApproveOrphan = (id: string) => {
    setOrphansList((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'approved', statusLabel: 'معتمد للكفالة' } : o))
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
            متابعة فورية لنشاط المقارئ العالمية، والطلاب المسجلين، وملفات كفالة الأيتام (بنك الخرطوم 1727654 باسم الشيخ الهادي سالم)، واستفسارات الدعوة العالمية، واعتماد الشهادات وفق معايير الحوكمة الإسلامية المعتمدة.
          </p>
        </div>
      </div>

      {/* Global Real-time Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الطلاب النشطين', value: '28,450', sub: 'في 142 دولة', icon: Users, color: 'text-amber-400' },
          { label: 'أيتام قيد الرعاية والكفالة', value: '1,280 يتيماً', sub: 'بنك الخرطوم 1727654', icon: HeartHandshake, color: 'text-rose-400' },
          { label: 'المقرئون والعلماء المعتمدون', value: '185', sub: 'يحملون أسانيد متصلة', icon: Award, color: 'text-blue-400' },
          { label: 'استفسارات الدعوة العالمية', value: '2,490', sub: 'تواصل مع غير المسلمين', icon: Globe, color: 'text-emerald-400' },
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
          { id: 'overview', label: 'طلبات التسجيل الأكاديمية' },
          { id: 'orphansAudit', label: 'كفالة الأيتام وبنك الخرطوم (1727654) 💙' },
          { id: 'dawahInquiries', label: 'استفسارات الدعوة والمصاحف 🌐' },
          { id: 'services', label: 'مراقبة حالة الخدمات السحابية ⚡' },
          { id: 'teachers', label: 'المقارئ وهيئة التدريس' },
          { id: 'moderation', label: 'مراجعة استفسارات الملتقى' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
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

      {/* TAB CONTENT: ORPHANS AUDIT & BANK OF KHARTOUM 1727654 */}
      {activeTab === 'orphansAudit' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-rose-400" />
                <span>طلبات كفالة الأيتام والرعاية الميدانية</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                حساب التبرع المعتمد: بنك الخرطوم (1727654) باسم الشيخ الهادي سالم / مدير مجمع النور
              </p>
            </div>
            <span className="text-xs text-amber-400 font-mono">1,280 يتيماً تحت الرعاية الشاملة</span>
          </div>

          <div className="space-y-3">
            {orphansList.map((orphan) => (
              <div
                key={orphan.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">اليتيم: {orphan.orphanName}</span>
                    <span className="text-slate-400">• ولي الأمر: {orphan.applicantName}</span>
                    <span className="font-mono text-[10px] text-amber-400">#{orphan.trackingNumber}</span>
                  </div>
                  <p className="text-slate-400">
                    العنوان: <span className="text-slate-300 font-medium">{orphan.address}</span> • الهاتف: {orphan.phone}
                  </p>
                  <p className="text-[11px] text-rose-300">
                    الحالة الحالية: <span className="font-bold">{orphan.statusLabel}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {orphan.status === 'approved' ? (
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-xl font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      معتمد للصرف الشهري
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApproveOrphan(orphan.id)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold rounded-xl transition shadow cursor-pointer"
                    >
                      اعتماد الكفالة وتخصيص الكافل
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: GLOBAL DAWAH INQUIRIES & FREE QURAN DISPATCH */}
      {activeTab === 'dawahInquiries' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>استفسارات الدعوة العالمية وطلبات نسخ المصاحف المترجمة</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                واردة من مركز التعريف بالإسلام (Discover Islam) ومكتبة الشيخ ديدات
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono">2,490 استفساراً معالجاً</span>
          </div>

          <div className="space-y-3">
            {dawahList.map((inq) => (
              <div
                key={inq.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{inq.fullName}</span>
                    <span className="text-slate-400">({inq.country})</span>
                    <span className="font-mono text-[10px] text-cyan-400">#{inq.trackingCode}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-300 border border-amber-500/30">
                      {inq.inquiryType === 'free_quran' ? 'طلب ترجمة القرآن' : 'حوار واستفسار'}
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans">
                    الرسالة: "{inq.message}"
                  </p>
                  <p className="text-[11px] text-slate-500">
                    البريد: {inq.email} • الداعية المعين: <span className="text-emerald-400 font-bold">{inq.mentor}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800/60 rounded-xl font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    قيد الحوار والمتابعة
                  </span>
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

      {/* TAB CONTENT: SERVICES HEALTH MONITOR */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <ServiceStatusDashboard />
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
