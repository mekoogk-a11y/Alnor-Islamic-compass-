import { HadithBook, HadithItem, ScholarProfile, AcademyCourse, CommunityQuestion } from '../types';

export const HADITH_BOOKS: HadithBook[] = [
  {
    id: 'bukhari',
    nameAr: 'صحيح البخاري (الجامع المسند الصحيح)',
    nameEn: 'Sahih al-Bukhari',
    author: 'الإمام محمد بن إسماعيل البخاري (ت 256 هـ)',
    authorBio: 'أمير المؤمنين في الحديث، ولد ببخارى، طاف أرجاء العالم الإسلامي لجمع الأحاديث وتنقيتها بأعلى درجات التوثيق والتحري.',
    totalHadiths: 7563,
    importance: 'أصح كتاب بعد كتاب الله تعالى بإجماع أمة الإسلام.',
    verifiedStatus: 'صحيح مجمع على صحته'
  },
  {
    id: 'muslim',
    nameAr: 'صحيح مسلم (المسند الصحيح المختصر)',
    nameEn: 'Sahih Muslim',
    author: 'الإمام مسلم بن الحجاج النيسابوري (ت 261 هـ)',
    authorBio: 'الإمام الحافظ الحجة، رتب صحيحه بأدق أساليب الجمع وحسن السياق وسلامة الأسانيد.',
    totalHadiths: 7500,
    importance: 'ثاني أصح كتاب في السنة المطهرة بعد صحيح البخاري.',
    verifiedStatus: 'صحيح مجمع على صحته'
  },
  {
    id: 'tirmidhi',
    nameAr: 'جامع الترمذي (سنن الترمذي)',
    nameEn: 'Jami` at-Tirmidhi',
    author: 'الإمام أبو عيسى محمد بن عيسى الترمذي (ت 279 هـ)',
    authorBio: 'تلميذ الإمام البخاري، امتاز كتابه ببيان فقه الأحاديث ودرجاتها وذكر مذاهب الفقهاء من الصحابة والتابعين.',
    totalHadiths: 3956,
    importance: 'عمدة الفقهاء والمحدثين في استنباط الأحكام وبيان العلل.',
    verifiedStatus: 'محقق ومصنف الدرجات'
  },
  {
    id: 'abudawood',
    nameAr: 'سنن أبي داود',
    nameEn: 'Sunan Abi Dawud',
    author: 'الإمام سليمان بن الأشعث السجستاني (ت 275 هـ)',
    authorBio: 'أحد أئمة أهل الحديث الكبار، انتخب كتابه من خمسمائة ألف حديث واقتصر فيه على أحاديث الأحكام الفقهية.',
    totalHadiths: 5274,
    importance: 'مرجع الأحكام الفقهية الأول للمجتهدين.',
    verifiedStatus: 'معتمد الأحكام والسنن'
  },
  {
    id: 'nasai',
    nameAr: 'سنن النسائي (المجتبى من السنن)',
    nameEn: 'Sunan an-Nasa\'i (Al-Mujtaba)',
    author: 'الإمام أحمد بن شعيب النسائي (ت 303 هـ)',
    authorBio: 'شيخ الإسلام وإمام عصره في نقد الرجال وعلل الأحاديث وشدة التحري.',
    totalHadiths: 5758,
    importance: 'أقل السنن الأربعة أحاديث ضعيفة بعد الصحيحين.',
    verifiedStatus: 'دقيق النقد والإسناد'
  },
  {
    id: 'ibnmajah',
    nameAr: 'سنن ابن ماجه',
    nameEn: 'Sunan Ibn Majah',
    author: 'الإمام محمد بن يزيد القزويني ابن ماجه (ت 273 هـ)',
    authorBio: 'الحافظ الكبير المفسر، رتب سننه على الأبواب الفقهية بحسن ترتيب وإيجاز.',
    totalHadiths: 4341,
    importance: 'متمم الكتب الستة المعتمدة في السنة النبوية.',
    verifiedStatus: 'مصنف على الأبواب الفقهية'
  },
  {
    id: 'muwatta',
    nameAr: 'موطأ الإمام مالك',
    nameEn: 'Muwatta Malik',
    author: 'الإمام مالك بن أنس إمام دار الهجرة (ت 179 هـ)',
    authorBio: 'إمام المدينة النبوية وعالمها، قال عنه الشافعي: "ما في الأرض كتاب بعد كتاب الله أكثر صواباً من موطأ مالك".',
    totalHadiths: 1850,
    importance: 'أقدم مدونة حديثية فقهية مسندة وصلت إلينا بأعلى الأسانيد.',
    verifiedStatus: 'أصح مدونة فقهية حديثية سابقة'
  },
  {
    id: 'ahmad',
    nameAr: 'مسند الإمام أحمد بن حنبل',
    nameEn: 'Musnad Ahmad ibn Hanbal',
    author: 'إمام أهل السنة والجماعة أحمد بن حنبل (ت 241 هـ)',
    authorBio: 'أعظم دواوين السنة النبوية وأوسعها استيعاباً لروايات الصحابة وأسانيدهم.',
    totalHadiths: 27647,
    importance: 'الموسوعة الحديثية الكبرى في الإسلام.',
    verifiedStatus: 'ديوان السنة الأكبر'
  }
];

