/**
 * JK Poultries — script.js
 * Full GSAP animation suite: hero egg drop, scroll triggers,
 * parallax, nutrition bars, timeline, reviews slider, and more.
 */

/* ============================================================
   SETUP & PLUGIN REGISTRATION
   ============================================================ */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ============================================================
   SECTION 1: PAGE LOADER
   Fades out after content is ready + GSAP hero timeline starts
   ============================================================ */
function initLoader() {
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.6,
      delay: 1.8, // let the bar fill animation complete
      ease: 'power2.out',
      onComplete: () => {
        loader.style.display = 'none';
        initHeroAnimation(); // kick off hero timeline after loader hides
      }
    });
  });
}

/* ============================================================
   SECTION 2: HERO EGG ANIMATION
   GSAP Timeline:
   1. Egg drops from top with bounce
   2. Egg lands → slight shake (crack effect)
   3. Crack lines appear
   4. Logo / eyebrow fades in
   5. Headline lines stagger in
   6. Sub text & buttons fade up
   7. Badges slide up
   8. Egg slowly zooms forward (scale up)
   ============================================================ */
function initHeroAnimation() {
  const heroEgg     = document.getElementById('heroEgg');
  const crackLines  = document.querySelector('.crack-lines') || heroEgg?.querySelector('#crackLines');
  const eyebrow     = document.getElementById('heroEyebrow');
  const htLine1     = document.getElementById('htLine1');
  const htLine2     = document.getElementById('htLine2');
  const heroDesc    = document.getElementById('heroDesc');
  const heroBtns    = document.getElementById('heroBtns');
  const heroBadges  = document.getElementById('heroBadges');
  const scrollCue   = document.getElementById('scrollCue');

  if (!heroEgg) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Set initial states
  gsap.set(heroEgg, { y: -window.innerHeight * 0.8, scale: 0.7, opacity: 0 });
  gsap.set([eyebrow, htLine1, htLine2, heroDesc, heroBtns, heroBadges, scrollCue], { opacity: 0, y: 30 });

  // 1. Egg drops from top
  tl.to(heroEgg, {
    y: 0, scale: 1, opacity: 1,
    duration: 1.0,
    ease: 'bounce.out'
  })

  // 2. Bounce settle (slight overshoot)
  .to(heroEgg, {
    scaleX: 1.08, scaleY: 0.94,
    duration: 0.12,
    ease: 'power1.inOut'
  })
  .to(heroEgg, {
    scaleX: 1, scaleY: 1,
    duration: 0.2,
    ease: 'elastic.out(1, 0.5)'
  })

  // 3. Crack shake — rapid micro-jitter
  .to(heroEgg, {
    rotation: -4, x: -6,
    duration: 0.06, ease: 'power1.inOut', yoyo: true, repeat: 5
  })
  .to(heroEgg, { rotation: 0, x: 0, duration: 0.08 })

  // 4. Crack lines appear
  .to('#crackLines', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.05')

  // 5. Eyebrow / badge
  .to(eyebrow, { opacity: 1, y: 0, duration: 0.5 }, '-=0.1')

  // 6. Title lines stagger
  .to(htLine1, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
  .to(htLine2, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')

  // 7. Description
  .to(heroDesc, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')

  // 8. Buttons
  .to(heroBtns, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')

  // 9. Badges
  .to(heroBadges, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')

  // 10. Scroll cue
  .to(scrollCue, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')

  // 11. Egg slowly zooms forward (scale + subtle float)
  .to(heroEgg, {
    scale: 1.12,
    y: -18,
    filter: 'drop-shadow(0 40px 80px rgba(180,83,9,0.28))',
    duration: 4,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  }, '-=1');
}

/* ============================================================
   SECTION 3: CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  if (window.innerWidth <= 768) return; // skip on touch

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    gsap.set(dot, { x: mouseX, y: mouseY });
  });

  // Ring follows with lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    gsap.set(ring, { x: ringX, y: ringY });
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .product-card, .review-card, input, select, textarea');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ============================================================
   SECTION 4: NAVBAR — scroll-aware
   ============================================================ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobLinks  = document.querySelectorAll('.mob-link');

  // Scroll class
  ScrollTrigger.create({
    start: 80,
    onEnter:       () => navbar.classList.add('scrolled'),
    onLeaveBack:   () => navbar.classList.remove('scrolled'),
  });

  // Hamburger toggle
  let menuOpen = false;
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileNav.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    // Animate hamburger → X
    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      gsap.to(spans[0], { rotation: 45, y: 7, duration: 0.3 });
      gsap.to(spans[1], { opacity: 0, duration: 0.2 });
      gsap.to(spans[2], { rotation: -45, y: -7, duration: 0.3 });
    } else {
      gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(spans[1], { opacity: 1, duration: 0.2 });
      gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
    }
  });

  // Close on nav link click
  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      const spans = hamburger.querySelectorAll('span');
      gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(spans[1], { opacity: 1, duration: 0.2 });
      gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
    });
  });

  // Smooth scroll for all nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 72 },
          duration: 1.0,
          ease: 'power3.inOut'
        });
      }
    });
  });
}

/* ============================================================
   SECTION 5: ABOUT — PARALLAX + TEXT SLIDE-IN
   ============================================================ */
function initAbout() {
  const imgWrap  = document.getElementById('aboutImgWrap');
  const aboutCopy = document.getElementById('aboutCopy');

  if (!imgWrap || !aboutCopy) return;

  // Parallax on the farm image
  gsap.to(imgWrap, {
    yPercent: -12,
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end:   'bottom top',
      scrub: 1.5,
    }
  });

  // Text slides in from the right
  const copyChildren = aboutCopy.querySelectorAll('.section-tag, .section-title, .about-para, .about-pillars, .btn-primary');
  gsap.fromTo(copyChildren,
    { opacity: 0, x: 60 },
    {
      opacity: 1, x: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#about',
        start: 'top 70%',
        toggleActions: 'play none none none',
      }
    }
  );

  // Float card
  gsap.fromTo('.about-float-card',
    { opacity: 0, scale: 0.8, y: 20 },
    {
      opacity: 1, scale: 1, y: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '#about',
        start: 'top 60%',
      }
    }
  );
}

/* ============================================================
   SECTION 6: PRODUCTS — STAGGER CARD REVEAL
   ============================================================ */
function initProducts() {
  const cards = document.querySelectorAll('.product-card');
  if (!cards.length) return;

  gsap.fromTo('#eggsHead',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#eggs', start: 'top 75%' }
    }
  );

  gsap.fromTo(cards,
    { opacity: 0, y: 60, scale: 0.94 },
    {
      opacity: 1, y: 0, scale: 1,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#productsGrid', start: 'top 80%' }
    }
  );
}

/* ============================================================
   SECTION 7: QUALITY — EGG CRACKING ANIMATION
   When the section enters viewport, the egg visually cracks open:
   - Top half slides up
   - Bottom half slides down
   - Yolk and white are revealed
   ============================================================ */
function initQualityCrack() {
  const eggTop    = document.getElementById('eggTop');
  const eggBottom = document.getElementById('eggBottom');
  const eggWhite  = document.getElementById('eggWhite');
  const eggYolk   = document.getElementById('eggYolk');
  const yolkShine = document.getElementById('yolkShine');
  const crackCTA  = document.getElementById('crackCTA');
  const nBars     = document.querySelectorAll('.n-fill');

  if (!eggTop) return;

  const crackTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#quality',
      start: 'top 55%',
      toggleActions: 'play none none none',
    }
  });

  // Crack open
  crackTl
    .to(crackCTA,  { opacity: 0, duration: 0.3 })
    .to(eggTop,    { attr: { transform: 'translate(0, -60)' }, duration: 0.7, ease: 'power2.inOut' })
    .to(eggBottom, { attr: { transform: 'translate(0, 40)' },  duration: 0.7, ease: 'power2.inOut' }, '-=0.7')
    .to(eggWhite,  { opacity: 1, scaleY: 1.15, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    .to(eggYolk,   { opacity: 1, y: -10, duration: 0.5, ease: 'back.out(2)' }, '-=0.2')
    .to(yolkShine, { opacity: 1, duration: 0.3 }, '-=0.1');

  // Nutrition bar fill — staggered after crack
  ScrollTrigger.create({
    trigger: '#quality',
    start: 'top 55%',
    onEnter: () => {
      setTimeout(() => {
        nBars.forEach(bar => {
          const pct = bar.dataset.pct || 50;
          bar.style.width = pct + '%';
        });
      }, 800); // slight delay after crack
    }
  });

  // Quality section text
  const nutritionChildren = document.querySelectorAll('#nutritionPanel .section-tag, #nutritionPanel .section-title, #nutritionPanel .section-sub-sm, .n-bar-row, .q-badge');
  gsap.fromTo(nutritionChildren,
    { opacity: 0, x: 40 },
    {
      opacity: 1, x: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#quality', start: 'top 60%' }
    }
  );
}

/* ============================================================
   SECTION 8: PROCESS TIMELINE ANIMATION
   The connecting line grows as you scroll, each step activates
   ============================================================ */
function initProcess() {
  const steps      = document.querySelectorAll('.process-step');
  const lineFill   = document.getElementById('processLineFill');

  if (!steps.length || !lineFill) return;

  // Grow the vertical line
  gsap.fromTo(lineFill,
    { height: '0%' },
    {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '#processTimeline',
        start: 'top 70%',
        end:   'bottom 60%',
        scrub: 1,
      }
    }
  );

  // Activate each step as it enters
  steps.forEach((step, i) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 65%',
      onEnter: () => step.classList.add('active'),
    });

    // Stagger entrance
    gsap.fromTo(step,
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 78%',
        }
      }
    );
  });

  // Section heading
  gsap.fromTo('#processHead',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      scrollTrigger: { trigger: '#process', start: 'top 75%' }
    }
  );
}

