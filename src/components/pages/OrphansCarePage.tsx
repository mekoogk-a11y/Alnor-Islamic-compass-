import React, { useState } from 'react';
import { 
  Heart, Users, ShieldCheck, CheckCircle2, AlertCircle, Phone, 
  MessageCircle, Mail, Search, FileText, Upload, Sparkles, 
  ArrowRight, ArrowLeft, Calendar, User, MapPin, DollarSign,
  Clock, Check, Filter, ExternalLink, Lock, Eye, RefreshCw, Copy, Building2
} from 'lucide-react';
import { NavigationPage, OrphanApplication, OrphanProfile, SponsorshipProgram } from '../../types';
import { ORPHANS_CONTACT_INFO, SPONSORSHIP_PROGRAMS, INITIAL_ORPHANS_PROFILES, INITIAL_ORPHAN_APPLICATIONS } from '../../data/orphansData';
import { OFFICIAL_DONATION_INFO } from '../../data/islamicData';
import { useLanguage } from '../../context/LanguageContext';
import { orphansFirebaseService } from '../../services/orphansFirebaseService';

interface OrphansCarePageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const OrphansCarePage: React.FC<OrphansCarePageProps> = ({ onNavigate }) => {
  const { lang, isRtl } = useLanguage();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'programs' | 'profiles' | 'register' | 'track' | 'admin'>('programs');

  // Multi-step Registration Form State (Steps 1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    // Step 1: Guardian / Applicant
    applicantName: '',
    relation: 'أم اليتيم',
    phone: '',
    nationalId: '',
    address: '',
    // Step 2: Assistance Type
    assistanceType: 'full_sponsorship',
    monthlyRequiredUsd: 50,
    // Step 3: Orphan Details
    orphanName: '',
    orphanBirthDate: '',
    orphanGender: 'male' as 'male' | 'female',
    academicLevel: 'الابتدائي',
    healthNotes: '',
    familyMembersCount: 3,
    // Step 4: Documents Upload & Verification
    hasDeathCert: false,
    hasBirthCert: false,
    hasResidenceProof: false,
    uploadedDocName: '',
    // Step 5: Declaration
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

  // Admin section
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
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
        assistanceType: formData.assistanceType as any,
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

      // Add to admin list & submitted state
      setAdminApplications((prev) => [newApp, ...prev]);
      setSubmittedApplication(newApp);

      // Firestore persistence
      try {
        await orphansFirebaseService.submitApplication(newApp);
      } catch (err) {
        console.warn('Firestore application sync note:', err);
      }

