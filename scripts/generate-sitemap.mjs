import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const originInput = (process.env.VITE_SITE_ORIGIN || "https://catusharjain9.github.io").trim();
const basePathInput = (process.env.VITE_BASE_PATH || "/Pravi-Website/").trim();
let origin;
try {
  const parsed = new URL(originInput);
  if (parsed.protocol !== "https:" || parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error("VITE_SITE_ORIGIN must be an HTTPS origin without a path, query or fragment.");
  }
  origin = parsed.origin;
} catch (error) {
  console.error(error.message || error);
  process.exit(2);
}
if (!basePathInput.startsWith("/") || !basePathInput.endsWith("/") || basePathInput.includes("..") || basePathInput.includes("?") || basePathInput.includes("#")) {
  console.error("VITE_BASE_PATH must be a clean absolute path that starts and ends with '/'.");
  process.exit(2);
}
if (!fs.existsSync(dist)) {
  console.error("Build output not found. Run 'npm run build' first.");
  process.exit(2);
}

const siteRoot = new URL(basePathInput, origin);
const excluded = new Set(["404.html", "admin.html", "article.html", "privacy.html"]);
const files = fs.readdirSync(dist)
  .filter((file) => file.endsWith(".html") && !excluded.has(file))
  .sort((a, b) => a === "index.html" ? -1 : b === "index.html" ? 1 : a.localeCompare(b));
const socialImage = new URL("assets/img/social-card.svg", siteRoot).href;
const canonicalFor = (file) => new URL(file === "index.html" ? "" : file, siteRoot).href;
const replaceOrInsertHeadTag = (html, pattern, tag) => {
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace(/<\/head>/i, "  " + tag + "\n</head>");
};
for (const file of files) {
  const filePath = path.join(dist, file);
  let html = fs.readFileSync(filePath, "utf8");
  html = replaceOrInsertHeadTag(
    html,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    '<link rel="canonical" href="' + canonicalFor(file) + '"/>'
  );
  const tags = [
    [/<meta\b(?=[^>]*property=["']og:url["'])[^>]*>/i, '<meta property="og:url" content="' + canonicalFor(file) + '"/>'],
    [/<meta\b(?=[^>]*property=["']og:image["'])[^>]*>/i, '<meta property="og:image" content="' + socialImage + '"/>'],
    [/<meta\b(?=[^>]*property=["']og:image:alt["'])[^>]*>/i, '<meta property="og:image:alt" content="PRAVI Business Advisors LLP — finance, compliance and business advisory"/>'],
    [/<meta\b(?=[^>]*name=["']twitter:card["'])[^>]*>/i, '<meta name="twitter:card" content="summary_large_image"/>'],
    [/<meta\b(?=[^>]*name=["']twitter:image["'])[^>]*>/i, '<meta name="twitter:image" content="' + socialImage + '"/>']
  ];
  for (const [pattern, tag] of tags) html = replaceOrInsertHeadTag(html, pattern, tag);
  fs.writeFileSync(filePath, html, "utf8");
}
const urls = files.map(canonicalFor);
if (new Set(urls).size !== urls.length) throw new Error("Duplicate canonical URLs detected while generating the sitemap.");
const xmlEscape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const entries = urls.map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`).join("\n");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), xml, "utf8");
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${new URL("sitemap.xml", siteRoot).href}\n`, "utf8");
console.log(`Generated ${urls.length} public sitemap URLs in dist. Draft privacy and admin pages are excluded; no invented last-modified dates are emitted.`);
