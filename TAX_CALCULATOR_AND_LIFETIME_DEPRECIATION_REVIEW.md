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


## Subsequent implementation — comprehensive depreciation workpaper

On 3 November 2026, a separate comprehensive workpaper was added at `depreciation-calculator.html` with a pure calculation engine in `assets/js/depreciation-engine.js`. It is distinct from the quick WDV estimator in `tax-calculators.html` and the whole-life SLM register in `depreciation-register.html`.

The new workpaper adds:
- Companies Act Schedule II asset-wise SLM / WDV schedules.
- Income-tax block-wise WDV schedules with 180-day additions split.
- Additional depreciation inputs split by 180-day use and the 10% succeeding-year carry-forward.
- Mapped concessional regime restrictions for sections 115BA / 115BAA / 115BAB / 115BAC / 115BAD / 115BAE and the corresponding 2025 Act sections.
- Explicit rejection of unsupported block-cessation computations.
- Deferred-tax DTA / DTL workings, with DTA recognition off by default.
- Separate year-wise, asset-wise and tax-block CSV exports.

Regression tests are maintained in `scripts/test-depreciation-engine.mjs`. These tests cover SLM, WDV, future put-to-use assets, block depreciation, additional-depreciation timing and carry-forward, regime restrictions, block cessation, and deferred-tax direction / recognition. Passing these tests does not replace statutory review of asset classification, rates, tax regime eligibility, or entity-specific facts.

The comprehensive tool is a professional working aid, not a filing engine. It does not compute section 50 block-cessation gains/losses, special power-generation methods, business-use restrictions, unabsorbed depreciation carry-forward, asset disposals in the Companies Act schedule, or all other temporary differences. Live browser/device and production API verification remain separate release checks.
