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


})();
