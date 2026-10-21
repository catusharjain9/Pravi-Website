(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const money=v=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number.isFinite(v)?v:0);
  const n=el=>{const v=Number(el?.value||0);return Number.isFinite(v)?v:0;};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const keys=[['collections','Customer collections'],['other','Other inflows'],['operating','Supplier & operating payments'],['payroll','Payroll'],['statutory','Tax / statutory'],['capex','Capex / debt payments']];
  const state={rows:[],base:[],stress:[]};
  function isoLocal(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function nextMonday(){const d=new Date();d.setHours(0,0,0,0);const add=(8-d.getDay())%7;d.setDate(d.getDate()+(add===0?0:add));return isoLocal(d);}
  function addDaysISO(iso,days){const d=new Date(`${iso}T00:00:00`);d.setDate(d.getDate()+days);return isoLocal(d);}
  function displayDate(iso){const d=new Date(`${iso}T00:00:00`);return Number.isNaN(d.getTime())?iso:d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'2-digit'});}
  function buildRows(){
    if(!$('startDate').value)$('startDate').value=nextMonday();
    $('cashRows').innerHTML='';state.rows=[];
    for(let i=0;i<13;i++){
      const tr=document.createElement('tr');tr.dataset.week=String(i);
      tr.innerHTML=`<td><div>Week ${i+1}</div><small data-week-date class="muted"></small></td>`+
        keys.map(([k,label])=>`<td><input data-key="${k}" type="number" min="0" step="0.01" value="" aria-label="Week ${i+1} ${label}"></td>`).join('')+
        `<td class="calc" data-opening>—</td><td class="calc" data-net>—</td><td class="calc" data-closing>—</td>`;
      tr.querySelectorAll('input').forEach(el=>el.addEventListener('input',recalculate));
      $('cashRows').appendChild(tr);state.rows.push(tr);
    }
    updateDates();recalculate();
  }
  function inputs(tr){return Object.fromEntries(keys.map(([k])=>[k,n(tr.querySelector(`[data-key="${k}"]`))]));}
  function updateDates(){const start=$('startDate').value||nextMonday();state.rows.forEach((tr,i)=>{tr.querySelector('[data-week-date]').textContent=displayDate(addDaysISO(start,7*i));});}
  function clearCalculated(message,bad=false){
    state.base=[];state.stress=[];state.rows.forEach(tr=>['[data-opening]','[data-net]','[data-closing]'].forEach(sel=>{const cell=tr.querySelector(sel);cell.textContent='—';cell.classList.remove('negative','breach');cell.title='';}));
    $('cashKpis').innerHTML='';$('cashInsights').textContent='';$('scenarioRows').innerHTML='';$('exportForecast').disabled=true;$('cashStatus').textContent=message;$('cashStatus').classList.toggle('error',bad);
  }
  function runCase(stressed, opening, receiptFactor, payFactor){
    let cash=opening,low=Infinity,lowWeek=1,firstBreach=null;const out=[];
    const minimum=n($('minCash'));
    state.rows.forEach((tr,i)=>{
      const v=inputs(tr), op=cash;
      const inflow=(v.collections*(stressed?receiptFactor:1))+v.other;
      const outflow=(v.operating+v.payroll+v.statutory+v.capex)*(stressed?payFactor:1);
      const net=inflow-outflow;cash=op+net;
      if(cash<low){low=cash;lowWeek=i+1;}
      if(firstBreach===null&&cash<minimum)firstBreach=i+1;
      out.push({week:i+1,date:addDaysISO($('startDate').value||nextMonday(),7*i),opening:op,collections:v.collections,other:v.other,operating:v.operating,payroll:v.payroll,statutory:v.statutory,capex:v.capex,inflow,outflow,net,closing:cash,low,lowWeek,breach:firstBreach});
    });return out;
  }
  function recalculate(){
    if(!state.rows.length)return;
    updateDates();
    const hasWeeklyInputs=state.rows.some(tr=>[...tr.querySelectorAll('input')].some(i=>String(i.value).trim()!==''));
    if(String($('openingCash').value).trim()===''){clearCalculated('Enter opening available cash to calculate the forecast.');return;}
    if(!hasWeeklyInputs){clearCalculated('Enter weekly forecast values, or explicitly enter 0 where no cash flow is expected. You can also load the illustrative sample.');return;}
    const invalidWeekly=state.rows.some(tr=>[...tr.querySelectorAll('input')].some(i=>String(i.value).trim()!==''&&(!Number.isFinite(Number(i.value))||Number(i.value)<0)));
    if(n($('openingCash'))<0 || n($('minCash'))<0 || n($('stressReceipts'))<0 || n($('stressReceipts'))>100 || n($('stressPayments'))<0 || n($('stressPayments'))>100 || invalidWeekly){clearCalculated('Check your inputs: cash, weekly flows and cash buffer must be non-negative; downside percentages must be between 0 and 100.',true);return;}
    const opening=n($('openingCash')),rf=n($('stressReceipts'))/100,pf=1+n($('stressPayments'))/100;
    state.base=runCase(false,opening,1,1);state.stress=runCase(true,opening,rf,pf);
    state.rows.forEach((tr,i)=>{
      const b=state.base[i],s=state.stress[i];
      const op=tr.querySelector('[data-opening]'),net=tr.querySelector('[data-net]'),cl=tr.querySelector('[data-closing]');
      op.textContent=money(b.opening);net.textContent=money(b.net);cl.textContent=money(b.closing);
      [op,net,cl].forEach(x=>x.classList.toggle('negative',Number(x.textContent.replace(/[^0-9.-]/g,''))<0));
      cl.classList.toggle('breach',b.closing<n($('minCash')));
      cl.title=`Downside closing cash: ${money(s.closing)}`;
    });
    $('exportForecast').disabled=false;renderSummary();
  }
  function renderSummary(){
    const b=state.base,s=state.stress;if(!b.length)return;
    const lowBase=Math.min(...b.map(x=>x.closing)),lowStress=Math.min(...s.map(x=>x.closing));
    const lowBaseWeek=b.findIndex(x=>x.closing===lowBase)+1,lowStressWeek=s.findIndex(x=>x.closing===lowStress)+1;
    const breachBase=b.find(x=>x.closing<n($('minCash'))),breachStress=s.find(x=>x.closing<n($('minCash')));
    const labels=[['Base case closing cash',money(b[12].closing)],['Lowest base-case closing cash',`${money(lowBase)} · W${lowBaseWeek}`],['Downside closing cash',money(s[12].closing)],['First cash-buffer breach',breachBase?`Base W${breachBase.week}`:breachStress?`Downside W${breachStress.week}`:'None in 13 weeks']];
    $('cashKpis').innerHTML=labels.map(([a,v])=>`<div class="kpi"><span>${esc(a)}</span><strong>${esc(v)}</strong></div>`).join('');
    const issues=[];
    if(b.some(x=>x.closing<0))issues.push(`Base case becomes cash-negative in Week ${b.find(x=>x.closing<0).week}.`);
    else if(breachBase)issues.push(`Base case falls below the ₹${money(n($('minCash')))} cash buffer in Week ${breachBase.week}.`);
    else issues.push('Base case remains above the selected minimum cash buffer in the 13-week horizon.');
    if(s.some(x=>x.closing<0))issues.push(`Downside case becomes cash-negative in Week ${s.find(x=>x.closing<0).week}.`);
    else if(breachStress)issues.push(`Downside case falls below the cash buffer in Week ${breachStress.week}.`);
    else issues.push('Downside case remains above the selected minimum cash buffer.');
    $('cashInsights').textContent=issues.join(' ');
    const sum=(arr,k)=>arr.reduce((t,r)=>t+r[k],0);
    const rows=[['Total customer collections',money(sum(b,'collections')),money(sum(b,'collections')*Math.min(100,Math.max(0,n($('stressReceipts'))))/100)],['Total cash inflows',money(sum(b,'inflow')),money(sum(s,'inflow'))],['Total cash outflows',money(sum(b,'outflow')),money(sum(s,'outflow'))],['Net cash flow over horizon',money(sum(b,'net')),money(sum(s,'net'))],['Ending cash balance',money(b[12].closing),money(s[12].closing)],['Lowest weekly closing cash',`${money(lowBase)} (W${lowBaseWeek})`,`${money(lowStress)} (W${lowStressWeek})`],['First week below cash buffer',breachBase?`Week ${breachBase.week}`:'Not breached',breachStress?`Week ${breachStress.week}`:'Not breached']];
    $('scenarioRows').innerHTML=rows.map(r=>`<tr>${r.map((v,i)=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('');
  }
  function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);}
  function exportCSV(){
    const b=state.base,s=state.stress;const header=['Week','Week starting','Base opening cash','Customer collections','Other inflows','Supplier & operating payments','Payroll','Tax / statutory','Capex / debt payments','Base total inflows','Base total outflows','Base net cash flow','Base closing cash','Downside opening cash','Downside total inflows','Downside total outflows','Downside net cash flow','Downside closing cash','Cash buffer','Base buffer breach','Downside buffer breach'];
    const data=b.map((r,i)=>{const z=s[i];return [r.week,r.date,r.opening,r.collections,r.other,r.operating,r.payroll,r.statutory,r.capex,r.inflow,r.outflow,r.net,r.closing,z.opening,z.inflow,z.outflow,z.net,z.closing,n($('minCash')),r.closing<n($('minCash'))?'YES':'NO',z.closing<n($('minCash'))?'YES':'NO'];});
    const meta=[['PRAVI 13-week cash flow workpaper',''],['Forecast starts',$('startDate').value],['Opening cash',n($('openingCash'))],['Minimum cash buffer',n($('minCash'))],['Downside collection realization %',n($('stressReceipts'))],['Downside payment uplift %',n($('stressPayments'))],['Note','Illustrative cash forecast based on user-entered assumptions; not a guarantee of future cash availability.'],[],header,...data];
    const csv=window.PraviCSV.serialize(meta);download(new Blob([csv],{type:'text/csv;charset=utf-8;'}),'PRAVI_13_week_cash_flow_workpaper.csv');
  }
  function clearValues(){state.rows.forEach(tr=>tr.querySelectorAll('input').forEach(i=>i.value=''));recalculate();}
  function sampleValues(){const collections=[180000,210000,165000,250000,190000,225000,210000,260000,170000,240000,220000,250000,280000],ops=[145000,155000,148000,160000,170000,155000,180000,165000,175000,190000,185000,180000,200000];state.rows.forEach((tr,i)=>{const v={collections:collections[i],other:i===3?50000:0,operating:ops[i],payroll:80000,statutory:i===4||i===8?35000:0,capex:i===5?60000:0};Object.entries(v).forEach(([k,n])=>tr.querySelector(`[data-key="${k}"]`).value=String(n));});if(!$('openingCash').value)$('openingCash').value='1500000';if(!$('minCash').value)$('minCash').value='250000';recalculate();$('cashStatus').textContent='Illustrative sample loaded. Replace all sample values with your own forecast before relying on the result.';$('cashStatus').classList.remove('error');}
  $('startDate').addEventListener('change',recalculate);['openingCash','minCash','stressReceipts','stressPayments'].forEach(id=>$(id).addEventListener('input',recalculate));$('fillSample').addEventListener('click',sampleValues);$('clearForecast').addEventListener('click',()=>{clearValues();$('cashStatus').textContent='Weekly forecast inputs cleared.';$('cashStatus').classList.remove('error');});$('exportForecast').addEventListener('click',exportCSV);
  if(!$('startDate').value)$('startDate').value=nextMonday();buildRows();$('cashStatus').textContent='Start by entering opening cash and a weekly forecast. Zero-valued inputs are treated as actual zero assumptions; use Load illustrative sample only to explore the model.';
})();
