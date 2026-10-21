(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const state = { g2b: null, pr: null, results: [], mappings: {} };
  const fields = [
    { key: 'gstin', label: 'Supplier GSTIN', required: true, aliases: ['gstinofsupplier','suppliergstin','gstin','gstinofcounterparty','gstinofrecipient','supplierregistrationnumber','suppliergstno','suppliergstnumber','gstnoofsupplier','gstno','gstnumber','partygstin'] },
    { key: 'invoice', label: 'Invoice / document number', required: true, aliases: ['invoicenumber','invoiceno','invno','documentnumber','documentno','billno','billnumber','voucherno','vouchernumber','referencenumber','referenceno','externaldocumentno','noteno','creditnoteno','debitnoteno'] },
    { key: 'doctype', label: 'Document type (optional)', aliases: ['documenttype','typeofdocument','invoicetype','notetype','vouchertype'] },
    { key: 'date', label: 'Document date (optional)', aliases: ['invoicedate','documentdate','billdate','dated','date','invoicedt'] },
    { key: 'taxable', label: 'Taxable value', required: true, aliases: ['taxablevalue','taxableamount','taxablevalueinr','taxablevalue₹','assessablevalue'] },
    { key: 'igst', label: 'IGST (optional)', aliases: ['integratedtax','igst','integratedtaxamount','igstamount'] },
    { key: 'cgst', label: 'CGST (optional)', aliases: ['centraltax','cgst','centraltaxamount','cgstamount'] },
    { key: 'sgst', label: 'SGST / UTGST (optional)', aliases: ['stateut tax','stateut taxamount','statetax','sgst','utgst','statetaxamount','sgstamount','utgstamount'] },
    { key: 'cess', label: 'Cess (optional)', aliases: ['cess','cessamount','cessvalue'] }
  ];
  const money = v => Number.isFinite(v) ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v) : '—';
  const amount = (v, blankAsNull = false) => { if (v === null || v === undefined || String(v).trim() === '') return blankAsNull ? null : NaN; if (typeof v === 'number') return Number.isFinite(v) ? v : NaN; let s = String(v).trim().replace(/[₹,\s]/g, ''); const neg = /^\(.*\)$/.test(s); s = s.replace(/[()]/g, ''); if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)) return NaN; const n = Number(s); return Number.isFinite(n) ? (neg ? -Math.abs(n) : n) : NaN; };
  const norm = v => String(v ?? '').normalize('NFKC').trim().toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const message = (id, text, error = false) => { const el = $(id); if (el) { el.textContent = text; el.classList.toggle('error', error); } };
  const value = (row, map) => { const ix = map?.[String(row.__unused ?? '')]; return ix === undefined ? '' : row[ix]; };

  function headerToken(v) { return String(v ?? '').toLowerCase().normalize('NFKC').replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, ''); }
  function detectHeader(rows) {
    let best = { index: 0, score: -1 };
    const groups = [fields.find(f => f.key === 'gstin'), fields.find(f => f.key === 'invoice'), fields.find(f => f.key === 'taxable')];
    for (let i = 0; i < Math.min(rows.length, 35); i++) {
      const tokens = (rows[i] || []).map(headerToken).filter(Boolean);
      const score = groups.reduce((sum, f) => sum + (tokens.some(t => f.aliases.some(a => { const aa = headerToken(a); return t === aa || t.includes(aa) || aa.includes(t); })) ? 3 : 0), 0) + Math.min(tokens.length, 20) / 100;
      if (score > best.score) best = { index: i, score };
    }
    return best;
  }
  function aliasesFor(field) { return field.aliases.map(headerToken); }
  function bestColumn(headers, field) {
    const aliases = aliasesFor(field);
    let bestIx = -1, bestScore = 0;
    headers.forEach((h, i) => {
      const token = headerToken(h);
      if (!token) return;
      let score = 0;
      aliases.forEach(a => { if (token === a) score = Math.max(score, 100); else if (token.includes(a) || a.includes(token)) score = Math.max(score, Math.min(token.length, a.length)); });
      if (score > bestScore) { bestIx = i; bestScore = score; }
    });
    return bestScore >= 3 ? bestIx : -1;
  }
  function workbookRows(ws) { return XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false, blankrows: false }); }
  async function loadSource(side, file) {
    if (!file) { state[side] = null; return; }
    if (file.size > 30 * 1024 * 1024) throw new Error('For browser stability, this tool accepts files up to 30 MB each. Export a smaller section or tax period and retry.');
    if (!window.XLSX) throw new Error('The spreadsheet reader did not load. Check your internet connection and reload this page.');
    const book = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: false, dense: false });
    if (!book.SheetNames.length) throw new Error('No worksheets were found in this file.');
    state[side] = { name: file.name, book, sheet: book.SheetNames[0], rows: [], headers: [], headerIndex: 0 };
    const sel = $(side === 'g2b' ? 'g2bSheet' : 'prSheet');
    sel.innerHTML = book.SheetNames.map((s, i) => `<option value="${esc(s)}" ${i === 0 ? 'selected' : ''}>${esc(s)}</option>`).join('');
    sel.disabled = book.SheetNames.length < 2;
    parseSource(side);
  }
  function parseSource(side) {
    const s = state[side]; if (!s) return;
    const sheetName = $(side === 'g2b' ? 'g2bSheet' : 'prSheet').value || s.book.SheetNames[0];
    s.sheet = sheetName;
    const allRows = workbookRows(s.book.Sheets[sheetName]);
    if (!allRows.length) throw new Error(`${s.name}: the selected worksheet is empty.`);
    const detected = detectHeader(allRows);
    if (detected.score < 6) throw new Error(`${s.name}: could not confidently identify GSTIN, document number and taxable-value headers. Choose a worksheet with tabular invoice data.`);
    s.headerIndex = detected.index;
    s.headers = (allRows[detected.index] || []).map((x, i) => String(x ?? '').trim() || `Column ${i + 1}`);
    s.rows = allRows.slice(detected.index + 1).filter(r => r.some(v => String(v ?? '').trim() !== '')).map((r, i) => Object.assign(r, { __rowNum: detected.index + i + 2 }));
    renderMappings(side);
  }
  function renderMappings(side) {
    const s = state[side]; if (!s) return;
    const host = $(side === 'g2b' ? 'g2bMap' : 'prMap');
    host.innerHTML = fields.map(f => {
      const prior = state.mappings[side]?.[f.key];
      const inferred = prior !== undefined ? Number(prior) : bestColumn(s.headers, f);
      const opts = ['<option value="">— Not mapped —</option>', ...s.headers.map((h, i) => `<option value="${i}" ${String(i) === String(inferred) ? 'selected' : ''}>${esc(h)} (col ${i + 1})</option>`)];
      return `<label class="field">${esc(f.label)}${f.required ? ' *' : ''}<select data-map-side="${side}" data-map-key="${f.key}">${opts.join('')}</select></label>`;
    }).join('');
  }
  function mappingsFromUI(side) {
    const o = {};
    document.querySelectorAll(`[data-map-side="${side}"]`).forEach(el => { o[el.dataset.mapKey] = el.value === '' ? null : Number(el.value); });
    return o;
  }
  function getCell(row, map, key) { const ix = map[key]; return ix === null || ix === undefined ? '' : row[ix]; }
  function dateCanonical(v) {
    if (v === null || v === undefined || String(v).trim() === '') return '';
    if (typeof v === 'number' && window.XLSX && v > 20000 && v < 80000) { const o = XLSX.SSF.parse_date_code(v); if (o) return `${o.y}-${String(o.m).padStart(2,'0')}-${String(o.d).padStart(2,'0')}`; }
    let s = String(v).trim();
    let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/); if (m) return `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;
    m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/); if (m) { let y = Number(m[3]); if (y < 100) y += y >= 70 ? 1900 : 2000; return `${y}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`; }
    const dt = new Date(s); return Number.isNaN(dt.getTime()) ? s.toUpperCase() : `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  }
  function record(row, map, side) {
    const gstinRaw = getCell(row, map, 'gstin'), invoiceRaw = getCell(row, map, 'invoice');
    const gstin = String(gstinRaw ?? '').trim().toUpperCase().replace(/\s+/g, '');
    const invoice = String(invoiceRaw ?? '').trim();
    const dateRaw = getCell(row, map, 'date');
    const docTypeRaw = getCell(row, map, 'doctype');
    const docType = norm(docTypeRaw);
    const optionalAmount = key => map[key] === null || map[key] === undefined ? null : amount(getCell(row, map, key), true);
    const out = { side, sourceRow: row.__rowNum, gstin, invoice, invoiceNorm: norm(invoice), docType, date: dateCanonical(dateRaw), dateRaw: String(dateRaw ?? '').trim(), taxable: amount(getCell(row, map, 'taxable')), igst: optionalAmount('igst'), cgst: optionalAmount('cgst'), sgst: optionalAmount('sgst'), cess: optionalAmount('cess') };
    out.validKey = Boolean(norm(gstin) && out.invoiceNorm);
    out.validAmounts = Number.isFinite(out.taxable) && ['igst','cgst','sgst','cess'].every(k => out[k] === null || Number.isFinite(out[k]));
    return out;
  }
  function keyFor(r, useDocType) { return `${norm(r.gstin)}|${r.invoiceNorm}${useDocType ? `|${r.docType}` : ''}`; }
  function result(status, a, b, tolerance) {
    const finite = v => Number.isFinite(v) ? v : '';
    const delta = (x,y) => Number.isFinite(x) && Number.isFinite(y) ? x-y : '';
    const taxDelta = (x,y) => x !== null && y !== null && x !== undefined && y !== undefined ? delta(x,y) : '';
    const sourceTax = (r,k) => !r || r[k] === null || r[k] === undefined ? '' : finite(r[k]);
    const z = { status, gstin: a?.gstin || b?.gstin || '', invoice: a?.invoice || b?.invoice || '', row2b: a?.side === 'g2b' ? a.sourceRow : '', rowpr: b?.side === 'pr' ? b.sourceRow : '', taxable2b: a ? finite(a.taxable) : '', taxablePR: b ? finite(b.taxable) : '', dTaxable: a && b ? delta(a.taxable,b.taxable) : '', igst2b: sourceTax(a,'igst'), igstPR: sourceTax(b,'igst'), dIGST: a && b ? taxDelta(a.igst,b.igst) : '', cgst2b: sourceTax(a,'cgst'), cgstPR: sourceTax(b,'cgst'), dCGST: a && b ? taxDelta(a.cgst,b.cgst) : '', sgst2b: sourceTax(a,'sgst'), sgstPR: sourceTax(b,'sgst'), dSGST: a && b ? taxDelta(a.sgst,b.sgst) : '', cess2b: sourceTax(a,'cess'), cessPR: sourceTax(b,'cess'), dCess: a && b ? taxDelta(a.cess,b.cess) : '', date2b: a?.dateRaw || '', datePR: b?.dateRaw || '', _a: a, _b: b };
    if (a && b) {
      const diffs = [z.dTaxable,z.dIGST,z.dCGST,z.dSGST,z.dCess].filter(d => d !== '' && d !== null && d !== undefined);
      const valueVar = diffs.some(d => Math.abs(d) > tolerance);
      const dateVar = $('matchByDate').checked && a.date && b.date && a.date !== b.date;
      z.status = valueVar && dateVar ? 'Value + date variance' : valueVar ? 'Value variance' : dateVar ? 'Date variance' : 'Matched';
    }
    return z;
  }
  function reconcile(g2bRecords, prRecords, tolerance) {
    const useDocType = state.mappings.g2b?.doctype !== null && state.mappings.g2b?.doctype !== undefined && state.mappings.pr?.doctype !== null && state.mappings.pr?.doctype !== undefined;
    const ga = new Map(), pa = new Map(), out = [];
    g2bRecords.forEach(r => { if (!r.validKey) out.push(result('Invalid key', r, null, tolerance)); else if (!r.validAmounts) out.push(result('Invalid amount', r, null, tolerance)); else { const k = keyFor(r,useDocType); if(!ga.has(k))ga.set(k,[]);ga.get(k).push(r); } });
    prRecords.forEach(r => { if (!r.validKey) out.push(result('Invalid key', null, r, tolerance)); else if (!r.validAmounts) out.push(result('Invalid amount', null, r, tolerance)); else { const k = keyFor(r,useDocType); if(!pa.has(k))pa.set(k,[]);pa.get(k).push(r); } });
    const keys = new Set([...ga.keys(),...pa.keys()]);
    keys.forEach(k => {
      const ar = ga.get(k) || [], br = pa.get(k) || [];
      if (ar.length > 1 || br.length > 1) {
        ar.forEach(a => out.push(result('Duplicate — review', a, null, tolerance)));
        br.forEach(b => out.push(result('Duplicate — review', null, b, tolerance)));
      } else if (ar.length && br.length) out.push(result('Matched',ar[0],br[0],tolerance));
      else if (ar.length) out.push(result('Only in GSTR-2B',ar[0],null,tolerance));
      else if (br.length) out.push(result('Only in purchase register',null,br[0],tolerance));
    });
    const order = {'Value + date variance':0,'Value variance':1,'Date variance':2,'Only in GSTR-2B':3,'Only in purchase register':4,'Duplicate — review':5,'Invalid key':6,'Invalid amount':7,'Matched':8};
    return out.sort((x,y) => (order[x.status]??9)-(order[y.status]??9) || String(x.gstin).localeCompare(String(y.gstin)) || String(x.invoice).localeCompare(String(y.invoice)));
  }
  function renderResults() {
    const filt = $('statusFilter').value, q = $('resultSearch').value.trim().toLowerCase();
    const rows = state.results.filter(r => (filt === 'all' || r.status === filt) && (!q || `${r.gstin} ${r.invoice}`.toLowerCase().includes(q)));
    $('resultRows').innerHTML = rows.map(r => {
      const bad = /variance|Only|Duplicate|Invalid/.test(r.status), review = r.status === 'Date variance';
      const diff = v => v === '' ? '—' : money(v);
      return `<tr><td><span class="status-pill ${bad ? (review ? 'review':'bad') : ''}">${esc(r.status)}</span></td><td>${esc(r.gstin)}</td><td>${esc(r.invoice)}</td><td>${esc(r.row2b)}</td><td>${esc(r.rowpr)}</td><td>${diff(r.taxable2b)}</td><td>${diff(r.taxablePR)}</td><td>${diff(r.dTaxable)}</td><td>${diff(r.igst2b)}</td><td>${diff(r.igstPR)}</td><td>${diff(r.dIGST)}</td><td>${diff(r.cgst2b)}</td><td>${diff(r.cgstPR)}</td><td>${diff(r.dCGST)}</td><td>${diff(r.sgst2b)}</td><td>${diff(r.sgstPR)}</td><td>${diff(r.dSGST)}</td><td>${diff(r.cess2b)}</td><td>${diff(r.cessPR)}</td><td>${diff(r.dCess)}</td><td>${esc(r.date2b)}</td><td>${esc(r.datePR)}</td></tr>`;
    }).join('') || '<tr><td colspan="14">No records match this filter.</td></tr>';
  }
  function renderKpis() {
    const counts = Object.fromEntries(['Matched','Value variance','Value + date variance','Date variance','Only in GSTR-2B','Only in purchase register','Duplicate — review','Invalid key','Invalid amount'].map(s=>[s,state.results.filter(r=>r.status===s).length]));
    const variance = counts['Value variance'] + counts['Value + date variance'] + counts['Date variance'];
    $('kpis').innerHTML = [ ['GSTR-2B / PR rows', `${state.results.length}`], ['Matched within tolerance', `${counts.Matched}`], ['Value/date variances', `${variance}`], ['Missing in purchase register', `${counts['Only in GSTR-2B']}`], ['Missing in GSTR-2B', `${counts['Only in purchase register']}`], ['Duplicate / invalid rows', `${counts['Duplicate — review'] + counts['Invalid key'] + counts['Invalid amount']}`] ].map(([l,v])=>`<div class="kpi"><span>${esc(l)}</span><strong>${esc(v)}</strong></div>`).join('');
  }
  function exportCSV() {
    const cols = ['Status','Supplier GSTIN','Invoice / document number','GSTR-2B source row','Purchase register source row','Taxable value GSTR-2B','Taxable value purchase register','Difference taxable (2B - PR)','IGST GSTR-2B','IGST purchase register','Difference IGST (2B - PR)','CGST GSTR-2B','CGST purchase register','Difference CGST (2B - PR)','SGST/UTGST GSTR-2B','SGST/UTGST purchase register','Difference SGST/UTGST (2B - PR)','Cess GSTR-2B','Cess purchase register','Difference cess (2B - PR)','Document date GSTR-2B','Document date purchase register'];
    const rows = state.results.map(r=>[r.status,r.gstin,r.invoice,r.row2b,r.rowpr,r.taxable2b,r.taxablePR,r.dTaxable,r.igst2b,r.igstPR,r.dIGST,r.cgst2b,r.cgstPR,r.dCGST,r.sgst2b,r.sgstPR,r.dSGST,r.cess2b,r.cessPR,r.dCess,r.date2b,r.datePR]);
    const csv = window.PraviCSV.serialize([cols,...rows]);
    download(new Blob([csv],{type:'text/csv;charset=utf-8;'}),'PRAVI_GSTR2B_purchase_register_reconciliation.csv');
  }
  function download(blob, name) { const u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),1500); }
  async function onFile(side, file) {
    try { $('resultArea').hidden=true; delete state.mappings[side]; state.results=[]; message('loadStatus', `Reading ${file?.name || 'file'}…`); await loadSource(side,file); const a = state.g2b, b = state.pr; if (a && b) { $('mappingArea').hidden = false; message('loadStatus', `Loaded ${a.name} (${a.rows.length} data rows) and ${b.name} (${b.rows.length} data rows). Confirm all suggested mappings.`); } else message('loadStatus', `${state[side].name}: loaded ${state[side].rows.length} data rows. Add the other source to continue.`); }
    catch(e) { state[side] = null; $('mappingArea').hidden=!(state.g2b&&state.pr); $('resultArea').hidden=true; message('loadStatus', e.message, true); }
  }
  $('g2bFile').addEventListener('change', e => { if (e.target.files[0]) onFile('g2b',e.target.files[0]); });
  $('prFile').addEventListener('change', e => { if (e.target.files[0]) onFile('pr',e.target.files[0]); });
  $('g2bSheet').addEventListener('change', () => { try { delete state.mappings.g2b; $('resultArea').hidden=true; parseSource('g2b'); if (state.pr) message('loadStatus','Worksheet changed. Review the column mappings before running.'); } catch(e) { message('loadStatus',e.message,true); } });
  $('prSheet').addEventListener('change', () => { try { delete state.mappings.pr; $('resultArea').hidden=true; parseSource('pr'); if (state.g2b) message('loadStatus','Worksheet changed. Review the column mappings before running.'); } catch(e) { message('loadStatus',e.message,true); } });
  document.addEventListener('change', e => { const el = e.target; if (el.matches('[data-map-side]')) { state.mappings[el.dataset.mapSide] = mappingsFromUI(el.dataset.mapSide); } });
  $('runRecon').addEventListener('click', () => {
    if (!state.g2b || !state.pr) return message('mapStatus','Load both source files first.',true);
    state.mappings.g2b = mappingsFromUI('g2b'); state.mappings.pr = mappingsFromUI('pr');
    for (const side of ['g2b','pr']) for (const f of fields.filter(x=>x.required)) if (state.mappings[side][f.key] === null || state.mappings[side][f.key] === undefined) return message('mapStatus',`Map the required field “${f.label}” for ${side === 'g2b' ? 'GSTR-2B' : 'purchase register'}.`,true);
    const tolerance = Number($('tolerance').value); if (!Number.isFinite(tolerance) || tolerance < 0) return message('mapStatus','Tolerance must be a non-negative number.',true);
    const a = state.g2b.rows.map(r=>record(r,state.mappings.g2b,'g2b')), b = state.pr.rows.map(r=>record(r,state.mappings.pr,'pr'));
    state.results = reconcile(a,b,tolerance);
    $('resultArea').hidden = false; const matched = state.results.filter(r=>r.status==='Matched').length; $('summaryText').textContent = `Compared ${a.length} GSTR-2B rows with ${b.length} purchase-register rows using supplier GSTIN + document number${state.mappings.g2b.doctype !== null && state.mappings.pr.doctype !== null ? ' + document type' : ''}. ${matched} row(s) matched within the selected ₹${tolerance} tolerance.`;
    renderKpis(); renderResults(); message('mapStatus',`Reconciliation completed. ${state.results.length} workpaper line(s) are ready for review.`); $('resultArea').scrollIntoView({behavior:'smooth',block:'start'});
  });
  $('statusFilter').addEventListener('change',renderResults); $('resultSearch').addEventListener('input',renderResults); $('exportRecon').addEventListener('click',exportCSV);
  $('clearRecon').addEventListener('click', () => { state.g2b=null;state.pr=null;state.results=[];state.mappings={};['g2bFile','prFile'].forEach(id=>$(id).value='');['g2bSheet','prSheet'].forEach(id=>{ $(id).innerHTML='<option>Choose file first</option>';$(id).disabled=true;});$('mappingArea').hidden=true;$('resultArea').hidden=true;message('loadStatus','');message('mapStatus',''); });
})();
