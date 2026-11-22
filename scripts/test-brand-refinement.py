#!/usr/bin/env python3
"""Regression checks for PRAVI's approved visual identity and shared design layer."""
from pathlib import Path
import re
import sys
ROOT=Path(__file__).resolve().parents[1]
CSS=ROOT/"assets/css/brand-audit-refinement.css"
PAPER=ROOT/"assets/css/paper-texture.css"
STYLE=ROOT/"assets/css/style.css"
YELLOW=ROOT/"assets/css/pravi-yellow-system.css"
PALETTE=("#FFFFFF","#FFE000","#303030")
MODERN_PALETTE=("#FFFBF3","#FFF0C8","#F2C653","#1A2325")
def fail(message):
 print("FAIL:",message,file=sys.stderr); raise SystemExit(1)
for path in (CSS,PAPER,STYLE,YELLOW):
 if not path.is_file(): fail(f"missing required stylesheet: {path.relative_to(ROOT)}")
css=CSS.read_text(encoding="utf-8"); paper=PAPER.read_text(encoding="utf-8"); style=STYLE.read_text(encoding="utf-8"); yellow=YELLOW.read_text(encoding="utf-8")
combined=style+"\\n"+yellow
for colour in PALETTE:
 if colour.lower() not in css.lower() and colour.lower() not in combined.lower(): fail(f"approved palette token missing: {colour}")
for colour in MODERN_PALETTE:
 if colour.lower() not in yellow.lower(): fail(f"warm editorial legacy-tool palette token missing: {colour}")
if ".pravi-intro,.pravi-intro__field,.pravi-intro__orbit" not in yellow: fail("legacy logo splash must remain disabled")
if ".pravi-doodle-scene,.doodle-corner,.doodle-card-mark" not in yellow: fail("legacy doodle overlays must remain disabled")
if "Retired" not in (ROOT/"assets/js/pravi-logo-intro.js").read_text(encoding="utf-8"): fail("legacy logo intro must be retired")
if "Retired" not in (ROOT/"assets/js/pravi-motion.js").read_text(encoding="utf-8"): fail("legacy motion script must be retired")
if 'brand-audit-refinement.css' not in paper: fail("paper-texture.css must load the shared refinement layer")
if '.page-hero' in paper and 'background-image' in paper: fail("paper texture must not overwrite page-hero mastheads")
for rule in (':focus-visible','prefers-reduced-motion','max-width:1100px','.table-wrap','.site-footer','Noto Sans Devanagari'):
 if rule not in css and rule not in style: fail(f"required design/accessibility rule missing: {rule}")
pages=sorted(ROOT.glob("*.html"))
if len(pages)<30: fail(f"expected at least 30 HTML pages, found {len(pages)}")
react_pages={"index.html","about.html","services.html","who-we-help.html","virtual-cfo.html","startup-support.html","direct-tax.html","gst-compliance.html","accounting-mis.html","business-advisory.html"}
tool_shell_pages={"tools.html","gst-reconciliation.html","tax-calculators.html","depreciation-calculator.html","depreciation-register.html","currency-converter.html","cashflow-planner.html","mis-generator.html","compliance-tracker.html","pdf-tools.html"}
branded_exception_pages={"404.html"}
for page in pages:
 if page.name in react_pages:
  continue
 html=page.read_text(encoding="utf-8")
 if 'assets/css/paper-texture.css' not in html: fail(f"{page.name}: shared brand stylesheet missing")
 if 'assets/css/pravi-yellow-system.css' not in html: fail(f"{page.name}: final three-colour stylesheet missing")
 if page.name in tool_shell_pages:
  if html.count('assets/img/pravi-approved-lockup.webp') < 2: fail(f"{page.name}: header and footer must use the approved full logo lockup")
  if 'href="index.html"' in html or 'href="index.html#who-we-help"' in html: fail(f"{page.name}: legacy homepage route must not point to index.html")
  nav=re.search(r'<nav\b(?=[^>]*\bclass="primary-nav")[^>]*>(.*?)</nav>',html,re.I|re.S)
  if not nav: fail(f"{page.name}: primary navigation missing")
  for href in ('about.html','services.html','who-we-help.html','tools.html','resources.html','insights.html','contact.html'):
   if f'href="{href}"' not in nav.group(1): fail(f"{page.name}: current primary navigation link missing: {href}")
 elif page.name in branded_exception_pages:
  if html.count('assets/img/pravi-approved-lockup.webp') < 2: fail(f"{page.name}: must use the approved full logo lockup in header and footer")
 else:
  if 'assets/img/pravi-logo.svg' not in html: fail(f"{page.name}: approved legacy logo missing")
 if '<title>' not in html.lower(): fail(f"{page.name}: page title missing")
for selector in (".btn-main",".btn-work",".run",".pdf-process",".pdf-filter[aria-pressed=\"true\"]",".workspace",".pane",".table-scroll"):
 if selector not in css: fail(f"legacy tool palette override missing: {selector}")
if ".status,.alert-box,.ok-box,.warning,.good,.warning-panel,.success-panel" not in combined: fail("tool workspaces must retain visible status and alert components")
print(f"PASS: {len(pages) - len(react_pages)} legacy HTML pages load shared brand CSS and the approved logo; React route set is staged separately.")
print("PASS: hero mastheads are protected from paper-texture overrides.")
print("PASS: approved palette, warm ivory/butter-yellow legacy tool palette, keyboard focus, responsive navigation, table and reduced-motion rules.")

# The public Resources page must contain actual guide and article cards.
resources=(ROOT/"resources.html").read_text(encoding="utf-8")
if resources.count('class="guide-card"') < 4:
 fail("Resources page must display at least four founder guide cards")
if resources.count('class="insight-card"') < 4:
 fail("Resources page must display at least four further-reading article cards")
for target in ("guide-startup-compliance.html","guide-virtual-cfo.html","guide-monthly-mis.html","guide-gst-reconciliation.html","article-13-week-cashflow.html","article-first-90-days-accounting.html","article-gst-purchase-reconciliation.html","article-monthly-mis-review.html"):
 if not (ROOT/target).is_file(): fail(f"Resources card target missing: {target}")
if 'content="#FFFFFF" name="theme-color"' not in resources:
 fail("Resources page browser theme colour must match the pure white brand canvas")
print("PASS: Resources page contains four working guide cards and four article cards.")
