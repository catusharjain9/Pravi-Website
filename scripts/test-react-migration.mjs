import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const app = read("../src/App.jsx");
const tools = read("../tools.html");
const packageJson = JSON.parse(read("../package.json"));
const sitemap = read("../sitemap.xml");
const robots = read("../robots.txt");
const routePaths = [
  "/", "/about.html", "/services.html", "/virtual-cfo.html",
  "/startup-support.html", "/direct-tax.html", "/gst-compliance.html",
  "/accounting-mis.html", "/business-advisory.html", "/resources.html", "/insights.html", "/contact.html", "/privacy.html",
  "/guide-startup-compliance.html", "/guide-virtual-cfo.html", "/guide-gst-reconciliation.html", "/guide-monthly-mis.html",
  "/article-13-week-cashflow.html", "/article-first-90-days-accounting.html", "/article-gst-purchase-reconciliation.html", "/article-monthly-mis-review.html"
];
for (const path of routePaths) {
  assert.ok(app.includes(`path="${path}"`), `Missing React route: ${path}`);
}
for (const path of ["gst-reconciliation.html","tax-calculators.html","depreciation-calculator.html","currency-converter.html","cashflow-planner.html","mis-generator.html","compliance-tracker.html","pdf-tools.html"]) {
  assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), `Missing retained tool page: ${path}`);
  assert.ok(tools.includes(path), `Tools hub no longer links to: ${path}`);
}
assert.ok(tools.includes('id="gstcalc"'), "Embedded GST calculator panel missing");
assert.ok(app.includes('className="footer-editorial"'), "Editorial footer missing from React shell");
assert.ok(app.includes('pravi-logo.svg') && app.includes('pravi-logo-full.svg'), "Approved PRAVI header and full logo lock-ups must both be referenced");
assert.ok(existsSync(new URL("../assets/img/pravi-approved-header.webp", import.meta.url)), "Approved PRAVI wordmark artwork missing");
assert.ok(existsSync(new URL("../assets/img/pravi-logo-full.svg", import.meta.url)), "Approved PRAVI full lock-up missing");
assert.ok(existsSync(new URL("../assets/img/favicon.svg", import.meta.url)), "Approved PRAVI favicon missing");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.ok(sitemapUrls.length >= 30, "Production sitemap is missing public routes/tools");
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "Sitemap contains duplicate URLs");
assert.ok(sitemapUrls.every(url => url.startsWith("https://catusharjain9.github.io/Pravi-Website/")), "Sitemap contains an unverified or off-site URL");
assert.ok(!sitemap.includes("privacy.html"), "Draft privacy notice must not be indexed");
assert.ok(robots.includes("Sitemap: https://catusharjain9.github.io/Pravi-Website/sitemap.xml"), "robots.txt sitemap directive missing");
assert.ok(app.includes('robots:"noindex,follow"'), "Draft privacy route must be noindex");
assert.equal(packageJson.scripts["test:react-migration"], "node scripts/test-react-migration.mjs");
console.log("React routes, PRAVI brand/footer, 9 tools, sitemap and privacy indexing checks passed.");
