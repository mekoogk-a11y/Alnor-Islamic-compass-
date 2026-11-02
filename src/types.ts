export type NavigationPage = 
  | 'home' 
  | 'quran' 
  | 'hadith'
  | 'academy'
  | 'scholars'
  | 'sciences' 
  | 'library' 
  | 'aiScholar'
  | 'newMuslims'
  | 'radio' 
  | 'audioStudio'
  | 'orphansCare'
  | 'translationsReader'
  | 'waqf' 
  | 'community'
  | 'dashboard'
  | 'admin'
  | 'apiGateway'
  | 'about' 
  | 'register';

export interface SudaneseVoiceAd {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'general' | 'memorization' | 'sanad' | 'radio' | 'waqf';
  durationSeconds: number;
  pitch: number;
  rate: number;
  tone: string;
  scriptSudanese: string;
  scriptFormalSummary: string;
  keyPhrases: string[];
}

export type Language = 
  | 'ar' 
  | 'en' 
  | 'fr' 
  | 'es' 
  | 'de' 
  | 'tr' 
  | 'id' 
  | 'ur' 
  | 'ru' 
  | 'zh' 
  | 'sw' 
  | 'fa';

export type ThemeMode = 'dark' | 'light';

export type UserRole = 'student' | 'teacher' | 'scholar' | 'admin' | 'visitor' | 'hafiz' | 'api_developer';

export interface QuranAyah {
  number: number;
  numberInSurah?: number;
  juz?: number;
  hizb?: number;
  page?: number;
  text: string;
  translation?: string;
  tafsir?: string;
  wordMeanings?: { word: string; meaning: string }[];
  stoppingSign?: string;
  translations?: Partial<Record<Language, string>>;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: 'مكية' | 'مدنية';
  audioUrl?: string;
  startJuz?: number;
  sampleAyahs: QuranAyah[];
}

export interface LiveRadioStation {
  id: string;
  name: string;
  nameEn: string;
  origin: string;
  streamUrl: string;
  backupUrls?: string[];
  frequency: string;
  description: string;
  badge: string;
  featuredImam?: string;
}

export interface QuranTranslationEdition {
  id: string;
  languageCode: string;
  languageNameAr: string;
  languageNameNative: string;
  flagEmoji: string;
  titleAr: string;
  titleNative: string;
  translator: string;
  accreditation: string;
  publisher: string;
  yearPublished: string;
  pagesCount: number;
  fileSizeBytes: string;
  pdfDownloadUrl: string;
  archiveOrgUrl?: string;
  quranEncKey?: string;
  languageAr?: string;
  languageNative?: string;
  verifiedBadge?: string;
  sampleAyahs: {
    surahNameAr: string;
    surahNameNative: string;
    ayahNumber: number;
    arabicText: string;
    translationText: string;
  }[];
}

export interface QuranReciter {
  id: string;
  name: string;
  style: string;
  sampleAudio: string;
}

export interface HadithBook {
  id: 'bukhari' | 'muslim' | 'tirmidhi' | 'abudawood' | 'nasai' | 'ibnmajah' | 'muwatta' | 'ahmad';
  nameAr: string;
  nameEn: string;
  author: string;
  authorBio: string;
  totalHadiths: number;
  importance: string;
  verifiedStatus: string;
}

export interface HadithItem {
  id: string;
  bookId: HadithBook['id'];
  bookName: string;
  hadithNumber: number;
  chapter: string;
  arabicText: string;
  narrator: string;
  translationEn: string;
  translationFr?: string;
  grade: 'صحيح' | 'حسن' | 'متفق عليه' | 'صحيح لغيره';
  gradeAttribution: string;
  explanation: string;
  topics: string[];
}

export interface ScholarProfile {
  id: string;
  name: string;
  title: string;
  country: string;
  city: string;
  specialization: string;
  languages: string[];
  bio: string;
  ijazahs: string[];
  verified: boolean;
  activeStudents: number;
  rating: number;
  availableDays: string[];
  sessionDuration: string;
  avatarUrl: string;
}

