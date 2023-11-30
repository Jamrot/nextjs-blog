---
Title: "DeepStability"
Tags: ["2022", "ICSE", "Read", "numerical", "star", "survey"]
Authors: ['Kloberdanz', 'Eliska', 'Kloberdanz', 'Kyle G.', 'Le', 'Wei']
Collections: ["patch detection ▸ DL"]
Conference: ICSE
Date Added: November 4, 2023 7:41 AM (UTC)
Short Title: DeepStability
Text: 导致numerical instability的算法及解决方法，提供相关数据库DeepStability。
Full Title: "DeepStability: a study of unstable numerical methods and their solutions in deep learning"
URL: https://dl.acm.org/doi/10.1145/3510003.3510095
Year: 2022
code: https://deepstability.github.io
---
# DeepStability: a study of unstable numerical methods and their solutions in deep learning

code: [https://deepstability.github.io](https://deepstability.github.io/)

DL算法需要大量、多样的数值计算。对于数值计算的不恰当实现会导致错误或不准确的学习或结果。而同一个数值计算或数学公式，可以有几种数学上等价的不同实现方式，但会有不同的数值稳定性。

本文研究两个DL libraries PyTorch和Tensorflow，用于识别不稳定数值方法和其解决方法。通过研究导致数值不稳定的根本原因，数值不稳定表现，以及数值不稳定相关补丁，总结了DeepStability数据库。并利用Deepstability确定了一个Tensorflow的数值稳定问题。

# Introduction

在传统数值分析文献中，数值稳定性被视为算法的一个属性。【不稳定的数值方法会因输入的微小变化导致较大的输出变化，从而导致意外输出或错误。】特别是由于深度学习依赖高精度浮点数计算以达到可靠推断，并且需要大整数来处理大数据集。因此，不稳定的数值计算方法可能导致overflow或underflow以及trunction（截断）。这些错误会通过训练传播，导致模型质量低下和浪费计算资源。

<img src="/DeepStability/Untitled.png" className="img"/>
## Challenges

1）数值稳定性问题只能由小范围输入触发

2）数值稳定错误有时只能在通过训练传播后才能被发现

现有对于数值稳定性问题的研究（检测、自动修复、debug、增加计算准确性）主要关注于代码层面，而不是算法层面。

e.g., 监测代码执行过程中相对误差是否增大，然后自动切换到高精度计算。

## Contribution

1）分类可能导致numerical instability的DL算法，并解释原因；

2）针对DL算法中的numerical stability bugs的根本原因进行深入分析；

3）总结数学和代码方面对于保证数值稳定的解决方法；

4）发现DL中新的unstable mothods及其解决方法；

5）DeepStability，[https://deepstability.github.io](https://deepstability.github.io/)，共252个例子，DL中numerical stabiliy问题及解决方法的数据集。

# Motivation

## Softmax

<img src="/DeepStability/Untitled%201.png" className="img"/>
输入可能导致overflow/underflow，使输出结果为NaN。

input vector x=[10.0, 100.0, 1000.0], 𝑒100.0 and 𝑒1000.0 overflow, sum is computed as 22026.5 +𝑖𝑛𝑓 +𝑖𝑛𝑓 = 𝑖𝑛𝑓, result[j] returns 𝑖𝑛𝑓/𝑖𝑛𝑓 = −𝑛𝑎𝑛.

input vector y=[-1000.0, -10000.0, -1000000.0], 𝑒−1000.0, 𝑒−10000.0, and 𝑒−1000000.0 underflow, sum is computed as 0 + 0 + 0 = 0, divide by zero on line 10, which is an invalid operation that yields a NaN.

## numerically stable solution

对输入正则化，保证输入不会过大或过小。

## DL algorithms Suspectible to Numerical Instability

- tensor math (e.g., the computation of log, exp, sum and power on tensor)
- statictical distributions (e.g., conputing log probability, sampling, precision matrix)
- data processing (e.g., batch normalization)
- 剩余12%是numerical stability in DL implementation，但无关DL算法，例如overflow when performing timing。

<img src="/DeepStability/Untitled%202.png" className="img"/>
## Impact of Numerical instability

loss of precision会导致weights & biases更新不准确，进而导致推理错误。

overflow/underflow会导致模型参数为NaN，虽然应当很容易检测，但是DL APIs（e.g., Keras）会在loss和gradients为NaN之后继续训练，造成计算资源浪费。

<img src="/DeepStability/Untitled%203.png" className="img"/>
## Solutions

- rewriting mathematical formula. 重写数学表达式
    - using different operations
    - re-ordering operations
    - adding a small epsilon

<img src="/DeepStability/Untitled%204.png" className="img"/>
- increase precision or change variable type. 增加准确性或修改变量类型
    - overflow/underflow
        
<img src="/DeepStability/Untitled%205.png" className="img"/>        
- use a different algorithm. 使用不同算法
    
<img src="/DeepStability/Untitled%206.png" className="img"/>    
- limit input range. 限制输入范围

## Unstable Methods & Solutions

- consine similarity
- bucketization algorithm
- differentiation of the LU decomposition
- higher order derivatives

## Others

作者通过观察Pytorch发现存在一个rewriting the binary search algorithm的修复，通过分析Tensorflow中对binary search的实现，发现了一个numerical unstable的问题，已经提交并得到修复。