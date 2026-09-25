document.addEventListener("DOMContentLoaded",()=>{const menu=document.querySelector(".menu-toggle"),nav=document.querySelector(".main-nav");if(menu){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",open)})}nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu?.setAttribute("aria-expanded","false")}));const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("revealed");observer.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

  // Stats counters: reset to 0 on every page load and animate once when the section enters the viewport.
  const statsSection=document.querySelector(".stats");
  const statNumbers=[...document.querySelectorAll(".stat-number")];
  const formatStatValue=(value,el)=>{
    const compact=el.dataset.compact==="true";
    const suffix=el.dataset.suffix||"";
    if(compact){
      const k=value/1000;
      const decimals=Number(el.dataset.decimals||0);
      const rounded=Number(k.toFixed(decimals));
      return rounded.toLocaleString("en-US",{minimumFractionDigits:decimals,maximumFractionDigits:decimals})+"K"+suffix.replace("K","");
    }
    return Math.round(value).toLocaleString("en-US")+suffix;
  };
  const runStatCounters=()=>{
    statNumbers.forEach(el=>{
      if(el.dataset.counted==="true")return;
      el.dataset.counted="true";
      const target=Number(el.dataset.target||0);
      const duration=1800;
      const start=performance.now();
      const tick=now=>{
        const progress=Math.min(1,(now-start)/duration);
        const eased=1-Math.pow(1-progress,3);
        el.textContent=formatStatValue(target*eased,el);
        if(progress<1)requestAnimationFrame(tick);
        else el.textContent=formatStatValue(target,el);
      };
      requestAnimationFrame(tick);
    });
  };
  if(statsSection&&statNumbers.length){
    statNumbers.forEach(el=>{el.dataset.counted="";});
    const statsObserver=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){
        runStatCounters();
        statsObserver.disconnect();
      }
    },{threshold:.2});
    statsObserver.observe(statsSection);
  }const prev=document.querySelector(".prev"),next=document.querySelector(".next"),track=document.querySelector(".testimonial-track");let x=0;const slide=d=>{if(!track)return;const card=track.querySelector(".testimonial");if(!card)return;x+=d;const max=Math.max(0,track.children.length-1);x=Math.max(0,Math.min(max,x));if(window.innerWidth<=900){track.style.transform=`translateX(-${x*100}%)`;track.style.display="flex";track.style.transition="transform .35s ease";track.children[0].style.minWidth="100%";[...track.children].forEach(c=>c.style.minWidth="100%")} };prev?.addEventListener("click",()=>slide(-1));next?.addEventListener("click",()=>slide(1));window.addEventListener("resize",()=>{if(track&&window.innerWidth>900){track.style.transform="";track.style.display="grid";[...track.children].forEach(c=>c.style.minWidth="")}});document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{const id=a.getAttribute("href");if(id&&id!=="#"){const target=document.querySelector(id);if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"})}}}));});