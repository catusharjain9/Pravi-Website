import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

const rise = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };

function FinanceControlPanel() {
  const reduce = useReducedMotion();
  return (
    <motion.aside className="pr-finance-board" aria-label="Illustrative founder finance and compliance control panel"
      initial={reduce ? false : { opacity: 0, x: 22, y: 12 }} animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.75, delay: 0.16, ease: [0.2, 0.75, 0.2, 1] }}>
      <div className="pr-board-topline">
        <span>PRAVI / FOUNDER CONTROL ROOM</span>
        <span className="pr-board-status"><i /> ILLUSTRATIVE VIEW</span>
      </div>
      <div className="pr-board-heading">
        <div>
          <p className="pr-board-kicker">FINANCE + COMPLIANCE</p>
          <h2>See the whole picture.</h2>
          <p className="pr-board-description">A connected view of cash, records and obligations.</p>
        </div>
        <span className="pr-board-index">01—03</span>
      </div>
      <div className="pr-board-chart">
        <div className="pr-chart-head">
          <div><span>FINANCE VISIBILITY</span><strong>13-week cash-flow view</strong></div>
          <span className="pr-chart-period">ROLLING FORECAST</span>
        </div>
        <svg className="pr-chart-svg" viewBox="0 0 560 185" role="img" aria-label="Illustrative cash-flow trend line, not client data">
          <defs><linearGradient id="prChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2C653" stopOpacity=".34" />
            <stop offset="100%" stopColor="#F2C653" stopOpacity="0" />
          </linearGradient></defs>
          <g className="pr-chart-grid"><path d="M16 28H544 M16 67H544 M16 106H544 M16 145H544" /></g>
          <path className="pr-chart-area" d="M18 138 C54 130 68 104 106 111 S165 91 202 101 S260 80 298 86 S355 62 392 72 S456 42 492 48 S527 30 542 27 L542 155 L18 155Z" />
          <motion.path className="pr-chart-line"
            d="M18 138 C54 130 68 104 106 111 S165 91 202 101 S260 80 298 86 S355 62 392 72 S456 42 492 48 S527 30 542 27"
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.45, delay: 0.35, ease: "easeInOut" }} />
          <path className="pr-chart-secondary" d="M18 151 C68 142 87 149 130 137 S205 142 245 123 S315 132 357 113 S429 122 467 100 S514 103 542 91" />
          <circle className="pr-chart-point" cx="542" cy="27" r="5" />
          <g className="pr-chart-axis">
            <text x="18" y="176">WEEK 01</text><text x="180" y="176">WEEK 04</text>
            <text x="345" y="176">WEEK 08</text><text x="542" y="176" textAnchor="end">WEEK 13</text>
          </g>
        </svg>
        <div className="pr-chart-legend">
          <span><i className="pr-legend-cash" /> Cash position</span>
          <span><i className="pr-legend-plan" /> Planned movement</span>
          <small>Illustrative only · no client figures</small>
        </div>
      </div>
      <div className="pr-board-bottom">
        <div className="pr-board-metric"><span>COMPLIANCE CONTROL</span><strong>ROC · GST · DIRECT TAX</strong><small>Calendar, evidence and ownership</small></div>
        <div className="pr-board-metric"><span>FINANCE CONTROL</span><strong>CASH · MIS · WORKING CAPITAL</strong><small>Forecasts, reporting and review</small></div>
      </div>
    </motion.aside>
  );
}

