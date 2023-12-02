---
Title: "TRACER"
Tags: ["Read", "recurring vulnerability", "signature", "star"]
Authors: ['Kang', 'Wooseok', 'Son', 'Byoungho', 'Heo', 'Kihong']
Collections: ["patch detection ▸ recurring", "patch detection ▸ vulnerability detection"]
Created time: November 21, 2023 2:07 PM
Conference: CCS
Date Added: August 14, 2023 3:23 PM (UTC)
Short Title: TRACER
Text: 预定义inspection function找到vulnerable source & sink，污点分析提取路径生成signature，比较待测路径和已知漏洞路径的signature。
Full Title: "TRACER: Signature-based Static Analysis for Detecting Recurring Vulnerabilities"
URL: https://doi.org/10.1145/3548606.3560664
Year: 2022
code: https://prosys.kaist.ac.kr/tracer/
---
# Tracer: Signature-based Static Analysis for Detecting Recurring Vulnerabilities

code: [https://prosys.kaist.ac.kr/tracer/](https://prosys.kaist.ac.kr/tracer/)

重复漏洞（recurring vulnerability）通常由于代码重用或者共用代码逻辑导致。已有的方法主要关注syntactic方面，通过code reuse找到重复漏洞，而缺少对semantic的关注，缺少通过对在不同代码结构中共享相同vanerable行为的分析，检测重复漏洞的方法。
Tracer用过程间数据依赖路径表示漏洞签名。首先用污点分析检测各种类型的漏洞。对于已知漏洞，使用污点分析提取出vulnerable路径并建立签名数据库。当分析新的程序时，tracer将新程序中所有可能的vulnerable路径与数据库中的签名进行对比，然后通过按相似度指标排序报告潜在漏洞。
作者在273个C/C++ Debian包中对tracer进行了测试，发现了112个未被发现的漏洞，其中6个得到了CVE认证。

## Introduction

现有方法
1) 基于代码相似度通过code reuse来检测重复漏洞。它们通过在预定义范围内（文件/代码）对已知漏洞生成签名，并与新程序中的签名进行syntactic模式比较的方法来检测漏洞。但这些方法没法检测与已知漏洞syntactic完全不同，但具有相同根本原因的漏洞。
2) 通过模式匹配的静态分析方法，同时考虑syntactic和semantic。但是设计这样的分析需要专家知识，太难了。

TRACER是一种基于签名的静态分析方法，用于检测重复漏洞。tracer的关键思想在于用过程间数据依赖路径表示漏洞签名。它基于一种通用污点分析来分析潜在的vulnerable数据流，找出从source (untrusted input)到sink (security-sensitice function)的路径。
1) 在已知漏洞上运行污点分析，并通过从src到sink的数据依赖关系提取trace，将trace编码成特征向量的形式作为签名。2) 当分析新程序时，tracer提取出该程序中所有reported alarms的trace，并用同样的方式将这些trace编码成特征向量。3) 通过余弦相似度比较两者特征向量的相似度。4) 按相似度指标排序报告潜在漏洞。

作者基于Facebook的Infer分析器实现了tracer，并在273个C/C++ Debian包中对tracer进行了测试。最终，tracer发现了112个重复漏洞。这些漏洞与已知的 CVE、Juliet 测试套件中的漏洞示例以及安全编码在线教程中的示例代码类似。

## Overview

<img src="/TRACER/Untitled.png" className="img"/>
1）通过inspection function进行静态分析，找到可能有漏洞的source & sink point。

2）通过污点分析确定从source point到sink point的数据依赖关系（tainted trace）。

3）提取路径特征，包括low-level和high-level两类。low-level包括primitive operation（加减乘除）和common API（比如strlen），high-level包括五种条件检查，用于排除安全的target code，减少FP。

4）计算路径特征的相似度，根据相似度最大的值决定要不要alarm。

### static taint analysis

定义了三种函数，用于检测5种漏洞。

- QT: format string - printf-like functions, command injection - exec-like functions, and buffer overflow - memcpy-like functions.
- Q_O: overflow - memory allocations (malloc)+unintentionally small argument.
- Q_U: underflow - memory copies (memset)+unintentionally large argument.

> Function Q_T collects all the source points of a sink point if the argument of a sink function is tainted. Tracer uses Q_T to detect format string, command injection, and buffer overflow at printf-like functions, exec-like functions, and memcpy-like functions, respectively. 
Q_O and Q_U additionally check whether the argument can be potentially overflowed and underflowed, respectively. The functions are used to detect malicious uses of memory allocations (e.g., malloc) with an overflowed (i.e., unintentionally small) argument, and memory copies (e.g., memset) with an underflowed (i.e., unintentionally large) argument.
> 

## Case

<img src="/TRACER/Untitled%201.png" className="img"/>
<img src="/TRACER/Untitled%202.png" className="img"/>
上面两段代码都由于没有对读入的文件大小进行验证，所以可能造成IntegerOverflow漏洞。这两段代码看起来完全不一样，但是都是由相同的原因造成的，且具有相同的source & sink。通过tracer对数据依赖关系的提取，以及feature vector的转换，最终计算得到两者的相似度会很高。

<img src="/TRACER/Untitled%203.png" className="img"/>
<img src="/TRACER/Untitled%204.png" className="img"/>
- 对于inspection function的依赖
- 不关注具体变量/变量类型
- 实际操作/实现，必须要在后续进行了相似的操作（例如都进行内存分配？）。而在recieve netlink message这个例子中，虽然后续都对netlink message进行了处理，但是处理方式不同。【那是不是也可以类似malloc-like函数，定义一个netlink message process-like函数，这样就可以匹配上了。】
- logic bug不像文章中主要分析的overflows, format string bugs, command injections这几种漏洞具有较为固定的行为模式，或者相似操作。
- 但两个相似的逻辑漏洞可能都是在试图实现某一个intention时，使用了相似的逻辑，都由于缺少对某些条件的考虑。

# Summary

- 开源代码：[https://prosys.kaist.ac.kr/tracer/](https://prosys.kaist.ac.kr/tracer/)
- tracer由于通过预定义的三种inspection function静态分析可能存在的漏洞，可检测漏洞类型受限于对inspection function的定义。目前只能检测integer overflows, integer underflows, buffer overflows, format string bugs, or command injections这5种漏洞。
- sink function: security-sensitive functions (e.g., malloc), source function: untrusted inputs (e.g., fread).