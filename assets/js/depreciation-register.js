(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const state = { nextId: 1, results: [] };
  const money = v => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(Number.isFinite(v)?v:0);
  const fmt = v => new Intl.NumberFormat('en-IN',{maximumFractionDigits:2}).format(Number.isFinite(v)?v:0);
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const say = (s, bad=false) => { $('assetStatus').textContent=s; $('assetStatus').classList.toggle('error',bad); };
  const parseMoney = v => { const s=String(v??'').replace(/[₹,\s]/g,''); if(!s)return 0; const n=Number(s); return Number.isFinite(n)?n:NaN; };
  function isoLocal(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function addDateYears(date, years) { const d=new Date(date.getTime()); const m=d.getMonth(); d.setFullYear(d.getFullYear()+years); if(d.getMonth()!==m) d.setDate(0); return d; }
  function parseDate(s) { if(s instanceof Date && !Number.isNaN(s.getTime()))return new Date(s.getFullYear(),s.getMonth(),s.getDate()); const v=String(s??'').trim(); if(!v)return null; let m=v.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/); if(m){const d=new Date(+m[1],+m[2]-1,+m[3]);return Number.isNaN(d.getTime())?null:d;} m=v.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/); if(m){let y=+m[3];if(y<100)y+=y>=70?1900:2000;const d=new Date(y,+m[2]-1,+m[1]);return Number.isNaN(d.getTime())?null:d;} const d=new Date(v);return Number.isNaN(d.getTime())?null:new Date(d.getFullYear(),d.getMonth(),d.getDate()); }
  const dayMs=86400000;
  const dayDiff=(a,b)=>Math.max(0,Math.round((b.getTime()-a.getTime())/dayMs));
  const maxDate=(a,b)=>a>b?a:b;
  const minDate=(a,b)=>a<b?a:b;
  function activeDays(from, toExclusive, putDate, lifeEnd) { const start=maxDate(from,putDate), end=minDate(toExclusive,lifeEnd); return dayDiff(start,end); }
  function monthOverlap(from, toExclusive, putDate, lifeEnd) {
    const start=maxDate(from,putDate),end=minDate(toExclusive,lifeEnd); if(start>=end)return 0;
    const first=new Date(start.getFullYear(),start.getMonth(),1), last=new Date(end.getFullYear(),end.getMonth(),1);
    return Math.max(0,(last.getFullYear()-first.getFullYear())*12+(last.getMonth()-first.getMonth())+(end.getDate()>start.getDate()?1:0));
  }
  function createRow(data={}) {
    const id=state.nextId++;
    const tr=document.createElement('tr'); tr.dataset.assetId=String(id);
    const cols=[
      ['name',data.name??'', 'text','Asset name / description'],
      ['cost',data.cost??'', 'number','Cost in INR'],
      ['date',data.date??'', 'date','Put to use date'],
      ['life',data.life??'', 'number','Useful life in years'],
      ['residual',data.residual??'0', 'number','Residual value in INR'],
      ['opening',data.opening??'', 'number','Opening accumulated depreciation in INR; leave blank to estimate from date and useful life']
    ];
    tr.innerHTML=cols.map(([key,val,type,label])=>`<td><input data-key="${key}" type="${type}" value="${esc(val)}" ${type==='number'?'min="0" step="0.01"':''} aria-label="${label}" placeholder="${type==='text'?'e.g. Office laptop':''}"></td>`).join('')+`<td><button class="remove-asset" type="button" aria-label="Remove asset row">Remove</button></td>`;
    tr.querySelector('.remove-asset').addEventListener('click',()=>{tr.remove();markDirty();});
    tr.querySelectorAll('input').forEach(inp=>inp.addEventListener('input',markDirty));
    $('assetInputs').appendChild(tr);
  }
  function markDirty() { $('exportAssets').disabled=true; $('assetOutputArea').hidden=true; }
  function rowsFromInputs() { return [...$('assetInputs').querySelectorAll('tr')].map(tr=>Object.fromEntries([...tr.querySelectorAll('[data-key]')].map(i=>[i.dataset.key,i.value]))); }
  function setRows(rows) { $('assetInputs').innerHTML=''; state.nextId=1; (rows.length?rows:[{}]).forEach(r=>createRow(r)); markDirty(); }
  function csvRows(text) {
    const out=[]; let row=[],cell='',quoted=false;
    for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'&&quoted&&text[i+1]==='"'){cell+='"';i++;}else if(c==='"')quoted=!quoted;else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>String(v).trim()!==''))out.push(row);row=[];cell='';}else cell+=c;}
    if(cell!==''||row.length){row.push(cell);out.push(row);} return out;
  }
  const token=s=>String(s??'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const aliases={name:['assetname','asset','description','assetdescription'],cost:['cost','originalcost','grossblock','assetcost','capitalizedcost'],date:['puttousedate','dateputtouse','dateplacedinservice','availableforuse','inservicedate','commencementofuse'],life:['usefullifeyears','usefullife','lifeinyears','life'],residual:['residualvalue','residual','salvagevalue'],opening:['openingaccumulateddepreciation','openingaccumdepreciation','accumulateddepreciationopening','openingdepreciation']};
  function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);}
  function doCalc() {
    const fy=Number($('fy').value), start=new Date(fy,3,1), end=new Date(fy+1,3,1), daysFY=dayDiff(start,end), basis=$('proration').value;
    const inp=rowsFromInputs(); if(!inp.length)return say('Add at least one asset row.',true);
    const results=[]; const errors=[];
    inp.forEach((r,i)=>{
      const name=String(r.name||'').trim(), cost=parseMoney(r.cost), put=parseDate(r.date), life=Number(r.life), residual=parseMoney(r.residual);
      const ix=i+1;
      if(!name){errors.push(`Row ${ix}: enter an asset name.`);return;}
      if(!Number.isFinite(cost)||cost<=0){errors.push(`Row ${ix} (${name}): cost must be greater than zero.`);return;}
      if(!put){errors.push(`Row ${ix} (${name}): enter a valid put-to-use date.`);return;}
      if(!Number.isFinite(life)||!Number.isInteger(life)||life<=0||life>100){errors.push(`Row ${ix} (${name}): useful life must be a whole number from 1 to 100 years.`);return;}
      if(!Number.isFinite(residual)||residual<0||residual>=cost){errors.push(`Row ${ix} (${name}): residual value must be non-negative and less than cost.`);return;}
      const openingProvided=String(r.opening??'').trim()!=='';
      let opening=openingProvided?parseMoney(r.opening):0;
      if(!Number.isFinite(opening)||opening<0){errors.push(`Row ${ix} (${name}): opening accumulated depreciation must be non-negative.`);return;}
      const depreciable=cost-residual;
      if(opening>depreciable+0.005){errors.push(`Row ${ix} (${name}): opening accumulated depreciation exceeds cost less residual value.`);return;}
      const lifeEnd=addDateYears(put,life),lifeDays=dayDiff(put,lifeEnd);
      const useDays=activeDays(start,end,put,lifeEnd),useMonths=monthOverlap(start,end,put,lifeEnd);
      const priorMonths=monthOverlap(put,start,put,lifeEnd);
      const annual=depreciable/life;
      if(!openingProvided){
        if(basis==='months') opening=Math.min(depreciable,annual*Math.min(life*12,priorMonths)/12);
        else {
          const firstFY=put.getMonth()>=3?put.getFullYear():put.getFullYear()-1; let estimated=0;
          for(let y=firstFY;y<fy;y++){const ys=new Date(y,3,1),ye=new Date(y+1,3,1),yd=dayDiff(ys,ye),used=activeDays(ys,ye,put,lifeEnd);if(yd)estimated+=annual*used/yd;}
          opening=Math.min(depreciable,estimated);
        }
      }
      const unrounded=basis==='months'?annual*useMonths/12:annual*(daysFY?useDays/daysFY:0);
      const current=Math.max(0,Math.min(depreciable-opening,unrounded));
      const closingAccum=Math.min(depreciable,opening+current);
      const closingNbv=Math.max(residual,cost-closingAccum);
      results.push({name,cost,putDate:isoLocal(put),life,residual,opening,openingSource:openingProvided?'User-entered':'Estimated from date/life',depreciable,days:useDays,months:useMonths,annual,current,closingAccum,closingNbv});
    });
    if(errors.length){state.results=[];$('assetOutputArea').hidden=true;$('exportAssets').disabled=true;say(errors.slice(0,8).join(' ')+(errors.length>8?` Plus ${errors.length-8} more validation error(s).`:''),true);return;}
    state.results=results; const sum=k=>results.reduce((t,r)=>t+r[k],0);
    $('assetKpis').innerHTML=[['Assets in schedule',String(results.length)],['Current-year depreciation',money(sum('current'))],['Opening NBV',money(sum('cost')-sum('opening'))],['Closing carrying amount',money(sum('closingNbv'))]].map(([a,b])=>`<div class="kpi"><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join('');
    $('assetResults').innerHTML=results.map(r=>`<tr><td>${esc(r.name)}</td><td>${money(r.cost)}</td><td>${money(r.opening)}</td><td>${esc(r.openingSource)}</td><td>${money(r.depreciable)}</td><td>${r.days} days / ${r.months} months</td><td>${money(r.annual)}</td><td>${money(r.current)}</td><td>${money(r.closingAccum)}</td><td>${money(r.closingNbv)}</td></tr>`).join('');
    $('assetTotals').innerHTML=`<tr><td>Total</td><td>${money(sum('cost'))}</td><td>${money(sum('opening'))}</td><td>—</td><td>${money(sum('depreciable'))}</td><td>—</td><td>${money(sum('annual'))}</td><td>${money(sum('current'))}</td><td>${money(sum('closingAccum'))}</td><td>${money(sum('closingNbv'))}</td></tr>`;
    $('assetOutputArea').hidden=false;$('exportAssets').disabled=false;say(`Calculated ${results.length} asset(s) for FY ${fy}–${String(fy+1).slice(-2)}. Review inputs, assumptions and the output before posting.`);$('assetOutputArea').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function exportSchedule(){if(!state.results.length)return;const headers=['Asset Name','Cost','Put To Use Date','Useful Life Years','Residual Value','Opening Accumulated Depreciation','Opening Balance Source','Depreciable Amount','In-use Days in FY','In-use Months in FY','Annual Depreciation','Current-year Depreciation','Closing Accumulated Depreciation','Closing Carrying Amount'];const rows=state.results.map(r=>[r.name,r.cost,r.putDate,r.life,r.residual,r.opening,r.openingSource,r.depreciable,r.days,r.months,r.annual,r.current,r.closingAccum,r.closingNbv]);const csv=window.PraviCSV.serialize([headers,...rows]);download(new Blob([csv],{type:'text/csv;charset=utf-8;'}),'PRAVI_fixed_asset_depreciation_schedule.csv');}
  $('addAsset').addEventListener('click',()=>{createRow();markDirty();});$('calcAssets').addEventListener('click',doCalc);$('exportAssets').addEventListener('click',exportSchedule);
  $('fy').addEventListener('change',markDirty);$('proration').addEventListener('change',markDirty);
  $('templateAsset').addEventListener('click',()=>{const s='Asset Name,Cost,Put To Use Date,Useful Life Years,Residual Value,Opening Accumulated Depreciation\r\nOffice laptop,75000,2026-04-12,3,3750,\r\n';download(new Blob(['\ufeff',s],{type:'text/csv;charset=utf-8;'}),'PRAVI_asset_register_template.csv');});
  $('assetCsv').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const rows=csvRows(await f.text());if(rows.length<2)throw new Error('The CSV needs a header row and at least one asset row.');const headers=rows[0].map(token);const map={};for(const key of Object.keys(aliases)){map[key]=headers.findIndex(h=>aliases[key].some(a=>token(a)===h));if(map[key]<0&&key==='life')map[key]=headers.findIndex(h=>h.includes('life'));}
      const required=['name','cost','date','life'];const missing=required.filter(k=>map[k]<0);if(missing.length)throw new Error(`CSV is missing required columns: ${missing.join(', ')}. Download the template for the required header names.`);
      const data=rows.slice(1).map(r=>({name:r[map.name]||'',cost:r[map.cost]||'',date:parseDate(r[map.date])?isoLocal(parseDate(r[map.date])):r[map.date]||'',life:r[map.life]||'',residual:map.residual>=0?r[map.residual]||'0':'0',opening:map.opening>=0?r[map.opening]||'':''})).filter(r=>r.name||r.cost||r.date);
      if(!data.length)throw new Error('No asset rows were found.');setRows(data);say(`Imported ${data.length} asset row(s) from ${f.name}. Run the calculation after reviewing the imported values.`);
    }catch(err){say(err.message,true);}finally{e.target.value='';}});
  function buildWholeLifeSchedule() {
    doCalc();
    if (!state.results.length) return;
    const schedule=[];
    for (const asset of state.results) {
      const firstRowIndex=schedule.length;
      const put=parseDate(asset.putDate);
      const lifeEnd=addDateYears(put,asset.life);
      const depreciable=asset.depreciable;
      let accumulated=0;
      let year=put.getMonth()>=3?put.getFullYear():put.getFullYear()-1;
      const finalFY=lifeEnd.getMonth()>=3?lifeEnd.getFullYear():lifeEnd.getFullYear()-1;
      while (year<=finalFY) {
        const fyStart=new Date(year,3,1), fyEnd=new Date(year+1,3,1);
        const used=activeDays(fyStart,fyEnd,put,lifeEnd);
        if (used>0) {
          const daysInLife=dayDiff(put,lifeEnd);
          let charge=depreciable*(used/daysInLife);
          const isFinal=fyEnd>=lifeEnd;
          if (isFinal) charge=Math.max(0,depreciable-accumulated);
          charge=Math.min(Math.max(0,depreciable-accumulated),charge);
          const opening=Math.max(asset.residual,asset.cost-accumulated);
          accumulated=Math.min(depreciable,accumulated+charge);
          const closing=Math.max(asset.residual,asset.cost-accumulated);
          schedule.push({name:asset.name,fyStart:year,fyLabel:`FY ${year}–${String(year+1).slice(-2)}`,opening,days:used,charge,accumulated,closing});
        }
        year++;
      }
      if(schedule.length>firstRowIndex) schedule[schedule.length-1].closing=asset.residual;
    }
    state.wholeLifeResults=schedule;
    const totalDep=schedule.reduce((t,r)=>t+r.charge,0);
    const uniqueAssets=state.results.length;
    $('wholeLifeKpis').innerHTML=[['Assets',String(uniqueAssets)],['Schedule rows',String(schedule.length)],['Total life depreciation',money(totalDep)],['Residual value at end',money(state.results.reduce((t,r)=>t+r.residual,0))]].map(([a,b])=>`<div class="kpi"><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join('');
    $('wholeLifeResults').innerHTML=schedule.map(r=>`<tr><td>${esc(r.name)}</td><td>${esc(r.fyLabel)}</td><td>${money(r.opening)}</td><td>${r.days}</td><td>${money(r.charge)}</td><td>${money(r.accumulated)}</td><td>${money(r.closing)}</td></tr>`).join('');
    $('wholeLifeOutputArea').hidden=false;
    $('exportWholeLifeAssets').disabled=false;
    $('wholeLifeOutputArea').scrollIntoView({behavior:'smooth',block:'start'});
    say(`Built a whole-life schedule with ${schedule.length} financial-year row(s). Verify the asset life, residual values and proration assumptions before relying on it.`);
  }
  function exportWholeLifeSchedule() {
    const rows=state.wholeLifeResults||[];
    if(!rows.length)return;
    const data=[['Asset Name','Financial Year','Opening Carrying Amount','Days In Use','Depreciation','Accumulated Depreciation','Closing Carrying Amount'],...rows.map(r=>[r.name,r.fyLabel,r.opening,r.days,r.charge,r.accumulated,r.closing])];
    download(new Blob([window.PraviCSV.serialize(data)],{type:'text/csv;charset=utf-8;'}),'PRAVI_whole_life_depreciation_schedule.csv');
  }
  $('wholeLifeAssets').addEventListener('click',buildWholeLifeSchedule);
  $('exportWholeLifeAssets').addEventListener('click',exportWholeLifeSchedule);
  $('fy').addEventListener('change',()=>{markDirty();$('wholeLifeOutputArea').hidden=true;$('exportWholeLifeAssets').disabled=true;});
  $('proration').addEventListener('change',()=>{markDirty();$('wholeLifeOutputArea').hidden=true;$('exportWholeLifeAssets').disabled=true;});
  createRow();
})();
