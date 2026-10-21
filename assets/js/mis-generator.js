(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const CATEGORY_OPTIONS = [
    ['revenue','Revenue'],['other_income','Other income'],['direct_costs','Direct costs / cost of sales'],
    ['employee_costs','Employee costs'],['rent_utilities','Rent & utilities'],['sales_marketing','Sales & marketing'],
    ['technology','Technology & software'],['admin_professional','Admin & professional fees'],['travel_other_opex','Travel & other operating costs'],
    ['depreciation','Depreciation'],['finance_costs','Finance costs'],['tax_expense','Income tax expense'],
    ['cash_bank','Cash & bank'],['receivables','Trade receivables'],['inventory','Inventory'],['other_current_assets','Other current assets'],
    ['payables','Trade payables'],['statutory_payables','Statutory dues payable'],['borrowings','Borrowings'],['other_current_liabilities','Other current liabilities']
  ];
  const PNL = new Set(['revenue','other_income','direct_costs','employee_costs','rent_utilities','sales_marketing','technology','admin_professional','travel_other_opex','depreciation','finance_costs','tax_expense']);
  const EXPENSES = new Set(['employee_costs','rent_utilities','sales_marketing','technology','admin_professional','travel_other_opex']);
  const BS = new Set(['cash_bank','receivables','inventory','other_current_assets','payables','statutory_payables','borrowings','other_current_liabilities']);
  const fmt = (n) => n == null || !Number.isFinite(n) ? '—' : new Intl.NumberFormat('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function parseCSV(text) {
    const rows=[]; let row=[], value='', quoted=false;
    for (let i=0;i<text.length;i++) { const c=text[i]; if (quoted) { if(c==='"' && text[i+1]==='"'){value+='"';i++;} else if(c==='"') quoted=false; else value+=c; } else if(c==='"' && value==='') quoted=true; else if(c===','){row.push(value);value='';} else if(c==='\n'){row.push(value.replace(/\r$/,''));rows.push(row);row=[];value='';} else value+=c; }
    if(quoted) throw new Error('The CSV contains an unclosed quoted field.');
    if(value!=='' || row.length){row.push(value.replace(/\r$/,''));rows.push(row);}
    return rows.filter(r => r.some(v => String(v).trim()!==''));
  }
  const norm = (s) => String(s||'').replace(/^\uFEFF/,'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
  function download(name, content, type='text/csv;charset=utf-8') { const blob=new Blob(['\ufeff',content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000); }
  function optionMarkup(selected='') { return CATEGORY_OPTIONS.map(([v,l])=>`<option value="${v}" ${v===selected?'selected':''}>${l}</option>`).join(''); }
  function addRow(line={}) {
    const body=$('inputRows'); const empty=body.querySelector('.empty'); if(empty) body.innerHTML='';
    const tr=document.createElement('tr'); tr.className='input-line';
    const cat=String(line.category||''); const name=String(line.account||'');
    tr.innerHTML=`<td><select class="line-category" aria-label="Report category" required><option value="">Select category…</option>${optionMarkup(cat)}</select></td><td><input class="line-account" aria-label="Ledger or account name" maxlength="180" required placeholder="Ledger name" value="${esc(name)}"></td><td><input class="line-actual" aria-label="Current month actual" type="number" step="0.01" required value="${line.actual==null?'':esc(line.actual)}" placeholder="Required"></td><td><input class="line-prior" aria-label="Prior month actual" type="number" step="0.01" value="${line.prior==null?'':esc(line.prior)}" placeholder="Optional"></td><td><input class="line-budget" aria-label="Current month budget" type="number" step="0.01" value="${line.budget==null?'':esc(line.budget)}" placeholder="Optional"></td><td><button type="button" class="btn-work danger remove-line" aria-label="Remove account line">Remove</button></td>`;
    body.appendChild(tr);
  }
  function rowsFromUI() {
    const lines=[]; const issues=[];
    [...$('inputRows').querySelectorAll('tr.input-line')].forEach((tr,i)=>{
      const category=tr.querySelector('.line-category').value; const account=tr.querySelector('.line-account').value.trim();
      const rawA=tr.querySelector('.line-actual').value, rawP=tr.querySelector('.line-prior').value, rawB=tr.querySelector('.line-budget').value;
      if(!category) issues.push(`Line ${i+1}: choose a report category.`);
      if(!account) issues.push(`Line ${i+1}: enter a ledger/account name.`);
      if(rawA.trim()==='') issues.push(`Line ${i+1} (${account||'unnamed'}): current actual is blank. Enter an amount or explicit 0; blanks are not treated as zero.`);
      const parse=(raw,field)=>{ if(raw.trim()==='') return null; const n=Number(raw); if(!Number.isFinite(n)) {issues.push(`Line ${i+1} (${account||'unnamed'}): ${field} is not a valid number.`); return null;} return n; };
      const actual=parse(rawA,'current actual'), prior=parse(rawP,'prior actual'), budget=parse(rawB,'budget');
      lines.push({category,account,actual,prior,budget});
    });
    if(!lines.length) issues.push('Add at least one account line or import a CSV file.');
    return {lines,issues};
  }
  // A blank comparison value must stay unavailable; it is never coerced to zero.
  function strictSum(lines, category, field, emptyValue=0) { const selected=lines.filter(x=>x.category===category); if(!selected.length)return emptyValue; if(selected.some(x=>x[field]==null))return null; return selected.reduce((a,x)=>a+x[field],0); }
  function strictCategoryValue(lines, categories, field) { const selected=lines.filter(x=>categories.has(x.category)); if(!selected.length)return 0; if(selected.some(x=>x[field]==null))return null; return selected.reduce((a,x)=>a+x[field],0); }
  function totals(lines, field) {
    const revenue=strictSum(lines,'revenue',field), other=strictSum(lines,'other_income',field), direct=strictSum(lines,'direct_costs',field);
    const gross=revenue==null||direct==null?null:revenue-direct; const opex=strictCategoryValue(lines,EXPENSES,field);
    const ebitda=gross==null||other==null||opex==null?null:gross+other-opex;
    const depr=strictSum(lines,'depreciation',field), finance=strictSum(lines,'finance_costs',field), tax=strictSum(lines,'tax_expense',field);
    const ebit=ebitda==null||depr==null?null:ebitda-depr; const pbt=ebit==null||finance==null?null:ebit-finance; const pat=pbt==null||tax==null?null:pbt-tax;
    return {revenue,other,direct,gross,opex,ebitda,depr,ebit,finance,pbt,tax,pat};
  }
  function balance(lines,field){ const result={}; for(const [k] of CATEGORY_OPTIONS) if(BS.has(k)){const selected=lines.filter(x=>x.category===k);result[k]=selected.length?strictSum(lines,k,field,null):null;} return result; }
  function negate(v){return v==null?null:v===0?0:-v;}
  function valDelta(cur,prior){return cur==null||prior==null?null:cur-prior;}
  function valueCell(v){return `<td class="num">${fmt(v)}</td>`;}
  function pct(num,den){return den===0||den==null?null:num/den*100;}
  function varianceClass(v){return v==null?'':v<0?'negative':v>0?'positive':'';}
  function buildReport(lines) {
    const a=totals(lines,'actual'), p=totals(lines,'prior'), b=totals(lines,'budget');
    const pnlInputLines=lines.filter(x=>PNL.has(x.category));
    const hasP=pnlInputLines.some(x=>x.prior!=null), hasB=pnlInputLines.some(x=>x.budget!=null);
    const priorCoverage=pnlInputLines.filter(x=>x.prior!=null).length, budgetCoverage=pnlInputLines.filter(x=>x.budget!=null).length;
    const bsA=balance(lines,'actual'), bsP=balance(lines,'prior');
    const hasPriorBS=lines.some(x=>BS.has(x.category)&&x.prior!=null);
    const ar=bsA.receivables, inv=bsA.inventory, otherCA=bsA.other_current_assets, ap=bsA.payables, stat=bsA.statutory_payables;
    const wcInputs=[ar,inv,otherCA,ap,stat];
    const workingCapital=wcInputs.every(v=>v!=null)?ar+inv+otherCA-ap-stat:null;
    const cash=bsA.cash_bank, priCash=bsP.cash_bank;
    const dayCount=Math.max(1,Math.min(366,Number($('periodDays').value)||30));
    const dso=ar!=null&&a.revenue>0?ar/a.revenue*dayCount:null;
    const dpo=ap!=null&&a.direct>0?ap/a.direct*dayCount:null;
    const plLines=[
      ['Revenue',a.revenue,p.revenue,b.revenue,'revenue'],['Direct costs / cost of sales',negate(a.direct),negate(p.direct),negate(b.direct),'direct'],['Gross profit',a.gross,p.gross,b.gross,'gross'],['Other income',a.other,p.other,b.other,'other'],['Operating expenses',negate(a.opex),negate(p.opex),negate(b.opex),'opex'],['EBITDA',a.ebitda,p.ebitda,b.ebitda,'ebitda'],['Depreciation',negate(a.depr),negate(p.depr),negate(b.depr),'depr'],['Operating profit (EBIT)',a.ebit,p.ebit,b.ebit,'ebit'],['Finance costs',negate(a.finance),negate(p.finance),negate(b.finance),'finance'],['Profit before tax',a.pbt,p.pbt,b.pbt,'pbt'],['Income tax expense',negate(a.tax),negate(p.tax),negate(b.tax),'tax'],['Profit after tax',a.pat,p.pat,b.pat,'pat']
    ];
    $('plRows').innerHTML=plLines.map(([name,cur,prev,bud,key])=>{
      const total=['gross','ebitda','ebit','pbt','pat'].includes(key); const top=['revenue'].includes(key);
      const priorVar=valDelta(cur,prev), budgetVar=valDelta(cur,bud);
      return `<tr class="${total?'total-row':top?'sub-total':''}"><td>${esc(name)}</td>${valueCell(cur)}${valueCell(prev)}<td class="num ${varianceClass(priorVar)}">${fmt(priorVar)}</td>${valueCell(bud)}<td class="num ${varianceClass(budgetVar)}">${fmt(budgetVar)}</td></tr>`;
    }).join('');
    const bsRows=[['Cash & bank','cash_bank'],['Trade receivables','receivables'],['Inventory','inventory'],['Other current assets','other_current_assets'],['Trade payables','payables'],['Statutory dues payable','statutory_payables'],['Borrowings','borrowings'],['Other current liabilities','other_current_liabilities']];
    $('bsRows').innerHTML=bsRows.filter(([n,k])=>lines.some(x=>x.category===k&&x.actual!=null)||lines.some(x=>x.category===k&&x.prior!=null)).map(([n,k])=>`<tr><td>${n}</td>${valueCell(bsA[k])}${valueCell(bsP[k])}<td class="num ${varianceClass(valDelta(bsA[k],bsP[k]))}">${fmt(valDelta(bsA[k],bsP[k]))}</td></tr>`).join('') || '<tr><td colspan="4" class="empty">No balance-sheet snapshot categories supplied.</td></tr>';
    const keyMetric=(label,v,sub)=>`<div class="metric"><span>${label}</span><strong>${v}</strong><small>${sub||''}</small></div>`;
    $('metrics').innerHTML=[
      keyMetric('Revenue',fmt(a.revenue),p.revenue!=null&&p.revenue!==0?`${pct(a.revenue-p.revenue,Math.abs(p.revenue))>=0?'+':''}${fmt(pct(a.revenue-p.revenue,Math.abs(p.revenue)))}% vs prior`:hasP?'Prior revenue is not fully supplied or is zero':'Prior comparison not supplied'),
      keyMetric('Gross margin',pct(a.gross,a.revenue)==null?'—':fmt(pct(a.gross,a.revenue))+'%',`Gross profit ${fmt(a.gross)}`),
      keyMetric('EBITDA',fmt(a.ebitda),`Margin ${pct(a.ebitda,a.revenue)==null?'—':fmt(pct(a.ebitda,a.revenue))+'%'}`),
      keyMetric('Profit after tax',fmt(a.pat),`PAT margin ${pct(a.pat,a.revenue)==null?'—':fmt(pct(a.pat,a.revenue))+'%'}`),
      keyMetric('Cash & bank',fmt(cash),bsP.cash_bank!=null&&cash!=null?`${cash-priCash>=0?'+':''}${fmt(cash-priCash)} vs prior`:'Current/prior cash balance not fully supplied'),
      keyMetric('Working-capital proxy',fmt(workingCapital),workingCapital==null?'Supply all five relevant balance categories for this proxy':'Receivables + inventory + other CA − trade payables − statutory dues'),
      keyMetric('Receivables days (proxy)',dso==null?'—':fmt(dso),'Closing trade receivables ÷ period revenue × period days'),
      keyMetric('Payables days (proxy)',dpo==null?'—':fmt(dpo),'Closing trade payables ÷ period direct costs × period days')
    ].join('');
    const alerts=[]; const revenuePriorPct=p.revenue!=null&&p.revenue!==0?(a.revenue-p.revenue)/Math.abs(p.revenue)*100:null;
    if(revenuePriorPct!=null&&revenuePriorPct<=-10) alerts.push(`<li><strong>Revenue movement:</strong> revenue is down ${fmt(Math.abs(revenuePriorPct))}% or more against the prior period. Validate seasonality, cut-off and missing invoices.</li>`);
    if(a.revenue>0&&!lines.some(x=>x.category==='direct_costs')) alerts.push('<li><strong>Direct cost mapping:</strong> no direct-cost / cost-of-sales account is mapped. Gross profit and gross margin may be overstated.</li>');
    if(a.revenue>0&&!lines.some(x=>EXPENSES.has(x.category))) alerts.push('<li><strong>Operating cost mapping:</strong> no operating expense account is mapped. EBITDA may be overstated.</li>');
    if(a.revenue>0&&!lines.some(x=>x.category==='depreciation')) alerts.push('<li><strong>Depreciation mapping:</strong> no depreciation account is mapped. EBIT currently follows EBITDA based on the supplied data.</li>');
    if(a.revenue>0&&!lines.some(x=>x.category==='finance_costs')) alerts.push('<li><strong>Finance cost mapping:</strong> no finance-cost account is mapped. Confirm whether interest and borrowing costs are nil or missing.</li>');
    if(a.revenue>0&&!lines.some(x=>x.category==='tax_expense')) alerts.push('<li><strong>Tax expense mapping:</strong> no income-tax expense account is mapped. PAT currently follows PBT based on the supplied data.</li>');
    if(a.revenue>0 && a.gross/a.revenue<0.15) alerts.push('<li><strong>Gross margin:</strong> margin is below 15%. Check pricing, direct-cost allocation, inventory movements and classification. This is a prompt, not an industry benchmark.</li>');
    if(a.pat<0) alerts.push('<li><strong>Loss position:</strong> profit after tax is negative. Review forecast, cash runway, debt obligations and corrective actions.</li>');
    if(hasB) {
      const expenseActual=a.opex, expenseBudget=b.opex;
      const coverage=lines.filter(x=>EXPENSES.has(x.category)&&x.budget!=null).length, eligible=lines.filter(x=>EXPENSES.has(x.category)&&x.actual!=null).length;
      if(expenseBudget!=null&&expenseActual>expenseBudget) alerts.push(`<li><strong>Operating cost over budget:</strong> aggregate mapped operating expenses exceed the entered budget by ${fmt(expenseActual-expenseBudget)}. Budget coverage is ${coverage} of ${eligible} expense lines.</li>`);
      const revBudget=b.revenue; if(revBudget!=null&&a.revenue<revBudget) alerts.push(`<li><strong>Revenue below budget:</strong> shortfall of ${fmt(revBudget-a.revenue)} against the entered revenue budget.</li>`);
    }
    if(cash!=null&&priCash!=null&&cash<priCash) alerts.push(`<li><strong>Liquidity movement:</strong> cash &amp; bank has decreased by ${fmt(priCash-cash)} against the prior snapshot. Reconcile bank balances and inspect collections and payment timing.</li>`);
    if(ar!=null&&ar>0&&a.revenue>0&&dso!=null&&dso>dayCount) alerts.push(`<li><strong>Receivable concentration:</strong> closing receivables exceed one period of revenue on the simple DSO proxy (${fmt(dso)} days). Obtain an ageing report; this proxy is not a substitute for invoice ageing.</li>`);
    if(!hasP) alerts.push('<li><strong>Prior period:</strong> no prior-period P&amp;L amounts were supplied. Month-on-month comparisons are unavailable.</li>');
    else if(priorCoverage<pnlInputLines.length) alerts.push(`<li><strong>Incomplete prior-period coverage:</strong> prior actuals are populated for ${priorCoverage} of ${pnlInputLines.length} P&amp;L account lines. Variances may be incomplete until all relevant lines are mapped.</li>`);
    if(!hasB) alerts.push('<li><strong>Budget:</strong> no P&amp;L budget amounts were supplied. Budget variance is unavailable.</li>');
    else if(budgetCoverage<pnlInputLines.length) alerts.push(`<li><strong>Incomplete budget coverage:</strong> budget amounts are populated for ${budgetCoverage} of ${pnlInputLines.length} P&amp;L account lines. Budget variances may be incomplete.</li>`);
    if(lines.some(x=>BS.has(x.category)&&x.prior!=null)===false && lines.some(x=>BS.has(x.category))) alerts.push('<li><strong>Prior balance snapshot:</strong> no prior amounts were supplied for the balance-sheet snapshot.</li>');
    if(lines.some(x=>BS.has(x.category))&&hasPriorBS&&lines.filter(x=>BS.has(x.category)).some(x=>x.prior==null)) alerts.push('<li><strong>Incomplete prior balance snapshot:</strong> some mapped balance-sheet lines have no prior-period amount; related variances are unavailable.</li>');
    if(!lines.some(x=>x.category==='revenue')) alerts.push('<li><strong>Revenue mapping:</strong> no revenue account has been mapped. Confirm whether this is a valid nil-revenue period.</li>');
    if(!lines.some(x=>BS.has(x.category))) alerts.push('<li><strong>Balance snapshot:</strong> no cash, receivables, inventory or liability balances were included. Liquidity and working-capital review is incomplete.</li>');
    alerts.push('<li><strong>Review before circulation:</strong> tie the account summary to the signed-off trial balance and independently review tax balances, accruals, cut-off and unusual movements.</li>');
    $('reviewFlags').innerHTML=`<div class="alert-box"><ul style="margin:0;padding-left:20px;line-height:1.8">${alerts.join('')}</ul></div>`;
    const name=$('entityName').value.trim()||'Entity not specified'; const month=$('reportMonth').value;
    $('reportTitle').textContent=`Monthly MIS · ${name}`;
    $('reportSubtitle').textContent=`Reporting period: ${month||'not specified'} · Amounts in the same unit/currency as supplied · Generated in browser`;
    return {lines,a,p,b,bsA,bsP,hasP,hasB,hasPriorBS,priorCoverage,budgetCoverage,pnlInputCount:pnlInputLines.length,alerts,month,name,dayCount,workingCapital,dso,dpo};
  }
  function setInputStatus(text,isError=false){$('inputStatus').textContent=text;$('inputStatus').style.background=isError?'#fff1ed':'#f3f7f4';$('inputStatus').style.borderColor=isError?'#f0c4b6':'#dbe6df';$('inputStatus').style.color=isError?'#913f2a':'#214a3c';}
  function validateAndBuild() {
    const {lines,issues}=rowsFromUI();
    if(!$('reportMonth').value) issues.unshift('Choose the reporting month.');
    if(issues.length){setInputStatus(issues.join('\n'),true);return null;}
    const result=buildReport(lines); result.periodDays=Math.max(1,Math.min(366,Number($('periodDays').value)||30));
    setInputStatus(`Report generated for ${lines.length} account lines. Check category mapping, comparison coverage and review flags before using it.`,false);
    $('exportReport').disabled=false; $('printReport').disabled=false; window.__praviMis=result; return result;
  }
  function exportWorkpaper(){
    const report=window.__praviMis||validateAndBuild(); if(!report)return;
    const out=[['Section','Particulars','Current month actual','Prior month actual','Change vs prior','Current month budget','Actual vs budget','Notes']];
    out.push(['Metadata','Entity',report.name,'','','','', '']);out.push(['Metadata','Reporting month',report.month,'','','','', '']);out.push(['Metadata','Period days',report.dayCount,'','','','', '']);
    const a=report.a,p=report.p,b=report.b; const hasP=report.hasP,hasB=report.hasB;
    [['Revenue',a.revenue,p.revenue,b.revenue],['Direct costs / cost of sales',negate(a.direct),negate(p.direct),negate(b.direct)],['Gross profit',a.gross,p.gross,b.gross],['Other income',a.other,p.other,b.other],['Operating expenses',negate(a.opex),negate(p.opex),negate(b.opex)],['EBITDA',a.ebitda,p.ebitda,b.ebitda],['Depreciation',negate(a.depr),negate(p.depr),negate(b.depr)],['Operating profit (EBIT)',a.ebit,p.ebit,b.ebit],['Finance costs',negate(a.finance),negate(p.finance),negate(b.finance)],['Profit before tax',a.pbt,p.pbt,b.pbt],['Income tax expense',negate(a.tax),negate(p.tax),negate(b.tax)],['Profit after tax',a.pat,p.pat,b.pat]].forEach(([n,c,pr,bu])=>out.push(['P&L',n,c,pr??'',pr==null?'':c-pr,bu??'',bu==null?'':c-bu,'']));
    CATEGORY_OPTIONS.filter(([k])=>BS.has(k)).forEach(([k,label])=>{const cur=report.bsA[k];const prior=report.bsP[k];out.push(['Balance snapshot',label,cur??'',prior??'',cur==null||prior==null?'':cur-prior,'','','Mapped source balances; reconcile to GL']);});
    out.push(['KPI','Gross margin %',pct(a.gross,a.revenue)??'','','','','','']);out.push(['KPI','EBITDA margin %',pct(a.ebitda,a.revenue)??'','','','','','']);out.push(['KPI','PAT margin %',pct(a.pat,a.revenue)??'','','','','','']);out.push(['KPI','Working-capital proxy',report.workingCapital,'','','','','Receivables + inventory + other CA − trade payables − statutory dues']);out.push(['KPI','Receivable days proxy',report.dso??'','','','','','Closing receivables / period revenue × period days']);out.push(['KPI','Payable days proxy',report.dpo??'','','','','','Closing trade payables / direct costs × period days']);
    report.lines.forEach(x=>out.push(['Source detail',x.account,x.actual,x.prior??'',x.prior==null?'':x.actual-x.prior,x.budget??'',x.budget==null?'':x.actual-x.budget,`Category: ${CATEGORY_OPTIONS.find(c=>c[0]===x.category)?.[1]||x.category}`]));
    report.alerts.forEach((x,i)=>out.push(['Review flag',`Flag ${i+1}`, '', '', '', '', '', x.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()]));
    const csv=window.PraviCSV.serialize(out); download(`PRAVI_Monthly_MIS_${report.month||'period'}.csv`,csv);
  }
  $('addLine').addEventListener('click',()=>addRow());
  $('inputRows').addEventListener('click',(e)=>{const btn=e.target.closest('.remove-line');if(!btn)return;btn.closest('tr').remove();if(!$('inputRows').querySelector('.input-line'))$('inputRows').innerHTML='<tr><td colspan="6" class="empty">No account lines added. Add a line or import a CSV file to begin.</td></tr>';});
  $('clearLines').addEventListener('click',()=>{if(!confirm('Clear all account lines from this working session?'))return;$('inputRows').innerHTML='<tr><td colspan="6" class="empty">No account lines added. Add a line or import a CSV file to begin.</td></tr>';$('metrics').innerHTML='';$('plRows').innerHTML='<tr><td colspan="6" class="empty">No report generated yet.</td></tr>';$('bsRows').innerHTML='<tr><td colspan="4" class="empty">No report generated yet.</td></tr>';$('reviewFlags').textContent='Generate the report to see review flags.';$('exportReport').disabled=true;$('printReport').disabled=true;window.__praviMis=null;setInputStatus('Account lines cleared.');});
  $('generateReport').addEventListener('click',()=>validateAndBuild()); $('exportReport').addEventListener('click',exportWorkpaper); $('printReport').addEventListener('click',()=>{if(!window.__praviMis&&!validateAndBuild())return;window.print();});
  $('downloadTemplate').addEventListener('click',()=>download('PRAVI_MIS_account_summary_template.csv','category,account,actual,prior,budget,notes\r\n'));
  $('importCsv').addEventListener('change',async(e)=>{const file=e.target.files[0];if(!file)return;try{if(file.size>10*1024*1024)throw new Error('CSV file exceeds 10 MB.');const parsed=parseCSV(await file.text());if(parsed.length<2)throw new Error('CSV has headers but no account rows.');const headers=parsed[0].map(norm);const aliases={category:['category','report_category','mis_category'],account:['account','ledger','ledger_name','account_name','particulars'],actual:['actual','current_actual','current_month_actual','actual_current_month'],prior:['prior','previous','prior_actual','prior_month_actual','previous_month_actual'],budget:['budget','current_budget','current_month_budget','budget_current_month'],notes:['notes','remarks','description']};const idx={};for(const [field,alts] of Object.entries(aliases)){idx[field]=headers.findIndex(h=>alts.includes(h));}for(const req of ['category','account','actual'])if(idx[req]<0)throw new Error(`Required column missing: ${req}. Expected headers: category, account, actual; prior, budget and notes are optional.`);
      const catMap=new Map(CATEGORY_OPTIONS.flatMap(([k,l])=>[[norm(k),k],[norm(l),k]]));const lines=[];const rowErrors=[];
      parsed.slice(1).forEach((r,i)=>{const lineNo=i+2;const categoryRaw=(r[idx.category]||'').trim();const category=catMap.get(norm(categoryRaw));const account=(r[idx.account]||'').trim();const actualRaw=(r[idx.actual]||'').trim();if(!category||!account||actualRaw===''){rowErrors.push(`Row ${lineNo}: category, account and explicit actual amount are required.`);return;}const actual=Number(actualRaw);if(!Number.isFinite(actual)){rowErrors.push(`Row ${lineNo}: actual amount is not numeric.`);return;}const readOptional=(f)=>{if(idx[f]<0)return null;const raw=(r[idx[f]]||'').trim();if(raw==='')return null;const n=Number(raw);if(!Number.isFinite(n))throw new Error(`Row ${lineNo}: ${f} amount is not numeric.`);return n;};try{lines.push({category,account,actual,prior:readOptional('prior'),budget:readOptional('budget')});}catch(err){rowErrors.push(err.message);}});
      if(!lines.length)throw new Error('No valid account rows were found. '+rowErrors.slice(0,5).join('\n'));
      $('inputRows').innerHTML='';lines.forEach(addRow);setInputStatus(`Imported ${lines.length} account rows from ${file.name}.${rowErrors.length?`\nSkipped ${rowErrors.length} row(s):\n${rowErrors.slice(0,8).join('\n')}`:''}\nReview every category and amount before generating the report.`,rowErrors.length>0);window.__praviMis=null;$('exportReport').disabled=true;$('printReport').disabled=true;
    }catch(err){setInputStatus(err.message||'Could not import the CSV file.',true);}finally{e.target.value='';}});
  $('loadSample').addEventListener('click',()=>{if($('inputRows').querySelector('.input-line')&&!confirm('Replace current account lines with illustrative sample data?'))return;const sample=[
    ['revenue','Product sales',1250000,1180000,1300000],['other_income','Other operating income',15000,10000,12000],['direct_costs','Materials and direct costs',690000,645000,700000],['employee_costs','Salaries and wages',180000,172000,175000],['rent_utilities','Rent and utilities',42000,42000,42000],['sales_marketing','Sales and marketing',28000,25000,25000],['technology','Software and technology',12000,10000,12000],['admin_professional','Admin and professional fees',22000,18000,20000],['depreciation','Depreciation',18000,18000,18000],['finance_costs','Interest and finance costs',9000,8500,8500],['tax_expense','Income tax expense estimate',25000,27000,30000],['cash_bank','Cash and bank',310000,355000,null],['receivables','Trade receivables',480000,410000,null],['inventory','Inventory',220000,205000,null],['payables','Trade payables',260000,230000,null],['statutory_payables','Statutory dues payable',48000,42000,null]
  ];$('inputRows').innerHTML='';sample.forEach(([category,account,actual,prior,budget])=>addRow({category,account,actual,prior,budget}));$('entityName').value='Illustrative Sample Entity';if(!$('reportMonth').value){const d=new Date();d.setMonth(d.getMonth()-1);$('reportMonth').value=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;}$('periodDays').value='30';setInputStatus('Illustrative data loaded. Replace all sample figures before using this for a real entity.',true);window.__praviMis=null;$('exportReport').disabled=true;$('printReport').disabled=true;});
  $('reportMonth').addEventListener('change',()=>{const v=$('reportMonth').value;if(v){const [y,m]=v.split('-').map(Number);$('periodDays').value=new Date(y,m,0).getDate();}});
  // Default reporting period is the previous calendar month.
  const d=new Date();d.setMonth(d.getMonth()-1);$('reportMonth').value=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;$('periodDays').value=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
})();
