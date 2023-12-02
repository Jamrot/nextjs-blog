---
Title: "FuzzGPT"
Tags: ["2024", "DL framework", "ICSE", "LLM", "Read", "fuzzing"]
Authors: ['Deng', 'Yinlin', 'Xia', 'Chunqiu Steven', 'Yang', 'Chenyuan', 'Zhang', 'Shizhuo Dylan', 'Yang', 'Shujing', 'Zhang', 'Lingming']
Collections: ["patch detection ▸ DL"]
Created time: November 29, 2023 1:23 PM
Conference: ICSE
Date Added: November 3, 2023 1:55 PM (UTC)
Short Title: FuzzGPT
Text: 使用LLM合成unusual programs(corner cases)用于fuzzing
Full Title: "Large Language Models are Edge-Case Fuzzers: Testing Deep Learning Libraries via FuzzGPT"
URL: http://arxiv.org/abs/2304.02014
Year: 2024
---
# Large Language Models are Edge-Case Fuzzers: Testing Deep Learning Libraries via FuzzGPT

由于程序的输入需要同时满足syntax/semantics以及用于构造有效computational graph的tensor/operator的约束，因此生成fuzzing DL library的有效输入是一项具有挑战的工作。

[TitanFuzz](TITANFUZZ%2076af39ce43f248a78da7cb2234eb6062.md) 显示了直接使用LLM生成fuzzing DL library输入的有效性。然而，LLM倾向于生成其在大规模训练语料库看到过的，遵循相似pattern/token的普通程序，而fuzzing则需要生成覆盖edge cases或不太可能手动生成的unusal input。

因此，本文提出FuzzGPT，使用LLM合成unusual programs用于fuzzing。FuzzGPT建立在一个普遍的假设之上：历史bug触发程序可能包含重要的稀有/有价值的代码信息。而传统方法需要大量人工来基于这些历史信息设计generators并确保生成的程序的syntactic/semantic有效性。

FuzzGPT在TensorFlow和Pytorch上共检测到76个bugs，其中49个unknown bugs已经被开发者确认，其中包括11个high-priority bugs/security vulnerabilites. 

## Introduction

- complicated constraints - Figure 1

### Research Gap

- model-level fuzzing
    
    > “Due to the intricate tensor/operator constraints, such model-level fuzzers either only focus on manipulating shapepreserving APIs [70] or require manually-written specifications for each API [24, 35] to preserve model validity.” (Deng et al., 2023, p. 1) (pdf)
    > 
- api-level fuzzing
    - 通过effective input generation或者oracle inference测试单个API。虽然API-level fuzzing可以覆盖大量API，但无法检测到因为不同DL API交互而产生的错误。

### Approach

- FuzzGPT

（1）由DL library开源库中的bug report构建bug-triggering代码片段数据集

（2）in-context learning

- few-shot, bug-triggering programs，用于生成新代码片段。
- zero-shot, partial bug-triggering program，自动完成部分代码。

（3）fine-tuning：在extracted historical bug-triggering program上微调用于生成相似bug-triggering代码片段的模型

## Approach

<img src="/FuzzGPT/Untitled.png" className="img"/>
<img src="/FuzzGPT/Untitled%201.png" className="img"/>
## Results

### Coverage

- same API coverage but higher code coverage

> We also observe an interesting fact that FuzzGPT has similar API coverage with TitanFuzz but has much higher code coverage. This demonstrates that FuzzGPT can cover much more interesting code behaviors/paths for DL libraries.
> 

<img src="/FuzzGPT/Untitled%202.png" className="img"/>