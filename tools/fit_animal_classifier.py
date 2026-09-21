"""Fit and evaluate a nine-class head on the original animal coursework images.

Authoring dependencies: onnxruntime, scikit-learn, Pillow, NumPy.
Input images and the pretrained model are intentionally stored outside the
public repository; only the validated compact head is exported.
"""

import json
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageOps
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.preprocessing import StandardScaler


LABELS = ["bear", "cat", "dog", "elephant", "goat", "horse", "lion", "tiger", "wolf"]
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def main(image_root: str, model_path: str, output_path: str) -> None:
    files = [(path, index) for index, label in enumerate(LABELS)
             for path in sorted((Path(image_root) / label).glob("*"))]
    session = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"],
                                   sess_options=ort.SessionOptions())
    vectors = []
    targets = []
    skipped = []
    for index, (path, label) in enumerate(files, 1):
        try:
            with Image.open(path) as raw:
                image = ImageOps.exif_transpose(raw).convert("RGB").resize((224, 224))
                values = np.asarray(image, dtype=np.float32) / 255
            values = ((values - MEAN) / STD).transpose(2, 0, 1)[None]
            vectors.append(session.run(None, {"input": values})[0][0])
            targets.append(label)
        except Exception as exc:
            skipped.append((path.name, str(exc)))
        if index % 100 == 0 or index == len(files):
            print(f"Extracted {index}/{len(files)} images; skipped {len(skipped)}", flush=True)
    X = np.asarray(vectors, dtype=np.float32)
    y = np.asarray(targets)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y)
    scaler = StandardScaler().fit(X_train)
    train = scaler.transform(X_train)
    test = scaler.transform(X_test)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    candidates = {}
    for C in (0.01, 0.1, 1.0, 10.0):
        classifier = LogisticRegression(C=C, max_iter=2000)
        candidates[C] = float(cross_val_score(classifier, train, y_train, cv=cv).mean())
    best_c = max(candidates, key=candidates.get)
    classifier = LogisticRegression(C=best_c, max_iter=2000).fit(train, y_train)
    predictions = classifier.predict(test)
    report = classification_report(y_test, predictions, target_names=LABELS, output_dict=True)
    data = {
        "labels": LABELS,
        "model": "MobileNetV2 INT8 ImageNet logits + coursework-trained multinomial logistic regression",
        "source_images": int(len(X)),
        "training_images": int(len(X_train)),
        "test_images": int(len(X_test)),
        "cross_validation_accuracy": round(candidates[best_c], 6),
        "test_accuracy": round(float(accuracy_score(y_test, predictions)), 6),
        "per_class_recall": {label: round(report[label]["recall"], 4) for label in LABELS},
        "selected_C": best_c,
        "preprocessing": "RGB, resize 224x224, divide by 255, ImageNet mean/std, NCHW",
        "feature_mean": np.round(scaler.mean_, 6).tolist(),
        "feature_scale": np.round(scaler.scale_, 6).tolist(),
        "coefficients": np.round(classifier.coef_, 6).tolist(),
        "intercepts": np.round(classifier.intercept_, 6).tolist(),
        "skipped_images": len(skipped),
    }
    Path(output_path).write_text(json.dumps(data, separators=(",", ":")), encoding="utf-8")
    print(json.dumps({key: data[key] for key in ("source_images", "training_images", "test_images",
                     "cross_validation_accuracy", "test_accuracy", "per_class_recall",
                     "selected_C", "skipped_images")}, indent=2), flush=True)
    if skipped:
        print(f"Skipped {len(skipped)} unreadable image files.")


if __name__ == "__main__":
    main(*sys.argv[1:])
