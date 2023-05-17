---
title: 下载与安装
date: 2022-09-13
category: JDK
tag:
 - JDK
---

## 1. JDK 下载

jdk 8 下载地址：[https://www.oracle.com/java/technologies/downloads/#java8-windows](https://www.oracle.com/java/technologies/downloads/#java8-windows)

![image-20220930104131372](./imgs/image-20220930104131372.png)

## 2. JDK 安装

- 双击下载好的 `exe` 文件，进入安装程序

- 进入安装向导，点击下一步

![image-20220930104148261](./imgs/image-20220930104148261.png)

- 更改安装路径，选择安装所有组件，点击下一步

![image-20220930104159266](./imgs/image-20220930104159266.png)

- 开始安装

![image-20220930104210553](./imgs/image-20220930104210553.png)

- 安装 `jre`，可以更改 `jre` 安装路径（过程同上述安装的选择）

> 注意：如果提示需要将 `jre` 安装在一个空目录下，用自己创建一个目录即可

![image-20220930104223820](./imgs/image-20220930104223820.png)

- 点击下一步，开始安装

![image-20220930104236675](./imgs/image-20220930104236675.png)

- 结束安装

![image-20220930104250425](./imgs/image-20220930104250425.png)

## 3. JDK 配置

- 【win 10 系统】右键桌面 `此电脑` - `属性` - 打开关于页面下的 `高级系统设置`

![image-20220930104304549](./imgs/image-20220930104304549.png)

- 点击 `环境变量`

![image-20220930104318919](./imgs/image-20220930104318919.png)

- 新建一项系统变量 `JAVA_HOME`，值为 `JDK` 的安装路径

![image-20220930104331429](./imgs/image-20220930104331429.png)

- 配置系统变量：双击系统变量的 `Path`，新建添加一行内容为 `%JAVA_HOME%\bin`，之后一路确定回去

![image-20220930104344944](./imgs/image-20220930104344944.png)

![image-20220930104358965](./imgs/image-20220930104358965.png)

- 查看是否配置成功，`win + r` 打开运行窗口，输入 `cmd`，进入命令行

![image-20220930104529230](./imgs/image-20220930104529230.png)

输入 `java -version` 查看 `JDK` 版本，出现如下信息说明配置成功

![image-20220930104547675](./imgs/image-20220930104547675.png)