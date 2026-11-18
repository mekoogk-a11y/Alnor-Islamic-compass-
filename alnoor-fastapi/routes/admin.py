"""مسارات لوحة الإدارة المحمية بكلمة مرور لإدارة المحتوى والدورات والمشاريع."""

from fastapi import APIRouter, Depends, Form, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session

from auth import (
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE_SECONDS,
    create_session_token,
    get_current_user,
    is_admin_session,
    require_admin,
    verify_admin_password,
)
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

router = APIRouter(tags=["Admin"])


def render_page(request: Request, template_name: str, context: dict, status_code: int = 200):
    templates = request.app.state.templates
    return templates.TemplateResponse(request, template_name, context, status_code=status_code)


@router.get("/admin/login", response_class=HTMLResponse)
def admin_login_page(request: Request, db: Session = Depends(get_db)):
    """صفحة تسجيل دخول المشرف."""
    if is_admin_session(request, db):
        return RedirectResponse(url="/admin", status_code=status.HTTP_303_SEE_OTHER)
    return render_page(
        request,
        "admin_login.html",
        {
            "page_title": "دخول الإدارة — النور الإسلامي العالمي",
            "page_description": "لوحة إدارة منصة النور الإسلامي العالمي الخيري الشامل.",
            "current_user": get_current_user(request, db),
            "error_message": None,
        },
    )


@router.post("/admin/login", response_class=HTMLResponse)
def admin_login_submit(
    request: Request,
    admin_password: str = Form(...),
    db: Session = Depends(get_db),
):
    """التحقق من كلمة مرور الإدارة وإنشاء جلسة مشرف."""
    if not verify_admin_password(admin_password):
        return render_page(
            request,
            "admin_login.html",
            {
                "page_title": "دخول الإدارة — النور الإسلامي العالمي",
                "page_description": "لوحة إدارة منصة النور الإسلامي العالمي الخيري الشامل.",
                "current_user": get_current_user(request, db),
                "error_message": "كلمة مرور الإدارة غير صحيحة.",
            },
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    token = create_session_token({"is_admin": True})
    resp = RedirectResponse(url="/admin", status_code=status.HTTP_303_SEE_OTHER)
    resp.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        max_age=SESSION_MAX_AGE_SECONDS,
        httponly=True,
        samesite="lax",
    )
    return resp


@router.get("/admin", response_class=HTMLResponse)
def admin_dashboard(
    request: Request,
    saved: str = "",
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """لوحة التحكم الرئيسية لإضافة وإدارة المحتوى."""
    sections = db.query(Section).order_by(Section.sort_order).all()
    articles = db.query(Article).order_by(Article.created_at.desc()).all()
    courses = db.query(Course).order_by(Course.created_at.desc()).all()
    lessons = db.query(Lesson).order_by(Lesson.created_at.desc()).all()
    projects = db.query(CharityProject).order_by(CharityProject.created_at.desc()).all()
    fatwas = db.query(Fatwa).order_by(Fatwa.created_at.desc()).all()
    scholars = db.query(Scholar).order_by(Scholar.created_at.desc()).all()
    news_items = db.query(NewsItem).order_by(NewsItem.published_at.desc()).all()
    donations = db.query(Donation).order_by(Donation.created_at.desc()).limit(25).all()
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).limit(25).all()

    return render_page(
        request,
        "admin.html",
        {
            "page_title": "لوحة الإدارة — النور الإسلامي العالمي",
            "page_description": "إدارة المقالات والدورات والمشاريع الخيرية والدروس والفتاوى.",
            "current_user": get_current_user(request, db),
            "sections": sections,
            "articles": articles,
            "courses": courses,
            "lessons": lessons,
            "projects": projects,
            "fatwas": fatwas,
            "scholars": scholars,
            "news_items": news_items,
            "donations": donations,
            "messages": messages,
            "saved_flag": saved,
        },
    )


