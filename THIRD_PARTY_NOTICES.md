# Third-party notices

## MobileNetV2 ONNX model

`assets/mobilenetv2-animals.onnx` is the MobileNetV2 INT8 model distributed by the ONNX Model Zoo.

- Source: https://huggingface.co/onnxmodelzoo/legacy_models/tree/main/validated/vision/classification/mobilenet/model
- Architecture paper: https://arxiv.org/abs/1801.04381
- License: Apache License 2.0 — https://www.apache.org/licenses/LICENSE-2.0

The published model is used as a feature backbone. Ahmed's nine-class coursework head is stored separately in `assets/animal-head.json`.

## ONNX Runtime Web

The animal demo loads ONNX Runtime Web 1.30.0 on demand from jsDelivr.

- Project: https://github.com/microsoft/onnxruntime
- License: MIT — https://github.com/microsoft/onnxruntime/blob/main/LICENSE
