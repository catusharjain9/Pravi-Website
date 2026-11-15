import { cpSync, copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "dist");
mkdirSync(out, { recursive: true });

// Keep every not-yet-migrated public route available during the staged React rollout.
for (const name of readdirSync(root)) {
  if (name.endsWith(".html") && name !== "index.html") {
    copyFileSync(join(root, name), join(out, name));
  }
}

for (const dir of ["assets"]) {
  const from = join(root, dir);
  if (existsSync(from)) cpSync(from, join(out, dir), { recursive: true });
}

for (const file of ["robots.txt", "sitemap.xml", "firebase-config.js"]) {
  const from = join(root, file);
  if (existsSync(from)) copyFileSync(from, join(out, file));
}

console.log("Staged legacy HTML routes and static assets into dist.");
