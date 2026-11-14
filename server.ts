import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { 
  gatewayManager, 
  apiCache, 
  sendApiResponse, 
  sendApiError 
} from './server/api/gatewayCore.js';
import { 
  getPrayerTimesForCity, 
  getHijriCalendarData, 
  SUPPORTED_CITIES 
} from './server/api/prayerEngine.js';
import { paymentAdapter } from './server/api/paymentAdapter.js';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserByUid, getUserEnrollments, getUserOrphanSponsorships } from './src/db/users.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Global Gateway Telemetry & Latency Middleware
app.use((req: Request, res: Response, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const latency = Date.now() - start;
    if (req.path.startsWith('/api/')) {
      gatewayManager.recordRequest(req.method, req.path, res.statusCode, latency, req);
    }
  });
  next();
});

// Initialize Gemini Client with Server-Side Guarded Key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build-alnoor',
    },
  },
});

// =========================================================================
// API GATEWAY INFRASTRUCTURE & TELEMETRY ROUTES (v1)
// =========================================================================

// GET /api/v1/health - Live health status of all interconnected services
app.get('/api/v1/health', (_req: Request, res: Response) => {
  const healthMatrix = gatewayManager.getHealthMatrix();
  return sendApiResponse(res, {
    status: 'operational',
    services: healthMatrix,
    nodeEnvironment: process.env.NODE_ENV || 'development',
    serverUptimeSeconds: Math.floor(process.uptime()),
  });
});

// GET /api/v1/telemetry - Real-time gateway metrics
app.get('/api/v1/telemetry', (_req: Request, res: Response) => {
  const metrics = gatewayManager.getTelemetry();
  const recentLogs = gatewayManager.getLogs().slice(0, 20);
  return sendApiResponse(res, {
    metrics,
    recentLogs,
  });
});

// GET /api/v1/keys - List API keys (with secret masked)
app.get('/api/v1/keys', (_req: Request, res: Response) => {
  const keys = gatewayManager.getApiKeys();
  return sendApiResponse(res, keys);
});

// POST /api/v1/keys - Generate a new scoped API key for Web, Android, iOS, or Partners
app.post('/api/v1/keys', (req: Request, res: Response) => {
  const { name, platform = 'web', scopes = ['quran:read', 'prayer:read'] } = req.body;
  if (!name || typeof name !== 'string') {
    return sendApiError(res, 400, 'INVALID_NAME', 'اسم مفتاح API مطلوب');
  }
  const newKey = gatewayManager.createApiKey(name, platform, scopes);
  return sendApiResponse(res, newKey);
});

// POST /api/v1/keys/:id/revoke - Revoke an API key
app.post('/api/v1/keys/:id/revoke', (req: Request, res: Response) => {
  const { id } = req.params;
  const revoked = gatewayManager.revokeApiKey(id);
  if (!revoked) {
    return sendApiError(res, 404, 'KEY_NOT_FOUND', 'لم يتم العثور على مفتاح API بهذا المعرف');
  }
  return sendApiResponse(res, { message: 'تم إبطال مفتاح API بنجاح', keyId: id });
});

// =========================================================================
// CLOUD SQL POSTGRESQL & FIREBASE AUTH SYNC (v1)
// =========================================================================

// POST /api/v1/auth/sync - Sync Firebase Auth user profile to Cloud SQL
app.post('/api/v1/auth/sync', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.uid) {
      return sendApiError(res, 401, 'UNAUTHORIZED', 'مستخدم غير موثق');
    }
    const { displayName, photoUrl, preferredLanguage } = req.body || {};
    const syncedUser = await getOrCreateUser({
      uid: req.user.uid,
      email: req.user.email || `${req.user.uid}@alnoor.internal`,
      displayName: displayName || (req.user as any).name || null,
      photoUrl: photoUrl || (req.user as any).picture || null,
      preferredLanguage: preferredLanguage || 'ar',
    });
    return sendApiResponse(res, syncedUser);
  } catch (error: any) {
    console.error('Failed to sync user with Cloud SQL:', error);
    return sendApiError(res, 500, 'DB_ERROR', error.message || 'فشل مزامنة المستخدم مع قاعدة البيانات');
  }
});

// GET /api/v1/user/profile - Fetch user profile and enrollments from Cloud SQL
app.get('/api/v1/user/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.uid) {
      return sendApiError(res, 401, 'UNAUTHORIZED', 'مستخدم غير موثق');
    }
    let user = await getUserByUid(req.user.uid);
    if (!user) {
      user = await getOrCreateUser({
        uid: req.user.uid,
        email: req.user.email || `${req.user.uid}@alnoor.internal`,
        displayName: (req.user as any).name || null,
        photoUrl: (req.user as any).picture || null,
      });
    }
    const [enrollments, orphanSponsorships] = await Promise.all([
      getUserEnrollments(user.id),
      getUserOrphanSponsorships(user.id),
    ]);
    return sendApiResponse(res, { user, enrollments, orphanSponsorships });
  } catch (error: any) {
    console.error('Failed to fetch user profile:', error);
    return sendApiError(res, 500, 'DB_ERROR', error.message || 'فشل جلب بيانات المستخدم');
  }
});

// =========================================================================
// PRAYER TIMES & HIJRI CALENDAR API (v1)
// =========================================================================

