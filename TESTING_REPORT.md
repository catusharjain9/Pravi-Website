# PRAVI Website — Functional and Release Test Report

**Test date:** 19 October 2026  
**Scope:** Uploaded static website source, browser tools, local assets, CMS setup scaffold and deployment configuration.  
**Status:** Static and simulated-browser checks passed. Production launch gates remain open.

## Fixes made during testing

- Fixed the compliance tracker so a successful create/edit message is not immediately cleared by the form reset.
- Made Firebase SDK imports conditional on a configured Firebase project. With placeholder configuration, the static Insights page no longer requests Firebase modules unnecessarily; the admin and dynamic article pages can show their setup/not-found state without requiring Firebase CDN access.
- Added matching CSP hashes for all 11 inline JSON-LD blocks to `firebase.json`, `_headers` and `.htaccess`, and added a regression test to detect future hash drift. This preserves the structured data while keeping inline JavaScript disabled by the policy.
- Fixed low-contrast homepage hero secondary CTA text on the light background.
- Removed the unverified registered office address and internal “confirm before publication” notes from public About and Contact pages. Reverify the latest MCA record before deciding whether to publish an address.
- Removed unused legacy calculator handlers from `assets/js/tools.js`; they had no corresponding controls in `tools.html` and included obsolete MSME threshold logic. The live tools hub continues to link to its dedicated workpaper pages.
- Kept the robots policy crawlable so crawlers can observe `noindex` directives. The sitemap generator omits admin, dynamic article-template, 404 and privacy pages from the sitemap.

## Results

| Test | Result |
|---|---|
| Structural audit of 31 HTML pages | Passed: 0 errors, 0 warnings |
| JavaScript syntax checks | Passed for all local JS files |
| Shared CSV safety unit tests | Passed: formula-like text, quoting, numeric negatives and BOM |
| CSV export smoke tests | Passed for cash flow, MIS, depreciation and compliance; GST reconciliation CSV column count validated |
| GST calculator | Passed inclusive arithmetic fixture: ₹1,180 gross at 18% = ₹1,000 taxable + ₹180 tax |
| Cash-flow planner | Passed sample generation, 13-week rows, negative-input rejection and 21-column CSV export |
| Depreciation register | Passed sample schedule and invalid-useful-life rejection |
| Monthly MIS | Passed sample report, eight metrics and empty-input validation |
| Compliance tracker | Passed create, recurring completion, storage-write failure rollback, impossible-date import rejection and formula-safe CSV export |
| GST reconciliation | Passed fixture coverage for matched rows, value variance, duplicate rows, missing rows on either side, invalid key, invalid amount and CSV export with 22 columns |
| PDF workspace | All 10 tool workspaces opened/closed; search/filter, empty state, merge single-file validation and split/remove page-range validation passed with mocked PDF library interfaces |
| Contact form | Passed required-field/consent flow and verified it opens a prefilled WhatsApp URL rather than submitting to a server |
| Mobile navigation | Passed menu toggle and `aria-expanded` synchronisation |
| Responsive matrix | Passed 124 renders: 31 pages at 320, 390, 768 and 1365 CSS pixels; no page-level horizontal overflow, broken local images, missing titles or unexpected H1 counts |
| Form-control accessible-name heuristic | Passed across 31 pages; no unnamed controls detected by the static/browser heuristic |
| Local links, IDs and assets | Passed structural audit; CSS `url()` references checked with no missing local targets |
| Sitemap generator | Passed on a temporary copy using `https://example.test`; canonical tags, URL count, exclusions and robots sitemap declaration checked |
| CSP JSON-LD hash regression | Passed: all 11 JSON-LD hashes present in all three hosting policies |
| ZIP/package integrity | Passed for the final release and source archives after creation; verified with `unzip -t` |

## Test method and limits

The browser suite used Chromium with local project resources served through a controlled test harness. External network requests were blocked deliberately so the tests did not depend on outside services. The GST reader and PDF libraries were stubbed for specific validation tests. Therefore:

- Real Excel/XLSX files from every export source have not been tested against the live SheetJS CDN in this environment.
- Real PDF parse/render fidelity and successful final output for all ten PDF operations have not been verified against the live PDF-lib, JSZip and PDF.js CDN resources. UI and pre-processing validation were tested with mocked library interfaces.
- Firebase Authentication, Firestore rules and actual CMS CRUD have not been tested against a configured Firebase project or emulator.
- The CSP has been checked for required inline JSON-LD hashes and known origins, but still requires a real-host browser check with Firebase and CDN resources enabled.
- No live DNS, HTTPS, production response-header, cross-browser Firefox/WebKit, physical-device, penetration or production data-flow test has been performed.
- This is not a formal WCAG conformance audit. The accessibility check was a control-name heuristic; keyboard and screen-reader testing still belongs in the pre-launch gate.
- The privacy notice remains a pre-launch draft pending confirmation of the actual host, server logs and data flows.

## Production gates that remain

1. Confirm the production domain and hosting provider; generate canonical URLs, sitemap and robots configuration for that domain.
2. Verify the registered office against current MCA records before publishing it.
3. Review the privacy notice against the actual hosting, CDN, contact and future integrations.
4. Configure Firebase, deploy Firestore rules, and test anonymous, authorised-admin and unauthorised-admin access with the Firebase Emulator or a test project.
5. Test real sample Excel exports and real PDFs across the ten PDF operations with external dependencies enabled; record output checks and failure behaviour.
6. Run browser testing with the actual CSP headers on the chosen host, then test current Chrome/Edge, Firefox and Safari/mobile as available.
7. Create and verify a dependency lockfile in an internet-enabled build environment.
8. Only after the above checks, deploy and verify redirects, HTTPS, Search Console indexing and public contact behaviour.

The website has not been deployed and this report does not claim production readiness.
