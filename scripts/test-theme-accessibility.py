#!/usr/bin/env python3
"""Regression checks for PRAVI's white / bright-yellow / charcoal design system."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
CSS_PATH = ROOT / "assets" / "css" / "style.css"
PALETTE = {"white": "#FFFFFF", "yellow": "#FFE000", "charcoal": "#303030"}

def luminance(hex_color: str) -> float:
    rgb = [int(hex_color[i:i+2], 16) / 255 for i in (1, 3, 5)]
    linear = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in rgb]
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]

def contrast(a: str, b: str) -> float:
    x, y = luminance(a), luminance(b)
    return (max(x, y) + .05) / (min(x, y) + .05)

def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)

if not CSS_PATH.is_file():
    fail("shared stylesheet is missing")
css = CSS_PATH.read_text(encoding="utf-8")
marker = "/* PRAVI three-colour redesign"
if marker not in css:
    fail("three-colour redesign layer is missing")
theme = css[css.index(marker):]

for name, colour in PALETTE.items():
    if colour not in theme:
        fail(f"approved {name} colour {colour} is missing")
if not re.search(r'--font:"Poppins"', theme) or not re.search(r'--display:"Poppins"', theme):
    fail("Poppins must remain the shared body and display font")
if "assets/img/pravi-logo.svg" not in (ROOT / "index.html").read_text(encoding="utf-8"):
    fail("approved PRAVI logo asset is missing from the homepage")
if not (ROOT / "assets/img/pravi-launch-growth.svg").is_file():
    fail("new brand-aligned homepage illustration is missing")

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
if not pages:
    fail("no HTML pages found")
for page in pages:
    html = page.read_text(encoding="utf-8")
    if not re.search(r'<link\b[^>]*href="assets/css/style\.css(?:\?[^" ]*)?"[^>]*>', html, re.I):
        fail(f"{page.name} does not load the shared stylesheet")
print(f"PASS: {len(pages)} HTML pages continue to load the shared design system.")
print("PASS: Poppins, approved PRAVI logo and three-colour palette are retained.")
