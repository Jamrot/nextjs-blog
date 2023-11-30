---
Title: "Repairing deep neural networks: fix patterns and challenges"
Tags: ["DNN implementation", "ICSE", "Read"]
Authors: ['Islam', 'Md Johirul', 'Pan', 'Rangeet', 'Nguyen', 'Giang', 'Rajan', 'Hridesh']
Collections: ["patch detection ▸ DL"]
Conference: ICSE
Date Added: November 6, 2023 8:16 AM (UTC)
Text: DNN用户使用DNN实现模型时的bug，为自动修复DNN实现问题提供指导。
Full Title: "Repairing deep neural networks: fix patterns and challenges"
URL: https://dl.acm.org/doi/10.1145/3377811.3380378
Year: 2020
---
- What challenges should automated repair tools address?
- What are the repair patterns whose automation could help developers?
- Which repair patterns should be assigned a higher priority for building automated bug repair tools?

- DNN bug fix与传统bug fix不同的修复模式
- DNN bug fix常见模式：修复数据维度和神经网络连接
- DNN bug fix常常引入新的bug，可能导致对抗性漏洞。
- DNN bug fix主要挑战：bug定位、已训练模型的复用、应对频繁的发布

# Introduction

修复的特点

RQ1 (Common bug fix patterns) What are the most common bug fix patterns? 

修复数据维度和神经网络连接

RQ2 (Fix pattern across bug types) Are the bug fix patterns different for different bug types? 

RQ3 (Fix pattern across libraries) Are the bug fix pattern different for different libraries? 

RQ4 (Risk in fix) Does fixing a DNN bug introduces a new bug? 

RQ5 (Challenges) What are the challenges in fixing DNN bugs?

# Methodology

## Bug Fix Pattern

<img src="/Repairing_deep_neural_networks_fix_patterns_and_ch/Untitled.png" className="img"/>
# Related Work

Md Johirul Islam, Giang Nguyen, Rangeet Pan, and Hridesh Rajan. 2019. A Comprehensive Study on Deep Learning Bug Characteristics. In Proceedings of the 2019 27th ACM Joint Meeting on European Software Engineering Conference and Symposium on the Foundations of Software Engineering (ESEC/FSE 2019). ACM, New York, NY, USA, 510–520.

Yuhao Zhang, Yifan Chen, Shing-Chi Cheung, Yingfei Xiong, and Lu Zhang. 2018. An empirical study on TensorFlow program bugs. In Proceedings of the 27th ACM SIGSOFT International Symposium on Software Testing and Analysis. ACM, 129–140.