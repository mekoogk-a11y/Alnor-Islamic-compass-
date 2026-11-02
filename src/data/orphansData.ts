import { OrphanApplication, OrphanProfile, SponsorshipProgram } from '../types';

export const ORPHANS_CONTACT_INFO = {
  mobile: '+249912169169',
  mobileTel: 'tel:+249912169169',
  whatsapp: '+249904499914',
  whatsappUrl: 'https://wa.me/249904499914',
  email: 'info@alnoor-islamic-complex.org',
  complexNameAr: 'مجمع النور الإسلامي العالمي - قسم كفالة ورعاية الأيتام',
  hadithText: '«أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا» وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسْطَى',
  slogan: 'نورٌ يرعى براءة الطفولة.. وأجرٌ دائم يرافقك إلى الجنة'
};

export const SPONSORSHIP_PROGRAMS: SponsorshipProgram[] = [
  {
    id: 'prog-full',
    titleAr: 'الكفالة الشاملة الكاملة',
    titleEn: 'Comprehensive Full Sponsorship',
    monthlyAmountUsd: 50,
    descriptionAr: 'تشمل الرعاية المعيشية والتعليمية والصحية والتربوية وكسوة العيد مع تقرير دوري لكافل اليتيم كل ثلاثة أشهر.',
    coveredItems: [
      'سلة غذائية تموينية شهرية متكاملة للأسرة',
      'مصاريف التعليم والمريول والحقيبة والكتب',
      'تأمين طبي شامل وزيارات طبيب أطفال دورية',
      'كسوة عيدي الفطر والأضحى المباركين',
      'حلقة تحفيظ قرآن وتربية إسلامية خاصة بمجمع النور'
    ],
    popular: true,
    badgeText: 'الأعلى أجراً وأثراً'
  },
  {
    id: 'prog-education',
    titleAr: 'كفالة التعليم وحفظ القرآن',
    titleEn: 'Education & Quran Sponsorship',
    monthlyAmountUsd: 25,
    descriptionAr: 'تغطية رسوم المدارس والمستلزمات الدراسية واشتراك حلقات التحفيظ لضمان عدم انقطاع اليتيم عن الدراسة.',
    coveredItems: [
      'سداد الرسوم الدراسية السنوية',
      'توفير الحقيبة والقرطاسية الكاملة',
      'متابعة دراسية وتقويم تربوي مستمر',
      'منحة حفظ القرآن برواية حفص أو الدوري'
    ],
    popular: false,
    badgeText: 'استثمار العلم'
  },
  {
    id: 'prog-food',
    titleAr: 'سلة الغذاء الشهرية لأسرة اليتيم',
    titleEn: 'Monthly Nutritional Food Basket',
    monthlyAmountUsd: 40,
    descriptionAr: 'توفير المواد الغذائية الأساسية لأسرة اليتيم (سكر، دقيق، زيت، أرز، حليب، عدس) لحمايتهم من الجوع وسوء التغذية.',
    coveredItems: [
      'مكونات غذائية تكفي أسرة اليتيم لمدة شهر',
      'مكملات غذائية وفيتامينات للأطفال',
      'توزيع مباشر للأسر المتعففة في منازلها'
    ],
    popular: false,
    badgeText: 'إطعام الطعام'
  },
  {
    id: 'prog-health',
    titleAr: 'كفالة الرعاية الصحية والعلاج',
    titleEn: 'Medical Care & Healthcare Sponsorship',
    monthlyAmountUsd: 35,
    descriptionAr: 'تغطية الفحوصات والتحاليل الطبية والعمليات الجراحية العاجلة والأدوية للأيتام المرضى والمصابين.',
    coveredItems: [
      'فحوصات طبية ومخبرية دورية',
      'صرف الأدوية للأمراض المزمنة والعارضة',
      'رعاية أسنان ونظارات طبية',
      'متابعة مع استشاريي طب الأطفال'
    ],
    popular: false,
    badgeText: 'شفاء ورحمة'
  },
  {
    id: 'prog-eid-clothing',
    titleAr: 'كسوة العيد وفرحة اليتيم',
    titleEn: 'Eid Clothing & Joy Initiative',
    monthlyAmountUsd: 30,
    descriptionAr: 'شراء ملابس جديدة وأحذية فاخرة وهدايا عيدية للأيتام في عيدي الفطر والأضحى لإدخال السرور على قلوبهم.',
    coveredItems: [
      'طقم ملابس فاخر كامل جديد مع حذاء',
      'عيدية نقدية ولعبة تربوية لليتيم',
      'إدخال الفرحة والسرور ومحو ألم اليتم'
    ],
    popular: false,
    badgeText: 'فرحة الأعياد'
  }
];

