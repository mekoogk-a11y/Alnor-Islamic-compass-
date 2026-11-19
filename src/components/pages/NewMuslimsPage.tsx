import React, { useState, useRef, useEffect } from 'react';
import {
  Compass, Heart, Globe, Play, Pause, Volume2, VolumeX,
  BookOpen, Video, Radio, CheckCircle, MessageCircle,
  HelpCircle, ChevronRight, ChevronLeft, Award, UserCheck,
  Download, Sun, Layers, Info, Star, X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { COMPLEX_INFO } from '../../data/islamicData';
import { createVideoPosterDataUri } from '../../utils/islamicArtwork';
import { NavigationPage } from '../../types';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

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

export const NewMuslimsPage: React.FC<{ onNavigate: (page: NavigationPage) => void }> = () => {
  const { isRtl } = useLanguage();
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

  // Branch 4: Fiqh Sub-tabs
  const [fiqhTab, setFiqhTab] = useState<'wudu' | 'salah' | 'ghusl' | 'fasting'>('wudu');
  const [activeWuduStep, setActiveWuduStep] = useState<number>(0);
  const [activeSalahStep, setActiveSalahStep] = useState<number>(0);

  // Audio Speech Synthesis
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const speakArabic = (arabicText: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(arabicText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
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
      freq: '104.2 FM · International Stream',
      currentShow: 'The Divine Guidance: Understanding the Quran',
      speaker: 'Sheikh Dr. Bilal Philips & Global Dawah Council',
      streamUrl: 'https://backup.qurango.net/radio/tarteel',
    },
    fr: {
      name: 'Radio Dawah en Langue Française',
      freq: '98.6 FM · Émission Francophone',
      currentShow: 'Comprendre l’Islam et la vie du Prophète ﷺ',
      speaker: 'Pr. Tariq Ramadan & Prédicateurs Francophones',
      streamUrl: 'https://backup.qurango.net/radio/france_translation',
    },
    es: {
      name: 'Radio Islámica en Español',
      freq: '101.4 FM · Emisión Hispana',
      currentShow: 'El Mensaje Eterno: Conociendo a Dios y Sus Profetas',
      speaker: 'Centro Islámico de Dawah en Español',
      streamUrl: 'https://backup.qurango.net/radio/spanish_translation',
    },
    tr: {
      name: 'Al-Noor Türkçe İslami Radyo',
      freq: '106.8 FM · Türkiye & Orta Asya',
      currentShow: 'İslamın Temel Esasları ve Güzel Ahlak',
      speaker: 'Diyanet Dawah & Kültür Heyeti',
      streamUrl: 'https://backup.qurango.net/radio/turkish_translation',
    },
    sw: {
      name: "Radio Da'wah ya Kiswahili",
      freq: '92.5 FM · Afrika Mashariki',
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

  const videosList: VideoItem[] = [
    {
      id: 'v1',
      title: 'The Purpose of Life & The Path to Inner Peace',
      speaker: 'Sheikh Dr. Bilal Philips',
      duration: '24:15',
      category: 'Foundations',
      language: 'English',
      thumbnail: createVideoPosterDataUri('Purpose of Life', 'FOUNDATIONS · EN', '#D4AF37'),
      embedId: 'dQw4w9WgXcQ',
      description: 'An insightful scholarly lecture exploring existential questions: Why are we here? What is the divine message conveyed through all the prophets from Abraham to Muhammad?',
      keyTakeaways: [
        'Pure Monotheism satisfies the innate human disposition (Fitrah).',
        'Life is a purposeful journey of growth, faith, and accountability.',
        'Islam provides clear answers without logical contradictions.',
      ],
    },
    {
      id: 'v2',
      title: 'Journey to Light: A British Scholar Embracing Islam',
      speaker: 'Dr. Timothy Winter (Abdal Hakim Murad)',
      duration: '31:40',
      category: 'Revert Stories',
      language: 'English',
      thumbnail: createVideoPosterDataUri('Journey to Light', 'REVERT STORIES · EN', '#38BDF8'),
      embedId: 'dQw4w9WgXcQ',
      description: 'A deep intellectual and spiritual journey detailing how Western academic study of theology led to finding tranquility and intellectual satisfaction in the Islamic tradition.',
      keyTakeaways: [
        'The balance between deep intellectual rigor and spiritual intimacy.',
        'Overcoming cultural stereotypes vs genuine Islamic universal values.',
        'Finding belonging in the global Muslim brotherhood.',
      ],
    },
    {
      id: 'v3',
      title: 'Jesus in Islam: The Revered Prophet of God',
      speaker: 'Dr. Zakir Naik & Comparative Religion Scholars',
      duration: '18:50',
      category: 'Comparative',
      language: 'English',
      thumbnail: createVideoPosterDataUri('Jesus in Islam', 'COMPARATIVE · EN', '#34D399'),
      embedId: 'dQw4w9WgXcQ',
      description: 'Discover the profound Islamic love and respect for Prophet Isa (Jesus son of Mary peace be upon him), his miracles in the Quran, and the continuity of Abrahamic prophecy.',
      keyTakeaways: [
        'Muslims cannot be Muslim without believing in Jesus as a noble Messenger.',
        'The miraculous virgin birth mentioned with supreme honor in Surah Maryam.',
        'Monotheism: Worshipping the God of Jesus, not Jesus himself.',
      ],
    },
    {
      id: 'v4',
      title: 'Comment un Scientifique Européen a trouvé la Foi en l’Islam',
      speaker: 'Dr. Maurice Bucaille (Hommage)',
      duration: '22:10',
      category: 'Revert Stories',
      language: 'French',
      thumbnail: createVideoPosterDataUri('Foi & Science', 'HISTOIRES · FR', '#A78BFA'),
      embedId: 'dQw4w9WgXcQ',
      description: 'Une analyse rigoureuse des correspondances entre les découvertes scientifiques modernes et les versets coraniques révélés il y a quatorze siècles.',
      keyTakeaways: [
        'Absence totale de contradictions scientifiques dans le texte coranique.',
        'La précision linguistique extraordinaire du Coran.',
        'L’Islam comme invitation universelle à la réflexion et au savoir.',
      ],
    },
    {
      id: 'v5',
      title: 'First Steps for the New Muslim: Your Daily Anchor',
      speaker: 'Ustadh Nouman Ali Khan',
      duration: '19:35',
      category: 'New Muslim Guide',
      language: 'English',
      thumbnail: createVideoPosterDataUri('Daily Anchor', 'NEW MUSLIM GUIDE', '#F59E0B'),
      embedId: 'dQw4w9WgXcQ',
      description: 'Compassionate guidance for those who recently took their Shahada. How to ease into the prayers, handle family reactions, and build an unbroken connection with Allah.',
      keyTakeaways: [
        'Religion is ease; do not overwhelm yourself on day one.',
        'Focus on learning Al-Fatiha and sincere intention.',
        'Be gentle, kind, and dutiful to your non-Muslim parents.',
      ],
    },
    {
      id: 'v6',
      title: 'El Corán: Mensaje Divino para la Humanidad Entera',
      speaker: 'Dr. Isa García',
      duration: '27:12',
      category: 'Foundations',
      language: 'Spanish',
      thumbnail: createVideoPosterDataUri('El Coran Hoy', 'FUNDAMENTOS · ES', '#38BDF8'),
      embedId: 'dQw4w9WgXcQ',
      description: 'Presentación clara y elocuente sobre el milagro de la revelación coránica, su preservación textual y su guía ética para el mundo contemporáneo.',
      keyTakeaways: [
        'El Corán como guía espiritual práctica para el ser humano.',
        'La justicia social y la hermandad en las enseñanzas del Islam.',
        'Cómo empezar a leer y reflexionar en las escrituras sagradas.',
      ],
    },
  ];

  const filteredVideos = videoFilter === 'all'
    ? videosList
    : videosList.filter(v => v.category === videoFilter || v.language === videoFilter);

  const wuduSteps = [
    {
      title: '1. Intention & Bismillah (النية والتسمية)',
      ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Bismillahir-Rahmanir-Rahim',
      meaning: 'Make the intention in your heart to perform ablution for the sake of Allah, then say "In the name of Allah, the Entirely Merciful, the Especially Merciful".',
      detail: 'Intention is strictly in the heart. Do not say it loudly. Cleanliness is half of faith.',
    },
    {
      title: '2. Washing Hands up to the Wrists (غسل الكفين)',
      ar: 'غَسْلُ الكَفَّيْنِ ثَلاثَ مَرَّاتٍ',
      transliteration: 'Wash both hands 3 times',
      meaning: 'Wash your right hand up to the wrist three times, ensuring water passes between fingers, then repeat for the left hand.',
      detail: 'Make sure fingernails and wrist joints are thoroughly wetted.',
    },
    {
      title: '3. Rinsing the Mouth & Sniffing Water (المضمضة والاستنشاق)',
      ar: 'المَضْمَضَةُ وَالاسْتِنْشَاقُ ثَلاثاً',
      transliteration: 'Madmadah & Istinshaq 3 times',
      meaning: 'Take a handful of water with your right hand into your mouth, swirl it around and spit it out. Then sniff water gently into your nostrils and blow it out with the left hand (3 times).',
      detail: 'Purifies the breath and nasal passages before addressing the Lord of the worlds.',
    },
    {
      title: '4. Washing the Entire Face (غسل الوجه)',
      ar: 'غَسْلُ الوَجْهِ ثَلاثاً',
      transliteration: 'Wash the entire face 3 times',
      meaning: 'Wash your face three times from the hairline on the forehead down to the bottom of the chin, and from ear to ear.',
      detail: 'If you have a beard, run wet fingers gently through it.',
    },
    {
      title: '5. Washing Arms up to the Elbows (غسل اليدين للمرفقين)',
      ar: 'غَسْلُ اليَدَيْنِ إِلَى المِرْفَقَيْنِ',
      transliteration: 'Wash arms including elbows 3 times',
      meaning: 'Wash your right arm from fingertips up to and including the elbow 3 times. Then do the same for the left arm 3 times.',
      detail: 'Always start with the right limb before the left.',
    },
    {
      title: '6. Wiping the Head & Cleaning the Ears (مسح الرأس والأذنين)',
      ar: 'مَسْحُ الرَّأْسِ وَالأُذُنَيْنِ مَرَّةً وَاحِدَةً',
      transliteration: 'Wipe head & ears once',
      meaning: 'Wet your hands and wipe from the front hairline back to the nape of the neck and back to the front once. Then use index fingers to clean inner ears and thumbs for the back of ears.',
      detail: 'This is done once with remaining moisture, no fresh water needed for ears.',
    },
    {
      title: '7. Washing Feet up to the Ankles (غسل الرجلين للكعبين)',
      ar: 'غَسْلُ الرِّجْلَيْنِ مَعَ الكَعْبَيْنِ ثَلاثاً',
      transliteration: 'Wash feet up to ankles 3 times',
      meaning: 'Wash your right foot up to and including the ankle 3 times, passing fingers between toes. Then repeat for the left foot.',
      detail: 'Conclude with the beautiful Prophetic Supplication.',
    },
    {
      title: "Conclusive Du'a (دعاء ما بعد الوضوء)",
      ar: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
      transliteration: "Ash-hadu alla ilaha illallah wahdahu la shareeka lah, wa ash-hadu anna Muhammadan 'abduhu wa rasuluh. Allahumma ij'alni minat-tawwabeen waj'alni minal-mutatahhireen.",
      meaning: 'I bear witness that there is no deity except Allah alone, without partner; and I bear witness that Muhammad is His servant and Messenger. O Allah, make me of those who constantly repent and make me of those who purify themselves.',
      detail: "The Prophet ﷺ taught that whoever says this du'a after wudu, the eight gates of Paradise are opened for him to enter from whichever he wills!",
    },
  ];

  const salahSteps = [
    {
      name: '1. Takbiratul Ihram (Opening Takbir)',
      posture: 'Standing upright (Qiyam) facing the Qiblah',
      ar: 'اللَّهُ أَكْبَرُ',
      transliteration: 'Allahu Akbar',
      meaning: 'Allah is the Greatest',
      notes: 'Raise your hands to earlobes or shoulders, palms forward, and say Allahu Akbar. Place right hand over left over your chest.',
    },
    {
      name: '2. Opening Supplication & Surah Al-Fatiha',
      posture: 'Standing with gaze lowered to place of prostration',
      ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ · الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ · الرَّحْمَٰنِ الرَّحِيمِ · مَالِكِ يَوْمِ الدِّينِ · إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ · اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ · صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      transliteration: "Alhamdu lillahi Rabbil 'Alameen. Ar-Rahmanir-Raheem. Maliki Yawmid-Deen. Iyyaka na'budu wa iyyaka nasta'een. Ihdinas-siratal-mustaqeem. Siratal-ladheena an'amta 'alayhim, ghayril-maghdoobi 'alayhim wa lad-daalleen. Ameen.",
      meaning: '[All] praise is [due] to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path - The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
      notes: "Al-Fatiha is the pillar of prayer; recited in every single Rak'ah. Then recite another short chapter like Surah Al-Ikhlas.",
    },
    {
      name: '3. Ruku (The Bowing)',
      posture: 'Bowing with back flat, hands on knees, head aligned',
      ar: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ (3 مرات)',
      transliteration: "Subhana Rabbiyal-'Azeem (3 times)",
      meaning: 'Glory be to my Lord, the Magnificent (recited 3 times)',
      notes: 'Say "Allahu Akbar" while bowing down. Bow until your back is flat.',
    },
    {
      name: '4. Rising from Bowing',
      posture: 'Standing back upright with hands at sides or on chest',
      ar: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ · رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
      transliteration: "Sami'a Allahu liman hamidah · Rabbana wa lakal-hamd, hamdan katheeran tayyiban mubarakan feeh.",
      meaning: 'Allah hears whoever praises Him. Our Lord, and to You belongs all praise, abundant, good and blessed praise.',
      notes: 'Pause for a moment in complete stillness before going to prostration.',
    },
    {
      name: '5. Sujud (The Prostration)',
      posture: '7 points touching the ground: forehead & nose, both palms, both knees, toes of both feet',
      ar: 'سُبْحَانَ رَبِّيَ الأَعْلَى (3 مرات)',
      transliteration: "Subhana Rabbiyal-A'la (3 times)",
      meaning: 'Glory be to my Lord, the Most High (recited 3 times)',
      notes: "This is the closest a servant ever is to his Creator! Pour out your heart in personal du'a here.",
    },
    {
      name: '6. Jalsah (Sitting between the two prostrations)',
      posture: 'Sitting on left foot, right foot upright, hands on thighs',
      ar: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
      transliteration: 'Rabbigh-fir li, Rabbigh-fir li',
      meaning: 'O my Lord, forgive me. O my Lord, forgive me.',
      notes: 'Pause calmly, then say "Allahu Akbar" and do the second Sujud identical to the first.',
    },
    {
      name: '7. Tashahhud (The Final Testimony)',
      posture: 'Sitting calmly at the conclusion of prayer',
      ar: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu 'alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh. As-salamu 'alayna wa 'ala 'ibadillahis-saliheen. Ash-hadu alla ilaha illallah, wa ash-hadu anna Muhammadan 'abduhu wa rasuluh.",
      meaning: 'All greetings, prayers, and pure things belong to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I testify that none has the right to be worshipped except Allah, and I testify that Muhammad is His slave and Messenger.',
      notes: 'Raise your right index finger gently when uttering the Shahada.',
    },
    {
      name: '8. Taslim (The Concluding Salutation of Peace)',
      posture: 'Turn head right, then left',
      ar: 'السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ (يميناً ويساراً)',
      transliteration: "As-Salamu 'Alaykum wa Rahmatullah (to the right, then to the left)",
      meaning: 'May the peace and mercy of Allah be upon you',
      notes: 'This concludes the prayer with greetings of universal peace to fellow worshippers and recording angels.',
    },
  ];

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
        { title: 'Guide pratique du nouveau musulman', desc: 'Comment débuter la prière, les ablutions et la vie quotidienne.' },
      ],
      whatsappMsg: 'Bonjour, je souhaite poser une question ou en savoir plus sur l’Islam.',
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
        { title: 'Primeros pasos del nuevo creyente', desc: 'Aprender la oración (Salah) y la purificación diaria con tranquilidad.' },
      ],
      whatsappMsg: 'Hola, me gustaría recibir más información o consultar una duda sobre el Islam.',
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
        { title: 'Leitfaden für Neu-Muslime', desc: 'Praktische Einführung in das rituelle Gebet, die Waschung und den Alltag.' },
      ],
      whatsappMsg: 'Hallo, ich interessiere mich für den Islam und hätte gerne weitere Informationen.',
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
        { title: 'Yeni Müslümanlar İçin Rehber', desc: 'Abdest, namaz ve günlük ibadetlerin adım adım öğrenimi.' },
      ],
      whatsappMsg: 'Selamün aleyküm, İslam dini hakkında bilgi ve rehberlik almak istiyorum.',
    },
    id: {
      langName: 'Bahasa Indonesia (Indonesian)',
      welcome: 'Selamat Datang di Jalan Kedamaian Islam',
      intro: "Islam adalah agama fitrah, membawa rahmat bagi seluruh alam semesta (Rahmatan lil 'Alamin), mengajarkan tauhid murni dan akhlak mulia.",
      shahadaAr: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      shahadaPhonetic: 'Asyhadu alla ilaha illallah, wa asyhadu anna Muhammadar Rasulullah.',
      shahadaFr: '« Aku bersaksi bahwa tiada tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah utusan Allah. »',
      keyArticles: [
        { title: 'Mengenal Hakikat Tauhid', desc: 'Memahami keesaan Allah tanpa perantara dan sekutu.' },
        { title: 'Nabi Isa dalam Al-Qur’an', desc: 'Kedudukan mulia Nabi Isa dan Maryam dalam ajaran Islam.' },
        { title: 'Panduan Mualaf Praktis', desc: 'Langkah mudah mempelajari wudhu, sholat 5 waktu, dan doa harian.' },
      ],
      whatsappMsg: 'Halo, saya ingin bertanya dan mempelajari Islam lebih lanjut.',
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
        { title: '新穆斯林实践手册', desc: '简易礼拜、净身清洗与日常生活指南。' },
      ],
      whatsappMsg: '您好，我想了解关于伊斯兰教的信息并寻求答疑。',
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
        { title: "Nabii Isa (Yesu) katika Qur'ani", desc: 'Heshima kubwa aliyopewa Mtume Isa na mamaye Bikira Maryam.' },
        { title: 'Mwongozo wa Muislamu Mpya', desc: 'Jinsi ya kutawadha, kuswali na kuishi maisha yenye amani ya kiroho.' },
      ],
      whatsappMsg: 'Habari, ninapenda kuuliza na kupata maelezo zaidi kuhusu Uislamu.',
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
        { title: 'Пособие для начинающих мусульман', desc: 'Пошаговое обучение омовению, пятикратному намазу и дуа.' },
      ],
      whatsappMsg: 'Здравствуйте! Я хотел бы узнать больше об Исламе и задать вопросы.',
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
        { title: 'نو مسلم کے ابتدائی مراحل', desc: 'وضو، پانچ وقت کی نماز اور عبادات سیکھنے کا آسان طریقہ۔' },
      ],
      whatsappMsg: 'السلام علیکم، میں اسلام کے بارے میں مزید معلومات اور رہنمائی چاہتا ہوں۔',
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
        { title: 'راهنمای عملی برای تازه‌مسلمانان', desc: 'آموزش گام‌به‌گام وضو، نمازهای پنج‌گانه و ادعیه روزمره.' },
      ],
      whatsappMsg: 'سلام و احترام، مایل هستم درباره دین اسلام پرسش و راهنمایی دریافت کنم.',
    },
  };

  const currentDawahLang = multilingualDawahData[selectedDawahLang];
  const cleanWhatsAppNumber = COMPLEX_INFO.phones.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <audio ref={audioRef} preload="none" />

      {/* Sky-Blue 3D Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] border border-[#87CEEB]/55 p-6 sm:p-10 shadow-xl text-white">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold text-[#F7E7B4] flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>بوابة المهتدين الجدد والدعوة العالمية · Global Dawah &amp; Revert Center</span>
            </p>

            <h1 className="text-2xl sm:text-4xl font-amiri font-black text-white leading-tight">
              مرحباً بك في واحة النور · <span className="text-[#F7E7B4] font-sans">Welcome to Islam</span>
            </h1>

            <p className="text-[#D7F1FC] text-sm sm:text-base leading-relaxed">
              منصة عالمية متخصصة ومفتوحة على مدار الساعة للمهتدين الجدد والباحثين عن الحقيقة من شتى بقاع الأرض. نوفر تعليماً ميسراً للعبادات، وبرامج دعوية موثقة باللغات الحية، ومكتبة مرئية ومسموعة، مع رعاية وإخاء مباشر.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShahadaModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] font-black text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>نطق الشهادتين · Declare The Shahada</span>
              </button>

              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello, I am interested in learning more about Islam and connecting with a dawah mentor / السلام عليكم، أود التواصل مع مرشد دعوي للمهتدين الجدد')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm transition-all flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>طلب مرشد دعوي خاص · Request 1-on-1 Mentor</span>
              </a>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <Sky3DIcon slug="newMuslims" tone="turquoise" size="lg" />
          </div>
        </div>
      </section>

      {/* 5-Branch Segmented Navigation Tab Bar */}
      <div className="sky-glass-panel p-1.5 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center min-w-max gap-1.5">
          {[
            { id: 'englishDawah', label: '1. الدعوة بالإنجليزية (English Dawah)', icon: Globe },
            { id: 'otherLanguages', label: '2. اللغات العالمية (Multilingual Dawah)', icon: Layers },
            { id: 'videosLectures', label: '3. الفيديوهات والمحاضرات (Lectures)', icon: Video },
            { id: 'simplifiedFiqh', label: '4. الفقه الميسر والعبادات (Simplified Fiqh)', icon: BookOpen },
            { id: 'dawahRadio', label: '5. الإذاعة الدعوية (Dawah Radio)', icon: Radio },
          ].map((tab) => {
            const IconComp = tab.icon;
            const active = activeBranch === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveBranch(tab.id as DawahBranch)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#12345A] text-[#F7E7B4] shadow-md font-black'
                    : 'text-[#12345A] dark:text-[#EAF8FF] hover:bg-[#87CEEB]/25'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BRANCH 1: ENGLISH DAWAH DEPARTMENT */}
      {activeBranch === 'englishDawah' && (
        <div className="space-y-8">
          <div className="sky-glass-panel rounded-2xl p-5 sm:p-6 space-y-1.5">
            <span className="text-xs text-[#0D7A7A] dark:text-[#5EEAD4] font-bold">
              01 · Core Foundation
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white font-amiri">
              English Dawah Department · Discovering Pure Truth
            </h2>
            <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5]">
              Clear, authentic, and scholarly presentation of Islam designed for the contemporary English-speaking inquirer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                num: '01',
                title: 'Pure Monotheism (Tawheed)',
                desc: 'Islam teaches the absolute oneness and uniqueness of the Creator (Allah). He has no partners, no parents, no offspring, and no human limitations. Worship is directed solely to Him without intermediaries.',
              },
              {
                num: '02',
                title: 'Prophet Muhammad ﷺ',
                desc: 'The final messenger sent as a mercy to all creation. Known even before prophecy as Al-Ameen (the Trustworthy), his character, humility, justice, and compassion transformed human history.',
              },
              {
                num: '03',
                title: 'Jesus (Isa) in Islam',
                desc: 'A revered mighty Messenger born miraculously to the Virgin Mary (Maryam). Muslims honor, love, and revere Jesus as a great prophet who preached pure devotion to God alone.',
              },
              {
                num: '04',
                title: 'The Holy Quran',
                desc: 'The literal, preserved word of Allah revealed verbatim in Arabic over 23 years. Unaltered since its revelation, it challenges reason, uplifts the soul, and provides an infallible moral compass.',
              },
            ].map((card) => (
              <div key={card.num} className="sky-card-3d p-5 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#87CEEB]/50 text-[#12345A] dark:text-[#F7E7B4] flex items-center justify-center font-mono font-black tabular-nums">
                  {card.num}
                </div>
                <h3 className="text-base font-bold text-[#12345A] dark:text-white">{card.title}</h3>
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Interactive FAQs */}
          <div className="sky-card-3d rounded-3xl p-6 space-y-5">
            <div>
              <h3 className="text-lg font-black text-[#12345A] dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#0EA5A4]" />
                <span>Common Questions &amp; Misconceptions Debunked</span>
              </h3>
              <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] mt-1">
                Straightforward scholarly answers to questions most frequently asked by inquirers and new believers.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'Does Islam require me to discard my culture, family, or heritage?',
                  a: 'Absolutely not. Islam is a universal message, not an Arab or Middle Eastern monoculture. Every good custom, language, cuisine, and family tradition that does not directly contradict pure monotheism or harm others is welcomed and celebrated. Respect and kindness to your non-Muslim parents is an explicit religious obligation in the Quran.',
                },
                {
                  q: 'What is the true status of women in Islam?',
                  a: 'Over 1,400 years ago, Islam granted women legal independence, the right to own and dispose of property, divorce, inherit, choose their spouse, and pursue education. In Islam, men and women are spiritual equals in the eyes of Allah: "Whoever does righteousness, whether male or female, while he is believer - We will surely cause him to live a good life" (Quran 16:97).',
                },
                {
                  q: 'How does someone formally become a Muslim?',
                  a: 'Entering Islam requires no complex ritual, no baptism, and no priestly confession. A person simply recites the Shahada (Testimony of Faith) with sincere understanding and heart conviction: bearing witness that there is no god but Allah, and Muhammad is His Messenger.',
                },
                {
                  q: 'What if I find Arabic difficult to pronounce initially?',
                  a: 'Allah looks at your heart and effort. The Prophet ﷺ said: "The one who recites the Quran with difficulty and stumbles will have double the reward." In the beginning, you can pray using simple phrases of remembrance (SubhanAllah, Alhamdulillah, Allahu Akbar) while you gradually learn the verses.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="border border-[#87CEEB]/50 dark:border-[#87CEEB]/25 rounded-xl overflow-hidden bg-white/75 dark:bg-[#0A223D]/70">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left px-4 py-3.5 flex items-center justify-between text-sm font-bold text-[#12345A] dark:text-white hover:bg-[#EAF8FF] dark:hover:bg-[#12345A]/40 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-[#0EA5A4] transition-transform shrink-0 ${openFaq === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 pt-2 text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed border-t border-[#87CEEB]/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Starter Kit CTA */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12345A] to-[#0E3F66] text-white border border-[#87CEEB]/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#5EEAD4]">Free Digital Welcome Kit</span>
              <h4 className="text-lg font-black text-white">Request Your New Muslim Starter Kit &amp; One-on-One Mentor</h4>
              <p className="text-xs text-[#D7F1FC] max-w-xl">
                Get paired with a certified native English-speaking Islamic mentor to answer your personal questions, accompany you through prayer basics, and welcome you into the community.
              </p>
            </div>
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello, I am requesting the New Muslim Starter Kit and a personal mentor.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-black text-sm shrink-0 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <UserCheck className="w-4 h-4" />
              <span>Connect with Mentor</span>
            </a>
          </div>
        </div>
      )}

      {/* BRANCH 2: MULTILINGUAL DAWAH DEPARTMENT */}
      {activeBranch === 'otherLanguages' && (
        <div className="space-y-8">
          <div className="sky-glass-panel rounded-2xl p-5 sm:p-6 space-y-1.5">
            <span className="text-xs text-[#0D7A7A] dark:text-[#5EEAD4] font-bold">
              02 · Global Reach
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white font-amiri">
              قسم الدعوة باللغات العالمية الأخرى · Multilingual Dawah Department
            </h2>
            <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5]">
              Dedicated Dawah materials, testimony guides, and educational pamphlets in 10 major world languages.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(multilingualDawahData) as Array<keyof typeof multilingualDawahData>).map((langKey) => {
              const info = multilingualDawahData[langKey];
              const isSelected = selectedDawahLang === langKey;
              return (
                <button
                  key={langKey}
                  type="button"
                  onClick={() => setSelectedDawahLang(langKey)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#12345A] text-[#F7E7B4] shadow-md font-black'
                      : 'sky-glass-panel text-[#12345A] dark:text-[#EAF8FF] hover:bg-[#87CEEB]/30'
                  }`}
                >
                  {info.langName}
                </button>
              );
            })}
          </div>

          <div className="sky-card-3d rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#87CEEB]/35 pb-5">
              <div>
                <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">
                  Selected Language: {currentDawahLang.langName}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white mt-1">
                  {currentDawahLang.welcome}
                </h3>
              </div>
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(currentDawahLang.whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold transition-all w-fit whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Native Dawah Specialist</span>
              </a>
            </div>

            <p className="text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
              {currentDawahLang.intro}
            </p>

            {/* The Shahada in this Language */}
            <div className="scholarly-reading-paper p-5 rounded-2xl border border-[#D4AF37]/50 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-[#9A7418] dark:text-[#F7E7B4] flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>The Declaration of Faith (Shahada)</span>
                </span>
                <button
                  type="button"
                  onClick={() => speakArabic(currentDawahLang.shahadaAr)}
                  className="px-3 py-1.5 rounded-lg bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{speakingText === currentDawahLang.shahadaAr ? 'جاري النطق...' : 'استمع للنطق بالعربية'}</span>
                </button>
              </div>

              <div className="text-lg sm:text-2xl font-amiri font-black text-[#12345A] dark:text-[#F7E7B4] text-right leading-loose" dir="rtl">
                {currentDawahLang.shahadaAr}
              </div>

              <div className="text-xs sm:text-sm font-mono text-[#0D7A7A] dark:text-[#5EEAD4]">
                {currentDawahLang.shahadaPhonetic}
              </div>

              <div className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] italic border-t border-[#87CEEB]/35 pt-2">
                {currentDawahLang.shahadaFr}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#12345A] dark:text-white">
                Featured Guides &amp; Articles ({currentDawahLang.langName})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentDawahLang.keyArticles.map((art, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#EAF8FF]/80 dark:bg-[#0A223D]/80 border border-[#87CEEB]/45 space-y-2">
                    <span className="text-[11px] text-[#0D7A7A] dark:text-[#5EEAD4] font-bold font-mono tabular-nums">
                      0{idx + 1} · Guide
                    </span>
                    <h5 className="text-sm font-bold text-[#12345A] dark:text-white">{art.title}</h5>
                    <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">{art.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BRANCH 3: VIDEOS & LECTURES LIBRARY */}
      {activeBranch === 'videosLectures' && (
        <div className="space-y-8">
          <div className="sky-glass-panel rounded-2xl p-5 sm:p-6 space-y-1.5">
            <span className="text-xs text-[#0D7A7A] dark:text-[#5EEAD4] font-bold">
              03 · Audio-Visual Learning
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white font-amiri">
              مكتبة الفيديوهات والمحاضرات الدعوية · Videos &amp; Lectures
            </h2>
            <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5]">
              Curated lectures, inspirational revert journeys, and foundational courses by renowned international Islamic scholars.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Lectures (الكل)' },
              { id: 'Foundations', label: 'Foundations of Faith (أصول الإيمان)' },
              { id: 'Revert Stories', label: 'Revert Journeys (قصص المهتدين)' },
              { id: 'New Muslim Guide', label: 'First Steps (خطوات المسلم الجديد)' },
              { id: 'Comparative', label: 'Comparative Religion (مقارنة الأديان)' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setVideoFilter(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  videoFilter === f.id
                    ? 'bg-[#12345A] text-white shadow-sm font-black'
                    : 'sky-glass-panel text-[#12345A] dark:text-[#EAF8FF]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => (
              <article
                key={vid.id}
                className="sky-card-3d rounded-3xl overflow-hidden flex flex-col group"
              >
                <div className="relative aspect-video overflow-hidden bg-[#0A223D]">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#091B33]/35 group-hover:bg-[#091B33]/20 transition-colors flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setActiveVideo(vid)}
                      className="w-12 h-12 rounded-full bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
                      title="Play lecture"
                    >
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[#091B33]/85 text-[11px] font-mono font-bold text-white tabular-nums">
                    {vid.duration}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-[#0D7A7A] dark:text-[#5EEAD4] font-bold">
                      <span>{vid.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{vid.language}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#4A7298] dark:text-[#87CEEB]">{vid.speaker}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#12345A] dark:text-white leading-snug">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveVideo(vid)}
                    className="w-full py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-[#F7E7B4]" />
                    <span>Watch &amp; Read Takeaways</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {activeVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#091B33]/80 backdrop-blur-md p-4">
              <div className="sky-card-3d rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[#87CEEB]/35 pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">
                      {activeVideo.category} · {activeVideo.speaker}
                    </span>
                    <h3 className="text-lg font-black text-[#12345A] dark:text-white">{activeVideo.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveVideo(null)}
                    className="p-2 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] text-[#12345A] dark:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0A223D] border border-[#87CEEB]/40 flex items-center justify-center">
                  <img
                    src={activeVideo.thumbnail}
                    alt={activeVideo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-[#12345A] flex items-center justify-center shadow-2xl">
                      <Play className="w-8 h-8 fill-current translate-x-0.5" />
                    </div>
                    <span className="text-xs text-white font-bold bg-[#091B33]/80 px-3 py-1 rounded-lg tabular-nums">
                      البث الأكاديمي المباشر للمحاضرة · {activeVideo.duration}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <h4 className="font-bold text-[#12345A] dark:text-white mb-1">About this lecture</h4>
                    <p className="text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">{activeVideo.description}</p>
                  </div>

                  <div className="scholarly-reading-paper p-4 rounded-xl space-y-2">
                    <h5 className="font-bold text-[#12345A] dark:text-[#F7E7B4] flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#0EA5A4]" />
                      <span>Key Takeaways for Students &amp; Reverts</span>
                    </h5>
                    <ul className="space-y-1.5 list-disc list-inside text-[#2B547E] dark:text-[#B8DEF5] text-xs">
                      {activeVideo.keyTakeaways.map((point, pIdx) => (
                        <li key={pIdx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveVideo(null)}
                    className="px-5 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BRANCH 4: SIMPLIFIED FIQH & WORSHIP GUIDE */}
      {activeBranch === 'simplifiedFiqh' && (
        <div className="space-y-8">
          <div className="sky-glass-panel rounded-2xl p-5 sm:p-6 space-y-1.5">
            <span className="text-xs text-[#0D7A7A] dark:text-[#5EEAD4] font-bold">
              04 · Practical Worship
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white font-amiri">
              قسم الفقه الميسر لتعليم الصلاة والوضوء والعبادات للمسلمين الجدد
            </h2>
            <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5]">
              Step-by-step visual, audio, and transliterated guides to performing daily ablution (Wudu), the 5 daily prayers (Salah), and worship.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-[#87CEEB]/35 pb-4">
            {[
              { id: 'wudu', label: '1. تعليم الوضوء عملياً (Ablution / Wudu)' },
              { id: 'salah', label: '2. تعليم الصلاة خطوة بخطوة (Daily Prayer / Salah)' },
              { id: 'ghusl', label: '3. الطهارة والغسل (Full Purification / Ghusl)' },
              { id: 'fasting', label: '4. فقه الصيام وأركان الإسلام (Fasting & Pillars)' },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setFiqhTab(sub.id as 'wudu' | 'salah' | 'ghusl' | 'fasting')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  fiqhTab === sub.id
                    ? 'bg-[#12345A] text-[#F7E7B4] font-black shadow-md'
                    : 'sky-glass-panel text-[#12345A] dark:text-[#EAF8FF]'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* SUB-TAB 1: WUDU */}
          {fiqhTab === 'wudu' && (
            <div className="space-y-6">
              <div className="scholarly-reading-paper p-4 rounded-2xl text-xs sm:text-sm">
                <span className="font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">قاعدة نبوية شريفة: </span>
                الطَّهُورُ شَطْرُ الإِيمَانِ (Cleanliness and ritual purity is half of faith). Follow each step below and click audio for Arabic pronunciation.
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                {wuduSteps.map((_, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => setActiveWuduStep(sIdx)}
                    className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer tabular-nums ${
                      activeWuduStep === sIdx
                        ? 'bg-[#12345A] text-[#F7E7B4] border-[#12345A] font-black shadow-sm'
                        : 'sky-glass-panel text-[#12345A] dark:text-[#EAF8FF] border-[#87CEEB]/50'
                    }`}
                  >
                    Step {sIdx + 1}
                  </button>
                ))}
              </div>

              {wuduSteps[activeWuduStep] && (
                <div className="sky-card-3d p-6 sm:p-8 rounded-3xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#87CEEB]/35 pb-4">
                    <div>
                      <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#5EEAD4] tabular-nums">
                        Step {activeWuduStep + 1} of {wuduSteps.length}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-[#12345A] dark:text-white mt-0.5">
                        {wuduSteps[activeWuduStep].title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => speakArabic(wuduSteps[activeWuduStep].ar)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold transition-colors w-fit cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-[#F7E7B4]" />
                      <span>{speakingText === wuduSteps[activeWuduStep].ar ? 'جاري الاستماع...' : 'استمع للنطق بالعربية'}</span>
                    </button>
                  </div>

                  <div className="scholarly-reading-paper p-5 rounded-2xl text-right" dir="rtl">
                    <span className="text-xl sm:text-2xl font-amiri font-black text-[#12345A] dark:text-[#F7E7B4] leading-loose">
                      {wuduSteps[activeWuduStep].ar}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#0D7A7A] dark:text-[#5EEAD4] block mb-1">
                      Pronunciation (Transliteration):
                    </span>
                    <p className="text-sm font-mono text-[#12345A] dark:text-white bg-[#EAF8FF] dark:bg-[#0A223D] p-3 rounded-xl border border-[#87CEEB]/40">
                      {wuduSteps[activeWuduStep].transliteration}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#4A7298] dark:text-[#87CEEB] block mb-1">
                      Meaning &amp; Instructions:
                    </span>
                    <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                      {wuduSteps[activeWuduStep].meaning}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#D4AF37]/40 text-xs text-[#12345A] dark:text-[#F7E7B4]">
                    <span className="font-bold">نصيحة للمتعلم: </span>
                    {wuduSteps[activeWuduStep].detail}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#87CEEB]/35">
                    <button
                      type="button"
                      disabled={activeWuduStep === 0}
                      onClick={() => setActiveWuduStep(prev => Math.max(0, prev - 1))}
                      className="px-4 py-2 rounded-xl sky-glass-panel disabled:opacity-40 text-xs font-bold text-[#12345A] dark:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous Step</span>
                    </button>

                    <button
                      type="button"
                      disabled={activeWuduStep === wuduSteps.length - 1}
                      onClick={() => setActiveWuduStep(prev => Math.min(wuduSteps.length - 1, prev + 1))}
                      className="px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] disabled:opacity-40 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB 2: SALAH */}
          {fiqhTab === 'salah' && (
            <div className="space-y-6">
              <div className="sky-card-3d rounded-3xl p-5 sm:p-6 space-y-4">
                <h3 className="text-base font-bold text-[#12345A] dark:text-white flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#D4AF37]" />
                  <span>The 5 Daily Prayers &amp; Units (Rakat)</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left tabular-nums">
                    <thead className="bg-[#EAF8FF] dark:bg-[#0A223D] text-[#12345A] dark:text-[#87CEEB] font-mono border-b border-[#87CEEB]/40">
                      <tr>
                        <th className="p-3">Prayer Name</th>
                        <th className="p-3">Timing</th>
                        <th className="p-3">Fard (Obligatory Units)</th>
                        <th className="p-3">Sunnah (Recommended)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#87CEEB]/30 text-[#12345A] dark:text-[#EAF8FF]">
                      <tr>
                        <td className="p-3 font-bold">Fajr (الفجر)</td>
                        <td className="p-3 text-[#2B547E] dark:text-[#B8DEF5]">Dawn before sunrise</td>
                        <td className="p-3 font-mono font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">2 Rak'ahs</td>
                        <td className="p-3 text-[#2B547E] dark:text-[#B8DEF5]">2 before Fard</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Dhuhr (الظهر)</td>
                        <td className="p-3 text-[#2B547E] dark:text-[#B8DEF5]">Just after solar noon</td>
                        <td className="p-3 font-mono font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">4 Rak'ahs</td>
                        <td className="p-3 text-[#2B547E] dark:text-[#B8DEF5]">4 before, 2 after</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Asr (العصر)</td>
                        <td className="p-3 text-[#2B547E] dark:text-[#B8DEF5]">Late afternoon</td>
                        <td className="p-3 font-mono font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">4 Rak'ahs</td>
                        <td className="p-3 text-[#2B547E] dark:text-[#B8DEF5]">Optional</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Maghrib (المغرب)</td>
                        <td className="p-3 text-[#2B547E] dark:text-[#B8DEF5]">Just after sunset</td>
                        <td className="p-3 font-mono font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">3 Rak'ahs</td>
                        <td className="p-3 text-[#2B547E] dark:text-[#B8DEF5]">2 after Fard</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Isha (العشاء)</td>
                        <td className="p-3 text-[#2B547E] dark:text-[#B8DEF5]">Nightfall until dawn</td>
                        <td className="p-3 font-mono font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">4 Rak'ahs</td>
                        <td className="p-3 text-[#2B547E] dark:text-[#B8DEF5]">2 after + Witr</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-[#12345A] dark:text-white">
                    Step-by-Step Movements &amp; Words of Prayer
                  </h4>
                  <span className="text-xs text-[#0D7A7A] dark:text-[#5EEAD4] font-bold">
                    Click each movement to learn recitation
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                  {salahSteps.map((step, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSalahStep(idx)}
                      className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer tabular-nums ${
                        activeSalahStep === idx
                          ? 'bg-[#12345A] text-[#F7E7B4] border-[#12345A] font-black shadow-sm'
                          : 'sky-glass-panel text-[#12345A] dark:text-[#EAF8FF] border-[#87CEEB]/50'
                      }`}
                    >
                      {step.name.split('.')[0]}
                    </button>
                  ))}
                </div>

                {salahSteps[activeSalahStep] && (
                  <div className="sky-card-3d p-6 sm:p-8 rounded-3xl space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#87CEEB]/35 pb-4">
                      <div>
                        <span className="text-xs font-bold text-[#0D7A7A] dark:text-[#5EEAD4] tabular-nums">
                          Movement {activeSalahStep + 1} of {salahSteps.length}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-[#12345A] dark:text-white mt-0.5">
                          {salahSteps[activeSalahStep].name}
                        </h3>
                        <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] block mt-1">
                          Posture: {salahSteps[activeSalahStep].posture}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => speakArabic(salahSteps[activeSalahStep].ar)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold transition-colors w-fit cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4 text-[#F7E7B4]" />
                        <span>{speakingText === salahSteps[activeSalahStep].ar ? 'جاري الاستماع...' : 'استمع للفظ العربي'}</span>
                      </button>
                    </div>

                    <div className="scholarly-reading-paper p-5 rounded-2xl text-right" dir="rtl">
                      <span className="text-xl sm:text-2xl font-amiri font-black text-[#12345A] dark:text-[#F7E7B4] leading-loose">
                        {salahSteps[activeSalahStep].ar}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#0D7A7A] dark:text-[#5EEAD4] block mb-1">
                        Transliteration (How to pronounce):
                      </span>
                      <p className="text-xs sm:text-sm font-mono text-[#12345A] dark:text-white bg-[#EAF8FF] dark:bg-[#0A223D] p-3 rounded-xl border border-[#87CEEB]/40">
                        {salahSteps[activeSalahStep].transliteration}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#4A7298] dark:text-[#87CEEB] block mb-1">
                        English Translation:
                      </span>
                      <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                        {salahSteps[activeSalahStep].meaning}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#87CEEB]/50 text-xs text-[#12345A] dark:text-[#EAF8FF]">
                      <span className="font-bold">Instructions &amp; Posture: </span>
                      {salahSteps[activeSalahStep].notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: GHUSL */}
          {fiqhTab === 'ghusl' && (
            <div className="sky-card-3d p-6 sm:p-8 rounded-3xl space-y-5">
              <h3 className="text-lg font-black text-[#12345A] dark:text-white">Full Ritual Bath (Ghusl)</h3>
              <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                Ghusl is required upon embracing Islam, following marital intimacy, nocturnal emission, or after the conclusion of post-natal bleeding / menstruation. It represents total spiritual and physical renewal.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                  {
                    step: '01',
                    title: 'Intention & Wash Impurities',
                    desc: 'Intend purification in your heart, say Bismillah, and wash away any physical impurities with water.',
                  },
                  {
                    step: '02',
                    title: 'Perform Wudu',
                    desc: 'Perform standard ablution just like before prayer, including mouth rinsing and sniffing water.',
                  },
                  {
                    step: '03',
                    title: 'Wash Entire Body',
                    desc: 'Pour water thoroughly over head and entire body, starting from the right side then the left, ensuring water reaches roots of hair.',
                  },
                ].map((item) => (
                  <div key={item.step} className="p-4 rounded-2xl bg-[#EAF8FF]/85 dark:bg-[#0A223D]/85 border border-[#87CEEB]/50 space-y-2">
                    <span className="text-xs font-bold font-mono text-[#0D7A7A] dark:text-[#5EEAD4]">{item.step} · Step</span>
                    <h4 className="text-sm font-bold text-[#12345A] dark:text-white">{item.title}</h4>
                    <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 4: FASTING */}
          {fiqhTab === 'fasting' && (
            <div className="sky-card-3d p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="text-lg font-black text-[#12345A] dark:text-white">Fasting in Ramadan (Sawm)</h3>
              <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
                Fasting the month of Ramadan is the fourth pillar of Islam. Believers abstain from food, drink, and marital relations from dawn (Fajr) until sunset (Maghrib), cultivating self-discipline, gratitude, and empathy with the needy.
              </p>
              <div className="scholarly-reading-paper p-4 rounded-xl text-xs">
                <span className="font-bold text-[#0D7A7A] dark:text-[#5EEAD4]">Advice for New Believers: </span>
                If you embraced Islam recently, approach fasting with balance and joy. If you suffer from illness or difficult physical conditions, Islam provides exemptions and make-up days.
              </div>
            </div>
          )}
        </div>
      )}

      {/* BRANCH 5: MULTILINGUAL DAWAH RADIO STATION */}
      {activeBranch === 'dawahRadio' && (
        <div className="space-y-8">
          <div className="sky-glass-panel rounded-2xl p-5 sm:p-6 space-y-1.5">
            <span className="text-xs text-[#0D7A7A] dark:text-[#5EEAD4] font-bold">
              05 · 24/7 Global Audio Broadcast
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white font-amiri">
              إذاعة البرامج الدعوية العالمية بمختلف اللغات · Multilingual Dawah Radio
            </h2>
            <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5]">
              Live continuous audio broadcast streaming Islamic education, beautiful Quran recitation with translations, and faith-building lectures worldwide.
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#12345A] via-[#0F2747] to-[#0A223D] border border-[#87CEEB]/55 p-6 sm:p-10 shadow-2xl space-y-8 text-white">
            <div className="bg-[#0A223D] rounded-2xl border border-[#87CEEB]/35 p-6 space-y-4 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#87CEEB]/25 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full ${radioPlaying ? 'bg-[#25D366] animate-ping' : 'bg-[#87CEEB]/40'}`} />
                  <div>
                    <span className="text-[11px] font-mono text-[#5EEAD4] tracking-wider uppercase font-bold">
                      {radioPlaying ? 'LIVE ON AIR · البث الحي المباشر' : 'BROADCAST STANDBY'}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {radioChannels[radioChannel].name}
                    </h3>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold text-[#F7E7B4] tabular-nums">
                  {radioChannels[radioChannel].freq}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#87CEEB] uppercase tracking-widest font-bold">Current Program:</span>
                <p className="text-sm sm:text-base font-bold text-[#F7E7B4]">
                  {radioChannels[radioChannel].currentShow}
                </p>
                <span className="text-xs text-[#B8DEF5] block">
                  Presented by: {radioChannels[radioChannel].speaker}
                </span>
              </div>

              <div className="flex items-end gap-1.5 h-12 pt-2">
                {[40, 75, 55, 90, 60, 85, 30, 95, 70, 50, 80, 65, 45, 90, 60, 40, 75, 85, 55, 65].map((val, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t-sm transition-all duration-300 ${
                      radioPlaying
                        ? 'bg-gradient-to-t from-[#0EA5A4] via-[#87CEEB] to-[#F7E7B4]'
                        : 'bg-[#12345A]'
                    }`}
                    style={{
                      height: radioPlaying ? `${Math.max(15, (val * ((idx % 3) + 1)) % 100)}%` : '15%',
                      opacity: radioPlaying ? 0.95 : 0.35,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-[#87CEEB] block">
                Select Language Channel (قنوات اللغات الدعوية):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { id: 'en', label: 'English Stream', title: 'English' },
                  { id: 'fr', label: 'Canal Français', title: 'Français' },
                  { id: 'es', label: 'Canal Español', title: 'Español' },
                  { id: 'tr', label: 'Türkçe Yayın', title: 'Türkçe' },
                  { id: 'sw', label: 'Idhaa ya Kiswahili', title: 'Kiswahili' },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => switchRadioChannel(ch.id as 'en' | 'fr' | 'es' | 'tr' | 'sw')}
                    className={`p-3 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                      radioChannel === ch.id
                        ? 'bg-[#D4AF37] text-[#12345A] border-[#F7E7B4] font-black shadow-lg'
                        : 'bg-[#0A223D] border-[#87CEEB]/35 text-[#EAF8FF] hover:bg-[#12345A]'
                    }`}
                  >
                    <span>{ch.title}</span>
                    <span className="text-[10px] opacity-80">{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-[#87CEEB]/25 pt-6">
              <button
                type="button"
                onClick={toggleRadioPlay}
                className={`px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer ${
                  radioPlaying
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A]'
                }`}
              >
                {radioPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>إيقاف مؤقت · Pause Broadcast</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>تشغيل الإذاعة · Start Listening Live</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 bg-[#0A223D] p-3 rounded-2xl border border-[#87CEEB]/35 w-full sm:w-72 tabular-nums">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 text-[#87CEEB] hover:text-white cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-[#F7E7B4]" />}
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
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />

                <span className="text-[11px] font-mono text-[#EAF8FF] w-9 text-right">
                  {Math.round((isMuted ? 0 : radioVolume) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHAHADA DECLARATION & VIRTUAL CERTIFICATE MODAL */}
      {shahadaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#091B33]/80 backdrop-blur-md p-4">
          <div className="sky-card-3d rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#87CEEB]/35 pb-4">
              <div className="flex items-center gap-2 text-[#12345A] dark:text-[#F7E7B4]">
                <Heart className="w-5 h-5 text-[#0EA5A4] fill-current" />
                <h3 className="text-lg font-black text-[#12345A] dark:text-white">
                  إعلان الشهادتين · The Declaration of Faith
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShahadaModalOpen(false)}
                className="p-2 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] text-[#12345A] dark:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!certificateGenerated ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#87CEEB]/50 text-xs text-[#12345A] dark:text-[#B8DEF5] leading-relaxed">
                  The moment you utter these words with conviction and sincere intention to worship Allah alone and follow His Messenger Muhammad ﷺ, you become a Muslim. All past mistakes are forgiven, and your book is opened pure and white.
                </div>

                <div className="scholarly-reading-paper p-5 rounded-2xl border border-[#D4AF37]/50 text-center space-y-3">
                  <span className="text-xs font-bold text-[#9A7418] dark:text-[#F7E7B4] block">
                    النص العربي بالتشكيل التام:
                  </span>
                  <div className="text-xl sm:text-2xl font-amiri font-black text-[#12345A] dark:text-[#F7E7B4] leading-loose">
                    أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ
                  </div>

                  <div className="text-xs sm:text-sm font-mono text-[#0D7A7A] dark:text-[#5EEAD4]">
                    Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan Rasulullah.
                  </div>

                  <div className="text-xs text-[#2B547E] dark:text-[#B8DEF5] italic pt-1">
                    "I bear witness that there is no god but Allah, and I bear witness that Muhammad is the Messenger of Allah."
                  </div>

                  <button
                    type="button"
                    onClick={() => speakArabic('أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white text-xs font-bold mt-2 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-[#F7E7B4]" />
                    <span>استمع للنطق الصحيح (Audio Guidance)</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#12345A] dark:text-white block">
                    Enter your name to generate your Welcome &amp; Shahada Attestation Certificate:
                  </label>
                  <input
                    type="text"
                    value={revertName}
                    onChange={(e) => setRevertName(e.target.value)}
                    placeholder="Your Full Name (e.g., Sarah Johnson / Adam Miller)"
                    className="w-full bg-white dark:bg-[#0A223D] border border-[#87CEEB]/60 rounded-xl px-4 py-3 text-sm text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4]"
                  />
                  <button
                    type="button"
                    disabled={!revertName.trim()}
                    onClick={() => setCertificateGenerated(true)}
                    className="w-full py-3 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] disabled:opacity-40 text-white font-black text-sm transition-all cursor-pointer"
                  >
                    Confirm &amp; View Welcome Attestation Certificate
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="scholarly-reading-paper p-8 rounded-3xl border-4 border-[#D4AF37]/60 text-center space-y-4 shadow-2xl relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#9A7418] dark:text-[#F7E7B4] mx-auto flex items-center justify-center font-black">
                    <Award className="w-7 h-7" />
                  </div>

                  <span className="text-[11px] font-mono tracking-widest uppercase text-[#0D7A7A] dark:text-[#5EEAD4] font-bold block">
                    مجمع النور الإسلامي العالمي · International Islamic Certificate
                  </span>

                  <h4 className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-white font-amiri">
                    شهادة مباركة دخول في الإسلام · Welcoming Certificate
                  </h4>

                  <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                    This certifies with joy and gratitude to Allah that:
                  </p>

                  <div className="text-xl sm:text-2xl font-black text-[#12345A] dark:text-[#F7E7B4] underline decoration-[#D4AF37]/60 underline-offset-8">
                    {revertName}
                  </div>

                  <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed max-w-md mx-auto">
                    Has declared the blessed Islamic testimony of faith (Shahada), embracing the path of pure monotheism, peace, and brotherhood.
                  </p>

                  <div className="border-t border-[#87CEEB]/35 pt-4 text-[11px] text-[#4A7298] dark:text-[#87CEEB] flex items-center justify-between tabular-nums">
                    <span>Date: {new Date().toLocaleDateString('en-GB')}</span>
                    <span>Al-Noor Global Dawah Council</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl sky-glass-panel text-[#12345A] dark:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Print / Save Certificate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCertificateGenerated(false);
                      setShahadaModalOpen(false);
                    }}
                    className="px-6 py-3 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-black text-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin-managed Dynamic Section Items */}
      <SectionDynamicItems sectionSlug="newMuslims" />
    </div>
  );
};
