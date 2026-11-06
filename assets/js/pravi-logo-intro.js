/* PRAVI full-screen logo-to-header brand reveal. Uses the real header logo asset. */
(() => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduce || document.querySelector('.pravi-intro')) return;
  const brand = document.querySelector('.site-header .brand-logo');
  const headerBrand = document.querySelector('.site-header .brand');
  if (!brand || !headerBrand) return;

  const overlay = document.createElement('div');
  overlay.className = 'pravi-intro';
  overlay.setAttribute('role','presentation');
  overlay.innerHTML = '<div class="pravi-intro__wash"></div><div class="pravi-intro__grid"></div><div class="pravi-intro__orbit"></div><div class="pravi-intro__sweep"></div><i class="pravi-intro__spark" style="left:22%;top:31%"></i><i class="pravi-intro__spark" style="right:19%;top:62%;animation-delay:.55s"></i><p class="pravi-intro__caption">BUSINESS ADVISORS <span>·</span> FINANCE <span>·</span> GROWTH</p>';
  const logo = brand.cloneNode(true);
  logo.className = 'pravi-intro__logo';
  logo.removeAttribute('id');
  logo.setAttribute('alt','');
  logo.setAttribute('aria-hidden','true');
  overlay.appendChild(logo);
  document.body.appendChild(overlay);
  document.documentElement.classList.add('pravi-intro-active');
  const oldVisibility = brand.style.visibility;
  brand.style.visibility = 'hidden';

  const finish = () => {
    brand.style.visibility = oldVisibility;
    overlay.remove();
    document.documentElement.classList.remove('pravi-intro-active');
  };
  const start = () => {
    const target = brand.getBoundingClientRect();
    const initialWidth = Math.min(window.innerWidth * (window.innerWidth < 600 ? .94 : .88),760);
    const initialHeight = initialWidth * 225 / 640;
    const initial = {left:(window.innerWidth-initialWidth)/2,top:window.innerHeight*.45-initialHeight/2,width:initialWidth,height:initialHeight};
    overlay.classList.add('is-playing');
    logo.animate([
      {left:'50%',top:'45%',width:initialWidth+'px',height:'auto',transform:'translate(-50%,-50%) scale(.82)',opacity:0},
      {left:'50%',top:'45%',width:initialWidth+'px',height:'auto',transform:'translate(-50%,-50%) scale(1.04)',opacity:1,offset:.24},
      {left:(target.left+target.width/2)+'px',top:(target.top+target.height/2)+'px',width:target.width+'px',height:'auto',transform:'translate(-50%,-50%) scale(1)',opacity:1}
    ],{duration:1900,easing:'cubic-bezier(.22,.72,.18,1)',fill:'forwards'});
    window.setTimeout(()=>{
      overlay.animate([{opacity:1},{opacity:0}],{duration:480,easing:'ease-out',fill:'forwards'}).onfinish=finish;
    },1640);
    window.setTimeout(finish,2500);
  };
  requestAnimationFrame(()=>requestAnimationFrame(start));
})();
