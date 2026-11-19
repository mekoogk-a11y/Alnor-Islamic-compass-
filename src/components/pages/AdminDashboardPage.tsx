import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, Building2, BookOpen, CheckCircle,
  Globe, HeartHandshake, Mail, Globe2, RefreshCw, Video,
  FolderPlus, Trash2, ExternalLink, AlertCircle, PlusCircle
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { ServiceStatusDashboard } from '../ServiceStatusDashboard';
import { AdminVideoManager } from '../AdminVideoManager';
import { useLanguage } from '../../context/LanguageContext';
import { auth } from '../../services/firebase';
import { CAMPUS_BUILDINGS } from '../../data/campusData';
import { PORTAL_SECTIONS } from '../../data/portalSections';

interface AdminDashboardPageProps {
  onNavigate: (page: NavigationPage) => void;
}

interface SectionItemRow {
  id: number;
  section: string;
  title: string;
  body: string;
  url: string;
  adminUid: string;
  createdAt: string;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'sectionContent'
    | 'videoStudio'
    | 'orphansAudit'
    | 'dawahInquiries'
    | 'campusSubmissions'
    | 'teachers'
    | 'moderation'
    | 'services'
  >('overview');

  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Dynamic Section Content State (PostgreSQL section_items)
  const [sectionItems, setSectionItems] = useState<SectionItemRow[]>([]);
  const [loadingSectionItems, setLoadingSectionItems] = useState(false);
  const [submittingSectionItem, setSubmittingSectionItem] = useState(false);
  const [sectionFormSlug, setSectionFormSlug] = useState<string>(PORTAL_SECTIONS[0]?.slug || 'quran');
  const [sectionFormTitle, setSectionFormTitle] = useState('');
  const [sectionFormBody, setSectionFormBody] = useState('');
  const [sectionFormUrl, setSectionFormUrl] = useState('');
  const [sectionFilterSlug, setSectionFilterSlug] = useState<string>('all');
  const [sectionStatusMessage, setSectionStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [registrations, setRegistrations] = useState([
    {
      id: 'REG-89210',
      studentName: 'سفيان بن عبد العزيز الخالدي',
      country: 'المملكة العربية السعودية',
      email: 'sufyan@example.com',
      track: 'إجازة في القراءات العشر الكبرى',
      level: 'متقدم (حافظ لكتاب الله)',
      date: 'قيد المراجعة الأكاديمية',
      status: 'pending',
    },
    {
      id: 'REG-89209',
      studentName: 'إبراهيم مصطفى تراوري',
      country: 'السنغال',
      email: 'ibrahim.t@example.com',
      track: 'حفظ القرآن الكريم وتصحيح التلاوة',
      level: 'متوسط',
      date: 'قيد المراجعة الأكاديمية',
      status: 'pending',
    },
    {
      id: 'REG-89208',
      studentName: 'مالك عبد السلام إدريس',
      country: 'المملكة المتحدة',
      email: 'malik.idris@example.co.uk',
      track: 'شرح متن الجزرية وعلم التجويد',
      level: 'مبتدئ',
      date: 'معتمد',
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

  const [dawahList] = useState([
    {
      id: 'INQ-8801',
      trackingCode: 'ALNOOR-DAWAH-104928',
      inquiryType: 'free_quran',
      fullName: 'David M. Miller',
      email: 'david.m@example.com',
      country: 'United States',
      message: 'Requesting an English translation of the Holy Quran for comparative study.',
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
      mentor: 'أ. طارق المغربي',
    }
  ]);

  const fetchCampusSubmissions = useCallback(async () => {
    setLoadingSubmissions(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        setLoadingSubmissions(false);
        return;
      }
      const res = await fetch('/api/v1/campus/admin-submissions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.success && json.data) {
          setPartnerships(json.data.partnerships || []);
          setContacts(json.data.contacts || []);
        }
      }
    } catch (e) {
      console.warn('Could not load campus admin submissions:', e);
    } finally {
      setLoadingSubmissions(false);
    }
  }, []);

  const fetchAllSectionItems = useCallback(async () => {
    setLoadingSectionItems(true);
    try {
      const res = await fetch('/api/v1/sections/items/all');
      if (res.ok) {
        const json = await res.json();
        if (json?.success && Array.isArray(json.data)) {
          setSectionItems(json.data);
        }
      }
    } catch (e) {
      console.warn('Could not fetch section items:', e);
    } finally {
      setLoadingSectionItems(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'campusSubmissions') {
      fetchCampusSubmissions();
    } else if (activeTab === 'sectionContent') {
      fetchAllSectionItems();
    }
  }, [activeTab, fetchCampusSubmissions, fetchAllSectionItems]);

  const handleCreateSectionItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSectionStatusMessage(null);

    if (!sectionFormTitle.trim()) {
      setSectionStatusMessage({
        type: 'error',
        text: isAr ? 'يرجى إدخال عنوان المادة أو الإعلان.' : 'Please enter an item title.',
      });
      return;
    }

    setSubmittingSectionItem(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        setSectionStatusMessage({
          type: 'error',
          text: isAr ? 'يلزم تسجيل الدخول بحساب المشرف المخول للنشر.' : 'Authorized admin sign-in required.',
        });
        return;
      }

      const res = await fetch('/api/v1/admin/section-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section: sectionFormSlug,
          title: sectionFormTitle.trim(),
          body: sectionFormBody.trim(),
          url: sectionFormUrl.trim(),
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setSectionStatusMessage({
          type: 'error',
          text: json?.error?.message || (isAr ? 'تعذر حفظ المادة الجديدة.' : 'Failed to publish section item.'),
        });
        return;
      }

      if (json.data) {
        setSectionItems((prev) => [json.data, ...prev]);
      } else {
        await fetchAllSectionItems();
      }
      setSectionFormTitle('');
      setSectionFormBody('');
      setSectionFormUrl('');
      setSectionStatusMessage({
        type: 'success',
        text: isAr ? 'تم نشر المحتوى في القسم بنجاح وسيظهر للزوار فوراً.' : 'Section item published successfully.',
      });
    } catch (err) {
      console.error('Publish section item error:', err);
      setSectionStatusMessage({
        type: 'error',
        text: isAr ? 'حدث خطأ أثناء الاتصال بالخادم.' : 'Network error publishing item.',
      });
    } finally {
      setSubmittingSectionItem(false);
    }
  };

  const handleDeleteSectionItem = async (id: number) => {
    setSectionStatusMessage(null);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        setSectionStatusMessage({
          type: 'error',
          text: isAr ? 'يلزم تسجيل الدخول بحساب المشرف للحذف.' : 'Admin sign-in required.',
        });
        return;
      }

      const res = await fetch(`/api/v1/admin/section-items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setSectionStatusMessage({
          type: 'error',
          text: json?.error?.message || (isAr ? 'تعذر حذف العنصر.' : 'Failed to delete item.'),
        });
        return;
      }

      setSectionItems((prev) => prev.filter((item) => item.id !== id));
      setSectionStatusMessage({
        type: 'success',
        text: isAr ? 'تم حذف العنصر من قاعدة البيانات.' : 'Item deleted from database.',
      });
    } catch (err) {
      console.error('Delete section item error:', err);
      setSectionStatusMessage({
        type: 'error',
        text: isAr ? 'حدث خطأ أثناء حذف العنصر.' : 'Network error deleting item.',
      });
    }
  };

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

  const displayedSectionItems = sectionItems.filter(
    (item) => sectionFilterSlug === 'all' || item.section === sectionFilterSlug
  );

  const getSectionTitle = (slug: string) => {
    const found = PORTAL_SECTIONS.find((s) => s.slug === slug);
    if (!found) return slug;
    return isAr ? found.titleAr : found.titleEn;
  };

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="sky-card-3d rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>
              {isAr
                ? 'لوحة المتابعة والحوكمة المؤسسية · الإدارة العامة لمجمع النور العالمي'
                : 'Institutional Governance & Operations Console · Al Noor Global Complex'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-amiri text-[#12345A] dark:text-white leading-tight">
            {isAr ? 'الرقابة الأكاديمية والإدارية والوقفية الموحدة' : 'Unified Academic, Endowment & Campus Operations'}
          </h1>

          <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            {isAr
              ? 'إدارة ملفات التسجيل بالمقارئ، ونشر محتوى أقسام المجمع، ومراجعة طلبات كفالة الأيتام (حساب بنك الخرطوم 1727654 باسم الشيخ الهادي سالم)، وإدارة المكتبة المرئية والرسائل الواردة.'
              : 'Manage student admissions, dynamic section publishing, orphan sponsorship workflows (Bank of Khartoum #1727654), Cloudflare Stream video studio, and institutional contact inquiries.'}
          </p>
        </div>
      </div>

      {/* Verified Structural & Live Queue Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: isAr ? 'أجنحة ومباني المجمع' : 'Campus Departments',
            value: String(CAMPUS_BUILDINGS.length),
            sub: isAr ? 'أقسام تعليمية وبحثية وخيرية' : 'Operational architectural wings',
            icon: Building2,
          },
          {
            label: isAr ? 'طلبات التسجيل بالقائمة' : 'Admissions Queue',
            value: String(registrations.length),
            sub: isAr ? 'ملفات التحفيظ والإجازات' : 'Student enrollment records',
            icon: BookOpen,
          },
          {
            label: isAr ? 'ملفات كفالة الأيتام المسجلة' : 'Sponsorship Cases',
            value: String(orphansList.length),
            sub: isAr ? 'بنك الخرطوم 1727654 المعتمد' : 'Verified bank channel #1727654',
            icon: HeartHandshake,
          },
          {
            label: isAr ? 'أقسام المنصة التفاعلية' : 'Portal Sections',
            value: String(PORTAL_SECTIONS.length),
            sub: isAr ? 'أقسام قابلة للنشر والتحديث المباشر' : 'Configurable 3D portal wings',
            icon: Globe,
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="sky-card-3d rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2B547E] dark:text-[#B8DEF5]">{stat.label}</span>
                <Icon className="w-5 h-5 text-[#0EA5A4] dark:text-[#87CEEB]" />
              </div>
              <p className="text-2xl font-black text-[#12345A] dark:text-white font-mono tabular-nums">{stat.value}</p>
              <p className="text-[11px] text-[#4A7298] dark:text-[#84B4D6]">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Administrative Navigation Tabs */}
      <div className="sky-glass-panel flex items-center gap-2 p-2 rounded-2xl overflow-x-auto text-xs font-bold no-scrollbar">
        {[
          { id: 'overview', label: isAr ? 'طلبات التسجيل الأكاديمية' : 'Admissions Queue' },
          { id: 'sectionContent', label: isAr ? 'إدارة محتوى الأقسام' : 'Section Content Manager' },
          { id: 'videoStudio', label: isAr ? 'إدارة المكتبة المرئية والبث' : 'Video Management Studio' },
          { id: 'orphansAudit', label: isAr ? 'كفالة الأيتام وبنك الخرطوم (1727654)' : 'Orphans Audit (1727654)' },
          { id: 'campusSubmissions', label: isAr ? 'الشراكات الدولية ورسائل التواصل' : 'Partnerships & Contact' },
          { id: 'dawahInquiries', label: isAr ? 'استفسارات الدعوة والمصاحف' : 'Dawah Inquiries' },
          { id: 'services', label: isAr ? 'حالة الخدمات السحابية' : 'Cloud Health Monitor' },
          { id: 'teachers', label: isAr ? 'المقارئ وهيئة التدريس' : 'Faculty Status' },
          { id: 'moderation', label: isAr ? 'ضوابط الملتقى العلمي' : 'Forum Moderation' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#12345A] text-white dark:bg-[#87CEEB] dark:text-[#091B33] font-black shadow-sm'
                : 'text-[#12345A] dark:text-[#B8DEF5] hover:bg-white/80 dark:hover:bg-[#0F2747]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: SECTION CONTENT MANAGER (POSTGRESQL section_items) */}
      {activeTab === 'sectionContent' && (
        <div className="space-y-6">
          <div className="sky-card-3d rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#87CEEB]/45 dark:border-[#87CEEB]/20 pb-3">
              <div className="space-y-1">
                <h3 className="text-lg font-black font-amiri text-[#12345A] dark:text-white flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-[#0EA5A4]" />
                  <span>{isAr ? 'نشر مواد وإعلانات وروابط في أقسام المجمع' : 'Publish Resources & Announcements to Portal Sections'}</span>
                </h3>
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                  {isAr
                    ? 'تُحفظ جميع الإضافات في قاعدة بيانات Cloud SQL PostgreSQL وتظهر مباشرة داخل صفحة القسم المختار.'
                    : 'Items saved to Cloud SQL PostgreSQL immediately appear inside the target section page.'}
                </p>
              </div>
              <button
                type="button"
                onClick={fetchAllSectionItems}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#87CEEB]/60 text-xs font-bold text-[#12345A] dark:text-[#87CEEB] cursor-pointer self-start"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSectionItems ? 'animate-spin' : ''}`} />
                <span>{isAr ? 'تحديث القائمة' : 'Refresh'}</span>
              </button>
            </div>

            {sectionStatusMessage && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
                  sectionStatusMessage.type === 'success'
                    ? 'bg-[#EAF8FF] dark:bg-[#0F2747] border-[#0EA5A4] text-[#0D7A7A] dark:text-[#87CEEB]'
                    : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-200'
                }`}
              >
                {sectionStatusMessage.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{sectionStatusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateSectionItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] block">
                  {isAr ? 'القسم المستهدف *' : 'Target Section *'}
                </label>
                <select
                  value={sectionFormSlug}
                  onChange={(e) => setSectionFormSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 text-xs font-semibold text-[#12345A] dark:text-[#EAF8FF] focus:outline-none"
                >
                  {PORTAL_SECTIONS.map((sec) => (
                    <option key={sec.slug} value={sec.slug}>
                      {isAr ? sec.titleAr : sec.titleEn} ({sec.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] block">
                  {isAr ? 'العنوان الرئيسي للمادة *' : 'Resource Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={sectionFormTitle}
                  onChange={(e) => setSectionFormTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: جدول حلقات التلاوة الصيفية 2026' : 'e.g. Summer Recitation Schedule'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#091B33] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 text-xs text-[#12345A] dark:text-[#EAF8FF] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] block">
                  {isAr ? 'التفاصيل أو النص العلمي' : 'Details / Body'}
                </label>
                <textarea
                  rows={3}
                  value={sectionFormBody}
                  onChange={(e) => setSectionFormBody(e.target.value)}
                  placeholder={isAr ? 'اكتب ملخصاً أو نصاً علمياً أو تعليمات للزوار...' : 'Enter description or announcement details...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#091B33] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 text-xs text-[#12345A] dark:text-[#EAF8FF] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] block">
                  {isAr ? 'رابط خارجي أو مسار داخلي (اختياري)' : 'Resource URL (Optional)'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={sectionFormUrl}
                  onChange={(e) => setSectionFormUrl(e.target.value)}
                  placeholder="https://www.mojamaalnor.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#091B33] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 text-xs text-[#12345A] dark:text-[#EAF8FF] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submittingSectionItem}
                  className="px-5 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] disabled:opacity-60 text-white text-xs font-black flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>
                    {submittingSectionItem
                      ? isAr ? 'جاري النشر...' : 'Publishing...'
                      : isAr ? 'نشر في القسم' : 'Publish to Section'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Existing Published Section Items List */}
          <div className="sky-card-3d rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#87CEEB]/45 dark:border-[#87CEEB]/20 pb-3">
              <h4 className="text-base font-black font-amiri text-[#12345A] dark:text-white">
                {isAr
                  ? `المواد المنشورة حالياً (${displayedSectionItems.length})`
                  : `Published Section Items (${displayedSectionItems.length})`}
              </h4>

              <select
                value={sectionFilterSlug}
                onChange={(e) => setSectionFilterSlug(e.target.value)}
                aria-label={isAr ? 'تصفية حسب القسم' : 'Filter by section'}
                className="px-3 py-1.5 rounded-xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#87CEEB]/70 dark:border-[#87CEEB]/30 text-xs font-bold text-[#12345A] dark:text-[#EAF8FF]"
              >
                <option value="all">{isAr ? 'جميع الأقسام' : 'All Sections'}</option>
                {PORTAL_SECTIONS.map((sec) => (
                  <option key={sec.slug} value={sec.slug}>
                    {isAr ? sec.titleAr : sec.titleEn}
                  </option>
                ))}
              </select>
            </div>

            {loadingSectionItems ? (
              <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] py-4 text-center">
                {isAr ? 'جاري تحميل المواد المنشورة...' : 'Loading section items...'}
              </p>
            ) : displayedSectionItems.length === 0 ? (
              <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] p-6 rounded-2xl bg-[#EAF8FF] dark:bg-[#091B33] text-center">
                {isAr ? 'لا توجد مواد منشورة لهذا القسم بعد. يمكنك إضافة مادة جديدة من النموذج أعلاه.' : 'No items published for this section yet.'}
              </p>
            ) : (
              <div className="space-y-3">
                {displayedSectionItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#EAF8FF]/90 dark:bg-[#091B33] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-black text-[#12345A] dark:text-white text-sm">{item.title}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-bold text-[#0D7A7A] dark:text-[#87CEEB]">
                          {getSectionTitle(item.section)}
                        </span>
                      </div>
                      {item.body && (
                        <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">{item.body}</p>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0D7A7A] dark:text-[#87CEEB] hover:underline"
                          dir="ltr"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{item.url}</span>
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteSectionItem(item.id)}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white dark:bg-rose-950/60 dark:text-rose-200 dark:hover:bg-rose-700 border border-rose-200 dark:border-rose-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-end md:self-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'حذف' : 'Delete'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: REGISTRATIONS AUDIT */}
      {activeTab === 'overview' && (
        <div className="sky-card-3d rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#87CEEB]/45 dark:border-[#87CEEB]/20 pb-3">
            <h3 className="text-base font-black font-amiri text-[#12345A] dark:text-white">
              {isAr ? 'طلبات الالتحاق بمقارئ تحفيظ القرآن وإجازة القراءات' : 'Quran Memorization & Ijazah Enrollment Requests'}
            </h3>
            <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] font-mono tabular-nums">
              {registrations.length} {isAr ? 'ملفات' : 'records'}
            </span>
          </div>

          <div className="space-y-3">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="p-4 bg-[#EAF8FF]/90 dark:bg-[#091B33] rounded-2xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#12345A] dark:text-white text-sm">{reg.studentName}</span>
                    <span className="text-[#4A7298] dark:text-[#84B4D6]">({reg.country})</span>
                    <span className="font-mono text-[10px] text-[#0D7A7A] dark:text-[#D4AF37]">#{reg.id}</span>
                  </div>
                  <p className="text-[#2B547E] dark:text-[#B8DEF5]">
                    {isAr ? 'المسار:' : 'Track:'} <span className="text-[#12345A] dark:text-[#87CEEB] font-bold">{reg.track}</span> · {reg.level}
                  </p>
                  <p className="text-[11px] text-[#4A7298] dark:text-[#84B4D6]">{reg.email} · {reg.date}</p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {reg.status === 'approved' ? (
                    <span className="px-3 py-1.5 bg-white dark:bg-[#0F2747] text-[#0D7A7A] dark:text-[#87CEEB] border border-[#0EA5A4]/40 rounded-xl font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {isAr ? 'معتمد في الحلقة' : 'Approved'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApprove(reg.id)}
                      className="px-4 py-2 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold rounded-xl transition cursor-pointer"
                    >
                      {isAr ? 'اعتماد الطالب وتعيين الشيخ' : 'Approve & Assign Teacher'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: VIDEO MANAGEMENT STUDIO (CLOUDFLARE STREAM + TUS) */}
      {activeTab === 'videoStudio' && (
        <div className="space-y-4">
          <div className="sky-glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#12345A] dark:text-[#87CEEB] flex items-center gap-1.5">
              <Video className="w-4 h-4 text-[#0EA5A4]" />
              <span>{isAr ? 'بوابة إدارة الفيديوهات الرسمية والبث التكيفي' : 'Official Video Upload & Streaming Studio'}</span>
            </span>
            <button
              type="button"
              onClick={() => onNavigate('videoLibrary')}
              className="px-3.5 py-1.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-xs font-bold text-white cursor-pointer transition-colors"
            >
              {isAr ? 'معاينة المكتبة المرئية العامة' : 'View Public Video Library'}
            </button>
          </div>
          <AdminVideoManager />
        </div>
      )}

      {/* TAB: ORPHANS AUDIT */}
      {activeTab === 'orphansAudit' && (
        <div className="sky-card-3d rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#87CEEB]/45 dark:border-[#87CEEB]/20 pb-3">
            <div>
              <h3 className="text-base font-black font-amiri text-[#12345A] dark:text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
                <span>{isAr ? 'طلبات كفالة الأيتام والرعاية الميدانية' : 'Orphan Sponsorship & Field Verification Queue'}</span>
              </h3>
              <p className="text-[11px] text-[#2B547E] dark:text-[#B8DEF5]">
                حساب التبرع المعتمد: بنك الخرطوم (1727654) باسم الشيخ الهادي سالم / مدير مجمع النور
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('orphansCare')}
              className="px-3.5 py-1.5 rounded-xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#87CEEB]/60 text-[#12345A] dark:text-[#87CEEB] text-xs font-bold cursor-pointer"
            >
              {isAr ? 'فتح بوابة الأيتام' : 'Open Orphans Portal'}
            </button>
          </div>

          <div className="space-y-3">
            {orphansList.map((orphan) => (
              <div
                key={orphan.id}
                className="p-4 bg-[#EAF8FF]/90 dark:bg-[#091B33] rounded-2xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#12345A] dark:text-white text-sm">اليتيم: {orphan.orphanName}</span>
                    <span className="text-[#4A7298] dark:text-[#84B4D6]">· ولي الأمر: {orphan.applicantName}</span>
                    <span className="font-mono text-[10px] text-[#0D7A7A] dark:text-[#D4AF37]">#{orphan.trackingNumber}</span>
                  </div>
                  <p className="text-[#2B547E] dark:text-[#B8DEF5]">
                    العنوان: <span className="font-semibold">{orphan.address}</span> · الهاتف: {orphan.phone}
                  </p>
                  <p className="text-[11px] text-[#0D7A7A] dark:text-[#87CEEB] font-bold">
                    الحالة: {orphan.statusLabel}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {orphan.status === 'approved' ? (
                    <span className="px-3 py-1.5 bg-white dark:bg-[#0F2747] text-[#0D7A7A] dark:text-[#87CEEB] border border-[#0EA5A4]/40 rounded-xl font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      معتمد للصرف الشهري
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApproveOrphan(orphan.id)}
                      className="px-4 py-2 bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold rounded-xl transition cursor-pointer"
                    >
                      اعتماد الكفالة الميدانية
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PARTNERSHIPS & CONTACT SUBMISSIONS */}
      {activeTab === 'campusSubmissions' && (
        <div className="sky-card-3d rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#87CEEB]/45 dark:border-[#87CEEB]/20 pb-3">
            <h3 className="text-base font-black font-amiri text-[#12345A] dark:text-white">
              {isAr ? 'الوارد المباشر: طلبات الشراكات الدولية ورسائل التواصل' : 'Live Partnership Applications & Contact Inquiries'}
            </h3>
            <button
              type="button"
              onClick={fetchCampusSubmissions}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#87CEEB]/60 text-xs font-bold text-[#12345A] dark:text-[#87CEEB] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSubmissions ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'تحديث' : 'Refresh'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Partnership Requests */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#12345A] dark:text-white flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-[#0EA5A4]" />
                <span>{isAr ? `طلبات الشراكة المؤسسية (${partnerships.length})` : `Partnerships (${partnerships.length})`}</span>
              </h4>
              {partnerships.length === 0 ? (
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] p-4 rounded-2xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#87CEEB]/50">
                  {isAr ? 'لا توجد طلبات شراكة مسجلة في الجلسة الحالية بعد.' : 'No partnership submissions recorded yet.'}
                </p>
              ) : (
                partnerships.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#87CEEB]/60 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-[#12345A] dark:text-white">{p.organizationName}</strong>
                      <span className="font-mono text-[10px] text-[#0D7A7A] dark:text-[#87CEEB]">{p.trackingCode}</span>
                    </div>
                    <div className="text-[#2B547E] dark:text-[#B8DEF5]">{p.contactName} · {p.email} ({p.country})</div>
                    <p className="text-[#4A7298] dark:text-[#84B4D6] leading-relaxed">{p.proposal}</p>
                  </div>
                ))
              )}
            </div>

            {/* Contact Messages */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#12345A] dark:text-white flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#0EA5A4]" />
                <span>{isAr ? `رسائل مكتب الاستقبال (${contacts.length})` : `Contact Messages (${contacts.length})`}</span>
              </h4>
              {contacts.length === 0 ? (
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] p-4 rounded-2xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#87CEEB]/50">
                  {isAr ? 'لا توجد رسائل تواصل واردة في الجلسة الحالية بعد.' : 'No contact submissions recorded yet.'}
                </p>
              ) : (
                contacts.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-[#EAF8FF] dark:bg-[#091B33] border border-[#87CEEB]/60 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-[#12345A] dark:text-white">{c.fullName}</strong>
                      <span className="font-mono text-[10px] text-[#0D7A7A] dark:text-[#87CEEB]">{c.trackingCode}</span>
                    </div>
                    <div className="text-[#2B547E] dark:text-[#B8DEF5]">{c.email} · {c.department}</div>
                    <p className="text-[#4A7298] dark:text-[#84B4D6] leading-relaxed">{c.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: DAWAH INQUIRIES */}
      {activeTab === 'dawahInquiries' && (
        <div className="sky-card-3d rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#87CEEB]/45 dark:border-[#87CEEB]/20 pb-3">
            <h3 className="text-base font-black font-amiri text-[#12345A] dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#0EA5A4]" />
              <span>{isAr ? 'استفسارات الدعوة العالمية وطلبات نسخ المصاحف المترجمة' : 'Global Dawah Inquiries'}</span>
            </h3>
          </div>

          <div className="space-y-3">
            {dawahList.map((inq) => (
              <div
                key={inq.id}
                className="p-4 bg-[#EAF8FF]/90 dark:bg-[#091B33] rounded-2xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#12345A] dark:text-white text-sm">{inq.fullName}</span>
                    <span className="text-[#4A7298] dark:text-[#84B4D6]">({inq.country})</span>
                    <span className="font-mono text-[10px] text-[#0D7A7A] dark:text-[#D4AF37]">#{inq.trackingCode}</span>
                  </div>
                  <p className="text-[#2B547E] dark:text-[#B8DEF5]">"{inq.message}"</p>
                  <p className="text-[11px] text-[#4A7298] dark:text-[#84B4D6]">
                    {inq.email} · المرشد: <span className="text-[#0D7A7A] dark:text-[#87CEEB] font-bold">{inq.mentor}</span>
                  </p>
                </div>

                <span className="px-3 py-1.5 bg-white dark:bg-[#0F2747] text-[#0D7A7A] dark:text-[#87CEEB] border border-[#0EA5A4]/40 rounded-xl font-bold flex items-center gap-1 shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                  قيد المتابعة
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SERVICES HEALTH MONITOR */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <ServiceStatusDashboard />
        </div>
      )}

      {/* TAB: TEACHERS */}
      {activeTab === 'teachers' && (
        <div className="sky-card-3d rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-black font-amiri text-[#12345A] dark:text-white border-b border-[#87CEEB]/45 dark:border-[#87CEEB]/20 pb-3">
            {isAr ? 'المقارئ الفعالة وهيئة التدريس المعتمدة' : 'Accredited Qaris & Teaching Faculty'}
          </h3>
          <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            جميع الشيوخ والمقرئين تخضع ملفاتهم لمراجعة الأسانيد المتصلة والتزكيات العلمية الموثقة في معهد العلوم الإسلامية.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('scholars')}
            className="px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold cursor-pointer transition-colors"
          >
            {isAr ? 'استعراض دليل العلماء والمشايخ' : 'Open Scholars Directory'}
          </button>
        </div>
      )}

      {/* TAB: MODERATION */}
      {activeTab === 'moderation' && (
        <div className="sky-card-3d rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-black font-amiri text-[#12345A] dark:text-white border-b border-[#87CEEB]/45 dark:border-[#87CEEB]/20 pb-3">
            {isAr ? 'ضوابط ومراجعة أسئلة طلبة العلم' : 'Scholarly Forum Moderation Guidelines'}
          </h3>
          <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            تُراجع الأسئلة الشرعية لضمان التزامها بالآداب العلمية ومنهج أهل السنة والجماعة الوسطي، مع إتاحة الوصول للباحث العلمي الموثق.
          </p>
        </div>
      )}
    </div>
  );
};
