# PRAVI PDF Workspace — Release Safety Review

Date: 20 October 2026

## Changes in this review branch

- Clarified the privacy statement: document bytes are processed in the browser and are not sent to PRAVI servers by this page; PDF processing libraries are loaded from jsDelivr.
- Added a user-facing warning that image-based compression can remove searchable/selectable text, reduce fine-print clarity, remove vector sharpness/accessibility information, and produce a larger file. Users are told to retain the original.
- Added `pdf-tools-licenses.html` and linked it from the PDF workspace. It records the currently referenced versions and upstream licence sources for pdf-lib 1.17.1, JSZip 3.10.1, and PDF.js 6.4.299.
- Preserved PRAVI's own palette, logo, typography and copy. The reviewed HTML/JS did not contain iLovePDF branding or references.
- The earlier single-file replacement fix is already on `main` from PR #1.

## Checks completed against repository source

- Found ten tool definitions: merge, split, compress, PDF-to-JPG, images-to-PDF, rotate, page numbers, watermark, remove pages, extract pages.
- Confirmed source-level limits: 100 MB per file, 150 MB per job, and a 100-page render limit.
- Static source scan found no `eval()` calls and no `fetch()` calls in `assets/js/pdf-tools.js`. Two `innerHTML` assignments were found; they build fixed option markup from internal tool definitions, not directly from uploaded file names or document text.
- Confirmed pinned CDN URLs for pdf-lib 1.17.1 and JSZip 3.10.1 and a pinned PDF.js 6.4.299 import/worker URL.
- Verified the updated page contains the CDN disclosure, local-processing wording, compression-quality warning, and link to the library notices.
- The privacy note and licence page explicitly avoid promising absolute privacy, complete licence clearance, or zero legal risk.

## Not yet verified — release blockers

These checks cannot be truthfully marked as passed from static source review alone:

1. End-to-end processing of real synthetic fixtures for all ten tools, including malformed/encrypted PDFs, rotated pages, page-range edge cases, mixed image formats, and corrupted inputs.
2. Actual output integrity: reopen each generated PDF/ZIP and verify page counts, ordering, orientation, text/image quality and archive contents.
3. Live browser testing on Chrome, Edge, Firefox and mobile Safari/Chrome at supported viewport sizes. No production URL or approved public test deployment was available; deployment remains on hold.
4. CDN load failures, worker loading, offline behaviour, memory pressure and large-file behaviour in real browsers.
5. Full third-party software bill of materials, including transitive dependencies and exact shipped artifact/licence verification. The notices page is a starting point, not a complete SBOM.
6. A visual side-by-side originality review against iLovePDF and provenance review of all assets/design sources. No source-level iLovePDF reference was found, but this is not a legal clearance.
7. Hosting-level HTTPS, security headers, cache behaviour, CSP and production privacy-policy verification.

## Release recommendation

Keep this change in a review branch until the remaining browser/fixture checks can be run in an accessible test environment. Do not describe the PDF workspace as fully tested or legally cleared yet. Use synthetic documents only; do not upload confidential client files to a third-party testing service.

## UI behaviour worth preserving

- Compression is explicitly image-based and warns that text search/copy and vector quality are not retained.
- PDF processing is local in the browser after libraries load, but internet access is needed to load those libraries.
- The browser tool does not send document files to PRAVI servers according to the reviewed code; this is not a guarantee against device compromise, browser extensions, CDN supply-chain issues, or all privacy risks.