export interface AcademyCourse {
  id: string;
  title: string;
  department: string;
  instructor: string;
  instructorId?: string;
  duration: string;
  level: string;
  lessonsCount: number;
  enrolledStudentsCount: number;
  description: string;
  syllabus: string[];
  prerequisites: string[];
  certificationOffered: boolean;
  hasVirtualClassroom: boolean;
}

export interface IslamicCourse {
  id: string;
  title: string;
  instructor: string;
  department?: string;
  syllabus?: string[];
  level: string;
  duration: string;
  lessonsCount?: number;
  category?: string;
  description?: string;
  topics?: string[];
  enrolledStudentsCount?: number;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  era?: string;
  year?: string | number;
  description: string;
  tableOfContents?: string[];
  downloadable?: boolean;
  sampleChapterText?: string;
  rightsStatus?: string;
}

export interface WaqfProject {
  id: string;
  title: string;
  category: string;
  targetAmount: number;
  collectedAmount?: number;
  currentAmount?: number;
  beneficiaries?: string;
  beneficiariesCount?: number;
  description: string;
  shareAmount?: number;
  imageIcon?: string;
  donorsCount?: number;
  progressPercentage?: number;
  location?: string;
  reportDate?: string;
  supervisingCommittee?: string;
}

export interface ComplexGlobalInfo {
  name: string;
  slogan: string;
  officialEmail: string;
  headquarters: string;
  phones: {
    whatsapp: string;
    mobile: string;
  };
  internationalBranchesCount: number;
  totalStudents: number;
  graduatedHuffaz: number;
  activeTeachers: number;
}

export interface UserAccount {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  role: UserRole;
  preferredLanguage?: Language;
  avatarLetter?: string;
  registeredDate?: string;
  joinedDate?: string;
  country?: string;
  memorizedJuzCount?: number;
  lastReadAyah?: {
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    page: number;
  };
  bookmarks?: {
    surahNumber: number;
    ayahNumber: number;
    surahName: string;
    addedAt: string;
  }[];
  memorizationProgress?: {
    surahNumber: number;
    surahName: string;
    completedAyahs: number;
    totalAyahs: number;
    status: 'مكتمل' | 'قيد الحفظ' | 'للمراجعة';
  }[];
  enrolledCourses?: {
    courseId: string;
    courseTitle: string;
    progressPercentage: number;
    enrolledAt: string;
    certificateIssued?: boolean;
    certificateId?: string;
  }[];
  certificates?: {
    id: string;
    certificateNumber: string;
    courseName: string;
    scholarName: string;
    grade: string;
    issueDate: string;
  }[];
}

export interface GlobalSearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'quran' | 'hadith' | 'book' | 'course' | 'scholar' | 'waqf' | 'fatwa' | 'article';
  pageTarget: NavigationPage;
  targetId?: string;
  excerpt: string;
  badge: string;
}

export interface CommunityQuestion {
  id: string;
  authorName: string;
  authorCountry: string;
  category: string;
  questionTitle: string;
  questionBody: string;
  createdAt: string;
  answersCount: number;
  isVerifiedAnswer: boolean;
  verifiedAnswerBy?: string;
  verifiedAnswerText?: string;
  tags: string[];
}

// ==========================================
// API INTEGRATION ARCHITECTURE TYPES
// ==========================================

export interface PrayerTimesData {
  city: string;
  country: string;
  timezone: string;
  method: string;
  date: string;
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    Qiyam?: string;
  };
  nextPrayer: {
    nameAr: string;
    nameEn: string;
    time: string;
    timeRemainingFormatted: string;
    minutesRemaining: number;
  };
  qiblaDirection: number; // degrees from North
}

export interface HijriDateData {
  day: number;
  dayNameAr: string;
  dayNameEn: string;
  month: number;
  monthNameAr: string;
  monthNameEn: string;
  year: number;
  formattedAr: string;
  formattedEn: string;
  isSacredMonth: boolean;
  sacredMonthName?: string;
  eventDescription?: string;
}

export interface ApiHealthStatus {
  serviceId: string;
  serviceName: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs: number;
  uptimePercentage: number;
  lastChecked: string;
  endpoint: string;
  primaryProvider: string;
  fallbackProvider: string;
}

