# PRAVI Business Advisors LLP — release and operational readiness

**Status: Technically deployed on GitHub Pages; final business, legal and operational sign-off remains open.**

Live site: https://catusharjain9.github.io/Pravi-Website/

The site now builds with Vite and React and is published through GitHub Actions. This is a technical deployment, not a representation that every business fact, legal notice, service authorisation, CMS integration or third-party tool has been fully verified.

## A. Completed technical release work

- [x] GitHub Pages source changed from the legacy Jekyll branch build to GitHub Actions.
- [x] Vite production build and dist artifact deployment completed successfully.
- [x] 22 React routes render at their preserved public .html URLs, including the sector-specific Who we help pathway.
- [x] Route-specific page titles, descriptions, Open Graph metadata and canonical URLs are active.
- [x] Responsive browser QA passes at 375 × 812 CSS pixels for the mobile navigation, homepage/resources/contact overflow, resource-card stacking and contact form layout.
- [x] The logo refresh intro is tested; the reduced-motion preference suppresses it.
- [x] Nine existing business-tool entry points remain present and reachable; the standalone depreciation register is also retained.
- [x] Legacy tool pages use the warm-ivory footer and beige CTA styling.
- [x] Depreciation and currency calculation engines, CSV safety, CSP hashes, theme and brand checks pass in CI.
- [x] Production sitemap and robots.txt Sitemap directive are prepared for the GitHub Pages URL.
- [x] Draft privacy page is marked noindex,follow and excluded from the sitemap until approved.

Latest pull-request quality gate for this revision: 51 Playwright tests passed; 22 React routes were prerendered and 32 public sitemap URLs were generated. This verifies the PR branch, not yet the post-merge live deployment.

## B. Business facts and legal approval still required

- [ ] Verify the registered office address against current MCA master data. The older site content refers to an extract dated 10 March 2024; do not rely on it without reconfirmation.
- [ ] Confirm all client/ecosystem names and any case studies shown publicly are approved for identification.
- [ ] Confirm that the published phone and WhatsApp number +91 91731 21611 is correct and authorised for public use.
- [ ] Review every service description, professional-scope statement and regulated-service caveat against PRAVI's actual eligibility, registrations and authorisations.
- [ ] Verify partner bios, qualifications, credentials, testimonials, metrics and integrations before adding or retaining any such claims.
- [ ] Finalise the privacy notice only after checking the actual hosting logs, backups, analytics, WhatsApp handoff, external CDNs, Firebase flows, retention periods and request-handling process. The current page is deliberately a draft and noindex.
- [ ] Confirm the correct legal entity name and contact details for privacy requests and website enquiries.

## C. Live-site checks and remaining operational tests

- [x] Open the homepage and migrated React pages directly over HTTPS on GitHub Pages.
- [x] Verify route-specific metadata and canonical URLs on the deployed pages.
- [x] Verify the Resources, Insights, Contact and guide pages render with non-empty content.
- [x] Verify the sector-specific Who we help route, four business-context choices, query-driven deep links, related service links and 390px no-overflow behaviour in Playwright.
- [x] Test mobile navigation open/close, card stacking, contact form fit and horizontal overflow at 375px in Playwright.
- [x] Verify the contact form requires consent and prepares a WhatsApp draft rather than submitting or storing an enquiry on the website.
- [x] Verify legacy tool pages load the shared PRAVI theme stylesheet and warm-ivory footer in browser tests.
- [ ] Test tel: and WhatsApp links on a real phone. Use dummy details only; review the WhatsApp draft and cancel it rather than sending unless a test message is intended.
- [ ] Exercise each financial tool end-to-end with non-client sample data, including file import, validation, calculations, CSV download and print/export behaviour. Unit tests for the depreciation/currency engines and CSV safety pass, but do not replace full workflow testing.
- [ ] Verify PDF workspace CDN libraries load on the live domain and test representative non-confidential sample PDFs. PDF processing relies on external CDN libraries; image-based compression may reduce searchable/selectable text quality.
- [ ] Confirm the branded 404 page is returned for an invalid URL.
- [ ] Review the live pages on a real iOS and Android device. Playwright emulation at 375px passes, but it is not a substitute for physical-device testing.

## D. Search indexing and domain

- [x] Publish sitemap.xml using the verified GitHub Pages base URL.
- [x] Add the sitemap directive to robots.txt.
- [x] Keep the sitemap source aligned to the current GitHub Pages project URL; the production build regenerates canonical URLs and the sitemap from staged public pages.
- [x] Verify canonical and social-sharing metadata for the GitHub Pages URL.
- [x] Keep the draft privacy page out of the sitemap and set noindex,follow.
- [ ] Submit the sitemap in Google Search Console after confirming the property.
- [ ] If PRAVI intends to use a custom domain, confirm the purchased domain, DNS ownership, canonical host and HTTPS certificate before changing GitHub Pages domain settings. No DNS changes have been made.

## E. Tools, privacy and service limitations

- The contact form does not send email or store enquiries. It prepares a WhatsApp message; the visitor must review and press Send in WhatsApp.
- The compliance tracker stores entries in the visitor's browser and is not a shared multi-user database. Users should export and securely manage their own records.
- The Firebase Insights CMS is an article-only function. Its Web App configuration is present in `assets/js/firebase-config.js`, but Google sign-in, Firestore provisioning, authorised domains, deployed rules and the anonymous/admin access matrix have not been independently confirmed. Do not use it for publishing until tests pass; never store client financial/tax files in it.
- Compliance due dates and applicability must be independently verified against current official sources.
- Financial tools are workpapers and estimates; outputs require review before professional use.
- PDF processing relies on external CDN libraries. Image-based compression may reduce selectable/searchable text, vector quality, accessibility tags and metadata.
- No AI feature, public CRM, email delivery, accounting-software integration, shared client-accounting backend or shared multi-user compliance-tracker database is included. The separate Firebase Insights CMS is for articles only and is not a secure client file repository.
- The Firebase Insights admin page and Web App configuration are present, but the actual Google sign-in, Firestore, authorised-domain and rules configuration has not been independently validated. Keep publication disabled until anonymous published-only reads, draft denial, unauthorised read/write denial and authorised admin CRUD are tested with the Firebase Emulator or a non-production project. Do not store client financial or tax documents in the article CMS.

## F. Remaining legacy pages

The 22 core public pages now use React. Specialist financial tools and the dynamic article template remain legacy HTML/JavaScript deliberately, to avoid changing calculation, file-handling, browser-local storage and CMS behaviour without separate regression coverage. They remain staged at their existing URLs.

## G. Release decision

The technical GitHub Pages deployment is complete and automated checks pass. Do not describe the website as fully business/legal approved until the items in Section B are verified. Do not enable the CMS/admin area until Section E's Firebase security tests are complete. Keep the privacy notice in draft/noindex state until its actual data-handling practices are confirmed.
