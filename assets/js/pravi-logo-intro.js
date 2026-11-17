/* The intro animates the actual approved header logo already present in the page. */
(() => {
  const motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (motionPreference?.matches) return;
  const source = document.querySelector(".site-header .brand-logo, .header .brand img, .brand img");
  if (!source || document.querySelector(".pravi-intro")) return;
  const brand = source.tagName === "IMG" ? source : source.querySelector("img");
  if (!brand) return;

  const previousVisibility = brand.style.visibility;
  const overlay = document.createElement("div");
  overlay.className = "pravi-intro";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <svg class="pravi-intro__field" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice">
      ${Array.from({length:18},(_,i)=>{
        const y=52+i*38, lift=18+(i%5)*13;
        return `<path d="M-100 ${y} C 190 ${y-lift}, 340 ${y+lift}, 620 ${y} S 1040 ${y-lift}, 1540 ${y+12}"/>`;
      }).join("")}
    </svg>
    <svg class="pravi-intro__orbit" viewBox="0 0 900 420" aria-hidden="true">
      <path d="M70 215C165 38 340 20 450 28S735 98 830 210C740 333 576 394 450 392S160 352 70 215Z"/>
    </svg>
    <span class="pravi-intro__signature">CLARITY <i>·</i> CONTROL <i>·</i> GROWTH</span>`;
  const logo = brand.cloneNode(true);
  logo.className = "pravi-intro__mark";
  logo.alt = "";
  overlay.appendChild(logo);
  document.body.appendChild(overlay);
  brand.style.visibility = "hidden";

  const finish = () => {
    brand.style.visibility = previousVisibility;
    overlay.remove();
  };
  const target = brand.getBoundingClientRect();
  const width = Math.min(window.innerWidth * .82, 520);
  const mid = window.innerWidth < 600 ? .39 : .43;
  const animation = logo.animate([
    {left:"50%",top:(innerHeight*mid)+"px",width:width+"px",transform:"translate(-50%,-50%) scale(.72) rotate(-3deg)",opacity:0},
    {left:"50%",top:(innerHeight*mid)+"px",width:width+"px",transform:"translate(-50%,-50%) scale(1.03) rotate(1deg)",opacity:1,offset:.35},
    {left:"50%",top:(innerHeight*mid)+"px",width:width+"px",transform:"translate(-50%,-50%) scale(1) rotate(0)",opacity:1,offset:.72},
    {left:(target.left+target.width/2)+"px",top:(target.top+target.height/2)+"px",width:target.width+"px",transform:"translate(-50%,-50%) scale(1)",opacity:1}
  ],{duration:4300,easing:"cubic-bezier(.2,.75,.18,1)",fill:"forwards"});
  animation.onfinish=()=>overlay.animate([{opacity:1},{opacity:0}],{duration:420,easing:"ease-out",fill:"forwards"}).onfinish=finish;
  window.setTimeout(finish,5000);
})();
