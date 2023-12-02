---
Title: "GRIST"
Tags: ["2021", "DL architecture", "ESEC/FSE", "Read", "numerical"]
Authors: ['Yan', 'Ming', 'Chen', 'Junjie', 'Zhang', 'Xiangyu', 'Tan', 'Lin', 'Wang', 'Gan', 'Wang', 'Zan']
Collections: ["patch detection ▸ DL"]
Created time: November 21, 2023 1:29 PM
Conference: ESEC/FSE
Date Added: October 23, 2023 8:27 AM (UTC)
Short Title: GRIST
Text: 通过gradient back-propagation变异fuzzing，找到可以导致numerical bug的外部值。
Full Title: "Exposing numerical bugs in deep learning via gradient back-propagation"
URL: https://dl.acm.org/doi/10.1145/3468264.3468612
Year: 2021
code: https://github.com/Jacob-yen/GRIST
---
# Exposing Numerical Bugs in Deep Learning via Gradient Back-Propagation

code: [https://github.com/Jacob-yen/GRIST](https://github.com/Jacob-yen/GRIST)

当special input导致内部数学运算（例如 log()）的参数值无效时，会发生numerical bug。

文章提出动态检测技术GRIST，自动生成可以导致DL程序numerical bugs的small input。GRIST依赖DL内置的gradient computation（梯度计算）功能。

GRIST检测到63个DL程序中的78个错误，其中有56个未知错误，且8个已被确认，3个已被修复。与原始程序相比，GRIST可以节省8.79倍时间。与DEBAR（sota，静态检测）相比，DEBAR产生了12个FP，31个FN，而GRIST仅产生1个FN。

GRIST通过back-propagation计算梯度，找到可以导致exception的外部值。

### Background

Automatic differentiation (AD): 在程序执行期间，计算某runtime value对给定（输入）变量的导数，表示该值对该变量的敏感程度。

TensorFlow和PyTorch有built-in AD支持，可以用于计算梯度。

在DL中，如果需要对某个变量计算梯度/导数，需要设置require_grad=True使变量trainable。

### Challenges

- non-determinism
- lengthy training
- complexity

## Overview

- 静态分析：（1）可能出现numerical exception的操作（e.g., 没有检查>0的log(x)），（2）与该操作相关的外部值，标记为trainable用于在运行时跟踪该值梯度。
- 梯度反向传播，更新外部值。（1）iterative，（2）non-iterative，只在loaded时对程序状态有1次影响的外部值
- driver，更新training batch, restart the execution。

---

- 与传统程序相比，DL程序不仅包括传统的代码编写阶段，还包括昂贵的训练阶段。
- numerical bugs通常由mathematical property violation或者floating-point representation error导致
- DEBAR依赖于DL程序的static computation graph，因此无法应用到使用dynamic computation graph的DL程序中（e.g., PyTorch）。