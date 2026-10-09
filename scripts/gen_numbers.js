// Generate numbers.tex: every evidence-map and sample-audit number quoted in the manuscript, as LaTeX macros,
// computed from the frozen analysis tables (evidence_map.json, decisionsC.json, audit_sample_summary.json).
// The manuscript uses only these macros for such numbers; check_numbers.js fails if a literal slips back in.
const fs = require('fs');
const ROOT = require('path').join(__dirname, '..');
const OUT = require('path').join(ROOT, 'output', 'numbers.tex');
const em = require(ROOT + '/data/analysis_inputs/evidence_map.json');
const dec = require(ROOT + '/data/analysis_inputs/screening_decision_codes.json');
const AS = require(ROOT + '/data/sample_audit/audit_sample_summary.json');
const M = {}; const set = (k, v) => { if (M[k] !== undefined) throw new Error('dup ' + k); M[k] = v; };
const N = em.length, cnt = f => em.filter(f).length, pct = (a, b) => Math.round(100 * a / b);
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '{,}');
// corpus
set('NMap', N); set('NAudit', cnt(r => r.corpus === 'B')); set('NNew', cnt(r => r.corpus === 'C'));
set('NNewSfive', cnt(r => r.corpus === 'C' && +r.id.slice(1) >= 794));
set('NScreened', fmt(Object.keys(dec).length));
set('NSinceTwentyThree', cnt(r => r.year >= 2023)); set('PctSinceTwentyThree', pct(cnt(r => r.year >= 2023), N));
const yr = y => cnt(r => r.year === y);
set('NYrFifteen', yr(2015)); set('NYrSixteen', yr(2016)); set('NYrTwentyFour', yr(2024)); set('NYrTwentySix', yr(2026));
// settings
const SET = { Min: 'MIN', HF: 'HF', GT: 'GT', Tun: 'TUN', Slp: 'SLP', OG: 'OG', CCS: 'CCS', Res: 'RES', Gen: 'GEN' };
for (const [k, c] of Object.entries(SET)) { const n = cnt(r => r.setting === c); set('N' + k, n); set('Pct' + k, pct(n, N)); set('NDAS' + k, cnt(r => r.setting === c && r.das)); }
set('NDAS', cnt(r => r.das)); set('PctDAS', pct(cnt(r => r.das), N));
set('NDASTwentyThree', cnt(r => r.das && r.year === 2023)); set('NDASTwentyFour', cnt(r => r.das && r.year === 2024));
// DAS studies using Utah FORGE data: 'FORGE' in the title/abstract (new studies) or master-table text (audited core)
const inc = require(ROOT + '/data/analysis_inputs/included_new_metadata.json');
const FORGE_NEW = new Set(require(ROOT + '/data/analysis_inputs/forge_mentions_new_studies.json').ids);
const { parseCSV } = require(ROOT + '/scripts/lib/parse_csv.js');
const MA = parseCSV(fs.readFileSync(ROOT + '/archive/v1_2026-03/data/master_table_S1A_publication_dataset.csv', 'utf8'));
const MB = parseCSV(fs.readFileSync(ROOT + '/archive/v1_2026-03/data/master_table_S1B_preprocess_model_eval.csv', 'utf8'));
const txt = r => { if (r.corpus === 'C') { return FORGE_NEW.has(r.id) ? 'FORGE' : ''; /* abstracts are not redistributed: see forge_mentions_new_studies.json */ } const id = r.id.slice(1); return JSON.stringify(MA.find(s => s['Paper ID'] === id) || {}) + JSON.stringify(MB.find(s => s['Paper ID'] === id) || {}); };
const FORGE = em.filter(r => r.das && /FORGE|Utah Frontier|Milford/i.test(txt(r))).map(r => r.id);
set('NForgeDAS', FORGE.length); set('PctForgeDAS', pct(FORGE.length, cnt(r => r.das)));
// tasks (manual sub-task codes)
const has = t => r => r.tasks2.includes(t);
const det = em.filter(r => r.tasks2.some(t => ['CD', 'CW', 'ET'].includes(t)));
set('NDet', det.length); set('PctDet', pct(det.length, N));
set('NLoc', cnt(has('LOC'))); set('PctLoc', pct(cnt(has('LOC')), N)); set('NPick', cnt(has('PICK'))); set('PctPick', pct(cnt(has('PICK')), N));
set('NCD', det.filter(has('CD')).length); set('PctCD', pct(det.filter(has('CD')).length, det.length));
set('NCW', det.filter(has('CW')).length); set('NET', det.filter(has('ET')).length);
const st = (c, t) => em.filter(r => r.setting === c && r.tasks2.includes(t)).length;
set('MinCW', st('MIN', 'CW')); set('MinET', st('MIN', 'ET')); set('MinCD', st('MIN', 'CD')); set('MinLoc', st('MIN', 'LOC'));
set('SlpET', st('SLP', 'ET')); set('TunCW', st('TUN', 'CW')); set('HFCD', st('HF', 'CD')); set('HFLoc', st('HF', 'LOC'));
set('GTLoc', st('GT', 'LOC')); set('CCSLoc', st('CCS', 'LOC'));
// periods
const per = r => r.year <= 2019 ? 1 : r.year <= 2022 ? 2 : r.year <= 2024 ? 3 : 4;
const P = [null, 1, 2, 3, 4].map(p => p && em.filter(r => per(r) === p));
const share = (p, f) => pct(P[p].filter(f).length, P[p].length);
const fam = k => r => r.fam.includes(k), reg = k => r => r.regime.includes(k);
set('DLpOne', share(1, r => r.isDL)); set('DLpFour', share(4, r => r.isDL));
set('CMLpOne', share(1, fam('CML'))); set('CMLpFour', share(4, fam('CML')));
set('CNNpTwo', share(2, fam('CNN'))); set('CNNpFour', share(4, fam('CNN')));
set('UNETpFour', share(4, fam('UNET'))); set('TRFpFour', share(4, fam('TRF'))); set('GNNpFour', share(4, fam('GNN'))); set('NOpFour', share(4, fam('NO')));
set('GENmax', Math.max(...[1, 2, 3, 4].map(p => share(p, fam('GEN')))));
set('NTL', cnt(reg('TL'))); set('PctTL', pct(cnt(reg('TL')), N)); set('TLpFour', share(4, reg('TL')));
set('NSEMI', cnt(reg('SEMI'))); set('PctSEMI', pct(cnt(reg('SEMI')), N));
set('NPHYS', cnt(reg('PHYS'))); set('PctPHYS', pct(cnt(reg('PHYS')), N)); set('NPHYSlate', cnt(r => r.regime.includes('PHYS') && r.year >= 2025));
set('NOpPhys', cnt(r => r.fam.includes('NO') || r.regime.includes('PHYS'))); set('NOpPhysLoc', cnt(r => (r.fam.includes('NO') || r.regime.includes('PHYS')) && r.tasks2.includes('LOC')));
set('NRT', cnt(r => r.rt)); set('PctRT', pct(cnt(r => r.rt), N));
set('NX', cnt(r => r.xsite)); set('PctX', pct(cnt(r => r.xsite), N));
set('PctXDAS', pct(cnt(r => r.das && r.xsite), cnt(r => r.das))); set('PctXGeo', pct(cnt(r => !r.das && r.xsite), cnt(r => !r.das)));
set('NTitleOnly', cnt(r => /title only/.test(r.flag))); set('PctTitleOnly', pct(cnt(r => /title only/.test(r.flag)), N));
// sample audit
set('SASampled', AS.sampled); set('SAPopulation', AS.population); set('SAOpen', AS.withOpenCandidate); set('SARead', AS.read); set('SAElig', AS.eligible);
const it = k => AS.items.find(i => i.key === k);
for (const [k, name] of [['split', 'Split'], ['indep', 'Indep'], ['ext', 'Ext'], ['cd', 'CD'], ['prev', 'Prev'], ['fa', 'FA'], ['lat', 'Lat'], ['code', 'Code'], ['data', 'Data'], ['unc', 'Unc']]) {
  const i = it(k); set('SA' + name + 'K', i.k); set('SA' + name + 'N', i.n); set('SA' + name + 'Pct', i.pct); set('SA' + name + 'Lo', i.ci[0]); set('SA' + name + 'Hi', i.ci[1]);
}
const lines = ['% Generated by gen_numbers.js from the frozen analysis tables. Do not edit by hand.', `% ${new Date().toISOString()}`, '\\RequirePackage{xspace}\\xspaceaddexceptions{\\%}'];
for (const [k, v] of Object.entries(M)) { if (!/^[A-Za-z]+$/.test(k)) throw new Error('bad macro name ' + k); lines.push(`\\newcommand{\\${k}}{${v}\\xspace}`); if (typeof v === 'number') lines.push(`\\newcommand{\\raw${k}}{${v}}`); }
lines.push(`% FORGE DAS studies (${FORGE.length}): ${FORGE.join(', ')}`);
fs.mkdirSync(require('path').dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, lines.join('\n') + '\n');
fs.writeFileSync(ROOT + '/output/numbers.json', JSON.stringify(M, null, 1));
console.log(Object.keys(M).length, 'macros | FORGE DAS', FORGE.length, FORGE.join(' '));
