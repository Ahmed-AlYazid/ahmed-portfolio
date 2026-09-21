# Ahmed Saeed Al Yazid — AI Portfolio

A lightweight, production portfolio for Ahmed Saeed Al Yazid, an Artificial Intelligence graduate working across machine learning, data science, and computer vision.

**Live site:** https://ahmed-portfolio-2e0.pages.dev/

## What the portfolio includes

- A production Arabic educational supervision platform
- A controlled team graduation research study in retinal image classification
- Three interactive coursework demonstrations:
  - Nine-class animal image classification
  - Diamond price regression
  - Obesity-dataset class prediction
- A downloadable, public-safe CV
- Responsive dark/light themes and reduced-motion support

## Technology

The portfolio uses plain HTML, CSS, and JavaScript. It has no framework, package manager, build step, or application server.

The small regression and decision-tree models run with native JavaScript. The animal classifier lazily loads ONNX Runtime Web only after the visitor asks to classify an image, keeping the initial page light. Images and form inputs are processed locally and are not uploaded.

## Structure

- `index.html` — content, SEO metadata, and the interactive lab markup
- `styles.css` — responsive visual system, themes, effects, and motion fallbacks
- `script.js` — navigation, themes, page progress, accessible lab switching, and model inference
- `assets/` — model artifacts, favicon, social card, and public CV
- `tools/` — reproducible authoring scripts for the CV, social card, and coursework models
- `404.html` — production not-found page
- `_headers` — Cloudflare Pages response headers
- `CONTENT_VERIFICATION.md` — sourcing and claim notes
- `THIRD_PARTY_NOTICES.md` — model and browser-runtime attribution

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`. A local HTTP server is required because the model JSON files are fetched by the page.

## Model artifacts

- `assets/diamond-model.json` reproduces the project notebook's 500-row linear regression using its x/y/z inputs, 80/20 split, and `random_state=42`.
- `assets/obesity-model.json` is a documented decision-tree retraining on the 2,086-row coursework CSV after the saved Gaussian Naive Bayes report failed to reproduce from that CSV.
- `assets/mobilenetv2-animals.onnx` is the Apache-2.0 ONNX Model Zoo MobileNetV2 INT8 backbone. `assets/animal-head.json` is a logistic-regression head trained on 827 readable images from Ahmed's nine coursework folders.

The private source datasets and school repository are not included.

## Deployment

Cloudflare Pages is connected to `Ahmed-AlYazid/ahmed-portfolio` with `main` as the production branch, no framework preset, no build command, and `.` as the output directory. Every push to `main` automatically deploys the static site over HTTPS.

Cloudflare Pages was chosen over GitHub Pages for this project because it provides the existing Git-based workflow plus preview deployments, response-header control, and alignment with Ahmed's production Cloudflare experience without adding a build pipeline.

## Content policy

The graduation project is presented as controlled, team-based research on synthetic images. The site does not claim clinical readiness, peer review, publication, or sole authorship. The educational platform's repository remains private and no school data or credentials are included.
