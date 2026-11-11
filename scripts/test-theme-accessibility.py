#!/usr/bin/env python3
"""Regression checks for PRAVI's pure white, bright yellow and charcoal visual system."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
STYLE = ROOT / "assets/css/style.css"
THEME = ROOT / "assets/css/pravi-yellow-system.css"
PAPER = ROOT / "assets/css/paper-texture.css"
PALETTE = {"white": "#FFFFFF", "yellow": "#FFE000", "charcoal": "#303030"}

def fail(message):
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)

for file in (STYLE, THEME, PAPER):
    if not file.is_file():
        fail(f"missing stylesheet: {file.relative_to(ROOT)}")

style = STYLE.read_text(encoding="utf-8")
theme = THEME.read_text(encoding="utf-8")
if "PRAVI three-colour redesign" not in style:
    fail("shared style marker missing")
for name, colour in PALETTE.items():
    if colour not in theme:
        fail(f"approved {name} token missing: {colour}")
if '"Poppins"' not in theme:
    fail("Poppins must remain the site display and UI font")
if ":focus-visible" not in style and ":focus-visible" not in theme:
    fail("visible keyboard focus styling is missing")
if "prefers-reduced-motion" not in style and "prefers-reduced-motion" not in theme:
    fail("reduced-motion support is missing")
if "max-width:1100px" not in style and "max-width:1100px" not in theme:
    fail("tablet navigation breakpoint is missing")

def luminance(hex_color):
    rgb = [int(hex_color[i:i+2], 16) / 255 for i in (1, 3, 5)]
    vals = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in rgb]
    return .2126 * vals[0] + .7152 * vals[1] + .0722 * vals[2]

def contrast(a, b):
    x, y = luminance(a), luminance(b)
    return (max(x, y) + .05) / (min(x, y) + .05)

for foreground, background, label in [
    (PALETTE["charcoal"], PALETTE["white"], "charcoal on white"),
    (PALETTE["charcoal"], PALETTE["yellow"], "charcoal on yellow"),
    (PALETTE["white"], PALETTE["charcoal"], "white on charcoal"),
]:
    ratio = contrast(foreground, background)
    if ratio < 4.5:
        fail(f"{label} contrast is {ratio:.2f}:1")
    print(f"PASS: {label} contrast {ratio:.2f}:1")

pages = sorted(ROOT.glob("*.html"))
if len(pages) < 30:
    fail(f"expected at least 30 root HTML pages, found {len(pages)}")
for page in pages:
    html = page.read_text(encoding="utf-8")
    for ref in ("assets/css/style.css", "assets/css/paper-texture.css", "assets/css/pravi-yellow-system.css", "assets/img/pravi-logo.svg"):
        if ref not in html:
            fail(f"{page.name} does not load required site asset: {ref}")
    if "<title>" not in html.lower():
        fail(f"{page.name} is missing a document title")
    if 'name="theme-color"' in html and 'content="#FFFFFF"' not in html:
        fail(f"{page.name} browser theme colour is not pure white")
print(f"PASS: {len(pages)} pages load shared stylesheets and approved logo.")
print("PASS: three approved colours, Poppins, focus, responsive and reduced-motion rules.")
