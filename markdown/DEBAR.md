---
Title: "DEBAR"
Tags: ["DL architecture", "FSE", "Read", "numerical"]
Authors: ['Zhang', 'Yuhao', 'Ren', 'Luyao', 'Chen', 'Liqian', 'Xiong', 'Yingfei', 'Cheung', 'Shing-Chi', 'Xie', 'Tao']
Collections: ["patch detection ▸ DL"]
Conference: ESEC/FSE
Date Added: October 23, 2023 8:45 AM (UTC)
Short Title: DEBAR
Text: 使用abstraction方法静态分析检测DL architecture中的numerical bugs
Full Title: "Detecting numerical bugs in neural network architectures"
URL: https://doi.org/10.1145/3368089.3409720
Year: 2020
code: https://github.com/ForeverZyh/DEBAR
---
# Detecting numerical bugs in neural network architectures

code: [https://github.com/ForeverZyh/DEBAR](https://github.com/ForeverZyh/DEBAR)

video: [https://www.youtube.com/watch?v=I73na_Au5qw](https://www.youtube.com/watch?v=I73na_Au5qw)

使用abstraction方法静态分析检测DL architecture中的numerical bugs

包括两种abstraction，一种是针对tensor的abstraction，一种是针对numerical的abstraction。

已有方法

- tensor
    - array expansion, array smashing, tensor partitioning
- numerical
    - interval abstraction, affine relation analysis

计算每个节点的输入范围，判断输入是否在函数的invalid range内。

[https://github.com/tensorflow/models/blob/13e7c85d521d7bb7cba0bf7d743366f7708b9df7/research/object_detection/box_coders/faster_rcnn_box_coder.py#L80](https://github.com/tensorflow/models/blob/13e7c85d521d7bb7cba0bf7d743366f7708b9df7/research/object_detection/box_coders/faster_rcnn_box_coder.py#L80)