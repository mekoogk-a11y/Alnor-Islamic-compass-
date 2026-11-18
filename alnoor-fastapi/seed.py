"""تهيئة الأقسام الاثني عشر الرسمية في قاعدة البيانات دون إضافة محتوى وهمي."""

from sqlalchemy.orm import Session
from models import Section

CORE_SECTIONS = [
    {
        "slug": "quran",
        "title_ar": "القرآن الكريم",
        "title_en": "The Holy Quran",
        "description_ar": "تصفح سور القرآن الكريم بالرسم الواضح، مع الاستماع المباشر لتلاوات مختارة.",
        "description_en": "Browse all Surahs of the Holy Quran with clear script and live audio recitations.",
        "icon_name": "book-open",
        "sort_order": 1,
    },
    {
        "slug": "tahfiz",
        "title_ar": "تحفيظ القرآن الكريم",
        "title_en": "Quran Memorization",
        "description_ar": "برامج متدرجة للحفظ والمراجعة وإتقان التلاوة والتجويد لجميع الأعمار.",
        "description_en": "Structured memorization, revision, and Tajweed mastery programs for all ages.",
        "icon_name": "award",
        "sort_order": 2,
    },
    {
        "slug": "tafsir",
        "title_ar": "التفسير وعلوم القرآن",
        "title_en": "Tafsir & Quran Sciences",
        "description_ar": "دروس ومقالات مؤصلة في فهم معاني الآيات وأسباب النزول ومقاصد السور.",
        "description_en": "Authenticated lessons and articles on Quranic exegesis, revelation context, and themes.",
        "icon_name": "sparkles",
        "sort_order": 3,
    },
    {
        "slug": "hadith",
        "title_ar": "الحديث الشريف",
        "title_en": "Prophetic Hadith",
        "description_ar": "شروح الأحاديث النبوية الصحيحة ومناهج المحدثين في رواية السنة وحفظها.",
        "description_en": "Explanations of authentic Prophetic traditions and classical Hadith methodology.",
        "icon_name": "scroll",
        "sort_order": 4,
    },
    {
        "slug": "fiqh",
        "title_ar": "الفقه الإسلامي",
        "title_en": "Islamic Jurisprudence",
        "description_ar": "بيان أحكام العبادات والمعاملات بأسلوب ميسر مستند إلى الأدلة الشرعية.",
        "description_en": "Clear guidance on worship and transactions grounded in verified juristic evidence.",
        "icon_name": "scale",
        "sort_order": 5,
    },
    {
        "slug": "aqeedah",
        "title_ar": "العقيدة الإسلامية",
        "title_en": "Islamic Creed",
        "description_ar": "ترسيخ أصول التوحيد والإيمان الصافي بعيداً عن التعقيد والغلو.",
        "description_en": "Strengthening pure monotheism and foundational creed with clarity and balance.",
        "icon_name": "shield",
        "sort_order": 6,
    },
    {
        "slug": "seerah",
        "title_ar": "السيرة النبوية",
        "title_en": "Prophetic Biography",
        "description_ar": "دروس وعبر من سيرة النبي محمد ﷺ في الدعوة والأخلاق وبناء المجتمع.",
        "description_en": "Lessons and wisdom from the life, character, and leadership of Prophet Muhammad.",
        "icon_name": "compass",
        "sort_order": 7,
    },
    {
        "slug": "adhkar",
        "title_ar": "الأذكار والأدعية",
        "title_en": "Adhkar & Supplications",
        "description_ar": "أذكار الصباح والمساء وأدعية مأثورة من القرآن والسنة لسكينة القلب.",
        "description_en": "Morning and evening remembrances and authentic Prophetic supplications.",
        "icon_name": "sun",
        "sort_order": 8,
    },
    {
        "slug": "library",
        "title_ar": "المكتبة الإسلامية",
        "title_en": "Islamic Library",
        "description_ar": "مكتبة معرفية تضم المقالات والملفات العلمية والأبحاث الموثقة.",
        "description_en": "Curated scholarly library housing articles, papers, and educational references.",
        "icon_name": "library",
        "sort_order": 9,
    },
    {
        "slug": "courses",
        "title_ar": "الدورات التعليمية",
        "title_en": "Educational Courses",
        "description_ar": "مسارات تعليمية متكاملة في القراءات والتجويد واللغة والعلوم الشرعية.",
        "description_en": "Guided educational tracks in recitation, Arabic language, and Sharia studies.",
        "icon_name": "graduation-cap",
        "sort_order": 10,
    },
    {
        "slug": "charity",
        "title_ar": "المشاريع الخيرية",
        "title_en": "Charity Projects",
        "description_ar": "مبادرات إغاثية وتنموية وبناء حلقات التحفيظ وكفالة الأسر المحتاجة.",
        "description_en": "Humanitarian initiatives, Quran study circles, and community relief programs.",
        "icon_name": "heart-handshake",
        "sort_order": 11,
    },
    {
        "slug": "student-sponsorship",
        "title_ar": "كفالة طلاب العلم",
        "title_en": "Student Sponsorship",
        "description_ar": "دعم حفظة القرآن الكريم وطلاب العلوم الشرعية لتأهيلهم لخدمة مجتمعاتهم.",
        "description_en": "Supporting Quran memorizers and dedicated students to serve their communities.",
        "icon_name": "users",
        "sort_order": 12,
    },
]


def ensure_core_sections(db: Session) -> None:
    """التحقق من وجود الأقسام الأساسية الاثني عشر في قاعدة البيانات."""
    existing_slugs = {row.slug for row in db.query(Section.slug).all()}
    added = False
    for item in CORE_SECTIONS:
        if item["slug"] not in existing_slugs:
            db.add(Section(**item))
            added = True
    if added:
        db.commit()