export const VERIFIED_HADITHS: HadithItem[] = [
  {
    id: 'hadith-1',
    bookId: 'bukhari',
    bookName: 'صحيح البخاري',
    hadithNumber: 1,
    chapter: 'كتاب بدء الوحي • باب كيف كان بدء الوحي إلى رسول الله ﷺ',
    arabicText: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا، أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.',
    narrator: 'أمير المؤمنين عمر بن الخطاب رضي الله عنه',
    translationEn: 'Actions are but by intention and every man shall have but that which he intended. Thus he whose migration was for Allah and His Messenger, his migration was for Allah and His Messenger, and he whose migration was for some worldly thing he might gain, or a wife he might marry, his migration was to that for which he migrated.',
    translationFr: 'Les actions ne valent que par les intentions et chacun n\'a pour lui que ce qu\'il a eu réellement l\'intention de faire.',
    grade: 'متفق عليه',
    gradeAttribution: 'أخرجه البخاري (1) ومسلم (1907)',
    explanation: 'هذا الحديث أصل عظيم من أصول الإسلام، وعليه مدار الدين كله؛ فصحة العبادات وقبول الأعمال مشروطة بالإخلاص التام لله وحده وسلامة القصد والنية.',
    topics: ['النية', 'الإخلاص', 'أصول الإيمان', 'العبادات']
  },
  {
    id: 'hadith-2',
    bookId: 'bukhari',
    bookName: 'صحيح البخاري',
    hadithNumber: 5027,
    chapter: 'كتاب فضائل القرآن • باب خيركم من تعلم القرآن وعلمه',
    arabicText: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ.',
    narrator: 'عثمان بن عفان رضي الله عنه',
    translationEn: 'The best among you are those who learn the Quran and teach it to others.',
    translationFr: 'Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne.',
    grade: 'صحيح',
    gradeAttribution: 'صحيح البخاري رقم 5027',
    explanation: 'يبين الحديث فضل الاشتغال بالقرآن الكريم تلاوة وحفظاً وتدبراً ونقلاً إلى الأجيال، وأن معلم القرآن ومتعلمه هما أفضل الناس رتبة وأعظمهم نفعاً للأمة.',
    topics: ['فضائل القرآن', 'التعليم', 'أكاديمية القرآن', 'الخيرية']
  },
  {
    id: 'hadith-3',
    bookId: 'muslim',
    bookName: 'صحيح مسلم',
    hadithNumber: 8,
    chapter: 'كتاب الإيمان • باب بيان الإيمان والإسلام والإحسان (حديث جبريل)',
    arabicText: 'قَالَ: فَأَخْبِرْنِي عَنِ الإِسْلاَمِ؟ فَقَالَ رَسُولُ اللَّهِ ﷺ: الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلاَةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً. قَالَ: صَدَقْتَ... قَالَ: فَأَخْبِرْنِي عَنِ الإِحْسَانِ؟ قَالَ: أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ.',
    narrator: 'عمر بن الخطاب رضي الله عنه',
    translationEn: 'Islam is to testify that there is no god but Allah and Muhammad is the Messenger of Allah, to establish prayer, to give zakah, to fast Ramadan, and to perform pilgrimage to the House if you are able... Ihsan is to worship Allah as if you see Him, and if you do not see Him, He surely sees you.',
    translationFr: 'L\'Islam, c\'est que tu témoignes qu\'il n\'y a de divinité qu\'Allah... Et l\'Excellence (Ihsan), c\'est que tu adores Allah comme si tu Le voyais...',
    grade: 'متفق عليه',
    gradeAttribution: 'أخرجه مسلم (8) والبخاري (50)',
    explanation: 'يسمى "أم السنة"، لأنه جمع مراتب الدين الثلاث: الإسلام (الشرائع الظاهرة)، والإيمان (العقائد الباطنة)، والإحسان (المراقبة الروحية واستحضار عظمة الله).',
    topics: ['أركان الإسلام', 'مراتب الدين', 'الإحسان', 'العقيدة']
  },
  {
    id: 'hadith-4',
    bookId: 'tirmidhi',
    bookName: 'جامع الترمذي',
    hadithNumber: 2646,
    chapter: 'كتاب العلم • باب فضل طلب العلم وسلوك طريقه',
    arabicText: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ، وَإِنَّ الْمَلاَئِكَةَ لَتَضَعُ أَجْنِحَتَهَا رِضًا لِطَالِبِ الْعِلْمِ، وَإِنَّ فَضْلَ الْعَالِمِ عَلَى الْعَابِدِ كَفَضْلِ الْقَمَرِ لَيْلَةَ الْبَدْرِ عَلَى سَائِرِ الْكَوَاكِبِ.',
    narrator: 'أبو الدرداء رضي الله عنه',
    translationEn: 'Whoever treads a path seeking knowledge, Allah makes a path to Paradise easy for him. The angels lower their wings in pleased approval for the seeker of knowledge...',
    translationFr: 'Celui qui emprunte un chemin à la recherche d\'un savoir, Allah lui facilite un chemin vers le Paradis...',
    grade: 'صحيح',
    gradeAttribution: 'رواه الترمذي وقال: حديث حسن، وصححه الألباني',
    explanation: 'حث نبوي بليغ على التعلم الشرعي، وبيان لمنزلة طلبة العلم والعلماء في الدنيا والآخرة، واستغفار الكائنات لهم.',
    topics: ['طلب العلم', 'العلماء', 'أجر التعليم', 'الجنة']
  },
  {
    id: 'hadith-5',
    bookId: 'abudawood',
    bookName: 'سنن أبي داود',
    hadithNumber: 4941,
    chapter: 'كتاب الأدب • باب في حسن الخلق وحفظ اللسان',
    arabicText: 'إِنَّ مِنْ أَحَبِّكُمْ إِلَيَّ وَأَقْرَبِكُمْ مِنِّي مَجْلِسًا يَوْمَ الْقِيَامَةِ أَحَاسِنَكُمْ أَخْلاَقًا.',
    narrator: 'جابر بن عبد الله رضي الله عنهما',
    translationEn: 'Indeed the most beloved of you to me and the nearest of you to me on the Day of Judgment are those of you with the best character.',
    translationFr: 'Ceux d\'entre vous que j\'aime le plus et qui seront les plus proches de moi le Jour de la Résurrection sont ceux qui ont le meilleur comportement.',
    grade: 'حسن',
    gradeAttribution: 'سنن أبي داود وصححه الترمذي',
    explanation: 'تأكيد على أن مقياس القرب من رسول الله ﷺ يوم القيامة هو كرم النفس، وحسن الخلق، والرحمة بالخلق، وكف الأذى.',
    topics: ['الأخلاق', 'الآداب النبوية', 'التعامل مع الناس']
  },
  {
    id: 'hadith-6',
    bookId: 'muslim',
    bookName: 'صحيح مسلم',
    hadithNumber: 1631,
    chapter: 'كتاب الوصية • باب ما يلحق الإنسان من الثواب بعد وفاته (الصدقة الجارية)',
    arabicText: 'إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ.',
    narrator: 'أبو هريرة رضي الله عنه',
    translationEn: 'When a human being dies, his deeds end except for three: continuing charity (Sadaqah Jariyah), knowledge from which benefit is gained, or a righteous child who prays for him.',
    translationFr: 'Quand l\'être humain meurt, ses actions prennent fin sauf pour trois choses : une aumône continue, une science utile...',
    grade: 'صحيح',
    gradeAttribution: 'صحيح مسلم رقم 1631',
    explanation: 'الأصل التشريعي الأكبر لمؤسسة الوقف الإسلامي والمنظومة الخيرية؛ فالوقف والعلم الناشر للقرآن يجري ثوابهما لصاحبهما في قبره إلى قيام الساعة.',
    topics: ['الوقف الخيري', 'الصدقة الجارية', 'نشر العلم', 'البر']
  }
];

