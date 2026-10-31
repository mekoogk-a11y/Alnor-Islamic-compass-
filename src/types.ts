export type NavigationPage = 
  | 'home' 
  | 'newMuslims'
  | 'quran' 
  | 'radio'
  | 'sciences' 
  | 'library' 
  | 'waqf' 
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

export interface QuranAyah {
  number: number;
  text: string;
  translation?: string;
  tafsir?: string;
  translations?: Partial<Record<Language, string>>;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: 'مكية' | 'مدنية';
  audioUrl?: string;
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

export interface IslamicCourse {
  id: string;
  title: string;
  department: string;
  instructor: string;
  duration: string;
  level: string;
  lessonsCount: number;
  description: string;
  syllabus: string[];
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  year: string;
  description: string;
  downloadUrl?: string;
}

export interface WaqfProject {
  id: string;
  title: string;
  category: string;
  targetAmount: number;
  collectedAmount: number;
  beneficiaries: string;
  description: string;
  shareAmount: number;
  imageIcon: string;
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
  officialBankAccounts?: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    swiftCode: string;
  }[];
}

