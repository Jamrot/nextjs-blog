---
Title: "DeepREL"
Tags: ["2022", "DL framework", "ESEC/FSE", "Read", "fuzzing"]
Authors: ['Deng', 'Yinlin', 'Yang', 'Chenyuan', 'Wei', 'Anjiang', 'Zhang', 'Lingming']
Collections: ["patch detection ▸ DL"]
Created time: November 29, 2023 6:11 PM
Conference: ESEC/FSE
Date Added: October 30, 2023 2:29 PM (UTC)
Short Title: DeepREL
Text: 自动推理equivalent/similar APIs进行fuzzing，检测relational APIs的inconsistency。
Full Title: "Fuzzing deep-learning libraries via automated relational API inference"
URL: https://doi.org/10.1145/3540250.3549085
Year: 2022
code: https://github.com/ise-uiuc/DeepREL
---
# Fuzzing deep-learning libraries via automated relational API inference

code: https://github.com/ise-uiuc/DeepREL

现有工作只能fuzzing存在于documentation examples, developer tests or DLmodels中的API，导致大量API无法被测试到。【Insight】同一个DL library可能存在很多API共享相同输入参数和输出，因此可以使用相关API的test inputs测试其他共享输入参数的API。此外，使用相关API的value equivalence和status equivalence的概念作为oracle。

DeepREL，用于自动推理相关API进行fuzzing。（1）基于API syntactic/semantic信息自动推理潜在API relations，（2）结合relational APIs生成测试程序，（3）通过representative test inputs测试推断的relational APIs，（4）使用验证的relational APIs检测可能的inconsistencies。

在Pytorch和TensorFlow上进行测试，显示DeelREL可以比FreeFuzz多覆盖1815个API（提高157%）。DeelREL检测到162个bugs，其中106个unknown bugs已经被开发者确认。特别的是，DeepREL检测到整个PyTorch问题跟踪系统13.5%的高优先级错误。此外，除了 162 个代码错误之外，DeelREL还检测到了 14 个文档错误（均已确认）。

## Introduction

（1）【value equivalence】**功能相同**的API，在给定相同的输入时应当生成相同数值（numerical）的结果。

（2）【status equivalence】**功能相似**的API，在程序状态方面应当表现相似。（e.i., 功能相似的API应当可以处理相同输入。）

> For example, although torch.nn.AdaptiveAvgPool3d and torch.nn.AdaptiveMaxPool3d in PyTorch are not equivalent, they are functionally similar APIs; thus, we can feed any valid input of the first API to the second API and expect its invocation to also be successful.
> 
- 现有应用于传统软件系统的equicalent API推理工具需要well-documented API relations，但DL library中很少有这样的信息，所以难以应用到DL library中。
- DeepREL找到的equivalent/similar APIs：Pytorch 4290对，TensorFlow8808对。

## Background

<img src="/DeepREL/Untitled.png" className="img"/>
## Approach

<img src="/DeepREL/Untitled%201.png" className="img"/>
## Results

### API coverage

<img src="/DeepREL/Untitled%202.png" className="img"/>
### Bugs Detected

- Out-of-Bounds Read (Equivalence_𝑣𝑎𝑙𝑢𝑒 , ✓)

<img src="/DeepREL/Untitled%203.png" className="img"/>
> returned results reads values from memory locations outside of user-controlled data! This bug is a silent error, and has a severe security implication: without proper range checking of k, users may be able to read data outside of the allocated memory bounds (i.e., out-of-bound read).
> 
- Inconsistent Check (Equivalence_𝑠𝑡𝑎𝑡𝑢𝑠 , ✓)

<img src="/DeepREL/Untitled%204.png" className="img"/>
- Wrong Computation (Equivalence_𝑣𝑎𝑙𝑢𝑒 , ×)

<img src="/DeepREL/Untitled%205.png" className="img"/>
> the developers said these two APIs are not expected to output the same mean and rejected this bug report.
> 

---

- DeepREL是怎么检测到文档错误的？
- DeepREL和EAGLE的区别？