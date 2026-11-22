import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const base = "https://catusharjain9.github.io/Pravi-Website/";
const routes = [
  "/", "about.html", "services.html", "virtual-cfo.html", "startup-support.html",
  "direct-tax.html", "gst-compliance.html", "accounting-mis.html", "business-advisory.html",
  "resources.html", "insights.html", "contact.html", "privacy.html",
  "guide-startup-compliance.html", "guide-virtual-cfo.html", "guide-gst-reconciliation.html",
  "guide-monthly-mis.html", "article-13-week-cashflow.html",
  "article-first-90-days-accounting.html", "article-gst-purchase-reconciliation.html",
  "article-monthly-mis-review.html"
];

for (const route of routes) {
  const file = path.join(dist, route === "/" ? "index.html" : route);
  assert.ok(fs.existsSync(file), `Missing prerendered route: ${route}`);
  const html = fs.readFileSync(file, "utf8");
  assert.match(html, /<title>[^<]{10,}<\\/title>/i, `Missing page title: ${route}`);
  assert.match(html, /<main[^>]*>[\\s\\S]*?<h1[ >]/i, `Missing static H1 content: ${route}`);
  assert.match(html, /<meta[^>]+name="description"[^>]+content="[^"]{20,}"/i, `Missing description: ${route}`);
  assert.match(html, /<meta[^>]+property="og:image"[^>]+content="https:\\/\\//i, `Missing social image: ${route}`);
  assert.match(html, /<meta[^>]+name="twitter:card"[^>]+content="summary_large_image"/i, `Missing Twitter card: ${route}`);
  const expected = route === "/" ? base : new URL(route, base).href;
  assert.ok(html.includes(`href="${expected}"`), `Incorrect canonical URL for ${route}`);
}
const privacy = fs.readFileSync(path.join(dist, "privacy.html"), "utf8");
assert.match(privacy, /name="robots"[^>]+content="noindex,follow"/i, "Privacy draft must remain noindex");
const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\\/loc>/g)].map((match) => match[1]);
assert.ok(urls.length >= 29, "Sitemap is missing expected public routes/tools");
assert.equal(new Set(urls).size, urls.length, "Sitemap contains duplicate URLs");
assert.ok(urls.every((url) => url.startsWith(base)), "Sitemap contains an off-site URL");
assert.ok(!sitemap.includes("privacy.html") && !sitemap.includes("admin.html"), "Private/draft pages must not be indexed");
const robots = fs.readFileSync(path.join(dist, "robots.txt"), "utf8");
assert.ok(robots.includes(`Sitemap: ${new URL("sitemap.xml", base).href}`), "robots.txt sitemap directive is missing");
console.log(`SEO prerender checks passed: ${routes.length} static React pages and ${urls.length} public sitemap URLs.`);