// GET /api/v1/prayer/times - Astronomical prayer times
app.get('/api/v1/prayer/times', (req: Request, res: Response) => {
  const city = (req.query.city as string) || 'makkah';
  const cacheKey = `prayer_${city.toLowerCase()}`;
  
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return sendApiResponse(res, cached, { cached: true, provider: 'Al-Noor Cache' });
  }

  const times = getPrayerTimesForCity(city);
  apiCache.set(cacheKey, times, 600); // 10 minutes cache
  return sendApiResponse(res, times, { cached: false, provider: times.method });
});

// GET /api/v1/prayer/hijri - Current Hijri date with sacred month status
app.get('/api/v1/prayer/hijri', (_req: Request, res: Response) => {
  const hijri = getHijriCalendarData();
  return sendApiResponse(res, hijri, { provider: 'Umm Al-Qura Astronomical System' });
});

// GET /api/v1/prayer/cities - List supported cities
app.get('/api/v1/prayer/cities', (_req: Request, res: Response) => {
  const cities = Object.entries(SUPPORTED_CITIES).map(([key, c]) => ({
    key,
    nameAr: c.cityAr,
    nameEn: c.cityEn,
    countryAr: c.countryAr,
    countryEn: c.countryEn,
    timezone: c.timezone,
  }));
  return sendApiResponse(res, cities);
});

// =========================================================================
// QURAN & TAFSIR API (v1)
// =========================================================================

// GET /api/v1/quran/surahs - Canonical Index of Surahs
app.get('/api/v1/quran/surahs', (_req: Request, res: Response) => {
  const cached = apiCache.get('quran_surahs_index');
  if (cached) {
    return sendApiResponse(res, cached, { cached: true });
  }

  const surahs = [
    { number: 1, name: 'سورة الفاتحة', englishName: 'Al-Fatihah', numberOfAyahs: 7, revelationType: 'مكية' },
    { number: 2, name: 'سورة البقرة', englishName: 'Al-Baqarah', numberOfAyahs: 286, revelationType: 'مدنية' },
    { number: 3, name: 'سورة آل عمران', englishName: 'Ali \'Imran', numberOfAyahs: 200, revelationType: 'مدنية' },
    { number: 18, name: 'سورة الكهف', englishName: 'Al-Kahf', numberOfAyahs: 110, revelationType: 'مكية' },
    { number: 36, name: 'سورة يس', englishName: 'Ya-Sin', numberOfAyahs: 83, revelationType: 'مكية' },
    { number: 55, name: 'سورة الرحمن', englishName: 'Ar-Rahman', numberOfAyahs: 78, revelationType: 'مدنية' },
    { number: 67, name: 'سورة الملك', englishName: 'Al-Mulk', numberOfAyahs: 30, revelationType: 'مكية' },
    { number: 112, name: 'سورة الإخلاص', englishName: 'Al-Ikhlas', numberOfAyahs: 4, revelationType: 'مكية' },
    { number: 113, name: 'سورة الفلق', englishName: 'Al-Falaq', numberOfAyahs: 5, revelationType: 'مكية' },
    { number: 114, name: 'سورة الناس', englishName: 'An-Nas', numberOfAyahs: 6, revelationType: 'مكية' },
  ];

  apiCache.set('quran_surahs_index', surahs, 3600);
  return sendApiResponse(res, surahs, { provider: 'King Fahd Glorious Quran Complex' });
});

// GET /api/v1/quran/translations - Verified World Language Translation Authorities
app.get('/api/v1/quran/translations', (_req: Request, res: Response) => {
  const authorities = [
    { code: 'ar', name: 'النص الأصلي بالرسم العثماني مع التفسير الميسر', authority: 'مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة' },
    { code: 'en', name: 'Saheeh International English Translation', authority: 'Verified King Fahd Glorious Quran Printing Complex' },
    { code: 'fr', name: 'Traduction française Hamidullah révisée', authority: 'Complexe du Roi Fahd (Madinah)' },
    { code: 'es', name: 'Traducción al Español por Dr. Muhammad Isa García', authority: 'Complejo del Rey Fahd' },
    { code: 'de', name: 'Deutsche Übersetzung von Bubenheim & Elyas', authority: 'König-Fahd-Komplex zum Druck des Edlen Korans' },
    { code: 'tr', name: 'Diyanet İşleri Başkanlığı Türkçe Meali', authority: 'Kral Fahd ve Diyanet' },
    { code: 'id', name: 'Al-Qur\'an Terjemahan Kemenag RI', authority: 'Kementerian Agama Republik Indonesia' },
    { code: 'ur', name: 'اردو مستند ترجمہ مولانا جالندھری', authority: 'مجمع الملک فہد مدینہ منورہ' },
  ];
  return sendApiResponse(res, authorities);
});

// =========================================================================
// ISLAMIC SCHOLARLY AI & RESEARCH API (v1)
// =========================================================================

