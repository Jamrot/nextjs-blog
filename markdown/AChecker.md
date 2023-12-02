---
Title: "AChecker"
Tags: ["Read", "access control", "smart contract", "star"]
Collections: ["patch detection ▸ logic bug"]
Created time: November 21, 2023 2:23 PM
Conference: ICSE
Date Added: September 25, 2023 3:09 AM (UTC)
Short Title: AChecker
Text: 通过静态数据流分析确定access control check，并通过符号分析排除intended behavior。
Full Title: "AChecker: Statically Detecting Smart Contract Access Control Vulnerabilities"
URL: https://ieeexplore.ieee.org/document/10172877
Year: 2023
code: https://github.com/DependableSystemsLab/AChecker
---
### access control

- 不依赖预定义的pattern或者contract transactions history
- 通过静态数据流分析推断access control功能
    - access control功能：根据访问控制状态变量（代表不同权限的用户）检查**contract caller**是否满足访问控制要求
- 通过符号分析排除误报（程序目的是使未授权者获得权限）

### Related Work

- Ethainter：需要pre-defined patterns，无法穷举，可扩展性不好。
- SPCon：基于历史交易记录，如果没有记录就找不到。
    - 通过区块链交易的历史角色挖掘access control roles，但并非所有合约函数都会被调用并进行交易（如从区块链中删除智能合约）。

### Motivation

<img src="/AChecker/Untitled.png" className="img"/>
<img src="/AChecker/Untitled%201.png" className="img"/>
Access control vulnerabilities

- 一种是由于权限检查可以被攻击者绕过，violated access control check (VACC)。
- 一种是由于对于关键操作缺少安全检查，missing access control check (MACC)。

【insight：通过分析形成检查条件的数据依赖，可以识别出访问控制检查。】

### Overview

1）静态数据流分析，确定合约中使用的access control checks，存储access control数据的相关状态变量，以及应当被保护的关键指令。

- 访问控制检查：满足CALLER & SLOAD的条件检查
- 关键指令：调用合约的caller
- 状态变量：访问控制变量SLOAD

2）污点分析，找到从user input到状态变量/关键指令的路径。

3）符号执行，过滤不可达路径及符合合约目的的路径。

1）确定访问控制操作

