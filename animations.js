/* ═══════════════════════════════════════════════
   TAHER SHAHID — GSAP TAB ANIMATIONS
   Epic transitions between tab panels
   ═══════════════════════════════════════════════ */

// ──────────────────────────────────────────────
//  CUSTOM CURSOR
// ──────────────────────────────────────────────
(function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' });
  });

  function followRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(followRing);
  }
  followRing();

  // Hover effect on interactive elements
  function bindHovers() {
    document.querySelectorAll('a, button, .nav-btn, iframe').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }
  bindHovers();
})();

// ──────────────────────────────────────────────
//  PARTICLE BACKGROUND
// ──────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const COUNT = 75;

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.3 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(107, 127, 94, ${p.alpha})`;
      ctx.fill();
    });

    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 184, 154, ${0.12 * (1 - dist / 160)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

// ──────────────────────────────────────────────
//  HEADER ENTRANCE
// ──────────────────────────────────────────────
(function initHeader() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    .to('.header-line-top', { width: '100px', duration: 0.7 }, 0.2)
    .to('#siteName', { opacity: 1, y: 0, duration: 1 }, 0.4)
    .to('#siteTagline', { opacity: 1, y: 0, duration: 0.7 }, 0.7)
    .to('.header-line-bottom', { width: '100px', duration: 0.7 }, 0.9);
})();

// ──────────────────────────────────────────────
//  NAV INDICATOR
// ──────────────────────────────────────────────
const navIndicator = document.getElementById('navIndicator');
const navInner = document.querySelector('.nav-inner');

function updateIndicator(btn) {
  if (!btn || !navIndicator || !navInner) return;
  const btnRect = btn.getBoundingClientRect();
  const navRect = navInner.getBoundingClientRect();
  navIndicator.style.left = (btnRect.left - navRect.left) + 'px';
  navIndicator.style.width = btnRect.width + 'px';
}

// Set initial indicator position
const initialActive = document.querySelector('.nav-btn.active');
if (initialActive) {
  setTimeout(() => updateIndicator(initialActive), 50);
}

window.addEventListener('resize', () => {
  const active = document.querySelector('.nav-btn.active');
  if (active) updateIndicator(active);
});

// ──────────────────────────────────────────────
//  MAGNETIC NAV BUTTONS
// ──────────────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.15, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
});

// ──────────────────────────────────────────────
//  TAB SWITCHING ENGINE
// ──────────────────────────────────────────────
let currentTab = 'about';
let isTransitioning = false;
const tabOrder = ['about', 'research', 'hobbies', 'resume'];

function getDirection(from, to) {
  return tabOrder.indexOf(to) > tabOrder.indexOf(from) ? 1 : -1;
}

function animateTabIn(panel, direction) {
  const items = panel.querySelectorAll('.anim-item');
  const heading = panel.querySelector('.anim-heading');
  const accent = panel.querySelector('.header-accent');
  const photo = panel.querySelector('.about-photo-block');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Panel entrance
  tl.fromTo(panel,
    { opacity: 0, x: direction * 80 },
    { opacity: 1, x: 0, visibility: 'visible', duration: 0.6 }
  );

  // Photo slide in (About tab)
  if (photo) {
    tl.fromTo(photo,
      { opacity: 0, x: -50, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, duration: 0.7 },
      '-=0.35'
    );
  }

  // Heading
  if (heading) {
    tl.fromTo(heading,
      { opacity: 0, y: 25 },
      {
        opacity: 1, y: 0, duration: 0.6,
        onComplete: () => heading.classList.add('animate')
      },
      '-=0.4'
    );
  }

  // Staggered items
  if (items.length) {
    tl.fromTo(items,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
      '-=0.3'
    );
  }

  // Accent line
  if (accent) {
    tl.to(accent, { width: '60px', duration: 0.5, ease: 'power2.out' }, '-=0.2');
  }

  return tl;
}

function animateTabOut(panel, direction) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.in' } });

  tl.to(panel, {
    opacity: 0,
    x: direction * -60,
    duration: 0.4,
    onComplete: () => {
      panel.classList.remove('active');
      panel.style.visibility = 'hidden';
      // Reset animation states
      panel.querySelectorAll('.anim-item').forEach(el => {
        gsap.set(el, { opacity: 0, y: 30 });
      });
      const heading = panel.querySelector('.anim-heading');
      if (heading) {
        heading.classList.remove('animate');
        gsap.set(heading, { opacity: 0, y: 25 });
      }
      const accent = panel.querySelector('.header-accent');
      if (accent) gsap.set(accent, { width: 0 });
    }
  });

  return tl;
}

function switchTab(targetTab) {
  if (targetTab === currentTab || isTransitioning) return;
  isTransitioning = true;

  const direction = getDirection(currentTab, targetTab);
  const currentPanel = document.getElementById('tab-' + currentTab);
  const targetPanel = document.getElementById('tab-' + targetTab);

  // Update nav
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.nav-btn[data-tab="${targetTab}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    updateIndicator(activeBtn);
  }

  // Scroll target panel to top
  const targetInner = targetPanel.querySelector('.tab-inner');
  if (targetInner) targetInner.scrollTop = 0;

  // Animate out → in
  const outTl = animateTabOut(currentPanel, direction);
  outTl.then(() => {
    targetPanel.classList.add('active');
    targetPanel.style.visibility = 'visible';
    const inTl = animateTabIn(targetPanel, direction);
    inTl.then(() => {
      isTransitioning = false;
      currentTab = targetTab;
    });
  });

  currentTab = targetTab;
}

// Nav click handlers
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
  });
});

// ──────────────────────────────────────────────
//  INITIAL TAB ANIMATION (About)
// ──────────────────────────────────────────────
(function initFirstTab() {
  const aboutPanel = document.getElementById('tab-about');
  if (!aboutPanel) return;

  // Delay so header animation plays first
  gsap.delayedCall(1.2, () => {
    animateTabIn(aboutPanel, 1);
  });
})();

// ──────────────────────────────────────────────
//  KEYBOARD NAVIGATION
// ──────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  const idx = tabOrder.indexOf(currentTab);
  if (e.key === 'ArrowRight' && idx < tabOrder.length - 1) {
    switchTab(tabOrder[idx + 1]);
  } else if (e.key === 'ArrowLeft' && idx > 0) {
    switchTab(tabOrder[idx - 1]);
  }
});

console.log('🌿 GSAP tab animations initialized');
