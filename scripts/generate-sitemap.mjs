import fs from 'node:fs';
import path from 'node:path';
const domain=(process.argv[2]||'').trim().replace(/\/$/,'');
if(!/^https:\/\/[^\s/]+$/.test(domain)){console.error('Usage: npm run sitemap -- https://your-verified-domain.example');process.exit(2);}
const root=process.cwd();
const excluded=new Set(['admin.html','article.html','404.html','privacy.html']);
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html')&&!excluded.has(f)).sort();
for(const file of files){
 const full=path.join(root,file);let html=fs.readFileSync(full,'utf8');
 const canonical=`<link rel="canonical" href="${domain}/${file==='index.html'?'':file}">`;
 if(/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) html=html.replace(/<link\s+rel=["']canonical["'][^>]*>/i,canonical);
 else if(/<\/head>/i.test(html)) html=html.replace(/<\/head>/i,`  ${canonical}\n</head>`);
 fs.writeFileSync(full,html);
}
const urls=files.map(f=>`  <url><loc>${domain}/${f==='index.html'?'':f}</loc></url>`).join('\n');
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
fs.writeFileSync(path.join(root,'sitemap.xml'),xml);
const robots=`User-agent: *\nAllow: /\nSitemap: ${domain}/sitemap.xml\n`;
fs.writeFileSync(path.join(root,'robots.txt'),robots);
console.log(`Generated canonical tags for ${files.length} public HTML pages, sitemap.xml and robots.txt for ${domain}. Verify every URL and the domain before publishing.`);
