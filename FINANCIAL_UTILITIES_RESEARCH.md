# PRAVI Financial Utilities — Research and Design Record

Research date: 3 November 2026

## 1. Depreciation and deferred tax

### Statutory basis reviewed

- Companies Act, 2013, Schedule II, section 123: depreciable amount is cost (or substituted amount) less residual value; useful life and residual value are governed by Schedule II, subject to the stated company-class, regulatory and disclosure provisions.
- Income-tax Act, 1961, section 32 and Income-tax Rules, 1962, Rule 5 / Appendix I govern tax years before the new Act's commencement, subject to transition and savings provisions.
- Income-tax Act, 2025, section 33 and Income-tax Rules, 2026, Rule 25 / Appendix I apply from 1 April 2026. The Income Tax Department's commencement announcement confirms the effective date.
- Income-tax Act, 2025, section 33(4): tax depreciation under the block method is restricted to 50% of the prescribed rate for qualifying assets acquired in the tax year and put to use for less than 180 days.
- Income-tax Act, 2025, section 33(8)–(9): eligible new plant and machinery for qualifying manufacturing/production or power businesses may attract additional depreciation of 20%; where put to use for less than 180 days, 10% is allowed in the year of use and the remaining 10% in the immediately succeeding year. Eligibility conditions and exclusions must be checked.
- Specified concessional regimes restrict rates / disallow additional depreciation; the calculator blocks the relevant additional-depreciation inputs and applies the 40% cap for the regimes represented in its settings.

### Calculation design

**Companies Act**
- Asset-wise register, with cost, put-to-use date, Schedule II class, useful life, residual value, optional opening accumulated depreciation and optional WDV rate where residual value is zero.
- SLM: (cost − residual value) ÷ useful life, prorated for actual days or whole months selected by the user.
- WDV: rate derived from useful life and residual value unless an explicit rate is supplied for a zero-residual-value case.
- Closing carrying amount is not allowed to fall below residual value.
- The model does not automatically infer component accounting, impairment, revaluation, change in estimate, disposal accounting, or regulatory-specific useful lives.

**Income-tax**
- Block-wise WDV model; user enters opening WDV, additions split into at-least-180-day and less-than-180-day use buckets, sale proceeds and any additional-depreciation-eligible portion of additions.
- Normal depreciation uses full-rate additions and half-rate treatment for less-than-180-day additions.
- Additional depreciation is computed separately from normal block depreciation. A less-than-180-day eligible addition receives 10% in the current year and the second 10% in the immediately succeeding year.
- Block cessation / section 50 balancing gains or losses, power-undertaking actual-cost depreciation, succession / amalgamation / demerger apportionment, business-profit limitation and unabsorbed-depreciation carry-forward are outside this simplified workpaper and require a separate computation.

**Deferred tax**
- Temporary difference for the entered depreciation population is book carrying amount minus tax base.
- A positive difference for an asset generally creates a taxable temporary difference / DTL; a negative difference generally creates a deductible temporary difference / DTA.
- DTA recognition is not automatic. The interface defaults to calculating but not recognising DTA; the user must affirm that the applicable AS 22 / Ind AS 12 recognition criteria have been assessed before showing recognised DTA.
- The user supplies the tax rate expected to apply on reversal. The tool holds this rate constant over the selected projection.
- The aggregate net presentation is only appropriate where offsetting criteria under the applicable standard are met. Other temporary differences and tax effects are outside scope.

### Peer and implementation review

Reviewed public workflows from TaxAdda's separate Income-tax and Companies Act calculators, and public depreciation workpapers that distinguish block-based tax WDV from asset-wise Schedule II depreciation. The PRAVI implementation preserves that separation and adds a deferred-tax bridge. Public open-source examples were reviewed for validation and schedule patterns; no third-party code was copied into the PRAVI engine. The calculation engine is original and covered by local regression tests.

## 2. Currency converter

### Standard and rate-data design

- ISO 4217 uses internationally recognised three-letter alphabetic currency codes. The converter uses an intentionally curated set of major fiat currencies and excludes crypto-assets, metals, obsolete and fund codes.
- The conversion direction is explicit: 1 source currency equals the displayed target-currency rate; converted amount is input amount multiplied by rate, with no intermediate rounding.
- The result is formatted using the browser's ISO currency metadata, including the currency's standard minor-unit precision.
- The primary data source is exchangerate.dev. Its public documentation describes source, observation/effective timestamps, market-session and stale fields. Keyless/free access is delayed by up to 15 minutes; paid tiers provide live observations. The page therefore does not claim that the free public feed is tick-by-tick real-time.
- If the primary source is unavailable, the converter may use Frankfurter's daily reference-rate endpoint and labels it explicitly as a daily reference fallback. It never silently presents a daily reference rate as a live market observation.
- Both sources are indicative only. Bank spreads, transfer fees, card markups, taxes and settlement quotes are not inferred.

### Open-source review

- Frankfurter (lineofflight/frankfurter) is MIT-licensed, self-hostable and aggregates central-bank / official reference data. Its public service is daily reference data, not an intraday execution quote.
- haxqer/FreeExchangeRateApi / ExchangeRate.fun is MIT-licensed and documents hourly updates without an API key. Its data metadata and publication methodology are less granular than the selected primary provider, so it was not selected as the primary rate source.
- SeyyidKadir/fx-currency-converter was reviewed as an example of currency selection, caching and refresh UX, not copied.

## 3. Quality and release controls

- Calculation logic is separated into a pure JavaScript engine for testability.
- Regression tests cover SLM, WDV, normal block depreciation, the 180-day restriction, the 10% + 10% additional-depreciation sequence, concessional-regime restrictions, disposal-proceeds validation and DTA/DTL direction / recognition.
- Currency conversion validates provider rates, retains source and effective-time metadata, caches pair requests, labels stale or fallback observations and avoids hidden conversion fees.
- Hosting CSP permits only the required exchange-rate API hosts.
- Browser-level verification of actual API availability, CORS, the production CSP and mobile rendering remains a deployment test; a static repository check alone cannot establish those behaviours.

## 4. Primary references

- Companies Act, 2013, Schedule II: https://www.indiacode.nic.in/bitstream/123456789/15198/1/the_companies_act%2C_2013_no._18_of_2013_date_29.08.2013.pdf
- Income-tax Act, 2025: https://www.incometaxindia.gov.in/Documents/Act/Income-tax-Act-2025.pdf
- Income-tax Rules, 2026, Appendix I: https://www.incometaxindia.gov.in/documents/20117/42998/Appendix-I_2026-05-05_02-00-13_4242fc_en.pdf
- ICAI Educational Material on Ind AS 12: https://www.icai.org/post/19824
- ISO 4217 overview: https://www.iso.org/iso-4217-currency-codes.html
- exchangerate.dev documentation: https://exchangerate.dev/docs
- Frankfurter documentation: https://frankfurter.dev/
- Frankfurter source repository: https://github.com/lineofflight/frankfurter
- ExchangeRate.fun source repository: https://github.com/haxqer/FreeExchangeRateApi
- TaxAdda Income-tax depreciation calculator: https://calculator.taxadda.com/depreciation-calculator-as-per-income-tax-act
- TaxAdda Companies Act depreciation calculator: https://calculator.taxadda.com/depreciation-calculator-companies-act-2013
