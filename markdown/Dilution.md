---
Title: "Dilution"
Tags: ["Read", "logic bug", "star"]
Authors: ['Chen', 'Yi', 'Xing', 'Luyi', 'Qin', 'Yue', 'Liao', 'Xiaojing', 'Wang', 'XiaoFeng', 'Chen', 'Kai', 'Zou', 'Wei']
Collections: ["patch detection ▸ logic bug"]
Conference: USENIX Security
Date Added: September 15, 2023 7:00 AM (UTC)
Short Title: Dilution
Text: 通过对第三方支付文档和联合支付文档支付流程、可见信息、安全要求分析检测逻辑漏洞。
Full Title: "Devils in the Guidance: Predicting Logic Vulnerabilities in Payment Syndication Services through Automated Documentation Analysis"
URL: https://www.usenix.org/conference/usenixsecurity19/presentation/chen-yi
Year: 2019
code: https://github.com/ccy1991911/Dilution
---
# Devils in the Guidance: Predicting Logic Vulnerabilities in Payment Syndication Services through Automated Documentation Analysis

code: [https://github.com/ccy1991911/Dilution](https://github.com/ccy1991911/Dilution)

Video: [https://www.bilibili.com/video/BV1ty4y1r7US](https://www.bilibili.com/video/BV1ty4y1r7US/?share_source=copy_web&vd_source=0f5d1c82f4f77fab2b47d0454a0b811a)

Documentation

- 系统安全目标
- 设计缺陷：文档中所述与安全目标之间的冲突
- 在联合支付（统一接口 wrapper）设计层面引入的逻辑漏洞：wapper导致安全检查难以进行，或没有提供足够的instructions指导开发者进行正确的安全检查。
    - e.g., 单独的支付服务文档里要求验证A，但联合支付文档里没有要求验证A。

Devils in the Guidance: Predicting Logic Vulnerabilities in Payment Syndication Services through Automated Documentation Analysis

- syndication service
- 

<img src="/Dilution/Untitled.png" className="img"/>