// POST /api/v1/ai/scholar - Guardrailed Academic AI Research Assistant
app.post('/api/v1/ai/scholar', async (req: Request, res: Response) => {
  try {
    const { question, field = 'علوم القرآن والتفسير' } = req.body;

    if (!question || typeof question !== 'string') {
      return sendApiError(res, 400, 'QUESTION_REQUIRED', 'السؤال أو موضوع البحث الشرعي مطلوب');
    }

    const systemPrompt = `أنت المساعد المعرفي الأكاديمي الموثق لبوابة "مجمع النور الإسلامي العالمي الشامل".
شعار المجمع الرسمي: "نورٌ يهدي.. وصرحٌ يبني أجيال القرآن".
الضوابط الشرعية والأكاديمية الإلزامية:
1. التزم بالوسطية والتيسير والأدب الإسلامي الرفيع ومنهج أهل السنة والجماعة المعتمد.
2. وثق الإجابة بنصوص القرآن الكريم (مع ذكر السورة ورقم الآية) والأحاديث النبوية الشريفة (مع ذكر المخرج كالبخاري أو مسلم).
3. لا تصدر فتاوى فردية قاطعة في النوازل المعقدة والخصومات القضائية أو مسائل الطلاق والنزاعات المالية الخاصة؛ ونبه المستخدم بلطف لمراجعة المجالس الإفتائية الرسمية وهيئة كبار العلماء بالمجمع.
4. نسق الإجابة بأسلوب أكاديمي منظم:
   - الخلاصة العلمية
   - الأدلة من الكتاب والسنة وأقوال أئمة الهدى
   - لطائف تربوية وفوائد لطلاب العلم`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `الحقل الشرعي: ${field}\nالمسألة أو البحث: ${question}`,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const answer = response.text || 'لم يتم العثور على إجابة، يرجى المحاولة بصياغة أخرى.';
    return sendApiResponse(res, {
      field,
      question,
      answer,
      guardrailNotice: 'أداة بحثية وتعليمية معتمدة، ولا تغني عن الرجوع للمجالس الإفتائية الرسمية في النوازل القضائية الفردية.',
    }, { provider: 'Google Gemini 3.8 Flash + Al-Noor Scholarly Grounding' });
  } catch (error: any) {
    console.error('Error in AI scholar query:', error);
    return sendApiError(res, 500, 'AI_QUERY_ERROR', error.message || 'حدث خطأ أثناء معالجة الاستفسار العلمي');
  }
});

// POST /api/v1/ai/sudanese-script - Generate custom energetic Sudanese male voice ad scripts
app.post('/api/v1/ai/sudanese-script', async (req: Request, res: Response) => {
  try {
    const { topic = 'التسجيل في مقرأة مجمع النور وحفظ القرآن', targetAudience = 'الشباب وعامة الناس' } = req.body;
    const prompt = `أنت كاتب إعلانات إذاعية محترف وخبير في اللهجة العامية السودانية الأصيلة.
المطلوب كتابة نص إعلاني إذاعي تجاري حماسي ناري، بصوت رجل سوداني جهوري فخم، لصالح:
"مجمع النور الإسلامي العالمي الشامل".
الموضوع: ${topic}
الفئة المستهدفة: ${targetAudience}
الضوابط:
1. استخدم مفردات سودانية محببة وأصيلة (يا هلا والله وحبابكم عشرة، يا زول يا أصيل، أبشروا بالخير، صحي النوم وشد حيلك، هسع دي، وليداتك).
2. اجعل النبرة حماسية جداً، مفعمة بالطاقة والنخوة والمروءة والمحبة الإيمانية.
3. مدة الإلقاء التقديرية بين 40 إلى 50 ثانية.
4. اذكر شعار المجمع: "نورٌ يهدي، وعلمٌ يبني".
5. نسق النص بعناية وضع تعليمات الأداء الصوتي بين قوسين [مثال: بنبرة جهورية عالية].`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const script = response.text || 'يا هلا والله وحبابكم في مجمع النور الإسلامي العالمي!';
    return sendApiResponse(res, {
      topic,
      targetAudience,
      script,
      maleVoiceSettings: {
        pitch: 0.85,
        rate: 1.12,
        recommendedDialect: 'ar-SA / Sudanese Timbre'
      }
    }, { provider: 'Gemini 3.8 Flash + Sudanese Voice Engine' });
  } catch (error: any) {
    console.warn('Gemini script generation busy, using resilient dynamic Sudanese template:', error?.message);
    const { topic = 'التسجيل في مقرأة مجمع النور وحفظ القرآن', targetAudience = 'الشباب وعامة الناس' } = req.body || {};
    const fallbackScript = `يا هلا والله وحبابكم عشرة بلا كشرة يا أهلنا وعشيرتنا وسندنا في كل مكان!
يا زول يا أصيل.. يا باغي الخير والرفعة.. شنو البمنعك تبادر هسع وتشارك في: "${topic}"؟!
صحي النوم وشد حيلك.. مجمع النور الإسلامي العالمي فتح ليك الدرب على مصراعيه لوجه الله الكريم!
مقرأة عالمية شغالة 24 ساعة، وإذاعة حية بتنقل ليك أذان وتلاوات الحرم المكي الشريف مباشرة في كفك لحظة بلحظة!
أبشروا بالخير والبركة يا أهل النخوة والشهامة.. النور نوركم، والدار داركم!
يلا هسع دي.. اتوكل على الحي القيوم وبادر بالانضمام وما تفوت الأجر العظيم!
مجمع النور الإسلامي العالمي.. نورٌ يهدي، وعلمٌ يبني، وأثرٌ خالد إلى يوم الدين!`;

    return sendApiResponse(res, {
      topic,
      targetAudience,
      script: fallbackScript,
      maleVoiceSettings: {
        pitch: 0.85,
        rate: 1.12,
        recommendedDialect: 'ar-SA / Sudanese Timbre'
      }
    }, { provider: 'Al-Noor Dynamic Sudanese Script Engine (Resilient Mode)' });
  }
});

