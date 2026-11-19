import React, { useState } from 'react';
import {
  Sparkles, Globe, Copy, Check, Send,
  BookOpen, ShieldCheck, Award
} from 'lucide-react';
import { NavigationPage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Sky3DIcon } from '../Sky3DIcon';
import { SectionDynamicItems } from '../SectionDynamicItems';

interface DawahTopic {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  contentByLang: Record<string, { title: string; content: string; quranVerse: string; quranRef: string }>;
}

const DAWAH_TOPICS: DawahTopic[] = [
  {
    id: 'what-is-islam',
    titleAr: 'ما هو الإسلام؟ (دعوة السلام والتوحيد)',
    titleEn: 'What is Islam? (The Path of Peace & Monotheism)',
    summaryAr: 'بيان رسالة الإسلام الخالدة القائمة على إفراد الخالق بالعبادة، والرحمة بالخلق، ونبذ الظلم.',
    contentByLang: {
      en: {
        title: 'Islam: The Pure Path of Peace & Monotheism',
        content: 'Islam is not a new religion, but the universal message of all Prophets: to worship One God (Allah) without partners, and to live with justice, compassion, and moral integrity. The word Islam itself is derived from peace and surrender to the Creator.',
        quranVerse: '«And We have not sent you, [O Muhammad], except as a mercy to the worlds.»',
        quranRef: 'Surah Al-Anbiya [21:107]'
      },
      fr: {
        title: 'L\'Islam : La Voie de la Paix et du Monothéisme Pur',
        content: 'L\'Islam est le message universel de tous les Prophètes : adorer le Créateur Unique sans associés, et agir avec bonté, justice et paix envers l\'humanité entière.',
        quranVerse: '« Et Nous ne t\'avons envoyé qu\'en miséricorde pour l\'univers. »',
        quranRef: 'Sourate Al-Anbiya [21:107]'
      },
      es: {
        title: 'El Islam: El Camino de la Paz y la Unidad',
        content: 'El Islam es el mensaje universal de devoción al Dios Único, promoviendo la misericordia, la hermandad humana y la justicia en todos los aspectos de la vida.',
        quranVerse: '« Y no te hemos enviado sino como misericordia para todos los mundos. »',
        quranRef: 'Corán [21:107]'
      },
      de: {
        title: 'Der Islam: Der Weg des Friedens und des reinen Monotheismus',
        content: 'Der Islam ist die universelle Botschaft aller Propheten: den Einen Schöpfer anzubeten und in Gerechtigkeit und Mitgefühl mit allen Mitmenschen zu leben.',
        quranVerse: '« Und Wir haben dich nur als Barmherzigkeit für die Weltenbewohner gesandt. »',
        quranRef: 'Sure Al-Anbiya [21:107]'
      },
      ru: {
        title: 'Ислам: Путь мира и чистого единобожия',
        content: 'Ислам — это вечное послание поклонения Единому Создателю без сотоварищей, призывающее к справедливости, милосердию и нравственному достоинству.',
        quranVerse: '«Мы отправили тебя только в качестве милости к мирам.»',
        quranRef: 'Сура Аль-Анбия [21:107]'
      },
      zh: {
        title: '伊斯兰教：和平与纯正独一神论之道',
        content: '伊斯兰教是全人类先知的永恒启示：顺从独一的造物主，以慈悯、公义和良善对待一切众生。',
        quranVerse: '“我派遣你，只为慈悯全世界的人。”',
        quranRef: '古兰经 [21:107]'
      },
      id: {
        title: 'Islam: Jalan Kedamaian dan Tauhid Murni',
        content: 'Islam adalah risalah universal yang mengajarkan penghambaan hanya kepada Allah yang Maha Esa, serta menyebarkan kasih sayang bagi seluruh alam.',
        quranVerse: '«Dan Kami tidak mengutus engkau (Muhammad) melainkan untuk (menjadi) rahmat bagi semesta alam.»',
        quranRef: 'Surah Al-Anbiya [21:107]'
      },
      tr: {
        title: 'İslam: Barış ve Katıksız Tevhid Yolu',
        content: 'İslam, bütün peygamberlerin ortak çağrısıdır: Yalnızca tek bir Yaratıcıya kulluk etmek, adaleti gözetmek ve tüm insanlığa merhametle yaklaşmak.',
        quranVerse: '«Biz seni ancak âlemlere bir rahmet olarak gönderdik.»',
        quranRef: 'Enbiya Suresi [21:107]'
      }
    }
  },
  {
    id: 'the-holy-quran',
    titleAr: 'القرآن الكريم: كلام الله المحفوظ للعالمين',
    titleEn: 'The Noble Quran: God\'s Preserved Word',
    summaryAr: 'التعريف بإعجاز القرآن الكريم، وخلوه من التحريف، وكونه دليلاً هادياً للعقل والروح.',
    contentByLang: {
      en: {
        title: 'The Noble Quran: The Preserved Light of Truth',
        content: 'The Quran is the literal Word of God revealed to Prophet Muhammad ﷺ through Angel Gabriel. Preserved in its original Arabic text letter-for-letter for over 1,400 years, it speaks directly to human intellect, heart, and soul.',
        quranVerse: '«Indeed, this Quran guides to that which is most suitable and gives good tidings to the believers.»',
        quranRef: 'Surah Al-Isra [17:9]'
      },
      fr: {
        title: 'Le Noble Coran : La Parole Préservée du Créateur',
        content: 'Le Coran est la Parole littérale de Dieu, préservée dans sa langue arabe originelle depuis plus de 14 siècles, guidant l\'intellect et apaisant les cœurs.',
        quranVerse: '« Certes, ce Coran guide vers ce qu\'il y a de plus droit. »',
        quranRef: 'Sourate Al-Isra [17:9]'
      },
      es: {
        title: 'El Noble Corán: La Palabra Divina Inalterada',
        content: 'El Corán es la Palabra revelada de Dios que guía al ser humano hacia la verdad más sublime, con armonía entre fe y razón.',
        quranVerse: '«Ciertamente este Corán guía hacia lo que es más recto.»',
        quranRef: 'Corán [17:9]'
      },
      de: {
        title: 'Der Edle Koran: Das unverfälschte Wort Gottes',
        content: 'Der Koran ist die wörtliche Offenbarung Gottes, die seit über 1400 Jahren unverändert bewahrt ist und die vollkommenste Lebensführung lehrt.',
        quranVerse: '«Gewiss, dieser Koran leitet zu dem, was richtiger ist.»',
        quranRef: 'Sure Al-Isra [17:9]'
      },
      ru: {
        title: 'Священный Коран: Неизменное Слово Создателя',
        content: 'Коран — это прямое Слово Всевышнего, сохраненное в первозданном виде на протяжении веков как вечное руководство для разума.',
        quranVerse: '«Поистине, этот Коран указывает на самый правильный путь.»',
        quranRef: 'Сура Аль-Исра [17:9]'
      },
      zh: {
        title: '尊贵的《古兰经》：造物主永恒不变的启示',
        content: '《古兰经》是真主降示给人世间的最后天经，千百年来逐字逐句未受篡改，照亮人类的心灵与理智。',
        quranVerse: '“这部《古兰经》必引导人于最崇高的正道。”',
        quranRef: '古兰经 [17:9]'
      },
      id: {
        title: 'Al-Qur\'an Al-Karim: Kalamullah yang Terjaga',
        content: 'Al-Qur\'an adalah wahyu Allah yang diturunkan kepada Nabi Muhammad ﷺ, terpelihara keasliannya dan menjadi pedoman hidup yang lurus.',
        quranVerse: '«Sungguh, Al-Qur\'an ini memberi petunjuk ke (jalan) yang paling lurus.»',
        quranRef: 'Surah Al-Isra [17:9]'
      },
      tr: {
        title: 'Yüce Kur\'an: İlahi Rehber ve Değişmez Kelam',
        content: 'Kur\'an-ı Kerim, Yüce Allah\'ın insanlığa son mesajıdır; aklı aydınlatır, gönüllere şifa ve huzur verir.',
        quranVerse: '«Şüphesiz ki bu Kur\'an en doğru yola iletir.»',
        quranRef: 'İsra Suresi [17:9]'
      }
    }
  },
  {
    id: 'jesus-in-islam',
    titleAr: 'المسيح عيسى ابن مريم في الإسلام (نبي الرحمة والكلمة)',
    titleEn: 'Jesus in Islam (A Revered Prophet of God)',
    summaryAr: 'بيان المكانة الرفيعة للمسيح عيسى وأمه البتول مريم عليهما السلام في القرآن الكريم.',
    contentByLang: {
      en: {
        title: 'Jesus in Islam: A Honored Prophet & Messenger',
        content: 'In Islam, Jesus (Isa) is one of the greatest messengers of God, born miraculously to the Virgin Mary (Maryam) without a father. Muslims deeply love and revere Jesus as a righteous prophet who performed miracles by God\'s leave and preached pure monotheism.',
        quranVerse: '«[Jesus] said, "Indeed, I am the servant of Allah. He has given me the Scripture and made me a prophet."»',
        quranRef: 'Surah Maryam [19:30]'
      },
      fr: {
        title: 'Jésus en Islam : Un Prophète Vénéré et Aimé',
        content: 'Pour les musulmans, Jésus (Îsâ) est un noble messager né miraculeusement de la Vierge Marie. Il a enseigné l\'amour, la dévotion au Créateur et la charité.',
        quranVerse: '« Il dit : "Je suis vraiment le serviteur d\'Allah. Il m\'a donné le Livre et m\'a désigné Prophète." »',
        quranRef: 'Sourate Maryam [19:30]'
      },
      es: {
        title: 'Jesús en el Islam: Un Profeta Venerado',
        content: 'El Islam honra a Jesús como un noble mensajero de Dios, nacido milagrosamente de la Virgen María, anunciando la misericordia divina.',
        quranVerse: '«Dijo [Jesús]: "Soy el siervo de Dios. Él me ha concedido el Libro y me ha hecho profeta."»',
        quranRef: 'Corán [19:30]'
      },
      de: {
        title: 'Jesus im Islam: Ein verehrter Gesandter Gottes',
        content: 'Muslime lieben und ehren Jesus als großen Propheten Gottes, geboren von der reinen Jungfrau Maria, der den Menschen Liebe und Gottesfurcht brachte.',
        quranVerse: '«Er [Jesus] sagte: "Gewiss, ich bin der Diener Allahs. Er hat mir die Schrift gegeben und mich zu einem Propheten gemacht."»',
        quranRef: 'Sure Maryam [19:30]'
      },
      ru: {
        title: 'Иисус в Исламе: Благородный Пророк Всевышнего',
        content: 'В Исламе Иисус (Иса) — великий пророк, рожденный девой Марией (Марьям), несший свет веры и призывавший к поклонению Единому Богу.',
        quranVerse: '«Он сказал: "Воистину, я — раб Аллаха. Он даровал мне Писание и сделал меня пророком."»',
        quranRef: 'Сура Марьям [19:30]'
      },
      zh: {
        title: '伊斯兰教中的尔萨（耶稣）：受人崇敬的先知',
        content: '在伊斯兰教中，尔萨（耶稣）是由贞女麦尔彦（玛利亚）奇迹般诞生的伟大先知，向世人宣扬仁爱与独一真主的信仰。',
        quranVerse: '“他说：‘我确是真主的仆人，他赏赐我经典，并命我为先知。’”',
        quranRef: '古兰经 [19:30]'
      },
      id: {
        title: 'Nabi Isa dalam Islam: Rasul yang Dimuliakan',
        content: 'Umat Islam mengimani Nabi Isa sebagai salah satu rasul utama yang terlahir secara mukjizat dari Maryam, mengajarkan kasih dan tauhid.',
        quranVerse: '«Dia (Isa) berkata, "Sesungguhnya aku hamba Allah, Dia memberiku Kitab dan Dia menjadikan aku seorang nabi."»',
        quranRef: 'Surah Maryam [19:30]'
      },
      tr: {
        title: 'İslam\'da Hz. İsa: Yüce Bir Peygamber',
        content: 'İslam inancında Hz. İsa, Meryem validemizden mucizevi bir şekilde doğan, tevhidi ve merhameti tebliğ eden şerefli bir peygamberdir.',
        quranVerse: '«O: "Ben, şüphesiz Allah\'ın kuluyum. O bana Kitab\'ı verdi ve beni peygamber yaptı." dedi.»',
        quranRef: 'Meryem Suresi [19:30]'
      }
    }
  }
];

