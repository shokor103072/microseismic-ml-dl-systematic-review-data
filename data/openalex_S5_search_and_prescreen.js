// Final sensitivity search S5 (OpenAlex), 2015-01-01 .. 2026-09-27, run after an external check found eligible
// studies without indexed abstracts whose titles lack either an ML term or a microseismic term.
//   S5a  title-only: microseismic/mining-seismicity term AND task term, no ML term required
//   S5b  title+abstract: DAS AND ML AND event/task term, no microseismic term required
//   S5c  title+abstract: mining-seismicity terms (geoacoustic, rockburst, mine tremor ...) AND ML AND task
// New records are deduplicated against corpusC_raw.json (OpenAlex ID, then DOI), matched to Corpus B, pre-screened
// with the rules of prescreenC.js and numbered from m794 onwards for manual screening.
const fs = require('fs');
const { parseCSV } = require('../refs/corpus_vs_refs.js');
const FROM = '2015-01-01', TO = '2026-09-27';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const LEARN = '("machine learning" OR "deep learning" OR "neural network" OR "neural networks" OR CNN OR "convolutional" OR Transformer OR "U-Net" OR LSTM OR SVM OR "support vector" OR "random forest" OR XGBoost OR "artificial intelligence" OR "data-driven")';
const Q = {
  S5a_title_task_no_ML: 'title.search:(microseismic OR "micro-seismic" OR microseismicity OR "micro-seismicity" OR microearthquake OR "micro-earthquake" OR "induced seismicity" OR "induced earthquake" OR "induced earthquakes" OR "mining-induced" OR "mine seismicity" OR "mining seismicity" OR geoacoustic OR rockburst OR "rock burst") AND (detection OR detect OR detector OR picking OR picker OR arrival OR phase OR classification OR classify OR identification OR identify OR recognition OR location OR localization OR locating OR automatic OR automated OR catalog OR catalogue)',
  S5b_DAS_no_microseismic_term: `title_and_abstract.search:("distributed acoustic sensing" OR "distributed fiber optic" OR "distributed fibre optic" OR "fiber-optic seismic" OR "fibre-optic seismic") AND ${LEARN} AND (event OR events OR earthquake OR earthquakes OR seismicity OR picking OR arrival OR location OR localization)`,
  S5c_mining_seismicity_terms: `title_and_abstract.search:(geoacoustic OR rockburst OR "rock burst" OR "mine tremor" OR "mine tremors" OR "mining-induced seismicity" OR "mine seismic" OR "coal mine seismic") AND ${LEARN} AND (classification OR identification OR recognition OR detection OR picking OR arrival OR location OR localization)`,
};
const SELECT = 'id,doi,title,publication_date,publication_year,type,primary_location,authorships,abstract_inverted_index,open_access,best_oa_location,language,cited_by_count';
async function getJSON(url) { for (let i = 0; i < 6; i++) { try { const r = await fetch(url, { headers: { 'User-Agent': 'systematic-review-update/1.0' } }); if (r.ok) return await r.json(); console.error('HTTP', r.status); await sleep(2500 * (i + 1)); } catch (e) { await sleep(2500 * (i + 1)); } } throw new Error(url); }
async function pageAll(filter) { let c = '*', out = []; while (c) { const j = await getJSON(`https://api.openalex.org/works?filter=${encodeURIComponent(filter)}&per-page=200&cursor=${encodeURIComponent(c)}&select=${SELECT}`); out = out.concat(j.results); c = j.meta.next_cursor; if (!j.results.length) break; await sleep(150); } return out; }
const abstractOf = w => { const inv = w.abstract_inverted_index; if (!inv) return ''; const a = []; for (const [k, ps] of Object.entries(inv)) for (const p of ps) a[p] = k; return a.join(' '); };
const slim = (w, via) => ({
  openalex: w.id, doi: (w.doi || '').replace('https://doi.org/', '').toLowerCase(), title: (w.title || '').replace(/<[^>]+>/g, ''),
  date: w.publication_date, year: w.publication_year, type: w.type, venue: ((w.primary_location || {}).source || {}).display_name || '',
  language: w.language, authors: (w.authorships || []).map(a => a.author.display_name),
  countries: [...new Set((w.authorships || []).flatMap(a => a.countries || []))],
  abstract: abstractOf(w), oa: (w.open_access || {}).is_oa || false, oa_url: (w.open_access || {}).oa_url || '', pdf_url: ((w.best_oa_location || {}).pdf_url) || '',
  cited_by: w.cited_by_count, via: [via]
});
// pre-screen rules copied unchanged from prescreenC.js
const PHEN = /micro-?seism|micro-?earthquake|induced seism|seismicity induced|hydraulic(ally)? fractur|fracturing|passive seismic|rockburst|rock burst|coal mine|mining|\bmines?\b|tunnel|geothermal|co2|carbon (capture|storage|sequestration)|landslide|rockfall|slope|reservoir|stimulation|injection/;
const LEARNRE = /machine learning|deep learning|neural|cnn|convolution|transformer|attention|u-?net|svm|support vector|random forest|boosting|xgboost|lightgbm|logistic regression|autoencoder|self-supervised|semi-supervised|unsupervised|clustering|cluster|learning|diffusion model|generative|\bgan\b|adversarial|lstm|recurrent|operator|artificial intelligence|\bai\b|data-driven|intelligent|bayesian|classifier/;
const NONRES_TITLE = /^(retraction|erratum|corrigendum|correction|expression of concern|decision letter|author response|reply|comment on|discussion (of|on)|peer review report|supplementary|data (and|&) (scripts|code)|data from:|preliminary code|removal notice)/i;
const DATA_VENUE = /zenodo|figshare|dryad|data archive|research data|pangaea/i;
const ABSTRACT_VENUE = /egu general assembly|agu fall meeting|agufm|japan geoscience union|egusphere|abstracts?\b.*meeting/i;
function prescreen(r) {
  const t = r.title.toLowerCase(), text = (r.title + ' ' + (r.abstract || '')).toLowerCase();
  if (r.corpusB) return ['corpusB', 'P' + r.corpusB];
  if (['paratext', 'erratum', 'retraction', 'editorial', 'peer-review', 'dataset', 'supplementary-materials', 'libguides', 'reference-entry', 'grant', 'standard'].includes(r.type) || NONRES_TITLE.test(r.title.trim())) return ['auto_excl', 'non-research document type'];
  if (r.type === 'dissertation' || /thes[ie]s|dissertation/i.test(r.venue)) return ['auto_excl', 'thesis/dissertation'];
  if (r.type === 'book' || r.type === 'book-chapter') return ['auto_excl', 'book or book chapter'];
  if (DATA_VENUE.test(r.venue) || /10\.5281\/zenodo|10\.6084\/m9\.figshare|10\.5061\/dryad/.test(r.doi)) return ['auto_excl', 'dataset/software record'];
  if (ABSTRACT_VENUE.test(r.venue) || /egusphere-egu|10\.5194\/egusphere/.test(r.doi)) return ['auto_excl', 'conference abstract (insufficient detail)'];
  if (r.language && r.language !== 'en') return ['auto_excl', 'non-English'];
  if (r.type === 'review') return ['auto_excl', 'review article (secondary study)'];
  if (r.abstract ? !PHEN.test(text) : !PHEN.test(t)) return ['auto_excl', 'no microseismic/induced-seismicity setting term'];
  if (r.abstract && !LEARNRE.test(text)) return ['auto_excl', 'no ML/DL term'];
  return ['manual', ''];
}
(async () => {
  const prev = JSON.parse(fs.readFileSync('corpusC_raw.json', 'utf8'));
  const prevId = new Set(prev.map(r => r.openalex)), prevDoi = new Set(prev.map(r => r.doi).filter(Boolean));
  const all = new Map(), log = { runDate: new Date().toISOString().slice(0, 10), window: [FROM, TO], queries: {}, counts: {} };
  for (const [name, f] of Object.entries(Q)) {
    const res = await pageAll(`${f},from_publication_date:${FROM},to_publication_date:${TO}`);
    log.queries[name] = f; log.counts[name] = res.length; console.log(name, res.length);
    for (const w of res) { const r = slim(w, name); if (all.has(r.openalex)) all.get(r.openalex).via.push(name); else all.set(r.openalex, r); }
  }
  const recs = [...all.values()];
  log.counts.unique_records = recs.length;
  const fresh = recs.filter(r => !prevId.has(r.openalex) && !(r.doi && prevDoi.has(r.doi)));
  log.counts.already_retrieved_S1_S4 = recs.length - fresh.length;
  log.counts.new_records = fresh.length;
  const A = parseCSV(fs.readFileSync('../repo/master_table_S1A_publication_dataset.csv', 'utf8'));
  const norm = s => (s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
  const bDoi = new Map(A.filter(s => /^10\./.test((s.DOI || '').trim())).map(s => [(s.DOI || '').trim().toLowerCase(), s['Paper ID']]));
  const bTitle = A.map(s => [norm(s.Title).slice(0, 55), s['Paper ID']]);
  let m = 794;
  for (const r of fresh) {
    const t = norm(r.title).slice(0, 55);
    r.corpusB = bDoi.get(r.doi) || (bTitle.find(([bt]) => bt && bt === t) || [])[1] || null;
    [r.stage, r.reason] = prescreen(r);
    if (r.stage === 'manual') r.m = m++;
  }
  const c = {}; for (const r of fresh) { const k = r.stage + (r.stage === 'auto_excl' ? ': ' + r.reason : ''); c[k] = (c[k] || 0) + 1; }
  log.counts.prescreen = c;
  fs.writeFileSync('s5_raw.json', JSON.stringify(fresh, null, 1));
  fs.writeFileSync('s5_search_log.json', JSON.stringify(log, null, 1));
  console.log(JSON.stringify(log.counts, null, 1));
})();
