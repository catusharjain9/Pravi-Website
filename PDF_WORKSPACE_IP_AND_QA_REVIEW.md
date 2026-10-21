# PRAVI PDF Workspace — Originality and QA Review

Date: 20 October 2026

## Scope
Reviewed `pdf-tools.html` and `assets/js/pdf-tools.js` in the existing PRAVI Business Advisors LLP website. Changes are on the review branch `safety/pdf-workspace-original-design`; the default branch has not been changed.

## Originality review
The workspace already uses PRAVI's deep-teal, sage and warm-stone palette, PRAVI logo and navigation, original explanatory copy, a tool-card grid, and a consistent upload/options/process workspace. The source reviewed does not reference iLovePDF by name. The review therefore preserves the existing independently branded layout rather than replacing working features with an unnecessary wholesale redesign.

The review is not a legal opinion or a guarantee that every visual detail is free of third-party rights. A visual side-by-side comparison of deployed pages and a full asset/source provenance audit remain recommended before launch.

## Fix applied
- Fixed single-file selection behaviour: when a user chooses an invalid replacement file, the previously selected valid file is no longer cleared before validation. The selection is replaced only after a valid replacement is accepted.
- Multi-file flows retain their existing selected files and duplicate/size checks.

## Existing functionality preserved
- Merge PDF
- Split PDF into a ZIP of page-range files
- Compress PDF (rasterizes pages; text/vector quality is not preserved)
- PDF to JPG ZIP
- JPG/PNG to PDF
- Rotate pages
- Add page numbers
- Add text watermark
- Remove pages
- Extract pages

## Limits and remaining verification
- File limits remain 100 MB per file and 150 MB per job; rendering tools cap at 100 pages.
- PDF processing libraries are loaded from jsDelivr at runtime. Real-browser testing must confirm CDN availability, worker loading, and the supported browsers' behaviour.
- Prior QA covered mocked PDF-library interfaces and UI validation, not end-to-end parsing/rendering with real PDF files. This change has not yet had a live-browser end-to-end run.
- Do not use confidential client records for testing. Use synthetic PDFs/images covering single- and multi-page files, malformed/encrypted PDFs, rotation, page ranges, large files, and browser memory limits.
- Production hosting, HTTPS/security headers, CDN availability and final mobile/device checks remain release gates.

## Release status
Review branch only; not merged to `main` and not deployed. The default branch remains unchanged until the fix is reviewed and regression-tested.
