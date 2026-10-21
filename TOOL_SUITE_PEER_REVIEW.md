# PRAVI Tool Suite — Cross-Web Peer Review

Review date: 20 October 2026
Review scope: public reference research plus source-level review of the current PRAVI repository. This is not a completed live browser QA run, legal opinion, tax opinion or assurance report.

## Executive summary

PRAVI's strongest differentiator should be **practical India-focused workpapers with clear boundaries and local processing**, rather than trying to imitate the breadth of a large PDF vendor. The business tools already contain useful cautions in several places, and the source shows CSV/XLSX-oriented workflows, exception statuses and export controls. The main improvement opportunity is to make those controls consistent across every tool, then add automated regression fixtures and real browser testing before calling the suite production-ready.

## Reference research

Research sources checked:
- iLovePDF official FAQ and security page: https://www.ilovepdf.com/help/faq and https://www.ilovepdf.com/help/security. Their published FAQ describes a two-hour retention window for ordinary processed files and user-triggered deletion. These are vendor statements, not an independent audit.
- Smallpdf official security article: https://smallpdf.com/blog/is-smallpdf-safe. It describes encryption, deletion practices and its own security claims. These are vendor statements.
- PDF24 official FAQ and privacy policy: https://tools.pdf24.org/en/faq and https://www.pdf24.org/en/privacy-policy. PDF24 describes its online retention practices and offers an offline desktop option.
- Adobe official online services FAQ: https://helpx.adobe.com/document-cloud/faq/try-acrobat-online-services.html. Adobe documents its supported online tasks, account/usage constraints and cloud processing.
- PDF24 tool catalogue: https://tools.pdf24.org/en/all-tools. Useful for navigation taxonomy: organise, edit, optimise/repair, security/privacy, view/check and convert.
- Smallpdf security guidance: https://smallpdf.com/blog/what-security-features-to-look-for-in-pdf-software. Important distinction: visible overlays/watermarks are not the same as true redaction; a visual cover must not be presented as secure removal of underlying content.

## Current repository findings

### PDF workspace
- Ten tools are present: merge, split, compress, PDF-to-JPG, images-to-PDF, rotate, page numbers, watermark, remove pages and extract pages.
- Source includes 100 MB per-file, 150 MB per-job and 100-page render limits.
- PDF processing runs client-side after CDN libraries load; this means a working internet connection is required to fetch dependencies. It does not eliminate risks from the browser, extensions, device or third-party library supply chain.
- Compression is intentionally image-based. It can remove selectable/searchable text, vector sharpness and accessibility structure, and may increase output size. This limitation should remain visible before the user runs compression.
- Pinned references were found for pdf-lib 1.17.1, JSZip 3.10.1 and PDF.js 6.4.299. A user-facing library-notices page exists on the PDF safety branch, but full transitive dependency/licence verification is still outstanding.
- Source scan found no `eval()` or direct `fetch()` call in `assets/js/pdf-tools.js`; two `innerHTML` assignments render fixed, internal tool-option markup. Continue to ensure user file names, extracted PDF text and imported strings are inserted as text or escaped before HTML insertion.

### GSTR-2B reconciliation
- Good controls already visible in source: column mapping, invalid-key/amount handling, duplicate-review status, missing-in-register statuses, configurable numeric tolerance and a full CSV report.
- The result is not a determination of ITC eligibility. Existing page text correctly calls out tax-head allocation, place of supply, reverse charge, blocked credit, amendments and section 16 conditions.
- Next improvements: fixture-based tests for credit/debit notes, invoice-number normalization, GSTIN case/spacing, duplicate invoices, same invoice across document types, date variance, tax-head-only variance, rounding tolerance, blank cells, negative credit notes and spreadsheet formula-injection safety. Confirm the matching key against real anonymised samples before changing matching rules.

