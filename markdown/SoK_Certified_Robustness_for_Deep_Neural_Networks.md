---
Title: "SoK: Certified Robustness for Deep Neural Networks"
Tags: ["2023", "DL model", "Oakland", "Read", "survey"]
Authors: ['Li', 'Linyi', 'Xie', 'Tao', 'Li', 'Bo']
Collections: ["patch detection ▸ DL"]
Created time: November 21, 2023 1:29 PM
Conference: Oakland
Date Added: November 4, 2023 2:17 PM (UTC)
Text: certifiability robust方法，鲁棒性验证、鲁棒性训练综述
Full Title: "SoK: Certified Robustness for Deep Neural Networks"
URL: https://ieeexplore.ieee.org/abstract/document/10179303
Year: 2023
---
针对DNN对抗性攻击的防御方法：1）经验防御，2）可证明的鲁棒方法，包括鲁棒性验证，

介绍关于certifiably robust方法，1）提供鲁棒性验证和训练方法的分类方法，2）揭示这些方法的特点、优势、缺点及联系，3）讨论现有研究进展、theoretical barriers、主要挑战以及未来发展方向，4）提供含有20+certifiably robust方法的开源平台。

### robust verification

鲁棒性验证是指验证一个模型在面对对抗性攻击时的性能。对抗性攻击是指在输入数据中故意加入微小的、通常难以察觉的扰动，这些扰动能够欺骗模型做出错误的预测。

鲁棒性训练（Robust Training）是一种旨在提高深度神经网络（DNNs）对抗性攻击鲁棒性的训练方法。在对抗性攻击中，攻击者会故意对输入数据进行微小的修改，以误导模型做出错误的预测。鲁棒性训练的目标是通过训练过程增强模型的鲁棒性，使其能够在面对这类攻击时保持较高的性能。