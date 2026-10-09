// Draw a stratified random sample of the new (non-audited) evidence-map studies for a full-text audit of
// field-readiness items. Strata: setting group x period; proportional allocation; fixed seed (reproducible).
// The sample is drawn from all new studies regardless of open-access status; availability is recorded afterwards.
const fs = require('fs');
const ROOT = require('path').join(__dirname, '..');
// sampling frame: the 327 new studies of the evidence map when the sample was drawn (27 September 2026)
const em = require(ROOT + '/data/sample_audit/sampling_frame_327.json');
const inc = require(ROOT + '/data/analysis_inputs/included_new_metadata.json');
const N = 80, SEED = 20260927;
let s = SEED; const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
const grp = r => r.setting === 'MIN' ? 'mining' : ['HF', 'GT', 'CCS', 'OG', 'RES'].includes(r.setting) ? 'reservoir' : ['TUN', 'SLP'].includes(r.setting) ? 'tunnel/slope' : 'not specified';
const per = r => r.year <= 2022 ? '2015-2022' : r.year <= 2024 ? '2023-2024' : '2025-2026';
const strata = {};
em.forEach(r => (strata[grp(r) + ' | ' + per(r)] = strata[grp(r) + ' | ' + per(r)] || []).push(r));
// proportional allocation with largest-remainder rounding
const keys = Object.keys(strata).sort();
const quota = keys.map(k => ({ k, exact: N * strata[k].length / em.length }));
quota.forEach(q => q.n = Math.floor(q.exact));
let left = N - quota.reduce((a, q) => a + q.n, 0);
[...quota].sort((a, b) => (b.exact - b.n) - (a.exact - a.n)).slice(0, left).forEach(q => q.n++);
const sample = [];
for (const q of quota) {
  const list = [...strata[q.k]].sort((a, b) => a.id.localeCompare(b.id));
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  list.slice(0, q.n).forEach(r => { const x = inc.find(y => 'm' + y.m === r.id); sample.push({ id: r.id, stratum: q.k, year: r.year, title: r.title, doi: r.doi, venue: r.venue, das: r.das, tasks2: r.tasks2, oa: x.oa, oa_url: x.oa_url, pdf_url: x.pdf_url, openalex: x.openalex }); });
}
fs.mkdirSync(ROOT + '/output', { recursive: true });
fs.writeFileSync(ROOT + '/output/sample.json', JSON.stringify({ seed: SEED, n: N, population: em.length, strata: quota.map(q => ({ stratum: q.k, population: strata[q.k].length, sampled: q.n })), sample }, null, 1));
console.log(quota.map(q => `${q.k}: ${q.n}/${strata[q.k].length}`).join('\n'));
console.log('sampled', sample.length, '| OA', sample.filter(x => x.oa).length, '| pdf_url', sample.filter(x => x.pdf_url).length);