      // Backend sync attempt
      try {
        await fetch('/api/v1/orphans/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newApp)
        });
      } catch (err) {
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

    // Check local list first
    const found = adminApplications.find(
      (a) => a.trackingNumber.toUpperCase() === q || a.phone.includes(q) || a.nationalId === q
    );
    if (found) {
      setTrackedApp(found);
      setTrackNotFound(false);
      return;
    }

    // Check Firestore
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
  const handleUpdateStatus = async (appId: string, newStatus: any) => {
    setStatusUpdatingId(appId);
    try {
      setAdminApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus, fieldNotes: adminFieldNote || a.fieldNotes, updatedAt: new Date().toISOString() } : a))
      );
      setAdminFieldNote('');
      try {
        await fetch(`/api/v1/orphans/applications/${appId}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, notes: adminFieldNote })
        });
      } catch (err) {}
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      
      {/* Top Unified Official Contact Bar */}
      <div className="rounded-2xl bg-[#394E43] text-[#F7F5EF] p-4 px-6 flex flex-wrap items-center justify-between gap-4 shadow-md border border-[#B9A477]/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2F4238] border border-[#B9A477]/50 flex items-center justify-center text-[#B9A477]">
            <Heart className="w-5 h-5 fill-current animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black font-amiri text-[#F7F5EF]">
              قسم كفالة ورعاية الأيتام • مجمع النور الإسلامي العالمي
            </h4>
            <p className="text-[11px] text-[#E5DCCB]">
              هواتف التواصل المعتمدة الرسمية لتقديم الطلبات والكفالات المباشرة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs font-mono font-bold">
          <a
            href={ORPHANS_CONTACT_INFO.mobileTel}
            className="px-3.5 py-1.5 rounded-xl bg-[#283830] hover:bg-[#1E2B25] border border-[#B9A477]/40 text-[#F7F5EF] flex items-center gap-2 transition-all shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-[#B9A477]" />
            <span dir="ltr">{ORPHANS_CONTACT_INFO.mobile}</span>
          </a>

          <a
            href={ORPHANS_CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-2 transition-all shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>واتساب المجمع:</span>
            <span dir="ltr">{ORPHANS_CONTACT_INFO.whatsapp}</span>
          </a>
        </div>
      </div>

      {/* Hero Banner with Hadith and Dignified Institutional Design */}
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-12 shadow-lg border border-[#E5DCCB] dark:border-[#3A4237] bg-gradient-to-br from-[#F7F5EF] via-[#F0EDE4] to-[#E5DCCB] dark:from-[#272B25] dark:via-[#1F221E] dark:to-[#2F362C]">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#394E43] text-[#F7F5EF] text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B9A477]" />
            <span>صرح الإحسان والبركة • Al-Noor Global Orphans Welfare</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#343832] dark:text-[#F7F5EF] font-amiri leading-tight">
            كفالة الأيتام – مجمع النور الإسلامي العالمي
          </h1>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F2]/90 dark:bg-[#1F221E]/90 border border-[#B9A477]/50 shadow-sm max-w-2xl">
            <p className="text-base sm:text-lg font-amiri font-bold text-[#394E43] dark:text-[#B9A477] leading-relaxed">
              {ORPHANS_CONTACT_INFO.hadithText}
            </p>
            <span className="text-[11px] text-[#657568] dark:text-[#D8CEBB] block mt-1">
              رواه البخاري في صحيحه عن سهل بن سعد رضي الله عنه
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#657568] dark:text-[#D8CEBB] leading-relaxed max-w-3xl">
            نظام مؤسسي متكامل لرعاية الأيتام والأسر المتعففة، يجمع بين الكفالة المعيشية الشاملة، والتعليم القرآني والأكاديمي، والرعاية الصحية، مع توثيق ميداني وشفافية كاملة وتقارير دورية لكافل اليتيم.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => setActiveTab('programs')}
              className="px-5 py-2.5 rounded-xl bg-[#394E43] hover:bg-[#2F4238] text-[#F7F5EF] text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-[#B9A477] fill-current" />
              <span>برامج الكفالة والتبرع</span>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className="px-5 py-2.5 rounded-xl bg-[#FAF8F2] dark:bg-[#272B25] hover:bg-[#F0EDE4] border border-[#394E43] text-[#394E43] dark:text-[#F7F5EF] text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#394E43] dark:text-[#B9A477]" />
              <span>استمارة تسجيل يتيم جديد</span>
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className="px-4 py-2.5 rounded-xl bg-[#E5DCCB] dark:bg-[#343832] hover:bg-[#D8CEBB] text-[#343832] dark:text-[#F7F5EF] text-xs font-bold transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-[#394E43] dark:text-[#B9A477]" />
              <span>متابعة حالة طلب سابق</span>
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-[#D8CEBB] dark:border-[#3A4237] pb-3 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'programs'
                ? 'bg-[#394E43] text-[#F7F5EF] shadow-sm'
                : 'bg-[#FAF8F2] dark:bg-[#272B25] text-[#343832] dark:text-[#D8CEBB] hover:bg-[#F0EDE4]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#B9A477]" />
            <span>باقات وبرامج الكفالة ({SPONSORSHIP_PROGRAMS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profiles'
                ? 'bg-[#394E43] text-[#F7F5EF] shadow-sm'
                : 'bg-[#FAF8F2] dark:bg-[#272B25] text-[#343832] dark:text-[#D8CEBB] hover:bg-[#F0EDE4]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#B9A477]" />
            <span>أيتام بانتظار الكفالة ({profiles.filter(p => !p.isSponsored).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'register'
                ? 'bg-[#394E43] text-[#F7F5EF] shadow-sm'
                : 'bg-[#FAF8F2] dark:bg-[#272B25] text-[#343832] dark:text-[#D8CEBB] hover:bg-[#F0EDE4]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#B9A477]" />
            <span>استمارة تسجيل يتيم (5 خطوات)</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'track'
                ? 'bg-[#394E43] text-[#F7F5EF] shadow-sm'
                : 'bg-[#FAF8F2] dark:bg-[#272B25] text-[#343832] dark:text-[#D8CEBB] hover:bg-[#F0EDE4]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#B9A477]" />
            <span>الاستعلام عن طلب</span>
          </button>
        </div>

        <button
          onClick={() => setActiveTab('admin')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
            activeTab === 'admin'
              ? 'bg-[#343832] text-[#B9A477] border-[#B9A477]'
              : 'border-[#D8CEBB] dark:border-[#3A4237] text-[#657568] hover:text-[#343832]'
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
              <h2 className="text-xl sm:text-2xl font-black text-[#343832] dark:text-[#F7F5EF] font-amiri">
                باقات وبرامج الكفالة المعتمدة
              </h2>
              <p className="text-xs text-[#657568] dark:text-[#D8CEBB]">
                كافة المبالغ تودع في الحساب الوقفي الرسمي لمجمع النور، وتصرف بإشراف لجان رقابية وشرعية معتمدة.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#394E43] dark:text-[#B9A477] bg-[#F0EDE4] dark:bg-[#272B25] p-2 px-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>توثيق شرعي ورقابة دورية</span>
            </div>
          </div>

          {/* Official Bank of Khartoum Account Direct Transfer Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#111C3D] via-[#0B132B] to-[#070D1E] border-2 border-amber-400/60 shadow-xl text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-400/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base sm:text-lg text-white">
                      {OFFICIAL_DONATION_INFO.bankName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] text-emerald-300 font-bold">
                      حساب كفالة الأيتام والمجمع
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 mt-0.5 block font-medium">
                    التحويل الفوري متاح عبر تطبيق (بنكك - Bankak) من داخل وخارج السودان
                  </span>
                </div>
              </div>

              {/* Account Box & 1-Click Copy */}
              <div className="flex items-center gap-3 bg-[#070D1E] px-4 py-3 rounded-2xl border border-amber-400/40">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">رقم الحساب:</span>
                  <span className="text-2xl font-mono font-black text-amber-300 tracking-wider">
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedBankAcc 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
                  }`}
                >
                  {copiedBankAcc ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBankAcc ? 'تم النسخ!' : 'نسخ الحساب'}</span>
                </button>
              </div>
            </div>

            <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">اسم صاحب الحساب:</span>
                <span className="text-amber-200 font-bold text-sm font-amiri block">
                  {OFFICIAL_DONATION_INFO.accountHolder}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">الصفة المؤسسية:</span>
                <span className="text-slate-300 font-medium text-xs block leading-relaxed">
                  {OFFICIAL_DONATION_INFO.directorTitle}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPONSORSHIP_PROGRAMS.map((prog) => (
              <div
                key={prog.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 transition-all border ${
                  prog.popular
                    ? 'bg-[#FAF8F2] dark:bg-[#272B25] border-[#394E43] shadow-lg ring-2 ring-[#394E43]/20 relative'
                    : 'bg-[#FAF8F2] dark:bg-[#1F221E] border-[#E5DCCB] dark:border-[#3A4237] hover:shadow-md'
                }`}
              >
                {prog.popular && (
                  <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#394E43] text-[#F7F5EF] text-[10px] font-black shadow-sm">
                    {prog.badgeText}
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#657568] dark:text-[#D8CEBB]">
                      {prog.badgeText}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#394E43] dark:text-[#B9A477] font-mono">
                        ${prog.monthlyAmountUsd}
                      </span>
                      <span className="text-[11px] text-[#657568] block">/ شهرياً</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[#343832] dark:text-[#F7F5EF] font-amiri">
                    {prog.titleAr}
                  </h3>

                  <p className="text-xs text-[#657568] dark:text-[#D8CEBB] leading-relaxed">
                    {prog.descriptionAr}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#E5DCCB] dark:border-[#343832]">
                    <span className="text-[11px] font-bold text-[#343832] dark:text-[#F7F5EF] block">
                      ما تشمله الكفالة:
                    </span>
                    <ul className="space-y-1.5">
                      {(prog.coveredItems || prog.coveragePoints || []).map((item, idx) => (
                        <li key={idx} className="text-xs text-[#657568] dark:text-[#D8CEBB] flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5DCCB] dark:border-[#343832]">
                  <button
                    onClick={() => {
                      setSelectedProgram(prog);
                      setSponsorSuccess(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#394E43] hover:bg-[#2F4238] text-[#F7F5EF] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#B9A477] fill-current" />
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
              <h2 className="text-xl sm:text-2xl font-black text-[#343832] dark:text-[#F7F5EF] font-amiri">
                أيتام مجمع النور بانتظار الكفالة المباشرة
              </h2>
              <p className="text-xs text-[#657568] dark:text-[#D8CEBB]">
                حالات تم فحصها ميدانياً والتأكد من استحقاقها الشرعي والقانوني بنسبة 100%.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#FAF8F2] dark:bg-[#272B25] p-1 rounded-xl border border-[#D8CEBB]">
              <button
                onClick={() => setProfilesFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  profilesFilter === 'all' ? 'bg-[#394E43] text-white' : 'text-[#657568]'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setProfilesFilter('unsponsored')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  profilesFilter === 'unsponsored' ? 'bg-[#394E43] text-white' : 'text-[#657568]'
                }`}
              >
                بانتظار الكفالة
              </button>
              <button
                onClick={() => setProfilesFilter('sponsored')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  profilesFilter === 'sponsored' ? 'bg-[#394E43] text-white' : 'text-[#657568]'
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
                  className="rounded-3xl p-6 bg-[#FAF8F2] dark:bg-[#272B25] border border-[#E5DCCB] dark:border-[#3A4237] shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#E5DCCB] dark:bg-[#343832] flex items-center justify-center text-[#394E43] dark:text-[#B9A477] font-bold text-lg">
                        {orphan.gender === 'male' ? '👦' : '👧'}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-[#343832] dark:text-[#F7F5EF]">
                          {orphan.fullName}
                        </h3>
                        <span className="text-xs text-[#657568] dark:text-[#D8CEBB] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#B9A477]" />
                          <span>{orphan.governorate}</span>
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        orphan.isSponsored
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 animate-pulse'
                      }`}
                    >
                      {orphan.isSponsored ? '✓ تمت كفالته' : '● بانتظار الكافل'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2">
                    <div className="p-2.5 rounded-xl bg-[#F0EDE4] dark:bg-[#1F221E]">
                      <span className="text-[10px] text-[#657568] block">العمر</span>
                      <span className="font-bold text-[#343832] dark:text-[#F7F5EF]">{orphan.age} سنوات</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F0EDE4] dark:bg-[#1F221E]">
                      <span className="text-[10px] text-[#657568] block">المرحلة الدراسية</span>
                      <span className="font-bold text-[#343832] dark:text-[#F7F5EF]">{orphan.academicStage}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F0EDE4] dark:bg-[#1F221E]">
                      <span className="text-[10px] text-[#657568] block">أفراد الأسرة</span>
                      <span className="font-bold text-[#343832] dark:text-[#F7F5EF]">{orphan.familyMembersCount} أفراد</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#657568] dark:text-[#D8CEBB] leading-relaxed bg-[#F0EDE4]/60 dark:bg-[#1F221E]/60 p-3 rounded-xl">
                    {orphan.storySummary}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] text-[#657568] block">مبلغ الكفالة الشهري</span>
                      <span className="text-base font-black text-[#394E43] dark:text-[#B9A477] font-mono">
                        ${orphan.monthlyRequiredUsd} / شهر
                      </span>
                    </div>

                    {!orphan.isSponsored ? (
                      <button
                        onClick={() => {
                          setSelectedProgram(SPONSORSHIP_PROGRAMS[0]);
                          setSponsorSuccess(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#394E43] hover:bg-[#2F4238] text-[#F7F5EF] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current text-[#B9A477]" />
                        <span>اكفل {orphan.fullName.split(' ')[0]} الآن</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
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
        <section className="rounded-3xl border border-[#E5DCCB] dark:border-[#3A4237] p-6 sm:p-10 shadow-lg bg-[#FAF8F2] dark:bg-[#272B25] space-y-8">
          
          {submittedApplication ? (
            /* Success confirmation screen */
            <div className="text-center py-12 space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-md">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-[#343832] dark:text-[#F7F5EF] font-amiri">
                  تم استلام طلب كفالة اليتيم بنجاح!
                </h2>
                <p className="text-xs sm:text-sm text-[#657568] dark:text-[#D8CEBB]">
                  تم تسجيل ملف اليتيم {submittedApplication.orphanName} في سجلات مجمع النور الإسلامي العالمي. سيقوم الباحث الاجتماعي بالتواصل معكم لتنسيق الزيارة الميدانية.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#B9A477]/40 space-y-2">
                <span className="text-xs text-[#657568] dark:text-[#D8CEBB] block font-bold">
                  الرقم المرجعي لتتبع الطلب (احتفظ به):
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-[#394E43] dark:text-[#B9A477] tracking-wider select-all block">
                  {submittedApplication.trackingNumber}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSubmittedApplication(null);
                    setCurrentStep(1);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#394E43] hover:bg-[#2F4238] text-[#F7F5EF] text-xs font-bold transition-all"
                >
                  تسجيل طلب يتيم آخر
                </button>
                <button
                  onClick={() => {
                    setTrackQuery(submittedApplication.trackingNumber);
                    setActiveTab('track');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#E5DCCB] dark:bg-[#343832] text-[#343832] dark:text-[#F7F5EF] text-xs font-bold transition-all"
                >
                  متابعة حالة هذا الطلب
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Form Header & Step Indicator */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DCCB] dark:border-[#343832] pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#343832] dark:text-[#F7F5EF] font-amiri">
                      استمارة تسجيل يتيم جديد – مجمع النور الإسلامي
                    </h2>
                    <p className="text-xs text-[#657568] dark:text-[#D8CEBB]">
                      الخطوة {currentStep} من 5: {
                        currentStep === 1 ? 'بيانات ولي الأمر / مقدم الطلب' :
                        currentStep === 2 ? 'تحديد نوع الرعاية والمساعدة' :
                        currentStep === 3 ? 'بيانات الطفل اليتيم' :
                        currentStep === 4 ? 'إرفاق الوثائق والمستندات' : 'الإقرار الشرعي وتأكيد الإرسال'
                      }
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#394E43] dark:text-[#B9A477]">
                    قسم الرعاية الميدانية
                  </span>
                </div>

                {/* Progress Bar Steps */}
                <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
                  {[
                    '1. ولي الأمر',
                    '2. نوع الرعاية',
                    '3. بيانات اليتيم',
                    '4. المستندات',
                    '5. التأكيد'
                  ].map((label, idx) => {
                    const stepNum = idx + 1;
                    const isDone = currentStep > stepNum;
                    const isCurrent = currentStep === stepNum;
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl transition-all border ${
                          isDone
                            ? 'bg-[#394E43] text-[#F7F5EF] border-[#394E43]'
                            : isCurrent
                            ? 'bg-[#E5DCCB] dark:bg-[#343832] text-[#394E43] dark:text-[#B9A477] border-[#394E43] ring-2 ring-[#394E43]/20'
                            : 'bg-[#F0EDE4] dark:bg-[#1F221E] text-[#657568] border-transparent'
                        }`}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Step 1: Guardian info */}
              {currentStep === 1 && (
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-sm font-black text-[#343832] dark:text-[#F7F5EF]">
                    بيانات مقدم الطلب / ولي أمر اليتيم
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[#343832] dark:text-[#F7F5EF] font-bold mb-1">
                        الاسم الرباعي لمقدم الطلب *
                      </label>
                      <input
                        type="text"
                        value={formData.applicantName}
                        onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                        placeholder="مثال: آمنة عبد الله البشير"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-[#FAF8F2] dark:bg-[#1F221E] text-[#343832] dark:text-[#F7F5EF] focus:outline-none focus:border-[#394E43]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#343832] dark:text-[#F7F5EF] font-bold mb-1">
                          صلة القرابة باليتيم *
                        </label>
                        <select
                          value={formData.relation}
                          onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-[#FAF8F2] dark:bg-[#1F221E] text-[#343832] dark:text-[#F7F5EF] focus:outline-none focus:border-[#394E43]"
                        >
                          <option value="أم اليتيم">أم اليتيم (أرملة)</option>
                          <option value="جد / جدة">جد / جدة اليتيم</option>
                          <option value="عم / خال">عم / خال اليتيم</option>
                          <option value="أخ / أخت بالغة">أخ / أخت بالغة</option>
                          <option value="وصي شرعي معتمد">وصي شرعي معتمد</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#343832] dark:text-[#F7F5EF] font-bold mb-1">
                          رقم الهاتف / الواتساب للتواصل *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+249912169169"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-[#FAF8F2] dark:bg-[#1F221E] text-[#343832] dark:text-[#F7F5EF] focus:outline-none focus:border-[#394E43]"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#343832] dark:text-[#F7F5EF] font-bold mb-1">
                          الرقم الوطني / رقم الهوية *
                        </label>
                        <input
                          type="text"
                          value={formData.nationalId}
                          onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                          placeholder="الرقم الوطني المكون من 10 أرقام"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-[#FAF8F2] dark:bg-[#1F221E] text-[#343832] dark:text-[#F7F5EF] focus:outline-none focus:border-[#394E43]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#343832] dark:text-[#F7F5EF] font-bold mb-1">
                          عنوان السكن الحالي بالتفصيل *
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="المدينة، الحي، رقم المنزل أو المعلم البارز"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-[#FAF8F2] dark:bg-[#1F221E] text-[#343832] dark:text-[#F7F5EF] focus:outline-none focus:border-[#394E43]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Assistance Type */}
              {currentStep === 2 && (
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-sm font-black text-[#343832] dark:text-[#F7F5EF]">
                    تحديد نوع المساعدة والرعاية المطلوبة
                  </h3>

                  <div className="space-y-3">
                    {[
                      { id: 'full_sponsorship', title: 'كفالة شاملة شهرية ($50)', desc: 'تغطي الغذاء والدراسة والرعاية الطبية وكسوة العيد' },
                      { id: 'monthly_stipend', title: 'كفالة تعليمية وحفظ قرآن ($25)', desc: 'تغطي الرسوم الدراسية والكتب والحلقات القرآنية' },
                      { id: 'food_basket', title: 'سلة غذائية تموينية شهرية ($40)', desc: 'توفير المؤونة الأساسية لأسرة اليتيم شهرياً' },
                      { id: 'medical_aid', title: 'رعاية صحية وتغطية علاجية ($35)', desc: 'مساعدة الحالات المرضية والأدوية المستمرة' }
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                          formData.assistanceType === opt.id
                            ? 'bg-[#F0EDE4] dark:bg-[#1F221E] border-[#394E43] ring-2 ring-[#394E43]/20'
                            : 'bg-[#FAF8F2] dark:bg-[#272B25] border-[#D8CEBB] dark:border-[#343832]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="assistanceType"
                          value={opt.id}
                          checked={formData.assistanceType === opt.id}
                          onChange={(e) => setFormData({ ...formData, assistanceType: e.target.value })}
                          className="mt-1 accent-[#394E43]"
                        />
                        <div>
                          <span className="text-xs font-black text-[#343832] dark:text-[#F7F5EF] block">
                            {opt.title}
                          </span>
                          <span className="text-[11px] text-[#657568] dark:text-[#D8CEBB]">
                            {opt.desc}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Orphan details */}
              {currentStep === 3 && (
                <div className="space-y-4 max-w-2xl text-xs">
                  <h3 className="text-sm font-black text-[#343832] dark:text-[#F7F5EF]">
                    بيانات الطفل اليتيم المستفيد
                  </h3>

                  <div>
                    <label className="block text-[#343832] dark:text-[#F7F5EF] font-bold mb-1">
                      الاسم الرباعي للطفل اليتيم *
                    </label>
                    <input
                      type="text"
                      value={formData.orphanName}
                      onChange={(e) => setFormData({ ...formData, orphanName: e.target.value })}
                      placeholder="اسم اليتيم كاملاً كما هو في شهادة الميلاد"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-[#FAF8F2] dark:bg-[#1F221E] text-[#343832] dark:text-[#F7F5EF] focus:outline-none focus:border-[#394E43]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#343832] dark:text-[#F7F5EF] font-bold mb-1">
                        تاريخ الميلاد *
                      </label>
                      <input
                        type="date"
                        value={formData.orphanBirthDate}
                        onChange={(e) => setFormData({ ...formData, orphanBirthDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-[#FAF8F2] dark:bg-[#1F221E] text-[#343832] dark:text-[#F7F5EF] focus:outline-none focus:border-[#394E43]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#343832] dark:text-[#F7F5EF] font-bold mb-1">
                        الجنس *
                      </label>
                      <select
                        value={formData.orphanGender}
                        onChange={(e) => setFormData({ ...formData, orphanGender: e.target.value as any })}
                        className="w-full px-4 py-2 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-[#FAF8F2] dark:bg-[#1F221E] text-[#343832] dark:text-[#F7F5EF] focus:outline-none focus:border-[#394E43]"
                      >
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#343832] dark:text-[#F7F5EF] font-bold mb-1">
                        المرحلة الدراسية
                      </label>
                      <select
                        value={formData.academicLevel}
                        onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-[#FAF8F2] dark:bg-[#1F221E] text-[#343832] dark:text-[#F7F5EF] focus:outline-none focus:border-[#394E43]"
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
                    <label className="block text-[#343832] dark:text-[#F7F5EF] font-bold mb-1">
                      الحالة الصحية وملاحظات الرعاية (إن وجدت)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.healthNotes}
                      onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
                      placeholder="هل يعاني من حساسية أو مرض مزمن أو احتياجات بصرية/سمعية خاصة؟"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-[#FAF8F2] dark:bg-[#1F221E] text-[#343832] dark:text-[#F7F5EF] focus:outline-none focus:border-[#394E43]"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Documents Upload & Verification */}
              {currentStep === 4 && (
                <div className="space-y-4 max-w-2xl text-xs">
                  <h3 className="text-sm font-black text-[#343832] dark:text-[#F7F5EF]">
                    الوثائق الرسمية المطلوبة للتحقق الشرعي
                  </h3>

                  <div className="space-y-3 bg-[#F0EDE4] dark:bg-[#1F221E] p-4 rounded-2xl border border-[#D8CEBB] dark:border-[#343832]">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#343832] dark:text-[#F7F5EF]">
                      <input
                        type="checkbox"
                        checked={formData.hasDeathCert}
                        onChange={(e) => setFormData({ ...formData, hasDeathCert: e.target.checked })}
                        className="rounded accent-[#394E43] w-4 h-4"
                      />
                      <span>أؤكد توفر شهادة وفاة الأب الرسمية الصادرة من السجل المدني *</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#343832] dark:text-[#F7F5EF]">
                      <input
                        type="checkbox"
                        checked={formData.hasBirthCert}
                        onChange={(e) => setFormData({ ...formData, hasBirthCert: e.target.checked })}
                        className="rounded accent-[#394E43] w-4 h-4"
                      />
                      <span>أؤكد توفر شهادة ميلاد اليتيم الرسمية أو الرقم الوطني *</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#343832] dark:text-[#F7F5EF]">
                      <input
                        type="checkbox"
                        checked={formData.hasResidenceProof}
                        onChange={(e) => setFormData({ ...formData, hasResidenceProof: e.target.checked })}
                        className="rounded accent-[#394E43] w-4 h-4"
                      />
                      <span>شهادة إثبات سكن أو إفادة من اللجنة المحلية (مستحسن)</span>
                    </label>
                  </div>

                  <div className="p-4 border-2 border-dashed border-[#D8CEBB] dark:border-[#3A4237] rounded-2xl text-center space-y-2">
                    <Upload className="w-8 h-8 text-[#B9A477] mx-auto" />
                    <div>
                      <span className="font-bold text-[#343832] dark:text-[#F7F5EF] block">
                        رفع نسخة ضوئية من المستندات (PDF أو صور JPG/PNG)
                      </span>
                      <span className="text-[11px] text-[#657568]">
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
                            hasBirthCert: true 
                          });
                        }
                      }}
                    />
                    <label
                      htmlFor="doc-upload"
                      className="inline-block px-4 py-2 rounded-xl bg-[#394E43] text-[#F7F5EF] text-xs font-bold cursor-pointer hover:bg-[#2F4238] transition-all"
                    >
                      {formData.uploadedDocName ? `تم اختيار: ${formData.uploadedDocName}` : 'اختيار الملفات من جهازك'}
                    </label>
                  </div>
                </div>
              )}

              {/* Step 5: Declaration & Submission */}
              {currentStep === 5 && (
                <div className="space-y-4 max-w-2xl text-xs">
                  <h3 className="text-sm font-black text-[#343832] dark:text-[#F7F5EF]">
                    الإقرار الشرعي وتأكيد تقديم الطلب
                  </h3>

                  <div className="p-4 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#B9A477]/40 space-y-2 text-[#343832] dark:text-[#F7F5EF]">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>إقرار بصحة البيانات</span>
                    </div>
                    <p className="text-[11px] text-[#657568] dark:text-[#D8CEBB] leading-relaxed">
                      أقر أنا مقدم الطلب بأن جميع البيانات الواردة في هذه الاستمارة صحيحة تماماً ومطابقة للواقع، وأتحمل المسؤولية الشرعية والقانونية، وأوافق على زيارة مندوب مجمع النور الإسلامي للتحقق الميداني من الوضع المعيشي لأسرة اليتيم.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#343832] dark:text-[#F7F5EF]">
                    <input
                      type="checkbox"
                      checked={formData.termsAgreed}
                      onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                      className="rounded accent-[#394E43] w-4 h-4"
                    />
                    <span>أوافق على الإقرار الشرعي ولائحة كفالة الأيتام بمجمع النور *</span>
                  </label>

                  <div className="p-4 rounded-2xl bg-[#FAF8F2] dark:bg-[#1F221E] border border-[#D8CEBB] dark:border-[#3A4237] space-y-2">
                    <label className="block font-bold text-[#343832] dark:text-[#F7F5EF]">
                      التحقق الأمني لمنع الإرسال الآلي: كم حاصل جمع 4 + 3؟ *
                    </label>
                    <input
                      type="text"
                      value={formData.captchaAnswer}
                      onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
                      placeholder="اكتب الناتج بالأرقام (7)"
                      className="w-32 px-4 py-2 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-white dark:bg-[#272B25] text-center font-bold text-base focus:outline-none focus:border-[#394E43]"
                    />
                  </div>
                </div>
              )}

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-[#E5DCCB] dark:border-[#343832]">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2.5 rounded-xl bg-[#E5DCCB] dark:bg-[#343832] text-[#343832] dark:text-[#F7F5EF] text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? '' : 'rotate-180'}`} />
                    <span>السابق</span>
                  </button>
                ) : <div />}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-[#394E43] hover:bg-[#2F4238] text-[#F7F5EF] text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <span>المتابعة للخطوة التالية</span>
                    <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? '' : 'rotate-180'}`} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitForm}
                    disabled={isSubmitting}
                    className="px-8 py-2.5 rounded-xl bg-[#394E43] hover:bg-[#2F4238] disabled:opacity-50 text-[#F7F5EF] text-xs font-black transition-all shadow-md flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#B9A477]" />
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
        <section className="rounded-3xl border border-[#E5DCCB] dark:border-[#3A4237] p-6 sm:p-10 shadow-lg bg-[#FAF8F2] dark:bg-[#272B25] space-y-6 max-w-3xl mx-auto">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#E5DCCB] dark:bg-[#343832] text-[#394E43] dark:text-[#B9A477] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#343832] dark:text-[#F7F5EF] font-amiri">
              الاستعلام عن حالة طلب كفالة اليتيم
            </h2>
            <p className="text-xs text-[#657568] dark:text-[#D8CEBB]">
              أدخل رقم التتبع (مثل ALNOOR-ORPHAN-841920) أو رقم الهاتف المسجل به الطلب
            </p>
          </div>

          <form onSubmit={handleTrackLookup} className="flex gap-2">
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="رقم التتبع أو رقم هاتف مقدم الطلب..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-white dark:bg-[#1F221E] text-xs text-[#343832] dark:text-[#F7F5EF] focus:outline-none focus:border-[#394E43]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#394E43] hover:bg-[#2F4238] text-[#F7F5EF] text-xs font-bold transition-all shadow-sm"
            >
              استعلام
            </button>
          </form>

          {trackNotFound && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-bold text-center">
              لم يتم العثور على طلب بهذا الرقم. يرجى التأكد من كتابة الرمز بشكل صحيح أو التواصل معنا عبر الواتساب: {ORPHANS_CONTACT_INFO.whatsapp}
            </div>
          )}

          {trackedApp && (
            <div className="p-6 rounded-2xl bg-[#F0EDE4] dark:bg-[#1F221E] border border-[#B9A477]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-[#D8CEBB] dark:border-[#343832] pb-3">
                <div>
                  <span className="text-[10px] text-[#657568] block">الرقم المرجعي</span>
                  <span className="text-sm font-black font-mono text-[#394E43] dark:text-[#B9A477]">
                    {trackedApp.trackingNumber}
                  </span>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    trackedApp.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : trackedApp.status === 'field_visit'
                      ? 'bg-blue-100 text-blue-800'
                      : trackedApp.status === 'in_review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {trackedApp.status === 'approved' && '✓ معتمد وتمت الكفالة'}
                  {trackedApp.status === 'field_visit' && '🔎 جارية الزيارة الميدانية'}
                  {trackedApp.status === 'in_review' && '⏳ قيد المراجعة والتدقيق'}
                  {trackedApp.status === 'rejected' && '✕ لم يستوف الشروط'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#657568] block">اسم اليتيم</span>
                  <span className="font-bold text-[#343832] dark:text-[#F7F5EF]">{trackedApp.orphanName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#657568] block">مقدم الطلب</span>
                  <span className="font-bold text-[#343832] dark:text-[#F7F5EF]">{trackedApp.applicantName} ({trackedApp.relation})</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#657568] block">تاريخ التسجيل</span>
                  <span className="font-bold text-[#343832] dark:text-[#F7F5EF]">{new Date(trackedApp.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F2] dark:bg-[#272B25] border border-[#D8CEBB] dark:border-[#3A4237]">
                <span className="text-[11px] font-bold text-[#394E43] dark:text-[#B9A477] block mb-1">
                  تقرير لجنة المتابعة والبحث الاجتماعي:
                </span>
                <p className="text-xs text-[#657568] dark:text-[#D8CEBB]">
                  {trackedApp.fieldNotes || 'الملف تحت المراجعة الفنية.'}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 5: DEDICATED ORPHANS ADMIN DASHBOARD */}
      {activeTab === 'admin' && (
        <section className="rounded-3xl border border-[#E5DCCB] dark:border-[#3A4237] p-6 sm:p-8 shadow-lg bg-[#FAF8F2] dark:bg-[#272B25] space-y-6">
          {!adminAuthenticated ? (
            <div className="max-w-md mx-auto text-center space-y-4 py-8">
              <div className="w-12 h-12 rounded-2xl bg-[#343832] text-[#B9A477] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-[#343832] dark:text-[#F7F5EF]">
                دخول لوحة إدارة قسم كفالة الأيتام
              </h2>
              <p className="text-xs text-[#657568] dark:text-[#D8CEBB]">
                مخصصة للباحثين الاجتماعيين ولجنة اعتماد طلبات الكفالة بمجمع النور
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (adminPassword === 'admin' || adminPassword === 'alnoor2025' || adminPassword === 'orphan') {
                    setAdminAuthenticated(true);
                  } else {
                    alert('كلمة المرور غير صحيحة (استخدم: alnoor2025 أو admin)');
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="كلمة مرور المشرف (alnoor2025)"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] text-xs bg-white dark:bg-[#1F221E] text-center"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#394E43] text-white text-xs font-bold"
                >
                  تسجيل الدخول للوحة الأيتام
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8CEBB] dark:border-[#343832] pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#343832] dark:text-[#F7F5EF] font-amiri">
                    لوحة متابعة واعتماد طلبات الأيتام (Orphans Operations Console)
                  </h2>
                  <p className="text-xs text-[#657568] dark:text-[#D8CEBB]">
                    إجمالي الطلبات المسجلة: {adminApplications.length} طلب
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={adminStatusFilter}
                    onChange={(e) => setAdminStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[#D8CEBB] text-xs bg-white dark:bg-[#1F221E]"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="in_review">قيد المراجعة</option>
                    <option value="field_visit">زيارة ميدانية</option>
                    <option value="approved">معتمد</option>
                    <option value="rejected">مرفوض</option>
                  </select>
                  <button
                    onClick={() => setAdminAuthenticated(false)}
                    className="px-3 py-1.5 rounded-xl bg-red-100 text-red-800 text-xs font-bold"
                  >
                    خروج
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="border-b border-[#D8CEBB] dark:border-[#3A4237] text-[#657568]">
                      <th className="py-2.5 px-3">رقم التتبع</th>
                      <th className="py-2.5 px-3">اسم اليتيم</th>
                      <th className="py-2.5 px-3">ولي الأمر</th>
                      <th className="py-2.5 px-3">الهاتف</th>
                      <th className="py-2.5 px-3">الحالة</th>
                      <th className="py-2.5 px-3">الإجراء السريع</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DCCB] dark:divide-[#343832]">
                    {adminApplications
                      .filter((a) => (adminStatusFilter === 'all' ? true : a.status === adminStatusFilter))
                      .map((app) => (
                        <tr key={app.id} className="hover:bg-[#F0EDE4] dark:hover:bg-[#1F221E]">
                          <td className="py-3 px-3 font-mono font-bold text-[#394E43] dark:text-[#B9A477]">
                            {app.trackingNumber}
                          </td>
                          <td className="py-3 px-3 font-bold text-[#343832] dark:text-[#F7F5EF]">
                            {app.orphanName}
                          </td>
                          <td className="py-3 px-3 text-[#657568]">
                            {app.applicantName} ({app.relation})
                          </td>
                          <td className="py-3 px-3 font-mono" dir="ltr">
                            {app.phone}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                app.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.status === 'field_visit'
                                  ? 'bg-blue-100 text-blue-800'
                                  : app.status === 'in_review'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 flex items-center gap-1.5">
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'field_visit')}
                              className="px-2 py-1 rounded bg-blue-600 text-white text-[10px] font-bold"
                            >
                              زيارة
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'approved')}
                              className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold"
                            >
                              اعتماد
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'rejected')}
                              className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-bold"
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
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] dark:bg-[#272B25] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 border border-[#B9A477]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D8CEBB] dark:border-[#343832] pb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600 fill-current" />
                <h3 className="text-lg font-black text-[#343832] dark:text-[#F7F5EF] font-amiri">
                  كفالة: {selectedProgram.titleAr}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-xs font-bold text-[#657568] hover:text-[#343832]"
              >
                ✕ إغلاق
              </button>
            </div>

            {sponsorSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-base font-black text-[#343832] dark:text-[#F7F5EF]">
                  تقبل الله كفالتكم المباركة!
                </h4>
                <p className="text-xs text-[#657568] dark:text-[#D8CEBB]">
                  تم تسجيل نيتكم لكفالة البرنامج (${selectedProgram.monthlyAmountUsd}/شهر). سيتواصل معكم منسق الكفالات بمجمع النور عبر الواتساب لتزويدكم بتقرير اليتيم وسند الاستلام.
                </p>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-6 py-2 rounded-xl bg-[#394E43] text-white text-xs font-bold"
                >
                  تم
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F0EDE4] dark:bg-[#1F221E] space-y-1">
                  <span className="font-bold text-[#394E43] dark:text-[#B9A477] block">
                    المبلغ الشهري للكفالة: ${selectedProgram.monthlyAmountUsd} دولار أمريكي
                  </span>
                  <p className="text-[11px] text-[#657568]">
                    {selectedProgram.descriptionAr}
                  </p>
                </div>

                <div>
                  <label className="block text-[#343832] dark:text-[#F7F5EF] font-bold mb-1">
                    اسم الكافل الكريم (أو فاعل خير)
                  </label>
                  <input
                    type="text"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    placeholder="مثال: فاعل خير من مكة المكرمة"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-white dark:bg-[#1F221E]"
                  />
                </div>

                <div>
                  <label className="block text-[#343832] dark:text-[#F7F5EF] font-bold mb-1">
                    رقم الواتساب للتواصل وإرسال التقارير الدورية
                  </label>
                  <input
                    type="tel"
                    value={sponsorPhone}
                    onChange={(e) => setSponsorPhone(e.target.value)}
                    placeholder="+966xxxxxxxxx أو +249xxxxxxxxx"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8CEBB] dark:border-[#3A4237] bg-white dark:bg-[#1F221E]"
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
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>تأكيد عبر واتساب المجمع</span>
                  </a>

                  <button
                    onClick={() => setSponsorSuccess(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#394E43] hover:bg-[#2F4238] text-white font-bold"
                  >
                    تأكيد الكفالة
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Slogan & Verified Al-Noor Contact Card */}
      <section className="rounded-3xl border border-[#B9A477]/40 bg-[#343832] text-[#F7F5EF] p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <span className="text-xs font-mono text-[#B9A477] font-bold">
              مجمع النور الإسلامي العالمي • لجنة كفالة الأيتام والرعاية الاجتماعية
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-amiri text-[#F7F5EF]">
              «نورٌ يرعى براءة الطفولة.. وأجرٌ دائم يرافقك إلى الجنة»
            </h3>
            <p className="text-xs text-[#E5DCCB] max-w-xl">
              تصل كفالتك إلى مستحقيها مباشرة، مع توثيق دوري بالصور والتقارير الأكاديمية والتربوية لليتيم المكفول.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href={ORPHANS_CONTACT_INFO.mobileTel}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#283830] hover:bg-[#1E2B25] border border-[#B9A477]/40 text-[#F7F5EF] text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#B9A477]" />
              <span dir="ltr">{ORPHANS_CONTACT_INFO.mobile}</span>
            </a>

            <a
              href={ORPHANS_CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold text-center flex items-center justify-center gap-2"
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