/* ============================================================
   SECTION 9: REVIEWS SLIDER
   Manual drag/button carousel with GSAP transitions
   ============================================================ */
function initReviews() {
  const track   = document.getElementById('reviewsTrack');
  const dotsWrap = document.getElementById('rcDots');
  const prevBtn = document.getElementById('rcPrev');
  const nextBtn = document.getElementById('rcNext');

  if (!track) return;

  const cards = track.querySelectorAll('.review-card');
  const total = cards.length;

  // Determine visible count based on viewport
  function getVisible() {
    if (window.innerWidth < 600)  return 1;
    if (window.innerWidth < 900)  return 2;
    return 3;
  }

  let current = 0;

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const pages = Math.ceil(total / getVisible());
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.className = 'rc-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Page ${i + 1}`);
      d.addEventListener('click', () => goTo(i * getVisible()));
      dotsWrap.appendChild(d);
    }
  }

  function updateDots() {
    const page = Math.floor(current / getVisible());
    dotsWrap.querySelectorAll('.rc-dot').forEach((d, i) => {
      d.classList.toggle('active', i === page);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - getVisible()));
    const cardWidth = cards[0].getBoundingClientRect().width + 24; // gap = 24px
    gsap.to(track, {
      x: -current * cardWidth,
      duration: 0.7,
      ease: 'power3.out'
    });
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - getVisible()));
  nextBtn.addEventListener('click', () => goTo(current + getVisible()));

  // Auto-advance every 5s
  setInterval(() => {
    const nextIndex = current + getVisible() >= total ? 0 : current + getVisible();
    goTo(nextIndex);
  }, 5000);

  // Rebuild on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      current = 0;
      buildDots();
      goTo(0);
    }, 300);
  });

  buildDots();

  // Section entrance
  gsap.fromTo('#reviewsHead',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      scrollTrigger: { trigger: '#reviews', start: 'top 75%' }
    }
  );

  gsap.fromTo(cards,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#reviews', start: 'top 70%' }
    }
  );
}

