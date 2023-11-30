---
Title: "RANUM"
Tags: ["2023", "DL architecture", "ICSE", "Read", "numerical"]
Authors: ['Li', 'Linyi', 'Zhang', 'Yuhao', 'Ren', 'Luyao', 'Xiong', 'Yingfei', 'Xie', 'Tao']
Collections: ["patch detection ▸ DL"]
Conference: ICSE
Date Added: November 4, 2023 6:58 AM (UTC)
Short Title: RANUM
Text: 基于abstract optimization的numerical defect修复建议生成方法，并对已有检测，生成测试用例相关工作进行改进。
Full Title: "Reliability Assurance for Deep Neural Network Architectures Against Numerical Defects"
URL: http://arxiv.org/abs/2302.06086
Year: 2023
---
- deep neural networks (DNNs)
- numerical defects

DNN中的numerical defects

RANUM使用failure-exhibiting tests检测潜在的numerical defects，确定潜在numerical defect的可行性，并提供缺陷修复建议。

通过在63个DNN架构上进行测试，RANUM在3个任务中均优于sota，生成的40个修复中有37个相当于甚至优于人类修复。

## Introduction

<img src="/RANUM/Untitled.png" className="img"/>
<img src="/RANUM/Untitled%201.png" className="img"/>
1. 训练：在给定训练/验证数据集上使用架构执行程序，或测模型权重并存储于权重文件。（模型=架构+权重）
2. 推理：将权重文件加载到CPU/GPU/AI chips，以给定的推理样本和权重作为参数执行相同的程序，获得模型预测结果作为输出。

**Potential-Defect Detection**. 可能导致推理阶段numerical错误的操作：1）可能在模型部署后暴露，2）可能导致训练阶段numerical错误的操作（因为训练阶段的numerical错误可能也会导致后续推理阶段的numerical错误）

DEBAR. potential-defect detection，仅支持static computational graphs。

GRIST. generating failure-exhibiting unit tests，使用gradient back-propagation。

RANUM. 1）通过backward fine-grained node labeling支持dynamic graphs，2）结合gradient back-propagation和random initialization生成测试用例。

**Feasibility Confirmation**. 生成system测试用例。

1）生成failure-exhibiting unit test

2）生成在训练时可以得出unit test模型权重的training example

**Fix Suggestion**. 修复可行的numerical错误。

abstraction optimization. 

<img src="/RANUM/Untitled%202.png" className="img"/>
<img src="/RANUM/Untitled%203.png" className="img"/>
<img src="/RANUM/Untitled%201.png" className="img"/>
Potential-Defect Detection

静态分析，逐个元素计算computational graph中节点的input range，并判断input range是否在该节点的invalid input range中。

例如，Log函数（node 9, 10）的有效输入范围为(0, +∞)，即invalid input range为(-∞, Umin)。如果Log函数的input range为[(0,0)^T, (1,1)^T]，则input range在Log函数的invalid input range中，可能导致numerical defects。所以，将node 9, node 10标志为potential numerical defects。

---

对已有的numerical defect相关工作（检测，生成测试用例）进行改进，并且提出一种基于abstract optimization的修复建议生成方法。

RANUM使用failure-exhibiting tests检测潜在的numerical defects，确定潜在numerical defect的可行性，并提供缺陷修复建议。

通过在63个DNN架构上进行测试，RANUM在3个任务中均优于sota，生成的40个修复中有37个相当于甚至优于人类修复。

### 已有的numerical defect相关工作

1. Potential-Defect Detection
    1. DEBAR. 仅支持static computational graphs。
    2. 逐个元素计算computational graph中节点的input range，并判断input range是否在该节点的invalid input range中。
    3. 例如，Log函数（node 9, 10）的有效输入范围为(0, +∞)，即invalid input range为(-∞, Umin)。如果Log函数的input range为[(0,0)^T, (1,1)^T]，则input range在Log函数的invalid input range中，可能导致numerical defects。所以，将node 9, node 10标志为potential numerical defects。
        
<img src="/RANUM/Untitled%201.png" className="img"/>        
2. Failure-exhibiting Unit Test Generation
    1. GRIST. 使用gradient back-propagation生成单元测试用例。

### RANUM

<img src="/RANUM/Untitled%202.png" className="img"/>
<img src="/RANUM/Untitled%203.png" className="img"/>
1. 通过backward fine-grained node labeling支持dynamic graphs
2. 结合gradient back-propagation和random initialization分两步生成测试用例，
    1. unit test
    2. system test. 在训练时可以得出unit test模型权重的training example
3. 通过abstract optimization生成修复建议

### Numerical Defect

- numerical defect：对于给定computational graph，如果存在有效输入以及有效权重，使对图中某个节点的输入在该节点的无效范围内，则认为该节点存在numerical defect。
- Numerical Defects in DNN Architecture：DNN 架构中的数值缺陷。RANUM专注于推理阶段的数值缺陷。即当特定运算符接收到无效范围内的输入时，这些缺陷会导致数值失败，从而导致运算符输出 NaN 或 INF。