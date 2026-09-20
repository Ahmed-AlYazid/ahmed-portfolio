"""Reproduce the coursework's 80/20 linear regression from its diamonds5.csv.

Usage: python tools/fit_diamond_model.py path/to/diamonds5.csv
The private source CSV is intentionally excluded from the public repository.
"""

import csv
import json
import sys
from pathlib import Path

import numpy as np


if len(sys.argv) != 2:
    raise SystemExit("Usage: python tools/fit_diamond_model.py path/to/diamonds5.csv")

rows = []
with open(sys.argv[1], newline="", encoding="utf-8-sig") as source:
    for row in csv.DictReader(source):
        rows.append([float(row[key]) for key in ("x", "y", "z", "price")])

data = np.array(rows, dtype=float)
if len(data) < 10 or not np.isfinite(data).all():
    raise ValueError("Expected at least ten complete numeric rows")

# sklearn train_test_split(test_size=0.2, random_state=42) uses this
# RandomState permutation and takes its first ceil(20%) rows as the test set.
randomized = np.random.RandomState(42).permutation(len(data))
test_count = int(np.ceil(0.2 * len(data)))
test, train = randomized[:test_count], randomized[test_count:]
features = data[:, :3]
actual = data[:, 3]
design = np.column_stack([np.ones(len(train)), features[train]])
parameters = np.linalg.lstsq(design, actual[train], rcond=None)[0]
predicted = np.column_stack([np.ones(len(test)), features[test]]) @ parameters
residual = actual[test] - predicted

artifact = {
    "model": "linear_regression",
    "features": ["x", "y", "z"],
    "units": {"dimensions": "mm", "price": "USD"},
    "intercept": float(parameters[0]),
    "coefficients": [float(v) for v in parameters[1:]],
    "training_rows": len(train),
    "test_rows": len(test),
    "source_rows": len(data),
    "feature_ranges": {key: [float(np.min(features[:, n])), float(np.max(features[:, n]))] for n, key in enumerate(("x", "y", "z"))},
    "observed_price_range": [float(np.min(actual)), float(np.max(actual))],
    "test_metrics": {
        "mae": float(np.mean(np.abs(residual))),
        "rmse": float(np.sqrt(np.mean(residual**2))),
        "r2": float(1 - np.sum(residual**2) / np.sum((actual[test] - np.mean(actual[test]))**2)),
    },
    "method": "Coursework 80/20 split, random_state=42, ordinary least squares on x/y/z; coefficients reproduced from the original 500-row CSV.",
}

output = Path(__file__).resolve().parents[1] / "assets" / "diamond-model.json"
output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
print("Built assets/diamond-model.json")
