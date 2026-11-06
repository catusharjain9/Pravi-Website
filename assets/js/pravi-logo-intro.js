/* PRAVI extended full-screen identity film. Original SVG motion inspired by the supplied visual references. */
(() => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduce || document.querySelector('.pravi-intro')) return;
  const brand = document.querySelector('.site-header .brand-logo');
  const headerBrand = document.querySelector('.site-header .brand');
  if (!brand || !headerBrand) return;
  const contourPaths = Array.from({length:13},(_,i)=>{
    const y=90+i*43, amp=28+(i%4)*9;
    return '<path d="M-100 '+y+' C 120 '+(y-amp)+', 230 '+(y+amp)+', 430 '+y+' S 760 '+(y-amp)+', 980 '+y+' S 1290 '+(y+amp)+', 1640 '+(y-12)+'"/>';
  }).join('');
  const skyline = '<svg class="pravi-intro__skyline" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true">'+
    '<path d="M0 330H1440 M0 350H1440"/>'+
    '<path d="M90 330V220H150V330 M102 220V190H138V220 M110 190V175H130V190 M104 250H136 M104 275H136"/>'+
    '<path d="M220 330V140H310V330 M235 140V105H295V140 M248 105V84H282V105 M235 175H295 M235 210H295 M235 245H295"/>'+
    '<path d="M370 330V245L430 190L490 245V330 M390 225V170H470V225 M405 170V140H455V170 M430 140V115"/>'+
    '<path d="M560 330V95H650V330 M575 95V65H635V95 M590 65V42H620V65 M575 145H635 M575 190H635 M575 235H635"/>'+
    '<path d="M730 330V205H820V330 M748 205V160H802V205 M760 160V130H790V160 M748 245H802"/>'+
    '<path d="M900 330V130H990V330 M915 130V95H975V130 M930 95V68H960V95 M915 180H975 M915 225H975"/>'+
    '<path d="M1080 330V225L1140 175L1200 225V330 M1098 208V155H1182V208 M1115 155V125H1165V155"/>'+
    '<path d="M1270 330V165H1350V330 M1285 165V130H1335V165 M1300 130V105H1320V130 M1285 210H1335 M1285 255H1335"/>'+
    '<path d="M0 300C180 275 250 320 420 292S700 280 860 300S1190 270 1440 298" stroke="#b88719" stroke-opacity=".35"/>'+
    '</svg>';
  const overlay = document.createElement('div');
  overlay.className = 'pravi-intro';
  overlay.setAttribute('role','presentation');
  overlay.innerHTML = '<div class="pravi-intro__wash"></div><div class="pravi-intro__grid"></div>'+
    '<svg class="pravi-intro__contours" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+contourPaths+'</svg>'+
    skyline+'<div class="pravi-intro__orbit"></div>'+
    '<svg class="pravi-intro__doodle" viewBox="0 0 800 420" aria-hidden="true"><circle cx="400" cy="210" r="178"/><circle cx="400" cy="210" r="155"/><path d="M160 210c42-92 112-143 240-148M520 62l-8 24 25-7M640 210c-42 92-112 143-240 148M280 350l8-24-25 7"/></svg>'+
    '<div class="pravi-intro__brush"></div><i class="pravi-intro__spark" style="left:22%;top:31%"></i>'+
    '<i class="pravi-intro__spark" style="right:19%;top:62%;animation-delay:3.1s"></i>'+
    '<p class="pravi-intro__caption">BUSINESS ADVISORS <span>·</span> FINANCE <span>·</span> GROWTH</p>';
  const logo = brand.cloneNode(true);
  logo.className = 'pravi-intro__logo';
  logo.removeAttribute('id');
  logo.setAttribute('alt','');
  logo.setAttribute('aria-hidden','true');
  overlay.appendChild(logo);
  document.body.appendChild(overlay);
  const oldVisibility = brand.style.visibility;
  brand.style.visibility = 'hidden';
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    brand.style.visibility = oldVisibility;
    overlay.remove();
  };
  const start = async () => {
    try { if (logo.decode) await logo.decode(); } catch (_) {}
    if (!document.body.contains(overlay)) return;
    const target = brand.getBoundingClientRect();
    const initialWidth = Math.min(window.innerWidth * (window.innerWidth < 600 ? .94 : .88),760);
    const initialHeight = initialWidth * 225 / 640;
    const centerTop = window.innerHeight * (window.innerWidth < 600 ? .42 : .43);
    overlay.classList.add('is-playing');
    logo.animate([
      {left:'50%',top:centerTop+'px',width:initialWidth+'px',height:initialHeight+'px',transform:'translate(-50%,-50%) scale(.52)',opacity:0,offset:0},
      {left:'50%',top:centerTop+'px',width:initialWidth+'px',height:initialHeight+'px',transform:'translate(-50%,-50%) scale(1.06)',opacity:1,offset:.22},
      {left:'50%',top:centerTop+'px',width:initialWidth+'px',height:initialHeight+'px',transform:'translate(-50%,-50%) scale(.98)',opacity:1,offset:.67},
      {left:(target.left+target.width/2)+'px',top:(target.top+target.height/2)+'px',width:target.width+'px',height:(target.width*225/640)+'px',transform:'translate(-50%,-50%) scale(1)',opacity:1,offset:1}
    ],{duration:5700,easing:'cubic-bezier(.2,.72,.18,1)',fill:'forwards'});
    window.setTimeout(()=>{
      overlay.animate([{opacity:1},{opacity:0}],{duration:650,easing:'ease-out',fill:'forwards'}).onfinish=finish;
    },5350);
    window.setTimeout(finish,6200);
  };
  requestAnimationFrame(()=>requestAnimationFrame(start));
})();
