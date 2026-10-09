// Documented automatic pre-screen for the evidence-map corpus. Every rule is conservative: a record is only
// auto-excluded when the rule is unambiguous; everything else goes to manual title/abstract screening.
const fs = require('fs');
const recs = JSON.parse(fs.readFileSync('corpusC_raw.json', 'utf8'));
const PHEN = /micro-?seism|micro-?earthquake|induced seism|seismicity induced|hydraulic(ally)? fractur|fracturing|passive seismic|rockburst|rock burst|coal mine|mining|\bmines?\b|tunnel|geothermal|co2|carbon (capture|storage|sequestration)|landslide|rockfall|slope|reservoir|stimulation|injection/;
const LEARN = /machine learning|deep learning|neural|cnn|convolution|transformer|attention|u-?net|svm|support vector|random forest|boosting|xgboost|lightgbm|logistic regression|autoencoder|self-supervised|semi-supervised|unsupervised|clustering|cluster|learning|diffusion model|generative|\bgan\b|adversarial|lstm|recurrent|operator|artificial intelligence|\bai\b|data-driven|intelligent|bayesian|classifier/;
const NONRES_TITLE = /^(retraction|erratum|corrigendum|correction|expression of concern|decision letter|author response|reply|comment on|discussion (of|on)|peer review report|supplementary|data (and|&) (scripts|code)|data from:|preliminary code|removal notice)/i;
const DATA_VENUE = /zenodo|figshare|dryad|data archive|research data|pangaea/i;
const ABSTRACT_VENUE = /egu general assembly|agu fall meeting|agufm|japan geoscience union|egusphere|abstracts?\b.*meeting/i;
const out = [];
for (const r of recs) {
  const t = r.title.toLowerCase(), text = (r.title + ' ' + (r.abstract || '')).toLowerCase();
  let stage = 'manual', reason = '';
  if (r.corpusB) { stage = 'corpusB'; reason = 'P' + r.corpusB; }
  else if (['paratext', 'erratum', 'retraction', 'editorial', 'peer-review', 'dataset', 'supplementary-materials', 'libguides', 'reference-entry', 'grant', 'standard'].includes(r.type) || NONRES_TITLE.test(r.title.trim())) { stage = 'auto_excl'; reason = 'non-research document type'; }
  else if (r.type === 'dissertation' || /thes[ie]s|dissertation/i.test(r.venue)) { stage = 'auto_excl'; reason = 'thesis/dissertation'; }
  else if (r.type === 'book' || r.type === 'book-chapter') { stage = 'auto_excl'; reason = 'book or book chapter'; }
  else if (DATA_VENUE.test(r.venue) || /10\.5281\/zenodo|10\.6084\/m9\.figshare|10\.5061\/dryad/.test(r.doi)) { stage = 'auto_excl'; reason = 'dataset/software record'; }
  else if (ABSTRACT_VENUE.test(r.venue) || /egusphere-egu|10\.5194\/egusphere/.test(r.doi)) { stage = 'auto_excl'; reason = 'conference abstract (insufficient detail)'; }
  else if (r.language && r.language !== 'en') { stage = 'auto_excl'; reason = 'non-English'; }
  else if (r.type === 'review') { stage = 'auto_excl'; reason = 'review article (secondary study)'; }
  else if (r.abstract ? !PHEN.test(text) : !PHEN.test(t)) { stage = 'auto_excl'; reason = 'no microseismic/induced-seismicity setting term'; }
  else if (r.abstract && !LEARN.test(text)) { stage = 'auto_excl'; reason = 'no ML/DL term'; }
  out.push({ ...r, stage, reason });
}
fs.writeFileSync('prescreenedC.json', JSON.stringify(out, null, 1));
const c = {}; for (const r of out) { const k = r.stage + (r.stage === 'auto_excl' ? ': ' + r.reason : ''); c[k] = (c[k] || 0) + 1; }
console.log(c);
const man = out.filter(r => r.stage === 'manual');
console.log('manual queue', man.length, '| with abstract', man.filter(r => r.abstract).length);
