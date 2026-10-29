/* Glencoe Farm B&B — interactions */
(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav scroll state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");
  const setMenu = open => {
    navLinks.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    nav.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && navLinks.classList.contains("is-open")) setMenu(false);
  });

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  /* ---------- parallax (hero + band) ---------- */
  if (!reduceMotion) {
    const heroMedia = document.querySelector("[data-parallax] img");
    const bandImg = document.querySelector("[data-parallax-band] .band__img");
    const band = document.querySelector("[data-parallax-band]");
    let ticking = false;
    const parallax = () => {
      const y = window.scrollY;
      if (heroMedia && y < window.innerHeight * 1.2) {
        heroMedia.style.transform = `translateY(${y * 0.28}px)`;
      }
      if (band && bandImg) {
        const r = band.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
          bandImg.style.transform = `translateY(${p * -60}px)`;
        }
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }

  /* ---------- testimonials carousel ---------- */
  const carousel = document.getElementById("carousel");
  const reviews = [...carousel.querySelectorAll(".review")];
  const dotsWrap = document.getElementById("reviewDots");
  let idx = 0, timer;

  reviews.forEach((_, i) => {
    const d = document.createElement("button");
    d.setAttribute("aria-label", `Go to review ${i + 1}`);
    if (i === 0) d.classList.add("is-active");
    d.addEventListener("click", () => go(i, true));
    dotsWrap.appendChild(d);
  });
  const dots = [...dotsWrap.children];

  const go = (i, manual) => {
    idx = (i + reviews.length) % reviews.length;
    reviews.forEach((r, n) => r.classList.toggle("is-active", n === idx));
    dots.forEach((d, n) => d.classList.toggle("is-active", n === idx));
    if (manual) restart();
  };
  const restart = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 7000); };
  document.getElementById("prevReview").addEventListener("click", () => go(idx - 1, true));
  document.getElementById("nextReview").addEventListener("click", () => go(idx + 1, true));
  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", restart);
  restart();

  /* ---------- lightbox gallery ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");
  const triggers = [...document.querySelectorAll("[data-full]")];
  let cur = 0;

  const showLb = i => {
    cur = (i + triggers.length) % triggers.length;
    const t = triggers[cur];
    lbImg.src = t.dataset.full;
    lbImg.alt = t.dataset.caption || "";
    lbCap.textContent = t.dataset.caption || "";
  };
  const openLb = i => {
    showLb(i);
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  };
  const closeLb = () => {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { lb.hidden = true; lbImg.src = ""; }, 350);
  };

  triggers.forEach((t, i) => t.addEventListener("click", () => openLb(i)));
  document.getElementById("lbClose").addEventListener("click", closeLb);
  document.getElementById("lbPrev").addEventListener("click", () => showLb(cur - 1));
  document.getElementById("lbNext").addEventListener("click", () => showLb(cur + 1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(cur - 1);
    if (e.key === "ArrowRight") showLb(cur + 1);
  });

  /* ---------- enquiry form → mailto ---------- */
  document.getElementById("enquiryForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const lines = [
      `Name: ${f.get("name")}`,
      `Email: ${f.get("email")}`,
      f.get("arrival") ? `Arrival: ${f.get("arrival")}` : null,
      f.get("nights") ? `Nights: ${f.get("nights")}` : null,
      "",
      f.get("message") || ""
    ].filter(l => l !== null).join("\n");
    const subject = encodeURIComponent(`Booking enquiry — ${f.get("name")}`);
    const body = encodeURIComponent(lines);
    window.location.href = `mailto:Glencoefarm1@googlemail.com?subject=${subject}&body=${body}`;
  });

  /* ---------- back to top ---------- */
  const toTop = document.getElementById("toTop");
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.8);
  }, { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
