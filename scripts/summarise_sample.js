// Summarise the full-text sample audit: retrieval by stratum, eligibility, and item rates with Wilson 95% intervals,
// next to the corresponding rates of the 59-study audited core. Writes audit_sample_summary.json.
const fs = require('fs');
const ROOT = require('path').join(__dirname, '..');
const D = ROOT + '/data/sample_audit';
const S = JSON.parse(fs.readFileSync(D + '/sample.json', 'utf8'));
const C = JSON.parse(fs.readFileSync(D + '/codes.json', 'utf8'));
const coded = S.sample.filter(x => C[x.id]);
const elig = coded.filter(x => C[x.id].elig === 'Y');
const wilson = (k, n) => { if (!n) return [0, 0]; const z = 1.96, p = k / n, d = 1 + z * z / n, c = p + z * z / (2 * n), h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return [Math.max(0, (c - h) / d), Math.min(1, (c + h) / d)]; };
const item = (key, label, yes = ['Y'], core) => {
  const app = elig.filter(x => !['NA'].includes(C[x.id][key]));
  const k = app.filter(x => yes.includes(C[x.id][key])).length, n = app.length, [lo, hi] = wilson(k, n);
  return { key, label, k, n, pct: n ? Math.round(100 * k / n) : null, ci: [Math.round(100 * lo), Math.round(100 * hi)], core };
};
const items = [
  item('split', 'Leakage-aware data partition (I1)', ['Y'], '25/52 (48%)'),
  item('indep', 'Independent test set (I2)', ['Y'], '43/52 (83%)'),
  item('ext', 'Test at another site, well, sensor or domain (E1 = yes)', ['Y'], '6/59 (10%)'),
  item('cd', 'Evaluation on continuous data (O1)', ['Y'], '19/43 (44%)'),
  item('prev', 'Class prevalence of the evaluation data stated (O2)', ['Y'], '24/43 (56%)'),
  item('fa', 'False alarms per unit time (O3)', ['Y'], '3/43 (7%)'),
  item('lat', 'Latency or throughput with hardware (O4 = yes)', ['Y'], '16/59 (27%)'),
  item('code', 'Code in a public repository', ['Y'], 'not coded'),
  item('data', 'Data publicly available', ['Y'], 'not coded'),
  item('unc', 'Uncertainty or calibration of model outputs reported', ['Y'], 'not coded'),
];
const strata = {};
for (const x of S.sample) { const g = x.stratum.split(' | ')[0]; strata[g] = strata[g] || { sampled: 0, oa: 0, read: 0 }; strata[g].sampled++; if (x.candidates && x.candidates.length) strata[g].oa++; if (C[x.id]) strata[g].read++; }
const out = { population: S.population, sampled: S.sample.length, withOpenCandidate: S.sample.filter(x => x.candidates && x.candidates.length).length, read: coded.length, eligible: elig.length, ineligible: coded.filter(x => C[x.id].elig !== 'Y').map(x => x.id + ': ' + C[x.id].elig), strata, items, notRetrieved: S.sample.filter(x => !C[x.id]).map(x => ({ id: x.id, doi: x.doi, title: x.title, venue: x.venue, open_candidate: !!(x.candidates && x.candidates.length) })) };
fs.mkdirSync(ROOT + '/output', { recursive: true });
fs.writeFileSync(ROOT + '/output/audit_sample_summary.json', JSON.stringify(out, null, 1));
console.log(`sampled ${out.sampled} | open candidate ${out.withOpenCandidate} | read ${out.read} | eligible ${out.eligible} | ineligible ${out.ineligible.join('; ')}`);
console.log(JSON.stringify(strata));
for (const i of items) console.log(`${i.label.padEnd(58)} ${i.k}/${i.n} (${i.pct}%, 95% CI ${i.ci[0]}-${i.ci[1]}%) | core ${i.core}`);
