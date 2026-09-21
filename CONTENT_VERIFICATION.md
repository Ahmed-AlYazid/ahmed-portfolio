# Content verification

This file records the sources available while preparing the public portfolio. It contains no private project data.

## Sources used

- The original CV supplied with the project was reviewed for name, degree, university, GPA, location, contact details, certifications, general skills, production platform summary, research summary, and three additional coursework projects. The public CV PDF was regenerated with unsupported coursework comparisons removed.
- Ahmed's project brief supplied on 20 September 2026: current platform URL and architecture, the research design and reported metrics, and the instruction to describe the graduation project as team research rather than a clinical product.
- Ahmed supplied his current phone number directly on 21 September 2026 for inclusion in the public CV.
- Private coursework notebooks in Ahmed's Google Drive, reviewed in the work browser: `Animals_Classification_Using_CNN.ipynb`, `Diamond_Price_Based_on_length,_width,_depth.ipynb`, and `Obesity_Risk.ipynb`. They support the frameworks, methods, and evaluation details used in the three coursework cards. The notebooks are not copied or linked publicly.
- The public platform URL was checked as a live link. The private implementation was not inspected for this portfolio repository.
- `diamonds5.csv` in the diamond project's Drive folder contains 500 records. Reproducing the notebook's x/y/z linear regression with its 80/20 split and `random_state=42` yielded the same MAE (241.0226), RMSE (329.2254), R² (0.90444), and sample estimate (356.5673) as the saved notebook output. Only the coefficients and test summary are published in `assets/diamond-model.json`; the source CSV remains private.
- The obesity project CSV contains 2,086 preprocessed records and five available features. Re-running the notebook's Gaussian Naive Bayes code against that CSV produced 27.8% held-out accuracy rather than the 95% shown in the saved report, so the portfolio does not publish the saved figure. A depth-limited decision tree was retrained with a 70/30 stratified split and training-only model selection. It produced 90.96% five-fold training CV accuracy and 89.62% held-out accuracy on 626 rows. The seven numeric class labels and three binary feature meanings were independently mapped by exact-row comparison with the public UCI source dataset.
- The animal project contains 830 files across nine folders: bear, cat, dog, elephant, goat, horse, lion, tiger, and wolf. Three files could not be decoded as images, leaving 827 images for training and evaluation. A new portfolio classifier uses an Apache-2.0 MobileNetV2 INT8 ImageNet backbone from the ONNX Model Zoo plus a multinomial logistic-regression head. With a stratified 75/25 split, training-only five-fold model selection produced 89.68% CV accuracy and 88.89% held-out accuracy on 207 images. This is clearly identified as a retraining; it is not represented as the original notebook model.
- The animal inference runtime is loaded only when requested. Visitor images remain in the browser and are not uploaded by the portfolio.

## Claims intentionally omitted

- Peer review or external publication of the graduation project.
- Ahmed's individual contribution to specific team research components.
- Independent validation of the reported research metrics beyond the CV and supplied brief.
- A separate object-detection project, because it was absent from the available CV and brief.
- The original animal notebook's saved validation score and the obesity notebook's saved 95% report, because they do not support the retrained interactive models shown in the portfolio.
- Preferred locations, remote-work availability, or current job-search status.

If Ahmed supplies the research report, project repositories, certificates, or updated career preferences, review them before adding new claims.
