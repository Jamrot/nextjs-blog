---
Title: "GPTScan"
Tags: ["LLM", "Read", "logic bug", "smart contract", "star"]
Authors: ['Sun', 'Yuqiang', 'Wu', 'Daoyuan', 'Xue', 'Yue', 'Liu', 'Han', 'Wang', 'Haijun', 'Xu', 'Zhengzi', 'Xie', 'Xiaofei', 'Liu', 'Yang']
Collections: ["patch detection ▸ logic bug"]
Conference: arxiv
Date Added: September 15, 2023 5:59 AM (UTC)
Short Title: GPTScan
Text: 利用GPT匹配代码与人工设置的vulnerable功能和操作，结合静态分析确认逻辑漏洞。
Full Title: "When GPT Meets Program Analysis: Towards Intelligent Detection of Smart Contract Logic Vulnerabilities in GPTScan"
URL: http://arxiv.org/abs/2308.03314
Year: 2023
---
# When GPT Meets Program Analysis: Towards Intelligent Detection of Smart Contract Logic Vulnerabilities in GPTScan

现有方法主要通过**固定的控制流图或数据流图模式匹配**（例如重入、整数溢出和权限控制）。但近期有调查显示，现有方法由于缺少对特定领域的属性描述和检查，导致80%的Web3安全漏洞都无法被检测到。

本文结合GPT和静态分析技术，检测智能合约中的逻辑漏洞。

受限于GPT的预训练知识，只用GPT会导致高假阳率，作者使用GPT作为代码理解的工具。1）通过将每个逻辑漏洞类型拆解为scenatios和properties，使用GPT匹配可能的漏洞。2）利用GPT识别关键变量和状态，3）静态分析确认漏洞。

- smart contract 智能合约
- logic vulnerability 逻辑漏洞
- GPT

## INTRODUCTION

> “Scenarios describe the code functionality under which a logic vulnerability could occur, while properties explain the vulnerable code attributes or operations.”
> 

## BACKGROUND

## OVERVIEW

1. 将逻辑漏洞的类型转换成scenarios & properties。
2. 用GPT匹配函数中的scenario和property确定逻辑漏洞类型，并提取关键变量/statements。
3. 使用静态检测工具（漏洞类型+关键变量/状态）确定是否存在特定类型的漏洞。

<img src="/GPTScan/Untitled.png" className="img"/>
## LIMITATION

## Summary

- scenario & property
    - 这里的scenario和property更像是对于pattern的自然语言描述，而非对任务目的的描述。
    - 但会不会只是作者实现上的问题？即仍需要澄清代码功能和代码目的的区分在于什么。

> “Scenarios describe the code functionality under which a logic vulnerability could occur, while properties explain the vulnerable code attributes or operations.”
> 
- 基于静态分析的漏洞确认

C1: filter function

- 选出sodility files
- 过滤第三方库（openzeppelin）的函数（认为第三方库函数都是可靠的）
- vulnerability-specific function filtering (FNK, FCE, etc)
    - 人工总结
- reachability analysis: ANTLR, access control annotations
    - onlyOwner：不可达

C2: How to break down vulnerability type?

- scenarios & properties

C3: unreliable answers

- 静态分析

没有考虑多个函数组合产生的漏洞

区别于缓冲区溢出，和业务逻辑相关联。

从业务中延申出来，越权…

对于逻辑漏洞没有具体的定义

- 静态分析不好做的：理解变量的语义
- 用大模型分析逻辑（？）可能做但不好做的地方