const services = [
  { number:"01", category:"STARTUP / LEGAL & ROC COMPLIANCE", title:"Get the foundations right.",
    copy:"A structured route through entity setup, registrations, corporate records and recurring statutory responsibilities.",
    detail:"Entity pathway · ROC calendar · Registers & minutes", href:"/startup-support.html", featured:true },
  { number:"02", category:"FINANCE LEADERSHIP / VIRTUAL CFO", title:"Know where the business stands.",
    copy:"Cash-flow visibility, budgets, management reporting and finance routines that bring better information into decisions.",
    detail:"13-week cash flow · Budgets · Monthly MIS", href:"/virtual-cfo.html", featured:true },
  { number:"03", category:"ACCOUNTING / REPORTING", title:"Make the records useful.",
    copy:"Accounting, reconciliations and a dependable month-end process that turns transaction data into a clear view of performance.",
    detail:"Books · Reconciliations · Close process", href:"/accounting-mis.html" },
  { number:"04", category:"TAX / REGULATORY WORKFLOWS", title:"Keep obligations organised.",
    copy:"GST, direct-tax and TDS workflows supported by reconciled information, documented exceptions and clear follow-through.",
    detail:"GST · Direct tax · TDS", href:"/gst-compliance.html" }
];

function ServiceCard({ item, index }) {
  const reduce = useReducedMotion();
  return (
    <motion.article className={`pr-service-card pr-service-card-${item.number}${item.featured ? " pr-service-card-featured" : ""}`}
      variants={rise} initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.18 }}
      transition={{ duration:reduce ? 0 : 0.48, delay:reduce ? 0 : index*0.07, ease:"easeOut" }}>
      <div className="pr-service-card-top"><span className="pr-service-number">{item.number}</span><span className="pr-service-category">{item.category}</span></div>
      <div className="pr-service-card-copy"><h3>{item.title}</h3><p>{item.copy}</p></div>
      <div className="pr-service-card-foot"><span>{item.detail}</span><Link to={item.href} aria-label={"Explore " + item.title}>Explore <b>↗</b></Link></div>
    </motion.article>
  );
}

const founderStages = [
  {tab:"Set up",caption:"Establish the foundation",index:"01",phase:"STARTUP FOUNDATIONS",title:"Make the foundation dependable.",description:"The early decisions create the records and responsibilities that the business will rely on later.",items:[["Entity & ownership records","Clarify the chosen structure, ownership, decision rights and core corporate records."],["Registration applicability","Map registrations and permissions against the activity, location and actual facts."],["ROC calendar & governance","Set out recurring and event-based obligations, owners, reviewers and evidence."]],href:"/startup-support.html",link:"Explore startup support"},
  {tab:"Build control",caption:"Make finance visible",index:"02",phase:"FINANCE OPERATIONS",title:"Turn records into a useful view.",description:"Bring reconciliations, cash visibility and monthly reporting into one dependable operating rhythm.",items:[["Month-end & reconciliations","Close the books with bank, ledger and balance-sheet checks."],["13-week cash-flow view","Track timing, expected receipts, committed payments and scenarios."],["Monthly MIS","Explain performance, working capital, exceptions and management actions."]],href:"/virtual-cfo.html",link:"Explore Virtual CFO support"},
  {tab:"Prepare to scale",caption:"Plan the next stage",index:"03",phase:"GROWTH & READINESS",title:"Give growth a stronger operating base.",description:"Connect the growth plan to financial assumptions, evidence, governance and accountable decisions.",items:[["Budgets & scenarios","Connect growth plans to costs, headcount, margins and funding assumptions."],["Diligence-ready records","Keep schedules, reconciliations and supporting evidence organised."],["Governance & finance rhythm","Review recurring obligations, cash, reporting and open management actions."]],href:"/business-advisory.html",link:"Explore business advisory"}
];
const financeSetups = [
  {
    id:"founder", number:"01", title:"Founder-led", subtitle:"I manage finance myself",
    resultTitle:"A founder needs timely numbers—not another admin burden.",
    resultIntro:"When finance work competes with sales and operations, the business can lose a reliable view between filing deadlines.",
    watch:["Books and reconciliations may fall behind during busy periods.","Cash decisions may rely on the bank balance rather than a forward view.","Compliance follow-ups can depend on the founder remembering every action."],
    support:["Set a practical monthly close and reconciliation rhythm.","Build a 13-week cash-flow view from expected receipts and committed payments.","Map applicable obligations, evidence and owners in one working calendar."]
  },
  {
    id:"inhouse", number:"02", title:"In-house accountant", subtitle:"One person handles the day-to-day work",
    resultTitle:"A review layer protects continuity and quality.",
    resultIntro:"An internal accountant can know the business well, but a single-person process may leave limited review capacity or backup.",
    watch:["Key knowledge and month-end progress may sit with one person.","Unreviewed balances or old reconciling items can accumulate.","Management may receive reports without clear explanations or actions."],
    support:["Introduce a documented month-end checklist and review points.","Review bank, ledger and control-account reconciliations with an exception log.","Turn recurring reports into a concise MIS review and action list."]
  },
  {
    id:"ca", number:"03", title:"External CA firm", subtitle:"Year-end work and filings are handled externally",
    resultTitle:"Year-end compliance and monthly management serve different needs.",
    resultIntro:"An external CA relationship can remain valuable. The separate question is whether the business also receives timely operating information during the year.",
    watch:["Management visibility may be limited between periodic or year-end work.","Clean-up and reconciliation can bunch up near statutory deadlines.","Cash, margins and working-capital movement may be reviewed too late."],
    support:["Complement the existing professional relationship where the agreed scope allows.","Organise monthly books, reconciliations and a management reporting rhythm.","Prepare schedules and supporting records so year-end handover is more orderly."]
  },
  {
    id:"split", number:"04", title:"Split across people or systems", subtitle:"Books, tax and reporting sit in different places",
    resultTitle:"Disconnected responsibilities need one operating rhythm.",
    resultIntro:"When data and ownership are spread across teams or providers, the hand-offs can become as important as the accounting entries.",
    watch:["The same issue may be checked by several people—or missed by everyone.","Different spreadsheets and exports can create inconsistent versions of the numbers.","Open exceptions may have no clear owner or closure date."],
    support:["Set a responsibility matrix for preparation, review and approval.","Standardise the close calendar, source files and reconciliation records.","Maintain a shared exception list and a consistent monthly MIS structure."]
  }
];


