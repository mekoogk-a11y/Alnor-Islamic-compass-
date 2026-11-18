/* النور الإسلامي العالمي — سكريبت التفاعل، الترجمة الفورية، مواقيت الصلاة، القرآن، وPWA */
(function () {
  const I18N = {
    ar: {
      brand: "النور الإسلامي العالمي",
      searchPlaceholder: "ابحث في المقالات، الدورات، الفتاوى...",
      searchBtn: "بحث",
      login: "دخول",
      register: "حساب جديد",
      admin: "الإدارة",
      heroTitle: "النور الإسلامي العالمي الخيري الشامل",
      heroSlogan: "نور القرآن، علمٌ ينتفع به، وخيرٌ يمتد إلى العالم.",
      heroDesc: "منصة عالمية تجمع بين تحفيظ القرآن الكريم وتعليم العلوم الإسلامية ونشر المعرفة وخدمة المجتمعات.",
      heroBtnQuran: "ابدأ رحلتك مع القرآن",
      heroBtnDonate: "ساهم في نشر الخير",
      installApp: "تثبيت التطبيق",
      prayerHeading: "مواقيت الصلاة",
      quranHeading: "القرآن الكريم — قراءة واستماع",
      servicesHeading: "الأقسام والخدمات الرئيسية",
    },
    en: {
      brand: "Al-Noor Global Islamic",
      searchPlaceholder: "Search articles, courses, fatwas...",
      searchBtn: "Search",
      login: "Sign In",
      register: "Register",
      admin: "Admin",
      heroTitle: "Al-Noor Global Islamic & Humanitarian Platform",
      heroSlogan: "The Light of the Quran, Beneficial Knowledge, and Global Charity.",
      heroDesc: "A global platform uniting Quran memorization, Islamic sciences education, authentic knowledge, and humanitarian service.",
      heroBtnQuran: "Start Your Quran Journey",
      heroBtnDonate: "Contribute to Goodness",
      installApp: "Install App",
      prayerHeading: "Prayer Times",
      quranHeading: "The Holy Quran — Read & Listen",
      servicesHeading: "Core Departments & Services",
    },
  };

  // 1. إدارة اللغة والاتجاه (RTL / LTR)
  function applyLanguage(lang) {
    const safeLang = lang === "en" ? "en" : "ar";
    document.documentElement.lang = safeLang;
    document.documentElement.dir = safeLang === "en" ? "ltr" : "rtl";
    localStorage.setItem("alnoor_lang", safeLang);

    const dict = I18N[safeLang];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) el.setAttribute("placeholder", dict[key]);
    });
    document.querySelectorAll("[data-ar][data-en]").forEach((el) => {
      el.textContent = el.getAttribute(safeLang === "en" ? "data-en" : "data-ar");
    });

    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) langBtn.textContent = safeLang === "ar" ? "English" : "عربي";
  }

  // 2. الوضع الليلي والنهاري
  function applyTheme(theme) {
    const safeTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", safeTheme);
    localStorage.setItem("alnoor_theme", safeTheme);
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) themeBtn.textContent = safeTheme === "dark" ? "☀️" : "🌙";
  }

  // 3. مواقيت الصلاة عبر Aladhan API
  function initPrayerTimes() {
    const grid = document.getElementById("prayer-times-grid");
    const statusEl = document.getElementById("prayer-status");
    const citySelect = document.getElementById("prayer-city-select");
    if (!grid) return;

    const labels = { Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء" };

    function renderTimings(timings, sourceLabel) {
      grid.innerHTML = Object.keys(labels)
        .map((key) => `<div class="prayer-slot"><div class="prayer-name">${labels[key]}</div><div class="prayer-time">${(timings[key] || "--:--").split(" ")[0]}</div></div>`)
        .join("");
      if (statusEl) statusEl.textContent = sourceLabel;
    }

    async function loadByCity(cityVal) {
      const [city, country] = (cityVal || "Makkah,Saudi Arabia").split(",");
      if (statusEl) statusEl.textContent = "جاري جلب مواقيت الصلاة...";
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`);
        const json = await res.json();
        if (json.code === 200 && json.data?.timings) {
          renderTimings(json.data.timings, `المواقيت المعتمدة لمدينة: ${city}`);
        }
      } catch (_err) {
        if (statusEl) statusEl.textContent = "تعذر الاتصال بخدمة المواقيت حالياً.";
      }
    }

    if (citySelect) {
      citySelect.addEventListener("change", () => loadByCity(citySelect.value));
    }

    const geoBtn = document.getElementById("prayer-geo-btn");
    const fetchByCoords = () => {
      if (!navigator.geolocation) {
        loadByCity(citySelect?.value);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);
            const json = await res.json();
            if (json.code === 200 && json.data?.timings) {
              renderTimings(json.data.timings, "مواقيت الصلاة حسب موقعك الجغرافي الحالي");
              return;
            }
          } catch (_e) {}
          loadByCity(citySelect?.value);
        },
        () => loadByCity(citySelect?.value),
        { timeout: 6000 }
      );
    };

    if (geoBtn) geoBtn.addEventListener("click", fetchByCoords);
    loadByCity(citySelect?.value || "Makkah,Saudi Arabia");
  }

  // 4. قارئ ومشغل القرآن الكريم عبر api.alquran.cloud
  function initQuranReader() {
    const surahSelect = document.getElementById("quran-surah-select");
    const versesBox = document.getElementById("quran-verses-box");
    const audioEl = document.getElementById("quran-audio-player");
    const playBtn = document.getElementById("quran-play-surah");
    if (!surahSelect || !versesBox) return;

    let currentAyahs = [];
    let currentIndex = 0;

    async function loadSurahsList() {
      try {
        const res = await fetch("https://api.alquran.cloud/v1/surah");
        const json = await res.json();
        if (json.code === 200 && Array.isArray(json.data)) {
          surahSelect.innerHTML = json.data
            .map((s) => `<option value="${s.number}">${s.number}. ${s.name} (${s.englishName})</option>`)
            .join("");
          loadSurahContent(1);
        }
      } catch (_err) {
        versesBox.textContent = "تعذر تحميل قائمة السور. تأكد من اتصالك بالإنترنت.";
      }
    }

    async function loadSurahContent(surahNumber) {
      versesBox.textContent = "جاري تحميل الآيات والتلاوة...";
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
        const json = await res.json();
        if (json.code === 200 && json.data?.ayahs) {
          currentAyahs = json.data.ayahs;
          currentIndex = 0;
          versesBox.innerHTML = currentAyahs
            .map((a, idx) => `<span class="ayah-item" data-idx="${idx}">${a.text} <span class="ayah-num">﴿${a.numberInSurah}﴾</span></span>`)
            .join(" ");
          if (audioEl && currentAyahs[0]?.audio) {
            audioEl.src = currentAyahs[0].audio;
          }
        }
      } catch (_err) {
        versesBox.textContent = "تعذر تحميل نص السورة حالياً.";
      }
    }

    surahSelect.addEventListener("change", () => loadSurahContent(surahSelect.value));

    if (audioEl) {
      audioEl.addEventListener("ended", () => {
        if (currentIndex + 1 < currentAyahs.length) {
          currentIndex += 1;
          audioEl.src = currentAyahs[currentIndex].audio;
          audioEl.play().catch(() => {});
        }
      });
    }

    if (playBtn && audioEl) {
      playBtn.addEventListener("click", () => {
        if (!audioEl.src && currentAyahs[0]?.audio) audioEl.src = currentAyahs[0].audio;
        if (audioEl.paused) {
          audioEl.play().catch(() => {});
        } else {
          audioEl.pause();
        }
      });
    }

    loadSurahsList();
  }

  // 5. تسجيل Service Worker ومطالبة التثبيت PWA
  function initPwa() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    let deferredPrompt = null;
    const installBtn = document.getElementById("pwa-install-btn");
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) installBtn.hidden = false;
    });

    if (installBtn) {
      installBtn.addEventListener("click", async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        installBtn.hidden = true;
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(localStorage.getItem("alnoor_lang") || "ar");
    applyTheme(localStorage.getItem("alnoor_theme") || "light");

    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        const next = (localStorage.getItem("alnoor_lang") || "ar") === "ar" ? "en" : "ar";
        applyLanguage(next);
      });
    }

    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const next = (localStorage.getItem("alnoor_theme") || "light") === "light" ? "dark" : "light";
        applyTheme(next);
      });
    }

    const menuBtn = document.getElementById("mobile-menu-btn");
    const navStrip = document.getElementById("main-nav-strip");
    if (menuBtn && navStrip) {
      menuBtn.addEventListener("click", () => navStrip.classList.toggle("open"));
    }

    initPrayerTimes();
    initQuranReader();
    initPwa();
  });
})();
