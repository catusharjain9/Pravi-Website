(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const amount = id => Number($(id)?.value || 0);
  const money = value => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2
  }).format(Number.isFinite(value) ? value : 0);
  const output = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };

  document.querySelectorAll('[data-hub-open]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      document.querySelectorAll('.panel').forEach(panel => { panel.hidden = true; });
      const panelId = button.dataset.hubOpen === 'gst' ? 'gstcalc' : button.dataset.hubOpen;
      const panel = $(panelId);
      if (panel) {
        panel.hidden = false;
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  $('gcalc')?.addEventListener('click', () => {
    const gross = amount('ga');
    const rate = amount('gr') / 100;
    if (!Number.isFinite(gross) || !Number.isFinite(rate) || gross < 0 || rate < 0) {
      output('gres', 'Enter a valid non-negative amount and GST rate.');
      return;
    }
    const inclusive = $('gm')?.value === 'in';
    const taxable = inclusive ? (rate ? gross / (1 + rate) : gross) : gross;
    const tax = inclusive ? gross - taxable : taxable * rate;
    const total = taxable + tax;
    const taxSplit = $('gt')?.value === 'inter'
      ? `IGST: ${money(tax)}`
      : `CGST: ${money(tax / 2)}<br>SGST: ${money(tax / 2)}`;
    output('gres', `Taxable value: <strong>${money(taxable)}</strong><br>GST amount: <strong>${money(tax)}</strong><br>${taxSplit}<br>Total amount: <strong>${money(total)}</strong>`);
  });
})();
