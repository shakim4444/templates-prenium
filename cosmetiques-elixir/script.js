window.DEMO_TOKENS={"MARQUE": "ÉLIXIR LAB", "PRODUIT": "AURELIA Nº7", "FORMULE": "98.7% SKIN-LOVING FORMULA", "INGREDIENT_1": "WHITE ROSE", "INGREDIENT_2": "GREEN TEA", "INGREDIENT_3": "GOLDEN PEPTIDE", "CTA": "DISCOVER THE RITUAL", "WHATSAPP_URL": "https://wa.me/22607429563", "TELEPHONE": "+226 07 42 95 63"};

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