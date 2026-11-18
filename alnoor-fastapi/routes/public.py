"""المسارات العامة لصفحات منصة النور الإسلامي العالمي الخيري الشامل."""

import secrets
from typing import Optional

from fastapi import APIRouter, Depends, Form, HTTPException, Query, Request, status
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import (
    Article,
    CharityProject,
    ContactMessage,
    Course,
    Donation,
    Fatwa,
    Lesson,
    NewsItem,
    Scholar,
    Section,
)

router = APIRouter(tags=["Public Pages"])

# نصوص الأذكار المأثورة المعتمدة لصفحة الأذكار والأدعية
AUTHENTIC_ADHKAR = [
    {
        "category_ar": "أذكار الصباح والمساء",
        "category_en": "Morning & Evening",
        "arabic": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        "reference": "رواه مسلم",
    },
    {
        "category_ar": "سيد الاستغفار",
        "category_en": "Master Supplication for Forgiveness",
        "arabic": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
        "reference": "رواه البخاري",
    },
    {
        "category_ar": "طلب العلم النافع",
        "category_en": "Seeking Beneficial Knowledge",
        "arabic": "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا.",
        "reference": "رواه ابن ماجه",
    },
    {
        "category_ar": "التسبيح والتهليل",
        "category_en": "Tasbih & Tahlil",
        "arabic": "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ.",
        "reference": "متفق عليه",
    },
]


def render_page(request: Request, template_name: str, context: dict, status_code: int = 200):
    templates = request.app.state.templates
    return templates.TemplateResponse(request, template_name, context, status_code=status_code)


def get_platform_stats(db: Session) -> dict:
    """حساب إحصائيات المنصة مباشرة من قاعدة البيانات."""
    donations_total = db.query(func.coalesce(func.sum(Donation.amount), 0.0)).scalar() or 0.0
    return {
        "sections_count": db.query(func.count(Section.id)).scalar() or 0,
        "lessons_count": db.query(func.count(Lesson.id)).scalar() or 0,
        "courses_count": db.query(func.count(Course.id)).scalar() or 0,
        "articles_count": db.query(func.count(Article.id)).scalar() or 0,
        "projects_count": db.query(func.count(CharityProject.id)).scalar() or 0,
        "scholars_count": db.query(func.count(Scholar.id)).scalar() or 0,
        "donations_count": db.query(func.count(Donation.id)).scalar() or 0,
        "donations_total": round(float(donations_total), 2),
    }


@router.get("/", response_class=HTMLResponse)
def home_page(request: Request, donated: str = "", db: Session = Depends(get_db)):
    """الصفحة الرئيسية لمنصة النور الإسلامي العالمي الخيري الشامل."""
    sections = db.query(Section).order_by(Section.sort_order).all()
    lessons = db.query(Lesson).order_by(Lesson.created_at.desc()).limit(6).all()
    courses = db.query(Course).order_by(Course.created_at.desc()).limit(6).all()
    articles = db.query(Article).order_by(Article.created_at.desc()).limit(6).all()
    projects = db.query(CharityProject).filter(CharityProject.is_active.is_(True)).order_by(CharityProject.created_at.desc()).limit(6).all()
    scholars = db.query(Scholar).order_by(Scholar.created_at.desc()).limit(6).all()
    news_items = db.query(NewsItem).order_by(NewsItem.published_at.desc()).limit(6).all()
    stats = get_platform_stats(db)

    return render_page(
        request,
        "index.html",
        {
            "page_title": "النور الإسلامي العالمي الخيري الشامل — نور القرآن، علم ينتفع به، وخير يمتد",
            "page_description": "منصة عالمية تجمع بين تحفيظ القرآن الكريم وتعليم العلوم الإسلامية ونشر المعرفة وخدمة المجتمعات.",
            "current_user": get_current_user(request, db),
            "sections": sections,
            "lessons": lessons,
            "courses": courses,
            "articles": articles,
            "projects": projects,
            "scholars": scholars,
            "news_items": news_items,
            "stats": stats,
            "donated_receipt": donated,
        },
    )


@router.get("/sections/{slug}", response_class=HTMLResponse)
def section_detail_page(request: Request, slug: str, db: Session = Depends(get_db)):
    """صفحة قسم مستقل تعرض المحتوى الحقيقي المرتبط به من قاعدة البيانات."""
    section = db.query(Section).filter(Section.slug == slug).first()
    if not section:
        raise HTTPException(status_code=404, detail="القسم غير موجود")

    articles = db.query(Article).filter(Article.section_id == section.id).order_by(Article.created_at.desc()).all()
    courses = db.query(Course).filter(Course.section_id == section.id).order_by(Course.created_at.desc()).all()
    lessons = db.query(Lesson).filter(Lesson.section_id == section.id).order_by(Lesson.created_at.desc()).all()
    projects = []
    if slug in ("charity", "student-sponsorship"):
        projects = db.query(CharityProject).filter(CharityProject.is_active.is_(True)).order_by(CharityProject.created_at.desc()).all()

    return render_page(
        request,
        "section_detail.html",
        {
            "page_title": f"{section.title_ar} — النور الإسلامي العالمي",
            "page_description": section.description_ar,
            "current_user": get_current_user(request, db),
            "section": section,
            "articles": articles,
            "courses": courses,
            "lessons": lessons,
            "projects": projects,
        },
    )