export const VERIFIED_SCHOLARS: ScholarProfile[] = [
  {
    id: 'scholar-1',
    name: 'فضيلة أ.د. عبد الرحمن بن يوسف المتقي',
    title: 'أستاذ القراءات والتفسير ورئيس هيئة الإقراء الدولية',
    country: 'المملكة العربية السعودية',
    city: 'المدينة المنورة',
    specialization: 'علوم القرآن والقراءات',
    languages: ['العربية', 'الإنجليزية'],
    bio: 'مجاز بالقراءات العشر الصغرى والكبرى بالسند المتصل إلى النبي ﷺ، أمضى أكثر من 30 عاماً في خدمة كتاب الله وتخريج الحفظة في رحاب المسجد النبوي الشريف.',
    ijazahs: ['إجازة القراءات العشر الكبرى من طريق طيبة النشر', 'إسناد متصل إلى شيخ مقارئ الشام والمغارب', 'دكتوراه في علوم القرآن والتفسير المقارن'],
    verified: true,
    activeStudents: 1420,
    rating: 4.98,
    availableDays: ['السبت', 'الاثنين', 'الأربعاء'],
    sessionDuration: '45 دقيقة',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'scholar-2',
    name: 'فضيلة الشيخ د. محمد إبراهيم الأزهري',
    title: 'أستاذ الحديث النبوي وعلومه بالجامع الأزهر الشريف',
    country: 'جمهورية مصر العربية',
    city: 'القاهرة',
    specialization: 'الحديث الشريف وعلومه',
    languages: ['العربية', 'الفرنسية'],
    bio: 'خبير علم الجرح والتعديل وتخريج الأحاديث وعللها، مؤلف "موسوعة المحرر في علوم الحديث"، ومحاضر في كبريات الجامعات الإسلامية.',
    ijazahs: ['إجازة عامة في الكتب الستة ومسند أحمد', 'دبلوم التخصص في تخريج الأحاديث وتدقيق الأسانيد', 'رئاسة تحرير مجلة البحوث الحديثية'],
    verified: true,
    activeStudents: 980,
    rating: 4.95,
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس'],
    sessionDuration: '60 دقيقة',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'scholar-3',
    name: 'فضيلة د. عمر بن عبد العزيز القيرواني',
    title: 'أستاذ الفقه المقارن والأصول والمعاملات المالية المعاصرة',
    country: 'المملكة المغربية',
    city: 'فاس',
    specialization: 'الفقه المقارن والأصول',
    languages: ['العربية', 'الفرنسية', 'الإنجليزية'],
    bio: 'مستشار الهيئات الشرعية للمصارف الإسلامية والوقف، باحث متخصص في فقه النوازل وتطبيقات مقاصد الشريعة في العصر الرقمي.',
    ijazahs: ['عالمية القرويين في الفقه والأصول', 'دكتوراه الدولة في المعاملات المالية والمصارف', 'عضوية المجمع الفقهي الدولي'],
    verified: true,
    activeStudents: 1150,
    rating: 4.92,
    availableDays: ['الاثنين', 'الأربعاء', 'الجمعة'],
    sessionDuration: '50 دقيقة',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'scholar-4',
    name: 'فضيلة الشيخة الدكتورة فاطمة الزهراء الشنقيطية',
    title: 'أستاذة البلاغة القرآنية وموجهة قسم الطالبات القرآني',
    country: 'موريتانيا',
    city: 'نواكشوط',
    specialization: 'اللغة العربية والبلاغة',
    languages: ['العربية', 'الإنجليزية'],
    bio: 'حافظة لمتون اللغة والنحو والقراءات، مشرفة على أكثر من 500 طالبة خاتمة لكتاب الله، متميزة بأسلوب المحاضن التربوية في التزكية والتدبر.',
    ijazahs: ['إجازة حفص وشعبة وقالون وورش', 'حفظ ألفية ابن مالك والشاطبية والدرة', 'دكتوراه في الإعجاز البياني للقرآن الكريم'],
    verified: true,
    activeStudents: 1850,
    rating: 4.99,
    availableDays: ['السبت', 'الأحد', 'الثلاثاء', 'الخميس'],
    sessionDuration: '40 دقيقة',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  }
];

