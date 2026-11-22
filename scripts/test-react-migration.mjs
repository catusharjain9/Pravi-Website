import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const app = read("../src/App.jsx");
const tools = read("../tools.html");
const packageJson = JSON.parse(read("../package.json"));
const gstPage = read("../gst-reconciliation.html");
const depreciationSource = read("../assets/js/depreciation-calculator.js");
const complianceSource = read("../assets/js/compliance-tracker.js");

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
assert.ok(app.includes("pravi-approved-lockup.webp"), "The exact approved PRAVI logo lock-up must be used in the shared shell");
assert.ok(existsSync(new URL("../assets/img/pravi-approved-lockup.webp", import.meta.url)), "Exact approved PRAVI logo lock-up artwork missing");
assert.ok(existsSync(new URL("../src/HomeRedesign.jsx", import.meta.url)), "Founder-first homepage component missing");
const redesignSource = read("../src/HomeRedesign.jsx");
assert.ok(redesignSource.includes("FounderJourney") && redesignSource.includes("role=\"tablist\""), "Interactive founder journey section missing");
assert.ok(redesignSource.includes("Different stages.") && redesignSource.includes("ROC calendar"), "Founder pathway content is incomplete");
assert.ok(redesignSource.includes("handleTabKey") && redesignSource.includes("ArrowRight") && redesignSource.includes("tabIndex={active===i?0:-1}"), "Founder pathway tabs are missing keyboard navigation");
assert.ok(redesignSource.includes("pr-hero-orbit") && redesignSource.includes("pr-orbit-dot-a"), "Creative hero orbit treatment is missing");
assert.ok(redesignSource.includes("pr-service-card-${item.number}") && redesignSource.includes('number:"04"'), "Expressive service bento variants are missing");
const appSource = read("../src/App.jsx");
assert.ok(appSource.includes("SiteScrollProgress") && appSource.includes("useScroll"), "Scroll progress indicator missing");
assert.ok(existsSync(new URL("../src/pravi-pages.css", import.meta.url)), "PRAVI inner-page design system missing");
const homeSource = read("../src/HomeRedesign.jsx");
const pagesSource = read("../src/pages.jsx");
assert.ok(!homeSource.includes("pravi-doodle-") && !homeSource.includes("doodle"), "Founder-first homepage must not reintroduce decorative doodle assets");
assert.ok(!pagesSource.includes("pravi-doodle-") && !pagesSource.includes("doodleFor"), "Inner pages must not reintroduce decorative doodle assets");
assert.ok(existsSync(new URL("../assets/img/favicon.svg", import.meta.url)), "Approved PRAVI favicon missing");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.ok(sitemapUrls.length >= 30, "Production sitemap is missing public routes/tools");
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "Sitemap contains duplicate URLs");
assert.ok(sitemapUrls.every(url => url.startsWith("https://catusharjain9.github.io/Pravi-Website/")), "Sitemap contains an unverified or off-site URL");
assert.ok(!sitemap.includes("privacy.html"), "Draft privacy notice must not be indexed");
assert.ok(robots.includes("Sitemap: https://catusharjain9.github.io/Pravi-Website/sitemap.xml"), "robots.txt sitemap directive missing");
assert.ok(app.includes('robots:"noindex,follow"'), "Draft privacy route must be noindex");
assert.equal(packageJson.scripts["test:react-migration"], "node scripts/test-react-migration.mjs");

assert.ok(gstPage.includes("cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"), "GST reconciliation must use the patched official SheetJS build");
assert.ok(!gstPage.includes("xlsx@0.18.5"), "Vulnerable npm SheetJS version must not remain");
assert.ok(depreciationSource.includes("import './csv-safety.js'") && depreciationSource.includes("window.PraviCSV.cell(v)"), "Depreciation CSV exports must use shared formula-neutralising CSV utility");
assert.ok(complianceSource.includes("Reference frequency:") && complianceSource.includes("localStorage"), "Compliance tracker must disclose manual recurrence and browser-local persistence");
console.log("React routes, approved PRAVI lock-up, founder-first homepage, 9 tools, sitemap and privacy indexing checks passed.");
