---
Title: "TENSORSCOPE"
Tags: ["2023", "DL framework", "Read", "USENIX Security", "differential fuzzing", "inconsistency"]
Authors: ['Deng', 'Zizhuang', 'Meng', 'Guozhu', 'Chen', 'Kai', 'Liu', 'Tong', 'Xiang', 'Lu', 'Chen', 'Chunyang']
Collections: ["patch detection ▸ DL"]
Created time: November 21, 2023 1:29 PM
Conference: USENIX Security
Date Added: October 22, 2023 2:16 PM (UTC)
Short Title: TENSORSCOPE
Text: differential fuzzing检测不同DL框架的API不一致
Full Title: "Differential Testing of Cross Deep Learning Framework {APIs}: Revealing Inconsistencies and Vulnerabilities"
URL: https://www.usenix.org/conference/usenixsecurity23/presentation/deng-zizhuang
Year: 2023
code: https://github.com/tensorscopepro/Tensorscope
---
# Differential Testing of Cross Deep Learning Framework APIs: Revealing Inconsistencies and Vulnerabilities

code: [https://github.com/tensorscopepro/Tensorscope](https://github.com/tensorscopepro/Tensorscope)

- 同一模型在不同深度学习框架下输出结果的不一致

使用差分测试的方法对API不一致性漏洞进行检测。

1）通过分析每个模型converter的等价转换规则，提取相应API作为测试对象。

2）通过API描述和代码实现，提取parameter constraints。（在代码中提取assertion和error-handling信息，当测试由于错误信息退出时，提取错误信息中相关的constraints。）

<img src="/TENSORSCOPE/Untitled.png" className="img"/>
- crash: APIs under test exit unexpectedly (e.g., segmentation fault)
- invalid test case: exception and throw error messages，用于优化生成test case。

### 检测到的漏洞

<img src="/TENSORSCOPE/Untitled%201.png" className="img"/>
“CWE617 (Reachable Assertion), CWE-125 (OOB Read), CWE-20 (Improper Input Validation), CWE-682 (Incorrect Calculation), and CWE-77 (Command Injection)” (Deng 等, 2023, p. 7404) (pdf)

- inconsistent bugs (non-crash)
    - precision bugs. 计算精度不同
    - data layout bugs. 输入数据的维度顺序不同（e.g., NHWC v.s. NCHW）
    - difference exception handling bugs. 返回的错误代码不同
- crash bugs
    - reachable assertion (CHECK-failure)：缺少对参数是否为标量的检查
    - OOB Read/Write. 在计算过程中存在超出分配内存的张量数组。e.g., indices和data大小不匹配
        
        ```
        data = [10, 20, 30, 40, 50]  # 数据数组，长度为5
        indices = [0, 1, 2, 5]        # 索引数组，长度为4
        offset = len(data)  # 这里offset是5
        
        for i in indices:
            adjusted_index = i - offset  # 这可能导致负数索引
            print(data[adjusted_index])
        ```
        
    - floating point exception (28).  (invalid operation, division by zero, overflow, underflow). 缺少corner-case检查，没有检查输入的函数是否为0。
    - command injection. 在某些用于解析输入字符串或者文件的函数中，不安全地使用eval。
        - **CVE-2022-45907：pytorch**
            - statement不应该含有method或者函数调用
            - [https://github.com/pytorch/pytorch/commit/767f6aa49fe20a2766b9843d01e3b7f7793df6a3](https://github.com/pytorch/pytorch/commit/767f6aa49fe20a2766b9843d01e3b7f7793df6a3)
        - **CVE-2022-45908：paddle**
            - eval动态获取传入的窗函数名称是不安全，
            - [https://github.com/PaddlePaddle/Paddle/commit/26c419ca386aeae3c461faf2b828d00b48e908eb](https://github.com/PaddlePaddle/Paddle/commit/26c419ca386aeae3c461faf2b828d00b48e908eb)
            - `window_function_register.get('_' + winstr)`方法从一个预先定义好的字典中获取窗函数。这样，即使用户尝试传入一个恶意或者未定义的窗函数名称，代码也只是会抛出一个“未知窗函数类型”的错误，而不会执行任何不安全的操作。

---

## USENIX Security 2023 | TENSORSCOPE

- 同一模型在不同深度学习框架下输出结果的不一致

使用差分测试的方法对API不一致性漏洞进行检测。

1）通过分析每个模型converter的等价转换规则，提取相应API作为测试对象。

2）通过API描述和代码实现，提取parameter constraints。（在代码中提取assertion和error-handling信息，当测试由于错误信息退出时，提取错误信息中相关的constraints。）

### 主要的几种inconsistency错误类型：

- Incorrect usage of APIs.
- Incompatible versioning.
- Differences in dependency libraries.
- Different Implementations.
- Inconsistent model conversion.

crash：API意外退出（e.g., segmentation fault）

inconsistency：数值距离超过一定大小

### bug & vulnerability type

bugs type: precision bugs, data layout bugs, different exception handling bugs

vulnerability type: code injection, OOB read, incorrect calculation, reachable assertion, improper input validation

### Related Works

- model-based testing：将数据输入不同模型，观察DL框架是否返回错误。
    - identify and locate cross-framework inconsistency among multiple backends
    - 模型参数&输入
    - 差分测试后端框架
- API-based testing
- **Model-based 测试** 主要关注的是模型本身以及模型在不同环境、条件或框架下的表现。这通常用于验证模型的一致性和准确性，确保在从一个框架迁移到另一个框架，或者在不同版本的同一框架之间，模型的表现是一致的。
- **API-based 测试** 则主要针对框架提供的 API 功能进行。这包括检查 API 是否能正确处理各种输入参数，是否能妥善处理边界和异常情况，以及不同框架的同名 API 是否具有一致的行为等。