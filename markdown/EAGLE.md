---
Title: "EAGLE"
Tags: ["2022", "DL framework", "ICSE", "Read", "differential fuzzing"]
Authors: ['Wang', 'Jiannan', 'Lutellier', 'Thibaud', 'Qian', 'Shangshu', 'Pham', 'Hung Viet', 'Tan', 'Lin']
Collections: ["patch detection ▸ DL"]
Created time: November 21, 2023 1:29 PM
Conference: ICSE
Date Added: October 26, 2023 10:42 AM (UTC)
Short Title: EAGLE
Text: 使用等效图对单一DL框架进行differential fuzzing
Full Title: "EAGLE: Creating Equivalent Graphs to Test Deep Learning Libraries"
URL: https://ieeexplore.ieee.org/document/9794119
Year: 2022
code: https://github.com/lin-tan/eagle
---
# EAGLE: Creating Equivalent Graphs to Test Deep Learning Libraries

code: [https://github.com/lin-tan/eagle](https://github.com/lin-tan/eagle)

EAGLE使用等效图（Equivalent Graphs）来进行单一深度学习实现（例如单一深度学习库）的差异测试。这些等效图使用不同的应用程序编程接口（API）、数据类型或优化来实现相同的功能。理论上，两个等效图在给定相同输入的情况下应该产生相同的输出。EAGLE设计了16个新的深度学习等价规则，并使用这些规则来构建具体的等效图对，并交叉检查这些等效图的输出以检测深度学习库中的不一致性错误。

EAGLE的方法包括三个主要步骤：1）定义等价规则，这些规则应该能广泛应用于多个API和深度学习库；2）根据这些规则构建具体的等效图；3）比较一对具体等效图的输出以检测不一致性错误。

在对TensorFlow和PyTorch这两个广泛使用的深度学习库进行评估后，EAGLE检测到25个错误（TensorFlow中有18个，PyTorch中有7个），其中包括13个以前未知的错误。

现有方法通过使用differential testing测试不同DL框架下相同功能的实现，需要两个DL框架实现相同功能。此外，它们依赖不再维护的high-level library Keras来实现不同DL框架下missing functionality。

EAGLE使用等效图及differential testing测试单一DL框架。等效图使用不同API、数据类型或者优化方式来实现相同的功能，在单一DL框架的等效图应该产生完全一样的输出。EAGLE设计了16个等价规则用以构建具体的等效图对，并交叉检查这些等效图的输出，以检测深度学习库中的不一致性错误。

在对TensorFlow和PyTorch这两个广泛使用的深度学习库进行评估后，EAGLE检测到25个错误（TensorFlow中有18个，PyTorch中有7个），其中包括13个以前未知的错误。

## Introduction

- differential testing
    - CRADLE, Audee
    - 测试不同DL框架实现的相同功能，用于检测不一致性错误。
    - ❌至少需要2个不同的DL框架，某些功能可能只在一个DL框架内存在实现；需要high-level框架（e.g., Keras）

在TensorFlow和PyTorch测试6861对等效图，使用DocTer为每对等效图生成400组输入，

## Results

### Detected bugs

- Optimization
    - 由于complex64除法在optimization时溢出导致overflow
    
    > The annotation @tf.function on Graph 2 tells TensorFlow that the function below should be optimized. According to TensorFlow developers, this bug is caused by an overflow for complex64 divisions in the optimization.
    > 
- Data Structure Equivalence
    
<img src="/EAGLE/Untitled.png" className="img"/>    
    - Pytorch的torch.sspaddmm()的low-level function indices.data_ptr假设对张量的存储是行连续的，但torch.sspaddmm使用另一种存储方式。
    - Pytorch的torch.sspaddmm()在TensorFlow中没有直接对应的API，因此很难使用现有cross-library differential testing工具检测到这个问题。
- Data Format Equivalence

### Comparison with differential testing

- CRADLE & Audee：基于Keras实现，Keras已经不再维护。即便存在如Keras一样的high-level库，但这两种方法着重于生成full DL models作为输入，可能会missing low-level API相关bugs。e.g., Audee关注于DL layers中的实现错误，而EAGLE发现的bugs是在low-level functionalities的（such as ATen, the low-level tensor library used by PyTorch）。
- API-level differential testing：可以仅对两个库中相同实现的功能（例如，密集层和 Conv2D）进行differential testing，但某个库中存在的API可能在其他库中不存在对应实现。e.g., Figure 5在Pytorch API中存在，但在TensorFlow里没有直接对应的API。