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
      if (route !== "/") await expect(page.locator(".pr-page-hero-panel")).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /Pravi-Website/);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toContain(route === "/" ? "/Pravi-Website/" : route);
    });
  }
});


test.describe("Approved PRAVI identity and founder-first homepage", () => {
  test("header and footer use the exact approved full logo artwork", async ({ page }) => {
    await page.goto("./");
    const headerLogo = page.locator("header .brand img");
    await expect(headerLogo).toHaveAttribute("src", /pravi-approved-lockup\.webp/);
    await expect.poll(() => headerLogo.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    const footerLogo = page.locator("footer .brand-full img");
    await expect(footerLogo).toHaveAttribute("src", /pravi-approved-lockup\.webp/);
    await expect.poll(() => footerLogo.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  });

  test("homepage presents the finance and compliance control panel without decorative doodles", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByRole("heading", { name: "Build the business. Stay in control." })).toBeVisible();
    await expect(page.locator(".pr-finance-board")).toBeVisible();
    await expect(page.locator(".pr-chart-svg")).toBeVisible();
    await expect(page.locator(".pr-board-metric")).toHaveCount(2);
    await expect(page.locator(".finance-doodle-scene, .service-card-doodle, .closing-doodle")).toHaveCount(0);
    await page.goto("resources.html");
    await expect(page.locator(".pr-page-hero-panel")).toBeVisible();
    await expect(page.locator(".pr-page-panel-row")).toHaveCount(3);
    await expect(page.locator(".pr-resource-card")).toHaveCount(8);
    await expect(page.locator(".pr-resource-card img")).toHaveCount(0);
    await expect(page.locator(".resource-card-react")).toHaveCount(8);
  });

  test("inner pages use information-led panels and contain no decorative doodle assets", async ({ page }) => {
    for (const route of ["about.html","services.html","startup-support.html","virtual-cfo.html","gst-compliance.html","resources.html","insights.html","contact.html"]) {
      await page.goto(route);
      await expect(page.locator(".pr-page-hero-panel")).toBeVisible();
      await expect(page.locator(".page-hero-art, .story-visual img, .resource-card-react img")).toHaveCount(0);
    }
  });

  test("homepage does not show a blocking logo splash", async ({ page }) => {
    await page.goto("./");
    await expect(page.locator(".logo-intro-react")).toHaveCount(0);
    await expect(page.locator("header .brand img")).toBeVisible();
  });
});

test.describe("PRAVI motion and accessibility", () => {
  test("reduced-motion preference keeps the dashboard readable", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("./");
    await expect(page.locator(".pr-finance-board")).toBeVisible();
    await expect(page.locator(".pr-chart-svg")).toBeVisible();
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

  for (const route of ["./", "resources.html", "contact.html", "tools.html"]) {
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

  test("legacy tools use the warm ivory and butter-yellow visual system", async ({ page }) => {
    await page.goto("tools.html");
    const bodyBackground = await page.locator("body").evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bodyBackground).toBe("rgb(255, 251, 243)");
    const heroBackground = await page.locator(".hero-tools").evaluate(el => getComputedStyle(el).backgroundColor);
    expect(heroBackground).toBe("rgb(255, 240, 200)");
    await expect(page.locator(".tool-card").first()).toBeVisible();
  });

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
    "depreciation-calculator.html", "depreciation-register.html", "currency-converter.html",
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
      await expect(page.locator(".pravi-intro")).toHaveCount(0);
      const hiddenLegacyArt = await page.locator(".pravi-doodle-scene, .doodle-corner, .doodle-card-mark").evaluateAll(nodes => nodes.every(node => getComputedStyle(node).display === "none"));
      expect(hiddenLegacyArt).toBe(true);
    });
  }

  test("retained tool pages use the approved logo and current PRAVI navigation", async ({ page }) => {
    await page.goto("tools.html");
    const headerBrand = page.locator("header.site-header .brand").first();
    const headerLogo = headerBrand.locator("img");
    await expect(headerBrand).toHaveAttribute("href", "./");
    await expect(headerLogo).toHaveAttribute("src", /pravi-approved-lockup\.webp/);
    await expect.poll(() => headerLogo.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    const footerLogo = page.locator("footer.site-footer .footer-brand .brand img");
    await expect(footerLogo).toHaveAttribute("src", /pravi-approved-lockup\.webp/);
    await expect.poll(() => footerLogo.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(page.locator("header.site-header .primary-nav .nav-link")).toHaveText(["About", "Services", "Tools", "Resources", "Insights"]);
    await expect(page.locator("header.site-header .nav-actions a")).toContainText("Get in touch");
    await headerBrand.click();
    await expect(page).toHaveURL(/\/Pravi-Website\/$/);
    await expect(page.getByRole("heading", { name: "Build the business. Stay in control." })).toBeVisible();
  });
});