const sectorHighlights = [
  ["01","Startups & founder-led","Entity foundations · runway · reporting","startup"],
  ["02","Manufacturing & processing","Cost visibility · inventory · working capital","manufacturing"],
  ["03","Trading, distribution & D2C","Product margins · stock · cash conversion","trading"],
  ["04","Professional & knowledge services","Project economics · billing · collections","services"]
];

function SectorPathwayPreview(){
  return <section className="pr-sector-preview" aria-labelledby="pr-sector-preview-title">
    <div className="pr-sector-preview-head">
      <div><p className="pr-section-label">WHO WE HELP · BY BUSINESS CONTEXT</p><h2 id="pr-sector-preview-title">Different models.<br/><em>Different control questions.</em></h2></div>
      <div><p>Finance priorities shift with the way a business earns, delivers, holds stock and collects cash. Explore a pathway that reflects the operating model.</p><Link to="/who-we-help.html">Explore all sector pathways <b aria-hidden="true">↗</b></Link></div>
    </div>
    <div className="pr-sector-preview-grid">
      {sectorHighlights.map(([number,title,copy,id])=><Link key={id} to={"/who-we-help.html?sector="+id} className="pr-sector-preview-card">
        <span>{number}</span><strong>{title}</strong><small>{copy}</small><b aria-hidden="true">↗</b>
      </Link>)}
    </div>
    <p className="pr-sector-preview-note">Illustrative business contexts—not client case studies or claims of prior sector assignments.</p>
  </section>;
}

