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

  // Canonical master-demo navigation across every page.
  const mainNav = document.querySelector(".main-nav");
  if (mainNav) {
    mainNav.innerHTML = `<a href="index.html">Home</a>
<details class="nav-menu"><summary>Markets</summary><div class="nav-dropdown"><a href="markets.html">Market Overview</a><a href="forex.html">Forex</a><a href="crypto.html">Crypto</a><a href="stocks.html">Stocks</a><a href="indices.html">Indices</a><a href="commodities.html">Commodities</a></div></details>
<details class="nav-menu"><summary>Trading</summary><div class="nav-dropdown"><a href="trading.html">Trading Overview</a><a href="platforms.html">Platforms</a><a href="accounts.html">Accounts</a><a href="trading-conditions.html">Trading Conditions</a><a href="deposit-withdrawal.html">Deposit &amp; Withdrawal</a><a href="pricing.html">Pricing &amp; Fees</a></div></details>
<details class="nav-menu"><summary>Tools</summary><div class="nav-dropdown"><a href="economic-calendar.html">Economic Calendar</a><a href="trading-calculator.html">Trading Calculator</a><a href="vps.html">VPS Hosting</a><a href="trading-signals.html">Trading Signals</a></div></details>
<details class="nav-menu"><summary>Education</summary><div class="nav-dropdown"><a href="education.html">Education Hub</a><a href="trading-guides.html">Trading Guides</a><a href="market-analysis.html">Market Analysis</a><a href="webinars.html">Webinars</a><a href="faq.html">FAQ</a></div></details>
<details class="nav-menu"><summary>Company</summary><div class="nav-dropdown"><a href="about.html">About Us</a><a href="why-forex.html">Why FOREX</a><a href="regulation.html">Regulation</a><a href="partners.html">Partners / IB</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a></div></details>
<details class="nav-menu"><summary>Resources</summary><div class="nav-dropdown"><a href="resources.html">Resource Center</a><a href="blog.html">Blog &amp; News</a><a href="promotions.html">Promotions</a><a href="downloads.html">Downloads</a><a href="support.html">Help &amp; Support</a><a href="legal.html">Legal Center</a></div></details>`;
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menu?.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Close open desktop dropdowns when clicking outside.
  document.addEventListener("click", (event) => {
    document.querySelectorAll(".nav-menu[open]").forEach((item) => {
      if (!item.contains(event.target)) item.removeAttribute("open");
    });
  

const MASTER_NAV = {
  root: "",
  items: [
    ["Home","index.html"],
    ["Markets", [["Forex","forex.html"],["Commodities","commodities.html"],["Indices","indices.html"],["Shares CFDs","stocks.html"],["Cryptocurrency","crypto.html"]]],
    ["Trading", [["Account Types","accounts.html"],["Trading Conditions","trading-conditions.html"],["Platforms","platforms.html"],["How to Start","trading-guides.html"],["Open Account","signup.html"],["Deposit","deposit-withdrawal.html"],["Withdrawal","deposit-withdrawal.html"]]],
    ["Platforms", [["MetaTrader 4","platforms.html"],["MetaTrader 5","platforms.html"],["WebTrader","platforms.html"]]],
    ["Accounts", [["Standard","accounts.html"],["Premium","accounts.html"],["Professional","accounts.html"]]],
    ["Tools", [["Live Markets","markets.html"],["Economic Calendar","economic-calendar.html"]]],
    ["Company", [["About Us","about.html"],["Contact Us","contact.html"],["Benefits","why-forex.html"]]],
    ["Partnership","partners.html"]
  ]
};

const buildMasterNav = () => {
  const nav=document.querySelector(".main-nav");
  if(!nav) return;
  const base=location.pathname.includes("/") ? "" : "";
  const isNested=location.pathname.split("/").filter(Boolean).length>1;
  const prefix=isNested?"../":"";
  nav.innerHTML="";
  MASTER_NAV.items.forEach(item=>{
    if(typeof item[1]==="string"){
      const a=document.createElement("a"); a.className="nav-link"; a.href=prefix+item[1]; a.textContent=item[0]; nav.appendChild(a); return;
    }
    const wrap=document.createElement("div"); wrap.className="nav-item";
    const btn=document.createElement("button"); btn.type="button"; btn.className="nav-trigger"; btn.setAttribute("aria-expanded","false");
    btn.innerHTML='<span>'+item[0]+'</span><em>⌄</em>';
    const drop=document.createElement("div"); drop.className="dropdown";
    item[1].forEach(([label,href])=>{const a=document.createElement("a");a.href=prefix+href;a.innerHTML='<span>'+label+'</span>';drop.appendChild(a);});
    wrap.append(btn,drop); nav.appendChild(wrap);
  });
  nav.querySelectorAll(".nav-trigger").forEach(btn=>{
    btn.addEventListener("click",e=>{
      e.stopPropagation();
      const item=btn.parentElement, open=item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded",String(open));
      nav.querySelectorAll(".nav-item").forEach(other=>{if(other!==item)other.classList.remove("is-open")});
    });
  });
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open","is-open");}));
};
buildMasterNav();
document.addEventListener("click",()=>document.querySelectorAll(".nav-item.is-open").forEach(x=>x.classList.remove("is-open")));

});