const WORLD_LANG_OPTIONS = [
  { code: 'en', nameNative: 'English', nameAr: 'الإنجليزية', flag: '🇬🇧' },
  { code: 'fr', nameNative: 'Français', nameAr: 'الفرنسية', flag: '🇫🇷' },
  { code: 'es', nameNative: 'Español', nameAr: 'الإسبانية', flag: '🇪🇸' },
  { code: 'de', nameNative: 'Deutsch', nameAr: 'الألمانية', flag: '🇩🇪' },
  { code: 'ru', nameNative: 'Русский', nameAr: 'الروسية', flag: '🇷🇺' },
  { code: 'zh', nameNative: '中文', nameAr: 'الصينية', flag: '🇨🇳' },
  { code: 'id', nameNative: 'Bahasa Indonesia', nameAr: 'الإندونيسية', flag: '🇮🇩' },
  { code: 'tr', nameNative: 'Türkçe', nameAr: 'التركية', flag: '🇹🇷' }
];

interface NoorAmbassadorPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const NoorAmbassadorPage: React.FC<NoorAmbassadorPageProps> = ({ onNavigate }) => {
  const { isRtl } = useLanguage();

  const [selectedTopic, setSelectedTopic] = useState<DawahTopic>(DAWAH_TOPICS[0]);
  const [selectedLangCode, setSelectedLangCode] = useState<string>('en');
  const [ambassadorName, setAmbassadorName] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [certificateIssued, setCertificateIssued] = useState<boolean>(false);

