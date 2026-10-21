/* PRAVI shared CSV safety helpers. Values are quoted and formula-like text is neutralised for spreadsheet applications. */
(() => {
  'use strict';
  function safeValue(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '';
    let s = String(value);
    // Do not change valid numeric strings (including negative amounts), but neutralise text that can be evaluated as a formula.
    const numeric = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(s.trim());
    if (!numeric && /^[\u0000-\u0020]*[=+@\-]/.test(s)) s = "'" + s;
    // Leading tab/CR can also be interpreted specially by some spreadsheet applications.
    if (/^[\t\r]/.test(s)) s = "'" + s;
    return s;
  }
  function cell(value) { return '"' + safeValue(value).replace(/"/g, '""') + '"'; }
  function serialize(rows) { return '\ufeff' + rows.map(row => row.map(cell).join(',')).join('\r\n'); }
  window.PraviCSV = Object.freeze({ safeValue, cell, serialize });
})();
