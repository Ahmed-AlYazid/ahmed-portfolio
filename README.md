# Ahmed Saeed Al Yazid — Portfolio

A lightweight, static portfolio for Ahmed Saeed Al Yazid, an Artificial Intelligence graduate. It highlights machine learning, data science, computer vision, a team graduation research study, and a live educational platform.

## Structure

- `index.html` — single-page portfolio and metadata
- `styles.css` — responsive layout and light/dark themes
- `script.js` — theme preference, mobile navigation, diamond model interaction, and copyright year
- `assets/` — favicon, social preview, and downloadable CV
- `tools/build_cv.py` — regenerates the public CV PDF from source-grounded text
- `tools/fit_diamond_model.py` — reproduces the diamond regression coefficients from Ahmed's coursework CSV
- `404.html` — not-found page
- `CONTENT_VERIFICATION.md` — public content sourcing notes

The site uses plain HTML, CSS, and JavaScript with no framework or runtime dependencies.

The interactive diamond predictor runs the coursework's linear regression in the visitor's browser. Its coefficients were reproduced from the original 500-row project CSV with the notebook's feature set and 80/20 split. The source CSV is kept out of this public repository. Inputs are not sent or stored.

## Run locally

From the repository root, run `python -m http.server 8000`, then open `http://localhost:8000/`.

To rebuild the CV, run `python tools/build_cv.py` with `reportlab` installed. This authoring dependency is not needed to serve the site.

To reproduce the diamond model, run `python tools/fit_diamond_model.py path/to/diamonds5.csv` with NumPy installed. The generated `assets/diamond-model.json` is small and needs no inference library at runtime.

## Deployment

Deployment target: connect Cloudflare Pages to the `main` branch of `Ahmed-AlYazid/ahmed-portfolio`. Use the **None** framework preset, no build command, and the repository root (`/`) as the build output directory. Each push to `main` then deploys automatically.

The production URL will be added after the first Pages deployment.

## Content policy

The graduation project is presented as controlled, team-based research on synthetic images. The site does not claim clinical readiness, peer review, publication, or sole authorship. The educational platform's source is private and is not linked here.
