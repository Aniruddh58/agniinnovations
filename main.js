// Theme handling
(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem("agni-theme");
  if (stored === "dark") {
    root.setAttribute("data-theme", "dark");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  // Nav active highlighting
  const page = document.body.dataset.page;
  document
    .querySelectorAll(".site-nav a[data-nav]")
    .forEach((link) => {
      if (link.dataset.nav === page) {
        link.classList.add("active");
      }
    });

  // Mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // Theme toggle
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const root = document.documentElement;
      const isDark = root.getAttribute("data-theme") === "dark";
      root.setAttribute("data-theme", isDark ? "" : "dark");
      localStorage.setItem("agni-theme", isDark ? "light" : "dark");
    });
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // Counters
  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length && "IntersectionObserver" in window) {
    const cObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = Number(el.dataset.target || 0);
            let current = 0;
            const duration = 900;
            const start = performance.now();

            function tick(now) {
              const progress = Math.min((now - start) / duration, 1);
              current = Math.floor(progress * target);
              el.textContent = current + (target >= 50 ? "+" : "");
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            cObs.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cObs.observe(c));
  }

  // Testimonials slider
  const testimonials = document.querySelectorAll(".testimonial");
  if (testimonials.length) {
    let index = 0;
    const show = (i) => {
      testimonials.forEach((t, idx) =>
        t.classList.toggle("active", idx === i)
      );
    };
    const next = () => {
      index = (index + 1) % testimonials.length;
      show(index);
    };
    const prev = () => {
      index = (index - 1 + testimonials.length) % testimonials.length;
      show(index);
    };

    const nextBtn = document.querySelector(".t-next");
    const prevBtn = document.querySelector(".t-prev");
    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    show(index);
    setInterval(next, 8000);
  }

  // Portfolio filters
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  if (filterButtons.length && portfolioItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        portfolioItems.forEach((item) => {
          const cat = item.dataset.category;
          const show = filter === "all" || filter === cat;
          item.style.display = show ? "" : "none";
        });
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-question");
    if (!q) return;
    q.addEventListener("click", () => {
      item.classList.toggle("open");
    });
  });

  // Contact form (Formspree status handling)
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  if (form && statusEl) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      statusEl.textContent = "Sending...";
      const data = new FormData(form);
      try {
        const res = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          statusEl.textContent = "✅ Your message has been sent successfully.";
          statusEl.style.color = "green";
          form.reset();
        } else {
          statusEl.textContent =
            "❌ Something went wrong. Please try again or email us directly.";
          statusEl.style.color = "red";
        }
      } catch (err) {
        statusEl.textContent =
          "❌ Network error. Please check your internet and try again.";
        statusEl.style.color = "red";
      }
    });
  }
});
