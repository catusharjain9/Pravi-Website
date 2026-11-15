import React from "react";
const legacyHref=(path)=>`${import.meta.env.BASE_URL.replace(/\/$/,"")}${path}`;

function PageHero({kicker,title,lead}) {
  return <section className="page-hero-react"><div className="wrap"><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{lead}</p></div></section>;
}
function Story({index,title,body,href="/services.html",label="Explore how we work"}) {
  return <section className="story-react wrap"><div><small>{index}</small><h2>{title}</h2><p>{body}</p><a href={legacyHref(href)}>{label} ↗</a></div><div className="story-visual"><span>PRAVI</span><b>CLARITY</b><i>→</i><b>CONTROL</b><i>→</i><b>GROWTH</b></div></section>;
}
function SectionTitle({kicker,title,copy}) {
  return <div className="section-head"><div><p className="eyebrow">{kicker}</p><h2>{title}</h2></div>{copy&&<p>{copy}</p>}</div>;
}
export function AboutPage(){
 return <main><PageHero kicker="ABOUT PRAVI" title="Practical finance support for people building a business." lead="PRAVI BUSINESS ADVISORS LLP works across startup foundations, accounting, tax and compliance, management reporting and finance planning. The aim is to help founders understand the work in front of them, define a realistic scope and build routines that can grow with the business."/>
 <Story index="08 / THE PRAVI APPROACH" title="Professional rigour. Clear communication. Practical execution." body="We connect the records, responsibilities and decisions that shape a business—within a clearly agreed professional scope."/>
 <section className="section wrap"><SectionTitle kicker="OUR POINT OF VIEW" title="Start with the founder’s real question."/><div className="two-col-react"><div><p>A founder may need to choose an entity structure, organise financial records, understand an obligation or decide how long cash will last. The useful answer starts with the business model, stage, available evidence and the decision that needs to be made.</p><blockquote>The aim is not a one-size-fits-all package. It is to understand the founder’s context, define the work and make the next step clearer.</blockquote></div><div><p>PRAVI’s service model is designed to connect recurring compliance with dependable accounting records and useful management information. Depending on the engagement, support may also include due-diligence readiness, budget and feasibility work, startup documentation coordination, and virtual CFO-style finance support.</p><p>Each organisation has its own systems, deadlines, transaction history and priorities. The first step is to understand the question, review the available information, identify what is missing and agree a realistic scope, required inputs, timelines and responsibility split.</p><p>Where an assignment calls for statutory audit, assurance, certification, legal drafting, tax representation or other reserved work, it must be accepted only after the relevant professional eligibility, authorisation, independence and appointment requirements have been confirmed.</p></div></div></section>
 <section className="section pale-react"><div className="wrap"><SectionTitle kicker="WORKING PRINCIPLES" title="Evidence first. Scope clear. Decisions documented." copy="A practical sequence for keeping responsibilities and limitations visible throughout an engagement."/><div className="steps-react">{[["01","Context","Understand the entity, request and information available."],["02","Evidence","Work from records and identify missing or inconsistent items."],["03","Boundaries","Make assumptions, scope and any specialist referral clear."],["04","Next steps","Record open points, responsibilities and follow-up actions."]].map(x=><article key={x[0]}><b>{x[0]}</b><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></div></section>
 <section className="section wrap"><SectionTitle kicker="MISSION & VISION" title="Built around trusted, practical working relationships."/><div className="two-col-react"><article className="value-react"><small>OUR MISSION</small><h3>Deliver timely, tailored support with care.</h3><p>Build lasting working relationships through well-scoped accounting, tax, compliance and advisory support grounded in integrity, diligence and clear communication.</p></article><article className="value-react"><small>OUR VISION</small><h3>Be a dependable partner for business decisions.</h3><p>Help organisations navigate obligations and choices with reliable execution, useful insight and a clear view of the next action.</p></article></div></section>
 </main>;
}
const serviceGroups=[
 ["01","Compliance & tax","Tax obligations and regulatory follow-through.",[["Direct tax","/direct-tax.html"],["GST compliance","/gst-compliance.html"]]],
 ["02","Accounting & reporting","Records, reconciliation and management reports.",[["Accounting & MIS","/accounting-mis.html"],["Monthly MIS guide","/guide-monthly-mis.html"]]],
 ["03","Planning & finance leadership","Forecasts and decision-support routines.",[["Planning & feasibility","/business-advisory.html"],["Virtual CFO","/virtual-cfo.html"]]],
 ["04","Startup & entity support","Formation pathways and ongoing entity records.",[["Startup support","/startup-support.html"],["Startup compliance guide","/guide-startup-compliance.html"]]]
];
export function ServicesPage(){
 return <main><PageHero kicker="SERVICE AREAS" title="A clear scope for the work your business needs." lead="Accounting and monthly MIS, tax and compliance coordination, startup setup, business planning and Virtual CFO support—agreed around your records, priorities and applicable professional requirements."/>
 <Story index="01 / THE CONNECTED BUSINESS" title="Good finance is a system. Not a pile of filings." body="Accounting, tax, compliance and decision support work best when the information connects. Explore each service through the business problem it helps solve." href="/contact.html" label="Discuss your requirement"/>
 <section className="section wrap"><SectionTitle kicker="SERVICE PORTFOLIO" title="Choose support by the business problem." copy="The detailed service areas explain what may be included. Applicability, inputs, timelines and responsibilities are confirmed for each engagement."/><div className="steps-react">{[["COMPLIANCE CYCLES","Tax returns, reconciliations, entity records and recurring compliance calendars."],["DEFINED PROJECTS","Audit-support assignments, feasibility work, due diligence, setup projects and process documentation where appropriate."],["FINANCE & DECISIONS","Budgets, cash-flow views, management reports and virtual CFO-style decision support."]].map((x,i)=><article key={i}><small>{x[0]}</small><p>{x[1]}</p></article>)}</div><div className="service-grid service-grid-react">{serviceGroups.map(g=><article className="service-card" key={g[0]}><span>{g[0]} / {g[1]}</span><h3>{g[2]}</h3>{g[3].map(l=><a key={l[1]} href={legacyHref(l[1])}>{l[0]} ↗</a>)}</article>)}</div></section>
 <section className="section pale-react"><div className="wrap"><SectionTitle kicker="HOW ENGAGEMENTS ARE STRUCTURED" title="A clear path from the question to the workpaper."/><div className="steps-react">{[["01","Understand","Clarify the business question, entity and available information."],["02","Review","Identify evidence, gaps, assumptions and dependencies."],["03","Agree","Confirm scope, deliverables, responsibilities and exclusions."],["04","Execute","Work to the agreed milestones and record open actions."]].map(x=><article key={x[0]}><b>{x[0]}</b><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></div></section></main>;
}
function ServiceDetail({layer,title,lead,story,items,prep}){
 return <main><PageHero kicker={layer} title={title} lead={lead}/><Story index={layer.toUpperCase()} title={story} body="The actual scope, reporting cadence, evidence requirements and responsibility split are agreed for each engagement." href="/contact.html" label="Discuss this service"/><section className="section wrap"><SectionTitle kicker="POTENTIAL SCOPE" title="What this support can include." copy="The work depends on the business, available records and agreed role boundaries."/><div className="scope-react">{items.map((x,i)=><article key={x[0]}><b>{String(i+1).padStart(2,"0")}</b><div><h3>{x[0]}</h3><p>{x[1]}</p></div></article>)}</div></section><section className="section pale-react"><div className="wrap two-col-react"><div><p className="eyebrow">BEFORE THE FIRST DISCUSSION</p><h2>{prep}</h2><a href={legacyHref("/contact.html")}>Prepare an enquiry ↗</a></div><p>These prompts help define the discussion; they are not a complete onboarding or diligence request.</p></div></section></main>;
}
export function VirtualCfoPage(){return <ServiceDetail layer="SERVICE LAYER 03 · PLANNING & FINANCE LEADERSHIP" title="Finance oversight shaped around the decisions ahead." lead="Create a reporting rhythm for cash, performance, budgets and open actions—working alongside the existing accounts team or a defined outsourced finance workflow." story="Cash visibility changes the quality of decisions." prep="Information that helps define the work." items={[
["Periodic performance review","Review selected financial metrics, key movements and unresolved questions with management."],
["Cash-flow forecasting","Organise opening cash, expected receipts, planned payments, timing assumptions and scenarios."],
["Budget-versus-actual review","Compare outcomes against an agreed budget and record the reasons requiring follow-up."],
["MIS and management pack","Define the recurring output, reporting calendar, data sources and review responsibilities."],
["Working-capital and margin views","Focus analysis on agreed drivers such as receivables, stock, payables and cost categories."],
["Finance process coordination","Clarify the split among accounts staff, management, external professionals and approvers."]
]}/>;}
export function StartupSupportPage(){return <ServiceDetail layer="SERVICE LAYER 04 · STARTUP & ENTITY SUPPORT" title="Founder-first setup and compliance for your startup." lead="Turn early decisions into an organised foundation: clarify the entity pathway, set up core finance records, identify applicable registrations and assign ownership for recurring tasks." story="Build the operating foundation before complexity arrives." prep="Start with the business context." items={[
["Entity setup pathway","Compare the information and decision points needed before selecting an incorporation or registration route; not a substitute for legal advice."],
["Registration and onboarding map","Map the registrations and documents likely to be relevant for the selected structure and activity."],
["Recurring entity compliance","Set out a recurring obligation calendar, information owners and documentation workflow."],
["Corporate records","Support organisation of notices, minutes, resolutions, registers and other records within the agreed scope."],
["Founder and transaction documents","Coordinate required inputs and specialist review for founder arrangements, MOUs, NDAs or transaction-specific documentation."],
["Accounting and finance foundation","Set up a basic record flow, month-end responsibility map and management reporting routine."],
["ROC compliance","Map relevant company/LLP filing requirements, event-based obligations, corporate records and filing dependencies."],
["FEMA coordination","Identify potential FEMA questions around foreign investment, remittances or cross-border transactions and coordinate specialist review where required."],
["MSME compliance support","Review relevant MSME registration and payment-related compliance questions based on entity, supplier/customer facts and applicable rules."]
]}/>;}

export function DirectTaxPage(){return <ServiceDetail layer="SERVICE LAYER 01 · COMPLIANCE & TAX" title="Direct tax support, organised around the facts and the deadline." lead="Bring returns, TDS, information requests and tax questions into a defined workflow: identify the facts, map the outstanding items and agree the work that is appropriate for your situation." story="Start with the facts. Then map the tax position." prep="Information that helps define the work." items={[
["Return preparation support","Organise income, expense, deduction and supporting schedules needed for preparation and review."],
["TDS compliance support","Map applicable information, reconcile records and prepare the agreed periodic compliance work."],
["Tax issue analysis","Identify the specific question, applicable facts, relevant documents and points that require research."],
["Assessment documentation","Help structure factual responses, reconciliations and supporting evidence, subject to the proceeding and authority to act."],
["Applications and registrations","Support documentation for relevant tax onboarding or applications, where applicable and accepted."],
["Deadline and document map","Set out the immediate due dates, missing inputs, responsible people and review steps."]
]}/>;}
export function GstCompliancePage(){return <ServiceDetail layer="SERVICE LAYER 01 · COMPLIANCE & TAX" title="GST compliance with the reconciliation behind the return." lead="Use a clear workflow for outward supplies, input tax credit, books-to-portal differences, return preparation and supporting documents—based on the records and scope agreed." story="A return is only as reliable as the reconciliation behind it." prep="Information that helps define the work." items={[
["Registration and profile support","Document coordination for relevant GST registration, amendment or profile requirements."],
["Return preparation support","Prepare or coordinate the agreed GSTR-1, GSTR-3B or related return information, subject to review and authorisation."],
["Books-to-portal reconciliation","Compare accounting records with available GSTR-2A / GSTR-2B and identify differences requiring investigation."],
["Input tax credit review support","Prepare exception lists and supporting schedules for consideration against the applicable facts and rules."],
["Refund documentation","Organise transaction details and supporting evidence for a scoped refund application."],
["Notice / query preparation","Map the issue, information required and response timeline; representation is separately scoped where applicable."]
]}/>;}
export function AccountingMisPage(){return <ServiceDetail layer="SERVICE LAYER 02 · ACCOUNTING & REPORTING" title="Accounting that gives the business a clearer monthly picture." lead="Organise the books, close the period, reconcile the balances and prepare a reporting pack that explains the current position and the items needing attention." story="The month-end close is where clarity begins." prep="Information that helps define the work." items={[
["Bookkeeping and classification","Record and organise transactions using the agreed source documents and accounting policies."],
["Bank and ledger reconciliation","Compare records, investigate outstanding entries and maintain an exception list for review."],
["Period-end close","Coordinate schedules, cut-off matters and ledger checks required for the agreed close process."],
["Financial statement preparation support","Prepare agreed financial statement schedules or drafts based on the records and review responsibilities defined."],
["Monthly MIS pack","Structure revenue, cost, margin, working-capital, cash and open-action views relevant to the business."],
["Process and system workflows","Document recurring tasks, access responsibilities, approvals and hand-offs between business and accounts teams."]
]}/>;}
export function BusinessAdvisoryPage(){return <ServiceDetail layer="SERVICE LAYER 03 · PLANNING & FINANCE LEADERSHIP" title="Make the assumptions visible before making the plan." lead="Structure business questions around assumptions, options, resource needs, working capital and an implementation path—not only around a spreadsheet." story="A plan is only as strong as its assumptions." prep="Information that helps define the work." items={[
["Business plan structure","Clarify the model, customer/market assumptions, cost base, resource needs and milestones."],
["Budgets and forecasts","Build the agreed period view and document assumptions that materially influence results."],
["Working-capital review","Map receivables, inventory, payables, cash conversion and near-term funding pressure."],
["Feasibility and scenario analysis","Compare scenarios, key sensitivities, required investment and operational dependencies."],
["Financial ratios and management review","Prepare a coherent view of selected metrics with definitions and limitations."],
["Policies, procedures and accounting manuals","Document recurring responsibilities, approvals, workflows and review points."]
]}/>;}
