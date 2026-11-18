"""نماذج قاعدة البيانات (SQLAlchemy Models) لمنصة النور الإسلامي العالمي الخيري الشامل."""

from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


def utc_now() -> datetime:
    """إرجاع التوقيت العالمي الحالي."""
    return datetime.now(timezone.utc)


class User(Base):
    """نموذج المستخدمين والمشرفين."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    role = Column(String(30), default="member", nullable=False)  # member | admin
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)


class Section(Base):
    """نموذج الأقسام والخدمات الاثني عشر الرئيسية."""

    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title_ar = Column(String(180), nullable=False)
    title_en = Column(String(180), nullable=False)
    description_ar = Column(Text, nullable=False)
    description_en = Column(Text, nullable=False)
    icon_name = Column(String(60), nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)

    articles = relationship("Article", back_populates="section", cascade="all, delete-orphan")
    lessons = relationship("Lesson", back_populates="section", cascade="all, delete-orphan")
    courses = relationship("Course", back_populates="section", cascade="all, delete-orphan")


class Lesson(Base):
    """نموذج الدروس والمحاضرات العلمية."""

    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title_ar = Column(String(220), nullable=False, index=True)
    title_en = Column(String(220), nullable=True)
    speaker = Column(String(160), nullable=False)
    summary_ar = Column(Text, nullable=False)
    summary_en = Column(Text, nullable=True)
    duration_minutes = Column(Integer, default=30, nullable=False)
    media_url = Column(String(500), nullable=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    section = relationship("Section", back_populates="lessons")


class Course(Base):
    """نموذج الدورات القرآنية والعلمية."""

    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title_ar = Column(String(220), nullable=False, index=True)
    title_en = Column(String(220), nullable=True)
    instructor = Column(String(160), nullable=False)
    level_ar = Column(String(80), default="مفتوح للجميع", nullable=False)
    duration_weeks = Column(Integer, default=4, nullable=False)
    description_ar = Column(Text, nullable=False)
    description_en = Column(Text, nullable=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=True)
    is_open = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    section = relationship("Section", back_populates="courses")


class Article(Base):
    """نموذج المقالات والأبحاث الإسلامية."""

    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title_ar = Column(String(240), nullable=False, index=True)
    title_en = Column(String(240), nullable=True)
    author = Column(String(160), nullable=False)
    summary_ar = Column(Text, nullable=False)
    content_ar = Column(Text, nullable=False)
    content_en = Column(Text, nullable=True)
    image_url = Column(String(400), nullable=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    section = relationship("Section", back_populates="articles")


class CharityProject(Base):
    """نموذج المشاريع الخيرية والإنسانية."""

    __tablename__ = "charity_projects"

    id = Column(Integer, primary_key=True, index=True)
    title_ar = Column(String(220), nullable=False, index=True)
    title_en = Column(String(220), nullable=True)
    category_ar = Column(String(100), default="مشروع خيري", nullable=False)
    location_ar = Column(String(150), default="دولي", nullable=False)
    description_ar = Column(Text, nullable=False)
    target_amount = Column(Float, default=10000.0, nullable=False)
    raised_amount = Column(Float, default=0.0, nullable=False)
    image_url = Column(String(400), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    donations = relationship("Donation", back_populates="project")


class Donation(Base):
    """نموذج التبرعات والمساهمات المسجلة."""

    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    donor_name = Column(String(160), nullable=False)
    donor_email = Column(String(180), nullable=True)
    donor_phone = Column(String(60), nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD", nullable=False)
    project_id = Column(Integer, ForeignKey("charity_projects.id"), nullable=True)
    notes = Column(Text, nullable=True)
    receipt_code = Column(String(60), unique=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    project = relationship("CharityProject", back_populates="donations")


class Scholar(Base):
    """نموذج العلماء والمعلمين المعتمدين."""

    __tablename__ = "scholars"

    id = Column(Integer, primary_key=True, index=True)
    name_ar = Column(String(180), nullable=False, index=True)
    name_en = Column(String(180), nullable=True)
    specialty_ar = Column(String(180), nullable=False)
    bio_ar = Column(Text, nullable=False)
    country_ar = Column(String(100), default="العالم الإسلامي", nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)


class NewsItem(Base):
    """نموذج أخبار وأنشطة المؤسسة."""

    __tablename__ = "news_items"

    id = Column(Integer, primary_key=True, index=True)
    title_ar = Column(String(220), nullable=False, index=True)
    title_en = Column(String(220), nullable=True)
    summary_ar = Column(Text, nullable=False)
    body_ar = Column(Text, nullable=False)
    published_at = Column(DateTime, default=utc_now, nullable=False)


class Fatwa(Base):
    """نموذج الفتاوى والاستشارات الشرعية."""

    __tablename__ = "fatwas"

    id = Column(Integer, primary_key=True, index=True)
    question_ar = Column(Text, nullable=False)
    answer_ar = Column(Text, nullable=False)
    category_ar = Column(String(100), default="فقه العبادات", nullable=False)
    scholar_name = Column(String(160), default="لجنة الفتوى", nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)


class ContactMessage(Base):
    """نموذج رسائل التواصل والاستفسارات."""

    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_name = Column(String(160), nullable=False)
    sender_email = Column(String(180), nullable=False)
    subject = Column(String(220), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