function FinanceFitSelector(){
  const [active,setActive]=React.useState("founder");
  const setup=financeSetups.find(item=>item.id===active)||financeSetups[0];
  return (
    <section className="pr-finance-fit" aria-labelledby="pr-finance-fit-title">
      <div className="pr-finance-fit-inner">
        <div className="pr-finance-fit-heading">
          <p className="pr-section-label">START WITH YOUR CURRENT SETUP</p>
          <h2 id="pr-finance-fit-title">How is finance managed<br/><em>in your business today?</em></h2>
          <p>The right support depends on how the work is organised now. Choose the closest description to see the pressure points worth reviewing and a practical control model.</p>
        </div>
        <fieldset className="pr-finance-fit-fieldset">
          <legend>Choose the setup that sounds closest.</legend>
          <div className="pr-finance-fit-options">
            {financeSetups.map(item=>(
              <label key={item.id} className={`pr-finance-fit-choice${active===item.id?" is-active":""}`}>
                <input type="radio" name="pr-finance-setup" value={item.id} checked={active===item.id} onChange={()=>setActive(item.id)}/>
                <span className="pr-fit-choice-number">{item.number}</span>
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
                <b aria-hidden="true">↗</b>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="pr-finance-fit-result" aria-live="polite" aria-atomic="true">
          <div className="pr-fit-result-topline">
            <span>PRAVI / FINANCE CONTROL · {setup.number}</span>
            <span>ILLUSTRATIVE GUIDANCE</span>
          </div>
          <div className="pr-fit-result-grid">
            <article className="pr-fit-result-context">
              <p className="pr-fit-result-label">PRESSURE POINTS TO WATCH</p>
              <h3>{setup.resultTitle}</h3>
              <p className="pr-fit-result-intro">{setup.resultIntro}</p>
              <ul>{setup.watch.map(item=><li key={item}>{item}</li>)}</ul>
            </article>
            <article className="pr-fit-result-action">
              <p className="pr-fit-result-label">HOW PRAVI CAN HELP STRUCTURE THE WORK</p>
              <h3>Build a more dependable rhythm.</h3>
              <ul>{setup.support.map(item=><li key={item}>{item}</li>)}</ul>
              <Link to="/contact.html" className="pr-fit-result-link">Discuss your current setup <b aria-hidden="true">↗</b></Link>
            </article>
          </div>
          <p className="pr-fit-result-note">Illustrative starting points, not a diagnosis or a fixed service package. Applicability, deliverables and professional responsibilities are confirmed after reviewing the entity, records and agreed scope.</p>
        </div>
      </div>
    </section>
  );
}

function FounderJourney(){
  const [active,setActive]=React.useState(0);
  const reduce=useReducedMotion();
  const stage=founderStages[active];
  const handleTabKey=(event,index)=>{let next=index;if(event.key==="ArrowRight")next=(index+1)%founderStages.length;else if(event.key==="ArrowLeft")next=(index-1+founderStages.length)%founderStages.length;else if(event.key==="Home")next=0;else if(event.key==="End")next=founderStages.length-1;else return;event.preventDefault();setActive(next);event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[next]?.focus();};
  return <section className="pr-founder-journey" aria-labelledby="pr-journey-title">
    <div className="pr-journey-inner">
      <div className="pr-journey-heading">
        <p className="pr-section-label">A MORE USEFUL WAY TO THINK ABOUT THE JOURNEY</p>
        <h2 id="pr-journey-title">Different stages.<br/><em>Different controls.</em></h2>
        <p>The priorities change as a business develops. Select a stage to see the work that may need attention — the actual scope depends on the entity, facts and agreed engagement.</p>
        <div className="pr-journey-stamp"><span>PRAVI / FIELD GUIDE</span><b>01—03</b></div>
      </div>
      <div className="pr-journey-console">
        <div className="pr-journey-console-head"><span>FOUNDER PATHWAY</span><span>SELECT A STAGE <i/></span></div>
        <div className="pr-journey-console-body">
          <div className="pr-journey-tabs" role="tablist" aria-label="Business development stages">
            {founderStages.map((item,i)=><button key={item.index} type="button" role="tab" id={`pr-stage-tab-${i}`} aria-selected={active===i} aria-controls="pr-stage-panel" tabIndex={active===i?0:-1} onKeyDown={event=>handleTabKey(event,i)} onClick={()=>setActive(i)}>
              <span>{item.index}</span><strong>{item.tab}</strong><small>{item.caption}</small><b aria-hidden="true">↗</b>
            </button>)}
          </div>
          <motion.div key={stage.index} id="pr-stage-panel" className="pr-journey-panel" role="tabpanel" aria-labelledby={`pr-stage-tab-${active}`} initial={reduce?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.34,ease:"easeOut"}}>
            <div className="pr-journey-panel-top"><span>{stage.index} / {stage.phase}</span><b>{stage.index}</b></div>
            <h3>{stage.title}</h3>
            <p className="pr-journey-panel-intro">{stage.description}</p>
            <div className="pr-journey-items">{stage.items.map((item,i)=><article key={item[0]}><span>0{i+1}</span><div><strong>{item[0]}</strong><p>{item[1]}</p></div></article>)}</div>
            <Link to={stage.href} className="pr-journey-link">{stage.link}<b>↗</b></Link>
          </motion.div>
        </div>
        <div className="pr-journey-console-foot"><span>CLARITY → CONTROL → GROWTH</span><span>PRAVI BUSINESS ADVISORS LLP</span></div>
      </div>
    </div>
  </section>;
}

export default function HomeRedesign() {
  const reduce = useReducedMotion();
  return (
    <main className="pr-home">
      <section className="pr-home-hero">
        <div className="pr-home-hero-inner">
          <motion.div className="pr-home-copy" initial={reduce ? false : "hidden"} animate="visible" variants={rise}
            transition={{ duration:0.62, ease:[0.2,0.75,0.2,1] }}>
            <p className="pr-home-eyebrow"><span /> STARTUP COMPLIANCE · VIRTUAL CFO · FINANCE SYSTEMS</p>
            <h1>Build the business.<br /><em>Stay in control.</em></h1>
            <p className="pr-home-intro">Startup legal and ROC compliance, Virtual CFO support and dependable finance systems — connected around the decisions founders have to make.</p>
            <div className="pr-home-actions">
              <Link className="pr-button pr-button-dark" to="/startup-support.html">Explore startup support <span>↗</span></Link>
              <Link className="pr-button pr-button-line" to="/virtual-cfo.html">Virtual CFO services</Link>
            </div>
            <div className="pr-home-assurance"><span>Clearly scoped work</span><i /><span>Documented responsibilities</span><i /><span>Practical follow-through</span></div>
          </motion.div>
          <FinanceControlPanel />
          <div className="pr-hero-orbit" aria-hidden="true">
            <svg viewBox="0 0 520 520" role="presentation">
              <circle cx="260" cy="260" r="226" />
              <circle cx="260" cy="260" r="184" />
              <circle cx="260" cy="260" r="142" />
              <path d="M260 12V508M12 260H508" />
              <circle className="pr-orbit-dot pr-orbit-dot-a" cx="260" cy="34" r="7" />
              <circle className="pr-orbit-dot pr-orbit-dot-b" cx="445" cy="260" r="5" />
              <circle className="pr-orbit-dot pr-orbit-dot-c" cx="260" cy="402" r="4" />
            </svg>
            <span className="pr-orbit-label pr-orbit-label-a">01 / CASH FLOW</span>
            <span className="pr-orbit-label pr-orbit-label-b">02 / COMPLIANCE</span>
            <span className="pr-orbit-label pr-orbit-label-c">03 / CLARITY</span>
          </div>
          <div className="pr-hero-stickers" aria-hidden="true">
            <span className="pr-sticker pr-sticker-yellow"><b>LESS CHAOS.</b><i>MORE CLARITY.</i><em>✳</em></span>
            <span className="pr-sticker pr-sticker-outline">FOUNDER<br/>FIRST <b>↗</b></span>
            <span className="pr-hero-scribble">GOOD SYSTEMS<br/>MAKE ROOM TO GROW <b>〰</b></span>
          </div>
        </div>
        <div className="pr-hero-footnote"><span>PRAVI BUSINESS ADVISORS LLP</span><span>CLARITY → CONTROL → GROWTH</span></div>
      </section>

      <div className="pr-kinetic-ticker" aria-label="PRAVI services">
        <div className="pr-ticker-track">
          <span>STARTUP LEGAL</span><b>✳</b><span>VIRTUAL CFO</span><b>✳</b><span>CASH FLOW</span><b>✳</b><span>ROC COMPLIANCE</span><b>✳</b><span>FOUNDER FINANCE</span><b>✳</b><span>MONTHLY MIS</span><b>✳</b>
          <span>STARTUP LEGAL</span><b>✳</b><span>VIRTUAL CFO</span><b>✳</b><span>CASH FLOW</span><b>✳</b><span>ROC COMPLIANCE</span><b>✳</b><span>FOUNDER FINANCE</span><b>✳</b><span>MONTHLY MIS</span><b>✳</b>
        </div>
      </div>

      <section className="pr-founder-priorities">
        <div className="pr-founder-priorities-inner">
          <p className="pr-section-label">WHAT FOUNDERS NEED TO KEEP IN VIEW</p>
          <div className="pr-priority-list">
            <div><span>01</span><strong>Entity &amp; legal compliance</strong><small>Structure, records and recurring obligations</small></div>
            <div><span>02</span><strong>Financial control</strong><small>Cash, budgets and business performance</small></div>
            <div><span>03</span><strong>Reliable information</strong><small>Accounting, reconciliations and reporting</small></div>
          </div>
        </div>
      </section>

      <section className="pr-home-services">
        <div className="pr-section-heading">
          <div><p className="pr-section-label">WHERE PRAVI WORKS</p><h2>One business.<br /><em>Connected responsibilities.</em></h2></div>
          <p>Compliance, accounting and finance should not operate as disconnected tasks. The work is organised around the entity, the available records and the decisions that need reliable information.</p>
        </div>
        <div className="pr-service-grid">{services.map((item,index)=><ServiceCard key={item.number} item={item} index={index}/>)}</div>
        <div className="pr-more-services">
          <span>ADDITIONAL SUPPORT</span>
          <Link to="/business-advisory.html">Business advisory <b>↗</b></Link>
          <Link to="/direct-tax.html">Direct tax <b>↗</b></Link>
          <Link to="/resources.html">Founder resources <b>↗</b></Link>
        </div>
      </section>

      <SectorPathwayPreview />

      <FinanceFitSelector />

      <FounderJourney />

      <section className="pr-operating-system">
        <div className="pr-operating-inner">
          <div className="pr-operating-intro">
            <p className="pr-section-label">A PRACTICAL OPERATING RHYTHM</p>
            <h2>From obligations<br />to <em>better decisions.</em></h2>
            <p>A useful finance function connects the records, the compliance calendar and the management view — with ownership made clear at each step.</p>
          </div>
          <div className="pr-operating-steps">
            <article><span>01</span><strong>Establish</strong><p>Understand the entity, registrations and responsibilities.</p></article>
            <article><span>02</span><strong>Organise</strong><p>Bring books, records and reconciliations into order.</p></article>
            <article><span>03</span><strong>Monitor</strong><p>Track deadlines, cash movement and open exceptions.</p></article>
            <article><span>04</span><strong>Review</strong><p>Use management information to decide what happens next.</p></article>
          </div>
        </div>
      </section>

      <section className="pr-home-tools">
        <div className="pr-tools-copy">
          <p className="pr-section-label">WORKPAPERS &amp; FOUNDER RESOURCES</p>
          <h2>Useful tools for the work behind the numbers.</h2>
          <p>Explore practical calculators, trackers and guides that support day-to-day finance and compliance workflows.</p>
        </div>
        <div className="pr-tools-actions"><Link to="/tools.html">Explore business tools <span>↗</span></Link><Link to="/resources.html">Read founder resources <span>↗</span></Link></div>
      </section>

      <section className="pr-home-contact">
        <div><p className="pr-section-label">START WITH THE BUSINESS QUESTION</p><h2>Make the next decision<br /><em>with a clearer picture.</em></h2></div>
        <div className="pr-contact-action"><p>Tell us what you are building, where the work currently stands and what needs attention.</p><Link className="pr-button pr-button-dark" to="/contact.html">Start a conversation <span>↗</span></Link></div>
      </section>
    </main>
  );
}
