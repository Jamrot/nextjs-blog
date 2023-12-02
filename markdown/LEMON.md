---
Title: "LEMON"
Tags: ["2020", "DL framework", "ESEC/FSE", "Read", "differential fuzzing"]
Authors: ['Wang', 'Zan', 'Yan', 'Ming', 'Chen', 'Junjie', 'Liu', 'Shuang', 'Zhang', 'Dongdi']
Collections: ["patch detection ▸ DL"]
Created time: November 30, 2023 4:26 PM
Conference: ESEC/FSE
Date Added: November 16, 2023 4:07 PM (UTC)
Short Title: LEMON
Text: 对已有DL模型变异的基础上进行differential fuzzing，检测到crash, inconsistency, NaN & Keras performance bug (caused by memory leak)。
Full Title: "Deep learning library testing via effective model generation"
URL: https://dl.acm.org/doi/10.1145/3368089.3409761
Year: 2020
code: https://github.com/Jacob-yen/LEMON
---
# Deep learning library testing via effective model generation

code: https://github.com/Jacob-yen/LEMON

LEMON（1）针对DL模型的变异规则，用于探索库代码的不同调用序列和难以触发的行为。（2）提出启发式策略指导模型生成过程向放大 不同DL libraries由于bugs导致的不一致行为 的程度的方向进行，用于减轻由DL库的不确定因素引入的噪声。

对四个DL库（TensorFlow、Theano、CNTK、MXNet）的20个发布版本进行了实证研究。结果表明，LEMON在这些库的最新发布版本中检测到了24个新错误，其中7个错误已得到确认，1个错误已被开发者修复。此外，结果还证实了模型生成的启发式策略确实有效地指导LEMON放大了错误的不一致程度。

## Introduction

<img src="/LEMON/Untitled.png" className="img"/>
## Approach

<img src="/LEMON/Untitled%201.png" className="img"/>
## Results

<img src="/LEMON/Untitled%202.png" className="img"/>
### Crash Bugs

> the crash bug is due to the wrong shape inference of the transpose operator in MXNet, whose fix is shown in Figure 4.
The buggy transpose operator only relies on the input tensor for shape inference, causing to throw the exception message: łCheck failed: shp.ndim()==param.axes.ndim() (-1 vs 4)ž, even if the model is valid. The fixed transpose operator uses both the input tensor and output tensor and thus is able to infer all unknown dimension sizes based on these tensors.
> 

<img src="/LEMON/Untitled%203.png" className="img"/>
MXNet中`transpose`操作符的形状推断不正确【还是不懂】

- `transpose`操作符是用于改变张量（Tensor）的形状的一个函数。在出现错误的版本中，`transpose`操作符只依赖于输入张量来推断形状，导致即使模型是有效的，也会抛出错误消息："Check failed: shp.ndim() == param.axes.ndim() (-1 vs 4)"。这意味着形状（shape）的维度数（ndim）和参数（param）中的轴（axes）的维度数不一致。
- 在修复后的版本中，`transpose`操作符使用了输入张量和输出张量来进行形状推断。因此，它能够基于这些张量推断出所有未知的维度大小，从而解决了这个问题。

### Inconsistency

- BatchNormalization layer, i.e., wrong values of the variables moving_mean and moving_var.

### NaN

- the root cause of this NaN bug lies in the BatchNormalization layer of Theano.
- the root cause of this NaN bug is in the interface (i.e., predict) between Keras and MXNet

> Actually, directly obtaining the prediction result (used in LEMON) and obtaining the prediction result by getting the output of each layer are two equivalent ways but uses different Keras interfaces. The former calls the interface predict while the latter calls the output attribute of each layer. Moreover, the former outputs NaN while the output of the latter is normal. We infer that the root cause of this NaN bug is in the interface (i.e., predict) between Keras and MXNet
> 

### Performance

- clone_model and set_weights time spent on each single call becomes longer.

> clone_model and set_weights take about 4 seconds and 3 seconds in the first iteration, and the time grows to about 34 seconds and 4 minutes, respectively, in the 50th iteration. By a detailed observation, we find that the bug is caused by **memory leak**
>