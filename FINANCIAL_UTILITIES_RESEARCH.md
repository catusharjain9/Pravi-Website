# PRAVI Financial Utilities — Research and Design Record

Research date: 3 November 2026

## 1. Depreciation and deferred tax

### Statutory basis reviewed

- Companies Act, 2013, Schedule II, section 123: depreciable amount is cost (or substituted amount) less residual value; useful life and residual value are governed by Schedule II, subject to the stated company-class, regulatory and disclosure provisions.
- Income-tax Act, 1961, section 32 and Income-tax Rules, 1962, Rule 5 / Appendix I govern tax years before the new Act's commencement, subject to transition and savings provisions.
- Income-tax Act, 2025, section 33 and Income-tax Rules, 2026, Rule 25 / Appendix I apply from 1 April 2026. The Income Tax Department's commencement announcement confirms the effective date.
- Income-tax Act, 2025, section 33(4): tax depreciation under the block method is restricted to 50% of the prescribed rate for qualifying assets acquired in the tax year and put to use for less than 180 days.
- Income-tax Act, 2025, section 33(8)–(9): eligible new plant and machinery for qualifying manufacturing/production or power businesses may attract additional depreciation of 20%; where put to use for less than 180 days, 10% is allowed in the year of use and the remaining 10% in the immediately succeeding year. Eligibility conditions and exclusions must be checked.
- The 2025 Act maps the former sections 115BA, 115BAA, 115BAB, 115BAC, 115BAD and 115BAE to sections 199, 200, 201, 202, 203 and 204 respectively. Rule 25 caps depreciation at 40% for the specified opted-in regimes; section 205 disallows additional depreciation under section 33(8) for those regimes. The selector maps these options and the engine applies the corresponding restrictions.

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

Reviewed TaxAdda's separate Income-tax and Companies Act calculators, plus current public workpapers from GetSleet, Jai Prakash & Co., SKAG and CA Alok Kumar. These comparisons reinforced the need to keep the Income-tax block WDV and Companies Act asset-wise Schedule II methods separate, to show the 180-day split, and to expose additional-depreciation and block-cessation assumptions. The PRAVI implementation preserves that separation and adds a deferred-tax bridge.

Open-source repositories reviewed: wig1-max/taxdesk-os (Apache-2.0; versioned statutory rules, deterministic computation and reviewer controls); JamesIan-Bayonas/centralog (asset-ledger and depreciation architecture, .NET / React; no licence metadata relied on); Pilotyoussef2663/asset-deprec (multi-method, data-driven depreciation schedules; no licence metadata relied on). These were architecture and test-design references only; no third-party code was copied into the PRAVI engine. The calculation engine is original and covered by regression tests.

## 2. Currency converter

### Standard and rate-data design

- ISO 4217 uses internationally recognised three-letter alphabetic currency codes. The converter uses an intentionally curated set of major fiat currencies and excludes crypto-assets, metals, obsolete and fund codes.
- The conversion direction is explicit: 1 source currency equals the displayed target-currency rate; converted amount is input amount multiplied by rate, with no intermediate rounding.
- The result is formatted using the browser's ISO currency metadata, including the currency's standard minor-unit precision.
- The primary data source is exchangerate.dev. Its public documentation describes per-currency source, observation/effective timestamps, market-session, stale and derived-cross fields. The keyless/free tier is 15 minutes delayed but permits commercial display with visible linked credit; its Basic plan is listed at USD 19/month for live rates and 100,000 calls. The page therefore labels the current no-cost feed as delayed and does not claim tick-by-tick real-time data.
- AllRatesToday was also evaluated: its documentation describes mid-market rates refreshed about every 60 seconds. Its free tier is limited to 300 lifetime requests and personal/non-commercial use; its Small plan is listed at EUR 4.99/month for 5,000 requests and commercial use. It is a viable lower-cost live alternative, but it requires a protected API key and a server-side proxy. It was not activated because that requires a paid subscription and server-side secret configuration.
- If the primary source is unavailable, the converter may use Frankfurter's daily reference-rate endpoint and labels it explicitly as a daily reference fallback. It never silently presents a daily reference rate as a live market observation.
- Both sources are indicative only. Bank spreads, transfer fees, card markups, taxes and settlement quotes are not inferred. The exchangerate.dev free-tier implementation is a transparent interim mode; true live commercial use requires the paid plan or another provider with appropriate commercial rights.

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
- exchangerate.dev pricing / free-tier limits: https://exchangerate.dev/pricing
- AllRatesToday live FX API documentation: https://allratestoday.com/docs/
- AllRatesToday commercial pricing: https://allratestoday.com/pricing/
- Frankfurter documentation: https://frankfurter.dev/
- Frankfurter source repository: https://github.com/lineofflight/frankfurter
- ExchangeRate.fun source repository (MIT, hourly reference data): https://github.com/haxqer/FreeExchangeRateApi
- SeyyidKadir/fx-currency-converter (browser-only, caching and refresh UX; README declares MIT): https://github.com/SeyyidKadir/fx-currency-converter
- Alkaison/Currency-Converter (vanilla JS, MIT): https://github.com/Alkaison/Currency-Converter
- AllRates-Today/currency-converter (MIT, SDK-based Next.js reference implementation): https://github.com/AllRates-Today/currency-converter
- TaxAdda Income-tax depreciation calculator: https://calculator.taxadda.com/depreciation-calculator-as-per-income-tax-act
- TaxAdda Companies Act depreciation calculator: https://calculator.taxadda.com/depreciation-calculator-companies-act-2013
- GetSleet combined Indian depreciation calculator: https://getsleet.cloud/accounting/tools/depreciation-calculator
- Jai Prakash & Co. depreciation calculator: https://jaiprakashco.in/depreciation-calculator
- SKAG depreciation calculator: https://skagandassociates.com/tools/income-tax/depreciation-calculator/
