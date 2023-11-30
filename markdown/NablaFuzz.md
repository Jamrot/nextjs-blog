---
Title: "NablaFuzz"
Tags: ["2023", "DL framework", "ICSE", "Read", "differential fuzzing"]
Authors: ['Yang', 'Chenyuan', 'Deng', 'Yinlin', 'Yao', 'Jiayi', 'Tu', 'Yuxing', 'Li', 'Hanchi', 'Zhang', 'Lingming']
Collections: ["patch detection ▸ DL"]
Conference: ICSE
Date Added: November 10, 2023 11:30 AM (UTC)
Short Title: NablaFuzz
Text: 使用differential fuzzing测试automatic differentiation (AD)环节的API在不同的执行场景下的输出/梯度的一致性
Full Title: "Fuzzing Automatic Differentiation in Deep-Learning Libraries"
URL: https://ieeexplore.ieee.org/document/10172523
Year: 2023
code: https://github.com/ise-uiuc/NablaFuzz
---
# Fuzzing Automatic Differentiation in Deep-Learning Libraries

code: [https://github.com/ise-uiuc/NablaFuzz](https://github.com/ise-uiuc/NablaFuzz)

## Introduction

现有的技术主要关注于**DL模型的推理阶段**或**直接执行DL API**，而忽视了DL系统的自动微分（automatic differentiation，AD）环节。AD是许多DL算法的基础，尤其是在反向传播算法中严重依赖AD来进行差分运算。

AD中的错误会导致在模型训练过程中的问题，导致模型训练不当，甚至导致训练过程的crash造成资源浪费或潜在的DoS攻击。

虽然**Muffin**可以对训练阶段的DL模型进行测试，但Muffin（1）手动标注DL API的输入约束，导致Muffin只能覆盖一小部分API。（2）使用Keras及其支持的后端TensorFlow、Theano和CNTK，但自2019年Keras 2.3.0起Keras只支持TensorFlow作为后端。（3）不能完全测试DL库中的自动微分（AD）引擎：只涵盖了部分反向模式AD，并忽略了前向模式AD。

∇Fuzz在PyTorch, TensorFlow, JAX, and OneFlow 4个DL库上对∇Fuzz进行测试，发现了173个bugs，其中144已经被开发者确认（117个未知，107个AD相关），38个已被修复。

## Background

### Automatic Differentiation

## Approach

<img src="/NablaFuzz/Untitled.png" className="img"/>
∇Fuzz用于全面测试DL库的AD引擎

- API-level testing
- DL库中的API可以被抽象成一个处理张量/向量的函数
- Oracle：API在不同的执行场景（使用不同方法实现输出/梯度计算）下的输出/梯度的一致性
- e.g., 相同的DL API可以在没有AD模式或者不同的AD模式下执行，但是API的输出和梯度在不同情况下应该是一致的。
- 可以应用于API的梯度函数，比较不同阶次的梯度计算结果，测试和验证*高阶梯度计算*的正确性。
- 应用自动过滤策略减少由于numerical instability造成的误报

## Results

### Bug - rejected inconsistency

> Figure 10 shows an instance of JAX API jax.numpy.sinc(x) [61], which computes sin(πx)/(πx). When the input x has the lowest precision floating datatype bfloat16 [62], this API will have different gradients computed in forward mode and reverse mode AD. We reported this inconsistency to JAX developer, however, it was rejected: *“This is a consequence of the intended design of bfloat16.It is a worthwhile tradeoff for speed in deep learning contexts...”.*
> 
> 
<img src="/NablaFuzz/Untitled%201.png" className="img"/>> 

<img src="/NablaFuzz/Untitled%202.png" className="img"/>
---

### API-level testing

- API-level testing 可以减少floating-point precision loss，降低误报率。

**直接执行DL API为什么不能有效检测AD环节API的问题？（现有API fuzzing技术为什么没法检测到文中针对automatic differential engine related API bugs？automatic differential engine related API bugs有什么特点？）**

目前直接执行DL API的方法主要针对的是推理阶段，但没有考虑到训练阶段的关键组件automatic differentiation (AD)。

******************************************************************************NablaFuzz找到的AD相关bugs的root cause和影响都是什么？******************************************************************************