PRAVI OFFICE PRINT — ADVANCED PRINT SETTINGS
============================================

Upgrade features:
- Custom page selection, e.g. 1, 3-5, 8 (leave blank for all pages).
- Manual two-sided printing on Epson L220: long-edge or short-edge binding.
- 1, 2 or 4 pages per sheet.
- Auto, portrait or landscape orientation.
- Print preview reflects the selected page range and pages-per-sheet layout.
- The last layout choices are remembered in the browser.

Implementation:
- This is a patch overlay for bogdik/mfp-print-scan-server.
- The build workflow pins upstream commit 23859a71a8838788175120f36e05348488462468.
- Windows build tests the page-range parser and produces a PyInstaller folder bundle.
- A fixed GitHub release tag publishes mfp-server-upgraded.zip and its SHA-256 checksum.

Epson L220 manual duplex:
- The portal passes the Windows driver's manual long-edge / short-edge DEVMODE value.
- EPSON Status Monitor 3 must be enabled in the printer driver's Extended Settings.
- Follow the Epson driver pop-up on the printer PC after the first side; reload the paper as instructed.
- Manual two-sided printing may be unavailable if the printer is accessed through a shared/network printer queue.

Preservation:
- The feature upgrade replaces only mfp-server.exe and its _internal bundle.
- config.ini, user/PIN hash, uploads, job history, logs, printer driver, Cloudflare settings,
  URL publisher, scheduled tasks and 24-hour cleanup configuration are not overwritten.

Do not install this package until the GitHub Action has completed successfully and published
the office-print-engine-latest release assets.