// POST /api/v1/ai/sudanese-voice - Synthesize enthusiastic Sudanese male commercial voice
app.post('/api/v1/ai/sudanese-voice', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Fenrir' } = req.body;
    if (!text || typeof text !== 'string') {
      return sendApiError(res, 400, 'TEXT_REQUIRED', 'النص الإعلاني مطلوب لتوليد الصوت');
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 600),
              speechMetadata: {
                style: 'Enthusiastic, energetic and authoritative Sudanese Arabic male commercial announcer with resonant broadcast warmth and charisma',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Fenrir' },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return sendApiError(res, 500, 'TTS_EMPTY', 'لم يتم استرجاع بيانات الصوت من المحرك');
    }

    return sendApiResponse(res, {
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      voiceName,
      dialect: 'Sudanese Arabic (Masculine Commercial)',
    }, { provider: 'Google Gemini 3.8 Flash-Lite TTS (Fenrir Deep Male)' });
  } catch (error: any) {
    console.error('TTS generation error:', error);
    return sendApiError(res, 500, 'TTS_ERROR', error.message || 'حدث خطأ أثناء توليد الصوت بالذكاء الاصطناعي');
  }
});

// Alias for advertising voiceover generation: POST /api/v1/voice/generate-ad
app.post('/api/v1/voice/generate-ad', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Fenrir', style } = req.body;
    if (!text || typeof text !== 'string') {
      return sendApiError(res, 400, 'TEXT_REQUIRED', 'النص الإعلاني مطلوب');
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 700),
              speechMetadata: {
                style: style || 'Enthusiastic, energetic, and authoritative masculine Sudanese Arabic radio commercial announcer with warm resonant timbre and vibrant charismatic delivery',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Fenrir' },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return sendApiError(res, 500, 'TTS_EMPTY', 'لم يتم استلام ملف الصوت من المحرك');
    }

    return sendApiResponse(res, {
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      voiceName,
      dialect: 'Sudanese Arabic Male High Energy',
    }, { provider: 'Gemini 3.8 Flash-Lite TTS' });
  } catch (error: any) {
    console.error('Voice generate error:', error);
    return sendApiError(res, 500, 'TTS_ERROR', error.message || 'حدث خطأ أثناء توليد الصوت الإعلاني');
  }
});

// Video Series & Playlists API (v1)
const serverVideoSeries: any[] = [
  {
    id: 'deedat-debates-master',
    titleAr: 'سلسلة مناظرات الشيخ أحمد ديدات الكبرى',
    totalEpisodes: 24,
    scholarName: 'الشيخ أحمد ديدات',
    category: 'comparative_religion'
  },
  {
    id: 'zakir-quran-modern-science',
    titleAr: 'سلسلة القرآن والعلم الحديث',
    totalEpisodes: 30,
    scholarName: 'الدكتور ذاكر نايك',
    category: 'quran_science'
  }
];

app.get('/api/v1/videos/series', (_req: Request, res: Response) => {
  return sendApiResponse(res, serverVideoSeries);
});

app.post('/api/v1/videos/batch', (req: Request, res: Response) => {
  const { series, videos } = req.body;
  if (series) {
    serverVideoSeries.push(series);
  }
  return sendApiResponse(res, {
    success: true,
    addedVideosCount: Array.isArray(videos) ? videos.length : 0,
    totalSeriesCount: serverVideoSeries.length,
    message: 'تمت الفهرسة بنجاح في مجمع النور'
  });
});

// =========================================================================
// ORPHANS CARE & SPONSORSHIP API (v1)
// =========================================================================

const orphansApplicationsList: any[] = [
  {
    id: 'APP-9901',
    trackingNumber: 'ALNOOR-ORPHAN-841920',
    applicantName: 'آمنة عبد الله البشير',
    relation: 'أم اليتيم',
    phone: '+249912169169',
    nationalId: '1092837465',
    address: 'الخرطوم بحري - الحلفايا',
    assistanceType: 'full_sponsorship',
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
  }
];

// POST /api/v1/orphans/register - Submit new orphan registration
app.post('/api/v1/orphans/register', (req: Request, res: Response) => {
  const data = req.body;
  if (!data.applicantName || !data.orphanName || !data.phone) {
    return sendApiError(res, 400, 'MISSING_FIELDS', 'بيانات مقدم الطلب واسم اليتيم ورقم الهاتف مطلوبة');
  }

  const trackingNumber = data.trackingNumber || `ALNOOR-ORPHAN-${Math.floor(100000 + Math.random() * 900000)}`;
  const record = {
    ...data,
    id: `APP-${Date.now().toString().slice(-6)}`,
    trackingNumber,
    status: 'in_review',
    fieldNotes: 'تم استلام الطلب إلكترونياً، وجاري الفحص الأولي للوثائق.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orphansApplicationsList.unshift(record);
  return sendApiResponse(res, record, { provider: 'Al-Noor Orphans Welfare Board' });
});

// GET /api/v1/orphans/track/:id - Track orphan application by trackingNumber or phone
app.get('/api/v1/orphans/track/:id', (req: Request, res: Response) => {
  const query = req.params.id.trim().toUpperCase();
  const found = orphansApplicationsList.find(
    (a) => a.trackingNumber.toUpperCase() === query || a.phone.includes(query) || a.nationalId === query
  );

  if (!found) {
    return sendApiError(res, 404, 'NOT_FOUND', 'لم يتم العثور على طلب بهذا الرقم المرجعي أو الهاتف');
  }
  return sendApiResponse(res, found);
});

// GET /api/v1/orphans/applications - List all applications for admin
app.get('/api/v1/orphans/applications', (_req: Request, res: Response) => {
  return sendApiResponse(res, orphansApplicationsList);
});

// POST /api/v1/orphans/applications/:id/status - Update application status
app.post('/api/v1/orphans/applications/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const appIndex = orphansApplicationsList.findIndex((a) => a.id === id || a.trackingNumber === id);

  if (appIndex === -1) {
    return sendApiError(res, 404, 'NOT_FOUND', 'الطلب غير موجود');
  }

  orphansApplicationsList[appIndex].status = status || orphansApplicationsList[appIndex].status;
  if (notes) orphansApplicationsList[appIndex].fieldNotes = notes;
  orphansApplicationsList[appIndex].updatedAt = new Date().toISOString();

  return sendApiResponse(res, orphansApplicationsList[appIndex]);
});

