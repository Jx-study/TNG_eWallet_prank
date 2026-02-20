/* ============================================
   Tipu 'n Gone — State Machine + Fireworks
   script.js
   ============================================ */

const VIEWS = ['view-1', 'view-2', 'view-3', 'view-4', 'view-5'];

function showView(id) {
  VIEWS.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

function isTngApp() {
  return navigator.userAgent.toLowerCase().includes('tngdwebview');
}

/* ── Fireworks ── */
const COLORS = ['#FFE566', '#FFB300', '#FF6E6E', '#FFF', '#FF4D4D', '#FFECB3', '#FF9800'];

function launchFirework(container) {
  const x = 10 + Math.random() * 80;
  const y = 5  + Math.random() * 45;
  const count = 10 + Math.floor(Math.random() * 8);
  const dur   = 0.7 + Math.random() * 0.5;
  const len   = 40  + Math.random() * 50;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  const flash = document.createElement('div');
  flash.className = 'fw-flash';
  const size = 20 + Math.random() * 20;
  flash.style.cssText = `
    left: calc(${x}% - ${size / 2}px);
    top:  calc(${y}% - ${size / 2}px);
    width:  ${size}px;
    height: ${size}px;
    --fw-dur: ${dur}s;
  `;
  container.appendChild(flash);

  for (let i = 0; i < count; i++) {
    const angle  = (360 / count) * i;
    const height = 2 + Math.random() * 3;
    const p = document.createElement('div');
    p.className = 'fw-particle';
    p.style.cssText = `
      left: ${x}%;
      top:  ${y}%;
      height: ${height}px;
      background: ${color};
      --fw-angle: ${angle}deg;
      --fw-len:   ${len}px;
      --fw-dur:   ${dur}s;
    `;
    container.appendChild(p);
  }

  setTimeout(() => {
    flash.remove();
    container.querySelectorAll('.fw-particle').forEach(p => p.remove());
  }, (dur + 0.1) * 1000);
}

function startFireworks(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;
  launchFirework(container);
  launchFirework(container);
  return setInterval(() => {
    launchFirework(container);
    if (Math.random() > 0.5) setTimeout(() => launchFirework(container), 200);
  }, 900);
}

let fwInterval4 = null;
let fwInterval5 = null;
let flowTimeouts = [];

function clearFlowTimeouts() {
  flowTimeouts.forEach(id => clearTimeout(id));
  flowTimeouts = [];
}

/* ── Progress bar ── */
function resetProgress() {
  const fill = document.getElementById('progress-fill');
  if (!fill) return;
  fill.style.transition = 'none';
  fill.style.width = '0%';
}

function startProgress() {
  const fill = document.getElementById('progress-fill');
  if (!fill) return;

  const duration = 2000 + Math.random() * 3000;
  fill.style.transition = `width ${duration}ms linear`;
  fill.getBoundingClientRect(); // force reflow
  fill.style.width = '100%';

  const t = setTimeout(() => {
    showView('view-4');
    fwInterval4 = startFireworks('sparks-4');
  }, duration);
  flowTimeouts.push(t);
}

/* ── Entry point ── */
function startFlow() {
  clearFlowTimeouts();

  if (isTngApp()) {
    showView('view-4');
    fwInterval4 = startFireworks('sparks-4');
    return;
  }

  showView('view-1');

  flowTimeouts.push(setTimeout(() => {
    showView('view-2');
  }, 1500));

  flowTimeouts.push(setTimeout(() => {
    showView('view-3');
    resetProgress();
    setTimeout(() => startProgress(), 50);
  }, 3500));
}

/* ── Init ── */
startFlow();

/* ── Back button ── */
document.getElementById('btn-back').addEventListener('click', () => {
  clearInterval(fwInterval4);
  fwInterval4 = null;
  startFlow();
});

/* ── view-4 → view-5 ── */
document.getElementById('btn-open').addEventListener('click', () => {
  clearInterval(fwInterval4);
  fwInterval4 = null;
  const c4 = document.getElementById('sparks-4');
  if (c4) c4.innerHTML = '';

  showView('view-5');
  fwInterval5 = startFireworks('sparks-5');
});

/* ── view-5: close → restart ── */
document.getElementById('btn-close').addEventListener('click', () => {
  clearInterval(fwInterval5);
  fwInterval5 = null;
  const c5 = document.getElementById('sparks-5');
  if (c5) c5.innerHTML = '';

  startFlow();
});
