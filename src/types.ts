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
  | 'waqf' 
  | 'community'
  | 'dashboard'
  | 'admin'
  | 'about' 
  | 'register';

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

export type UserRole = 'student' | 'teacher' | 'scholar' | 'admin' | 'visitor' | 'hafiz';

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
  frequency: string;
  description: string;
  badge: string;
  featuredImam?: string;
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
