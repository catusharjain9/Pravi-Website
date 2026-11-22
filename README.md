# PRAVI BUSINESS ADVISORS LLP — Website

A staged React + Vite website migration. The homepage and core service/about pages are React components with Motion-based interaction; remaining legacy pages and tools are retained as static routes during the migration so existing workflows are not discarded. Run `npm install` and `npm run dev` for local development, or `npm run build` to create the production bundle and stage legacy routes. The currency converter requires an internet connection for timestamped exchange-rate data.

## React migration status
- The homepage plus 21 direct-load `.html` routes use React (22 routes total), including About, Services, Who we help, Virtual CFO, Startup Support, Direct Tax, GST Compliance, Accounting & MIS, Business Advisory, Resources, Insights and Contact.
- Specialist financial workpapers and browser-based tools remain legacy static routes so their existing calculation and file-handling workflows are preserved.
- `scripts/stage-legacy.mjs` stages legacy pages/assets into `dist` and emits direct-load `.html` entry points for every migrated React route.
- Production deployment uses the Vite build output (`dist`). For the current GitHub Pages project site, the default base is `/Pravi-Website/`; root hosting can build with `VITE_BASE_PATH=/` after the host and canonical origin are deliberately changed.

## Main pages
- `index.html` — founder-led homepage focused on startup foundations, monthly numbers and cash planning, with stage-based pathways, clear engagement principles and FAQs.
- `services.html` — service portfolio, professional scope boundaries and links into focused service pages.
- `who-we-help.html` — four illustrative business-context pathways for startups, manufacturing/processing, trading/distribution/D2C and professional/knowledge services, with tailored finance-control themes and connected service links.
- `about.html` — firm approach, mission/vision themes and working principles without invented firm history, qualifications or testimonials.
- `contact.html` — official email contact (`info@praviba.com`), WhatsApp and validated enquiry form with optional call-request preference and callback window.
- `resources.html` — founder-focused workpaper hub linking to monthly MIS, cash-flow planning, GST reconciliation, compliance tracking and PDF tools; no interactive readiness checklist.
- `tools.html` — business workpaper hub with a link to the dedicated PDF workspace.
- `pdf-tools.html` — iLovePDF-inspired, PRAVI-branded PDF workspace for merge, split, browser-based compression, PDF-to-JPG, images-to-PDF, rotate, page numbers, watermark, remove pages and extract pages.
- `mis-generator.html` — monthly MIS generator using a standardized account-summary CSV.
- `compliance-tracker.html` — configurable client/entity-wise compliance due-date register, saved locally in the browser.
- `gst-reconciliation.html` — GSTR-2B vs purchase-register reconciliation workpaper with configurable mapping and exception CSV.
- `depreciation-register.html` — multi-asset SLM depreciation estimate with CSV import/export.
- `depreciation-calculator.html` — Companies Act Schedule II SLM/WDV, Income-tax block WDV, additional-depreciation timing, year-wise schedules and depreciation-related deferred-tax estimates.
- `currency-converter.html` — major ISO 4217 fiat currencies with timestamped indicative FX data, source/freshness labels, pair conversion, and daily-reference fallback.
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
The current Contact page publishes `info@praviba.com` and telephone / WhatsApp `+91 91731 21611` (`tel:+919173121611`, `https://wa.me/919173121611`). Confirm that these details remain authorised before changing or reusing them. No office address, opening hours, partner biography, professional credentials, experience metrics, client testimonials or measured results are published as verified claims.

The enquiry form validates in the visitor's browser. On consent it opens WhatsApp with a prefilled message, including a preferred contact method/window if supplied. The visitor must review and press Send. A phone-call preference is a request only, not a confirmed appointment. The website does not submit/store the form or deliver email. Avoid requesting passwords, bank credentials, tax IDs or sensitive records in an initial WhatsApp message.

## Launch readiness
See `PRE-LAUNCH-CHECKLIST.md` for the remaining release gates. The public site is deployed on GitHub Pages at `https://catusharjain9.github.io/Pravi-Website/`; a custom domain is not configured. Technical hosting does not equal legal or business approval: reverify the registered office against current MCA records, confirm published contact and service details, and review the privacy notice against actual data flows. The privacy page remains a visible draft/noindex. The enquiry form prepares a WhatsApp draft; it does not deliver email or store submissions. No AI integration is included.

