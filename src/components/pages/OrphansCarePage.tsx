import React, { useState } from 'react';
import {
  Heart, Users, ShieldCheck, CheckCircle2, AlertCircle, Phone,
  MessageCircle, Search, FileText, Upload, Sparkles,
  ArrowRight, ArrowLeft, Check, Lock, RefreshCw, Copy, Building2, MapPin
} from 'lucide-react';
import { NavigationPage, OrphanApplication, OrphanProfile, SponsorshipProgram } from '../../types';
import { ORPHANS_CONTACT_INFO, SPONSORSHIP_PROGRAMS, INITIAL_ORPHANS_PROFILES, INITIAL_ORPHAN_APPLICATIONS } from '../../data/orphansData';
import { OFFICIAL_DONATION_INFO } from '../../data/islamicData';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { auth } from '../../services/firebase';
import { orphansFirebaseService } from '../../services/orphansFirebaseService';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface OrphansCarePageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const OrphansCarePage: React.FC<OrphansCarePageProps> = () => {
  const { isRtl } = useLanguage();
  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const isAuthorizedAdmin = Boolean(
    user && (user.role === 'admin' || user.email?.toLowerCase() === 'mekoogk@gmail.com')
  );

  // Active view tab
  const [activeTab, setActiveTab] = useState<'programs' | 'profiles' | 'register' | 'track' | 'admin'>('programs');

  // Multi-step Registration Form State (Steps 1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    applicantName: '',
    relation: 'أم اليتيم',
    phone: '',
    nationalId: '',
    address: '',
    assistanceType: 'full_sponsorship',
    monthlyRequiredUsd: 50,
    orphanName: '',
    orphanBirthDate: '',
    orphanGender: 'male' as 'male' | 'female',
    academicLevel: 'الابتدائي',
    healthNotes: '',
    familyMembersCount: 3,
    hasDeathCert: false,
    hasBirthCert: false,
    hasResidenceProof: false,
    uploadedDocName: '',
    termsAgreed: false,
    captchaAnswer: '',
  });

  const [submittedApplication, setSubmittedApplication] = useState<OrphanApplication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Tracking query state
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedApp, setTrackedApp] = useState<OrphanApplication | null>(null);
  const [trackNotFound, setTrackNotFound] = useState(false);

  // Sponsorship modal
  const [selectedProgram, setSelectedProgram] = useState<SponsorshipProgram | null>(null);
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorPhone, setSponsorPhone] = useState('');
  const [sponsorSuccess, setSponsorSuccess] = useState(false);

  // Admin section state
  const [adminApplications, setAdminApplications] = useState<OrphanApplication[]>(INITIAL_ORPHAN_APPLICATIONS);
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('all');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [adminFieldNote, setAdminFieldNote] = useState('');

  // Profiles list
  const [profiles] = useState<OrphanProfile[]>(INITIAL_ORPHANS_PROFILES);
  const [profilesFilter, setProfilesFilter] = useState<'all' | 'unsponsored' | 'sponsored'>('all');
  const [copiedBankAcc, setCopiedBankAcc] = useState(false);

  // Handle Form Next
  const handleNextStep = () => {
    setFormError('');
    if (currentStep === 1) {
      if (!formData.applicantName.trim() || !formData.phone.trim() || !formData.nationalId.trim() || !formData.address.trim()) {
        setFormError('يرجى ملء جميع بيانات ولي الأمر / مقدم الطلب للمتابعة.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.assistanceType) {
        setFormError('يرجى اختيار نوع الرعاية أو المساعدة المطلوبة.');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.orphanName.trim() || !formData.orphanBirthDate) {
        setFormError('يرجى إدخال اسم اليتيم الرباعي وتاريخ ميلاده.');
        return;
      }
    } else if (currentStep === 4) {
      if (!formData.hasDeathCert || !formData.hasBirthCert) {
        setFormError('يرجى تأكيد وجود شهادة الوفاة وشهادة ميلاد اليتيم الرسمية.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  // Submit Registration Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.termsAgreed) {
      setFormError('يجب الإقرار بصحة البيانات المدخلة والموافقة على لائحة الشروط.');
      return;
    }
    if (formData.captchaAnswer.trim() !== '7') {
      setFormError('رمز التحقق الأمني غير صحيح (حاصل جمع 4 + 3 هو 7).');
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedCode = `ALNOOR-ORPHAN-${Math.floor(100000 + Math.random() * 900000)}`;
      const newApp: OrphanApplication = {
        id: `APP-${Date.now().toString().slice(-6)}`,
        trackingNumber: generatedCode,
        applicantName: formData.applicantName,
        relation: formData.relation,
        phone: formData.phone,
        nationalId: formData.nationalId,
        address: formData.address,
        assistanceType: formData.assistanceType as OrphanApplication['assistanceType'],
        orphanName: formData.orphanName,
        orphanBirthDate: formData.orphanBirthDate,
        orphanGender: formData.orphanGender,
        academicLevel: formData.academicLevel,
        healthNotes: formData.healthNotes,
        hasDeathCert: formData.hasDeathCert,
        hasBirthCert: formData.hasBirthCert,
        hasResidenceProof: formData.hasResidenceProof,
        status: 'in_review',
        fieldNotes: 'تم استلام الطلب إلكترونياً، والملف بانتظار جدولة الزيارة الميدانية للتحقق.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAdminApplications((prev) => [newApp, ...prev]);
      setSubmittedApplication(newApp);

      try {
        await orphansFirebaseService.submitApplication(newApp);
      } catch (err) {
        console.warn('Firestore application sync note:', err);
      }

      try {
        await fetch('/api/v1/orphans/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newApp),
        });
      } catch {
        // Local state already updated
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Track Query
  const handleTrackLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackNotFound(false);
    const q = trackQuery.trim().toUpperCase();
    if (!q) return;

    const found = adminApplications.find(
      (a) => a.trackingNumber.toUpperCase() === q || a.phone.includes(q) || a.nationalId === q
    );
    if (found) {
      setTrackedApp(found);
      setTrackNotFound(false);
      return;
    }

    try {
      const remote = await orphansFirebaseService.lookupApplication(q);
      if (remote) {
        setTrackedApp(remote);
        setTrackNotFound(false);
        return;
      }
    } catch (err) {
      console.warn('Remote track lookup note:', err);
    }

    setTrackedApp(null);
    setTrackNotFound(true);
  };

  // Admin status update
  const handleUpdateStatus = async (appId: string, newStatus: OrphanApplication['status']) => {
    setStatusUpdatingId(appId);
    const noteSnapshot = adminFieldNote;
    try {
      setAdminApplications((prev) =>
        prev.map((a) =>
          a.id === appId
            ? { ...a, status: newStatus, fieldNotes: noteSnapshot || a.fieldNotes, updatedAt: new Date().toISOString() }
            : a
        )
      );
      setAdminFieldNote('');
      try {
        const token = await auth.currentUser?.getIdToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        await fetch(`/api/v1/orphans/applications/${appId}/status`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ status: newStatus, notes: noteSnapshot }),
        });
        showToast('تم تحديث حالة ملف اليتيم بنجاح.', 'success');
      } catch {
        showToast('تم تحديث الحالة محلياً؛ يرجى التحقق من اتصال المشرف للمزامنة السحابية.', 'warning');
      }
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const getStatusText = (status: OrphanApplication['status']) => {
    if (status === 'approved') return 'معتمد وتمت الكفالة';
    if (status === 'field_visit') return 'جارية الزيارة الميدانية';
    if (status === 'in_review') return 'قيد المراجعة والتدقيق';
    return 'لم يستوف الشروط';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Top Unified Official Contact Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-[#12345A] via-[#0F2747] to-[#0A223D] text-white p-4 px-6 flex flex-wrap items-center justify-between gap-4 shadow-lg border border-[#87CEEB]/45">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0EA5A4]/20 border border-[#87CEEB]/40 flex items-center justify-center text-[#F7E7B4]">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black font-amiri text-white">
              قسم كفالة ورعاية الأيتام · مجمع النور الإسلامي العالمي
            </h4>
            <p className="text-[11px] text-[#B8DEF5]">
              هواتف التواصل المعتمدة الرسمية لتقديم الطلبات والكفالات المباشرة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs font-mono font-bold tabular-nums">
          <a
            href={ORPHANS_CONTACT_INFO.mobileTel}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-[#87CEEB]/35 text-white flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-[#F7E7B4]" />
            <span dir="ltr">{ORPHANS_CONTACT_INFO.mobile}</span>
          </a>

          <a
            href={ORPHANS_CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>واتساب المجمع:</span>
            <span dir="ltr">{ORPHANS_CONTACT_INFO.whatsapp}</span>
          </a>
        </div>
      </div>

      {/* Sky-Blue 3D Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-10 shadow-xl border border-[#87CEEB]/55 bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] text-white">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold text-[#F7E7B4] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F7E7B4]" />
              <span>صرح الإحسان والبركة · Al-Noor Global Orphans Welfare</span>
            </p>

            <h1 className="text-2xl sm:text-4xl font-black text-white font-amiri leading-tight">
              كفالة الأيتام – مجمع النور الإسلامي العالمي
            </h1>

            <div className="scholarly-reading-paper p-4 sm:p-5 rounded-2xl max-w-2xl">
              <p className="text-base sm:text-lg font-amiri font-bold text-[#12345A] dark:text-[#F7E7B4] leading-relaxed">
                {ORPHANS_CONTACT_INFO.hadithText}
              </p>
              <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] block mt-1">
                رواه البخاري في صحيحه عن سهل بن سعد رضي الله عنه
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed max-w-3xl">
              نظام مؤسسي متكامل لرعاية الأيتام والأسر المتعففة، يجمع بين الكفالة المعيشية الشاملة، والتعليم القرآني والأكاديمي، والرعاية الصحية، مع توثيق ميداني وشفافية كاملة وتقارير دورية لكافل اليتيم.
            </p>

            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('programs')}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>برامج الكفالة والتبرع</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <FileText className="w-4 h-4 text-[#F7E7B4]" />
                <span>استمارة تسجيل يتيم جديد</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('track')}
                className="px-4 py-2.5 rounded-xl bg-[#0A223D]/60 hover:bg-[#0A223D] border border-[#87CEEB]/35 text-[#EAF8FF] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Search className="w-4 h-4 text-[#87CEEB]" />
                <span>متابعة حالة طلب سابق</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <Sky3DIcon slug="orphansCare" tone="sky" size="lg" />
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <div className="sky-glass-panel rounded-2xl p-2 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('programs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
              activeTab === 'programs'
                ? 'bg-[#12345A] text-white shadow-sm'
                : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-[#87CEEB]/25'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>باقات الكفالة ({SPONSORSHIP_PROGRAMS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profiles')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
              activeTab === 'profiles'
                ? 'bg-[#12345A] text-white shadow-sm'
                : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-[#87CEEB]/25'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#0EA5A4]" />
            <span>أيتام بانتظار الكفالة ({profiles.filter(p => !p.isSponsored).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#12345A] text-white shadow-sm'
                : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-[#87CEEB]/25'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>استمارة تسجيل يتيم (5 خطوات)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'track'
                ? 'bg-[#12345A] text-white shadow-sm'
                : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-[#87CEEB]/25'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#0EA5A4]" />
            <span>الاستعلام عن طلب</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border cursor-pointer ${
            activeTab === 'admin'
              ? 'bg-[#12345A] text-[#F7E7B4] border-[#D4AF37]'
              : 'border-[#87CEEB]/50 text-[#12345A] dark:text-[#EAF8FF] hover:bg-[#87CEEB]/20'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>لوحة إدارة الأيتام</span>
        </button>
      </div>

      {/* TAB 1: SPONSORSHIP PROGRAMS */}
      {activeTab === 'programs' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white font-amiri">
                باقات وبرامج الكفالة المعتمدة
              </h2>
              <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                كافة المبالغ تودع في الحساب الوقفي الرسمي لمجمع النور، وتصرف بإشراف لجان رقابية وشرعية معتمدة.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">
              <ShieldCheck className="w-4 h-4" />
              <span>توثيق شرعي ورقابة دورية</span>
            </div>
          </div>

          {/* Official Bank of Khartoum Account Direct Transfer Card */}
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#12345A] via-[#0F2747] to-[#0A223D] border-2 border-[#D4AF37]/75 shadow-xl text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#87CEEB]/25 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/45 flex items-center justify-center text-[#F7E7B4] shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-base sm:text-lg text-white">
                      {OFFICIAL_DONATION_INFO.bankName}
                    </span>
                    <span className="text-[#87CEEB]">·</span>
                    <span className="text-[#5EEAD4] font-bold">
                      حساب كفالة الأيتام والمجمع
                    </span>
                  </div>
                  <span className="text-xs text-[#B8DEF5] mt-0.5 block font-medium">
                    التحويل الفوري متاح عبر تطبيق (بنكك - Bankak) من داخل وخارج السودان
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#0A223D] px-4 py-3 rounded-2xl border border-[#D4AF37]/55">
                <div className="text-right">
                  <span className="text-[11px] text-[#87CEEB] block font-semibold">رقم الحساب:</span>
                  <span className="text-2xl font-mono font-black text-[#F7E7B4] tracking-wider tabular-nums">
                    {OFFICIAL_DONATION_INFO.accountNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(OFFICIAL_DONATION_INFO.accountNumber);
                    setCopiedBankAcc(true);
                    setTimeout(() => setCopiedBankAcc(false), 2000);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    copiedBankAcc
                      ? 'bg-[#0EA5A4] text-white shadow-md'
                      : 'bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] font-black'
                  }`}
                >
                  {copiedBankAcc ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBankAcc ? 'تم النسخ!' : 'نسخ الحساب'}</span>
                </button>
              </div>
            </div>

            <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#87CEEB] block text-[11px]">اسم صاحب الحساب:</span>
                <span className="text-[#F7E7B4] font-bold text-sm font-amiri block mt-0.5">
                  {OFFICIAL_DONATION_INFO.accountHolder}
                </span>
              </div>
              <div>
                <span className="text-[#87CEEB] block text-[11px]">الصفة المؤسسية:</span>
                <span className="text-[#D7F1FC] font-medium text-xs block mt-0.5 leading-relaxed">
                  {OFFICIAL_DONATION_INFO.directorTitle}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPONSORSHIP_PROGRAMS.map((prog) => (
              <div
                key={prog.id}
                className={`sky-card-3d rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 ${
                  prog.popular ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">
                      {prog.badgeText}
                    </span>
                    <div className="text-right tabular-nums">
                      <span className="text-2xl font-black text-[#12345A] dark:text-[#F7E7B4] font-mono">
                        ${prog.monthlyAmountUsd}
                      </span>
                      <span className="text-[11px] text-[#4A7298] dark:text-[#B8DEF5] block">/ شهرياً</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[#12345A] dark:text-white font-amiri">
                    {prog.titleAr}
                  </h3>

                  <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                    {prog.descriptionAr}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20">
                    <span className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] block">
                      ما تشمله الكفالة:
                    </span>
                    <ul className="space-y-1.5">
                      {(prog.coveredItems || prog.coveragePoints || []).map((item, idx) => (
                        <li key={idx} className="text-xs text-[#2B547E] dark:text-[#B8DEF5] flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5A4] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProgram(prog);
                      setSponsorSuccess(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer tabular-nums"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#F7E7B4] fill-current" />
                    <span>اكفل هذا البرنامج الآن (${prog.monthlyAmountUsd})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: VERIFIED ORPHANS PROFILES */}
      {activeTab === 'profiles' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white font-amiri">
                أيتام مجمع النور بانتظار الكفالة المباشرة
              </h2>
              <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                حالات تم فحصها ميدانياً والتأكد من استحقاقها الشرعي والقانوني.
              </p>
            </div>

            <div className="sky-glass-panel flex items-center gap-1.5 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setProfilesFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  profilesFilter === 'all' ? 'bg-[#12345A] text-white' : 'text-[#2B547E] dark:text-[#B8DEF5]'
                }`}
              >
                الكل
              </button>
              <button
                type="button"
                onClick={() => setProfilesFilter('unsponsored')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  profilesFilter === 'unsponsored' ? 'bg-[#12345A] text-white' : 'text-[#2B547E] dark:text-[#B8DEF5]'
                }`}
              >
                بانتظار الكفالة
              </button>
              <button
                type="button"
                onClick={() => setProfilesFilter('sponsored')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  profilesFilter === 'sponsored' ? 'bg-[#12345A] text-white' : 'text-[#2B547E] dark:text-[#B8DEF5]'
                }`}
              >
                تمت الكفالة
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profiles
              .filter((p) => {
                if (profilesFilter === 'unsponsored') return !p.isSponsored;
                if (profilesFilter === 'sponsored') return p.isSponsored;
                return true;
              })
              .map((orphan) => (
                <div
                  key={orphan.id}
                  className="sky-card-3d rounded-3xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#87CEEB]/50 flex items-center justify-center text-[#12345A] dark:text-[#F7E7B4] font-black text-base">
                        {orphan.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-[#12345A] dark:text-white font-amiri">
                          {orphan.fullName}
                        </h3>
                        <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0EA5A4]" />
                          <span>{orphan.governorate}</span>
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold ${
                        orphan.isSponsored
                          ? 'text-[#0D7A7A] dark:text-[#5EEAD4]'
                          : 'text-[#9A7418] dark:text-[#F7E7B4]'
                      }`}
                    >
                      {orphan.isSponsored ? 'تمت كفالته ✓' : 'بانتظار الكافل'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 tabular-nums">
                    <div className="p-2.5 rounded-xl bg-[#EAF8FF]/80 dark:bg-[#0A223D]/70 border border-[#87CEEB]/35">
                      <span className="text-[11px] text-[#4A7298] dark:text-[#87CEEB] block">العمر</span>
                      <span className="font-bold text-[#12345A] dark:text-white">{orphan.age} سنوات</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#EAF8FF]/80 dark:bg-[#0A223D]/70 border border-[#87CEEB]/35">
                      <span className="text-[11px] text-[#4A7298] dark:text-[#87CEEB] block">المرحلة الدراسية</span>
                      <span className="font-bold text-[#12345A] dark:text-white">{orphan.academicStage}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#EAF8FF]/80 dark:bg-[#0A223D]/70 border border-[#87CEEB]/35">
                      <span className="text-[11px] text-[#4A7298] dark:text-[#87CEEB] block">أفراد الأسرة</span>
                      <span className="font-bold text-[#12345A] dark:text-white">{orphan.familyMembersCount} أفراد</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                    {orphan.storySummary}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20">
                    <div className="tabular-nums">
                      <span className="text-[11px] text-[#4A7298] dark:text-[#87CEEB] block">مبلغ الكفالة الشهري</span>
                      <span className="text-base font-black text-[#12345A] dark:text-[#F7E7B4] font-mono">
                        ${orphan.monthlyRequiredUsd} / شهر
                      </span>
                    </div>

                    {!orphan.isSponsored ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProgram(SPONSORSHIP_PROGRAMS[0]);
                          setSponsorSuccess(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current text-[#F7E7B4]" />
                        <span>اكفل {orphan.fullName.split(' ')[0]} الآن</span>
                      </button>
                    ) : (
                      <span className="text-xs text-[#0D7A7A] dark:text-[#5EEAD4] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>مكفول جزاكم الله خيراً</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* TAB 3: 5-STEP REGISTRATION FORM */}
      {activeTab === 'register' && (
        <section className="sky-card-3d rounded-3xl p-6 sm:p-10 space-y-8">
          {submittedApplication ? (
            <div className="text-center py-10 space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-[#0EA5A4]/15 text-[#0EA5A4] mx-auto flex items-center justify-center shadow-md border border-[#0EA5A4]/30">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-[#12345A] dark:text-white font-amiri">
                  تم استلام طلب كفالة اليتيم بنجاح!
                </h2>
                <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5]">
                  تم تسجيل ملف اليتيم {submittedApplication.orphanName} في سجلات مجمع النور الإسلامي العالمي. سيقوم الباحث الاجتماعي بالتواصل معكم لتنسيق الزيارة الميدانية.
                </p>
              </div>

              <div className="scholarly-reading-paper p-5 rounded-2xl space-y-2">
                <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] block font-bold">
                  الرقم المرجعي لتتبع الطلب (احتفظ به):
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-[#12345A] dark:text-[#F7E7B4] tracking-wider select-all block tabular-nums">
                  {submittedApplication.trackingNumber}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedApplication(null);
                    setCurrentStep(1);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  تسجيل طلب يتيم آخر
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrackQuery(submittedApplication.trackingNumber);
                    setActiveTab('track');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#87CEEB]/50 text-[#12345A] dark:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  متابعة حالة هذا الطلب
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white font-amiri">
                      استمارة تسجيل يتيم جديد – مجمع النور الإسلامي
                    </h2>
                    <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] tabular-nums">
                      الخطوة {currentStep} من 5:{' '}
                      {currentStep === 1
                        ? 'بيانات ولي الأمر / مقدم الطلب'
                        : currentStep === 2
                        ? 'تحديد نوع الرعاية والمساعدة'
                        : currentStep === 3
                        ? 'بيانات الطفل اليتيم'
                        : currentStep === 4
                        ? 'إرفاق الوثائق والمستندات'
                        : 'الإقرار الشرعي وتأكيد الإرسال'}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">
                    قسم الرعاية الميدانية
                  </span>
                </div>

                {/* Progress Bar Steps */}
                <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-bold">
                  {[
                    '1. ولي الأمر',
                    '2. نوع الرعاية',
                    '3. بيانات اليتيم',
                    '4. المستندات',
                    '5. التأكيد',
                  ].map((label, idx) => {
                    const stepNum = idx + 1;
                    const isDone = currentStep > stepNum;
                    const isCurrent = currentStep === stepNum;
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl transition-all border ${
                          isDone
                            ? 'bg-[#0EA5A4] text-white border-[#0EA5A4]'
                            : isCurrent
                            ? 'bg-[#12345A] text-[#F7E7B4] border-[#12345A] ring-2 ring-[#87CEEB]/50'
                            : 'bg-[#EAF8FF] dark:bg-[#0A223D] text-[#4A7298] dark:text-[#84B4D6] border-[#87CEEB]/40'
                        }`}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-400/50 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="space-y-4 max-w-2xl text-xs">
                  <h3 className="text-sm font-black text-[#12345A] dark:text-white">
                    بيانات مقدم الطلب / ولي أمر اليتيم
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">
                        الاسم الرباعي لمقدم الطلب *
                      </label>
                      <input
                        type="text"
                        value={formData.applicantName}
                        onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                        placeholder="مثال: آمنة عبد الله البشير"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">
                          صلة القرابة باليتيم *
                        </label>
                        <select
                          value={formData.relation}
                          onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                        >
                          <option value="أم اليتيم">أم اليتيم (أرملة)</option>
                          <option value="جد / جدة">جد / جدة اليتيم</option>
                          <option value="عم / خال">عم / خال اليتيم</option>
                          <option value="أخ / أخت بالغة">أخ / أخت بالغة</option>
                          <option value="وصي شرعي معتمد">وصي شرعي معتمد</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">
                          رقم الهاتف / الواتساب للتواصل *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+249912169169"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">
                          الرقم الوطني / رقم الهوية *
                        </label>
                        <input
                          type="text"
                          value={formData.nationalId}
                          onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                          placeholder="الرقم الوطني المكون من 10 أرقام"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">
                          عنوان السكن الحالي بالتفصيل *
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="المدينة، الحي، رقم المنزل أو المعلم البارز"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {currentStep === 2 && (
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-sm font-black text-[#12345A] dark:text-white">
                    تحديد نوع المساعدة والرعاية المطلوبة
                  </h3>

                  <div className="space-y-3">
                    {[
                      { id: 'full_sponsorship', title: 'كفالة شاملة شهرية ($50)', desc: 'تغطي الغذاء والدراسة والرعاية الطبية وكسوة العيد' },
                      { id: 'monthly_stipend', title: 'كفالة تعليمية وحفظ قرآن ($25)', desc: 'تغطي الرسوم الدراسية والكتب والحلقات القرآنية' },
                      { id: 'food_basket', title: 'سلة غذائية تموينية شهرية ($40)', desc: 'توفير المؤونة الأساسية لأسرة اليتيم شهرياً' },
                      { id: 'medical_aid', title: 'رعاية صحية وتغطية علاجية ($35)', desc: 'مساعدة الحالات المرضية والأدوية المستمرة' },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                          formData.assistanceType === opt.id
                            ? 'bg-[#EAF8FF] dark:bg-[#0A223D] border-[#0EA5A4] ring-2 ring-[#0EA5A4]/25'
                            : 'bg-white/70 dark:bg-[#0F2747]/70 border-[#87CEEB]/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="assistanceType"
                          value={opt.id}
                          checked={formData.assistanceType === opt.id}
                          onChange={(e) => setFormData({ ...formData, assistanceType: e.target.value })}
                          className="mt-1 accent-[#0EA5A4]"
                        />
                        <div>
                          <span className="text-xs font-black text-[#12345A] dark:text-white block">
                            {opt.title}
                          </span>
                          <span className="text-[11px] text-[#2B547E] dark:text-[#B8DEF5]">
                            {opt.desc}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <div className="space-y-4 max-w-2xl text-xs">
                  <h3 className="text-sm font-black text-[#12345A] dark:text-white">
                    بيانات الطفل اليتيم المستفيد
                  </h3>

                  <div>
                    <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">
                      الاسم الرباعي للطفل اليتيم *
                    </label>
                    <input
                      type="text"
                      value={formData.orphanName}
                      onChange={(e) => setFormData({ ...formData, orphanName: e.target.value })}
                      placeholder="اسم اليتيم كاملاً كما هو في شهادة الميلاد"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">
                        تاريخ الميلاد *
                      </label>
                      <input
                        type="date"
                        value={formData.orphanBirthDate}
                        onChange={(e) => setFormData({ ...formData, orphanBirthDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">
                        الجنس *
                      </label>
                      <select
                        value={formData.orphanGender}
                        onChange={(e) => setFormData({ ...formData, orphanGender: e.target.value as 'male' | 'female' })}
                        className="w-full px-4 py-2 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                      >
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">
                        المرحلة الدراسية
                      </label>
                      <select
                        value={formData.academicLevel}
                        onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                      >
                        <option value="ما قبل المدرسة (الروضة)">ما قبل المدرسة (الروضة)</option>
                        <option value="المرحلة الابتدائية">المرحلة الابتدائية</option>
                        <option value="المرحلة المتوسطة">المرحلة المتوسطة</option>
                        <option value="المرحلة الثانوية">المرحلة الثانوية</option>
                        <option value="حلقة تحفيظ قرآن كاملة">حلقة تحفيظ قرآن كاملة</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#12345A] dark:text-[#EAF8FF] font-bold mb-1">
                      الحالة الصحية وملاحظات الرعاية (إن وجدت)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.healthNotes}
                      onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
                      placeholder="هل يعاني من حساسية أو مرض مزمن أو احتياجات بصرية/سمعية خاصة؟"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                    />
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {currentStep === 4 && (
                <div className="space-y-4 max-w-2xl text-xs">
                  <h3 className="text-sm font-black text-[#12345A] dark:text-white">
                    الوثائق الرسمية المطلوبة للتحقق الشرعي
                  </h3>

                  <div className="space-y-3 bg-[#EAF8FF]/85 dark:bg-[#0A223D] p-4 rounded-2xl border border-[#87CEEB]/50">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#12345A] dark:text-white">
                      <input
                        type="checkbox"
                        checked={formData.hasDeathCert}
                        onChange={(e) => setFormData({ ...formData, hasDeathCert: e.target.checked })}
                        className="rounded accent-[#0EA5A4] w-4 h-4"
                      />
                      <span>أؤكد توفر شهادة وفاة الأب الرسمية الصادرة من السجل المدني *</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#12345A] dark:text-white">
                      <input
                        type="checkbox"
                        checked={formData.hasBirthCert}
                        onChange={(e) => setFormData({ ...formData, hasBirthCert: e.target.checked })}
                        className="rounded accent-[#0EA5A4] w-4 h-4"
                      />
                      <span>أؤكد توفر شهادة ميلاد اليتيم الرسمية أو الرقم الوطني *</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#12345A] dark:text-white">
                      <input
                        type="checkbox"
                        checked={formData.hasResidenceProof}
                        onChange={(e) => setFormData({ ...formData, hasResidenceProof: e.target.checked })}
                        className="rounded accent-[#0EA5A4] w-4 h-4"
                      />
                      <span>شهادة إثبات سكن أو إفادة من اللجنة المحلية (مستحسن)</span>
                    </label>
                  </div>

                  <div className="p-4 border-2 border-dashed border-[#87CEEB]/70 dark:border-[#87CEEB]/35 rounded-2xl text-center space-y-2">
                    <Upload className="w-8 h-8 text-[#0EA5A4] mx-auto" />
                    <div>
                      <span className="font-bold text-[#12345A] dark:text-white block">
                        رفع نسخة ضوئية من المستندات (PDF أو صور JPG/PNG)
                      </span>
                      <span className="text-[11px] text-[#4A7298] dark:text-[#84B4D6]">
                        الحد الأقصى للملف 10 ميغابايت
                      </span>
                    </div>
                    <input
                      type="file"
                      id="doc-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            uploadedDocName: file.name,
                            hasDeathCert: true,
                            hasBirthCert: true,
                          });
                        }
                      }}
                    />
                    <label
                      htmlFor="doc-upload"
                      className="inline-block px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold cursor-pointer transition-all"
                    >
                      {formData.uploadedDocName ? `تم اختيار: ${formData.uploadedDocName}` : 'اختيار الملفات من جهازك'}
                    </label>
                  </div>
                </div>
              )}

              {/* Step 5 */}
              {currentStep === 5 && (
                <div className="space-y-4 max-w-2xl text-xs">
                  <h3 className="text-sm font-black text-[#12345A] dark:text-white">
                    الإقرار الشرعي وتأكيد تقديم الطلب
                  </h3>

                  <div className="scholarly-reading-paper p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-[#12345A] dark:text-[#F7E7B4]">
                      <ShieldCheck className="w-4 h-4 text-[#0EA5A4]" />
                      <span>إقرار بصحة البيانات</span>
                    </div>
                    <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                      أقر أنا مقدم الطلب بأن جميع البيانات الواردة في هذه الاستمارة صحيحة تماماً ومطابقة للواقع، وأتحمل المسؤولية الشرعية والقانونية، وأوافق على زيارة مندوب مجمع النور الإسلامي للتحقق الميداني من الوضع المعيشي لأسرة اليتيم.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#12345A] dark:text-white">
                    <input
                      type="checkbox"
                      checked={formData.termsAgreed}
                      onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                      className="rounded accent-[#0EA5A4] w-4 h-4"
                    />
                    <span>أوافق على الإقرار الشرعي ولائحة كفالة الأيتام بمجمع النور *</span>
                  </label>

                  <div className="p-4 rounded-2xl bg-[#EAF8FF]/85 dark:bg-[#0A223D] border border-[#87CEEB]/50 space-y-2">
                    <label className="block font-bold text-[#12345A] dark:text-white">
                      التحقق الأمني لمنع الإرسال الآلي: كم حاصل جمع 4 + 3؟ *
                    </label>
                    <input
                      type="text"
                      value={formData.captchaAnswer}
                      onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
                      placeholder="7"
                      className="w-32 px-4 py-2 rounded-xl border border-[#87CEEB]/60 bg-white dark:bg-[#0F2747] text-center font-bold text-base text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                    />
                  </div>
                </div>
              )}

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-[#87CEEB]/35 dark:border-[#87CEEB]/20">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#87CEEB]/50 text-[#12345A] dark:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? '' : 'rotate-180'}`} />
                    <span>السابق</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>المتابعة للخطوة التالية</span>
                    <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? '' : 'rotate-180'}`} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitForm}
                    disabled={isSubmitting}
                    className="px-8 py-2.5 rounded-xl bg-[#0EA5A4] hover:bg-[#0D7A7A] disabled:opacity-50 text-white text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#F7E7B4]" />
                    )}
                    <span>{isSubmitting ? 'جاري الإرسال وتوليد الرقم المرجعي...' : 'إرسال طلب كفالة اليتيم رسمياً'}</span>
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      )}

      {/* TAB 4: TRACK APPLICATION */}
      {activeTab === 'track' && (
        <section className="sky-card-3d rounded-3xl p-6 sm:p-10 space-y-6 max-w-3xl mx-auto">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#87CEEB]/60 text-[#0EA5A4] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white font-amiri">
              الاستعلام عن حالة طلب كفالة اليتيم
            </h2>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
              أدخل رقم التتبع (مثل ALNOOR-ORPHAN-841920) أو رقم الهاتف المسجل به الطلب
            </p>
          </div>

          <form onSubmit={handleTrackLookup} className="flex gap-2">
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="رقم التتبع أو رقم هاتف مقدم الطلب..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-xs text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              استعلام
            </button>
          </form>

          {trackNotFound && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/50 text-amber-800 dark:text-amber-200 text-xs font-bold text-center">
              لم يتم العثور على طلب بهذا الرقم. يرجى التأكد من كتابة الرمز بشكل صحيح أو التواصل معنا عبر الواتساب: {ORPHANS_CONTACT_INFO.whatsapp}
            </div>
          )}

          {trackedApp && (
            <div className="scholarly-reading-paper p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#87CEEB]/40 pb-3">
                <div>
                  <span className="text-[11px] text-[#4A7298] dark:text-[#87CEEB] block">الرقم المرجعي</span>
                  <span className="text-sm font-black font-mono text-[#12345A] dark:text-[#F7E7B4] tabular-nums">
                    {trackedApp.trackingNumber}
                  </span>
                </div>

                <span
                  className={`text-xs font-bold ${
                    trackedApp.status === 'approved'
                      ? 'text-[#0D7A7A] dark:text-[#5EEAD4]'
                      : trackedApp.status === 'field_visit'
                      ? 'text-[#0284C7] dark:text-[#87CEEB]'
                      : trackedApp.status === 'in_review'
                      ? 'text-[#9A7418] dark:text-[#F7E7B4]'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {getStatusText(trackedApp.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-[#4A7298] dark:text-[#87CEEB] block">اسم اليتيم</span>
                  <span className="font-bold text-[#12345A] dark:text-white">{trackedApp.orphanName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#4A7298] dark:text-[#87CEEB] block">مقدم الطلب</span>
                  <span className="font-bold text-[#12345A] dark:text-white">
                    {trackedApp.applicantName} ({trackedApp.relation})
                  </span>
                </div>
                <div className="tabular-nums">
                  <span className="text-[11px] text-[#4A7298] dark:text-[#87CEEB] block">تاريخ التسجيل</span>
                  <span className="font-bold text-[#12345A] dark:text-white">
                    {new Date(trackedApp.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#0A223D] border border-[#87CEEB]/40">
                <span className="text-[11px] font-bold text-[#0D7A7A] dark:text-[#5EEAD4] block mb-1">
                  تقرير لجنة المتابعة والبحث الاجتماعي:
                </span>
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                  {trackedApp.fieldNotes || 'الملف تحت المراجعة الفنية.'}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 5: DEDICATED ORPHANS ADMIN DASHBOARD */}
      {activeTab === 'admin' && (
        <section className="sky-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
          {!isAuthorizedAdmin ? (
            <div className="max-w-md mx-auto text-center space-y-4 py-8">
              <div className="w-12 h-12 rounded-2xl bg-[#12345A] text-[#F7E7B4] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-[#12345A] dark:text-white">
                دخول لوحة إدارة قسم كفالة الأيتام
              </h2>
              <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                مخصصة للباحثين الاجتماعيين ولجنة اعتماد طلبات الكفالة بمجمع النور عبر المصادقة المؤسسية المعتمدة.
              </p>
              {user && (
                <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5">
                  أنت مسجل حالياً بحساب ({user.email}) دون صلاحية مشرف أيتام. يرجى تسجيل الدخول بحساب الإدارة المعتمد.
                </p>
              )}
              <button
                type="button"
                onClick={openAuthModal}
                className="w-full py-3 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                تسجيل الدخول بحساب الإدارة المعتمد
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#12345A] dark:text-white font-amiri">
                    لوحة متابعة واعتماد طلبات الأيتام
                  </h2>
                  <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] tabular-nums">
                    إجمالي الطلبات المسجلة: {adminApplications.length} طلب · المشرف: {user?.email}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    value={adminFieldNote}
                    onChange={(e) => setAdminFieldNote(e.target.value)}
                    placeholder="ملاحظة التحديث الميداني (اختياري)..."
                    className="px-3 py-1.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 text-xs bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white focus:outline-none"
                  />
                  <select
                    value={adminStatusFilter}
                    onChange={(e) => setAdminStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 text-xs bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="in_review">قيد المراجعة</option>
                    <option value="field_visit">زيارة ميدانية</option>
                    <option value="approved">معتمد</option>
                    <option value="rejected">مرفوض</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse tabular-nums">
                  <thead>
                    <tr className="border-b border-[#87CEEB]/40 text-[#4A7298] dark:text-[#87CEEB]">
                      <th className="py-2.5 px-3">رقم التتبع</th>
                      <th className="py-2.5 px-3">اسم اليتيم</th>
                      <th className="py-2.5 px-3">ولي الأمر</th>
                      <th className="py-2.5 px-3">الهاتف</th>
                      <th className="py-2.5 px-3">الحالة</th>
                      <th className="py-2.5 px-3">الإجراء السريع</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#87CEEB]/25">
                    {adminApplications
                      .filter((a) => (adminStatusFilter === 'all' ? true : a.status === adminStatusFilter))
                      .map((app) => (
                        <tr key={app.id} className="hover:bg-[#EAF8FF]/70 dark:hover:bg-[#0A223D]/70">
                          <td className="py-3 px-3 font-mono font-bold text-[#12345A] dark:text-[#F7E7B4]">
                            {app.trackingNumber}
                          </td>
                          <td className="py-3 px-3 font-bold text-[#12345A] dark:text-white">
                            {app.orphanName}
                          </td>
                          <td className="py-3 px-3 text-[#2B547E] dark:text-[#B8DEF5]">
                            {app.applicantName} ({app.relation})
                          </td>
                          <td className="py-3 px-3 font-mono text-[#12345A] dark:text-[#EAF8FF]" dir="ltr">
                            {app.phone}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-xs font-bold ${
                                app.status === 'approved'
                                  ? 'text-[#0D7A7A] dark:text-[#5EEAD4]'
                                  : app.status === 'field_visit'
                                  ? 'text-[#0284C7] dark:text-[#87CEEB]'
                                  : app.status === 'in_review'
                                  ? 'text-[#9A7418] dark:text-[#F7E7B4]'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {getStatusText(app.status)}
                            </span>
                          </td>
                          <td className="py-3 px-3 flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={statusUpdatingId === app.id}
                              onClick={() => handleUpdateStatus(app.id, 'field_visit')}
                              className="px-2.5 py-1 rounded-lg bg-[#0284C7] text-white text-[11px] font-bold cursor-pointer disabled:opacity-50"
                            >
                              زيارة
                            </button>
                            <button
                              type="button"
                              disabled={statusUpdatingId === app.id}
                              onClick={() => handleUpdateStatus(app.id, 'approved')}
                              className="px-2.5 py-1 rounded-lg bg-[#0EA5A4] text-white text-[11px] font-bold cursor-pointer disabled:opacity-50"
                            >
                              اعتماد
                            </button>
                            <button
                              type="button"
                              disabled={statusUpdatingId === app.id}
                              onClick={() => handleUpdateStatus(app.id, 'rejected')}
                              className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold cursor-pointer disabled:opacity-50"
                            >
                              رفض
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* SPONSOR MODAL */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-[#091B33]/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="sky-card-3d rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 border-[#D4AF37]/60">
            <div className="flex items-center justify-between border-b border-[#87CEEB]/35 dark:border-[#87CEEB]/20 pb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#0EA5A4] fill-current" />
                <h3 className="text-lg font-black text-[#12345A] dark:text-white font-amiri">
                  كفالة: {selectedProgram.titleAr}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="text-xs font-bold text-[#2B547E] dark:text-[#B8DEF5] hover:text-[#12345A] dark:hover:text-white cursor-pointer"
              >
                ✕ إغلاق
              </button>
            </div>

            {sponsorSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#0EA5A4]/15 text-[#0EA5A4] mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-base font-black text-[#12345A] dark:text-white">
                  تقبل الله كفالتكم المباركة!
                </h4>
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] tabular-nums">
                  تم تسجيل نيتكم لكفالة البرنامج (${selectedProgram.monthlyAmountUsd}/شهر). سيتواصل معكم منسق الكفالات بمجمع النور عبر الواتساب لتزويدكم بتقرير اليتيم وسند الاستلام.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="px-6 py-2 rounded-xl bg-[#12345A] text-white text-xs font-bold cursor-pointer"
                >
                  تم
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#87CEEB]/50 space-y-1 tabular-nums">
                  <span className="font-bold text-[#12345A] dark:text-[#F7E7B4] block">
                    المبلغ الشهري للكفالة: ${selectedProgram.monthlyAmountUsd} دولار أمريكي
                  </span>
                  <p className="text-[11px] text-[#2B547E] dark:text-[#B8DEF5]">
                    {selectedProgram.descriptionAr}
                  </p>
                </div>

                <div>
                  <label className="block text-[#12345A] dark:text-white font-bold mb-1">
                    اسم الكافل الكريم (أو فاعل خير)
                  </label>
                  <input
                    type="text"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    placeholder="مثال: فاعل خير من مكة المكرمة"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#12345A] dark:text-white font-bold mb-1">
                    رقم الواتساب للتواصل وإرسال التقارير الدورية
                  </label>
                  <input
                    type="tel"
                    value={sponsorPhone}
                    onChange={(e) => setSponsorPhone(e.target.value)}
                    placeholder="+966xxxxxxxxx أو +249xxxxxxxxx"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#87CEEB]/60 dark:border-[#87CEEB]/30 bg-white dark:bg-[#0A223D] text-[#12345A] dark:text-white"
                    dir="ltr"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <a
                    href={`https://wa.me/249904499914?text=${encodeURIComponent(
                      `السلام عليكم، أرغب في كفالة برنامج: ${selectedProgram.titleAr} بقيمة $${selectedProgram.monthlyAmountUsd} شهرياً بمجمع النور.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>تأكيد عبر واتساب المجمع</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSponsorSuccess(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold cursor-pointer"
                  >
                    تأكيد الكفالة
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin-managed Dynamic Section Items */}
      <SectionDynamicItems sectionSlug="orphansCare" />

      {/* Official Slogan & Verified Al-Noor Contact Card */}
      <section className="rounded-3xl border border-[#87CEEB]/45 bg-gradient-to-br from-[#12345A] via-[#0F2747] to-[#0A223D] text-white p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <span className="text-xs font-bold text-[#F7E7B4]">
              مجمع النور الإسلامي العالمي · لجنة كفالة الأيتام والرعاية الاجتماعية
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-amiri text-white">
              «نورٌ يرعى براءة الطفولة.. وأجرٌ دائم يرافقك إلى الجنة»
            </h3>
            <p className="text-xs text-[#B8DEF5] max-w-xl">
              تصل كفالتك إلى مستحقيها مباشرة، مع توثيق دوري بالصور والتقارير الأكاديمية والتربوية لليتيم المكفول.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto tabular-nums">
            <a
              href={ORPHANS_CONTACT_INFO.mobileTel}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-[#87CEEB]/35 text-white text-xs font-bold text-center flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <Phone className="w-4 h-4 text-[#F7E7B4]" />
              <span dir="ltr">{ORPHANS_CONTACT_INFO.mobile}</span>
            </a>

            <a
              href={ORPHANS_CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold text-center flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>واتساب المجمع: {ORPHANS_CONTACT_INFO.whatsapp}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
