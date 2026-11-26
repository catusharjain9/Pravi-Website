import { test, expect } from "@playwright/test";

const reactRoutes = [
  "/", "about.html", "services.html", "virtual-cfo.html", "startup-support.html",
  "direct-tax.html", "gst-compliance.html", "accounting-mis.html", "business-advisory.html",
  "resources.html", "insights.html", "contact.html", "privacy.html", "who-we-help.html",
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
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp("/Pravi-Website/"));
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toContain(route === "/" ? "/Pravi-Website/" : route);
    });
  }
});


test("legacy index.html URL redirects to the canonical homepage", async ({ page }) => {
  await page.goto("index.html");
  await expect(page.getByRole("heading", { name: "Build the business. Stay in control." })).toBeVisible();
  await expect(page).toHaveURL(new RegExp("/Pravi-Website/?$"));
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp("/Pravi-Website/$"));
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

  test("founder journey tabs update the stage panel and support keyboard navigation", async ({ page }) => {
    await page.goto("./");
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(".site-scroll-progress")).toHaveCount(1);

    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Turn records into a useful view.");
    await expect(page.getByRole("tabpanel")).toContainText("13-week cash-flow view");

    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Give growth a stronger operating base.");
    await expect(page.getByRole("tabpanel").getByRole("link")).toContainText("Explore business advisory");

    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(1)).toBeFocused();
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
    const menu = page.locator("button.menu");
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAccessibleName("Open navigation");
    await expect(menu).toHaveAttribute("aria-controls", "main-navigation");
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toHaveAccessibleName("Close navigation");
    await expect(page.locator("nav.nav.open")).toBeVisible();
    await expect(page.locator("nav.nav.open a").first()).toBeVisible();
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
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

  test("privacy information remains visibly marked as a draft and excluded from indexing", async ({ page }) => {
    await page.goto("privacy.html");
    await expect(page).toHaveTitle(/Privacy Information \(Draft\)/);
    await expect(page.getByRole("heading", { name: "Website privacy information — publication review pending." })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
    await expect(page.locator(".privacy-status-react")).toContainText("Draft — not approved for publication");
    await expect(page.locator("footer .footer-editorial-bottom a")).toContainText("Privacy information (draft)");
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

  
  test("Office Print entry point redirects using the latest published tunnel URL", async ({ page }) => {
    await page.route("https://raw.githubusercontent.com/catusharjain9/Pravi-Website/office-print-state/office-print-url.json?*", route =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ url: "https://pravi-smoke-test.trycloudflare.com", updated_utc: "2026-11-26T00:00:00Z" }) })
    );
    await page.route("https://pravi-smoke-test.trycloudflare.com/login", route =>
      route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Office Print Portal test target</title><h1>Portal test</h1>" })
    );
    await page.goto("office-print.html");
    await expect(page).toHaveURL("https://pravi-smoke-test.trycloudflare.com/login");
    await expect(page).toHaveTitle("Office Print Portal test target");
  });


  test("Office Print page explains when the office PC has not published a tunnel", async ({ page }) => {
    await page.route("https://raw.githubusercontent.com/catusharjain9/Pravi-Website/office-print-state/office-print-url.json?*", route =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ url: "", status: "connecting", updated_utc: null }) })
    );
    await page.goto("office-print.html");
    await expect(page.locator("#status")).toContainText("office printer connection is not currently published");
    await expect(page.locator("#retry")).toBeVisible();
    await expect(page).toHaveURL(/office-print\.html$/);
  });

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
    await expect(page.locator("header.site-header .primary-nav .nav-link")).toHaveText(["About", "Services", "Who we help", "Tools", "Resources", "Insights", "Office Print ↗"]);
    await expect(page.locator('header.site-header .primary-nav a[href$="office-print.html"]')).toHaveAttribute("target", "_blank");
    await expect(page.locator("header.site-header .nav-actions a")).toContainText("Get in touch");
    await headerBrand.click();
  await expect(page).toHaveURL(new RegExp("/Pravi-Website/?$"));
    await expect(page.getByRole("heading", { name: "Build the business. Stay in control." })).toBeVisible();
  });
});


test("finance setup selector updates its pressure points and support pathway", async ({ page }) => {
  await page.goto("./");
  const section = page.locator(".pr-finance-fit");
  await expect(section).toBeVisible();
  await expect(section.getByRole("heading", { name: "How is finance managed in your business today?" })).toBeVisible();
  const choices = section.getByRole("radio");
  await expect(choices).toHaveCount(4);
  await expect(section.getByRole("radio", { name: /Founder-led/ })).toBeChecked();

  await section.getByText("One person handles the day-to-day work", { exact: true }).click();
  await expect(section.getByRole("radio", { name: /In-house accountant/ })).toBeChecked();
  await expect(section.locator(".pr-finance-fit-result")).toContainText("A review layer protects continuity and quality.");
  await expect(section.locator(".pr-finance-fit-result")).toContainText("month-end checklist");

  await section.getByText("Year-end work and filings are handled externally", { exact: true }).click();
  await expect(section.locator(".pr-finance-fit-result")).toContainText("Year-end compliance and monthly management serve different needs.");
  await expect(section.locator(".pr-finance-fit-result")).toContainText("existing professional relationship");
});


test("sector pathways tailor review themes and connect to relevant PRAVI services", async ({ page }) => {
  await page.goto("./");
  const preview = page.locator(".pr-sector-preview");
  await expect(preview).toBeVisible();
  await expect(preview.locator(".pr-sector-preview-card")).toHaveCount(4);
  await preview.getByRole("link", { name: /Manufacturing & processing/ }).click();
  await expect(page).toHaveURL(/who-we-help\.html\?sector=manufacturing/);

  const section = page.locator(".sector-pathways-react");
  const choices = section.getByRole("radio");
  await expect(choices).toHaveCount(4);
  await expect(section.getByRole("radio", { name: "Manufacturing & processing" })).toBeChecked();
  await expect(section.getByRole("heading", { name: "Understand what is moving through production—and what it costs." })).toBeVisible();
  await expect(section.locator(".sector-detail-grid")).toContainText("inventory");
  await expect(section.getByRole("link", { name: /GST compliance/ })).toBeVisible();

  await section.getByRole("radio", { name: "Trading, distribution & D2C" }).check();
  await expect(section.getByRole("heading", { name: "Link product movement, channel economics and cash conversion." })).toBeVisible();
  await expect(section.locator(".sector-detail-grid")).toContainText("marketplace");
  await expect(section.locator(".sector-detail-note")).toContainText("not client case studies");

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(section).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
