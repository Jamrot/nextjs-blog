---
Title: "Audee"
Tags: ["2020", "ASE", "DL framework", "Read", "differential fuzzing", "fuzzing", "numerical"]
Authors: ['Guo', 'Qianyu', 'Xie', 'Xiaofei', 'Li', 'Yi', 'Zhang', 'Xiaoyu', 'Liu', 'Yang', 'Li', 'Xiaohong', 'Shen', 'Chao']
Collections: ["patch detection ▸ DL"]
Conference: ASE
Date Added: October 26, 2023 10:41 AM (UTC)
Short Title: Audee
Full Title: "Audee: Automated Testing for Deep Learning Frameworks"
URL: https://ieeexplore.ieee.org/document/9286000
Year: 2020
code: https://sites.google.com/view/audee
---
# Audee: automated testing for deep learning frameworks

code: [https://sites.google.com/view/audee](https://sites.google.com/view/audee)

Audee基于搜索实现了结合模型structures、参数、权重以及输入的三种不同的的变异策略，可以检测logic error, crashes and NaN errors.

对于logic error，Audee采用cross-reference check来检测多个framework之间的行为不一致。对于NaN error，Audee采用基于启发式的方法来生成倾向于输出异常值（过大或过小）的深度神经网络（DNN）。此后，Audee利用基于因果测试的技术来定位导致不一致或错误的层和参数。

通过在4个DL framework（TensorFlow, PyTorch, CNTK, and Theano）上对Audee进行测试，Audee生成了涵盖4个DL framework中25个API的大量深度神经网络（DNN）。最终发现了26个独特的bugs，其中7个已经被开发者确认或修复。

## Introduction

深度学习系统通常包括3个层次：the application (e.g., DNN design), the DL framework (e.g., basic DL functionality support) and the hardware support (e.g., CUDA, CPU, and GPU). 开发者首先收集训练数据并使用DL frameworks提供的API设计深度学习网络（DNNs），此后DNN在framworks及硬件支持的基础上训练并推理。

### Challenges

（1）DL testing

1）test case. DL framework的test case包括深度神经网络（DNN）以及输入，使用现有的深度神经网络数据集无法cover all framework behaviours and may miss some bugs。

2）缺少对于logical bugs的oracle。虽然使用differential testing可以通过检测不同framwork的不一致性发现logical bugs，但无法确定其根本原因。

（2）fault localization

1）DNN层数、参数众多，难以确定是哪一层、哪个参数导致的inconsistency。

2）有问题的layer可能会影响没有问题的subsequent layers。（CRADLE使用metric去检测inconsistency degree来进行buggy layer localization，但确定degree很困难。）

→对于每层进行

<img src="/Audee/Untitled.png" className="img"/>
## Approach

<img src="/Audee/Untitled%201.png" className="img"/>
（1）变异策略

- Network-level. 变异DNN每层参数
- Input-level. 变异DNN的输入
- Weight-level. 变异DNN的权重

### Search-based DL Framework Testing

由于inputs&weights的高维特性，所以很难遍历所有的cases。→如何选择最可能触发异常的最优inputs&weights→基于Genetic Algorithm的变异策略

### Inconsistency

- layer distance

### NaN

- 作者通过逐层追踪NaN cases，发现NaN问题通常是由于outlier values引起，特别是当计算中包含特别大或特别小的值。
- NaN fitness function
    - 输出向量的最大值与最小值之差
        
<img src="/Audee/Untitled%202.png" className="img"/>        
    - 使用NaN fitness function表征某层数据分布不平衡程度（越不平衡的数据越可能触发NaN bugs）
        - 作者通过逐层追踪NaN cases，发现NaN问题通常是由于outlier values引起，特别是当计算中包含特别大或特别小的值。
            
            > In TensorFlow, it is implemented as 𝑠𝑜𝑓𝑡𝑚𝑎𝑥 (𝑥) = 𝑡𝑓.𝑒𝑥𝑝(𝑥)/𝑡𝑓.𝑟𝑒𝑑𝑢𝑐𝑒_𝑠𝑢𝑚(𝑡𝑓.𝑒𝑥𝑝(𝑥)), where 𝑥 is a numerical vector. If there is an element that is too large in 𝑥, 𝑡𝑓.𝑒𝑥𝑝 may output an inf value, which can further lead to NaN when the inf involves in some arithmetics [[43]](https://github.com/uTensor/uTensor/issues/175). Another example is the square root operation which is also common in the implementation of the DL framework. It generates a NaN output if the input contains negative elements (see the NaN bug [[47]](https://github.com/tensorflow/tensorflow/issues/38644)). Both cases can be attributed to the unbalanced numerical distribution when the inputs or weights participate in calculation.
            > 
    - 通过评估每一层的输出，以识别那些可能会在经过后续层的计算后导致数值不稳定性的极端值。
- select the logits layer to calculate the NaN fitness

### Oracles

(1) Crashes. 监测DNN载入和推理的过程中有没有异常退出

(2) NaN errors. 每层中有没有NaN输出

(3) Logical bugs. 深度学习框架之间cross-checking检查不一致性

### Fault localization

CRADLE根据change rate确定fault localization会造成FP，因为正确的layer也可能有high change rate。

Audee进行细粒度的localize-fix策略，自顶向下逐层分析change rate，如果change rate过高就尝试修复这层的问题。

### NaN bugs

- **[BatchNormalization](https://www.google.com/url?q=https%3A%2F%2Fgithub.com%2Ftensorflow%2Ftensorflow%2Fissues%2F38644&sa=D&sntz=1&usg=AOvVaw3UOCiWxaqkhGNlbfPpEMPA)** on **TensorFlow and Theano** ***Confirmed***

When executing ***BatchNormalization***, TensorFlow and Theano return NaN in some cases. This is because both two frameworks lack neceessary check for negative values before calculating square root operations in ***BatchNormalization.***

TensorFlow has confirmed this bug, and the relevant source code for Theano is shown in the following picture.

[https://lh6.googleusercontent.com/y4ru56jhlCemZJDXLSDn76-IQF0Omh5foxBJ-xh7PnDGh6ZV49RvbOjFoGtSZ5U4cVtBvO5xBIZursIq30lSt--F2G8XTXJrvyD6QWZWGfX5Bftu=w1280](https://lh6.googleusercontent.com/y4ru56jhlCemZJDXLSDn76-IQF0Omh5foxBJ-xh7PnDGh6ZV49RvbOjFoGtSZ5U4cVtBvO5xBIZursIq30lSt--F2G8XTXJrvyD6QWZWGfX5Bftu=w1280)

- **[ReLU](https://www.google.com/url?q=https%3A%2F%2Fgithub.com%2Ftensorflow%2Ftensorflow%2Fissues%2F38640&sa=D&sntz=1&usg=AOvVaw1TVDk-IKQI0RLvA5HdMKDm)***(threshold=None) on TensorFlow* ***[Confirmed and Fixed](https://www.google.com/url?q=https%3A%2F%2Fgithub.com%2Ftensorflow%2Ftensorflow%2Fcommit%2F3db8df8ffafe5bcd83a12b92bc4c8287cd80237f&sa=D&sntz=1&usg=AOvVaw2Ca5ulGvbFzzhHb-_wROjv)***

TensorFlow lacks necessary exception check for floating-point parameters. In case of abnormal values like None, it directly convert them to NaN, which affects the subsequent calculation.  TensorFlow has confirmed and fixed this issue as follows.

[https://lh4.googleusercontent.com/kOysWpW9hsf8aXGez5Qz1YKjXXhz8kT3sf8c1Thqf1nNo_lUQhCp5d5bThhfXDTrsXU8mYXkRRqgd2WWN0QJa5Fxz658UXWZSOm7t4duDUGBuCF1=w1280](https://lh4.googleusercontent.com/kOysWpW9hsf8aXGez5Qz1YKjXXhz8kT3sf8c1Thqf1nNo_lUQhCp5d5bThhfXDTrsXU8mYXkRRqgd2WWN0QJa5Fxz658UXWZSOm7t4duDUGBuCF1=w1280)

- **[LeakyReLU](https://www.google.com/url?q=https%3A%2F%2Fgithub.com%2Fkeras-team%2Fkeras%2Fissues%2F13787&sa=D&sntz=1&usg=AOvVaw358U9nbBP9O7gePqcgFqS8)***(alpha=None)* on TensorFlow ***Confirmed***

Similar to the **ReLU** bug mentioned above. That is, TensorFlow directly converts the ***None***-value to NaN for the floating-point parameter ***alpha*** in **LeakyReLU**.

- **[AvgPool2d](https://www.google.com/url?q=https%3A%2F%2Fgithub.com%2Fpytorch%2Fpytorch%2Fissues%2F36977&sa=D&sntz=1&usg=AOvVaw2FsMrQ09TEY9A4zndI_0o-)** on PyTorch ***Confirmed***

Under ***ceil_mode=True*** for ***AvgPool2d***, PyTorch may choose the pools out of the image in some cases and further lead to division-by-zero, which finally triggers NaN output.

- **Dense/Conv/LSTM/GRU/SimpleRNN** on **Tensorflow**, **CNTK**, and **Theano**

Using **exponential** activation in some APIs (e.g., **Conv2D, Dense**) can easily lead to infinity output and trigger NaN when using the infinity value in further calculations. Figure1 shows a NaN example caused by the layer ***SimpleRNN*** with the parameter ***activation=exp*** on TensorFlow.

[https://lh5.googleusercontent.com/CIvkWrIYvI417njf4eEdoueK27zqU5lh7akvMIK_-cjl7N-gP8j5IHRC_kPllW_DMLHQysdTO8rQJIVRKMKZu-22gzNzH9tn4aKk45dlaFhuQFMX=w1280](https://lh5.googleusercontent.com/CIvkWrIYvI417njf4eEdoueK27zqU5lh7akvMIK_-cjl7N-gP8j5IHRC_kPllW_DMLHQysdTO8rQJIVRKMKZu-22gzNzH9tn4aKk45dlaFhuQFMX=w1280)

Figure 1. NaN example on ***SimpleRNN*** with the parameter ***activation=exp*** on TensorFlow

[https://lh3.googleusercontent.com/5EluQ4dkzDmfC-Bg61VHbShFyQPWnoe58t1ygjp5ihshDEF2zUMsDTz8NpCLl1dzrfdMyN7URLgq84N5Mw45ZgFxPg0M63uKiSreBX0LZDP1_V7-=w1280](https://lh3.googleusercontent.com/5EluQ4dkzDmfC-Bg61VHbShFyQPWnoe58t1ygjp5ihshDEF2zUMsDTz8NpCLl1dzrfdMyN7URLgq84N5Mw45ZgFxPg0M63uKiSreBX0LZDP1_V7-=w1280)

Figure 2.   Keras implementation of ***dilation_rate*** for **SeprableConv2D/DepthwiseConv2D** on CNTK backend

### confirmed or fixed bugs

- CNTK. 2020. CNTK has supporting issues with GRU(unroll=true). [https://github.com/microsoft/CNTK/issues/3800](https://github.com/microsoft/CNTK/issues/3800)
- Keras. 2020. Keras has supporting issues with GRU (unroll=true) on the CNTK backend. [https://github.com/keras-team/keras/issues/13852](https://github.com/keras-team/keras/issues/13852)
- Pytorch. 2020. AvgPool: Ensure all cells are valid in ceil mode. [https://github.com/pytorch/pytorch/pull/41368](https://github.com/pytorch/pytorch/pull/41368)
- TensorFlow. 2020. Checking if Kernel_size=0 in conv2d and reports error accordingly. [https://github.com/tensorflow/tensorflow/pull/37395](https://github.com/tensorflow/tensorflow/pull/37395)
- TensorFlow. 2020. The fix of corner cases for the value None processing. [https://github.com/tensorflow/tensorflow/commit/3db8df8ffafe5bcd83a12b92bc4c8287cd80237f](https://github.com/tensorflow/tensorflow/commit/3db8df8ffafe5bcd83a12b92bc4c8287cd80237f)
- TensorFlow. 2020. The fix of missing check for the unreasonable parameter input_dim=0 in the layer Embedding. [https://github.com/tensorflow/tensorflow/commit/f61175812426009a4c96e51befb2951612990903](https://github.com/tensorflow/tensorflow/commit/f61175812426009a4c96e51befb2951612990903)
- TensorFlow. 2020. The output of BatchNormalization may contain Nan under certain parameters. [https://github.com/tensorflow/tensorflow/issues/38644](https://github.com/tensorflow/tensorflow/issues/38644)
- TensorFlow. 2020. Tensorflow can build and even run a model with Conv2D kerne_size=0. [https://github.com/tensorflow/tensorflow/issues/37334](https://github.com/tensorflow/tensorflow/issues/37334)
- Theano. 2020. Theano lacks a check for unreasonable parameters like dilation_rate=0 in Conv2D or DepthwiseConv2D. [https://github.com/Theano/Theano/issues/6745](https://github.com/Theano/Theano/issues/6745)

### All 26 bugs

[https://sites.google.com/view/audee](https://sites.google.com/view/audee)

## Related Work

- An empirical study towards characterizing deep learning development and deployment across different frameworks and platforms. ASE 2019.
- An empirical study on TensorFlow program bugs. ISSTA 2018.
- Taxonomy of Real Faults in Deep Learning Systems. arxiv 2019.
- Tensorfuzz: Debugging neural networks with coverage-guided fuzzing. arxiv 2018.

---

- 如何检测logical bugs？
    - 通过differential fuzzing
- 如何检测NaN error？
    - TensorFuzz: 通过生成”surprising” input data触发NaN bugs
    - Audee: 基于搜索生成unbalanced distributed values（分布不平衡的值）
- 导致logical bugs/NaN error的root cause都是什么？
    - corner cases handling. e.g., TensorFlow和Theano在BatchNormalization中使用sqrt时没有保证所有输入都positive，造成NaN bug。
    - logical implementation. e.g., Pytorch仅在设置了填充选项时才进行（池化单元在图像某一维度上是从图像内部开始的）条件检查，但在没有设置填充选项时也可能出现池化单元超出图像边界的问题，造成NaN bug。
    - overflow/underflow
- Audee检测NaN error的缺陷在于什么？通过这种基于搜索生成unbalanced distributed values有什么缺点？
    - 生成DNN模型+参数（input+weight），覆盖率问题。【静态分析可以解决这个问题吗？】
    - NaN问题一定是unbalanced distributed values可以触发的吗？
- Audee search-based和heuristic-based是什么意思？
- “Note that, neither of TensorFuzz and Audee can detect NaNs on some DNNs (e.g., the RNN models) and frameworks (e.g., PyTorch), thus we ignore them in Table 3.” (Guo et al., 2021, p. 494) (pdf)