### Depreciation register
- Good boundary already documented: it is a configurable straight-line planning workpaper, not an automatic Companies Act Schedule II or Income-tax Act engine. It does not determine statutory classification/rates, component accounting, disposals, impairment, block-of-assets rules or the income-tax 180-day restriction.
- Next improvements: explicit method label on every export, FY boundaries and day-count convention in the report, opening accumulated depreciation provenance, validation for opening accumulated depreciation greater than depreciable amount, residual value above cost, useful-life edge cases, leap years and mid-year additions. Add known-answer tests before changing any formulas.

### 13-week cash-flow planner
- Good controls already present: opening cash, 13 weekly buckets, base/downside cases, minimum cash buffer and a warning that the forecast is not a ledger or guarantee of liquidity.
- Next improvements: explicit scenario assumption summary; show exactly which inputs the downside percentages affect; warn about double-counting opening cash/receipts; include a clear lowest-cash week and first buffer breach; test zero flows, missing weeks, negative values, 100% receipt stress, 0%/100% payment stress and large values.

### Monthly MIS generator
- Good controls already present: strict handling of blank comparison values, category mapping, actual/prior/budget comparisons, working-capital indicators, review flags and reminders to reconcile to the signed-off trial balance.
- Next improvements: clearly label units/currency and period days, disclose comparison coverage, test incomplete prior-period/budget rows, negative revenue/expense values, zero denominators, missing category mappings and totals against known-answer fixtures. Keep report language as a management workpaper, not audited financial statements.

### Compliance tracker
- Good controls already present: due-date states, recurring items, owners/evidence references, CSV export, JSON backup and clear local-only storage disclaimers.
- Important limitation: browser storage is device-specific, can be cleared and is not shared with staff. It is not a central statutory calendar or reminder service.
- Next improvements: make backup export/import discoverable, test corrupt/old backups and duplicate IDs, validate dates and recurring period roll-forward, add source-verification date and a “last reviewed” field. Do not imply that presets capture extensions, holidays, applicability or every filing condition.

## Suite-wide product recommendations

1. **Make review status consistent.** Each output should show “Draft workpaper — review required”, the source inputs used, selected assumptions and generation date.
2. **Preserve provenance.** Keep original file names, row numbers and mapping choices in reconciliation exports so differences can be traced to source documents.
3. **Protect spreadsheet exports.** Use the shared CSV-safe helper for every exported text cell; test strings beginning with =, +, - and @, quotes, commas, CR/LF, BOM and Unicode.
4. **Do not overstate privacy.** Say “processed in this browser after dependencies load” only where code confirms it. Disclose CDN use and that browser storage/export is not a backup service.
5. **Improve failure recovery.** Invalid replacement files should not erase a valid selection; parse errors should identify the file, sheet, row or field when feasible; clear/reset actions should confirm before destructive changes.
6. **Accessibility.** Keyboard-operable file selection, visible focus, labels for every control, live status messages, non-colour-only error states, and reduced-motion support.
7. **Avoid copying competitors.** Use competitor products to learn common tasks and quality expectations, but retain PRAVI's own copy, visual language, icons and code. Review all third-party licences and asset provenance.
8. **Keep security boundaries.** Do not add uploads, cloud storage, accounts, AI processing or automatic filing without a separate privacy/security design and explicit product decision.

## Changes made in this branch

- Added a responsive “Before you rely on an output” section to `tools.html`, emphasizing source retention, exception review and independent verification.
- The change is intentionally explanatory and does not alter calculation logic.
- A static pre-save assertion confirmed the section, three cards, responsive rule and absence of a fabricated security certification claim.

## Release gate — still required

Do not describe the whole suite as fully tested until:
- JavaScript syntax checks run on all shipped scripts;
- HTML/reference and duplicate-ID checks run against the final branch;
- deterministic tests cover calculation and parsing functions;
- synthetic file fixtures validate GST and PDF imports/exports;
- generated files are reopened and their contents verified;
- browser tests run on desktop Chrome/Edge/Firefox and mobile Safari/Chrome;
- accessibility checks and privacy/security-header checks run on the deployed target;
- licences and shipped third-party assets are verified.

No live production URL was available for this review and deployment remains on hold.
