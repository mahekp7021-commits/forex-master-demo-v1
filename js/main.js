document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("revealed"));
  }

  // Stats counters: start from zero whenever the page is opened/refreshed.
  const statsSection = document.querySelector(".stats");
  const statNumbers = Array.from(document.querySelectorAll(".stat-number"));

  const formatStatValue = (value, el) => {
    const compact = el.dataset.compact === "true";
    const suffix = el.dataset.suffix || "";

    if (compact) {
      const k = value / 1000;
      const decimals = Number(el.dataset.decimals || 0);
      const rounded = Number(k.toFixed(decimals));
      return rounded.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + "K" + suffix.replace("K", "");
    }

    return Math.round(value).toLocaleString("en-US") + suffix;
  };

  const runStatCounters = () => {
    statNumbers.forEach((el) => {
      const target = Number(el.dataset.target || 0);
      const duration = 1800;
      const start = performance.now();

      el.dataset.counted = "true";

      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatStatValue(target * eased, el);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = formatStatValue(target, el);
        }
      };

      requestAnimationFrame(tick);
    });
  };

  if (statsSection && statNumbers.length) {
    statNumbers.forEach((el) => {
      el.dataset.counted = "";
      el.textContent = formatStatValue(0, el);
    });

    if ("IntersectionObserver" in window) {
      const statsObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          runStatCounters();
          statsObserver.disconnect();
        }
      }, { threshold: 0.2 });

      statsObserver.observe(statsSection);
    } else {
      runStatCounters();
    }
  }

  // Mobile testimonial slider
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  const track = document.querySelector(".testimonial-track");
  let slideIndex = 0;

  const updateTestimonials = () => {
    if (!track || window.innerWidth > 900) return;

    const cards = Array.from(track.children);
    if (!cards.length) return;

    slideIndex = Math.max(0, Math.min(cards.length - 1, slideIndex));
    track.style.display = "flex";
    track.style.transition = "transform .35s ease";
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    cards.forEach((card) => {
      card.style.minWidth = "100%";
    });
  };

  prev?.addEventListener("click", () => {
    slideIndex -= 1;
    updateTestimonials();
  });

  next?.addEventListener("click", () => {
    slideIndex += 1;
    updateTestimonials();
  });

  window.addEventListener("resize", () => {
    if (!track) return;

    if (window.innerWidth > 900) {
      track.style.transform = "";
      track.style.display = "grid";
      Array.from(track.children).forEach((card) => {
        card.style.minWidth = "";
      });
    } else {
      updateTestimonials();
    }
  });

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  // Back-to-top visibility
  const backTop = document.querySelector(".back-top");
  const updateBackTop = () => {
    if (!backTop) return;
    backTop.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", updateBackTop, { passive: true });
  updateBackTop();

  // Premium trader visual parallax.
  // Only decorative layers move; the woman/cards/text keep their own CSS animations.
  const traderStage = document.querySelector(".girl-stage");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (traderStage && !reduceMotion) {
    const layers = [
      [".market-glow-a", 5],
      [".market-glow-b", -4],
      [".market-orbit-a", 3],
      [".market-orbit-b", -4],
      [".girl-aura", 2],
      [".girl-stage .lime-shape", 1]
    ];

    traderStage.addEventListener("pointermove", (event) => {
      const rect = traderStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      layers.forEach(([selector, depth]) => {
        const element = traderStage.querySelector(selector);
        if (element) {
          element.style.translate = `${x * depth}px ${y * depth}px`;
        }
      });
    });

    traderStage.addEventListener("pointerleave", () => {
      layers.forEach(([selector]) => {
        const element = traderStage.querySelector(selector);
        if (element) element.style.translate = "";
      });
    });
  }
});
