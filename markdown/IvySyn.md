---
Title: "IvySyn"
Tags: ["2023", "DL framework", "Read", "USENIX Security", "fuzzing"]
Authors: ['Christou', 'Neophytos', 'Jin', 'Di', 'Atlidakis', 'Vaggelis', 'Ray', 'Baishakhi', 'Kemerlis', 'Vasileios P.']
Collections: ["patch detection ▸ DL"]
Created time: November 21, 2023 1:29 PM
Conference: USENIX Security
Date Added: October 25, 2023 9:49 AM (UTC)
Short Title: IvySyn
Text: Fuzz深度学习框架的底层内核代码（C/C++）中的内存安全漏洞
Full Title: "{IvySyn}: Automated Vulnerability Discovery in Deep Learning Frameworks"
URL: https://www.usenix.org/conference/usenixsecurity23/presentation/christou
Year: 2023
code: https://gitlab.com/brown-ssl/ivysyn
---
# IvySyn: Automated Vulnerability Discovery in Deep Learning Frameworks

code: [https://gitlab.com/brown-ssl/ivysyn](https://gitlab.com/brown-ssl/ivysyn)

IvySyn使用静态类型的本地API，进行类型感知的变异，实现对low-level内核代码的模糊测试，以发掘深度学习框架中的内存错误。

为了证明native DL (C/C++) 代码可以被攻击者利用，IvySyn通过导致low-level内存错误的输入，自动生成trigger错误的high-level (Python) 代码片段（Proof of Vulnerability）。

使用IvySyn测试TensorFlow和PyTorch识别并修复了61个以前未知的安全漏洞，并分配了39个CVE。

- 静态类型的本地API：在编译时进行类型检查的API（e.g., C/C++）。在编译代码之前，编译器会检查变量、函数参数和返回值等的类型，以确保它们与预期的类型匹配。（动态类型：Python）

<img src="/IvySyn/Untitled.png" className="img"/>
> IvySyn通过对低级API进行fuzzing，解决了先前方法（Doctor）在使用高级API进行fuzzing时遇到的问题，主要是因为它能更直接地与DL框架的核心功能交互，避免了一些高级API层面的限制。以下是IvySyn通过fuzz低级API能够解决问题的几个关键点：
> 
> 1. **更直接的接口**：低级API直接映射到DL框架的核心操作，这意味着通过fuzzing这些API，可以更直接地测试和发现那些与核心计算和数据操作相关的潜在问题。
> 2. **避免高级抽象的限制**：高级API通常包括额外的抽象层，例如错误检查、预处理操作等，这些可能掩盖或改变底层操作的行为。通过直接fuzz低级API，IvySyn可以避免这些抽象带来的潜在干扰。
> 3. **减少对领域专家的依赖**：以往的方法在使用高级API进行fuzzing时，可能需要领域专家的注解来指定有效的参数值组合。而IvySyn通过直接针对低级API进行fuzzing，可以减少对此类专家知识的依赖，从而实现更高程度的自动化。
> 4. **更广泛的测试范围**：低级API提供了对DL框架底层操作的更全面访问，使得测试可以覆盖到更多的场景和操作，包括一些可能在高级API层面无法直接测试的功能。

## Background

- Kernels：用本地C/C++代码实现的深度学习框架的核心功能（e.g., 张量操作、数学运算、卷积计算、梯度计算、池化）
- Bindings：high-level Python与low-level C/C++的转换接口，将Python API的输入转换为C/C++的参数并调用适当内核。

现有方法直接fuzz high-level API，1）半自动化，需要领域专家注释来指定有效参数值组合，2）人工写helper code

> DocTer: Documentation-Guided Fuzzing for Testing Deep Learning API Functions. ISSTA 2022.
> 

## Overview

自下而上，两阶段。

- 是否存在low-level API输入导致DL kernel的内存错误
    - type-aware变异策略
    - memory corruption/disclosure (integrity/confidentiality violation), fatal runtime error (availability violation)
- 是否存在high-level API可以将上述输入传入low-level kenel中
    - 自动合成代码片段（PoV）从high-level API trigger相关错误
    - 攻击者可以通过high-level API触发这个bug

## Results

> Atheris is a production-grade tool, built by Google, and is used to fuzz test their TensorFlow codebase.
> 

### Bug types

- abort signals
- floating-point exceptions
- segfaults (memory corruption)
    - NULL-pointer dereference: 不能直接用来获得read/write primitive，但可以用来中止DL框架运行。
    - memory read/write operations at controlled address/heap address, heap overflow

---

## USENIX Security 2023 | IvySyn

IvySyn使用静态类型的本地API，进行类型感知的变异，实现对low-level内核代码的模糊测试，以发掘深度学习框架中的内存错误。

为了证明native DL (C/C++) 代码可以被攻击者利用，IvySyn通过导致low-level内存错误的输入，自动生成trigger错误的high-level (Python) 代码片段（Proof of Vulnerability）。

使用IvySyn测试TensorFlow和PyTorch识别并修复了61个以前未知的安全漏洞，并分配了39个CVE。

- 静态类型的本地API：在编译时进行类型检查的API（e.g., C/C++）。在编译代码之前，编译器会检查变量、函数参数和返回值等的类型，以确保它们与预期的类型匹配。（动态类型：Python）
- Kernels：用本地C/C++代码实现的深度学习框架的核心功能（e.g., 张量操作、数学运算、卷积计算、梯度计算、池化）
- Bindings：high-level Python与low-level C/C++的转换接口，将Python API的输入转换为C/C++的参数并调用适当内核。

现有方法直接fuzz high-level API，1）半自动化，需要领域专家注释来指定有效参数值组合，2）人工写helper code

> DocTer: Documentation-Guided Fuzzing for Testing Deep Learning API Functions. ISSTA 2022.
> 

### Bug types

- memory corruption (segfault)
    - OOB Read/Write. 在计算过程中存在超出分配内存的张量数组。e.g., indices和data大小不匹配
    - NULL-pointer dereference: 不能直接用来获得read/write primitive，但可以用来中止DL框架运行。
    - memory read/write operations at controlled address/heap address, heap overflow
- fatal runtime error - DoS
    - floating point exception. (invalid operation, division by zero, overflow, underflow). 缺少corner-case检查，没有检查输入的函数是否为0。
    - reachable assertion (CHECK-failure)
- command injection. 在某些用于解析输入字符串或者文件的函数中，不安全地使用eval。

### CHECK-failure (CWE-617: Reachable Assertion)

- [TFSA-2022-169](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/security/advisory/tfsa-2022-169.md),[TFSA-2022-086](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/security/advisory/tfsa-2022-086.md) ([CVE-2022-35935](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-35935))

在执行`tf.raw_ops.SobolSample(dim=tf.constant([1,0]), num_results=tf.constant([1]), skip=tf.constant([1]))`时`SobolSample`会创建`dim`维数的矩阵，所以需要检查dim是否为标量。

- [TFSA-2022-131](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/security/advisory/tfsa-2022-131.md) ([CVE-2022-36005](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-36005))

没有检查输入是否为标量