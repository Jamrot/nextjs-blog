---
Title: "FreeFuzz"
Tags: ["2022", "DL framework", "ICSE", "Read", "fuzzing"]
Authors: ['Wei', 'Anjiang', 'Deng', 'Yinlin', 'Yang', 'Chenyuan', 'Zhang', 'Lingming']
Collections: ["patch detection ▸ DL"]
Created time: November 29, 2023 11:56 PM
Conference: ICSE
Date Added: November 19, 2023 10:44 AM (UTC)
Short Title: FreeFuzz
Text: 从open source获取code/model对high-level API进行single library fuzzing，检测（1）CPU/GPU&CuDNN不同设置下的inconsistency（2）违反Metamorphic Relation（精度低，花销低）（3）crash。
Full Title: "Free lunch for testing: fuzzing deep-learning libraries from open source"
URL: https://dl.acm.org/doi/10.1145/3510003.3510041
Year: 2022
code: https://github.com/ise-uiuc/FreeFuzz
---
# Free Lunch for Testing: Fuzzing Deep-Learning Libraries from Open Source

code: https://github.com/ise-uiuc/FreeFuzz

DL库的public APIs的主要语言为Python，而Python中的变量类型是动态类型，因此很难自动确定API输入参数类型。

本文提出FreeFuzz用于从开源资源中发掘代码或模型来fuzzing DL libraries。首先，FreeFuzz从以下开源资源获取代码或模型：1）从库文档中获得的代码片段，2）库中开发者提供的测试用例，3）野生DL模型。此后，FreeFuzz自动运行插桩后的代码/模型，以跟踪covered API的动态信息（调用期间参数的类型和值，输入/输出张量的形状）。最后，FreeFuzz将利用跟踪到的动态信息对每个API进行fuzzing。

FreeFuzz能够自动跟踪PyTorch和TensorFlow中1158个API的有效动态信息用于进行fuzzing，是sota LEMON的9倍，且比LEMON低3.5倍的开销。到目前为止，FreeFuzz已经发现了PyTorch和TensorFlow的49个错误（其中38个已被开发者确认为之前未知的）。

## Introduction

### Research Gap

- LEMON & CRADLE只能cover TensorFlow的59个API
- LEMON只能产生limited diverse test inputs
    
    > the intact-layer mutation [69] requires that the output tensor shape of the layer/API to be added/deleted should be identical to its input tensor shape.
    > 

### FreeFuzz

- 记录运行收集到的code/models（DL库文档的代码片段，DL库的测试代码，野生DL模型）及动态运行时API的input parameters的信息（类型，参数值，张量形状 shapes of tensors）
- 使用多种变异策略（type mutation, random value mutation, and database value mutation）进行fuzzing
- 在不同的后端使用differential testing和metamorphic testing
- FreeFuzz可以自动跟踪有效动态信息用于fuzzing 1158 out of all 2530 considered APIs.
- 检测到49个bug，其中38个unknown bugs被开发者确认，并且21个已经被修复。

## Background

<img src="/FreeFuzz/Untitled.png" className="img"/>
### **Abstraction for Hardware**

> Aten [13] is a backend implemented in C++ serving as a tensor library for hundreds of operations. It has specialized low-level implementations for hardware including both CPUs and GPUs.
> 

> CuDNN [26] is another backend integrated into PyTorch, which is a widely-used third-party high-performance library, developed specifically for deep learning tasks on Nvidia GPUs.
> 

## Approach

<img src="/FreeFuzz/Untitled%201.png" className="img"/>
### Test Oracle

- **Differential Testing (Wrong-Computation Bugs)**: (1) CPU with CuDNN disabled, (2) GPU with CuDNN disabled, and (3) GPU with CuDNN enabled.
- **Metamorphic Relations (Performance Bugs)**: 精度高的，cost高；精度低的，cost低。
    
<img src="/FreeFuzz/Untitled%202.png" className="img"/>    
- **Crash**: segmentation fault / unexpected exception。排除由于invalid input导致输出meaningful exception的结果（e.g., ‘ValueError’, ‘InvalidArgumentError’, etc.）。

## Results

> The main experimental results are shown in Table 3, where we explore different settings, including using documentations only, tests only, models only, and all information together for both TensorFlow and PyTorch**.** For each setting, we show the number of covered APIs (Row “# API”), the number of traced unique API invocations (Row “# VS”), and the line coverage achieved when directly running the traced API invocations (Row “Line Cov.”).
> 

<img src="/FreeFuzz/Untitled%203.png" className="img"/>
### API coverage

### size of Value Space

- 使用不同参数调用API的次数

### line coverage (C/C++)

<img src="/FreeFuzz/Untitled%204.png" className="img"/>
### Bugs

- wrong-computation bug
- performance bug
- crash bug

---

- API-level testing优势

> The benefit of API-level testing is that it can be a more general and systematic way for testing DL libraries. With API instrumentation, we can get various and diverse input sources from open source to serve the purpose of testing.
>