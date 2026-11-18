# النور الإسلامي العالمي الخيري الشامل (Python 3.11+ / FastAPI / Jinja2 / SQLite)

منصة عالمية متكاملة لتحفيظ القرآن الكريم وتعليم العلوم الشرعية ونشر المعرفة الإسلامية والعمل الخيري، مبنية بلغة **Python 3.11+** وإطار عمل **FastAPI** وقوالب **Jinja2** وقاعدة بيانات **SQLite** عبر **SQLAlchemy**.

---

## هيكل المشروع

```text
alnoor-fastapi/
├── main.py               # نقطة تشغيل FastAPI وربط القوالب والملفات الثابتة
├── database.py           # إعداد محرك SQLAlchemy واتصال SQLite
├── models.py             # نماذج قاعدة البيانات (الأقسام، الدروس، الدورات، المقالات، المشاريع، التبرعات، الفتاوى، العلماء، الأخبار، المستخدمين، الرسائل)
├── auth.py               # تجزئة كلمات المرور وإدارة جلسات الأعضاء ولوحة الإدارة
├── seed.py               # تهيئة الأقسام الاثني عشر الرئيسية عند التشغيل الأول
├── requirements.txt      # الاعتمادات المطلوبة
├── routes/
│   ├── public.py         # المسارات العامة والصفحات والبحث والتبرعات والتواصل
│   ├── auth_routes.py    # مسارات تسجيل الدخول وإنشاء الحساب وحساب العضو
│   ├── admin.py          # لوحة الإدارة (/admin) لإضافة وحذف المحتوى
│   └── seo_pwa.py        # مسارات sitemap.xml وrobots.txt وmanifest.json وsw.js
├── templates/
│   ├── base.html
│   ├── partials/         # الرأس، التذييل، مواقيت الصلاة، قارئ القرآن، حالة الفراغ
│   └── ...               # جميع صفحات المنصة الـ 18
└── static/
    ├── css/style.css     # نظام التصميم (الأزرق الملكي والأبيض والذهبي والأخضر + الوضع الليلي + RTL/LTR)
    ├── js/app.js         # الترجمة، الوضع الليلي، Aladhan API، api.alquran.cloud، PWA
    ├── images/           # الصور المحلية المحسنة
    └── icons/            # أيقونات PWA (192x192، 512x512، Maskable، Apple Touch Icon)
```

---

## متطلبات التشغيل

- **Python 3.11** أو أحدث.
- بيئة افتراضية (`venv`) وتثبيت الحزم من `requirements.txt`.

## خطوات التشغيل السريع

```bash
cd alnoor-fastapi
python3 -m venv .venv
source .venv/bin/activate      # على Linux / macOS
# أو: .venv\Scripts\activate  # على Windows

pip install -r requirements.txt
uvicorn main:app --reload
```

ثم افتح المتصفح على: `http://127.0.0.1:8000`

---

## إعداد متغيرات البيئة ولوحة الإدارة (`/admin`)

قبل النشر الإنتاجي يُوصى بتعيين المتغيرات التالية:

```bash
export ALNOOR_SECRET_KEY="replace-with-strong-random-secret"
export ALNOOR_ADMIN_PASSWORD="replace-with-strong-admin-password"
```

- كلمة مرور الإدارة الافتراضية في وضع التطوير المحلي: `AlNoor@2026Admin` (يمكن تغييرها مباشرة عبر `ALNOOR_ADMIN_PASSWORD`).
- لوحة الإدارة: `http://127.0.0.1:8000/admin`
- فحص الصحة: `http://127.0.0.1:8000/api/health`

---

**Designed by Kamal Gafar Zakaria**  
WhatsApp: `00249919980435`
