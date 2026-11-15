#!/usr/bin/env python3
"""Regression checks for PRAVI's pure white, bright yellow and charcoal visual system."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
STYLE = ROOT / "assets/css/style.css"
THEME = ROOT / "assets/css/pravi-yellow-system.css"
PAPER = ROOT / "assets/css/paper-texture.css"
SITE_JS = ROOT / "assets/js/site.js"
PALETTE = {"white": "#FFFFFF", "yellow": "#FFE000", "charcoal": "#303030"}

def fail(message):
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)

for file in (STYLE, THEME, PAPER, SITE_JS):
    if not file.is_file():
        fail(f"missing required design asset: {file.relative_to(ROOT)}")

style = STYLE.read_text(encoding="utf-8")
theme = THEME.read_text(encoding="utf-8")
paper = PAPER.read_text(encoding="utf-8")
site_js = SITE_JS.read_text(encoding="utf-8")

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
if "max-width:1100px" not in theme:
    fail("tablet navigation breakpoint is missing")
if "window.innerWidth > 1100" not in site_js:
    fail("responsive menu close behavior must match the 1100px breakpoint")

# The final theme is linked directly and last by every page; verify that below.
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
    head = html.split("</head>", 1)[0]

    for ref in (
        "assets/css/style.css",
        "assets/css/paper-texture.css",
        "assets/css/pravi-yellow-system.css",
    ):
        if ref not in head:
            fail(f"{page.name} does not load required stylesheet in its head: {ref}")
    if "assets/img/pravi-logo.svg" not in html:
        fail(f"{page.name} does not load the approved PRAVI logo: assets/img/pravi-logo.svg")

    if "<title>" not in html.lower():
        fail(f"{page.name} is missing a document title")

    # The final palette stylesheet must be the last stylesheet in every page head.
    stylesheet_links = []
    for match in re.finditer(r"<link\b[^>]*>", head, re.I):
        tag = match.group(0)
        if re.search(r"""rel=["']stylesheet["']""", tag, re.I) and ".css" in tag.lower():
            stylesheet_links.append((match.start(), tag))
    if not stylesheet_links or "pravi-yellow-system.css" not in stylesheet_links[-1][1]:
        fail(f"{page.name} does not load the final three-colour stylesheet last")

    theme_position = stylesheet_links[-1][0]
    if any(match.start() > theme_position for match in re.finditer(r"<style\b", head, re.I)):
        fail(f"{page.name} contains inline CSS after the final three-colour stylesheet")

    for match in re.finditer(r"<meta\b[^>]*>", head, re.I):
        tag = match.group(0)
        name = re.search(r"""name=["']theme-color["']""", tag, re.I)
        content = re.search(r"""content=["']([^"']+)["']""", tag, re.I)
        if name and content and content.group(1).upper() != "#FFFFFF":
            fail(f"{page.name} browser theme colour must be pure white")

print(f"PASS: {len(pages)} pages load the approved logo and final palette stylesheet.")
print("PASS: three-colour palette, Poppins, focus, responsive navigation and reduced-motion rules.")
