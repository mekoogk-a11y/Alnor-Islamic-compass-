"""مسارات تسجيل الدخول وإنشاء الحساب وحساب المستخدم."""

from fastapi import APIRouter, Depends, Form, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session

from auth import (
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE_SECONDS,
    create_session_token,
    get_current_user,
    hash_password,
    verify_password,
)
from database import get_db
from models import User

router = APIRouter(tags=["Authentication"])


def render_page(request: Request, template_name: str, context: dict, status_code: int = 200):
    templates = request.app.state.templates
    return templates.TemplateResponse(request, template_name, context, status_code=status_code)


@router.get("/login", response_class=HTMLResponse)
def login_page(request: Request, db: Session = Depends(get_db)):
    """عرض صفحة تسجيل الدخول."""
    user = get_current_user(request, db)
    if user:
        return RedirectResponse(url="/account", status_code=status.HTTP_303_SEE_OTHER)
    return render_page(
        request,
        "login.html",
        {
            "page_title": "تسجيل الدخول — النور الإسلامي العالمي",
            "page_description": "تسجيل الدخول إلى حسابك في منصة النور الإسلامي العالمي الخيري الشامل.",
            "current_user": None,
            "error_message": None,
        },
    )


@router.post("/login", response_class=HTMLResponse)
def login_submit(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    """معالجة طلب تسجيل الدخول."""
    normalized_email = email.strip().lower()
    user = db.query(User).filter(User.email == normalized_email, User.is_active.is_(True)).first()
    if not user or not verify_password(password, user.password_hash):
        return render_page(
            request,
            "login.html",
            {
                "page_title": "تسجيل الدخول — النور الإسلامي العالمي",
                "page_description": "تسجيل الدخول إلى منصة النور الإسلامي العالمي.",
                "current_user": None,
                "error_message": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
            },
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    token = create_session_token({"user_id": user.id, "is_admin": user.role == "admin"})
    resp = RedirectResponse(url="/account", status_code=status.HTTP_303_SEE_OTHER)
    resp.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        max_age=SESSION_MAX_AGE_SECONDS,
        httponly=True,
        samesite="lax",
    )
    return resp


@router.get("/register", response_class=HTMLResponse)
def register_page(request: Request, db: Session = Depends(get_db)):
    """عرض صفحة إنشاء حساب جديد."""
    user = get_current_user(request, db)
    if user:
        return RedirectResponse(url="/account", status_code=status.HTTP_303_SEE_OTHER)
    return render_page(
        request,
        "register.html",
        {
            "page_title": "إنشاء حساب — النور الإسلامي العالمي",
            "page_description": "انضم إلى منصة النور الإسلامي العالمي الخيري الشامل.",
            "current_user": None,
            "error_message": None,
        },
    )


@router.post("/register", response_class=HTMLResponse)
def register_submit(
    request: Request,
    full_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    """إنشاء حساب عضو جديد في قاعدة البيانات."""
    clean_name = full_name.strip()
    clean_email = email.strip().lower()

    if len(clean_name) < 2 or len(password) < 6:
        return render_page(
            request,
            "register.html",
            {
                "page_title": "إنشاء حساب — النور الإسلامي العالمي",
                "page_description": "إنشاء حساب جديد في منصة النور.",
                "current_user": None,
                "error_message": "يرجى إدخال اسم صحيح وكلمة مرور لا تقل عن 6 أحرف.",
            },
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    if db.query(User).filter(User.email == clean_email).first():
        return render_page(
            request,
            "register.html",
            {
                "page_title": "إنشاء حساب — النور الإسلامي العالمي",
                "page_description": "إنشاء حساب جديد في منصة النور.",
                "current_user": None,
                "error_message": "هذا البريد الإلكتروني مسجل مسبقاً.",
            },
            status_code=status.HTTP_409_CONFLICT,
        )

    new_user = User(
        full_name=clean_name,
        email=clean_email,
        password_hash=hash_password(password),
        role="member",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_session_token({"user_id": new_user.id, "is_admin": False})
    resp = RedirectResponse(url="/account", status_code=status.HTTP_303_SEE_OTHER)
    resp.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        max_age=SESSION_MAX_AGE_SECONDS,
        httponly=True,
        samesite="lax",
    )
    return resp


@router.get("/account", response_class=HTMLResponse)
def account_page(request: Request, db: Session = Depends(get_db)):
    """صفحة حساب العضو."""
    user = get_current_user(request, db)
    if not user:
        return RedirectResponse(url="/login", status_code=status.HTTP_303_SEE_OTHER)
    return render_page(
        request,
        "account.html",
        {
            "page_title": f"حسابي: {user.full_name} — النور الإسلامي العالمي",
            "page_description": "إدارة ملفك الشخصي في منصة النور الإسلامي العالمي.",
            "current_user": user,
        },
    )


@router.post("/logout")
def logout():
    """تسجيل الخروج وإنهاء الجلسة."""
    resp = RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)
    resp.delete_cookie(SESSION_COOKIE_NAME)
    return resp
