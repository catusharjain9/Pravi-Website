(() => {
  'use strict';
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-primary-nav]');
  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      const icon = toggle.querySelector('[data-menu-icon]');
      if (icon) icon.innerHTML = '<path d="M4 7h16M4 12h16M4 17h16"/>';
    };
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      const icon = toggle.querySelector('[data-menu-icon]');
      if (icon) icon.innerHTML = open ? '<path d="m6 6 12 12M18 6 6 18"/>' : '<path d="M4 7h16M4 12h16M4 17h16"/>';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); toggle.focus(); } });
    window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });
  }
  document.querySelectorAll('[data-year]').forEach(node => node.textContent = String(new Date().getFullYear()));

  // Enquiry data remains in the visitor's browser until they choose to open WhatsApp.
  const form = document.querySelector('[data-enquiry-form]');
  if (form) {
    const preference = form.elements.namedItem('contact-preference');
    const callNote = form.querySelector('[data-call-note]');
    const updateCallNote = () => { if (callNote && preference) callNote.hidden = preference.value !== 'Phone call requested (not a confirmed appointment)'; };
    if (preference && new URLSearchParams(window.location.search).get('contact') === 'call') preference.value = 'Phone call requested (not a confirmed appointment)';
    if (preference) preference.addEventListener('change', updateCallNote);
    updateCallNote();
    const alertBox = document.querySelector('[data-form-alert]');
    const required = ['name', 'email', 'service', 'message'];
    const field = name => form.elements.namedItem(name);
    const setInvalid = (name, invalid) => {
      const wrap = form.querySelector(`[data-field="${name}"]`);
      const control = field(name);
      if (wrap) wrap.dataset.invalid = String(invalid);
      if (control) control.setAttribute('aria-invalid', String(invalid));
    };
    const validate = () => {
      let valid = true;
      required.forEach(name => {
        const control = field(name);
        const value = String(control?.value ?? '').trim();
        let invalid = !value;
        if (name === 'name' && value.length < 2) invalid = true;
        if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) invalid = true;
        if (name === 'message' && value.length < 10) invalid = true;
        setInvalid(name, invalid); if (invalid) valid = false;
      });
      const consent = field('whatsapp-consent');
      const consentWrap = form.querySelector('[data-consent-field]');
      const badConsent = !consent?.checked;
      if (consentWrap) consentWrap.dataset.invalid = String(badConsent);
      if (consent) consent.setAttribute('aria-invalid', String(badConsent));
      if (badConsent) valid = false;
      return valid;
    };
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (alertBox) { alertBox.classList.remove('is-visible'); alertBox.textContent = ''; }
      if (!validate()) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      const val = name => String(field(name)?.value ?? '').trim();
      const lines = [
        'Enquiry for PRAVI BUSINESS ADVISORS LLP', '', `Name: ${val('name')}`,
        `Email: ${val('email')}`, val('phone') ? `Phone: ${val('phone')}` : '',
        val('organisation') ? `Business / organisation: ${val('organisation')}` : '',
        `Service of interest: ${val('service')}`, `Preferred follow-up: ${val('contact-preference') || 'No preference'}`, val('preferred-window') && val('preferred-window') !== 'No preference' ? `Preferred callback window: ${val('preferred-window')}` : '', val('deadline') ? `Timing / deadline: ${val('deadline')}` : '',
        '', 'Requirement:', val('message')
      ].filter(Boolean);
      const url = `https://wa.me/919173121611?text=${encodeURIComponent(lines.join('\n'))}`;
      if (alertBox) { alertBox.textContent = val('contact-preference').startsWith('Phone call requested') ? 'Opening WhatsApp with a call request prepared. Review the message and press Send there if you agree. This is not a confirmed appointment, and this website has not sent your enquiry.' : 'Opening WhatsApp with your message prepared. Review it there and press Send only if you are comfortable. This website has not sent your enquiry.'; alertBox.classList.add('is-visible'); }
      const opened = window.open(url, '_blank');
      if (!opened) window.location.href = url;
    });
    form.querySelectorAll('input,select,textarea').forEach(control => control.addEventListener('input', () => {
      if (control.name && required.includes(control.name)) setInvalid(control.name, false);
      const wrap = control.closest('[data-consent-field]'); if (wrap) wrap.dataset.invalid = 'false';
    }));
  }

  document.querySelectorAll('[data-print-button]').forEach(button => button.addEventListener('click', () => window.print()));

  // Site-wide motion system: progressive reveal, staggered groups, and accessible fallbacks.
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealSelector = [
    '.hero-copy > *', '.hero-photo-panel', '.hero-photo-panel img', '.hero-stat', '.hero-metric',
    '.value-point', '.quick-start-heading', '.quick-start-card', '.service-layer', '.section-heading',
    '.process-node', '.process-step', '.audience-card', '.journey-card', '.case-card', '.case-line',
    '.tool-card', '.resource-card', '.service-card', '.service-photo-card', '.split-grid > *',
    '.deliverable', '.cta-band > *', '.resource-feature', '.guide-card', '.insight-card',
    '.checklist-item', '.tool-panel', '.calculator-card', '.faq-item', '.content-card',
    '.stat-card', '.metric-card', '.timeline-item', '.page-hero > *', '.page-hero-inner > *', '.breadcrumb', '.service-intro', '.service-detail', '.about-callout', '.contact-method', '.article-card', '.article-note', '.tool-panel', '.tax-card', '.section > .container > *', '.section-heading + *'
  ].join(',');
  const revealTargets = [...document.querySelectorAll(revealSelector)];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('motion-in'));
  } else {
    const groups = new Map();
    revealTargets.forEach(el => {
      el.classList.add('motion-ready');
      const group = el.parentElement || document.body;
      const position = groups.get(group) || 0;
      groups.set(group, position + 1);
      el.style.setProperty('--motion-delay', `${Math.min(position, 3) * 10}ms`);
    });
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('motion-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.02, rootMargin: '0px 0px 0px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  // Small interactive cues on controls and navigation; no animation is required to use the site.
  document.querySelectorAll('.btn, button, [role="button"], .site-nav a').forEach(el => {
    el.addEventListener('pointerdown', () => { if (!reduceMotion) el.classList.add('motion-pressed'); });
    ['pointerup', 'pointercancel', 'pointerleave', 'blur'].forEach(eventName => {
      el.addEventListener(eventName, () => el.classList.remove('motion-pressed'));
    });
  });


  // Warm editorial footer CTA: shared across all pages using the site shell.
  const siteFooter = document.querySelector('.site-footer');
  if (siteFooter) {
    const footerMain = siteFooter.querySelector('.footer-main');
    if (footerMain && !siteFooter.querySelector('.footer-cta')) {
      const cta = document.createElement('section');
      cta.className = 'container footer-cta';
      cta.setAttribute('aria-label', 'Contact PRAVI Business Advisors');

      const copy = document.createElement('div');
      copy.className = 'footer-cta-copy';
      const eyebrow = document.createElement('p');
      eyebrow.className = 'footer-cta-eyebrow';
      eyebrow.textContent = 'LET’S BUILD WITH CLARITY';
      const heading = document.createElement('h2');
      heading.textContent = 'Better financial clarity starts with a conversation.';
      const description = document.createElement('p');
      description.textContent = 'Tell us where your business is today. We’ll help you identify a practical next step.';
      copy.append(eyebrow, heading, description);

      const action = document.createElement('a');
      action.className = 'footer-cta-button';
      action.href = 'contact.html';
      action.textContent = 'Discuss your requirement';
      action.setAttribute('aria-label', 'Discuss your requirement with PRAVI Business Advisors');
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      action.append(' ', arrow);

      cta.append(copy, action);
      siteFooter.insertBefore(cta, footerMain);
    }

    const footerDescription = siteFooter.querySelector('.footer-description');
    if (footerDescription && !footerDescription.textContent.trim()) {
      footerDescription.textContent = 'Practical finance, tax and compliance support for startups and growing businesses.';
    }
  }


  // PRAVI signature doodles: hand-drawn cash, ledger, compliance and growth motifs.
  // Decorative SVGs are inline, dependency-free and hidden from assistive technology.
  const doodleSvg = (kind) => {
    const common = 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
    if (kind === 'hero') return '<svg viewBox="0 0 360 280" aria-hidden="true" focusable="false">' +
      '<g class="doodle-orbit" ' + common + '><circle cx="180" cy="140" r="116" stroke-dasharray="2 8" opacity=".55"/><circle cx="180" cy="140" r="96" opacity=".32"/><path d="M180 20c66 0 120 54 120 120" class="doodle-stroke"/></g>' +
      '<g class="doodle-float" ' + common + '><circle cx="68" cy="72" r="31" class="doodle-fill"/><circle cx="68" cy="72" r="23"/><path d="M76 58c-3-5-15-6-17 1-3 9 16 7 15 16-1 8-13 10-20 3M68 51v42"/><text x="68" y="111" text-anchor="middle" class="doodle-label">CASH</text></g>' +
      '<g class="doodle-float delay" ' + common + '><rect x="246" y="35" width="68" height="84" rx="5" class="doodle-fill" transform="rotate(7 280 77)"/><path d="m258 57 42 5m-40 9 28 4m-27 9 34 5" class="doodle-stroke"/><path d="m265 105 10 0m8 1 10 1"/></g>' +
      '<g ' + common + '><path d="M45 216c38-8 49-34 79-31s43 28 68 15 36-48 64-45 38 12 55-4" class="doodle-stroke doodle-arrow"/><path d="m298 142 15 8-3-17" class="doodle-stroke"/><circle cx="124" cy="185" r="4" class="doodle-dot"/><circle cx="192" cy="200" r="4" class="doodle-dot"/><circle cx="256" cy="155" r="4" class="doodle-dot"/></g>' +
      '<g class="doodle-pulse" ' + common + '><path d="m175 39 4 10 10 4-10 4-4 10-4-10-10-4 10-4z" class="doodle-fill"/><path d="m330 192 3 7 7 3-7 3-3 7-3-7-7-3 7-3z" class="doodle-fill"/></g>' +
      '<text x="180" y="260" text-anchor="middle" class="doodle-label">MEASURE · MANAGE · MOVE</text></svg>';
    return '<svg viewBox="0 0 150 96" aria-hidden="true" focusable="false"><g ' + common + '><path d="M13 77V15q0-4 4-4h49q4 0 4 4v62q0 5-5 5H18q-5 0-5-5Z"/><path d="M23 27h36M23 39h26M23 51h31M23 63h18"/><path d="m78 67 17-17 13 7 25-32" class="doodle-animated-line"/><path d="m122 25 11-1-2 11"/><circle cx="95" cy="50" r="3" class="doodle-dot"/><circle cx="108" cy="57" r="3" class="doodle-dot"/></g></svg>';
  };
  const addDoodle = (host, kind, className) => {
    if (!host || host.querySelector(':scope > .' + className)) return;
    const node = document.createElement('div');
    node.className = className;
    node.setAttribute('aria-hidden', 'true');
    node.innerHTML = doodleSvg(kind);
    host.insertBefore(node, host.firstChild);
  };
  document.querySelectorAll('.hero, .page-hero, .cta-band').forEach((host, index) => {
    addDoodle(host, 'hero', 'pravi-doodle-scene');
    host.classList.add('has-pravi-doodles');
    host.querySelectorAll('.pravi-doodle-scene .doodle-stroke').forEach((path, i) => {
      if (!reduceMotion) path.style.animationDelay = ((index * 90 + i * 110) % 900) + 'ms';
      path.classList.add('doodle-draw');
    });
  });
  document.querySelectorAll('.section').forEach(section => {
    const hasVisualGrid = section.querySelector('.service-layer-grid,.journey-grid,.audience-grid,.quick-start-grid,.insights-grid,.resource-grid,.guide-card-grid');
    if (hasVisualGrid) {
      section.classList.add('has-doodle-corner');
      addDoodle(section, 'corner', 'doodle-corner');
    }
  });
  document.querySelectorAll('.service-layer,.journey-card,.audience-card,.resource-card,.insight-card').forEach((card, index) => {
    if (index % 2 !== 0 || card.querySelector('.doodle-card-mark')) return;
    const mark = document.createElement('span');
    mark.className = 'doodle-card-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.innerHTML = '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" stroke-dasharray="2 4"/><path d="M9 20 14 15l4 3 7-9m-6 0h6v6"/></svg>';
    card.appendChild(mark);
  });

})();