/* ============================================================
   SECTION 10: ENQUIRY FORM — FLASK BACKEND SUBMIT
   ============================================================ */
function initOrderForm() {
  const form      = document.getElementById('enquiryForm');
  const submitBtn = document.getElementById('enquirySubmitBtn');
  const btnText   = submitBtn?.querySelector('.btn-text');
  const btnLoader = submitBtn?.querySelector('.btn-loader');
  const success   = document.getElementById('enquirySuccess');
  const error     = document.getElementById('enquiryError');

  if (!form) return;

  // Section entrance
  gsap.fromTo('#orderCopy',
    { opacity: 0, x: -50 },
    {
      opacity: 1, x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#enquire', start: 'top 70%' }
    }
  );
  gsap.fromTo('#orderFormWrap',
    { opacity: 0, x: 50, scale: 0.96 },
    {
      opacity: 1, x: 0, scale: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#enquire', start: 'top 70%' }
    }
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    // UI loading state
    if (btnText)   btnText.style.display   = 'none';
    if (btnLoader) btnLoader.style.display = 'inline';
    submitBtn.disabled = true;
    success.style.display = 'none';
    error.style.display   = 'none';

    const data = {
      name:    form.name.value.trim(),
      phone:   form.phone.value.trim(),
      email:   form.email.value.trim(),
      city:    form.city.value.trim(),
      product: form.product.value,
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch('/api/enquiry', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      if (res.ok) {
        form.reset();
        success.style.display = 'block';
        gsap.fromTo(success, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      // Demo mode fallback if backend not running
      if (err.message === 'Failed to fetch' || err.message.includes('fetch')) {
        form.reset();
        success.style.display = 'block';
        gsap.fromTo(success, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
      } else {
        error.style.display = 'block';
      }
    } finally {
      if (btnText)   btnText.style.display   = 'inline';
      if (btnLoader) btnLoader.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
}

/* ============================================================
   SECTION 11: BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  ScrollTrigger.create({
    start: 600,
    onEnter:     () => btn.classList.add('show'),
    onLeaveBack: () => btn.classList.remove('show'),
  });

  btn.addEventListener('click', () => {
    gsap.to(window, { scrollTo: 0, duration: 1.0, ease: 'power3.inOut' });
  });
}

/* ============================================================
   SECTION 12: GENERAL SECTION HEADING REVEALS
   ============================================================ */
function initGeneralReveal() {
  // Footer fade-in
  gsap.fromTo('#footer',
    { opacity: 0 },
    {
      opacity: 1, duration: 1,
      scrollTrigger: { trigger: '#footer', start: 'top 90%' }
    }
  );
}

/* ============================================================
   SECTION 13: PARALLAX BACKGROUND ORBS (hero)
   ============================================================ */
function initParallaxOrbs() {
  gsap.to('.orb1', {
    y: -80,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end:   'bottom top',
      scrub: 2,
    }
  });
  gsap.to('.orb2', {
    y: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end:   'bottom top',
      scrub: 2.5,
    }
  });
}

/* ============================================================
   SECTION 14: LENIS-STYLE SMOOTH SCROLL (native GSAP approach)
   ============================================================ */
function initSmoothScroll() {
  // GSAP ScrollTrigger normalizeScroll for smooth experience
  ScrollTrigger.normalizeScroll(true);
}

/* ============================================================
   INIT ALL MODULES
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNavbar();
  initAbout();
  initProducts();
  initQualityCrack();
  initProcess();
  initReviews();
  initOrderForm();
  initBackToTop();
  initGeneralReveal();
  initParallaxOrbs();
  // initSmoothScroll(); // uncomment if you want GSAP normalized scroll
});

// Refresh ScrollTrigger after any layout shifts
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