## Run / test locally
1. Extract the ZIP or open the directory.
2. On Windows, open Command Prompt in this folder and run `py -m http.server 8000` (or `python -m http.server 8000`).
3. Visit `http://localhost:8000`.
4. Test nav/menu on mobile, validate required form fields, select “Request a phone call”, and verify that the WhatsApp draft contains the preference and callback window. Do not send a real message unless intended.

## Current hosting and deployment
The public site is deployed on GitHub Pages at `https://catusharjain9.github.io/Pravi-Website/`. GitHub Actions builds `dist`, stages retained tools, generates `sitemap.xml` and `robots.txt`, prerenders the React `.html` routes and publishes the validated artifact. Do not upload the repository root directly as a substitute for the build.

GitHub Pages does not activate the repository's `_headers`, `.htaccess` or Firebase Hosting response-header rules. To enforce CSP and other HTTP security headers, a supported hosting provider or edge proxy must be selected and the actual production responses tested. No DNS, custom-domain or hosting migration has been made. If a custom domain or different host is later approved, set `VITE_SITE_ORIGIN` and `VITE_BASE_PATH` correctly, rebuild the canonical metadata and sitemap, verify HTTPS/redirects, test all tools and update the privacy notice to match the new host and data flows.

## Professional and factual boundaries
The uploaded profile belongs to Jain Ashwin & Co and has been used as a service-portfolio reference only. Its team, names, CA credentials, experience claims, contacts, associate network, client sectors and results are not attributed to PRAVI. Reserved audit/assurance, certification, legal, transaction, tax-representation and other regulated work must be accepted only where professional eligibility, appointment, independence and authorisation requirements are met. Tally/Zoho and other software appear only as possible workflows; no integration or partner status is claimed.

## Technical quality checks
The website includes GSTR-2B reconciliation, depreciation and deferred-tax workpapers, a currency converter, 13-week cash-flow planner, monthly MIS generator, browser-local compliance tracker and PDF workspace with ten operations. `TESTING_REPORT.md` records the earlier browser/functional baseline; current changes are additionally gated by the GitHub Actions suite, including route, SEO, responsive browser and CSV/CSP checks. Previous automated runs covered the retained tools and 31 legacy HTML pages at multiple viewport widths. Real PDF-library processing, real Excel exports, Firebase authentication/rules, production response headers, cross-browser and physical-device testing still require external-service or device access. The site is currently deployed on GitHub Pages; deployment does not close the remaining operational and legal approval gates.

## Peer-informed design principles
The site now emphasises problem-led positioning, four comprehensible service layers, explicit outputs, a five-stage onboarding path, specific service landing pages and plain-language guides. These are common public-facing patterns seen in Indian finance and advisory websites; PRAVI's content remains original and does not adopt peers' credentials, metrics or outcome guarantees.


## Firm master data added in this revision
- LLPIN: ACF-9256
- Incorporation: 7 March 2024
- ROC: Ahmedabad
- Designated partner names are intentionally omitted from the public website at the user’s request.
- Registered office is transcribed from a 10 March 2024 MCA extract; reverify against current MCA records before launch. The email is masked in that extract and has not been published.


## Brand identity
The approved PRAVI visual identity uses sunrise yellow (`#F6D365`), warm beige (`#FFF7E1`), ivory (`#FCF9F1`), charcoal (`#1F2A2E`) and stone grey (`#D9D2C6`), with Poppins typography. Use the lowercase `pravi` wordmark and keep the Sanskrit tagline `लेखा | अर्थ | वृद्धि` separate from the logo mark. Do not put Sanskrit text or symbols inside the logo. The approved mark is used in the site header and favicon.


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


## Theme readability audit (29 October 2026)
- Reviewed all 33 root HTML pages and the shared stylesheet; 11 workpaper/CMS pages also include page-local CSS that had retained older teal/white hero treatments.
- The shared theme now overrides those page-local banner classes and normalises the page title, body copy, action buttons, tables, inputs, footers, and contact controls to the approved warm-light palette.
- Added `scripts/test-theme-accessibility.py` to check stylesheet coverage, required palette/hero overrides, and contrast ratios for the core text/background combinations. The test is included in the website quality workflow.
- Source changes are committed to GitHub. Production visual verification/deployment is still unconfirmed: this repository has no `.firebaserc`, production domain, or hosting deploy workflow. Do not treat a source commit as proof that the live site changed.
