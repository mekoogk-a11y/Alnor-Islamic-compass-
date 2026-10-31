import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, Heart, Globe, Play, Pause, Volume2, VolumeX, 
  BookOpen, Video, Radio, CheckCircle, Sparkles, MessageCircle, 
  HelpCircle, ChevronRight, ChevronLeft, Award, UserCheck, 
  Download, ArrowRight, ShieldCheck, Sun, Moon, Volume1,
  Layers, Info, FileText, Check, Share2, Headphones, Star
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { COMPLEX_INFO } from '../../data/islamicData';

type DawahBranch = 'englishDawah' | 'otherLanguages' | 'videosLectures' | 'simplifiedFiqh' | 'dawahRadio';

interface VideoItem {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  category: string;
  language: string;
  thumbnail: string;
  embedId: string;
  description: string;
  keyTakeaways: string[];
}

export const NewMuslimsPage: React.FC<{ onNavigate: (page: any) => void }> = ({ onNavigate }) => {
  const { lang, t, isRtl } = useLanguage();
  const [activeBranch, setActiveBranch] = useState<DawahBranch>('englishDawah');

  // Branch 1: English Dawah FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [shahadaModalOpen, setShahadaModalOpen] = useState(false);
  const [revertName, setRevertName] = useState('');
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  // Branch 2: Multilingual Dawah active language
  const [selectedDawahLang, setSelectedDawahLang] = useState<'fr' | 'es' | 'de' | 'tr' | 'id' | 'zh' | 'sw' | 'ru' | 'ur' | 'fa'>('fr');

  // Branch 3: Video Player state
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [videoFilter, setVideoFilter] = useState<string>('all');

  // Branch 4: Fiqh Sub-tabs (Wudu vs Salah vs Ghusl)
  const [fiqhTab, setFiqhTab] = useState<'wudu' | 'salah' | 'ghusl' | 'fasting'>('wudu');
  const [activeWuduStep, setActiveWuduStep] = useState<number>(0);
  const [activeSalahStep, setActiveSalahStep] = useState<number>(0);

  // Audio Speech Synthesis for pronunciation assistance
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const speakArabic = (arabicText: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(arabicText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // slightly slower for learners
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      setSpeakingText(arabicText);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Branch 5: Multilingual Radio Player state
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [radioChannel, setRadioChannel] = useState<'en' | 'fr' | 'es' | 'tr' | 'sw'>('en');
  const [radioVolume, setRadioVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const radioChannels = {
    en: {
      name: 'Al-Noor English Global Dawah Broadcast',
      freq: '104.2 FM • International Stream',
      currentShow: 'The Divine Guidance: Understanding the Quran',
      speaker: 'Sheikh Dr. Bilal Philips & Global Dawah Council',
      streamUrl: 'https://backup.qurango.net/radio/tarteel', // High availability live Quran/reflection stream
    },
    fr: {
      name: 'Radio Dawah en Langue Française',
      freq: '98.6 FM • Émission Francophone',
      currentShow: 'Comprendre l’Islam et la vie du Prophète ﷺ',
      speaker: 'Pr. Tariq Ramadan & Prédicateurs Francophones',
      streamUrl: 'https://backup.qurango.net/radio/france_translation',
    },
    es: {
      name: 'Radio Islámica en Español',
      freq: '101.4 FM • Emisión Hispana',
      currentShow: 'El Mensaje Eterno: Conociendo a Dios y Sus Profetas',
      speaker: 'Centro Islámico de Dawah en Español',
      streamUrl: 'https://backup.qurango.net/radio/spanish_translation',
    },
    tr: {
      name: 'Al-Noor Türkçe İslami Radyo',
      freq: '106.8 FM • Türkiye & Orta Asya',
      currentShow: 'İslamın Temel Esasları ve Güzel Ahlak',
      speaker: 'Diyanet Dawah & Kültür Heyeti',
      streamUrl: 'https://backup.qurango.net/radio/turkish_translation',
    },
    sw: {
      name: 'Radio Da\'wah ya Kiswahili',
      freq: '92.5 FM • Afrika Mashariki',
      currentShow: 'Misingi ya Uislamu na Mwongozo wa Maisha',
      speaker: 'Umoja wa Wanazuoni wa Afrika Mashariki',
      streamUrl: 'https://backup.qurango.net/radio/swahili_translation',
    },
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : radioVolume;
    }
  }, [radioVolume, isMuted]);

  const toggleRadioPlay = () => {
    if (!audioRef.current) return;
    if (radioPlaying) {
      audioRef.current.pause();
      setRadioPlaying(false);
    } else {
      audioRef.current.src = radioChannels[radioChannel].streamUrl;
      audioRef.current.play().then(() => {
        setRadioPlaying(true);
      }).catch(err => {
        console.warn('Audio play request interrupted or blocked:', err);
      });
    }
  };

  const switchRadioChannel = (channelKey: 'en' | 'fr' | 'es' | 'tr' | 'sw') => {
    setRadioChannel(channelKey);
    if (audioRef.current) {
      audioRef.current.src = radioChannels[channelKey].streamUrl;
      if (radioPlaying) {
        audioRef.current.play().catch(console.warn);
      }
    }
  };

  // Video catalog data
  const videosList: VideoItem[] = [
    {
      id: 'v1',
      title: 'The Purpose of Life & The Path to Inner Peace',
      speaker: 'Sheikh Dr. Bilal Philips',
      duration: '24:15',
      category: 'Foundations',
      language: 'English',
      thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      embedId: 'dQw4w9WgXcQ',
      description: 'An insightful scholarly lecture exploring existential questions: Why are we here? What is the divine message conveyed through all the prophets from Abraham to Muhammad?',
      keyTakeaways: [
        'Pure Monotheism satisfies the innate human disposition (Fitrah).',
        'Life is a purposeful journey of growth, faith, and accountability.',
        'Islam provides clear answers without logical contradictions.'
      ]
    },
    {
      id: 'v2',
      title: 'Journey to Light: A British Scholar Embracing Islam',
      speaker: 'Dr. Timothy Winter (Abdal Hakim Murad)',
      duration: '31:40',
      category: 'Revert Stories',
      language: 'English',
      thumbnail: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
      embedId: 'dQw4w9WgXcQ',
      description: 'A deep intellectual and spiritual journey detailing how Western academic study of theology led to finding tranquility and intellectual satisfaction in the Islamic tradition.',
      keyTakeaways: [
        'The balance between deep intellectual rigor and spiritual intimacy.',
        'Overcoming cultural stereotypes vs genuine Islamic universal values.',
        'Finding belonging in the global Muslim brotherhood.'
      ]
    },
    {
      id: 'v3',
      title: 'Jesus in Islam: The Revered Prophet of God',
      speaker: 'Dr. Zakir Naik & Comparative Religion Scholars',
      duration: '18:50',
      category: 'Comparative',
      language: 'English',
      thumbnail: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
      embedId: 'dQw4w9WgXcQ',
      description: 'Discover the profound Islamic love and respect for Prophet Isa (Jesus son of Mary peace be upon him), his miracles in the Quran, and the continuity of Abrahamic prophecy.',
      keyTakeaways: [
        'Muslims cannot be Muslim without believing in Jesus as a noble Messenger.',
        'The miraculous virgin birth mentioned with supreme honor in Surah Maryam.',
        'Monotheism: Worshipping the God of Jesus, not Jesus himself.'
      ]
    },
    {
      id: 'v4',
      title: 'Comment un Scientifique Européen a trouvé la Foi en l’Islam',
      speaker: 'Dr. Maurice Bucaille (Hommage)',
      duration: '22:10',
      category: 'Revert Stories',
      language: 'French',
      thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      embedId: 'dQw4w9WgXcQ',
      description: 'Une analyse rigoureuse des correspondances entre les découvertes scientifiques modernes et les versets coraniques révélés il y a quatorze siècles.',
      keyTakeaways: [
        'Absence totale de contradictions scientifiques dans le texte coranique.',
        'La précision linguistique extraordinaire du Coran.',
        'L’Islam comme invitation universelle à la réflexion et au savoir.'
      ]
    },
    {
      id: 'v5',
      title: 'First Steps for the New Muslim: Your Daily Anchor',
      speaker: 'Ustadh Nouman Ali Khan',
      duration: '19:35',
      category: 'New Muslim Guide',
      language: 'English',
      thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
      embedId: 'dQw4w9WgXcQ',
      description: 'Compassionate guidance for those who recently took their Shahada. How to ease into the prayers, handle family reactions, and build an unbroken connection with Allah.',
      keyTakeaways: [
        'Religion is ease; do not overwhelm yourself on day one.',
        'Focus on learning Al-Fatiha and sincere intention.',
        'Be gentle, kind, and dutiful to your non-Muslim parents.'
      ]
    },
    {
      id: 'v6',
      title: 'El Corán: Mensaje Divino para la Humanidad Entera',
      speaker: 'Dr. Isa García',
      duration: '27:12',
      category: 'Foundations',
      language: 'Spanish',
      thumbnail: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=800&q=80',
      embedId: 'dQw4w9WgXcQ',
      description: 'Presentación clara y elocuente sobre el milagro de la revelación coránica, su preservación textual y su guía ética para el mundo contemporáneo.',
      keyTakeaways: [
        'El Corán como guía espiritual práctica para el ser humano.',
        'La justicia social y la hermandad en las enseñanzas del Islam.',
        'Cómo empezar a leer y reflexionar en las escrituras sagradas.'
      ]
    }
  ];

  const filteredVideos = videoFilter === 'all' 
    ? videosList 
    : videosList.filter(v => v.category === videoFilter || v.language === videoFilter);

  // Wudu Steps
  const wuduSteps = [
    {
      title: '1. Intention & Bismillah (النية والتسمية)',
      ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Bismillahir-Rahmanir-Rahim',
      meaning: 'Make the intention in your heart to perform ablution for the sake of Allah, then say "In the name of Allah, the Entirely Merciful, the Especially Merciful".',
      detail: 'Intention is strictly in the heart. Do not say it loudly. Cleanliness is half of faith.'
    },
    {
      title: '2. Washing Hands up to the Wrists (غسل الكفين)',
      ar: 'غَسْلُ الكَفَّيْنِ ثَلاثَ مَرَّاتٍ',
      transliteration: 'Wash both hands 3 times',
      meaning: 'Wash your right hand up to the wrist three times, ensuring water passes between fingers, then repeat for the left hand.',
      detail: 'Make sure fingernails and wrist joints are thoroughly wetted.'
    },
    {
      title: '3. Rinsing the Mouth & Sniffing Water (المضمضة والاستنشاق)',
      ar: 'المَضْمَضَةُ وَالاسْتِنْشَاقُ ثَلاثاً',
      transliteration: 'Madmadah & Istinshaq 3 times',
      meaning: 'Take a handful of water with your right hand into your mouth, swirl it around and spit it out. Then sniff water gently into your nostrils and blow it out with the left hand (3 times).',
      detail: 'Purifies the breath and nasal passages before addressing the Lord of the worlds.'
    },
    {
      title: '4. Washing the Entire Face (غسل الوجه)',
      ar: 'غَسْلُ الوَجْهِ ثَلاثاً',
      transliteration: 'Wash the entire face 3 times',
      meaning: 'Wash your face three times from the hairline on the forehead down to the bottom of the chin, and from ear to ear.',
      detail: 'If you have a beard, run wet fingers gently through it.'
    },
    {
      title: '5. Washing Arms up to the Elbows (غسل اليدين للمرفقين)',
      ar: 'غَسْلُ اليَدَيْنِ إِلَى المِرْفَقَيْنِ',
      transliteration: 'Wash arms including elbows 3 times',
      meaning: 'Wash your right arm from fingertips up to and including the elbow 3 times. Then do the same for the left arm 3 times.',
      detail: 'Always start with the right limb before the left.'
    },
    {
      title: '6. Wiping the Head & Cleaning the Ears (مسح الرأس والأذنين)',
      ar: 'مَسْحُ الرَّأْسِ وَالأُذُنَيْنِ مَرَّةً وَاحِدَةً',
      transliteration: 'Wipe head & ears once',
      meaning: 'Wet your hands and wipe from the front hairline back to the nape of the neck and back to the front once. Then use index fingers to clean inner ears and thumbs for the back of ears.',
      detail: 'This is done once with remaining moisture, no fresh water needed for ears.'
    },
    {
      title: '7. Washing Feet up to the Ankles (غسل الرجلين للكعبين)',
      ar: 'غَسْلُ الرِّجْلَيْنِ مَعَ الكَعْبَيْنِ ثَلاثاً',
      transliteration: 'Wash feet up to ankles 3 times',
      meaning: 'Wash your right foot up to and including the ankle 3 times, passing fingers between toes. Then repeat for the left foot.',
      detail: 'Conclude with the beautiful Prophetic Supplication.'
    },
    {
      title: 'Conclusive Du\'a (دعاء ما بعد الوضوء)',
      ar: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
      transliteration: 'Ash-hadu alla ilaha illallah wahdahu la shareeka lah, wa ash-hadu anna Muhammadan \'abduhu wa rasuluh. Allahumma ij\'alni minat-tawwabeen waj\'alni minal-mutatahhireen.',
      meaning: 'I bear witness that there is no deity except Allah alone, without partner; and I bear witness that Muhammad is His servant and Messenger. O Allah, make me of those who constantly repent and make me of those who purify themselves.',
      detail: 'The Prophet ﷺ taught that whoever says this du\'a after wudu, the eight gates of Paradise are opened for him to enter from whichever he wills!'
    }
  ];

  // Salah Steps
  const salahSteps = [
    {
      name: '1. Takbiratul Ihram (Opening Takbir)',
      posture: 'Standing upright (Qiyam) facing the Qiblah',
      ar: 'اللَّهُ أَكْبَرُ',
      transliteration: 'Allahu Akbar',
      meaning: 'Allah is the Greatest',
      notes: 'Raise your hands to earlobes or shoulders, palms forward, and say Allahu Akbar. Place right hand over left over your chest.'
    },
    {
      name: '2. Opening Supplication & Surah Al-Fatiha',
      posture: 'Standing with gaze lowered to place of prostration',
      ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ • الرَّحْمَٰنِ الرَّحِيمِ • مَالِكِ يَوْمِ الدِّينِ • إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ • اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ • صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      transliteration: 'Alhamdu lillahi Rabbil \'Alameen. Ar-Rahmanir-Raheem. Maliki Yawmid-Deen. Iyyaka na\'budu wa iyyaka nasta\'een. Ihdinas-siratal-mustaqeem. Siratal-ladheena an\'amta \'alayhim, ghayril-maghdoobi \'alayhim wa lad-daalleen. Ameen.',
      meaning: '[All] praise is [due] to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path - The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
      notes: 'Al-Fatiha is the pillar of prayer; recited in every single Rak\'ah. Then recite another short chapter like Surah Al-Ikhlas.'
    },
    {
      name: '3. Ruku (The Bowing)',
      posture: 'Bowing with back flat, hands on knees, head aligned',
      ar: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ (3 مرات)',
      transliteration: 'Subhana Rabbiyal-\'Azeem (3 times)',
      meaning: 'Glory be to my Lord, the Magnificent (recited 3 times)',
      notes: 'Say "Allahu Akbar" while bowing down. Bow until your back is flat.'
    },
    {
      name: '4. Rising from Bowing',
      posture: 'Standing back upright with hands at sides or on chest',
      ar: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ • رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
      transliteration: 'Sami\'a Allahu liman hamidah • Rabbana wa lakal-hamd, hamdan katheeran tayyiban mubarakan feeh.',
      meaning: 'Allah hears whoever praises Him. Our Lord, and to You belongs all praise, abundant, good and blessed praise.',
      notes: 'Pause for a moment in complete stillness before going to prostration.'
    },
    {
      name: '5. Sujud (The Prostration)',
      posture: '7 points touching the ground: forehead & nose, both palms, both knees, toes of both feet',
      ar: 'سُبْحَانَ رَبِّيَ الأَعْلَى (3 مرات)',
      transliteration: 'Subhana Rabbiyal-A\'la (3 times)',
      meaning: 'Glory be to my Lord, the Most High (recited 3 times)',
      notes: 'This is the closest a servant ever is to his Creator! Pour out your heart in personal du\'a here.'
    },
    {
      name: '6. Jalsah (Sitting between the two prostrations)',
      posture: 'Sitting on left foot, right foot upright, hands on thighs',
      ar: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
      transliteration: 'Rabbigh-fir li, Rabbigh-fir li',
      meaning: 'O my Lord, forgive me. O my Lord, forgive me.',
      notes: 'Pause calmly, then say "Allahu Akbar" and do the second Sujud identical to the first.'
    },
    {
      name: '7. Tashahhud (The Final Testimony)',
      posture: 'Sitting calmly at the conclusion of prayer',
      ar: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      transliteration: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu \'alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh. As-salamu \'alayna wa \'ala \'ibadillahis-saliheen. Ash-hadu alla ilaha illallah, wa ash-hadu anna Muhammadan \'abduhu wa rasuluh.',
      meaning: 'All greetings, prayers, and pure things belong to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I testify that none has the right to be worshipped except Allah, and I testify that Muhammad is His slave and Messenger.',
      notes: 'Raise your right index finger gently when uttering the Shahada.'
    },
    {
      name: '8. Taslim (The Concluding Salutation of Peace)',
      posture: 'Turn head right, then left',
      ar: 'السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ (يميناً ويساراً)',
      transliteration: 'As-Salamu \'Alaykum wa Rahmatullah (to the right, then to the left)',
      meaning: 'May the peace and mercy of Allah be upon you',
      notes: 'This concludes the prayer with greetings of universal peace to fellow worshippers and recording angels.'
    }
  ];

  // Multilingual Dawah resources dictionary
  const multilingualDawahData = {
    fr: {
      langName: 'Français (French)',
      welcome: 'Bienvenue dans la Famille de l’Islam',
      intro: 'L’Islam est le message universel de paix, de justice et de pureté spirituelle transmis par tous les messagers depuis Adam, Abraham, Moïse et Jésus, jusqu’au sceau des prophètes Muhammad ﷺ.',
      shahadaAr: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      shahadaPhonetic: 'Ach-hadou an lâ ilâha illallâh, wa ach-hadou anna Mouhammadan rassoûloullâh.',
      shahadaFr: '« J’atteste qu’il n’y a point de divinité digne d’adoration en dehors d’Allah et j’atteste que Muhammad est Son serviteur et Messager. »',
      keyArticles: [
        { title: 'Qu’est-ce que l’Islam ?', desc: 'Une foi pure basée sur le monothéisme absolu (Tawhid) et la bienfaisance.' },
        { title: 'Jésus dans le Coran', desc: 'Le statut sublime du Prophète Îsâ et de sa noble mère Maryam (Marie).' },
        { title: 'Guide pratique du nouveau musulman', desc: 'Comment débuter la prière, les ablutions et la vie quotidienne.' }
      ],
      whatsappMsg: 'Bonjour, je souhaite poser une question ou en savoir plus sur l’Islam.'
    },
    es: {
      langName: 'Español (Spanish)',
      welcome: 'Bienvenido al Camino de la Paz y la Verdad',
      intro: 'El Islam no es una religión nueva; es el mensaje universal del Creador para toda la humanidad, enseñado por todos los profetas a través de la historia: Abraham, Moisés, Jesús y el profeta final Muhammad ﷺ.',
      shahadaAr: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      shahadaPhonetic: 'Ash-hadu an la ilaha il-la Al-lah, wa ash-hadu anna Muhammadan rasulul-lah.',
      shahadaFr: '« Atestiguo que no hay más dios que Alá, y atestiguo que Muhammad es el mensajero de Alá. »',
      keyArticles: [
        { title: '¿Qué es el Islam?', desc: 'El monoteísmo puro, la hermandad humana y el propósito de la existencia.' },
        { title: 'Jesús y María en el Islam', desc: 'La gran reverencia coránica hacia el Mesías y su milagroso nacimiento.' },
        { title: 'Primeros pasos del nuevo creyente', desc: 'Aprender la oración (Salah) y la purificación diaria con tranquilidad.' }
      ],
      whatsappMsg: 'Hola, me gustaría recibir más información o consultar una duda sobre el Islam.'
    },
    de: {
      langName: 'Deutsch (German)',
      welcome: 'Willkommen im Islam - Der Weg des Friedens',
      intro: 'Der Islam ist die universelle Hingabe an den einen Schöpfer. Er verbindet Verstand und Herz, Wissenschaft und Spiritualität, Gerechtigkeit und Barmherzigkeit für die gesamte Menschheit.',
      shahadaAr: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      shahadaPhonetic: 'Aschhadu an la ilaha illa-llah, wa aschhadu anna Muhammadan rasulu-llah.',
      shahadaFr: '„Ich bezeuge, dass es keine Gottheit gibt außer Gott (Allah), und ich bezeuge, dass Muhammad Sein Gesandter ist.“',
      keyArticles: [
        { title: 'Die Grundlagen des Glaubens', desc: 'Reiner Monotheismus, die Gesandten, die Offenbarungsbücher und das Jenseits.' },
        { title: 'Jesus im Islam (Isa al-Masih)', desc: 'Die hohe Stellung des Propheten Jesus im Heiligen Koran.' },
        { title: 'Leitfaden für Neu-Muslime', desc: 'Praktische Einführung in das rituelle Gebet, die Waschung und den Alltag.' }
      ],
      whatsappMsg: 'Hallo, ich interessiere mich für den Islam und hätte gerne weitere Informationen.'
    },
    tr: {
      langName: 'Türkçe (Turkish)',
      welcome: 'İslam’ın Aydınlık Yoluna Hoş Geldiniz',
      intro: 'İslam, barış, adalet, merhamet ve tevhid dinidir. İnsanın yaratıcısıyla olan doğrudan ve aracısız bağını kurar.',
      shahadaAr: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      shahadaPhonetic: 'Eşhedü en lâ ilâhe illallah ve eşhedü enne Muhammeden abdühû ve resûlüh.',
      shahadaFr: '« Şahitlik ederim ki Allah’tan başka ilah yoktur ve yine şahitlik ederim ki Muhammed O’nun kulu ve elçisidir. »',
      keyArticles: [
        { title: 'İslam’ın Şartları ve İman Esasları', desc: 'Tevhid inancı, namaz, oruç ve ahlakın güzelliği.' },
        { title: 'Kuran-ı Kerim Mucizesi', desc: 'Çağları aşan ilahi rehberlik ve değişmeyen kutsal metin.' },
        { title: 'Yeni Müslümanlar İçin Rehber', desc: 'Abdest, namaz ve günlük ibadetlerin adım adım öğrenimi.' }
      ],
      whatsappMsg: 'Selamün aleyküm, İslam dini hakkında bilgi ve rehberlik almak istiyorum.'
    },
    id: {
      langName: 'Bahasa Indonesia (Indonesian)',
      welcome: 'Selamat Datang di Jalan Kedamaian Islam',
      intro: 'Islam adalah agama fitrah, membawa rahmat bagi seluruh alam semesta (Rahmatan lil \'Alamin), mengajarkan tauhid murni dan akhlak mulia.',
      shahadaAr: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      shahadaPhonetic: 'Asyhadu alla ilaha illallah, wa asyhadu anna Muhammadar Rasulullah.',
      shahadaFr: '« Aku bersaksi bahwa tiada tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah utusan Allah. »',
      keyArticles: [
        { title: 'Mengenal Hakikat Tauhid', desc: 'Memahami keesaan Allah tanpa perantara dan sekutu.' },
        { title: 'Nabi Isa dalam Al-Qur’an', desc: 'Kedudukan mulia Nabi Isa dan Maryam dalam ajaran Islam.' },
        { title: 'Panduan Mualaf Praktis', desc: 'Langkah mudah mempelajari wudhu, sholat 5 waktu, dan doa harian.' }
      ],
      whatsappMsg: 'Halo, saya ingin bertanya dan mempelajari Islam lebih lanjut.'
    },
    zh: {
      langName: '中文 (Chinese)',
      welcome: '欢迎走进伊斯兰的和平之道',
      intro: '伊斯兰是追求和平、正义与纯洁信仰的普世天启宗教。崇奉独一真主，倡导仁爱与善良。',
      shahadaAr: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      shahadaPhonetic: 'A-shi-ha-du an la yi-la-ha yil-la-llah, wa a-shi-ha-du an-na Mu-ham-ma-dan ra-su-lu-llah.',
      shahadaFr: '「我作证：除安拉外绝无应受崇拜的主；我又作证：穆罕默德是安拉的使者。」',
      keyArticles: [
        { title: '认识伊斯兰教的真谛', desc: '纯粹的独一神信仰（认主独一）与宇宙人生的目的。' },
        { title: '《古兰经》的历史奇迹', desc: '穿越一千四百余年完好无损的永恒圣典。' },
        { title: '新穆斯林实践手册', desc: '简易礼拜、净身清洗与日常生活指南。' }
      ],
      whatsappMsg: '您好，我想了解关于伊斯兰教的信息并寻求答疑。'
    },
    sw: {
      langName: 'Kiswahili (Swahili)',
      welcome: 'Karibu Katika Nuru ya Uislamu',
      intro: 'Uislamu ni dini ya amani, usawa, na tauhidi safi (kumpwekesha Mwenyezi Mungu mmoja pekee asiye na mshirika). Ni ujumbe kwa walimwengu wote.',
      shahadaAr: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      shahadaPhonetic: 'Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan rasulu Allah.',
      shahadaFr: '« Ninashuhudia ya kwamba hakuna mungu anayepaswa kuabudiwa kwa haki isipokuwa Mwenyezi Mungu (Allah), na ninashuhudia ya kwamba Muhammad ni Mtume Wake. »',
      keyArticles: [
        { title: 'Misingi Mikuu ya Uislamu', desc: 'Kuelewa nguzo za Imani na nguzo tano za Uislamu.' },
        { title: 'Nabii Isa (Yesu) katika Qur\'ani', desc: 'Heshima kubwa aliyopewa Mtume Isa na mamaye Bikira Maryam.' },
        { title: 'Mwongozo wa Muislamu Mpya', desc: 'Jinsi ya kutawadha, kuswali na kuishi maisha yenye amani ya kiroho.' }
      ],
      whatsappMsg: 'Habari, ninapenda kuuliza na kupata maelezo zaidi kuhusu Uislamu.'
    },
    ru: {
      langName: 'Русский (Russian)',
      welcome: 'Добро пожаловать в Ислам - путь истины и мира',
      intro: 'Ислам — это вера в Единого Творца, ниспосланная через всех пророков от Адама, Ноя, Авраама, Моисея и Иисуса до Мухаммада ﷺ.',
      shahadaAr: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      shahadaPhonetic: 'Ашхаду алля иляха илляллах, ва ашхаду анна Мухаммадан расулюллах.',
      shahadaFr: '«Я свидетельствую, что нет божества, кроме Аллаха, и я свидетельствую, что Мухаммад — Его посланник».',
      keyArticles: [
        { title: 'Основы исламского вероубеждения', desc: 'Чистый монотеизм, отсутствие посредников между человеком и Богом.' },
        { title: 'Иисус (Иса) в Священном Коране', desc: 'Великий пророк Божий и его чудесное рождение от праведной девы Марьям.' },
        { title: 'Пособие для начинающих мусульман', desc: 'Пошаговое обучение омовению, пятикратному намазу и дуа.' }
      ],
      whatsappMsg: 'Здравствуйте! Я хотел бы узнать больше об Исламе и задать вопросы.'
    },
    ur: {
      langName: 'اردو (Urdu)',
      welcome: 'دین اسلام کے چشمہ رحمت میں خوش آمدید',
      intro: 'اسلام سراپا امن، رحمت اور توحید خالص کا دین ہے۔ یہ اللہ تعالیٰ کا آخری اور مکمل پیغام ہے جو تمام انسانیت کے لیے نازل ہوا۔',
      shahadaAr: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      shahadaPhonetic: 'Ashhadu alla ilaha illallah wa ashhadu anna Muhammadan abduhoo wa Rasooluh.',
      shahadaFr: '« میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں اور میں گواہی دیتا ہوں کہ محمد ﷺ اللہ کے بندے اور رسول ہیں۔ »',
      keyArticles: [
        { title: 'توحید اور ایمان کی حقیقت', desc: 'اللہ کی وحدانیت، صفات اور انسانی زندگی کا مقصد۔' },
        { title: 'قرآن مجید: ہدایتِ کل', desc: 'سائنسی حقائق، ابدی معجزہ اور محفوظ ترین کلامِ الٰہی۔' },
        { title: 'نو مسلم کے ابتدائی مراحل', desc: 'وضو، پانچ وقت کی نماز اور عبادات سیکھنے کا آسان طریقہ۔' }
      ],
      whatsappMsg: 'السلام علیکم، میں اسلام کے بارے میں مزید معلومات اور رہنمائی چاہتا ہوں۔'
    },
    fa: {
      langName: 'فارسی (Persian)',
      welcome: 'به مسیر نورانی اسلام و صلح خوش آمدید',
      intro: 'اسلام دین توحید ناب، خردورزی، عدالت و کرامت انسانی است که پیام‌آور صلح و رستگاری برای تمامی جهانیان می‌باشد.',
      shahadaAr: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      shahadaPhonetic: 'Ashhadu an la ilaha illallah, wa ashhadu anna Muhammadan rasulullah.',
      shahadaFr: '« گواهی می‌دهم که هیچ معبودی جز خدای یکتا نیست، و گواهی می‌دهم که محمد بنده و فرستاده اوست. »',
      keyArticles: [
        { title: 'ارکان بنیادین ایمان اسلامی', desc: 'توحید، نبوت، معاد و پیوند مستقیم بنده با پروردگار.' },
        { title: 'جایگاه حضرت عیسی در قرآن', desc: 'تکریم پیامبر بزرگ الهی و مادر گرامی‌اش مریم عذرا.' },
        { title: 'راهنمای عملی برای تازه‌مسلمانان', desc: 'آموزش گام‌به‌گام وضو، نمازهای پنج‌گانه و ادعیه روزمره.' }
      ],
      whatsappMsg: 'سلام و احترام، مایل هستم درباره دین اسلام پرسش و راهنمایی دریافت کنم.'
    }
  };

  const currentDawahLang = multilingualDawahData[selectedDawahLang];
  const cleanWhatsAppNumber = COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hidden Audio element for radio */}
      <audio ref={audioRef} preload="none" />

      {/* Hero Header Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 border border-emerald-800/40 p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Compass className="w-4 h-4" />
            <span>بوابة المهتدين الجدد والدعوة العالمية • Global Dawah & Revert Center</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-amiri font-black text-white leading-tight">
            مرحباً بك في واحة النور • <span className="text-amber-400 font-sans">Welcome to Islam</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            منصة عالمية متخصصة ومفتوحة على مدار الساعة للمهتدين الجدد والباحثين عن الحقيقة من شتى بقاع الأرض. 
            نوفر تعليماً ميسراً للعبادات، وبرامج دعوية موثقة باللغات الحية، ومكتبة مرئية ومسموعة، مع رعاية وإخاء مباشر.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShahadaModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>نطق الشهادتين • Declare The Shahada</span>
            </button>

            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello, I am interested in learning more about Islam and connecting with a dawah mentor / السلام عليكم، أود التواصل مع مرشد دعوي للمهتدين الجدد')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700/50 font-bold text-sm transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>طلب مرشد دعوي خاص • Request 1-on-1 Mentor</span>
            </a>
          </div>
        </div>
      </div>

      {/* 5-Branch Segmented Navigation Tab Bar */}
      <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto">
        <div className="flex items-center min-w-max gap-1">
          <button
            onClick={() => setActiveBranch('englishDawah')}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeBranch === 'englishDawah'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>1. قسم الدعوة بالإنجليزية (English Dawah)</span>
          </button>

          <button
            onClick={() => setActiveBranch('otherLanguages')}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeBranch === 'otherLanguages'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. قسم الدعوة باللغات العالمية (Multilingual Dawah)</span>
          </button>

          <button
            onClick={() => setActiveBranch('videosLectures')}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeBranch === 'videosLectures'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>3. مكتبة الفيديوهات والمحاضرات (Lectures & Reverts)</span>
          </button>

          <button
            onClick={() => setActiveBranch('simplifiedFiqh')}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeBranch === 'simplifiedFiqh'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>4. الفقه الميسر والعبادات (Simplified Fiqh)</span>
          </button>

          <button
            onClick={() => setActiveBranch('dawahRadio')}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeBranch === 'dawahRadio'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>5. الإذاعة الدعوية العالمية (Dawah Radio)</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          BRANCH 1: ENGLISH DAWAH DEPARTMENT
          ======================================================== */}
      {activeBranch === 'englishDawah' && (
        <div className="space-y-8 animate-fade-in">
          {/* Section Banner */}
          <div className="border-l-4 border-amber-500 pl-4 py-1">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Branch 1: Core Foundation</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">English Dawah Department • Discovering Pure Truth</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Clear, authentic, and scholarly presentation of Islam designed for the contemporary English-speaking inquirer.
            </p>
          </div>

          {/* Core Pillars of Islam Presentation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
                01
              </div>
              <h3 className="text-base font-bold text-white">Pure Monotheism (Tawheed)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Islam teaches the absolute oneness and uniqueness of the Creator (Allah). He has no partners, no parents, no offspring, and no human limitations. Worship is directed solely to Him without intermediaries.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black">
                02
              </div>
              <h3 className="text-base font-bold text-white">Prophet Muhammad ﷺ</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The final messenger sent as a mercy to all creation. Known even before prophecy as Al-Ameen (the Trustworthy), his character, humility, justice, and compassion transformed human history.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-black">
                03
              </div>
              <h3 className="text-base font-bold text-white">Jesus (Isa) in Islam</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A revered mighty Messenger born miraculously to the Virgin Mary (Maryam). Muslims honor, love, and revere Jesus as a great prophet who preached pure devotion to God alone.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black">
                04
              </div>
              <h3 className="text-base font-bold text-white">The Holy Quran</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The literal, preserved word of Allah revealed verbatim in Arabic over 23 years. Unaltered since its revelation, it challenges reason, uplifts the soul, and provides an infallible moral compass.
              </p>
            </div>
          </div>

          {/* Interactive FAQs & Debunking Misconceptions Accordion */}
          <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <span>Common Questions & Misconceptions Debunked</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Straightforward scholarly answers to questions most frequently asked by inquirers and new believers.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'Does Islam require me to discard my culture, family, or heritage?',
                  a: 'Absolutely not. Islam is a universal message, not an Arab or Middle Eastern monoculture. Every good custom, language, cuisine, and family tradition that does not directly contradict pure monotheism or harm others is welcomed and celebrated. Respect and kindness to your non-Muslim parents is an explicit religious obligation in the Quran.'
                },
                {
                  q: 'What is the true status of women in Islam?',
                  a: 'Over 1,400 years ago, Islam granted women legal independence, the right to own and dispose of property, divorce, inherit, choose their spouse, and pursue education. In Islam, men and women are spiritual equals in the eyes of Allah: "Whoever does righteousness, whether male or female, while he is a believer - We will surely cause him to live a good life" (Quran 16:97).'
                },
                {
                  q: 'How does someone formally become a Muslim?',
                  a: 'Entering Islam requires no complex ritual, no baptism, and no priestly confession. A person simply recites the Shahada (Testimony of Faith) with sincere understanding and heart conviction: bearing witness that there is no god but Allah, and Muhammad is His Messenger.'
                },
                {
                  q: 'What if I find Arabic difficult to pronounce initially?',
                  a: 'Allah looks at your heart and effort. The Prophet ﷺ said: "The one who recites the Quran with difficulty and stumbles will have double the reward." In the beginning, you can pray using simple phrases of remembrance (SubhanAllah, Alhamdulillah, Allahu Akbar) while you gradually learn the verses.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left px-4 py-3.5 flex items-center justify-between text-sm font-bold text-white hover:bg-slate-800/40 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-amber-400 transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/50 bg-slate-900/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* New Muslim Starter Package CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Free Digital Welcome Kit</span>
              <h4 className="text-lg font-black text-white">Request Your New Muslim Starter Kit & One-on-One Mentor</h4>
              <p className="text-xs text-slate-300 max-w-xl">
                Get paired with a certified native English-speaking Islamic mentor to answer your personal questions, accompany you through prayer basics, and welcome you into the community.
              </p>
            </div>
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello, I am requesting the New Muslim Starter Kit and a personal mentor.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shrink-0 transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Connect with Mentor</span>
            </a>
          </div>
        </div>
      )}

      {/* ========================================================
          BRANCH 2: MULTILINGUAL DAWAH DEPARTMENT
          ======================================================== */}
      {activeBranch === 'otherLanguages' && (
        <div className="space-y-8 animate-fade-in">
          {/* Section Banner */}
          <div className="border-l-4 border-emerald-500 pl-4 py-1">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Branch 2: Global Reach</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">قسم الدعوة باللغات العالمية الأخرى • Multilingual Dawah Department</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Dedicated Dawah materials, testimony guides, and educational pamphlets in 10 major world languages.
            </p>
          </div>

          {/* Language Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(multilingualDawahData) as Array<keyof typeof multilingualDawahData>).map((langKey) => {
              const info = multilingualDawahData[langKey];
              const isSelected = selectedDawahLang === langKey;
              return (
                <button
                  key={langKey}
                  onClick={() => setSelectedDawahLang(langKey)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/30 font-black scale-105'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {info.langName}
                </button>
              );
            })}
          </div>

          {/* Active Language Detailed Showcase */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Selected Language: {currentDawahLang.langName}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {currentDawahLang.welcome}
                </h3>
              </div>
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(currentDawahLang.whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all w-fit"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Contact Native Dawah Specialist</span>
              </a>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {currentDawahLang.intro}
            </p>

            {/* The Shahada in this Language */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>The Declaration of Faith (Shahada)</span>
                </span>
                <button
                  onClick={() => speakArabic(currentDawahLang.shahadaAr)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{speakingText === currentDawahLang.shahadaAr ? 'جاري النطق...' : 'استمع للنطق بالعربية'}</span>
                </button>
              </div>

              <div className="text-lg sm:text-xl font-amiri font-black text-amber-300 text-right leading-loose">
                {currentDawahLang.shahadaAr}
              </div>

              <div className="text-xs sm:text-sm font-mono text-emerald-400">
                {currentDawahLang.shahadaPhonetic}
              </div>

              <div className="text-xs sm:text-sm text-slate-300 italic border-t border-slate-800 pt-2">
                {currentDawahLang.shahadaFr}
              </div>
            </div>

            {/* Core Articles for this Language */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Featured Guides & Articles ({currentDawahLang.langName})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentDawahLang.keyArticles.map((art, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Guide 0{idx + 1}</span>
                    <h5 className="text-sm font-bold text-white">{art.title}</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">{art.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BRANCH 3: VIDEOS & LECTURES LIBRARY
          ======================================================== */}
      {activeBranch === 'videosLectures' && (
        <div className="space-y-8 animate-fade-in">
          {/* Section Banner */}
          <div className="border-l-4 border-sky-500 pl-4 py-1">
            <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">Branch 3: Audio-Visual Learning</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">مكتبة الفيديوهات والمحاضرات الدعوية • Videos & Lectures</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Curated lectures, inspirational revert journeys, and foundational courses by renowned international Islamic scholars.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Lectures (الكل)' },
              { id: 'Foundations', label: 'Foundations of Faith (أصول الإيمان)' },
              { id: 'Revert Stories', label: 'Revert Journeys (قصص المهتدين)' },
              { id: 'New Muslim Guide', label: 'First Steps (خطوات المسلم الجديد)' },
              { id: 'Comparative', label: 'Comparative Religion (مقارنة الأديان)' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setVideoFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  videoFilter === f.id
                    ? 'bg-sky-600 text-white shadow-md font-black'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => (
              <div 
                key={vid.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden hover:border-sky-500/40 transition-all flex flex-col group shadow-lg"
              >
                {/* Thumbnail with duration badge */}
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img 
                    src={vid.thumbnail} 
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                    <button
                      onClick={() => setActiveVideo(vid)}
                      className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform"
                      title="Play lecture"
                    >
                      <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-[11px] font-mono font-bold text-white">
                    {vid.duration}
                  </span>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-sky-950/80 border border-sky-600/40 text-[10px] font-bold text-sky-300">
                    {vid.language}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-amber-400 font-bold">{vid.category}</span>
                      <span>{vid.speaker}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveVideo(vid)}
                    className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-sky-400" />
                    <span>Watch & Read Takeaways</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Video Detail Modal */}
          {activeVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase">{activeVideo.category} • {activeVideo.speaker}</span>
                    <h3 className="text-lg font-black text-white">{activeVideo.title}</h3>
                  </div>
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Simulated High-Res Video Player */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <img src={activeVideo.thumbnail} alt={activeVideo.title} className="w-full h-full object-cover opacity-40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl animate-pulse">
                      <Play className="w-8 h-8 fill-slate-950 translate-x-0.5" />
                    </div>
                    <span className="text-xs text-slate-300 font-bold bg-slate-950/70 px-3 py-1 rounded-full">
                      البث الأكاديمي المباشر للمحاضرة • {activeVideo.duration}
                    </span>
                  </div>
                </div>

                {/* Description & Key Takeaways */}
                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <h4 className="font-bold text-white mb-1">About this lecture</h4>
                    <p className="text-slate-300 leading-relaxed">{activeVideo.description}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h5 className="font-bold text-amber-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Key Takeaways for Students & Reverts</span>
                    </h5>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-300 text-xs">
                      {activeVideo.keyTakeaways.map((point, pIdx) => (
                        <li key={pIdx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          BRANCH 4: SIMPLIFIED FIQH & WORSHIP GUIDE
          ======================================================== */}
      {activeBranch === 'simplifiedFiqh' && (
        <div className="space-y-8 animate-fade-in">
          {/* Section Banner */}
          <div className="border-l-4 border-amber-500 pl-4 py-1">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Branch 4: Practical Worship</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">قسم الفقه الميسر لتعليم الصلاة والوضوء والعبادات للمسلمين الجدد</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Step-by-step visual, audio, and transliterated guides to performing daily ablution (Wudu), the 5 daily prayers (Salah), and worship.
            </p>
          </div>

          {/* Sub-tab selection */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
            {[
              { id: 'wudu', label: '1. تعليم الوضوء عملياً (Ablution / Wudu)' },
              { id: 'salah', label: '2. تعليم الصلاة خطوة بخطوة (Daily Prayer / Salah)' },
              { id: 'ghusl', label: '3. الطهارة والغسل (Full Purification / Ghusl)' },
              { id: 'fasting', label: '4. فقه الصيام وأركان الإسلام (Fasting & Pillars)' }
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setFiqhTab(sub.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  fiqhTab === sub.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* SUB-TAB 1: WUDU (ABLUTION) */}
          {fiqhTab === 'wudu' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs sm:text-sm text-emerald-200">
                <span className="font-bold">قاعدة نبوية شريفة:</span> الطَّهُورُ شَطْرُ الإِيمَانِ (Cleanliness and ritual purity is half of faith). 
                Follow each step below. You can click on the audio icon to hear the exact Arabic pronunciation!
              </div>

              {/* Step Navigator */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                {wuduSteps.map((step, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setActiveWuduStep(sIdx)}
                    className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all border ${
                      activeWuduStep === sIdx
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Step {sIdx + 1}</span>
                  </button>
                ))}
              </div>

              {/* Active Step Card */}
              {wuduSteps[activeWuduStep] && (
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-bold text-amber-400">Step {activeWuduStep + 1} of {wuduSteps.length}</span>
                      <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                        {wuduSteps[activeWuduStep].title}
                      </h3>
                    </div>

                    <button
                      onClick={() => speakArabic(wuduSteps[activeWuduStep].ar)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors w-fit"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{speakingText === wuduSteps[activeWuduStep].ar ? 'جاري الاستماع...' : 'استمع للنطق بالعربية'}</span>
                    </button>
                  </div>

                  {/* Arabic Text */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
                    <span className="text-xl sm:text-2xl font-amiri font-black text-amber-300 leading-loose">
                      {wuduSteps[activeWuduStep].ar}
                    </span>
                  </div>

                  {/* Transliteration */}
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Pronunciation (Transliteration):
                    </span>
                    <p className="text-sm font-mono text-slate-200 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                      {wuduSteps[activeWuduStep].transliteration}
                    </p>
                  </div>

                  {/* English Meaning */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Meaning & Instructions:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {wuduSteps[activeWuduStep].meaning}
                    </p>
                  </div>

                  {/* Practical Note */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                    <span className="font-bold">نصيحة للمتعلم: </span>
                    {wuduSteps[activeWuduStep].detail}
                  </div>

                  {/* Step Navigation Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <button
                      disabled={activeWuduStep === 0}
                      onClick={() => setActiveWuduStep(prev => Math.max(0, prev - 1))}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-bold text-white flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous Step</span>
                    </button>

                    <button
                      disabled={activeWuduStep === wuduSteps.length - 1}
                      onClick={() => setActiveWuduStep(prev => Math.min(wuduSteps.length - 1, prev + 1))}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-black flex items-center gap-1.5"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB 2: SALAH (PRAYER) */}
          {fiqhTab === 'salah' && (
            <div className="space-y-6">
              {/* Daily Prayers Summary Table */}
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>The 5 Daily Prayers & Units (Rakat)</span>
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono border-b border-slate-800">
                      <tr>
                        <th className="p-3">Prayer Name</th>
                        <th className="p-3">Timing</th>
                        <th className="p-3">Fard (Obligatory Units)</th>
                        <th className="p-3">Sunnah (Recommended)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      <tr>
                        <td className="p-3 font-bold text-amber-300">Fajr (الفجر)</td>
                        <td className="p-3 text-slate-400">Dawn before sunrise</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">2 Rak'ahs</td>
                        <td className="p-3 text-slate-400">2 before Fard</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-amber-300">Dhuhr (الظهر)</td>
                        <td className="p-3 text-slate-400">Just after solar noon</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">4 Rak'ahs</td>
                        <td className="p-3 text-slate-400">4 before, 2 after</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-amber-300">Asr (العصر)</td>
                        <td className="p-3 text-slate-400">Late afternoon</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">4 Rak'ahs</td>
                        <td className="p-3 text-slate-400">Optional</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-amber-300">Maghrib (المغرب)</td>
                        <td className="p-3 text-slate-400">Just after sunset</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">3 Rak'ahs</td>
                        <td className="p-3 text-slate-400">2 after Fard</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-amber-300">Isha (العشاء)</td>
                        <td className="p-3 text-slate-400">Nightfall until dawn</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">4 Rak'ahs</td>
                        <td className="p-3 text-slate-400">2 after + Witr</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step-by-step Postures Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-white">
                    Step-by-Step Movements & Words of Prayer
                  </h4>
                  <span className="text-xs text-amber-400 font-bold">
                    Click each movement to learn recitation
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                  {salahSteps.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSalahStep(idx)}
                      className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all border ${
                        activeSalahStep === idx
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{step.name.split('.')[0]}</span>
                    </button>
                  ))}
                </div>

                {salahSteps[activeSalahStep] && (
                  <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-xs font-bold text-amber-400">Movement {activeSalahStep + 1} of {salahSteps.length}</span>
                        <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                          {salahSteps[activeSalahStep].name}
                        </h3>
                        <span className="text-xs text-emerald-400 block mt-1">
                          Posture: {salahSteps[activeSalahStep].posture}
                        </span>
                      </div>

                      <button
                        onClick={() => speakArabic(salahSteps[activeSalahStep].ar)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors w-fit"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{speakingText === salahSteps[activeSalahStep].ar ? 'جاري الاستماع...' : 'استمع للفظ العربي'}</span>
                      </button>
                    </div>

                    {/* Arabic Text */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
                      <span className="text-xl sm:text-2xl font-amiri font-black text-amber-300 leading-loose">
                        {salahSteps[activeSalahStep].ar}
                      </span>
                    </div>

                    {/* Transliteration */}
                    <div>
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                        Transliteration (How to pronounce):
                      </span>
                      <p className="text-xs sm:text-sm font-mono text-slate-200 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                        {salahSteps[activeSalahStep].transliteration}
                      </p>
                    </div>

                    {/* Meaning */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        English Translation:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {salahSteps[activeSalahStep].meaning}
                      </p>
                    </div>

                    {/* Posture Notes */}
                    <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/40 text-xs text-sky-200">
                      <span className="font-bold">Instructions & Posture: </span>
                      {salahSteps[activeSalahStep].notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: GHUSL & PURIFICATION */}
          {fiqhTab === 'ghusl' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Full Ritual Bath (Ghusl)</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ghusl is required upon embracing Islam, following marital intimacy, nocturnal emission, or after the conclusion of post-natal bleeding / menstruation. It represents total spiritual and physical renewal.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400">Step 1</span>
                  <h4 className="text-sm font-bold text-white">Intention & Wash Impurities</h4>
                  <p className="text-xs text-slate-400">Intend purification in your heart, say Bismillah, and wash away any physical impurities with water.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400">Step 2</span>
                  <h4 className="text-sm font-bold text-white">Perform Wudu</h4>
                  <p className="text-xs text-slate-400">Perform standard ablution just like before prayer, including mouth rinsing and sniffing water.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400">Step 3</span>
                  <h4 className="text-sm font-bold text-white">Wash Entire Body</h4>
                  <p className="text-xs text-slate-400">Pour water thoroughly over head and entire body, starting from the right side then the left, ensuring water reaches roots of hair.</p>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 4: FASTING BASICS */}
          {fiqhTab === 'fasting' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Fasting in Ramadan (Sawm)</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Fasting the month of Ramadan is the fourth pillar of Islam. Believers abstain from food, drink, and marital relations from dawn (Fajr) until sunset (Maghrib), cultivating self-discipline, gratitude, and empathy with the needy.
              </p>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <span className="font-bold">Advice for New Believers: </span>
                If you embraced Islam recently, approach fasting with balance and joy. If you suffer from illness or difficult physical conditions, Islam provides exemptions and make-up days.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          BRANCH 5: MULTILINGUAL DAWAH RADIO STATION
          ======================================================== */}
      {activeBranch === 'dawahRadio' && (
        <div className="space-y-8 animate-fade-in">
          {/* Section Banner */}
          <div className="border-l-4 border-amber-500 pl-4 py-1">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Branch 5: 24/7 Global Audio Broadcast</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">إذاعة البرامج الدعوية العالمية بمختلف اللغات • Multilingual Dawah Radio</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live continuous audio broadcast streaming Islamic education, beautiful Quran recitation with translations, and faith-building lectures worldwide.
            </p>
          </div>

          {/* Luxury Hi-Fi Radio Console */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 p-6 sm:p-10 shadow-2xl space-y-8">
            
            {/* Top Display Screen */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4 relative overflow-hidden shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full ${radioPlaying ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`} />
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 tracking-wider uppercase font-bold">
                      {radioPlaying ? 'LIVE ON AIR • البث الحي المباشر' : 'BROADCAST STANDBY'}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {radioChannels[radioChannel].name}
                    </h3>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-400 w-fit">
                  {radioChannels[radioChannel].freq}
                </div>
              </div>

              {/* Show Details */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Current Program:</span>
                <p className="text-sm sm:text-base font-bold text-amber-200">
                  {radioChannels[radioChannel].currentShow}
                </p>
                <span className="text-xs text-slate-400 block">
                  Presented by: {radioChannels[radioChannel].speaker}
                </span>
              </div>

              {/* Audio Equalizer Visualizer Bars */}
              <div className="flex items-end gap-1.5 h-12 pt-2">
                {[40, 75, 55, 90, 60, 85, 30, 95, 70, 50, 80, 65, 45, 90, 60, 40, 75, 85, 55, 65].map((val, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t-sm transition-all duration-300 ${
                      radioPlaying 
                        ? 'bg-gradient-to-t from-emerald-600 via-amber-500 to-amber-300' 
                        : 'bg-slate-800'
                    }`}
                    style={{
                      height: radioPlaying ? `${Math.max(15, (val * ((idx % 3) + 1)) % 100)}%` : '15%',
                      opacity: radioPlaying ? 0.9 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Channels Switcher Dial */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Select Language Channel (قنوات اللغات الدعوية):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { id: 'en', label: 'English Stream', flag: '🇬🇧 English' },
                  { id: 'fr', label: 'Canal Français', flag: '🇫🇷 Français' },
                  { id: 'es', label: 'Canal Español', flag: '🇪🇸 Español' },
                  { id: 'tr', label: 'Türkçe Yayın', flag: '🇹🇷 Türkçe' },
                  { id: 'sw', label: 'Idhaa ya Kiswahili', flag: '🌍 Kiswahili' }
                ].map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => switchRadioChannel(ch.id as any)}
                    className={`p-3 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                      radioChannel === ch.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg scale-105'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{ch.flag}</span>
                    <span className="text-[10px] opacity-80">{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware-like Audio Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-slate-800 pt-6">
              {/* Play / Pause Big Button */}
              <button
                onClick={toggleRadioPlay}
                className={`px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 shadow-xl ${
                  radioPlaying
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 hover:scale-[1.02]'
                }`}
              >
                {radioPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-white" />
                    <span>إيقاف مؤقت • Pause Broadcast</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-slate-950" />
                    <span>تشغيل الإذاعة • Start Listening Live</span>
                  </>
                )}
              </button>

              {/* Volume Slider & Mute */}
              <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 w-full sm:w-72">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 text-slate-400 hover:text-white"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : radioVolume}
                  onChange={(e) => {
                    setRadioVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />

                <span className="text-[11px] font-mono text-slate-400 w-9 text-right">
                  {Math.round((isMuted ? 0 : radioVolume) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SHAHADA DECLARATION & VIRTUAL CERTIFICATE MODAL
          ======================================================== */}
      {shahadaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Heart className="w-5 h-5 fill-amber-400" />
                <h3 className="text-lg font-black text-white">إعلان الشهادتين • The Declaration of Faith</h3>
              </div>
              <button
                onClick={() => setShahadaModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                ✕
              </button>
            </div>

            {!certificateGenerated ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-200 leading-relaxed">
                  The moment you utter these words with conviction and sincere intention to worship Allah alone and follow His Messenger Muhammad ﷺ, you become a Muslim. All past mistakes are forgiven, and your book is opened pure and white.
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">النص العربي بالتشكيل التام:</span>
                  <div className="text-xl sm:text-2xl font-amiri font-black text-amber-300 leading-loose">
                    أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ
                  </div>

                  <div className="text-xs sm:text-sm font-mono text-emerald-400">
                    Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan Rasulullah.
                  </div>

                  <div className="text-xs text-slate-300 italic pt-1">
                    "I bear witness that there is no god but Allah, and I bear witness that Muhammad is the Messenger of Allah."
                  </div>

                  <button
                    onClick={() => speakArabic('أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold mt-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>استمع للنطق الصحيح (Audio Guidance)</span>
                  </button>
                </div>

                {/* Form to enter name for welcome certificate */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-white block">
                    Enter your name to generate your Welcome & Shahada Attestation Certificate:
                  </label>
                  <input
                    type="text"
                    value={revertName}
                    onChange={(e) => setRevertName(e.target.value)}
                    placeholder="Your Full Name (e.g., Sarah Johnson / Adam Miller)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    disabled={!revertName.trim()}
                    onClick={() => setCertificateGenerated(true)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 disabled:opacity-40 text-slate-950 font-black text-sm transition-all"
                  >
                    Confirm & View Welcome Attestation Certificate
                  </button>
                </div>
              </div>
            ) : (
              /* Generated Certificate Display */
              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-slate-950 border-4 border-amber-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
                  
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center font-black">
                    <Award className="w-7 h-7" />
                  </div>

                  <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold block">
                    مجمع النور الإسلامي العالمي • International Islamic Certificate
                  </span>

                  <h4 className="text-xl sm:text-2xl font-black text-white font-amiri">
                    شهادة مباركة دخول في الإسلام • Welcoming Certificate
                  </h4>

                  <p className="text-xs text-slate-300">This certifies with joy and gratitude to Allah that:</p>

                  <div className="text-xl sm:text-2xl font-black text-amber-300 underline decoration-amber-500/40 underline-offset-8">
                    {revertName}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                    Has declared the blessed Islamic testimony of faith (Shahada), embracing the path of pure monotheism, peace, and brotherhood.
                  </p>

                  <div className="border-t border-slate-800 pt-4 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Date: {new Date().toLocaleDateString('en-GB')}</span>
                    <span>Al-Noor Global Dawah Council</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Print / Save Certificate</span>
                  </button>
                  <button
                    onClick={() => {
                      setCertificateGenerated(false);
                      setShahadaModalOpen(false);
                    }}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
