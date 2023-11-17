---
Title: CCS 2021 | IPPO
Tags: ["paper", "similarity"]
Created time: September 2, 2023 1:14 PM
Text: https://github.com/dinghaoliu/IPPO
Subtitle: Non-Distinguishable Inconsistencies as a Deterministic Oracle for Detecting Security Bugs
---
# Non-Distinguishable Inconsistencies as a Deterministic Oracle for Detecting Security Bugs
缺少安全操作security operation（例如bound check）是造成安全漏洞的一个主要原因。由于在大规模程序中，很难判断安全操作在当前context下是否是必要的，所以难以自动化检测代码中漏掉的安全操作。已有方法主要应用了cross-checking，通过收集功能相似的代码切片进行投票，以将少数deviation识别为安全漏洞。但这类方法严重依赖相似代码的数量，而实际上许多代码片段是独特的，所以很多时候我们可能没有办法找到足够的相似代码片段来使用cross-checking。
IPPO (Inconsistent Path Pairs as a bug Oracle)是一种基于差异检查differential checking检测安全漏洞的静态分析方法。IPPO定义了几条规则，用于检测对同一对象object使用相似semantic的代码路径，并将它们视为相似路径对similar-path pairs。如果其中一条路径使用了安全操作，但另一条路径没用，那么IPPO就会将其报告为可能的安全漏洞。相比传统的代码相似性分析方法，IPPO精确率更高。通过对相似路径对的差异检查，IPPO满足了cross-cheking对大规模相似代码片段的需求。作者在4个开源程序（Linux kernel, OpenSSL library, FreeBSD kernel, and PHP）中对IPPO进行评估，IPPO在以上系统中分别发现了154，5，1，1个新安全漏洞，其中136个补丁已经被维护者接收。

## Overview

1）在目标程序中检测安全操作

2）在安全操作中提取关键变量（对象 object）

3）根据每个函数中的关键变量确定并收集全部的相似路径对similar-path pairs

- 生成控制流图CFG→检测异常处理边→生成基于返回值的图RVG (post-condition of Rule4)→收集reduced similar paths, RSP (Rule1)→检查OSPP规则(Rule2, Rule3, pre-condition of Rule4)

4）对基于对象的相似路径对object-based similarity-path pairs, OSPP进行differential checking，将缺少安全操作的路径报告为潜在漏洞。

### Rules

Rule 1: The two paths start at the same block and end at the same block in CFG. 两条路径起始和结束在控制流图的相同块。

Rule 2: The object has the same state in two paths. 两条路径的对象具有相同状态。

Rule 3: The two paths have the same SO-influential operations. 两条路径中具有相同的安全影响操作。

Rule 4: The two paths have the same sets of pre- and post-conditions against the object. 两条路径中对象的前置和后置条件相同。

- 在收集相似路径对时，如果根据Rule 1收集一个函数内所有起始和结束在相同块的路径，会导致**路径爆炸**。→收集reduced similar paths (RSPs)，只收集除了起始和结束块外，没有共同基础块的路径。
- **相似对爆炸**。→将控制流图根据返回值（正常值/异常值）分块（return value-based graphs, RVG）以满足Rule 4中后置条件相同的条件。

# Summary

- code: [https://github.com/dinghaoliu/IPPO](https://github.com/dinghaoliu/IPPO)
- 检测粒度：函数内
- 检测范围：memory leak, refcount leak, missing unlock, UAD/DF.