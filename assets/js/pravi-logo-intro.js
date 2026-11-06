/* PRAVI brand reveal — actual wordmark rebuilt inline so its own elements can animate */
(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const brand=document.querySelector('.site-header .brand-logo');
  if(!brand || document.querySelector('.pravi-intro')) return;
  const paths=Array.from({length:17},(_,i)=>{
    const y=70+i*39, a=24+(i%4)*11;
    return '<path d="M-80 '+y+' C 140 '+(y-a)+', 230 '+(y+a)+', 440 '+y+' S 770 '+(y-a)+', 1010 '+y+' S 1320 '+(y+a)+', 1530 '+(y-8)+'"/>';
  }).join('');
  const overlay=document.createElement('div');
  overlay.className='pravi-intro';
  overlay.innerHTML='<svg class="pravi-intro__field" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+paths+'</svg>'+
    '<div class="pravi-intro__glow"></div>'+
    '<svg class="pravi-intro__goldline" viewBox="0 0 900 360" aria-hidden="true"><path d="M72 185 C180 30 330 20 450 28 C650 38 790 100 830 178 C780 270 650 320 450 326 C260 330 120 270 72 185Z"/></svg>'+
    '<svg class="pravi-intro__mark" viewBox="0 0 640 225" role="img" aria-label="PRAVI Business Advisors LLP">'+
    '<defs><clipPath id="praviWordReveal"><rect x="0" y="0" width="640" height="115"/></clipPath></defs>'+
    '<text class="word" x="8" y="99" fill="#1F2A2E" font-family="Poppins,Arial,sans-serif" font-size="92" font-weight="700" letter-spacing="-5">pravı</text>'+
    '<circle class="dot" cx="194" cy="29" r="10.5" fill="#F6D365"/>'+
    '<text class="tag" x="9" y="166" fill="#1F2A2E" font-family="Poppins,Arial,sans-serif" font-size="15" font-weight="600" letter-spacing="3.1">BUSINESS ADVISORS LLP</text>'+
    '<path class="rule" d="M9 190h55" stroke="#F6D365" stroke-width="2.5"/>'+
    '<text class="tag" x="78" y="200" fill="#B88719" font-family="Poppins,Arial,sans-serif" font-size="22" font-weight="600">लेखा  |  अर्थ  |  वृद्धि</text>'+
    '<path class="rule" d="M260 190h55" stroke="#F6D365" stroke-width="2.5"/></svg>'+
    '<p class="pravi-intro__signature">BUSINESS ADVISORS <span>·</span> FINANCE <span>·</span> GROWTH</p>';
  document.body.appendChild(overlay);
  const previous=brand.style.visibility;
  brand.style.visibility='hidden';
  let done=false;
  const finish=()=>{if(done)return;done=true;brand.style.visibility=previous;overlay.remove()};
  const run=()=>{
    if(!document.body.contains(overlay))return;
    const rect=brand.getBoundingClientRect();
    const w=Math.min(innerWidth*(innerWidth<600?.88:.78),680);
    const mark=overlay.querySelector('.pravi-intro__mark');
    overlay.classList.add('is-playing');
    const anim=mark.animate([
      {left:'50%',top:(innerHeight*(innerWidth<600?.42:.44))+'px',width:w+'px',transform:'translate(-50%,-50%) scale(.82)',opacity:0,offset:0},
      {left:'50%',top:(innerHeight*(innerWidth<600?.42:.44))+'px',width:w+'px',transform:'translate(-50%,-50%) scale(1)',opacity:1,offset:.24},
      {left:'50%',top:(innerHeight*(innerWidth<600?.42:.44))+'px',width:w+'px',transform:'translate(-50%,-50%) scale(1)',opacity:1,offset:.72},
      {left:(rect.left+rect.width/2)+'px',top:(rect.top+rect.height/2)+'px',width:rect.width+'px',transform:'translate(-50%,-50%) scale(1)',opacity:1,offset:1}
    ],{duration:4750,easing:'cubic-bezier(.2,.75,.18,1)',fill:'forwards'});
    anim.onfinish=()=>{overlay.animate([{opacity:1},{opacity:0}],{duration:450,easing:'ease-out',fill:'forwards'}).onfinish=finish};
    window.setTimeout(finish,5400);
  };
  requestAnimationFrame(()=>requestAnimationFrame(run));
})();
