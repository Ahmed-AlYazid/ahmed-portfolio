(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
    });
    kids.flat().forEach((c) => c != null && el.append(c.nodeType ? c : document.createTextNode(c)));
    return el;
  };
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} }
  };

  /* ---------- content ---------- */
  const WORK = [
    { title: 'Educational Supervision Platform', kind: 'Production · Arabic RTL', year: '2026', metric: 'LIVE', label: 'In daily production use',
      body: 'A production Arabic platform for educational supervision workflows in a private-school environment. It centralizes visits, records, reports, approvals and document exports.',
      points: ['Digitizes supervisory visit forms and structured teacher and supervisor records.', 'Dashboards, filters, visit metrics and operational reports.', 'Exports official records to PDF, Word and Excel while preserving Arabic RTL document requirements.'],
      link: ['https://almarefah-supervision.pages.dev/', 'Open the live platform ↗'], note: 'The source repository is private to the school.' },
    { title: 'Glaucoma Classification Research', kind: 'Team graduation research · Computer vision', year: '2025–26', metric: '96.3%', label: 'Best reported accuracy · AUC-ROC 0.996',
      body: 'Comparative deep-learning research for glaucoma image classification: six conditions under one controlled protocol on 4,828 synthetically generated retinal fundus images.',
      points: ['ViT-Small and ResNet-18 under feature extraction and full fine-tuning.', 'KAN-Transformer and a matched MLP-Transformer trained from scratch.', 'Python and PyTorch.'],
      note: 'A research comparison on synthetic images, not a clinical diagnostic product.' },
    { title: 'Animal Image Classification', kind: 'Coursework · CNN', year: '2022–26', metric: '88.9%', label: 'Held-out accuracy',
      body: 'A multi-class image classifier with preprocessing and augmentation. For this portfolio it was retrained on 827 readable coursework images: MobileNetV2 features plus a nine-class logistic-regression head.',
      points: ['Inference runs in your browser with ONNX Runtime Web; your photo is never uploaded.', 'It always compares among the nine classes and cannot reject unrelated images.'],
      note: 'The model loads only when you classify.' },
    { title: 'Diamond Price Prediction', kind: 'Coursework · Regression', year: '2022–26', metric: '0.904', label: 'R² on the held-out test set',
      body: 'Linear regression on length, width and depth. The coefficients are reproduced from the original 500-row project data with the notebook’s 80/20 split and random seed.',
      points: ['MAE $241 and RMSE $329 on the test set.', 'Pandas and Scikit-learn workflow.'],
      note: 'Dimensions only. An experiment, not an appraisal.' },
    { title: 'Obesity Risk Classification', kind: 'Coursework · Model audit', year: '2022–26', metric: '89.6%', label: 'Accuracy on a 626-record holdout',
      body: 'The coursework’s saved Gaussian Naive Bayes report did not reproduce from the available data, so a compact decision tree was retrained on the same five inputs and 2,086 records, and labeled as a retraining.',
      points: ['Inputs: height, weight, family history, calorie monitoring and walking.', 'The underlying UCI data is largely synthetic and from a limited population.'],
      note: 'Educational output, not a diagnosis or health assessment.' }
  ];
  const FIELDS = [
    { name: 'Computer Vision', text: 'Image classification and architecture comparison, from glaucoma research on fundus images to an animal classifier that runs in the browser.', projects: [1, 2] },
    { name: 'Machine Learning', text: 'From regression and decision trees to ResNet, ViT and KAN-Transformer, with evaluation that goes beyond one accuracy number.', projects: [1, 2, 3, 4] },
    { name: 'Data Science', text: 'Data preparation and honest evaluation: cross-validation, confidence intervals, calibration, and results reproduced from the original data.', projects: [1, 3, 4] },
    { name: 'Production Systems', text: 'An Arabic platform in daily use on Cloudflare Pages, Workers, D1, Better Auth and Backblaze B2.', projects: [0] }
  ];
  const STEPS = [
    ['Capture', 'Structured forms', 'Supervisors record periodic, technical, classroom and peer visits in structured forms instead of paper.'],
    ['Review', 'Roles & approvals', 'Authenticated, role-based access with a review and approval path.'],
    ['Report', 'Dashboards & filters', 'Visit metrics by section, subject and supervisor become operational reports.'],
    ['Export', 'PDF · Word · Excel', 'Official records export to PDF, Word and Excel with Arabic RTL document requirements preserved.']
  ];
  const CONDS = {
    'vit-fe': ['ViT-Small · FE', 'A pretrained Vision Transformer used as a fixed feature extractor with a new classification head.'],
    'vit-ft': ['ViT-Small · FT', 'A pretrained Vision Transformer with all layers updated on the study images.'],
    'res-fe': ['ResNet-18 · FE', 'A pretrained CNN backbone kept fixed; only the head is trained.'],
    'res-ft': ['ResNet18-FT', 'The best reported condition: 96.3% accuracy and 0.996 AUC-ROC under the study protocol.'],
    'kan-sc': ['KAN-Transformer', 'A Kolmogorov–Arnold Network transformer trained without pretraining.'],
    'mlp-sc': ['MLP-Transformer', 'A matched MLP-based transformer baseline, also trained from scratch.']
  };
  const MILES = [
    ['2022', 'The start', 'Began the B.Sc. in Artificial Intelligence at Umm Al-Qura University and completed Edraak’s Introduction to AI and Digital Skills in AI.'],
    ['2022–2026', 'Coursework models', 'Computer vision, regression and classification: animal images, diamond prices and obesity risk.'],
    ['2025–2026', 'Graduation research', 'A controlled team study comparing six deep-learning conditions for glaucoma classification on synthetic images.'],
    ['2026', 'Into production', 'The Educational Supervision Platform runs in daily use, and I graduated with a B.Sc. in AI, GPA 3.37 / 4.00.']
  ];
  const TOOLS = [
    ['Languages & Data', ['Python', 'SQL', 'Java', 'Pandas', 'NumPy', 'Matplotlib']],
    ['Machine Learning', ['PyTorch', 'TensorFlow / Keras', 'Scikit-learn', 'CNNs', 'Vision Transformers', 'ResNet', 'Transfer Learning', 'XAI']],
    ['Vision & Evaluation', ['Image Classification', 'Cross-Validation', 'Calibration', 'AUC-ROC', 'Bootstrap CIs']],
    ['Cloud & Delivery', ['Git / GitHub', 'Cloudflare Pages', 'Workers', 'D1', 'Better Auth', 'Backblaze B2']]
  ];
  const BAND = ['Machine Learning', 'Computer Vision', 'Data Science', 'PyTorch', 'Production AI'];
  const CLASSES = ['Insufficient weight', 'Normal weight', 'Overweight level I', 'Overweight level II', 'Obesity type I', 'Obesity type II', 'Obesity type III'];

  const state = { field: -1, step: 0, cond: 'res-ft', mile: 3, tk: -1 };

  /* ---------- band ---------- */
  $('.band-track').replaceChildren(...BAND.concat(BAND).map((w) => h('span', { class: 'band-item' }, w, h('i', { class: 'dia', 'aria-hidden': 'true' }))));

  /* ---------- orbits: drag to spin, pick a field to filter the index ---------- */
  const stage = $('.orbit-stage');
  const ringsG = $('.orbit-rings');
  const svg = $('.orbit-svg');
  const ORB = [{ rot: 30, rx: 222, ry: 112 }, { rot: 75, rx: 222, ry: 112 }, { rot: 120, rx: 222, ry: 112 }];
  const NODE_ORBIT = [0, 2, 0, 2];          // fields ride the far ends of rings 0 and 2: always 90° apart
  const NODE_END = [1, 1, -1, -1];
  ORB.forEach((o) => {
    const e = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    e.setAttribute('cx', 260); e.setAttribute('cy', 260); e.setAttribute('rx', o.rx); e.setAttribute('ry', o.ry);
    e.setAttribute('transform', `rotate(${o.rot} 260 260)`); e.setAttribute('class', 'orbit-ring');
    ringsG.append(e);
  });
  const rings = $$('.orbit-ring');
  const nodes = FIELDS.map((f, i) => {
    const b = h('button', { type: 'button', class: 'node', 'aria-pressed': 'false',
      onclick: () => { if (!moved) selectField(state.field === i ? -1 : i); } },
    h('i', { class: 'dia', 'aria-hidden': 'true' }), f.name);
    $('.orbit-nodes').append(b);
    return b;
  });

  let spin = 0, vel = reduce ? 0 : 0.006, dragging = false, moved = false, lastAngle = 0, lastT = 0, hoverPause = false;
  const BASE_VEL = 0.006;
  function place() {
    const size = stage.clientWidth || 1;
    ringsG.setAttribute('transform', `rotate(${spin.toFixed(2)} 260 260)`);
    nodes.forEach((b, i) => {
      const r = (ORB[NODE_ORBIT[i]].rot + spin) * Math.PI / 180;
      const d = ORB[NODE_ORBIT[i]].rx * NODE_END[i];
      const x = (260 + d * Math.cos(r)) / 520 * size, y = (260 + d * Math.sin(r)) / 520 * size;
      const half = b.offsetWidth / 2 + 2;
      b.style.left = Math.min(size - half, Math.max(half, x)) + 'px';
      b.style.top = y + 'px';
    });
  }
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(50, now - last); last = now;
    if (!dragging) {
      if (!reduce && !hoverPause) {
        vel += (BASE_VEL - vel) * Math.min(1, dt * 0.002);   // momentum eases back to the idle drift
        spin = (spin + vel * dt) % 360;
      }
    }
    place();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  addEventListener('resize', place);

  const angleAt = (e) => { const r = stage.getBoundingClientRect(); return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180 / Math.PI; };
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('.node')) return;
    dragging = true; moved = false; lastAngle = angleAt(e); lastT = performance.now();
    stage.setPointerCapture(e.pointerId); stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    if (dragging) {
      let a = angleAt(e), d = a - lastAngle;
      if (d > 180) d -= 360; if (d < -180) d += 360;
      if (Math.abs(d) > .4) moved = true;
      const now = performance.now();
      spin = (spin + d + 360) % 360;
      vel = d / Math.max(8, now - lastT);
      lastAngle = a; lastT = now;
      return;
    }
    if (reduce || !finePointer) return;
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    svg.style.transform = `rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg)`;
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false; stage.classList.remove('is-dragging');
    try { stage.releasePointerCapture(e.pointerId); } catch (_) {}
    setTimeout(() => { moved = false; }, 0);
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('pointerleave', () => { svg.style.transform = ''; });
  $('.orbit-nodes').addEventListener('pointerenter', () => { hoverPause = true; }, true);
  $('.orbit-nodes').addEventListener('pointerleave', () => { hoverPause = false; }, true);

  function selectField(i) {
    state.field = i;
    nodes.forEach((b, j) => { b.classList.toggle('is-active', j === i); b.setAttribute('aria-pressed', String(j === i)); });
    rings.forEach((r, j) => { r.classList.toggle('is-active', i >= 0 && j === NODE_ORBIT[i]); r.classList.toggle('is-dim', i >= 0 && j !== NODE_ORBIT[i]); });
    const f = FIELDS[i];
    $('.orbit-card-title').textContent = f ? f.name : 'Four fields, five projects';
    $('.orbit-card-text').textContent = f ? f.text : 'Pick a field on the orbits, or drag them to spin. The projects in that field light up in the index.';
    $('#orbitAll').hidden = i < 0;
    $$('.row').forEach((row) => {
      const p = Number(row.dataset.p);
      const on = i < 0 || f.projects.includes(p);
      row.classList.toggle('is-dim', !on);
      row.classList.toggle('is-lit', i >= 0 && on);
    });
  }
  $('#orbitAll').addEventListener('click', () => selectField(-1));
  const hintFields = (p) => nodes.forEach((b, j) => b.classList.toggle('is-hint', p >= 0 && FIELDS[j].projects.includes(p)));

  /* ---------- project detail (shared by drawer and doors) ---------- */
  const blocks = $$('#blocks [data-block]');
  const blockHome = $('#blocks');
  function detailFor(i, inDrawer) {
    const w = WORK[i];
    const intro = h('div', { class: 'pd-intro' },
      h('div', { class: 'pd-tags' }, h('b', {}, w.metric), h('span', {}, w.label)),
      h('p', { class: 'pd-body' }, w.body),
      h('ul', { class: 'facts pd-points' }, w.points.map((t) => h('li', {}, t))),
      w.link ? h('div', { class: 'row-actions' }, h('a', { class: inDrawer ? 'btn btn-ink' : 'btn btn-accent', href: w.link[0], target: '_blank', rel: 'noreferrer' }, w.link[1])) : null,
      h('p', { class: 'pd-note' }, w.note));
    return [intro, blocks[i]];
  }
  function parkBlocks() { blocks.forEach((b) => blockHome.append(b)); }

  /* index rows: hover fill + cursor preview, click opens the drawer */
  const list = $('#indexList');
  $('#work').classList.add('work-index');
  function renderIndex() {
    list.replaceChildren(...WORK.map((w, i) => h('button', { type: 'button', class: 'row', 'data-p': i,
      onclick: () => openDrawer(i),
      onmouseenter: () => { hintFields(i); showPreview(i); },
      onmouseleave: () => hintFields(-1),
      onfocus: () => hintFields(i), onblur: () => hintFields(-1) },
    h('span', { class: 'row-n' }, '0' + (i + 1)),
    h('span', { class: 'row-main' }, h('span', { class: 'row-title' }, w.title), h('span', { class: 'row-kind' }, `${w.kind} · ${w.year}`)),
    h('span', { class: 'row-metric' }, w.metric),
    h('span', { class: 'row-mark', 'aria-hidden': 'true' }, h('i', { class: 'dia' })))));
    selectField(state.field);
    renderFlow(); renderMatrix(); runDiamond(); runObesity();
  }

  /* cursor preview (index variant) */
  const preview = $('#preview'), idxWrap = $('.index-wrap');
  function showPreview(i) {
    if (!finePointer) return;
    const w = WORK[i];
    $('.preview-kind', preview).textContent = w.kind;
    $('.preview-metric', preview).textContent = w.metric;
    $('.preview-label', preview).textContent = w.label + ' · click to open';
    preview.classList.add('is-on');
  }
  idxWrap.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = idxWrap.getBoundingClientRect();
    const x = Math.min(r.width - 250, e.clientX - r.left + 24), y = e.clientY - r.top - 130;
    preview.style.transform = `translate(${x}px, ${y}px) rotate(-3deg)`;
  });
  idxWrap.addEventListener('pointerleave', () => preview.classList.remove('is-on'));

  /* drawer (index variant) */
  const drawer = $('#drawer'), shade = $('#shade');
  let returnFocus = null, drawerIdx = -1;
  function openDrawer(i) {
    drawerIdx = i;
    if (!returnFocus) returnFocus = document.activeElement;
    preview.classList.remove('is-on');
    parkBlocks();
    $('#drawerKind').textContent = `0${i + 1} / 05 · ${WORK[i].kind}`;
    $('#drawerTitle').textContent = WORK[i].title;
    $('#drawerBody').replaceChildren(...detailFor(i, true));
    // No wrap-around: the first project has no Previous, the last has no Next.
    [['#drawerPrev', i - 1], ['#drawerNext', i + 1]].forEach(([sel, j]) => {
      const b = $(sel); b.hidden = j < 0 || j >= WORK.length;
      if (!b.hidden) $('span', b).textContent = WORK[j].title;
    });
    renderFlow(); renderMatrix(); runDiamond(); runObesity();
    drawer.hidden = false; shade.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#drawerClose').focus();
  }
  function closeDrawer() {
    drawer.hidden = true; shade.hidden = true; drawerIdx = -1;
    document.body.style.overflow = '';
    parkBlocks();
    if (returnFocus) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  }
  $('#drawerClose').addEventListener('click', closeDrawer);
  shade.addEventListener('click', closeDrawer);
  $('#drawerPrev').addEventListener('click', () => { if (drawerIdx > 0) openDrawer(drawerIdx - 1); });
  $('#drawerNext').addEventListener('click', () => { if (drawerIdx < WORK.length - 1) openDrawer(drawerIdx + 1); });
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Tab') {
      const f = $$('a, button, input, summary', drawer).filter((x) => x.offsetParent);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- platform workflow ---------- */
  function renderFlow() {
    const box = $('.flow-steps');
    box.replaceChildren(...STEPS.map((s, i) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(i === state.step), class: i < state.step ? 'is-done' : '',
      onclick: () => { state.step = i; renderFlow(); } }, h('small', {}, '0' + (i + 1)), h('b', {}, s[0]))));
    $('#flowBar').style.width = ((state.step + 1) * 25) + '%';
    const s = STEPS[state.step], det = $('#flowDetail');
    det.replaceChildren(h('b', {}, `${s[0]} · ${s[1]}`), h('p', {}, s[2]));
    det.style.animation = 'none'; void det.offsetWidth; det.style.animation = '';
  }

  /* ---------- research matrix ---------- */
  function renderMatrix() {
    const cell = (id, label) => id
      ? h('button', { type: 'button', class: id === 'res-ft' ? 'is-best' : '', 'aria-pressed': String(state.cond === id), onclick: () => { state.cond = id; renderMatrix(); } }, label)
      : h('span', { class: 'off', 'aria-hidden': 'true' });
    const rows = [
      ['ViT-Small', cell('vit-fe', 'Pretrained'), cell('vit-ft', 'Pretrained'), cell(null)],
      ['ResNet-18', cell('res-fe', 'Pretrained'), cell('res-ft', '96.3% ◆'), cell(null)],
      ['KAN-Transformer', cell(null), cell(null), cell('kan-sc', 'Trained')],
      ['MLP-Transformer', cell(null), cell(null), cell('mlp-sc', 'Matched')]
    ];
    $('#matrix').replaceChildren(h('span'), ...['Feature extraction', 'Full fine-tuning', 'From scratch'].map((c) => h('span', { class: 'mh' }, c)),
      ...rows.flatMap(([n, ...cells]) => [h('span', { class: 'rh' }, n), ...cells]));
    const c = CONDS[state.cond];
    $('#condNote').replaceChildren(h('b', {}, c[0]), ' — ', c[1]);
  }

  /* ---------- labs ---------- */
  let diamond = null, tree = null;
  fetch('assets/diamond-model.json').then((r) => r.json()).then((m) => { diamond = m; runDiamond(); }).catch(() => {});
  fetch('assets/obesity-model.json').then((r) => r.json()).then((m) => { tree = m; runObesity(); }).catch(() => {});
  ['dx', 'dy', 'dz'].forEach((id) => $('#' + id).addEventListener('input', runDiamond));
  function runDiamond() {
    const v = ['dx', 'dy', 'dz'].map((id) => Number($('#' + id).value));
    ['dx', 'dy', 'dz'].forEach((id, i) => { $('#' + id + 'v').textContent = v[i].toFixed(2); });
    if (!diamond) return;
    const est = diamond.intercept + v.reduce((s, x, i) => s + x * diamond.coefficients[i], 0);
    const [lo, hi] = diamond.observed_price_range;
    // Real diamonds keep width ≈ length and depth ≈ 61.5% of length; the 500-row data has no other shapes.
    const [x, y, z] = v, odd = Math.abs(y / x - 1) > 0.06 || z / x < 0.55 || z / x > 0.68;
    $('#dPrice').textContent = est > 0 ? '$' + Math.round(est).toLocaleString('en-US') : '—';
    $('#dNote').textContent = est <= 0 ? 'No estimate: this shape is outside anything in the project data'
      : odd ? 'Unusual proportions for a real diamond (width ≈ length, depth ≈ 61% of length), so treat this estimate loosely'
      : est >= lo && est <= hi ? 'Estimated price from the coursework regression'
      : 'Outside the prices seen in the project data ($326–$2,830)';
  }
  const flags = { fam: 1, scc: 0, walk: 0 };
  $$('.toggle[data-flag]').forEach((b) => b.addEventListener('click', () => { flags[b.dataset.flag] = flags[b.dataset.flag] ? 0 : 1; b.setAttribute('aria-pressed', String(!!flags[b.dataset.flag])); runObesity(); }));
  ['oh', 'ow'].forEach((id) => $('#' + id).addEventListener('input', runObesity));
  function runObesity() {
    const hgt = Number($('#oh').value), wgt = Number($('#ow').value);
    $('#ohv').textContent = hgt; $('#owv').textContent = wgt;
    if (!tree) return;
    const x = [hgt / 100, wgt, flags.fam, flags.scc, flags.walk];
    let n = 0;
    while (tree.feature[n] >= 0) n = x[tree.feature[n]] <= tree.threshold[n] ? tree.left[n] : tree.right[n];
    $('#oLabel').textContent = CLASSES[tree.prediction[n]];
  }

  const aForm = $('#animalForm'), aFile = $('#animalFile'), aPrev = $('#animalPreview'), aRes = $('#animalResult');
  let session = null, head = null, ortP = null, url = null;
  aFile.addEventListener('change', () => {
    const f = aFile.files[0]; if (!f) return;
    if (url) URL.revokeObjectURL(url);
    url = URL.createObjectURL(f); aPrev.src = url; aPrev.hidden = false;
    aRes.replaceChildren(h('span', {}, 'Ready to classify this photo.'));
  });
  const loadOrt = () => ortP || (ortP = new Promise((res, rej) => {
    if (window.ort) return res(window.ort);
    const s = h('script', { src: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/ort.min.js', crossorigin: 'anonymous' });
    s.onload = () => res(window.ort); s.onerror = () => { ortP = null; rej(new Error('runtime')); }; document.head.append(s);
  }));
  aForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = aFile.files[0]; if (!f) { aFile.click(); return; }
    const btn = $('button[type=submit]', aForm); btn.disabled = true;
    try {
      aRes.replaceChildren(h('span', {}, 'Loading the model…'));
      const ort = await loadOrt();
      ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/';
      ort.env.wasm.numThreads = 1;
      head = head || await (await fetch('assets/animal-head.json')).json();
      session = session || await ort.InferenceSession.create('assets/mobilenetv2-animals.onnx', { executionProviders: ['wasm'] });
      aRes.replaceChildren(h('span', {}, 'Analyzing locally…'));
      const bmp = await createImageBitmap(f);
      const c = document.createElement('canvas'); c.width = c.height = 224;
      const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(bmp, 0, 0, 224, 224); bmp.close();
      const px = ctx.getImageData(0, 0, 224, 224).data, P = 224 * 224, data = new Float32Array(3 * P);
      const mean = [0.485, 0.456, 0.406], std = [0.229, 0.224, 0.225];
      for (let i = 0; i < P; i++) for (let ch = 0; ch < 3; ch++) data[ch * P + i] = (px[i * 4 + ch] / 255 - mean[ch]) / std[ch];
      const out = await session.run({ input: new ort.Tensor('float32', data, [1, 3, 224, 224]) });
      const feat = out.output.data;
      const logits = head.coefficients.map((w, k) => { let v = head.intercepts[k]; for (let j = 0; j < feat.length; j++) v += w[j] * (feat[j] - head.feature_mean[j]) / head.feature_scale[j]; return v; });
      const mx = Math.max(...logits), ex = logits.map((v) => Math.exp(v - mx)), tot = ex.reduce((a, b) => a + b, 0);
      const ranked = ex.map((v, k) => ({ k, p: v / tot })).sort((a, b) => b.p - a.p);
      const name = (k) => head.labels[k];
      const top = ranked[0], pct = Math.round(top.p * 100);
      aRes.replaceChildren(
        h('b', {}, (top.p < 0.42 ? 'Closest match: ' : '') + name(top.k)),
        h('div', { class: 'meter' }, h('i', { style: `width:${pct}%` })),
        h('span', {}, `${pct}% relative confidence among the nine classes`),
        h('span', {}, `Next: ${name(ranked[1].k)} ${Math.round(ranked[1].p * 100)}% · ${name(ranked[2].k)} ${Math.round(ranked[2].p * 100)}%`));
    } catch (_) {
      aRes.replaceChildren(h('span', {}, 'The model could not load. Check your connection and try again.'));
    } finally { btn.disabled = false; }
  });

  /* ---------- journey ---------- */
  function renderTimeline() {
    const tl = $('#timeline');
    $$('.tl-btn', tl).forEach((b) => b.remove());
    MILES.forEach((m, i) => tl.append(h('button', { type: 'button', role: 'tab', class: 'tl-btn' + (i <= state.mile ? ' is-past' : ''), 'aria-selected': String(i === state.mile),
      onclick: () => { state.mile = i; renderTimeline(); } }, h('span', { class: 'tl-dia', 'aria-hidden': 'true' }), h('small', {}, m[0]), h('b', {}, m[1]))));
    $('#tlFill').style.width = (state.mile * 25 + 3) + '%';
    const m = MILES[state.mile], p = $('#tlPanel');
    p.replaceChildren(h('small', {}, m[0]), h('div', {}, h('b', {}, m[1]), h('p', {}, m[2])));
    p.style.animation = 'none'; void p.offsetWidth; p.style.animation = '';
  }

  /* ---------- toolkit: filter + chips ---------- */
  function renderTools() {
    const tabs = [['All', -1], ...TOOLS.map((g, i) => [g[0], i])];
    $('#tkTabs').replaceChildren(...tabs.map(([label, i]) => h('button', { type: 'button', 'aria-pressed': String(state.tk === i), onclick: () => { state.tk = i; renderTools(); } }, label)));
    $('#toolsBody').replaceChildren(h('ul', { class: 'tools-chips' }, TOOLS.flatMap(([, items], gi) => items.map((name) =>
      h('li', { class: state.tk === -1 ? '' : (state.tk === gi ? 'on' : 'off') }, h('i', { class: 'dia', 'aria-hidden': 'true' }), name)))));
  }

  /* ---------- closing tiles ---------- */
  const copyBtn = $('#copyEmail');
  copyBtn.addEventListener('click', async () => {
    let ok = false;
    try { await navigator.clipboard.writeText('ahmedalyzeed@gmail.com'); ok = true; } catch (_) {
      const r = document.createRange(); r.selectNodeContents($('#emailText'));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
    }
    copyBtn.textContent = ok ? 'Copied ✓' : 'Selected — press Ctrl+C';
    setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 2000);
  });
  const magnet = $('#magnet');
  magnet.addEventListener('pointermove', (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = magnet.getBoundingClientRect();
    magnet.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .3}px, ${(e.clientY - r.top - r.height / 2) * .3}px) rotate(45deg)`;
  });
  magnet.addEventListener('pointerleave', () => { magnet.style.transform = ''; });

  /* ---------- on-scroll touches: current nav item, counters ---------- */
  const navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    const sections = navLinks.map((a) => $(a.getAttribute('href')));
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) navLinks.forEach((a, i) => a.classList.toggle('is-current', sections[i] === e.target));
    }), { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => s && io.observe(s));
  }
  const counted = new WeakSet();
  const countObs = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || counted.has(e.target)) return; counted.add(e.target);
    const el = e.target, end = Number(el.dataset.count), dec = Number(el.dataset.dec || 0), suf = el.dataset.suffix || '', grp = !!el.dataset.group;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 1100), v = end * (1 - Math.pow(1 - p, 4));
      el.textContent = v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: grp }) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .6 }) : null;
  if (countObs) $$('[data-count]').forEach((el) => countObs.observe(el));

  /* ---------- theme toggle ---------- */
  const rootEl = document.documentElement, themeBtn = $('#themeToggle');
  const THEME_BG = { dark: '#0e0f12', light: '#eceff4' };
  function applyTheme(t) {
    rootEl.classList.add('theme-swap');             // swap every color at once, no staggered transitions
    rootEl.setAttribute('data-theme', t);
    void rootEl.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => rootEl.classList.remove('theme-swap')));
    const label = t === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
    themeBtn.setAttribute('aria-label', label); themeBtn.title = label;
    const meta = $('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', THEME_BG[t]);
  }
  themeBtn.addEventListener('click', () => {
    const next = rootEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next); store.set('portfolio-theme', next);
  });
  // Until the visitor picks, keep following the system setting.
  const sysLight = window.matchMedia && matchMedia('(prefers-color-scheme: light)');
  if (sysLight && sysLight.addEventListener) sysLight.addEventListener('change', (e) => { if (!store.get('portfolio-theme')) applyTheme(e.matches ? 'light' : 'dark'); });
  applyTheme(rootEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark');


  renderIndex(); renderTimeline(); renderTools();
})();
