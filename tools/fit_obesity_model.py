"""Train a compact portfolio classifier on the original coursework CSV.

The saved GaussianNB notebook report did not reproduce from its supplied CSV.
This model is a separately evaluated decision tree, not the notebook model.

Usage: python tools/fit_obesity_model.py path/to/obesity.csv [--stdout]
Requires NumPy and scikit-learn for authoring; the public site uses plain JS.
"""

import csv
import json
import sys
from pathlib import Path

import numpy as np
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.tree import DecisionTreeClassifier


if len(sys.argv) not in (2, 3):
    raise SystemExit("Usage: python tools/fit_obesity_model.py path/to/obesity.csv [--stdout]")

FEATURES = ["Height", "Weight", "family_history_with_overweight", "SCC", "MTRANS_Walking"]
LABELS = [
    "Insufficient weight",
    "Normal weight",
    "Overweight level I",
    "Overweight level II",
    "Obesity type I",
    "Obesity type II",
    "Obesity type III",
]

rows = []
with open(sys.argv[1], newline="", encoding="utf-8-sig") as source:
    for row in csv.DictReader(source):
        rows.append(([float(row[name]) for name in FEATURES], int(row["NObeyesdad"])))

X = np.asarray([item[0] for item in rows], dtype=float)
y = np.asarray([item[1] for item in rows], dtype=int)
if len(X) < 100 or not np.isfinite(X).all() or set(np.unique(y)) != set(range(7)):
    raise ValueError("Unexpected input data or encoded labels")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)
model = DecisionTreeClassifier(max_depth=8, min_samples_leaf=8, random_state=0)
cv_accuracy = float(cross_val_score(model, X_train, y_train, cv=5).mean())
model.fit(X_train, y_train)
tree = model.tree_

artifact = {
    "model": "decision_tree",
    "features": FEATURES,
    "labels": LABELS,
    "source_rows": len(X),
    "training_rows": len(X_train),
    "test_rows": len(X_test),
    "cv_accuracy": cv_accuracy,
    "test_accuracy": float(model.score(X_test, y_test)),
    "feature_ranges": {name: [float(X[:, i].min()), float(X[:, i].max())] for i, name in enumerate(FEATURES)},
    "left": tree.children_left.tolist(),
    "right": tree.children_right.tolist(),
    "feature": tree.feature.tolist(),
    "threshold": [round(float(value), 7) for value in tree.threshold],
    "prediction": model.classes_[tree.value[:, 0, :].argmax(axis=1)].tolist(),
    "method": "New portfolio decision tree on the coursework CSV; 70/30 split with random_state=0; depth 8 and minimum leaf size 8 selected with training cross-validation.",
}

serialized = json.dumps(artifact, separators=(",", ":")) + "\n"
if len(sys.argv) == 3 and sys.argv[2] == "--stdout":
    sys.stdout.write(serialized)
else:
    output = Path(__file__).resolve().parents[1] / "assets" / "obesity-model.json"
    output.write_text(serialized, encoding="utf-8")
    print("Built assets/obesity-model.json")
