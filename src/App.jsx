import React from "react";
import {Link,Route,Routes,useLocation} from "react-router-dom";
import {motion,useReducedMotion} from "motion/react";
import HomeRedesign from "./HomeRedesign.jsx";
import {AboutPage,ServicesPage,VirtualCfoPage,StartupSupportPage,DirectTaxPage,GstCompliancePage,AccountingMisPage,BusinessAdvisoryPage,ResourcesPage,InsightsPage,GuidePage,ArticlePage,ContactPage,PrivacyPage} from "./pages.jsx";
const nav=[["About","/about.html"],["Services","/services.html"],["Tools","/tools.html"],["Resources","/resources.html"],["Insights","/insights.html"]];
const legacyHref=(path)=>`${import.meta.env.BASE_URL.replace(/\/$/,"")}${path}`;

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
 "/privacy.html":{title:"Privacy Information (Draft) | PRAVI Business Advisors LLP",description:"Draft website privacy information for PRAVI Business Advisors LLP. Hosting retention and the firm's privacy contact still require confirmation.",robots:"noindex,follow"},
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
function Brand({full=false}){
 return <Link className={full?"brand brand-full":"brand"} to="/" aria-label="PRAVI Business Advisors home">
  <img src={import.meta.env.BASE_URL + "assets/img/pravi-approved-lockup.webp"} alt="PRAVI Business Advisors LLP — approved logo and descriptor"/>
 </Link>;
}
function Header(){
 const[open,setOpen]=React.useState(false);
 return <header className="header">
  <div className="wrap navrow">
   <Brand/>
   <button className="menu" type="button" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"/>
   <nav className={open?"nav open":"nav"} aria-label="Main navigation">
    {nav.map(([n,p])=><a key={p} href={legacyHref(p)} onClick={()=>setOpen(false)}>{n}</a>)}
    <a className="nav-cta" href={legacyHref("/contact.html")} onClick={()=>setOpen(false)}>Get in touch ↗</a>
   </nav>
  </div>
 </header>;
}
function Home(){return <HomeRedesign/>;}

function SiteReveal(){const location=useLocation();const reduce=useReducedMotion();React.useEffect(()=>{const items=document.querySelectorAll("main .page-hero-react,main .section,main .story-react,main .closing,main .resource-card-react,main .service-card,main .steps-react article,main .scope-react article");if(reduce){items.forEach(el=>el.classList.add("is-visible"));return;}items.forEach(el=>el.classList.add("pravi-reveal"));const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});},{threshold:.12,rootMargin:"0px 0px -35px 0px"});items.forEach(el=>observer.observe(el));return()=>observer.disconnect();},[location.pathname,reduce]);return null;}

function NotFound(){return <main className="wrap legacy"><p className="eyebrow">PRAVI BUSINESS ADVISORS LLP</p><h1>Page not found</h1><p>The page may have moved. Return to the homepage or use the navigation to continue.</p><Link to="/">Return home ↗</Link></main>}
export default function App(){const location=useLocation();const reduce=useReducedMotion();return <><RouteMeta/><SiteReveal/><Header/><motion.div className="route-stage" key={location.pathname} initial={reduce?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.42,ease:"easeOut"}}><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/about.html" element={<AboutPage/>}/><Route path="/services.html" element={<ServicesPage/>}/><Route path="/virtual-cfo.html" element={<VirtualCfoPage/>}/><Route path="/startup-support.html" element={<StartupSupportPage/>}/><Route path="/direct-tax.html" element={<DirectTaxPage/>}/><Route path="/gst-compliance.html" element={<GstCompliancePage/>}/><Route path="/accounting-mis.html" element={<AccountingMisPage/>}/><Route path="/business-advisory.html" element={<BusinessAdvisoryPage/>}/><Route path="/resources.html" element={<ResourcesPage/>}/><Route path="/insights.html" element={<InsightsPage/>}/><Route path="/contact.html" element={<ContactPage/>}/><Route path="/privacy.html" element={<PrivacyPage/>}/><Route path="/guide-startup-compliance.html" element={<GuidePage path="/guide-startup-compliance.html"/>}/><Route path="/guide-virtual-cfo.html" element={<GuidePage path="/guide-virtual-cfo.html"/>}/><Route path="/guide-gst-reconciliation.html" element={<GuidePage path="/guide-gst-reconciliation.html"/>}/><Route path="/guide-monthly-mis.html" element={<GuidePage path="/guide-monthly-mis.html"/>}/><Route path="/article-13-week-cashflow.html" element={<ArticlePage path="/article-13-week-cashflow.html"/>}/><Route path="/article-first-90-days-accounting.html" element={<ArticlePage path="/article-first-90-days-accounting.html"/>}/><Route path="/article-gst-purchase-reconciliation.html" element={<ArticlePage path="/article-gst-purchase-reconciliation.html"/>}/><Route path="/article-monthly-mis-review.html" element={<ArticlePage path="/article-monthly-mis-review.html"/>}/><Route path="*" element={<NotFound/>}/></Routes></motion.div><footer className="footer-editorial">
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
    <a href={legacyHref("/privacy.html")} aria-label="Privacy information (draft; not approved for publication)">Privacy information (draft)</a>
  </div>
</footer></>}