@router.get("/quran", response_class=HTMLResponse)
def quran_page(request: Request, db: Session = Depends(get_db)):
    """صفحة القرآن الكريم (القراءة والاستماع عبر api.alquran.cloud)."""
    return render_page(
        request,
        "quran.html",
        {
            "page_title": "القرآن الكريم — قراءة واستماع | النور الإسلامي العالمي",
            "page_description": "اقرأ القرآن الكريم واستمع إلى التلاوات العطرة عبر واجهة api.alquran.cloud.",
            "current_user": get_current_user(request, db),
        },
    )


@router.get("/tahfiz", response_class=HTMLResponse)
def tahfiz_page(request: Request, db: Session = Depends(get_db)):
    """صفحة التحفيظ والتعليم."""
    section = db.query(Section).filter(Section.slug == "tahfiz").first()
    courses = db.query(Course).order_by(Course.created_at.desc()).all()
    lessons = db.query(Lesson).order_by(Lesson.created_at.desc()).all()
    return render_page(
        request,
        "tahfiz.html",
        {
            "page_title": "التحفيظ والتعليم — النور الإسلامي العالمي",
            "page_description": "حلقات تحفيظ القرآن الكريم ومسارات الإتقان والتجويد.",
            "current_user": get_current_user(request, db),
            "section": section,
            "courses": courses,
            "lessons": lessons,
        },
    )


@router.get("/islamic-sciences", response_class=HTMLResponse)
def sciences_page(request: Request, db: Session = Depends(get_db)):
    """صفحة العلوم الإسلامية (التفسير، الحديث، الفقه، العقيدة، السيرة)."""
    science_slugs = ["tafsir", "hadith", "fiqh", "aqeedah", "seerah"]
    science_sections = db.query(Section).filter(Section.slug.in_(science_slugs)).order_by(Section.sort_order).all()
    lessons = db.query(Lesson).order_by(Lesson.created_at.desc()).all()
    articles = db.query(Article).order_by(Article.created_at.desc()).all()
    return render_page(
        request,
        "sciences.html",
        {
            "page_title": "العلوم الإسلامية — التفسير والحديث والفقه والعقيدة والسيرة",
            "page_description": "منهج متكامل في العلوم الشرعية المؤصلة بأسلوب ميسر.",
            "current_user": get_current_user(request, db),
            "science_sections": science_sections,
            "lessons": lessons,
            "articles": articles,
        },
    )


@router.get("/library", response_class=HTMLResponse)
def library_page(request: Request, db: Session = Depends(get_db)):
    """صفحة المكتبة الإسلامية والمقالات."""
    articles = db.query(Article).order_by(Article.created_at.desc()).all()
    lessons = db.query(Lesson).order_by(Lesson.created_at.desc()).all()
    return render_page(
        request,
        "library.html",
        {
            "page_title": "المكتبة الإسلامية — النور الإسلامي العالمي",
            "page_description": "تصفح المقالات والأبحاث والدروس المحفوظة في مكتبة النور.",
            "current_user": get_current_user(request, db),
            "articles": articles,
            "lessons": lessons,
        },
    )


@router.get("/courses", response_class=HTMLResponse)
def courses_page(request: Request, db: Session = Depends(get_db)):
    """صفحة الدورات التعليمية والقرآنية."""
    courses = db.query(Course).order_by(Course.created_at.desc()).all()
    return render_page(
        request,
        "courses.html",
        {
            "page_title": "الدورات التعليمية — النور الإسلامي العالمي",
            "page_description": "التحق بالدورات القرآنية والشرعية المتاحة في منصة النور.",
            "current_user": get_current_user(request, db),
            "courses": courses,
        },
    )


@router.get("/fatwas", response_class=HTMLResponse)
def fatwas_page(request: Request, db: Session = Depends(get_db)):
    """صفحة الفتاوى والاستشارات الشرعية."""
    fatwas = db.query(Fatwa).order_by(Fatwa.created_at.desc()).all()
    return render_page(
        request,
        "fatwas.html",
        {
            "page_title": "الفتاوى والاستشارات الشرعية — النور الإسلامي العالمي",
            "page_description": "أرشيف الفتاوى الشرعية الموثقة بإشراف العلماء.",
            "current_user": get_current_user(request, db),
            "fatwas": fatwas,
        },
    )


