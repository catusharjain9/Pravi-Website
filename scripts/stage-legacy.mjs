import { cpSync, copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "dist");
mkdirSync(out, { recursive: true });

// These public .html URLs are now React routes. Copying the built entry document
// preserves direct navigation and refresh behaviour on static hosts such as Pages.
const reactRoutes = [
  "about.html", "services.html", "virtual-cfo.html", "startup-support.html",
  "direct-tax.html", "gst-compliance.html", "accounting-mis.html", "business-advisory.html",
  "resources.html", "insights.html", "contact.html", "privacy.html", "who-we-help.html",
  "guide-startup-compliance.html", "guide-virtual-cfo.html", "guide-gst-reconciliation.html", "guide-monthly-mis.html",
  "article-13-week-cashflow.html", "article-first-90-days-accounting.html", "article-gst-purchase-reconciliation.html", "article-monthly-mis-review.html"
];

for (const name of readdirSync(root)) {
  if (name.endsWith(".html") && name !== "index.html" && !reactRoutes.includes(name)) {
    copyFileSync(join(root, name), join(out, name));
  }
}
for (const route of reactRoutes) {
  copyFileSync(join(out, "index.html"), join(out, route));
}

const assets = join(root, "assets");
if (existsSync(assets)) cpSync(assets, join(out, "assets"), { recursive: true });

for (const file of ["robots.txt", "sitemap.xml", "firebase-config.js"]) {
  const from = join(root, file);
  if (existsSync(from)) copyFileSync(from, join(out, file));
}

console.log(`Staged legacy pages and ${reactRoutes.length} React .html route entry points into dist.`);
