---
Title: "CONCORD"
Tags: ["2023", "ISSTA", "Read", "code clone"]
Authors: ['Ding', 'Yangruibo', 'Chakraborty', 'Saikat', 'Buratti', 'Luca', 'Pujar', 'Saurabh', 'Morari', 'Alessandro', 'Kaiser', 'Gail', 'Ray', 'Baishakhi']
Collections: ["patch detection ▸ DL"]
Conference: ISSTA
Date Added: October 23, 2023 8:29 AM (UTC)
Short Title: CONCORD
Text: 考虑代码克隆影响的自监督预训练策略，可以更有效地确认语义相同的程序以及区分错误代码。
Full Title: "CONCORD: Clone-aware Contrastive Learning for Source Code"
URL: http://arxiv.org/abs/2306.03234
Year: 2023
---
自监督预训练策略，考虑代码克隆的影响，区分良性克隆和有害克隆。降低对预训练资源的需要，提高下游软件工程任务的表现。可以改进现有预训练模型，以学习更好的知识，可以更有效地确认*语义相同的程序*以及*区分错误代码*。

- semantic clone dataset: CodeXGLUE-POJ104 [57, 61] and CodeNetJava250
- bug dataset: REVEAL (RV) [12], D2A [78], and CodeXGLUE-Devign (CXG-DV) [57, 79]

<img src="/CONCORD/Untitled.png" className="img"/>