@router.get("/adhkar", response_class=HTMLResponse)
def adhkar_page(request: Request, db: Session = Depends(get_db)):
    """صفحة الأذكار والأدعية المأثورة."""
    return render_page(
        request,
        "adhkar.html",
        {
            "page_title": "الأذكار والأدعية — النور الإسلامي العالمي",
            "page_description": "مختارات من الأذكار والأدعية الصحيحة من الكتاب والسنة.",
            "current_user": get_current_user(request, db),
            "adhkar_list": AUTHENTIC_ADHKAR,
        },
    )


@router.get("/charity", response_class=HTMLResponse)
def charity_page(request: Request, donated: str = "", db: Session = Depends(get_db)):
    """صفحة المشاريع الخيرية والتبرعات."""
    projects = db.query(CharityProject).order_by(CharityProject.created_at.desc()).all()
    recent_donations = db.query(Donation).order_by(Donation.created_at.desc()).limit(10).all()
    return render_page(
        request,
        "charity.html",
        {
            "page_title": "المشاريع الخيرية والتبرعات — النور الإسلامي العالمي",
            "page_description": "ساهم في المشاريع الخيرية وكفالة طلاب العلم وحلقات القرآن.",
            "current_user": get_current_user(request, db),
            "projects": projects,
            "recent_donations": recent_donations,
            "donated_receipt": donated,
        },
    )


@router.post("/donate")
def submit_donation(
    donor_name: str = Form(...),
    donor_email: str = Form(""),
    donor_phone: str = Form(""),
    amount: float = Form(...),
    currency: str = Form("USD"),
    project_id: Optional[str] = Form(None),
    notes: str = Form(""),
    next_url: str = Form("/charity"),
    db: Session = Depends(get_db),
):
    """حفظ مساهمة التبرع في قاعدة البيانات وتحديث رصيد المشروع."""
    if amount <= 0:
        return RedirectResponse(url=f"{next_url}?donated=invalid", status_code=status.HTTP_303_SEE_OTHER)

    parsed_project_id = int(project_id) if project_id and project_id.isdigit() else None
    receipt_code = f"NOOR-{secrets.token_hex(4).upper()}"

    donation = Donation(
        donor_name=donor_name.strip(),
        donor_email=donor_email.strip() or None,
        donor_phone=donor_phone.strip() or None,
        amount=round(float(amount), 2),
        currency=currency.strip().upper()[:10] or "USD",
        project_id=parsed_project_id,
        notes=notes.strip() or None,
        receipt_code=receipt_code,
    )
    db.add(donation)

    if parsed_project_id:
        project = db.query(CharityProject).filter(CharityProject.id == parsed_project_id).first()
        if project:
            project.raised_amount = round(float(project.raised_amount) + float(amount), 2)

    db.commit()
    target = "/charity" if next_url != "/" else "/"
    return RedirectResponse(url=f"{target}?donated={receipt_code}", status_code=status.HTTP_303_SEE_OTHER)


@router.get("/articles/{article_id}", response_class=HTMLResponse)
def article_detail(request: Request, article_id: int, db: Session = Depends(get_db)):
    """عرض تفاصيل مقال محدد."""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="المقال غير موجود")
    return render_page(
        request,
        "item_detail.html",
        {
            "page_title": f"{article.title_ar} — النور الإسلامي العالمي",
            "page_description": article.summary_ar,
            "current_user": get_current_user(request, db),
            "item_type": "مقال علمي",
            "item_title": article.title_ar,
            "item_meta": f"بقلم: {article.author}",
            "item_body": article.content_ar,
            "back_url": "/library",
        },
    )