export interface ApiKeyRecord {
  id: string;
  keyPrefix: string;
  maskedKey: string;
  name: string;
  platform: 'web' | 'android' | 'ios' | 'partner' | 'scholar_portal';
  scopes: string[];
  createdAt: string;
  lastUsedAt: string;
  status: 'active' | 'revoked';
  rateLimitPerMin: number;
}

export interface ApiTelemetryMetric {
  totalRequestsToday: number;
  avgLatencyMs: number;
  cacheHitRatio: number;
  errorRatePercentage: number;
  requestsPerSecond: number;
  activeClientTokens: number;
}

export interface DonationIntentRequest {
  projectId: string;
  amount: number;
  currency: string;
  donorName?: string;
  donorEmail?: string;
  isAnonymous?: boolean;
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'stc_pay' | 'mada';
}

export interface DonationReceipt {
  receiptId: string;
  transactionRef: string;
  projectId: string;
  projectTitle: string;
  amount: number;
  currency: string;
  donorName: string;
  date: string;
  status: 'succeeded' | 'processing';
  verificationHash: string;
  waqfCertificateUrl?: string;
}

// ==========================================
// ORPHAN CARE & SPONSORSHIP PLATFORM TYPES
// ==========================================

export interface OrphanApplication {
  id: string; // e.g. APP-849201 or ALNOOR-ORPHAN-849201
  trackingNumber: string;
  applicantName: string;
  relation: string;
  phone: string;
  nationalId: string;
  address: string;
  assistanceType: 'full_sponsorship' | 'monthly_stipend' | 'food_basket' | 'medical_aid' | 'education_aid' | 'other';
  orphanName: string;
  orphanBirthDate: string;
  orphanGender: 'male' | 'female';
  academicLevel: string;
  healthNotes: string;
  hasDeathCert: boolean;
  hasBirthCert: boolean;
  hasResidenceProof: boolean;
  status: 'pending' | 'in_review' | 'field_visit' | 'field_verified' | 'approved' | 'sponsored' | 'rejected';
  fieldNotes?: string;
  createdAt: string;
  updatedAt: string;

  // Optional nested structures for backwards compatibility
  requestType?: string;
  priorityLevel?: string;
  applicant?: any;
  orphan?: any;
  family?: any;
  documents?: any[];
  adminNotes?: any[];
}

export interface OrphanProfile {
  id: string;
  code?: string;
  fullName: string;
  firstName?: string;
  age: number;
  gender: 'male' | 'female';
  governorate?: string;
  city?: string;
  country?: string;
  academicStage?: string;
  educationStage?: string;
  quranProgress?: string;
  healthStatus: string;
  guardianRelation?: string;
  familyMembersCount?: number;
  monthlyRequiredUsd?: number;
  monthlySponsorshipCostUsd?: number;
  isSponsored: boolean;
  sponsorName?: string;
  storySummary: string;
  avatarSeed?: string;
  urgentNeed?: string;
  registeredDate?: string;
}

export interface SponsorshipProgram {
  id: string;
  title?: string;
  titleAr?: string;
  titleEn: string;
  description?: string;
  descriptionAr?: string;
  monthlyAmountUsd: number;
  yearlyAmountUsd?: number;
  coveredItems?: string[];
  coveragePoints?: string[];
  popular?: boolean;
  badgeText?: string;
  badge?: string;
  icon?: string;
}

// ==========================================
// QURAN TRANSLATIONS ENGINE TYPES
// ==========================================

export interface QuranEncTranslationMeta {
  key: string;
  languageIso: string;
  languageNameAr: string;
  languageNameNative: string;
  title: string;
  description: string;
  translator: string;
  publisher: string;
  version: string;
  lastUpdate: string;
  direction: 'rtl' | 'ltr';
  hasAudio: boolean;
  audioReciterName?: string;
  audioBaseUrl?: string;
  pdfUrl?: string | null;
  epubUrl?: string | null;
  enabled: boolean;
}

export interface QuranTranslationAyah {
  id?: string;
  ayahNumber?: number;
  surahNumber?: number;
  aya?: number;
  sura?: number;
  arabicTextUthmani?: string;
  arabic_text?: string;
  translationText?: string;
  translation?: string;
  footnotes?: string;
  audioUrl?: string | null;
}
