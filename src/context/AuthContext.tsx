import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserRole } from '../types';

interface RegisterData {
  name: string;
  email: string;
  role: UserRole;
  country?: string;
  memorizedJuzCount?: number;
}

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string, role?: UserRole) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  toggleBookmark: (surahNumber: number, ayahNumber: number, surahName: string) => void;
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
  updateMemorization: (surahNumber: number, surahName: string, completedAyahs: number, totalAyahs: number) => void;
  updateMemorizationProgress: (juzCount: number) => void;
  enrollCourse: (courseId: string, courseTitle?: string) => void;
  isEnrolled: (courseId: string) => boolean;
  isAuthModalOpen: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  error: string | null;
  clearError: () => void;
}

const defaultDemoUser: UserAccount = {
  id: 'USR-88214',
  fullName: 'عبد الله بن أحمد المنصوري',
  name: 'عبد الله بن أحمد المنصوري',
  email: 'almansoori.student@alnoor.org',
  role: 'student',
  preferredLanguage: 'ar',
  avatarLetter: 'ع',
  country: 'المملكة العربية السعودية',
  registeredDate: '2025-09-15',
  joinedDate: '15 رجب 1445 هـ',
  memorizedJuzCount: 18,
  lastReadAyah: {
    surahNumber: 18,
    surahName: 'الكهف',
    ayahNumber: 27,
    page: 297,
  },
  bookmarks: [
    { surahNumber: 1, ayahNumber: 5, surahName: 'الفاتحة', addedAt: '2026-10-12' },
    { surahNumber: 2, ayahNumber: 255, surahName: 'البقرة (آية الكرسي)', addedAt: '2026-10-20' },
    { surahNumber: 67, ayahNumber: 1, surahName: 'الملك', addedAt: '2026-10-25' }
  ],
  memorizationProgress: [
    { surahNumber: 1, surahName: 'الفاتحة', completedAyahs: 7, totalAyahs: 7, status: 'مكتمل' },
    { surahNumber: 112, surahName: 'الإخلاص', completedAyahs: 4, totalAyahs: 4, status: 'مكتمل' },
    { surahNumber: 113, surahName: 'الفلق', completedAyahs: 5, totalAyahs: 5, status: 'مكتمل' },
    { surahNumber: 114, surahName: 'الناس', completedAyahs: 6, totalAyahs: 6, status: 'مكتمل' },
    { surahNumber: 67, surahName: 'الملك', completedAyahs: 18, totalAyahs: 30, status: 'قيد الحفظ' },
    { surahNumber: 36, surahName: 'يس', completedAyahs: 25, totalAyahs: 83, status: 'قيد الحفظ' }
  ],
  enrolledCourses: [
    {
      courseId: 'course-quran-1',
      courseTitle: 'المقرأة الدولية لحفظ القرآن وإتقان الروايات بالسند المتصل',
      progressPercentage: 65,
      enrolledAt: '2026-09-01'
    },
    {
      courseId: 'course-hadith-1',
      courseTitle: 'دبلوم علوم الحديث الشريف ودراسة كتب السنة التسعة',
      progressPercentage: 100,
      enrolledAt: '2026-08-10',
      certificateIssued: true,
      certificateId: 'CERT-NOOR-2026-0941'
    }
  ],
  certificates: [
    {
      id: 'cert-1',
      certificateNumber: 'ALN-QUR-2024-8891',
      courseName: 'إجازة في حفظ وإتقان القرآن الكريم برواية حفص عن عاصم',
      scholarName: 'أ.د. عبد الرحمن بن يوسف المتقي',
      grade: 'ممتاز مع مرتبة الشرف (98.5%)',
      issueDate: '15 رجب 1445 هـ'
    }
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('alnoor_user_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.name && parsed.fullName) parsed.name = parsed.fullName;
        return parsed;
      } catch (e) {
        return defaultDemoUser;
      }
    }
    return defaultDemoUser;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('alnoor_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('alnoor_user_session');
    }
  }, [user]);

  const login = async (email: string, name?: string, role: UserRole = 'student') => {
    setError(null);
    const resolvedName = name || (email.includes('admin') ? 'أمانة مجمع النور' : 'طالب علم النور');
    const newUser: UserAccount = {
      id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: resolvedName,
      name: resolvedName,
      email: email,
      role: email.includes('admin') ? 'admin' : role,
      country: 'المملكة العربية السعودية',
      memorizedJuzCount: role === 'hafiz' ? 30 : 5,
      registeredDate: new Date().toISOString().split('T')[0],
      joinedDate: 'شوال 1445 هـ',
      bookmarks: defaultDemoUser.bookmarks,
      memorizationProgress: defaultDemoUser.memorizationProgress,
      enrolledCourses: defaultDemoUser.enrolledCourses,
      certificates: defaultDemoUser.certificates,
    };
    setUser(newUser);
  };

  const register = async (data: RegisterData) => {
    setError(null);
    const newUser: UserAccount = {
      id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: data.name,
      name: data.name,
      email: data.email,
      role: data.role,
      country: data.country || 'العالم الإسلامي',
      memorizedJuzCount: data.memorizedJuzCount || 0,
      registeredDate: new Date().toISOString().split('T')[0],
      joinedDate: 'ذو القعدة 1445 هـ',
      bookmarks: [],
      memorizationProgress: [],
      enrolledCourses: [],
      certificates: [],
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const openAuthModal = () => {
    setError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setError(null);
  };

  const clearError = () => setError(null);

  const toggleBookmark = (surahNumber: number, ayahNumber: number, surahName: string) => {
    if (!user) return;
    const exists = user.bookmarks?.some(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );
    const updatedBookmarks = exists
      ? user.bookmarks?.filter((b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber))
      : [
          ...(user.bookmarks || []),
          {
            surahNumber,
            ayahNumber,
            surahName,
            addedAt: new Date().toISOString().split('T')[0],
          },
        ];
    setUser({ ...user, bookmarks: updatedBookmarks });
  };

  const isBookmarked = (surahNumber: number, ayahNumber: number): boolean => {
    return user?.bookmarks?.some(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    ) || false;
  };

  const updateMemorization = (
    surahNumber: number,
    surahName: string,
    completedAyahs: number,
    totalAyahs: number
  ) => {
    if (!user) return;
    const existingIndex = user.memorizationProgress?.findIndex((m) => m.surahNumber === surahNumber);
    const status = completedAyahs >= totalAyahs ? 'مكتمل' : 'قيد الحفظ';
    const updated = [...(user.memorizationProgress || [])];
    if (existingIndex !== undefined && existingIndex >= 0) {
      updated[existingIndex] = { surahNumber, surahName, completedAyahs, totalAyahs, status };
    } else {
      updated.push({ surahNumber, surahName, completedAyahs, totalAyahs, status });
    }
    setUser({ ...user, memorizationProgress: updated });
  };

  const updateMemorizationProgress = (juzCount: number) => {
    if (!user) return;
    setUser({ ...user, memorizedJuzCount: juzCount });
  };

  const enrollCourse = (courseId: string, courseTitle?: string) => {
    if (!user) return;
    const isAlready = user.enrolledCourses?.some((c) => c.courseId === courseId);
    if (isAlready) return;
    const newEnrollment = {
      courseId,
      courseTitle: courseTitle || 'دورة أكاديمية النور',
      progressPercentage: 0,
      enrolledAt: new Date().toISOString().split('T')[0],
    };
    setUser({
      ...user,
      enrolledCourses: [...(user.enrolledCourses || []), newEnrollment],
    });
  };

  const isEnrolled = (courseId: string): boolean => {
    return user?.enrolledCourses?.some((c) => c.courseId === courseId) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        toggleBookmark,
        isBookmarked,
        updateMemorization,
        updateMemorizationProgress,
        enrollCourse,
        isEnrolled,
        isAuthModalOpen,
        authModalOpen: isAuthModalOpen,
        setAuthModalOpen: setIsAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
