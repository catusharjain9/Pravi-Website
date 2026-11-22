import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const dist = path.resolve("dist");
const origin = (process.env.VITE_SITE_ORIGIN || "https://catusharjain9.github.io").trim();
const basePath = (process.env.VITE_BASE_PATH || "/Pravi-Website/").trim();
const previewOrigin = "http://127.0.0.1:4173";
const previewBase = new URL(basePath, previewOrigin).href;
const publicBase = new URL(basePath, origin).href;
const routes = [
  "/", "about.html", "services.html", "virtual-cfo.html", "startup-support.html",
  "direct-tax.html", "gst-compliance.html", "accounting-mis.html", "business-advisory.html",
  "resources.html", "insights.html", "contact.html", "privacy.html",
  "guide-startup-compliance.html", "guide-virtual-cfo.html", "guide-gst-reconciliation.html",
  "guide-monthly-mis.html", "article-13-week-cashflow.html",
  "article-first-90-days-accounting.html", "article-gst-purchase-reconciliation.html",
  "article-monthly-mis-review.html"
];

if (!fs.existsSync(path.join(dist, "index.html"))) throw new Error("dist/index.html is missing.");
const server = spawn(process.execPath, [
  path.resolve("node_modules/vite/bin/vite.js"), "preview",
  "--host", "127.0.0.1", "--port", "4173", "--strictPort"
], { stdio: "ignore", env: process.env });

let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) throw new Error("Vite preview exited before prerender server readiness.");
    try {
      const response = await fetch(previewBase);
      if (response.ok) { ready = true; break; }
    } catch { /* wait for preview server */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error("Timed out waiting for Vite preview.");

  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const route of routes) {
    const target = route === "/" ? previewBase : new URL(route, previewBase).href;
    const response = await page.goto(target, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (!response || !response.ok()) throw new Error(`Prerender failed for ${route}: HTTP ${response?.status() ?? "no response"}`);
    await page.locator("#main-content h1").first().waitFor({ state: "visible", timeout: 15000 });
    await page.waitForFunction(() => Boolean(
      document.title.trim() &&
      document.querySelector('meta[name="description"]')?.content?.trim() &&
      document.querySelector('link[rel="canonical"]')?.href
    ), null, { timeout: 10000 });

    const publicUrl = route === "/" ? publicBase : new URL(route, publicBase).href;
    const html = await page.evaluate(({ publicUrl, publicBase }) => {
      const setMeta = (selector, kind, key, value) => {
        let node = document.head.querySelector(selector);
        if (!node) {
          node = document.createElement("meta");
          node.setAttribute(kind, key);
          document.head.appendChild(node);
        }
        node.setAttribute("content", value);
      };
      let canonical = document.head.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = publicUrl;
      setMeta('meta[property="og:url"]', "property", "og:url", publicUrl);
      setMeta('meta[property="og:image"]', "property", "og:image", new URL("assets/img/social-card.svg", publicBase).href);
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", new URL("assets/img/social-card.svg", publicBase).href);
      return "<!doctype html>\\n" + document.documentElement.outerHTML + "\\n";
    }, { publicUrl, publicBase });

    const output = path.join(dist, route === "/" ? "index.html" : route);
    fs.writeFileSync(output, html, "utf8");
    console.log(`Prerendered ${route}`);
  }
  console.log(`Prerender completed for ${routes.length} React routes.`);
} finally {
  if (browser) await browser.close();
  server.kill("SIGTERM");
}
