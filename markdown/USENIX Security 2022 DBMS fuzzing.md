---
Title: USENIX Security 2022 | DBMS fuzzing
Tags: logic bug, paper
Created time: September 14, 2023 3:36 PM
Text: 利用fuzzing生成查询语句，通过构建功能相同的query检查结果是否一致作为oracle，判断查询结果正确性。
---
# Detecting Logical Bugs of DBMS with Coverage-based Guidance

code：[https://github.com/psu-security-universe/sqlright](https://github.com/psu-security-universe/sqlright)

数据管理系统（DBMS）是现代数据密集型应用的关键组件。目前开发者采用了许多测试技术来检测DBMS错误，例如crash和assertion failures。然而，已有的工作大多无法检测到导致DBMS返回错误结果的逻辑错误。最近的工作提出了几种预言机来识别不正确的结果，但它们依赖基于规则的表达式生成来合成查询。

在本文中，我们结合coverage-based guidance、validity-oriented mutation和oracles来检测 DBMS系统中的逻辑错误。具体来说，我们首先设计了一组通用API来解耦fuzzer和oracle的逻辑，以便开发人员可以轻松移植模糊测试工具来测试DBMS，并为现有fuzzer编写新的oracle。然后，我们使用validity-oriented mutation来生成高质量的查询语句，以便发现更多的逻辑错误。我们的原型SQLRight优于仅依赖预言机或代码覆盖率的现有工具。SQLRight总共从两个经过充分测试的 DBMS（SQLite 和 MySQL）中检测到 18 个逻辑错误。所有错误均已得到确认，其中 14 个错误已得到修复。

- 用Fuzzing生成查询语句
- 用Oracle判断查询结果正确性

## Introduction

由于logical bug通常不会造成crash而是会导致DBMS系统返回错误的结果，所以目前使用查找crash或者assertion failure的方法无法检测到logical bug。

针对**oracle**的工作将SQL序列转换成semantic相等的形式，**通过判断在执行不同路径时DBMS结果的一致性判断是否存在logical bug**。目前的方法使用基于规则的生成器来生成original query，耗时耗力，可能限制了其探索程序状态的能力。而fuzzing的方法可以有效解决上述问题。

考虑到本文主要是关注logical bug，而现有的fuzzing方法会生成很多有crash或者assertion failure的query，无法用于检测logical bug。所以本文提出validity-oriented mutation 有效性导向的突变策略。此外，为了解决fuzzer和DBMS oracles缺少统一接口的问题，本文还设计了一组API来简化这个过程。

…实现了四种预言机，包括之前的工作提出的两种和本文提出的两种。

## Case - logical bug


该问题是对SELECT的优化不正确造成的。当SELECT语句的WHERE中所有的行都连接到unique indexes，SQLite将DISTINCT当作冗余而忽略，但是没有考虑到partial index（unique index仅连接了部分行）的情况。

即虽然*pid*（WHERE中所有的行）都有unique index (*idx)*（都连接到unique index），但是*idx*仅连接到了*pid=1*（*idx*是一个仅连接了部分*pid*行的partial index）。对于unique index (*idx*)没有连接到的情况（*pid=10*），SELECT不应该忽略DISTINCT。

## Detecting Logic Bugs in DBMSs

### Differential Analysis 差分分析

- 把一个query发给不同的DBMS，检查结果是否一致。

### Oracle

- 构建功能相同的query，检查结果是否一致。

本文中应用了4种oracle，NoREC, TLP, Index, Rowid。

- NoREC：将所有条件从 WHERE 子句转移到 SELECT 表达式，这有效地禁用了应用于原始查询的大多数优化。修改后的查询的 TURE 行数应与原始查询的行数相同。 Detecting Optimization Bugs in Database Engines via Non-optimizing Reference Engine Construction. ESEC/FSE 2020.
- TLP：将 WHERE 子句中的条件 x 拆分为三个子查询：x IS TRUE、x IS FALSE 和 x IS NULL。它结合了三个子查询的结果并检查与原始子查询的等价性。Finding Bugs in Database Systems via Query Partitioning. OOPSLA 2020.
- Index：从数据库中删除或添加索引不应影响查询结果。（e.g., Listing 1, Listing 2）
- Rowid


## Challenges

1. 现有的fuzzer无法产生高质量SQL queries → validity-oriented mutation
2. 现有fuzzer没法和DBMS oracles结合 → 设计API接口

## Summary

- Logical bug：不会造成crash或者assertion failure，但会使数据库管理系统返回错误结果。
- Oracle：定义query的**正确功能。**通过定义某些修改不应该造成query的功能性错误（即返回结果与original query应该一致），检测是否存在logical bug。
- 基于Oracle和Differential Analysis的方法都是通过分析查询结果的不一致性来检测logical bug（**功能性角度**），而不是从造成logical bug的原因（源码角度）去检测。

---

我点了香薰蜡烛，却把房间搞得烟灰四窜。惊愕中明白原来这是被呛的感受。原来我只在零星几次中沉入湖水，而非溅湿鞋面。雨水在我未想过的地方，窜出。

我不喜欢这些，我的注意力是破碎的沙瓤西瓜。芬芳来自空隙。我剥落成瓢虫的纹身，在放大镜的火下升腾。我哀声呼喊却不能拥抱，咽下的是水，说出的是云。

我在这里嘟嘟囔囔说着不知所云的话，我知道我在说什么，只是你不知道，但我会成为你，在某刻。我疑惑地望着这些裂痕，指甲粗粝得摩擦。

死亡的念头围着地球饶了一圈，一圈，一圈，一圈，它陷入泥土，勒得石块喘不过气，它是否会绷断，是否会腐蚀，oasis，oasis，ocean，ocean，olive，occupy，oh…