import { test, expect } from "@playwright/test";

const reactRoutes = [
  "/", "about.html", "services.html", "virtual-cfo.html", "startup-support.html",
  "direct-tax.html", "gst-compliance.html", "accounting-mis.html", "business-advisory.html",
  "resources.html", "insights.html", "contact.html", "privacy.html",
  "guide-startup-compliance.html", "guide-virtual-cfo.html", "guide-gst-reconciliation.html",
  "guide-monthly-mis.html", "article-13-week-cashflow.html",
  "article-first-90-days-accounting.html", "article-gst-purchase-reconciliation.html",
  "article-monthly-mis-review.html"
];

test.describe("React public routes", () => {
  for (const route of reactRoutes) {
    test(`renders ${route}`, async ({ page }) => {
      await page.goto(route === "/" ? "./" : route);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("main h1").first()).not.toBeEmpty();
      if (route !== "/") await expect(page).not.toHaveTitle("PRAVI Business Advisors LLP | Startup Finance & Virtual CFO");
      if (route === "privacy.html") await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
      const title = await page.title();
      expect(title.length).toBeGreaterThan(15);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /Pravi-Website/);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toContain(route === "/" ? "/Pravi-Website/" : route);
    });
  }
});

test.describe("PRAVI motion and accessibility", () => {
  test("logo intro appears and clears after refresh", async ({ page }) => {
    await page.goto("./");
    const intro = page.locator(".logo-intro-react");
    await expect(intro).toBeVisible();
    await expect(intro).toHaveCount(0, { timeout: 3000 });
  });

  test("reduced-motion preference suppresses the logo intro", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("./");
    await expect(page.locator(".logo-intro-react")).toHaveCount(0);
  });
});

test.describe("Responsive mobile behaviour", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("mobile navigation opens and closes", async ({ page }) => {
    await page.goto("./");
    const menu = page.getByRole("button", { name: "Toggle navigation" });
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(page.locator("nav.nav.open")).toBeVisible();
    await expect(page.locator("nav.nav.open a").first()).toBeVisible();
    await menu.click();
    await expect(page.locator("nav.nav.open")).toHaveCount(0);
  });

  for (const route of ["./", "resources.html", "contact.html"]) {
    test(`no horizontal overflow on ${route}`, async ({ page }) => {
      await page.goto(route === "/" ? "./" : route);
      const metrics = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
      }));
      expect(metrics.document, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.viewport + 1);
      expect(metrics.body, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.viewport + 1);
    });
  }

  test("resource cards stack in one column", async ({ page }) => {
    await page.goto("resources.html");
    const columns = await page.locator(".editorial-grid-react").first().evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
    expect(columns).toBe(1);
  });

  test("contact form fits mobile width and retains explicit consent", async ({ page }) => {
    await page.goto("contact.html");
    const form = page.locator(".contact-form-react");
    await expect(form).toBeVisible();
    const rect = await form.boundingBox();
    expect(rect.x + rect.width).toBeLessThanOrEqual(376);
    await expect(form.locator('input[type="checkbox"][required]')).toHaveCount(1);
    await expect(form.locator('button[type="submit"]')).toContainText("Continue to WhatsApp");
  });
});

test.describe("Legacy tools remain reachable", () => {
  const tools = [
    "tools.html", "gst-reconciliation.html", "tax-calculators.html",
    "depreciation-calculator.html", "currency-converter.html",
    "cashflow-planner.html", "mis-generator.html", "compliance-tracker.html", "pdf-tools.html"
  ];
  for (const route of tools) {
    test(`loads preserved tool ${route}`, async ({ page }) => {
      await page.goto(route === "/" ? "./" : route);
      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator("body")).not.toBeEmpty();
      await expect(page.locator('link[href*="pravi-yellow-system.css"]')).toHaveCount(1);
      const footerColor = await page.locator(".site-footer").evaluate(el => getComputedStyle(el).backgroundColor);
      expect(footerColor).toBe("rgb(255, 251, 237)");
    });
  }
});
