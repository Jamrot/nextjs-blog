---
Title: "Toward Understanding Deep Learning Framework Bugs"
Tags: ["DL framework", "star", "survey"]
Authors: ['Chen', 'Junjie', 'Liang', 'Yihua', 'Shen', 'Qingchao', 'Jiang', 'Jiajun', 'Li', 'Shuochuan']
Collections: ["patch detection ▸ DL"]
Conference: TOSEM
Date Added: October 30, 2023 8:41 AM (UTC)
Full Title: "Toward Understanding Deep Learning Framework Bugs"
URL: https://dl.acm.org/doi/10.1145/3587155
Year: 2023
---
- DL models
- DL programs, used for training DL models
    
    通常使用更高级的编程语言（如Python）编写，主要是调用底层框架的API来搭建和训练模型。这一层更关注模型的结构和训练逻辑，而不需要关心底层的数学运算是如何执行的。
    
- DL framework, used for implementing DL programs
    
    通常是用更底层的语言（如C/C++）编写的，以实现高性能的数学运算和张量操作。这一层也负责如何高效地在CPU或GPU上运行这些运算。
    

- model-based
- API-based

## DL program

## DL framework

<img src="/Toward_Understanding_Deep_Learning_Framework_Bugs/Untitled.png" className="img"/>
## dataset

<img src="/Toward_Understanding_Deep_Learning_Framework_Bugs/Untitled%201.png" className="img"/>
[https://github.com/DLFrameworkBug/DLFrameworkBugsData](https://github.com/DLFrameworkBug/DLFrameworkBugsData)

## Root Cause - 13

- type issue. 分为tensor type issue和traditional data type issue
- tensor shape misalignment. 在shape-related操作中，tensor shape不匹配。
- incorrect algorithm implementation. 有问题的算法实现逻辑，而不是缺少实现。
    - e.g., getBroadcastPositions() 在将Torch的mm操作转换为ONNX的Gemm操作时，方法输出应当满足`position < node->inputs().size()`，但buggy code没有进行检查，造成错误输出结果。
    - 确保position值有效，防止越界访问。
    
<img src="/Toward_Understanding_Deep_Learning_Framework_Bugs/Untitled%202.png" className="img"/>    
- environment incompatibility.

## Reference

- Md Johirul Islam, Giang Nguyen, Rangeet Pan, and Hridesh Rajan. 2019. A comprehensive study on deep learning bug characteristics. In Proceedings of the 2019 27th ACM Joint Meeting on European Software Engineering Conference and Symposium on the Foundations of Software Engineering. 510–520.
- Qingchao Shen, Haoyang Ma, Junjie Chen, Yongqiang Tian, Shing-Chi Cheung, and Xiang Chen. 2021. A comprehensive study of deep learning compiler bugs. In Proceedings of the 29th ACM Joint European Software Engineering Conference and Symposium on the Foundations of Software Engineering.toappear