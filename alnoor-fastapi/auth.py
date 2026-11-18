"""وحدة المصادقة وتجزئة كلمات المرور وإدارة جلسات الأعضاء ولوحة الإدارة."""

import hashlib
import hmac
import os
import secrets
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from sqlalchemy.orm import Session

from database import get_db
from models import User

# مفتاح التوقيع للجلسات وكلمة مرور المشرف من متغيرات البيئة
SECRET_KEY = os.getenv("ALNOOR_SECRET_KEY", "alnoor-global-dev-secret-change-in-production")
ADMIN_PASSWORD = os.getenv("ALNOOR_ADMIN_PASSWORD", "AlNoor@2026Admin")
SESSION_COOKIE_NAME = "alnoor_session"
SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7  # 7 أيام

serializer = URLSafeTimedSerializer(SECRET_KEY, salt="alnoor-auth-session")


def hash_password(password: str) -> str:
    """تجزئة كلمة المرور باستخدام PBKDF2-HMAC-SHA256 مع ملح عشوائي."""
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120_000)
    return f"pbkdf2_sha256${salt}${digest.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    """التحقق الآمن من تطابق كلمة المرور."""
    try:
        algorithm, salt, hex_digest = stored_hash.split("$", 2)
        if algorithm != "pbkdf2_sha256":
            return False
        candidate = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt.encode("utf-8"), 120_000
        ).hex()
        return hmac.compare_digest(candidate, hex_digest)
    except Exception:
        return False


def verify_admin_password(password: str) -> bool:
    """التحقق من كلمة مرور المشرف عبر مقارنة آمنة زمنياً."""
    return hmac.compare_digest(password.encode("utf-8"), ADMIN_PASSWORD.encode("utf-8"))


def create_session_token(payload: dict) -> str:
    """إنشاء رمز جلسة موقّع."""
    return serializer.dumps(payload)


def decode_session_token(token: str) -> Optional[dict]:
    """فك تشفير رمز الجلسة والتحقق من صلاحيته."""
    try:
        return serializer.loads(token, max_age=SESSION_MAX_AGE_SECONDS)
    except (BadSignature, SignatureExpired):
        return None


def get_session_data(request: Request) -> dict:
    """قراءة بيانات الجلسة الحالية من ملف تعريف الارتباط."""
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        return {}
    return decode_session_token(token) or {}


def get_current_user(request: Request, db: Session = Depends(get_db)) -> Optional[User]:
    """جلب المستخدم المسجل حالياً إن وُجد."""
    session = get_session_data(request)
    user_id = session.get("user_id")
    if not user_id:
        return None
    return db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()


def is_admin_session(request: Request, db: Session = Depends(get_db)) -> bool:
    """التحقق مما إذا كانت الجلسة الحالية مخولة لصلاحيات الإدارة."""
    session = get_session_data(request)
    if session.get("is_admin") is True:
        return True
    user_id = session.get("user_id")
    if user_id:
        user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()
        if user and user.role == "admin":
            return True
    return False


def require_admin(request: Request, db: Session = Depends(get_db)) -> bool:
    """فرض حماية المسارات الإدارية وإعادة توجيه غير المصرح لهم."""
    if not is_admin_session(request, db):
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            headers={"Location": "/admin/login"},
        )
    return True
