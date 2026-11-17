import React from "react";
import {Link,Route,Routes,useLocation} from "react-router-dom";
import {motion,useReducedMotion,useScroll,useSpring} from "motion/react";
import {AboutPage,ServicesPage,VirtualCfoPage,StartupSupportPage,DirectTaxPage,GstCompliancePage,AccountingMisPage,BusinessAdvisoryPage,ResourcesPage,InsightsPage,GuidePage,ArticlePage,ContactPage,PrivacyPage} from "./pages.jsx";
const nav=[["About","/about.html"],["Services","/services.html"],["Tools","/tools.html"],["Resources","/resources.html"],["Insights","/insights.html"]];
const legacyHref=(path)=>`${import.meta.env.BASE_URL.replace(/\/$/,"")}${path}`;

function LogoIntro(){
 const reduce=useReducedMotion();
 const[visible,setVisible]=React.useState(!reduce);
 React.useEffect(()=>{if(reduce){setVisible(false);return;}const timer=window.setTimeout(()=>setVisible(false),2650);return()=>window.clearTimeout(timer);},[reduce]);
 if(!visible||reduce)return null;
 return <motion.div className="logo-intro-react" aria-hidden="true" initial={{opacity:1}} animate={{opacity:[1,1,1,0]}} transition={{duration:2.65,times:[0,.76,.91,1],ease:"easeInOut"}} onAnimationComplete={()=>setVisible(false)}>
  <svg className="logo-intro-contours" viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice">
   {Array.from({length:19},(_,i)=><motion.path key={i} d={`M ${-160+i*20} ${70+i*31} C ${120+i*17} ${-90+i*21}, ${380+i*13} ${810-i*23}, ${1360-i*17} ${150+i*28}`} fill="none" stroke={i%4===0?"#D78A49":"#303030"} strokeOpacity={i%4===0?.58:.14} strokeWidth={i%4===0?2.2:1.15} initial={{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:1}} transition={{duration:1.8+i*.035,delay:i*.018,ease:"easeOut"}}/>)}
  </svg>
  <motion.div className="logo-intro-orbit" animate={{rotate:360}} transition={{duration:12,repeat:Infinity,ease:"linear"}}/>
  <motion.img src={`${import.meta.env.BASE_URL}assets/img/pravi-logo-full.svg`} alt="" initial={{scale:.62,opacity:0,rotate:-3,y:16}} animate={{scale:[.62,1.04,1],opacity:[0,1,1],rotate:[-3,1,0],y:[16,-4,0]}} transition={{duration:2.15,times:[0,.72,1],ease:[.2,.8,.2,1]}}/>
  <motion.span className="logo-intro-signature" initial={{opacity:0,y:12,letterSpacing:"0.3em"}} animate={{opacity:[0,1,1],y:[12,0,0],letterSpacing:[".3em",".16em",".16em"]}} transition={{duration:1.1,delay:.85,ease:"easeOut"}}>CLARITY <i>·</i> CONTROL <i>·</i> GROWTH</motion.span>
 </motion.div>;
}
const routeMeta={
 "/":{title:"PRAVI Business Advisors LLP | Startup Finance & Virtual CFO",description:"Startup finance, Virtual CFO, accounting, tax and compliance advisory for founders and growing businesses. PRAVI Business Advisors LLP."},
 "/about.html":{title:"About PRAVI | Business Advisors for Founders",description:"Learn about PRAVI Business Advisors LLP and its approach to startup finance, accounting, tax, compliance and business advisory."},
 "/services.html":{title:"Services | PRAVI Business Advisors LLP",description:"Explore startup support, Virtual CFO, accounting and MIS, GST, direct tax and business advisory services from PRAVI."},
 "/virtual-cfo.html":{title:"Virtual CFO & Finance Leadership | PRAVI",description:"Virtual CFO support for cash-flow forecasting, budgets, MIS, performance reviews and finance-function coordination."},
 "/startup-support.html":{title:"Startup Legal & Compliance Support | PRAVI",description:"Founder-focused startup support for entity setup pathways, ROC compliance mapping, registrations, records and finance foundations."},
 "/direct-tax.html":{title:"Direct Tax Support | PRAVI Business Advisors",description:"Structured direct-tax support for return preparation, TDS workflows, tax issue analysis and assessment documentation."},
 "/gst-compliance.html":{title:"GST Compliance & Reconciliation | PRAVI",description:"GST compliance support, books-to-portal reconciliation, input tax credit review and return preparation workflows."},
 "/accounting-mis.html":{title:"Accounting & Monthly MIS | PRAVI",description:"Accounting, reconciliations, month-end close, management reporting and financial information for growing businesses."},
 "/business-advisory.html":{title:"Business Advisory & Financial Planning | PRAVI",description:"Business planning, budgets, forecasts, feasibility, working-capital review and management decision support."},
 "/resources.html":{title:"Founder Resources & Finance Guides | PRAVI",description:"Practical founder guides for startup compliance, Virtual CFO, GST reconciliation, accounting and monthly MIS."},
 "/insights.html":{title:"Business Finance Insights & Articles | PRAVI",description:"Practical articles on startup accounting, cash-flow planning, GST reconciliation and management reporting."},
 "/contact.html":{title:"Contact PRAVI Business Advisors",description:"Contact PRAVI about startup compliance, GST, accounting, Virtual CFO, financial planning and business advisory requirements."},
 "/privacy.html":{title:"Privacy Notice | PRAVI Business Advisors",description:"Draft privacy information for the PRAVI Business Advisors website. Review status and data-handling details are disclosed.",robots:"noindex,follow"},
 "/guide-startup-compliance.html":{title:"Startup Compliance Checklist | PRAVI",description:"A founder checklist for entity details, registrations, accounting records, compliance calendars and responsibility ownership."},
 "/guide-virtual-cfo.html":{title:"Virtual CFO Scope & Deliverables Guide | PRAVI",description:"Define Virtual CFO outputs, finance responsibilities, reporting cadence, cash-flow forecasts and management reviews."},
 "/guide-gst-reconciliation.html":{title:"GST Reconciliation Preparation Checklist | PRAVI",description:"Prepare GST purchase reconciliations with clean source data, exception categories, evidence and follow-up owners."},
 "/guide-monthly-mis.html":{title:"Monthly MIS Reporting Guide | PRAVI",description:"Build a useful monthly MIS through management questions, period close, variance explanations and action ownership."},
 "/article-13-week-cashflow.html":{title:"13-Week Cash-Flow Forecast Guide | PRAVI",description:"Build a rolling 13-week cash-flow forecast with opening cash, expected receipts, payments, scenarios and weekly controls."},
 "/article-first-90-days-accounting.html":{title:"The First 90 Days of Startup Accounting | PRAVI",description:"Set up startup accounting records, monthly close routines, compliance ownership and first management reports."},
 "/article-gst-purchase-reconciliation.html":{title:"GST Purchase Reconciliation: Organising Mismatches | PRAVI",description:"A practical process for matching purchase data, classifying GST differences and documenting evidence and follow-up."},
 "/article-monthly-mis-review.html":{title:"Monthly MIS: What Business Owners Should Review | PRAVI",description:"Review revenue, profitability, cash, working capital, balance-sheet quality and management actions in a monthly MIS."}
};
function RouteMeta(){const location=useLocation();React.useEffect(()=>{const path=location.pathname;const meta=routeMeta[path]||routeMeta["/"];document.title=meta.title;const set=(selector,attr,value)=>{let node=document.head.querySelector(selector);if(!node){node=document.createElement("meta");if(selector.startsWith('meta[name='))node.name=selector.match(/name="([^"]+)"/)?.[1]||"";else node.setAttribute("property",selector.match(/property="([^"]+)"/)?.[1]||"");document.head.appendChild(node);}node.setAttribute("content",value);};set('meta[name="description"]',"content",meta.description);set('meta[property="og:title"]',"content",meta.title);set('meta[property="og:description"]',"content",meta.description);set('meta[property="og:type"]',"content",path.startsWith("/article-")?"article":"website");set('meta[name="twitter:card"]',"content","summary");set('meta[name="robots"]',"content",meta.robots||"index,follow");let canonical=document.head.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement("link");canonical.rel="canonical";document.head.appendChild(canonical);}canonical.href=window.location.origin+window.location.pathname;},[location.pathname]);return null;}
function Brand({full=false}){const file=full?"pravi-logo-full.svg":"pravi-logo.svg";return <Link className={full?"brand brand-full":"brand"} to="/" aria-label="PRAVI Business Advisors home"><img src={`${import.meta.env.BASE_URL}assets/img/${file}`} alt="PRAVI Business Advisors LLP"/></Link>}
function Header(){const[open,setOpen]=React.useState(false);return <header className="header"><div className="wrap navrow"><Brand/><button className="menu" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">☰</button><nav className={open?"nav open":"nav"}>{nav.map(([n,p])=><a key={p} href={legacyHref(p)} onClick={()=>setOpen(false)}>{n}</a>)}<a className="nav-cta" href={legacyHref("/contact.html")}>Get in touch ↗</a></nav></div></header>}
function ContourField(){
 const reduce=useReducedMotion();
 const base=import.meta.env.BASE_URL;
 return <div className="contour finance-doodle-scene" aria-hidden="true">
  <motion.div className="finance-doodle-paper" initial={reduce?false:{opacity:0,scale:.84,rotate:-5}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:.95,ease:[.2,.8,.2,1]}}>
   <img src={`${base}assets/img/pravi-doodle-founder.svg`} alt=""/>
  </motion.div>
  <svg className="finance-doodle-lines" viewBox="0 0 620 500" fill="none">
   <motion.path d="M30 365C95 300 105 225 185 220S290 310 350 245 455 110 570 85" stroke="#303030" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="7 10" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:2.2,delay:.3}}/>
   <motion.path d="M62 425C145 395 181 365 235 380S339 429 415 360 500 240 580 252" stroke="#D78A49" strokeWidth="3" strokeLinecap="round" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.8,delay:.7}}/>
   <motion.circle cx="350" cy="245" r="9" fill="#FFE000" stroke="#303030" strokeWidth="2" animate={reduce?{}:{scale:[1,1.4,1]}} transition={{duration:2.8,repeat:Infinity}}/>
   <motion.path d="M550 70l20 15-24 7" stroke="#D78A49" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" animate={reduce?{}:{x:[0,5,0],y:[0,-5,0]}} transition={{duration:3.4,repeat:Infinity}}/>
  </svg>
  <motion.div className="finance-note finance-note-runway" animate={reduce?{}:{y:[0,-9,0],rotate:[-4,-1,-4]}} transition={{duration:6.5,repeat:Infinity,ease:"easeInOut"}}><span>13-WEEK VIEW</span><strong>Cash runway</strong><small>See pressure before it lands</small></motion.div>
  <motion.div className="finance-note finance-note-close" animate={reduce?{}:{y:[0,8,0],rotate:[3,0,3]}} transition={{duration:7.2,repeat:Infinity,ease:"easeInOut"}}><span>MONTH-END</span><strong>Close control</strong><small>Records into decisions</small></motion.div>
  <span className="finance-doodle-caption">FOUNDER FINANCE / FIELD NOTES 01</span>
 </div>;
}
function Home(){
 const reduce=useReducedMotion();
 const base=import.meta.env.BASE_URL;
 const cards=[
  ["01 / FINANCE LEADERSHIP","Virtual CFO & cash-flow planning","Budgets, cash forecasts, financial performance reviews and decision-useful management reporting.","/virtual-cfo.html","pravi-doodle-cashflow.svg"],
  ["02 / FINANCE OPERATIONS","Accounting & monthly MIS","Books, reconciliations and structured monthly reporting that explain business performance.","/accounting-mis.html","pravi-doodle-compliance.svg"],
  ["03 / TAX & COMPLIANCE","GST, direct tax & regulatory support","Applicability review, compliance coordination and documented tax workflows.","/gst-compliance.html","pravi-doodle-compliance.svg"],
  ["04 / FOUNDER JOURNEY","Startup & entity support","Structured support for incorporation pathways, governance and recurring obligations.","/startup-support.html","pravi-doodle-founder.svg"],
  ["05 / BUSINESS DECISIONS","Business advisory","Planning, budgeting, working capital and commercial analysis.","/business-advisory.html","pravi-doodle-growth.svg"],
  ["06 / PRACTICAL WORKPAPERS","Digital tools & resources","Purpose-built calculators, trackers and reconciliation workpapers.","/tools.html","pravi-doodle-cashflow.svg"]
 ];
 return <main>
  <section className="hero">
   <div className="hero-grid wrap">
    <motion.div className="hero-copy" initial={reduce?false:{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:.85,ease:[.2,.8,.2,1]}}>
     <p className="eyebrow"><span className="eyebrow-spark"/> STARTUP FINANCE · TAX · COMPLIANCE · BUSINESS ADVISORY</p>
     <h1>Make the numbers work.<br/><em>Make growth deliberate.</em></h1>
     <p className="intro">A practical finance and compliance partner for founders and growing businesses. Bring accounting, cash flow, tax, statutory responsibilities and business decisions into one clearer operating picture.</p>
     <p className="specialisms">Virtual CFO <b>·</b> Regulatory &amp; Legal <b>·</b> Financial Strategy</p>
     <div className="actions"><a className="button dark" href={legacyHref("/contact.html")}>Work with PRAVI ↗</a><Link className="button outline" to="/services.html">Explore services</Link></div>
     <p className="trust">CA-led perspective <i/> Defined scope <i/> Practical execution</p>
    </motion.div>
    <ContourField/>
   </div>
   <div className="hero-side-note" aria-hidden="true"><span>01</span><span>THE FOUNDER'S FINANCE DESK</span><span>↘</span></div>
  </section>
  <section className="proof"><div className="wrap proof-grid"><div><b>Startup-focused</b><span>Support built around the founder journey</span></div><div><b>CFO-led advisory</b><span>Finance, cash flow and management insight</span></div><div><b>Compliance, organised</b><span>Entity, tax and recurring obligations</span></div><div><b>Growth-aligned</b><span>Systems that support better decisions</span></div></div></section>
  <section className="section wrap home-services">
   <div className="section-head"><div><p className="eyebrow">HOW PRAVI SUPPORTS YOUR BUSINESS</p><h2>One finance partner.<br/>Connected areas of work.</h2></div><p>Choose support that addresses your current requirement. Scope, applicable obligations, inputs and responsibilities are established for each engagement.</p></div>
   <div className="service-grid">{cards.map(([k,t,d,h,art],i)=><motion.article className={i===0?"service-card featured":"service-card"} key={k} whileHover={reduce?{}:{y:-6,rotate:i%2===0?-.4:.4}} transition={{duration:.25}}><span className="service-card-kicker">{k}</span><img className="service-card-doodle" src={`${base}assets/img/${art}`} alt=""/><h3>{t}</h3><p>{d}</p><a href={legacyHref(h)}>Explore service ↗</a><span className="service-card-sequence" aria-hidden="true">0{i+1}</span></motion.article>)}</div>
  </section>
  <section className="closing"><div className="wrap closing-inner"><div><p className="eyebrow">A CLEARER VIEW OF THE BUSINESS</p><h2>Better information.<br/><em>Better decisions.</em></h2><a className="button dark" href={legacyHref("/contact.html")}>Start a conversation ↗</a></div><motion.div className="closing-doodle" aria-hidden="true" animate={reduce?{}:{y:[0,-9,0],rotate:[3,0,3]}} transition={{duration:7,repeat:Infinity}}><img src={`${base}assets/img/pravi-doodle-growth.svg`} alt=""/></motion.div><span className="closing-margin-note">A BETTER OPERATING RHYTHM / EVERY MONTH</span></div></section>
 </main>;
}