export const ACADEMY_COURSES_EXPANDED: AcademyCourse[] = [
  {
    id: 'course-quran-1',
    title: 'المقرأة الدولية لحفظ القرآن وإتقان الروايات بالسند المتصل',
    department: 'قسم القرآن الكريم والقراءات',
    instructor: 'أ.د. عبد الرحمن بن يوسف المتقي',
    instructorId: 'scholar-1',
    duration: '24 أسبوعاً (فصلان دراسيان)',
    level: 'دبلوم تخصصي',
    lessonsCount: 48,
    enrolledStudentsCount: 3820,
    description: 'برنامج نموذجي يومي يتضمن التلقين المباشر، وضبط أحكام التجويد، ومخارج الحروف، ومتابعة الحفظ الجديد، مع مراجعة المحفوظ التراكمي وإعداد الطالب للإجازة بالسند المتصل.',
    syllabus: [
      'المدخل لعلم الوقف والابتداء وأثره في المعنى القرآني',
      'دراسة أحكام النون الساكنة والتنوين والمدود عملياً بالصوت',
      'تصحيح مخارج الحروف والصفات المميزة للحروف المتشابهة',
      'حفظ أجزاء القرآن مع المتابعة اليومية وإجراء الاختبارات المرحلية',
      'جلسة العرض والإقراء المباشرة لمنح السند المتصل'
    ],
    prerequisites: ['إجادة القراءة بالرسم العثماني', 'اجتياز اختبار القبول التمهيدي'],
    certificationOffered: true,
    hasVirtualClassroom: true
  },
  {
    id: 'course-hadith-1',
    title: 'دبلوم علوم الحديث الشريف ودراسة كتب السنة التسعة',
    department: 'قسم الحديث والسنة النبوية',
    instructor: 'د. محمد إبراهيم الأزهري',
    instructorId: 'scholar-2',
    duration: '16 أسبوعاً',
    level: 'متوسط',
    lessonsCount: 32,
    enrolledStudentsCount: 2450,
    description: 'تأصيل منهجي لدراسة مناهج المحدثين، وقواعد نقد الأسانيد، والتفرقة بين الصحيح والحسن والضعيف، ودراسة نماذج تطبيقية من صحيحي البخاري ومسلم وسنن الترمذي.',
    syllabus: [
      'تاريخ تدوين السنة ومراحل نشأة علم مصطلح الحديث',
      'معايير الصحة والعدالة والضبط عند أئمة الحديث',
      'دراسة تفصيلية لكتاب البخاري ومنهجه في تراجم الأبواب',
      'التعامل مع الشبهات المعاصرة المثارة حول السنة ودحضها علمياً'
    ],
    prerequisites: ['أساسيات في العلوم الشرعية'],
    certificationOffered: true,
    hasVirtualClassroom: true
  },
  {
    id: 'course-fiqh-1',
    title: 'فقه المعاملات المالية المعاصرة وأحكام العقود الرقمية والوقف',
    department: 'قسم الفقه وأصوله',
    instructor: 'د. عمر بن عبد العزيز القيرواني',
    instructorId: 'scholar-3',
    duration: '12 أسبوعاً',
    level: 'متقدم',
    lessonsCount: 24,
    enrolledStudentsCount: 1680,
    description: 'دراسة فقهية تطبيقية للبيوع المعاصرة، المصارف الإسلامية، الصكوك، الأسهم، العملات الرقمية، وصناديق الوقف الاستثماري وفق مقاصد الشريعة وقرارات المجامع الفقهية.',
    syllabus: [
      'القواعد الفقهية الكبرى الحاكمة للمعاملات المالية',
      'عقود المرابحة والمضاربة والمشاركة والإجارة المنتهية بالتمليك',
      'أحكام التجارة الإلكترونية والدفع الرقمي والعملات المشفرة',
      'إدارة الأوقاف واستثمار ريعها في التنمية المستدامة'
    ],
    prerequisites: ['دراسة مسبقة في فقه المعاملات التأسيسي'],
    certificationOffered: true,
    hasVirtualClassroom: true
  },
  {
    id: 'course-new-muslim-1',
    title: 'منهاج النور التأسيسي لتعليم العقيدة والعبادات للمهتدين الجدد',
    department: 'مركز الدعوة العالمية والمهتدين الجدد',
    instructor: 'نخبة من دعاة مجمع النور متعددي اللغات',
    duration: '8 أسابيع مكثفة',
    level: 'تأسيسي',
    lessonsCount: 16,
    enrolledStudentsCount: 5420,
    description: 'دورة مبسطة وموثقة للمسلمين الجدد والراغبين في تعلم الدين: تبدأ بالتوحيد الصافي، وتعليم الصلاة والوضوء بالفيديو والصوت التفاعلي، وأخلاق المعاملات في الحياة اليومية.',
    syllabus: [
      'معنى الشهادتين وأركان الإيمان الخالصة',
      'الوضوء والطهارة والغسل خطوة بخطوة عملياً',
      'تعلم الصلوات الخمس: أوقاتها، ركعاتها، والأذكار بالترجمة',
      'فقه الأخلاق وبر الوالدين وبناء الأسرة المسلمة'
    ],
    prerequisites: ['مفتوح للجميع دون أي شروط مسبقة'],
    certificationOffered: true,
    hasVirtualClassroom: true
  }
];

