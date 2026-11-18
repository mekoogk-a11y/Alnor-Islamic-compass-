"""نقطة الدخول الرئيسية لتطبيق FastAPI لمنصة النور الإسلامي العالمي الخيري الشامل."""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from database import Base, SessionLocal, engine
from routes import admin, auth_routes, public, seo_pwa
from seed import ensure_core_sections

BASE_DIR = Path(__file__).resolve().parent


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """إنشاء الجداول وتهيئة الأقسام الرئيسية الاثني عشر عند بدء التشغيل."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        ensure_core_sections(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="النور الإسلامي العالمي الخيري الشامل",
    description="منصة عالمية لتحفيظ القرآن الكريم وتعليم العلوم الشرعية ونشر المعرفة والعمل الخيري.",
    version="1.0.0",
    lifespan=lifespan,
)

# ربط القوالب والملفات الثابتة
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
app.state.templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# تسجيل جميع المسارات
app.include_router(public.router)
app.include_router(auth_routes.router)
app.include_router(admin.router)
app.include_router(seo_pwa.router)
