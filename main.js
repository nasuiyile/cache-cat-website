/* ============================================================
   Cache-Cat — interactions
   - Language switching (EN/ZH) with localStorage persistence
   - Mobile burger menu
   - Sticky-nav shadow on scroll
   - Scroll-reveal animation
   - Animated hero counters
   ============================================================ */
(function () {
  "use strict";

  const html = document.documentElement;
  const STORAGE_KEY = "cachecat-lang";

  /* ---------- i18n ---------- */
  function applyLang(lang) {
    const dict = I18N[lang] || I18N.en;
    html.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    html.setAttribute("data-lang", lang);
    document.title =
      lang === "zh"
        ? "Cache-Cat · 高性能强一致缓存"
        : "Cache-Cat · High-Performance Strongly-Consistent Cache";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.innerHTML = dict[key];
    });

    // toggle button label
    document.querySelectorAll("[data-lang-label]").forEach(function (el) {
      el.hidden = el.getAttribute("data-lang-label") !== lang;
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function initLang() {
    let lang = "en";
    try { lang = localStorage.getItem(STORAGE_KEY) || ""; } catch (e) {}
    if (!lang) {
      lang = (navigator.language || "en").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
    }
    applyLang(lang);

    const toggle = document.getElementById("langToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        const next = html.getAttribute("data-lang") === "zh" ? "en" : "zh";
        applyLang(next);
      });
    }
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    const burger = document.getElementById("navBurger");
    const links = document.getElementById("navLinks");
    if (!burger || !links) return;

    function close() {
      links.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }

    burger.addEventListener("click", function () {
      const open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
  }

  /* ---------- Sticky nav shadow ---------- */
  function initNavScroll() {
    const nav = document.getElementById("nav");
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const targets = document.querySelectorAll(
      ".feature-card, .vs-card, .usecase, .deep, .faq, .stat, .section-head, .intro-lead, .split-text, .split-visual, .cta-final h2"
    );
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("in"); });
      return;
    }
    targets.forEach(function (t) { t.classList.add("reveal"); });

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- Counter animation ---------- */
  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-target"), 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = document.querySelectorAll(".count");
    if (!counters.length) return;
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
      return;
    }
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initMenu();
    initNavScroll();
    initReveal();
    initCounters();
  });
})();
