"""مسارات تحسين محركات البحث (SEO) وتطبيق الويب التقدمي (PWA)."""

from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from models import Article, CharityProject, Course, Section

router = APIRouter(tags=["SEO & PWA"])


@router.get("/robots.txt", include_in_schema=False)
def robots_txt(request: Request):
    """ملف توجيه عناكب البحث."""
    base_url = str(request.base_url).rstrip("/")
    content = "\n".join(
        [
            "User-agent: *",
            "Allow: /",
            "Disallow: /admin",
            "Disallow: /admin/login",
            "Disallow: /account",
            f"Sitemap: {base_url}/sitemap.xml",
            "",
        ]
    )
    return Response(content=content, media_type="text/plain; charset=utf-8")


@router.get("/sitemap.xml", include_in_schema=False)
def sitemap_xml(request: Request, db: Session = Depends(get_db)):
    """توليد خريطة الموقع الديناميكية من قاعدة البيانات."""
    base_url = str(request.base_url).rstrip("/")
    static_paths = [
        ("/", "daily", "1.0"),
        ("/quran", "weekly", "0.9"),
        ("/tahfiz", "weekly", "0.9"),
        ("/islamic-sciences", "weekly", "0.9"),
        ("/library", "weekly", "0.85"),
        ("/courses", "weekly", "0.9"),
        ("/fatwas", "weekly", "0.85"),
        ("/adhkar", "monthly", "0.8"),
        ("/charity", "weekly", "0.9"),
        ("/about", "monthly", "0.7"),
        ("/contact", "monthly", "0.7"),
    ]

    urls_xml = []
    for path, freq, priority in static_paths:
        urls_xml.append(
            f"  <url><loc>{base_url}{path}</loc><changefreq>{freq}</changefreq><priority>{priority}</priority></url>"
        )

    for section in db.query(Section).order_by(Section.sort_order).all():
        urls_xml.append(
            f"  <url><loc>{base_url}/sections/{section.slug}</loc><changefreq>weekly</changefreq><priority>0.85</priority></url>"
        )

    for article in db.query(Article.id).all():
        urls_xml.append(
            f"  <url><loc>{base_url}/articles/{article.id}</loc><changefreq>monthly</changefreq><priority>0.75</priority></url>"
        )

    for course in db.query(Course.id).all():
        urls_xml.append(
            f"  <url><loc>{base_url}/courses/{course.id}</loc><changefreq>weekly</changefreq><priority>0.75</priority></url>"
        )

    for project in db.query(CharityProject.id).all():
        urls_xml.append(
            f"  <url><loc>{base_url}/projects/{project.id}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>"
        )

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    xml += "\n".join(urls_xml)
    xml += "\n</urlset>\n"
    return Response(content=xml, media_type="application/xml; charset=utf-8")


@router.get("/manifest.json", include_in_schema=False)
def pwa_manifest():
    """ملف تعريف تطبيق الويب التقدمي (PWA Manifest)."""
    manifest = {
        "id": "/",
        "name": "النور الإسلامي العالمي الخيري الشامل",
        "short_name": "النور",
        "description": "نور القرآن، علمٌ ينتفع به، وخيرٌ يمتد إلى العالم — منصة لتحفيظ القرآن والعلوم الشرعية والعمل الخيري.",
        "start_url": "/",
        "scope": "/",
        "display": "standalone",
        "dir": "rtl",
        "lang": "ar",
        "theme_color": "#0F294A",
        "background_color": "#FFFFFF",
        "icons": [
            {
                "src": "/static/icons/pwa-192x192.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "any",
            },
            {
                "src": "/static/icons/pwa-512x512.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "any",
            },
            {
                "src": "/static/icons/pwa-maskable-512x512.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "maskable",
            },
        ],
    }
    return JSONResponse(content=manifest, media_type="application/manifest+json")


@router.get("/sw.js", include_in_schema=False)
def service_worker():
    """عامل الخدمة (Service Worker) لتسريع التحميل وتوفير العمل الأساسي دون اتصال."""
    js = """const CACHE_NAME = "alnoor-global-v1";
const PRECACHE_URLS = [
  "/",
  "/quran",
  "/adhkar",
  "/static/css/style.css",
  "/static/js/app.js",
  "/static/icons/pwa-192x192.png",
  "/static/icons/pwa-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/static/")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((resp) => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return resp;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
"""
    return Response(content=js, media_type="application/javascript; charset=utf-8")