// =========================================================================
// WAQF & CHARITY DONATION GATEWAY API (v1)
// =========================================================================

// POST /api/v1/donations/intent - Create abstracted donation intent
app.post('/api/v1/donations/intent', (req: Request, res: Response) => {
  const { projectId, amount, currency = 'USD', donorName, isAnonymous, paymentMethod = 'card' } = req.body;

  if (!amount || Number(amount) <= 0) {
    return sendApiError(res, 400, 'INVALID_AMOUNT', 'مبلغ السهم الوقفي يجب أن يكون أكبر من صفر');
  }

  const idempotencyKey = req.headers['idempotency-key'] as string | undefined;

  const intent = paymentAdapter.createDonationIntent({
    projectId: projectId || 'waqf-general',
    amount: Number(amount),
    currency,
    donorName,
    isAnonymous: Boolean(isAnonymous),
    paymentMethod,
  }, idempotencyKey);

  return sendApiResponse(res, intent, { provider: 'Al-Noor Unified Waqf Gateway' });
});

// POST /api/v1/donations/verify - Confirm and issue digital Waqf receipt
app.post('/api/v1/donations/verify', (req: Request, res: Response) => {
  const { intentId } = req.body;
  if (!intentId) {
    return sendApiError(res, 400, 'INTENT_ID_REQUIRED', 'معرف المعاملة مطلوب للتحقق');
  }

  const result = paymentAdapter.verifyPayment(intentId);
  if (!result.verified) {
    return sendApiError(res, 400, 'VERIFICATION_FAILED', result.error || 'تعذر التحقق من المعاملة الوقفية');
  }

  return sendApiResponse(res, result.receipt, { provider: 'Islamic Waqf Certificate Authority' });
});

// =========================================================================
// MOBILE APPS CONFIGURATION & MANIFEST API (Android & iOS)
// =========================================================================

// GET /api/v1/mobile/config - Dynamic configuration for Android and iOS apps
app.get('/api/v1/mobile/config', (_req: Request, res: Response) => {
  return sendApiResponse(res, {
    appName: 'مجمع النور الإسلامي العالمي',
    bundleId: 'org.alnoor.islamic.complex',
    supportedPlatforms: ['android', 'ios'],
    minSupportedVersion: {
      android: '8.0 (API Level 26)',
      ios: 'iOS 15.0',
    },
    currentAppVersion: '2.4.0',
    features: {
      offlineQuranText: true,
      audioStreamingMakkah: true,
      prayerTimesWidget: true,
      qiblaCompassSensor: true,
      aiScholarAssistant: true,
      pushAdhanNotifications: true,
    },
    endpoints: {
      base: '/api/v1',
      prayer: '/api/v1/prayer/times',
      quran: '/api/v1/quran/surahs',
      aiScholar: '/api/v1/ai/scholar',
      donations: '/api/v1/donations/intent',
    },
  });
});

// =========================================================================
// GLOBAL DAWAH INQUIRIES & COUNSELOR DISPATCH (WhyIslam / IslamHouse Pattern)
// =========================================================================

const dawahInquiriesList: any[] = [
  {
    id: 'INQ-8801',
    trackingCode: 'ALNOOR-DAWAH-104928',
    inquiryType: 'free_quran',
    fullName: 'David M. Miller',
    email: 'david.m@example.com',
    phone: '+14155552671',
    country: 'United States',
    preferredLanguage: 'en',
    message: 'I would like to receive an authentic English translation of the Holy Quran to study monotheism and Jesus in Islam.',
    status: 'assigned',
    assignedMentor: 'Sheikh Dr. Bilal Al-Amri',
    createdAt: '2025-02-14T11:00:00Z',
  },
  {
    id: 'INQ-8802',
    trackingCode: 'ALNOOR-DAWAH-104929',
    inquiryType: 'question',
    fullName: 'Marc Dupont',
    email: 'm.dupont@example.fr',
    phone: '+33612345678',
    country: 'France',
    preferredLanguage: 'fr',
    message: 'Quelle est la vision de l’Islam sur la fraternité humaine et la science moderne ?',
    status: 'in_dialogue',
    assignedMentor: 'Ustadh Tariq Al-Maghribi',
    createdAt: '2025-02-15T09:30:00Z',
  }
];

