(()=>{
const root=document.documentElement,themeButton=document.getElementById('theme-toggle');
const labels=JSON.parse(document.getElementById('ui-labels').textContent);
let theme='light';try{const saved=localStorage.getItem('azadeh-theme');if(saved==='dark'||saved==='light')theme=saved;}catch{}
function setTheme(value){theme=value;root.dataset.theme=value;themeButton.setAttribute('aria-pressed',String(theme==='dark'));themeButton.setAttribute('aria-label',labels.switchTheme+' · '+(theme==='dark'?labels.light:labels.dark));themeButton.title=themeButton.getAttribute('aria-label');try{localStorage.setItem('azadeh-theme',value);}catch{}}
themeButton.addEventListener('click',()=>setTheme(theme==='dark'?'light':'dark'));setTheme(theme);
const header=document.querySelector('.site-header'),menu=document.querySelector('.language-menu');
const sheet=document.getElementById('mobile-menu'),trigger=document.getElementById('menu-trigger');
const dialogs=[...document.querySelectorAll('.project-dialog')];
function showHeader(){header.classList.remove('header-hidden');header.inert=false;header.removeAttribute('aria-hidden');}
function syncLock(){document.body.classList.toggle('modal-open',!!document.querySelector('dialog[open]'));}
trigger.addEventListener('click',()=>{menu.open=false;showHeader();sheet.showModal();trigger.setAttribute('aria-expanded','true');syncLock();});
sheet.querySelector('.sheet-close').addEventListener('click',()=>sheet.close());
sheet.addEventListener('close',()=>{trigger.setAttribute('aria-expanded','false');syncLock();showHeader();trigger.focus({preventScroll:true});});
sheet.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>sheet.close()));
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const dialog=document.getElementById('project-'+button.dataset.project);dialog.showModal();syncLock();}));
for(const dialog of dialogs){dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',syncLock);}
for(const dialog of [sheet,...dialogs])dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
document.addEventListener('keydown',event=>{if(event.key==='Escape')menu.open=false;if(event.key==='Tab')showHeader();});
window.addEventListener('resize',()=>{if(window.innerWidth>1180&&sheet.open)sheet.close();},{passive:true});
let lastY=Math.max(0,window.scrollY),anchorY=lastY,direction=0,scheduled=false;
window.addEventListener('scroll',()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;const y=Math.max(0,window.scrollY),next=Math.sign(y-lastY);if(next&&next!==direction){direction=next;anchorY=lastY;}if(y<90||menu.open||sheet.open||header.matches(':focus-within')){showHeader();anchorY=y;}else if(Math.abs(y-anchorY)>14){if(direction>0){header.classList.add('header-hidden');header.inert=true;header.setAttribute('aria-hidden','true');}else showHeader();anchorY=y;}lastY=y;});},{passive:true});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('.desktop-nav a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main>section[id]').forEach(section=>observer.observe(section));}
})();
