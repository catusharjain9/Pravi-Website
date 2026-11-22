# PRAVI deployment security and release dependencies

## Current deployment

The production workflow publishes the site through GitHub Pages at the GitHub Pages project path. GitHub Pages serves static files and does not apply the repository's Cloudflare Pages `_headers` file, Apache `.htaccess` rules, or Firebase Hosting `firebase.json` response-header rules.

Consequently, the presence of those files does **not** prove that the live GitHub Pages response includes Content-Security-Policy, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, or Permissions-Policy headers. Do not describe those response headers as active until they are verified on the deployed host.

## What is configured for compatible hosts

The repository retains equivalent security-header policies for hosts that explicitly support the relevant configuration format:
- `_headers`: Cloudflare Pages-style response headers.
- `.htaccess`: Apache/mod_headers response headers.
- `firebase.json`: Firebase Hosting response headers.

The CSP script allow-list includes the version-pinned official SheetJS CDN used by the GST reconciliation workpaper.

## Required path to activate response headers

To enforce response headers, deploy through a hosting provider or edge proxy that supports them, then test the actual production responses (including the homepage, a React route and a legacy tool page) with an HTTP header inspection. GitHub Pages alone cannot activate these repository-level header files. No hosting migration, DNS change or custom-domain change has been made by this repair branch.

## Remaining release approvals

The following items cannot be truthfully completed by source-code changes alone:
- Confirm the firm's legal name, registered-office details, published email and telephone details against authoritative firm records.
- Confirm every public service statement against the firm's actual eligibility, professional authorisations, independence and engagement scope.
- Confirm partner/author credentials and any client references or case studies before publishing them.
- Complete the privacy notice only after the actual data flows, hosting/CDN services, retention, privacy contact, WhatsApp enquiry handling and any analytics are verified.
- Configure and security-test the Firebase Insights CMS before enabling article publishing.
- Confirm whether a custom branded domain is acquired and authorised before changing canonical URLs or DNS.

Until these approvals are complete, the privacy page must remain visibly marked as a draft and excluded from search indexing.
