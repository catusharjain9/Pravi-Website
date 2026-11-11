#!/usr/bin/env python3
"""Regression checks for PRAVI's approved visual identity and shared design layer."""
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
CSS=ROOT/"assets/css/brand-audit-refinement.css"
PAPER=ROOT/"assets/css/paper-texture.css"
STYLE=ROOT/"assets/css/style.css"
PALETTE=("#FFFFFF","#FFE000","#303030")
def fail(message):
 print("FAIL:",message,file=sys.stderr); raise SystemExit(1)
for path in (CSS,PAPER,STYLE):
 if not path.is_file(): fail(f"missing required stylesheet: {path.relative_to(ROOT)}")
css=CSS.read_text(encoding="utf-8"); paper=PAPER.read_text(encoding="utf-8"); style=STYLE.read_text(encoding="utf-8")
for colour in PALETTE:
 if colour.lower() not in css.lower() and colour.lower() not in style.lower(): fail(f"approved palette token missing: {colour}")
if 'brand-audit-refinement.css' not in paper: fail("paper-texture.css must load the shared refinement layer")
if '.page-hero' in paper and 'background-image' in paper: fail("paper texture must not overwrite page-hero mastheads")
for rule in (':focus-visible','prefers-reduced-motion','max-width:1100px','.table-wrap','.site-footer','Noto Sans Devanagari'):
 if rule not in css and rule not in style: fail(f"required design/accessibility rule missing: {rule}")
pages=sorted(ROOT.glob("*.html"))
if len(pages)<30: fail(f"expected at least 30 HTML pages, found {len(pages)}")
for page in pages:
 html=page.read_text(encoding="utf-8")
 if 'assets/css/paper-texture.css' not in html: fail(f"{page.name}: shared brand stylesheet missing")
 if 'assets/img/pravi-logo.svg' not in html: fail(f"{page.name}: approved logo missing")
 if '<title>' not in html.lower(): fail(f"{page.name}: page title missing")
for selector in (".btn-main",".btn-work",".run",".pdf-process",".pdf-filter[aria-pressed=\"true\"]",".workspace",".pane",".table-scroll"):
 if selector not in css: fail(f"legacy tool palette override missing: {selector}")
if ".status,.alert-box,.ok-box,.warning,.good,.warning-panel,.success-panel" not in css: fail("tool workspaces must retain visible status and alert components")
print(f"PASS: {len(pages)} HTML pages load shared brand CSS and the approved logo.")
print("PASS: hero mastheads are protected from paper-texture overrides.")
print("PASS: approved palette, keyboard focus, responsive navigation, table and reduced-motion rules.")

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