// POST /api/v1/dawah/inquire - Submit question or request copy of Quran
app.post('/api/v1/dawah/inquire', (req: Request, res: Response) => {
  const { inquiryType = 'question', fullName, email, phone, country, preferredLanguage = 'en', message } = req.body;
  if (!fullName || !email || !message) {
    return sendApiError(res, 400, 'MISSING_FIELDS', 'الاسم، البريد الإلكتروني، والرسالة مطلوبة لإتمام الاستفسار');
  }

  const trackingCode = `ALNOOR-DAWAH-${Math.floor(100000 + Math.random() * 900000)}`;
  const record = {
    id: `INQ-${Date.now().toString().slice(-6)}`,
    trackingCode,
    inquiryType,
    fullName: String(fullName).trim(),
    email: String(email).trim().toLowerCase(),
    phone: phone ? String(phone).trim() : null,
    country: country || 'Global',
    preferredLanguage,
    message: String(message).trim(),
    status: 'pending',
    assignedMentor: 'لجنة الدعوة العالمية بمجمع النور',
    createdAt: new Date().toISOString(),
  };

  dawahInquiriesList.unshift(record);
  return sendApiResponse(res, record, { provider: 'Al-Noor Global Dawah Bureau' });
});

// GET /api/v1/dawah/inquiries - List inquiries for admin/counselors
app.get('/api/v1/dawah/inquiries', (_req: Request, res: Response) => {
  return sendApiResponse(res, dawahInquiriesList);
});

// =========================================================================
// NEW MUSLIMS EDUCATION ROADMAP (SeekersGuidance / WhyIslam Model)
// =========================================================================

const newMuslimCurriculum = [
  {
    step: 1,
    id: 'shahada',
    titleAr: 'شهادة التوحيد والإيمان الصافي',
    titleEn: 'The Shahadah: Pure Monotheism',
    descAr: 'معنى لا إله إلا الله محمد رسول الله، وأركان الإيمان الستة بدون تعقيد.',
    descEn: 'The declaration of faith: There is no deity but Allah and Muhammad is His messenger.',
    keyVerses: ['سورة الإخلاص (112:1-4)', 'سورة البقرة (2:255)'],
    completionRequirement: 'نطق الشهادتين واستيقان القلب'
  },
  {
    step: 2,
    id: 'wudu',
    titleAr: 'الطهارة والوضوء خطوة بخطوة',
    titleEn: 'Purification & Ablution (Wudu)',
    descAr: 'خطوات الوضوء المصورة، شروط صحته، ونواقضه بطريقة عملية ميسرة.',
    descEn: 'Step-by-step physical and spiritual purification before communion with the Creator.',
    keyVerses: ['سورة المائدة (5:6)'],
    completionRequirement: 'إتقان فرائض وسنن الوضوء'
  },
  {
    step: 3,
    id: 'salah',
    titleAr: 'إقامة الصلاة المفروضة والأذكار',
    titleEn: 'The Daily Prayers (Salah)',
    descAr: 'أوقات الصلوات الخمس، اتجاه القبلة، الحركات والأقوال مع النطق الصوتي.',
    descEn: 'The five daily prayers, body postures, recitation with transliteration and translation.',
    keyVerses: ['سورة طه (20:14)', 'سورة العنكبوت (29:45)'],
    completionRequirement: 'أداء صلاة الفجر والظهر والعصر والمغرب والعشاء'
  },
  {
    step: 4,
    id: 'quran_basics',
    titleAr: 'حفظ سورة الفاتحة وقصار السور',
    titleEn: 'Surah Al-Fatihah & Short Surahs',
    descAr: 'حفظ أم الكتاب وسور الإخلاص والفلق والناس بالترديد الصوتي والتجويد.',
    descEn: 'Memorizing the Opening Chapter and the protective surahs with correct pronunciation.',
    keyVerses: ['سورة الفاتحة', 'المعوذتان'],
    completionRequirement: 'تلاوة سورة الفاتحة غيباً في الصلاة'
  }
];

// GET /api/v1/new-muslims/curriculum - Foundation curriculum for reverts
app.get('/api/v1/new-muslims/curriculum', (_req: Request, res: Response) => {
  return sendApiResponse(res, newMuslimCurriculum, { provider: 'Al-Noor Reverts Support Board' });
});

// =========================================================================
// ACADEMY QUIZZES & VERIFIABLE CERTIFICATE REGISTRY
// =========================================================================

const certificatesRegistry: Record<string, any> = {
  'ALNOOR-CERT-904128': {
    certificateCode: 'ALNOOR-CERT-904128',
    recipientName: 'عبد الرحمن بن عبد الله',
    courseTitle: 'إتقان رواية حفص عن عاصم من طريق الشاطبية',
    track: 'القرآن والقراءات',
    grade: 'امتياز مع مرتبة الشرف (98%)',
    examinerName: 'فضيلة الشيخ الدكتور عثمان بن سالم',
    issuedAt: '2025-01-20T10:00:00Z',
    verified: true
  },
  'ALNOOR-CERT-904129': {
    certificateCode: 'ALNOOR-CERT-904129',
    recipientName: 'Michael John (Ibrahim)',
    courseTitle: 'Islamic Fundamentals for New Reverts',
    track: 'الدعوة والمهتدين',
    grade: 'Distinction (95%)',
    examinerName: 'Sheikh Bilal Al-Amri',
    issuedAt: '2025-02-01T12:00:00Z',
    verified: true
  }
};

