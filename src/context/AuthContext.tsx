import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserRole } from '../types';
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from '../services/firebase';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  signInAnonymously 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
  loginWithGoogle: () => Promise<void>;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('alnoor_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Completely purge student Abdullah Al-Mansouri mock session if found in storage
        if (
          parsed?.id === 'USR-88214' ||
          parsed?.fullName?.includes('المنصوري') ||
          parsed?.name?.includes('المنصوري') ||
          parsed?.email === 'almansoori.student@alnoor.org'
        ) {
          localStorage.removeItem('alnoor_user_session');
          return null;
        }
        if (!parsed.name && parsed.fullName) parsed.name = parsed.fullName;
        return parsed;
      }
    } catch (_) {
      try {
        localStorage.removeItem('alnoor_user_session');
      } catch (__) {}
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isAdminEmail = firebaseUser.email === 'mekoogk@gmail.com' || firebaseUser.email?.includes('admin');
        const role: UserRole = isAdminEmail ? 'admin' : 'student';
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        try {
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUser((prev) => ({
              id: firebaseUser.uid,
              name: data.displayName || firebaseUser.displayName || 'مستخدم مجمع النور',
              fullName: data.displayName || firebaseUser.displayName || 'مستخدم مجمع النور',
              email: firebaseUser.email || '',
              role: data.role || role,
              country: data.country || 'العالم الإسلامي',
              preferredLanguage: 'ar',
              avatarLetter: (data.displayName || firebaseUser.displayName || 'م')[0],
              registeredDate: data.createdAt || new Date().toISOString().split('T')[0],
              joinedDate: data.joinedDate || '1446 هـ',
              memorizedJuzCount: data.memorizedJuzCount || 0,
              bookmarks: prev?.bookmarks || [],
              memorizationProgress: prev?.memorizationProgress || [],
              enrolledCourses: prev?.enrolledCourses || [],
              certificates: prev?.certificates || [],
            }));
          } else {
            // Create user document in Firestore
            const initialProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'طالب مجمع النور',
              role: role,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, initialProfile);
            // Sync user to Cloud SQL relational database
            try {
              const idToken = await firebaseUser.getIdToken();
              fetch('/api/v1/auth/sync', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                  displayName: firebaseUser.displayName,
                  photoUrl: firebaseUser.photoURL,
                  preferredLanguage: 'ar',
                }),
              }).catch((e) => console.warn('Cloud SQL user sync note:', e));
            } catch (e) {
              // Ignore token errors
            }
          }
        } catch (err) {
          console.warn('Firebase profile sync notice:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const isAdminEmail = firebaseUser.email === 'mekoogk@gmail.com' || firebaseUser.email?.includes('admin');
      const role: UserRole = isAdminEmail ? 'admin' : 'student';

      const resolvedUser: UserAccount = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'مستخدم مجمع النور',
        fullName: firebaseUser.displayName || 'مستخدم مجمع النور',
        email: firebaseUser.email || '',
        role: role,
        country: 'العالم الإسلامي',
        preferredLanguage: 'ar',
        avatarLetter: (firebaseUser.displayName || 'م')[0],
        registeredDate: new Date().toISOString().split('T')[0],
        joinedDate: '1446 هـ',
        memorizedJuzCount: 0,
        bookmarks: [],
        memorizationProgress: [],
        enrolledCourses: [],
        certificates: [],
      };

      setUser(resolvedUser);
      setIsAuthModalOpen(false);

      // Save to Firestore
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userDocRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: resolvedUser.name,
          role: role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore profile save note:', err);
      }
    } catch (err: any) {
      console.warn('Google sign-in popup note:', err);
      setError(err?.message || 'تعذر تسجيل الدخول عبر Google، يمكنك استخدام الدخول التجريبي.');
    }
  };

  const login = async (email: string, name?: string, role: UserRole = 'student') => {
    setError(null);
    const resolvedName = name || (email.includes('admin') || email === 'mekoogk@gmail.com' ? 'أمانة مجمع النور' : 'طالب علم النور');
    const newUser: UserAccount = {
      id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: resolvedName,
      name: resolvedName,
      email: email,
      role: (email.includes('admin') || email === 'mekoogk@gmail.com') ? 'admin' : role,
      country: 'العالم الإسلامي',
      preferredLanguage: 'ar',
      avatarLetter: resolvedName[0] || 'ط',
      memorizedJuzCount: role === 'hafiz' ? 30 : 0,
      registeredDate: new Date().toISOString().split('T')[0],
      joinedDate: '1446 هـ',
      bookmarks: [],
      memorizationProgress: [],
      enrolledCourses: [],
      certificates: [],
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

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
    try {
      localStorage.removeItem('alnoor_user_session');
    } catch (e) {}
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
        loginWithGoogle,
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
