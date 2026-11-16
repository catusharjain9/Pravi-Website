# PRAVI React migration — release status

**Current state: staged migration; not yet production-ready.**

The production repository now contains a React + Vite + React Router + Motion application. The homepage, core service pages, resources and insights hubs, enquiry/privacy pages, four practical guides and four editorial articles are React-rendered (21 routes including the homepage). The shared React shell uses the approved PRAVI SVG logo reference and a responsive warm-ivory editorial footer.

## Migrated React routes

- `/` — Homepage
- `/about.html`
- `/services.html`
- `/virtual-cfo.html`
- `/startup-support.html`
- `/direct-tax.html`
- `/gst-compliance.html`
- `/accounting-mis.html`
- `/business-advisory.html`
- `/resources.html`, `/insights.html`, `/contact.html`, `/privacy.html`
- Four guides: startup compliance, Virtual CFO, GST reconciliation and monthly MIS
- Four articles: 13-week cash flow, first 90 days of accounting, GST purchase reconciliation and monthly MIS review

The Vite build stages legacy HTML pages and assets so existing public URLs continue to work while migration proceeds.

## Preserved legacy tool entry points

The existing tools hub remains in place. The current regression gate checks these eight linked pages plus the embedded GST amount calculator (nine tool entry points total):

1. `gst-reconciliation.html`
2. `tax-calculators.html`
3. `depreciation-calculator.html`
4. `currency-converter.html`
5. `cashflow-planner.html`
6. `mis-generator.html`
7. `compliance-tracker.html`
8. `tools.html#gstcalc` — embedded GST amount calculator
9. `pdf-tools.html` — PDF workspace

These remain legacy HTML/JavaScript implementations for now. They have not been rewritten in React; preserving their calculation, import/export, validation and local-data behaviour takes precedence over a superficial UI port.

## Remaining migration work

- Migrate the dynamic article CMS template and review remaining utility/admin pages that are intentionally retained as legacy.
- Migrate each tool individually only after documenting and regression-testing its calculations, file handling, validation, exports and browser-local persistence.
- Review all logo placements across legacy pages and confirm the approved artwork is consistently used.
- Complete keyboard, screen-reader, reduced-motion, responsive and cross-browser testing.
- Verify the production Vite build, staged output, direct URL refreshes, sitemap, canonical metadata, CSP and all asset references.
- Review privacy, business facts, contact details and professional-scope disclosures before launch.

## Quality gates

The GitHub Actions quality workflow runs the Vite build, static HTML and asset audit, theme/brand checks, depreciation and currency engine tests, CSV safety and CSP hash checks. A React migration regression test now also verifies the route map, logo/footer references and continued presence of all nine tool entry points.

A source-level check is not a substitute for a completed CI run or browser/device QA. Record the actual Actions result and browser test evidence before release.

## GitHub Pages deployment

The repository currently has a branch-based Pages build that runs Jekyll. That process does not run the Vite build and therefore must not be used to publish the React source entry point. A manual GitHub Actions deployment workflow has been added at `.github/workflows/deploy-pages.yml`; it builds the Vite app, stages legacy pages into `dist` and deploys that artifact.

Before using the workflow, change **Repository Settings → Pages → Build and deployment → Source** to **GitHub Actions**. Then run **Actions → Deploy PRAVI website to GitHub Pages → Run workflow**. This workflow is intentionally manual so it cannot publish until the Pages source has been switched and the release is approved.

## Local verification

```bash
npm install
npm run build
npm run audit
npm run test:react-migration
npm run test:csv
npm run test:csp
npm run test:depreciation
npm run test:currency
npm run test:brand
npm run test:theme
```

Do not deploy the migration as complete until every remaining migration and production gate above has been closed.
