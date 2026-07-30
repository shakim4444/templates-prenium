window.DEMO_TOKENS={"MARQUE": "ATELIER NOIR", "TITRE_HERO": "ATELIER", "COLLECTION": "SS/27", "LOOK_1": "OBSIDIAN", "LOOK_2": "MONOLITH", "LOOK_3": "SILVERLINE", "LOOK_4": "AFTERIMAGE", "LOOK_5": "NOCTURNE", "BANDEAU": "NEW COLLECTION", "CTA": "EXPLORE", "TELEPHONE": "+226 07 42 95 63", "WHATSAPP_URL": "https://wa.me/22607429563"};
document.addEventListener('scroll',()=>{const s=document.querySelector('.panorama');if(!s)return;const r=s.getBoundingClientRect(),p=Math.max(0,Math.min(1,-r.top/(r.height-innerHeight)));const names=['OBSIDIAN','MONOLITH','SILVERLINE','AFTERIMAGE','NOCTURNE'];const el=document.querySelector('[data-look]');if(el)el.textContent=names[Math.min(4,Math.floor(p*5))];},{passive:true});
(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  const scenes=[...document.querySelectorAll('.scene')];
  const progressBar=document.querySelector('.progress__bar');
  let target=0,current=0,raf=0;
  function demoTokens(){
    const T=window.DEMO_TOKENS||{};
    document.title=document.title.replace(/\{\{([A-Z0-9_]+)\}\}/g,(m,k)=>T[k]??m);
    const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walk.nextNode()) nodes.push(walk.currentNode);
    nodes.forEach(n=>n.nodeValue=n.nodeValue.replace(/\{\{([A-Z0-9_]+)\}\}/g,(m,k)=>T[k]??m));
    document.querySelectorAll('[href]').forEach(el=>el.setAttribute('href',el.getAttribute('href').replace(/\{\{([A-Z0-9_]+)\}\}/g,(m,k)=>T[k]??m)));
  }
  function measure(){ target=clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)); }
  function render(){
    current=reduce?target:current+(target-current)*.085;
    document.documentElement.style.setProperty('--scroll',current.toFixed(4));
    if(progressBar) progressBar.style.transform=`scaleX(${current})`;
    scenes.forEach((s,i)=>{
      const r=s.getBoundingClientRect(), span=Math.max(1,r.height-innerHeight);
      const p=clamp(-r.top/span); s.style.setProperty('--p',p.toFixed(4)); s.style.setProperty('--e',ease(p).toFixed(4));
      s.classList.toggle('is-active',r.top<innerHeight*.55 && r.bottom>innerHeight*.45);
      const counter=s.querySelector('[data-counter]'); if(counter) counter.textContent=String(1+Math.floor(p*9)).padStart(2,'0');
    });
    if(Math.abs(current-target)>.0001) raf=requestAnimationFrame(render); else raf=0;
  }
  addEventListener('scroll',()=>{measure();if(!raf)raf=requestAnimationFrame(render)},{passive:true});
  addEventListener('resize',()=>{measure();render()});
  demoTokens(); measure(); render();
})();