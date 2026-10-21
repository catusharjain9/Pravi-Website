import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html'));
const hashes = new Set();
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  for (const match of html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    hashes.add(`'sha256-${crypto.createHash('sha256').update(match[1], 'utf8').digest('base64')}'`);
  }
}
const configs = [
  ['firebase.json', JSON.parse(fs.readFileSync(path.join(root, 'firebase.json'), 'utf8')).hosting.headers.flatMap(h => h.headers).find(h => h.key.toLowerCase() === 'content-security-policy')?.value || ''],
  ['_headers', fs.readFileSync(path.join(root, '_headers'), 'utf8')],
  ['.htaccess', fs.readFileSync(path.join(root, '.htaccess'), 'utf8')]
];
const missing = [];
for (const [name, content] of configs) {
  for (const hash of hashes) if (!content.includes(hash)) missing.push(`${name}: missing ${hash}`);
}
if (missing.length) {
  console.error(missing.join('\n'));
  process.exit(1);
}
console.log(`CSP hash test passed: ${hashes.size} inline JSON-LD block hashes are present in all ${configs.length} hosting policies.`);
