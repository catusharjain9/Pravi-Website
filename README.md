# PRAVI BUSINESS ADVISORS LLP — Website

A responsive, framework-free static website built with HTML, CSS, JavaScript and SVG. No npm install, build step, API key, database or paid site builder is required to open it locally.

## Main pages
- `index.html` — founder-led homepage focused on startup foundations, monthly numbers and cash planning, with stage-based pathways, clear engagement principles and FAQs.
- `services.html` — full eight-area portfolio, professional scope boundaries and links into focused service pages.
- `about.html` — firm approach, mission/vision themes and working principles without invented firm history, qualifications or testimonials.
- `contact.html` — click-to-call, WhatsApp and validated enquiry form with optional call-request preference and callback window.
- `resources.html` — founder-focused workpaper hub linking to monthly MIS, cash-flow planning, GST reconciliation, compliance tracking and PDF tools; no interactive readiness checklist.
- `tools.html` — business workpaper hub with a link to the dedicated PDF workspace.
- `pdf-tools.html` — iLovePDF-inspired, PRAVI-branded PDF workspace for merge, split, browser-based compression, PDF-to-JPG, images-to-PDF, rotate, page numbers, watermark, remove pages and extract pages.
- `mis-generator.html` — monthly MIS generator using a standardized account-summary CSV.
- `compliance-tracker.html` — configurable client/entity-wise compliance due-date register, saved locally in the browser.
- `gst-reconciliation.html` — GSTR-2B vs purchase-register reconciliation workpaper with configurable mapping and exception CSV.
- `depreciation-register.html` — multi-asset SLM depreciation estimate with CSV import/export.
- `cashflow-planner.html` — 13-week cash forecast with downside case and CSV export.
- `privacy.html` — pre-publication draft privacy notice; must be reviewed against the actual host and data flows.
- `404.html` — branded not-found page.

## Focused service pages
- `direct-tax.html` — income-tax, TDS and proceeding-preparation support.
- `gst-compliance.html` — registration, return preparation, books-to-portal reconciliation and documentation workflows.
- `accounting-mis.html` — bookkeeping, close, reconciliation and monthly MIS.
- `business-advisory.html` — business planning, budgeting, working capital and feasibility.
- `virtual-cfo.html` — periodic reporting, cash-flow forecasts, budget review and finance-function processes.
- `startup-support.html` — entity setup pathway, registrations, corporate records and compliance calendars.

## Educational guides
- `guide-gst-reconciliation.html`
- `guide-monthly-mis.html`
- `guide-virtual-cfo.html`
- `guide-startup-compliance.html`

These are general preparation guides, not legal opinions, tax opinions, audit reports, assurance opinions or confirmation that any rule applies to every business.

## Contact and enquiry behaviour
Telephone / WhatsApp: `+91 91731 21611` (`tel:+919173121611`, `https://wa.me/919173121611`). No business email, office address, domain, hours, partner biography, professional credentials, experience metrics, client logos, client testimonials or results are invented.

The enquiry form validates in the visitor's browser. On consent it opens WhatsApp with a prefilled message, including a preferred contact method/window if supplied. The visitor must review and press Send. A phone-call preference is a request only, not a confirmed appointment. The website does not submit/store the form or deliver email. Avoid requesting passwords, bank credentials, tax IDs or sensitive records in an initial WhatsApp message.

## Launch readiness
See `PRE-LAUNCH-CHECKLIST.md` for the deployment sequence and mandatory checks. This package is not yet live: the domain and hosting provider have not been supplied, the registered office address must be reverified against current MCA records, and the privacy notice must be reviewed against the actual host and data flows. The enquiry form opens a WhatsApp draft; it does not deliver email or store submissions. No AI integration is included.

## Run / test locally
1. Extract the ZIP or open the directory.
2. On Windows, open Command Prompt in this folder and run `py -m http.server 8000` (or `python -m http.server 8000`).
3. Visit `http://localhost:8000`.
4. Test nav/menu on mobile, validate required form fields, select “Request a phone call”, and verify that the WhatsApp draft contains the preference and callback window. Do not send a real message unless intended.

## Deploy to hosting
Upload the **contents** of this folder to the public web root (for example `public_html`); ensure `index.html` sits directly at the root. Configure your purchased domain in the hosting panel and follow that provider's DNS instructions. The domain and hosting provider have not been supplied, so canonical URLs, absolute social-sharing URLs and the production sitemap are intentionally not set.

After the final domain is known:
1. Replace `YOUR-DOMAIN-HERE` in `sitemap.xml.template`, save it as `sitemap.xml`, and add the Sitemap directive to `robots.txt`.
2. Set canonical links and absolute Open Graph URL/image metadata across the pages if required.
3. Verify HTTPS, redirects (`www` or apex), static host handling of `.htaccess` / `_headers`, and real mobile WhatsApp handoff.
4. Update the privacy notice to reflect the real hosting, server logs, backups, analytics and any future integrations.

## Professional and factual boundaries
The uploaded profile belongs to Jain Ashwin & Co and has been used as a service-portfolio reference only. Its team, names, CA credentials, experience claims, contacts, associate network, client sectors and results are not attributed to PRAVI. Reserved audit/assurance, certification, legal, transaction, tax-representation and other regulated work must be accepted only where professional eligibility, appointment, independence and authorisation requirements are met. Tally/Zoho and other software appear only as possible workflows; no integration or partner status is claimed.