  const currentContent = selectedTopic.contentByLang[selectedLangCode] || selectedTopic.contentByLang['en'];
  const currentLang = WORLD_LANG_OPTIONS.find(l => l.code === selectedLangCode) || WORLD_LANG_OPTIONS[0];

  const shareText = `🌟 *Message of Light & Peace from Noor Global Complex* 🌟\n\n` +
    `*${currentContent.title}*\n\n` +
    `${currentContent.content}\n\n` +
    `📖 *${currentContent.quranVerse}* (${currentContent.quranRef})\n\n` +
    `🌐 Read more & explore verified Islamic wisdom: https://www.mojamaalnor.com\n` +
    (ambassadorName ? `Shared by Noor Ambassador: ${ambassadorName}` : '');

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Sky-Blue 3D Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-12 shadow-xl border border-[#87CEEB]/55 bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0EA5A4] text-white">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Sky3DIcon slug="noorAmbassador" tone="gold" size="md" />
            <p className="text-xs font-bold text-[#87CEEB] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F7E7B4]" />
              <span>برنامج سفير النور · Noor Global Ambassador</span>
            </p>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-amiri text-white leading-tight">
            كُن سفيراً للنور وانشر رسالة الهداية بلغات العالم
          </h1>

          <p className="text-xs sm:text-sm text-[#D7F1FC] leading-relaxed">
            قال رسول الله ﷺ: «بَلِّغُوا عَنِّي وَلَوْ آيَةً». يتيح لك هذا القسم إنشاء بطاقات دعوية رقمية موثقة بلغات عالمية ومشاركتها بضغطة زر مع أصدقائك وزملائك حول العالم لدعوتهم بالحكمة والموعظة الحسنة.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('card-builder');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] font-black text-xs sm:text-sm transition shadow-md cursor-pointer"
            >
              ابدأ بإنشاء بطاقة دعوية الآن
            </button>
            <button
              type="button"
              onClick={() => onNavigate('discoverIslam')}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-[#87CEEB]/50 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#87CEEB]" />
              <span>استكشف بوابة اسأل عن الإسلام</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Interactive Card Builder */}
      <section id="card-builder" className="sky-card-3d rounded-3xl p-6 sm:p-10 space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#87CEEB]/40 dark:border-[#87CEEB]/20 pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-amiri text-[#12345A] dark:text-white">
              لوحة تخصيص البطاقة الدعوية العالمية
            </h2>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
              اختر موضوع الرسالة واللغة المستهدفة ثم شارك البطاقة مباشرة
            </p>
          </div>

