#!/usr/bin/env python3
"""Static regression checks for PRAVI's approved warm-light visual identity."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
CSS_PATH = ROOT / "assets" / "css" / "style.css"
PALETTE = {
    "charcoal": "#1F2A2E",
    "ivory": "#FCF9F1",
    "white": "#FFFDF9",
    "beige": "#FFF7E1",
    "stone": "#D9D2C6",
    "muted": "#59615F",
    "accent": "#755A12",
}
LEGACY_HERO_CLASSES = (
    ".tool-hero", ".tax-hero", ".hero-tools", ".pdf-hero",
    ".notice-hero", ".cms-header", ".page-hero", ".section-dark", ".cta-band",
)

def luminance(hex_color: str) -> float:
    rgb = [int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    linear = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in rgb]
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]

def contrast_ratio(foreground: str, background: str) -> float:
    a, b = luminance(foreground), luminance(background)
    return (max(a, b) + 0.05) / (min(a, b) + 0.05)

def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)

if not CSS_PATH.is_file():
    fail("assets/css/style.css is missing")
css = CSS_PATH.read_text(encoding="utf-8")

for colour_name, colour in PALETTE.items():
    if colour.lower() not in css.lower():
        fail(f"approved palette colour {colour_name} ({colour}) is missing from the stylesheet")
if "'Poppins'" not in css or "--font:'Poppins',sans-serif" not in css:
    fail("Poppins is not configured as the common body/display font")

if ".brand-tagline" not in css or "text-transform:lowercase!important" not in css:
    fail("locked lowercase PRAVI wordmark and tagline styles are missing")

if "PRAVI editorial redesign" not in css:
    fail("editorial design layer is missing")
for selector in (".quick-start-grid{", ".service-layer-grid{", ".insights-grid{", ".tool-grid,.grid.tool-grid{"):
    if selector not in css:
        fail(f"editorial layout rule {selector} is missing")
if "border-radius:0!important" not in css or "box-shadow:none!important" not in css:
    fail("decorative card radius/shadow removal is missing")

for selector in LEGACY_HERO_CLASSES:
    if selector not in css:
        fail(f"legacy banner selector {selector} has no shared theme override")
if "background:#FFF7E1!important;color:#1F2A2E!important" not in css:
    fail("legacy hero/banner overrides must force a warm-light surface and charcoal text")

pages = sorted(ROOT.glob("*.html"))
if not pages:
    fail("no root HTML pages were found")

missing_stylesheet = []
missing_brand_lockup = []
for page in pages:
    html = page.read_text(encoding="utf-8")
    # All pages intentionally use double-quoted, relative stylesheet links.
    if not re.search(r'<link\b[^>]*href="assets/css/style\.css\?v=20261029-brandlock1"[^>]*>', html, re.I):
        missing_stylesheet.append(page.name)
if missing_stylesheet:
    fail("pages not linked to shared stylesheet: " + ", ".join(missing_stylesheet))
for page in pages:
    html = page.read_text(encoding="utf-8")
    if 'class="brand-name">pravi' not in html or 'class="brand-tagline">लेखा | अर्थ | वृद्धि</span>' not in html:
        missing_brand_lockup.append(page.name)
if missing_brand_lockup:
    fail("pages missing the approved lowercase PRAVI lockup: " + ", ".join(missing_brand_lockup))

checks = [
    ("body text on ivory", PALETTE["charcoal"], PALETTE["ivory"]),
    ("body text on beige", PALETTE["charcoal"], PALETTE["beige"]),
    ("muted text on white", PALETTE["muted"], PALETTE["white"]),
    ("muted text on beige", PALETTE["muted"], PALETTE["beige"]),
    ("accent text on beige", PALETTE["accent"], PALETTE["beige"]),
    ("white button text on charcoal", PALETTE["ivory"], PALETTE["charcoal"]),
]
for label, foreground, background in checks:
    ratio = contrast_ratio(foreground, background)
    if ratio < 4.5:
        fail(f"{label} contrast is {ratio:.2f}:1; minimum required here is 4.5:1")

print(f"PASS: {len(pages)} HTML pages use the shared stylesheet.")
print(f"PASS: all {len(LEGACY_HERO_CLASSES)} legacy banner classes have shared-theme overrides.")
for label, foreground, background in checks:
    print(f"PASS: {label}: {contrast_ratio(foreground, background):.2f}:1")
