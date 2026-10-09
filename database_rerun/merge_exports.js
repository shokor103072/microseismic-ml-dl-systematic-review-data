// Merge database exports (CSV or RIS) and list records not already screened in this review.
// Usage: node merge_exports.js export1.csv export2.ris ...
// Output: new_candidates.csv (records whose DOI and normalised title are not among the screened or Corpus B records).
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'data');
function parseCSV(text) {
  const rows = []; let row = [], f = '', q = false;
  const sep = (text.split('\n')[0].match(/\t/g) || []).length > (text.split('\n')[0].match(/,/g) || []).length ? '\t' : ',';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === sep) { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f.length || row.length) { row.push(f); rows.push(row); }
  const [h, ...rest] = rows.filter(r => r.length > 1);
  return rest.map(r => Object.fromEntries(h.map((k, i) => [k.replace(/^﻿/, '').trim(), (r[i] || '').trim()])));
}
function parseRIS(text) {
  const recs = []; let cur = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z][A-Z0-9])  - ?(.*)$/); if (!m) continue;
    const [, tag, val] = m;
    if (tag === 'ER') { recs.push(cur); cur = {}; continue; }
    if (tag === 'TI' || tag === 'T1') cur.title = (cur.title ? cur.title + ' ' : '') + val;
    if (tag === 'DO') cur.doi = val;
    if (tag === 'PY' || tag === 'Y1') cur.year = (val.match(/\d{4}/) || [''])[0];
    if (tag === 'JO' || tag === 'T2' || tag === 'JF') cur.venue = cur.venue || val;
    if (tag === 'AB') cur.abstract = val;
  }
  return recs;
}
const pick = (r, keys) => { for (const k of keys) { const hit = Object.keys(r).find(x => x.toLowerCase() === k.toLowerCase()); if (hit && r[hit]) return r[hit]; } return ''; };
const normDoi = d => String(d || '').toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, '').trim();
const normTitle = t => String(t || '').toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
// already screened: OpenAlex screening set and the original Corpus B master table
const seenDoi = new Set(), seenTitle = new Set();
const scr = parseCSV(fs.readFileSync(path.join(DATA, 'screening_decisions_794.csv'), 'utf8'));
scr.forEach(r => { if (r.doi) seenDoi.add(normDoi(r.doi)); seenTitle.add(normTitle(r.title)); });
const mt = parseCSV(fs.readFileSync(path.join(DATA, 'master_table_S1A_publication_dataset_2026.csv'), 'utf8'));
mt.forEach(r => { if (/^10\./.test(r.DOI || '')) seenDoi.add(normDoi(r.DOI)); seenTitle.add(normTitle(r.Title)); });
const all = [];
for (const f of process.argv.slice(2)) {
  const text = fs.readFileSync(f, 'utf8');
  const recs = /\.ris$/i.test(f) ? parseRIS(text) : parseCSV(text).map(r => ({
    title: pick(r, ['Title', 'Article Title', 'TI', 'Document Title']), doi: pick(r, ['DOI', 'DI']),
    year: pick(r, ['Year', 'PY', 'Publication Year']), venue: pick(r, ['Source title', 'Source Title', 'SO', 'Publication Title']),
    abstract: pick(r, ['Abstract', 'AB']),
  }));
  recs.forEach(r => all.push({ ...r, source_file: path.basename(f) }));
}
const out = [], dup = new Set();
for (const r of all) {
  const d = normDoi(r.doi), t = normTitle(r.title);
  if (!t) continue;
  const k = d || t; if (dup.has(k)) continue; dup.add(k);
  if ((d && seenDoi.has(d)) || seenTitle.has(t)) continue;
  out.push(r);
}
const q = v => { const s = String(v ?? ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const cols = ['title', 'doi', 'year', 'venue', 'source_file', 'abstract'];
fs.writeFileSync(path.join(__dirname, 'new_candidates.csv'), [cols.join(','), ...out.map(r => cols.map(c => q(r[c])).join(','))].join('\n') + '\n');
console.log('records read', all.length, '| unique', dup.size, '| not yet screened', out.length, '-> new_candidates.csv');
