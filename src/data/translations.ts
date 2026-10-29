import { Language } from '../types';

export interface Translations {
  complexName: string;
  slogan: string;
  sloganQuote: string;
  heroBadge: string;
  heroDesc: string;
  btnQuran: string;
  btnSciences: string;
  btnWaqf: string;
  btnRegister: string;
  btnInstall: string;
  statsStudents: string;
  statsHuffaz: string;
  statsBranches: string;
  statsTeachers: string;
  quranRadioTitle: string;
  quranRadioSub: string;
  btnPlayRecitation: string;
  btnPauseRecitation: string;
  pillarsBadge: string;
  pillarsTitle: string;
  pillarsDesc: string;
  navHome: string;
  navQuran: string;
  navSciences: string;
  navLibrary: string;
  navWaqf: string;
  navAbout: string;
  navContact: string;
  contactWhatsapp: string;
  contactMobile: string;
  contactEmail: string;
  contactAddress: string;
  chatWhatsapp: string;
  callDirect: string;
  onlineNow: string;
  quickInquiry: string;
  close: string;
  sendMsg: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ar: {
    complexName: 'مجمع النور الإسلامي العالمي الخيري الشامل لتحفيظ القرآن الكريم والعلوم الإسلامية',
    slogan: 'نورٌ يهدي.. وصرحٌ يبني أجيال القرآن',
    sloganQuote: '« نورٌ يهدي.. وصرحٌ يبني أجيال القرآن »',
    heroBadge: 'صرحٌ إسلامي وقفي خيري شامل يخدم طلاب القرآن في 120 دولة',
    heroDesc: 'مؤسسة إسلامية عالمية تعنى بتحفيظ كتاب الله الكريم وإقرائه بالأسانيد المتصلة، وتدريس العلوم الشرعية المؤصلة، وإحياء سنة الوقف الخيري المستدام خدمةً لأمة القرآن في مشارق الأرض ومغاربها.',
    btnQuran: 'المقارئ والمصحف الشريف',
    btnSciences: 'كلية العلوم الإسلامية',
    btnWaqf: 'الوقف والمشاريع الخيرية',
    btnRegister: 'التحق بالمقرأة العالمية',
    btnInstall: 'تثبيت التطبيق 📲',
    statsStudents: 'طالب وطالبة حول العالم',
    statsHuffaz: 'حافظ مجاز بالسند المتصل',
    statsBranches: 'فرعاً ومقرأة في دول العالم',
    statsTeachers: 'شيخاً ومقرئاً مجازاً ومعتمداً',
    quranRadioTitle: 'إذاعة القرآن الكريم بمجمع النور',
    quranRadioSub: 'تلاوات خاشعة ومباركة من الذكر الحكيم بأصوات كبار القراء',
    btnPlayRecitation: 'استماع للتلاوة',
    btnPauseRecitation: 'إيقاف التلاوة',
    pillarsBadge: 'أركان الصرح الإسلامي',
    pillarsTitle: 'منظومة متكاملة لخدمة القرآن والعلوم الشرعية',
    pillarsDesc: 'يضم مجمع النور أربعة قطاعات رئيسية تعمل بتكامل لتحقيق ريادة عالمية في التعليم والبحث والعمل الخيري.',
    navHome: 'الرئيسية',
    navQuran: 'المقارئ والمصحف',
    navSciences: 'كلية العلوم',
    navLibrary: 'المكتبة والبحوث',
    navWaqf: 'الوقف والخيرات',
    navAbout: 'عن المجمع',
    navContact: 'التسجيل والتواصل',
    contactWhatsapp: 'واتساب خدمة المستفيدين',
    contactMobile: 'هاتف التواصل المباشر',
    contactEmail: 'البريد الإلكتروني المعتمد',
    contactAddress: 'المقر العام والعنوان',
    chatWhatsapp: 'محادثة واتساب فورية',
    callDirect: 'اتصال هاتفي مباشر',
    onlineNow: 'متاح للرد والاستفسار',
    quickInquiry: 'استفسار سريع عن المجمع والبرامج',
    close: 'إغلاق',
    sendMsg: 'إرسال عبر واتساب',
  },
  en: {
    complexName: 'Al-Noor Global Comprehensive Islamic Charitable Complex for Quran Memorization & Islamic Sciences',
    slogan: 'A Light That Guides.. An Edifice Building Quranic Generations',
    sloganQuote: '“A Light That Guides.. An Edifice Building Quranic Generations”',
    heroBadge: 'A Comprehensive Global Islamic Charitable Complex Serving Quran Students in 120 Countries',
    heroDesc: 'A global Islamic institution dedicated to teaching and memorizing the Holy Quran with connected chains of transmission (Isnad), imparting authentic Islamic sciences, and fostering sustainable Waqf charity across the world.',
    btnQuran: 'Quran Recitations & Academy',
    btnSciences: 'Faculty of Islamic Sciences',
    btnWaqf: 'Waqf & Charitable Projects',
    btnRegister: 'Join Global Academy',
    btnInstall: 'Install App 📲',
    statsStudents: 'Students Worldwide',
    statsHuffaz: 'Certified Quran Memorizers',
    statsBranches: 'International Branches',
    statsTeachers: 'Certified Islamic Scholars',
    quranRadioTitle: 'Al-Noor Quran Radio',
    quranRadioSub: 'Spiritual and blessed recitations by world-renowned Qaris',
    btnPlayRecitation: 'Listen Recitation',
    btnPauseRecitation: 'Pause Recitation',
    pillarsBadge: 'Core Pillars of the Edifice',
    pillarsTitle: 'Integrated Framework for Quran & Islamic Sciences',
    pillarsDesc: 'Al-Noor Complex encompasses four main sectors working synergistically for global excellence in education and Waqf.',
    navHome: 'Home',
    navQuran: 'Quran Academy',
    navSciences: 'Islamic College',
    navLibrary: 'Library & Research',
    navWaqf: 'Waqf & Charity',
    navAbout: 'About Complex',
    navContact: 'Register & Contact',
    contactWhatsapp: 'Official WhatsApp Helpdesk',
    contactMobile: 'Direct Phone Inquiries',
    contactEmail: 'Official Email',
    contactAddress: 'Headquarters & Address',
    chatWhatsapp: 'Instant WhatsApp Chat',
    callDirect: 'Call Us Directly',
    onlineNow: 'Online & Available Now',
    quickInquiry: 'Quick Inquiry regarding Courses & Waqf',
    close: 'Close',
    sendMsg: 'Send via WhatsApp',
  },
  fr: {
    complexName: 'Complexe Islamique Mondial Caritatif Al-Noor pour la Mémorisation du Saint Coran et les Sciences Islamiques',
    slogan: 'Une Lumière qui Guide.. Un Édifice qui Bâtit les Générations du Coran',
    sloganQuote: '« Une Lumière qui Guide.. Un Édifice qui Bâtit les Générations du Coran »',
    heroBadge: 'Un Complexe Islamique Mondial au Service des Étudiants du Coran dans 120 Pays',
    heroDesc: 'Une institution islamique mondiale consacrée à l’enseignement et à la mémorisation du Saint Coran avec chaîne de transmission authentique (Isnad), à l’étude des sciences islamiques fondamentales et au Waqf caritatif durable.',
    btnQuran: 'Institut Coranique & Récitations',
    btnSciences: 'Faculté des Sciences Islamiques',
    btnWaqf: 'Projets de Waqf & Bienfaisance',
    btnRegister: 'Rejoindre l’Académie',
    btnInstall: 'Installer l’Appli 📲',
    statsStudents: 'Étudiants à Travers le Monde',
    statsHuffaz: 'Mémorisateurs Certifiés (Ijaza)',
    statsBranches: 'Branches Internationales',
    statsTeachers: 'Savants et Récitateurs Agréés',
    quranRadioTitle: 'Radio Al-Noor du Saint Coran',
    quranRadioSub: 'Récitations pieuses et bénies par les plus grands récitateurs mondiaux',
    btnPlayRecitation: 'Écouter la Récitation',
    btnPauseRecitation: 'Pause Récitation',
    pillarsBadge: 'Piliers Fondamentaux du Complexe',
    pillarsTitle: 'Cadre Intégré pour le Coran et les Sciences de l’Islam',
    pillarsDesc: 'Le Complexe Al-Noor comprend quatre secteurs majeurs œuvrant en synergie pour l’excellence éducative et caritative.',
    navHome: 'Accueil',
    navQuran: 'Académie du Coran',
    navSciences: 'Sciences Islamiques',
    navLibrary: 'Bibliothèque & Recherche',
    navWaqf: 'Waqf & Charité',
    navAbout: 'À Propos',
    navContact: 'Inscription & Contact',
    contactWhatsapp: 'WhatsApp Officiel du Complexe',
    contactMobile: 'Ligne Téléphonique Directe',
    contactEmail: 'Courriel Officiel',
    contactAddress: 'Siège Général & Adresse',
    chatWhatsapp: 'Discuter sur WhatsApp',
    callDirect: 'Appel Direct',
    onlineNow: 'Disponible & En Ligne',
    quickInquiry: 'Demande Rapide d’Informations',
    close: 'Fermer',
    sendMsg: 'Envoyer sur WhatsApp',
  },
};