// POST /api/v1/academy/quizzes/submit - Submit quiz and issue verifiable certificate
app.post('/api/v1/academy/quizzes/submit', (req: Request, res: Response) => {
  const { courseId, quizId, recipientName, scorePercentage, track = 'العلوم الشرعية' } = req.body;
  if (!recipientName || scorePercentage === undefined) {
    return sendApiError(res, 400, 'MISSING_DATA', 'اسم الطالب والنتيجة مطلوبان لتقييم الاختبار');
  }

  const percentage = Number(scorePercentage);
  const passed = percentage >= 75;

  let certRecord = null;
  if (passed) {
    const certificateCode = `ALNOOR-CERT-${Math.floor(100000 + Math.random() * 900000)}`;
    certRecord = {
      certificateCode,
      recipientName: String(recipientName).trim(),
      courseTitle: courseId || 'الدورة التأصيلية في علوم الوحيين',
      track,
      grade: percentage >= 90 ? 'ممتاز مرتفع' : 'جيد جداً',
      scorePercentage: percentage,
      examinerName: 'هيئة كبار المشايخ والمقرئين بمجمع النور',
      issuedAt: new Date().toISOString(),
      verified: true,
    };
    certificatesRegistry[certificateCode] = certRecord;
  }

  return sendApiResponse(res, {
    passed,
    scorePercentage: percentage,
    certificate: certRecord,
    feedback: passed
      ? 'مبارك النجاح الباهر! تم منحك الشهادة الأكاديمية الرسمية المعتمدة برقم تحقق فريد.'
      : 'أحسنت المحاولة! يرجى مراجعة محاور الدرس وإعادة الاختبار لتحقيق نسبة الإتقان المطلوبة (75%+).'
  });
});

// GET /api/v1/academy/certificates/verify/:code - Public Verification endpoint
app.get('/api/v1/academy/certificates/verify/:code', (req: Request, res: Response) => {
  const code = req.params.code.trim().toUpperCase();
  const cert = certificatesRegistry[code];
  if (!cert) {
    return sendApiError(res, 404, 'CERT_NOT_FOUND', 'لم يتم العثور على شهادة بهذا الرمز، يرجى التحقق من صحة الإدخال');
  }
  return sendApiResponse(res, cert, { provider: 'Al-Noor Academic Verification Authority' });
});

// =========================================================================
// UNIFIED MULTI-INDEX GLOBAL SEARCH ENGINE (Quran.com + IslamHouse standard)
// =========================================================================

app.get('/api/v1/search/unified', (req: Request, res: Response) => {
  const q = ((req.query.q as string) || '').trim().toLowerCase();
  const cat = ((req.query.category as string) || 'all').toLowerCase();

  if (!q) {
    return sendApiResponse(res, { query: '', totalCount: 0, results: [] });
  }

  const indexItems = [
    // Quran
    { type: 'quran', title: 'سورة الفاتحة (أم الكتاب)', desc: 'فاتحة الكتاب العظيم وركن الصلاة، بالرسم العثماني والصوت والترجمة', page: 'quran', tag: 'المصحف الشريف' },
    { type: 'quran', title: 'سورة البقرة (سنم القرآن)', desc: 'أطول سور القرآن، تتضمن آية الكرسي وأحكام الشريعة', page: 'quran', tag: 'المصحف الشريف' },
    { type: 'quran', title: 'ترجمات معاني القرآن بـ 76 لغة', desc: 'تصفح القرآن بالإنجليزية والفرنسية والإسبانية والأردية والسواحلية', page: 'translationsReader', tag: 'ترجمات عالمية' },
    // Hadith
    { type: 'hadith', title: 'صحيح الإمام البخاري', desc: 'أصح كتاب بعد كتاب الله، مرتباً حسب الكتب والأبواب الفقهية', page: 'hadith', tag: 'السنة النبوية' },
    { type: 'hadith', title: 'صحيح الإمام مسلم', desc: 'جامع أحاديث المصطفى ﷺ مع تخريج الأسانيد ودقة الروايات', page: 'hadith', tag: 'السنة النبوية' },
    // Dawah
    { type: 'dawah', title: 'أرشيف ومناظرات الشيخ أحمد ديدات', desc: 'المناظرات الكبرى، القرآن معجزة المعجزات، وحوار الأديان', page: 'dawahLibrary', tag: 'المكتبة الدعوية' },
    { type: 'dawah', title: 'محاضرات الدكتور ذاكر نايك', desc: 'القرآن والعلم الحديث، إجابات على أسئلة المشككين لغير المسلمين', page: 'dawahLibrary', tag: 'المكتبة الدعوية' },
    { type: 'dawah', title: 'سفير النور العالمي', desc: 'بطاقات دعوية عالمية بلغات متعددة جاهزة للنشر والتوزيع', page: 'noorAmbassador', tag: 'دعوة بلغات العالم' },
    { type: 'dawah', title: 'اسأل عن الإسلام وحوار غير المسلمين', desc: 'أجوبة موثقة على أكثر من 50 سؤالاً شائعاً عن الإسلام والنبوة', page: 'discoverIslam', tag: 'مركز الدعوة' },
    // Orphans & Waqf
    { type: 'orphans', title: 'كفالة الأيتام والرعاية الشاملة', desc: 'كفالة 1,280 يتيماً ودعم الأسر، بنك الخرطوم 1727654 باسم الشيخ الهادي سالم', page: 'orphansCare', tag: 'العمل الخيري' },
    { type: 'waqf', title: 'السهم الوقفي والصدقة الجارية', desc: 'المساهمة في استدامة مقارئ القرآن وطباعة المصاحف', page: 'waqf', tag: 'الوقف الإسلامي' },
    // Radio & Studio
    { type: 'radio', title: 'إذاعة القرآن الكريم مباشر من مكة المكرمة', desc: 'بث حي متواصل 24 ساعة لأذان وتكبيرات وتلاوات الحرم المكي الشريف', page: 'radio', tag: 'بث مباشر 24/7' },
    { type: 'audio', title: 'استوديو الصوت الإعلاني الحماسي 🇸🇩', desc: 'إعلانات دعوية إذاعية حماسية بصوت رجل سوداني جهوري فخم', page: 'audioStudio', tag: 'صوتيات' },
    // Academy & AI
    { type: 'academy', title: 'أكاديمية النور ومقارئ القرآن المسندة', desc: 'دورات التجويد، الفقه المؤصل، واختبارات الحصول على الإجازات والشهادات', page: 'academy', tag: 'التعليم الأكاديمي' },
    { type: 'ai', title: 'المساعد المعرفي الإسلامي الذكي', desc: 'بحث وتوثيق شرعي بالآيات والأحاديث المعتمدة وضوابط الفتوى', page: 'aiScholar', tag: 'ذكاء اصطناعي' },
  ];

  const matched = indexItems.filter(item => {
    const matchCat = cat === 'all' || item.type === cat;
    const matchQuery = item.title.toLowerCase().includes(q) || 
                       item.desc.toLowerCase().includes(q) || 
                       item.tag.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  return sendApiResponse(res, {
    query: q,
    category: cat,
    totalCount: matched.length,
    results: matched,
  });
});

// =========================================================================
// BACKWARDS-COMPATIBILITY ADAPTERS FOR EXISTING APPLET FEATURES
// =========================================================================

app.post('/api/scholar/query', async (req: Request, res: Response) => {
  try {
    const { question, field = 'علوم القرآن' } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'السؤال أو موضوع البحث مطلوب' });
    }

    const systemPrompt = `أنت المساعد العلمي الأكاديمي لبوابة "مجمع النور الإسلامي العالمي الخيري الشامل لتحفيظ القرآن الكريم والعلوم الإسلامية".
شعار المجمع: "نورٌ يهدي.. وصرحٌ يبني أجيال القرآن".
مهمتك: تقديم إجابات علمية رصينة، موثقة بالآيات الكريمة والأحاديث النبوية الشريفة وأقوال أئمة الهدى المعتمدين.
قسّم الإجابة إلى:
1. الخلاصة الفقهية أو العلمية
2. الأدلة من القرآن الكريم والسنة النبوية
3. فوائد ولطائف تربوية لطلاب العلم`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `التخصص: ${field}\nالسؤال أو البحث: ${question}`,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return res.json({
      answer: response.text || 'لم يتم العثور على إجابة، يرجى المحاولة بصياغة أخرى.',
    });
  } catch (error: any) {
    console.error('Error in scholar query:', error);
    return res.status(500).json({ error: error.message || 'حدث خطأ أثناء معالجة الاستفسار العلمي' });
  }
});

