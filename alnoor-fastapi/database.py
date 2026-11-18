"""إعداد اتصال قاعدة بيانات SQLite عبر SQLAlchemy لمنصة النور الإسلامي العالمي."""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# مسار قاعدة البيانات المحلية مع إمكانية التخصيص عبر متغير البيئة
DATABASE_URL = os.getenv("ALNOOR_DATABASE_URL", "sqlite:///./alnoor.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """توفير جلسة قاعدة بيانات وإغلاقها تلقائياً بعد انتهاء الطلب."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
