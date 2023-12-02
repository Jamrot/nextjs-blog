---
Title: "FICS"
Tags: ["Read", "inconsistency", "star"]
Authors: ['Ahmadi', 'Mansour', 'Farkhani', 'Reza Mirzazade', 'Williams', 'Ryan', 'Lu', 'Long']
Collections: ["patch detection ▸ recurring", "patch detection ▸ vulnerability detection"]
Created time: November 21, 2023 2:07 PM
Conference: USENIX Security
Date Added: August 30, 2023 9:16 AM (UTC)
Short Title: FICS
Text: 两步聚类找到1）功能相似代码片段中的 2）inconsistency，根据经验规则筛选报告。
Full Title: "Finding Bugs Using Your Own Code: Detecting Functionally-similar yet Inconsistent Code"
URL: https://www.usenix.org/conference/usenixsecurity21/presentation/ahmadi
Year: 2021
code: https://github.com/RiS3-Lab/FICS
---
# Finding Bugs Using Your Own Code: Detecting Functionally-similar yet Inconsistent Code

code: [https://github.com/RiS3-Lab/FICS](https://github.com/RiS3-Lab/FICS)

目前基于深度学习的相似漏洞检测：1. 需要已知漏洞的数据集，2. 只能针对某些特定的漏洞类型进行检测。为此作者提出FICS，通过两步聚类首先找到功能相似的代码片段，然后通过第二次聚类找到功能相似代码片段中的inconsistency，最后通过经验规则筛选出更有可能是bug的报告。

<img src="/FICS/Untitled.png" className="img"/>
## Motivation

<img src="/FICS/Untitled%201.png" className="img"/>
- 现有方法majority-voting→FICS可以检测one-to-one inconsistency

## Workflow

<img src="/FICS/Untitled%202.png" className="img"/>
1. 构建Construct：过程内数据依赖关系图
2. 功能相似聚类：不考虑edge，对Construct进行聚类，找到功能相似的Constructs。
3. Inconsistency聚类：考虑edge，对功能相似的Construct再次聚类，找到inconsistency。
4. Deviation Analysis：通过人工总结的规律筛选出更有可能是bug的报告。

<img src="/FICS/Untitled%203.png" className="img"/>
## Results

<img src="/FICS/Untitled%204.png" className="img"/>
- 作者自己构造了数据集iBench包括Linux drivers, OpenSSL, libzip, and mbedtls五个数据集里的22个bug，用于测试FICS检测不同类型漏洞的能力。
- 作者在QEMU, OpenSSL, wolfSSL, OpenSSH, and LibTIFF五个数据集进行进一步漏洞挖掘，发现了22个developer-confirmed bugs。其中，70%为missing check，20%为memory/information leak，还有一个 bad casting in a condition check，以及一个未初始化变量。

## Limitations

1. 需要代码库的代码量足够大
2. one-liners bug（太小无法被检测到）或者full basic block（太大无法找到functional similarity）
3. graph-based code对内存需要较高，无法检测过大的代码库（如linux kernel）。