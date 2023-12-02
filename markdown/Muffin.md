---
Title: "Muffin"
Tags: ["2022", "DL framework", "ICSE", "Read", "differential fuzzing"]
Authors: ['Gu', 'Jiazhen', 'Luo', 'Xuchuan', 'Zhou', 'Yangfan', 'Wang', 'Xin']
Collections: ["patch detection ▸ DL"]
Created time: November 21, 2023 1:28 PM
Conference: ICSE
Date Added: November 16, 2023 4:11 PM (UTC)
Short Title: Muffin
Text: 基于fuzzing生成DNN，基于keras实现differential testing检测模型训练阶段的inconsistency。
Full Title: "Muffin: testing deep learning libraries via neural architecture fuzzing"
URL: https://dl.acm.org/doi/10.1145/3510003.3510092
Year: 2022
code: https://github.com/library-testing/Muffin
---
# Muffin: testing deep learning libraries via neural architecture fuzzing

code: [https://github.com/library-testing/Muffin](https://github.com/library-testing/Muffin)

现有工作使用预训练模型，并且仅仅关注模型推理（inference）阶段产生的错误。

Muffin生成不同的DL模型用于检测深度学习库，在训练阶段通过一组metrics检测cross-library的不一致性问题。

通过在TensorFlow, CNTK, Theano的最新版本上进行测试，Muffin发现了39个新bugs（其中21个crash bugs）。

## Introduction

DL库通过硬件基础（CPU, GPU）提供计算实现（矩阵变换，梯度计算，权重更新）的高级接口。

现有工作通过比较预训练模型推理阶段的结果，检测深度学习模型推理阶段产生的错误。CRADLE直接使用模型作为测试的输入，LEMON对模型进行变异后作为输入。

但现有工作只关注了**预训练模型**的**推理阶段**，而没有注意到**训练阶段**可能出现的问题（例如反向传播的库代码）。

### Challenges

C1: 基于已有模型的变异不能很好发掘深度学习库功能的探索，因为它们没有改变模型结构。

C2: 在训练阶段不会产生像推理阶段的输出，难以进行diffetential testing。

### Muffin

（1）自动生成模型

将模型架构视为有向无环图directed acyclic graph (DAG)，一层层构建模型以实现对于深度学习库功能的高度覆盖。

（2）对训练阶段进行数据轨迹分析

将模型训练阶段分成3部分，前向计算，损失计算，梯度计算。针对数据轨迹设计一组指标来衡量不同深度学习库结果的一致性。

应用Muffin测试TensorFlow、CNTK和Theano三个深度学习库的15个版本。Muffin在这些库的最新版本中检测到39个新错误（包括21个崩溃错误）。

## Background

<img src="/Muffin/Untitled.png" className="img"/>
Forward Calculation (FC)：根据模型层数进行计算产生相应输出

Loss Calculation (LC)：根据预定义损失函数计算loss，得出模型输出和ground-truth之间的差异。

Backward Calculation (BC)：根据损失函数计算每个神经元的梯度，从输出到输入更新相应权重。

<img src="/Muffin/Untitled%201.png" className="img"/>
## Approach

<img src="/Muffin/Untitled%202.png" className="img"/>
（1）自动生成模型

- 首先生成有向无环图作为结构信息
- 然后使用贪婪算法进行层选择，生成层信息。

（2）在模型训练阶段进行数据轨迹分析

- 对FC, LC, BC的数据轨迹分别进行描述
- 通过一组指标测量不同库连续层的输出方差

## Results

对六个数据集进行测试：MNIST, F-MNIST, CIFAR-10, ImageNet, Sine-Wave and Stock-Price. 前4个是图像分类数据集，后两个是序列数据集。

<img src="/Muffin/Untitled%203.png" className="img"/>
一共找到了18个inconsistency bugs和21个crash bugs。

其中，在Forward Calculation有12个bugs。e.g., Theano使用了错误的pooling location。

在Loss Caulculation有2个bugs。e.g., Tensorflow使用了冗余的epsilon参数来剪切输入参数。

在Backward Calculation有3个bugs。e.g., Theano使用了错误的比较逻辑（𝑅𝑒𝐿𝑈 (𝑧) = 𝑧 | 𝑧 ≥ 0应该为𝑅𝑒𝐿𝑈 (𝑧) = 𝑧 | 𝑧 > 0）。

还有2个NaN bugs。

- Muffin比LEMON表现好的原因
    - 通过模型生成的方法探索更多库函数，LEMON只能变异种子模型，很难覆盖种子模型没有使用的函数。
    - LEMON没有考虑loss和gradient calculation
- 文章中考虑到的预定义API，学习相关API？
    - utils.utils.py中定义的layer_types，共有59种。
    - https://github.com/library-testing/Muffin/issues/3
    - [https://keras.io/api/layers/](https://keras.io/api/layers/)
    
    > As a result, LEMON only achieves 35.593% functionality coverage (the percentage of the invoked APIs in all the pre-defined, learning-related APIs we considered), while Muffin can achieve 98.305% functionality coverage.
    > 
- 这里的line coverage是指哪部分代码的coverage？
    - 仅考虑learning-related code files中python代码的覆盖率
        
        > Specifically, as for line coverage, we used a python package named `coverage` , the usage of which can be accessed from here: [https://coverage.readthedocs.io/en/latest/cmd.html](https://coverage.readthedocs.io/en/latest/cmd.html)
        > 
        > 
        > And we limited the targeted source code using the `--include` option so as to focus on only the learning-related code files.
        > 
    - [https://keras.io/api/layers/](https://keras.io/api/layers/)
    
    > we summarize and report the line coverage results: Muffin achieves 43.22%, which is 2.07 times of that achieved by LEMON (20.85%)
    > 

## Disscussion

### Muffin & Muffin-UT

Muffin-UT基于单元测试的思想进行涉及，测试具体库函数。Muffin生成DAG图作为结构信息自动生成模型，模拟实际计算过程，减少输入范围，更容易触发corner cases（i.e., inconsistency of “MaxPooling1D” layer only happens when multiple elements in the input tensor have the same maximum value.）。

### Unclear Specification

不同DL库对于相同功能有不同实现

- 计算max()函数的梯度：当有多个最大值元素时，TensorFlow会用最大元素的个数来划分梯度，而Theano和CNTK没有这个操作。
- 对于“MaxPooling1D”层，当有多个最大元素时，TensorFlow和CNTK只会将梯度应用于其中一个最大元素，而Theano则将梯度应用于所有最大元素。

## Limitation

- 仅仅考虑layer function粒度的覆盖率，没法覆盖私有方法和代码分支。

## Related Work

### DL models

- coverage criteria
- adversarial inputs / corner cases
    - 自动驾驶汽车

### DL model structures / training parameter setting

- DeepLocalize: Fault Localization for Deep Neural Networks. ICSE 2021. 基于动态分析的方法来检测训练深度学习模型时的数值误差。
- AUTOTRAINER: An Automatic DNN Training Problem Detection and Repair System. ICSE 2021. 检测和自动修复常见模型训练问题的工具，例如梯度消失、梯度爆炸和收敛缓慢。

### differential fuzzing in DL

- DeepXplore: Automated Whitebox Testing of Deep Learning Systems. SOSP 2017. 基于image transformation进行differential fuzzing，识别深度学习模型缺陷。
- DLFuzz: differential fuzzing testing of deep learning systems. ESEC/FSE 2018. 对模型输入进行变异最大化模型输出差异的differential fuzzing。

---

metamorphic relations：

[FreeFuzz](FreeFuzz%2088b2ab704f3d4a84b5e21bb7b8ce7dcd.md)