export const COMMUNITY_QUESTIONS: CommunityQuestion[] = [
  {
    id: 'q-1',
    authorName: 'سليمان الداغستاني',
    authorCountry: 'روسيا',
    category: 'القرآن الكريم والتجويد',
    questionTitle: 'كيف يضبط طالب العلم صفة القلقلة دون إمالتها إلى الفتح أو الكسر؟',
    questionBody: 'السلام عليكم ورحمة الله، أواجه صعوبة أثناء أداء القلقلة في حروف (قطب جد) حيث تميل مني في بعض الأحيان نحو حركة الحرف الذي قبلها أو الكسرة، ما هو الضابط المعتمد عند أئمة الإقراء؟',
    createdAt: 'منذ يومين',
    answersCount: 4,
    isVerifiedAnswer: true,
    verifiedAnswerBy: 'أ.د. عبد الرحمن المتقي (رئيس هيئة الإقراء)',
    verifiedAnswerText: 'وعليكم السلام ورحمة الله وبركاته. القلقلة يا بني هي اضطراب في مخرج الحرف الساكن حتى يسمع له نبرة قوية، والراجح عند جمهور المحققين أنها لا تمال إلى حركة مطلقاً، بل ينطق بها الحرف ساكناً مجرداً بتصادم المخرج ثم انفراجه بسرعة وخفة دون فتح الشفتين أو تسفيلهما، تدرب على وضع السكون الكامل.',
    tags: ['التجويد', 'القلقلة', 'مخارج الحروف']
  },
  {
    id: 'q-2',
    authorName: 'محمد أمين توريه',
    authorCountry: 'السنغال',
    category: 'الحديث الشريف',
    questionTitle: 'ما الفرق بين الحديث الصحيح لذاته والصحيح لغيره في العمل والاستدلال؟',
    questionBody: 'نرجو من أصحاب الفضيلة توضيح الفرق العملي بين الرتبتين وهل تختلف درجة الاحتجاج بهما في مسائل الأحكام والعقائد؟',
    createdAt: 'منذ 3 أيام',
    answersCount: 3,
    isVerifiedAnswer: true,
    verifiedAnswerBy: 'د. محمد إبراهيم الأزهري',
    verifiedAnswerText: 'كلا القسمين (الصحيح لذاته والصحيح لغيره) حجة شرعية مقبولة وواجبة العمل بإجماع المحدثين والفقهاء. الفرق هو أن الصحيح لذاته استجمع شروط الصحة بذات إسناده تام الضبط، بينما الصحيح لغيره كان في أصله "حسناً لذاته" لخفة في ضبط بعض رواته، ثم تقوى بوروده من طريق آخر مماثل أو أقوى، فارتفع إلى درجة الصحة لغيره.',
    tags: ['علوم الحديث', 'المصطلح', 'الاحتجاج']
  },
  {
    id: 'q-3',
    authorName: 'طارق عبد الباسط',
    authorCountry: 'المملكة المتحدة',
    category: 'الوقف والمعاملات',
    questionTitle: 'هل يجوز استثمار ريع الصدقة الجارية في بناء منصات تقنية إسلامية مجانية؟',
    questionBody: 'نرغب في إنشاء وقف لصالح تطبيق رقمي لتعليم القرآن وتحفيظه لأطفال الجاليات المسلمة، هل يعد هذا من الصدقة الجارية الدائمة؟',
    createdAt: 'منذ 5 أيام',
    answersCount: 5,
    isVerifiedAnswer: true,
    verifiedAnswerBy: 'د. عمر بن عبد العزيز القيرواني',
    verifiedAnswerText: 'نعم، وهذا من أعظم أبواب الوقف المعاصر نفعاً وأوسعها بركة، لأنه يجمع بين "الصدقة الجارية" و"العلم الذي ينتفع به". إنفاق أموال الوقف على بناء الخوادم والمنصات والتطبيقات التي تخدم كتاب الله وسنة رسوله ﷺ وتيسر الحفظ لملايين المسلمين هو وقف علمي منضبط ومندوب شرعاً وله الأجر المتصل بإذن الله.',
    tags: ['الوقف المعاصر', 'التقنية الإسلامية', 'الصدقة الجارية']
  }
];

export const HADITH_DATA = VERIFIED_HADITHS;
export const SCHOLARS_DIRECTORY = VERIFIED_SCHOLARS;
export const ACADEMY_COURSES = ACADEMY_COURSES_EXPANDED;

