# PRAVI Tax Calculator Suite and Whole-Life Depreciation — Implementation Review

## Branch
`feature/tax-calculator-suite-lifetime-depreciation`

## Added in this change
- `tax-calculators.html` and `assets/js/tax-calculators.js`: GST inclusive/exclusive calculator; configurable tax-head ITC set-off model; editable-input GST interest/late-fee estimator; TDS interest and late-filing fee estimator; GSTIN/HSN format checks; configurable Income-tax block WDV depreciation estimator.
- `depreciation-register.html` and `assets/js/depreciation-register.js`: whole-life, year-by-year SLM schedule from put-to-use date through useful-life end, plus CSV export. The existing selected-FY schedule remains.
- `tools.html`: adds the new tax calculator suite to the tools directory.
- Links to official GST taxpayer search and CBIC GST rates page for live verification.

## Static validation performed
- Parsed both changed JavaScript files with the JavaScript compiler.
- Checked HTML IDs: no duplicate IDs and no missing IDs for literal `$('id')` references in the respective scripts.
- Confirmed the tool directory links to the new tax page, six calculator tabs exist, and the whole-life schedule controls and handlers are present.

## Important functional boundaries
- GSTIN and HSN checks are format checks, not live GSTN lookup or HSN classification. A live service requires an approved/reliable data source and may have access, terms, rate-limit and availability constraints.
- GST late fee and interest rates/caps are user-entered, not auto-selected by return type, turnover, tax period or notification. The calculator cannot decide eligibility for waivers or special rates.
- TDS interest depends on transaction type, deduction/deposit dates and the applicable statutory counting rules. The displayed estimate requires verification.
- ITC set-off is a modelled allocation, not a GST portal simulation or eligibility determination. Validate utilisation order, blocked credits, reverse charge, restrictions and current law for the specific return.
- Income-tax depreciation uses a user-entered rate and split between additions put to use for 180 days or more / less than 180 days. It does not determine asset classification or automatically handle special rates, additional depreciation, business-use restrictions, block cessation or section 50.
- Whole-life depreciation is a straight-line planning schedule based on user-entered cost, useful life, residual value and put-to-use date. It is not a full Companies Act Schedule II engine; it does not handle component accounting, revisions in estimates, impairment, disposals, revaluation, change of method or statutory rounding policy.
- No live API calls, filing actions, client-data upload, or cloud storage were added.

## Release gates still outstanding
- Unit and regression tests against known-answer examples for GST, ITC set-off, GST interest/late fee, TDS interest, WDV depreciation and whole-life depreciation.
- Real-world fixtures for leap years, dates exactly 180 days apart, mid-year acquisitions, disposal proceeds, nil returns, special rate/fee notifications, rounding and invalid/blank inputs.
- Browser/device accessibility and keyboard testing, real file/export inspection, dependency/security review, production headers and deployment validation.
- Tax and legal review of calculation rules before describing the calculators as statutory or filing-ready.

This branch is a draft for review. No merge or deployment is performed by this change.
