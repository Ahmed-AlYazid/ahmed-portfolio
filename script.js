(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('primaryNav');

  let saved = null;
  try { saved = localStorage.getItem('portfolio-theme'); } catch (_) {}
  const systemLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  root.dataset.theme = saved || (systemLight ? 'light' : 'dark');

  function updateThemeLabel() {
    const label = root.dataset.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
    toggle?.setAttribute('aria-label', label);
    toggle?.setAttribute('title', label);
  }
  updateThemeLabel();

  toggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    updateThemeLabel();
    try { localStorage.setItem('portfolio-theme', next); } catch (_) {}
  });

  function closeMenu() {
    nav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open menu');
  }

  menuToggle?.addEventListener('click', () => {
    const open = !nav?.classList.contains('is-open');
    nav?.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
      closeMenu();
      menuToggle?.focus();
    }
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('backToTop')?.addEventListener('click', (event) => {
    event.preventDefault();
    if (window.location.hash !== '#top') history.pushState(null, '', '#top');
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  const progressBar = document.getElementById('scrollProgress');
  const sectionLinks = [...document.querySelectorAll('#primaryNav a[href^="#"]')]
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter(({ section }) => section);
  let scrollFrame = 0;

  function updatePagePosition() {
    scrollFrame = 0;
    const scrollLimit = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progressBar?.style.setProperty('transform', `scaleX(${Math.min(1, Math.max(0, window.scrollY / scrollLimit))})`);
    const marker = window.scrollY + Math.min(240, window.innerHeight * .34);
    let activeLink = null;
    sectionLinks.forEach(({ link, section }) => {
      if (section.offsetTop <= marker) activeLink = link;
      link.removeAttribute('aria-current');
    });
    activeLink?.setAttribute('aria-current', 'location');
  }

  function schedulePagePosition() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updatePagePosition);
  }
  window.addEventListener('scroll', schedulePagePosition, { passive: true });
  window.addEventListener('resize', schedulePagePosition);
  updatePagePosition();

  const labsShell = document.getElementById('interactiveLabs');
  const labTabs = [...document.querySelectorAll('[data-lab-target]')];
  const labPanels = [...document.querySelectorAll('[data-lab-panel]')];

  if (labsShell && labTabs.length && labPanels.length) {
    labsShell.classList.add('is-enhanced');
    document.getElementById('labTabs')?.setAttribute('role', 'tablist');
    labTabs.forEach((tab) => {
      tab.setAttribute('role', 'tab');
      tab.id = `${tab.dataset.labTarget}-tab`;
      tab.setAttribute('aria-controls', tab.dataset.labTarget);
    });
    labPanels.forEach((panel) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `${panel.id}-tab`);
    });

    const activateLab = (targetId, { updateHash = false, scroll = false } = {}) => {
      if (!labPanels.some((panel) => panel.id === targetId)) return;
      labPanels.forEach((panel) => { panel.hidden = panel.id !== targetId; });
      labTabs.forEach((tab) => {
        const selected = tab.dataset.labTarget === targetId;
        tab.classList.toggle('is-active', selected);
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      if (updateHash && window.location.hash !== `#${targetId}`) history.pushState(null, '', `#${targetId}`);
      if (scroll) {
        requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start'
        }));
      }
      schedulePagePosition();
    };

    const requestedLab = window.location.hash.slice(1);
    activateLab(labPanels.some((panel) => panel.id === requestedLab) ? requestedLab : labPanels[0].id);
    if (labPanels.some((panel) => panel.id === requestedLab)) {
      requestAnimationFrame(() => document.getElementById(requestedLab)?.scrollIntoView({ block: 'start' }));
    }

    document.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href^="#"]');
      const targetId = link?.getAttribute('href').slice(1);
      if (!targetId || !labPanels.some((panel) => panel.id === targetId)) return;
      event.preventDefault();
      activateLab(targetId, { updateHash: true, scroll: true });
    });

    document.getElementById('labTabs')?.addEventListener('keydown', (event) => {
      const currentIndex = labTabs.indexOf(document.activeElement);
      if (currentIndex < 0) return;
      if (event.key === ' ') {
        event.preventDefault();
        activateLab(labTabs[currentIndex].dataset.labTarget, { updateHash: true, scroll: true });
        return;
      }
      let nextIndex = currentIndex;
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % labTabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + labTabs.length) % labTabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = labTabs.length - 1;
      else return;
      event.preventDefault();
      labTabs[nextIndex].focus();
    });

    window.addEventListener('popstate', () => {
      const targetId = window.location.hash.slice(1);
      if (labPanels.some((panel) => panel.id === targetId)) activateLab(targetId);
    });
  }

  const animalForm = document.getElementById('animalForm');
  const animalInput = document.getElementById('animalImage');
  const animalPreview = document.getElementById('animalPreview');
  const animalPreviewImage = document.getElementById('animalPreviewImage');
  const animalResult = document.getElementById('animalResult');
  const animalButton = animalForm?.querySelector('button[type="submit"]');
  let animalSession;
  let animalHead;
  let animalRuntimePromise;
  let previewUrl;

  animalInput?.addEventListener('change', () => {
    const file = animalInput.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    animalPreviewImage.src = previewUrl;
    animalPreview.hidden = false;
    animalResult.textContent = 'Ready to classify this image.';
  });

  function loadAnimalRuntime() {
    if (window.ort) return Promise.resolve(window.ort);
    if (animalRuntimePromise) return animalRuntimePromise;
    animalRuntimePromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/ort.min.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve(window.ort);
      script.onerror = () => reject(new Error('Runtime unavailable'));
      document.head.append(script);
    });
    return animalRuntimePromise;
  }

  async function imageToTensor(file, ort) {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(bitmap, 0, 0, 224, 224);
    bitmap.close();
    const rgba = context.getImageData(0, 0, 224, 224).data;
    const values = new Float32Array(3 * 224 * 224);
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];
    const plane = 224 * 224;
    for (let pixel = 0; pixel < plane; pixel += 1) {
      const offset = pixel * 4;
      values[pixel] = (rgba[offset] / 255 - mean[0]) / std[0];
      values[plane + pixel] = (rgba[offset + 1] / 255 - mean[1]) / std[1];
      values[plane * 2 + pixel] = (rgba[offset + 2] / 255 - mean[2]) / std[2];
    }
    return new ort.Tensor('float32', values, [1, 3, 224, 224]);
  }

  animalForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = animalInput.files?.[0];
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) {
      animalResult.textContent = 'Please choose an image smaller than 12 MB.';
      return;
    }
    try {
      animalForm.setAttribute('aria-busy', 'true');
      animalButton.disabled = true;
      animalButton.textContent = 'Loading classifier…';
      animalResult.textContent = 'Loading the image model for this session…';
      const ort = await loadAnimalRuntime();
      ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/';
      ort.env.wasm.numThreads = 1;
      if (!animalHead) {
        const response = await fetch('assets/animal-head.json');
        if (!response.ok) throw new Error('Classifier unavailable');
        animalHead = await response.json();
      }
      if (!animalSession) {
        animalSession = await ort.InferenceSession.create('assets/mobilenetv2-animals.onnx', {
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all'
        });
      }
      animalResult.textContent = 'Analyzing the image locally…';
      animalButton.textContent = 'Analyzing image…';
      const tensor = await imageToTensor(file, ort);
      const output = await animalSession.run({ input: tensor });
      const features = output.output.data;
      const logits = animalHead.coefficients.map((weights, classIndex) => {
        let value = animalHead.intercepts[classIndex];
        for (let index = 0; index < features.length; index += 1) {
          const standardized = (features[index] - animalHead.feature_mean[index]) / animalHead.feature_scale[index];
          value += weights[index] * standardized;
        }
        return value;
      });
      const maxLogit = Math.max(...logits);
      const probabilities = logits.map((value) => Math.exp(value - maxLogit));
      const total = probabilities.reduce((sum, value) => sum + value, 0);
      const ranked = probabilities.map((value, index) => ({
        label: animalHead.labels[index],
        probability: value / total
      })).sort((a, b) => b.probability - a.probability);
      const top = ranked[0];
      const title = top.label.charAt(0).toUpperCase() + top.label.slice(1);
      animalResult.replaceChildren();
      const label = document.createElement('strong');
      label.textContent = top.probability < 0.42 ? `Closest match: ${title}` : title;
      const detail = document.createElement('span');
      detail.textContent = `${Math.round(top.probability * 100)}% relative confidence among the nine classes`;
      const meter = document.createElement('div');
      meter.className = 'confidence-meter';
      meter.setAttribute('aria-hidden', 'true');
      const meterFill = document.createElement('span');
      meterFill.style.setProperty('--confidence', `${Math.round(top.probability * 100)}%`);
      meter.append(meterFill);
      const alternatives = document.createElement('small');
      alternatives.textContent = `Next: ${ranked[1].label} ${Math.round(ranked[1].probability * 100)}% · ${ranked[2].label} ${Math.round(ranked[2].probability * 100)}%`;
      animalResult.append(label, detail, meter, alternatives);
    } catch (_) {
      animalResult.textContent = 'The image model could not load. Check your connection and try again.';
    } finally {
      animalForm.removeAttribute('aria-busy');
      animalButton.disabled = false;
      animalButton.textContent = 'Classify image';
    }
  });

  const diamondForm = document.getElementById('diamondForm');
  const diamondResult = document.getElementById('diamondResult');
  const readBoundedNumber = (field) => {
    const value = Number(field.value);
    const min = Number(field.dataset.min);
    const max = Number(field.dataset.max);
    const valid = Number.isFinite(value) && value >= min && value <= max;
    field.setCustomValidity(valid ? '' : `Enter a number from ${min} to ${max} using 0–9.`);
    return value;
  };
  document.querySelectorAll('[data-western-number]').forEach((field) => {
    field.addEventListener('input', () => field.setCustomValidity(''));
  });
  let diamondModel;
  diamondForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = ['x', 'y', 'z'].map((key) => diamondForm.elements[key]);
    const values = fields.map(readBoundedNumber);
    if (!diamondForm.reportValidity()) return;
    try {
      if (!diamondModel) {
        diamondResult.textContent = 'Loading the project model…';
        const response = await fetch('assets/diamond-model.json');
        if (!response.ok) throw new Error('Model unavailable');
        diamondModel = await response.json();
      }
      const estimate = diamondModel.intercept + values.reduce((sum, value, index) => sum + value * diamondModel.coefficients[index], 0);
      diamondResult.replaceChildren();
      const amount = document.createElement('strong');
      amount.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(estimate);
      const detail = document.createElement('span');
      detail.textContent = 'Estimated price from the coursework linear regression';
      diamondResult.append(amount, detail);
      if (estimate < diamondModel.observed_price_range[0] || estimate > diamondModel.observed_price_range[1]) {
        const warning = document.createElement('small');
        warning.textContent = 'Outside the prices observed in the project dataset; interpret cautiously.';
        diamondResult.append(warning);
      }
    } catch (_) {
      diamondResult.textContent = 'The model could not load. Please refresh and try again.';
    }
  });

  const obesityForm = document.getElementById('obesityForm');
  const obesityResult = document.getElementById('obesityResult');
  let obesityModel;
  obesityForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const height = readBoundedNumber(obesityForm.elements.height);
    const weight = readBoundedNumber(obesityForm.elements.weight);
    if (!obesityForm.reportValidity()) return;
    const values = [
      height / 100,
      weight,
      Number(obesityForm.elements.family.value),
      Number(obesityForm.elements.scc.value),
      Number(obesityForm.elements.walking.value)
    ];
    if (values.some((value) => !Number.isFinite(value))) return;
    try {
      if (!obesityModel) {
        obesityResult.textContent = 'Loading the project data model…';
        const response = await fetch('assets/obesity-model.json');
        if (!response.ok) throw new Error('Model unavailable');
        obesityModel = await response.json();
      }
      let node = 0;
      while (obesityModel.feature[node] >= 0) {
        const feature = obesityModel.feature[node];
        node = values[feature] <= obesityModel.threshold[node]
          ? obesityModel.left[node]
          : obesityModel.right[node];
      }
      obesityResult.replaceChildren();
      const label = document.createElement('strong');
      label.textContent = obesityModel.labels[obesityModel.prediction[node]];
      const detail = document.createElement('span');
      detail.textContent = 'Predicted class in the coursework dataset';
      const caution = document.createElement('small');
      caution.textContent = 'Educational model output only. It cannot determine a person’s health status.';
      obesityResult.append(label, detail, caution);
    } catch (_) {
      obesityResult.textContent = 'The model could not load. Please refresh and try again.';
    }
  });

})();
