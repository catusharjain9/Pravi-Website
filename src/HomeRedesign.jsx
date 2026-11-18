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
    <motion.article className={item.featured ? "pr-service-card pr-service-card-featured" : "pr-service-card"}
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
function FounderJourney(){
  const [active,setActive]=React.useState(0);
  const reduce=useReducedMotion();
  const stage=founderStages[active];
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
            {founderStages.map((item,i)=><button key={item.index} type="button" role="tab" id={`pr-stage-tab-${i}`} aria-selected={active===i} aria-controls="pr-stage-panel" onClick={()=>setActive(i)}>
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
        </div>
        <div className="pr-hero-footnote"><span>PRAVI BUSINESS ADVISORS LLP</span><span>CLARITY → CONTROL → GROWTH</span></div>
      </section>

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
