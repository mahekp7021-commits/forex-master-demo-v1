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



  // Master demo navigation — adapted from the approved FXCentrum24 reference structure.
  // The reference ZIP remains untouched; all links point to pages inside this demo repo.
  const masterNavItems = [
    ["Markets", [
      ["Market Overview", "markets.html"], ["Forex", "markets/forex.html"],
      ["Commodities", "markets/commodities.html"], ["Indices", "markets/indices.html"],
      ["Shares CFDs", "markets/shares-cfds.html"], ["Cryptocurrency", "markets/cryptocurrency.html"]
    ]],
    ["Trading", [
      ["Trading Overview", "trading.html"], ["Account Types", "trading/account-types.html"],
      ["Trading Conditions", "trading/trading-conditions.html"], ["How to Start", "trading/how-to-start.html"],
      ["Pricing & Fees", "pricing.html"]
    ]],
    ["Platforms", [
      ["MetaTrader 4", "platforms/metatrader-4.html"], ["MetaTrader 5", "platforms/metatrader-5.html"],
      ["WebTrader", "platforms/webtrader.html"]
    ]],
    ["Accounts", [
      ["Standard", "accounts/standard.html"], ["Premium", "accounts/premium.html"],
      ["Professional", "accounts/professional.html"], ["Open an Account", "trading/account-opening.html"]
    ]],
    ["Tools", [
      ["Economic Calendar", "tools/economic-calendar.html"], ["Trading Calculator", "trading-calculator.html"],
      ["Trading Signals", "trading-signals.html"], ["VPS Hosting", "vps.html"]
    ]],
    ["Company", [
      ["About Us", "company/about.html"], ["Benefits", "company/benefits.html"],
      ["Contact Us", "company/contact.html"], ["Careers", "careers.html"],
      ["Education Hub", "education.html"], ["Trading Guides", "trading-guides.html"],
      ["Market Analysis", "market-analysis.html"], ["Blog & News", "blog.html"],
      ["Webinars", "webinars.html"], ["Downloads", "downloads.html"],
      ["Help & Support", "support.html"], ["FAQ", "faq.html"],
      ["Legal Center", "legal.html"], ["Client Agreement", "legal/client-agreement.html"],
      ["Terms & Conditions", "legal/terms-and-conditions.html"], ["Privacy Policy", "legal/privacy-policy.html"],
      ["Risk Disclosure", "legal/risk-disclosure.html"], ["AML Policy", "legal/aml-policy.html"]
    ]],
    ["Payment", [
      ["Deposits", "trading/deposit.html"], ["Withdrawals", "trading/withdrawal.html"]
    ]],
    ["Partnership", [
      ["Partnership Programme", "partnership/index.html"], ["Partner Account Opening", "partnership/account-opening.html"]
    ]]
  ];

  const buildMasterNav = () => {
    const nav = document.querySelector(".main-nav");
    if (!nav) return;
    const nested = location.pathname.split("/").filter(Boolean).length > 1;
    const prefix = nested ? "../" : "";

    // The imported source pages use a different header stylesheet; normalize the
    // generated menu so the same navigation works on every page and on mobile.
    if (!document.getElementById("forex-master-nav-compat")) {
      const navStyle = document.createElement("style");
      navStyle.id = "forex-master-nav-compat";
      navStyle.textContent = `
        .main-nav .nav-menu{position:relative;display:block;flex:0 0 auto}
        .main-nav .nav-menu>summary{list-style:none;cursor:pointer;white-space:nowrap;font-weight:700;padding:10px 0;color:#e1e9e4}
        .main-nav .nav-menu>summary::-webkit-details-marker{display:none}
        .main-nav .nav-menu>summary:after{content:"⌄";font-size:10px;margin-left:5px;color:#10f59d}
        .main-nav .nav-menu[open]>summary,.main-nav .nav-menu>summary:hover{color:#10f59d}
        .main-nav .nav-dropdown{position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);width:245px;max-height:70vh;overflow:auto;padding:8px;display:none;background:rgba(4,15,12,.98);border:1px solid rgba(16,245,157,.22);border-radius:14px;box-shadow:0 24px 55px rgba(0,0,0,.55);z-index:1200}
        .main-nav .nav-menu[open]>.nav-dropdown{display:block}
        .main-nav .nav-dropdown a{display:block;padding:10px 12px;border-radius:8px;white-space:normal;color:#cbd2cf;font-size:13px}
        .main-nav .nav-dropdown a:hover{background:rgba(16,245,157,.08);color:#d9ff45}
        @media(max-width:900px){
          .main-nav.open,.main-nav.is-open{display:flex!important;position:absolute!important;top:100%!important;left:0!important;right:0!important;max-height:calc(100vh - 80px);overflow:auto;flex-direction:column!important;align-items:stretch!important;gap:0!important;padding:12px 22px!important;background:rgba(4,13,10,.98)!important;border-bottom:1px solid rgba(16,245,157,.16)!important;z-index:1200}
          .main-nav.open>a,.main-nav.is-open>a,.main-nav .nav-menu>summary{padding:13px 8px!important;text-align:left}
          .main-nav .nav-dropdown{position:static!important;left:auto!important;top:auto!important;transform:none!important;width:100%!important;max-height:none!important;margin:0 0 8px!important;box-shadow:none!important}
          .nav-actions{gap:10px}
        }
      `;
      document.head.appendChild(navStyle);
    }
    nav.innerHTML = "";
    masterNavItems.forEach(([label, target]) => {
      if (typeof target === "string") {
        const a = document.createElement("a");
        a.href = prefix + target;
        a.textContent = label;
        nav.appendChild(a);
        return;
      }
      const item = document.createElement("details");
      item.className = "nav-menu";
      const summary = document.createElement("summary");
      summary.textContent = label;\n      summary.setAttribute("aria-label", label + " menu");
      const dropdown = document.createElement("div");
      dropdown.className = "nav-dropdown";
      target.forEach(([childLabel, childTarget]) => {
        const a = document.createElement("a");
        a.href = prefix + childTarget;
        a.textContent = childLabel;
        dropdown.appendChild(a);
      });
      item.append(summary, dropdown);
      nav.appendChild(item);
    });
  };
  buildMasterNav();

  // Keep the header actions compact and consistent with a broker website.
  document.querySelectorAll(".nav-actions .btn").forEach((button) => {
    button.href = (location.pathname.split("/").filter(Boolean).length > 1 ? "../" : "") + "trading/account-opening.html";
    button.innerHTML = 'Open Account <span aria-hidden="true">→</span>';
    button.setAttribute("aria-label", "Open an account");
  });

  // Close the mobile menu after selecting a destination.
  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      const currentNav = document.querySelector(".main-nav");
      currentNav?.classList.remove("open", "is-open");
      menu?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    document.querySelectorAll(".nav-menu[open]").forEach((item) => {
      if (!item.contains(event.target)) item.removeAttribute("open");
    });
  });

});
