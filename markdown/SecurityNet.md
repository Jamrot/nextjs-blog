---
Title: "SecurityNet"
Tags: ["2024", "DL model", "Read", "USENIX Security"]
Authors: ['Zhang', 'Boyang', 'Li', 'Zheng', 'Yang', 'Ziqing', 'He', 'Xinlei', 'Backes', 'Michael', 'Fritz', 'Mario', 'Zhang', 'Yang']
Collections: ["patch detection ▸ DL"]
Conference: USENIX Security
Date Added: November 11, 2023 5:14 AM (UTC)
Short Title: SecurityNet
Text: 对公开模型进行攻击/防御测试（模型窃取攻击、成员推理攻击、后门攻击）
Full Title: "SecurityNet: Assessing Machine Learning Vulnerabilities on Public Models"
URL: http://arxiv.org/abs/2310.12665
Year: 2024
code: https://github.com/SecurityNetResearch/SecurityNet
---
# SECURITYNET: Assessing Machine Learning Vulnerabilities on Public Models

code: [https://github.com/SecurityNetResearch/SecurityNet](https://github.com/SecurityNetResearch/SecurityNet)

现有工作证明机器学习模型存在安全和隐私漏洞，但目前针对机器学习模型漏洞的评估大多在自己训练的模型上进行。而作者认为，要全面了解机器学习模型的漏洞，应该对大量出于各种目的训练的模型进行实验。因此，作者提出对来自互联网的权重公开的模型进行攻击与防御的评估，建立了SecurityNet数据集，包括910个含有注释的图像分类模型。并分析了集中有代表性的攻击/防御的有效性，包括模型窃取攻击、成员推理攻击以及后门攻击。实验表明，与自训练模型相比，这些攻击/防御在公共模型上存在显著差异。

模型窃取攻击：试图构建一个替代模型来模仿目标模型的行为；

成员资格推断攻击：旨在确定某个样本是否被用于训练目标模型；

后门检测：识别并阻止在模型训练过程中植入的潜在恶意行为或功能。

- **模型窃取攻击**：实验结果显示，在SECURITYNET中的基准模型上进行模型窃取攻击时，使用更大和更复杂的替代模型架构并不能改善攻击性能，这与先前的结果不同。此外，攻击性能与受害模型的目标任务性能呈现负相关。对于过于复杂的目标模型（如拥有1.45亿参数的RegNetY-320模型），模型窃取攻击效果不佳。安全和隐私研究中训练的公开模型（安全模型）通常在其目标任务上的表现比基准模型差。有趣的是，对于表现不佳的安全模型，攻击性能与目标任务性能呈正相关，这与基准模型上的观察结果相反。
- **成员资格推断攻击**：实验结果表明，攻击性能与受害模型的过拟合程度呈正相关。此外，一些在实验数据集上表现良好的方法，并不能保证在更复杂的数据集上有类似的表现。对于安全模型和基准模型的比较显示，低性能的安全模型在相似的过拟合水平下对成员资格推断攻击的反应与高性能的安全模型和基准模型有所不同，低性能的安全模型似乎对该攻击更不敏感。
- **后门检测**：在后门检测方面，使用输入过滤方法（例如STRIP和NEO）进行的实验显示这些方法在低误报率方面有效。没有任何模型被检测出含有后门。这进一步表明这些方法有效地避免了过度检测。此外，这些方法的计算成本也显著低于Neural Cleanse，使得它们能够在现实世界中部署。作者还指出，后门检测方法的资源需求或运行时间也应在开发检测方法时考虑进去。