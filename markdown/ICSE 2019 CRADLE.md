---
Title: ICSE 2019 | CRADLE
Tags: ["DL framework", "paper"]
Created time: November 16, 2023 12:26 PM
Text: 基于Keras(High level API)使用不同深度学习后端(e.g., TensorFlow)运行预训练模型，检测并定位不同深度学习后端的不一致性问题。
---
# CRADLE: Cross-Backend Validation to Detect and Localize Bugs in Deep Learning Libraries

related-code: [https://github.com/sunshinezxf/cradle4dl](https://github.com/sunshinezxf/cradle4dl)

现有工作着重于检测DL模型而不是模型的实现（例如DL库）。测试DL库的一个挑战在于，对于一个给定输入难以得知其期望的输出是什么。fortunately, 对于同样的DL算法在不同DL库中都有实现。

CRADLE用于发现并定位DL库中的错误。CRADLE（1）使用cross-implementation不一致性检查去检测DL库中的错误，并且（2）利用异常传播跟踪和分析定位DL库中导致错误的函数。

作者在TensorFlow, CNTK, Theano3个DL库，11 个数据集（包括 ImageNet、MNIST 和 KGS Go game）和 30 个预训练模型中对CRADLE进行测试，检测到 12 个错误和104 个不一致性问题，并找到了与所有 104 个不一致性问题相关的函数。

## Introduction

开发者使用high-level library API（例如Keras API），这些API使用low-level libraries实现具体的深度学习算法。low-level library例如TensorFlow, Theano， CNTK实现同样的算法，例如，卷积神经网络CNN和循环神经网络RNN。Low-level libraries使用不同的输入格式并且提供不同的API，而high-level library允许用户在low-level libraries之间无缝切换。

<img src="/ICSE 2019 CRADLE/Untitled.png" className="img"/>

### Challenge

C1: 对于一个给定输入难以确定其期望的输出是什么

→使用distance metrics比较模型在不同后端输出的不一致性

C2: 确定深度学习库里导致错误的函数是什么

→通过执行图追踪异常传播，识别两个后端之间差异幅度的峰值，确定导致不一致性的函数。

### Research Question

RQ1: CRADLE能否检测到深度学习后端的错误和不一致性

- CRADLE检测到12个会导致不一致性的bug，其中3个是之前未知的bug（2个已经被开发者确认），9个已经被开发者修复。

RQ2: CRADLE能否定位到导致不一致性的原因

- CRADLE可以标注出所有导致104个不一致性的相关函数。

RQ3: CRADLE检测和定位的效率（时间）如何？

- CRADLE运行时间中位数小于5min。

## Approach

CRADLE如何检测和定位多种后端间的不一致性问题。

后端由low-level libraries以及low-level libraries和high-level libraries的接口组成。

例如，TensorFlow后端包括TensorFlow library，Keras与TensorFlow的接口，以及TensorFlow 调用的 GPU 计算库 Nvidia CUDA。

<img src="/ICSE 2019 CRADLE/Untitled 1.png" className="img"/>

（1）检测阶段

- 输入：预训练深度学习模型和validation data
- CRADLE使用不同深度学习后端运行预训练模型
- 如何确定inconsistency是否能被接受（是不是inconsistency bug？）→使用两种distance metrics

（2）定位阶段

## Results

### Crash bugs

发生在所有后端的3个Keras bugs，以及2个后端bugs。上述bugs通常是由错误的权重或者卷积核shapes引起，都已被修复。

### Inconsistency bugs

<img src="/ICSE 2019 CRADLE/Untitled 2.png" className="img"/>

CRADLE为每个inconsistent input生成一个localization map。通过关注first localized inconsistent execution以及每个图中的high inconsistency introduction rates，人工将104个不一致性问题聚类为7个bugs。

<img src="/ICSE 2019 CRADLE/Untitled 3.png" className="img"/>

## Limitations

- CRADLE可能错失导致internal errors但不会导致failures（即不正确的外部行为）的不一致。【看不懂什么意思】
- 方法泛化性能差

## Related Work

- 机器学习库测试
    - 使用majority votes检测机器学习算法之间的不一致性
    - 通过对训练和测试数据应用转换来检测不一致【也没看懂】
- 深度学习模型对抗性测试
- 差分测试&不一致性检测
- debugging&fault localization