          {/* Ambassador Name Input */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#12345A] dark:text-[#EAF8FF] font-bold whitespace-nowrap">اسم السفير:</label>
            <input
              type="text"
              value={ambassadorName}
              onChange={(e) => setAmbassadorName(e.target.value)}
              placeholder="اكتب اسمك ليظهر على البطاقة..."
              className="px-3.5 py-2 rounded-xl bg-[#EAF8FF]/85 dark:bg-[#0F2747] border border-[#87CEEB]/60 dark:border-[#87CEEB]/25 text-xs text-[#12345A] dark:text-white focus:outline-none focus:border-[#0EA5A4] w-56"
            />
          </div>
        </div>

        {/* Step 1: Select Topic */}
        <div className="space-y-3">
          <label className="text-xs font-black text-[#12345A] dark:text-[#87CEEB] flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#0EA5A4]" />
            <span>1. اختر موضوع الرسالة الدعوية:</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DAWAH_TOPICS.map((topic) => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 rounded-2xl transition border flex flex-col justify-between gap-2 text-start cursor-pointer ${
                    isSelected
                      ? 'bg-[#12345A] text-white border-[#D4AF37] shadow-lg'
                      : 'bg-[#EAF8FF]/80 dark:bg-[#0F2747] border-[#87CEEB]/50 dark:border-[#87CEEB]/25 text-[#12345A] dark:text-white hover:border-[#0EA5A4]'
                  }`}
                >
                  <h3 className="text-xs font-black">{topic.titleAr}</h3>
                  <span className={`text-[10px] ${isSelected ? 'text-[#87CEEB]' : 'text-[#4A7298] dark:text-[#B8DEF5]'}`}>
                    {topic.titleEn}
                  </span>
                  <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-[#D7F1FC]' : 'text-[#2B547E] dark:text-[#B8DEF5]'}`}>
                    {topic.summaryAr}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Language */}
        <div className="space-y-3">
          <label className="text-xs font-black text-[#12345A] dark:text-[#87CEEB] flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#0EA5A4]" />
            <span>2. اختر لغة المخاطب:</span>
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {WORLD_LANG_OPTIONS.map((l) => {
              const isSelected = selectedLangCode === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setSelectedLangCode(l.code)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#12345A] text-white border-[#12345A] dark:bg-[#0EA5A4] shadow-md'
                      : 'bg-[#EAF8FF] dark:bg-[#0F2747] text-[#12345A] dark:text-[#B8DEF5] border-[#87CEEB]/50'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.nameNative}</span>
                  <span className="text-[10px] opacity-75">({l.nameAr})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Presentation Card Preview */}
        <div className="space-y-3 pt-4 border-t border-[#87CEEB]/40 dark:border-[#87CEEB]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0EA5A4]" />
              <span>معاينة البطاقة الدعوية الموثقة:</span>
            </span>
            <span className="text-[11px] text-[#0D7A7A] dark:text-[#87CEEB] font-mono font-bold">
              اللغة: {currentLang.nameNative} · {currentLang.flag}
            </span>
          </div>

          {/* The High-End Digital Card */}
          <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#12345A] via-[#0E3F66] to-[#0A223D] border-2 border-[#D4AF37]/65 shadow-xl text-white space-y-6 overflow-hidden">
            <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] text-[#12345A] flex items-center justify-center font-black font-cinzel">
                  NG
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono tracking-widest text-[#F7E7B4] uppercase">
                    NOOR GLOBAL – A WORLD OF LIGHT
                  </h4>
                  <span className="text-[10px] text-[#87CEEB]">
                    مجمع النور الإسلامي العالمي · International Islamic Message
                  </span>
                </div>
              </div>

              {ambassadorName && (
                <div className="text-right">
                  <span className="text-[10px] text-[#F7E7B4] font-bold block">سفير النور المعتمد</span>
                  <span className="text-xs font-bold text-white">{ambassadorName}</span>
                </div>
              )}
            </div>

            {/* Card Content in Selected World Language */}
            <div className="relative z-10 space-y-4" dir="ltr">
              <h3 className="text-2xl sm:text-3xl font-black font-cinzel text-[#F7E7B4] leading-tight">
                {currentContent.title}
              </h3>

              <p className="text-sm sm:text-base text-[#EAF8FF] leading-relaxed font-sans">
                {currentContent.content}
              </p>

              {/* Quran Verse Quote Callout (clean rounded border) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0A223D]/80 border border-[#D4AF37]/50 text-white space-y-1 shadow-inner">
                <p className="italic text-base sm:text-lg font-serif">
                  {currentContent.quranVerse}
                </p>
                <span className="text-xs font-bold text-[#F7E7B4] block">
                  — The Holy Quran, {currentContent.quranRef}
                </span>
              </div>
            </div>

            {/* Footer of Card */}
            <div className="relative z-10 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#BCE7FB]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#F7E7B4]" />
                <span>Learn more at: <strong className="text-white">https://www.mojamaalnor.com</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#5EEAD4]" />
                <span>Verified Scholarly Content · Al-Noor Global Complex</span>
              </div>
            </div>
          </div>

          {/* Action Sharing Buttons */}
          <div className="flex items-center gap-3 pt-4 flex-wrap">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-[#091B33] font-black text-xs flex items-center gap-2 transition shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>مشاركة فورية عبر واتساب</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-3 rounded-xl bg-[#12345A] hover:bg-[#0EA5A4] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#5EEAD4]" /> : <Copy className="w-4 h-4 text-[#F7E7B4]" />}
              <span>{copied ? 'تم نسخ النص الكامل!' : 'نسخ نص الرسالة'}</span>
            </button>

            <button
              type="button"
              onClick={() => setCertificateIssued(true)}
              className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F7E7B4] text-[#12345A] font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Award className="w-4 h-4" />
              <span>إصدار شهادة سفير النور الفخرية</span>
            </button>
          </div>
        </div>

        {/* Certificate Modal */}
        {certificateIssued && (
          <div className="p-6 rounded-2xl bg-[#EAF8FF] dark:bg-[#0F2747] border border-[#D4AF37] space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-[#D4AF37]" />
                <h4 className="text-base font-black font-amiri text-[#12345A] dark:text-white">
                  شهادة شرفية: سفير النور لنشر رسالة الإسلام
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setCertificateIssued(false)}
                className="text-xs text-[#4A7298] hover:text-[#12345A] dark:text-[#B8DEF5] cursor-pointer font-bold"
              >
                ✕ إغلاق
              </button>
            </div>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
              تقديراً لمشاركتك المباركة في إيصال هداية القرآن الكريم ورحمة الإسلام للعالم، يمنحك مجمع النور الإسلامي العالمي هذه الوثيقة الفخرية كسفير للنور. بارك الله في جهودك وجعلها في ميزان حسناتك.
            </p>
          </div>
        )}

      </section>

      {/* Ambassador Global Charter */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="sky-card-3d p-6 rounded-3xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F7E7B4] to-[#D4AF37] text-[#12345A] flex items-center justify-center font-black">
            1
          </div>
          <h4 className="text-sm font-black text-[#12345A] dark:text-white">الحكمة والموعظة الحسنة</h4>
          <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            الالتزام بالأسلوب القرآني الكريم في الخطاب بالحلم والرفق، وعرض محاسن الإسلام وجماله للعالمين.
          </p>
        </div>

        <div className="sky-card-3d p-6 rounded-3xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#0284C7] text-white flex items-center justify-center font-black">
            2
          </div>
          <h4 className="text-sm font-black text-[#12345A] dark:text-white">التوثيق العلمي الأصيل</h4>
          <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            جميع المواد والترجمات معتمدة رسمياً ومراجعة من كبار علماء مجمع النور ومجمع المدينة المنورة.
          </p>
        </div>

        <div className="sky-card-3d p-6 rounded-3xl space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5EEAD4] to-[#0EA5A4] text-[#12345A] flex items-center justify-center font-black">
            3
          </div>
          <h4 className="text-sm font-black text-[#12345A] dark:text-white">الأثر المستدام حول العالم</h4>
          <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
            كل بطاقة تشاركها قد تكون سبباً في هداية قلب وإزالة شبهة وإيصال نور الحق لمن يبحث عنه.
          </p>
        </div>
      </section>

      <SectionDynamicItems sectionSlug="noorAmbassador" />

    </div>
  );
};