export const INITIAL_ORPHANS_PROFILES: OrphanProfile[] = [
  {
    id: 'ORP-101',
    fullName: 'عمر عثمان إبراهيم',
    age: 9,
    gender: 'male',
    governorate: 'الخرطوم - بحري',
    academicStage: 'الصف الرابع الابتدائي',
    healthStatus: 'سليم معافى بحمد الله',
    guardianRelation: 'الوالدة (أرملة)',
    familyMembersCount: 4,
    monthlyRequiredUsd: 50,
    isSponsored: false,
    storySummary: 'توفي والده إثر وعكة صحية، وتكابد والدته لتوفير القوت والتعليم لإخوانه الصغار. عمر متفوق دراسياً ويحفظ 6 أجزاء من القرآن الكريم.',
    registeredDate: '2025-01-15'
  },
  {
    id: 'ORP-102',
    fullName: 'فاطمة الزهراء محمد الصادق',
    age: 7,
    gender: 'female',
    governorate: 'أم درمان - الثورة',
    academicStage: 'الصف الثاني الابتدائي',
    healthStatus: 'تحتاج متابعة دورية للبصر',
    guardianRelation: 'الجدة لأم',
    familyMembersCount: 3,
    monthlyRequiredUsd: 50,
    isSponsored: false,
    storySummary: 'فقدت والديها وتعيش في كنف جدتها المسنة في ظروف معيشية حرجة، فاطمة طفلة نبيهة ومحبة للقراءة وتحفظ جزئي عم وتبارك.',
    registeredDate: '2025-01-20'
  },
  {
    id: 'ORP-103',
    fullName: 'عبد الرحمن طارق البدوي',
    age: 11,
    gender: 'male',
    governorate: 'الجزيرة - ود مدني',
    academicStage: 'الصف السادس الابتدائي',
    healthStatus: 'سليم بحمد الله',
    guardianRelation: 'الوالدة',
    familyMembersCount: 5,
    monthlyRequiredUsd: 50,
    isSponsored: false,
    storySummary: 'استشهد والده العائل الوحيد للأسرة. عبد الرحمن متميز في الرياضيات ويطمح لأن يكون مهندساً يخدم أمته، ويحفظ 10 أجزاء.',
    registeredDate: '2025-02-01'
  },
  {
    id: 'ORP-104',
    fullName: 'مريم الصديق أحمد',
    age: 6,
    gender: 'female',
    governorate: 'شمال كردفان - الأبيض',
    academicStage: 'الروضة المتقدمة',
    healthStatus: 'سليمة ومعافاة',
    guardianRelation: 'الوالدة (ربة منزل)',
    familyMembersCount: 4,
    monthlyRequiredUsd: 50,
    isSponsored: true,
    sponsorName: 'فاعل خير من مكة المكرمة',
    storySummary: 'تمت كفالتها بنجاح عبر برنامج الكفالة الشاملة بمجمع النور، وتتلقى الآن الرعاية الغذائية والتعليمية المنتظمة.',
    registeredDate: '2024-12-10'
  }
];

export const INITIAL_ORPHAN_APPLICATIONS: OrphanApplication[] = [
  {
    id: 'APP-9901',
    trackingNumber: 'ALNOOR-ORPHAN-841920',
    applicantName: 'آمنة عبد الله البشير',
    relation: 'أم اليتيم',
    phone: '+249912169169',
    nationalId: '1092837465',
    address: 'الخرطوم بحري - الحلفايا',
    assistanceType: 'monthly_stipend',
    orphanName: 'عمر عثمان إبراهيم',
    orphanBirthDate: '2016-04-12',
    orphanGender: 'male',
    academicLevel: 'الرابع الابتدائي',
    healthNotes: 'لا يعاني من أمراض مزمنة',
    hasDeathCert: true,
    hasBirthCert: true,
    hasResidenceProof: true,
    status: 'field_visit',
    fieldNotes: 'تمت زيارة الباحث الاجتماعي والتأكد من استحقاق الأسرة، الملف معروض للاعتماد النهائي.',
    createdAt: '2025-02-10T10:30:00Z',
    updatedAt: '2025-02-12T14:20:00Z'
  },
  {
    id: 'APP-9902',
    trackingNumber: 'ALNOOR-ORPHAN-391804',
    applicantName: 'خديجة الحسن المنصور',
    relation: 'جدة اليتيم',
    phone: '+249904499914',
    nationalId: '1029384756',
    address: 'أم درمان - الثورة الحارة الثامنة',
    assistanceType: 'full_sponsorship',
    orphanName: 'فاطمة الزهراء محمد الصادق',
    orphanBirthDate: '2018-09-03',
    orphanGender: 'female',
    academicLevel: 'الثاني الابتدائي',
    healthNotes: 'تحتاج كشف نظر ونظارة طبية',
    hasDeathCert: true,
    hasBirthCert: true,
    hasResidenceProof: true,
    status: 'in_review',
    fieldNotes: 'جاري فحص المستندات المرفقة وتحديد موعد المقابلة الميدانية.',
    createdAt: '2025-02-14T09:15:00Z',
    updatedAt: '2025-02-14T09:15:00Z'
  }
];