const registrations: any[] = [];
app.post('/api/register', (req: Request, res: Response) => {
  const { studentName, country, email, track, level, preferredTime } = req.body;
  if (!studentName || !email) {
    return res.status(400).json({ error: 'الاسم والبريد الإلكتروني مطلوبان لإتمام التسجيل' });
  }
  const regRecord = {
    id: `REG-${Date.now().toString().slice(-6)}`,
    studentName,
    country,
    email,
    track: track || 'حفظ القرآن كاملاً',
    level: level || 'مبتدئ',
    preferredTime: preferredTime || 'الفترة المسائية',
    createdAt: new Date().toISOString(),
  };
  registrations.push(regRecord);
  return res.json({ success: true, registrationId: regRecord.id });
});

app.post('/api/search', (req: Request, res: Response) => {
  const { query, filter = 'all' } = req.body;
  if (!query || typeof query !== 'string') {
    return res.json({ results: [] });
  }
  return res.json({
    success: true,
    query: query.trim().toLowerCase(),
    filter,
  });
});

const communityQuestions: any[] = [];
app.post('/api/community/ask', (req: Request, res: Response) => {
  const { title, body, author, category } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: 'عنوان السؤال وتفاصيله مطلوبان' });
  }

  const newQuestion = {
    id: `CQ-${Date.now()}`,
    title,
    body,
    author: author || 'طالب علم',
    category: category || 'عام',
    answersCount: 0,
    status: 'pending_review',
    createdAt: new Date().toISOString(),
  };
  communityQuestions.push(newQuestion);
  return res.json({ success: true, question: newQuestion });
});

// =========================================================================
// SITE OWNERSHIP VERIFICATION ROUTES
// =========================================================================

app.get('/kgcwankausnf.html', (_req: Request, res: Response) => {
  res.type('text/html').send(`<!doctype html><html><head><meta name="google-site-verification" content="CRjC4I8nvt5yVCJr-kDyAGNSbSieuBuzojSRkxO8nF4" /><meta name="site-verification" content="kgcwankausnf" /><meta name="google-site-verification" content="kgcwankausnf" /></head><body>kgcwankausnf</body></html>`);
});

app.get(['/kgcwankausnf', '/kgcwankausnf.txt', '/.well-known/kgcwankausnf.txt', '/.well-known/site-verification'], (_req: Request, res: Response) => {
  res.type('text/plain').send('kgcwankausnf');
});

app.get('/google-site-verification.txt', (_req: Request, res: Response) => {
  res.type('text/plain').send('google-site-verification=CRjC4I8nvt5yVCJr-kDyAGNSbSieuBuzojSRkxO8nF4');
});

// =========================================================================
// VITE DEV SERVER & PRODUCTION STATIC SERVING
// =========================================================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Al-Noor API Gateway & Web Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
