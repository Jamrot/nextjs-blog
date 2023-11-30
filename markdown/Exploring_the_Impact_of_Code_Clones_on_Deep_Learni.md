---
Title: "Exploring the Impact of Code Clones on Deep Learning Software"
Tags: ["2023", "TOSEM", "code clone", "star"]
Authors: ['Mo', 'Ran', 'Zhang', 'Yao', 'Wang', 'Yushuo', 'Zhang', 'Siyuan', 'Xiong', 'Pu', 'Li', 'Zengyang', 'Zhao', 'Yang']
Collections: ["patch detection ▸ DL"]
Date Added: October 23, 2023 8:24 AM (UTC)
Full Title: "Exploring the Impact of Code Clones on Deep Learning Software"
URL: https://doi.org/10.1145/3607181
Year: 2023
code: https://codeclonedl.github.io/datasets.com
---
- Md. Johirul Islam, Giang Nguyen, Rangeet Pan, and Hridesh Rajan. 2019. A comprehensive study on deep learning bug characteristics. In Proceedings of the ACM Joint Meeting on European Software Engineering Conference and Symposium on the Foundations of Software Engineering (ESEC/SIGSOFT FSE’19), Marlon Dumas, Dietmar Pfahl, Sven Apel, and Alessandra Russo (Eds.). ACM, 510–520. DOI:[https://doi.org/10.1145/3338906.3338955](https://doi.org/10.1145/3338906.3338955)
- Yuhao Zhang, Yifan Chen, Shing-Chi Cheung, Yingfei Xiong, and Lu Zhang. 2018. An empirical study on TensorFlow program bugs. In Proceedings of the 27th ACM SIGSOFT International Symposium on Software Testing and Analysis (ISSTA’18), Frank Tip and Eric Bodden (Eds.). ACM, 129–140. DOI:[https://doi.org/10.1145/3213846.3213866](https://doi.org/10.1145/3213846.3213866)
- Zhenpeng Chen, Huihan Yao, Yiling Lou, Yanbin Cao, Yuanqiang Liu, Haoyu Wang, and Xuanzhe Liu. 2021. An Empirical Study on Deployment Faults of Deep Learning Based Mobile Applications. IEEE Press, 674–685. [https://doi](https://doi/). org/10.1109/ICSE43902.2021.00068
- Li Jia, Hao Zhong, Xiaoyin Wang, Linpeng Huang, and Xuansheng Lu. 2020. An empirical study on bugs inside TensorFlow. In Proceedings of the 25th International Conference on Database Systems for Advanced Applications. SpringerVerlag, Berlin, 604–620. DOI:[https://doi.org/10.1007/978-3-030-59410-7_40](https://doi.org/10.1007/978-3-030-59410-7_40)

---

code：[https://codeclonedl.github.io/datasets.com/](https://codeclonedl.github.io/datasets.com/)

- Code Clones：
    1. 除了空格或注释以外完全相同
    2. renamed clone. 相似语法，但变量、常量、函数名字不同
    3. gap clone. 在2基础上增加、删除或者修改statements
- Co-changed Code Clone：如果原有代码进行修改，被克隆的代码需要与原有代码进行同样修改(consistently change)。

检测真实的co-changed clone，并统计是否这样co-changed clone更容易引入bug。