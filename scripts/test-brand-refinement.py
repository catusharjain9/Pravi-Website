#!/usr/bin/env python3
"""Regression checks for PRAVI's approved visual identity and shared design layer."""
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
CSS=ROOT/"assets/css/brand-audit-refinement.css"
PAPER=ROOT/"assets/css/paper-texture.css"
STYLE=ROOT/"assets/css/style.css"
PALETTE=("#FCF9F1","#FFF7E1","#1F2A2E","#D9D2C6","#F6D365")
def fail(message):
 print("FAIL:",message,file=sys.stderr); raise SystemExit(1)
for path in (CSS,PAPER,STYLE):
 if not path.is_file(): fail(f"missing required stylesheet: {path.relative_to(ROOT)}")
css=CSS.read_text(encoding="utf-8"); paper=PAPER.read_text(encoding="utf-8"); style=STYLE.read_text(encoding="utf-8")
for colour in PALETTE:
 if colour.lower() not in css.lower() and colour.lower() not in style.lower(): fail(f"approved palette token missing: {colour}")
if 'brand-audit-refinement.css' not in paper: fail("paper-texture.css must load the shared refinement layer")
if '.page-hero' in paper and 'background-image' in paper: fail("paper texture must not overwrite page-hero mastheads")
for rule in (':focus-visible','prefers-reduced-motion','max-width:1100px','.table-wrap','.site-footer','Noto Sans Devanagari','.menu-toggle','primary-nav.is-open','min-height:100svh','footer-brand .brand-logo'):
 if rule not in css and rule not in style: fail(f"required design/accessibility rule missing: {rule}")
pages=sorted(ROOT.glob("*.html"))
if len(pages)<30: fail(f"expected at least 30 HTML pages, found {len(pages)}")
for page in pages:
 html=page.read_text(encoding="utf-8")
 if 'assets/css/paper-texture.css' not in html: fail(f"{page.name}: shared brand stylesheet missing")
 if 'assets/img/pravi-logo.svg' not in html: fail(f"{page.name}: approved logo missing")
 if '<title>' not in html.lower(): fail(f"{page.name}: page title missing")
print(f"PASS: {len(pages)} HTML pages load shared brand CSS and the approved logo.")
print("PASS: hero mastheads are protected from paper-texture overrides.")
print("PASS: approved palette, keyboard focus, responsive navigation, table and reduced-motion rules.")
