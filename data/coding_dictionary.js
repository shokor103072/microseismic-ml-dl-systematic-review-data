// Evidence-map coding dictionary (applied to title + abstract for new studies; to master-table text for Corpus B).
// Every code can be overridden manually (overrides.json); the final table records whether a value was auto or manual.
const RX = {
  das: /distributed acoustic sens|\bdas\b|dark fib|φ-otdr|phi-otdr|\botdr\b|fib(er|re)[- ]optic (cable|sensing|array|seismic)|fibre-optic das|fiber-optic das|strain[- ]rate/i,
  fo: /fib(er|re)[- ]optic (microseismic|sensor|accelerometer|geophone|mems|vibration)|\bfbg\b|fib(er|re) bragg/i,
  geo: /geophone|seismometer|borehole (array|network|seismic|receivers?|geophones?)|downhole (array|receivers?|geophones?|tools?|microseismic)|surface (array|network|monitoring|microseismic)|nodal|\bnodes\b|three-component|3-component|3c\b|accelerometer|microseismic (monitoring )?(system|network)|sensor network|monitoring (network|array)|seismic (network|array|stations?)|\bstations?\b|velocity sensors?/i,
  MIN: /\bcoal\b|\bmines?\b|mining|rockburst|rock burst|longwall|metal mine|copper mine|gold mine|potash|colliery|working face|roadway|goaf/i,
  TUN: /tunnel|\btbm\b|hydropower|underground (engineering|excavation|powerhouse|cavern|laboratory|research)|cavern|grouting|deep-buried|excavation|underground space|rock mass/i,
  HF: /hydraulic(ally)? fractur|fracking|\bfrac\b|shale|unconventional|montney|eagle ford|duvernay|weiyuan|horn river|marcellus|perforation|stimulation stage|treatment well|horizontal well|preston new road|\bpnr\b/i,
  GT: /geotherm|\begs\b|enhanced geothermal|\bforge\b|hot dry rock|geysers|newberry|hengill|helsinki|otaniemi|brady|soultz|basel|pohang|cooper basin/i,
  CCS: /\bco2\b|co₂|carbon (capture|storage|sequestration|dioxide)|\bccs\b|\bccus\b|decatur|\bibdp\b|otway|\bquest\b|sequestration|gas storage|storage site/i,
  OG: /gas field|groningen|oil field|oilfield|production-induced|depletion|thermal operation|\bsagd\b|cold lake|wastewater|injection-induced|reservoir monitoring|oil and gas|hydrocarbon/i,
  SLP: /landslide|rockfall|rock ?slope|\bslopes?\b|rock face|unstable rock|rockslide|cliff|super-sauze|åknes|aknes|matterhorn|permafrost/i,
  RES: /reservoir-induced|reservoir induced|impoundment|\bdam\b|xiluodu|baihetan|water level/i,
  det: /detect|detection|identif|recogni|classif|discriminat|event.{0,20}noise|noise.{0,20}event|trigger|anomal|screen(ing)? |catalog/i,
  pick: /\bpick|arrival|first[- ]break|first[- ]arrival|onset|phase (segmentation|detection)|p-wave|s-wave|p- and s-wave|p and s wave/i,
  loc: /locat|localiz|localis|hypocent|source (position|imaging|inversion)|epicent/i,
  syn: /synthetic|simulat|numerical model|forward[- ]model|finite[- ]difference|marmousi|modelled data|modeled data/i,
  fld: /field|real (data|record|microseismic|seismic)|recorded|case study|monitoring data|in-situ|in situ|continuous (data|records|recordings)|mine data|project|campaign|site\b/i,
  NO: /neural operator|\bfno\b|\bafno\b|\buno\b|deeponet|physics-informed|\bpinn|eikonal/i,
  GEN: /diffusion model|denoising diffusion|latent diffusion|conditional diffusion|\bgan\b|gans\b|generative adversarial|cyclegan|variational autoencoder|\bvae\b|\bwgan\b/i,
  TRF: /transformer|self-attention|vision transformer|\bvit\b|swin|\bdetr\b/i,
  ATT: /attention/i,
  GNN: /graph neural|\bgnn|\bgcn\b|\bgat\b|graph convolution|graph attention/i,
  UNET: /u-?net|encoder[- ]decoder|segmentation|fully convolutional|\bfcn\b|\bfcnn\b|unet\+\+|resunet/i,
  RNN: /lstm|\bgru\b|recurrent|bilstm|\brnn\b|\btcn\b|temporal convolution/i,
  CNN: /\bcnn|convolutional|resnet|vgg|yolo|inception|alexnet|lenet|capsule|densenet|mobilenet|efficientnet|squeeze-and-excitation|sincnet/i,
  AE: /autoencoder|auto-encoder/i,
  SNN: /spiking/i,
  CML: /\bsvm\b|support vector|random forest|xgboost|lightgbm|gradient boost|logistic regression|k-?means|fuzzy c|\bfcm\b|clustering|decision tree|\bknn\b|k-nearest|naive bayes|bayesian network|extreme learning|\belm\b|\bmlp\b|multilayer perceptron|multi-layer perceptron|artificial neural network|\bann\b|back.?propagation|\bbp\b neural|deep belief|\bdbn\b|hidden markov|\bhmm\b|gaussian process|ensemble learning|adaboost|boosting|linear discriminant|\blda\b|principal component|\bpca\b|self-organizing map|\bsom\b|reinforcement learning|shallow (neural|machine)|machine learning/i,
  TL: /transfer learning|fine-tun|pre-?train|domain adaptation|domain adversarial|cross-domain|adversarial learning/i,
  SEMI: /semi-supervised|self-supervised|active learning|pseudo-label|weak(ly)? supervis|few-shot|meta-learning|contrastive|self-training|human-in-the-loop|human-on-the-loop|machine teaching|sparse-label|minimal annotation|label-efficient/i,
  UNSUP: /unsupervised|\bclustering\b|k-means|fuzzy c-means|anomaly detection/i,
  PHYS: /physics-informed|physics-constrained|physics-guided|physical constraint|physics constraint|eikonal|\bpinn|theory-guided|seismology-prior|prior constraint|physics-aware/i,
  XSITE: /cross-(site|well|mine|domain|region|area|dataset|project|mining|stage)|different (wells?|sites?|mines?|regions?|datasets?|areas?|geological conditions|monitoring projects|mining areas?|fields?)|multiple (mines|sites|projects|datasets|monitoring projects|mining areas)|another (site|mine|well|dataset)|generali[sz]\w* (to|across|among|between) |transferred to|unseen (data|site|well|mine)|leave-one-site-out|blind (well|test)|other (sites|mines|wells|datasets)|domain shift|out-of-distribution|between (sites|mines|wells)/i,
  RT: /real-time|real time|near-real-time|online|deployed|deployment|in production|edge (device|computing)|streaming|operational/i,
};
// text = full text (title | abstract | ...); title (optional) is used first for task coding
function code(text, title) {
  const t = ' ' + text + ' ';
  const has = k => RX[k].test(t);
  const das = has('das'), fo = has('fo'), geo = has('geo');
  let modality = das && geo ? 'G+D' : das ? 'DAS' : fo ? 'FO' : 'G';
  const modalityInferred = !das && !fo && !geo;
  let setting = has('MIN') ? 'MIN' : has('TUN') ? 'TUN' : has('HF') ? 'HF' : has('GT') ? 'GT' : has('CCS') ? 'CCS' : has('OG') ? 'OG' : has('SLP') ? 'SLP' : has('RES') ? 'RES' : 'GEN';
  const taskOf = s => { const x = []; if (RX.det.test(s)) x.push('DET'); if (RX.pick.test(s)) x.push('PICK'); if (RX.loc.test(s)) x.push('LOC'); return x; };
  let tasks = title ? taskOf(' ' + title + ' ') : [];
  if (!tasks.length) tasks = taskOf(t);
  const data = has('syn') && has('fld') ? 'HYB' : has('syn') ? 'SYN' : has('fld') ? 'FLD' : 'NS';
  let fam = ['NO', 'GEN', 'TRF', 'GNN', 'UNET', 'RNN', 'CNN', 'AE', 'SNN', 'CML'].filter(has);
  if (!fam.length) fam = /deep learning|deep neural|neural network|\bdnn\b/i.test(t) ? ['DLU'] : ['CML'];
  const regime = ['TL', 'SEMI', 'UNSUP', 'PHYS'].filter(has);
  return { modality, modalityInferred, setting, tasks, data, fam, att: has('ATT'), regime, xsite: has('XSITE'), rt: has('RT') };
}
module.exports = { code, RX };
