// Agreement between reviewer 1 (key files) and reviewer 2 (filled blinded files).
// Usage: node agreement.js
// Prints percentage agreement and Cohen's kappa (with a 95% percentile bootstrap CI, 2,000 resamples, fixed seed)
// for screening decisions, evidence-map codes and evidence-matrix items, and pooled agreement across all coded items.
const fs = require('fs');
const path = require('path');
const D = process.argv[2] || require('path').join(__dirname, '..', 'second_reviewer');
function parseCSV(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f.length || row.length) { row.push(f); rows.push(row); }
  const [h, ...rest] = rows.filter(r => r.length > 1);
  return rest.map(r => Object.fromEntries(h.map((k, i) => [k.trim(), (r[i] || '').trim()])));
}
const read = f => parseCSV(fs.readFileSync(path.join(D, f), 'utf8'));
function kappaRaw(pairs) {
  const n = pairs.length;
  const cats = [...new Set(pairs.flat())];
  const po = pairs.filter(([a, b]) => a === b).length / n;
  const pe = cats.reduce((s, c) => s + (pairs.filter(p => p[0] === c).length / n) * (pairs.filter(p => p[1] === c).length / n), 0);
  return { po, k: pe === 1 ? 1 : (po - pe) / (1 - pe) };
}
let seed = 20260928;
const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
function kappa(pairs, B = 2000) {
  const n = pairs.length; if (!n) return null;
  const { po, k } = kappaRaw(pairs);
  const ks = [];
  for (let b = 0; b < B; b++) ks.push(kappaRaw(Array.from({ length: n }, () => pairs[Math.floor(rand() * n)])).k);
  ks.sort((x, y) => x - y);
  return { n, agreement: +(100 * po).toFixed(1), kappa: +k.toFixed(3), kappa_ci95: [+ks[Math.floor(0.025 * B)].toFixed(3), +ks[Math.ceil(0.975 * B) - 1].toFixed(3)] };
}
const pooled = [];
const norm = v => String(v || '').toLowerCase().replace(/\s+/g, ' ').split(';').map(x => x.trim()).filter(Boolean).sort().join('; ');
// screening: collapse to include / exclude, and full code
const k1 = read('screening_sample_KEY_do_not_open_before_coding.csv'), s2 = read('screening_sample_blinded.csv');
const sp = k1.map(k => [k.reviewer1_decision, (s2.find(r => r.record_id === k.record_id) || {}).reviewer2_decision]).filter(([, b]) => b);
console.log('Screening, full decision codes:', JSON.stringify(kappa(sp)));
console.log('Screening, include vs exclude:', JSON.stringify(kappa(sp.map(([a, b]) => [a === 'I' ? 'I' : 'X', b === 'I' ? 'I' : 'X']))));
// evidence-map codes
const ck = read('coding_sample_KEY_do_not_open_before_coding.csv'), c2 = read('coding_sample_blinded.csv');
for (const f of ['sensing', 'setting', 'tasks', 'model_families', 'learning_regimes', 'cross_site_test', 'realtime_claim']) {
  // a study counts as coded when any r2_ field is filled; a blank field then means 'none' (e.g. no learning regime)
  const coded = r => r && Object.keys(r).some(c => c.startsWith('r2_') && r[c]);
  const pairs = ck.map(k => [k, c2.find(r => r.study_id === k.study_id)]).filter(([, r]) => coded(r)).map(([k, r]) => [norm(k['r1_' + f]), norm(r['r2_' + f])]);
  pooled.push(...pairs);
  console.log('Evidence map, ' + f + ':', JSON.stringify(kappa(pairs)));
}
// evidence matrix
const mk = read('evidence_matrix_KEY_do_not_open_before_coding.csv'), m2 = read('evidence_matrix_sheet_blinded.csv');
for (const it of ['I1', 'I2', 'R1', 'R2', 'E1', 'E2', 'O1', 'O2', 'O3', 'O4']) {
  const pairs = mk.map(k => [k['r1_' + it], (m2.find(r => r.study_id === k.study_id) || {})['r2_' + it]]).filter(([, b]) => b);
  pooled.push(...pairs);
  console.log('Evidence matrix, ' + it + ':', JSON.stringify(kappa(pairs)));
}
const pa = pooled.filter(([a, b]) => a === b).length;
console.log('All coded items pooled: ' + pooled.length + ' item decisions, agreement ' + (pooled.length ? (100 * pa / pooled.length).toFixed(1) + '%' : 'n/a') + ' (report per-item kappa above; pooled kappa is not meaningful across different code sets)');
