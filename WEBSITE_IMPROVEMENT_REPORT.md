# PRAVI BUSINESS ADVISORS LLP — Website improvement report

## What changed in this revision

- Added distinct search descriptions and social-sharing title/description metadata to the public HTML pages that lacked it; existing page-specific descriptions were preserved.
- Added conservative Organization structured data to the homepage using only confirmed legal name, LLPIN, incorporation date and phone number. No unverified address, email, people, awards, client count or credential was added.
- Added a new practical 13-week cash-flow forecasting article with a checklist, an illustrative scenario, and links to official tax/GST portals. Added it to the Insights page.
- Added official-source starting points to the three existing starter articles. They are references for readers to verify requirements, not endorsements or proof that every obligation applies.
- Improved the dynamic CMS article page so it remains noindex when missing, unconfigured or unpublished, and sets page title, description, canonical URL and indexability only after a published Firestore article is successfully loaded. Query-string CMS URLs still require search-rendering tests; static HTML generation is the stronger long-term option.
- Expanded the Firebase CMS setup and pre-launch checklist with role-based tests, draft privacy, script-injection checks and search indexing tests.
- Added a domain-parameterised sitemap generator. It refuses to generate a sitemap without an HTTPS domain, and excludes the admin, dynamic article shell, draft privacy notice and 404 page.
- Added a dependency-free structural audit script for HTML language/title, duplicate IDs, local links/assets and missing metadata.

## Facts intentionally not invented

The official email, final public domain, current registered office, hosting provider, professional biographies/credentials, measured client outcomes and working third-party integrations remain unasserted. Client/ecosystem names should remain only if the firm has public-identification permission for each relationship.

## Known release gates

- Firebase credentials/project setup and actual Firestore rules tests are not completed by this source-only change. Do not enable the CMS until tested.
- The privacy notice remains a draft pending actual hosting/data-flow review.
- No production domain, canonical host or final sitemap is configured. Run the sitemap generator only after the real HTTPS domain is confirmed.
- No live browser, production, Lighthouse, real PDF-library/CDN, Search Console, or external security test is claimed.
- Tool calculations remain workpapers/estimates and require independent validation before professional reliance.

## Reference basis

The content approach follows Google Search Central's people-first guidance and W3C WCAG 2.2 as a practical accessibility benchmark. Statutory content should link to primary sources such as the Income Tax Department and GST Portal and be checked for the relevant period. These sources do not certify this site or guarantee search ranking or accessibility conformance.
