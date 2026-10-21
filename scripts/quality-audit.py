#!/usr/bin/env python3
"""Dependency-free structural checks for the PRAVI static website package."""
from pathlib import Path
from html.parser import HTMLParser
import re, sys
ROOT=Path(__file__).resolve().parents[1]
class Scan(HTMLParser):
 def __init__(self): super().__init__(); self.ids=[]; self.refs=[]; self.title=False; self.title_text=''; self.h1=0; self.desc=False; self.lang=False; self.scripts=[]; self.images=[]; self.blank_links=[]
 def handle_starttag(self,t,a):
  d=dict(a)
  if d.get('id'): self.ids.append(d['id'])
  if t=='img': self.images.append(d)
  if t=='a' and d.get('target')=='_blank': self.blank_links.append(d)
  if t in ('a','img','script','link','source'): 
   for k in ('href','src'): 
    if d.get(k): self.refs.append((t,k,d[k]))
  if t=='title': self.title=True
  if t=='h1': self.h1+=1
  if t=='html' and d.get('lang'): self.lang=True
  if t=='meta' and d.get('name')=='description' and d.get('content'): self.desc=True
 def handle_endtag(self,t):
  if t=='title': self.title=False
 def handle_data(self,d):
  if self.title: self.title_text+=d
errors=[]; warnings=[]; pages=list(ROOT.glob('*.html'))
for page in pages:
 s=Scan(); text=page.read_text(encoding='utf-8'); s.feed(text)
 dup=sorted({x for x in s.ids if s.ids.count(x)>1})
 if dup: errors.append(f'{page.name}: duplicate IDs {dup}')
 if not s.lang: errors.append(f'{page.name}: missing html lang')
 if not s.title_text.strip(): errors.append(f'{page.name}: missing title')
 if page.name not in ('admin.html','article.html','404.html') and not s.desc: warnings.append(f'{page.name}: missing meta description')
 if page.name not in ('admin.html','article.html','404.html') and s.h1!=1: warnings.append(f'{page.name}: expected one H1, found {s.h1}')
 for image in s.images:
  if 'alt' not in image: warnings.append(f'{page.name}: image missing alt attribute')
 for link in s.blank_links:
  rel=set((link.get('rel') or '').lower().split())
  if not {'noopener','noreferrer'} <= rel: warnings.append(f'{page.name}: target=_blank link missing rel=noopener noreferrer')
 for tag,attr,ref in s.refs:
  if ref.startswith(('http://','https://','mailto:','tel:','data:','#','javascript:')): continue
  ref=ref.split('#')[0].split('?')[0]
  if not ref: continue
  target=(page.parent/ref).resolve()
  if not target.exists(): errors.append(f'{page.name}: missing local {attr} target {ref}')
print(f'Checked {len(pages)} HTML pages.')
print(f'Errors: {len(errors)} | Warnings: {len(warnings)}')
for e in errors: print('ERROR:',e)
for w in warnings: print('WARN:',w)
if errors: sys.exit(1)
