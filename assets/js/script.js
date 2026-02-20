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

/* ── Fireworks ── */
const COLORS = ['#FFE566', '#FFB300', '#FF6E6E', '#FFF', '#FF4D4D', '#FFECB3', '#FF9800'];

function launchFirework(container) {
  const x = 10 + Math.random() * 80; // % from left
  const y = 5  + Math.random() * 45; // % from top
  const count = 10 + Math.floor(Math.random() * 8); // 10–17 rays
  const dur   = 0.7 + Math.random() * 0.5;           // 0.7–1.2 s
  const len   = 40  + Math.random() * 50;             // px travel distance
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  // Centre flash
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

  // Ray particles
  for (let i = 0; i < count; i++) {
    const angle  = (360 / count) * i;
    const height = 2 + Math.random() * 3;  // thickness
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

  // Remove after animation finishes
  setTimeout(() => {
    flash.remove();
    container.querySelectorAll('.fw-particle').forEach(p => p.remove());
  }, (dur + 0.1) * 1000);
}

function startFireworks(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  // Burst immediately, then repeat
  launchFirework(container);
  launchFirework(container);

  return setInterval(() => {
    launchFirework(container);
    // Occasionally two at once
    if (Math.random() > 0.5) {
      setTimeout(() => launchFirework(container), 200);
    }
  }, 900);
}

let fwInterval4 = null;
let fwInterval5 = null;

/* ── State 3: progress bar ── */
function startProgress() {
  const fill = document.getElementById('progress-fill');
  if (!fill) return;

  const duration = 2000 + Math.random() * 3000; // 2–5 s
  fill.style.transition = `width ${duration}ms linear`;
  fill.getBoundingClientRect(); // force reflow
  fill.style.width = '100%';

  setTimeout(() => {
    showView('view-4');
    fwInterval4 = startFireworks('sparks-4');
  }, duration);
}

/* ── Auto flow: 1 → 2 → 3 ── */
showView('view-1');
setTimeout(() => showView('view-2'), 1500);
setTimeout(() => {
  showView('view-3');
  startProgress();
}, 1500 + 2000);

/* ── State 3: back button ── */
document.getElementById('btn-back').addEventListener('click', () => {
  clearInterval(fwInterval4);
  showView('view-1');
  setTimeout(() => showView('view-2'), 1500);
  setTimeout(() => {
    showView('view-3');
    const fill = document.getElementById('progress-fill');
    if (fill) {
      fill.style.transition = 'none';
      fill.style.width = '0%';
    }
    setTimeout(() => startProgress(), 50);
  }, 1500 + 2000);
});

/* ── State 4 → 5 ── */
document.getElementById('btn-open').addEventListener('click', () => {
  clearInterval(fwInterval4);
  // clear leftover particles
  const c4 = document.getElementById('sparks-4');
  if (c4) c4.innerHTML = '';

  showView('view-5');
  fwInterval5 = startFireworks('sparks-5');
});

/* ── State 5: close → restart ── */
document.getElementById('btn-close').addEventListener('click', () => {
  clearInterval(fwInterval5);
  const c5 = document.getElementById('sparks-5');
  if (c5) c5.innerHTML = '';

  const fill = document.getElementById('progress-fill');
  if (fill) {
    fill.style.transition = 'none';
    fill.style.width = '0%';
  }

  showView('view-1');
  setTimeout(() => showView('view-2'), 1500);
  setTimeout(() => {
    showView('view-3');
    setTimeout(() => startProgress(), 50);
  }, 1500 + 2000);
});
