import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Islamic Scholarly Assistant & Research in Quran and Sciences
app.post('/api/scholar/query', async (req: Request, res: Response) => {
  try {
    const { question, field = 'علوم القرآن' } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'السؤال أو موضوع البحث مطلوب' });
    }

    const systemPrompt = `أنت المساعد العلمي الأكاديمي لبوابة "مجمع النور الإسلامي العالمي الخيري الشامل لتحفيظ القرآن الكريم والعلوم الإسلامية".
شعار المجمع: "نورٌ يهدي.. وصرحٌ يبني أجيال القرآن".
مهمتك: تقديم إجابات علمية رصينة، موثقة بالآيات الكريمة والأحاديث النبوية الشريفة وأقوال أئمة الهدى المعتمدين، بأسلوب علمي تربوي معتدل يناسب طلاب العلم وعموم المسلمين في مشارق الأرض ومغاربها.
التزم بالوسطية والتيسير والأدب الإسلامي الرفيع.
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

// Endpoint: Registration submission for the Global Quran Academy
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

// Vite middleware in dev or static files in prod
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
