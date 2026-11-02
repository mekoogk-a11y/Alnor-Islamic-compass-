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
