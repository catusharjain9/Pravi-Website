import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const app = read("../src/App.jsx");
const tools = read("../tools.html");
const packageJson = JSON.parse(read("../package.json"));
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
assert.ok(app.includes('assets/img/pravi-logo.svg'), "Approved PRAVI logo asset reference missing");
assert.equal(packageJson.scripts["test:react-migration"], "node scripts/test-react-migration.mjs");
console.log("React route, PRAVI brand/footer and 9-tool preservation checks passed.");
