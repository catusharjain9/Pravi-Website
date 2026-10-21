# PRAVI Business Workpapers — current scope

The tools page prioritises focused workpapers. A separate branded PDF workspace is provided at `pdf-tools.html`.

## PDF workspace (`pdf-tools.html`)
The PDF page is inspired by the clarity of common online PDF suites but uses PRAVI's own design and branding. It includes category filters/search, tool cards, a file drop area, selected-file queue and ordering controls, per-tool options, progress/status feedback and downloadable outputs.

Implemented tools:
- **Merge PDF:** combine two or more documents in the displayed order.
- **Split PDF:** create separate PDFs for non-overlapping page ranges; download all parts as ZIP.
- **Compress PDF:** render pages to JPEG and rebuild a lower-size/image-based PDF with three quality presets. This can enlarge rather than reduce a file; searchable/selectable text, vector detail, accessibility tags and some metadata are not preserved.
- **PDF to JPG:** render each page to JPEG and download the images in a ZIP archive.
- **JPG/PNG to PDF:** place ordered images on A4, US Letter or image-fit pages with configurable margins.
- **Rotate PDF:** rotate all or selected pages by 90°, 180° or 270°.
- **Add page numbers:** choose placement, starting number, size and a plain / `Page n` / `Page n of total` format.
- **Watermark PDF:** overlay user-entered text with colour, opacity, size and rotation controls. This is not encryption or tamper-proof redaction.
- **Remove pages:** delete specified pages/ranges while preserving the remaining order.
- **Extract pages:** create a new PDF from specified page numbers/ranges.

Limitations and deployment requirements:
- The page loads pinned `pdf-lib` 1.17.1, `pdfjs-dist` 6.4.299 and JSZip 3.10.1 from jsDelivr. Internet is needed to load the libraries. The CDN host and PDF.js worker host must be allowed by the hosting Content Security Policy.
- File bytes are processed in-browser; the page does not intentionally upload PDF or image content to PRAVI servers. The user must still trust their own device/browser/network.
- Per-file cap is 100 MB; total selected input cap is 150 MB. PDF-to-image and compression cap renderable documents at 100 pages to limit browser memory pressure.
- Compression is an image-based re-render, not content-aware lossless optimization. It is unsuitable where searchable text, vector quality, accessibility, signatures, or the original document structure must be preserved. Compare output size with the source before relying on it.
- Password-protected PDF unlock/protect, OCR, Word/Excel conversion, redaction, repair, digital signatures and cloud sharing are intentionally not presented as working tools.
- Validate each tool against representative real PDFs on the final deployment host. CDN loading and full live library execution could not be verified in this network-restricted build environment.

---

The business tools page prioritises five core workpapers and the GST amount calculator. PDF operations are grouped into a separate, dedicated workspace rather than mixed into the workpaper grid.

## 1. GSTR-2B vs purchase-register reconciliation (`gst-reconciliation.html`)
- Inputs: GSTR-2B and purchase-register `.xlsx`, `.xls`, or `.csv` exports, one GSTIN/tax period at a time; up to 30 MB per file.
- Multi-worksheet Excel files: choose the sheet that contains invoice-level rows. The tool tries to identify the header row within the first 35 rows.
- Confirm the suggested column mapping before matching. Required fields are supplier GSTIN, invoice/document number and taxable value; tax heads/date/document type are optional mappings.
- Matching key: normalized supplier GSTIN + invoice/document number; document type is added only when it is mapped on both sides. Values are compared GSTR-2B minus purchase register against a user-set tolerance.
- Outcomes: matched, value variance, optional date variance, only in one source, duplicates, invalid keys and invalid numeric amounts. Full CSV report includes source row numbers, both source values for each mapped tax head, and calculated differences.
- Boundary: it does not determine ITC eligibility, validate tax law or replace the GST portal's official matching facility. The official portal offers its own matching tool and expects its prescribed purchase-register template.

## 2. Fixed-asset depreciation workpaper (`depreciation-register.html`)
- Supports multiple asset rows, manual entry and CSV import/export. Download the CSV template before bulk import.
- Estimates current-year straight-line depreciation for selected financial year, with actual-day or whole-month proration. Residual value, useful life and opening accumulated depreciation are explicit inputs.
- If opening accumulated depreciation is left blank, the tool estimates it from put-to-use date and useful life; enter the ledger balance to override this.
- Boundary: this is not an automatic Companies Act Schedule II or Income-tax Act depreciation engine. It does not classify assets, choose statutory rates, support component accounting, additions/disposals, impairments, block-of-assets tax depreciation or income-tax 180-day restrictions. Use as a planning/review workpaper and independently validate before posting or filing.

