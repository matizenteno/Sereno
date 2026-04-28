/* ── BLOB BACKGROUND ── */
(function(){
  const stage = document.getElementById('blob-stage');
  const configs = [
    {c:'58,86,66', o:.11, w:600, h:500, x:.10, y:.08, tx:70,  ty:100, ts:1.15, dur:24},
    {c:'58,86,66', o:.09, w:520, h:480, x:.72, y:.50, tx:-90, ty:70,  ts:1.10, dur:30},
    {c:'58,86,66', o:.08, w:480, h:420, x:.40, y:.82, tx:55,  ty:-70, ts:1.20, dur:35},
    {c:'181,88,58',o:.08, w:420, h:380, x:.88, y:.10, tx:-65, ty:90,  ts:1.10, dur:27},
    {c:'181,88,58',o:.07, w:360, h:340, x:.18, y:.62, tx:85,  ty:-75, ts:1.15, dur:32},
    {c:'181,88,58',o:.06, w:300, h:280, x:.58, y:.28, tx:-55, ty:65,  ts:1.05, dur:26},
    {c:'196,146,58',o:.07,w:380, h:340, x:.48, y:.15, tx:75,  ty:85,  ts:1.10, dur:36},
    {c:'196,146,58',o:.06,w:320, h:300, x:.08, y:.45, tx:-75, ty:-85, ts:1.20, dur:29},
    {c:'196,146,58',o:.05,w:280, h:260, x:.82, y:.78, tx:55,  ty:-55, ts:1.08, dur:33},
    {c:'58,86,66', o:.06, w:650, h:600, x:.32, y:.52, tx:-45, ty:45,  ts:1.05, dur:40},
  ];
  configs.forEach(cfg => {
    const el = document.createElement('div');
    el.className = 'blob';
    const jx = (Math.random()-.5)*80, jy = (Math.random()-.5)*120;
    const W = window.innerWidth, H = Math.max(document.body.scrollHeight, 4000);
    const rx = [48,52,44,56].map(v=>v+(Math.random()-.5)*8);
    const ry = [50,46,54,50].map(v=>v+(Math.random()-.5)*8);
    el.style.cssText = [
      `width:${cfg.w}px`, `height:${cfg.h}px`,
      `left:${cfg.x*W+jx-cfg.w/2}px`, `top:${cfg.y*H+jy-cfg.h/2}px`,
      `background:rgba(${cfg.c},${cfg.o})`,
      `--tx:${cfg.tx+(Math.random()-.5)*40}px`, `--ty:${cfg.ty+(Math.random()-.5)*40}px`, `--ts:${cfg.ts}`,
      `animation-duration:${cfg.dur}s`,
      `animation-delay:${-(Math.random()*cfg.dur)}s`,
      `border-radius:${rx[0]}% ${rx[1]}% ${rx[2]}% ${rx[3]}% / ${ry[0]}% ${ry[1]}% ${ry[2]}% ${ry[3]}%`,
    ].join(';');
    stage.appendChild(el);
  });
})();

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: .12 });
revealEls.forEach(el => revealObs.observe(el));

/* ── NAV SCROLL ── */
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── COUNTER ANIMATION ── */
function animateCounter(el, target, duration=1400) {
  const start = performance.now();
  const update = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1-p, 3);
    el.textContent = Math.round(ease * target);
    if(p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      const target = parseInt(e.target.dataset.target);
      animateCounter(e.target, target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: .5 });
document.querySelectorAll('.stat-counter').forEach(el => counterObs.observe(el));

/* ── FAQ ACCORDION ── */
function toggleFaq(qEl) {
  const item = qEl.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if(!isOpen) item.classList.add('open');
}

/* ── PRICING TOGGLE ── */
const prices = { monthly: { ind:'$29', cen:'$89', pi:'mensual', pc:'mensual' }, annual: { ind:'$23', cen:'$71', pi:'anual', pc:'anual' } };
function setToggle(mode) {
  document.getElementById('toggle-monthly').classList.toggle('active', mode==='monthly');
  document.getElementById('toggle-annual').classList.toggle('active', mode==='annual');
  document.getElementById('price-ind').textContent = prices[mode].ind;
  document.getElementById('price-cen').textContent = prices[mode].cen;
  document.getElementById('period-ind').textContent = prices[mode].pi;
  document.getElementById('period-cen').textContent = prices[mode].pc;
}

/* ── WAITLIST ── */
const KEY = 'sereno_v3_waitlist';
const getList = () => { try { return JSON.parse(localStorage.getItem(KEY)||'[]'); } catch{ return []; } };
const saveList = l => localStorage.setItem(KEY, JSON.stringify(l));
function updateCount() { const el = document.getElementById('wl-count'); if(el) el.textContent = getList().length; }
updateCount();

document.getElementById('wl-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const fd = new FormData(this);
  const entry = {
    nombre: fd.get('nombre'), email: fd.get('email'),
    ciudad: fd.get('ciudad'), pacientes: fd.get('pacientes'),
    dolor: fd.get('dolor'), fecha: new Date().toISOString()
  };
  const list = getList(); list.push(entry); saveList(list);
  this.style.display = 'none';
  document.getElementById('wl-success').style.display = 'block';
  updateCount();
  console.log('✅ Nuevo contacto Sereno:', entry);
});

/* ── CURSOR GLOW (desktop) ── */
if(window.matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position:'fixed', width:'300px', height:'300px', borderRadius:'50%',
    background:'radial-gradient(circle, rgba(58,86,66,.06) 0%, transparent 70%)',
    pointerEvents:'none', zIndex:'1', transform:'translate(-50%,-50%)',
    transition:'left .12s ease, top .12s ease',
    left:'-300px', top:'-300px',
  });
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}
