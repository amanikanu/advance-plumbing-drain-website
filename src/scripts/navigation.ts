import './privacy';
import './mobile-navigation';
const groups=Array.from(document.querySelectorAll<HTMLElement>('.nav-group'));function closeAll(except?:HTMLElement){groups.forEach(g=>{if(g!==except){g.querySelector('button')?.setAttribute('aria-expanded','false');const d=g.querySelector<HTMLElement>('.dropdown');if(d)d.hidden=true}})}
groups.forEach(g=>{const b=g.querySelector('button'),d=g.querySelector<HTMLElement>('.dropdown');if(!b||!d)return;b.addEventListener('click',()=>{const open=d.hidden;closeAll(g);d.hidden=!open;b.setAttribute('aria-expanded',String(open))});g.addEventListener('focusout',e=>{if(!(e.relatedTarget&&g.contains(e.relatedTarget as Node))){b.setAttribute('aria-expanded','false');d.hidden=true}});g.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAll();b.focus()}})});
document.addEventListener('click',e=>{if(!(e.target as Element).closest('.nav-group'))closeAll()});

// A cached static page must not display a banner after its end date.
document.querySelectorAll<HTMLElement>('[data-expires]').forEach(el=>{if(Date.parse(el.dataset.expires+'T23:59:59-08:00')<Date.now())el.hidden=true});