## 3. 13-week cash-flow planner (`cashflow-planner.html`)
- Rolling weekly model for customer collections, other inflows, supplier/operating costs, payroll, tax/statutory payments and capex/debt.
- Calculates weekly opening/net/closing cash, minimum cash-buffer breaches, and a downside case with a configurable collection realization percentage and payment uplift.
- Export a CSV workpaper with assumptions, weekly data, base case and downside case. Blank fields count as zero after forecasting begins; enter an explicit zero when there is no expected movement.

## 4. Supporting utilities
- GST arithmetic calculator (tax-exclusive/inclusive with CGST/SGST or IGST split). It does not select the legally correct rate or place of supply.
- GST arithmetic calculator only; PDF actions are provided in the dedicated PDF workspace documented above.

## 5. Monthly MIS generator (`mis-generator.html`)
- Imports a standardized CSV with `category, account, actual, prior, budget, notes`; `category`, `account`, and an explicit numeric `actual` are required. Prior and budget are optional but blank fields remain unavailable, not silently converted to zero.
- Generates a P&L summary with revenue, direct costs, gross profit, operating expenses, EBITDA, depreciation, EBIT, finance cost, PBT and PAT. It compares entered actuals to prior and budget, displays coverage warnings, and creates basic margin, receivable-days/payable-days proxies and a balance-sheet working-capital snapshot where relevant categories are provided.
- Includes an illustrative sample dataset, blank CSV template, combined report/source-detail CSV export and print-to-PDF view.
- Boundary: it is not a general ledger, trial-balance mapper, balance-sheet validation, cash-flow statement, consolidation, or tax computation system. Map accounts and validate balances/cut-off/accruals before circulation. Variances are incomplete where prior or budget input coverage is incomplete.

## 6. Compliance due-date tracker (`compliance-tracker.html`)
- Configurable client/entity obligation register with due date, period, area, owner, priority, workflow status, evidence reference, source link, notes, overdue/today/next-7-days indicators, search and filters.
- Supports CSV import/export and full JSON backup/restore. Browser-local storage retains the register on that device/browser; it is not a shared or synced workspace.
- Completing a recurring item retains the completed record and creates the next item mechanically from the entered cadence/date. Review the next period/date manually.
- Quick-start presets supply an obligation name and official portal/source link only. They intentionally do not invent a due date or automatically determine applicability. Confirm all dates against current official notifications, extensions and entity-specific facts.
- Boundary: this is a configurable task tracker, not an authoritative statutory calendar, automated reminder service, or filing integration. Browser storage can be cleared; download backups routinely and do not place credentials or unnecessary sensitive data in notes.

## Privacy, dependencies and limits
- Data calculations in all five primary workpapers occur in the browser; no backend, login, database, file upload endpoint or filing integration is implemented. Files are not intentionally sent to PRAVI servers by these tools. Do not treat that as a substitute for your own device/network security review.
- The GST reconciliation and PDF workspace load pinned JavaScript libraries from `https://cdn.jsdelivr.net`; internet access is required to load those libraries. The hosting Content Security Policy allows that host for scripts and the PDF.js worker, and for the associated library requests.
- No shared cloud save or multi-user approval workflow exists. The compliance tracker alone persists its register in local browser storage on the current device; it is not shared or synced. Export and retain workpapers under your own records-management policy.
- Tax, company-law, MSME and FEMA applicability must be checked against current official materials and actual facts. The tools do not provide tax/legal opinions or filing advice.

## Test coverage in this revision
- `node --check` passed for all seven local JavaScript files.
- Browser interaction tests passed for MIS sample calculations, CSV import/export, explicit-zero vs blank-amount handling, incomplete comparison coverage, and UTF-8 BOM headers; tested outputs included gross profit, EBITDA and PAT totals.
- Browser interaction tests passed for compliance overdue status, recurring follow-up creation, CSV export, JSON backup and local-storage writes.
- PDF workspace tests passed for tool filtering/search, duplicate-file checks, page-range validation, and the interaction/output-download flow for all ten tool types using mocked library interfaces. These tests validate page logic and user interactions, not actual PDF parsing/rendering by the external libraries.
- Previously tested flows include GST arithmetic, asset schedule generation, 13-week cash-flow math, and GST reconciliation matching against fixtures (matched record, value variance, missing in one source, duplicate-document and invalid-amount outcomes). The reconciliation test uses a mock spreadsheet-reader interface; it does not validate every vendor-specific Excel workbook layout.
- HTML checks found no duplicate IDs or missing local references across the 24 pages. The new pages were tested at mobile width without page-level horizontal overflow or JavaScript errors in exercised flows.
- External CDN delivery, real-world PDF parse/render/output fidelity, deployment-host CSP behaviour, full spreadsheet-library compatibility, every legal/tax scenario, actual device/browser storage policies and live production hosting have not been verified. This is a tested static-site beta, not an independently audited production finance system.