@router.post("/admin/articles")
def create_article(
    title_ar: str = Form(...),
    title_en: str = Form(""),
    author: str = Form(...),
    summary_ar: str = Form(...),
    content_ar: str = Form(...),
    section_id: int = Form(None),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """إضافة مقال جديد إلى قاعدة البيانات."""
    db.add(
        Article(
            title_ar=title_ar.strip(),
            title_en=title_en.strip() or None,
            author=author.strip(),
            summary_ar=summary_ar.strip(),
            content_ar=content_ar.strip(),
            section_id=section_id or None,
        )
    )
    db.commit()
    return RedirectResponse(url="/admin?saved=article", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/admin/articles/{article_id}/delete")
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """حذف مقال."""
    row = db.query(Article).filter(Article.id == article_id).first()
    if row:
        db.delete(row)
        db.commit()
    return RedirectResponse(url="/admin?saved=deleted", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/admin/courses")
def create_course(
    title_ar: str = Form(...),
    title_en: str = Form(""),
    instructor: str = Form(...),
    level_ar: str = Form("مفتوح للجميع"),
    duration_weeks: int = Form(4),
    description_ar: str = Form(...),
    section_id: int = Form(None),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """إضافة دورة تعليمية أو قرآنية جديدة."""
    db.add(
        Course(
            title_ar=title_ar.strip(),
            title_en=title_en.strip() or None,
            instructor=instructor.strip(),
            level_ar=level_ar.strip(),
            duration_weeks=max(1, duration_weeks),
            description_ar=description_ar.strip(),
            section_id=section_id or None,
        )
    )
    db.commit()
    return RedirectResponse(url="/admin?saved=course", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/admin/courses/{course_id}/delete")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """حذف دورة."""
    row = db.query(Course).filter(Course.id == course_id).first()
    if row:
        db.delete(row)
        db.commit()
    return RedirectResponse(url="/admin?saved=deleted", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/admin/lessons")
def create_lesson(
    title_ar: str = Form(...),
    speaker: str = Form(...),
    summary_ar: str = Form(...),
    duration_minutes: int = Form(30),
    media_url: str = Form(""),
    section_id: int = Form(None),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """إضافة درس أو محاضرة جديدة."""
    db.add(
        Lesson(
            title_ar=title_ar.strip(),
            speaker=speaker.strip(),
            summary_ar=summary_ar.strip(),
            duration_minutes=max(1, duration_minutes),
            media_url=media_url.strip() or None,
            section_id=section_id or None,
        )
    )
    db.commit()
    return RedirectResponse(url="/admin?saved=lesson", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/admin/lessons/{lesson_id}/delete")
def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """حذف درس."""
    row = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if row:
        db.delete(row)
        db.commit()
    return RedirectResponse(url="/admin?saved=deleted", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/admin/projects")
def create_project(
    title_ar: str = Form(...),
    title_en: str = Form(""),
    category_ar: str = Form("مشروع خيري"),
    location_ar: str = Form("دولي"),
    target_amount: float = Form(10000.0),
    description_ar: str = Form(...),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """إضافة مشروع خيري أو إنساني جديد."""
    db.add(
        CharityProject(
            title_ar=title_ar.strip(),
            title_en=title_en.strip() or None,
            category_ar=category_ar.strip(),
            location_ar=location_ar.strip(),
            target_amount=max(1.0, float(target_amount)),
            description_ar=description_ar.strip(),
        )
    )
    db.commit()
    return RedirectResponse(url="/admin?saved=project", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/admin/projects/{project_id}/delete")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """حذف مشروع خيري."""
    row = db.query(CharityProject).filter(CharityProject.id == project_id).first()
    if row:
        db.delete(row)
        db.commit()
    return RedirectResponse(url="/admin?saved=deleted", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/admin/fatwas")
def create_fatwa(
    question_ar: str = Form(...),
    answer_ar: str = Form(...),
    category_ar: str = Form("فقه العبادات"),
    scholar_name: str = Form("لجنة الفتوى"),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """إضافة فتوى موثقة."""
    db.add(
        Fatwa(
            question_ar=question_ar.strip(),
            answer_ar=answer_ar.strip(),
            category_ar=category_ar.strip(),
            scholar_name=scholar_name.strip(),
        )
    )
    db.commit()
    return RedirectResponse(url="/admin?saved=fatwa", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/admin/scholars")
def create_scholar(
    name_ar: str = Form(...),
    specialty_ar: str = Form(...),
    country_ar: str = Form("العالم الإسلامي"),
    bio_ar: str = Form(...),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """إضافة عالم أو معلم."""
    db.add(
        Scholar(
            name_ar=name_ar.strip(),
            specialty_ar=specialty_ar.strip(),
            country_ar=country_ar.strip(),
            bio_ar=bio_ar.strip(),
        )
    )
    db.commit()
    return RedirectResponse(url="/admin?saved=scholar", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/admin/news")
def create_news(
    title_ar: str = Form(...),
    summary_ar: str = Form(...),
    body_ar: str = Form(...),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """إضافة خبر أو نشاط للمؤسسة."""
    db.add(
        NewsItem(
            title_ar=title_ar.strip(),
            summary_ar=summary_ar.strip(),
            body_ar=body_ar.strip(),
        )
    )
    db.commit()
    return RedirectResponse(url="/admin?saved=news", status_code=status.HTTP_303_SEE_OTHER)
