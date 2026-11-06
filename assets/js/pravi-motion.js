/* PRAVI motion direction: restrained editorial choreography.
 * Powered by Motion (MIT): https://github.com/motiondivision/motion
 * No decorative overlays; animation reinforces the existing content hierarchy.
 */
(async () => {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  let motion;
  try {
    motion = await import('https://cdn.jsdelivr.net/npm/motion@14.10.0/+esm');
  } catch (error) {
    console.warn('PRAVI motion library unavailable; content remains visible.', error);
    return;
  }
  const { animate, inView, stagger } = motion;
  const ease = [0.22, 0.61, 0.36, 1];

  // Hero: one composed entrance, with copy leading and the finance panel following.
  const hero = document.querySelector('.hero');
  if (hero) {
    const copy = hero.querySelector('.hero-copy');
    const dashboard = hero.querySelector('.hero-dashboard');
    if (copy) {
      const parts = [...copy.children];
      animate(parts, { opacity: [0, 1], y: [22, 0] }, {
        duration: 0.72, delay: stagger(0.105, { startDelay: 0.08 }), ease
      });
    }
    if (dashboard) {
      animate(dashboard, { opacity: [0, 1], x: [28, 0], y: [8, 0] }, {
        duration: 0.9, delay: 0.22, ease
      });
      const bars = dashboard.querySelectorAll('.dashboard-bars i');
      if (bars.length) animate(bars, { scaleY: [0.12, 1], opacity: [0.35, 1] }, {
        duration: 0.78, delay: stagger(0.055, { startDelay: 0.72 }), ease
      });
      animate(dashboard, { y: [0, -5, 0] }, {
        duration: 7.5, delay: 1.3, repeat: Infinity, ease: 'easeInOut'
      });
    }
  }

  // Scroll reveals are applied only to meaningful content blocks, not every wrapper.
  const selectors = [
    '.section-heading', '.quick-start-card', '.service-layer', '.value-point',
    '.process-node', '.process-step', '.audience-card', '.journey-card',
    '.case-card', '.tool-card', '.resource-card', '.service-card',
    '.deliverable', '.resource-feature', '.guide-card', '.insight-card',
    '.checklist-item', '.calculator-card', '.faq-item', '.content-card',
    '.stat-card', '.metric-card', '.timeline-item', '.contact-method',
    '.article-card', '.tax-card'
  ];
  const targets = [...document.querySelectorAll(selectors.join(','))];
  const parents = new Map();
  targets.forEach(el => {
    if (el.closest('.hero')) return;
    const parent = el.parentElement;
    const n = parents.get(parent) || 0;
    parents.set(parent, n + 1);
    el.style.willChange = 'transform, opacity';
    inView(el, () => {
      const controls = animate(el, { opacity: [0, 1], y: [18, 0] }, {
        duration: 0.66, delay: Math.min(n, 4) * 0.075, ease
      });
      return () => controls.stop();
    }, { amount: 0.12, margin: '0px 0px -7% 0px' });
  });

  // Deliberate, small hover response on real interactive cards.
  const hoverTargets = document.querySelectorAll(
    '.service-layer, .quick-start-card, .journey-card, .audience-card, .resource-card, .insight-card, .tool-card'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('pointerenter', () => {
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        animate(el, { y: -4 }, { duration: 0.24, ease });
      }
    });
    el.addEventListener('pointerleave', () => animate(el, { y: 0 }, { duration: 0.32, ease }));
  });

  // Buttons respond to pointer press with a short tactile compression.
  document.querySelectorAll('.btn, .footer-cta-button').forEach(el => {
    el.addEventListener('pointerdown', () => animate(el, { scale: 0.975 }, { duration: 0.12 }));
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(type =>
      el.addEventListener(type, () => animate(el, { scale: 1 }, { duration: 0.2, ease }))
    );
  });
})();
