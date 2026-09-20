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

  const diamondForm = document.getElementById('diamondForm');
  const diamondResult = document.getElementById('diamondResult');
  let diamondModel;
  diamondForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = ['x', 'y', 'z'].map((key) => Number(diamondForm.elements[key].value));
    if (values.some((value) => !Number.isFinite(value))) return;
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

})();
