# PRAVI Source-Code Improvement Report

## Changes applied in this release

- Added `assets/js/csv-safety.js`, a shared CSV serializer that consistently quotes values and prefixes formula-like text with an apostrophe while preserving numeric values. Added a regression test for formula payloads, quoting and negative numeric values.
- Updated the MIS, cash-flow, depreciation, GST reconciliation and compliance tracker exporters to use the shared serializer.
- Updated compliance tracker create/edit/delete/complete/import/restore/clear actions so a failed browser-storage write does not report success; failed changes are rolled back in the current session.
- Added strict calendar-date validation for saved compliance records and CSV import.
- Consolidated CSP/security-header configuration across Firebase Hosting, `_headers`, and `.htaccess`; the policy allows the known Firebase Auth/Firestore and CDN origins used by the current source. Hosting must be tested before enforcing on a live domain.
- Updated the sitemap script to generate canonical tags for public static HTML pages and generate `sitemap.xml` and `robots.txt` once the real HTTPS domain is supplied. It has not been run because the production domain is not confirmed.
- Replaced the administrator email stored in public article records with a generic editor label to avoid exposing the admin address through published Firestore documents.
- Added CSV regression test and updated source maintenance notes.

## Important limits / outstanding release gates

- Firebase configuration is still placeholder data. Do not deploy the article dashboard as operational until Firebase Authentication and Firestore are configured.
- The administrator allowlist currently contains only `catusharjain9@gmail.com`; a second administrator must be added consistently to the client allowlist and `firestore.rules` after the owner supplies the account.
- Firestore rules have not been emulator-tested in this environment. Run the documented authorised/unauthorised tests before enabling the CMS.
- CMS articles currently use `article.html?slug=...` and are rendered client-side. The static sitemap does not include these query-string pages. For dependable SEO, add a trusted static article build/export workflow from reviewed published content before launch.
- CSP includes the Firebase and CDN origins present in the source, but the policy must be verified in browser developer tools against Firebase sign-in, Firestore, PDF tools and spreadsheet loading.
- CSV safety reduces formula-injection risk but cannot guarantee identical behaviour across all spreadsheet applications. Treat exported files from untrusted sources carefully.
- Browser-local compliance data is not shared or automatically backed up. It is not a multi-user compliance database.
- Financial calculators have not been independently reconciled against every statutory edge case. Outputs require professional review.
- No production deployment or live penetration test was performed.

## Required release test matrix

1. Install the pinned development dependency and create a lockfile in an internet-enabled build environment; then run `npm run audit`. The lockfile could not be generated in this environment because the package installation timed out.
2. `npm run test:csv` including formula payloads beginning with `=`, `+`, `-`, `@`, whitespace and tabs; verify ordinary negative amounts remain numeric.
3. Simulate `localStorage.setItem` throwing and verify each compliance tracker action rolls back and shows an error.
4. Import invalid dates including `2026-02-31` and `2026-13-01`; both must be rejected.
5. Test MIS, depreciation, GST reconciliation and cash-flow calculations against independently prepared fixtures.
6. Test CSV exports in Excel and LibreOffice; check formulas are inert and amounts remain usable.
7. Test Firebase rules: anonymous public read of published articles only; anonymous draft read denied; unauthorised account create/update/delete denied; authorised account can perform intended actions.
8. Test CSP and all external scripts in Chromium and Firefox; no required resource should be silently blocked.
9. Keyboard-only, screen-reader status-message, mobile viewport, form-error and contrast checks.
10. Once domain is confirmed, generate canonical tags/sitemap/robots, validate every URL and check Search Console after launch.

## Follow-up fixes from full browser/functional testing (19 October 2026)
- Fixed the compliance tracker success-message ordering so a successful save is not immediately cleared by form reset.
- Made Firebase SDK imports conditional on a configured Firebase project, avoiding unnecessary remote requests on static Insights pages when CMS configuration is still placeholder data.
- Added SHA-256 CSP hashes for all inline JSON-LD blocks across Firebase Hosting, `_headers` and `.htaccess`; added `scripts/test-csp-hashes.mjs` and `npm run test:csp` to prevent future hash drift.
- Corrected the homepage hero secondary button contrast on the light hero background.
- Removed the unverified registered office address and internal verification notes from public About/Contact pages until current MCA data is confirmed.
- Removed unused calculator handlers from `assets/js/tools.js` that had no matching UI, including obsolete MSME threshold logic.
- Updated `robots.txt` and the sitemap generator to allow crawlers to observe page-level `noindex` directives while keeping non-public/admin/template pages out of the sitemap.
- See `TESTING_REPORT.md` for test counts and the limitations of simulated browser/CDN/Firebase testing.