function ScrollProgress(){const {scrollYProgress}=useScroll();const scaleX=useSpring(scrollYProgress,{stiffness:130,damping:30,restDelta:.001});return <motion.div className="site-scroll-progress" style={{scaleX}} aria-hidden="true"/>;}\n\nfunction SiteReveal(){const location=useLocation();const reduce=useReducedMotion();React.useEffect(()=>{const items=document.querySelectorAll("main .page-hero-react,main .section,main .story-react,main .closing,main .resource-card-react,main .service-card,main .steps-react article,main .scope-react article");if(reduce){items.forEach(el=>el.classList.add("is-visible"));return;}items.forEach(el=>el.classList.add("pravi-reveal"));const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});},{threshold:.12,rootMargin:"0px 0px -35px 0px"});items.forEach(el=>observer.observe(el));return()=>observer.disconnect();},[location.pathname,reduce]);return null;}\n\nfunction NotFound(){return <main className="wrap legacy"><p className="eyebrow">PRAVI BUSINESS ADVISORS LLP</p><h1>Page not found</h1><p>The page may have moved. Return to the homepage or use the navigation to continue.</p><Link to="/">Return home ↗</Link></main>}
export default function App(){const location=useLocation();const reduce=useReducedMotion();return <><RouteMeta/><LogoIntro/><ScrollProgress/><SiteReveal/><Header/><motion.div className="route-stage" key={location.pathname} initial={reduce?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.42,ease:"easeOut"}}><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/about.html" element={<AboutPage/>}/><Route path="/services.html" element={<ServicesPage/>}/><Route path="/virtual-cfo.html" element={<VirtualCfoPage/>}/><Route path="/startup-support.html" element={<StartupSupportPage/>}/><Route path="/direct-tax.html" element={<DirectTaxPage/>}/><Route path="/gst-compliance.html" element={<GstCompliancePage/>}/><Route path="/accounting-mis.html" element={<AccountingMisPage/>}/><Route path="/business-advisory.html" element={<BusinessAdvisoryPage/>}/><Route path="/resources.html" element={<ResourcesPage/>}/><Route path="/insights.html" element={<InsightsPage/>}/><Route path="/contact.html" element={<ContactPage/>}/><Route path="/privacy.html" element={<PrivacyPage/>}/><Route path="/guide-startup-compliance.html" element={<GuidePage path="/guide-startup-compliance.html"/>}/><Route path="/guide-virtual-cfo.html" element={<GuidePage path="/guide-virtual-cfo.html"/>}/><Route path="/guide-gst-reconciliation.html" element={<GuidePage path="/guide-gst-reconciliation.html"/>}/><Route path="/guide-monthly-mis.html" element={<GuidePage path="/guide-monthly-mis.html"/>}/><Route path="/article-13-week-cashflow.html" element={<ArticlePage path="/article-13-week-cashflow.html"/>}/><Route path="/article-first-90-days-accounting.html" element={<ArticlePage path="/article-first-90-days-accounting.html"/>}/><Route path="/article-gst-purchase-reconciliation.html" element={<ArticlePage path="/article-gst-purchase-reconciliation.html"/>}/><Route path="/article-monthly-mis-review.html" element={<ArticlePage path="/article-monthly-mis-review.html"/>}/><Route path="*" element={<NotFound/>}/></Routes></motion.div><footer className="footer-editorial">
  <div className="wrap footer-editorial-top">
    <div className="footer-editorial-brand">
      <Brand full/>
      <p>Finance clarity for founders and growing businesses.</p>

    </div>
    <div className="footer-column">
      <h2>Explore</h2>
      <a href={legacyHref("/services.html")}>Services</a>
      <a href={legacyHref("/about.html")}>About PRAVI</a>
      <a href={legacyHref("/tools.html")}>Business tools</a>
      <a href={legacyHref("/resources.html")}>Founder resources</a>
    </div>
    <div className="footer-column">
      <h2>Connect</h2>
      <a href="mailto:info@praviba.com">info@praviba.com</a>
      <a href="tel:+919173121611">+91 91731 21611</a>
      <a href="https://www.linkedin.com/company/145352736/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      <a href="https://www.instagram.com/pravi.ba/" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
    </div>
    <div className="footer-editorial-cta">
      <span>HAVE A BUSINESS QUESTION?</span>
      <h2>Make the next decision with a clearer picture.</h2>
      <a href={legacyHref("/contact.html")}>Start a conversation <span aria-hidden="true">↗</span></a>
    </div>
  </div>
  <div className="wrap footer-editorial-bottom">
    <span>© {new Date().getFullYear()} PRAVI Business Advisors LLP. All rights reserved.</span>
    <a href={legacyHref("/privacy.html")}>Privacy notice</a>
  </div>
</footer></>}
