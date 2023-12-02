---
Title: "TITANFUZZ"
Tags: ["2023", "DL framework", "ISSTA", "LLM", "Read", "fuzzing"]
Authors: ['Deng', 'Yinlin', 'Xia', 'Chunqiu Steven', 'Peng', 'Haoran', 'Yang', 'Chenyuan', 'Zhang', 'Lingming']
Collections: ["patch detection ▸ DL"]
Created time: November 27, 2023 2:46 PM
Conference: ISSTA
Date Added: October 28, 2023 8:00 AM (UTC)
Short Title: TITANFUZZ
Text: 使用LLM生成API sequence用于fuzzing
Full Title: "Large Language Models are Zero-Shot Fuzzers: Fuzzing Deep-Learning Libraries via Large Language Models"
URL: http://arxiv.org/abs/2212.14834
Year: 2023
code: https://github.com/ise-uiuc/TitanFuzz
---
# Large Language Models are Zero-Shot Fuzzers: Fuzzing Deep-Learning Libraries via Large Language Models

code: https://github.com/ise-uiuc/TitanFuzz

## Introduction

- Lack of diverse API sequences.
    - API-level fuzzing. 生成single code line input而不是API sequence，难以发现由于chained API sequences导致的bug。
    - model-level fuzzing. 可以测试API sequences但是通常使用严格的变异规则，导致其只能覆盖有限模式下的部分API。
        - LEMON不能对层应用不同的输入输出形状
        - Muffin人工标注considered API的输入输出限制，并使用额外的reshaping operation确保有效连接。
    
<img src="/TITANFUZZ/Untitled.png" className="img"/>    
    > A random input is created and the code produces an intermediate variable by invoking the log API. The log function will produce NaN (Not a Number) for negative inputs. In theory, when matrix_exp is applied it should also contain NaN values. However, when running this code on GPU, it does not output any NaN values. More interestingly, this incorrect behavior on GPU cannot be reproduced if we just pass the intermediate tensor (which contains NaN) instead of the API call log to matrix_exp.
    > 
- Cannot generate arbitrary code.

## Approach

<img src="/TITANFUZZ/Untitled%201.png" className="img"/>
## Results

- API coverage. TitanFuzz is able to cover 1329 / 2215 APIs with 20.98% / 39.97% coverage on PyTorch and TensorFlow respectively

<img src="/TITANFUZZ/Untitled%202.png" className="img"/>
- line coverage. Python code coverage https://github.com/nedbat/coveragepy.

<img src="/TITANFUZZ/Untitled%203.png" className="img"/>