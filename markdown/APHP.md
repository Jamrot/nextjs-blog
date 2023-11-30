---
Title: "APHP"
Tags: ["Read", "patch", "star"]
Authors: ['Lin', 'Miaoqian', 'Chen', 'Kai', 'Xiao', 'Yang']
Collections: ["patch detection ▸ recurring", "patch detection ▸ vulnerability detection"]
Conference: USENIX Security
Date Added: September 6, 2023 1:59 AM (UTC)
Short Title: APHP
Text: 利用补丁提取API Post-Handling行为oracle，比较目标代码与补丁代码的APH模式。
Full Title: "Detecting {API} {Post-Handling} Bugs Using Code and Description in Patches"
URL: https://www.usenix.org/conference/usenixsecurity23/presentation/lin
Year: 2023
---
# **Detecting API Post-Handling Bugs Using Code and Description in Patches**

code: 

程序的API必须按照规范使用。API 后处理（API post-handling, APH）是一种常见的规范类型，处理 API 的返回检查、资源释放等。APH漏洞（违反APH规范）可能导致严重的安全问题，包括内存损坏、资源泄露等。API文档作为APH规范的良好来源，经常被用于分析以提取APH错误检测的规范。然而，APH文档可能是不完整的，这使得许多错误无法被发现。
在本文中，作者认为补丁可能是 APH 规范的另一个良好来源。补丁中不仅包含code difference还包含description，有助于提取APH规范。为了使漏洞检测准确高效，作者设计了一种基于API规范的图（APH specification-based graph, ASG），以减少分析的路径数量，并进行部分路径敏感分析。最终，作者实现了APHP (API Post-Handling bugs detector using Patches)，用于 APH 错误的静态检测。并在四种流行的开源程序（Linux kernel、QEMU、Git和Redis）上评估APHP，检测到410个新漏洞，优于现有的sota。其中216个漏洞已被维护人员确认，并已分配 2 个 CVE。

## Introduction

在某个特殊的API调用之后，开发者需要执行相关的后续操作post-operation（例如检查返回值或内存释放）。在Figure 1中，当target API platform_device_add_properties 在第 7 行失败时，在第 3 行分配的变量 dwc->dwc3 不会通过操作后 platform_device_put 释放，会造成内存泄漏。

<img src="/APHP/Untitled.png" className="img"/>
现有针对API post-handling (APH bug)的检测方法多基于API文档或相似源码来推断APH规范，并检查代码实现是否与规范一致。但文档的质量不一定够好，甚至有时APH规范是缺失的，导致无法进行规范提取。

现有的基于patch的检测方法受限于相似漏洞，目标程序代码只有与补丁中的漏洞代码相似时，漏洞才能够被检测到。然而，就算是同一个API，其用法也多种多样，导致现有方法无法检测到APH漏洞。

APHP (API PostHandling bugs detector using Patches) 是一个用补丁检测APH漏洞的静态框架。APHP由两个主要部分组成：1）从补丁中进行规范提取，2）通过检查代码和所提取的规范的一致性检测APH漏洞。

## Overview

<img src="/APHP/Untitled%201.png" className="img"/>
### APH Specification Extraction

1）预处理

- 使用Pydriller提取补丁代码及描述：定位修改的文件，并获取修复后的函数；计算AST difference
- 为修改前和修改后的函数分别构建Code Property Graphs, CPG

2）确定后续操作 post-operation

- 主要关注条件判断和调用语句
- 对于direct fix通过AST-difference提取添加的状态；对于indirect fix通过比较CPG经过added/deleted statement的路径（patched path/buggy path），如果有多条可能的buggy path则选择与patched path最相似的作为真正的buggy path。

3）确定目标API

- 通过patch code中的代码semantic确定所有可能的API，并通过与patch description匹配最终确定target API。

4）提取关键变量（被API影响并需要后续操作的变量）

5）收集路径条件

- pre-condition：目标API的执行状态（success/failure）
- post-condition：路径返回值的状态（normal/error）
- 通过分析函数的CPG收集路径条件

### Bug Detection

1）生成APH specification-based graph (ASG)：关注由于被目标API改变而需要后续操作的关键变量。

2）路径验证：是否满足pre- & post-condition；是否存在post-operation。

<img src="/APHP/Untitled%202.png" className="img"/>
# Summary

- 如何对补丁进行的应用？

<img src="/APHP/Untitled%203.png" className="img"/>
1）从补丁中提取APH规范：post-operation, target API, critical variable, path conditions.

2）通过对目标函数进行路径敏感分析（CFG+ASG），确定违反APH漏洞的行为（APH漏洞）。

<img src="/APHP/Untitled%204.png" className="img"/>