## Technical quality checks
The website includes GSTR-2B reconciliation, depreciation, a 13-week cash-flow planner, a monthly MIS generator, a browser-local compliance tracker and a PDF workspace with ten operations. The latest test report is `TESTING_REPORT.md`; it records the browser/functional tests completed, changes made and production gates still open. Tests covered all 31 HTML pages at 320, 390, 768 and 1365 CSS-pixel widths, calculator and workpaper fixtures, CSV safety, tracker persistence failures, GST reconciliation exceptions, PDF workspace UI/range validation, sitemap generation and CSP hashes for inline JSON-LD. The actual PDF processing libraries, real Excel exports, Firebase authentication/rules and production CSP still require tests with external services enabled. The site has not been deployed.

## Peer-informed design principles
The site now emphasises problem-led positioning, four comprehensible service layers, explicit outputs, a five-stage onboarding path, specific service landing pages and plain-language guides. These are common public-facing patterns seen in Indian finance and advisory websites; PRAVI's content remains original and does not adopt peers' credentials, metrics or outcome guarantees.


## Firm master data added in this revision
- LLPIN: ACF-9256
- Incorporation: 7 March 2024
- ROC: Ahmedabad
- Designated partner names are intentionally omitted from the public website at the user’s request.
- Registered office is transcribed from a 10 March 2024 MCA extract; reverify against current MCA records before launch. The email is masked in that extract and has not been published.


## Brand identity
The refreshed identity uses a custom abstract P mark with deep teal (`#073B36`), sage (`#7A9E8F`), terracotta (`#D97B5B`) and warm stone (`#F5F1E9`). The mark is used in the site header, favicon and homepage framework illustration. `assets/img/pravi-logo.svg` is a standalone horizontal logo asset suitable for documents and design layouts. The brand system is designed to remain legible at small header and favicon sizes.


## Final client logo assets
Client/ecosystem names, where displayed, are text-only and are not presented as official logos. Before publication, confirm that PRAVI is authorised to identify each relationship publicly; remove any name that has not been approved for public use.

## Peer-review integration (18 October 2026)
- Refined the homepage hero around practical outcomes: organised books, visible applicable obligations and useful monthly information.
- Simplified primary navigation to Services, Who we help, How we work, Resources & tools, About and a clear enquiry action.
- Added a dedicated "Who we help" pathway for startups, growing businesses and founders with a specific issue.
- Moved the tools promotion below the main service and engagement content; it now highlights only the Monthly MIS Generator, Compliance Due-Date Tracker and PDF workspace, with direct links to the full tools hub.
- Removed simulated client-logo treatments. Approved client/ecosystem names are presented as text, with a reminder to retain only relationships PRAVI is authorised to identify publicly. The engagement examples remain clearly labelled illustrative rather than real client case studies.
- Added responsive styling for the new audience section and tightened mobile navigation, cards and CTA layout.
- Removed the hard-coded `<base href="/">` from all HTML pages so relative assets work when the full site is deployed either at the domain root or in a subdirectory. The complete `assets` folder must be uploaded alongside the HTML pages.
- Updated the homepage description metadata to better match the actual service offering.

## Important deployment note after the mobile screenshot
Upload the complete contents of the ZIP, including `assets/css`, `assets/js` and `assets/img`, not just the HTML files. If the website still renders without styling after a full upload, inspect the deployed stylesheet URL directly and confirm it returns HTTP 200 with `Content-Type: text/css`; the local package checks cannot verify the live host configuration.


## Insights section
Added `insights.html` and three individual educational article pages covering startup accounting foundations, monthly MIS review and GST purchase reconciliation. The global navigation and footer link to Insights, and the sitemap template includes the new pages. Articles are general educational material; verify changing statutory information against current official sources before publication. Review content periodically and replace any guidance that becomes outdated.


## Private Insights dashboard

A Firebase-backed article management dashboard scaffold is included at `admin.html`. The first authorised admin is `catusharjain9@gmail.com`. Before use, follow `FIREBASE_CMS_SETUP.md`, configure `firebase-config.js`, enable Google sign-in, create Firestore and deploy `firestore.rules`. Until those steps are complete, the dashboard is not connected or secure and article publishing will not work. The second admin can be added later to both the client allowlist and Firestore rules.


## Comprehensive improvement revision (19 October 2026)
See `WEBSITE_IMPROVEMENT_REPORT.md` for a precise change log and remaining release gates. This revision adds per-page metadata, homepage Organization structured data based only on verified facts, official-source starting points, a practical 13-week cash-flow article, improved dynamic article metadata handling, and test scripts.

### Quality audit and sitemap
- Run `python scripts/quality-audit.py` (or `npm run audit`) to check local HTML structure, duplicate IDs, page titles, language declarations and local links/assets.
- After confirming the final HTTPS domain, run `node scripts/generate-sitemap.mjs https://your-real-domain.example`. This creates `sitemap.xml`; it intentionally refuses placeholder domains. Then add the matching Sitemap line to `robots.txt`.
- These checks are structural. They do not replace real-browser, accessibility, security, legal, PDF, production-host or search-indexing tests.


## Editorial and quality governance
- `CONTENT_REVIEW_POLICY.md` sets the source, fact-checking and publication gate for Insights articles.
- `WEBSITE_IMPROVEMENT_REPORT.md` records changes and limitations in this revision.


## Source safety and release checks

- CSV exports use `assets/js/csv-safety.js` to quote cells and neutralise formula-like text before spreadsheet use. Test with `npm run test:csv`.
- Compliance tracker changes now roll back in-session when browser storage writes fail. This remains browser-local storage, not a shared database.
- Before production, configure Firebase, test Firestore rules with authorised and unauthorised accounts, and verify the CSP against all required Firebase/CDN features.
- After the real domain is confirmed, run `npm run sitemap -- https://your-verified-domain.example` to generate canonical tags, `sitemap.xml`, and `robots.txt`. This edits canonical tags in public HTML files.
- Run dependency installation in an internet-enabled build environment, then `npm run audit`, `npm run test:csv`, JavaScript syntax checks, and manual/browser tests for all tools before release.