- access control功能：根据访问控制状态变量（代表不同权限的用户）检查**contract caller**是否满足访问控制要求
- contract caller（src code: msg.sender, bytecode: CALLER）：调用合约的外部实体或地址。（e.g., 尝试执行switchLiquidity函数的地址或实体，其地址可以通过msg.sender获得。）
- 首先提取条件控制指令中的CALLER，通过backward data-flow analysis确定可能的访问控制变量s。
- C：CALLER和SLOAD由数据依赖关系的条件，可能含有不是access control check的行为（使用contract caller作为键值获取storage mapping中的值，require(balances[msg.sender] >= amount）→使用数据流分析，对表示访问控制状态变量的mapping和其他mapping进行区分。
- 过滤访问控制状态变量s：1）s不是mapping，2）s是mapping且变量类型为布尔，3）s是mapping且变量类型不为布尔，但通过forward数据流分析发现，条件中的mapping没有用于后续操作。

2）检测漏洞

- 静态污点分析：使用用户输入作为source，关键指令和访问控制状态变量作为sink。
- 是否存在sanitizer，防止用户控制关键指令或操纵访问控制状态变量。

<img src="/AChecker/Untitled%202.png" className="img"/>
- e.g.，VAAC：如果存在一条路径，使用户输入（msg.sender）可以更改访问控制状态变量（owner）值，则认为可能存在VAAC。

3）过滤intended behaviors

- intended behavior：如果访问控制状态变量被其他检查（non-access control check）所保护，那么这个行为很可能是intended behavior而不是access control vulnerability。
    - C：直接将被其他检查（non-access control check）所保护的访问控制状态变量视作intended behavior可能导致FN。
- 符号执行：检查污点分析得到的路径是否在检查为否定限制下**可达**。如果存在不可达路径，则认为是intended behavior，否则认为是漏洞。

### Limitation

需要预定义critical instructions（SELFDESTRUCT, DELEGATECALL, etc.）

### Related Work

- Ethainter (access control vulnerabilities)：基于抽象输入语言的推理规则进行信息流分析，可扩展性不好。
- SPCon (permission bugs)：基于历史交易记录，如果没有记录就找不到。
    - 通过区块链交易的历史角色挖掘access control roles，但并非所有合约函数都会被调用并进行交易（如从区块链中删除智能合约）。

### Others

- 访问控制检查：在智能合约S中有条件控制状态C。只有在C验证通过后，S的caller才能执行C保护下的代码，则C为一个访问控制检查。
- 访问控制变量：1）C通过比较caller和变量D的值，2）C通过caller载入变量D的值，则D为访问控制变量。
- 授权用户：地址属于D的用户

---

# AChecker: Statically Detecting Smart Contract Access Control Vulnerabilities. ICSE 2023.

code: [https://github.com/DependableSystemsLab/AChecker](https://github.com/DependableSystemsLab/AChecker)

# Background

## Access Control Vulnerability

**Challenges**：

1）由于缺少specifications所以难以确定access control checks → access control check具有独特的functionality可以通过分析数据依赖关系找到（condition+CALLER-SLOAD data dependency）

2）智能合约可能存在和漏洞相似的功能模式（intended behavior）→ filtering intended behavior

- violated access control check (VACC)：权限检查可以被攻击者绕过
- missing access control check (MACC)：关键操作缺少安全检查

## Related Work

- Ethainter：需要pre-defined patterns，无法穷举，可扩展性不好。
- SPCon：基于历史交易记录，如果没有记录就找不到。

## Others

- **access control functionality**：根据访问控制状态变量（代表不同权限的用户）检查**contract caller**是否满足访问控制要求（条件控制+CALLER和SLOAD的数据依赖）
- **contract caller**（src code: ***msg.sender***, bytecode: ***CALLER***）：调用合约的外部实体或地址。（e.g., 尝试执行switchLiquidity函数的地址或实体，其地址可以通过msg.sender获得。）

# Motivation

<img src="/AChecker/Untitled.png" className="img"/>
在Fig. 1中是一个VACC（违反访问控制检查）的例子。由于开发者对于UBSecToken的命名错误，使本该为constructor的函数（constructor只在初始化时调用一次），可以在运行时被人调用。导致任何用户都可以调用这个函数成为owner，进行freezeAccount, switchLiquidity, transfer等操作。

# Overview

<img src="/AChecker/Untitled%203.png" className="img"/>
## 确定access control check

对**条件分支**进行backward data-flow analysis，如果数据流中存在**CALLER和SLOAD的数据依赖**，则认为该操作为访问条件控制检查。

- e.g.，对条件分支JUMPI(#8, %5)进行反向数据流分析，可以得到%1~%5，其中%1 SLOAD和%4 CALLER有数据依赖关系，可以判断这是一个access control check。

<img src="/AChecker/Untitled%201.png" className="img"/>
**Challenge**：CALLER和SLOAD由数据依赖关系的条件，可能含有不是access control check的行为
（e.g.，使用contract caller作为键值获取storage mapping中的值，require(balances[msg.sender] >= amount）。
→使用数据流分析，对表示访问控制状态变量的mapping和其他mapping进行区分。

- 过滤访问控制状态变量s：1）s不是mapping，2）s是mapping且变量类型为布尔，3）s是mapping且变量类型不为布尔，但通过forward数据流分析发现，条件中的mapping没有用于后续操作。

## 检测VACC/MACC漏洞

- 静态污点分析：使用用户输入作为source，关键指令和访问控制状态变量作为sink。
- 是否存在sanitizer，防止用户控制关键指令或操纵访问控制状态变量。

<img src="/AChecker/Untitled%202.png" className="img"/>
- e.g.，VAAC：如果存在一条路径，使用户输入（msg.sender）可以更改访问控制状态变量（owner）值，则认为可能存在VAAC。

## 过滤intended behaviors

- intended behavior：如果访问控制状态变量被其他检查（non-access control check）所保护，那么这个行为很可能是intended behavior而不是access control vulnerability。

**Challenge**：直接将被其他检查（non-access control check）所保护的访问控制状态变量视作intended behavior可能导致FN。
→使用符号执行通过路径可达性判断是否为intended behavior。

- 符号执行：检查污点分析得到的路径是否在检查为否定限制下**可达**。如果存在不可达路径，则认为是intended behavior，否则认为是漏洞。

# Limitation

需要预定义critical instructions（SELFDESTRUCT, DELEGATECALL, etc.）