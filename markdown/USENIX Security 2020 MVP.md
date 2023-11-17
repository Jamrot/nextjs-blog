---
Title: USENIX Security 2020 | MVP
Tags: ["paper", "recurring bug"]
Created time: August 31, 2023 2:22 PM
Text: 根据数据依赖和抽象指令，提取补丁函数中的vulnerable signature和patch signature与目标函数匹配。
---
# MVP: Detecting Vulnerabilities using Patch-Enhanced Vulnerability Signatures

重复漏洞（Recurring vulnerability）通常由于代码重用或者共用代码逻辑导致。但漏洞函数和修复函数之间的差别可能很小，而漏洞函数和目标函数之间的差别可能很大，给通常用于检测重复漏洞的方法clone-based和function matching-based带来了挑战。

作者提出了一种新方法MVP（针对C/C++源代码），分别从切片后的vulnerable function和patched function内提取语法syntactic和语义semantic层面的vulnerable signature和patch signature。如果目标函数匹配vulnerable signature但不匹配patch signature，则认为函数内存在潜在漏洞。

作者在10个开源系统中进行了测试，结果显示，1) MVP比clone-based和function matching-based两种方法的SOTA表现得都要好，2) MVP可以检测到通用的漏洞检测方法检测不到的漏洞，3) MVP发现了97个新漏洞，收到23个CVE认证。

## Introduction

**Challenges.** 1) 如何通过识别已经修复的漏洞减少FP，2) 如何准确地产生已知漏洞的signature减少FP和FN。

本文通过1) 分别生成patch signature来区分函数是否被修复，解决第一个挑战；通过2) 新的切片技术仅提取与漏洞相关和补丁相关的语句，以在语法级别和语义级别生成漏洞和补丁签名，解决第二个挑战；并且3) 应用statement abstraction和entropy-based statement selection提高MVP的准确性

************************Evaluation.************************ 1) 与2个clone-based方法对比，2) 与2个function matching-based方法对比，3) 与2个learning-based方法和2个商业工具对比

************Contribution.************ 

## 具体方法

<img src="/USENIX Security 2020 MVP/workflow.png" alt="workflow" className="img"/>


提取函数签名 extracting function signature：提取目标系统中每个函数的签名

- 使用Joern生成code property graph，提取function。并对每个函数生成AST和PDG (program dependence graph, 程序依赖图)。
- 抽象化：使用normalized symble (PARAM, VARIABLE, STRING) 代替具体的参数、变量和字符串。删除注释、空格等。
- 计算statements的哈希值→f_syn，根据PDF提取数据/控制依赖关系→f_sem。

提取漏洞和补丁签名 extracting vulnerability and patch signature：提取补丁中的漏洞签名和补丁签名

- 确定补丁修改的函数及函数内的代码变化
- 新的切片方法用于更准确地确定漏洞相关代码：正常的PDG后向切片(backward slicing)，根据不同statement (assignment, conditional, return, others)自定义的PDG前向切片(forward slicing)策略。

检测漏洞 detecting vulnerability：通过比较目标函数签名与漏洞和补丁签名，判断是否存在漏洞。

- 目标函数包含所有deleted statements, 且目标函数签名匹配漏洞签名（|V∩f|/|V|>t），不匹配补丁签名（|P∩f|/|P|≤t）。

*function signature (f_syn, f_sem), f_syn-all statements, f_sem - (h_1, h_2, type) - statement(h1), statement(h2), data/control(type) .

*deleted statements: 补丁中删除的代码行

*匹配 match：thresholds = 0.8

## Evaluation

准确率，检测规模 scalability，thresholds sensitivity，语句抽象和语句信息如何影响MVP的准确性，通用漏洞检测方法在重复漏洞中的检测效果。

**False Positive.** 1) 缺失过程间分析inter-procedure的调用上下文calling-context，一些在函数调用前的check没有发现；2) 语义等价没有被建模；3) 签名中没有包含漏洞的根本原因。

**False Negative.** 1) MVP检测粒度为函数级别而不是hunk级别，所以当提取签名时会有更多noise；2) 没有对数据类型和函数调用抽象化。

## Limitation

1、无法检测Type-4（两个功能类似）的重复漏洞

3、无法检测由于struct或macro导致的漏洞

> Third, we cannot detect vulnerabilities whose patches are out of functions. Some vulnerabilities are fixed by only changing struct or macro, which are out of functions.
> 
- 解决对数据类型和函数调用抽象化（FN 2）
    
    首先对每个statement（包括数据类型和函数调用）抽象化并计算哈希值，通过哈希值匹配目标和漏洞的statement；如果匹配成功，则将statement的每个token都用tokenize的向量表示，再计算相似度；若相似度大于某个阈值，且满足MVP的匹配过程，则认为该函数可能有漏洞。
    

## Questions

1. 检测粒度？
    - 函数
2. 语法和语义层面的signature分别是什么？
    - 语法syntactic层面：一个句子；语义semantic层面：结构（数据流图）
3. 如何确定漏洞函数和目标函数？
    - 漏洞函数即patch修改中被删除代码行的函数，目标函数指目标系统的全部函数。
4. 如何切片？
    - 正常的PDG后向切片(backward slicing)+根据不同statement (assignment, conditional, return, others)自定义的PDG前向切片(forward slicing)策略 3.3.2。
5. 怎么判断是否匹配？
    - 3.4
6. 该方法比其他方法好的原因是什么？
    - 作者进行的预实验表明，大部分patched function和vulnerable function之间的差别很小，所以只使用vulnarable signature的clone-based approaches可能会把patched function错误识别为vulnerable function导致FP。→ MVP同时使用了vulnerability signature和patch signature，用于区分函数是否被修复，减少FP。【具体可以看motivating example】
    - 当vulnerable function和target function之间相似度小（差别很大）时，function matching-based approaches无法识别出目标函数，造成FN。→MVP使用新的切片技术，生成语法和语义级别的signature，减少FP和FN。
    - 应用statement abstraction和entropy-based statement selection提高准确性。
7. 如何收集patch和ground-truth？
    - Patch：NVD+commit
    
    > To enrich the dataset, we obtained the commits which contain secretly patched vulnerabilities from our industrial collaborator.
    > 
    - ground-truth：所有工具检测出来的true positive之和