@router.get("/courses/{course_id}", response_class=HTMLResponse)
def course_detail(request: Request, course_id: int, db: Session = Depends(get_db)):
    """عرض تفاصيل دورة تعليمية."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="الدورة غير موجودة")
    return render_page(
        request,
        "item_detail.html",
        {
            "page_title": f"{course.title_ar} — النور الإسلامي العالمي",
            "page_description": course.description_ar,
            "current_user": get_current_user(request, db),
            "item_type": "دورة تعليمية",
            "item_title": course.title_ar,
            "item_meta": f"المشرف: {course.instructor} · المستوى: {course.level_ar} · المدة: {course.duration_weeks} أسابيع",
            "item_body": course.description_ar,
            "back_url": "/courses",
        },
    )


@router.get("/projects/{project_id}", response_class=HTMLResponse)
def project_detail(request: Request, project_id: int, db: Session = Depends(get_db)):
    """عرض تفاصيل مشروع خيري."""
    project = db.query(CharityProject).filter(CharityProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="المشروع غير موجود")
    return render_page(
        request,
        "item_detail.html",
        {
            "page_title": f"{project.title_ar} — النور الإسلامي العالمي",
            "page_description": project.description_ar,
            "current_user": get_current_user(request, db),
            "item_type": project.category_ar,
            "item_title": project.title_ar,
            "item_meta": f"الموقع: {project.location_ar} · المحصّل: {project.raised_amount:.0f} / {project.target_amount:.0f} USD",
            "item_body": project.description_ar,
            "back_url": "/charity",
        },
    )


@router.get("/about", response_class=HTMLResponse)
def about_page(request: Request, db: Session = Depends(get_db)):
    """صفحة من نحن ورؤية المؤسسة."""
    stats = get_platform_stats(db)
    scholars = db.query(Scholar).order_by(Scholar.created_at.desc()).all()
    return render_page(
        request,
        "about.html",
        {
            "page_title": "من نحن — النور الإسلامي العالمي الخيري الشامل",
            "page_description": "رؤية ورسالة مؤسسة النور الإسلامي العالمي الخيري الشامل في خدمة القرآن والعلم والعمل الخيري.",
            "current_user": get_current_user(request, db),
            "stats": stats,
            "scholars": scholars,
        },
    )


@router.get("/contact", response_class=HTMLResponse)
def contact_page(request: Request, sent: str = "", db: Session = Depends(get_db)):
    """صفحة اتصل بنا."""
    return render_page(
        request,
        "contact.html",
        {
            "page_title": "اتصل بنا — النور الإسلامي العالمي الخيري الشامل",
            "page_description": "تواصل مع إدارة منصة النور الإسلامي العالمي الخيري الشامل.",
            "current_user": get_current_user(request, db),
            "sent_success": sent == "1",
        },
    )


@router.post("/contact")
def contact_submit(
    sender_name: str = Form(...),
    sender_email: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...),
    db: Session = Depends(get_db),
):
    """حفظ رسالة التواصل في قاعدة البيانات."""
    db.add(
        ContactMessage(
            sender_name=sender_name.strip(),
            sender_email=sender_email.strip().lower(),
            subject=subject.strip(),
            message=message.strip(),
        )
    )
    db.commit()
    return RedirectResponse(url="/contact?sent=1", status_code=status.HTTP_303_SEE_OTHER)


@router.get("/search", response_class=HTMLResponse)
def search_page(
    request: Request,
    q: str = Query("", max_length=120),
    db: Session = Depends(get_db),
):
    """بحث فعلي شامل في جداول قاعدة البيانات."""
    query_text = q.strip()
    sections = []
    articles = []
    courses = []
    lessons = []
    projects = []
    fatwas = []

    if query_text:
        pattern = f"%{query_text}%"
        sections = (
            db.query(Section)
            .filter(
                or_(
                    Section.title_ar.ilike(pattern),
                    Section.title_en.ilike(pattern),
                    Section.description_ar.ilike(pattern),
                )
            )
            .all()
        )
        articles = (
            db.query(Article)
            .filter(
                or_(
                    Article.title_ar.ilike(pattern),
                    Article.summary_ar.ilike(pattern),
                    Article.content_ar.ilike(pattern),
                )
            )
            .all()
        )
        courses = (
            db.query(Course)
            .filter(or_(Course.title_ar.ilike(pattern), Course.description_ar.ilike(pattern)))
            .all()
        )
        lessons = (
            db.query(Lesson)
            .filter(or_(Lesson.title_ar.ilike(pattern), Lesson.summary_ar.ilike(pattern)))
            .all()
        )
        projects = (
            db.query(CharityProject)
            .filter(or_(CharityProject.title_ar.ilike(pattern), CharityProject.description_ar.ilike(pattern)))
            .all()
        )
        fatwas = (
            db.query(Fatwa)
            .filter(or_(Fatwa.question_ar.ilike(pattern), Fatwa.answer_ar.ilike(pattern)))
            .all()
        )

    return render_page(
        request,
        "search.html",
        {
            "page_title": f"نتائج البحث: {query_text or 'الكل'} — النور الإسلامي العالمي",
            "page_description": "البحث في أقسام ومقالات ودورات ومشاريع منصة النور الإسلامي العالمي.",
            "current_user": get_current_user(request, db),
            "query_text": query_text,
            "sections": sections,
            "articles": articles,
            "courses": courses,
            "lessons": lessons,
            "projects": projects,
            "fatwas": fatwas,
        },
    )


@router.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    """نقطة فحص صحة التطبيق وقاعدة البيانات."""
    sections_count = db.query(func.count(Section.id)).scalar() or 0
    return JSONResponse({"status": "ok", "sections_count": sections_count})
